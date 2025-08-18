import React, { useState, useEffect, useRef } from 'react';
// Initialize Firebase once app mounts; safe to tree-shake unused exports
import { db, auth } from './services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

import AuthScreen from './components/AuthScreen';
import { Users, Zap, Trophy, Target, Heart, DollarSign, Calendar, Star, Shield, Sword, Home, User, MessageCircle, Settings, Sparkles, ArrowRight, RefreshCw } from 'lucide-react';

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
const OnboardingFlow = ({ onComplete }) => {
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
        setUserData(prev => ({ ...prev, avatar: animeAvatar }));
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
        setUserData(prev => ({
          ...prev,
          avatarSeed: newSeed,
          avatar: avatar
        }));
      } catch (error) {
        // Fallback to local generation
        const fallbackAvatar = generateFallbackAvatar(newSeed);
        setUserData(prev => ({
          ...prev,
          avatarSeed: newSeed,
          avatar: fallbackAvatar
        }));
      }
    };
    
    tryDicebear();
    setTimeout(() => setIsGeneratingAvatar(false), 500);
  };



  const handleNext = () => {
    if (step < 10) { // Updated to 10 steps
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
                onChange={(e) => setUserData(prev => ({ ...prev, heroName: e.target.value }))}
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
                    onClick={() => setUserData(prev => ({ ...prev, archetype: archetype.id }))}
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
                    setUserData(prev => ({ ...prev, avatar: fallbackAvatar }));
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
                    setUserData(prev => ({
                      ...prev,
                      triggers: prev.triggers.includes(trigger)
                        ? prev.triggers.filter(t => t !== trigger)
                        : [...prev.triggers, trigger]
                    }));
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
                    setUserData(prev => ({
                      ...prev,
                      dailyPatterns: prev.dailyPatterns.includes(pattern)
                        ? prev.dailyPatterns.filter(p => p !== pattern)
                        : [...prev.dailyPatterns, pattern]
                    }));
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
                    setUserData(prev => ({
                      ...prev,
                      copingStrategies: prev.copingStrategies.includes(strategy)
                        ? prev.copingStrategies.filter(s => s !== strategy)
                        : [...prev.copingStrategies, strategy]
                    }));
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
                onChange={(e) => setUserData(prev => ({ ...prev, vapePodsPerWeek: parseFloat(e.target.value) || 0 }))}
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
                onChange={(e) => setUserData(prev => ({ ...prev, nicotineStrength: e.target.value }))}
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
                onChange={(e) => setUserData(prev => ({ ...prev, quitAttempts: e.target.value }))}
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
                  onChange={(e) => setUserData(prev => ({ ...prev, confidence: parseInt(e.target.value) }))}
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
  const getPersonalizedFeatures = (user) => {
    // Check if features are already stored for this user
    const storedFeaturesKey = `specialFeatures_${user.heroName || user.id || 'default'}`;
    let storedFeatures = localStorage.getItem(storedFeaturesKey);
    
    if (storedFeatures) {
      return JSON.parse(storedFeatures);
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
    
    // Store features permanently for this user
    localStorage.setItem(storedFeaturesKey, JSON.stringify(finalFeatures));
    
    return finalFeatures;
  };
  
  const userSpecialFeatures = getPersonalizedFeatures(user);
  
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
const BottomNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'arena', label: 'Arena', icon: Home },
    { id: 'craving-support', label: 'Craving Support', icon: Shield },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'buddy-chat', label: 'Chat with Buddy', icon: MessageCircle },
    { id: 'settings', label: 'Explore', icon: Settings }
  ];

  return (
    <>
      {/* Session Status Indicator */}
      <div className="fixed bottom-20 left-0 right-0 bg-slate-700/90 backdrop-blur-sm border-t border-slate-600 px-4 py-2 z-30">
        <div className="flex justify-center items-center gap-2 text-sm">
          <span className="text-green-400">🔐</span>
          <span className="text-white">Session Active</span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-300">30 days persistence</span>
        </div>
      </div>
      
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
const ArenaView = ({ user, nemesis, onBackToLogin, onResetForTesting }) => {
  const [showBattleInfo, setShowBattleInfo] = useState(false);
  
  // Calculate real-time stats based on user behavior data
  const calculateRealTimeStats = (user) => {
    const stats = { ...user.stats };
    
    // Calculate streak days from relapse data
    const lastRelapse = localStorage.getItem('quitCoachRelapseDate');
    if (lastRelapse) {
      const relapseDate = new Date(lastRelapse);
      const now = new Date();
      const timeDiff = now.getTime() - relapseDate.getTime();
      const daysSinceRelapse = Math.floor(timeDiff / (1000 * 3600 * 24));
      stats.streakDays = daysSinceRelapse;
    } else {
      // If no relapse, calculate from quit date
      const quitDate = user.quitDate ? new Date(user.quitDate) : new Date();
      const now = new Date();
      const timeDiff = now.getTime() - quitDate.getTime();
      stats.streakDays = Math.floor(timeDiff / (1000 * 3600 * 24));
    }
    
    // Get cravings resisted from localStorage
    const cravingWins = parseInt(localStorage.getItem('cravingWins') || 0);
    stats.cravingsResisted = cravingWins;
    
    // Calculate hydration streak for Mental Strength bonus
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
    
    // Apply hydration bonus to Mental Strength if streak >= 3
    if (hydrationStreak >= 3) {
      stats.mentalStrength = Math.min(80, (stats.mentalStrength || 50) + 1);
    }
    
    return stats;
  };
  
  // Get real-time stats for both user and nemesis
  const realTimeUserStats = calculateRealTimeStats(user);
  const realTimeNemesisStats = calculateRealTimeStats(nemesis);
  
  // Enhanced battle algorithm: (Mental Strength × 1.5) + (Motivation × 1.0) + (Trigger Defense × 1.2) - (Addiction × 1.0)
  const calculateBattleScore = (player) => {
    const mentalStrength = player.stats.mentalStrength || 50;
    const motivation = player.stats.motivation || 50;
    const triggerDefense = player.stats.triggerDefense || 30;
    const addiction = player.stats.addictionLevel || 50;
    
    return (mentalStrength * 1.5) + (motivation * 1.0) + (triggerDefense * 1.2) - (addiction * 1.0);
  };
  
  const playerScore = calculateBattleScore({ ...user, stats: realTimeUserStats });
  const nemesisScore = calculateBattleScore({ ...nemesis, stats: realTimeNemesisStats });
  
  const battleStatus = playerScore > nemesisScore ? 'WINNING' : 
                     playerScore === nemesisScore ? 'TIED' : 'LOSING';
  
  // Calculate intelligent recommendations based on stat efficiency and gaps
  const calculateRecommendations = () => {
    if (battleStatus === 'WINNING') return null;
    
    const scoreDifference = nemesisScore - playerScore + 1; // +1 to ensure we actually win
    const recommendations = [];
    
    // Get current player and nemesis stats
    const currentMentalStrength = realTimeUserStats.mentalStrength || 50;
    const currentMotivation = realTimeUserStats.motivation || 50;
    const currentTriggerDefense = realTimeUserStats.triggerDefense || 30;
    const currentAddiction = realTimeUserStats.addictionLevel || 50;
    
    const nemesisMentalStrength = realTimeNemesisStats.mentalStrength || 50;
    const nemesisMotivation = realTimeNemesisStats.motivation || 50;
    const nemesisTriggerDefense = realTimeNemesisStats.triggerDefense || 30;
    const nemesisAddiction = realTimeNemesisStats.addictionLevel || 50;
    
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
  
  const recommendations = calculateRecommendations();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-8 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back to Login Button */}
        <div className="flex justify-start mb-6 gap-3">
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
        
        {/* Enhanced Battle Status with Info Button */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-4">
            <div className={`inline-flex items-center px-6 py-3 rounded-full font-bold text-lg shadow-xl ${
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
              className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
              title="Battle Algorithm Info"
            >
              <span className="text-lg font-bold">i</span>
            </button>
          </div>
        </div>
        
        {/* Status Badges - Positioned above cards */}
        <div className="flex justify-center gap-12 mb-6">
          <div className="w-80 text-center">
            <div className={`inline-flex items-center px-4 py-2 rounded-full font-bold text-sm shadow-lg ${
              battleStatus === 'WINNING' ? 'bg-green-600' : 
              battleStatus === 'TIED' ? 'bg-yellow-600' : 'bg-red-600'
            } text-white`}>
              {battleStatus === 'WINNING' ? 'WINNING' : battleStatus === 'TIED' ? 'TIED' : 'LOSING'}
            </div>
          </div>
          
          <div className="w-24"></div> {/* Spacer for VS */}
          
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
            <TradingCard user={{ ...nemesis, stats: realTimeNemesisStats }} isNemesis={true} showComparison={false} nemesisUser={user} />
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
              <button
                onClick={() => setShowBattleInfo(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
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

  // Simple, Working Tetris Game
  const TetrisGame = () => {
    const [board, setBoard] = useState(Array(15).fill().map(() => Array(8).fill(0)));
    const [currentPiece, setCurrentPiece] = useState(null);
    const [piecePosition, setPiecePosition] = useState({x: 3, y: 0});
    const [linesCleared, setLinesCleared] = useState(0);

    // Simple square piece for now
    const piece = [[1, 1], [1, 1]];
    const pieceColor = '#3B82F6';

    // Initialize first piece
    useEffect(() => {
      if (!currentPiece) {
        setCurrentPiece({ shape: piece, color: pieceColor });
        setPiecePosition({x: 3, y: 0});
      }
    }, [currentPiece]);

    // Handle keyboard input
    useEffect(() => {
      if (isPaused) return;

      const handleKeyPress = (e) => {
        switch(e.key) {
          case 'ArrowLeft':
            setPiecePosition(prev => {
              const newPos = {...prev, x: Math.max(0, prev.x - 1)};
              console.log('Piece moved LEFT:', { from: prev.x, to: newPos.x });
              return newPos;
            });
            break;
          case 'ArrowRight':
            setPiecePosition(prev => {
              const newPos = {...prev, x: Math.min(6, prev.x + 1)};
              console.log('Piece moved RIGHT:', { from: prev.x, to: newPos.x });
              return newPos;
            });
            break;
          case 'ArrowDown':
            setPiecePosition(prev => {
              const newPos = {...prev, y: prev.y + 1};
              console.log('Piece moved DOWN:', { from: prev.y, to: newPos.y });
              return newPos;
            });
            break;
        }
      };

      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isPaused]);

    // Falling animation - FIXED: Proper piece falling without resets
    useEffect(() => {
      if (isPaused || !currentPiece) return;

      const fallInterval = setInterval(() => {
        setPiecePosition(prev => {
          const newY = prev.y + 1;
          
          console.log('Tetris piece falling:', { prev, newY, pieceLength: piece.length });
          
          // Check if piece should stop (hit bottom or other pieces)
          let shouldStop = false;
          
          // Check bottom collision - only when piece actually reaches bottom
          if (newY + piece.length > 15) {
            console.log('Bottom collision detected at Y:', newY);
            shouldStop = true;
          }
          
          // Check collision with existing pieces - only when piece is at new position
          if (!shouldStop) {
            piece.forEach((row, y) => {
              row.forEach((cell, x) => {
                if (cell && newY + y < 15 && prev.x + x >= 0 && prev.x + x < 8) {
                  // Check if there's already a piece at the new position
                  if (board[newY + y] && board[newY + y][prev.x + x] !== 0) {
                    console.log('Piece collision detected at:', { x: prev.x + x, y: newY + y, boardValue: board[newY + y][prev.x + x] });
                    shouldStop = true;
                  }
                }
              });
            });
          }
          
          if (shouldStop) {
            console.log('Placing piece on board at:', prev);
            // Place piece on board at CURRENT position (not new position)
            const newBoard = board.map(row => [...row]);
            piece.forEach((row, y) => {
              row.forEach((cell, x) => {
                if (cell && prev.y + y < 15 && prev.x + x >= 0 && prev.x + x < 8) {
                  newBoard[prev.y + y][prev.x + x] = pieceColor;
                }
              });
            });
            setBoard(newBoard);
            
            // Check for line clears
            let newLinesCleared = 0;
            for (let y = 14; y >= 0; y--) {
              if (newBoard[y].every(cell => cell !== 0)) {
                newBoard.splice(y, 1);
                newBoard.unshift(Array(8).fill(0));
                newLinesCleared++;
              }
            }
            setLinesCleared(prev => prev + newLinesCleared);
            setScore(prev => prev + newLinesCleared * 10);
            
            // Reset piece - this will trigger the useEffect to spawn a new piece
            setCurrentPiece(null);
            return {x: 3, y: 0};
          }
          
          // Continue falling
          console.log('Piece continuing to fall to Y:', newY);
          return {x: prev.x, y: newY};
        });
      }, 800);

      return () => clearInterval(fallInterval);
    }, [isPaused, currentPiece, board]);

    const renderBoard = () => {
      const displayBoard = board.map(row => [...row]);
      
      // Draw current piece
      if (currentPiece) {
        currentPiece.shape.forEach((row, y) => {
          row.forEach((cell, x) => {
            if (cell && piecePosition.y + y < 15 && piecePosition.x + x >= 0 && piecePosition.x + x < 8) {
              displayBoard[piecePosition.y + y][piecePosition.x + x] = currentPiece.color;
            }
          });
        });
      }
      
      return displayBoard;
    };

    return (
      <div className="text-center">
        <div className="bg-gray-800 p-4 rounded-lg inline-block">
          <div className="grid grid-cols-8 gap-1">
            {renderBoard().map((row, y) => 
              row.map((cell, x) => (
                <div 
                  key={`${x}-${y}`}
                  className="w-6 h-6 border border-gray-600"
                  style={{ backgroundColor: cell || '#374151' }}
                />
              ))
            )}
          </div>
        </div>
        <div className="mt-4">
          <p className="text-lg font-bold text-gray-800">Lines: {linesCleared}</p>
          <p className="text-sm text-gray-600">Arrow keys to move piece</p>
          <button
            onClick={() => {
              setBoard(Array(15).fill().map(() => Array(8).fill(0)));
              setCurrentPiece(null);
              setPiecePosition({x: 3, y: 0});
              setLinesCleared(0);
              setScore(0);
            }}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
          >
            Reset Game
          </button>
        </div>
      </div>
    );
  };



  const renderGame = () => {
    try {
      switch(gameType) {
        case 'snake': return <SnakeGame />;
        case 'tetris': return <TetrisGame />;
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
            {gameType === 'tetris' && '🧩 Tetris Game'}
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
            {gameType === 'tetris' && (
              <p>Arrow keys to move piece</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-8 pb-20">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-red-400 mb-2">🎮 Distraction Games</h1>
          <p className="text-gray-300">Take your mind off cravings with simple games</p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-start mb-6 gap-3">
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
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-orange-200">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">🎮 Distract Yourself</h2>
                          <p className="text-gray-600 mb-6">
                Play games to take your mind off the craving
              </p>
                          <button
                onClick={() => handleMiniGame('snake')}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg mb-4"
              >
                🐍 Play Snake
              </button>
              <button
                onClick={() => handleMiniGame('tetris')}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg mb-4"
              >
                🧩 Play Tetris
              </button>
              
              <button
                onClick={() => handleMiniGame('click-counter')}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg mb-4"
              >
                ⚡ Click Counter
              </button>

          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-200">
          <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">⚡ Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => {
                alert('💧 Hydration helps reduce cravings!\n\nDrink a full glass of water slowly.\n\nThis will help you feel full and reduce the urge to vape.');
              }}
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-4 px-4 rounded-xl transition-colors"
            >
              💧 Drink Water
            </button>
            <button 
              onClick={() => {
                alert('🫁 Take 3 deep breaths:\n\n1. Inhale for 4 seconds\n2. Hold for 4 seconds\n3. Exhale for 4 seconds\n\nRepeat 3 times');
              }}
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-4 px-4 rounded-xl transition-colors"
            >
              🫁 Breathe
            </button>
            <button 
              onClick={() => {
                alert('🚶‍♂️ Take a 5-minute walk:\n\nPhysical activity releases endorphins that can help reduce cravings.\n\nWalk around your room or step outside if possible.');
              }}
              className="bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold py-4 px-4 rounded-xl transition-colors"
            >
              🚶‍♂️ Walk
            </button>
            <button 
              onClick={() => {
                alert('📱 Call a supportive friend or family member:\n\nTalking to someone can help distract you and provide emotional support during this difficult moment.');
              }}
              className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 font-semibold py-4 px-4 rounded-xl transition-colors"
            >
              📱 Call Friend
            </button>
            <button 
              onClick={() => {
                alert('🧘‍♀️ Quick Meditation:\n\n1. Close your eyes\n2. Focus on your breath\n3. Count to 10 slowly\n4. Repeat 3 times\n\nThis helps calm your mind and reduce stress.');
              }}
              className="bg-green-100 hover:bg-green-200 text-green-700 font-semibold py-4 px-4 rounded-xl transition-colors"
            >
              🧘‍♀️ Meditate
            </button>
            <button 
              onClick={() => {
                alert('📚 Read something engaging:\n\nPick up a book, magazine, or read an article online.\n\nReading helps shift your focus away from cravings and engages your mind.');
              }}
              className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold py-4 px-4 rounded-xl transition-colors"
            >
              📚 Read
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
        
        {/* Progress Tracking */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-green-200 mt-8">
          <h2 className="text-2xl font-bold text-green-600 mb-4 text-center">📊 Your Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl mb-2">🎯</div>
              <p className="text-lg font-bold text-green-700">Craving Wins</p>
              <p className="text-2xl font-bold text-green-600">
                {localStorage.getItem('cravingWins') || 0}
              </p>
              <p className="text-sm text-green-600">Times you resisted</p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl mb-2">⏱️</div>
              <p className="text-lg font-bold text-blue-700">Total Time</p>
              <p className="text-2xl font-bold text-blue-600">
                {(() => {
                  const totalMinutes = parseInt(localStorage.getItem('totalGameTime') || 0);
                  const hours = Math.floor(totalMinutes / 60);
                  const minutes = totalMinutes % 60;
                  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
                })()}
              </p>
              <p className="text-sm text-blue-600">Distracted from cravings</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl mb-2">🏆</div>
              <p className="text-lg font-bold text-purple-700">Best Score</p>
              <p className="text-2xl font-bold text-purple-600">
                {localStorage.getItem('bestGameScore') || 0}
              </p>
              <p className="text-sm text-purple-600">Highest game score</p>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <button 
              onClick={() => {
                // Mark a craving win
                const currentWins = parseInt(localStorage.getItem('cravingWins') || 0);
                localStorage.setItem('cravingWins', currentWins + 1);
                alert('🎉 Great job resisting that craving!\n\nYour progress has been recorded.\n\nKeep up the amazing work!');
                window.location.reload(); // Refresh to show updated stats
              }}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              🎯 I Resisted a Craving!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Profile View - New Structure
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

  // Load relapse date and daily data from localStorage on mount
  useEffect(() => {
    const savedRelapseDate = localStorage.getItem('quitCoachRelapseDate');
    if (savedRelapseDate) {
      setRelapseDate(new Date(savedRelapseDate));
    }
    
    // Load daily data
    const today = new Date().toDateString();
    const savedWater = localStorage.getItem(`water_${today}`);
    const savedMood = localStorage.getItem(`mood_${today}`);
    const savedBreathing = localStorage.getItem(`breathing_${today}`);
    
    if (savedWater) setDailyWater(parseInt(savedWater));
    if (savedMood) setDailyMood(JSON.parse(savedMood));
    if (savedBreathing) setDailyBreathing(savedBreathing === 'true');
    
    // Load scheduled triggers
    const savedTriggers = localStorage.getItem('scheduledTriggers');
    if (savedTriggers) {
      setScheduledTriggers(JSON.parse(savedTriggers));
    }
  }, []);

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

  const handleRelapse = () => {
    const now = new Date();
    setRelapseDate(now);
    localStorage.setItem('quitCoachRelapseDate', now.toISOString());
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
  const handleWaterIntake = (glasses) => {
    setDailyWater(glasses);
    const today = new Date().toDateString();
    localStorage.setItem(`water_${today}`, glasses.toString());
    setShowWaterModal(false);
  };

  // Handle mood selection
  const handleMoodSelect = (mood) => {
    setDailyMood(mood);
    const today = new Date().toDateString();
    localStorage.setItem(`mood_${today}`, JSON.stringify(mood));
    setShowMoodModal(false);
  };

  // Handle breathing exercise completion
  const handleBreathingComplete = () => {
    setDailyBreathing(true);
    const today = new Date().toDateString();
    localStorage.setItem(`breathing_${today}`, 'true');
    setShowBreathingModal(false);
  };

  // Handle trigger scheduling
  const handleTriggerSchedule = (day, triggerType, time) => {
    const newTrigger = { day, triggerType, time, id: Date.now() };
    const updatedTriggers = [...scheduledTriggers, newTrigger];
    setScheduledTriggers(updatedTriggers);
    localStorage.setItem('scheduledTriggers', JSON.stringify(updatedTriggers));
    setShowTriggerModal(false);
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



const SettingsView = ({ onResetApp }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pb-20">
    <div className="max-w-md mx-auto px-4 pt-16">
      <div className="text-center mb-8">
        <Settings className="w-16 h-16 mx-auto mb-4 text-blue-400" />
        <h2 className="text-2xl font-bold text-white mb-2">Settings</h2>
        <p className="text-gray-300">Manage your app preferences</p>
      </div>
      
      <div className="space-y-4">
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
        
        <div className="bg-slate-800/50 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-2">About</h3>
          <p className="text-gray-400 text-sm">QuitCard Arena v1.0.0</p>
          <p className="text-gray-400 text-sm">Your journey to freedom starts here</p>
        </div>
      </div>
    </div>
  </div>
);

// Buddy Chat View Component
const BuddyChatView = ({ user, nemesis }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'buddy',
      text: 'Hey! How\'s your quit journey going?',
      timestamp: new Date(Date.now() - 60000).toLocaleTimeString()
    },
    {
      id: 2,
      sender: 'user',
      text: 'Going strong! Day 3 now.',
      timestamp: new Date(Date.now() - 30000).toLocaleTimeString()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  const handleSendMessage = () => {
    if (newMessage.trim().length === 0) return;
    
    // Limit message to 20 characters
    const truncatedMessage = newMessage.trim().slice(0, 20);
    
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: truncatedMessage,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    
    // Simulate buddy typing and response
    setIsTyping(true);
    setTimeout(() => {
      const buddyResponses = [
        'Keep it up! 💪',
        'You\'re doing great!',
        'Stay strong today!',
        'One day at a time!',
        'I believe in you!',
        'You\'ve got this!',
        'Every day counts!',
        'Stay focused! 🎯'
      ];
      
      const randomResponse = buddyResponses[Math.floor(Math.random() * buddyResponses.length)];
      
      const buddyMessage = {
        id: Date.now() + 1,
        sender: 'buddy',
        text: randomResponse,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, buddyMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Test buddy matching algorithm
  const testBuddyMatching = async () => {
    setIsTesting(true);
    setTestResults(null);
    
    try {
      // Import the buddy matching service dynamically
      const { 
        calculateCompatibility, 
        findBuddyMatch, 
        createBuddyPair 
      } = await import('./services/buddyMatching.js');
      
      const { mockUsers } = await import('./data/mockUsers.js');
      
      console.log('🧪 Starting Buddy Matching Algorithm Test...');
      
      // 1. Load and display count of mock users
      const userCount = mockUsers.length;
      console.log(`Found ${userCount} mock users`);
      
      // 2. Calculate compatibility between first two mock users
      const user1 = mockUsers[0];
      const user2 = mockUsers[1];
      const compatibilityScore = calculateCompatibility(user1, user2);
      console.log(`Compatibility between ${user1.heroName} and ${user2.heroName}: ${compatibilityScore} points`);
      
      // 3. Find best match for a test user
      const testUser = mockUsers[0]; // Use first user as test user
      const availableUsers = mockUsers.filter(u => u.id !== testUser.id);
      const bestMatch = findBuddyMatch(testUser, availableUsers);
      
      let matchResult = 'No suitable match found';
      let matchScore = 0;
      
      if (bestMatch) {
        matchResult = bestMatch.heroName;
        matchScore = calculateCompatibility(testUser, bestMatch);
        console.log(`Best match for ${testUser.heroName}: ${bestMatch.heroName} (Score: ${matchScore})`);
        
        // 4. Create buddy pair
        const buddyPair = createBuddyPair(testUser, bestMatch);
        console.log('Buddy pair created:', buddyPair);
      } else {
        console.log('No suitable match found for test user');
      }
      
      // 5. Show results on screen
      const results = {
        userCount,
        user1Name: user1.heroName,
        user2Name: user2.heroName,
        compatibilityScore,
        testUserName: testUser.heroName,
        matchResult,
        matchScore,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setTestResults(results);
      console.log('✅ Buddy Matching Algorithm Test completed successfully!');
      console.log('Check console for detailed logs');
      
    } catch (error) {
      console.error('❌ Error testing buddy matching algorithm:', error);
      setTestResults({
        error: true,
        message: error.message,
        timestamp: new Date().toLocaleTimeString()
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-8 pb-20">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">💬 Chat with Buddy</h1>
          <p className="text-gray-300">Stay connected with your quit buddy for support</p>
        </div>

        {/* Chat Container */}
        <div className="bg-slate-800 rounded-2xl p-6 shadow-2xl border border-slate-700">
          {/* Messages */}
          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-gray-200'
                  }`}
                >
                  <div className="text-sm">{message.text}</div>
                  <div className="text-xs opacity-70 mt-1">{message.timestamp}</div>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-700 text-gray-200 px-4 py-2 rounded-2xl">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm">Buddy is typing</span>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message (max 20 chars)..."
              maxLength={20}
              className="flex-1 bg-slate-700 text-white px-4 py-3 rounded-xl border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={handleSendMessage}
              disabled={newMessage.trim().length === 0}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white px-6 py-3 rounded-xl transition-colors disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
          
          {/* Character Counter */}
          <div className="text-right mt-2">
            <span className={`text-xs ${newMessage.length >= 18 ? 'text-yellow-400' : 'text-gray-400'}`}>
              {newMessage.length}/20
            </span>
          </div>
        </div>

        {/* Buddy Info */}
        <div className="mt-6 bg-slate-800 rounded-2xl p-6 shadow-2xl border border-slate-700">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {nemesis.heroName.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{nemesis.heroName}</h3>
              <p className="text-gray-300">Your Quit Buddy</p>
              <p className="text-sm text-gray-400">Always here to support you</p>
            </div>
          </div>
        </div>

        {/* Test Algorithm Section */}
        <div className="mt-6 bg-slate-800 rounded-2xl p-6 shadow-2xl border border-slate-700">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-white mb-2">🧪 Test Buddy Matching Algorithm</h3>
            <p className="text-gray-300 text-sm mb-4">Verify the matching service works correctly</p>
            
            <button
              onClick={testBuddyMatching}
              disabled={isTesting}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 text-white px-6 py-3 rounded-xl transition-colors disabled:cursor-not-allowed font-semibold"
            >
              {isTesting ? 'Testing...' : 'Test Algorithm'}
            </button>
          </div>

          {/* Test Results */}
          {testResults && (
            <div className="mt-4 p-4 bg-slate-700 rounded-xl border border-slate-600">
              <h4 className="text-lg font-bold text-white mb-3">Testing Results:</h4>
              
              {testResults.error ? (
                <div className="text-red-400">
                  <p className="font-semibold">❌ Test Failed:</p>
                  <p className="text-sm">{testResults.message}</p>
                  <p className="text-xs text-gray-400 mt-2">Timestamp: {testResults.timestamp}</p>
                </div>
              ) : (
                <div className="space-y-2 text-sm">
                  <p className="text-green-400">
                    <span className="font-semibold">✅ Found {testResults.userCount} mock users</span>
                  </p>
                  
                  <p className="text-blue-400">
                    <span className="font-semibold">Compatibility score between {testResults.user1Name} and {testResults.user2Name}: {testResults.compatibilityScore} points</span>
                  </p>
                  
                  <p className="text-yellow-400">
                    <span className="font-semibold">Best match for {testResults.testUserName}: {testResults.matchResult}</span>
                    {testResults.matchScore > 0 && ` (Score: ${testResults.matchScore})`}
                  </p>
                  
                  <p className="text-gray-400 text-xs mt-3">
                    <span className="font-semibold">Check console for detailed logs</span>
                    <br />
                    Timestamp: {testResults.timestamp}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [activeTab, setActiveTab] = useState('arena');
  const [currentView, setCurrentView] = useState('auth');
  const [selectedMood, setSelectedMood] = useState(null);
  const [user, setUser] = useState(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

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
        console.log('Existing user data found - going to Arena');
        setUser(userData);
        const completed = !!userData.onboardingCompleted;
        setHasCompletedOnboarding(completed);
        setCurrentView('arena');
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

  // Mock nemesis data (this could be replaced with real opponent matching later)
  const mockNemesis = {
    heroName: 'HealthGuardian Emma',
    stats: {
      streakDays: Math.floor(Math.random() * 5) + 1, // Random streak for variety
      addictionLevel: 50, // Scaled to 100-point system
      willpower: 80, // Scaled to 100-point system
      motivation: 90, // Scaled to 100-point system
      cravingResistance: 85, // For Mental Strength calculation
      triggerDefense: 75, // Scaled to 100-point system
      moneySaved: Math.floor(Math.random() * 30) + 10,
      experiencePoints: Math.floor(Math.random() * 100) + 20
    },
    achievements: [],
    archetype: 'HEALTH_WARRIOR',
    avatar: generateAvatar('nemesis-emma', 'adventurer')
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
      setCurrentView('arena');
      
      console.log('Onboarding completed successfully:', {
        user: completeUserData,
        hasCompletedOnboarding: true,
        currentView: 'arena'
      });
      
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
      
      console.log('Using fallback user data due to error:', fallbackUser);
      
                      // Try to save fallback data to Firebase
                if (authUser) {
                  try {
                    console.log('Attempting to save fallback data to Firebase...');
                    const { ref, set } = await import('firebase/database');
                    const userRef = ref(db, `users/${authUser.uid}`);
                    await set(userRef, fallbackUser);
                    console.log('Fallback data saved to Firebase successfully');
                  } catch (firebaseError) {
                    console.error('Failed to save fallback data to Firebase:', firebaseError);
                    // Continue with local state even if Firebase save fails
                  }
                }
      
      // Set app state with fallback data
      setUser(fallbackUser);
      setHasCompletedOnboarding(true);
      setCurrentView('arena');
      
      console.log('App state set with fallback data');
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
      const { ref, set } = await import('firebase/database');
      
      // Clear current user data
      const userRef = ref(db, `users/${authUser.uid}`);
      await set(userRef, null);
      
      // Clear ALL users data (for complete system reset)
      const allUsersRef = ref(db, 'users');
      await set(allUsersRef, null);
      
      console.log('All user data cleared from database');
      
      // Reset local state
      setUser(null);
      setHasCompletedOnboarding(false);
      setCurrentView('onboarding');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
              {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed top-4 right-4 bg-black/80 text-white p-2 rounded text-xs z-50">
            <div>View: {currentView}</div>
            <div>Onboarding: {hasCompletedOnboarding ? 'Yes' : 'No'}</div>
            <div>User: {user ? 'Yes' : 'No'}</div>
            <div>Active Tab: {activeTab}</div>
            <div>Auth User: {authUser ? 'Yes' : 'No'}</div>
            <div>Auth Loading: {authLoading ? 'Yes' : 'No'}</div>
            <div className="border-t border-gray-600 mt-2 pt-2">
              <div className="text-green-300 font-semibold">🔐 Session Status</div>
              <div className="text-xs text-gray-300">
                {authUser ? `Logged in: ${authUser.email}` : 'Not authenticated'}
              </div>
              <div className="text-xs text-gray-300">
                {authUser ? 'Session: Persistent (30 days)' : 'Session: None'}
              </div>
              {authUser && (
                <button 
                  onClick={handleBackToLogin}
                  className="mt-1 px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 w-full"
                >
                  Logout
                </button>
              )}
            </div>
            <div className="border-t border-gray-600 mt-2 pt-2">
              <div className="text-yellow-300 font-semibold">🧪 Testing Mode</div>
              <div className="text-xs text-gray-300">Use "Reset ALL User Data" in Arena/Craving tabs</div>
            </div>
            <div className="border-t border-gray-600 mt-2 pt-2">
              <div className="text-red-300 font-semibold">⚠️ Known Issues</div>
              <div className="text-xs text-gray-300">Content script errors are from browser extensions</div>
              <div className="text-xs text-gray-300">Background frame errors are from browser tabs</div>
              <div className="text-xs text-gray-300">None affect app functionality</div>
            </div>
            <button 
              onClick={() => {
                console.log('=== DEBUG STATE ===');
                console.log('Current View:', currentView);
                console.log('Onboarding Completed:', hasCompletedOnboarding);
                console.log('User Data:', user);
                console.log('Auth User:', authUser);
                console.log('Auth Loading:', authLoading);
                console.log('==================');
              }}
              className="mt-1 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
            >
              Debug
            </button>
            <button 
              onClick={async () => {
                if (authUser) {
                  try {
                    const { ref, set } = await import('firebase/database');
                    const userRef = ref(db, `users/${authUser.uid}`);
                    await set(userRef, null);
                    console.log('User data cleared from Firebase');
                    window.location.reload();
                  } catch (error) {
                    console.error('Error clearing user data:', error);
                  }
                }
              }}
              className="mt-1 px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
            >
              Reset Current User
            </button>
            <button 
              onClick={() => {
                setCurrentView('onboarding');
                setHasCompletedOnboarding(false);
                console.log('Forced to onboarding view');
              }}
              className="mt-1 px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
            >
              Force Onboarding
            </button>
          </div>
        )}

      {/* Onboarding Flow */}
      {currentView === 'onboarding' && (
        <div>
          {console.log('Rendering OnboardingFlow')}
          <OnboardingFlow onComplete={handleOnboardingComplete} />
        </div>
      )}

      {/* Main App Content - Only show after onboarding */}
      {hasCompletedOnboarding && user ? (
        <>
          {console.log('Main app rendering with user:', user, 'view:', currentView)}
          {currentView === 'arena' && (
            <div>
              {console.log('Rendering ArenaView with user:', user)}
              {(() => {
                try {
                  return (
                    <ArenaView 
                      user={user}
                      nemesis={mockNemesis}
                      onBackToLogin={handleBackToLogin}
                      onResetForTesting={handleResetForTesting}
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
              {console.log('Rendering CravingSupportView with user:', user)}
              <CravingSupportView 
                user={user}
                nemesis={mockNemesis}
                onBackToLogin={handleBackToLogin}
                onResetForTesting={handleResetForTesting}
              />
            </div>
          )}
          
          {currentView === 'profile' && (
            <div>
              {console.log('Rendering ProfileView with user:', user)}
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
          
          {currentView === 'buddy-chat' && <BuddyChatView user={user} nemesis={mockNemesis} />}
          {currentView === 'settings' && <SettingsView onResetApp={handleResetApp} />}

          {/* Bottom Navigation */}
          <BottomNavigation 
            activeTab={activeTab} 
            onTabChange={handleTabChange}
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
