import React, { useState, useEffect, useRef } from 'react';
// Initialize Firebase once app mounts; safe to tree-shake unused exports
import { db, auth, firestore } from './services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import StatManager from './services/statManager.js';
import BuddyMatchingService from './services/buddyMatchingService.js';
import FirestoreBuddyService from './services/firestoreBuddyService.js';
import FirestoreBehavioralService from './services/firestoreBehavioralService.js';
import CentralizedStatService from './services/centralizedStatService.js';
import useSwipeToDismiss from './hooks/useSwipeToDismiss.js';

// Debug: Check if FirestoreBuddyService is imported correctly
console.log('🧪 FirestoreBuddyService import check:', !!FirestoreBuddyService);
console.log('🧪 FirestoreBuddyService type:', typeof FirestoreBuddyService);
console.log('🧪 FirestoreBuddyService constructor:', FirestoreBuddyService?.name);

import AuthScreen from './components/AuthScreen';
import OfflineIndicator from './components/OfflineIndicator';
import BreathingModal from './components/BreathingModal';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import { Users, Zap, Trophy, Target, Heart, DollarSign, Calendar, Star, Shield, Sword, Home, User, Settings, Sparkles, ArrowRight, RefreshCw } from 'lucide-react';

// Avatar generation utility with fallback
const generateAvatar = (seed, style = 'adventurer') => {
  // Using DiceBear API for reliable avatar generation
  const baseUrl = 'https://api.dicebear.com/7.x';
  const options = {
    seed: seed || Math.random().toString(36).substring(7),
    backgroundColor: ['b6e3f4', 'c0aede', 'ffdfbf', 'ffd5dc'],
    radius: 50,
    size: 200
  };
  
  const queryParams = new URLSearchParams(options).toString();
  return `${baseUrl}/${style}/svg?${queryParams}`;
};

// Fallback avatar generation using local SVG
const generateFallbackAvatar = (seed) => {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
  const color = colors[seed.charCodeAt(0) % colors.length];
  const initials = seed.substring(0, 2).toUpperCase();
  
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="${color}"/>
      <text x="100" y="120" font-family="Arial, sans-serif" font-size="80" font-weight="bold" text-anchor="middle" fill="white">${initials}</text>
    </svg>
  `)}`;
};

// Function to get colors based on confidence level
const getConfidenceColor = (confidence) => {
  if (confidence <= 3) {
    return '#ef4444'; // Red for low confidence
  } else if (confidence <= 6) {
    return '#fbbf24'; // Yellow for medium confidence
  } else if (confidence <= 9) {
    return '#84cc16'; // Greenish for high confidence
  } else {
    return '#22c55e'; // Green for maximum confidence
  }
};

// Helper function to calculate streak with hours/days logic
const calculateStreak = (startDate, endDate = new Date()) => {
  const timeDiff = endDate.getTime() - startDate.getTime();
  const hours = Math.floor(timeDiff / (1000 * 3600));
  const days = Math.floor(timeDiff / (1000 * 3600 * 24));
  
  if (hours < 24) {
    // Show hours for first 24 hours
    return {
      value: Math.max(0, hours),
      unit: 'hours',
      displayText: `${Math.max(0, hours)} hour${hours === 1 ? '' : 's'}`
    };
  } else {
    // Show days after 24 hours
    return {
      value: Math.max(0, days),
      unit: 'days', 
      displayText: `${Math.max(0, days)} day${days === 1 ? '' : 's'}`
    };
  }
};

// Onboarding Flow Component
const OnboardingFlow = ({ onComplete, authUser, pwaInstallAvailable, promptInstall }) => {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    heroName: '',
    archetype: '',
    avatar: null,
    avatarSeed: Math.random().toString(36).substring(7),
    // New fields for enhanced stats calculation
    triggers: [],
    dailyPatterns: [],
    copingStrategies: [],
    vapePodsPerWeek: 0,
    nicotineStrength: '',
    quitAttempts: '',
    confidence: 5
  });
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const archetypeOptions = [
    { id: 'DETERMINED', name: 'The Determined', description: 'Unstoppable willpower and determination', color: 'bg-red-500', icon: Shield },
    { id: 'SOCIAL_FIGHTER', name: 'The Social Fighter', description: 'Thrives on community support', color: 'bg-blue-500', icon: Users },
    { id: 'HEALTH_WARRIOR', name: 'The Health Warrior', description: 'Focused on physical and mental wellness', color: 'bg-green-500', icon: Heart },
    { id: 'MONEY_SAVER', name: 'The Money Saver', description: 'Motivated by financial freedom', color: 'bg-yellow-500', icon: DollarSign }
  ];

  // New options for enhanced onboarding
  const triggerOptions = [
    'Stress/anxiety',
    'Social situations',
    'Boredom',
    'After meals',
    'Drinking alcohol',
    'Work breaks',
    'Driving'
  ];

  const dailyPatternOptions = [
    'Morning routine',
    'Work breaks',
    'After meals',
    'Evening wind-down',
    'Social events',
    'Throughout the day'
  ];

  const copingStrategyOptions = [
    'Breathing exercises',
    'Nicotine replacement therapy',
    'Exercise/physical activity',
    'Distraction techniques',
    'Nothing - this is new to me'
  ];

  // Enhanced stat calculation algorithm
  const calculateInitialStats = () => {
    console.log('Calculating stats with userData:', userData);
    
    // ADDICTION (Scale 30-100)
    let addictionScore = 40; // Base

    // Pods per week
    if (userData.vapePodsPerWeek <= 1) addictionScore += 5;
    else if (userData.vapePodsPerWeek <= 3) addictionScore += 15;
    else if (userData.vapePodsPerWeek <= 5) addictionScore += 25;
    else if (userData.vapePodsPerWeek <= 7) addictionScore += 35;
    else addictionScore += 40;

    // Nicotine strength - extract number from "3mg" format
    const nicotineStr = userData.nicotineStrength || '';
    const nicotine = parseInt(nicotineStr.replace('mg', '')) || 0;
    if (nicotine <= 5) addictionScore += 0;
    else if (nicotine <= 11) addictionScore += 10;
    else if (nicotine <= 20) addictionScore += 20;
    else addictionScore += 25;

    // Daily pattern
    if (userData.dailyPatterns.includes("Throughout the day")) addictionScore += 20;
    else if (userData.dailyPatterns.length > 2) addictionScore += 10;
    else addictionScore += 0;

    addictionScore = Math.min(addictionScore, 100);

    // MENTAL STRENGTH (Scale 10-80)
    let mentalScore = 25; // Base

    // Confidence level
    if (userData.confidence >= 9) mentalScore += 35;
    else if (userData.confidence >= 7) mentalScore += 25;
    else if (userData.confidence >= 4) mentalScore += 15;
    else mentalScore += 0;

    // Previous attempts
    if (userData.quitAttempts === "first") mentalScore += 15;
    else if (parseInt(userData.quitAttempts) <= 3) mentalScore += 10;
    else mentalScore += 5;

    // Coping strategies
    if (userData.copingStrategies.length >= 3) mentalScore += 15;
    else if (userData.copingStrategies.length >= 1) mentalScore += 10;
    else mentalScore += 0;

    mentalScore = Math.min(mentalScore, 80);

    // MOTIVATION (Scale 20-90)
    let motivationScore = 35; // Base

    // Archetype bonus
    const archetypeBonus = {
      "DETERMINED": 20,
      "HEALTH_WARRIOR": 15,
      "SOCIAL_FIGHTER": 15,
      "MONEY_SAVER": 10
    };
    motivationScore += archetypeBonus[userData.archetype] || 0;

    // Confidence level
    if (userData.confidence >= 8) motivationScore += 25;
    else if (userData.confidence >= 5) motivationScore += 15;
    else motivationScore += 0;

    // Previous attempts pattern
    if (userData.quitAttempts === "first") motivationScore += 10;
    else if (parseInt(userData.quitAttempts) <= 3) motivationScore += 5;
    else motivationScore += 15;

    motivationScore = Math.min(motivationScore, 90);

    // TRIGGER DEFENSE (Scale 5-60)
    let triggerScore = 15; // Base

    // Number of triggers
    if (userData.triggers.length <= 2) triggerScore += 15;
    else if (userData.triggers.length <= 4) triggerScore += 10;
    else triggerScore += 5;

    // Trigger complexity
    const hasAlcohol = userData.triggers.includes("Drinking alcohol");
    const hasSocial = userData.triggers.includes("Social situations");
    if (hasAlcohol && hasSocial) triggerScore += 0; // High-risk combo
    else if (userData.triggers.length > 3) triggerScore += 5; // Mixed categories
    else triggerScore += 10; // Single category

    // Coping experience
    if (userData.copingStrategies.length >= 3) triggerScore += 25;
    else if (userData.copingStrategies.length >= 1) triggerScore += 15;
    else triggerScore += 0;

    // Daily routine spread
    if (userData.dailyPatterns.includes("Throughout the day")) triggerScore += 0;
    else if (userData.dailyPatterns.length > 2) triggerScore += 5;
    else triggerScore += 10;

    triggerScore = Math.min(triggerScore, 60);

    return {
      addictionLevel: addictionScore,
      mentalStrength: mentalScore,
      motivation: motivationScore,
      triggerDefense: triggerScore
    };
  };

  // Photo capture and processing
  const handlePhotoCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPhotoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const processPhotoToAnime = async () => {
    if (!photoFile) return;
    
    setIsProcessingPhoto(true);
    
    try {
      // Try AI-powered photo-to-anime conversion (using a reliable API)
      // For now, we'll use a combination of filters and styling
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = 200;
        canvas.height = 200;
        
        // Apply anime-style filters
        ctx.filter = 'contrast(1.2) saturate(1.3) brightness(1.1)';
        ctx.drawImage(img, 0, 0, 200, 200);
        
        // Add anime-style effects
        ctx.globalCompositeOperation = 'overlay';
        ctx.fillStyle = 'rgba(255, 200, 200, 0.1)';
        ctx.fillRect(0, 0, 200, 200);
        
        // Convert to data URL
        const animeAvatar = canvas.toDataURL('image/png');
        const newData = { ...userData, avatar: animeAvatar };
        setUserData(newData);
        // Save to Firebase when photo is processed
        saveOnboardingStep(newData, 3);
        setIsProcessingPhoto(false);
      };
      
      img.src = photoPreview;
    } catch (error) {
      console.error('Photo processing failed:', error);
      // Fallback to generated avatar
      const fallbackAvatar = generateFallbackAvatar(userData.avatarSeed);
      setUserData(prev => ({ ...prev, avatar: fallbackAvatar }));
      setIsProcessingPhoto(false);
    }
  };

  const generateNewAvatar = () => {
    setIsGeneratingAvatar(true);
    const newSeed = Math.random().toString(36).substring(7);
    
    // Try DiceBear first, with fallback
    const tryDicebear = async () => {
      try {
        const avatar = generateAvatar(newSeed);
        const newData = {
          ...userData,
          avatarSeed: newSeed,
          avatar: avatar
        };
        setUserData(newData);
        // Save to Firebase when avatar is generated
        saveOnboardingStep(newData, 3);
      } catch (error) {
        // Fallback to local generation
        const fallbackAvatar = generateFallbackAvatar(newSeed);
        const newData = {
          ...userData,
          avatarSeed: newSeed,
          avatar: fallbackAvatar
        };
        setUserData(newData);
        // Save to Firebase when fallback avatar is generated
        saveOnboardingStep(newData, 3);
      }
    };
    
    tryDicebear();
    setTimeout(() => setIsGeneratingAvatar(false), 500);
  };



  const handleNext = async () => {
    if (step < 10) { // Updated to 10 steps
      // Save current step data to Firebase before moving to next step
      await saveOnboardingStep(userData, step);
      setStep(step + 1);
    } else {
      // Complete onboarding with calculated stats
      try {
        console.log('Completing onboarding with userData:', userData);
        const stats = calculateInitialStats();
        console.log('Calculated stats:', stats);
        
        const finalUserData = {
          ...userData,
          stats: {
            ...stats,
            streakDays: 0,
            experiencePoints: 0
          },
          achievements: [],
          quitDate: new Date() // Set quit date to now - streak starts at 0
        };
        
        // Save final step data to Firebase
        await saveOnboardingStep(finalUserData, 10);
        
        console.log('Final user data:', finalUserData);
        onComplete(finalUserData);
      } catch (error) {
        console.error('Error completing onboarding:', error);
        // Fallback stats if calculation fails
        const fallbackStats = {
          addictionLevel: 50,
          mentalStrength: 50,
          motivation: 50,
          triggerDefense: 30
        };
        
        const finalUserData = {
          ...userData,
          stats: {
            ...fallbackStats,
            streakDays: 0,
            experiencePoints: 0
          },
          achievements: [],
          quitDate: new Date() // Set quit date to now - streak starts at 0
        };
        
        // Try to save fallback data to Firebase
        try {
          await saveOnboardingStep(finalUserData, 10);
        } catch (firebaseError) {
          console.error('Failed to save fallback data to Firebase:', firebaseError);
        }
        
        console.log('Using fallback stats:', finalUserData);
        onComplete(finalUserData);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return userData.heroName.trim().length > 0;
      case 2: return userData.archetype !== '';
      case 3: return userData.avatar !== null;
      case 4: return userData.triggers.length > 0;
      case 5: return userData.dailyPatterns.length > 0;
      case 6: return userData.copingStrategies.length > 0;
      case 7: return userData.vapePodsPerWeek > 0;
      case 8: return userData.nicotineStrength !== '';
      case 9: return userData.quitAttempts !== '';
      case 10: return userData.confidence > 0;
      default: return false;
    }
  };

  // Function to save onboarding data to Firebase
  const saveOnboardingStep = async (stepData, stepNumber) => {
    if (!authUser) return; // Only save if user is authenticated
    
    try {
      const { ref, set } = await import('firebase/database');
      const userRef = ref(db, `users/${authUser.uid}/onboarding`);
      
      // Save the current step data
      await set(ref(db, `users/${authUser.uid}/onboarding/step${stepNumber}`), {
        ...stepData,
        stepNumber,
        timestamp: Date.now()
      });
      
      // Also save to a general onboarding progress
      await set(ref(db, `users/${authUser.uid}/onboarding/progress`), {
        currentStep: stepNumber,
        completedSteps: Array.from({ length: stepNumber }, (_, i) => i + 1),
        lastUpdated: Date.now()
      });
      
      console.log(`Step ${stepNumber} saved to Firebase successfully`);
    } catch (error) {
      console.error(`Error saving step ${stepNumber} to Firebase:`, error);
      // Continue with onboarding even if Firebase save fails
    }
  };

  // Generate initial avatar on mount
  useEffect(() => {
    if (!userData.avatar) {
      // Try DiceBear first, fallback to local generation
      const dicebearAvatar = generateAvatar(userData.avatarSeed);
      setUserData(prev => ({
        ...prev,
        avatar: dicebearAvatar
      }));
    }
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full shadow-2xl border border-slate-700">
        {pwaInstallAvailable && (
          <div className="mb-4 p-3 rounded-lg border border-blue-600 bg-blue-900/40 text-blue-100 flex items-center justify-between">
            <div className="mr-3">Install QuitArena for a faster, full-screen experience.</div>
            <button
              onClick={promptInstall}
              className="px-4 py-3 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold min-h-[44px] min-w-[44px]"
            >
              Install
            </button>
          </div>
        )}
        {/* Progress Bar */}
        <div className="flex justify-between items-center mb-8 overflow-x-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center flex-shrink-0">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                stepNumber <= step ? 'bg-blue-500 text-white' : 'bg-slate-600 text-gray-400'
              }`}>
                {stepNumber < step ? '✓' : stepNumber}
              </div>
              {stepNumber < 10 && (
                <div className={`w-4 h-1 mx-1 ${
                  stepNumber < step ? 'bg-blue-500' : 'bg-slate-600'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        {step === 1 && (
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Welcome to QuitCard Arena</h1>
            <p className="text-gray-300 mb-6">Your journey to freedom starts here. Let's create your hero identity.</p>
            
            <div className="mb-6">
              <label className="block text-left text-white text-sm font-medium mb-2">
                What's your hero name?
              </label>
              <input
                type="text"
                value={userData.heroName}
                onChange={(e) => {
                  const newData = { ...userData, heroName: e.target.value };
                  setUserData(newData);
                  // Save to Firebase when user types
                  if (e.target.value.trim().length > 0) {
                    saveOnboardingStep(newData, 1);
                  }
                }}
                placeholder="e.g., FreedomSeeker, HealthGuardian"
                autoComplete="name"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Choose Your Archetype</h1>
            <p className="text-gray-300 mb-6">Select the warrior type that resonates with your journey.</p>
            
            <div className="space-y-3 mb-6">
              {archetypeOptions.map((archetype) => {
                const IconComponent = archetype.icon;
                return (
                  <button
                    key={archetype.id}
                    onClick={() => {
                      const newData = { ...userData, archetype: archetype.id };
                      setUserData(newData);
                      // Save to Firebase immediately when archetype is selected
                      saveOnboardingStep(newData, 2);
                    }}
                    className={`w-full p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                      userData.archetype === archetype.id
                        ? 'border-blue-500 bg-blue-500/20'
                        : 'border-slate-600 bg-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${archetype.color} rounded-lg flex items-center justify-center`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{archetype.name}</h3>
                        <p className="text-gray-400 text-sm">{archetype.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Create Your Avatar</h1>
            <p className="text-gray-300 mb-6">Choose your battle card identity in the arena.</p>
            
            <div className="mb-6">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-slate-600 bg-slate-700">
                {userData.avatar ? (
                  <img 
                    src={userData.avatar} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                    onError={() => {
                      // Fallback to generated avatar if image fails to load
                      setUserData(prev => ({
                        ...prev,
                        avatar: generateFallbackAvatar(prev.avatarSeed)
                      }));
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                {/* Photo Upload Option */}
                <div className="mb-4">
                  <label className="block text-white text-sm font-medium mb-2">
                    Upload Your Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoCapture}
                    className="hidden"
                    id="photo-upload"
                    autoComplete="photo"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2 justify-center cursor-pointer"
                  >
                    📷 Upload Photo
                  </label>
                </div>
                
                {photoPreview && (
                  <div className="mb-4">
                    <button
                      onClick={processPhotoToAnime}
                      disabled={isProcessingPhoto}
                      className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white rounded-lg transition-colors flex items-center gap-2 justify-center"
                    >
                      {isProcessingPhoto ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Converting to Anime...
                        </>
                      ) : (
                        <>
                          ✨ Convert to Anime
                        </>
                      )}
                    </button>
                  </div>
                )}
                
                <div className="text-gray-400 text-sm">- OR -</div>
                
                <button
                  onClick={generateNewAvatar}
                  disabled={isGeneratingAvatar}
                  className="w-full px-6 py-3 bg-slate-600 hover:bg-slate-500 disabled:bg-slate-700 text-white rounded-lg transition-colors flex items-center gap-2 justify-center"
                >
                  {isGeneratingAvatar ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Generate Random Avatar
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Generate Random Avatar
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => {
                    const fallbackAvatar = generateFallbackAvatar(userData.avatarSeed);
                    const newData = { ...userData, avatar: fallbackAvatar };
                    setUserData(newData);
                    // Save to Firebase when fallback avatar is selected
                    saveOnboardingStep(newData, 3);
                  }}
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Use Fallback Avatar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Trigger Identification */}
        {step === 4 && (
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🎯</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Trigger Identification</h1>
            <p className="text-gray-300 mb-6">What usually makes you want to vape? (Select all that apply)</p>
            
            <div className="space-y-3 mb-6">
              {triggerOptions.map((trigger) => (
                <button
                  key={trigger}
                  onClick={() => {
                    const newData = {
                      ...userData,
                      triggers: userData.triggers.includes(trigger)
                        ? userData.triggers.filter(t => t !== trigger)
                        : [...userData.triggers, trigger]
                    };
                    setUserData(newData);
                    // Save to Firebase when triggers are updated
                    saveOnboardingStep(newData, 4);
                  }}
                  className={`w-full p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                    userData.triggers.includes(trigger)
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-slate-600 bg-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                      userData.triggers.includes(trigger) ? 'bg-blue-500 border-blue-500' : 'border-gray-400'
                    }`}>
                      {userData.triggers.includes(trigger) && <span className="text-white text-sm">✓</span>}
                    </div>
                    <span className="text-white font-semibold">{trigger}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Daily Routine */}
        {step === 5 && (
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">📅</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Daily Routine</h1>
            <p className="text-gray-300 mb-6">When do you vape most? (Select all that apply)</p>
            
            <div className="space-y-3 mb-6">
              {dailyPatternOptions.map((pattern) => (
                <button
                  key={pattern}
                  onClick={() => {
                    const newData = {
                      ...userData,
                      dailyPatterns: userData.dailyPatterns.includes(pattern)
                        ? userData.dailyPatterns.filter(p => p !== pattern)
                        : [...userData.dailyPatterns, pattern]
                    };
                    setUserData(newData);
                    // Save to Firebase when daily patterns are updated
                    saveOnboardingStep(newData, 5);
                  }}
                  className={`w-full p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                    userData.dailyPatterns.includes(pattern)
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-slate-600 bg-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                      userData.dailyPatterns.includes(pattern) ? 'bg-blue-500 border-blue-500' : 'border-gray-400'
                    }`}>
                      {userData.dailyPatterns.includes(pattern) && <span className="text-white text-sm">✓</span>}
                    </div>
                    <span className="text-white font-semibold">{pattern}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Coping Experience */}
        {step === 6 && (
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🛡️</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Coping Experience</h1>
            <p className="text-gray-300 mb-6">Have you tried any of these strategies before? (Select all that apply)</p>
            
            <div className="space-y-3 mb-6">
              {copingStrategyOptions.map((strategy) => (
                <button
                  key={strategy}
                  onClick={() => {
                    const newData = {
                      ...userData,
                      copingStrategies: userData.copingStrategies.includes(strategy)
                        ? userData.copingStrategies.filter(s => s !== strategy)
                        : [...userData.copingStrategies, strategy]
                    };
                    setUserData(newData);
                    // Save to Firebase when coping strategies are updated
                    saveOnboardingStep(newData, 6);
                  }}
                  className={`w-full p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                    userData.copingStrategies.includes(strategy)
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-slate-600 bg-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                      userData.copingStrategies.includes(strategy) ? 'bg-blue-500 border-blue-500' : 'border-gray-400'
                    }`}>
                      {userData.copingStrategies.includes(strategy) && <span className="text-white text-sm">✓</span>}
                    </div>
                    <span className="text-white font-semibold">{strategy}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 7: Vape Usage */}
        {step === 7 && (
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🚬</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Vape Usage</h1>
            <p className="text-gray-300 mb-6">How many vape pods do you typically use per week?</p>
            
            <div className="mb-6">
              <select
                value={userData.vapePodsPerWeek}
                onChange={(e) => {
                  const newData = { ...userData, vapePodsPerWeek: parseFloat(e.target.value) || 0 };
                  setUserData(newData);
                  // Save to Firebase when vape usage is selected
                  if (newData.vapePodsPerWeek > 0) {
                    saveOnboardingStep(newData, 7);
                  }
                }}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select pods per week</option>
                <option value="0.5">0.5 pods</option>
                <option value="1">1 pod</option>
                <option value="2">2 pods</option>
                <option value="3">3 pods</option>
                <option value="4">4 pods</option>
                <option value="5">5 pods</option>
                <option value="6">6 pods</option>
                <option value="7">7 pods</option>
                <option value="8">8+ pods</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 8: Nicotine Strength */}
        {step === 8 && (
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">⚡</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Nicotine Strength</h1>
            <p className="text-gray-300 mb-6">What nicotine strength do you typically use?</p>
            
            <div className="mb-6">
              <select
                value={userData.nicotineStrength}
                onChange={(e) => {
                  const newData = { ...userData, nicotineStrength: e.target.value };
                  setUserData(newData);
                  // Save to Firebase when nicotine strength is selected
                  if (newData.nicotineStrength) {
                    saveOnboardingStep(newData, 8);
                  }
                }}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select nicotine strength</option>
                <option value="3mg">3mg</option>
                <option value="6mg">6mg</option>
                <option value="12mg">12mg</option>
                <option value="18mg">18mg</option>
                <option value="20mg">20mg</option>
                <option value="50mg">50mg</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 9: Previous Attempts */}
        {step === 9 && (
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">📚</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Previous Attempts</h1>
            <p className="text-gray-300 mb-6">How many times have you tried to quit before?</p>
            
            <div className="mb-6">
              <select
                value={userData.quitAttempts}
                onChange={(e) => {
                  const newData = { ...userData, quitAttempts: e.target.value };
                  setUserData(newData);
                  // Save to Firebase when quit attempts is selected
                  if (newData.quitAttempts) {
                    saveOnboardingStep(newData, 9);
                  }
                }}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select option</option>
                <option value="first">This is my first attempt</option>
                <option value="1">Once before</option>
                <option value="2">Twice before</option>
                <option value="3">3-5 times</option>
                <option value="5">More than 5 times</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 10: Confidence Level */}
        {step === 10 && (
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🎯</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Confidence Level</h1>
            <p className="text-gray-300 mb-6">How confident are you this time? (1-10 scale)</p>
            
            <div className="mb-6">
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-sm">1</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={userData.confidence}
                  onChange={(e) => {
                    const newData = { ...userData, confidence: parseInt(e.target.value) };
                    setUserData(newData);
                    // Save to Firebase when confidence level changes
                    saveOnboardingStep(newData, 10);
                  }}
                  className="flex-1 h-2 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, ${getConfidenceColor(userData.confidence)} 0%, ${getConfidenceColor(userData.confidence)} ${(userData.confidence / 10) * 100}%, #475569 ${(userData.confidence / 10) * 100}%, #475569 100%)`
                  }}
                  autoComplete="off"
                />
                <span className="text-gray-400 text-sm">10</span>
              </div>
                              <div className="text-center mt-4">
                  <span 
                    className="font-bold text-4xl" 
                    style={{ color: getConfidenceColor(userData.confidence) }}
                  >
                    {userData.confidence}
                  </span>
                  <span className="text-gray-400 text-lg ml-2">/ 10</span>
                </div>
                              <div className="text-center mt-2">
                  <span 
                    className="text-sm font-medium"
                    style={{ color: getConfidenceColor(userData.confidence) }}
                  >
                    {userData.confidence <= 3 ? 'You can do this! 💪' :
                     userData.confidence <= 6 ? 'Good confidence! 🎯' :
                     userData.confidence <= 9 ? 'Great confidence! 🚀' :
                     'Excellent confidence! 🌟'}
                  </span>
                </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
            >
              Back
            </button>
          )}
          
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`ml-auto px-6 py-3 rounded-lg transition-colors flex items-center gap-2 ${
              canProceed()
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-slate-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            {step === 10 ? 'Start Journey' : 'Next'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Core data structures
const ARCHETYPES = {
  DETERMINED: { name: 'The Determined', color: 'bg-red-500', icon: Shield },
  SOCIAL_FIGHTER: { name: 'The Social Fighter', color: 'bg-blue-500', icon: Users },
  HEALTH_WARRIOR: { name: 'The Health Warrior', color: 'bg-green-500', icon: Heart },
  MONEY_SAVER: { name: 'The Money Saver', color: 'bg-yellow-500', icon: DollarSign }
};

const RARITIES = {
  COMMON: { name: 'Common', color: 'border-gray-400', glow: '', days: 0 },
  UNCOMMON: { name: 'Uncommon', color: 'border-gray-300', glow: 'shadow-lg', days: 7 },
  RARE: { name: 'Rare', color: 'border-yellow-400', glow: 'shadow-yellow-400/50 shadow-lg', days: 14 },
  EPIC: { name: 'Epic', color: 'border-purple-400', glow: 'shadow-purple-400/50 shadow-xl', days: 30 },
  LEGENDARY: { name: 'Legendary', color: 'border-orange-400', glow: 'shadow-orange-400/50 shadow-2xl animate-pulse', days: 90 }
};

const ACHIEVEMENTS = {
  WEEK_WARRIOR: { name: 'Week Warrior', icon: Calendar, description: '7 days clean' },
  MONTH_MASTER: { name: 'Month Master', icon: Trophy, description: '30 days clean' },
  LEGEND: { name: 'Legend', icon: Star, description: '90 days clean' }
};

// Special Features categorized by onboarding response types
const SPECIAL_FEATURES = {
  // Trigger identification responses (yellowish tint)
  triggers: [
    'Stress Vaper', 'Social Smoker', 'Coffee Companion', 'Work Breaker',
    'Gaming Buddy', 'Party Animal', 'Peer Pressure', 'Celebration Trigger',
    'Anxiety Soother', 'Focus Enhancer', 'Boredom Fighter', 'Emotional Support'
  ],
  // Daily routine responses (orangish tint)
  dailyPatterns: [
    'Night Owl', 'Morning Struggler', 'Weekend Warrior', 'Routine Builder',
    'Habit Former', 'Work Breaker', 'Coffee Companion', 'Party Animal'
  ],
  // Coping experience responses (bluish tint)
  copingStrategies: [
    'First Timer', 'Veteran Quitter', 'Cold Turkey', 'Gradual Reduction',
    'Stress Reliever', 'Mood Stabilizer', 'Reward Seeker', 'Social Lubricant'
  ]
};

const calculateRarity = (streakDays) => {
  if (streakDays >= 90) return 'LEGENDARY';
  if (streakDays >= 30) return 'EPIC';
  if (streakDays >= 14) return 'RARE';
  if (streakDays >= 7) return 'UNCOMMON';
  return 'COMMON';
};

// Info Modal Component for Stat Explanations
const InfoModal = ({ isOpen, onClose, statType }) => {
  if (!isOpen) return null;

  const statInfo = {
    addiction: {
      title: "Addiction",
      description: "Your body's dependence level - decreases with clean time, increases with relapses",
      impacts: [
        "What decreases it:",
        "• Clean time: -2 points per week",
        "",
        "What increases it:",
        "• First relapse (after clean period): +4 points",
        "• Second relapse (within 7 days): +6 additional points",
        "• Third relapse and on (within 3 days): +8 additional points",
        "",
        "Note: Escalation level resets after 7 clean days"
      ]
    },
    mentalStrength: {
      title: "Mental Strength",
      description: "Your ability to resist urges and stay strong",
      impacts: [
        "What increases it:",
        "• Successful craving resistance: +1 point",
        "• Using app during cravings every 3 times with no relapse: +1 point",
        "• Completing breathing exercises 3 days straight: +1 point",
        "• Staying hydrated for 3 days straight: +1 point",
        "• Milestone bonuses: First 7 days +5 points, 30 days +10 points, 90 days +15 points",
        "",
        "What decreases it:",
        "• Giving in to cravings: -3 points",
        "• Each relapse: -3 points"
      ]
    },
    motivation: {
      title: "Motivation",
      description: "Your drive to quit - boosted by staying engaged",
      impacts: [
        "What increases it:",
        "• Regular logging (3+ days per week): +2 points (weekly)",
        "• Sharing achievements: +3 points per share (weekly)",
        
        "",
        "What decreases it:",
        "• Long periods inactive (7+ days no logging): -3 points"
      ]
    },
    triggerDefense: {
      title: "Trigger Defense",
      description: "Protection against your personal vaping triggers",
      impacts: [
        "What increases it:",
        "• Surviving trigger situations without vaping: +3 points",
        "• Pre-planning for known triggers: +1 point",
        "• Updating your trigger list: +1 point",
        "",
        "What decreases it:",
        "• Relapsing to known triggers: -3 points",
        "• Entering trigger situations unprepared: -1 point"
      ]
    }
  };

  const info = statInfo[statType];
  if (!info) return null;

  return (
    <div className="modal-backdrop">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="modal-container">
        <div className="modal-content bg-slate-800 border-slate-700">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-white mb-2">{info.title}</h3>
          <p className="text-gray-300 text-sm">{info.description}</p>
        </div>
        
        <div className="mb-6">
          <h4 className="text-white font-semibold mb-3 text-left">What impacts it:</h4>
          <ul className="space-y-2 text-left">
            {info.impacts.map((impact, index) => (
              <li key={index} className="text-gray-300 text-sm flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                {impact}
              </li>
            ))}
          </ul>
        </div>
        
        <button
          onClick={onClose}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all duration-300 min-h-[44px]"
        >
          Got it
        </button>
        </div>
      </div>
    </div>
  );
};

// Enhanced StatBar Component with Info Button (read-only) - Enforces 100-point cap
const StatBar = ({ label, value, max, color, statType, onInfoClick }) => {
  // Ensure value never exceeds max (100-point cap)
  const cappedValue = Math.min(value, max);
  
  return (
    <div className="mb-0.5 sm:mb-1">
      <div className="flex justify-between text-white text-xs mb-1">
        <div className="flex items-center gap-1">
          <span className="text-xs sm:text-xs">{label}</span>
          {statType && onInfoClick && (
            <button
              onClick={() => onInfoClick(statType)}
              className="info-button w-0.5 h-0.5 sm:w-1 sm:h-1 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ fontSize: '4px' }}
              title={`Learn about ${label}`}
            >
              i
            </button>
          )}
        </div>
        <span className="text-xs">{cappedValue}/{max}</span>
      </div>
      <div className="stat-bar-interactive w-full bg-gray-700 rounded-full h-1.5 sm:h-2">
        <div 
          className={`${color} h-1.5 sm:h-2 rounded-full transition-all duration-500`} 
          style={{ width: `${(cappedValue / max) * 100}%` }}
        />
      </div>
    </div>
  );
};
// Trading Card Component
const TradingCard = ({ user, isNemesis = false, showComparison = false, nemesisUser = null, onInfoClick }) => {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [currentStatType, setCurrentStatType] = useState(null);
  const [userSpecialFeatures, setUserSpecialFeatures] = useState([]);
  const [userSpecialFeatureCategories, setUserSpecialFeatureCategories] = useState({});

  // Load special features when user data changes - ALWAYS call this hook
  useEffect(() => {
    let isCancelled = false;
    const loadSpecialFeatures = async () => {
      try {
        console.log('🔄 TradingCard: Loading Special Features for user:', user?.heroName, 'uid:', user?.uid);
        console.log('🔄 TradingCard: User has specialFeatures:', !!user?.specialFeatures);
        console.log('🔄 TradingCard: User has triggers:', user?.triggers);
        console.log('🔄 TradingCard: User has dailyPatterns:', user?.dailyPatterns);
        console.log('🔄 TradingCard: User has copingStrategies:', user?.copingStrategies);
        
        if (user && user.uid) {
          // Check if user already has Special Features loaded
          if (user.specialFeatures) {
            console.log('✅ TradingCard: Using pre-loaded Special Features');
            if (!isCancelled) {
              // Handle both old format (array) and new format (object with features and categories)
              if (Array.isArray(user.specialFeatures)) {
                setUserSpecialFeatures(user.specialFeatures);
                setUserSpecialFeatureCategories({});
              } else if (user.specialFeatures && user.specialFeatures.features) {
                setUserSpecialFeatures(user.specialFeatures.features);
                setUserSpecialFeatureCategories(user.specialFeatures.categories || {});
              } else {
                setUserSpecialFeatures([]);
                setUserSpecialFeatureCategories({});
              }
            }
          } else {
            console.log('🔄 TradingCard: Generating new Special Features');
            // Generate Special Features if not already available
            const featuresData = await getPersonalizedFeatures(user);
            console.log('✅ TradingCard: Generated features:', featuresData);
            if (!isCancelled) {
              // Handle both old format (array) and new format (object with features and categories)
              if (Array.isArray(featuresData)) {
                setUserSpecialFeatures(featuresData);
                setUserSpecialFeatureCategories({});
              } else if (featuresData && featuresData.features) {
                setUserSpecialFeatures(featuresData.features);
                setUserSpecialFeatureCategories(featuresData.categories || {});
              } else {
                setUserSpecialFeatures([]);
                setUserSpecialFeatureCategories({});
              }
            }
          }
        } else {
          console.log('⚠️ TradingCard: No user or uid, setting empty features');
          // Fallback to empty list when user missing
          if (!isCancelled) {
            setUserSpecialFeatures([]);
            setUserSpecialFeatureCategories({});
          }
        }
      } catch (error) {
        console.error('❌ TradingCard: Error loading Special Features:', error);
        if (!isCancelled) {
          setUserSpecialFeatures([]);
          setUserSpecialFeatureCategories({});
        }
      }
    };
    loadSpecialFeatures();
    return () => {
      isCancelled = true;
    };
  }, [user?.uid, user?.specialFeatures, user?.triggers, user?.dailyPatterns, user?.copingStrategies]);

  // Handle empty nemesis (no buddy matched yet)
  if (user.isEmpty) {
    return (
      <div className="w-80 h-[520px] bg-slate-800 rounded-xl border-2 border-slate-600 p-4 text-white text-center mx-auto flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl text-slate-400">🔍</span>
          </div>
          <h3 className="text-slate-300 text-lg font-semibold mb-2">Looking for a buddy</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            We'll find you a match soon
          </p>
        </div>
      </div>
    );
  }

  if (!user || !user.archetype || !user.stats) {
    return (
      <div className="w-80 h-[520px] bg-slate-800 rounded-xl border-2 border-gray-400 p-4 text-white text-center mx-auto flex items-center justify-center">
        <div className="animate-pulse">Loading Card...</div>
      </div>
    );
  }

  const archetype = ARCHETYPES[user.archetype];
  if (!archetype) {
    console.error('Invalid archetype:', user.archetype, 'Available:', Object.keys(ARCHETYPES));
    return (
      <div className="w-80 h-[520px] bg-slate-800 rounded-xl border-2 border-red-400 p-4 text-white text-center mx-auto flex items-center justify-center">
        <div>
          <h3 className="text-red-400 mb-2">Invalid Archetype</h3>
          <p className="text-gray-300 text-sm">{user.archetype}</p>
        </div>
      </div>
    );
  }
  
  const rarity = RARITIES[calculateRarity(user.stats.streakDays)];
  const ArchetypeIcon = archetype.icon;
  
  // Debug logging for TradingCard (reduced to prevent infinite loops)
  console.log('🎯 TradingCard: Received user object:', user?.heroName);
  console.log('🎯 TradingCard: User stats:', user?.stats);
  console.log('🎯 TradingCard: User stats.cravingsResisted:', user?.stats?.cravingsResisted);
  console.log('🎯 TradingCard: User stats.streakDisplayText:', user?.stats?.streakDisplayText);
  console.log('🎯 TradingCard: User stats.streakDays:', user?.stats?.streakDays);
  
  // Generate and store personalized special features based on onboarding responses
  async function getPersonalizedFeatures(user) {
    // If this is a buddy/nemesis user, load their centralized Special Features
    if (user?.isRealBuddy) {
      console.log('🔄 TradingCard: Loading centralized Special Features for buddy:', user.heroName);
      try {
        const { ref, get } = await import('firebase/database');
        const statsRef = ref(db, `users/${user.uid}/stats`);
        const snapshot = await get(statsRef);
        
        if (snapshot.exists()) {
          const stats = snapshot.val();
          if (stats.specialFeatures && Array.isArray(stats.specialFeatures)) {
            console.log('✅ TradingCard: Using centralized Special Features for buddy:', stats.specialFeatures);
            return stats.specialFeatures;
          }
        }
        
        // Fallback: Try legacy specialFeatures location
        const legacyRef = ref(db, `users/${user.uid}/specialFeatures`);
        const legacySnapshot = await get(legacyRef);
        if (legacySnapshot.exists()) {
          const features = legacySnapshot.val();
          console.log('✅ TradingCard: Using legacy Special Features for buddy:', features);
          return features;
        }
      } catch (error) {
        console.warn('⚠️ TradingCard: Could not load centralized Special Features for buddy:', error.message);
      }
      
      // Fallback: Use placeholder features
      console.log('🔄 TradingCard: Generating placeholder features for buddy:', user.heroName);
      return ['Freedom Chaser', 'Nicotine Fighter', 'Health Seeker', 'Willpower Warrior'];
    }
    
    // Check if features are already stored in Firebase for this user
    let storedFeatures = null;
    
    if (user.uid) {
      try {
        const { ref, get } = await import('firebase/database');
        const userRef = ref(db, `users/${user.uid}/specialFeatures`);
        const snapshot = await get(userRef);
        
        if (snapshot.exists()) {
          storedFeatures = snapshot.val();
        }
      } catch (error) {
        console.error('Error fetching special features from Firebase:', error);
      }
    }
    
    // Fallback to localStorage if Firebase fails
    if (!storedFeatures) {
      const storedFeaturesKey = `specialFeatures_${user.heroName || user.id || 'default'}`;
      const localFeatures = localStorage.getItem(storedFeaturesKey);
      if (localFeatures) {
        storedFeatures = JSON.parse(localFeatures);
      }
    }
    
    if (storedFeatures) {
      // Handle both old format (array) and new format (object with features and categories)
      if (Array.isArray(storedFeatures)) {
        return storedFeatures; // Return old format for backward compatibility
      } else if (storedFeatures && storedFeatures.features) {
        return storedFeatures; // Return new format with categories
      }
    }
    
    // Generate new features based on onboarding responses with categorization
    const features = [];
    const featureCategories = {};
    
    // Map trigger identification answers to features (yellowish tint)
    if (user.triggers && user.triggers.length > 0) {
      user.triggers.forEach(trigger => {
        let feature = '';
        switch(trigger) {
          case 'Stress/anxiety':
            feature = 'Stress Vaper';
            break;
          case 'Social situations':
            feature = 'Social Vaper';
            break;
          case 'Boredom':
            feature = 'Boredom Fighter';
            break;
          case 'After meals':
            feature = 'Habit Former';
            break;
          case 'Drinking alcohol':
            feature = 'Party Animal';
            break;
          case 'Work breaks':
            feature = 'Work Breaker';
            break;
          case 'Driving':
            feature = 'Driving Vaper';
            break;
          default:
            feature = 'Trigger Aware';
        }
        if (feature && !features.includes(feature)) {
          features.push(feature);
          featureCategories[feature] = 'triggers';
        }
      });
    }
    
    // Map daily routine answers to features (orangish tint)
    if (user.dailyPatterns && user.dailyPatterns.length > 0) {
      user.dailyPatterns.forEach(pattern => {
        let feature = '';
        switch(pattern) {
          case 'Morning routine':
            feature = 'Morning Struggler';
            break;
          case 'Evening wind-down':
            feature = 'Night Owl';
            break;
          case 'Throughout the day':
            feature = 'All-Day Warrior';
            break;
          default:
            feature = 'Routine Builder';
        }
        if (feature && !features.includes(feature)) {
          features.push(feature);
          featureCategories[feature] = 'dailyPatterns';
        }
      });
    }
    
    // Map coping experience answers to features (bluish tint)
    if (user.copingStrategies && user.copingStrategies.length > 0) {
      if (user.copingStrategies.includes('Nothing - this is new to me')) {
        features.push('First Timer');
        featureCategories['First Timer'] = 'copingStrategies';
      } else if (user.copingStrategies.length > 2) {
        features.push('Veteran Quitter');
        featureCategories['Veteran Quitter'] = 'copingStrategies';
      } else {
        features.push('Cold Turkey');
        featureCategories['Cold Turkey'] = 'copingStrategies';
      }
    }
    
    // If we don't have enough personalized features, add some generic ones
    while (features.length < 4) {
      const genericFeatures = [
        { name: 'Nicotine Fighter', category: 'copingStrategies' },
        { name: 'Health Seeker', category: 'copingStrategies' },
        { name: 'Freedom Chaser', category: 'copingStrategies' },
        { name: 'Willpower Warrior', category: 'copingStrategies' }
      ];
      const randomFeature = genericFeatures[Math.floor(Math.random() * genericFeatures.length)];
      if (!features.includes(randomFeature.name)) {
        features.push(randomFeature.name);
        featureCategories[randomFeature.name] = randomFeature.category;
      }
    }
    
    const finalFeatures = features.slice(0, 4);
    const finalFeatureCategories = {};
    finalFeatures.forEach(feature => {
      finalFeatureCategories[feature] = featureCategories[feature] || 'copingStrategies';
    });
    
    // Store features with categories in Firebase if user is authenticated
    const featuresWithCategories = {
      features: finalFeatures,
      categories: finalFeatureCategories
    };
    
    if (user.uid) {
      try {
        const { ref, set } = await import('firebase/database');
        const userRef = ref(db, `users/${user.uid}/specialFeatures`);
        await set(userRef, featuresWithCategories);
        console.log('Special features with categories saved to Firebase successfully');
      } catch (error) {
        console.error('Error saving special features to Firebase:', error);
        // Fallback to localStorage
        const storedFeaturesKey = `specialFeatures_${user.heroName || user.id || 'default'}`;
        localStorage.setItem(storedFeaturesKey, JSON.stringify(featuresWithCategories));
      }
    } else {
      // Fallback to localStorage if no user ID
      const storedFeaturesKey = `specialFeatures_${user.heroName || user.id || 'default'}`;
      localStorage.setItem(storedFeaturesKey, JSON.stringify(finalFeatures));
    }
    
    return finalFeatures;
  }
  

  
  // Use new stat structure from enhanced onboarding
  const addictionLevel = user.stats.addictionLevel || 50;
  const mentalStrength = user.stats.mentalStrength || 50;
  const motivation = user.stats.motivation || 50;
  const triggerDefense = user.stats.triggerDefense || 30;
  const nemesisVictories = user.stats.nemesisVictories || `${Math.floor(Math.random() * 8) + 1}W-${Math.floor(Math.random() * 5) + 1}L`;
  
  const handleInfoClick = (statType) => {
    setCurrentStatType(statType);
    setShowInfoModal(true);
  };
  
  return (
    <>
      <div 
        className={`touch-card relative w-72 sm:w-80 min-h-[480px] sm:min-h-[520px] rounded-xl ${rarity.color} border-4 ${rarity.glow} bg-gradient-to-br from-slate-800 to-slate-900 p-3 sm:p-4 mx-auto`}
      >
        
        <div className="text-center mb-3">
          <h3 className="text-white font-bold text-sm sm:text-lg leading-tight break-words px-1">{user.heroName}</h3>
          <p className="text-gray-300 text-xs sm:text-base">{archetype.name}</p>
        </div>
        
        {/* Responsive avatar size */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-3 sm:mb-4 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center ring-2 ring-blue-400/50">
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt="Avatar" 
              className="w-full h-full object-cover"
              onError={() => {
                console.log('Avatar failed to load, using fallback');
              }}
            />
          ) : (
            <div className={`w-full h-full ${archetype.color} flex items-center justify-center`}>
              <ArchetypeIcon className="w-12 h-12 text-white" />
            </div>
          )}
        </div>
        
        {/* Core Stats with Info Buttons (only for player card) */}
        <div className="mb-2 sm:mb-3">
          <StatBar 
            label="Addiction" 
            value={addictionLevel} 
            max={100} 
            color="bg-red-500" 
            statType={isNemesis ? null : "addiction"}
            onInfoClick={isNemesis ? null : handleInfoClick}
          />
          <StatBar 
            label="Mental Strength" 
            value={mentalStrength} 
            max={100} 
            color="bg-blue-500" 
            statType={isNemesis ? null : "mentalStrength"}
            onInfoClick={isNemesis ? null : handleInfoClick}
          />
          <StatBar 
            label="Motivation" 
            value={motivation} 
            max={100} 
            color="bg-green-500" 
            statType={isNemesis ? null : "motivation"}
            onInfoClick={isNemesis ? null : handleInfoClick}
          />
          <StatBar 
            label="Trigger Defense" 
            value={triggerDefense} 
            max={100} 
            color="bg-orange-500" 
            statType={isNemesis ? null : "triggerDefense"}
            onInfoClick={isNemesis ? null : handleInfoClick}
          />
        </div>
        
        {/* Special Features Section */}
        <div className="mb-4">
          <h4 className="text-white text-xs font-semibold mb-2 text-center">Special Features</h4>
          <div className="flex flex-wrap gap-1 justify-center">
            {userSpecialFeatures.map((feature, index) => {
              const category = userSpecialFeatureCategories[feature] || 'copingStrategies';
              const getFeatureColor = (cat) => {
                switch(cat) {
                  case 'triggers':
                    return 'bg-yellow-500/80'; // Yellowish tint for triggers
                  case 'dailyPatterns':
                    return 'bg-orange-500/80'; // Orangish tint for daily patterns
                  case 'copingStrategies':
                  default:
                    return 'bg-blue-600/80'; // Bluish tint for coping strategies
                }
              };
              
              return (
                <div 
                  key={index} 
                  className={`px-2 py-1 ${getFeatureColor(category)} text-white text-xs rounded-full font-medium`}
                  title={`${feature} (${category})`}
                >
                  {feature}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Battle Info - Only Streak and Cravings Resisted */}
        <div className="absolute bottom-6 sm:bottom-8 left-2 sm:left-3 right-2 sm:right-3 bg-black/30 rounded-lg p-2 sm:p-3 space-y-2 sm:space-y-3 backdrop-blur-sm">
          <div className="flex justify-between text-white text-xs sm:text-sm">
            <span className="text-gray-300">Streak:</span>
            <span className="font-bold text-green-400 flex items-center gap-1">
              {(() => {
                // Use the display text if available, otherwise fallback to days format
                if (user.stats.streakDisplayText) {
                  return user.stats.streakDisplayText;
                }
                const streakValue = user.stats.streakDays;
                return `${streakValue} day${streakValue === 1 ? '' : 's'}`;
              })()}
              {user.stats.streakDays > 0 && <span className="text-xs">🔥</span>}
            </span>
          </div>
          <div className="flex justify-between text-white text-xs sm:text-sm">
            <span className="text-gray-300">Cravings Resisted:</span>
            <span className="font-bold text-blue-400 flex items-center gap-1">
              {user.stats.cravingsResisted || 0}
              <span className="text-xs">💪</span>
            </span>
          </div>

        </div>
        
        {/* Achievements */}
        {user.achievements && user.achievements.length > 0 && (
          <div className="flex flex-wrap gap-1 justify-center">
            {user.achievements.slice(0, 4).map((achievement, index) => {
              const AchIcon = ACHIEVEMENTS[achievement]?.icon || Star;
              return (
                <div key={index} className="w-5 h-5 sm:w-6 sm:h-6 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg" title={ACHIEVEMENTS[achievement]?.description}>
                  <AchIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                </div>
              );
            })}
            {user.achievements.length > 4 && (
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                +{user.achievements.length - 4}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Info Modal */}
      <InfoModal 
        isOpen={showInfoModal} 
        onClose={() => setShowInfoModal(false)} 
        statType={currentStatType} 
      />
    </>
  );
};

// Bottom Navigation Component
const BottomNavigation = ({ activeTab, onTabChange, dataLoadingState, onRefreshData, offlineManager }) => {
  const tabs = [
    { id: 'arena', label: 'Arena', icon: Home },
    { id: 'craving-support', label: 'Craving Support', icon: Shield },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Explore', icon: Settings }
  ];
  


  return (
    <>

      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 px-4 py-2 z-40">
        <div className="flex justify-around max-w-md mx-auto">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button 
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`tab-interactive flex flex-col items-center min-h-[44px] min-w-[44px] justify-center ${
                  isActive ? 'text-blue-400' : 'text-gray-400 hover:text-blue-300'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="text-xs">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
// Arena View with Enhanced Battle Algorithm and Recommendations
const ArenaView = ({ user, userStats, nemesis, onBackToLogin, onResetForTesting, buddyLoading, buddyError, realBuddy, loadRealBuddy, buddyLoadAttempted }) => {
  // Define empty nemesis for when no buddy is available
  const emptyNemesis = {
    heroName: 'Looking for a buddy',
    stats: null, // No stats needed for empty state
    achievements: [],
    archetype: '',
    avatar: null,
    isEmpty: true,
    message: 'We are looking for a suitable buddy for you'
  };
  
  // Add safety check for required props
  
  if (!user) {
    console.warn('ArenaView: user prop is undefined');
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-8 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-4">Loading User Data...</h1>
            <p>Please wait while we load your profile information.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!nemesis) {
    console.warn('ArenaView: nemesis prop is undefined');
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-8 pb-20">
        <div className="max-w-7xl mx-auto px-4">
        <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-4">Loading Nemesis Data...</h1>
            <p>Please wait while we load your nemesis information.</p>
          </div>
        </div>
      </div>
    );
  }

  const [showBattleInfo, setShowBattleInfo] = useState(false);
  const [statManager, setStatManager] = useState(null);
  const [centralizedStatService, setCentralizedStatService] = useState(null);
  
  // Mobile layout fix - ensure responsive behavior works
  useEffect(() => {
    const fixMobileLayout = () => {
      const battleContainer = document.querySelector('.battle-cards-container');
      if (battleContainer) {
        // Force mobile layout on small screens
        if (window.innerWidth < 1024) {
          battleContainer.style.flexDirection = 'column';
          battleContainer.style.gap = '1rem';
        } else {
          battleContainer.style.flexDirection = 'row';
          battleContainer.style.gap = '3rem';
        }
      }
    };
    
    // Run on mount and resize
    fixMobileLayout();
    window.addEventListener('resize', fixMobileLayout);
    
    return () => window.removeEventListener('resize', fixMobileLayout);
  }, []);

  // Ensure stats are refreshed on every page load (including soft refresh)
  useEffect(() => {
    const refreshStatsOnLoad = async () => {
      if (centralizedStatService && user) {
        try {
          console.log('🔄 App: Refreshing stats on page load for user:', user.uid);
          await centralizedStatService.refreshAllStats();
          console.log('✅ App: Stats refreshed on page load');
        } catch (error) {
          console.error('❌ App: Error refreshing stats on page load:', error);
        }
      }
    };

    // Run when centralizedStatService and user are available
    if (centralizedStatService && user) {
      refreshStatsOnLoad();
    }
  }, [centralizedStatService, user]);
  



  
  // Handle achievement sharing for Motivation bonus
  const handleAchievementShare = async () => {
    if (statManager) {
      await statManager.handleAchievementShare();
    }
  };
  
  // Calculate real-time stats based on user behavior data from Firebase
  const calculateRealTimeStats = async (user) => {
    // TEMPORARY FIX: Restore correct quit date for User 3 (created on 18/09)
    if (user?.uid === 'uGZGbLUytbfu8W3mQPW0YAvXTQn1' && (!user.quitDate || new Date(user.quitDate) > new Date('2025-09-19'))) {
      console.log('🔧 TEMPORARY FIX: Restoring correct quit date for User 3 in calculateRealTimeStats (created 18/09)');
      // Check if user has relapsed recently - if so, use relapse date as new quit date
      if (user.lastRelapseDate) {
        const relapseDate = new Date(user.lastRelapseDate);
        const originalDate = new Date('2025-09-18T13:56:46.584Z');
        // Use the more recent date (either original quit or last relapse)
        user.quitDate = relapseDate > originalDate ? user.lastRelapseDate : '2025-09-18T13:56:46.584Z';
        console.log(`🔧 TEMPORARY FIX: User 3 quit date set to ${user.quitDate} (considering relapse: ${user.lastRelapseDate})`);
      } else {
        user.quitDate = '2025-09-18T13:56:46.584Z'; // Original creation time
      }
    }
    
    // TEMPORARY FIX: Restore correct quit date for User 2 (created on 18/09)
    if (user?.uid === 'AmwwlNyHD5T3WthUbyR6bFL0QkF2' && (!user.quitDate || new Date(user.quitDate) > new Date('2025-09-19'))) {
      console.log('🔧 TEMPORARY FIX: Restoring correct quit date for User 2 in calculateRealTimeStats (created 18/09)');
      // Check if user has relapsed recently - if so, use relapse date as new quit date
      if (user.lastRelapseDate) {
        const relapseDate = new Date(user.lastRelapseDate);
        const originalDate = new Date('2025-09-18T13:56:46.584Z');
        // Use the more recent date (either original quit or last relapse)
        user.quitDate = relapseDate > originalDate ? user.lastRelapseDate : '2025-09-18T13:56:46.584Z';
        console.log(`🔧 TEMPORARY FIX: User 2 quit date set to ${user.quitDate} (considering relapse: ${user.lastRelapseDate})`);
      } else {
        user.quitDate = '2025-09-18T13:56:46.584Z'; // Original creation time
      }
    }
    
    // Start with default stats, then read fresh from Firebase
    let stats = {
      addictionLevel: 50,
      mentalStrength: 50,
      motivation: 50,
      triggerDefense: 30,
      experiencePoints: 0,
      streakDays: 0,
      cravingsResisted: 0
    };
    
    // If this is a nemesis/buddy user, use the pre-loaded real stats
    if (user?.isRealBuddy) {
      // console.log('🔄 Arena: Using pre-loaded real stats for buddy user:', user.heroName);
      // console.log('🔄 Arena: Buddy user.stats:', user.stats);
      
      // Use the pre-loaded real stats from the buddy object
      if (user.stats) {
        Object.assign(stats, user.stats);
        // console.log('🔄 Arena: Applied pre-loaded buddy stats:', stats);
      }
      
      // Calculate streak based on buddy's quit date (if available)
      if (user.quitDate) {
        const quitDate = new Date(user.quitDate);
        const streakData = calculateStreak(quitDate);
        stats.streakDays = streakData.value;
        stats.streakUnit = streakData.unit;
        stats.streakDisplayText = streakData.displayText;
        // console.log('🔄 Arena: Calculated buddy streak from quit date:', streakData.displayText);
      }
      
      // Try to get cravings resisted count (if readable)
      try {
        const { ref, get } = await import('firebase/database');
        const cravingsRef = ref(db, `users/${user.uid}/cravings`);
        const cravingsSnapshot = await get(cravingsRef);
        let totalResisted = 0;
        
        if (cravingsSnapshot.exists()) {
          cravingsSnapshot.forEach((childSnapshot) => {
            const craving = childSnapshot.val();
            if (craving.outcome === 'resisted') {
              totalResisted++;
            }
          });
          stats.cravingsResisted = totalResisted;
          console.log('🔄 Arena: Got buddy cravings resisted:', totalResisted);
        }
      } catch (cravingsError) {
        console.log('⚠️ Arena: Could not read buddy cravings, using default');
        stats.cravingsResisted = 0;
      }
      
        // console.log('🔄 Arena: Final buddy stats after processing:', stats);
      return stats;
    }
    
    if (!user?.uid) {
      // Fallback to localStorage if no user ID
      const lastRelapse = localStorage.getItem('quitCoachRelapseDate');
      if (lastRelapse) {
        const relapseDate = new Date(lastRelapse);
        const now = new Date();
        const timeDiff = now.getTime() - relapseDate.getTime();
        const daysSinceRelapse = Math.floor(timeDiff / (1000 * 3600 * 24));
        stats.streakDays = daysSinceRelapse;
        stats.streakUnit = 'days';
        stats.streakDisplayText = `${daysSinceRelapse} day${daysSinceRelapse === 1 ? '' : 's'}`;
      } else {
        const quitDate = user.quitDate ? new Date(user.quitDate) : new Date();
        const streakData = calculateStreak(quitDate);
        stats.streakDays = streakData.value;
        stats.streakUnit = streakData.unit;
        stats.streakDisplayText = streakData.displayText;
      }
      
      const cravingWins = parseInt(localStorage.getItem('cravingWins') || 0);
      stats.cravingsResisted = cravingWins;
      
      const today = new Date().toDateString();
      let hydrationStreak = 0;
      for (let i = 0; i < 7; i++) {
        const checkDate = new Date();
        checkDate.setDate(checkDate.getDate() - i);
        const checkDateStr = checkDate.toDateString();
        const waterData = localStorage.getItem(`water_${user.uid}_${checkDateStr}`);
        if (waterData && parseInt(waterData) > 0) {
          hydrationStreak++;
        } else {
          break;
        }
      }
      
      if (hydrationStreak >= 3) {
        stats.mentalStrength = Math.min(80, (stats.mentalStrength || 50) + 1);
      }
      
      return stats;
    }

    try {
      const { ref, get } = await import('firebase/database');
      
      // Calculate TOTAL cravings resisted from individual cravings data (all time, not just current week)
      const cravingsRef = ref(db, `users/${user.uid}/cravings`);
      
      try {
        const cravingsSnapshot = await get(cravingsRef);
        let totalResisted = 0;
        let totalRelapsed = 0;
        
        // console.log(`🔍 Arena: Checking cravings collection for ${user.heroName} at path: users/${user.uid}/cravings`);
        // console.log(`🔍 Arena: Cravings snapshot exists: ${cravingsSnapshot.exists()}`);
        
        if (cravingsSnapshot.exists()) {
          const cravingsData = cravingsSnapshot.val();
          // console.log(`🔍 Arena: Raw cravings data:`, cravingsData);
          
          cravingsSnapshot.forEach((childSnapshot) => {
            const craving = childSnapshot.val();
            // console.log(`🔍 Arena: Individual craving:`, craving);
            if (craving.outcome === 'resisted') {
              totalResisted++;
            } else if (craving.outcome === 'relapsed') {
              totalRelapsed++;
            }
          });
        }
        
        stats.cravingsResisted = totalResisted;
        // console.log(`💪 Arena: Calculated TOTAL cravings resisted for ${user.heroName}: ${totalResisted} (all time)`);
        
        // Also check the profile field as a backup
        const profileCravingsRef = ref(db, `users/${user.uid}/profile/cravingsResisted`);
        const profileCravingsSnapshot = await get(profileCravingsRef);
        if (profileCravingsSnapshot.exists()) {
          const profileValue = profileCravingsSnapshot.val();
          console.log(`🔍 Arena: Profile cravingsResisted field value: ${profileValue}`);
          // Use the higher value between calculated and profile
          stats.cravingsResisted = Math.max(totalResisted, profileValue);
        }
        
        // Log the final stats object being returned
        // console.log(`🔍 Arena: Final stats object for ${user.heroName}:`, stats);
      } catch (queryError) {
        console.log('Could not query cravings for Arena stats, using fallback');
        // Fallback to profile field if available
        const cravingsRef = ref(db, `users/${user.uid}/profile/cravingsResisted`);
        const cravingsSnapshot = await get(cravingsRef);
        stats.cravingsResisted = cravingsSnapshot.exists() ? cravingsSnapshot.val() : 0;
      }
      
      // Calculate current streak based on relapse date (not craving resistance)
      let currentStreak = 0;
      
      // console.log(`🔍 Arena: Starting streak calculation for ${user.heroName} (uid: ${user.uid})`);
      // console.log(`🔍 Arena: User quitDate:`, user.quitDate);
      
      // Check for relapse date first
      const relapseRef = ref(db, `users/${user.uid}/profile/relapseDate`);
      const relapseSnapshot = await get(relapseRef);
      
      // console.log(`🔍 Arena: Relapse snapshot exists:`, relapseSnapshot.exists());
      if (relapseSnapshot.exists()) {
        const relapseValue = relapseSnapshot.val();
        // console.log(`🔍 Arena: Relapse date value:`, relapseValue);
        // If there's a relapse date, calculate days since last relapse
        const relapseDate = new Date(relapseValue);
        const now = new Date();
        const timeDiff = now.getTime() - relapseDate.getTime();
        currentStreak = Math.floor(timeDiff / (1000 * 3600 * 24));
        // console.log(`🔍 Arena: Calculated streak from relapse date: ${currentStreak} days (relapse: ${relapseDate.toISOString()}, now: ${now.toISOString()})`);
      } else {
      // If no relapse date, calculate time since quit date
      const quitDate = user.quitDate ? new Date(user.quitDate) : new Date();
      const streakData = calculateStreak(quitDate);
      
      currentStreak = streakData.value;
      stats.streakUnit = streakData.unit;
      stats.streakDisplayText = streakData.displayText;
      
      console.log(`🔍 Arena: Calculated streak from quit date: ${streakData.displayText} (quit: ${quitDate.toISOString()})`);
      console.log(`🔍 Arena: Setting streak fields - streakDays: ${currentStreak}, streakUnit: ${stats.streakUnit}, streakDisplayText: ${stats.streakDisplayText}`);
    }
    
    stats.streakDays = currentStreak;
      
      // console.log(`🎯 Arena: Final calculated streak for ${user.heroName}: ${currentStreak} days`);
      
      // Calculate hydration streak from Firebase
      let hydrationStreak = 0;
      for (let i = 0; i < 7; i++) {
        const checkDate = new Date();
        checkDate.setDate(checkDate.getDate() - i);
        const checkDateStr = checkDate.toDateString();
        const waterRef = ref(db, `users/${user.uid}/profile/daily/${checkDateStr}/water`);
        const waterSnapshot = await get(waterRef);
        if (waterSnapshot.exists() && waterSnapshot.val() > 0) {
          hydrationStreak++;
        } else {
          break;
        }
      }
      
      if (hydrationStreak >= 3) {
        stats.mentalStrength = Math.min(80, (stats.mentalStrength || 50) + 1);
      }
      
    } catch (error) {
      console.error('Error fetching profile data from Firebase:', error);
      // Fallback to localStorage
      const lastRelapse = localStorage.getItem('quitCoachRelapseDate');
      if (lastRelapse) {
        const relapseDate = new Date(lastRelapse);
        const now = new Date();
        const timeDiff = now.getTime() - relapseDate.getTime();
        const daysSinceRelapse = Math.floor(timeDiff / (1000 * 3600 * 24));
        stats.streakDays = daysSinceRelapse;
        stats.streakUnit = 'days';
        stats.streakDisplayText = `${daysSinceRelapse} day${daysSinceRelapse === 1 ? '' : 's'}`;
      } else {
        const quitDate = user.quitDate ? new Date(user.quitDate) : new Date();
        const streakData = calculateStreak(quitDate);
        stats.streakDays = streakData.value;
        stats.streakUnit = streakData.unit;
        stats.streakDisplayText = streakData.displayText;
      }
      
      const cravingWins = parseInt(localStorage.getItem('cravingWins') || 0);
      stats.cravingsResisted = cravingWins;
      
      const today = new Date().toDateString();
      let hydrationStreak = 0;
      for (let i = 0; i < 7; i++) {
        const checkDate = new Date();
        checkDate.setDate(checkDate.getDate() - i);
        const checkDateStr = checkDate.toDateString();
        const waterData = localStorage.getItem(`water_${user.uid}_${checkDateStr}`);
        if (waterData && parseInt(waterData) > 0) {
          hydrationStreak++;
        } else {
          break;
        }
      }
      
      if (hydrationStreak >= 3) {
        stats.mentalStrength = Math.min(80, (stats.mentalStrength || 50) + 1);
      }
    }
    
    // For the current authenticated user (not buddies), read fresh stats from Firebase FIRST
    if (user?.uid && !user?.isRealBuddy) {
      try {
        const { ref: dbRef, get } = await import('firebase/database');
        
        // Read current stats from Firebase FIRST (before any calculations)
        // Add timestamp to force fresh read and bypass Firebase cache
        const timestamp = Date.now();
        // console.log(`🔄 Arena: Force reading fresh stats from Firebase [${timestamp}]...`);
        
        // Add delay to ensure StatManager writes are fully committed to Firebase
        await new Promise(resolve => setTimeout(resolve, 800));
        // console.log(`🔄 Arena: After 800ms delay, reading stats...`);
        
        const currentStatsSnapshot = await get(dbRef(db, `users/${user.uid}/stats`));
        if (currentStatsSnapshot.exists()) {
          const currentStats = currentStatsSnapshot.val();
          // console.log(`🔄 Arena: Reading CURRENT stats from Firebase [NEW CODE ${timestamp}]:`, currentStats);
          // Use Firebase stats as the base
          Object.assign(stats, currentStats);
          // console.log(`🔄 Arena: Using Firebase stats as base [NEW CODE ${timestamp}]:`, stats);
        } else {
          // Fallback to user.stats if Firebase stats don't exist
          Object.assign(stats, user.stats);
          console.log('🔄 Arena: Using user.stats as fallback:', stats);
        }
        
        // Update addiction from clean time
        if (statManager) {
          await statManager.updateAddictionFromCleanTime();
          
          // Re-read stats after addiction decay update
          const updatedStatsSnapshot = await get(dbRef(db, `users/${user.uid}/stats`));
          if (updatedStatsSnapshot.exists()) {
            const updatedStats = updatedStatsSnapshot.val();
            // console.log('🔄 Arena: Reading stats after addiction decay:', updatedStats);
            Object.assign(stats, updatedStats);
            
            // USE CENTRALIZED STATS: Skip all client-side calculations for User 2 and User 3
            if (user.uid === 'uGZGbLUytbfu8W3mQPW0YAvXTQn1' || user.uid === 'AmwwlNyHD5T3WthUbyR6bFL0QkF2') {
              console.log(`🔄 Arena: Using Firebase stats directly for ${user.uid} - no client-side calculation`);
              // Stats are managed by CentralizedStatService and come from Firebase real-time listeners
              // Return early to prevent any further calculation
              return stats;
            }
            
            // console.log('🔄 Arena: Final stats after decay:', stats);
          }
        }
        
      } catch (error) {
        console.error('Error reading/updating stats from Firebase:', error);
        // Fallback to user.stats on error
        Object.assign(stats, user.stats);
      }
    }
    
    return stats;
  };
  
  // Get real-time stats for both user and nemesis
  const [realTimeUserStats, setRealTimeUserStats] = useState(() => {
    const defaultStats = { 
      mentalStrength: 50, 
      motivation: 50, 
      triggerDefense: 30, 
      addictionLevel: 50,
      cravingsResisted: 0,
      streakDays: 0
    };
    const userStats = user?.stats ? { ...defaultStats, ...user.stats } : defaultStats;
    return userStats;
  });
  const [realTimeNemesisStats, setRealTimeNemesisStats] = useState(() => {
    // Always start with default stats - let useEffect handle real-time calculation
    const defaultStats = { 
      mentalStrength: 50, 
      motivation: 50, 
      triggerDefense: 30, 
      addictionLevel: 50,
      cravingsResisted: 0,
      streakDays: 0
    };
    console.log('🔄 Arena: Initializing realTimeNemesisStats with default stats:', defaultStats);
    return defaultStats;
  });

  // Sync realTimeUserStats with userStats when userStats changes
  useEffect(() => {
    if (userStats && Object.keys(userStats).length > 0) {
      console.log('🔄 Arena: Syncing realTimeUserStats with userStats:', userStats);
      setRealTimeUserStats(userStats);
    }
  }, [userStats]);

  // Store buddy streak separately to prevent it from being reset during tab switches
  const [buddyStreakData, setBuddyStreakData] = useState({
    streakDisplayText: null,
    streakDays: 0,
    streakUnit: 'hours'
  });

  // Add state to store the latest user stats from CentralizedStatService
  const [latestUserStats, setLatestUserStats] = useState({});

  // Fetch latest stats from CentralizedStatService
  const fetchLatestStats = async () => {
    if (user && window.centralizedStatService) {
      try {
        const stats = await window.centralizedStatService.getCurrentStats();
        console.log('🔄 Arena: Fetched latest stats from CentralizedStatService:', stats);
        setLatestUserStats(stats);
        return stats;
      } catch (error) {
        console.warn('🔄 Arena: Could not fetch latest stats from CentralizedStatService:', error);
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    fetchLatestStats();
    
    // Set up interval to refresh stats every 30 seconds
    const interval = setInterval(fetchLatestStats, 30000);
    
    return () => clearInterval(interval);
  }, [user]);

  // Expose fetchLatestStats globally for immediate refresh after behavior logging
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.refreshArenaStats = fetchLatestStats;
      window.setLatestUserStats = setLatestUserStats;
    }
  }, [user]);

  // Note: Firestore initialization is handled by the parent App component

  // Initialize StatManager and load real-time stats (requires user authentication)
  useEffect(() => {
    if (!user?.uid) return;

    let isMounted = true;

    const initializeUserServices = async () => {
      // Initialize StatManager
      const initializeStatManager = async () => {
        if (!isMounted) return;
        try {
          const manager = new StatManager(db, user.uid);
          await manager.initialize();
          if (isMounted) {
            setStatManager(manager);
          }
        } catch (error) {
          console.error('Error initializing StatManager:', error);
        }
      };

      await initializeStatManager();

      const loadStats = async () => {
        if (!isMounted) return;
        
        // console.log('🔄 Arena: Starting loadStats - user:', user?.heroName, 'nemesis:', nemesis?.heroName);
        if (user && isMounted) {
          const userStats = await calculateRealTimeStats(user);
          // console.log('🔄 Arena: Setting user stats:', userStats);
          if (isMounted) {
            setRealTimeUserStats(userStats);
          }
        }
        if (nemesis && nemesis.uid && isMounted) {
          // All users now use centralized stats - skip initial calculation and let loadRealBuddy set the correct stats
          console.log(`🔄 Arena: Skipping initial calculation for buddy ${nemesis.uid} - will use centralized Firebase stats`);
          // Don't call calculateRealTimeStats - let loadRealBuddy set the correct stats from CentralizedStatService
        }
      };
      
      await loadStats();
    };

    initializeUserServices();
    
    return () => {
      isMounted = false;
    };
  }, [user?.uid, nemesis?.uid]); // Only depend on stable user IDs to prevent infinite loops

  // Set up real-time listeners for buddy stats updates
  useEffect(() => {
    if (!nemesis?.uid || !nemesis?.isRealBuddy) return;

    // Skip real-time listeners for centralized users - they manage their own stats
    if (nemesis.uid === 'uGZGbLUytbfu8W3mQPW0YAvXTQn1' || nemesis.uid === 'AmwwlNyHD5T3WthUbyR6bFL0QkF2') {
      console.log(`🚫 Arena: SKIPPING real-time listener for centralized buddy ${nemesis.uid}`);
      return;
    }

    let isMounted = true;
    console.log('🔄 Arena: Setting up real-time listener for buddy stats:', nemesis.heroName);

    const setupBuddyStatsListener = async () => {
      try {
        const { ref, onValue } = await import('firebase/database');
        
        // Listen for changes in buddy's stats
        const buddyStatsRef = ref(db, `users/${nemesis.uid}/stats`);
        const unsubscribeStats = onValue(buddyStatsRef, (snapshot) => {
          if (!isMounted) return;
          
          if (snapshot.exists()) {
            const updatedBuddyStats = snapshot.val();
            console.log('🔄 Arena: Buddy stats updated in real-time:', updatedBuddyStats);
            console.log('🔍 Arena: Buddy streak display info - streakDays:', updatedBuddyStats.streakDays, 'streakUnit:', updatedBuddyStats.streakUnit, 'streakDisplayText:', updatedBuddyStats.streakDisplayText);
            
            // Prefer centralized streak if present
            if (updatedBuddyStats.streakDisplayText && updatedBuddyStats.streakUnit) {
              const centralizedStreakData = {
                streakDays: updatedBuddyStats.streakDays || 0,
                streakUnit: updatedBuddyStats.streakUnit,
                streakDisplayText: updatedBuddyStats.streakDisplayText
              };
              setBuddyStreakData(centralizedStreakData);
              console.log('🔍 Arena: Using centralized stats streak:', centralizedStreakData.streakDisplayText);
            } else {
              // Compute from buddy's own timestamps only when centralized values are missing
              let dateSource = realBuddy?.lastRelapseDate || nemesis?.lastRelapseDate || realBuddy?.originalQuitDate || nemesis?.originalQuitDate || realBuddy?.lastActivity || nemesis?.lastActivity || null;
              if (dateSource) {
                const streakData = calculateStreak(new Date(dateSource));
                const calculatedStreakData = {
                  streakDays: streakData.value,
                  streakUnit: streakData.unit,
                  streakDisplayText: streakData.displayText
                };
                setBuddyStreakData(calculatedStreakData);
                updatedBuddyStats.streakDays = streakData.value;
                updatedBuddyStats.streakUnit = streakData.unit;
                updatedBuddyStats.streakDisplayText = streakData.displayText;
                console.log('🔄 Arena: Calculated buddy streak from timestamps (no centralized):', streakData.displayText);
              } else {
                // Final default when nothing available
                updatedBuddyStats.streakUnit = 'hours';
                updatedBuddyStats.streakDisplayText = '0 hours';
              }
            }
            
            // Update the nemesis stats in real-time with calculated streak
            setRealTimeNemesisStats(prevStats => {
              console.log('🔄 Arena: Updating buddy stats with calculated streak:', updatedBuddyStats.streakDisplayText);
              
              return {
                ...prevStats,
                ...updatedBuddyStats
                // The streak data is already calculated and set in updatedBuddyStats above
              };
            });
          }
        }, (error) => {
          if (error.code !== 'PERMISSION_DENIED') {
            console.error('Error listening to buddy stats:', error);
          }
        });

        // Listen for changes in buddy's profile (for streak calculation)
        const buddyProfileRef = ref(db, `users/${nemesis.uid}/profile`);
        const unsubscribeProfile = onValue(buddyProfileRef, async (snapshot) => {
          if (!isMounted) return;
          
          if (snapshot.exists()) {
            const profileData = snapshot.val();
            console.log('🔄 Arena: Buddy profile updated, recalculating stats...');
            
            // Update buddy stats preserving the pre-loaded real stats
            console.log('🔄 Arena: Preserving pre-loaded buddy stats during profile update...');
            
            // For User 2 and User 3: Don't recalculate on profile changes, use centralized stats
            const buddyUID = nemesis?.uid || realBuddy?.uid;
            if (buddyUID === 'uGZGbLUytbfu8W3mQPW0YAvXTQn1' || buddyUID === 'AmwwlNyHD5T3WthUbyR6bFL0QkF2') {
              console.log(`🔄 Arena: Profile change for centralized buddy ${buddyUID} - keeping centralized stats intact`);
              // Don't recalculate anything - centralized stats are already correct
            } else {
              // For other users: Update streak if needed
              if (realTimeNemesisStats && realTimeNemesisStats.addictionLevel !== 50) {
                // We have real stats loaded, preserve them and only update streak
                let updatedStats = { ...realTimeNemesisStats };
                
                // Recalculate streak if quit date changed
                if (profileData.quitDate && profileData.quitDate !== nemesis.quitDate) {
                  const quitDate = new Date(profileData.quitDate);
                  const streakData = calculateStreak(quitDate);
                  updatedStats.streakDays = streakData.value;
                  updatedStats.streakUnit = streakData.unit;
                  updatedStats.streakDisplayText = streakData.displayText;
                  console.log('🔄 Arena: Updated buddy streak from profile change:', streakData.displayText);
                } else if (profileData.lastRelapseDate || profileData.relapseDate) {
                  // Fallback: use last relapse date when available to compute streak
                  const relapseDate = new Date(profileData.lastRelapseDate || profileData.relapseDate);
                  const relapseStreak = calculateStreak(relapseDate);
                  updatedStats.streakDays = relapseStreak.value;
                  updatedStats.streakUnit = relapseStreak.unit;
                  updatedStats.streakDisplayText = relapseStreak.displayText;
                  setBuddyStreakData({
                    streakDays: relapseStreak.value,
                    streakUnit: relapseStreak.unit,
                    streakDisplayText: relapseStreak.displayText
                  });
                  console.log('🔄 Arena: Updated buddy streak from last relapse date:', relapseStreak.displayText);
                } else if (nemesis?.finalQuitDate || realBuddy?.finalQuitDate) {
                  // Last resort: use computed finalQuitDate (e.g., seeded or fallback)
                  const fallbackQuit = new Date(nemesis?.finalQuitDate || realBuddy?.finalQuitDate);
                  const fallbackStreak = calculateStreak(fallbackQuit);
                  updatedStats.streakDays = fallbackStreak.value;
                  updatedStats.streakUnit = fallbackStreak.unit;
                  updatedStats.streakDisplayText = fallbackStreak.displayText;
                  setBuddyStreakData({
                    streakDays: fallbackStreak.value,
                    streakUnit: fallbackStreak.unit,
                    streakDisplayText: fallbackStreak.displayText
                  });
                  console.log('🔄 Arena: Updated buddy streak from finalQuitDate fallback:', fallbackStreak.displayText);
                }
                
                console.log('🔄 Arena: Preserved real buddy stats during profile update:', updatedStats);
                
                // Preserve locally calculated streak during profile update
                setRealTimeNemesisStats(prevStats => {
                  console.log('🔄 Arena: Preserving locally calculated streak during profile update:', buddyStreakData);
                  
                  return {
                    ...prevStats,
                    ...updatedStats,
                    ...buddyStreakData // Override with preserved streak data
                  };
                });
              } else {
                console.log('🔄 Arena: Skipping profile update - waiting for real stats to load first');
              }
            }
          }
        }, (error) => {
          if (error.code !== 'PERMISSION_DENIED') {
            console.error('Error listening to buddy profile:', error);
          }
        });

        return () => {
          unsubscribeStats();
          unsubscribeProfile();
        };
        
      } catch (error) {
        console.error('Error setting up buddy stats listeners:', error);
      }
    };

    const cleanupPromise = setupBuddyStatsListener();

    return () => {
      isMounted = false;
      cleanupPromise.then(cleanup => {
        if (cleanup && typeof cleanup === 'function') {
          cleanup();
        }
      });
    };
  // Periodically refresh buddy streak so it progresses even when buddy isn't logged in
  }, [nemesis?.uid, nemesis?.isRealBuddy, realBuddy?.quitDate]);
  useEffect(() => {
    if (!nemesis?.uid || !nemesis?.isRealBuddy) return;
    const intervalId = setInterval(() => {
      const dateSource = realBuddy?.lastRelapseDate || nemesis?.lastRelapseDate || realBuddy?.originalQuitDate || nemesis?.originalQuitDate || realBuddy?.lastActivity || nemesis?.lastActivity || null;
      if (!dateSource) return;
      const streakData = calculateStreak(new Date(dateSource));
      setBuddyStreakData({
        streakDays: streakData.value,
        streakUnit: streakData.unit,
        streakDisplayText: streakData.displayText
      });
      setRealTimeNemesisStats(prev => ({
        ...prev,
        streakDays: streakData.value,
        streakUnit: streakData.unit,
        streakDisplayText: streakData.displayText
      }));
    }, 60 * 1000);
    return () => clearInterval(intervalId);
  }, [nemesis?.uid, nemesis?.isRealBuddy, realBuddy?.lastRelapseDate, realBuddy?.originalQuitDate, realBuddy?.lastActivity]);

  // Add a refresh function for real-time stats
  const refreshStats = async () => {
    // console.log('🔄 Arena: Refreshing stats...');
    // console.log('🔄 Arena: Current realTimeNemesisStats before refresh:', realTimeNemesisStats);
    if (user) {
      const userStats = await calculateRealTimeStats(user);
      // console.log('🔄 Arena: Updated user stats:', userStats);
      // console.log('🔄 Arena: User stats cravingsResisted:', userStats.cravingsResisted);
      // console.log('🔄 Arena: User stats streakDays:', userStats.streakDays);
      setRealTimeUserStats(userStats);
    }
    if (nemesis) {
      // For User 2 and User 3: Don't recalculate, they use centralized stats
      if (nemesis.uid === 'uGZGbLUytbfu8W3mQPW0YAvXTQn1' || nemesis.uid === 'AmwwlNyHD5T3WthUbyR6bFL0QkF2') {
        console.log(`🔄 Arena: Skipping refresh for centralized buddy ${nemesis.uid} - using Firebase stats directly`);
        // Don't call calculateRealTimeStats - let the real-time listener handle updates
      } else {
        // For other users: Calculate stats normally
        // console.log('🔄 Arena: Refreshing nemesis stats for:', nemesis.heroName, 'uid:', nemesis.uid);
        const nemesisStats = await calculateRealTimeStats(nemesis);
        // console.log('🔄 Arena: Updated nemesis stats:', nemesisStats);
        // console.log('🔄 Arena: Nemesis stats cravingsResisted:', nemesisStats.cravingsResisted);
        // console.log('🔄 Arena: Nemesis stats streakDays:', nemesisStats.streakDays);
        
        // Store just the calculated stats, not the merged object
        // console.log('🔄 Arena: Calculated nemesis stats:', nemesisStats);
        // console.log('🔄 Arena: About to setRealTimeNemesisStats with:', nemesisStats);
        
        // Preserve locally calculated streak during stats calculation
        setRealTimeNemesisStats(prevStats => {
          console.log('🔄 Arena: Preserving locally calculated streak during stats calculation:', buddyStreakData);
          
          return {
            ...prevStats,
            ...nemesisStats,
            ...buddyStreakData // Override with preserved streak data
          };
        });
      }
    }
  };

  // Refresh stats every 30 seconds to keep them current
  useEffect(() => {
    if (!user?.uid) return;
    
    const interval = setInterval(refreshStats, 30000); // 30 seconds
    
    return () => clearInterval(interval);
  }, [user?.uid, nemesis?.uid]); // ✅ Added nemesis dependency
  
  // Trigger immediate refresh when nemesis changes
  useEffect(() => {
    if (nemesis?.uid) {
      // Skip refresh for centralized users - they use Firebase stats directly
      if (nemesis.uid === 'uGZGbLUytbfu8W3mQPW0YAvXTQn1' || nemesis.uid === 'AmwwlNyHD5T3WthUbyR6bFL0QkF2') {
        // Skip refresh for centralized users
      } else {
        refreshStats();
      }
    }
  }, [nemesis?.uid]);
  
  // Trigger refresh when realBuddy data is loaded (to get proper quit date)
  useEffect(() => {
    if (realBuddy?.quitDate && nemesis?.uid) {
      // Skip refresh for centralized users - they use Firebase stats directly
      if (nemesis.uid === 'uGZGbLUytbfu8W3mQPW0YAvXTQn1' || nemesis.uid === 'AmwwlNyHD5T3WthUbyR6bFL0QkF2') {
        // Skip refresh for centralized users
      } else {
        refreshStats();
      }
    }
  }, [realBuddy?.quitDate, nemesis?.uid]);
  
  // Load buddy data when user changes - Arena component handles this now
  useEffect(() => {
    if (user?.uid && !realBuddy && !buddyLoading && !buddyLoadAttempted) {
      console.log('🔄 Arena: Loading buddy data for user:', user.uid);
      loadRealBuddy(calculateRealTimeStats, setRealTimeNemesisStats, setBuddyStreakData);
    }
  }, [user?.uid, realBuddy, buddyLoading, buddyLoadAttempted, setBuddyStreakData]);
  
  // Handle online/offline state changes - MOVED TO CORRECT LOCATION AFTER STATE DECLARATIONS
  useEffect(() => {
    const handleOnline = () => {
      console.log('🌐 Internet connection restored');
      // Note: Online/offline handling is managed by the parent App component
    };

    const handleOffline = () => {
      console.log('📡 Internet connection lost');
      // Note: Online/offline handling is managed by the parent App component
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Enhanced battle algorithm: (Mental Strength × 1.5) + (Motivation × 1.0) + (Trigger Defense × 1.2) - (Addiction × 1.0)
  const calculateBattleScore = (player) => {
    if (!player || !player.stats) {
      console.warn('Player or player stats not available for battle score calculation');
      return 0;
    }
    
    const mentalStrength = player.stats.mentalStrength || 50;
    const motivation = player.stats.motivation || 50;
    const triggerDefense = player.stats.triggerDefense || 30;
    const addiction = player.stats.addictionLevel || 50;
    
    return (mentalStrength * 1.5) + (motivation * 1.0) + (triggerDefense * 1.2) - (addiction * 1.0);
  };
  
  const playerScore = calculateBattleScore({ ...user, stats: realTimeUserStats });
  const nemesisScore = calculateBattleScore({ ...nemesis, stats: realTimeNemesisStats });
  
  // Ensure scores are valid numbers before comparison
  const validPlayerScore = typeof playerScore === 'number' && !isNaN(playerScore) ? playerScore : 0;
  const validNemesisScore = typeof nemesisScore === 'number' && !isNaN(nemesisScore) ? nemesisScore : 0;
  
  const battleStatus = validPlayerScore > validNemesisScore ? 'WINNING' : 
                     validPlayerScore === validNemesisScore ? 'TIED' : 'LOSING';
  
  // Calculate intelligent recommendations based on stat efficiency and gaps
  const calculateRecommendations = () => {
    if (battleStatus === 'WINNING') return null;
    
    // Ensure stats are available before proceeding
    if (!realTimeUserStats || !realTimeNemesisStats) {
      console.warn('Stats not available for recommendations calculation');
      return [];
    }
    
    const scoreDifference = validNemesisScore - validPlayerScore + 1; // +1 to ensure we actually win
    const recommendations = [];
    
    // Get current player and nemesis stats with safe fallbacks
    const currentMentalStrength = realTimeUserStats?.mentalStrength || 50;
    const currentMotivation = realTimeUserStats?.motivation || 50;
    const currentTriggerDefense = realTimeUserStats?.triggerDefense || 30;
    const currentAddiction = realTimeUserStats?.addictionLevel || 50;
    
    const nemesisMentalStrength = realTimeNemesisStats?.mentalStrength || 50;
    const nemesisMotivation = realTimeNemesisStats?.motivation || 50;
    const nemesisTriggerDefense = realTimeNemesisStats?.triggerDefense || 30;
    const nemesisAddiction = realTimeNemesisStats?.addictionLevel || 50;
    
    // Calculate stat gaps vs nemesis
    const mentalStrengthGap = nemesisMentalStrength - currentMentalStrength;
    const motivationGap = nemesisMotivation - currentMotivation;
    const triggerDefenseGap = nemesisTriggerDefense - currentTriggerDefense;
    const addictionGap = currentAddiction - nemesisAddiction; // Player addiction - nemesis addiction
    
    // Calculate stat efficiency (score increase per point)
    const statEfficiency = [
      { name: 'Mental Strength', multiplier: 1.5, gap: mentalStrengthGap, current: currentMentalStrength, max: 100 },
      { name: 'Trigger Defense', multiplier: 1.2, gap: motivationGap, current: currentTriggerDefense, max: 100 },
      { name: 'Motivation', multiplier: 1.0, gap: motivationGap, current: currentMotivation, max: 100 },
      { name: 'Addiction', multiplier: 1.0, gap: addictionGap, current: currentAddiction, min: 0, isReduction: true }
    ];
    
    // Sort by efficiency (highest multiplier first, then by gap size)
    statEfficiency.sort((a, b) => {
      if (a.multiplier !== b.multiplier) return b.multiplier - a.multiplier;
      return Math.abs(b.gap) - Math.abs(a.gap);
    });
    
    // Generate specific recommendations
    statEfficiency.forEach(stat => {
      if (stat.isReduction) {
        // For addiction, calculate how much we can reduce
        const maxReduction = Math.min(stat.current - stat.min, 50); // Cap at 50 point reduction
        const scoreImpact = maxReduction * stat.multiplier;
        
        if (scoreImpact > 0) {
          recommendations.push({
            stat: stat.name,
            change: maxReduction,
            action: getAddictionAction(maxReduction),
            priority: scoreImpact,
            canWin: scoreImpact >= scoreDifference,
            isReduction: true,
            efficiency: stat.multiplier,
            gap: stat.gap
          });
        }
      } else {
        // For other stats, calculate how much we can increase
        const maxIncrease = Math.min(stat.max - stat.current, 50); // Cap at 50 point increase
        const scoreImpact = maxIncrease * stat.multiplier;
        
        if (scoreImpact > 0) {
          recommendations.push({
            stat: stat.name,
            change: maxIncrease,
            action: getStatAction(stat.name, maxIncrease),
            priority: scoreImpact,
            canWin: scoreImpact >= scoreDifference,
            efficiency: stat.multiplier,
            gap: stat.gap
          });
        }
      }
    });
    
    // Sort by priority (highest score impact first)
    recommendations.sort((a, b) => b.priority - a.priority);
    
    // If no single stat can win alone, create combination strategy
    if (recommendations.length > 0 && !recommendations.some(r => r.canWin)) {
      const bestStrategy = createCombinationStrategy(recommendations, scoreDifference);
      if (bestStrategy) {
        recommendations.unshift(bestStrategy);
      }
    }
    
    return recommendations.slice(0, 3); // Return top 3 recommendations
  };
  
  // Helper function to get specific actions for addiction reduction
  const getAddictionAction = (reduction) => {
    if (reduction >= 30) return 'Stay completely clean, avoid all triggers, use nicotine replacement therapy';
    if (reduction >= 20) return 'Reduce nicotine intake significantly, avoid high-risk situations';
    if (reduction >= 10) return 'Cut back on vaping frequency, identify and avoid main triggers';
    return 'Small reduction in nicotine intake, practice trigger avoidance';
  };
  
  // Helper function to get specific actions for stat improvements
  const getStatAction = (statName, increase) => {
    switch(statName) {
      case 'Mental Strength':
        if (increase >= 30) return 'Complete daily breathing exercises, stay hydrated for 3+ days, practice meditation';
        if (increase >= 20) return 'Complete breathing exercises 3 days straight, stay hydrated, use stress management';
        return 'Complete breathing exercises, stay hydrated for 3 days straight';
      
      case 'Motivation':
        if (increase >= 30) return 'Log progress daily, share achievements weekly';
        if (increase >= 20) return 'Log progress 5+ days per week, share achievements, track progress';
        return 'Regular logging (3+ days per week), share achievements, reach milestones';
      
      case 'Trigger Defense':
        if (increase >= 30) return 'Survive multiple trigger situations, pre-plan for all triggers, update trigger list';
        if (increase >= 20) return 'Survive trigger situations, pre-plan for known triggers, practice coping';
        return 'Survive trigger situations without vaping, pre-plan for known triggers';
      
      default:
        return 'Focus on improving this stat through consistent practice';
    }
  };
  
  // Create combination strategy when no single stat can win
  const createCombinationStrategy = (recommendations, scoreNeeded) => {
    let totalScore = 0;
    const strategy = [];
    
    for (const rec of recommendations) {
      if (totalScore >= scoreNeeded) break;
      
      const remainingNeeded = scoreNeeded - totalScore;
      const contribution = Math.min(rec.priority, remainingNeeded);
      
      if (contribution > 0) {
        strategy.push({
          stat: rec.stat,
          change: Math.ceil(contribution / rec.efficiency),
          contribution: contribution
        });
        totalScore += contribution;
      }
    }
    
    if (strategy.length > 0) {
      return {
        stat: 'Combination Strategy',
        change: Math.ceil(scoreNeeded),
        action: `Focus on: ${strategy.map(s => `${s.stat} (+${s.change})`).join(', ')}`,
        priority: totalScore,
        canWin: totalScore >= scoreNeeded,
        isCombination: true,
        strategy: strategy
      };
    }
    
    return null;
  };
  const recommendations = calculateRecommendations() || [];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-4 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back to Login Button */}

        

        
        {/* Centralized Battle Status with Info Button */}
        <div className="text-center mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            <div className={`inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 rounded-full font-bold text-sm sm:text-lg shadow-xl ${
              battleStatus === 'WINNING' ? 'bg-green-600' : 
              battleStatus === 'TIED' ? 'bg-yellow-600' : 'bg-red-600'
            } text-white`}>
              {battleStatus === 'WINNING' ? (
                <Trophy className="w-5 h-5 mr-2" />
              ) : battleStatus === 'TIED' ? (
                <Shield className="w-5 h-5 mr-2" />
              ) : (
                <span className="mr-2">📉</span>
              )}
              You are {battleStatus}
            </div>
            
            {/* Info Button */}
            <button
              onClick={() => setShowBattleInfo(true)}
              className="info-button w-0.5 h-0.5 sm:w-1 sm:h-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg"
              style={{ fontSize: '4px' }}
              title="Battle Algorithm Info"
            >
              <span className="text-sm sm:text-lg font-bold">i</span>
            </button>
            
            {/* Refresh Stats Button */}
            <button
              onClick={refreshStats}
              className="touch-interactive ripple-effect w-11 h-11 sm:w-12 sm:h-12 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center shadow-lg min-h-[44px] min-w-[44px]"
              title="Refresh Stats"
            >
              <span className="text-sm sm:text-lg font-bold">🔄</span>
            </button>
            
                    {/* Debug Stats Display */}
        <div className="text-xs text-gray-400 bg-gray-800 p-2 rounded">
          <div>User Stats: {JSON.stringify(realTimeUserStats)}</div>
          <div>Base Stats: {JSON.stringify(user?.stats)}</div>
        </div>
        
        {/* Manual Refresh Button */}
        <button 
          onClick={refreshStats}
          className="mt-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors min-h-[44px]"
        >
          🔄 Refresh Stats
        </button>
        <button 
          onClick={async () => {
            console.log('🧪 Manual buddy matching test triggered...');
            try {
              await autoMatchUsers();
              console.log('✅ Manual buddy matching completed');
            } catch (error) {
              console.error('❌ Manual buddy matching failed:', error);
            }
          }}
          className="mt-2 ml-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors min-h-[44px]"
        >
          🔗 Test Matching
        </button>
        <button 
          onClick={async () => {
            console.log('🧪 Manual buddy reload test triggered...');
            try {
              setBuddyLoadAttempted(false);
              setRealBuddy(null);
              await loadRealBuddy(calculateRealTimeStats, setRealTimeNemesisStats, setBuddyStreakData);
              console.log('✅ Manual buddy reload completed');
            } catch (error) {
              console.error('❌ Manual buddy reload failed:', error);
            }
          }}
          className="mt-2 ml-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors min-h-[44px]"
        >
          👥 Reload Buddy
        </button>
        <button 
          onClick={async () => {
            console.log('🧪 Resetting matching system...');
            try {
              const service = firestoreBuddyServiceRef.current || firestoreBuddyService;
              if (service) {
                // Clear all buddy pairs
                const { getDocs, deleteDoc, doc } = await import('firebase/firestore');
                const pairsSnapshot = await getDocs(service.buddyPairsCollection);
                const deletePromises = pairsSnapshot.docs.map(docSnapshot => 
                  deleteDoc(doc(firestore, 'buddyPairs', docSnapshot.id))
                );
                await Promise.all(deletePromises);
                
                // Clear all matching pool
                const poolSnapshot = await getDocs(service.matchingPoolCollection);
                const poolDeletePromises = poolSnapshot.docs.map(docSnapshot => 
                  deleteDoc(doc(firestore, 'matchingPool', docSnapshot.id))
                );
                await Promise.all(poolDeletePromises);
                
                // Clear buddy info from all users in Realtime Database
                const { ref, remove } = await import('firebase/database');
                const usersToClean = ['5uSH8SA6y4eZ7jkoLEZCRJZmTGW2', 'KB67Yg17rkZmCa8UV1N5xIUWoK12', 'o4mW4BmLWOOVBybTrYcvGJ4nimA3'];
                for (const userId of usersToClean) {
                  try {
                    await remove(ref(db, `users/${userId}/buddyInfo`));
                  } catch (err) {
                    console.log('Could not remove buddy info for:', userId);
                  }
                }
                
                console.log('✅ Matching system reset completed');
                setRealBuddy(null);
                setBuddyLoadAttempted(false);
              }
            } catch (error) {
              console.error('❌ Reset failed:', error);
            }
          }}
          className="mt-2 ml-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors min-h-[44px]"
        >
          🔄 Reset Matching
        </button>
          </div>
        </div>
        
        {/* Enhanced Battle Cards */}
        <div className="battle-cards-container flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-12 mb-8 w-full">
          <div className="battle-card flex flex-col items-center space-y-4 flex-shrink-0">
            {(() => {
              // Only render if we have both user and realTimeUserStats
              if (!user || !realTimeUserStats) {
                console.log('🎯 TradingCard: Missing data, not rendering user card');
                return (
                  <div className="w-72 sm:w-80 h-[480px] sm:h-[520px] bg-slate-800 rounded-xl border-2 border-slate-600 p-4 text-white text-center mx-auto flex items-center justify-center">
                    <div className="animate-pulse">Loading User...</div>
                  </div>
                );
              }
              
              // Use CentralizedStatService stats for ALL users (universal system)
              // Prioritize latest stats from CentralizedStatService, then userStats, then realTimeUserStats
              const mergedUserStats = latestUserStats && Object.keys(latestUserStats).length > 0
                ? { ...user.stats, ...latestUserStats }  // Use latest Firebase stats from CentralizedStatService
                : userStats && Object.keys(userStats).length > 0
                ? { ...user.stats, ...userStats }  // Use passed userStats as fallback
                : { ...user.stats, ...realTimeUserStats }; // Final fallback to calculated stats
              
              console.log(`🎯 TradingCard: Using ${latestUserStats && Object.keys(latestUserStats).length > 0 ? 'latest centralized' : userStats && Object.keys(userStats).length > 0 ? 'centralized' : 'calculated'} stats for ${user.uid}`);
              console.log('🎯 TradingCard: Final stats:', { 
                streak: mergedUserStats.streakDisplayText, 
                addiction: mergedUserStats.addictionLevel,
                cravingsResisted: mergedUserStats.cravingsResisted
              });
              // Reduced logging to prevent console spam
              // console.log('🎯 TradingCard: User base stats:', user.stats);
              // console.log('🎯 TradingCard: Real-time user stats:', realTimeUserStats);
              // console.log('🎯 TradingCard: Merged user stats:', mergedUserStats);
              // console.log('🎯 TradingCard: Final addictionLevel:', mergedUserStats.addictionLevel);
              // console.log('🎯 TradingCard: Final mentalStrength:', mergedUserStats.mentalStrength);
              
              return (
                <TradingCard 
                  key={`user-${user.uid}-${user.lastRelapseRefresh || Date.now()}`}
                  user={{ 
                    ...user, 
                    stats: mergedUserStats
                  }} 
                  showComparison={false} 
                  nemesisUser={nemesis} 
                />
              );
            })()}
          </div>
          
          <div className="vs-section flex flex-row lg:flex-col items-center justify-center space-x-4 lg:space-x-0 space-y-0 lg:space-y-4 flex-shrink-0">
            <div className="vs-icon w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-br from-red-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl animate-pulse">
              <Sword className="w-8 h-8 lg:w-12 lg:h-12 text-white" />
            </div>
            <div className="bg-red-600 px-4 py-2 lg:px-8 lg:py-3 rounded-full">
              <p className="vs-text text-white font-bold text-lg lg:text-2xl">VS</p>
            </div>
          </div>
          
          <div className="battle-card flex flex-col items-center space-y-4 flex-shrink-0">
            {(() => {
              // Only render if we have both nemesis and realTimeNemesisStats
              if (!nemesis || !realTimeNemesisStats) {
                console.log('🎯 TradingCard: Missing data, not rendering nemesis card');
                return (
                  <div className="w-72 sm:w-80 h-[480px] sm:h-[520px] bg-slate-800 rounded-xl border-2 border-slate-600 p-4 text-white text-center mx-auto flex items-center justify-center">
                    <div className="animate-pulse">Loading Nemesis...</div>
                  </div>
                );
              }
              
              // Create merged nemesis stats with proper structure
              const mergedNemesisStats = {
                ...nemesis,                       // Keep original nemesis profile data
                stats: {                          // Update only the stats portion
                  ...nemesis.stats,               // Keep existing stats
                  ...realTimeNemesisStats         // Override with calculated real-time stats
                }
              };
              
              // Override streak data with preserved buddy streak if available
              if (buddyStreakData.streakDisplayText) {
                mergedNemesisStats.stats.streakDisplayText = buddyStreakData.streakDisplayText;
                mergedNemesisStats.stats.streakDays = buddyStreakData.streakDays;
                mergedNemesisStats.stats.streakUnit = buddyStreakData.streakUnit;
              }
              
              console.log('🎯 TradingCard: Buddy streak debug:', {
                realTimeNemesisStats: realTimeNemesisStats,
                mergedNemesisStats: mergedNemesisStats.stats,
                buddyStreak: mergedNemesisStats.stats?.streakDisplayText,
                preservedBuddyStreak: buddyStreakData
              });
              
              // Debug logging for buddy stats (removed to reduce console noise)
              // console.log('🔍 Buddy TradingCard: Nemesis stats source:', {
              //   nemesisUID: nemesis?.uid,
              //   isCentralizedUser: nemesis?.uid === 'uGZGbLUytbfu8W3mQPW0YAvXTQn1' || nemesis?.uid === 'AmwwlNyHD5T3WthUbyR6bFL0QkF2',
              //   realTimeNemesisStats: realTimeNemesisStats,
              //   finalStreak: mergedNemesisStats.stats?.streakDisplayText
              // });
              
              // Reduced logging to prevent infinite loops
              // console.log('🎯 TradingCard: Merged nemesis stats:', mergedNemesisStats);
              // console.log('🎯 TradingCard: Original nemesis:', nemesis);
              // console.log('🎯 TradingCard: RealTimeNemesisStats:', realTimeNemesisStats);
              // console.log('🎯 TradingCard: Final nemesis cravingsResisted:', mergedNemesisStats.stats?.cravingsResisted);
              // console.log('🎯 TradingCard: Final nemesis streakDays:', mergedNemesisStats.stats?.streakDays);
              
              return (
                <TradingCard 
                  key={`buddy-${nemesis.uid}-${user.lastRelapseRefresh || Date.now()}`}
                  user={mergedNemesisStats} 
                  isNemesis={true} 
                  showComparison={false} 
                  nemesisUser={user} 
                />
              );
            })()}
          </div>
        </div>
        {/* Battle Recommendations Section - Only show when losing */}
        {battleStatus === 'LOSING' && recommendations && recommendations.length > 0 && (
          <div className="w-full max-w-4xl mx-auto bg-slate-800/50 rounded-xl p-4 sm:p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4 text-center">🎯 Quick Win Strategy</h3>
            <div className="space-y-4">
              {recommendations.slice(0, 3).map((rec, index) => (
                <div key={index} className="bg-slate-700/50 rounded-lg p-3 sm:p-4 border-l-4 border-blue-500">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                    <div className="flex-1">
                      <h4 className="text-white font-semibold mb-2">
                        {rec.isReduction ? (
                          <>🎯 Reduce your {rec.stat} by {rec.change} points!</>
                        ) : rec.isCombination ? (
                          <>🎯 Best Strategy: Improve multiple stats by {rec.change} total points!</>
                        ) : rec.isMajor ? (
                          <>🎯 Major improvement needed: {rec.change} total points!</>
                        ) : (
                          <>🎯 Increase your {rec.stat} by {rec.change} points!</>
                        )}
                      </h4>
                      <p className="text-gray-300 text-sm">
                        💡 {rec.action}
                      </p>
                    </div>
                    <div className={`font-bold text-xl sm:text-2xl sm:ml-4 ${
                      rec.isReduction ? 'text-green-400' : 
                      rec.isCombination ? 'text-purple-400' : 
                      rec.isMajor ? 'text-orange-400' : 
                      'text-blue-400'
                    }`}>
                      {rec.isReduction ? '-' : '+'}{rec.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-4">
              <p className="text-gray-400 text-sm">
                Focus on the top recommendation for the fastest path to victory!
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Battle Algorithm Info Modal */}
      {showBattleInfo && (
        <div className="modal-backdrop">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowBattleInfo(false)}
          />
          <div className="modal-container">
            <div className="modal-content bg-slate-800 border-slate-600 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Battle Algorithm</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAchievementShare}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-sm transition-colors min-h-[44px] min-w-[44px]"
                  title="Share achievement for Motivation bonus"
                >
                  📤 Share
                </button>
                <button
                  onClick={() => setShowBattleInfo(false)}
                  className="modal-close-enhanced text-gray-400 hover:text-white text-2xl w-11 h-11 flex items-center justify-center min-h-[44px] min-w-[44px]"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="text-white font-semibold mb-2">Formula:</h4>
                <p className="text-gray-300 font-mono">
                  (Mental Strength × 1.5) + (Motivation × 1.0) + (Trigger Defense × 1.2) - (Addiction × 1.0)
                </p>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-2">Your Score:</h4>
                <p className="text-green-400 font-mono">
                  ({realTimeUserStats.mentalStrength || 50} × 1.5) + ({realTimeUserStats.motivation || 50} × 1.0) + ({realTimeUserStats.triggerDefense || 30} × 1.2) - ({realTimeUserStats.addictionLevel || 50} × 1.0) = {playerScore.toFixed(1)}
                </p>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-2">Nemesis Score:</h4>
                <p className="text-red-400 font-mono">
                  ({realTimeNemesisStats.mentalStrength || 50} × 1.5) + ({realTimeNemesisStats.motivation || 50} × 1.0) + ({realTimeNemesisStats.triggerDefense || 30} × 1.2) - ({realTimeNemesisStats.addictionLevel || 50} × 1.0) = {nemesisScore.toFixed(1)}
                </p>
              </div>
              
              <div className="bg-slate-700/50 rounded-lg p-3">
                <p className="text-gray-300 text-xs">
                  <strong>Mental Strength (×1.5):</strong> Your resilience and coping ability<br/>
                  <strong>Motivation (×1.0):</strong> Your drive to quit<br/>
                  <strong>Trigger Defense (×1.2):</strong> Your ability to resist triggers<br/>
                  <strong>Addiction (×1.0):</strong> Your nicotine dependence level
                </p>
              </div>
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Affirmation Modal Component




// Custom Popup Component for Quick Actions and Messages
const CustomPopup = ({ isOpen, onClose, title, message, type = 'info' }) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success': return '🎉';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '💡';
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success': return 'from-green-600 to-green-700';
      case 'warning': return 'from-yellow-600 to-yellow-700';
      case 'info': return 'from-blue-600 to-blue-700';
      default: return 'from-slate-600 to-slate-700';
    }
  };

  return (
    <div className="modal-backdrop">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="modal-container">
        <div className="modal-content bg-slate-800 border-slate-600 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">{getIcon()}</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
          <div className="text-gray-300 mb-6 whitespace-pre-line text-sm leading-relaxed">
            {message}
          </div>
          <button
            onClick={onClose}
            className={`w-full bg-gradient-to-r ${getBgColor()} hover:from-slate-700 hover:to-slate-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105`}
          >
            Got it
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

// Game Modal Component with Simple, Working Games
const GameModal = ({ gameType, onClose }) => {
  const [score, setScore] = useState(0);
  
  // Import swipe-to-dismiss hook
  const { modalRef, classes: swipeClasses } = useSwipeToDismiss(onClose, {
    threshold: 100,
    velocity: 0.5,
    enabled: true
  });

  // Snake Game with Movement-First Direction Processing
  const SnakeGame = () => {
    const canvasRef = useRef(null);
    const [snake, setSnake] = useState([{x: 12, y: 12}]); // Center of 25x25 grid
    const [direction, setDirection] = useState({x: 1, y: 0});
    const [nextDirection, setNextDirection] = useState({x: 1, y: 0}); // Direction for next game tick
    const [food, setFood] = useState({x: 15, y: 15}); // Center area of 25x25 grid
    const [gameOver, setGameOver] = useState(false);
    const [snakeScore, setSnakeScore] = useState(0);
    const [level, setLevel] = useState(1);
    
    // Level system: Speed and scoring progression (1.25x faster)
    const BASE_SPEED = 128; // Level 1 base speed (160ms / 1.25 = 128ms)
    const LEVEL_SPEEDS = {
      1: 128,                                    // Level 1: 128ms (1.25x faster)
      2: Math.round(128 / 1.25),                // Level 2: 102ms (1.25x faster than L1)
      3: Math.round(128 / 1.25 / 1.25)          // Level 3: 82ms (1.25x faster than L2)
    };
    
    const LEVEL_POINTS = {
      1: 5,  // Level 1: 5 points per food (increased from 2)
      2: 5,  // Level 2: 5 points per food
      3: 10  // Level 3: 10 points per food
    };

    // Keyboard input handling - queue direction changes for next game tick
    useEffect(() => {
      const handleKeyPress = (e) => {
        if (gameOver) {
          e.preventDefault(); // Prevent any unwanted behavior
          // Restart game (25x25 grid)
          setSnake([{x: 12, y: 12}]);
          setDirection({x: 1, y: 0});
          setNextDirection({x: 1, y: 0});
          setFood({x: 15, y: 15});
          setGameOver(false);
          setSnakeScore(0);
          setLevel(1);
          return;
        }

        switch(e.key) {
          case 'ArrowUp':
            e.preventDefault(); // Prevent background scrolling
            // Queue UP direction for next game tick (prevents 180° reversal)
            if (direction.y !== 1) { // Only if not currently going DOWN
              setNextDirection({x: 0, y: -1});
            }
            break;
          case 'ArrowDown':
            e.preventDefault(); // Prevent background scrolling
            // Queue DOWN direction for next game tick (prevents 180° reversal)
            if (direction.y !== -1) { // Only if not currently going UP
              setNextDirection({x: 0, y: 1});
            }
            break;
          case 'ArrowLeft':
            e.preventDefault(); // Prevent background scrolling
            // Queue LEFT direction for next game tick (prevents 180° reversal)
            if (direction.x !== 1) { // Only if not currently going RIGHT
              setNextDirection({x: -1, y: 0});
            }
            break;
          case 'ArrowRight':
            e.preventDefault(); // Prevent background scrolling
            // Queue RIGHT direction for next game tick (prevents 180° reversal)
            if (direction.x !== -1) { // Only if not currently going LEFT
              setNextDirection({x: 1, y: 0});
            }
            break;
        }
      };

      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }, [direction, gameOver]);

    // Game loop with movement-first processing to prevent 180-degree self-collision
    // The key fix: snake ALWAYS moves forward first, then direction changes are applied
    useEffect(() => {
      if (gameOver) return;

      const gameLoop = setInterval(() => {
        setSnake(prevSnake => {
          // STEP 1: Move snake head according to CURRENT direction (not queued direction)
          // This ensures the snake always moves forward to a new position first
          const newHead = {
            x: prevSnake[0].x + direction.x,
            y: prevSnake[0].y + direction.y
          };
          
          // Wraparound mode - snake appears on opposite side (25x25 grid)
          if (newHead.x < 0) newHead.x = 24;
          if (newHead.x >= 25) newHead.x = 0;
          if (newHead.y < 0) newHead.y = 24;
          if (newHead.y >= 25) newHead.y = 0;
          
          // Check self collision (excluding the tail since it will move)
          const bodyCollision = prevSnake.slice(0, -1).some(segment => 
            segment.x === newHead.x && segment.y === newHead.y
          );
          
          if (bodyCollision) {
            setGameOver(true);
            return prevSnake;
          }
          
          // Check food collision
          const ateFood = newHead.x === food.x && newHead.y === food.y;
          
          let newSnake;
          if (ateFood) {
            setSnakeScore(s => s + LEVEL_POINTS[level]);
            // Generate new food (25x25 grid)
            setFood({
              x: Math.floor(Math.random() * 25),
              y: Math.floor(Math.random() * 25)
            });
            // Snake grows: add new head, keep all body
            newSnake = [newHead, ...prevSnake];
          } else {
            // Snake moves: add new head, remove tail
            newSnake = [newHead, ...prevSnake.slice(0, -1)];
          }
          
          // STEP 2: Apply queued direction change for NEXT game tick
          // This ensures the snake always moves forward first, then changes direction
          // Only apply direction change if the snake has actually moved to a new position
          if (nextDirection.x !== direction.x || nextDirection.y !== direction.y) {
            // Use setTimeout to ensure direction change happens AFTER this game tick completes
            setTimeout(() => {
              setDirection(nextDirection);
            }, 0);
          }
          
          return newSnake;
        });
      }, LEVEL_SPEEDS[level]); // Level-based speed

      return () => clearInterval(gameLoop);
    }, [direction, nextDirection, food, gameOver]);

    // Render game
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      const cellSize = 15; // 375 / 25 = 15px per cell
      const gridSize = 25; // 25x25 grid for 375x375 canvas

      // Clear canvas
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(0, 0, 375, 375);

      // Draw grid
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 1;
      for (let i = 0; i <= gridSize; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, 375);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(375, i * cellSize);
        ctx.stroke();
      }

      // Draw snake
      snake.forEach((segment, index) => {
        if (index === 0) {
          ctx.fillStyle = '#fbbf24'; // Head
        } else {
          ctx.fillStyle = '#10b981'; // Body
        }
        ctx.fillRect(segment.x * cellSize + 1, segment.y * cellSize + 1, cellSize - 2, cellSize - 2);
      });

      // Draw food
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(food.x * cellSize + 2, food.y * cellSize + 2, cellSize - 4, cellSize - 4);
    }, [snake, food]);

    return (
      <div className="text-center">
        {/* Level Selection */}
        <div className="mb-4">
          <div className="flex justify-center gap-2 mb-3">
            <span className="text-white mr-2 text-sm">Level:</span>
            {[1, 2, 3].map(lvl => (
              <button
                key={lvl}
                onClick={() => setLevel(lvl)}
                className={`
                  px-4 py-3 text-sm font-mono border-2 border-green-500 transition-all min-h-[44px]
                  ${level === lvl 
                    ? 'bg-green-500 text-black' 
                    : 'bg-green-900 text-green-400'
                  }
                  hover:bg-green-600 cursor-pointer
                `}
                style={{ minWidth: '80px' }}
              >
                <div>Level {lvl}</div>
                <div className="text-xs mt-1">
                  {lvl === 1 && 'Normal'}
                  {lvl === 2 && 'Fast'}
                  {lvl === 3 && 'Insane'}
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <canvas
          ref={canvasRef}
          width="375"
          height="375"
          className="border-2 border-gray-300 mx-auto"
          style={{imageRendering: 'pixelated'}}
        />
        <div className="mt-4">
          <p className="text-lg font-bold text-gray-800">Score: {snakeScore} | Level: {level}</p>
          
          {gameOver && (
            <div className="mt-2">
              <p className="text-red-600 font-bold mb-2">Game Over!</p>
              <button
                onClick={() => {
                  setSnake([{x: 12, y: 12}]); // 25x25 grid center
                  setDirection({x: 1, y: 0});
                  setNextDirection({x: 1, y: 0}); // Reset direction queue
                  setFood({x: 15, y: 15}); // 25x25 grid center area
                  setGameOver(false);
                  setSnakeScore(0);
                  setLevel(1);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded text-sm min-h-[44px]"
              >
                Restart Game
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderGame = () => {
    try {
      if (gameType === 'snake') {
        return <SnakeGame />;
      } else {
        return <div className="text-center text-red-600">Game not found</div>;
      }
    } catch (error) {
      console.error('Error rendering game:', error);
      return (
        <div className="text-center text-red-600">
          <p className="text-lg font-bold mb-2">⚠️ Game Error</p>
          <p className="text-sm">Something went wrong loading the game.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded text-sm min-h-[44px]"
          >
            Reload Game
          </button>
        </div>
      );
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <div 
          ref={modalRef}
          className={`modal-content bg-white max-w-4xl ${swipeClasses}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="game-modal-title"
        >
          {/* Swipe indicator */}
          <div className="modal-swipe-indicator" />
          
          <div className="modal-scrollable">
            <div className="flex justify-between items-center mb-4 p-4">
              <h3 id="game-modal-title" className="text-xl font-bold text-gray-800">
                🐍 Snake Game
              </h3>
              <button
                onClick={onClose}
                className="modal-close-button"
                aria-label="Close game modal"
              >
                ×
              </button>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-4 min-h-[400px] flex items-center justify-center relative mx-4">
              {renderGame()}
            </div>
            
            {/* Game controls */}
            <div className="p-4">
              <div className="flex justify-center items-center gap-4 mb-4">
                <span className="text-lg font-semibold text-gray-700">Score: {score}</span>
              </div>
              
              <div className="modal-actions">
                <button 
                  onClick={onClose}
                  className="modal-button modal-button-primary"
                >
                  Close Game
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// Craving Support View - Support for Managing Cravings
const CravingSupportView = ({ user, nemesis, onBackToLogin, onResetForTesting, onBreathingComplete, setActiveTab, behavioralService }) => {
  const [showGameModal, setShowGameModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showCustomPopup, setShowCustomPopup] = useState(false);
  const [popupData, setPopupData] = useState({ title: '', message: '', type: 'info' });
  const [statManager, setStatManager] = useState(null);
  const [showHydrationModal, setShowHydrationModal] = useState(false);
  const [dailyWater, setDailyWater] = useState(0);
  const [showBreathingModal, setShowBreathingModal] = useState(false);
  
  // New craving assessment state
  const [showCravingAssessment, setShowCravingAssessment] = useState(false);
  const [assessmentStep, setAssessmentStep] = useState(1);
  const [cravingData, setCravingData] = useState({
    strength: 5,
    mood: '',
    context: '',
    outcome: '',
    // Enhanced fields for better analysis
    copingStrategy: '',
    location: '',
    timeOfDay: '',
    triggerType: ''
  });
  
  // Weekly statistics state
  const [weeklyStats, setWeeklyStats] = useState({
    resisted: 0,
    relapses: 0
  });
  
  // Daily craving logs tracking
  const [dailyCravingLogs, setDailyCravingLogs] = useState(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const showQuickActionPopup = (title, message, type = 'info') => {
    console.log('🔄 showQuickActionPopup called:', { title, message, type });
    setPopupData({ title, message, type });
    setShowCustomPopup(true);
    console.log('✅ showQuickActionPopup: Popup data set and showCustomPopup set to true');
  };

  // Make showQuickActionPopup globally accessible for milestone notifications
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      window.showQuickActionPopup = showQuickActionPopup;
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        delete window.showQuickActionPopup;
      }
    };
  }, []);

  // Initialize StatManager and load cravings resisted
  useEffect(() => {
    if (!user?.uid) return;

    // Clear any previous user's hydration data from state
    setDailyWater(0);

    // Initialize StatManager
    const initializeStatManager = async () => {
      try {
        const manager = new StatManager(db, user.uid);
        await manager.initialize();
        setStatManager(manager);
      } catch (error) {
        console.error('Error initializing StatManager:', error);
      }
    };

    initializeStatManager();

    // Load daily craving logs count
    const loadDailyCravingLogs = async () => {
      try {
        const today = new Date().toDateString();
        const { ref, get } = await import('firebase/database');
        
        // Try Firebase first
        try {
          const logsRef = ref(db, `users/${user.uid}/profile/dailyCravingLogs/${today}`);
          const snapshot = await get(logsRef);
          
          if (snapshot.exists()) {
            const logs = snapshot.val();
            setDailyCravingLogs(logs.count || 0);
          } else {
            setDailyCravingLogs(0);
          }
        } catch (firebaseError) {
          // Fallback to localStorage
          const localStorageKey = `cravingLogs_${user.uid}_${today}`;
          const storedLogs = localStorage.getItem(localStorageKey);
          if (storedLogs) {
            const logs = JSON.parse(storedLogs);
            setDailyCravingLogs(logs.count || 0);
          } else {
            setDailyCravingLogs(0);
          }
        }
      } catch (error) {
        console.error('Error loading daily craving logs:', error);
        setDailyCravingLogs(0);
      }
    };

    // Load daily craving logs
    loadDailyCravingLogs();

    // Load weekly craving statistics
    const loadWeeklyStats = async () => {
      try {
        const { ref: firebaseRef, get: firebaseGet, onValue, query: firebaseQuery, orderByChild: orderByChild1, startAt: startAt1, endAt: endAt1, set } = await import('firebase/database');
        
        // Calculate date range for last 7 days
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
        const startDate = sevenDaysAgo.toDateString();
        const endDate = now.toDateString();
        
        // Try to load from Firebase first
        try {
          const statsRef = firebaseRef(db, `users/${user.uid}/profile/cravingStats`);
          const snapshot = await firebaseGet(statsRef);
          
          if (snapshot.exists()) {
            const stats = snapshot.val();
            // Check if stats are from this week
            if (stats.lastUpdated && new Date(stats.lastUpdated) > sevenDaysAgo) {
              setWeeklyStats(stats);
              return;
            }
          }
        } catch (firebaseError) {
          console.log('Firebase stats not available, calculating from cravings data');
        }
        
        // Calculate weekly stats from individual cravings
        const { ref: dbRef, get: dbGet, query: dbQuery, orderByChild: orderByChild2, startAt: startAt2, endAt: endAt2 } = await import('firebase/database');
        const cravingsRef = dbRef(db, `users/${user.uid}/cravings`);
        const cravingsQuery = dbQuery(cravingsRef, orderByChild2('date'), startAt2(startDate), endAt2(endDate));
        
        try {
          const cravingsSnapshot = await dbGet(cravingsQuery);
          let resisted = 0;
          let relapses = 0;
          
          console.log(`🔍 Weekly Stats: Checking cravings for ${startDate} to ${endDate}`);
          console.log(`🔍 Weekly Stats: Cravings snapshot exists: ${cravingsSnapshot.exists()}`);
          
          if (cravingsSnapshot.exists()) {
            const cravingsData = cravingsSnapshot.val();
            console.log(`🔍 Weekly Stats: Raw cravings data:`, cravingsData);
            
            cravingsSnapshot.forEach((childSnapshot) => {
              const craving = childSnapshot.val();
              console.log(`🔍 Weekly Stats: Individual craving:`, craving);
              if (craving.outcome === 'resisted') {
                resisted++;
              } else if (craving.outcome === 'relapsed') {
                relapses++;
              }
            });
          }
          
          console.log(`🔍 Weekly Stats: Calculated - resisted: ${resisted}, relapses: ${relapses}`);
          
          const weeklyStats = { resisted, relapses, lastUpdated: now.toISOString() };
          setWeeklyStats(weeklyStats);
          
          // Save calculated stats to Firebase
          try {
            const statsRef = firebaseRef(db, `users/${user.uid}/profile/cravingStats`);
            await set(statsRef, weeklyStats);
          } catch (saveError) {
            console.log('Could not save weekly stats to Firebase, using localStorage');
          }
          
          // Save to localStorage as fallback
          localStorage.setItem(`cravingStats_${user.uid}`, JSON.stringify(weeklyStats));
          
        } catch (queryError) {
          console.log('Could not query cravings, using localStorage fallback');
          // Fallback to localStorage
          const localStats = JSON.parse(localStorage.getItem(`cravingStats_${user.uid}`) || '{"resisted": 0, "relapses": 0}');
          setWeeklyStats(localStats);
        }
        
        // Set up real-time listener for stats updates
        const statsRef = firebaseRef(db, `users/${user.uid}/profile/cravingStats`);
        const unsubscribe = onValue(statsRef, (snapshot) => {
          if (snapshot.exists()) {
            setWeeklyStats(snapshot.val());
          }
        });
        
        return unsubscribe;
      } catch (error) {
        console.error('Error loading weekly stats:', error);
        // Fallback to localStorage with user-specific key
        const localStats = JSON.parse(localStorage.getItem(`cravingStats_${user.uid}`) || '{"resisted": 0, "relapses": 0}');
        setWeeklyStats(localStats);
      }
    };

    loadWeeklyStats();
    
    // Load daily water intake
    const loadDailyWater = async () => {
      try {
        const { ref, get, onValue } = await import('firebase/database');
        const today = new Date().toDateString();
        const waterRef = ref(db, `users/${user.uid}/profile/daily/${today}/water`);
        
        // Load initial value
        const snapshot = await get(waterRef);
        if (snapshot.exists()) {
          setDailyWater(snapshot.val() || 0);
        } else {
          // Fallback to localStorage - use user-specific key
          const localWater = parseInt(localStorage.getItem(`water_${user.uid}_${today}`) || 0);
          setDailyWater(localWater);
        }
        
        // Set up real-time listener
        const unsubscribe = onValue(waterRef, (snapshot) => {
          if (snapshot.exists()) {
            setDailyWater(snapshot.val() || 0);
          }
        });
        
        return unsubscribe;
      } catch (error) {
        console.error('Error loading daily water from Firebase:', error);
        // Fallback to localStorage - use user-specific key
        const today = new Date().toDateString();
        const localWater = parseInt(localStorage.getItem(`water_${user.uid}_${today}`) || 0);
        setDailyWater(localWater);
      }
    };

    loadDailyWater();

    // Cleanup function to clear user data when user changes
    return () => {
      setDailyWater(0);
      setShowHydrationModal(false);
      setWeeklyStats({ resisted: 0, relapses: 0 });
      setShowCravingAssessment(false);
      setAssessmentStep(1);
      setCravingData({ strength: 5, mood: '', context: '', outcome: '' });
      setDailyCravingLogs(0);
      setShowSuccessMessage(false);
      setSuccessMessage('');
    };
  }, [user?.uid]);



  const handleMiniGame = () => {
    setSelectedGame('snake');
    setShowGameModal(true);
  };

  const closeGame = () => {
    setSelectedGame(null);
    setShowGameModal(false);
  };

  const handleCravingResistance = async () => {
    try {
      // Update local storage as fallback
      const currentWins = cravingsResisted;
      localStorage.setItem('cravingWins', currentWins + 1);
      
      // Update cravings resisted in profile
      if (user && user.uid) {
        const { ref, set } = await import('firebase/database');
        const cravingsRef = ref(db, `users/${user.uid}/profile/cravingsResisted`);
        await set(cravingsRef, currentWins + 1);
        
        // Update local state
        setCravingsResisted(currentWins + 1);
        
        console.log('Cravings resisted updated in profile:', currentWins + 1);
      }
      
      // Use StatManager to handle stat updates
      if (statManager) {
        await statManager.handleCravingResistance();
      }
      
      // Show success popup
      setPopupData({
        title: 'Congratulations!',
        message: '🎉 Great job resisting that craving!\n\nEvery trigger survival increases:\n• Mental Strength +1 point\n• Trigger Defense +3 points\n\nKeep up the amazing work!',
        type: 'success'
      });
      setShowCustomPopup(true);
      
    } catch (error) {
      console.error('Error updating stats:', error);
      // Still show success message even if Firebase update fails
      setPopupData({
        title: 'Congratulations!',
        message: '🎉 Great job resisting that craving!\n\nYour progress has been recorded locally.\n\nKeep up the amazing work!',
        type: 'success'
      });
      setShowCustomPopup(true);
    }
  };


  const handleWaterIntake = async () => {
    // Verify user is authenticated before proceeding
    if (!user?.uid) {
      console.warn('Cannot log water: No authenticated user');
      return;
    }

    try {
      const newWaterCount = Math.min(dailyWater + 1, 6);
      setDailyWater(newWaterCount);
      const today = new Date().toDateString();
      
      // Use StatManager to handle hydration tracking and streaks
      if (statManager) {
        await statManager.handleHydrationUpdate(newWaterCount);
        
        // ALSO log hydration to Firestore for predictive analytics
        if (behavioralService) {
          try {
            const hydrationStreak = await statManager.checkHydrationStreak();
            await behavioralService.logHydration(user.uid, {
              glassesConsumed: newWaterCount,
              targetGlasses: 6,
              currentStreak: hydrationStreak
            });
            console.log('✅ Hydration also logged to Firestore for analytics');
          } catch (firestoreError) {
            console.warn('⚠️ Could not log hydration to Firestore:', firestoreError.message);
            // Queue for offline sync if Firestore fails
            await handleOfflineBehavioralLog('hydration', {
              glassesConsumed: newWaterCount,
              targetGlasses: 6,
              currentStreak: await statManager.checkHydrationStreak()
            });
          }
        } else {
          // Queue for offline sync if behavioral service not available
          await handleOfflineBehavioralLog('hydration', {
            glassesConsumed: newWaterCount,
            targetGlasses: 6,
            currentStreak: await statManager.checkHydrationStreak()
          });
        }
        
        // If we just reached 6 glasses, check for mental strength bonus
        if (newWaterCount === 6 && dailyWater === 5) {
          // Check if this is the 3rd consecutive day with 6 glasses
          const hydrationStreak = await statManager.checkHydrationStreak();
          if (hydrationStreak >= 3) {
            // Award mental strength point
            await statManager.updateStat('mentalStrength', 1, '3-day hydration streak');
            console.log('Mental Strength +1 for 3-day hydration streak!');
          }
        }
      }
      
      // Save to Firebase
      const { ref, set } = await import('firebase/database');
      const waterRef = ref(db, `users/${user.uid}/profile/daily/${today}/water`);
      await set(waterRef, newWaterCount);
      
      // Fallback to localStorage if Firebase fails - use user-specific key
      localStorage.setItem(`water_${user.uid}_${today}`, newWaterCount.toString());
      
      console.log('Water intake updated:', newWaterCount);
    } catch (error) {
      console.error('Error updating water intake:', error);
      // Still update local state even if Firebase update fails
      const newWaterCount = Math.min(dailyWater + 1, 6);
      setDailyWater(newWaterCount);
      const today = new Date().toDateString();
      localStorage.setItem(`water_${user.uid}_${today}`, newWaterCount.toString());
    }
  };

  // New craving assessment functions
  const startCravingAssessment = () => {
    setCravingData({ strength: 5, mood: '', context: '', outcome: '' });
    setAssessmentStep(1);
    setShowCravingAssessment(true);
  };

  const nextStep = () => {
    if (assessmentStep < 4) {
      setAssessmentStep(assessmentStep + 1);
    }
  };

  const prevStep = () => {
    if (assessmentStep > 1) {
      setAssessmentStep(assessmentStep - 1);
    }
  };

  const completeAssessment = async (outcome) => {
    try {
      const timestamp = new Date().toISOString();
      const date = new Date().toDateString();
      
      // Prepare enhanced craving data with additional context
      const now = new Date();
      const finalCravingData = {
        ...cravingData,
        outcome,
        timestamp,
        date,
        // Enhanced metadata for better analysis
        timeOfDay: now.getHours() < 12 ? 'morning' : now.getHours() < 17 ? 'afternoon' : 'evening',
        dayOfWeek: now.toLocaleDateString('en-US', { weekday: 'long' }),
        weekOfYear: Math.ceil((now.getDate() + new Date(now.getFullYear(), 0, 1).getDay()) / 7),
        month: now.toLocaleDateString('en-US', { month: 'long' }),
        year: now.getFullYear(),
        // User context
        userId: user?.uid,
        // Session context
        sessionId: Date.now().toString(),
        // Device context (basic)
        userAgent: navigator.userAgent.substring(0, 100),
        // Enhanced outcome tracking
        outcomeDetails: {
          resisted: outcome === 'resisted',
          relapsed: outcome === 'relapsed',
          logged: outcome === 'logged',
          usedPractices: outcome === 'resistance_practices'
        }
      };

      // Update daily craving logs count
      const today = new Date().toDateString();
      const newCount = dailyCravingLogs + 1;
      setDailyCravingLogs(newCount);
      
      // Initialize newStats variable
      let newStats = {
        resisted: weeklyStats.resisted,
        relapses: weeklyStats.relapses,
        lastUpdated: timestamp
      };
      
      // Award awareness bonuses only for first 2 logs per day
      let statBonusAwarded = false;
      if (newCount <= 2 && statManager) {
        await statManager.handleCravingLogged();
        statBonusAwarded = true;
      }
      
      // Import Firebase functions at function scope
      const { ref, set, push, get } = await import('firebase/database');
      
      // Save daily count to Firebase
      if (user && user.uid) {
        
        try {
          const logsRef = ref(db, `users/${user.uid}/profile/dailyCravingLogs/${today}`);
          await set(logsRef, { count: newCount, lastUpdated: timestamp });
        } catch (firebaseError) {
          // Fallback to localStorage
          const localStorageKey = `cravingLogs_${user.uid}_${today}`;
          localStorage.setItem(localStorageKey, JSON.stringify({ count: newCount, lastUpdated: timestamp }));
        }
        
        // Save individual craving record with enhanced structure
        const cravingsRef = ref(db, `users/${user.uid}/cravings`);
        const newCravingRef = push(cravingsRef);
        await set(newCravingRef, finalCravingData);
        
        // ALSO save to Firestore for predictive analytics
        if (behavioralService) {
          try {
            await behavioralService.logCraving(user.uid, {
              outcome: 'resisted',
              strength: cravingData.strength,
              duration: cravingData.duration,
              context: 'detailed_assessment',
              triggers: cravingData.triggers || [],
              mood: cravingData.mood,
              stressLevel: cravingData.stressLevel,
              copingStrategiesUsed: cravingData.copingStrategies || [],
              location: cravingData.location,
              socialSituation: cravingData.socialSituation
            });
            console.log('✅ Craving also logged to Firestore for analytics');
          } catch (firestoreError) {
            console.warn('⚠️ Could not log craving to Firestore:', firestoreError.message);
            // Queue for offline sync if Firestore fails
            await handleOfflineBehavioralLog('craving', {
              outcome: 'resisted',
              strength: cravingData.strength,
              duration: cravingData.duration,
              context: 'detailed_assessment',
              triggers: cravingData.triggers || [],
              mood: cravingData.mood,
              stressLevel: cravingData.stressLevel,
              copingStrategiesUsed: cravingData.copingStrategies || [],
              location: cravingData.location,
              socialSituation: cravingData.socialSituation
            });
          }
        }
        
        // Initialize variables for organized collections
        let historyData = [];
        let monthHistory = [];
        
        // Also save to organized collections for easier analysis
        try {
          const organizedRef = ref(db, `users/${user.uid}/profile/cravingHistory/${today}`);
          const todayHistory = await get(organizedRef);
          historyData = todayHistory.exists() ? todayHistory.val() : [];
          historyData.push({
            id: newCravingRef.key,
            strength: finalCravingData.strength,
            mood: finalCravingData.mood,
            context: finalCravingData.context,
            outcome: finalCravingData.outcome,
            timestamp: finalCravingData.timestamp,
            timeOfDay: finalCravingData.timeOfDay
          });
          await set(organizedRef, historyData);
          console.log(`📅 Daily history updated for ${today}:`, historyData.length, 'records');
        } catch (error) {
          console.warn('⚠️ Could not save to daily history:', error);
        }
        
        // Calculate month key for trend analysis
        const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        
        // Save to monthly collection for trend analysis
        try {
          const monthlyRef = ref(db, `users/${user.uid}/profile/cravingTrends/${monthKey}`);
          const monthlyData = await get(monthlyRef);
          monthHistory = monthlyData.exists() ? monthlyData.val() : [];
          monthHistory.push({
            id: newCravingRef.key,
            date: finalCravingData.date,
            strength: finalCravingData.strength,
            outcome: finalCravingData.outcome,
            timeOfDay: finalCravingData.timeOfDay
          });
          await set(monthlyRef, monthHistory);
          console.log(`📊 Monthly trends updated for ${monthKey}:`, monthHistory.length, 'records');
        } catch (error) {
          console.warn('⚠️ Could not save to monthly trends:', error);
        }
        
        // Update weekly statistics based on outcome
        const statsRef = ref(db, `users/${user.uid}/profile/cravingStats`);
        
        if (outcome === 'resisted') {
          // User successfully resisted - this counts as actual resistance
          newStats.resisted = weeklyStats.resisted + 1;
          
          // Check daily limits before giving resistance bonuses
          let resistanceLimits = null;
          let canAwardMentalStrength = true;
          
          // Use CentralizedStatService for ALL users (universal system)
          if (window.centralizedStatService) {
            console.log('🔄 Detailed Assessment: Using CentralizedStatService...');
            
            // Check daily mental strength limit before processing
            const currentStats = await window.centralizedStatService.getCurrentStats();
            const dailyMentalStrengthBonus = currentStats?.mentalStrengthCravingsApplied || 0;
            
            if (dailyMentalStrengthBonus >= 3) {
              // User has reached daily limit for mental strength bonus
              canAwardMentalStrength = false;
              console.log('🔄 Detailed Assessment: Daily mental strength limit reached');
            }
            
            // Process the craving resistance
            await window.centralizedStatService.handleCravingResisted();
            console.log('✅ Detailed Assessment: Stats updated via CentralizedStatService');
          }
          // Fallback to StatManager (legacy support)
          else if (statManager) {
            resistanceLimits = await statManager.checkDailyCravingResistanceLimits(today);
            await statManager.handleCravingResistance();
          }
          
          // Store resistance limits for message display
          finalCravingData.resistanceLimits = {
            ...resistanceLimits,
            canAwardMentalStrength
          };
        } else if (outcome === 'relapsed') {
          newStats.relapses = weeklyStats.relapses + 1;
          
          // Handle relapse
          if (statManager) {
            console.log('🔄 Detailed Craving: Calling StatManager.handleRelapse()...');
            const relapseResult = await statManager.handleRelapse();
            console.log('🔄 Detailed Craving: StatManager.handleRelapse() result:', relapseResult);
            
            // ALSO log relapse to Firestore for predictive analytics
            if (behavioralService) {
              try {
                const escalationLevel = await statManager.getCurrentEscalationLevel();
                await behavioralService.logRelapse(user.uid, {
                  escalationLevel: escalationLevel,
                  triggers: cravingData.triggers || [],
                  mood: cravingData.mood,
                  stressLevel: cravingData.stressLevel,
                  location: cravingData.location,
                  socialSituation: cravingData.socialSituation,
                  copingAttempts: cravingData.copingStrategies || [],
                  addictionIncrease: escalationLevel === 1 ? 4 : escalationLevel === 2 ? 6 : 8,
                  mentalStrengthDecrease: 3,
                  triggerDefenseDecrease: 3
                });
                console.log('✅ Relapse also logged to Firestore for analytics');
              } catch (firestoreError) {
                console.warn('⚠️ Could not log relapse to Firestore:', firestoreError.message);
                // Queue for offline sync if Firestore fails (critical data)
                await handleOfflineBehavioralLog('relapse', {
                  escalationLevel: await statManager.getCurrentEscalationLevel(),
                  triggers: cravingData.triggers || [],
                  mood: cravingData.mood,
                  stressLevel: cravingData.stressLevel,
                  location: cravingData.location,
                  socialSituation: cravingData.socialSituation,
                  copingAttempts: cravingData.copingStrategies || [],
                  addictionIncrease: escalationLevel === 1 ? 4 : escalationLevel === 2 ? 6 : 8,
                  mentalStrengthDecrease: 3,
                  triggerDefenseDecrease: 3
                });
              }
            }
          } else {
            console.error('❌ Detailed Craving: StatManager not available!');
          }
          
          // Refresh stats display after relapse - IMMEDIATE refresh
          console.log('🔄 Detailed Craving: Triggering stats refresh...');
          if (typeof refreshStats === 'function') {
            refreshStats(); // Immediate refresh
            setTimeout(() => {
              console.log('🔄 Detailed Craving: Secondary stats refresh...');
              refreshStats();
            }, 1500); // Secondary refresh to ensure Firebase sync
          } else {
            console.error('❌ Detailed Craving: refreshStats function not available!');
          }
          
          // Also refresh Arena stats immediately
          if (typeof window.refreshArenaStats === 'function') {
            console.log('🔄 Detailed Craving: Refreshing Arena stats...');
            window.refreshArenaStats();
            setTimeout(() => {
              console.log('🔄 Detailed Craving: Secondary Arena stats refresh...');
              window.refreshArenaStats();
            }, 2000);
          } else {
            console.warn('⚠️ Detailed Craving: window.refreshArenaStats not available');
          }
          
          // PWA-specific refresh: Force immediate UI update after relapse
          console.log('🔄 Detailed Craving: Triggering immediate PWA refresh...');
          
          // Immediate refresh - no delays
          if (typeof window.refreshArenaStats === 'function') {
            console.log('🔄 Detailed Craving: Immediate Arena stats refresh...');
            window.refreshArenaStats();
          }
          
          // Force immediate re-render by updating user state
          if (typeof setUser === 'function') {
            setUser(prevUser => ({ ...prevUser, lastRelapseRefresh: Date.now() }));
          }
          
          // Force ArenaView re-render
          setStatsUpdateTrigger(prev => prev + 1);
          
          // Force immediate stats update
          if (window.centralizedStatService) {
            window.centralizedStatService.getCurrentStats().then(latestStats => {
              console.log('🔄 Detailed Craving: Fetched latest stats after relapse:', latestStats);
              if (typeof window.setLatestUserStats === 'function') {
                window.setLatestUserStats(latestStats);
              }
            }).catch(error => {
              console.error('❌ Detailed Craving: Failed to fetch latest stats:', error);
            });
          }
          
          // Additional immediate refresh attempts
          setTimeout(() => {
            console.log('🔄 Detailed Craving: Secondary immediate refresh...');
            if (typeof window.refreshArenaStats === 'function') {
              window.refreshArenaStats();
            }
            // Force a complete re-render
            window.dispatchEvent(new Event('resize'));
          }, 100);
          
          setTimeout(() => {
            console.log('🔄 Detailed Craving: Tertiary immediate refresh...');
            if (typeof window.refreshArenaStats === 'function') {
              window.refreshArenaStats();
            }
          }, 500);
          
          // Note: Buddy will see these changes automatically via Firebase listeners
        }
        // For 'resistance_practices' and 'logged', newStats remains unchanged
        
        await set(statsRef, newStats);
        setWeeklyStats(newStats);
        
        console.log('📊 Craving assessment saved to database:', {
          userId: user.uid,
          cravingId: newCravingRef.key,
          data: finalCravingData,
          databasePaths: {
            main: `users/${user.uid}/cravings/${newCravingRef.key}`,
            dailyHistory: `users/${user.uid}/profile/cravingHistory/${today}`,
            monthlyTrends: `users/${user.uid}/profile/cravingTrends/${monthKey}`,
            weeklyStats: `users/${user.uid}/profile/cravingStats`,
            dailyLogs: `users/${user.uid}/profile/dailyCravingLogs/${today}`
          },
          summary: {
            dailyHistoryRecords: historyData?.length || 0,
            monthlyTrendsRecords: monthHistory?.length || 0,
            monthKey: monthKey,
            today: today
          }
        });
      }
      
      // Fallback to localStorage with user-specific key
      const localCravings = JSON.parse(localStorage.getItem(`cravings_${user.uid}`) || '[]');
      localCravings.push(finalCravingData);
      localStorage.setItem(`cravings_${user.uid}`, JSON.stringify(localCravings));
      
      // Save weekly stats to localStorage
      localStorage.setItem(`cravingStats_${user.uid}`, JSON.stringify(newStats));
      
      // Show appropriate message
      if (outcome === 'resisted') {
        // Check if we have resistance limits to determine the message
        if (finalCravingData.resistanceLimits) {
          const limits = finalCravingData.resistanceLimits;
          
          if (!limits.canAwardMentalStrength && !limits.canAwardTriggerDefense) {
            // Both limits reached
            setPopupData({
              title: '🎯 Daily Limits Reached',
              message: 'You\'ve reached your daily limits for Mental Strength (3 points) and Trigger Defense (5 points).\n\nGreat job staying consistent! Come back tomorrow for more opportunities to grow.',
              type: 'info'
            });
          } else if (!limits.canAwardMentalStrength) {
            // Only mental strength limit reached
            setPopupData({
              title: '🎯 Mental Strength Limit Reached',
              message: 'You\'ve reached your daily limit for Mental Strength (3 points).\n\nYour Trigger Defense increased by 3 points!\n\nCome back tomorrow for more Mental Strength opportunities.',
              type: 'info'
            });
          } else if (!limits.canAwardTriggerDefense) {
            // Only trigger defense limit reached
            setPopupData({
              title: '🎯 Trigger Defense Limit Reached',
              message: 'You\'ve reached your daily limit for Trigger Defense (5 points).\n\nYour Mental Strength increased by 1 point!\n\nCome back tomorrow for more Trigger Defense opportunities.',
              type: 'info'
            });
          } else {
            // Both stats awarded - show remaining mental strength points
            const currentStats = await window.centralizedStatService?.getCurrentStats();
            const remainingMentalStrength = 3 - ((currentStats?.mentalStrengthCravingsApplied || 0) + 1);
            
            if (remainingMentalStrength > 0) {
              setPopupData({
                title: '🎉 Great Job!',
                message: `You successfully resisted that craving!\n\nYour Mental Strength increased by 1 point (${remainingMentalStrength} more today) and Trigger Defense increased by 3 points!\n\nPlus, you earned awareness bonuses for tracking your craving!`,
                type: 'success'
              });
            } else {
              setPopupData({
                title: '🎉 Great Job!',
                message: 'You successfully resisted that craving!\n\nYour Mental Strength increased by 1 point (daily max reached!) and Trigger Defense increased by 3 points!\n\nPlus, you earned awareness bonuses for tracking your craving!',
                type: 'success'
              });
            }
          }
        } else {
          // Fallback message if limits not available
          setPopupData({
            title: '🎉 Great Job!',
            message: 'You successfully resisted that craving!\n\nYour Mental Strength and Trigger Defense have increased significantly.\n\nPlus, you earned awareness bonuses for tracking your craving!',
            type: 'success'
          });
        }
      } else if (outcome === 'resistance_practices') {
        setPopupData({
          title: '🛡️ Stay Strong!',
          message: 'Stay strong! Use distraction or wellbeing practices to resist.\n\nYou earned awareness bonuses for tracking your craving!',
          type: 'info'
        });
      } else if (outcome === 'relapsed') {
        setPopupData({
          title: '💪 Don\'t Give Up',
          message: 'Relapses happen to everyone. The important thing is that you\'re here and trying again.\n\nYou still earned awareness bonuses for tracking your craving!',
          type: 'info'
        });
      } else if (outcome === 'logged') {
        if (statBonusAwarded) {
          setPopupData({
            title: '📝 Craving Logged',
            message: 'Great job tracking your craving!\n\nYou earned awareness bonuses for your self-awareness.\n\nThis helps build your Motivation and Trigger Defense.',
            type: 'info'
          });
        } else {
          setPopupData({
            title: '📝 Daily Limit Reached',
            message: 'Daily craving logging limit reached. Additional logs are recorded but won\'t award stat points until tomorrow.',
            type: 'info'
          });
        }
      } else {
        setPopupData({
          title: '📝 Progress Recorded',
          message: 'Your craving has been logged successfully.\n\nYou earned awareness bonuses for tracking your craving!',
          type: 'info'
        });
      }
      
      setShowCustomPopup(true);
      setShowCravingAssessment(false);
      setAssessmentStep(1);
      
    } catch (error) {
      console.error('Error saving craving assessment:', error);
      // Still show message even if save fails
      setPopupData({
        title: 'Progress Recorded',
        message: 'Your progress has been recorded locally.\n\nKeep up the great work!',
        type: 'info'
      });
      setShowCustomPopup(true);
      setShowCravingAssessment(false);
      setAssessmentStep(1);
    }
  };

  // Quick action functions
  const handleQuickResistance = async () => {
    try {
      const timestamp = new Date().toISOString();
      const date = new Date().toDateString();
      
      // Initialize resistance limits variable
      let resistanceLimits = null;
      
      // Import Firebase functions at function scope
      const { ref, set, push, get } = await import('firebase/database');
      
      // Save quick resistance
      if (user && user.uid) {
        
        // Save to cravings
        const cravingsRef = ref(db, `users/${user.uid}/cravings`);
        const newCravingRef = push(cravingsRef);
        await set(newCravingRef, {
          strength: 0,
          mood: 'quick',
          context: 'quick_action',
          outcome: 'resisted',
          timestamp,
          date
        });
        
        // Update weekly stats
        const statsRef = ref(db, `users/${user.uid}/profile/cravingStats`);
        const newStats = {
          resisted: weeklyStats.resisted + 1,
          relapses: weeklyStats.relapses,
          lastUpdated: timestamp
        };
        await set(statsRef, newStats);
        setWeeklyStats(newStats);
        
        // Use CentralizedStatService for ALL users (universal system)
        if (window.centralizedStatService) {
          console.log('🔄 Quick Resistance: Using CentralizedStatService...');
          
          // Check current mental strength bonus before processing
          const currentStats = await window.centralizedStatService.getCurrentStats();
          const dailyMentalStrengthBonus = currentStats?.mentalStrengthCravingsApplied || 0;
          console.log('🔄 Quick Resistance: Current mental strength bonus before processing:', dailyMentalStrengthBonus);
          
          // Always process the craving resistance first and use the result
          const result = await window.centralizedStatService.handleCravingResisted();
          console.log('✅ Quick Resistance: Stats updated via CentralizedStatService');
          
          if (result && result.applied) {
            // Use the actual cravings applied count from the result, not the pre-update value
            const cravingsApplied = result.cravingsApplied || 0;
            const remaining = Math.max(0, 3 - cravingsApplied);
            console.log('🔄 Quick Resistance: Bonus applied, remaining:', remaining);
            if (remaining > 0) {
              showQuickActionPopup(
                'Craving Resisted! 💪',
                `Great job! You earned +1 mental strength point. You can still earn ${remaining} more today.`,
                'success'
              );
            } else {
              showQuickActionPopup(
                'Craving Resisted! 💪',
                'Excellent! You\'ve reached the daily maximum of 3 mental strength points from craving resistance.',
                'success'
              );
            }
          } else {
            console.log('🔄 Quick Resistance: Daily limit reached, showing limit message');
            showQuickActionPopup(
              'Daily Mental Strength Limit Reached',
              'You\'ve already earned the maximum 3 mental strength points from craving resistance today. Keep up the great work! Your resistance still counts for your overall progress.',
              'info'
            );
          }
          
          // Refresh Arena stats immediately
          if (typeof window.refreshArenaStats === 'function') {
            console.log('🔄 Quick Resistance: Refreshing Arena stats...');
            window.refreshArenaStats();
            setTimeout(() => {
              console.log('🔄 Quick Resistance: Secondary Arena stats refresh...');
              window.refreshArenaStats();
            }, 1000);
          }
          
          // Return early to prevent fallback popup messages from overriding the correct ones
          return;
        } 
        // Fallback to StatManager (legacy support)
        else if (statManager) {
          resistanceLimits = await statManager.checkDailyCravingResistanceLimits(date);
          await statManager.handleCravingResistance();
        }
      }
      
      // Fallback to localStorage
      const localCravings = JSON.parse(localStorage.getItem(`cravings_${user.uid}`) || '[]');
      localCravings.push({
        strength: 0,
        mood: 'quick',
        context: 'quick_action',
        outcome: 'resisted',
        timestamp,
        date
      });
      localStorage.setItem(`cravings_${user.uid}`, JSON.stringify(localCravings));
      
      const newStats = {
        resisted: weeklyStats.resisted + 1,
        relapses: weeklyStats.relapses,
        lastUpdated: timestamp
      };
      localStorage.setItem(`cravingStats_${user.uid}`, JSON.stringify(newStats));
      setWeeklyStats(newStats);
      
      // Show appropriate message based on daily limits
      if (resistanceLimits) {
        if (!resistanceLimits.canAwardMentalStrength && !resistanceLimits.canAwardTriggerDefense) {
          // Both limits reached
          setPopupData({
            title: '🎯 Daily Limits Reached',
            message: 'You\'ve reached your daily limits for Mental Strength (3 points) and Trigger Defense (5 points).\n\nGreat job staying consistent! Come back tomorrow for more opportunities to grow.',
            type: 'info'
          });
        } else if (!resistanceLimits.canAwardMentalStrength) {
          // Only mental strength limit reached
          setPopupData({
            title: '🎯 Mental Strength Limit Reached',
            message: 'You\'ve reached your daily limit for Mental Strength (3 points).\n\nYour Trigger Defense increased by 3 points!\n\nCome back tomorrow for more Mental Strength opportunities.',
            type: 'info'
          });
        } else if (!resistanceLimits.canAwardTriggerDefense) {
          // Only trigger defense limit reached
          setPopupData({
            title: '🎯 Trigger Defense Limit Reached',
            message: 'You\'ve reached your daily limit for Trigger Defense (5 points).\n\nYour Mental Strength increased by 1 point!\n\nCome back tomorrow for more Trigger Defense opportunities.',
            type: 'info'
          });
        } else {
          // Both stats awarded
          setPopupData({
            title: '🎉 Quick Win!',
            message: 'Great job resisting that craving!\n\nYour Mental Strength increased by 1 point and Trigger Defense increased by 3 points!',
            type: 'success'
          });
        }
      } else {
        // Fallback message if limits not available
        setPopupData({
          title: '🎉 Quick Win!',
          message: 'Great job resisting that craving!\n\nYour Mental Strength and Trigger Defense have increased.',
          type: 'success'
        });
      }
      setShowCustomPopup(true);
      
    } catch (error) {
      console.error('Error recording quick resistance:', error);
      setPopupData({
        title: 'Progress Recorded',
        message: 'Your progress has been recorded locally.',
        type: 'info'
      });
      setShowCustomPopup(true);
    }
  };

  const handleQuickRelapse = async () => {
    try {
      const timestamp = new Date().toISOString();
      const date = new Date().toDateString();
      
      // Save quick relapse
      if (user && user.uid) {
        const { ref, set, push } = await import('firebase/database');
        
        // Save to cravings
        const cravingsRef = ref(db, `users/${user.uid}/cravings`);
        const newCravingRef = push(cravingsRef);
        await set(newCravingRef, {
          strength: 0,
          mood: 'quick',
          context: 'quick_action',
          outcome: 'relapsed',
          timestamp,
          date
        });
        
        // Handle relapse with CentralizedStatService (universal system)
        if (window.centralizedStatService) {
          console.log('🔄 Quick Relapse: Using CentralizedStatService...');
          await window.centralizedStatService.handleRelapse();
          console.log('✅ Quick Relapse: Stats updated via CentralizedStatService');
          
          // Show encouraging message with stat changes
          showQuickActionPopup(
            '💔 Relapse Logged',
            `It's okay, setbacks happen. What matters is that you're getting back on track.\n\nYour stats have been updated with escalation penalties.\n\nKeep pushing forward! 💪`,
            'warning'
          );
        }
        // Fallback to StatManager (legacy support)
        else if (statManager) {
          console.log('🔄 Quick Relapse: Calling StatManager.handleRelapse()...');
          const relapseResult = await statManager.handleRelapse();
          console.log('🔄 Quick Relapse: StatManager.handleRelapse() result:', relapseResult);
          
          // ALSO log relapse to Firestore for predictive analytics
          if (behavioralService) {
            try {
              const escalationLevel = await statManager.getCurrentEscalationLevel();
              await behavioralService.logRelapse(user.uid, {
                escalationLevel: escalationLevel,
                triggers: user.triggers || [], // Use user's known triggers
                mood: 'quick',
                context: 'quick_action',
                addictionIncrease: escalationLevel === 1 ? 4 : escalationLevel === 2 ? 6 : 8,
                mentalStrengthDecrease: 3,
                triggerDefenseDecrease: 3
              });
              console.log('✅ Quick relapse also logged to Firestore for analytics');
            } catch (firestoreError) {
              console.warn('⚠️ Could not log quick relapse to Firestore:', firestoreError.message);
              // Queue for offline sync if Firestore fails (critical data)
              await handleOfflineBehavioralLog('relapse', {
                escalationLevel: await statManager.getCurrentEscalationLevel(),
                triggers: user.triggers || [],
                mood: 'quick',
                context: 'quick_action',
                addictionIncrease: escalationLevel === 1 ? 4 : escalationLevel === 2 ? 6 : 8,
                mentalStrengthDecrease: 3,
                triggerDefenseDecrease: 3
              });
            }
          }
          
          // IMMEDIATE verification: Check what's actually in Firebase right after StatManager update
          try {
            await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
            const { ref: dbRef, get } = await import('firebase/database');
            const verifySnapshot = await get(dbRef(db, `users/${user.uid}/stats`));
            if (verifySnapshot.exists()) {
              const verifyStats = verifySnapshot.val();
              console.log('🔍 Quick Relapse: VERIFICATION - Firebase stats immediately after StatManager:', verifyStats);
            } else {
              console.log('❌ Quick Relapse: VERIFICATION - No stats found in Firebase!');
            }
          } catch (verifyError) {
            console.error('❌ Quick Relapse: VERIFICATION failed:', verifyError);
          }
          
          // Get escalation info for encouraging message
          try {
            const escalationLevel = await statManager.getCurrentEscalationLevel();
            let addictionIncrease = 0;
            switch (escalationLevel) {
              case 1: addictionIncrease = 4; break;  // 1st relapse = +4 points
              case 2: addictionIncrease = 6; break;  // 2nd relapse within 7 days = +6 points
              default: addictionIncrease = 8; break; // 3rd+ relapse = +8 points
            }
            
            // Show encouraging message with stat changes
            showQuickActionPopup(
              '💔 Relapse Logged',
              `It's okay, setbacks happen. What matters is that you're getting back on track.\n\n📊 Stat Changes:\n• Addiction: +${addictionIncrease} points\n• Mental Strength: -3 points\n• Trigger Defense: -3 points\n\nYour journey continues! 💪`,
              'warning'
            );
          } catch (escalationError) {
            console.warn('Could not get escalation level for message:', escalationError);
            showQuickActionPopup(
              '💔 Relapse Logged',
              `It's okay, setbacks happen. What matters is that you're getting back on track.\n\nYour stats have been updated. Keep pushing forward! 💪`,
              'warning'
            );
          }
        } else {
          console.error('❌ Quick Relapse: StatManager not available!');
          showQuickActionPopup(
            '⚠️ Service Unavailable',
            'Stats service is not available. Your relapse has been recorded locally and will sync when the service is restored.',
            'warning'
          );
        }
        
        // Update weekly stats
        const statsRef = ref(db, `users/${user.uid}/profile/cravingStats`);
        const newStats = {
          resisted: weeklyStats.resisted,
          relapses: weeklyStats.relapses + 1,
          lastUpdated: timestamp
        };
        await set(statsRef, newStats);
        setWeeklyStats(newStats);
        
        // Refresh stats display after relapse - IMMEDIATE refresh
        console.log('🔄 Quick Relapse: Triggering stats refresh...');
        if (typeof refreshStats === 'function') {
          refreshStats(); // Immediate refresh
          setTimeout(() => {
            console.log('🔄 Quick Relapse: Secondary stats refresh...');
            refreshStats();
          }, 1500); // Secondary refresh to ensure Firebase sync
        } else {
          console.log('ℹ️ Quick Relapse: refreshStats function not available in this context (will refresh when returning to Arena)');
        }
        
        // Also refresh Arena stats immediately
        if (typeof window.refreshArenaStats === 'function') {
          console.log('🔄 Quick Relapse: Refreshing Arena stats...');
          window.refreshArenaStats();
          setTimeout(() => {
            console.log('🔄 Quick Relapse: Secondary Arena stats refresh...');
            window.refreshArenaStats();
          }, 2000);
        } else {
          console.warn('⚠️ Quick Relapse: window.refreshArenaStats not available');
        }
        
        // PWA-specific refresh: Force immediate UI update after relapse
        console.log('🔄 Quick Relapse: Triggering immediate PWA refresh...');
        
        // Immediate refresh - no delays
        if (typeof window.refreshArenaStats === 'function') {
          console.log('🔄 Quick Relapse: Immediate Arena stats refresh...');
          window.refreshArenaStats();
        }
        
        // Force immediate re-render by updating user state
        if (typeof setUser === 'function') {
          setUser(prevUser => ({ ...prevUser, lastRelapseRefresh: Date.now() }));
        }
        
        // Force ArenaView re-render
        setStatsUpdateTrigger(prev => prev + 1);
        
        // Force immediate stats update
        if (window.centralizedStatService) {
          window.centralizedStatService.getCurrentStats().then(latestStats => {
            console.log('🔄 Quick Relapse: Fetched latest stats after relapse:', latestStats);
            if (typeof window.setLatestUserStats === 'function') {
              window.setLatestUserStats(latestStats);
            }
          }).catch(error => {
            console.error('❌ Quick Relapse: Failed to fetch latest stats:', error);
          });
        }
        
        // Additional immediate refresh attempts
        setTimeout(() => {
          console.log('🔄 Quick Relapse: Secondary immediate refresh...');
          if (typeof window.refreshArenaStats === 'function') {
            window.refreshArenaStats();
          }
          // Force a complete re-render
          window.dispatchEvent(new Event('resize'));
        }, 100);
        
        setTimeout(() => {
          console.log('🔄 Quick Relapse: Tertiary immediate refresh...');
          if (typeof window.refreshArenaStats === 'function') {
            window.refreshArenaStats();
          }
        }, 500);
        
        // Note: Buddy will see these changes automatically via Firebase listeners
      }
      
      // Fallback to localStorage
      const localCravings = JSON.parse(localStorage.getItem(`cravings_${user.uid}`) || '[]');
      localCravings.push({
        strength: 0,
        mood: 'quick',
        context: 'quick_action',
        outcome: 'relapsed',
        timestamp,
        date
      });
      localStorage.setItem(`cravings_${user.uid}`, JSON.stringify(localCravings));
      
      const newStats = {
        resisted: weeklyStats.resisted,
        relapses: weeklyStats.relapses + 1,
        lastUpdated: timestamp
      };
      localStorage.setItem(`cravingStats_${user.uid}`, JSON.stringify(newStats));
      setWeeklyStats(newStats);
      
      // Popup message is now shown directly after StatManager processes the relapse
      
    } catch (error) {
      console.error('Error recording quick relapse:', error);
      showQuickActionPopup(
        '💔 Relapse Logged',
        `It's okay, setbacks happen. What matters is that you're getting back on track.\n\nYour progress has been recorded locally and will sync when the connection is restored.\n\nKeep pushing forward! 💪`,
        'warning'
      );
    }
  };

  // Function to retrieve and analyze craving data for users
  const getCravingInsights = async (userId, days = 30) => {
    try {
      if (!userId) return null;
      
      const { ref, get, query, orderByChild, startAt, endAt } = await import('firebase/database');
      
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - (days * 24 * 60 * 60 * 1000));
      
      // Get craving records from the main collection
      const cravingsRef = ref(db, `users/${userId}/cravings`);
      const snapshot = await get(cravingsRef);
      
      if (!snapshot.exists()) {
        return {
          totalCravings: 0,
          resistedCount: 0,
          relapseCount: 0,
          averageStrength: 0,
          commonMoods: [],
          commonContexts: [],
          timeOfDayPatterns: {},
          weeklyTrends: {},
          insights: []
        };
      }
      
      const cravings = Object.values(snapshot.val() || {});
      const filteredCravings = cravings.filter(craving => {
        const cravingDate = new Date(craving.timestamp);
        return cravingDate >= startDate && cravingDate <= endDate;
      });
      
      if (filteredCravings.length === 0) {
        return {
          totalCravings: 0,
          resistedCount: 0,
          relapseCount: 0,
          averageStrength: 0,
          commonMoods: [],
          commonContexts: [],
          timeOfDayPatterns: {},
          weeklyTrends: {},
          insights: []
        };
      }
      
      // Calculate basic statistics
      const resistedCount = filteredCravings.filter(c => c.outcome === 'resisted').length;
      const relapseCount = filteredCravings.filter(c => c.outcome === 'relapsed').length;
      const totalCravings = filteredCravings.length;
      const averageStrength = filteredCravings.reduce((sum, c) => sum + (c.strength || 0), 0) / totalCravings;
      
      // Analyze patterns
      const moodCounts = {};
      const contextCounts = {};
      const timeOfDayCounts = {};
      const weeklyCounts = {};
      
      filteredCravings.forEach(craving => {
        // Count moods
        if (craving.mood) {
          moodCounts[craving.mood] = (moodCounts[craving.mood] || 0) + 1;
        }
        
        // Count contexts
        if (craving.context) {
          contextCounts[craving.context] = (contextCounts[craving.context] || 0) + 1;
        }
        
        // Count time of day
        if (craving.timeOfDay) {
          timeOfDayCounts[craving.timeOfDay] = (timeOfDayCounts[craving.timeOfDay] || 0) + 1;
        }
        
        // Count by week
        const cravingDate = new Date(craving.timestamp);
        const weekKey = `${cravingDate.getFullYear()}-W${Math.ceil((cravingDate.getDate() + new Date(cravingDate.getFullYear(), 0, 1).getDay()) / 7)}`;
        weeklyCounts[weekKey] = (weeklyCounts[weekKey] || 0) + 1;
      });
      
      // Get top patterns
      const commonMoods = Object.entries(moodCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([mood, count]) => ({ mood, count }));
      
      const commonContexts = Object.entries(contextCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([context, count]) => ({ context, count }));
      
      // Generate insights
      const insights = [];
      
      if (resistedCount > relapseCount) {
        insights.push("You're successfully resisting more cravings than giving in - great job!");
      }
      
      if (averageStrength > 7) {
        insights.push("Your cravings tend to be high intensity. Consider developing stronger coping strategies for intense moments.");
      }
      
      if (timeOfDayCounts.afternoon > timeOfDayCounts.morning && timeOfDayCounts.afternoon > timeOfDayCounts.evening) {
        insights.push("Afternoons seem to be your most challenging time. Consider planning activities or support during this period.");
      }
      
      if (commonMoods.length > 0 && commonMoods[0].count > totalCravings * 0.4) {
        insights.push(`You often experience cravings when feeling ${commonMoods[0].mood}. This might be a key trigger to address.`);
      }
      
      return {
        totalCravings,
        resistedCount,
        relapseCount,
        averageStrength: Math.round(averageStrength * 10) / 10,
        successRate: totalCravings > 0 ? Math.round((resistedCount / totalCravings) * 100) : 0,
        commonMoods,
        commonContexts,
        timeOfDayPatterns: timeOfDayCounts,
        weeklyTrends: weeklyCounts,
        insights,
        dateRange: {
          start: startDate.toDateString(),
          end: endDate.toDateString(),
          days
        }
      };
      
    } catch (error) {
      console.error('Error getting craving insights:', error);
      return null;
    }
  };

  // Function to export craving data for analysis
  const exportCravingData = async (userId, format = 'json') => {
    try {
      if (!userId) return null;
      
      const { ref, get } = await import('firebase/database');
      
      // Get all craving records
      const cravingsRef = ref(db, `users/${user.uid}/cravings`);
      const snapshot = await get(cravingsRef);
      
      if (!snapshot.exists()) {
        console.log('No craving data to export');
        return null;
      }
      
      const cravings = Object.values(snapshot.val() || {});
      
      if (format === 'json') {
        // Create downloadable JSON file
        const dataStr = JSON.stringify(cravings, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `craving-data-${userId}-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        
        console.log(`Exported ${cravings.length} craving records for user ${userId}`);
        return cravings.length;
      }
      
      return cravings.length;
      
    } catch (error) {
      console.error('Error exporting craving data:', error);
      return null;
    }
  };

  // Function to test craving insights
  const testCravingInsights = async () => {
    if (!user?.uid) {
      console.log('No user logged in');
      return;
    }
    
    console.log('🧪 Testing craving insights...');
    const insights = await getCravingInsights(user.uid, 30);
    
    if (insights) {
      console.log('📊 Craving Insights:', insights);
      
      // Show insights in popup
      setPopupData({
        title: '📊 Your Craving Insights',
        message: `Last 30 days:\n\n` +
                `Total cravings: ${insights.totalCravings}\n` +
                `Successfully resisted: ${insights.resistedCount}\n` +
                `Relapses: ${insights.relapseCount}\n` +
                `Success rate: ${insights.successRate}%\n` +
                `Average intensity: ${insights.averageStrength}/10\n\n` +
                `Top mood triggers: ${insights.commonMoods.map(m => `${m.mood} (${m.count})`).join(', ')}\n` +
                `Top contexts: ${insights.commonContexts.map(c => `${c.context} (${c.count})`).join(', ')}\n\n` +
                `Insights:\n${insights.insights.join('\n')}`,
        type: 'info'
      });
      setShowCustomPopup(true);
    } else {
      console.log('No insights available');
      setPopupData({
        title: '📊 No Data Yet',
        message: 'Start logging cravings to see insights and patterns!',
        type: 'info'
      });
      setShowCustomPopup(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-8 pb-20">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-start gap-3">
            <button
              onClick={onBackToLogin}
              className="px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              ← Back to Login
            </button>
            
            {process.env.NODE_ENV === 'development' && (
              <button
                onClick={onResetForTesting}
                className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors flex items-center gap-2"
                title="Reset ALL user data for testing - clears entire database"
              >
                🔄 Reset ALL User Data
              </button>
            )}
          </div>
        </div>

        {/* Main Craving Support Section - Modern Design */}
        <div className="bg-slate-800/30 rounded-2xl p-8 mb-8 border border-slate-600/30 shadow-xl">
          {/* Primary "I Feel Like Vaping" Button - Modern Card */}
          <div className="mb-8">
            <button
              onClick={startCravingAssessment}
              className="w-full bg-gradient-to-r from-orange-400 via-amber-500 to-orange-500 hover:from-orange-500 hover:via-amber-600 hover:to-orange-600 text-white font-semibold py-5 px-6 rounded-2xl text-lg transition-all duration-300 transform hover:scale-102 shadow-2xl border border-orange-300/30 hover:border-orange-300/50"
            >
              <div className="flex items-center justify-center gap-3">
                <span className="text-xl">⚠️</span>
                <span>I feel like vaping</span>
              </div>
            </button>
          </div>

          {/* Secondary Action Buttons - Pill-shaped with muted colors */}
          <div className="grid grid-cols-2 gap-6">
            <button
              onClick={handleQuickResistance}
              className="btn-success touch-interactive ripple-effect bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 font-medium py-3 px-5 rounded-full shadow-lg border border-slate-500/30 hover:border-slate-400/50 min-h-[44px]"
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-green-400">✅</span>
                <span>I resisted craving</span>
              </div>
            </button>
            <button
              onClick={handleQuickRelapse}
              className="btn-danger touch-interactive ripple-effect bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 font-medium py-3 px-5 rounded-full shadow-lg border border-slate-500/30 hover:border-slate-400/50 min-h-[44px]"
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-red-400">❌</span>
                <span>I relapsed</span>
              </div>
            </button>
          </div>
        </div>

        {/* Weekly Statistics Display - Modern Cards */}
        <div className="bg-slate-800/30 rounded-2xl p-6 mb-8 border border-slate-600/30 shadow-lg">
          <h2 className="text-lg font-medium text-slate-200 mb-6 text-center">📊 This Week</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center p-5 bg-slate-700/30 rounded-xl border border-slate-500/20 hover:border-slate-400/40 transition-all duration-300">
              <div className="text-2xl mb-3 text-green-400">🎯</div>
              <p className="text-2xl font-semibold text-white mb-1">{weeklyStats.resisted}</p>
              <p className="text-sm text-slate-300">Cravings Resisted</p>
            </div>
            <div className="text-center p-5 bg-slate-700/30 rounded-xl border border-slate-500/20 hover:border-slate-400/40 transition-all duration-300">
              <div className="text-2xl mb-3 text-red-400">💔</div>
              <p className="text-2xl font-semibold text-white mb-1">{weeklyStats.relapses}</p>
              <p className="text-sm text-slate-300">Relapses</p>
            </div>
          </div>
        </div>

        {/* Mini-Games Section - Modern Design */}
        <div className="bg-slate-800/30 rounded-2xl p-6 mb-8 border border-slate-600/30 shadow-lg">
          <div className="text-center">
            <h2 className="text-lg font-medium text-slate-200 mb-6">🎮 Distract Yourself</h2>
            <div className="flex justify-center">
              <button
                onClick={handleMiniGame}
                className="w-full max-w-xs bg-slate-700/30 hover:bg-slate-600/40 text-slate-200 font-medium py-4 px-6 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 border border-slate-500/20 hover:border-slate-400/40 shadow-lg min-h-[44px]"
              >
                🐍 Play Snake
              </button>
            </div>
          </div>
        </div>

        {/* Data Analysis Section - New */}
        <div className="bg-slate-800/30 rounded-2xl p-6 mb-8 border border-slate-600/30 shadow-lg">
          <div className="text-center">
            <h2 className="text-lg font-medium text-slate-200 mb-6">📊 Data Analysis</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={testCravingInsights}
                className="bg-blue-600/30 hover:bg-blue-500/40 text-blue-200 font-medium py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 border border-blue-500/20 hover:border-blue-400/40 shadow-lg min-h-[44px]"
              >
                🔍 View Insights
              </button>
              <button
                onClick={() => exportCravingData(user?.uid, 'json')}
                className="bg-green-600/30 hover:bg-green-500/40 text-green-200 font-medium py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 border border-green-500/20 hover:border-green-400/40 shadow-lg min-h-[44px]"
              >
                📥 Export Data
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions - Modern Design */}
        <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-600/30 shadow-lg">
          <h2 className="text-lg font-medium text-slate-200 mb-6 text-center">⚡ Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setShowHydrationModal(true)}
              className="btn-primary touch-interactive ripple-effect bg-slate-700/30 hover:bg-slate-600/40 text-slate-200 font-medium py-4 px-4 rounded-xl border border-slate-500/20 hover:border-slate-400/40 shadow-lg min-h-[44px]"
            >
              💧 Hydration
            </button>
            <button 
              onClick={() => setShowBreathingModal(true)}
              className="breathing-button touch-interactive ripple-effect bg-slate-700/30 hover:bg-slate-600/40 text-slate-200 font-medium py-4 px-4 rounded-xl border border-slate-500/20 hover:border-slate-400/40 shadow-lg min-h-[44px]"
            >
              🫁 Breathe
            </button>
            <button 
              onClick={async () => {
                // Show the action popup
                showQuickActionPopup(
                  '🚶‍♂️ Walk',
                  'Take a 5-minute walk:\n\nPhysical activity releases endorphins that can help reduce cravings.\n\nWalk around your room or step outside if possible.'
                );
                
                // Log physical activity to Firestore for analytics
                if (behavioralService) {
                  try {
                    await behavioralService.logPhysicalActivity(user.uid, {
                      type: 'walk',
                      duration: 5, // 5-minute walk
                      intensity: 'moderate',
                      triggerContext: 'craving-triggered',
                      location: 'indoor/outdoor'
                    });
                    console.log('✅ Physical activity (walk) logged to Firestore for analytics');
                  } catch (error) {
                    console.warn('⚠️ Could not log physical activity to Firestore:', error.message);
                    // Queue for offline sync if Firestore fails
                    await handleOfflineBehavioralLog('walk', {
                      type: 'walk',
                      duration: 5,
                      intensity: 'moderate',
                      triggerContext: 'craving-triggered',
                      location: 'indoor/outdoor'
                    });
                  }
                }
              }}
              className="bg-slate-700/30 hover:bg-slate-600/40 text-slate-200 font-medium py-4 px-4 rounded-xl transition-all duration-300 border border-slate-500/20 hover:border-slate-400/40 hover:scale-105 shadow-lg min-h-[44px]"
            >
              🚶‍♂️ Walk
            </button>
            <button 
              onClick={async () => {
                // Show the action popup
                showQuickActionPopup(
                  '🧘‍♀️ Meditate',
                  'Quick Meditation:\n\n1. Close your eyes\n2. Focus on your breath\n3. Count to 10 slowly\n4. Repeat 3 times\n\nThis helps calm your mind and reduce stress.'
                );
                
                // Log meditation to Firestore for analytics
                if (behavioralService) {
                  try {
                    await behavioralService.logMeditation(user.uid, {
                      type: 'mindfulness',
                      duration: 2, // 2-minute quick meditation
                      triggerContext: 'craving-triggered',
                      completed: true
                    });
                    console.log('✅ Meditation (quick) logged to Firestore for analytics');
                  } catch (error) {
                    console.warn('⚠️ Could not log meditation to Firestore:', error.message);
                  }
                }
              }}
              className="bg-slate-700/30 hover:bg-slate-600/40 text-slate-200 font-medium py-4 px-4 rounded-xl transition-all duration-300 border border-slate-500/20 hover:border-slate-400/40 hover:scale-105 shadow-lg min-h-[44px]"
            >
              🧘‍♀️ Meditate
            </button>
          </div>
        </div>

        {/* Game Modal */}
        {showGameModal && selectedGame && (
          <GameModal 
            gameType={selectedGame} 
            onClose={closeGame} 
          />
        )}

        {/* Custom Popup for Quick Actions and Messages */}
        <CustomPopup
          isOpen={showCustomPopup}
          onClose={() => setShowCustomPopup(false)}
          title={popupData.title}
          message={popupData.message}
          type={popupData.type}
        />

        {/* Hydration Modal */}
        {showHydrationModal && (
          <HydrationModal
            isOpen={showHydrationModal}
            onClose={() => setShowHydrationModal(false)}
            onLogWater={handleWaterIntake}
            currentWater={dailyWater}
            userId={user.uid}
          />
        )}

        {/* Breathing Modal */}
        {showBreathingModal && (
          <BreathingModal
            isOpen={showBreathingModal}
            onClose={() => setShowBreathingModal(false)}
            onComplete={onBreathingComplete}
            onNavigateToCravingSupport={() => setActiveTab('craving-support')}
          />
        )}

        {/* Craving Assessment Modal */}
        {showCravingAssessment && (
                  <CravingAssessmentModal
          isOpen={showCravingAssessment}
          onClose={() => setShowCravingAssessment(false)}
          step={assessmentStep}
          cravingData={cravingData}
          setCravingData={setCravingData}
          onNext={nextStep}
          onPrev={prevStep}
          onComplete={completeAssessment}
          dailyCravingLogs={dailyCravingLogs}
        />
        )}
      </div>
    </div>
  );
};

// Craving Assessment Modal - Multi-step craving assessment flow
const CravingAssessmentModal = ({ isOpen, onClose, step, cravingData, setCravingData, onNext, onPrev, onComplete, dailyCravingLogs }) => {


  // Function to get colors based on craving strength
  const getCravingColors = (strength) => {
    if (strength <= 3) {
      return {
        text: 'text-green-400',
        slider: '#22c55e', // Green for low cravings (good)
        shadow: 'rgba(74, 222, 128, 0.5)',
        label: 'Low',
        effect: 'craving-low',
        thumbClass: 'slider-thumb-green'
      };
    } else if (strength <= 7) {
      return {
        text: 'text-orange-400',
        slider: '#fbbf24', // Yellow for medium cravings (caution)
        shadow: 'rgba(249, 115, 22, 0.5)',
        label: 'Medium',
        effect: 'craving-medium',
        thumbClass: 'slider-thumb-orange'
      };
    } else {
      return {
        text: 'text-red-400',
        slider: '#ef4444', // Red for high cravings (danger)
        shadow: 'rgba(239, 68, 68, 0.5)',
        label: 'High',
        effect: 'craving-high',
        thumbClass: 'slider-thumb-red'
      };
    }
  };

  

  const moods = [
    { id: 'stressed', icon: '😰', label: 'Stressed' },
    { id: 'lonely', icon: '😔', label: 'Lonely' },
    { id: 'happy', icon: '😊', label: 'Happy' },
    { id: 'bored', icon: '😐', label: 'Bored' },
    { id: 'excited', icon: '🤩', label: 'Excited' },
    { id: 'down', icon: '😞', label: 'Down' },
    { id: 'angry', icon: '😠', label: 'Angry' },
    { id: 'anxious', icon: '😰', label: 'Anxious' }
  ];

  const contexts = [
    { id: 'break', icon: '☕', label: 'I\'m taking a break' },
    { id: 'partying', icon: '🎉', label: 'I\'m partying' },
    { id: 'drinking', icon: '🍺', label: 'I\'m drinking alcohol' },
    { id: 'car', icon: '🚗', label: 'I\'m in a car' },
    { id: 'coffee', icon: '☕', label: 'I\'m drinking coffee' },
    { id: 'eating', icon: '🍽️', label: 'I\'ve just finished eating' },
    { id: 'intimate', icon: '💕', label: 'I\'ve made love' },
    { id: 'tv', icon: '📺', label: 'I\'m watching TV' },
    { id: 'wake', icon: '🌅', label: 'I\'ve just woken up' }
  ];

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="text-center">
            <div className="mb-8">
              {(() => {
                const colors = getCravingColors(cravingData.strength);
                return (
                  <>
                    <div className={`text-6xl font-bold mb-2 ${colors.text} ${colors.effect}`}>
                      {cravingData.strength}
                    </div>
                    <div className={`text-lg font-medium mb-6 ${colors.text}`}>
                      {colors.label} Craving
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={cravingData.strength}
                      onChange={(e) => setCravingData({ ...cravingData, strength: parseInt(e.target.value) })}
                      style={{
                        background: `linear-gradient(to right, ${colors.slider} 0%, ${colors.slider} ${(cravingData.strength / 10) * 100}%, #475569 ${(cravingData.strength / 10) * 100}%, #475569 100%)`
                      }}
                      className={`w-full h-4 rounded-lg appearance-none cursor-pointer slider mb-4 ${colors.thumbClass}`}
                      autoComplete="off"
                    />
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Not at all</span>
                      <span>Extremely</span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="text-center">
            <div className="grid grid-cols-4 gap-3">
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => setCravingData({ ...cravingData, mood: mood.id })}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 min-h-[44px] ${
                    cravingData.mood === mood.id
                      ? 'border-blue-400 bg-blue-500/20'
                      : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                  }`}
                >
                  <div className="text-3xl mb-2">{mood.icon}</div>
                  <div className="text-xs text-gray-300">{mood.label}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-center">
            <div className="grid grid-cols-3 gap-3">
              {contexts.map((context) => (
                <button
                  key={context.id}
                  onClick={() => setCravingData({ ...cravingData, context: context.id })}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 min-h-[44px] ${
                    cravingData.context === context.id
                      ? 'border-blue-400 bg-blue-500/20'
                      : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                  }`}
                >
                  <div className="text-2xl mb-2">{context.icon}</div>
                  <div className="text-xs text-gray-300 text-center">{context.label}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center">
            <div className="space-y-4">
              <button
                onClick={() => onComplete('resisted')}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                💪 I successfully resisted
              </button>
              <button
                onClick={() => onComplete('resistance_practices')}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                🛡️ Use resistance practices
              </button>
              <button
                onClick={() => onComplete('logged')}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                📝 Just log this craving
              </button>
              <button
                onClick={() => onComplete('relapsed')}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                💔 I had a relapse
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <div className="modal-content bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 border-slate-600/50 relative overflow-hidden max-w-lg">
          <div className="absolute inset-0 bg-orange-500/5 pointer-events-none"></div>
        
        <div className="relative z-10">
          {/* Clean step indicator */}
          <div className="text-center mb-6">
            <div className="flex justify-center space-x-2 mb-3">
              {[1, 2, 3, 4].map((stepNumber) => (
                <div
                  key={stepNumber}
                  className={`w-3 h-3 rounded-full ${
                    stepNumber <= step ? 'bg-orange-400' : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-400 text-sm">Step {step} of 4</p>
            <div className="mt-2 text-xs text-gray-500">
              Daily logs: {dailyCravingLogs}/2
            </div>
          </div>

          {/* Step content */}
          <div className="mb-8">
            {renderStepContent()}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between">
            {step > 1 && (
              <button
                onClick={onPrev}
                className="px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white rounded-xl transition-colors"
              >
                ← Back
              </button>
            )}
            
            {step < 4 && (
              <button
                onClick={onNext}
                disabled={
                  (step === 1 && cravingData.strength === undefined) ||
                  (step === 2 && !cravingData.mood) ||
                  (step === 3 && !cravingData.context)
                }
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-xl transition-colors ml-auto"
              >
                Next →
              </button>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Hydration Modal Component with New Design
const HydrationModal = ({ isOpen, onClose, onLogWater, currentWater, userId }) => {
  const [hydrationStreak, setHydrationStreak] = useState(0);
  const [mentalStrengthProgress, setMentalStrengthProgress] = useState(0);
  const [isLoggingWater, setIsLoggingWater] = useState(false);
  const [showMentalStrengthInfo, setShowMentalStrengthInfo] = useState(false);
  
  // Load hydration streak and mental strength progress on mount
  useEffect(() => {
    if (isOpen && userId) {
      loadHydrationData();
    }
  }, [isOpen, userId, currentWater]);
  
  const loadHydrationData = async () => {
    try {
      const { ref, get } = await import('firebase/database');
      
      // Load hydration streak
      const streak = await checkHydrationStreak();
      setHydrationStreak(streak);
      
      // Load mental strength progress (days with 6 glasses)
      const progress = await checkMentalStrengthProgress();
      setMentalStrengthProgress(progress);
    } catch (error) {
      console.error('Error loading hydration data:', error);
    }
  };
  
  // Check hydration streak (consecutive days with water logged)
  const checkHydrationStreak = async () => {
    try {
      const { ref, get } = await import('firebase/database');
      let streak = 0;
      for (let i = 0; i < 7; i++) {
        const checkDate = new Date();
        checkDate.setDate(checkDate.getDate() - i);
        const checkDateStr = checkDate.toDateString();
        const waterSnapshot = await get(ref(db, `users/${userId}/profile/daily/${checkDateStr}/water`));
        
        if (waterSnapshot.exists() && waterSnapshot.val() > 0) {
          streak++;
        } else {
          break;
        }
      }
      return streak;
    } catch (error) {
      console.error('Error checking hydration streak:', error);
      return 0;
    }
  };
  
  // Check mental strength progress (days with 6 glasses)
  const checkMentalStrengthProgress = async () => {
    try {
      const { ref, get } = await import('firebase/database');
      let progress = 0;
      for (let i = 0; i < 7; i++) {
        const checkDate = new Date();
        checkDate.setDate(checkDate.getDate() - i);
        const checkDateStr = checkDate.toDateString();
        const waterSnapshot = await get(ref(db, `users/${userId}/profile/daily/${checkDateStr}/water`));
        
        if (waterSnapshot.exists() && waterSnapshot.val() >= 6) {
          progress++;
        }
      }
      return Math.min(progress, 3); // Cap at 3 days
    } catch (error) {
      console.error('Error checking mental strength progress:', error);
      return 0;
    }
  };
  
  // Render glasses with new design
  const renderGlasses = () => {
    return (
      <div className="glasses-visual">
        {[...Array(6)].map((_, index) => {
          const isFilled = index < currentWater;
          return (
            <div 
              key={index} 
              className={`glass ${isFilled ? 'filled' : ''}`}
            />
          );
        })}
      </div>
    );
  };

  const handleLogWater = async () => {
    if (!userId || isLoggingWater || currentWater >= 6) return;
    
    setIsLoggingWater(true);
    
    // Call the parent's water logging function
    onLogWater();
    
    // Wait for the water to be logged, then refresh our data
    setTimeout(async () => {
      setIsLoggingWater(false);
      // Refresh hydration data after logging
      await loadHydrationData();
    }, 1000);
  };

  if (!isOpen || !userId) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <div className="modal-content">
          <div className="hydration-module">
        {/* Module Header */}
        <div className="module-header">
          <div className="module-title">
            <div className="water-icon">💧</div>
            Hydration Tracker
          </div>
          <p className="subtitle">Stay hydrated, stay strong</p>
        </div>

        {/* Progress Container */}
        <div className="progress-container">
          <div className="progress-header">
            <span className="progress-text">Today's Progress</span>
            <span className="progress-fraction">{currentWater}/6</span>
          </div>
          
          {/* Glasses Visual */}
          {renderGlasses()}
          
          {/* Progress Bar */}
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(currentWater / 6) * 100}%` }}
            />
          </div>
          <div className="progress-percentage">
            {Math.round((currentWater / 6) * 100)}% Complete
          </div>
        </div>

        {/* Streak Section */}
        <div className="streak-section">
          <div className="streak-card">
            <span className="streak-icon">🔥</span>
            <div className="streak-label">Hydration Streak</div>
            <div className="streak-value">{hydrationStreak} days</div>
          </div>
          
          <div className="streak-card">
            <span className="streak-icon">💪</span>
            <div className="streak-label">Mental Strength</div>
            <div className="streak-value">{mentalStrengthProgress}/3</div>
          </div>
        </div>

        {/* Completion Message */}
        {currentWater === 6 && (
          <div className="completion-message">
            🎉 Congratulations! You've completed your daily hydration goal!
          </div>
        )}

        {/* Log Button */}
        <button
          onClick={handleLogWater}
          disabled={currentWater >= 6 || isLoggingWater}
          className="log-button"
        >
          {currentWater >= 6 ? '🎉 Goal Complete!' : 
           isLoggingWater ? '💧 Logging...' : '💧 Log Water'}
        </button>

        {/* Done Button */}
        <button onClick={onClose} className="done-button">
          Done
        </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Profile View - Firebase Migration with Real-time Sync
const ProfileView = ({ user, onNavigate }) => {
  const [relapseDate, setRelapseDate] = useState(null);
  const [showWaterModal, setShowWaterModal] = useState(false);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showTriggerModal, setShowTriggerModal] = useState(false);
  const [showDiaryModal, setShowDiaryModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  
  // Daily tracking state
  const [dailyWater, setDailyWater] = useState(0);
  const [dailyMood, setDailyMood] = useState(null);
  const [dailyBreathing, setDailyBreathing] = useState(false);
  const [scheduledTriggers, setScheduledTriggers] = useState([]);
  
  // StatManager instance
  const [statManager, setStatManager] = useState(null);

  // Firebase data loading and real-time sync
  useEffect(() => {
    if (!user?.uid) return;

    // Initialize StatManager
    const initializeStatManager = async () => {
      try {
        const manager = new StatManager(db, user.uid);
        await manager.initialize();
        setStatManager(manager);
      } catch (error) {
        console.error('Error initializing StatManager:', error);
      }
    };

    initializeStatManager();

    const loadProfileData = async () => {
      try {
        const { ref, get, onValue } = await import('firebase/database');
        
        // Load relapse date
        const relapseRef = ref(db, `users/${user.uid}/profile/relapseDate`);
        const relapseSnapshot = await get(relapseRef);
        if (relapseSnapshot.exists()) {
          setRelapseDate(new Date(relapseSnapshot.val()));
        }

        // Load scheduled triggers
        const triggersRef = ref(db, `users/${user.uid}/profile/scheduledTriggers`);
        const triggersSnapshot = await get(triggersRef);
        if (triggersSnapshot.exists()) {
          setScheduledTriggers(triggersSnapshot.val());
        }

        // Set up real-time listeners
        const today = new Date().toDateString();
        
        // Water intake listener
        const waterRef = ref(db, `users/${user.uid}/profile/daily/${today}/water`);
        const waterUnsubscribe = onValue(waterRef, (snapshot) => {
          if (snapshot.exists()) {
            setDailyWater(snapshot.val() || 0);
          }
        });

        // Mood listener
        const moodRef = ref(db, `users/${user.uid}/profile/daily/${today}/mood`);
        const moodUnsubscribe = onValue(moodRef, (snapshot) => {
          if (snapshot.exists()) {
            setDailyMood(snapshot.val());
          }
        });

        // Breathing exercise listener
        const breathingRef = ref(db, `users/${user.uid}/profile/daily/${today}/breathing`);
        const breathingUnsubscribe = onValue(breathingRef, (snapshot) => {
          if (snapshot.exists()) {
            setDailyBreathing(snapshot.val() || false);
          }
        });

        // Scheduled triggers listener
        const triggersListenerRef = ref(db, `users/${user.uid}/profile/scheduledTriggers`);
        const triggersUnsubscribe = onValue(triggersListenerRef, (snapshot) => {
          if (snapshot.exists()) {
            setScheduledTriggers(snapshot.val() || []);
          }
        });

        // Cleanup function
        return () => {
          waterUnsubscribe();
          moodUnsubscribe();
          breathingUnsubscribe();
          triggersUnsubscribe();
        };
      } catch (error) {
        console.error('Error loading profile data from Firebase:', error);
        // Fallback to localStorage if Firebase fails
        loadFromLocalStorage();
      }
    };

    const loadFromLocalStorage = () => {
      const savedRelapseDate = localStorage.getItem('quitCoachRelapseDate');
      if (savedRelapseDate) {
        setRelapseDate(new Date(savedRelapseDate));
      }
      
      const today = new Date().toDateString();
      const savedWater = localStorage.getItem(`water_${user.uid}_${today}`);
      const savedMood = localStorage.getItem(`mood_${user.uid}_${today}`);
      const savedBreathing = localStorage.getItem(`breathing_${user.uid}_${today}`);
      
      if (savedWater) setDailyWater(parseInt(savedWater));
      if (savedMood) setDailyMood(JSON.parse(savedMood));
      if (savedBreathing) setDailyBreathing(savedBreathing === 'true');
      
      const savedTriggers = localStorage.getItem('scheduledTriggers');
      if (savedTriggers) {
        setScheduledTriggers(JSON.parse(savedTriggers));
      }
    };

    loadProfileData();
  }, [user?.uid]);

  // Track logging activity for Motivation stat
  useEffect(() => {
    if (statManager) {
      statManager.trackLoggingActivity();
    }
  }, [statManager]);

  // Migrate existing localStorage data to Firebase
  useEffect(() => {
    if (!user?.uid) return;

    const migrateLocalStorageToFirebase = async () => {
      try {
        const { ref, get, set } = await import('firebase/database');
        
        // Check if profile data already exists
        const profileRef = ref(db, `users/${user.uid}/profile`);
        const profileSnapshot = await get(profileRef);
        
        if (!profileSnapshot.exists() || Object.keys(profileSnapshot.val()).length === 0) {
          console.log('Migrating localStorage data to Firebase...');
          
          // Migrate relapse date
          const savedRelapseDate = localStorage.getItem('quitCoachRelapseDate');
          if (savedRelapseDate) {
            await set(ref(db, `users/${user.uid}/profile/relapseDate`), savedRelapseDate);
            setRelapseDate(new Date(savedRelapseDate));
          }
          
          // Migrate cravings resisted
          const cravingWins = parseInt(localStorage.getItem('cravingWins') || 0);
          if (cravingWins > 0) {
            await set(ref(db, `users/${user.uid}/profile/cravingsResisted`), cravingWins);
          }
          
          // Migrate last 7 days of water intake
          for (let i = 0; i < 7; i++) {
            const checkDate = new Date();
            checkDate.setDate(checkDate.getDate() - i);
            const checkDateStr = checkDate.toDateString();
            const waterData = localStorage.getItem(`water_${user.uid}_${checkDateStr}`);
            if (waterData) {
              await set(ref(db, `users/${user.uid}/profile/daily/${checkDateStr}/water`), parseInt(waterData));
            }
          }
          
          // Migrate last 7 days of mood data
          for (let i = 0; i < 7; i++) {
            const checkDate = new Date();
            checkDate.setDate(checkDate.getDate() - i);
            const checkDateStr = checkDate.toDateString();
            const moodData = localStorage.getItem(`mood_${user.uid}_${checkDateStr}`);
            if (moodData) {
              await set(ref(db, `users/${user.uid}/profile/daily/${checkDateStr}/mood`), JSON.parse(moodData));
            }
          }
          
          // Migrate last 7 days of breathing data
          for (let i = 0; i < 7; i++) {
            const checkDate = new Date();
            checkDate.setDate(checkDate.getDate() - i);
            const checkDateStr = checkDate.toDateString();
            const breathingData = localStorage.getItem(`breathing_${user.uid}_${checkDateStr}`);
            if (breathingData) {
              await set(ref(db, `users/${user.uid}/profile/daily/${checkDateStr}/breathing`), breathingData === 'true');
            }
          }
          
          // Migrate scheduled triggers
          const savedTriggers = localStorage.getItem('scheduledTriggers');
          if (savedTriggers) {
            const triggers = JSON.parse(savedTriggers);
            await set(ref(db, `users/${user.uid}/profile/scheduledTriggers`), triggers);
            setScheduledTriggers(triggers);
          }
          
          console.log('localStorage data migration to Firebase completed');
        }
      } catch (error) {
        console.error('Error migrating localStorage data to Firebase:', error);
      }
    };

    // Run migration once when component mounts
    migrateLocalStorageToFirebase();
  }, [user?.uid]);

  // Get the start date for quit timer (onboarding completion or last relapse)
  const getQuitStartDate = () => {
    if (relapseDate && relapseDate > (user?.quitDate || new Date(0))) {
      return relapseDate;
    }
    return user?.quitDate || new Date();
  };

  // Calculate remaining time until midnight
  const getRemainingTimeUntilMidnight = () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    
    const diff = midnight - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return { hours, minutes, seconds };
  };

  const [remainingTime, setRemainingTime] = useState(getRemainingTimeUntilMidnight());
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  // Update timers every second
  useEffect(() => {
    const interval = setInterval(() => {
      // Update remaining time to midnight
      setRemainingTime(getRemainingTimeUntilMidnight());
      
      // Update clean time
      const quitStartDate = getQuitStartDate();
      const now = new Date();
      const diff = now - quitStartDate;
      
      const daysDiff = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hoursDiff = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutesDiff = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secondsDiff = Math.floor((diff % (1000 * 60)) / 1000);
      
      setDays(daysDiff);
      setHours(hoursDiff);
      setMinutes(minutesDiff);
      setSeconds(secondsDiff);
    }, 1000);

    return () => clearInterval(interval);
  }, [relapseDate, user?.quitDate]);

  // Save data to Firebase with fallback to localStorage
  const saveToFirebase = async (path, data) => {
    if (!user?.uid) return false;
    
    try {
      const { ref, set } = await import('firebase/database');
      const dataRef = ref(db, `users/${user.uid}/profile/${path}`);
      await set(dataRef, data);
      return true;
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      return false;
    }
  };

  const handleRelapse = async () => {
    const now = new Date();
    setRelapseDate(now);
    
    // Use StatManager to handle relapse with complex penalty system
    if (statManager) {
      await statManager.handleRelapse();
    }
    
    // Save relapse date and reset quit date to relapse time
    const relapseTimeString = now.toISOString();
    const success = await saveToFirebase('relapseDate', relapseTimeString);
    
    // Also update the quit date to the relapse time (user starts new quit journey)
    const quitDateSuccess = await saveToFirebase('lastQuitDate', relapseTimeString);
    
    // Fallback to localStorage if Firebase fails
    if (!success) {
      localStorage.setItem('quitCoachRelapseDate', relapseTimeString);
    }
    if (!quitDateSuccess) {
      localStorage.setItem('quitCoachLastQuitDate', relapseTimeString);
    }
    
    console.log('🔄 Relapse logged - quit date reset to relapse time:', relapseTimeString);
  };

  // Get week days with proper coloring logic (only past days and today)
  const getWeekDays = () => {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Adjust to start week on Monday (0 = Monday, 1 = Tuesday, etc.)
    const adjustedIndex = currentDay === 0 ? 6 : currentDay - 1;
    
    const days = [
      { name: 'Mon', color: 'bg-slate-700' },
      { name: 'Tue', color: 'bg-slate-700' },
      { name: 'Wed', color: 'bg-slate-700' },
      { name: 'Thu', color: 'bg-slate-700' },
      { name: 'Fri', color: 'bg-slate-700' },
      { name: 'Sat', color: 'bg-slate-700' },
      { name: 'Sun', color: 'bg-slate-700' }
    ];

    // Color past days and today as green, future days remain gray
    for (let i = 0; i <= adjustedIndex; i++) {
      days[i].color = 'bg-green-500';
    }

    // If there's a relapse today, mark current day as red
    if (relapseDate && relapseDate.toDateString() === now.toDateString()) {
      days[adjustedIndex].color = 'bg-red-500';
    }

    return days;
  };

  const weekDays = getWeekDays();

  // Handle water intake
  const handleWaterIntake = async (glasses) => {
    setDailyWater(glasses);
    const today = new Date().toDateString();
    
    // Use StatManager to handle hydration tracking and streaks
    if (statManager) {
      await statManager.handleHydrationUpdate(glasses);
    }
    
    // Save to Firebase
    const success = await saveToFirebase(`daily/${today}/water`, glasses);
    
    // Fallback to localStorage if Firebase fails
    if (!success) {
      localStorage.setItem(`water_${today}`, glasses.toString());
    }
    
    setShowWaterModal(false);
  };

  // Handle mood selection
  const handleMoodSelect = async (mood) => {
    setDailyMood(mood);
    const today = new Date().toDateString();
    
    // Save to Firebase
    const success = await saveToFirebase(`daily/${today}/mood`, mood);
    
    // Fallback to localStorage if Firebase fails
    if (!success) {
      localStorage.setItem(`mood_${today}`, JSON.stringify(mood));
    }
    
    setShowMoodModal(false);
  };



  // Handle trigger scheduling
  const handleTriggerSchedule = async (day, triggerType, time) => {
    const newTrigger = { day, triggerType, time, id: Date.now() };
    const updatedTriggers = [...scheduledTriggers, newTrigger];
    setScheduledTriggers(updatedTriggers);
    
    // Use StatManager to handle trigger planning bonus
    if (statManager) {
      await statManager.handleTriggerPlanning();
    }
    
    // Save to Firebase
    const success = await saveToFirebase('scheduledTriggers', updatedTriggers);
    
    // Fallback to localStorage if Firebase fails
    if (!success) {
      localStorage.setItem('scheduledTriggers', JSON.stringify(updatedTriggers));
    }
    
    setShowTriggerModal(false);
  };

  // Handle trigger list updates for Trigger Defense bonus
  const handleTriggerListUpdate = async () => {
    if (statManager) {
      await statManager.handleTriggerListUpdate();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-16">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt="Avatar" 
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="text-white font-bold text-lg">
                {user?.heroName ? user.heroName.charAt(0).toUpperCase() : 'H'}
              </span>
            )}
          </div>
          <div>
            <p className="text-white text-lg">Hello,</p>
            <p className="text-white text-2xl font-bold">{user?.heroName || 'Hero'}</p>
          </div>
        </div>
        <div className="bg-yellow-500 px-3 py-1 rounded-full">
          <span className="font-bold text-slate-900">{days}</span>
        </div>
      </div>

      <div className="px-4 space-y-6">
        {/* RELAPSE Button - Moved between header and My Week */}
        <div className="mb-6">
          <button
            onClick={handleRelapse}
            className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">⚠️</span>
              <span className="text-lg">RELAPSE</span>
              <span className="text-2xl">⚠️</span>
            </div>
            <p className="text-sm opacity-90 mt-1">Reset progress and start over</p>
          </button>
        </div>

        {/* My Week Section */}
        <div className="bg-slate-800/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-xl font-bold">My week</h2>
            <div className="bg-green-500 px-3 py-1 rounded-full flex items-center gap-1">
              <span className="text-white text-sm">✓</span>
              <span className="text-white font-bold">0</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            {weekDays.map((day, index) => (
              <div key={day.name} className="text-center">
                <div className={`w-8 h-8 rounded-full mb-1 ${day.color}`} />
                <p className="text-gray-400 text-xs">{day.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Remaining Time for Today */}
        <div className="bg-slate-800/50 rounded-xl p-4">
          <h3 className="text-white text-lg font-semibold mb-2">Remaining time for Today</h3>
          <div className="text-center">
            <div className="text-white text-3xl font-bold">
              {remainingTime.hours.toString().padStart(2, '0')}:{remainingTime.minutes.toString().padStart(2, '0')}:{remainingTime.seconds.toString().padStart(2, '0')}
            </div>
            <p className="text-gray-400 text-sm">Countdown to midnight</p>
          </div>
        </div>

        {/* My Progress Section - Simplified */}
        <div>
          <h2 className="text-white text-2xl font-bold mb-4">My progress</h2>
          
          {/* Live Time Counter */}
          <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-yellow-400 text-lg">⏰</span>
              <span className="text-gray-300">Clean for</span>
            </div>
            <div className="flex items-baseline gap-4">
              <div className="text-center">
                <div className="text-white text-3xl font-bold">{days.toString().padStart(2, '0')}</div>
                <div className="text-gray-400 text-sm">days</div>
              </div>
              <div className="text-center">
                <div className="text-white text-3xl font-bold">{hours.toString().padStart(2, '0')}</div>
                <div className="text-gray-400 text-sm">hours</div>
              </div>
              <div className="text-center">
                <div className="text-white text-3xl font-bold">{minutes.toString().padStart(2, '0')}</div>
                <div className="text-gray-400 text-sm">minutes</div>
              </div>
              <div className="text-center">
                <div className="text-white text-2xl font-bold animate-pulse">{seconds.toString().padStart(2, '0')}</div>
                <div className="text-gray-400 text-sm">seconds</div>
              </div>
            </div>
            {relapseDate && (
              <div className="mt-3 text-center">
                <p className="text-red-400 text-sm">
                  Last relapse: {relapseDate.toLocaleDateString()} at {relapseDate.toLocaleTimeString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Habit Tracking Section - Replaces Today */}
        <div>
          <h2 className="text-white text-2xl font-bold mb-4">Habit Tracking</h2>
          
          <div className="space-y-4">
            {/* Stay Hydrated Button */}
            <button
              onClick={() => setShowWaterModal(true)}
              className="w-full bg-gradient-to-r from-blue-500/20 to-blue-600/20 bg-slate-800/50 rounded-xl p-4 text-left hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-xl">
                  💧
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg">Stay hydrated</h3>
                  <p className="text-gray-300 text-sm">
                    {dailyWater > 0 ? `${dailyWater} glasses today` : 'Tap to log water intake'}
                  </p>
                </div>
                <div className="text-blue-400 text-2xl">→</div>
              </div>
            </button>

            {/* Breathing exercises are now available in the Craving Support tab */}

            {/* Mood Tracking Button */}
            <button
              onClick={() => setShowMoodModal(true)}
              className="w-full bg-gradient-to-r from-green-500/20 to-green-600/20 bg-slate-800/50 rounded-xl p-4 text-left hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-xl">
                  🌤️
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg">Mood tracking</h3>
                  <p className="text-gray-300 text-sm">
                    {dailyMood ? `You feel ${dailyMood.name.toLowerCase()}` : 'How do you feel today?'}
                  </p>
                </div>
                <div className="text-green-400 text-2xl">→</div>
              </div>
            </button>
          </div>
        </div>

        {/* This Week's Battle Plan */}
        <div>
          <h2 className="text-white text-2xl font-bold mb-4">This Week's Battle Plan</h2>
          
          <div className="space-y-3">
            <button
              onClick={() => setShowTriggerModal(true)}
              className="w-full bg-gradient-to-r from-orange-500/20 to-orange-600/20 bg-slate-800/50 rounded-xl p-4 text-left hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-xl">
                  🛡️
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg">Trigger defense planning</h3>
                  <p className="text-gray-300 text-sm">
                    {scheduledTriggers.length > 0 ? `${scheduledTriggers.length} triggers planned` : 'Plan your trigger defense strategy'}
                  </p>
                </div>
                <div className="text-orange-400 text-2xl">→</div>
              </div>
            </button>
            
            <button
              onClick={handleTriggerListUpdate}
              className="w-full bg-gradient-to-r from-purple-500/20 to-purple-600/20 bg-slate-800/50 rounded-xl p-4 text-left hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-xl">
                  📝
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg">Update trigger list</h3>
                  <p className="text-gray-300 text-sm">
                    Review and update your personal triggers for +1 Trigger Defense
                  </p>
                </div>
                <div className="text-purple-400 text-2xl">→</div>
              </div>
            </button>
          </div>
        </div>

        {/* Benefits Monitor */}
        <div>
          <h2 className="text-white text-2xl font-bold mb-4">Benefits Monitor</h2>
          

        </div>

        {/* Diary Section */}
        <div>
          <h2 className="text-white text-2xl font-bold mb-4">Diary</h2>
          
          <button
            onClick={() => setShowDiaryModal(true)}
            className="w-full bg-gradient-to-r from-indigo-500/20 to-indigo-600/20 bg-slate-800/50 rounded-xl p-4 text-left hover:scale-105 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-xl">
                📅
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg">Monthly overview</h3>
                <p className="text-gray-300 text-sm">View your progress and daily activities</p>
              </div>
              <div className="text-indigo-400 text-2xl">→</div>
            </div>
          </button>
        </div>
      </div>

      {/* Modals */}
      <WaterModal 
        isOpen={showWaterModal} 
        onClose={() => setShowWaterModal(false)}
        onConfirm={handleWaterIntake}
        currentWater={dailyWater}
      />
      
      {/* BreathingModal is now imported and used in CravingSupportView */}
      
      <MoodModal 
        isOpen={showMoodModal} 
        onClose={() => setShowMoodModal(false)}
        onSelect={handleMoodSelect}
        selectedMood={dailyMood}
      />
      
      <TriggerModal 
        isOpen={showTriggerModal} 
        onClose={() => setShowTriggerModal(false)}
        onSchedule={handleTriggerSchedule}
        scheduledTriggers={scheduledTriggers}
      />
      
      <DiaryModal 
        isOpen={showDiaryModal} 
        onClose={() => setShowDiaryModal(false)}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        dailyData={{
          water: dailyWater,
          mood: dailyMood,
          breathing: dailyBreathing,
          relapseDate
        }}
      />
    </div>
  );
};

// Modal Components for Profile
const WaterModal = ({ isOpen, onClose, onConfirm, currentWater }) => {
  const [waterInput, setWaterInput] = useState(currentWater);
  
  // Swipe-to-dismiss functionality
  const { modalRef, classes: swipeClasses } = useSwipeToDismiss(onClose, {
    threshold: 80,
    velocity: 0.4,
    enabled: true
  });

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <div 
          ref={modalRef}
          className={`modal-content bg-slate-800 border-slate-700 ${swipeClasses}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="water-modal-title"
        >
          {/* Swipe indicator */}
          <div className="modal-swipe-indicator" />
          
          <div className="modal-scrollable">
            <div className="text-center mb-6 p-4">
              <h3 id="water-modal-title" className="text-xl font-bold text-white mb-2">
                💧 Water Intake
              </h3>
              <p className="text-gray-300 text-sm">How many glasses of water today?</p>
            </div>
            
            <div className="mb-6 px-4">
              <div className="form-group">
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={waterInput}
                  onChange={(e) => setWaterInput(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-700 text-white text-center text-2xl font-bold py-4 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                  placeholder="0"
                  autoComplete="off"
                  aria-label="Number of glasses of water"
                />
                <p className="text-gray-400 text-sm text-center mt-2">0-20 glasses</p>
              </div>
            </div>
            
            <div className="modal-actions px-4 pb-4">
              <button
                onClick={onClose}
                className="modal-button modal-button-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => onConfirm(waterInput)}
                className="modal-button modal-button-primary"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// BreathingModal component is now imported from ./components/BreathingModal

const MoodModal = ({ isOpen, onClose, onSelect, selectedMood }) => {
  const moods = [
    { name: 'Anger', icon: '😠', color: 'bg-red-500' },
    { name: 'Disgust', icon: '🤢', color: 'bg-orange-500' },
    { name: 'Enjoyment', icon: '😊', color: 'bg-yellow-500' },
    { name: 'Calm', icon: '😌', color: 'bg-blue-500' },
    { name: 'Fear', icon: '😨', color: 'bg-purple-500' },
    { name: 'Sadness', icon: '😢', color: 'bg-indigo-500' },
    { name: 'Indifferent', icon: '😐', color: 'bg-gray-500' }
  ];
  
  // Swipe-to-dismiss functionality
  const { modalRef, classes: swipeClasses } = useSwipeToDismiss(onClose, {
    threshold: 80,
    velocity: 0.4,
    enabled: true
  });

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <div 
          ref={modalRef}
          className={`modal-content bg-slate-800 border-slate-700 ${swipeClasses}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mood-modal-title"
        >
          {/* Swipe indicator */}
          <div className="modal-swipe-indicator" />
          
          <div className="modal-scrollable">
            <div className="text-center mb-6 p-4">
              <h3 id="mood-modal-title" className="text-xl font-bold text-white mb-2">
                🌤️ How do you feel?
              </h3>
              <p className="text-gray-300 text-sm">Select your current mood</p>
            </div>
            
            <div className="modal-grid modal-grid-2 gap-3 mb-6 px-4">
              {moods.map((mood) => (
                <button
                  key={mood.name}
                  onClick={() => onSelect(mood)}
                  className={`p-4 rounded-xl text-center transition-all duration-300 hover:scale-105 min-h-[44px] ${
                    selectedMood?.name === mood.name ? 'ring-2 ring-blue-400 bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                  aria-pressed={selectedMood?.name === mood.name}
                  aria-label={`Select ${mood.name} mood`}
                >
                  <div className={`w-12 h-12 ${mood.color} rounded-full flex items-center justify-center text-2xl mx-auto mb-2`}>
                    {mood.icon}
                  </div>
                  <p className="text-white font-semibold">{mood.name}</p>
                </button>
              ))}
            </div>
            
            <div className="modal-actions px-4 pb-4">
              <button
                onClick={onClose}
                className="modal-button modal-button-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TriggerModal = ({ isOpen, onClose, onSchedule, scheduledTriggers }) => {
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTrigger, setSelectedTrigger] = useState('');
  const [selectedTime, setSelectedTime] = useState('12:00');

  const triggerTypes = [
    'Social event',
    'Drinks',
    'High-stress event',
    'Social pressure'
  ];

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <div className="modal-content bg-slate-800 border-slate-700">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-white mb-2">🛡️ Trigger Defense Planning</h3>
          <p className="text-gray-300 text-sm">Schedule your trigger defense strategy</p>
        </div>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-white text-sm font-semibold mb-2">Day of the week</label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Select a day</option>
              {weekDays.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-white text-sm font-semibold mb-2">Trigger type</label>
            <select
              value={selectedTrigger}
              onChange={(e) => setSelectedTrigger(e.target.value)}
              className="w-full bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Select trigger type</option>
              {triggerTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-white text-sm font-semibold mb-2">Time</label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
              autoComplete="off"
            />
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (selectedDay && selectedTrigger && selectedTime) {
                onSchedule(selectedDay, selectedTrigger, selectedTime);
              }
            }}
            disabled={!selectedDay || !selectedTrigger || !selectedTime}
            className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-600 text-white font-bold py-3 rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            Schedule
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

const DiaryModal = ({ isOpen, onClose, selectedDate, onDateSelect, dailyData }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <div className="modal-content bg-slate-800 border-slate-700">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-white mb-2">📅 Daily Summary</h3>
          <p className="text-gray-300 text-sm">Your activities and progress</p>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="bg-slate-700 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">💧 Water Intake</h4>
            <p className="text-gray-300">{dailyData.water} glasses</p>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">🌤️ Mood</h4>
            <p className="text-gray-300">{dailyData.mood ? dailyData.mood.name : 'Not logged'}</p>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">🫁 Breathing Exercise</h4>
            <p className="text-gray-300">{dailyData.breathing ? '✓ Completed' : '✗ Not completed'}</p>
          </div>
          
          {dailyData.relapseDate && (
            <div className="bg-red-900/50 rounded-lg p-4 border border-red-500">
              <h4 className="text-red-300 font-semibold mb-2">⚠️ Relapse</h4>
              <p className="text-red-300">
                {dailyData.relapseDate.toLocaleDateString()} at {dailyData.relapseDate.toLocaleTimeString()}
              </p>
            </div>
          )}
        </div>
        
        <button
          onClick={onClose}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors min-h-[44px]"
        >
          Close
        </button>
        </div>
      </div>
    </div>
  );
};



const SettingsView = ({ onResetApp, onBackToLogin, onResetForTesting, firestoreBuddyService, firestoreBuddyServiceRef, initializeFirestoreBuddyService, behavioralService, user, onShowAnalytics }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pb-20">
    <div className="max-w-md mx-auto px-4 pt-16">
      <div className="text-center mb-8">
        <Settings className="w-16 h-16 mx-auto mb-4 text-blue-400" />
        <h2 className="text-2xl font-bold text-white mb-2">Settings</h2>
        <p className="text-gray-300">Manage your app preferences</p>
      </div>
      
      <div className="space-y-4">
        {/* Analytics */}
        <div className="bg-slate-800/50 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-2">📊 Behavioral Analytics</h3>
          <p className="text-gray-400 text-sm mb-4">View your behavioral patterns and insights</p>
          <button
            onClick={onShowAnalytics}
            disabled={!behavioralService}
            className={`w-full py-3 rounded-lg transition-colors mb-3 ${
              behavioralService 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {behavioralService ? '📈 View Analytics Dashboard' : '📈 Analytics (Service Loading...)'}
          </button>
          {behavioralService && (
            <button
              onClick={async () => {
                try {
                  // Add some test data for demonstration
                  await behavioralService.logCraving(user.uid, {
                    outcome: 'resisted',
                    strength: 7,
                    duration: 5,
                    context: 'test_data',
                    triggers: ['stress', 'work'],
                    mood: 'anxious',
                    stressLevel: 6
                  });
                  await behavioralService.logBreathingExercise(user.uid, {
                    duration: 5,
                    completed: true,
                    triggerContext: 'test_data'
                  });
                  alert('✅ Test data added to Firestore for analytics demo!');
                } catch (error) {
                  alert('❌ Error adding test data: ' + error.message);
                }
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors text-sm min-h-[44px]"
            >
              🧪 Add Test Data
            </button>
          )}
        </div>

        {/* Session Management */}
        <div className="bg-slate-800/50 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-2">Session</h3>
          <p className="text-gray-400 text-sm mb-4">Manage your current session</p>
          <button
            onClick={onBackToLogin}
            className="w-full bg-slate-600 hover:bg-slate-500 text-white py-3 rounded-lg transition-colors mb-3"
          >
            ← Back to Login
          </button>
        </div>

        {/* App Data */}
        <div className="bg-slate-800/50 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-2">App Data</h3>
          <p className="text-gray-400 text-sm mb-4">Reset your progress and start over</p>
          <button
            onClick={onResetApp}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-colors"
          >
            Reset App & Start Over
          </button>
        </div>

        {/* Developer Tools - Only show in development */}
        {process.env.NODE_ENV === 'development' && (
          <>
            <div className="bg-slate-800/50 rounded-xl p-4">
              <h3 className="text-yellow-300 font-semibold mb-2">🧪 Development Tools</h3>
              <p className="text-gray-400 text-sm mb-4">Advanced testing and debugging functions</p>
              
              <button
                onClick={onResetForTesting}
                className="w-full bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-lg transition-colors mb-3"
                title="Reset ALL user data for testing - clears entire database"
              >
                🔄 Reset ALL User Data
              </button>
              
              <button
                onClick={async () => {
                  console.log('🧪 Testing Firestore service from Settings...');
                  console.log('🧪 firestoreBuddyService state:', !!firestoreBuddyService);
                  console.log('🧪 firestoreBuddyService ref:', !!firestoreBuddyServiceRef?.current);
                  
                  if (firestoreBuddyService || firestoreBuddyServiceRef?.current) {
                    const service = firestoreBuddyService || firestoreBuddyServiceRef.current;
                    console.log('✅ FirestoreBuddyService is available');
                    const status = service.getServiceStatus();
                    console.log('📊 Service status:', status);
                    
                    // Test connectivity
                    const connectivity = await service.testConnectivity();
                    console.log('🔗 Connectivity test result:', connectivity);
                    
                    // Test adding a user to matching pool
                    const testUserData = {
                      userId: 'test-user-' + Date.now(),
                      heroName: 'TestHero',
                      archetype: 'HEALTH_WARRIOR',
                      quitStartDate: new Date().toISOString(),
                      addictionLevel: 50,
                      triggers: ['test'],
                      timezone: 'UTC',
                      quitExperience: 'first',
                      availableForMatching: true,
                      lastActive: new Date()
                    };
                    
                    const success = await service.addToMatchingPool('test-user-' + Date.now(), testUserData);
                    console.log('🧪 Test user added to matching pool:', success);
                  } else {
                    console.log('❌ FirestoreBuddyService is NOT available');
                    console.log('🔄 Attempting to reinitialize...');
                    await initializeFirestoreBuddyService();
                  }
                }}
                className="w-full bg-yellow-600 hover:bg-yellow-500 text-white py-3 rounded-lg transition-colors"
                title="Test Firestore service and add test user to matching pool"
              >
                🧪 Test Firestore
              </button>
            </div>
          </>
        )}
        
        <div className="bg-slate-800/50 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-2">About</h3>
          <p className="text-gray-400 text-sm">QuitCard Arena v1.0.0</p>
          <p className="text-gray-400 text-sm">Your journey to freedom starts here</p>
        </div>
      </div>
    </div>
  </div>
);









// Main App Component - Updated for ultra-tiny info icons and consistent card spacing
const App = () => {
  const [activeTab, setActiveTab] = useState('arena');
  const [currentView, setCurrentView] = useState('auth');
  const [selectedMood, setSelectedMood] = useState(null);
  const [user, setUser] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  // PWA install prompt state
  const [pwaInstallAvailable, setPwaInstallAvailable] = useState(false);
  
  // State to force re-render when stats are updated
  const [statsUpdateTrigger, setStatsUpdateTrigger] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullToRefreshY, setPullToRefreshY] = useState(0);

  // ===== COMPREHENSIVE DATA LOADING SYSTEM =====
  
  // Centralized data loading state
  const [dataLoadingState, setDataLoadingState] = useState({
    isLoading: false,
    progress: 0,
    currentStep: '',
    error: null,
    isComplete: false
  });

  // Store unsubscribe functions for cleanup
  const [unsubscribeFunctions, setUnsubscribeFunctions] = useState([]);

  // Buddy matching service
  const [buddyMatchingService, setBuddyMatchingService] = useState(null);
  
  // Firestore buddy matching service
  const [firestoreBuddyService, setFirestoreBuddyService] = useState(null);
  const [behavioralService, setBehavioralService] = useState(null);
  const [centralizedStatService, setCentralizedStatService] = useState(null);
  const firestoreBuddyServiceRef = useRef(null);
  
  // StatManager instance
  const [statManager, setStatManager] = useState(null);

  // ===== PWA INSTALL HANDLERS =====
  useEffect(() => {
    const handleBIP = (e) => {
      // Stash the event globally for manual trigger
      window.deferredPrompt = e;
      setPwaInstallAvailable(true);
      console.log('📲 PWA: beforeinstallprompt captured (App state set)');
    };
    const handleInstalled = () => {
      setPwaInstallAvailable(false);
      console.log('✅ PWA installed (App state cleared)');
    };
    window.addEventListener('beforeinstallprompt', handleBIP);
    window.addEventListener('appinstalled', handleInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBIP);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  // Pull-to-refresh functionality
  useEffect(() => {
    let startY = 0;
    let currentY = 0;
    let isPulling = false;
    const threshold = 80; // Pull distance threshold

    const handleTouchStart = (e) => {
      startY = e.touches[0].clientY;
      isPulling = false;
    };

    const handleTouchMove = (e) => {
      if (window.scrollY > 0) return; // Only work when at top of page
      
      currentY = e.touches[0].clientY;
      const pullDistance = currentY - startY;
      
      if (pullDistance > 0) {
        isPulling = true;
        e.preventDefault(); // Prevent default scroll behavior
        setPullToRefreshY(Math.min(pullDistance, threshold * 1.5));
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling) return;
      
      const pullDistance = currentY - startY;
      
      if (pullDistance > threshold) {
        setIsRefreshing(true);
        setPullToRefreshY(0);
        
        // Trigger refresh
        if (typeof window.refreshArenaStats === 'function') {
          console.log('🔄 Pull-to-refresh: Refreshing stats...');
          await window.refreshArenaStats();
        }
        
        // Also trigger the main refresh function if available
        if (typeof refreshStats === 'function') {
          console.log('🔄 Pull-to-refresh: Calling main refresh...');
          refreshStats();
        }
        
        // Show refresh complete feedback
        setTimeout(() => {
          setIsRefreshing(false);
        }, 1000);
      } else {
        setPullToRefreshY(0);
      }
      
      isPulling = false;
    };

    // Add touch event listeners
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const promptInstall = async () => {
    try {
      if (window.promptPWAInstall) {
        const choice = await window.promptPWAInstall();
        if (choice && choice.outcome === 'accepted') {
          setPwaInstallAvailable(false);
        }
        return;
      }
      const deferred = window.deferredPrompt;
      if (!deferred) return;
      deferred.prompt();
      const choice = await deferred.userChoice;
      window.deferredPrompt = null;
      if (choice.outcome === 'accepted') {
        setPwaInstallAvailable(false);
      }
    } catch (err) {
      console.warn('PWA install prompt failed:', err?.message);
    }
  };

  // Initialize FirestoreBuddyService
  const initializeFirestoreBuddyService = async () => {
    try {
      if (!firestore) {
        console.error('❌ Firestore instance is not available');
        return;
      }
      
      const firestoreService = new FirestoreBuddyService(firestore);
      const behavioralSvc = new FirestoreBehavioralService(firestore);
      
      // Test connectivity before setting state
      const connectivityTest = await firestoreService.testConnectivity();
      const behavioralConnectivityTest = await behavioralSvc.testConnectivity();
      
      if (connectivityTest) {
        // Set state and ref for immediate access
        setFirestoreBuddyService(firestoreService);
        firestoreBuddyServiceRef.current = firestoreService;
        console.log('✅ FirestoreBuddyService initialized successfully');
      } else {
        console.warn('⚠️ Firestore connectivity test failed - service not initialized');
      }
      
      if (behavioralConnectivityTest) {
        setBehavioralService(behavioralSvc);
        console.log('✅ FirestoreBehavioralService initialized successfully');
      } else {
        console.warn('⚠️ Firestore behavioral service connectivity test failed');
      }
    } catch (error) {
      console.error('❌ Error initializing FirestoreBuddyService:', error);
    }
  };

  // Helper function to get default stats
  const getDefaultStats = () => ({
    mentalStrength: 50,
    motivation: 50,
    triggerDefense: 30,
    addictionLevel: 50,
    streakDays: 0,
    streakUnit: 'hours',
    streakDisplayText: '0 hours',
    cravingsResisted: 0
  });

  // Helper function to get default profile
  const getDefaultProfile = () => ({
    dailyWater: 0,
    dailyMood: null,
    dailyBreathing: false,
    scheduledTriggers: [],
    relapseDate: null,
    cravingsResisted: 0
  });

  // Helper function to update profile state
  const updateProfileState = (profileData) => {
    if (profileData.relapseDate) {
      setRelapseDate(new Date(profileData.relapseDate));
    }
    if (profileData.dailyWater !== undefined) {
      setDailyWater(profileData.dailyWater);
    }
    if (profileData.dailyMood !== undefined) {
      setDailyMood(profileData.dailyMood);
    }
    if (profileData.dailyBreathing !== undefined) {
      setDailyBreathing(profileData.dailyBreathing);
    }
    if (profileData.scheduledTriggers) {
      setScheduledTriggers(profileData.scheduledTriggers);
    }
  };


  // Handle breathing exercise completion
  const handleBreathingComplete = async () => {
    const today = new Date().toDateString();
    
    // Save to Firebase
    try {
      const { ref, set } = await import('firebase/database');
      const breathingRef = ref(db, `users/${authUser?.uid}/profile/daily/${today}/breathing`);
      await set(breathingRef, true);
    } catch (error) {
      console.error('Error saving breathing exercise to Firebase:', error);
      // Fallback to localStorage if Firebase fails
      localStorage.setItem(`breathing_${authUser?.uid}_${today}`, 'true');
    }
    
    // Use StatManager to handle breathing exercise and streaks
    if (statManager) {
      try {
        // Handle the breathing exercise (this will check for 3-day streak and update mental strength)
        await statManager.handleBreathingExercise();
        
        // Get current streak after handling the exercise
        const breathingStreak = await statManager.checkBreathingStreak();
        
        // Calculate days needed for next mental strength point
        const daysNeeded = Math.max(0, 3 - (breathingStreak % 3));
        
        // Show completion message with streak info
        const streakMessage = breathingStreak >= 3 && (breathingStreak % 3 === 0)
          ? `🎉 Excellent! You've completed a ${breathingStreak}-day breathing streak and earned +1 Mental Strength!`
          : `✅ Breathing exercise completed! Current streak: ${breathingStreak} days. Complete ${daysNeeded} more days to earn +1 Mental Strength.`;
        
        // Show the completion message
        showQuickActionPopup(
          '🫁 Breathing Exercise Complete',
          `${streakMessage}\n\nKeep up the great work! Regular breathing exercises help reduce stress and improve mental resilience.`,
          'success'
        );
        
        // ALSO log breathing exercise to Firestore for predictive analytics
        if (behavioralService) {
          try {
            await behavioralService.logBreathingExercise(user.uid, {
              duration: 5, // Default breathing exercise duration
              completed: true,
              triggerContext: 'scheduled', // or 'craving-triggered'
              currentStreak: breathingStreak,
              mentalStrengthEarned: breathingStreak >= 3 && (breathingStreak % 3 === 0) // Only true when we just earned a point
            });
            console.log('✅ Breathing exercise also logged to Firestore for analytics');
          } catch (firestoreError) {
            console.warn('⚠️ Could not log breathing exercise to Firestore:', firestoreError.message);
            // Queue for offline sync if Firestore fails
            await handleOfflineBehavioralLog('breathing', {
              duration: 5,
              completed: true,
              triggerContext: 'scheduled',
              currentStreak: breathingStreak,
              mentalStrengthEarned: breathingStreak >= 3 && (breathingStreak % 3 === 0)
            });
          }
        }
      } catch (error) {
        console.warn('⚠️ Error handling breathing exercise completion:', error.message);
        
        // Show basic completion message even if there's an error
        showQuickActionPopup(
          '🫁 Breathing Exercise Complete',
          '✅ Breathing exercise completed! Keep practicing daily to build your mental strength.',
          'success'
        );
      }
    }
  };

  // Helper function to show error notifications
  const showErrorNotification = (title, message) => {
    // Create a notification element
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg bg-red-500 text-white max-w-sm';
    
    notification.innerHTML = `
      <div class="font-bold">${title}</div>
      <div class="text-sm opacity-90">${message}</div>
      <button class="mt-2 text-sm underline" onclick="this.parentElement.remove()">Dismiss</button>
    `;

    document.body.appendChild(notification);

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 10000);
  };

  // Comprehensive data loading function
  const loadAllUserData = async (userUID) => {
    if (!userUID) return false;
    
    setDataLoadingState({
      isLoading: true,
      progress: 0,
      currentStep: 'Initializing...',
      error: null,
      isComplete: false
    });

    try {
      const { ref, get, onValue } = await import('firebase/database');
      
      // Step 1: Load user profile and onboarding data
      setDataLoadingState(prev => ({ ...prev, currentStep: 'Loading profile data...', progress: 20 }));
      
      const userRef = ref(db, `users/${userUID}`);
      const userSnapshot = await get(userRef);
      
      if (!userSnapshot.exists()) {
        throw new Error('User profile not found');
      }
      
      const userData = userSnapshot.val();
      
      // Validate user data integrity
      const validatedUserData = validateUserData(userData);
      
        // Removed user-specific temporary fixes - CentralizedStatService now handles quit date logic universally
      
      // Step 2: Load stats
      setDataLoadingState(prev => ({ ...prev, currentStep: 'Loading battle stats...', progress: 40 }));
      
      const statsRef = ref(db, `users/${userUID}/stats`);
      const statsSnapshot = await get(statsRef);
      const userStats = statsSnapshot.exists() ? validateStats(statsSnapshot.val()) : getDefaultStats();
      
      // Step 3: Load profile data
      setDataLoadingState(prev => ({ ...prev, currentStep: 'Loading habits and progress...', progress: 60 }));
      
      const profileRef = ref(db, `users/${userUID}/profile`);
      const profileSnapshot = await get(profileRef);
      const profileData = profileSnapshot.exists() ? validateProfileData(profileSnapshot.val()) : getDefaultProfile();
      
      // Step 4: Load cravings and achievements
      setDataLoadingState(prev => ({ ...prev, currentStep: 'Loading achievements...', progress: 80 }));
      
      const cravingsRef = ref(db, `users/${userUID}/profile/cravingsResisted`);
      const cravingsSnapshot = await get(cravingsRef);
      const cravingsResisted = cravingsSnapshot.exists() ? Math.max(0, parseInt(cravingsSnapshot.val()) || 0) : 0;
      
      // Step 5: Set up real-time listeners for live updates
      setDataLoadingState(prev => ({ ...prev, currentStep: 'Setting up live sync...', progress: 90 }));
      
      // Set up real-time listeners
      const unsubscribeStats = onValue(statsRef, (snapshot) => {
        if (snapshot.exists()) {
          const newStats = validateStats(snapshot.val());
          console.log('🔄 Firebase Listener: Stats changed, new stats:', newStats);
          setUserStats(newStats);
          // Update real-time stats if user is in Arena
          if (currentView === 'arena' && user) {
            console.log('🔄 Firebase Listener: Current user object:', user);
            console.log('🔄 Firebase Listener: user.quitDate:', user.quitDate);
            console.log('🔄 Firebase Listener: user.uid:', user.uid);
            const updatedUser = { ...user, stats: newStats };
            console.log('🔄 Firebase Listener: Triggering calculateRealTimeStats for Arena with updatedUser:', updatedUser);
            console.log('🔄 Firebase Listener: updatedUser.quitDate:', updatedUser.quitDate);
            console.log('🔄 Firebase Listener: updatedUser.uid:', updatedUser.uid);
            calculateRealTimeStats(updatedUser).then((calculatedStats) => {
              console.log('🔄 Firebase Listener: calculateRealTimeStats returned:', calculatedStats);
              console.log('🔄 Firebase Listener: calculatedStats.streakDays:', calculatedStats.streakDays);
              setRealTimeUserStats(calculatedStats);
            });
          }
        }
      });
      
      const unsubscribeProfile = onValue(profileRef, (snapshot) => {
        if (snapshot.exists()) {
          const newProfile = validateProfileData(snapshot.val());
          // Update profile state based on current view
          if (currentView === 'profile') {
            updateProfileState(newProfile);
          }
        }
      });
      
      const unsubscribeCravings = onValue(cravingsRef, (snapshot) => {
        if (snapshot.exists()) {
          const newCravings = Math.max(0, parseInt(snapshot.val()) || 0);
          if (currentView === 'craving-support') {
            setCravingsResisted(newCravings);
          }
        }
      });
      
      // Store unsubscribe functions for cleanup
      setUnsubscribeFunctions([unsubscribeStats, unsubscribeProfile, unsubscribeCravings]);
      
      // Step 6: Update all app state
      setDataLoadingState(prev => ({ ...prev, currentStep: 'Finalizing...', progress: 100 }));
      
      // Update user state (merge profile data to include relapse information)
      setUser(prevUser => ({
        ...prevUser,
        ...validatedUserData,
        ...profileData, // Include profile data (lastRelapseDate, etc.)
        stats: userStats
      }));
      
      // Update profile state
      updateProfileState(profileData);
      
      // Update cravings state
      setCravingsResisted(cravingsResisted);
      
      // Set onboarding completion status
      if (validatedUserData.onboardingCompleted) {
        setHasCompletedOnboarding(true);
      }
      
      // Complete loading
      setDataLoadingState({
        isLoading: false,
        progress: 100,
        currentStep: 'Data loaded successfully!',
        error: null,
        isComplete: true
      });
      
      console.log('✅ All user data loaded successfully:', {
        profile: validatedUserData,
        stats: userStats,
        profileData: profileData,
        cravingsResisted: cravingsResisted
      });
      
      return true;
      
    } catch (error) {
      console.error('❌ Error loading user data:', error);
      
      setDataLoadingState({
        isLoading: false,
        progress: 0,
        currentStep: 'Failed to load data',
        error: error.message,
        isComplete: false
      });
      
      // Show error notification
      showErrorNotification('Failed to load user data', error.message);
      
      return false;
    }
  };

  // Data validation functions
  const validateUserData = (userData) => {
    if (!userData) return getDefaultUserData();
    
    return {
      uid: userData.uid || '',
      email: userData.email || '',
      heroName: userData.heroName || 'Hero',
      archetype: userData.archetype || 'The Determined',
      avatar: userData.avatar || generateAvatar('default'),
      quitDate: userData.quitDate, // PRESERVE existing quit date - don't overwrite!
      onboardingCompleted: !!userData.onboardingCompleted,
      updatedAt: userData.updatedAt || Date.now(),
      ...userData
    };
  };

  const validateStats = (stats) => {
    if (!stats) return getDefaultStats();
    
    return {
      mentalStrength: Math.max(0, Math.min(100, parseInt(stats.mentalStrength) || 50)),
      motivation: Math.max(0, Math.min(100, parseInt(stats.motivation) || 50)),
      triggerDefense: Math.max(0, Math.min(100, parseInt(stats.triggerDefense) || 30)),
      addictionLevel: Math.max(0, Math.min(100, parseInt(stats.addictionLevel) || 50)),
      streakDays: Math.max(0, parseInt(stats.streakDays) || 0),
      streakUnit: stats.streakUnit || 'hours',
      streakDisplayText: stats.streakDisplayText || '0 hours',
      cravingsResisted: Math.max(0, parseInt(stats.cravingsResisted) || 0),
      ...stats
    };
  };

  const validateProfileData = (profileData) => {
    if (!profileData) return getDefaultProfile();
    
    return {
      dailyWater: Math.max(0, parseInt(profileData.dailyWater) || 0),
      dailyMood: profileData.dailyMood || null,
      dailyBreathing: !!profileData.dailyBreathing,
      scheduledTriggers: Array.isArray(profileData.scheduledTriggers) ? profileData.scheduledTriggers : [],
      relapseDate: profileData.relapseDate ? new Date(profileData.relapseDate).toISOString() : null,
      cravingsResisted: Math.max(0, parseInt(profileData.cravingsResisted) || 0),
      ...profileData
    };
  };

  const getDefaultUserData = () => ({
    uid: '',
    email: '',
    heroName: 'Hero',
    archetype: 'The Determined',
    avatar: generateAvatar('default'),
    quitDate: new Date().toISOString(),
    onboardingCompleted: false,
    updatedAt: Date.now()
  });

  // Cleanup function for real-time listeners
  useEffect(() => {
    return () => {
      unsubscribeFunctions.forEach(unsubscribe => {
        if (typeof unsubscribe === 'function') {
        unsubscribe();
        }
      });
    };
  }, [unsubscribeFunctions]);

  // Handle online/offline state changes - MOVED TO CORRECT LOCATION AFTER STATE DECLARATIONS

  // ===== OFFLINE SUPPORT INTEGRATION =====
  
  // Initialize offline manager
  const [offlineManager, setOfflineManager] = useState(null);
  
  useEffect(() => {
    const initOfflineManager = async () => {
      try {
        const OfflineManager = (await import('./services/offlineManager')).default;
        const manager = new OfflineManager();
        setOfflineManager(manager);
        
        // Make refreshUserData available globally for offline manager
        window.refreshUserData = refreshUserData;
        
        console.log('✅ Offline manager initialized');
      } catch (error) {
        console.error('Error initializing offline manager:', error);
      }
    };
    
    initOfflineManager();
  }, []);

  // Enhanced data loading with offline support
  const loadAllUserDataWithOffline = async (userUID) => {
    if (!userUID) return false;
    
    // First try to load from Firebase
    const onlineDataLoaded = await loadAllUserData(userUID);
    
    if (onlineDataLoaded && offlineManager) {
      // Cache the data for offline use
      await offlineManager.cacheUserData(user);
      await offlineManager.cacheProfileData({
        dailyWater,
        dailyMood,
        dailyBreathing,
        scheduledTriggers,
        relapseDate,
        cravingsResisted
      });
    }
    
    // If online loading failed, try offline data
    if (!onlineDataLoaded && offlineManager) {
      console.log('📱 Loading offline data...');
      const offlineUserData = await offlineManager.getCachedUserData();
      const offlineProfileData = await offlineManager.getCachedProfileData();
      
      if (offlineUserData) {
        console.log('📱 Using offline user data');
        setUser(offlineUserData);
        setHasCompletedOnboarding(offlineUserData.onboardingCompleted);
        
        if (offlineProfileData) {
          updateProfileState(offlineProfileData);
        }
        
        return true;
      }
    }
    
    return onlineDataLoaded;
  };

  // Enhanced data refresh with offline support
  const refreshUserDataWithOffline = async () => {
    if (!authUser?.uid) return false;
    
    console.log('🔄 Refreshing user data with offline support...');
    return await loadAllUserDataWithOffline(authUser.uid);
  };

  // ===== OFFLINE ACTION HANDLERS =====

  // Handle offline habit tracking
  const handleOfflineHabit = async (habitType, value, date = new Date().toDateString()) => {
    if (!offlineManager || !authUser?.uid) return false;
    
    const action = {
      type: 'TRACK_HABIT',
      userId: authUser.uid,
      habitType,
      value,
      date
    };
    
    return await offlineManager.handleOfflineAction(action);
  };

  // Handle offline behavioral logging
  const handleOfflineBehavioralLog = async (logType, logData) => {
    if (!offlineManager || !authUser?.uid) return false;
    
    const enhancedLogData = {
      ...logData,
      userId: authUser.uid,
      timestamp: Date.now()
    };
    
    return await offlineManager.handleOfflineBehavioralLog(logType, enhancedLogData);
  };

  // Handle offline Firestore actions
  const handleOfflineFirestoreAction = async (actionType, actionData) => {
    if (!offlineManager || !authUser?.uid) return false;
    
    const enhancedActionData = {
      ...actionData,
      userId: authUser.uid,
      timestamp: Date.now()
    };
    
    return await offlineManager.handleOfflineFirestoreAction(actionType, enhancedActionData);
  };

  // Handle offline craving resistance
  const handleOfflineCravingResistance = async () => {
    if (!offlineManager || !authUser?.uid) return false;
    
    const action = {
      type: 'RESIST_CRAVING',
      userId: authUser.uid,
      count: cravingsResisted + 1
    };
    
    return await offlineManager.handleOfflineAction(action);
  };

  // Handle offline stat updates
  const handleOfflineStatUpdate = async (statName, value) => {
    if (!offlineManager || !authUser?.uid) return false;
    
    const action = {
      type: 'UPDATE_STATS',
      userId: authUser.uid,
      data: { [statName]: value }
    };
    
    return await offlineManager.handleOfflineAction(action);
  };

  // Handle offline profile updates
  const handleOfflineProfileUpdate = async (profileData) => {
    if (!offlineManager || !authUser?.uid) return false;
    
    const action = {
      type: 'UPDATE_PROFILE',
      userId: authUser.uid,
      data: profileData
    };
    
    return await offlineManager.handleOfflineAction(action);
  };

  // Manual data refresh function
  const refreshUserData = async () => {
    if (!authUser?.uid) {
      showErrorNotification('Cannot Refresh', 'No authenticated user found');
      return;
    }
    
    console.log('🔄 Manually refreshing user data...');
    const success = await refreshUserDataWithOffline();
    
    if (success) {
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg bg-green-500 text-white max-w-sm';
      
      notification.innerHTML = `
        <div class="font-bold">✅ Data Refreshed!</div>
        <div class="text-sm opacity-90">Your data has been synced across all devices</div>
        <button class="mt-2 text-sm underline" onclick="this.parentElement.remove()">Dismiss</button>
      `;

      document.body.appendChild(notification);

      // Auto-remove after 5 seconds
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 5000);
    } else {
      showErrorNotification('Refresh Failed', 'Could not refresh data. Please try again.');
    }
  };

  // Add missing state variables for profile data
  const [relapseDate, setRelapseDate] = useState(null);
  const [dailyWater, setDailyWater] = useState(0);
  const [dailyMood, setDailyMood] = useState(null);
  const [dailyBreathing, setDailyBreathing] = useState(false);
  const [scheduledTriggers, setScheduledTriggers] = useState([]);
  const [cravingsResisted, setCravingsResisted] = useState(0);
  const [userStats, setUserStats] = useState(getDefaultStats());

  // Global error handler for unhandled errors
  useEffect(() => {
    const handleError = (error) => {
      // Filter out content script errors from browser extensions
      if (error.message && error.message.includes('content_script')) {
        console.warn('Browser extension error (ignored):', error.message);
        return;
      }
      
      // Filter out background frame errors
      if (error.message && (error.message.includes('FrameDoesNotExistError') || error.message.includes('background.js'))) {
        console.warn('Background frame error (ignored):', error.message);
        return;
      }
      
      // Filter out browser extension deref errors
      if (error.message && error.message.includes('deref')) {
        console.warn('Browser extension deref error (ignored):', error.message);
        return;
      }
      
      // Filter out chrome-extension URL errors
      if (error.message && error.message.includes('chrome-extension://')) {
        console.warn('Chrome extension URL error (ignored):', error.message);
        return;
      }
      
      console.error('Global error caught:', error);
    };

    const handleUnhandledRejection = (event) => {
      // Filter out content script errors from browser extensions
      if (event.reason && event.reason.message && event.reason.message.includes('content_script')) {
        console.warn('Browser extension promise rejection (ignored):', event.reason.message);
        return;
      }
      
      // Filter out background frame errors
      if (event.reason && event.reason.message && (event.reason.message.includes('FrameDoesNotExistError') || event.reason.message.includes('background.js'))) {
        console.warn('Background frame promise rejection (ignored):', event.reason.message);
        return;
      }
      
      // Filter out browser extension deref errors
      if (event.reason && event.reason.message && event.reason.message.includes('deref')) {
        console.warn('Browser extension deref promise rejection (ignored):', event.reason.message);
        return;
      }
      
      // Filter out chrome-extension URL errors
      if (event.reason && event.reason.message && event.reason.message.includes('chrome-extension://')) {
        console.warn('Chrome extension URL promise rejection (ignored):', event.reason.message);
        return;
      }
      
      console.error('Unhandled promise rejection:', event.reason);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);
  
  // Firebase initialization check (non-intrusive)
  useEffect(() => {
    const checkFirebaseInit = () => {
      try {
        if (db && typeof db.app !== 'undefined') {
          console.log('🔥 Firebase RTDB initialized successfully');
        }
      } catch (err) {
        console.warn('⚠️ Firebase initialization check failed (non-critical):', err?.message || err);
      }
    };
    
    checkFirebaseInit();
  }, []);
  
  // Enhanced authentication state listener with session persistence
  useEffect(() => {
    let isMounted = true;
    let authUnsubscribe = null;
    
    const initializeAuth = async () => {
      try {
        console.log('Initializing authentication state...');
        setAuthLoading(true);
        
        // One-time fix for User 2 and User 3 quit dates (will run when they log in)
        const fixQuitDatesOnce = async (currentUserUID) => {
          const fixKey = `quitDateFixed_${currentUserUID}_v2`; // Changed to v2 to force re-run
          if (localStorage.getItem(fixKey)) {
            return; // Already fixed for this user
          }
          
          // Only fix for User 2 and User 3
          if (currentUserUID !== 'AmwwlNyHD5T3WthUbyR6bFL0QkF2' && currentUserUID !== 'uGZGbLUytbfu8W3mQPW0YAvXTQn1') {
            return;
          }
          
          try {
            const { ref, get, set } = await import('firebase/database');
            const originalQuitDate = '2025-09-18T13:56:46.584Z';
            
            console.log(`🔧 One-time fix: Setting proper quit date for ${currentUserUID}...`);
            
            // Get user's profile to check for relapses
            const userProfileRef = ref(db, `users/${currentUserUID}/profile`);
            const userProfileSnapshot = await get(userProfileRef);
            let userQuitDate = originalQuitDate;
            
            if (userProfileSnapshot.exists()) {
              const profileData = userProfileSnapshot.val();
              if (profileData.lastRelapseDate) {
                const relapseDate = new Date(profileData.lastRelapseDate);
                const originalDate = new Date(originalQuitDate);
                userQuitDate = relapseDate > originalDate ? profileData.lastRelapseDate : originalQuitDate;
                console.log(`📅 ${currentUserUID}: Using quit date ${userQuitDate} (considering relapse: ${profileData.lastRelapseDate})`);
              }
            }
            
            await set(ref(db, `users/${currentUserUID}/quitDate`), userQuitDate);
            await set(ref(db, `users/${currentUserUID}/profile/quitDate`), userQuitDate);
            
            localStorage.setItem(fixKey, 'true');
            console.log(`✅ One-time fix: Quit date fixed for ${currentUserUID} in Firebase database`);
            
          } catch (error) {
            console.warn(`⚠️ One-time fix failed for ${currentUserUID}:`, error.message);
          }
        };
        
        // Set up Firebase Auth state listener
        const { onAuthStateChanged } = await import('firebase/auth');
        
        authUnsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (!isMounted) return;
          
          console.log('Auth state changed:', firebaseUser ? `User: ${firebaseUser.uid}` : 'No user');
          
          if (firebaseUser) {
            // User is authenticated (either from session or new login)
            setAuthUser(firebaseUser);
            console.log('User authenticated, checking database for user data...');
            
            // Clear localStorage cache for User 2 and User 3 to force fresh data loading
            if (firebaseUser.uid === 'AmwwlNyHD5T3WthUbyR6bFL0QkF2' || firebaseUser.uid === 'uGZGbLUytbfu8W3mQPW0YAvXTQn1') {
              console.log(`🧹 Clearing cache for ${firebaseUser.uid} to ensure fresh data loading...`);
              // Clear all localStorage keys that might contain cached data
              Object.keys(localStorage).forEach(key => {
                if (key.includes('quitCoach') || key.includes('quitDate') || key.includes('user') || key.includes('arena')) {
                  localStorage.removeItem(key);
                }
              });
            }
            
            // Run one-time fix for this user's quit date
            fixQuitDatesOnce(firebaseUser.uid);
            
            try {
              const { ref, get } = await import('firebase/database');
              const userRef = ref(db, `users/${firebaseUser.uid}`);
              const snapshot = await get(userRef);
              
                          if (snapshot.exists()) {
              const userData = snapshot.val();
              console.log('Existing user data found - auto-login successful');
              
              // Removed user-specific temporary fixes - CentralizedStatService now handles quit date logic universally
              
              // Clear any previous user's data from localStorage to prevent contamination
              const clearPreviousUserData = () => {
                const keysToRemove = [];
                for (let i = 0; i < localStorage.length; i++) {
                  const key = localStorage.key(i);
                  if (key && (key.startsWith('water_') || key.startsWith('mood_') || key.startsWith('breathing_'))) {
                    keysToRemove.push(key);
                  }
                }
                keysToRemove.forEach(key => localStorage.removeItem(key));
                console.log('Cleared previous user data from localStorage');
              };
              clearPreviousUserData();
              
              setUser(userData);
              setHasCompletedOnboarding(true);
              setCurrentView('arena');
              
              // Initialize StatManager for the authenticated user
              try {
                const StatManager = await import('./services/statManager.js');
                const manager = new StatManager.default(db, firebaseUser.uid);
                await manager.initialize();
                setStatManager(manager);
                console.log('✅ StatManager initialized successfully');
              } catch (error) {
                console.error('Error initializing StatManager:', error);
              }

              // Initialize CentralizedStatService for ALL users (universal system)
              try {
                const centralizedService = new CentralizedStatService(db, firebaseUser.uid);
                setCentralizedStatService(centralizedService);
                window.centralizedStatService = centralizedService; // Make globally accessible
                
                // Refresh stats immediately to ensure they're up to date
                await centralizedService.refreshAllStats();
                console.log('✅ CentralizedStatService initialized and stats refreshed for user:', firebaseUser.uid);
                
                // Set up real-time listener for user's own stats
                centralizedService.setupRealTimeListener((updatedStats) => {
                  console.log('🔄 Real-time stats update received:', updatedStats);
                  setUserStats(updatedStats);
                });
                
              } catch (error) {
                console.error('Error initializing CentralizedStatService:', error);
              }
              
              // Check if existing user needs buddy matching
              try {
                console.log('🔍 Checking if existing user needs buddy matching...');
                
                // Use ref for immediate access, fallback to state
                const service = firestoreBuddyServiceRef.current || firestoreBuddyService;
                
                if (service) {
                  // Check if user already has a buddy pair
                  const existingPair = await service.getUserBuddyPair(firebaseUser.uid);
                  
                  if (!existingPair) {
                    console.log('🔄 Existing user has no buddy - adding to matching pool...');
                    
                    // Add user to matching pool
                    const poolData = {
                      userId: firebaseUser.uid,
                      heroName: userData.heroName,
                      archetype: userData.archetype,
                      joinedAt: new Date().toISOString(),
                      stats: userData.stats
                    };
                    
                    await service.addToMatchingPool(poolData);
                    console.log('✅ Added existing user to matching pool');
                    
                    // Trigger auto-matching after a delay
                    setTimeout(async () => {
                      try {
                        console.log('⏳ Triggering auto-matching for existing user...');
                        await autoMatchUsers();
                      } catch (matchError) {
                        console.error('Auto-matching failed for existing user:', matchError);
                      }
                    }, 2000);
                  } else {
                    console.log('✅ Existing user already has a buddy pair');
                  }
                } else {
                  console.log('⚠️ FirestoreBuddyService not available for existing user buddy check');
                }
              } catch (buddyCheckError) {
                console.error('Error checking existing user buddy status:', buddyCheckError);
              }
              
              console.log('User auto-logged in and redirected to Arena');
            } else {
              console.log('No user data found - new user needs onboarding');
              setCurrentView('onboarding');
            }
            } catch (error) {
              console.error('Error fetching user data during auto-login:', error);
              // Fallback: go to onboarding for new users
              setCurrentView('onboarding');
            }
          } else {
            // No user authenticated
            console.log('No authenticated user - showing login screen');
            setAuthUser(null);
            setUser(null);
            setHasCompletedOnboarding(false);
            setCurrentView('auth');
            
            // Clear any user-specific data from localStorage when logging out
            // This prevents cross-user data contamination
            const clearUserData = () => {
              const keysToRemove = [];
              for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && (key.startsWith('water_') || key.startsWith('mood_') || key.startsWith('breathing_'))) {
                  keysToRemove.push(key);
                }
              }
              keysToRemove.forEach(key => localStorage.removeItem(key));
              console.log('Cleared user-specific data from localStorage');
            };
            clearUserData();
          }
        });
        
        // Set a timeout to prevent infinite loading
        const timeoutId = setTimeout(() => {
          if (isMounted) {
            console.warn('Auth initialization timeout - forcing to auth screen');
            setAuthLoading(false);
            setCurrentView('auth');
          }
        }, 10000); // Increased timeout for session restoration
        
        // Clear timeout when auth state is determined
        if (authUnsubscribe) {
          clearTimeout(timeoutId);
        }
        
      } catch (error) {
        console.error('Error initializing authentication:', error);
        if (isMounted) {
          setAuthLoading(false);
          setCurrentView('auth');
        }
      } finally {
        if (isMounted) {
          setAuthLoading(false);
        }
      }
    };
    
    initializeAuth();
    
    // Initialize Firestore service
    initializeFirestoreBuddyService();
    
    return () => {
      isMounted = false;
      if (authUnsubscribe) {
        authUnsubscribe();
      }
    };
  }, []);

  // Handle authentication success (check database for ALL auth methods)
  const handleAuthSuccess = async (firebaseUser) => {
    console.log('Authentication successful, checking for existing user data...', { uid: firebaseUser?.uid, email: firebaseUser?.email });

    try {
      const { ref, get } = await import('firebase/database');
      console.log('Checking database for existing user data...');

      const userRef = ref(db, `users/${firebaseUser.uid}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();
        console.log('Existing user data found - loading all user data...');
        
        // Use comprehensive data loading system with offline support
        const dataLoaded = await loadAllUserDataWithOffline(firebaseUser.uid);
        
        if (dataLoaded) {
          console.log('✅ All user data loaded successfully, going to Arena');
          
          // Initialize CentralizedStatService for ALL existing users (universal system)
          try {
            const centralizedService = new CentralizedStatService(db, firebaseUser.uid);
            setCentralizedStatService(centralizedService);
            window.centralizedStatService = centralizedService; // Make globally accessible
            await centralizedService.refreshAllStats();
            console.log('✅ CentralizedStatService initialized for existing user:', firebaseUser.uid);
            
            // Set up real-time listener
            centralizedService.setupRealTimeListener((updatedStats) => {
              console.log('🔄 Real-time stats update received:', updatedStats);
              setUserStats(updatedStats);
            });
          } catch (error) {
            console.error('Error initializing CentralizedStatService for existing user:', error);
          }
          
          setCurrentView('arena');
        } else {
          console.log('⚠️ Data loading failed, but proceeding to Arena with basic data');
          setUser(userData);
          const completed = !!userData.onboardingCompleted;
          setHasCompletedOnboarding(completed);
          setCurrentView('arena');
        }
      } else {
        console.log('No user data found - starting onboarding');
        setCurrentView('onboarding');
      }
    } catch (error) {
      console.error('Database check failed:', error);
      // Conservative default: allow user to proceed to onboarding
      setCurrentView('onboarding');
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setHasCompletedOnboarding(false);
      setCurrentView('auth');
      localStorage.removeItem('quitCoachUser');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Real buddy data state
  const [realBuddy, setRealBuddy] = useState(null);
  const [buddyLoading, setBuddyLoading] = useState(false);
  const [buddyError, setBuddyError] = useState(null);
  const [buddyLoadAttempted, setBuddyLoadAttempted] = useState(false);
  // Load real buddy data - Simplified to prevent React crashes
  const loadRealBuddy = async (calculateRealTimeStatsFn, setRealTimeNemesisStatsFn, setBuddyStreakDataFn) => {
    if (!user?.uid || buddyLoading) {
      return;
    }
    
    setBuddyLoading(true);
    setBuddyError(null);
    setBuddyLoadAttempted(true);
    
    try {
      console.log('🔄 Starting loadRealBuddy function...');
      console.log('🔄 FirestoreBuddyService available:', !!firestoreBuddyService);
      console.log('🔄 FirestoreBuddyService type:', typeof firestoreBuddyService);
      
      // Use ref for immediate access, fallback to state
      const service = firestoreBuddyServiceRef.current || firestoreBuddyService;
      
      if (!service) {
        console.log('⚠️ FirestoreBuddyService not available, falling back to Realtime Database');
        await loadRealBuddyRealtimeDB();
        return;
      }
      
      console.log('✅ Using Firestore for buddy loading');
      console.log('🔄 Firestore: Loading real buddy data...');
      
      // Query Firestore buddyPairs to find if current user is in any pair
      const { collection, query, where, getDocs } = await import('firebase/firestore');
      
      const buddyPairsRef = collection(firestore, 'buddyPairs');
      const userPairsQuery = query(buddyPairsRef, where('user1Id', '==', user.uid));
      const userPairsSnapshot = await getDocs(userPairsQuery);
      
      let buddyPair = null;
      let buddyUserId = null;
      
      // Check if user is user1 in any pair
      if (!userPairsSnapshot.empty) {
        const pairDoc = userPairsSnapshot.docs[0];
        buddyPair = { id: pairDoc.id, ...pairDoc.data() };
        buddyUserId = buddyPair.user2Id;
      } else {
        // Check if user is user2 in any pair
        const user2PairsQuery = query(buddyPairsRef, where('user2Id', '==', user.uid));
        const user2PairsSnapshot = await getDocs(user2PairsQuery);
        
        if (!user2PairsSnapshot.empty) {
          const pairDoc = user2PairsSnapshot.docs[0];
          buddyPair = { id: pairDoc.id, ...pairDoc.data() };
          buddyUserId = buddyPair.user1Id;
        }
      }
      
      if (buddyPair && buddyUserId) {
        console.log('✅ Firestore: Found buddy pair:', buddyPair.id);
        console.log('🔍 Buddy pair data:', {
          user1Id: buddyPair.user1Id,
          user2Id: buddyPair.user2Id,
          user1Name: buddyPair.user1Name,
          user2Name: buddyPair.user2Name,
          currentUserId: user.uid,
          buddyUserId
        });
        
        // Create a placeholder buddy using the pair data (avoid permission errors)
        // Try to get buddy name from various sources
        let buddyName = 'Your Buddy';
        
        // First, try to get from buddy pair data
        if (buddyPair.user1Id === user.uid) {
          buddyName = buddyPair.user2Name || 'Your Buddy';
        } else {
          buddyName = buddyPair.user1Name || 'Your Buddy';
        }
        
        // If still fallback, try to get from matching pool data
        if (buddyName === 'Your Buddy') {
          try {
            const poolUsers = await service.getAllMatchingPoolUsers();
            const buddyInPool = poolUsers.find(u => u.userId === buddyUserId);
            if (buddyInPool && buddyInPool.heroName) {
              buddyName = buddyInPool.heroName;
              console.log('🔍 Found buddy name from matching pool:', buddyName);
            }
          } catch (poolError) {
            console.log('⚠️ Could not get buddy name from matching pool:', poolError.message);
          }
        }
        
        // Final fallback: generate a name based on buddy user ID
        if (buddyName === 'Your Buddy') {
          const userNumber = buddyUserId.slice(-4); // Use last 4 chars of ID
          buddyName = `Buddy ${userNumber}`;
        }
        
        console.log('🔍 Selected buddy name:', buddyName);
        
        // If we got the name from matching pool, update the buddy pair for future use
        if (buddyName !== 'Your Buddy' && buddyName.startsWith('Buddy ') === false) {
          try {
            console.log('🔄 Updating buddy pair with correct names...');
            const { doc, updateDoc } = await import('firebase/firestore');
            const pairRef = doc(firestore, 'buddyPairs', buddyPair.id);
            
            const updateData = {};
            if (buddyPair.user1Id === user.uid) {
              updateData.user1Name = user.heroName;
              updateData.user2Name = buddyName;
            } else {
              updateData.user1Name = buddyName;
              updateData.user2Name = user.heroName;
            }
            
            await updateDoc(pairRef, updateData);
            console.log('✅ Updated buddy pair with names:', updateData);
          } catch (updateError) {
            console.log('⚠️ Could not update buddy pair names:', updateError.message);
          }
        }
        
        // Try to get real buddy stats from Firebase
        let buddyStats = {
          streakDays: 0, // Will be calculated in real-time
          addictionLevel: 50,
          willpower: 50,
          motivation: 50,
          cravingResistance: 50,
          triggerDefense: 30,
          experiencePoints: 0
        };
        
        try {
          console.log('🔄 Attempting to get real buddy stats from Firebase...');
          const { ref, get } = await import('firebase/database');
          const buddyStatsRef = ref(db, `users/${buddyUserId}/stats`);
          const buddyStatsSnapshot = await get(buddyStatsRef);
          
          if (buddyStatsSnapshot.exists()) {
            const realBuddyStats = buddyStatsSnapshot.val();
            buddyStats = {
              ...buddyStats, // Keep defaults as fallback
              ...realBuddyStats // Override with real stats
            };
            console.log('✅ Got real buddy stats from Firebase:', realBuddyStats);
          } else {
            console.log('⚠️ Buddy stats not found in Firebase, using defaults');
          }
        } catch (statsError) {
          console.log('⚠️ Could not read buddy stats (permission), using defaults:', statsError.message);
        }
        
        // Also try to get buddy's quit date and avatar for better display
        let buddyQuitDate = null;
        let buddyLastRelapseDate = null; // For relapse-aware streak calculation
        let buddyProfileLastActivity = null; // Onboarding-time fallback when no relapse logged
        let buddyAvatar = generateAvatar('buddy', 'adventurer'); // Default fallback
        let buddyArchetype = 'DETERMINED'; // Default fallback
        
        try {
          console.log('🔄 Loading Firebase imports for buddy profile...');
          const { ref, get } = await import('firebase/database');
          console.log('✅ Firebase imports loaded successfully');
          console.log('🔍 Reading buddy profile fields from path:', `users/${buddyUserId}`);
          
          // Read specific fields that we have permission for (not the entire user object)
          console.log('🔄 Firestore: Attempting to read buddy quit date from multiple locations...');
          const [avatarSnapshot, avatarSeedSnapshot, archetypeSnapshot, heroNameSnapshot, quitDateSnapshot, profileQuitDateSnapshot, profileSnapshot] = await Promise.all([
            get(ref(db, `users/${buddyUserId}/avatar`)),
            get(ref(db, `users/${buddyUserId}/avatarSeed`)),
            get(ref(db, `users/${buddyUserId}/archetype`)),
            get(ref(db, `users/${buddyUserId}/heroName`)),
            get(ref(db, `users/${buddyUserId}/quitDate`)),
            get(ref(db, `users/${buddyUserId}/profile/quitDate`)),
            get(ref(db, `users/${buddyUserId}/profile`))
          ]);
          
          console.log('🔍 Firestore: Quit date snapshots - root exists:', quitDateSnapshot.exists(), 'profile exists:', profileQuitDateSnapshot.exists());
          
          if (avatarSnapshot.exists()) {
            buddyAvatar = avatarSnapshot.val();
            console.log('✅ Got buddy avatar from Firebase');
          } else if (avatarSeedSnapshot.exists()) {
            const avatarSeed = avatarSeedSnapshot.val();
            const archetype = archetypeSnapshot.exists() ? archetypeSnapshot.val() : 'adventurer';
            buddyAvatar = generateAvatar(avatarSeed, archetype);
            console.log('✅ Generated buddy avatar from seed:', avatarSeed);
          }
          
          if (archetypeSnapshot.exists()) {
            buddyArchetype = archetypeSnapshot.val();
            console.log('✅ Got buddy archetype:', buddyArchetype);
          }
          
          if (heroNameSnapshot.exists()) {
            const buddyHeroName = heroNameSnapshot.val();
            console.log('✅ Got buddy hero name:', buddyHeroName);
            // Update the buddy name to use the real hero name
            buddyName = buddyHeroName;
          }
          
          if (quitDateSnapshot.exists()) {
            buddyQuitDate = quitDateSnapshot.val();
            console.log('✅ Got buddy quit date from Firebase (root):', buddyQuitDate);
          } else if (profileQuitDateSnapshot.exists()) {
            buddyQuitDate = profileQuitDateSnapshot.val();
            console.log('✅ Got buddy quit date from Firebase (profile):', buddyQuitDate);
          } else {
            console.log('⚠️ No buddy quit date found in Firebase (neither root nor profile)');
            console.log('🔍 quitDateSnapshot exists:', quitDateSnapshot.exists());
            console.log('🔍 profileQuitDateSnapshot exists:', profileQuitDateSnapshot.exists());
            
            // Check if profile exists and has any quit date information
            if (profileSnapshot.exists()) {
              const profileData = profileSnapshot.val();
              console.log('🔍 Full profile data available:', profileData);
              
              // Look for quit date in profile data
              if (profileData && profileData.quitDate) {
                buddyQuitDate = profileData.quitDate;
                console.log('✅ Found buddy quit date in profile data:', buddyQuitDate);
              } else {
                console.log('⚠️ Profile exists but has no quit date field');
              }

              // Capture lastActivity as a reliable onboarding timestamp fallback
              if (profileData && profileData.lastActivity) {
                buddyProfileLastActivity = profileData.lastActivity;
                console.log('🔍 Captured buddy lastActivity for fallback:', buddyProfileLastActivity);
              }
            } else {
              console.log('⚠️ No profile data available at all');
            }
            
            // Extract relapse date from profile data for relapse-aware streak calculation
            if (profileSnapshot.exists()) {
              const profileData = profileSnapshot.val();
              buddyLastRelapseDate = profileData.lastRelapseDate || profileData.relapseDate;
              console.log('🔍 Found buddy relapse date:', buddyLastRelapseDate);
            }
            
            if (!buddyQuitDate) {
              console.log('⚠️ No quit date found, checking for createdAt timestamp...');
              console.log('🔍 Buddy user ID:', buddyUserId);
              
              // Fallback to createdAt timestamp if no quit date is found
              if (profileSnapshot.exists()) {
                const profileData = profileSnapshot.val();
                if (profileData.createdAt) {
                  buddyQuitDate = profileData.createdAt;
                  console.log('✅ Using buddy createdAt as quit date:', buddyQuitDate);
                } else {
                  console.log('⚠️ No createdAt timestamp found either - not assigning fallback quit date');
                  buddyQuitDate = undefined;
                }
              } else {
                console.log('⚠️ No profile data available - not assigning fallback quit date');
                buddyQuitDate = undefined;
              }
              
              // For centralized users (User 2 & User 3), don't use hardcoded quit dates
              // Their streak is managed by CentralizedStatService
              if (buddyUserId === 'AmwwlNyHD5T3WthUbyR6bFL0QkF2') {
                console.log('🔄 Arena: User 2 uses centralized stats - no hardcoded quit date needed');
                // Don't set buddyQuitDate - let centralized stats handle it
              } else if (buddyUserId === 'uGZGbLUytbfu8W3mQPW0YAvXTQn1') {
                console.log('🔄 Arena: User 3 uses centralized stats - no hardcoded quit date needed');
                // Don't set buddyQuitDate - let centralized stats handle it
              }
            }
          }
        } catch (profileError) {
          console.log('⚠️ Could not read buddy profile (permission):', profileError.message);
          console.log('🔍 Full profile error details:', profileError);
          console.log('🔍 Trying to access path:', `users/${buddyUserId}`);
          console.log('🔍 Current user can read own profile, but not buddy profile');
        }

        // Use best-available fallback when no explicit quit date found
        // Priority: explicit quitDate -> profile.lastActivity
        // IMPORTANT: never seed with 'now' as it renders as 0 hours and pollutes UI
        const finalBuddyQuitDate = buddyQuitDate || buddyProfileLastActivity || null;

        // For centralized users, don't set quit date that could be used for calculations
        let buddyQuitDateForObject = finalBuddyQuitDate;
        if (buddyUserId === 'uGZGbLUytbfu8W3mQPW0YAvXTQn1' || buddyUserId === 'AmwwlNyHD5T3WthUbyR6bFL0QkF2') {
          console.log(`🔄 Arena: Not setting quit date for centralized buddy ${buddyUserId} - using null to prevent calculations`);
          buddyQuitDateForObject = null; // Prevent any calculations based on quit date
        }

        const transformedBuddy = {
          heroName: buddyName,
          uid: buddyUserId,
          stats: buddyStats,
          quitDate: buddyQuitDateForObject,
          originalQuitDate: buddyQuitDateForObject, // Add for real-time listener compatibility
          finalQuitDate: finalBuddyQuitDate, // Always include for UI fallbacks (read-only)
          lastActivity: buddyProfileLastActivity || null,
          lastRelapseDate: buddyLastRelapseDate, // Add relapse date for Arena calculations
          achievements: [],
          archetype: buddyArchetype,
          avatar: buddyAvatar,
          userId: buddyUserId,
          isRealBuddy: true,
          pairId: buddyPair.id,
          // Include placeholder onboarding data for Special Features generation
          triggers: [],
          dailyPatterns: [],
          copingStrategies: [],
          // Include placeholder Special Features
          specialFeatures: null
        };
        
        console.log('🔍 Firestore: Final buddy object with quit date:', {
          heroName: buddyName,
          originalQuitDate: buddyQuitDate,
          finalQuitDate: finalBuddyQuitDate,
          lastRelapseDate: buddyLastRelapseDate,
          hasOriginalQuitDate: !!buddyQuitDate,
          usingDefaultQuitDate: !buddyQuitDate,
          hasRelapseDate: !!buddyLastRelapseDate
        });
        
        setRealBuddy(transformedBuddy);
        console.log('✅ Firestore: Buddy data loaded successfully');
        console.log('🔍 Firestore: Buddy Special Features data:', {
          hasSpecialFeatures: !!transformedBuddy.specialFeatures,
          hasTriggers: !!transformedBuddy.triggers?.length,
          hasDailyPatterns: !!transformedBuddy.dailyPatterns?.length,
          hasCopingStrategies: !!transformedBuddy.copingStrategies?.length,
          uid: transformedBuddy.uid
        });

        // Prime buddy streak immediately to avoid race with centralized real-time 0-hour values
        try {
          // Do not use finalQuitDate if it's null or within the last 2 minutes (likely a seed),
          // prefer lastRelapseDate, then lastActivity
          let streakSource = transformedBuddy.lastRelapseDate || null;
          if (!streakSource) {
            const fq = transformedBuddy.finalQuitDate;
            if (fq) {
              const fqTime = new Date(fq).getTime();
              const nowTime = Date.now();
              const tooRecent = Math.abs(nowTime - fqTime) < 2 * 60 * 1000; // 2 minutes
              if (!tooRecent) {
                streakSource = fq;
              }
            }
          }
          if (!streakSource && transformedBuddy.lastActivity) {
            streakSource = transformedBuddy.lastActivity;
          }
          if (streakSource) {
            const streak = calculateStreak(new Date(streakSource));
            const primedStreak = {
              streakDays: streak.value,
              streakUnit: streak.unit,
              streakDisplayText: streak.displayText
            };
            if (typeof setBuddyStreakData === 'function') {
              setBuddyStreakData(primedStreak);
            }
            if (typeof setRealTimeNemesisStats === 'function') {
              setRealTimeNemesisStats(prev => ({
                ...prev,
                streakDays: primedStreak.streakDays,
                streakUnit: primedStreak.streakUnit,
                streakDisplayText: primedStreak.streakDisplayText
              }));
            }
            console.log('🔄 Arena: Primed buddy streak from loaded data:', primedStreak.streakDisplayText);
          }
        } catch (primeErr) {
          console.log('⚠️ Arena: Could not prime buddy streak:', primeErr?.message);
        }
        
        // Read centralized stats for ALL buddies (universal system)
        console.log(`🔄 Firestore: Reading centralized buddy stats for ${buddyUserId} (read-only)`);
        try {
          // Read buddy's stats and calculate streak locally (read-only approach)
          try {
            const { ref: statsRef, get } = await import('firebase/database');
            const buddyStatsSnapshot = await get(statsRef(db, `users/${buddyUserId}/stats`));
            
            if (buddyStatsSnapshot.exists()) {
              const buddyStats = buddyStatsSnapshot.val();
              
              // Calculate streak locally using buddy's relapse date
              const now = new Date();
              const lastRelapseDate = transformedBuddy.lastRelapseDate;
              
              if (lastRelapseDate) {
                const relapseDate = new Date(lastRelapseDate);
                const diffMs = now - relapseDate;
                const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                const diffDays = Math.floor(diffHours / 24);
                
                // Update streak in the stats object
                let streakDisplayText;
                let streakDays;
                
                if (diffHours < 24) {
                  streakDisplayText = `${diffHours} hour${diffHours === 1 ? '' : 's'}`;
                  streakDays = 0;
                } else {
                  streakDisplayText = `${diffDays} day${diffDays === 1 ? '' : 's'}`;
                  streakDays = diffDays;
                }
                
                console.log(`🔄 Firestore: Calculated buddy streak locally: ${streakDisplayText} (${diffHours} hours since relapse)`);
                
                // Store buddy streak data separately to prevent reset during tab switches
                const streakData = {
                  streakDays: streakDays,
                  streakUnit: diffHours < 24 ? 'hours' : 'days',
                  streakDisplayText: streakDisplayText
                };
                setBuddyStreakDataFn(streakData);
                
                // Update the stats with calculated streak
                const updatedBuddyStats = {
                  ...buddyStats,
                  streakDays: streakDays,
                  streakUnit: diffHours < 24 ? 'hours' : 'days',
                  streakDisplayText: streakDisplayText
                };
                
                console.log('🔄 Firestore: Using buddy stats with locally calculated streak:', updatedBuddyStats);
                console.log('🔄 Firestore: Buddy streak fields:', {
                  streakDays: updatedBuddyStats.streakDays,
                  streakUnit: updatedBuddyStats.streakUnit,
                  streakDisplayText: updatedBuddyStats.streakDisplayText
                });
                setRealTimeNemesisStatsFn(updatedBuddyStats);
              } else {
                console.log('🔄 Firestore: No relapse date found for buddy, using existing stats');
                setRealTimeNemesisStatsFn(buddyStats);
              }
            } else {
              console.log('⚠️ Firestore: No centralized stats found for buddy, using fallback calculation');
              const calculatedStats = await calculateRealTimeStatsFn(transformedBuddy);
              setRealTimeNemesisStatsFn(calculatedStats);
            }
          } catch (error) {
            console.error('❌ Error reading buddy stats:', error);
            // Fallback to calculated method
            const calculatedStats = await calculateRealTimeStatsFn(transformedBuddy);
            setRealTimeNemesisStatsFn(calculatedStats);
          }
        } catch (error) {
          console.error('❌ Error reading centralized buddy stats:', error);
          // Fallback to calculated method
          const calculatedStats = await calculateRealTimeStatsFn(transformedBuddy);
          setRealTimeNemesisStatsFn(calculatedStats);
        }
        
        // Clean up matching pool (Firestore)
        await removeUsersFromMatchingPool(user.uid, buddyUserId);
        
      } else {
        console.log('ℹ️ Firestore: No buddy pair found for user');
        setRealBuddy(null);
      }
      
    } catch (error) {
      console.error('❌ Firestore: Error loading buddy:', error);
      // Fallback to Realtime Database
      console.log('🔄 Falling back to Realtime Database buddy loading...');
      await loadRealBuddyRealtimeDB();
    } finally {
      setBuddyLoading(false);
    }
  };
  
  // Fallback Realtime Database buddy loading function
  const loadRealBuddyRealtimeDB = async () => {
    try {
      console.log('🔄 Realtime Database: Loading buddy data...');
      
      const { ref, get } = await import('firebase/database');
      
      // Query buddyPairs to find if current user is in any pair
      const buddyPairsRef = ref(db, 'buddyPairs');
      const buddyPairsSnapshot = await get(buddyPairsRef);
      
      if (!buddyPairsSnapshot.exists()) {
        setRealBuddy(null);
        return;
      }
      
      const allPairs = buddyPairsSnapshot.val();
      let buddyPair = null;
      let buddyUserId = null;
      
      // Find the pair containing current user
      for (const [pairId, pairData] of Object.entries(allPairs)) {
        if (pairData.users && Array.isArray(pairData.users) && pairData.users.includes(user.uid)) {
          buddyPair = { ...pairData, pairId };
          buddyUserId = pairData.users.find(id => id !== user.uid);
          break;
        }
      }
      
      if (buddyPair && buddyUserId) {
        // Validate buddy user exists
        const buddyUserRef = ref(db, `users/${buddyUserId}`);
        const buddySnapshot = await get(buddyUserRef);
        
        if (!buddySnapshot.exists()) {
          // Clean up orphaned pair
          const { remove } = await import('firebase/database');
          await remove(ref(db, `buddyPairs/${buddyPair.pairId}`));
          setRealBuddy(null);
          return;
        }
        
        const buddyData = buddySnapshot.val();
        
        // Transform buddy data
        const transformedBuddy = {
          heroName: buddyData.heroName || 'Buddy',
          stats: {
            streakDays: buddyData.stats?.streakDays || 0,
            addictionLevel: buddyData.stats?.addictionLevel || 50,
            willpower: buddyData.stats?.mentalStrength || 50,
            motivation: buddyData.stats?.mentalStrength || 50,
            cravingResistance: buddyData.stats?.mentalStrength || 50,
            triggerDefense: buddyData.stats?.triggerDefense || 30,
            experiencePoints: buddyData.stats?.experiencePoints || 0
          },
          achievements: buddyData.achievements || [],
          archetype: buddyData.archetype || 'The Determined',
          avatar: buddyData.avatar || generateAvatar(buddyData.heroName || 'buddy', 'adventurer'),
          uid: buddyUserId, // Add uid property for Special Features loading
          userId: buddyUserId,
          lastRelapseDate: buddyData.lastRelapseDate, // Add relapse date for streak calculations
          isRealBuddy: true,
          pairId: buddyPair.pairId,
          // Include buddy's onboarding data for Special Features generation
          triggers: buddyData.triggers || [],
          dailyPatterns: buddyData.dailyPatterns || [],
          copingStrategies: buddyData.copingStrategies || [],
          // Include existing Special Features if available
          specialFeatures: buddyData.specialFeatures || null
        };
        
        setRealBuddy(transformedBuddy);
        console.log('🔍 RealtimeDB: Buddy Special Features data:', {
          hasSpecialFeatures: !!transformedBuddy.specialFeatures,
          hasTriggers: !!transformedBuddy.triggers?.length,
          hasDailyPatterns: !!transformedBuddy.dailyPatterns?.length,
          hasCopingStrategies: !!transformedBuddy.copingStrategies?.length,
          uid: transformedBuddy.uid
        });
        
        // Clean up matching pool
        await removeUsersFromMatchingPool(user.uid, buddyUserId);
        
      } else {
        setRealBuddy(null);
      }
      
    } catch (error) {
      console.error('Error loading buddy from Realtime Database:', error);
      setBuddyError('Failed to load buddy data');
      setRealBuddy(null);
    }
  };

  // Remove users from matching pool after successful buddy pairing
  const removeUsersFromMatchingPool = async (user1Id, user2Id) => {
    try {
      // Use ref for immediate access, fallback to state
      const service = firestoreBuddyServiceRef.current || firestoreBuddyService;
      
      if (service && realBuddy?.pairId) {
        // Use Firestore for matching pool removal
        console.log('🔄 Firestore: Removing users from matching pool');
        
        // Remove both users from Firestore matching pool
        await service.removeFromMatchingPool(user1Id);
        await service.removeFromMatchingPool(user2Id);
        
        // Update buddy pair in Firestore to mark users as removed from pool
        const { doc, updateDoc } = await import('firebase/firestore');
        const pairRef = doc(firestore, 'buddyPairs', realBuddy.pairId);
        await updateDoc(pairRef, {
          user1RemovedFromPool: true,
          user2RemovedFromPool: true
        });
        
        console.log('✅ Firestore: Users removed from matching pool and pair updated');
      } else {
        // Fallback to Realtime Database
        console.log('🔄 Realtime Database: Removing users from matching pool');
        
        const { ref, remove, set } = await import('firebase/database');
        
        // Remove both users from matchingPool
        await remove(ref(db, `matchingPool/${user1Id}`));
        await remove(ref(db, `matchingPool/${user2Id}`));
        
        // Update buddy pair to mark users as removed from pool
        if (realBuddy?.pairId) {
          await set(ref(db, `buddyPairs/${realBuddy.pairId}/user1RemovedFromPool`), true);
          await set(ref(db, `buddyPairs/${realBuddy.pairId}/user2RemovedFromPool`), true);
        }
        
        console.log('✅ Realtime Database: Users removed from matching pool and pair updated');
      }
      
    } catch (error) {
      console.error('❌ Error removing users from matching pool:', error);
    }
  };

  // Clean up orphaned buddy pairs that reference non-existent users
  const cleanupOrphanedBuddyPairs = async () => {
    try {
      const { ref, get, remove } = await import('firebase/database');
      
      const buddyPairsRef = ref(db, 'buddyPairs');
      const buddyPairsSnapshot = await get(buddyPairsRef);
      
      if (!buddyPairsSnapshot.exists()) {
        return;
      }
      
      const allPairs = buddyPairsSnapshot.val();
      
      for (const [pairId, pairData] of Object.entries(allPairs)) {
        if (pairData.users && Array.isArray(pairData.users)) {
          // Check if both users in the pair still exist
          let bothUsersExist = true;
          for (const userId of pairData.users) {
            const userRef = ref(db, `users/${userId}`);
            const userSnapshot = await get(userRef);
            if (!userSnapshot.exists()) {
              bothUsersExist = false;
              break;
            }
          }
          
          if (!bothUsersExist) {
            await remove(ref(db, `buddyPairs/${pairId}`));
          }
        }
      }
      
    } catch (error) {
      console.error('Error cleaning up orphaned buddy pairs:', error);
    }
  };





  // Reset buddy load attempt when user changes
  useEffect(() => {
    setBuddyLoadAttempted(false);
    setRealBuddy(null);
  }, [user?.uid]);
  
  // Load buddy data when user changes - Simplified to prevent crashes
  useEffect(() => {
    if (user?.uid && !realBuddy && !buddyLoading && !buddyLoadAttempted) {
      // We'll handle buddy loading inside the Arena component where the functions are available
      console.log('🔄 Buddy loading will be handled by Arena component');
    }
  }, [user?.uid, realBuddy, buddyLoading, buddyLoadAttempted]);
  
  // Monitor FirestoreBuddyService state changes
  useEffect(() => {
    if (firestoreBuddyService) {
      console.log('✅ FirestoreBuddyService is now available');
    }
  }, [firestoreBuddyService]);
  
  // Auto-match available users - NEW CHAIN PAIRING SYSTEM
  const autoMatchUsers = async () => {
    try {
      // Use ref for immediate access, fallback to state
      const service = firestoreBuddyServiceRef.current || firestoreBuddyService;
      
      if (!service) {
        console.log('⚠️ FirestoreBuddyService not available, falling back to Realtime Database');
        await autoMatchUsersRealtimeDB();
        return;
      }
      
      console.log('✅ Using Firestore for auto-matching');
      console.log('🔄 Firestore: Starting NEW CHAIN PAIRING algorithm...');
      
      // Get all users in Firestore matching pool
      const poolUsers = await service.getAllMatchingPoolUsers();
      
      console.log('🔍 Firestore: Current matching pool state:', {
        totalUsers: poolUsers.length,
        userIds: poolUsers.map(u => ({ id: u.userId, name: u.heroName, joinedAt: u.joinedAt }))
      });
      
      if (poolUsers.length < 2) {
        console.log('ℹ️ Firestore: Not enough users in matching pool for pairing (need 2, have', poolUsers.length, ')');
        return;
      }
      
      console.log(`🔄 Firestore: Found ${poolUsers.length} users in matching pool`);
      
      // Skip validation step to avoid permission errors
      // Assume all users in matching pool are valid for now
      const validPoolUsers = poolUsers;
      console.log('ℹ️ Firestore: Skipping user validation to avoid permission errors');
      
      // CORRECTED CHAIN PAIRING LOGIC:
      // Sort users by joinedAt timestamp (oldest first)
      validPoolUsers.sort((a, b) => {
        const timeA = a.joinedAt ? new Date(a.joinedAt).getTime() : 0;
        const timeB = b.joinedAt ? new Date(b.joinedAt).getTime() : 0;
        return timeA - timeB; // Oldest first
      });
      
      console.log('🔄 Firestore: Sorted users by join time (oldest first):', 
        validPoolUsers.map(u => ({ userId: u.userId, joinedAt: u.joinedAt }))
      );
      
      // SEQUENTIAL CHAIN PAIRING: Each new user pairs with the most recent user
      // We need at least 2 users to create a pair
      if (validPoolUsers.length >= 2) {
        // The NEWEST user (last in sorted array) is the "arriving" user
        const arrivingUser = validPoolUsers[validPoolUsers.length - 1];
        // The SECOND NEWEST user (second to last) is the "target" user for pairing
        const targetUser = validPoolUsers[validPoolUsers.length - 2];
        
        if (arrivingUser.userId !== targetUser.userId) {
          try {
            console.log(`🔄 Firestore: SEQUENTIAL PAIRING: ${arrivingUser.userId} (${arrivingUser.heroName}) pairs with ${targetUser.userId} (${targetUser.heroName})`);
            
            // Create buddy pair in Firestore
            const pairData = {
              matchedAt: new Date().toISOString(),
              compatibilityScore: 0.85,
              matchReasons: ['Chain pairing algorithm', 'Arriving user paired with waiting user'],
              status: 'active',
              lastMessageAt: new Date().toISOString(),
              user1RemovedFromPool: false,
              user2RemovedFromPool: false,
              // Store user names for easier buddy display (match the ID assignment order)
              user1Name: arrivingUser.heroName || 'User 1', // arrivingUser becomes user1Id
              user2Name: targetUser.heroName || 'User 2'    // targetUser becomes user2Id
            };
            
            console.log('🔄 Firestore: About to call createBuddyPair with data:', {
              arrivingUserId: arrivingUser.userId,
              targetUserId: targetUser.userId,
              pairData
            });
            
            const pairId = await service.createBuddyPair(arrivingUser.userId, targetUser.userId, pairData);
            
            console.log('🔄 Firestore: createBuddyPair returned:', pairId);
            
            if (pairId) {
              // Update user profiles with buddy info in Realtime Database
              const { ref, set } = await import('firebase/database');
              
              // SEQUENTIAL PAIRING: Both users see each other as buddies
              await set(ref(db, `users/${targetUser.userId}/buddyInfo`), {
                hasBuddy: true,
                buddyId: arrivingUser.userId,
                pairId: pairId,
                matchedAt: pairData.matchedAt
              });
              
              await set(ref(db, `users/${arrivingUser.userId}/buddyInfo`), {
                hasBuddy: true,
                buddyId: targetUser.userId,
                pairId: pairId,
                matchedAt: pairData.matchedAt
              });
              
              // CRITICAL: Remove ONLY the target user from matching pool
              // The arriving user stays in the pool for the next pairing
              await service.removeFromMatchingPool(targetUser.userId);
              
              console.log(`✅ Firestore: SEQUENTIAL PAIRING: Created buddy pair ${pairId}`);
              console.log(`✅ Firestore: SEQUENTIAL PAIRING: Removed ${targetUser.userId} (${targetUser.heroName}) from matching pool`);
              console.log(`✅ Firestore: SEQUENTIAL PAIRING: Kept ${arrivingUser.userId} (${arrivingUser.heroName}) in matching pool for next pairing`);
              
              // If current user was matched, reload their buddy data
              if (user?.uid) {
                const currentUserMatched = [arrivingUser.userId, targetUser.userId].includes(user.uid);
                if (currentUserMatched) {
                  try {
                    // Buddy reloading will be handled by Arena component
                    console.log('🔄 Buddy reloading will be handled by Arena component after matching');
                  } catch (reloadError) {
                    console.error('Error reloading buddy data:', reloadError);
                  }
                }
              }
            } else {
              console.error(`❌ Firestore: Failed to create buddy pair between ${arrivingUser.userId} and ${targetUser.userId}`);
            }
            
          } catch (pairError) {
            console.error(`❌ Firestore: Failed to create buddy pair between ${arrivingUser.userId} and ${targetUser.userId}:`, pairError);
          }
        } else {
          console.log('ℹ️ Firestore: Same user in pool, cannot pair');
        }
      } else {
        console.log('ℹ️ Firestore: Not enough users in pool for pairing (need 2, have', validPoolUsers.length, ')');
      }
      
    } catch (error) {
      console.error('❌ Firestore: Auto-matching failed:', error);
      // Fallback to Realtime Database
      console.log('🔄 Falling back to Realtime Database auto-matching...');
      await autoMatchUsersRealtimeDB();
    }
  };
  
  // Fallback Realtime Database auto-matching function - NEW CHAIN PAIRING SYSTEM
  const autoMatchUsersRealtimeDB = async () => {
    try {
      console.log('🔄 Realtime Database: Starting fallback auto-matching...');
      
      // Import Firebase functions
      const { ref, get, set, push, remove } = await import('firebase/database');
      
      // Get all users in matching pool
      const matchingPoolRef = ref(db, 'matchingPool');
      const matchingPoolSnapshot = await get(matchingPoolRef);
      
      if (!matchingPoolSnapshot.exists()) {
        console.log('ℹ️ Realtime Database: No users in matching pool');
        return;
      }
      
      // Support both formats: keyed by uid (value true/object) OR pushed with inner { uid | userId }
      const raw = matchingPoolSnapshot.val();
      const poolUsers = [];
      Object.entries(raw).forEach(([key, value]) => {
        if (typeof value === 'string') {
          poolUsers.push(value);
        } else if (value && typeof value === 'object') {
          if (value.uid) poolUsers.push(value.uid);
          else if (value.userId) poolUsers.push(value.userId);
          else poolUsers.push(key); // fallback assume key is uid
        } else {
          poolUsers.push(key);
        }
      });
      
      console.log(`🔄 Realtime Database: Found ${poolUsers.length} users in matching pool`);
      
      if (poolUsers.length < 2) {
        console.log('ℹ️ Realtime Database: Not enough users for pairing (need 2, have', poolUsers.length, ')');
        return;
      }
      
      // Skip validation step to avoid permission errors
      // Assume all users in matching pool are valid for now
      const validPoolUsers = poolUsers;
      console.log('ℹ️ Realtime Database: Skipping user validation to avoid permission errors');
      
      console.log(`🔄 Realtime Database: Valid users for pairing: ${validPoolUsers.join(', ')}`);
      
      // CORRECTED CHAIN PAIRING LOGIC for Realtime Database:
      // Create pool users with default timestamps to avoid permission errors
      const poolUsersWithTimestamps = validPoolUsers.map((userId, index) => ({
        userId: userId,
        joinedAt: new Date(Date.now() - (validPoolUsers.length - index) * 1000).toISOString() // Simulate different join times
      }));
      
      // Sort by joinedAt timestamp (oldest first)
      poolUsersWithTimestamps.sort((a, b) => {
        const timeA = a.joinedAt ? new Date(a.joinedAt).getTime() : 0;
        const timeB = b.joinedAt ? new Date(b.joinedAt).getTime() : 0;
        return timeA - timeB; // Oldest first
      });
      
      console.log('🔄 Realtime Database: Sorted users by join time (oldest first):', 
        poolUsersWithTimestamps.map(u => ({ userId: u.userId, joinedAt: u.joinedAt }))
      );
      
      // CHAIN PAIRING: Each new user pairs with the previous user in the pool
      // We need at least 2 users to create a pair
      if (poolUsersWithTimestamps.length >= 2) {
        // The OLDEST user (first in sorted array) is the "waiting" user
        const waitingUser = poolUsersWithTimestamps[0];
        // The NEWEST user (last in sorted array) is the "arriving" user
        const arrivingUser = poolUsersWithTimestamps[poolUsersWithTimestamps.length - 1];
        
        if (waitingUser && arrivingUser && waitingUser.userId !== arrivingUser.userId) {
          console.log(`🔄 Realtime Database: CHAIN PAIRING: ${arrivingUser.userId} (arriving) pairs with ${waitingUser.userId} (waiting)`);
          
          try {
            // Create buddy pair
            const pairId = push(ref(db, 'buddyPairs')).key;
            
            const pairData = {
              pairId: pairId,
              users: [arrivingUser.userId, waitingUser.userId],
              matchedAt: new Date().toISOString(),
              compatibilityScore: 0.85,
              matchReasons: ['Chain pairing algorithm', 'Arriving user paired with waiting user'],
              status: 'active',
              lastMessageAt: new Date().toISOString(),
              user1RemovedFromPool: false,
              user2RemovedFromPool: false
            };
            
            await set(ref(db, `buddyPairs/${pairId}`), pairData);
            
            // BOTH users see each other as buddies (bidirectional pairing)
            await set(ref(db, `users/${waitingUser.userId}/buddyInfo`), {
              hasBuddy: true,
              buddyId: arrivingUser.userId,
              pairId: pairId,
              matchedAt: pairData.matchedAt
            });
            
            await set(ref(db, `users/${arrivingUser.userId}/buddyInfo`), {
              hasBuddy: true,
              buddyId: waitingUser.userId,
              pairId: pairId,
              matchedAt: pairData.matchedAt
            });
            
            // CRITICAL: Remove ONLY the waiting user from matching pool
            // The arriving user stays in the pool for the next pairing
            Object.keys(raw).forEach(async (entryKey) => {
              const entry = raw[entryKey];
              const entryUid = entry?.uid || entry?.userId || entryKey;
              if (entryUid === waitingUser.userId) {
                await remove(ref(db, `matchingPool/${entryKey}`));
                console.log(`✅ Realtime Database: Removed ${waitingUser.userId} (waiting) from matching pool`);
              }
            });
            
            // Update buddy pair pool removal flags
            await set(ref(db, `buddyPairs/${pairId}/user1RemovedFromPool`), true);
            await set(ref(db, `buddyPairs/${pairId}/user2RemovedFromPool`), false); // Arriving user stays in pool
            
            console.log(`✅ Realtime Database: CHAIN PAIRING: Created buddy pair ${pairId}`);
            console.log(`✅ Realtime Database: CHAIN PAIRING: Kept ${arrivingUser.userId} (arriving) in matching pool for next pairing`);
            
          } catch (pairError) {
            console.error('Error creating buddy pair:', pairError);
          }
        } else {
          console.log('ℹ️ Realtime Database: Same user in pool, cannot pair');
        }
      } else {
        console.log('ℹ️ Realtime Database: Not enough users in pool for pairing (need 2, have', poolUsersWithTimestamps.length, ')');
      }
      
      // If current user was matched, reload their buddy data
      if (user?.uid && poolUsersWithTimestamps.length >= 2) {
        const waitingUser = poolUsersWithTimestamps[0];
        const arrivingUser = poolUsersWithTimestamps[poolUsersWithTimestamps.length - 1];
        const currentUserMatched = [arrivingUser?.userId, waitingUser?.userId].includes(user.uid);
        if (currentUserMatched) {
          try {
            // Buddy reloading will be handled by Arena component
            console.log('🔄 Buddy reloading will be handled by Arena component after matching');
          } catch (reloadError) {
            console.error('Error reloading buddy data:', reloadError);
          }
        }
      }
      
    } catch (error) {
      console.error('Error in Realtime Database auto-matching:', error);
    }
  };



  // Empty nemesis data (used when no real buddy is available)
  const emptyNemesis = {
    heroName: '',
    stats: null, // No stats needed for empty state
    achievements: [],
    archetype: '',
    avatar: null,
    isEmpty: true,
    message: 'We are looking for a suitable buddy for you'
  };

  // Get current opponent (real buddy or fallback)
  const getCurrentOpponent = () => {
    if (buddyLoading) {
      return {
        heroName: 'Loading Buddy...',
        stats: {
          streakDays: 0,
          addictionLevel: 50,
          willpower: 50,
          motivation: 50,
          cravingResistance: 50,
          triggerDefense: 30,
          experiencePoints: 0
        },
        achievements: [],
        archetype: 'DETERMINED', // Use a valid archetype instead of 'LOADING'
        avatar: generateAvatar('loading', 'adventurer'),
        isLoading: true
      };
    }
    
    if (buddyError) {
      return {
        heroName: 'Error Loading Buddy',
        stats: {
          streakDays: 0,
          addictionLevel: 50,
          willpower: 50,
          motivation: 50,
          cravingResistance: 50,
          triggerDefense: 30,
          experiencePoints: 0
        },
        achievements: [],
        archetype: 'DETERMINED', // Use a valid archetype instead of 'ERROR'
        avatar: generateAvatar('error', 'adventurer'),
        isError: true,
        errorMessage: buddyError
      };
    }
    
    return realBuddy || emptyNemesis;
  };

  const handleOnboardingComplete = async (userData) => {
    console.log('Onboarding completed with user data:', userData);
    
    try {
      // Validate user data before setting state
      if (!userData || !userData.heroName || !userData.stats) {
        throw new Error('Invalid user data received from onboarding');
      }
      
      // Ensure we have an authenticated user
      if (!authUser) {
        throw new Error('No authenticated user found');
      }
      
      // Add Firebase user data to the user profile
      const now = new Date();
      const completeUserData = {
        ...userData,
        uid: authUser.uid,
        email: authUser.email,
        displayName: authUser.displayName || userData.heroName,
        photoURL: authUser.photoURL,
        onboardingCompleted: true,
        createdAt: now.toISOString(), // Set registration timestamp
        updatedAt: now.getTime(),
        // Set quit date to onboarding time (user starts their quit journey now)
        originalQuitDate: now.toISOString(),
        lastQuitDate: now.toISOString(),
        // Per streak rules: last relapse is onboarding time until a real relapse is logged
        lastRelapseDate: now.toISOString(),
        // Initialize activity tracking
        lastActivity: now.toISOString(),
        // Set initial daily activity for today
        daily: {
          [now.toDateString()]: {
            logged: true,
            onboarding: true
          }
        }
      };
      
      console.log('Saving user data to Firebase:', completeUserData);
      
                      // Import Firebase functions dynamically
                const { ref, set } = await import('firebase/database');
                
                // Save to Firebase
                const userRef = ref(db, `users/${authUser.uid}`);
                await set(userRef, completeUserData);
      
      console.log('Firebase save successful, updating app state...');
      
      // Update app state AFTER successful Firebase save
      setUser(completeUserData);
      setHasCompletedOnboarding(true);
      
      // Add user to buddy matching pool using Firestore
      try {
        // Use ref for immediate access, fallback to state
        const service = firestoreBuddyServiceRef.current || firestoreBuddyService;
        

        
        if (!service) {
          console.log('⚠️ FirestoreBuddyService not available, falling back to Realtime Database');
          // Fallback to Realtime Database
          const { ref, set } = await import('firebase/database');
          const matchingPoolData = {
            quitStartDate: completeUserData.quitDate || new Date().toISOString(),
            addictionLevel: completeUserData.stats.addictionLevel || 50,
            triggers: completeUserData.triggers || [],
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            quitExperience: completeUserData.quitAttempts || 'first',
            availableForMatching: true,
            lastActive: Date.now(),
            userId: authUser.uid,
            heroName: completeUserData.heroName,
            archetype: completeUserData.archetype,
            joinedAt: new Date().toISOString() // CRITICAL: Add timestamp for chain pairing
          };
          await set(ref(db, `matchingPool/${authUser.uid}`), matchingPoolData);
          console.log('✅ User added to Realtime Database matching pool (fallback)');
        } else {
          // Use Firestore for matching pool
          console.log('✅ Using Firestore for matching pool');
          const matchingPoolData = {
            quitStartDate: completeUserData.quitDate || new Date().toISOString(),
            addictionLevel: completeUserData.stats.addictionLevel || 50,
            triggers: completeUserData.triggers || [],
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            quitExperience: completeUserData.quitAttempts || 'first',
            availableForMatching: true,
            lastActive: new Date(),
            userId: authUser.uid,
            heroName: completeUserData.heroName,
            archetype: completeUserData.archetype,
            joinedAt: new Date().toISOString() // CRITICAL: Add timestamp for chain pairing
          };
          
          const success = await service.addToMatchingPool(authUser.uid, matchingPoolData);
          if (success) {
            console.log('✅ User successfully added to Firestore matching pool');
          } else {
            throw new Error('Failed to add user to Firestore matching pool');
          }
        }
        
        // Trigger automatic matching after adding user to pool
        try {
          // Add a small delay to ensure the user is fully added to the pool
          console.log('⏳ Waiting 1 second before attempting auto-matching...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          await autoMatchUsers();
        } catch (error) {
          console.error('Automatic matching failed:', error);
          // Continue even if auto-matching fails
        }
      } catch (error) {
        console.error('⚠️ Failed to add user to buddy matching pool:', error);
        // Continue with onboarding even if buddy matching fails
      }
      
      // Load all user data to ensure complete synchronization
      const dataLoaded = await loadAllUserDataWithOffline(authUser.uid);
      
      setCurrentView('arena');
      
    } catch (error) {
      console.error('Error in handleOnboardingComplete:', error);
      
      // Create fallback user data
      const now = new Date();
      const fallbackUser = {
        heroName: userData?.heroName || 'Hero',
        archetype: userData?.archetype || 'The Determined',
        avatar: userData?.avatar || generateAvatar('fallback'),
        stats: {
          addictionLevel: 50,
          mentalStrength: 50,
          motivation: 50,
          triggerDefense: 30,
          streakDays: 0,
          experiencePoints: 0
        },
        achievements: [],
        quitDate: now,
        createdAt: now.toISOString(), // Set registration timestamp
        lastActivity: now.toISOString(), // Set initial activity timestamp
        lastRelapseDate: now.toISOString(),
        uid: authUser?.uid,
        email: authUser?.email,
        onboardingCompleted: true
      };
      
      // Try to save fallback data to Firebase
      if (authUser) {
        try {
          const { ref, set } = await import('firebase/database');
          const userRef = ref(db, `users/${authUser.uid}`);
          await set(userRef, fallbackUser);
        } catch (firebaseError) {
          console.error('Failed to save fallback data to Firebase:', firebaseError);
          // Continue with local state even if Firebase save fails
        }
      }
      
      // Set app state with fallback data
      setUser(fallbackUser);
      setHasCompletedOnboarding(true);
      setCurrentView('arena');
    }
  };

  const handleResetApp = () => {
    // Clear user data and reset to onboarding
    setUser(null);
    setHasCompletedOnboarding(false);
    setCurrentView('onboarding');
    setActiveTab('arena');
    setSelectedMood(null);
    
    // Clear local storage
    localStorage.removeItem('quitCoachUser');
  };

  // Enhanced logout functionality with complete state cleanup
  const handleBackToLogin = async () => {
    try {
      console.log('Logging out user...');
      
      // Sign out from Firebase Auth
      const { signOut } = await import('firebase/auth');
      await signOut(auth);
      
      // Clear all local state
      setUser(null);
      setAuthUser(null);
      setHasCompletedOnboarding(false);
      setCurrentView('auth');
      
      // Clear any local storage data
      localStorage.removeItem('cravingWins');
      localStorage.removeItem('specialFeatures');
      
      console.log('User successfully logged out and redirected to login screen');
    } catch (error) {
      console.error('Error during logout:', error);
      // Force logout even if Firebase signOut fails
      setUser(null);
      setAuthUser(null);
      setHasCompletedOnboarding(false);
      setCurrentView('auth');
    }
  };

  // Reset account for testing - clear ALL user data from database
  const handleResetForTesting = async () => {
    if (!authUser) {
      console.error('No authenticated user to reset');
      return;
    }
    try {
      console.log('Resetting ALL user data for testing...');
      const { ref, set, remove } = await import('firebase/database');
      
      // Clear current user data
      const userRef = ref(db, `users/${authUser.uid}`);
      await set(userRef, null);
      
      // Clear ALL users data (for complete system reset)
      const allUsersRef = ref(db, 'users');
      await set(allUsersRef, null);
      
      // Clear buddy matching data to prevent orphaned references
      const buddyPairsRef = ref(db, 'buddyPairs');
      await set(buddyPairsRef, null);
      
      const matchingPoolRef = ref(db, 'matchingPool');
      await set(matchingPoolRef, null);
      
      console.log('All user data and buddy matching data cleared from database');
      
      // Reset local state
      setUser(null);
      setHasCompletedOnboarding(false);
      setCurrentView('onboarding');
      setRealBuddy(null);
      setBuddyLoading(false);
      setBuddyError(null);
      console.log('Account reset successful - ready for fresh onboarding');
    } catch (error) {
      console.error('Error resetting account for testing:', error);
    }
  };

  const handleTabChange = (tabId) => {
    console.log('Tab changed to:', tabId);
    setActiveTab(tabId);
    setCurrentView(tabId);
    
    // When returning to Arena, force fresh stats reload to catch any stat changes from other tabs
    if (tabId === 'arena' && user?.uid) {
      console.log('🔄 Tab: Returning to Arena, forcing fresh stats reload...');
      setTimeout(() => {
        // Trigger a fresh calculation of real-time stats
        if (typeof refreshStats === 'function') {
          console.log('🔄 Tab: Delayed refresh after tab switch...');
          refreshStats();
        }
      }, 1000); // Longer delay to ensure Firebase writes are committed
    }
  };

  const handleNavigate = (destination) => {
    if (destination === 'mood-selector') {
      setCurrentView('mood-selector');
    } else {
      setCurrentView('profile');
    }
  };

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setCurrentView('profile');
  };

  const handleBackToProfile = () => {
    setCurrentView('profile');
  };

  // Show loading screen while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-6"></div>
          <h2 className="text-3xl font-bold mb-4">🔐 Restoring Session...</h2>
          <p className="text-xl text-gray-300 mb-4">Checking authentication state</p>
          <div className="bg-slate-800/50 rounded-lg p-4 max-w-md mx-auto">
            <div className="text-sm text-gray-400 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-blue-400">✓</span>
                Checking Firebase Auth persistence
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-400">✓</span>
                Verifying user session (30 days)
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-400">✓</span>
                Loading user data from database
              </div>
            </div>
          </div>
          <p className="text-gray-400 text-sm mt-4">
            This should take only a few seconds
          </p>
        </div>
      </div>
    );
  }

  // Show authentication screen if not authenticated
  if (currentView === 'auth') {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  // Show data loading screen while fetching user data
  if (dataLoadingState.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-6"></div>
          <h2 className="text-3xl font-bold mb-4">📊 Loading Your Data...</h2>
          <p className="text-xl text-gray-300 mb-4">{dataLoadingState.currentStep}</p>
          
          {/* Progress Bar */}
          <div className="bg-slate-800/50 rounded-lg p-4 max-w-md mx-auto mb-6">
            <div className="w-full bg-slate-700 rounded-full h-3 mb-3">
              <div 
                className="bg-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${dataLoadingState.progress}%` }}
              ></div>
            </div>
            <div className="text-sm text-gray-400">
              {dataLoadingState.progress}% Complete
            </div>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-4 max-w-md mx-auto">
            <div className="text-sm text-gray-400 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-blue-400">✓</span>
                Profile and onboarding data
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-400">✓</span>
                Battle stats and progress
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-400">✓</span>
                Habits and achievements
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-400">✓</span>
                Setting up live sync
              </div>
            </div>
          </div>
          
          {dataLoadingState.error && (
            <div className="mt-4 p-3 bg-red-600/20 border border-red-500/30 rounded-lg max-w-md mx-auto">
              <p className="text-red-300 text-sm">
                <span className="font-semibold">Error:</span> {dataLoadingState.error}
              </p>
              <p className="text-red-400 text-xs mt-1">
                Don't worry, you can still use the app with basic functionality
              </p>
            </div>
          )}
          
          <p className="text-gray-400 text-sm mt-4">
            Syncing your data across all devices...
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative">
      {/* Pull-to-refresh indicator */}
      {pullToRefreshY > 0 && (
        <div 
          className="fixed top-0 left-0 right-0 z-50 bg-blue-600 text-white text-center py-2 transition-transform duration-200"
          style={{ transform: `translateY(${Math.max(0, pullToRefreshY - 60)}px)` }}
        >
          {pullToRefreshY > 80 ? 'Release to refresh' : 'Pull to refresh'}
        </div>
      )}
      
      {/* Refreshing indicator */}
      {isRefreshing && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-green-600 text-white text-center py-2">
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
            <span>Refreshing...</span>
          </div>
        </div>
      )}

      {/* Offline Indicator */}
      <OfflineIndicator offlineManager={offlineManager} />
            

      {/* Onboarding Flow */}
      {currentView === 'onboarding' && (
        <div>
  
          <OnboardingFlow 
            onComplete={handleOnboardingComplete} 
            authUser={authUser} 
            pwaInstallAvailable={pwaInstallAvailable}
            promptInstall={promptInstall}
          />
        </div>
      )}

      {/* Main App Content - Only show after onboarding */}
      {hasCompletedOnboarding && user ? (
        <>
  
          {currentView === 'arena' && (
            <div>
              {(() => {
                try {
                  const currentOpponent = getCurrentOpponent();
                  return (
                    <ArenaView 
                            key={`arena-${user.uid}-${statsUpdateTrigger}`}
                            user={user}
                            userStats={userStats}
                            nemesis={currentOpponent}
                            onBackToLogin={handleBackToLogin}
                            onResetForTesting={handleResetForTesting}
                            buddyLoading={buddyLoading}
                            buddyError={buddyError}
                            realBuddy={realBuddy}
                            loadRealBuddy={loadRealBuddy}
                            buddyLoadAttempted={buddyLoadAttempted}
                          />
                        );
                } catch (error) {
                  console.error('Error rendering ArenaView:', error);
                  return (
                    <div className="text-white text-center p-8">
                      <h2 className="text-2xl font-bold mb-4">Error Loading Arena</h2>
                      <p className="text-gray-300 mb-4">{error.message}</p>
                      <button 
                        onClick={() => window.location.reload()} 
                        className="bg-blue-600 px-4 py-3 rounded hover:bg-blue-700 min-h-[44px]"
                      >
                        Reload App
                      </button>
                    </div>
                  );
                }
              })()}
            </div>
          )}
          
          {currentView === 'craving-support' && (
            <div>
              <CravingSupportView 
                user={user}
                nemesis={getCurrentOpponent()}
                onBackToLogin={handleBackToLogin}
                onResetForTesting={handleResetForTesting}
                behavioralService={behavioralService}
                onBreathingComplete={async (breathingData) => {
                  await handleBreathingComplete();
                  
                  // The completion message is already handled in handleBreathingComplete()
                  // Additional logging for modal-specific data can be done here if needed
                }}
                setActiveTab={setActiveTab}
              />
            </div>
          )}
          
          {currentView === 'profile' && (
            <div>
              <ProfileView 
                user={user}
                onNavigate={handleNavigate}
              />
            </div>
          )}
          
          {currentView === 'mood-selector' && (
            <MoodSelector 
              onMoodSelect={handleMoodSelect}
              onBack={handleBackToProfile}
            />
          )}
          
          
          {currentView === 'settings' && (
            <SettingsView 
              onResetApp={handleResetApp}
              onBackToLogin={handleBackToLogin}
              onResetForTesting={handleResetForTesting}
              firestoreBuddyService={firestoreBuddyService}
              firestoreBuddyServiceRef={firestoreBuddyServiceRef}
              initializeFirestoreBuddyService={initializeFirestoreBuddyService}
              behavioralService={behavioralService}
              user={user}
              onShowAnalytics={() => setShowAnalytics(true)}
            />
          )}

          {/* Analytics Dashboard Modal */}
          {showAnalytics && (
            <AnalyticsDashboard 
              user={user}
              behavioralService={behavioralService}
              onClose={() => setShowAnalytics(false)}
            />
          )}

          {/* Bottom Navigation */}
          <BottomNavigation 
            activeTab={activeTab} 
            onTabChange={handleTabChange}
            dataLoadingState={dataLoadingState}
            onRefreshData={refreshUserData}
            offlineManager={offlineManager}
          />
        </>
      ) : (
        /* Fallback for debugging */
        <div className="flex items-center justify-center min-h-screen text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Loading...</h2>
            <p className="text-gray-300">
              {!hasCompletedOnboarding ? 'Onboarding not completed' : 'User data missing'}
            </p>
            <p className="text-gray-300">Current view: {currentView}</p>
            <p className="text-gray-300">User data: {user ? JSON.stringify(user, null, 2) : 'None'}</p>
            <button 
              onClick={() => {
                console.log('Debug button clicked');
                console.log('Current state:', { hasCompletedOnboarding, user, currentView });
                console.log('User data:', user);
              }}
              className="mt-4 px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 min-h-[44px]"
            >
              Debug State
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;