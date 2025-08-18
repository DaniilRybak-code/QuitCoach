# Buddy Matching Service

A standalone service for finding compatible quit buddies based on user profiles in the QuitCoach app.

## Overview

The Buddy Matching Service analyzes user profiles and calculates compatibility scores based on multiple factors including quit dates, addiction levels, timezones, triggers, and coping strategies. It provides intelligent matching to connect users who are most likely to support each other effectively.

## Files

- **`buddyMatching.js`** - Main matching logic and functions
- **`mockUsers.js`** - Test user data with realistic profiles
- **`buddyMatching.test.js`** - Test functions and examples

## Core Functions

### `calculateCompatibility(user1, user2)`
Calculates a compatibility score (0-100) between two users based on:
- **Primary Factors** (weighted heavily):
  - Quit start dates (±7 days range)
  - Addiction levels (±20 point difference)
  - Timezone compatibility (±3 hours)
  - Quit experience (first-timer vs veteran)
- **Secondary Factors** (bonus points):
  - Shared trigger types
  - Similar daily patterns
  - Compatible coping strategies

### `findBuddyMatch(currentUser, availableUserPool)`
Finds the best compatible buddy from available users:
- Filters out users who already have buddies
- Calculates compatibility scores for all candidates
- Returns the highest-scoring user above threshold (60+ points)
- Returns `null` if no suitable matches found

### `createBuddyPair(user1, user2)`
Creates a buddy relationship object with:
- User information (ID, name, avatar)
- Compatibility score
- Match date and status
- Activity tracking

### `addToWaitingPool(user)`
Adds users to a waiting list when no immediate matches are found:
- Stores user data for future matching attempts
- Updates existing entries if user already in pool
- Tracks when user was added and last attempt

## Scoring System

### Primary Factors (Maximum 115 points)
- **Quit Date**: Perfect match (same day) = 50 points
- **Quit Date**: Good match (±3 days) = 35 points  
- **Quit Date**: Acceptable match (±7 days) = 20 points
- **Addiction Level**: Similar levels = 0-30 points
- **Timezone**: Same timezone = 20 points, ±1-3 hours = partial points
- **Experience**: Compatible levels = 15 points

### Secondary Factors (Bonus points)
- **Shared Triggers**: +5 points per common trigger
- **Daily Patterns**: +10 points for similar patterns
- **Coping Strategies**: +8 points for similar strategies

### Minimum Threshold
- **60 points** required for a valid match
- Users below threshold go to waiting pool
- Higher scores get priority matching

## Usage Examples

### Basic Compatibility Check
```javascript
import { calculateCompatibility } from './services/buddyMatching.js';
import { getUserById } from './data/mockUsers.js';

const user1 = getUserById('user_001');
const user2 = getUserById('user_002');
const score = calculateCompatibility(user1, user2);
console.log(`Compatibility: ${score}/100`);
```

### Find Best Buddy Match
```javascript
import { findBuddyMatch } from './services/buddyMatching.js';

const currentUser = getUserById('user_001');
const availableUsers = mockUsers.filter(u => u.id !== currentUser.id);
const bestMatch = findBuddyMatch(currentUser, availableUsers);

if (bestMatch) {
  console.log(`Found buddy: ${bestMatch.heroName}`);
} else {
  console.log('No suitable match found');
}
```

### Create Buddy Relationship
```javascript
import { createBuddyPair, saveBuddyPair } from './services/buddyMatching.js';

const buddyPair = createBuddyPair(user1, user2);
saveBuddyPair(buddyPair);
```

### Handle No Matches
```javascript
import { addToWaitingPool } from './services/buddyMatching.js';

if (!bestMatch) {
  addToWaitingPool(currentUser);
  console.log('User added to waiting pool');
}
```

## Mock Data

The `mockUsers.js` file contains 20 realistic test users with:
- **Perfect Match Candidates**: Similar quit dates, addiction levels, timezones
- **Good Match Candidates**: Within 7 days, similar addiction levels
- **First Timer Group**: New to quitting (2-3 days)
- **Veteran Quitter Group**: Experienced with multiple strategies (12-18 days)
- **High Addiction Group**: Challenging cases (85-88 addiction level)
- **Low Addiction Group**: Easier cases (32-35 addiction level)
- **Specialized Groups**: Stress vapers, social vapers, habit vapers, driving vapers

## Testing

### Console Testing
Open the browser console and run:
```javascript
// Run all tests
testBuddyMatching.runAllTests();

// Test specific functionality
testBuddyMatching.testCompatibilityCalculation();
testBuddyMatching.testBuddyMatching();
testBuddyMatching.showScoringSystem();

// Access test data
testBuddyMatching.mockUsers;
testBuddyMatching.getUserById('user_001');
```

### Test Scenarios
The test file covers:
- ✅ Compatibility calculation between users
- ✅ Finding best buddy matches
- ✅ First-timer vs veteran matching
- ✅ Trigger-based compatibility
- ✅ Timezone compatibility
- ✅ Edge cases (invalid data, empty pools)
- ✅ Error handling

## Integration

The service is designed to work independently:
- **No React dependencies** - Pure JavaScript functions
- **LocalStorage persistence** - Stores buddy pairs and waiting pools
- **Error handling** - Graceful fallbacks for invalid data
- **Console logging** - Detailed debugging information
- **Modular design** - Easy to import and use

## Future Enhancements

Potential improvements:
- **Machine learning** - Learn from successful buddy relationships
- **Activity tracking** - Match based on chat frequency and engagement
- **Preference learning** - Adapt matching based on user feedback
- **Real-time updates** - WebSocket integration for live matching
- **Advanced filtering** - Age, language, specific quit methods

## Troubleshooting

### Common Issues
1. **No matches found**: Check if users meet minimum 60-point threshold
2. **Low compatibility scores**: Verify user data completeness
3. **Timezone issues**: Ensure timezone format is "UTC±X" (e.g., "UTC-5")
4. **Missing data**: Handle undefined values gracefully

### Debug Mode
Enable detailed logging by checking console output:
- Compatibility score breakdowns
- User filtering results
- Match selection process
- Error details

## Support

For issues or questions:
1. Check console logs for error details
2. Verify user data structure matches expected format
3. Test with mock data to isolate issues
4. Review scoring weights and thresholds
