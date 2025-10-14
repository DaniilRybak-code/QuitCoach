# Behavior Feature

This module tracks user behavioral data including streaks, relapses, and quit journey milestones.

## Overview

The behavior feature is responsible for:
- Calculating and tracking clean time streaks
- Logging relapses and resetting streaks
- Maintaining longest streak records
- Providing behavioral analytics
- Syncing behavioral data between Firebase and local storage

## Services

### StreakService (`services/StreakService.ts`)
Manages streak calculations and persistence.

**Functions:**
- `getCurrentStreak(db, userId, quitDate)`: Gets the current clean streak
- `logRelapse(db, userId, relapseDate, trigger, notes)`: Logs a relapse event
- `getStreakFromLocalStorage(userId, quitDate)`: Offline fallback for streak
- `getLongestStreak(db, userId)`: Retrieves the user's longest streak
- `updateLongestStreak(db, userId, currentStreakDays)`: Updates longest streak if current is longer

### BehavioralService (`services/BehavioralService.js`)
Comprehensive behavioral tracking service integrated with Firestore.

**Features:**
- Tracks behavioral events (cravings, relapses, milestones)
- Manages behavioral stats across the app
- Provides behavioral analytics and insights

## Models

### BehaviorModels (`models/BehaviorModels.ts`)
TypeScript interfaces and utility functions for behavioral data.

**Interfaces:**
- `StreakData`: Represents a streak with value, unit, and display text
- `RelapseData`: Represents a relapse event
- `BehavioralStats`: Comprehensive behavioral statistics

**Functions:**
- `calculateStreak(startDate, endDate)`: Calculates streak from start date
- `daysBetween(startDate, endDate)`: Calculates days between dates
- `formatDate(date)`: Formats date for display
- `getRelativeTime(date)`: Gets relative time string (e.g., "2 days ago")

## Streak Logic

### Hour vs Day Display
- **First 24 hours**: Display streak in hours (e.g., "5 hours")
- **After 24 hours**: Display streak in days (e.g., "3 days")

This provides more granular feedback during the critical first day.

### Relapse Handling
When a relapse is logged:
1. Current streak is reset to 0
2. Last relapse date is stored in Firebase and localStorage
3. New streak starts counting from relapse date
4. Longest streak is preserved for motivation

### Start Date Calculation
The streak is calculated from the most recent of:
- User's quit date (set during onboarding)
- Last relapse date (if exists)

This ensures the streak always reflects clean time since last use.

## Usage Example

```typescript
import { getCurrentStreak, logRelapse } from '@/features/behavior';
import { db } from '@/lib/firebase';

// Get current streak
const streak = await getCurrentStreak(db, userId, quitDate);
console.log(streak.displayText); // "5 days"

// Log a relapse
await logRelapse(db, userId, new Date(), 'stress', 'Had a tough day at work');
```

## Data Flow

1. **Streak Calculation**:
   - Check Firebase for last relapse date
   - Calculate time difference from start date
   - Return streak data with appropriate unit

2. **Relapse Logging**:
   - Save to Firebase (`users/{userId}/lastRelapseDate`)
   - Save to Firebase relapse log (`users/{userId}/relapses/{timestamp}`)
   - Update localStorage for offline access
   - Trigger UI refresh

3. **Offline Support**:
   - Falls back to localStorage if Firebase unavailable
   - Syncs to Firebase when connection restored

## Firebase Schema

```
users/
  {userId}/
    lastRelapseDate: ISO string
    longestStreak: number (days)
    relapses/
      {timestamp}/
        date: ISO string
        timestamp: number
        trigger: string (optional)
        notes: string (optional)
        userId: string
```

## Future Enhancements

- [ ] Relapse pattern analysis
- [ ] Trigger correlation insights
- [ ] Milestone celebrations (7, 30, 90 days)
- [ ] Streak recovery suggestions
- [ ] Historical streak visualization
- [ ] Export behavioral data

