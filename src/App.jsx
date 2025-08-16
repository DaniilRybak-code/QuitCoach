import React, { useState, useEffect, useRef } from 'react';
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
  
  // Generate random special features for the user
  const userSpecialFeatures = SPECIAL_FEATURES
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);
  
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
        
        {/* Battle Info */}
        <div className="bg-black/30 rounded-lg p-3 space-y-2 mb-3 backdrop-blur-sm">
          <div className="flex justify-between text-white text-sm">
            <span className="text-gray-300">Streak:</span>
            <span className="font-bold text-green-400 flex items-center gap-1">
              {user.stats.streakDays} days
              {user.stats.streakDays > 0 && <span className="text-xs">🔥</span>}
            </span>
          </div>
          <div className="flex justify-between text-white text-sm">
            <span className="text-gray-300">Saved:</span>
            <span className="font-bold text-yellow-400">£{(user.stats.moneySaved || 0).toFixed(0)}</span>
          </div>
          <div className="flex justify-between text-white text-sm">
            <span className="text-gray-300">Record:</span>
            <span className="font-bold text-purple-400">{nemesisVictories}</span>
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
    { id: 'chat', label: 'Forum', icon: MessageCircle },
    { id: 'settings', label: 'Explore', icon: Settings }
  ];

  return (
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
  );
};

// Arena View
const ArenaView = ({ user, nemesis, onBackToLogin }) => {
  const battleStatus = user.stats.streakDays > nemesis.stats.streakDays ? 'WINNING' : 
                     user.stats.streakDays === nemesis.stats.streakDays ? 'TIED' : 'LOSING';
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-8 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back to Login Button */}
        <div className="flex justify-start mb-6">
          <button
            onClick={onBackToLogin}
            className="px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            ← Back to Login
          </button>
        </div>
        
        {/* Battle Status */}
        <div className="text-center mb-8">
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
            <TradingCard user={user} showComparison={false} nemesisUser={nemesis} />
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
            <TradingCard user={nemesis} isNemesis={true} showComparison={false} nemesisUser={user} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Affirmation Modal Component




// Game Modal Component with Simple, Working Games
const GameModal = ({ gameType, onClose }) => {
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);





  const togglePause = () => setIsPaused(!isPaused);

  // Simple, Working Snake Game
  const SnakeGame = () => {
    const canvasRef = useRef(null);
    const [snake, setSnake] = useState([{x: 7, y: 7}]);
    const [direction, setDirection] = useState({x: 1, y: 0});
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
    
    console.log('Speed levels:', LEVEL_SPEEDS); // Should show {1: 160, 2: 128, 3: 102}
    
    const LEVEL_POINTS = {
      1: 2,  // Level 1: 2 points per food
      2: 5,  // Level 2: 5 points per food
      3: 10  // Level 3: 10 points per food
    };

    // Handle keyboard input
    useEffect(() => {
      const handleKeyPress = (e) => {
        if (gameOver) {
          e.preventDefault(); // Prevent any unwanted behavior
          // Restart game
          setSnake([{x: 7, y: 7}]);
          setDirection({x: 1, y: 0});
          setFood({x: 10, y: 10});
          setGameOver(false);
          setSnakeScore(0);
          setLevel(1);
          return;
        }

        switch(e.key) {
          case 'ArrowUp':
            e.preventDefault(); // Prevent background scrolling
            if (direction.y === 0) {
              console.log('Direction changed to UP');
              setDirection({x: 0, y: -1});
            }
            break;
          case 'ArrowDown':
            e.preventDefault(); // Prevent background scrolling
            if (direction.y === 0) {
              console.log('Direction changed to DOWN');
              setDirection({x: 0, y: 1});
            }
            break;
          case 'ArrowLeft':
            e.preventDefault(); // Prevent background scrolling
            if (direction.x === 0) {
              console.log('Direction changed to LEFT');
              setDirection({x: -1, y: 0});
            }
            break;
          case 'ArrowRight':
            e.preventDefault(); // Prevent background scrolling
            if (direction.x === 0) {
              console.log('Direction changed to RIGHT');
              setDirection({x: 1, y: 0});
            }
            break;
        }
      };

      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }, [direction, gameOver]);

    // Game loop - FIXED: Proper snake movement without resets
    useEffect(() => {
      if (isPaused || gameOver) return;

      const gameLoop = setInterval(() => {
        setSnake(prevSnake => {
          console.log('Snake before move:', prevSnake);
          
          // Create new head based on current direction
          const newHead = {
            x: prevSnake[0].x + direction.x,
            y: prevSnake[0].y + direction.y
          };
          
          console.log('New head position:', newHead, 'Direction:', direction);
          
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
            console.log('Self collision at:', newHead);
            setGameOver(true);
            return prevSnake;
          }
          
          // Check food collision
          const ateFood = newHead.x === food.x && newHead.y === food.y;
          
          if (ateFood) {
            console.log('Food eaten at:', newHead);
            setSnakeScore(s => s + LEVEL_POINTS[level]);
            // Generate new food
            setFood({
              x: Math.floor(Math.random() * 15),
              y: Math.floor(Math.random() * 15)
            });
            // Snake grows: add new head, keep all body
            const newSnake = [newHead, ...prevSnake];
            console.log('Snake after eating food:', newSnake);
            return newSnake;
          } else {
            // Snake moves: add new head, remove tail
            const newSnake = [newHead, ...prevSnake.slice(0, -1)];
            console.log('Snake after moving:', newSnake);
            return newSnake;
          }
        });
      }, LEVEL_SPEEDS[level]); // Level-based speed

      return () => clearInterval(gameLoop);
    }, [direction, food, isPaused, gameOver]);

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
          <p className="text-sm text-gray-600">Use arrow keys to control the snake</p>
          {gameOver && (
            <div className="mt-2">
              <p className="text-red-600 font-bold mb-2">Game Over!</p>
              <button
                onClick={() => {
                  setSnake([{x: 7, y: 7}]);
                  setDirection({x: 1, y: 0});
                  setFood({x: 10, y: 10});
                  setGameOver(false);
                  setScore(0);
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
const CravingSupportView = ({ user, nemesis, onBackToLogin }) => {
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

// Placeholder Views
const ChatView = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pb-20 flex items-center justify-center">
    <div className="text-center text-white">
      <MessageCircle className="w-16 h-16 mx-auto mb-4 text-blue-400" />
      <h2 className="text-2xl font-bold mb-2">Forum Coming Soon</h2>
      <p className="text-gray-300">Connect with other quit warriors!</p>
    </div>
  </div>
);

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

// Main App Component
const App = () => {
  const [activeTab, setActiveTab] = useState('arena');
  const [currentView, setCurrentView] = useState('onboarding');
  const [selectedMood, setSelectedMood] = useState(null);
  const [user, setUser] = useState(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  
  // Check if user has completed onboarding (local storage)
  useEffect(() => {
    console.log('App component mounted');
    try {
      const savedUser = localStorage.getItem('quitCoachUser');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        console.log('Loaded saved user:', parsedUser);
        setUser(parsedUser);
        setHasCompletedOnboarding(true);
        setCurrentView('arena');
      } else {
        console.log('No saved user found, starting onboarding');
      }
    } catch (error) {
      console.error('Error parsing saved user:', error);
      localStorage.removeItem('quitCoachUser');
    }
  }, []);

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

  const handleOnboardingComplete = (userData) => {
    console.log('Onboarding completed with user data:', userData);
    
    try {
      // Validate user data before setting state
      if (!userData || !userData.heroName || !userData.stats) {
        throw new Error('Invalid user data received from onboarding');
      }
      
      console.log('Setting app state...');
      setUser(userData);
      setHasCompletedOnboarding(true);
      setCurrentView('arena');
      
      // Save user data to local storage
      localStorage.setItem('quitCoachUser', JSON.stringify(userData));
      
      console.log('State updated successfully:', {
        user: userData,
        hasCompletedOnboarding: true,
        currentView: 'arena'
      });
      
      // Force a re-render
      setTimeout(() => {
        console.log('Forcing re-render...');
        setUser({...userData});
      }, 100);
      
    } catch (error) {
      console.error('Error in handleOnboardingComplete:', error);
      // Fallback to basic user data
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
        quitDate: new Date()
      };
      
      console.log('Using fallback user data:', fallbackUser);
      setUser(fallbackUser);
      setHasCompletedOnboarding(true);
      setCurrentView('arena');
      localStorage.setItem('quitCoachUser', JSON.stringify(fallbackUser));
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

  const handleBackToLogin = () => {
    // Navigate back to onboarding flow
    setCurrentView('onboarding');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 bg-black/80 text-white p-2 rounded text-xs z-50">
          <div>View: {currentView}</div>
          <div>Onboarding: {hasCompletedOnboarding ? 'Yes' : 'No'}</div>
          <div>User: {user ? 'Yes' : 'No'}</div>
          <div>Active Tab: {activeTab}</div>
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
          
          {currentView === 'chat' && <ChatView />}
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
