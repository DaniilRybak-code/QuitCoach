/**
 * Local Storage Adapter
 * Unified interface for localStorage operations with type safety and error handling
 */

export interface StorageAdapter {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
  clear(): void;
  has(key: string): boolean;
}

class LocalStorageAdapter implements StorageAdapter {
  /**
   * Get item from localStorage with type safety
   */
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return null;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error reading from localStorage (key: ${key}):`, error);
      return null;
    }
  }

  /**
   * Set item in localStorage
   */
  set<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`Error writing to localStorage (key: ${key}):`, error);
    }
  }

  /**
   * Remove item from localStorage
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage (key: ${key}):`, error);
    }
  }

  /**
   * Clear all items from localStorage
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  /**
   * Check if key exists in localStorage
   */
  has(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  /**
   * Get all keys with a specific prefix
   */
  getKeys(prefix: string = ''): string[] {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        keys.push(key);
      }
    }
    return keys;
  }

  /**
   * Get multiple items at once
   */
  getMultiple<T>(keys: string[]): Record<string, T | null> {
    const result: Record<string, T | null> = {};
    keys.forEach(key => {
      result[key] = this.get<T>(key);
    });
    return result;
  }

  /**
   * Set multiple items at once
   */
  setMultiple<T>(items: Record<string, T>): void {
    Object.entries(items).forEach(([key, value]) => {
      this.set(key, value);
    });
  }

  /**
   * Remove multiple items at once
   */
  removeMultiple(keys: string[]): void {
    keys.forEach(key => this.remove(key));
  }
}

// Create and export singleton instance
export const localAdapter = new LocalStorageAdapter();

// Export default
export default localAdapter;

/**
 * Common storage keys used throughout the app
 */
export const STORAGE_KEYS = {
  // User data
  USER: 'quitCoachUser',
  USER_PROFILE: 'quitCoachUserProfile',
  
  // Authentication
  AUTH_TOKEN: 'quitCoachAuthToken',
  SESSION_ID: 'quitCoachSessionId',
  
  // Behavioral data
  RELAPSE_DATE: 'quitCoachRelapseDate',
  LAST_RELAPSE: 'lastRelapseDate',
  QUIT_DATE: 'quitCoachQuitDate',
  
  // Stats and progress
  CRAVING_WINS: 'cravingWins',
  DAILY_STATS: 'dailyStats',
  STREAK_DATA: 'streakData',
  
  // Craving logs
  CRAVING_LOGS: 'cravingLogs',
  DAILY_CRAVING_COUNT: 'dailyCravingCount',
  
  // Hydration
  WATER_PREFIX: 'water_',
  
  // App state
  LAST_SYNC: 'lastSyncTime',
  OFFLINE_QUEUE: 'offlineQueue',
  APP_VERSION: 'appVersion',
  
  // Preferences
  THEME: 'theme',
  NOTIFICATIONS_ENABLED: 'notificationsEnabled',
};

/**
 * Helper functions for common operations
 */

/**
 * Get water intake for a specific user and date
 */
export function getWaterIntake(userId: string, date: Date = new Date()): number {
  const dateStr = date.toDateString();
  const key = `${STORAGE_KEYS.WATER_PREFIX}${userId}_${dateStr}`;
  return localAdapter.get<number>(key) || 0;
}

/**
 * Set water intake for a specific user and date
 */
export function setWaterIntake(userId: string, amount: number, date: Date = new Date()): void {
  const dateStr = date.toDateString();
  const key = `${STORAGE_KEYS.WATER_PREFIX}${userId}_${dateStr}`;
  localAdapter.set(key, amount);
}

/**
 * Get user profile data
 */
export function getUserProfile(): any | null {
  return localAdapter.get(STORAGE_KEYS.USER);
}

/**
 * Set user profile data
 */
export function setUserProfile(userData: any): void {
  localAdapter.set(STORAGE_KEYS.USER, userData);
}

/**
 * Clear all user data from storage
 */
export function clearUserData(): void {
  const userKeys = localAdapter.getKeys('quitCoach');
  localAdapter.removeMultiple(userKeys);
}

/**
 * Get craving wins count
 */
export function getCravingWins(): number {
  return localAdapter.get<number>(STORAGE_KEYS.CRAVING_WINS) || 0;
}

/**
 * Increment craving wins
 */
export function incrementCravingWins(): number {
  const current = getCravingWins();
  const newCount = current + 1;
  localAdapter.set(STORAGE_KEYS.CRAVING_WINS, newCount);
  return newCount;
}

/**
 * Get relapse date
 */
export function getRelapseDate(): Date | null {
  const dateStr = localAdapter.get<string>(STORAGE_KEYS.RELAPSE_DATE);
  return dateStr ? new Date(dateStr) : null;
}

/**
 * Set relapse date
 */
export function setRelapseDate(date: Date): void {
  localAdapter.set(STORAGE_KEYS.RELAPSE_DATE, date.toISOString());
  localAdapter.set(STORAGE_KEYS.LAST_RELAPSE, date.toISOString());
}

