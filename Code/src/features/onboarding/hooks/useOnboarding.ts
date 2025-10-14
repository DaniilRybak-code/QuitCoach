/**
 * Onboarding Hook
 * Manages onboarding state and logic
 */

import { useState, useEffect } from 'react';
import { Database } from 'firebase/database';
import { OnboardingUserData, INITIAL_ONBOARDING_DATA } from '../models/OnboardingModels';
import { saveOnboardingStep } from '../services/OnboardingFirebaseService';
import { calculateInitialStats } from '../services/StatsCalculationService';
import { generateAvatar, generateFallbackAvatar, processPhotoToAnime, readFileAsDataURL } from '../services/AvatarService';

export interface UseOnboardingProps {
  db: Database;
  userId: string | null;
  onComplete: (userData: any) => void;
}

export function useOnboarding({ db, userId, onComplete }: UseOnboardingProps) {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<OnboardingUserData>(INITIAL_ONBOARDING_DATA);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Generate initial avatar on mount
  useEffect(() => {
    if (!userData.avatar) {
      const dicebearAvatar = generateAvatar(userData.avatarSeed);
      setUserData(prev => ({
        ...prev,
        avatar: dicebearAvatar
      }));
    }
  }, []);

  const handlePhotoCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const dataURL = await readFileAsDataURL(file);
      setPhotoPreview(dataURL);
    }
  };

  const handleProcessPhotoToAnime = async () => {
    if (!photoFile || !photoPreview) return;
    
    setIsProcessingPhoto(true);
    
    try {
      const animeAvatar = await processPhotoToAnime(photoPreview);
      const newData = { ...userData, avatar: animeAvatar };
      setUserData(newData);
      
      if (userId) {
        await saveOnboardingStep(db, userId, newData, step);
      }
    } catch (error) {
      console.error('Photo processing failed:', error);
      // Fallback to generated avatar
      const fallbackAvatar = generateFallbackAvatar(userData.avatarSeed);
      setUserData(prev => ({ ...prev, avatar: fallbackAvatar }));
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  const handleGenerateNewAvatar = () => {
    setIsGeneratingAvatar(true);
    const newSeed = Math.random().toString(36).substring(7);
    
    const tryGenerate = async () => {
      try {
        const avatar = generateAvatar(newSeed);
        const newData = {
          ...userData,
          avatarSeed: newSeed,
          avatar: avatar
        };
        setUserData(newData);
        
        if (userId) {
          await saveOnboardingStep(db, userId, newData, step);
        }
      } catch (error) {
        // Fallback to local generation
        const fallbackAvatar = generateFallbackAvatar(newSeed);
        const newData = {
          ...userData,
          avatarSeed: newSeed,
          avatar: fallbackAvatar
        };
        setUserData(newData);
        
        if (userId) {
          await saveOnboardingStep(db, userId, newData, step);
        }
      }
    };
    
    tryGenerate();
    setTimeout(() => setIsGeneratingAvatar(false), 500);
  };

  const handleNext = async () => {
    if (step < 11) {
      // Save current step data to Firebase before moving to next step
      if (userId) {
        await saveOnboardingStep(db, userId, userData, step);
      }
      setStep(step + 1);
    } else {
      // Complete onboarding with calculated stats
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
        
        // Save final step data to Firebase
        if (userId) {
          await saveOnboardingStep(db, userId, finalUserData, 10);
        }
        
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
          quitDate: new Date()
        };
        
        // Try to save fallback data to Firebase
        if (userId) {
          try {
            await saveOnboardingStep(db, userId, finalUserData, 10);
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

  const canProceed = (): boolean => {
    switch (step) {
      case 1: return userData.heroName.trim().length > 0;
      case 2: return userData.quitDate !== '';
      case 3: return userData.archetype !== '';
      case 4: return userData.avatar !== null;
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

  const updateUserData = async (updates: Partial<OnboardingUserData>) => {
    const newData = { ...userData, ...updates };
    setUserData(newData);
    
    // Auto-save to Firebase
    if (userId && canProceed()) {
      await saveOnboardingStep(db, userId, newData, step);
    }
  };

  return {
    step,
    userData,
    isGeneratingAvatar,
    isProcessingPhoto,
    photoFile,
    photoPreview,
    handlePhotoCapture,
    handleProcessPhotoToAnime,
    handleGenerateNewAvatar,
    handleNext,
    handleBack,
    canProceed,
    updateUserData,
    setUserData
  };
}

