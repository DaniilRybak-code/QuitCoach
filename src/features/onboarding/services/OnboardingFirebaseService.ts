/**
 * Onboarding Firebase Service
 * Handles saving onboarding progress to Firebase
 */

import { Database, ref, set } from 'firebase/database';

export interface OnboardingStepData {
  [key: string]: any;
  stepNumber?: number;
  timestamp?: number;
}

/**
 * Save onboarding step data to Firebase
 */
export async function saveOnboardingStep(
  db: Database,
  userId: string,
  stepData: OnboardingStepData,
  stepNumber: number
): Promise<void> {
  if (!userId) {
    console.warn('No userId provided, skipping Firebase save');
    return;
  }
  
  try {
    // Save the current step data
    await set(ref(db, `users/${userId}/onboarding/step${stepNumber}`), {
      ...stepData,
      stepNumber,
      timestamp: Date.now()
    });
    
    // Also save to a general onboarding progress
    await set(ref(db, `users/${userId}/onboarding/progress`), {
      currentStep: stepNumber,
      completedSteps: Array.from({ length: stepNumber }, (_, i) => i + 1),
      lastUpdated: Date.now()
    });
    
    console.log(`Step ${stepNumber} saved to Firebase successfully`);
  } catch (error) {
    console.error(`Error saving step ${stepNumber} to Firebase:`, error);
    // Continue with onboarding even if Firebase save fails
  }
}

/**
 * Load onboarding progress from Firebase
 */
export async function loadOnboardingProgress(
  db: Database,
  userId: string
): Promise<{ currentStep: number; data: any } | null> {
  if (!userId) return null;
  
  try {
    const { ref, get } = await import('firebase/database');
    const progressRef = ref(db, `users/${userId}/onboarding/progress`);
    const snapshot = await get(progressRef);
    
    if (snapshot.exists()) {
      const progressData = snapshot.val();
      const stepDataRef = ref(db, `users/${userId}/onboarding/step${progressData.currentStep}`);
      const stepSnapshot = await get(stepDataRef);
      
      return {
        currentStep: progressData.currentStep,
        data: stepSnapshot.exists() ? stepSnapshot.val() : null
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error loading onboarding progress:', error);
    return null;
  }
}

