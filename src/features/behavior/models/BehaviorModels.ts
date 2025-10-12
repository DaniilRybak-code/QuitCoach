/**
 * Behavior Models
 * Types and interfaces for behavioral tracking (streaks, relapses, etc.)
 */

export interface StreakData {
  value: number;
  unit: 'hours' | 'days';
  displayText: string;
}

export interface RelapseData {
  date: Date;
  timestamp: number;
  trigger?: string;
  notes?: string;
  userId: string;
}

export interface BehavioralStats {
  streakDays: number;
  streakUnit: string;
  streakDisplayText: string;
  lastRelapseDate: string | null;
  totalRelapses: number;
  longestStreak: number;
  cleanDays: number;
}

/**
 * Calculate streak with hours/days logic
 */
export function calculateStreak(startDate: Date, endDate: Date = new Date()): StreakData {
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
}

/**
 * Calculate days between two dates
 */
export function daysBetween(startDate: Date, endDate: Date = new Date()): number {
  const timeDiff = endDate.getTime() - startDate.getTime();
  return Math.floor(timeDiff / (1000 * 3600 * 24));
}

/**
 * Format a date for display
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Get relative time string (e.g., "2 days ago")
 */
export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days === 1 ? '' : 's'} ago`;
  if (hours > 0) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  if (minutes > 0) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  return 'just now';
}

