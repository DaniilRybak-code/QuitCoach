/**
 * Streak Service
 * Manages streak calculations and persistence
 */

import { Database, ref, get, set } from 'firebase/database';
import { calculateStreak, StreakData } from '../models/BehaviorModels';
import { localAdapter, STORAGE_KEYS } from '../../../lib/storage/localAdapter';

/**
 * Get current streak for a user
 */
export async function getCurrentStreak(
  db: Database,
  userId: string,
  quitDate: Date
): Promise<StreakData> {
  try {
    // First check Firebase for last relapse date
    const relapseRef = ref(db, `users/${userId}/lastRelapseDate`);
    const snapshot = await get(relapseRef);
    
    let startDate = quitDate;
    
    if (snapshot.exists()) {
      const lastRelapseDate = new Date(snapshot.val());
      // Use the more recent date between quit date and last relapse
      startDate = lastRelapseDate > quitDate ? lastRelapseDate : quitDate;
    }
    
    return calculateStreak(startDate);
  } catch (error) {
    console.error('Error getting current streak:', error);
    // Fallback to calculating from quit date
    return calculateStreak(quitDate);
  }
}

/**
 * Log a relapse and reset streak
 */
export async function logRelapse(
  db: Database,
  userId: string,
  relapseDate: Date = new Date(),
  trigger?: string,
  notes?: string
): Promise<void> {
  try {
    const relapseData = {
      date: relapseDate.toISOString(),
      timestamp: relapseDate.getTime(),
      trigger,
      notes,
      userId
    };
    
    // Save to Firebase
    await set(ref(db, `users/${userId}/lastRelapseDate`), relapseDate.toISOString());
    await set(ref(db, `users/${userId}/relapses/${relapseDate.getTime()}`), relapseData);
    
    // Also save to localStorage for offline access
    localAdapter.set(STORAGE_KEYS.RELAPSE_DATE, relapseDate.toISOString());
    localAdapter.set(STORAGE_KEYS.LAST_RELAPSE, relapseDate.toISOString());
    
    console.log('Relapse logged successfully');
  } catch (error) {
    console.error('Error logging relapse:', error);
    throw error;
  }
}

/**
 * Get streak from localStorage (offline fallback)
 */
export function getStreakFromLocalStorage(userId: string, quitDate: Date): StreakData {
  const lastRelapse = localAdapter.get<string>(STORAGE_KEYS.LAST_RELAPSE);
  
  let startDate = quitDate;
  
  if (lastRelapse) {
    const relapseDate = new Date(lastRelapse);
    startDate = relapseDate > quitDate ? relapseDate : quitDate;
  }
  
  return calculateStreak(startDate);
}

/**
 * Get longest streak for a user
 */
export async function getLongestStreak(
  db: Database,
  userId: string
): Promise<number> {
  try {
    const streakRef = ref(db, `users/${userId}/longestStreak`);
    const snapshot = await get(streakRef);
    
    return snapshot.exists() ? snapshot.val() : 0;
  } catch (error) {
    console.error('Error getting longest streak:', error);
    return 0;
  }
}

/**
 * Update longest streak if current streak is longer
 */
export async function updateLongestStreak(
  db: Database,
  userId: string,
  currentStreakDays: number
): Promise<void> {
  try {
    const longestStreak = await getLongestStreak(db, userId);
    
    if (currentStreakDays > longestStreak) {
      await set(ref(db, `users/${userId}/longestStreak`), currentStreakDays);
      console.log(`New longest streak: ${currentStreakDays} days`);
    }
  } catch (error) {
    console.error('Error updating longest streak:', error);
  }
}

