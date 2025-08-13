import React, { useState, useEffect } from 'react';
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
    // New fields for stats calculation
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

  // Calculate initial stats based on user answers
  const calculateInitialStats = () => {
    let addictionLevel = 5; // Base level
    let willpower = 7; // Base level
    let motivation = 6; // Base level
    
    // Vape pods per week impact
    if (userData.vapePodsPerWeek > 10) addictionLevel += 3;
    else if (userData.vapePodsPerWeek > 5) addictionLevel += 2;
    else if (userData.vapePodsPerWeek > 2) addictionLevel += 1;
    
    // Nicotine strength impact
    const strengthMap = { '3mg': 0, '6mg': 1, '12mg': 2, '18mg': 2, '20mg': 3, '50mg': 4 };
    addictionLevel += strengthMap[userData.nicotineStrength] || 0;
    
    // Quit attempts impact
    const attemptsMap = { 
      'This is my first attempt': 0, 
      'Once before': 1, 
      'Twice before': 2, 
      '3-5 times': 3, 
      'More than 5 times': 4 
    };
    const attemptsImpact = attemptsMap[userData.quitAttempts] || 0;
    addictionLevel += attemptsImpact;
    willpower -= Math.min(attemptsImpact, 3); // Reduce willpower for multiple attempts
    
    // Confidence impact
    motivation += Math.max(0, userData.confidence - 5); // Higher confidence = higher motivation
    
    // Clamp values to 1-10 range
    addictionLevel = Math.min(10, Math.max(1, addictionLevel));
    willpower = Math.min(10, Math.max(1, willpower));
    motivation = Math.min(10, Math.max(1, motivation));
    
    return { addictionLevel, willpower, motivation };
  };

  const handleNext = () => {
    if (step < 6) { // Updated to 6 steps
      setStep(step + 1);
    } else {
      // Complete onboarding with calculated stats
      const stats = calculateInitialStats();
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
      onComplete(finalUserData);
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
      case 4: return userData.vapePodsPerWeek > 0;
      case 5: return userData.nicotineStrength !== '';
      case 6: return userData.quitAttempts !== '' && userData.confidence > 0;
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
        <div className="flex justify-between items-center mb-8">
          {[1, 2, 3, 4, 5, 6].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                stepNumber <= step ? 'bg-blue-500 text-white' : 'bg-slate-600 text-gray-400'
              }`}>
                {stepNumber < step ? '✓' : stepNumber}
              </div>
              {stepNumber < 6 && (
                <div className={`w-8 h-1 mx-1 ${
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

        {/* Step 4: Vape Pods Question */}
        {step === 4 && (
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🚬</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Vape Usage</h1>
            <p className="text-gray-300 mb-6">Help us understand your current usage patterns.</p>
            
            <div className="mb-6">
              <label className="block text-white text-sm font-medium mb-2 text-left">
                How many vape pods do you use per week?
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={userData.vapePodsPerWeek}
                onChange={(e) => setUserData(prev => ({ ...prev, vapePodsPerWeek: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter number of pods"
              />
            </div>
          </div>
        )}

        {/* Step 5: Nicotine Strength Question */}
        {step === 5 && (
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">⚡</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Nicotine Strength</h1>
            <p className="text-gray-300 mb-6">Select your current nicotine level.</p>
            
            <div className="mb-6">
              <label className="block text-white text-sm font-medium mb-2 text-left">
                What's your nicotine strength (mg)?
              </label>
              <select
                value={userData.nicotineStrength}
                onChange={(e) => setUserData(prev => ({ ...prev, nicotineStrength: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select strength</option>
                <option value="3mg">3mg (very low)</option>
                <option value="6mg">6mg</option>
                <option value="12mg">12mg</option>
                <option value="18mg">18mg</option>
                <option value="20mg">20mg</option>
                <option value="50mg">50mg (ultra high)</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 6: Quit Attempts & Confidence Questions */}
        {step === 6 && (
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🎯</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Quit History & Confidence</h1>
            <p className="text-gray-300 mb-6">Tell us about your quit journey.</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2 text-left">
                  How many times have you tried to quit before?
                </label>
                <select
                  value={userData.quitAttempts}
                  onChange={(e) => setUserData(prev => ({ ...prev, quitAttempts: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select option</option>
                  <option value="This is my first attempt">This is my first attempt</option>
                  <option value="Once before">Once before</option>
                  <option value="Twice before">Twice before</option>
                  <option value="3-5 times">3-5 times</option>
                  <option value="More than 5 times">More than 5 times</option>
                </select>
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2 text-left">
                  How confident are you this time? (1-10 scale)
                </label>
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
            {step === 6 ? 'Start Journey' : 'Next'}
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
      description: "Time since last vape - resets on relapse",
      impacts: [
        "Days clean: -1 point per week",
        "Relapse: Resets to starting level",
        "Tapering vs cold turkey affects decay rate"
      ]
    },
    willpower: {
      title: "Willpower",
      description: "Grows stronger each time you resist a craving",
      impacts: [
        "Successful craving resistance: +1 point",
        "Relapse: -2 points",
        "Streak milestones: Bonus points"
      ]
    },
    motivation: {
      title: "Motivation",
      description: "Your drive to quit - boosted by progress celebration",
      impacts: [
        "Logging progress regularly: +1 point",
        "Sharing achievements: +2 points",
        "Helping other users: +1 point",
        "Long periods inactive: -1 point",
        "Seeing money saved milestones: +2 points",
        "Reading success stories: +1 point",
        "Missing check-ins: -1 point"
      ]
    },
    cravingResistance: {
      title: "Craving Resistance",
      description: "How well you handle urges when they hit",
      impacts: [
        "Using app during cravings: +1 point",
        "Logging craving intensity: +1 point",
        "Completing breathing exercises: +2 points",
        "Using delay tactics: +1 point",
        "Giving in to cravings: -1 point"
      ]
    },
    triggerDefense: {
      title: "Trigger Defense",
      description: "Protection against your personal vaping triggers",
      impacts: [
        "Surviving trigger situations: +2 points",
        "Pre-planning for triggers: +1 point",
        "Learning new coping strategies: +1 point",
        "Relapsing to known triggers: -2 points",
        "Updating trigger list: +1 point"
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

// Enhanced StatBar Component with Info Button
const StatBar = ({ label, value, max, color, statType, onInfoClick }) => (
  <div className="mb-2">
    <div className="flex justify-between text-white text-xs mb-1">
      <div className="flex items-center gap-1">
        <span>{label}</span>
        {statType && (
          <button
            onClick={() => onInfoClick(statType)}
            className="w-4 h-4 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold transition-colors"
            title={`Learn about ${label}`}
          >
            i
          </button>
        )}
      </div>
      <span>{value}/{max}</span>
    </div>
    <div className="w-full bg-gray-700 rounded-full h-2">
      <div 
        className={`${color} h-2 rounded-full transition-all duration-500`} 
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
  </div>
);

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
  const rarity = RARITIES[calculateRarity(user.stats.streakDays)];
  const ArchetypeIcon = archetype.icon;
  
  // Generate random special features for the user
  const userSpecialFeatures = SPECIAL_FEATURES
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);
  
  // Generate random stats for new attributes if they don't exist
  const cravingResistance = user.stats.cravingResistance || Math.floor(Math.random() * 10) + 1;
  const triggerDefense = user.stats.triggerDefense || Math.floor(Math.random() * 10) + 1;
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
        <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${archetype.color} text-white z-10`}>
          {rarity.name}
        </div>
        
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
        
        {/* Core Stats with Info Buttons */}
        <div className="space-y-2 mb-4">
          <StatBar 
            label="Addiction" 
            value={user.stats.addictionLevel} 
            max={10} 
            color="bg-red-500" 
            statType="addiction"
            onInfoClick={handleInfoClick}
          />
          <StatBar 
            label="Willpower" 
            value={Math.round(user.stats.willpower)} 
            max={10} 
            color="bg-blue-500" 
            statType="willpower"
            onInfoClick={handleInfoClick}
          />
          <StatBar 
            label="Motivation" 
            value={user.stats.motivation} 
            max={10} 
            color="bg-green-500" 
            statType="motivation"
            onInfoClick={handleInfoClick}
          />
        </div>
        
        {/* New Stats */}
        <div className="space-y-2 mb-4">
          <StatBar 
            label="Craving Resistance" 
            value={cravingResistance} 
            max={10} 
            color="bg-purple-500" 
            statType="cravingResistance"
            onInfoClick={handleInfoClick}
          />
          <StatBar 
            label="Trigger Defense" 
            value={triggerDefense} 
            max={10} 
            color="bg-orange-500" 
            statType="triggerDefense"
            onInfoClick={handleInfoClick}
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
const AffirmationModal = ({ isOpen, onClose }) => {
  const affirmations = [
    "My decisions create positive change in the world",
    "I am stronger than my cravings",
    "Each day smoke-free is a victory",
    "I choose health and happiness over addiction",
    "My willpower grows stronger every day"
  ];

  const todaysAffirmation = affirmations[Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % affirmations.length];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-700">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✨</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Today's Affirmation</h3>
          <p className="text-gray-300 text-lg italic mb-6 leading-relaxed">
            "{todaysAffirmation}"
          </p>
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all duration-300"
          >
            Thank you
          </button>
        </div>
      </div>
    </div>
  );
};

// Mood Selection Component
const MoodSelector = ({ onMoodSelect, onBack }) => {
  const moods = [
    { id: 'anger', name: 'Anger', emoji: '😡' },
    { id: 'sadness', name: 'Sadness', emoji: '😢' },
    { id: 'disgust', name: 'Disgust', emoji: '🤢' },
    { id: 'fear', name: 'Fear', emoji: '😨' },
    { id: 'enjoyment', name: 'Enjoyment', emoji: '😊' },
    { id: 'calm', name: 'Calm', emoji: '😌' }
  ];

  const handleMoodSelect = (mood) => {
    onMoodSelect(mood);
    setTimeout(() => {
      onBack();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 pb-20">
      <div className="max-w-md mx-auto">
        <button 
          onClick={onBack}
          className="text-white mb-6 flex items-center gap-2 hover:text-blue-300 transition-colors"
        >
          ← Back
        </button>
        
        <h1 className="text-3xl font-bold text-yellow-400 mb-8">Today...</h1>
        
        <h2 className="text-white text-lg mb-8">Select your main emotion:</h2>
        
        <div className="grid grid-cols-3 gap-6 mb-12">
          {moods.map((mood) => (
            <button
              key={mood.id}
              onClick={() => handleMoodSelect(mood)}
              className="flex flex-col items-center p-4 rounded-full bg-slate-700/50 hover:bg-slate-600/50 transition-all duration-300 hover:scale-105"
            >
              <div className="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center text-2xl mb-2">
                {mood.emoji}
              </div>
              <span className="text-white text-sm">{mood.name}</span>
            </button>
          ))}
        </div>
        
        <div className="text-center">
          <button 
            onClick={() => handleMoodSelect({ id: 'indifferent', name: 'Indifferent' })}
            className="text-gray-400 text-sm mb-6"
          >
            I'm feeling indifferent today
          </button>
          
          <button
            onClick={() => handleMoodSelect({ id: 'calm', name: 'Calm' })}
            className="w-full bg-slate-600 hover:bg-slate-500 text-white py-3 rounded-full transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

// Profile View
const ProfileView = ({ user, onNavigate }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  const [hydrationCompleted, setHydrationCompleted] = useState(false);
  const [breathingCompleted, setBreathingCompleted] = useState(false);
  const [showAffirmation, setShowAffirmation] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const quitDate = new Date(currentTime.getTime() - (2 * 24 + 19) * 60 * 60 * 1000);
  const timeDiff = currentTime - quitDate;
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  const weekDays = [
    { name: 'Mon', color: 'bg-green-500' },
    { name: 'Tue', color: 'bg-green-500' },
    { name: 'Wed', color: 'bg-red-500' },
    { name: 'Thu', color: 'bg-green-500' },
    { name: 'Fri', color: 'bg-slate-700' },
    { name: 'Sat', color: 'bg-slate-700' },
    { name: 'Sun', color: 'bg-slate-700' }
  ];

  const todayTasks = [
    {
      id: 'affirmation',
      title: 'My positive affirmation',
      subtitle: 'Discover your message of the day',
      icon: '📋',
      bgColor: 'from-cyan-500/20 to-cyan-600/20',
      onClick: () => setShowAffirmation(true)
    },
    {
      id: 'mood',
      title: 'Mood tracking',
      subtitle: selectedMood ? `You feel ${selectedMood.name.toLowerCase()}` : 'How do you feel?',
      icon: '🌤️',
      bgColor: 'from-blue-500/20 to-blue-600/20',
      onClick: () => onNavigate('mood-selector')
    },
    {
      id: 'exercise',
      title: 'Exercise for 30 minutes',
      subtitle: exerciseCompleted ? 'Completed! Great job!' : 'Tap to mark as complete',
      icon: '💪',
      bgColor: 'from-green-500/20 to-green-600/20',
      isCheckbox: true,
      completed: exerciseCompleted,
      onClick: () => setExerciseCompleted(!exerciseCompleted)
    },
    {
      id: 'hydration',
      title: 'Stay hydrated',
      subtitle: hydrationCompleted ? 'Completed! Well done!' : 'Tap to mark as complete',
      icon: '💧',
      bgColor: 'from-blue-400/20 to-blue-500/20',
      isCheckbox: true,
      completed: hydrationCompleted,
      onClick: () => setHydrationCompleted(!hydrationCompleted)
    },
    {
      id: 'breathing',
      title: 'Complete breathing exercise',
      subtitle: breathingCompleted ? 'Completed! Stay calm!' : 'Tap to mark as complete',
      icon: '🫁',
      bgColor: 'from-purple-500/20 to-purple-600/20',
      isCheckbox: true,
      completed: breathingCompleted,
      onClick: () => setBreathingCompleted(!breathingCompleted)
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-16">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">D</span>
          </div>
          <div>
            <p className="text-white text-lg">Hello,</p>
            <p className="text-white text-2xl font-bold">Hero</p>
          </div>
        </div>
        <div className="bg-yellow-500 px-3 py-1 rounded-full">
          <span className="font-bold text-slate-900">2</span>
        </div>
      </div>

      <div className="px-4 space-y-6">
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

        {/* Today Section */}
        <div>
          <h2 className="text-white text-2xl font-bold mb-4">Today</h2>
          <p className="text-gray-400 mb-6">Remaining time: {hours}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</p>
          
          <div className="space-y-4">
            {todayTasks.map((task, index) => (
              <div key={task.id} className="relative">
                <div className="absolute left-[-20px] top-6 w-4 h-4 bg-slate-600 rounded-full border-2 border-slate-400" />
                {index < todayTasks.length - 1 && (
                  <div className="absolute left-[-14px] top-10 w-1 h-16 bg-slate-600" />
                )}
                
                <button
                  onClick={task.onClick}
                  className={`w-full bg-gradient-to-r ${task.bgColor} bg-slate-800/50 rounded-xl p-4 text-left hover:scale-105 transition-all duration-300`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-xl">
                      {task.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-lg">{task.title}</h3>
                      <p className="text-gray-300 text-sm">{task.subtitle}</p>
                    </div>
                    {task.isCheckbox && (
                      <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                        task.completed ? 'bg-green-500 border-green-500' : 'border-gray-400'
                      }`}>
                        {task.completed && <span className="text-white text-sm">✓</span>}
                      </div>
                    )}
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* My Progress Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-2xl font-bold">My progress</h2>
            <button className="text-white">
              <span className="text-xl">↗️</span>
            </button>
          </div>

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
          </div>

          {/* Progress Cards */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-400">$</span>
                <span className="text-gray-300 text-sm">Money (£)</span>
              </div>
              <div className="text-white text-2xl font-bold">17</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-red-400">🚭</span>
                <span className="text-gray-300 text-sm">Cigarettes</span>
              </div>
              <div className="text-white text-2xl font-bold">40</div>
            </div>
          </div>
        </div>
      </div>

      <AffirmationModal 
        isOpen={showAffirmation} 
        onClose={() => setShowAffirmation(false)} 
      />
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
      addictionLevel: 5,
      willpower: 8,
      motivation: 9,
      moneySaved: Math.floor(Math.random() * 30) + 10,
      experiencePoints: Math.floor(Math.random() * 100) + 20
    },
    achievements: [],
    archetype: 'HEALTH_WARRIOR',
    avatar: generateAvatar('nemesis-emma', 'adventurer')
  };

  const handleOnboardingComplete = (userData) => {
    console.log('Onboarding completed with user data:', userData);
    
    setUser(userData);
    setHasCompletedOnboarding(true);
    setCurrentView('arena');
    
    // Save user data to local storage
    localStorage.setItem('quitCoachUser', JSON.stringify(userData));
    
    console.log('State updated:', {
      user: userData,
      hasCompletedOnboarding: true,
      currentView: 'arena'
    });
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
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      )}

      {/* Main App Content - Only show after onboarding */}
      {hasCompletedOnboarding && user ? (
        <>
          {currentView === 'arena' && (
            <ArenaView 
              user={user}
              nemesis={mockNemesis}
              onBackToLogin={handleBackToLogin}
            />
          )}
          
          {currentView === 'profile' && (
            <ProfileView 
              user={user}
              onNavigate={handleNavigate}
            />
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
            <button 
              onClick={() => {
                console.log('Debug button clicked');
                console.log('Current state:', { hasCompletedOnboarding, user, currentView });
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
