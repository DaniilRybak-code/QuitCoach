import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Shield, Users, Heart, DollarSign, User, RefreshCw, ArrowRight 
} from 'lucide-react';
import { 
  ARCHETYPE_OPTIONS, 
  TRIGGER_OPTIONS, 
  DAILY_PATTERN_OPTIONS, 
  COPING_STRATEGY_OPTIONS,
  VAPE_PODS_OPTIONS,
  NICOTINE_STRENGTH_OPTIONS,
  QUIT_ATTEMPTS_OPTIONS,
  QUITTING_TYPES,
  INITIAL_ONBOARDING_DATA
} from '../models/OnboardingModels';
import { generateAvatar, generateFallbackAvatar } from '../services/AvatarService';
import { calculateInitialStats, getConfidenceColor } from '../services/StatsCalculationService';
import { saveOnboardingStep } from '../services/OnboardingFirebaseService';
import { OnboardingProgressBar } from './OnboardingProgressBar';
import { OnboardingNavigation } from './OnboardingNavigation';

/**
 * Calculate biological aging impact based on usage duration and intensity
 */
const calculateAgingImpact = (yearsOfUse, weeklySpend) => {
  // Science-based: Smoking/vaping accelerates aging
  // Heavy nicotine use = ~1.5x biological aging rate
  // Source: Studies on telomere shortening, cellular damage
  
  const usageIntensity = weeklySpend / 70; // Normalized (£70 = moderate)
  const agingMultiplier = 1 + (usageIntensity * 0.5); // 1.0-2.0x range
  
  const extraAgingYears = yearsOfUse * (agingMultiplier - 1);
  
  return {
    years: extraAgingYears.toFixed(1),
    description: getAgingDescription(extraAgingYears),
  };
};

const getAgingDescription = (years) => {
  if (years < 1) return "Your cells aged slightly faster";
  if (years < 3) return "Your body aged faster than it should have";
  if (years < 5) return "Significant accelerated aging occurred";
  if (years < 10) return "Your body aged nearly a decade faster";
  return "Extreme accelerated biological aging";
};

/**
 * Get health impact bullets based on years of use
 */
const getHealthBullets = (yearsOfUse) => {
  if (yearsOfUse < 1) {
    return [
      "Even short-term nicotine use begins to reduce lung capacity and slow your body's oxygen uptake.",
      "Early signs of tooth enamel erosion and gum irritation can appear within months of regular use."
    ];
  } else if (yearsOfUse < 3) {
    return [
      "You've likely already lost up to 5% of your lung efficiency — similar to someone a decade older.",
      "Nicotine has started to impact your cardiovascular system, increasing blood pressure and heart rate."
    ];
  } else if (yearsOfUse < 5) {
    return [
      "Your body's ability to recover from exercise drops, with a notable decline in cardiovascular endurance.",
      "Blood vessel damage begins to impact circulation, potentially causing cold hands and feet."
    ];
  } else if (yearsOfUse < 8) {
    return [
      "Chronic lung inflammation becomes established, often leading to persistent shortness of breath or coughing.",
      "Your immune system weakens, making you more susceptible to infections and slower to heal."
    ];
  } else {
    return [
      "The risk of developing COPD or chronic bronchitis skyrockets — permanent lung damage becomes increasingly likely.",
      "Your arteries have likely stiffened, raising your heart attack and stroke risk by over 200% compared to non-users."
    ];
  }
};

/**
 * Get financial impact bullets based on total spent
 */
const getFinancialBullets = (totalSpent) => {
  if (totalSpent < 1000) {
    return [
      "Enough for a new iPhone SE or AirPods Max — instead, it went up in smoke.",
      "Could've funded a weekend city break in Europe or 3 months of gym membership."
    ];
  } else if (totalSpent < 2000) {
    return [
      "Equal to a MacBook Air M2, a quality mountain bike, or half a year's rent in a shared flat outside London.",
      "Could've paid for an all-inclusive holiday for two in Spain or Greece."
    ];
  } else if (totalSpent < 5000) {
    return [
      "That's a brand-new MacBook Pro, one year of London rent contribution, or a round-the-world flight ticket.",
      "Could've fully funded a year of professional fitness coaching or a high-end gaming PC setup."
    ];
  } else if (totalSpent < 10000) {
    return [
      "Enough to buy a used car (e.g. Mini Cooper, VW Golf) or 6–10 months of central London rent.",
      "Equivalent to a luxury 2-week Maldives holiday or investment in a side-business."
    ];
  } else if (totalSpent < 15000) {
    return [
      "Could've covered a postgraduate course, a designer wardrobe overhaul, or a year of global travel.",
      "Equal to a small wedding, premium gym membership for 5 years, or a new electric scooter + laptop combo."
    ];
  } else if (totalSpent < 20000) {
    return [
      "Enough for a deposit on a flat in many UK cities or a new car outright.",
      "Could've funded a year-long sabbatical or seed money for your own startup."
    ];
  } else {
    return [
      "That's life-changing money — equivalent to a house deposit, MBA tuition, or two luxury round-the-world trips.",
      "You've literally smoked the value of a Tesla Model 3 or five years of rent outside London."
    ];
  }
};

/**
 * Main Onboarding Flow Component
 * Handles the 12-step onboarding process for new users
 */
export function OnboardingFlow({ onComplete, authUser, db, pwaInstallAvailable, promptInstall }) {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState(INITIAL_ONBOARDING_DATA);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Generate initial avatar on mount
  useEffect(() => {
    if (!userData.avatar) {
      try {
        const dicebearAvatar = generateAvatar(userData.avatarSeed);
        setUserData(prev => ({
          ...prev,
          avatar: dicebearAvatar
        }));
      } catch (error) {
        console.error('Failed to generate initial avatar:', error);
        const fallbackAvatar = generateFallbackAvatar(userData.avatarSeed);
        setUserData(prev => ({
          ...prev,
          avatar: fallbackAvatar
        }));
      }
    }
  }, []);

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
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = async () => {
        canvas.width = 200;
        canvas.height = 200;
        
        ctx.filter = 'contrast(1.2) saturate(1.3) brightness(1.1)';
        ctx.drawImage(img, 0, 0, 200, 200);
        
        ctx.globalCompositeOperation = 'overlay';
        ctx.fillStyle = 'rgba(255, 200, 200, 0.1)';
        ctx.fillRect(0, 0, 200, 200);
        
        const animeAvatar = canvas.toDataURL('image/png');
        const newData = { ...userData, avatar: animeAvatar };
        setUserData(newData);
        
        if (authUser) {
          await saveOnboardingStep(db, authUser.uid, newData, step);
        }
        setIsProcessingPhoto(false);
      };
      
      img.src = photoPreview;
    } catch (error) {
      console.error('Photo processing failed:', error);
      const fallbackAvatar = generateFallbackAvatar(userData.avatarSeed);
      setUserData(prev => ({ ...prev, avatar: fallbackAvatar }));
      setIsProcessingPhoto(false);
    }
  };

  const generateNewAvatar = () => {
    setIsGeneratingAvatar(true);
    const newSeed = Math.random().toString(36).substring(7);
    
    const tryDicebear = async () => {
      try {
        const avatar = generateAvatar(newSeed);
        const newData = {
          ...userData,
          avatarSeed: newSeed,
          avatar: avatar
        };
        setUserData(newData);
        
        if (authUser) {
          await saveOnboardingStep(db, authUser.uid, newData, step);
        }
      } catch (error) {
        const fallbackAvatar = generateFallbackAvatar(newSeed);
        const newData = {
          ...userData,
          avatarSeed: newSeed,
          avatar: fallbackAvatar
        };
        setUserData(newData);
        
        if (authUser) {
          await saveOnboardingStep(db, authUser.uid, newData, step);
        }
      }
    };
    
    tryDicebear();
    setTimeout(() => setIsGeneratingAvatar(false), 500);
  };

  const handleNext = async () => {
    if (step < 12) {
      if (authUser) {
        await saveOnboardingStep(db, authUser.uid, userData, step);
      }
      setStep(step + 1);
    } else {
      try {
        console.log('Completing onboarding with userData:', userData);
        const stats = calculateInitialStats(userData);
        console.log('Calculated stats:', stats);
        
        const finalUserData = {
          ...userData,
          stats: {
            ...stats,
            streakDays: 0,
            experiencePoints: 0
          },
          achievements: [],
          quitDate: new Date()
        };
        
        if (authUser) {
          await saveOnboardingStep(db, authUser.uid, finalUserData, 12);
        }
        
        console.log('Final user data:', finalUserData);
        onComplete(finalUserData);
      } catch (error) {
        console.error('Error completing onboarding:', error);
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
          quitDate: new Date()
        };
        
        if (authUser) {
          try {
            await saveOnboardingStep(db, authUser.uid, finalUserData, 12);
          } catch (firebaseError) {
            console.error('Failed to save fallback data to Firebase:', firebaseError);
          }
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
      case 2: return userData.quittingTypes.length > 0;
      case 3: return userData.startDate !== '' && userData.quitDate !== '' && userData.weeklySpend > 0;
      case 4: return true; // Impact reflection step - always can proceed
      case 5: return userData.triggers.length > 0;
      case 6: return userData.dailyPatterns.length > 0;
      case 7: return userData.copingStrategies.length > 0;
      case 8: return userData.vapePodsPerWeek > 0;
      case 9: return userData.nicotineStrength !== '';
      case 10: return userData.quitAttempts !== '';
      case 11: return userData.confidence > 0;
      default: return false;
    }
  };

  const updateField = async (field, value) => {
    const newData = { ...userData, [field]: value };
    setUserData(newData);
    
    if (authUser && canProceed()) {
      await saveOnboardingStep(db, authUser.uid, newData, step);
    }
  };

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

        <OnboardingProgressBar currentStep={step} />

        {/* Step 1: Hero Name */}
        {step === 1 && (
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome to QuitCard Arena</h1>
            <p className="text-gray-300 mb-2">You're about to start your freedom journey</p>
            <p className="text-gray-300 mb-6 font-medium">What should we call you?</p>
            
            <div className="mb-6">
              <input
                type="text"
                value={userData.heroName}
                onChange={(e) => updateField('heroName', e.target.value)}
                placeholder="Your name or nickname"
                autoComplete="name"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Step 2: What Are You Quitting? */}
        {step === 2 && (
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-6">What are you quitting?</h1>
            
            <div className="space-y-4 mb-6">
              {QUITTING_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => {
                    const newTypes = userData.quittingTypes.includes(type.id)
                      ? userData.quittingTypes.filter(t => t !== type.id)
                      : [...userData.quittingTypes, type.id];
                    updateField('quittingTypes', newTypes);
                  }}
                  className={`w-full p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
                    userData.quittingTypes.includes(type.id)
                      ? 'border-blue-500 bg-gradient-to-r from-blue-500/20 to-blue-600/20 shadow-lg shadow-blue-500/20'
                      : 'border-slate-600 bg-slate-700/50 hover:border-slate-500 hover:bg-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`text-5xl transition-transform duration-300 ${
                      userData.quittingTypes.includes(type.id) ? 'scale-110' : ''
                    }`}>
                      {type.emoji}
                    </div>
                    <span className={`font-bold text-2xl transition-colors duration-300 ${
                      userData.quittingTypes.includes(type.id) ? 'text-blue-300' : 'text-white'
                    }`}>
                      {type.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Usage History */}
        {step === 3 && (
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📊</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Your Usage History</h1>
            <p className="text-gray-300 text-sm mb-6">
              Let's understand your journey so we can show you what you've gained by quitting
            </p>
            
            {/* Divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-500 to-transparent mb-6"></div>
            
            {/* Question 1: Start Date */}
            <div className="mb-6 text-left">
              <label className="flex items-center gap-2 text-white font-semibold mb-3">
                <span className="text-lg">1️⃣</span>
                <span>When did you START using nicotine regularly?</span>
              </label>
              <div className="relative">
                <input
                  type="month"
                  value={userData.startDate}
                  max={new Date().toISOString().slice(0, 7)}
                  onChange={(e) => updateField('startDate', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/80 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Approximate date is fine"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-2xl pointer-events-none">📅</span>
              </div>
            </div>
            
            {/* Divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-500 to-transparent mb-6"></div>
            
            {/* Question 2: Quit Date */}
            <div className="mb-6 text-left">
              <label className="flex items-center gap-2 text-white font-semibold mb-3">
                <span className="text-lg">2️⃣</span>
                <span>When did you QUIT?</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={userData.quitDate}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={(e) => updateField('quitDate', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/80 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-2xl pointer-events-none">📅</span>
              </div>
            </div>
            
            {/* Divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-500 to-transparent mb-6"></div>
            
            {/* Question 3: Weekly Spend */}
            <div className="mb-6 text-left">
              <label className="flex items-center gap-2 text-white font-semibold mb-3">
                <span className="text-lg">3️⃣</span>
                <span>How much did you spend on nicotine per WEEK?</span>
                <span className="text-xl">💰</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-lg font-semibold z-10">£</span>
                <select
                  value={userData.weeklySpend || 0}
                  onChange={(e) => updateField('weeklySpend', parseInt(e.target.value))}
                  className="w-full pl-8 pr-10 py-3 bg-slate-700/80 border border-slate-600 rounded-lg text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                  style={{ 
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 0.5rem center",
                    backgroundSize: "1.5em 1.5em"
                  }}
                >
                  <option value="0">Select amount</option>
                  {Array.from({ length: 51 }, (_, i) => i * 10).map((amount) => (
                    <option key={amount} value={amount}>
                      {amount}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-3 p-3 bg-slate-700/40 rounded-lg">
                <p className="text-gray-300 text-xs font-medium mb-2">Common ranges:</p>
                <div className="space-y-1 text-xs text-gray-400">
                  <p>• Light user: £20-40/week</p>
                  <p>• Moderate: £40-70/week</p>
                  <p>• Heavy: £70-150/week</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Impact Reflection */}
        {step === 4 && (() => {
          const startDate = new Date(userData.startDate);
          const quitDate = new Date(userData.quitDate);
          const yearsOfUse = (quitDate - startDate) / (365 * 24 * 60 * 60 * 1000);
          const weeksOfUse = (quitDate - startDate) / (7 * 24 * 60 * 60 * 1000);
          const daysOfUse = Math.round((quitDate - startDate) / (24 * 60 * 60 * 1000));
          const totalSpent = Math.round(userData.weeklySpend * weeksOfUse);
          
          // Average UK smoker uses nicotine for ~16-18 years before quitting or death
          // Using 17 years (6,205 days) as average reference
          const avgSmokerDays = 6205;
          const percentOfAvgSmoker = Math.round((daysOfUse / avgSmokerDays) * 100);
          
          // Calculate biological aging impact
          const agingImpact = calculateAgingImpact(yearsOfUse, userData.weeklySpend);
          
          const healthBullets = getHealthBullets(yearsOfUse);
          const financialBullets = getFinancialBullets(totalSpent);
          
          return (
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">⚠️</span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">The Real Cost</h1>
              <p className="text-gray-300 text-sm mb-6">
                Here's what nicotine has really taken from you
              </p>
              
              {/* Health Impact */}
              <div className="mb-6 text-left">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🫁</span>
                  <h3 className="text-white font-bold text-lg">
                    {daysOfUse.toLocaleString()} Days of Use
                  </h3>
                </div>
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-gray-200 text-sm">
                    That's <span className="text-white font-bold text-lg">{percentOfAvgSmoker}%</span> of the average UK smoker's lifetime usage
                  </p>
                </div>
                
                {/* Biological Aging Impact */}
                <div className="mb-4 p-4 bg-gradient-to-r from-red-500/20 to-orange-500/20 border-2 border-red-500/40 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300 text-xs mb-1">Biological Aging Impact</p>
                      <p className="text-white font-bold text-2xl">+{agingImpact.years} Years</p>
                      <p className="text-red-300 text-sm mt-1 italic">{agingImpact.description}</p>
                    </div>
                    <span className="text-4xl">⏳</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {healthBullets.map((bullet, index) => (
                    <div key={index} className="flex gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <span className="text-red-400 mt-0.5">•</span>
                      <p className="text-gray-200 text-sm leading-relaxed">{bullet}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Divider */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-500 to-transparent my-6"></div>
              
              {/* Financial Impact */}
              <div className="mb-6 text-left">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">💸</span>
                  <h3 className="text-white font-bold text-lg">
                    You've Spent £{totalSpent.toLocaleString()}
                  </h3>
                </div>
                <div className="space-y-3">
                  {financialBullets.map((bullet, index) => (
                    <div key={index} className="flex gap-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                      <span className="text-amber-400 mt-0.5">•</span>
                      <p className="text-gray-200 text-sm leading-relaxed">{bullet}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Motivational Close */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg">
                <p className="text-white font-semibold text-center">
                  💪 But here's the good news: <span className="text-blue-300">Every day you quit is a day you're getting it all back.</span>
                </p>
              </div>
            </div>
          );
        })()}

        {/* Step 5: Trigger Identification */}
        {step === 5 && (
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🎯</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Trigger Identification</h1>
            <p className="text-gray-300 mb-6">What usually makes you want to vape? (Select all that apply)</p>
            
            <div className="space-y-3 mb-6">
              {TRIGGER_OPTIONS.map((trigger) => (
                <button
                  key={trigger}
                  onClick={() => {
                    const newTriggers = userData.triggers.includes(trigger)
                      ? userData.triggers.filter(t => t !== trigger)
                      : [...userData.triggers, trigger];
                    updateField('triggers', newTriggers);
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

        {/* Step 6: Daily Routine */}
        {step === 6 && (
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">📅</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Daily Routine</h1>
            <p className="text-gray-300 mb-6">When do you vape most? (Select all that apply)</p>
            
            <div className="space-y-3 mb-6">
              {DAILY_PATTERN_OPTIONS.map((pattern) => (
                <button
                  key={pattern}
                  onClick={() => {
                    const newPatterns = userData.dailyPatterns.includes(pattern)
                      ? userData.dailyPatterns.filter(p => p !== pattern)
                      : [...userData.dailyPatterns, pattern];
                    updateField('dailyPatterns', newPatterns);
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

        {/* Step 7: Coping Experience */}
        {step === 7 && (
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🛡️</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Coping Experience</h1>
            <p className="text-gray-300 mb-6">Have you tried any of these strategies before? (Select all that apply)</p>
            
            <div className="space-y-3 mb-6">
              {COPING_STRATEGY_OPTIONS.map((strategy) => (
                <button
                  key={strategy}
                  onClick={() => {
                    const newStrategies = userData.copingStrategies.includes(strategy)
                      ? userData.copingStrategies.filter(s => s !== strategy)
                      : [...userData.copingStrategies, strategy];
                    updateField('copingStrategies', newStrategies);
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

        {/* Step 8: Vape Usage */}
        {step === 8 && (
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🚬</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Vape Usage</h1>
            <p className="text-gray-300 mb-6">How many vape pods do you typically use per week?</p>
            
            <div className="mb-6">
              <select
                value={userData.vapePodsPerWeek}
                onChange={(e) => updateField('vapePodsPerWeek', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select pods per week</option>
                {VAPE_PODS_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Step 9: Nicotine Strength */}
        {step === 9 && (
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">⚡</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Nicotine Strength</h1>
            <p className="text-gray-300 mb-6">What nicotine strength do you typically use?</p>
            
            <div className="mb-6">
              <select
                value={userData.nicotineStrength}
                onChange={(e) => updateField('nicotineStrength', e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select nicotine strength</option>
                {NICOTINE_STRENGTH_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Step 10: Previous Attempts */}
        {step === 10 && (
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">📚</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Previous Attempts</h1>
            <p className="text-gray-300 mb-6">How many times have you tried to quit before?</p>
            
            <div className="mb-6">
              <select
                value={userData.quitAttempts}
                onChange={(e) => updateField('quitAttempts', e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select option</option>
                {QUIT_ATTEMPTS_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Step 11: Confidence Level */}
        {step === 11 && (
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
                  onChange={(e) => updateField('confidence', parseInt(e.target.value))}
                  className="flex-1 h-2 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, ${getConfidenceColor(userData.confidence)} 0%, ${getConfidenceColor(userData.confidence)} ${(userData.confidence / 10) * 100}%, #475569 ${(userData.confidence / 10) * 100}%, #475569 100%)`
                  }}
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

        <OnboardingNavigation 
          step={step}
          canProceed={canProceed()}
          onBack={handleBack}
          onNext={handleNext}
          isLastStep={step === 11}
        />
      </div>
    </div>
  );
}

export default OnboardingFlow;

