import React, { useState, useEffect, useRef } from 'react';
// Initialize Firebase once app mounts; safe to tree-shake unused exports
import { db, auth, firestore } from './services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import StatManager from './services/statManager.js';
import BuddyMatchingService from './services/buddyMatchingService.js';
import FirestoreBuddyService from './services/firestoreBuddyService.js';

// Debug: Check if FirestoreBuddyService is imported correctly
console.log('🧪 FirestoreBuddyService import check:', !!FirestoreBuddyService);
console.log('🧪 FirestoreBuddyService type:', typeof FirestoreBuddyService);
console.log('🧪 FirestoreBuddyService constructor:', FirestoreBuddyService?.name);

import AuthScreen from './components/AuthScreen';
import OfflineIndicator from './components/OfflineIndicator';
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

// Onboarding Flow Component
const OnboardingFlow = ({ onComplete, authUser }) => {
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
            moneySaved: 0,
            experiencePoints: 0
          },
          achievements: [],
          quitDate: new Date()
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
            moneySaved: 0,
            experiencePoints: 0
          },
          achievements: [],
          quitDate: new Date()
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
                  className="flex-1 h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-gray-400 text-sm">10</span>
              </div>
              <div className="text-center mt-2">
                <span className="text-white font-bold text-lg">{userData.confidence}</span>
                <span className="text-gray-400 text-sm ml-2">/ 10</span>
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

const SPECIAL_FEATURES = [
  'Stress Vaper', 'Night Owl', 'Weekend Warrior', 'Social Smoker',
  'Coffee Companion', 'Work Breaker', 'Gaming Buddy', 'Party Animal',
  'Stress Reliever', 'Boredom Fighter', 'Emotional Support', 'Habit Former',
  'Peer Pressure', 'Celebration Trigger', 'Anxiety Soother', 'Focus Enhancer',
  'Reward Seeker', 'Routine Builder', 'Social Lubricant', 'Mood Stabilizer'
];

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
      description: "Time since last vape - decreases as your body heals",
      impacts: [
        "What decreases it:",
        "• Clean time: -2 points per week (standard recovery)",
        "• Cold turkey approach: -3 points per week (faster healing)",
        "• Tapering approach: -1.5 points per week (gentler decline)",
        "",
        "What increases it:",
        "• First relapse (after clean period): +4 points",
        "• Second relapse (within 7 days): +6 additional points",
        "• Third relapse and on (within 3 days): +8 additional points",
        "• Reset: Penalty level resets after 7 clean days"
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
        "• Reaching money saved milestones: +2 points",
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-700">
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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all duration-300"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

// Enhanced StatBar Component with Info Button (read-only) - Enforces 100-point cap
const StatBar = ({ label, value, max, color, statType, onInfoClick }) => {
  // Ensure value never exceeds max (100-point cap)
  const cappedValue = Math.min(value, max);
  
  return (
    <div className="mb-2">
      <div className="flex justify-between text-white text-xs mb-1">
        <div className="flex items-center gap-1">
          <span>{label}</span>
          {statType && onInfoClick && (
            <button
              onClick={() => onInfoClick(statType)}
              className="w-4 h-4 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold transition-colors"
              title={`Learn about ${label}`}
            >
              i
            </button>
          )}
        </div>
        <span>{cappedValue}/{max}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div 
          className={`${color} h-2 rounded-full transition-all duration-500`} 
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

  // Load special features when user data changes - ALWAYS call this hook
  useEffect(() => {
    let isCancelled = false;
    const loadSpecialFeatures = async () => {
      try {
        if (user && user.uid) {
          const features = await getPersonalizedFeatures(user);
          if (!isCancelled) setUserSpecialFeatures(features);
        } else {
          // Fallback to empty list when user missing
          if (!isCancelled) setUserSpecialFeatures([]);
        }
      } catch (_) {
        if (!isCancelled) setUserSpecialFeatures([]);
      }
    };
    loadSpecialFeatures();
    return () => {
      isCancelled = true;
    };
  }, [user?.uid]);

  // Handle empty nemesis (no buddy matched yet)
  if (user.isEmpty) {
    return (
      <div className="w-80 h-[520px] bg-slate-800 rounded-xl border-2 border-slate-600 p-4 text-white text-center mx-auto flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl text-slate-400">🔍</span>
          </div>
          <h3 className="text-slate-300 text-lg font-semibold mb-2">Looking for Buddy</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            We are searching for a suitable quit buddy for you. This may take a few minutes.
          </p>
          <div className="mt-4 p-3 bg-slate-700/50 rounded-lg">
            <p className="text-slate-300 text-xs">
              💡 Tip: Complete your profile to help us find better matches
            </p>
          </div>
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
  
  // Generate and store personalized special features based on onboarding responses
  const getPersonalizedFeatures = async (user) => {
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
      return storedFeatures;
    }
    
    // Generate new features based on onboarding responses
    const features = [];
    
    // Map trigger identification answers to features
    if (user.triggers && user.triggers.length > 0) {
      user.triggers.forEach(trigger => {
        switch(trigger) {
          case 'Stress/anxiety':
            features.push('Stress Vaper');
            break;
          case 'Social situations':
            features.push('Social Vaper');
            break;
          case 'Boredom':
            features.push('Boredom Vaper');
            break;
          case 'After meals':
            features.push('Habit Vaper');
            break;
          case 'Drinking alcohol':
            features.push('Party Vaper');
            break;
          case 'Work breaks':
            features.push('Break Vaper');
            break;
          case 'Driving':
            features.push('Driving Vaper');
            break;
        }
      });
    }
    
    // Map daily routine answers to features
    if (user.dailyPatterns && user.dailyPatterns.length > 0) {
      user.dailyPatterns.forEach(pattern => {
        switch(pattern) {
          case 'Morning routine':
            features.push('Morning Struggler');
            break;
          case 'Evening wind-down':
            features.push('Late Night Lurker');
            break;
          case 'Throughout the day':
            features.push('All-Day Addict');
            break;
        }
      });
    }
    
    // Map coping experience answers to features
    if (user.copingStrategies && user.copingStrategies.length > 0) {
      if (user.copingStrategies.includes('Nothing - this is new to me')) {
        features.push('First Timer');
      } else if (user.copingStrategies.length > 2) {
        features.push('Veteran Quitter');
      }
    }
    
    // If we don't have enough personalized features, add some generic ones
    while (features.length < 4) {
      const genericFeatures = ['Nicotine Fighter', 'Health Seeker', 'Freedom Chaser', 'Willpower Warrior'];
      const randomFeature = genericFeatures[Math.floor(Math.random() * genericFeatures.length)];
      if (!features.includes(randomFeature)) {
        features.push(randomFeature);
      }
    }
    
    const finalFeatures = features.slice(0, 4);
    
    // Store features in Firebase if user is authenticated
    if (user.uid) {
      try {
        const { ref, set } = await import('firebase/database');
        const userRef = ref(db, `users/${user.uid}/specialFeatures`);
        await set(userRef, finalFeatures);
        console.log('Special features saved to Firebase successfully');
      } catch (error) {
        console.error('Error saving special features to Firebase:', error);
        // Fallback to localStorage
        const storedFeaturesKey = `specialFeatures_${user.heroName || user.id || 'default'}`;
        localStorage.setItem(storedFeaturesKey, JSON.stringify(finalFeatures));
      }
    } else {
      // Fallback to localStorage if no user ID
      const storedFeaturesKey = `specialFeatures_${user.heroName || user.id || 'default'}`;
      localStorage.setItem(storedFeaturesKey, JSON.stringify(finalFeatures));
    }
    
    return finalFeatures;
  };
  

  
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
        className={`relative w-80 h-[520px] rounded-xl ${rarity.color} border-4 ${rarity.glow} bg-gradient-to-br from-slate-800 to-slate-900 p-4 transform transition-all duration-300 hover:scale-105 mx-auto overflow-hidden`}
      >
        
        <div className="text-center mb-3">
          <h3 className="text-white font-bold text-lg leading-tight break-words px-1">{user.heroName}</h3>
          <p className="text-gray-300 text-base">{archetype.name}</p>
        </div>
        
        {/* Increased avatar size */}
        <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center ring-2 ring-blue-400/50">
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
        <div className="space-y-2 mb-4">
          <StatBar 
            label="Addiction" 
            value={addictionLevel} 
            max={100} 
            color="bg-red-500" 
            statType={!isNemesis ? "addiction" : null}
            onInfoClick={!isNemesis ? handleInfoClick : null}
          />
          <StatBar 
            label="Mental Strength" 
            value={mentalStrength} 
            max={100} 
            color="bg-blue-500" 
            statType={!isNemesis ? "mentalStrength" : null}
            onInfoClick={!isNemesis ? handleInfoClick : null}
          />
          <StatBar 
            label="Motivation" 
            value={motivation} 
            max={100} 
            color="bg-green-500" 
            statType={!isNemesis ? "motivation" : null}
            onInfoClick={!isNemesis ? handleInfoClick : null}
          />
          <StatBar 
            label="Trigger Defense" 
            value={triggerDefense} 
            max={100} 
            color="bg-orange-500" 
            statType={!isNemesis ? "triggerDefense" : null}
            onInfoClick={!isNemesis ? handleInfoClick : null}
          />
        </div>
        
        {/* Special Features Section */}
        <div className="mb-4">
          <h4 className="text-white text-xs font-semibold mb-2 text-center">Special Features</h4>
          <div className="flex flex-wrap gap-1 justify-center">
            {userSpecialFeatures.map((feature, index) => (
              <div 
                key={index} 
                className="px-2 py-1 bg-blue-600/80 text-white text-xs rounded-full font-medium"
                title={feature}
              >
                {feature}
              </div>
            ))}
          </div>
        </div>
        
        {/* Battle Info - Only Streak and Cravings Resisted */}
        <div className="bg-black/30 rounded-lg p-3 space-y-2 mb-3 backdrop-blur-sm">
          <div className="flex justify-between text-white text-sm">
            <span className="text-gray-300">Streak:</span>
            <span className="font-bold text-green-400 flex items-center gap-1">
              {user.stats.streakDays} days
              {user.stats.streakDays > 0 && <span className="text-xs">🔥</span>}
            </span>
          </div>
          <div className="flex justify-between text-white text-sm">
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
                <div key={index} className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg" title={ACHIEVEMENTS[achievement]?.description}>
                  <AchIcon className="w-3 h-3 text-white" />
                </div>
              );
            })}
            {user.achievements.length > 4 && (
              <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
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
                className={`flex flex-col items-center transition-colors ${
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
const ArenaView = ({ user, nemesis, onBackToLogin, onResetForTesting, buddyLoading, buddyError, realBuddy }) => {
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
  



  
  // Handle achievement sharing for Motivation bonus
  const handleAchievementShare = async () => {
    if (statManager) {
      await statManager.handleAchievementShare();
    }
  };
  
  // Calculate real-time stats based on user behavior data from Firebase
  const calculateRealTimeStats = async (user) => {
    const stats = { ...user.stats };
    
    if (!user?.uid) {
      // Fallback to localStorage if no user ID
      const lastRelapse = localStorage.getItem('quitCoachRelapseDate');
      if (lastRelapse) {
        const relapseDate = new Date(lastRelapse);
        const now = new Date();
        const timeDiff = now.getTime() - relapseDate.getTime();
        const daysSinceRelapse = Math.floor(timeDiff / (1000 * 3600 * 24));
        stats.streakDays = daysSinceRelapse;
      } else {
        const quitDate = user.quitDate ? new Date(user.quitDate) : new Date();
        const now = new Date();
        const timeDiff = now.getTime() - quitDate.getTime();
        stats.streakDays = Math.floor(timeDiff / (1000 * 3600 * 24));
      }
      
      const cravingWins = parseInt(localStorage.getItem('cravingWins') || 0);
      stats.cravingsResisted = cravingWins;
      
      const today = new Date().toDateString();
      let hydrationStreak = 0;
      for (let i = 0; i < 7; i++) {
        const checkDate = new Date();
        checkDate.setDate(checkDate.getDate() - i);
        const checkDateStr = checkDate.toDateString();
        const waterData = localStorage.getItem(`water_${checkDateStr}`);
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
      
      // Get relapse date from Firebase
      const relapseRef = ref(db, `users/${user.uid}/profile/relapseDate`);
      const relapseSnapshot = await get(relapseRef);
      
      if (relapseSnapshot.exists()) {
        const relapseDate = new Date(relapseSnapshot.val());
        const now = new Date();
        const timeDiff = now.getTime() - relapseDate.getTime();
        const daysSinceRelapse = Math.floor(timeDiff / (1000 * 3600 * 24));
        stats.streakDays = daysSinceRelapse;
      } else {
        const quitDate = user.quitDate ? new Date(user.quitDate) : new Date();
        const now = new Date();
        const timeDiff = now.getTime() - quitDate.getTime();
        stats.streakDays = Math.floor(timeDiff / (1000 * 3600 * 24));
      }
      
      // Get cravings resisted from Firebase
      const cravingsRef = ref(db, `users/${user.uid}/profile/cravingsResisted`);
      const cravingsSnapshot = await get(cravingsRef);
      stats.cravingsResisted = cravingsSnapshot.exists() ? cravingsSnapshot.val() : 0;
      
      // Calculate hydration streak from Firebase
      const today = new Date().toDateString();
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
      } else {
        const quitDate = user.quitDate ? new Date(user.quitDate) : new Date();
        const now = new Date();
        const timeDiff = now.getTime() - quitDate.getTime();
        stats.streakDays = Math.floor(timeDiff / (1000 * 3600 * 24));
      }
      
      const cravingWins = parseInt(localStorage.getItem('cravingWins') || 0);
      stats.cravingsResisted = cravingWins;
      
      const today = new Date().toDateString();
      let hydrationStreak = 0;
      for (let i = 0; i < 7; i++) {
        const checkDate = new Date();
        checkDate.setDate(checkDate.getDate() - i);
        const checkDateStr = checkDate.toDateString();
        const waterData = localStorage.getItem(`water_${checkDateStr}`);
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
    
    return stats;
  };
  
  // Get real-time stats for both user and nemesis
  const [realTimeUserStats, setRealTimeUserStats] = useState(() => {
    const defaultStats = { mentalStrength: 50, motivation: 50, triggerDefense: 30, addictionLevel: 50 };
    const userStats = user?.stats ? { ...defaultStats, ...user.stats } : defaultStats;
    return userStats;
  });
  const [realTimeNemesisStats, setRealTimeNemesisStats] = useState(() => {
    const defaultStats = { mentalStrength: 50, motivation: 50, triggerDefense: 30, addictionLevel: 50 };
    const nemesisStats = nemesis?.stats ? { ...defaultStats, ...nemesis.stats } : defaultStats;
    return nemesisStats;
  });

  // Note: Firestore initialization is handled by the parent App component

  // Initialize StatManager and load real-time stats (requires user authentication)
  useEffect(() => {
    if (!user?.uid) return;

    const initializeUserServices = async () => {
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

      await initializeStatManager();

      const loadStats = async () => {
        if (user) {
          const userStats = await calculateRealTimeStats(user);
          setRealTimeUserStats(userStats);
        }
        if (nemesis) {
          const nemesisStats = await calculateRealTimeStats(nemesis);
          setRealTimeNemesisStats(nemesisStats);
        }
      };
      
      await loadStats();
    };

    initializeUserServices();
  }, [user, nemesis]);
  
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
        if (increase >= 30) return 'Log progress daily, share achievements weekly, track money saved milestones';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-8 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back to Login Button */}

        

        
        {/* Status Badges with Info Button - Positioned above cards */}
        <div className="flex justify-center gap-12 mb-6">
          <div className="w-80 text-center">
            <div className={`inline-flex items-center px-4 py-2 rounded-full font-bold text-sm shadow-lg ${
              battleStatus === 'WINNING' ? 'bg-green-600' : 
              battleStatus === 'TIED' ? 'bg-yellow-600' : 'bg-red-600'
            } text-white`}>
              {battleStatus === 'WINNING' ? 'WINNING' : battleStatus === 'TIED' ? 'TIED' : 'LOSING'}
            </div>
          </div>
          
          <div className="w-24 flex flex-col items-center gap-2">
            {/* Info Button integrated with status badges */}
            <button
              onClick={() => setShowBattleInfo(true)}
              className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
              title="Battle Algorithm Info"
            >
              <span className="text-sm font-bold">i</span>
            </button>
          </div>
          
          <div className="w-80 text-center">
            <div className={`inline-flex items-center px-4 py-2 rounded-full font-bold text-sm shadow-lg ${
              battleStatus === 'WINNING' ? 'bg-red-600' : 
              battleStatus === 'TIED' ? 'bg-yellow-600' : 'bg-green-600'
            } text-white`}>
              {battleStatus === 'WINNING' ? 'LOSING' : battleStatus === 'TIED' ? 'TIED' : 'WINNING'}
            </div>
          </div>
        </div>
        
        {/* Enhanced Battle Cards */}
        <div className="flex flex-row items-center justify-center gap-12 mb-8 w-full max-w-7xl mx-auto">
          <div className="flex flex-col items-center space-y-4 flex-shrink-0">
            <TradingCard user={{ ...user, stats: realTimeUserStats }} showComparison={false} nemesisUser={nemesis} />
          </div>
          
          <div className="flex flex-col items-center space-y-4 flex-shrink-0">
            <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl animate-pulse">
              <Sword className="w-12 h-12 text-white" />
            </div>
            <div className="bg-red-600 px-8 py-3 rounded-full">
              <p className="text-white font-bold text-2xl">VS</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center space-y-4 flex-shrink-0">
            {/* Buddy State Indicator */}
            {nemesis.isEmpty && !realBuddy && (
              <div className="mb-2 text-center">
                <div className="bg-slate-600/20 border border-slate-500/50 rounded-lg px-4 py-2">
                  <p className="text-slate-400 text-sm font-semibold">🔍 Looking for Buddy</p>
                  <p className="text-slate-300 text-xs">We are searching for a suitable match</p>
                </div>
              </div>
            )}
            
            {buddyLoading && (
              <div className="mb-2 text-center">
                <div className="bg-yellow-600/20 border border-yellow-500/50 rounded-lg px-4 py-2">
                  <p className="text-yellow-400 text-sm font-semibold">🔍 Loading Buddy...</p>
                  <p className="text-yellow-300 text-xs">Please wait while we find your match</p>
                </div>
              </div>
            )}
            
            {buddyError && (
              <div className="mb-2 text-center">
                <div className="bg-red-600/20 border border-red-500/50 rounded-lg px-4 py-2 mb-2">
                  <p className="text-red-400 text-sm font-semibold">❌ Error Loading Buddy</p>
                  <p className="text-red-300 text-xs">{buddyError}</p>
                </div>

              </div>
            )}
            
            {realBuddy && (
              <div className="mb-2 text-center">
                <div className="bg-green-600/20 border border-green-500/50 rounded-lg px-4 py-2">
                  <p className="text-green-400 text-sm font-semibold">✅ Connected with Buddy</p>
                  <p className="text-green-300 text-xs">You're battling {realBuddy.heroName}!</p>
                </div>
              </div>
            )}
            
            {/* Production: no debug banner */}
            
            <TradingCard 
              user={realBuddy || nemesis} 
              isNemesis={true} 
              showComparison={false} 
              nemesisUser={user} 
            />
          </div>
        </div>
        {/* Battle Recommendations Section - Only show when losing */}
        {battleStatus === 'LOSING' && recommendations && recommendations.length > 0 && (
          <div className="max-w-4xl mx-auto bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4 text-center">🎯 Quick Win Strategy</h3>
            <div className="space-y-4">
              {recommendations.slice(0, 3).map((rec, index) => (
                <div key={index} className="bg-slate-700/50 rounded-lg p-4 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
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
                    <div className={`font-bold text-2xl ml-4 ${
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-600">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Battle Algorithm</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAchievementShare}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                  title="Share achievement for Motivation bonus"
                >
                  📤 Share
                </button>
                <button
                  onClick={() => setShowBattleInfo(false)}
                  className="text-gray-400 hover:text-white text-2xl"
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-slate-600 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
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
  );
};

// Game Modal Component with Simple, Working Games
const GameModal = ({ gameType, onClose }) => {
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);





  const togglePause = () => setIsPaused(!isPaused);

  // Snake Game with Movement-First Direction Processing
  const SnakeGame = () => {
    const canvasRef = useRef(null);
    const [snake, setSnake] = useState([{x: 7, y: 7}]);
    const [direction, setDirection] = useState({x: 1, y: 0});
    const [nextDirection, setNextDirection] = useState({x: 1, y: 0}); // Direction for next game tick
    const [food, setFood] = useState({x: 10, y: 10});
    const [gameOver, setGameOver] = useState(false);
    const [snakeScore, setSnakeScore] = useState(0);
    const [level, setLevel] = useState(1);
    
    // Level system: Speed and scoring progression
    const BASE_SPEED = 160; // Level 1 base speed
    const LEVEL_SPEEDS = {
      1: 160,                                    // Level 1: 160ms
      2: Math.round(160 / 1.25),                // Level 2: 128ms (1.25x faster than L1)
      3: Math.round(160 / 1.25 / 1.25)          // Level 3: 102ms (1.25x faster than L2)
    };
    
    const LEVEL_POINTS = {
      1: 2,  // Level 1: 2 points per food
      2: 5,  // Level 2: 5 points per food
      3: 10  // Level 3: 10 points per food
    };

    // Keyboard input handling - queue direction changes for next game tick
    useEffect(() => {
      const handleKeyPress = (e) => {
        if (gameOver) {
          e.preventDefault(); // Prevent any unwanted behavior
          // Restart game
          setSnake([{x: 7, y: 7}]);
          setDirection({x: 1, y: 0});
          setNextDirection({x: 1, y: 0});
          setFood({x: 10, y: 10});
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
      if (isPaused || gameOver) return;

      const gameLoop = setInterval(() => {
        setSnake(prevSnake => {
          // STEP 1: Move snake head according to CURRENT direction (not queued direction)
          // This ensures the snake always moves forward to a new position first
          const newHead = {
            x: prevSnake[0].x + direction.x,
            y: prevSnake[0].y + direction.y
          };
          
          // Wraparound mode - snake appears on opposite side
          if (newHead.x < 0) newHead.x = 14;
          if (newHead.x >= 15) newHead.x = 0;
          if (newHead.y < 0) newHead.y = 14;
          if (newHead.y >= 15) newHead.y = 0;
          
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
            // Generate new food
            setFood({
              x: Math.floor(Math.random() * 15),
              y: Math.floor(Math.random() * 15)
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
    }, [direction, nextDirection, food, isPaused, gameOver]);

    // Render game
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      const cellSize = 20;
      const gridSize = 15;

      // Clear canvas
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(0, 0, 300, 300);

      // Draw grid
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 1;
      for (let i = 0; i <= gridSize; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, 300);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(300, i * cellSize);
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
                  px-4 py-2 text-sm font-mono border-2 border-green-500 transition-all
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
          
          {/* Level Info */}
          <div className="text-center text-yellow-400 text-xs mb-3">
            <div>Speed: {LEVEL_SPEEDS[level]}ms | Points: {LEVEL_POINTS[level]} per food</div>
            {level === 1 && 'Good for beginners'}
            {level === 2 && 'For experienced players'}
            {level === 3 && 'Ultimate challenge'}
          </div>
        </div>
        
        <canvas
          ref={canvasRef}
          width="300"
          height="300"
          className="border-2 border-gray-300 mx-auto"
          style={{imageRendering: 'pixelated'}}
        />
        <div className="mt-4">
          <p className="text-lg font-bold text-gray-800">Score: {snakeScore} | Level: {level}</p>
          
          {/* Direction Indicators */}
          <div className="flex justify-center gap-4 mb-2 text-sm">
            <div className="text-gray-600">
              <span className="font-semibold">Current:</span> 
              {direction.x === 1 && '→'} 
              {direction.x === -1 && '←'} 
              {direction.y === 1 && '↓'} 
              {direction.y === -1 && '↑'}
            </div>
            {nextDirection.x !== direction.x || nextDirection.y !== direction.y ? (
              <div className="text-blue-600">
                <span className="font-semibold">Next:</span> 
                {nextDirection.x === 1 && '→'} 
                {nextDirection.x === -1 && '←'} 
                {nextDirection.y === 1 && '↓'} 
                {nextDirection.y === -1 && '↑'}
              </div>
            ) : null}
          </div>
          
          <p className="text-sm text-gray-600">Use arrow keys to control the snake</p>
          {gameOver && (
            <div className="mt-2">
              <p className="text-red-600 font-bold mb-2">Game Over!</p>
              <button
                onClick={() => {
                  setSnake([{x: 7, y: 7}]);
                  setDirection({x: 1, y: 0});
                  setNextDirection({x: 1, y: 0}); // Reset direction queue
                  setFood({x: 10, y: 10});
                  setGameOver(false);
                  setSnakeScore(0);
                  setLevel(1);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
              >
                Restart Game
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Simple Click Counter Game
  const ClickCounterGame = () => {
    const [clicks, setClicks] = useState(0);
    const [clicksPerSecond, setClicksPerSecond] = useState(0);
    const [startTime] = useState(Date.now());
    
    const handleClick = () => {
      setClicks(prev => prev + 1);
    };
    
    // Calculate clicks per second for motivation
    useEffect(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      if (elapsed > 0) {
        setClicksPerSecond((clicks / elapsed).toFixed(1));
      }
    }, [clicks, startTime]);
    
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Click as Fast as You Can!</h2>
                  <div className="text-lg text-gray-700 mb-2">Total Clicks: {clicks}</div>
          <div className="text-lg text-gray-700 mb-2">Clicks/Second: {clicksPerSecond}</div>
        <button 
          onClick={handleClick}
          className="w-48 h-48 text-2xl font-bold bg-orange-500 hover:bg-orange-600 border-none rounded-full text-white cursor-pointer transition-colors shadow-lg"
        >
          CLICK ME!
        </button>
                  <div className="mt-4 text-sm text-gray-600">
            Challenge: Try to reach 500 clicks!
          </div>
      </div>
    );
  };





  const renderGame = () => {
    try {
      switch(gameType) {
        case 'snake': return <SnakeGame />;
        case 'click-counter': return <ClickCounterGame />;
        default: return <div>Game not found</div>;
      }
    } catch (error) {
      console.error('Error rendering game:', error);
      return (
        <div className="text-center text-red-600">
          <p className="text-lg font-bold mb-2">⚠️ Game Error</p>
          <p className="text-sm">Something went wrong loading the game.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
          >
            Reload Game
          </button>
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            {gameType === 'snake' && '🐍 Snake Game'}

            {gameType === 'puzzle' && '🧠 Memory Puzzle'}
          </h3>
                      <div className="flex items-center gap-4">
              <button
              onClick={togglePause}
              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="bg-gray-100 rounded-lg p-4 min-h-[500px] flex items-center justify-center relative">
          {renderGame()}
          
          {/* Game Instructions Overlay */}
          <div className="absolute top-2 left-2 bg-black/70 text-white p-2 rounded text-xs max-w-48">
            <p className="font-bold mb-1">Controls:</p>
            {gameType === 'snake' && (
              <p>Arrow keys to move</p>
            )}

            {gameType === 'click-counter' && (
              <p>Click the button rapidly!</p>
            )}
          </div>
          
          {/* Game Status Overlay */}
          <div className="absolute top-2 right-2 bg-black/70 text-white p-2 rounded text-xs">
            <p className="font-bold mb-1">Status:</p>
            <p>{isPaused ? '⏸️ Paused' : '▶️ Playing'}</p>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Games now run without time limits - play as long as you need!
          </p>
        </div>
      </div>
    </div>
  );
};
// Craving Support View - Emergency Support for Cravings
const CravingSupportView = ({ user, nemesis, onBackToLogin, onResetForTesting }) => {
  const [showGameModal, setShowGameModal] = useState(false);
  const [showSOSConfirmation, setShowSOSConfirmation] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showCustomPopup, setShowCustomPopup] = useState(false);
  const [popupData, setPopupData] = useState({ title: '', message: '', type: 'info' });
  const [cravingsResisted, setCravingsResisted] = useState(0);
  const [statManager, setStatManager] = useState(null);

  // Initialize StatManager and load cravings resisted
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

    const loadCravingsResisted = async () => {
      try {
        const { ref, get, onValue } = await import('firebase/database');
        const cravingsRef = ref(db, `users/${user.uid}/profile/cravingsResisted`);
        
        // Load initial value
        const snapshot = await get(cravingsRef);
        if (snapshot.exists()) {
          setCravingsResisted(snapshot.val() || 0);
        } else {
          // Fallback to localStorage
          const localWins = parseInt(localStorage.getItem('cravingWins') || 0);
          setCravingsResisted(localWins);
        }
        
        // Set up real-time listener
        const unsubscribe = onValue(cravingsRef, (snapshot) => {
          if (snapshot.exists()) {
            setCravingsResisted(snapshot.val() || 0);
          }
        });
        
        return unsubscribe;
      } catch (error) {
        console.error('Error loading cravings resisted from Firebase:', error);
        // Fallback to localStorage
        const localWins = parseInt(localStorage.getItem('cravingWins') || 0);
        setCravingsResisted(localWins);
      }
    };

    loadCravingsResisted();
  }, [user?.uid]);

  const handleSOS = () => {
    // In a real app, this would send a push notification to the nemesis
    console.log('SOS sent to nemesis:', nemesis.heroName);
    
    // Store SOS timestamp for tracking
    const sosData = {
      timestamp: new Date().toISOString(),
      nemesis: nemesis.heroName,
      status: 'sent'
    };
    localStorage.setItem('lastSOS', JSON.stringify(sosData));
    
    setShowSOSConfirmation(true);
    
    // Auto-hide confirmation after 5 seconds
    setTimeout(() => setShowSOSConfirmation(false), 5000);
    
    // Track SOS usage for Mental Strength bonus
    if (statManager) {
      statManager.trackAppUsageDuringCravings();
    }
    
    // In a real app, this would trigger:
    // 1. Push notification to nemesis
    // 2. SMS/email alert
    // 3. Emergency contact notification
    // 4. Crisis hotline integration
  };

  const handleMiniGame = (gameType) => {
    setSelectedGame(gameType);
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

  const showQuickActionPopup = (title, message) => {
    setPopupData({ title, message, type: 'info' });
    setShowCustomPopup(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-8 pb-20">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header - Removed explanatory text for cleaner design */}
        <div className="mb-8">
          {/* Navigation Buttons */}
          <div className="flex justify-start gap-3">
            <button
              onClick={onBackToLogin}
              className="px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              ← Back to Login
            </button>
            
            {/* Development Testing: Reset Account Button */}
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



        {/* SOS Button - Top Priority */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-red-200">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <span className="text-4xl">🆘</span>
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-4">Need Immediate Help?</h2>
            <p className="text-gray-600 mb-6">
              Press the SOS button to alert your nemesis and get instant support
            </p>
            <button
              onClick={handleSOS}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-6 px-8 rounded-xl text-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              🆘 SOS - Get Help Now
            </button>
            
            {/* Last SOS Info */}
            {(() => {
              const lastSOS = localStorage.getItem('lastSOS');
              if (lastSOS) {
                const sosData = JSON.parse(lastSOS);
                const timeAgo = Math.floor((Date.now() - new Date(sosData.timestamp)) / (1000 * 60));
                return (
                  <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-sm text-red-600">
                      Last SOS sent {timeAgo} minutes ago to {sosData.nemesis}
                    </p>
                  </div>
                );
              }
              return null;
            })()}
          </div>
        </div>

        {/* Mini-Games Section */}
        <div className="bg-slate-800/50 rounded-xl p-6 mb-6 border border-slate-600">
          <div className="text-center">
            <h2 className="text-xl font-bold text-white mb-4">🎮 Distract Yourself</h2>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => handleMiniGame('snake')}
                className="w-full bg-gradient-to-r from-orange-500/20 to-orange-600/20 hover:from-orange-500/30 hover:to-orange-600/30 text-white font-bold py-4 px-6 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 border border-orange-500/30"
              >
                🐍 Play Snake
              </button>
              
              <button
                onClick={() => handleMiniGame('click-counter')}
                className="w-full bg-gradient-to-r from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 text-white font-bold py-4 px-6 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 border border-blue-500/30"
              >
                ⚡ Click Counter
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-600">
          <h2 className="text-xl font-bold text-white mb-4 text-center">⚡ Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => showQuickActionPopup(
                '💧 Drink Water',
                'Hydration helps reduce cravings!\n\nDrink a full glass of water slowly.\n\nThis will help you feel full and reduce the urge to vape.'
              )}
              className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 text-white font-semibold py-4 px-4 rounded-xl transition-all duration-300 border border-blue-500/30 hover:scale-105"
            >
              💧 Drink Water
            </button>
            <button 
              onClick={() => showQuickActionPopup(
                '🫁 Breathe',
                'Take 3 deep breaths:\n\n1. Inhale for 4 seconds\n2. Hold for 4 seconds\n3. Exhale for 4 seconds\n\nRepeat 3 times'
              )}
              className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 text-white font-semibold py-4 px-4 rounded-xl transition-all duration-300 border border-blue-500/30 hover:scale-105"
            >
              🫁 Breathe
            </button>
            <button 
              onClick={() => showQuickActionPopup(
                '🚶‍♂️ Walk',
                'Take a 5-minute walk:\n\nPhysical activity releases endorphins that can help reduce cravings.\n\nWalk around your room or step outside if possible.'
              )}
              className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 hover:from-purple-500/30 hover:to-purple-600/30 text-white font-semibold py-4 px-4 rounded-xl transition-all duration-300 border border-purple-500/30 hover:scale-105"
            >
              🚶‍♂️ Walk
            </button>
            <button 
              onClick={() => showQuickActionPopup(
                '🧘‍♀️ Meditate',
                'Quick Meditation:\n\n1. Close your eyes\n2. Focus on your breath\n3. Count to 10 slowly\n4. Repeat 3 times\n\nThis helps calm your mind and reduce stress.'
              )}
              className="bg-gradient-to-r from-green-500/20 to-green-600/20 hover:from-green-500/30 hover:to-green-600/30 text-white font-semibold py-4 px-4 rounded-xl transition-all duration-300 border border-green-500/30 hover:scale-105"
            >
              🧘‍♀️ Meditate
            </button>
          </div>
        </div>

        {/* SOS Confirmation Modal */}
        {showSOSConfirmation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-xl font-bold text-green-600 mb-2">Help is on the way!</h3>
              <p className="text-gray-600 mb-4">
                Your nemesis <strong>{nemesis.heroName}</strong> has been notified and will reach out soon.
              </p>
              <button
                onClick={() => setShowSOSConfirmation(false)}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        )}

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
        
        {/* Progress Tracking - Simplified to focus on cravings only */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-600 mt-6">
          <h2 className="text-xl font-bold text-white mb-4 text-center">📊 Cravings Resisted</h2>
          <div className="text-center p-6 bg-slate-700/50 rounded-lg border border-slate-500/30">
            <div className="text-4xl mb-3">🎯</div>
            <p className="text-lg font-bold text-white mb-2">Total Wins</p>
            <p className="text-3xl font-bold text-green-400 mb-3">
              {cravingsResisted}
            </p>
            <p className="text-sm text-gray-300 mb-4">Times you successfully resisted cravings</p>
            
            <button 
              onClick={handleCravingResistance}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              🎯 I Resisted a Craving!
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
  const [showBreathingModal, setShowBreathingModal] = useState(false);
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
      const savedWater = localStorage.getItem(`water_${today}`);
      const savedMood = localStorage.getItem(`mood_${today}`);
      const savedBreathing = localStorage.getItem(`breathing_${today}`);
      
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
            const waterData = localStorage.getItem(`water_${checkDateStr}`);
            if (waterData) {
              await set(ref(db, `users/${user.uid}/profile/daily/${checkDateStr}/water`), parseInt(waterData));
            }
          }
          
          // Migrate last 7 days of mood data
          for (let i = 0; i < 7; i++) {
            const checkDate = new Date();
            checkDate.setDate(checkDate.getDate() - i);
            const checkDateStr = checkDate.toDateString();
            const moodData = localStorage.getItem(`mood_${checkDateStr}`);
            if (moodData) {
              await set(ref(db, `users/${user.uid}/profile/daily/${checkDateStr}/mood`), JSON.parse(moodData));
            }
          }
          
          // Migrate last 7 days of breathing data
          for (let i = 0; i < 7; i++) {
            const checkDate = new Date();
            checkDate.setDate(checkDate.getDate() - i);
            const checkDateStr = checkDate.toDateString();
            const breathingData = localStorage.getItem(`breathing_${checkDateStr}`);
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
    
    // Save to Firebase
    const success = await saveToFirebase('relapseDate', now.toISOString());
    
    // Fallback to localStorage if Firebase fails
    if (!success) {
      localStorage.setItem('quitCoachRelapseDate', now.toISOString());
    }
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

  // Handle breathing exercise completion
  const handleBreathingComplete = async () => {
    setDailyBreathing(true);
    const today = new Date().toDateString();
    
    // Use StatManager to handle breathing exercise and streaks
    if (statManager) {
      await statManager.handleBreathingExercise();
    }
    
    // Save to Firebase
    const success = await saveToFirebase(`daily/${today}/breathing`, true);
    
    // Fallback to localStorage if Firebase fails
    if (!success) {
      localStorage.setItem(`breathing_${today}`, 'true');
    }
    
    setShowBreathingModal(false);
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

            {/* Breathing Exercise Button */}
            <button
              onClick={() => setShowBreathingModal(true)}
              className="w-full bg-gradient-to-r from-purple-500/20 to-purple-600/20 bg-slate-800/50 rounded-xl p-4 text-left hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-xl">
                  🫁
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg">Complete breathing exercise</h3>
                  <p className="text-gray-300 text-sm">
                    {dailyBreathing ? 'Completed! Stay calm!' : 'Tap to start 4-cycle breathing'}
                  </p>
                </div>
                <div className="text-purple-400 text-2xl">→</div>
              </div>
            </button>

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
          
          <div className="bg-slate-800/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-yellow-400">$</span>
              <span className="text-gray-300 text-sm">Money saved</span>
            </div>
            <div className="text-white text-2xl font-bold">{user?.stats?.moneySaved || 0}</div>
            <p className="text-gray-400 text-sm mt-1">Work in progress</p>
          </div>
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
      
      <BreathingModal 
        isOpen={showBreathingModal} 
        onClose={() => setShowBreathingModal(false)}
        onComplete={handleBreathingComplete}
      />
      
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-700">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-white mb-2">💧 Water Intake</h3>
          <p className="text-gray-300 text-sm">How many glasses of water today?</p>
        </div>
        
        <div className="mb-6">
          <input
            type="number"
            min="0"
            max="20"
            value={waterInput}
            onChange={(e) => setWaterInput(parseInt(e.target.value) || 0)}
            className="w-full bg-slate-700 text-white text-center text-2xl font-bold py-4 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
            placeholder="0"
          />
          <p className="text-gray-400 text-sm text-center mt-2">0-20 glasses</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(waterInput)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
const BreathingModal = ({ isOpen, onClose, onComplete }) => {
  const [currentCycle, setCurrentCycle] = useState(1);
  const [currentPhase, setCurrentPhase] = useState('exhale');
  const [timeLeft, setTimeLeft] = useState(5);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isOpen || !isActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Move to next phase
          if (currentPhase === 'exhale') {
            setCurrentPhase('inhale');
            setTimeLeft(4);
          } else if (currentPhase === 'inhale') {
            setCurrentPhase('hold');
            setTimeLeft(7);
          } else if (currentPhase === 'hold') {
            if (currentCycle < 4) {
              setCurrentCycle(prev => prev + 1);
              setCurrentPhase('exhale');
              setTimeLeft(5);
            } else {
              // Exercise complete
              setIsActive(false);
              onComplete();
              return 0;
            }
          }
          return prev;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isActive, currentPhase, currentCycle, onComplete]);

  const startExercise = () => {
    setIsActive(true);
    setCurrentCycle(1);
    setCurrentPhase('exhale');
    setTimeLeft(5);
  };

  if (!isOpen) return null;

  const getPhaseText = () => {
    switch (currentPhase) {
      case 'exhale': return 'Exhale, empty lungs';
      case 'inhale': return 'Inhale quietly through nose';
      case 'hold': return 'Hold your breath';
      default: return '';
    }
  };

  const getCircleSize = () => {
    switch (currentPhase) {
      case 'exhale': return 'w-32 h-32';
      case 'inhale': return 'w-48 h-48';
      case 'hold': return 'w-40 h-40';
      default: return 'w-40 h-40';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="text-center text-white">
        {!isActive ? (
          <div className="mb-8">
            <h3 className="text-3xl font-bold mb-4">🫁 Breathing Exercise</h3>
            <p className="text-xl text-gray-300 mb-6">4-cycle breathing pattern</p>
            <button
              onClick={startExercise}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-colors"
            >
              Start Exercise
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-2xl font-bold mb-4">Cycle {currentCycle}/4</h3>
            <p className="text-xl text-gray-300 mb-8">{getPhaseText()}</p>
            
            <div className="flex justify-center mb-8">
              <div className={`${getCircleSize()} rounded-full border-4 border-blue-400 flex items-center justify-center transition-all duration-1000 ${
                currentPhase === 'hold' ? 'animate-pulse' : ''
              }`}>
                <span className="text-4xl font-bold">{timeLeft}</span>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Stop
            </button>
          </>
        )}
      </div>
    </div>
  );
};

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-700">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-white mb-2">🌤️ How do you feel?</h3>
          <p className="text-gray-300 text-sm">Select your current mood</p>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          {moods.map((mood) => (
            <button
              key={mood.name}
              onClick={() => onSelect(mood)}
              className={`p-4 rounded-xl text-center transition-all duration-300 hover:scale-105 ${
                selectedMood?.name === mood.name ? 'ring-2 ring-blue-400' : 'bg-slate-700 hover:bg-slate-600'
              }`}
            >
              <div className={`w-12 h-12 ${mood.color} rounded-full flex items-center justify-center text-2xl mx-auto mb-2`}>
                {mood.icon}
              </div>
              <p className="text-white font-semibold">{mood.name}</p>
            </button>
          ))}
        </div>
        
        <button
          onClick={onClose}
          className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 rounded-lg transition-colors"
        >
          Cancel
        </button>
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-700">
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
  );
};

const DiaryModal = ({ isOpen, onClose, selectedDate, onDateSelect, dailyData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-700">
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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};



const SettingsView = ({ onResetApp, onBackToLogin, onResetForTesting, firestoreBuddyService, firestoreBuddyServiceRef, initializeFirestoreBuddyService }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pb-20">
    <div className="max-w-md mx-auto px-4 pt-16">
      <div className="text-center mb-8">
        <Settings className="w-16 h-16 mx-auto mb-4 text-blue-400" />
        <h2 className="text-2xl font-bold text-white mb-2">Settings</h2>
        <p className="text-gray-300">Manage your app preferences</p>
      </div>
      
      <div className="space-y-4">
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









// Main App Component
const App = () => {
  const [activeTab, setActiveTab] = useState('arena');
  const [currentView, setCurrentView] = useState('auth');
  const [selectedMood, setSelectedMood] = useState(null);
  const [user, setUser] = useState(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

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
  const firestoreBuddyServiceRef = useRef(null);

  // Initialize FirestoreBuddyService
  const initializeFirestoreBuddyService = async () => {
    try {
      if (!firestore) {
        console.error('❌ Firestore instance is not available');
        return;
      }
      
      const firestoreService = new FirestoreBuddyService(firestore);
      
      // Test connectivity before setting state
      const connectivityTest = await firestoreService.testConnectivity();
      
      if (connectivityTest) {
        // Set state and ref for immediate access
        setFirestoreBuddyService(firestoreService);
        firestoreBuddyServiceRef.current = firestoreService;
        console.log('✅ FirestoreBuddyService initialized successfully');
      } else {
        console.warn('⚠️ Firestore connectivity test failed - service not initialized');
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
    moneySaved: 0
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
          setUserStats(newStats);
          // Update real-time stats if user is in Arena
          if (currentView === 'arena' && user) {
            const updatedUser = { ...user, stats: newStats };
            calculateRealTimeStats(updatedUser).then(setRealTimeUserStats);
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
      
      // Update user state
      setUser(prevUser => ({
        ...prevUser,
        ...validatedUserData,
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
      quitDate: userData.quitDate || new Date().toISOString(),
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
      moneySaved: Math.max(0, parseInt(stats.moneySaved) || 0),
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
      
      console.error('Unhandled promise rejection:', event.reason);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);
  
  // One-time Firebase connectivity test (Realtime Database)
  useEffect(() => {
    const testFirebaseConnection = async (retryCount = 0) => {
      try {
        const { ref, set, get, child } = await import('firebase/database');
        const rootRef = ref(db);
        const hcRef = child(rootRef, 'healthchecks/vite_dev');
        await set(hcRef, { lastRun: Date.now() });
        const snap = await get(hcRef);
        console.log('🔥 Firebase RTDB connected. Healthcheck exists:', snap.exists());
      } catch (err) {
        console.error('Firebase connectivity test failed:', err?.message || err);
        
        // Retry up to 3 times with exponential backoff
        if (retryCount < 3) {
          const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
          console.log(`Retrying Firebase connection in ${delay}ms... (attempt ${retryCount + 1}/3)`);
          setTimeout(() => testFirebaseConnection(retryCount + 1), delay);
        } else {
          console.error('Firebase connection failed after 3 retries. Check your internet connection and Firebase configuration.');
        }
      }
    };
    
    testFirebaseConnection();
  }, []);
  
  // Enhanced authentication state listener with session persistence
  useEffect(() => {
    let isMounted = true;
    let authUnsubscribe = null;
    
    const initializeAuth = async () => {
      try {
        console.log('Initializing authentication state...');
        setAuthLoading(true);
        
        // Set up Firebase Auth state listener
        const { onAuthStateChanged } = await import('firebase/auth');
        
        authUnsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (!isMounted) return;
          
          console.log('Auth state changed:', firebaseUser ? `User: ${firebaseUser.uid}` : 'No user');
          
          if (firebaseUser) {
            // User is authenticated (either from session or new login)
            setAuthUser(firebaseUser);
            console.log('User authenticated, checking database for user data...');
            
            try {
              const { ref, get } = await import('firebase/database');
              const userRef = ref(db, `users/${firebaseUser.uid}`);
              const snapshot = await get(userRef);
              
              if (snapshot.exists()) {
                const userData = snapshot.val();
                console.log('Existing user data found - auto-login successful');
                
                setUser(userData);
                setHasCompletedOnboarding(true);
                setCurrentView('arena');
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
  // Load real buddy data - Simplified to prevent React crashes
  const loadRealBuddy = async () => {
    if (!user?.uid || buddyLoading) {
      return;
    }
    
    setBuddyLoading(true);
    setBuddyError(null);
    
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
        
        // Validate buddy user exists in Realtime Database (user profiles)
        const { ref, get } = await import('firebase/database');
        const buddyUserRef = ref(db, `users/${buddyUserId}`);
        const buddySnapshot = await get(buddyUserRef);
        
        if (!buddySnapshot.exists()) {
          // Clean up orphaned pair in Firestore
          console.log('⚠️ Firestore: Cleaning up orphaned buddy pair:', buddyPair.id);
          const { deleteDoc, doc } = await import('firebase/firestore');
          await deleteDoc(doc(firestore, 'buddyPairs', buddyPair.id));
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
            moneySaved: buddyData.stats?.moneySaved || 0,
            experiencePoints: buddyData.stats?.experiencePoints || 0
          },
          achievements: buddyData.achievements || [],
          archetype: buddyData.archetype || 'The Determined',
          avatar: buddyData.avatar || generateAvatar(buddyData.heroName || 'buddy', 'adventurer'),
          userId: buddyUserId,
          isRealBuddy: true,
          pairId: buddyPair.id
        };
        
        setRealBuddy(transformedBuddy);
        console.log('✅ Firestore: Buddy data loaded successfully');
        
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
            moneySaved: buddyData.stats?.moneySaved || 0,
            experiencePoints: buddyData.stats?.experiencePoints || 0
          },
          achievements: buddyData.achievements || [],
          archetype: buddyData.archetype || 'The Determined',
          avatar: buddyData.avatar || generateAvatar(buddyData.heroName || 'buddy', 'adventurer'),
          userId: buddyUserId,
          isRealBuddy: true,
          pairId: buddyPair.pairId
        };
        
        setRealBuddy(transformedBuddy);
        
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





  // Load buddy data when user changes - Simplified to prevent crashes
  useEffect(() => {
    if (user?.uid && !realBuddy && !buddyLoading) {
      loadRealBuddy();
    }
  }, [user?.uid, realBuddy, buddyLoading]);
  
  // Monitor FirestoreBuddyService state changes
  useEffect(() => {
    if (firestoreBuddyService) {
      console.log('✅ FirestoreBuddyService is now available');
    }
  }, [firestoreBuddyService]);
  
  // Auto-match available users - Simple sequential pairing
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
      console.log('🔄 Firestore: Starting automatic user matching...');
      
      // Get all users in Firestore matching pool
              const poolUsers = await service.getAllMatchingPoolUsers();
      
      if (poolUsers.length < 2) {
        console.log('ℹ️ Firestore: Not enough users in matching pool for pairing');
        return;
      }
      
      console.log(`🔄 Firestore: Found ${poolUsers.length} users in matching pool`);
      
      // Validate that all users in matching pool still exist in users collection
      const validPoolUsers = [];
      for (const poolUser of poolUsers) {
        try {
          const { ref, get } = await import('firebase/database');
          const userRef = ref(db, `users/${poolUser.userId}`);
          const userSnapshot = await get(userRef);
          if (userSnapshot.exists()) {
            validPoolUsers.push(poolUser);
          } else {
            // Remove invalid user from Firestore matching pool
            console.log(`⚠️ Firestore: Removing invalid user from matching pool: ${poolUser.userId}`);
            await service.removeFromMatchingPool(poolUser.userId);
          }
        } catch (validationError) {
          console.error('❌ Firestore: Error validating user:', validationError);
        }
      }
      
      if (validPoolUsers.length < 2) {
        console.log('ℹ️ Firestore: Not enough valid users for pairing after validation');
        return;
      }
      
      // Simple sequential pairing: pair users in order (1-2, 3-4, 5-6, etc.)
      let pairsCreated = 0;
      for (let i = 0; i < validPoolUsers.length - 1; i += 2) {
        const user1 = validPoolUsers[i];
        const user2 = validPoolUsers[i + 1];
        
        try {
          console.log(`🔄 Firestore: Creating buddy pair between ${user1.userId} and ${user2.userId}`);
          
          // Create buddy pair in Firestore
          const pairData = {
            matchedAt: new Date().toISOString(),
            compatibilityScore: 0.85,
            matchReasons: ['Sequential auto-match', 'First-come, first-served pairing'],
            status: 'active',
            lastMessageAt: new Date().toISOString(),
            user1RemovedFromPool: false,
            user2RemovedFromPool: false
          };
          
          const pairId = await service.createBuddyPair(user1.userId, user2.userId, pairData);
          
          if (pairId) {
            // Update user profiles with buddy info in Realtime Database
            const { ref, set } = await import('firebase/database');
            await set(ref(db, `users/${user1.userId}/buddyInfo`), {
              hasBuddy: true,
              buddyId: user2.userId,
              pairId: pairId,
              matchedAt: pairData.matchedAt
            });
            
            await set(ref(db, `users/${user2.userId}/buddyInfo`), {
              hasBuddy: true,
              buddyId: user1.userId,
              pairId: pairId,
              matchedAt: pairData.matchedAt
            });
            
            // Remove both users from Firestore matching pool
                      await service.removeFromMatchingPool(user1.userId);
          await service.removeFromMatchingPool(user2.userId);
            
            pairsCreated++;
            console.log(`✅ Firestore: Created buddy pair ${pairId} between ${user1.userId} and ${user2.userId}`);
          } else {
            console.error(`❌ Firestore: Failed to create buddy pair between ${user1.userId} and ${user2.userId}`);
          }
          
        } catch (pairError) {
          console.error(`❌ Firestore: Failed to create buddy pair between ${user1.userId} and ${user2.userId}:`, pairError);
        }
      }
      
      // If current user was matched, reload their buddy data
      if (user?.uid) {
        const currentUserMatched = validPoolUsers.some(poolUser => poolUser.userId === user.uid);
        if (currentUserMatched) {
          try {
            await loadRealBuddy();
          } catch (reloadError) {
            console.error('Error reloading buddy data:', reloadError);
          }
        }
      }
      
      if (pairsCreated > 0) {
        console.log(`🎉 Firestore: Auto-matching completed: ${pairsCreated} pairs created`);
      }
      
    } catch (error) {
      console.error('❌ Firestore: Auto-matching failed:', error);
      // Fallback to Realtime Database
      console.log('🔄 Falling back to Realtime Database auto-matching...');
      await autoMatchUsersRealtimeDB();
    }
  };
  
  // Fallback Realtime Database auto-matching function
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
      
      // Validate that all users in matching pool still exist in users collection
      const validPoolUsers = [];
      for (const poolUserId of poolUsers) {
        try {
          const userRef = ref(db, `users/${poolUserId}`);
          const userSnapshot = await get(userRef);
          if (userSnapshot.exists()) {
            validPoolUsers.push(poolUserId);
          } else {
            // Remove invalid user from matching pool
            console.log(`⚠️ Realtime Database: Removing invalid user from matching pool: ${poolUserId}`);
            await remove(ref(db, `matchingPool/${poolUserId}`));
          }
        } catch (validationError) {
          console.error('❌ Realtime Database: Error validating user:', validationError);
        }
      }
      
      if (validPoolUsers.length < 2) {
        console.log('ℹ️ Realtime Database: Not enough valid users for pairing after validation');
        return;
      }
      
      console.log(`🔄 Realtime Database: Valid users for pairing: ${validPoolUsers.join(', ')}`);
      
      // Simple sequential pairing: pair users in order (1-2, 3-4, 5-6, etc.)
      let pairsCreated = 0;
      for (let i = 0; i < validPoolUsers.length - 1; i += 2) {
        const user1Id = validPoolUsers[i];
        const user2Id = validPoolUsers[i + 1];
        
        console.log(`🔄 Realtime Database: Pairing users ${user1Id} and ${user2Id}`);
        
        try {
          // Create buddy pair
          const pairId = push(ref(db, 'buddyPairs')).key;
          
          const pairData = {
            pairId: pairId,
            users: [user1Id, user2Id],
            matchedAt: new Date().toISOString(),
            compatibilityScore: 0.85,
            matchReasons: ['Sequential auto-match', 'First-come, first-served pairing'],
            status: 'active',
            lastMessageAt: new Date().toISOString(),
            user1RemovedFromPool: false,
            user2RemovedFromPool: false
          };
          
          await set(ref(db, `buddyPairs/${pairId}`), pairData);
          
          // Update user profiles with buddy info
          await set(ref(db, `users/${user1Id}/buddyInfo`), {
            hasBuddy: true,
            buddyId: user2Id,
            pairId: pairId,
            matchedAt: pairData.matchedAt
          });
          
          await set(ref(db, `users/${user2Id}/buddyInfo`), {
            hasBuddy: true,
            buddyId: user1Id,
            pairId: pairId,
            matchedAt: pairData.matchedAt
          });
          
          // Remove users from matching pool for both key formats
          Object.keys(raw).forEach(async (entryKey) => {
            const entry = raw[entryKey];
            const entryUid = entry?.uid || entry?.userId || entryKey;
            if (entryUid === user1Id || entryUid === user2Id) {
              await remove(ref(db, `matchingPool/${entryKey}`));
            }
          });
          
          // Update buddy pair pool removal flags
          await set(ref(db, `buddyPairs/${pairId}/user1RemovedFromPool`), true);
          await set(ref(db, `buddyPairs/${pairId}/user2RemovedFromPool`), true);
          
          pairsCreated++;
          
        } catch (pairError) {
          console.error('Error creating buddy pair:', pairError);
        }
      }
      
      // If current user was matched, reload their buddy data
      if (user?.uid) {
        const currentUserMatched = validPoolUsers.some(id => id === user.uid);
        if (currentUserMatched) {
          try {
            await loadRealBuddy();
          } catch (reloadError) {
            console.error('Error reloading buddy data:', reloadError);
          }
        }
      }
      
      if (pairsCreated > 0) {
        console.log(`🎉 Realtime Database: Auto-matching completed: ${pairsCreated} pairs created`);
      }
      
    } catch (error) {
      console.error('Error in Realtime Database auto-matching:', error);
    }
  };



  // Empty nemesis data (used when no real buddy is available)
  const emptyNemesis = {
    heroName: '',
    stats: {
      streakDays: 0,
      addictionLevel: 0,
      willpower: 0,
      motivation: 0,
      cravingResistance: 0,
      triggerDefense: 0,
      moneySaved: 0,
      experiencePoints: 0
    },
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
          moneySaved: 0,
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
          moneySaved: 0,
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
      const completeUserData = {
        ...userData,
        uid: authUser.uid,
        email: authUser.email,
        displayName: authUser.displayName || userData.heroName,
        photoURL: authUser.photoURL,
        onboardingCompleted: true,
        updatedAt: Date.now()
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
            archetype: completeUserData.archetype
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
            archetype: completeUserData.archetype
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
          moneySaved: 0,
          experiencePoints: 0
        },
        achievements: [],
        quitDate: new Date(),
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
      localStorage.removeItem('lastSOS');
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Offline Indicator */}
      <OfflineIndicator />
            

      {/* Onboarding Flow */}
      {currentView === 'onboarding' && (
        <div>
  
          <OnboardingFlow onComplete={handleOnboardingComplete} authUser={authUser} />
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
                            user={user}
                            nemesis={currentOpponent}
                            onBackToLogin={handleBackToLogin}
                            onResetForTesting={handleResetForTesting}
                            buddyLoading={buddyLoading}
                            buddyError={buddyError}
                            realBuddy={realBuddy}
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
                        className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
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
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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