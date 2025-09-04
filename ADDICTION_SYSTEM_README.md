# Addiction Stat Decay and Relapse Penalties System

## Overview

This document describes the implementation of the addiction stat decay and relapse penalties system in QuitCoach. The system provides realistic addiction progression mechanics that reward clean time and penalize relapses with escalating consequences.

## Core Logic

### Weekly Addiction Decay
- **Clean Time Reward**: Addiction level decreases by **2 points per week** of clean time
- **Minimum Decay**: Only applies after 1 full week of clean time
- **Continuous Application**: Decay is calculated and applied during daily stat updates

### Relapse Penalty Escalation
The system uses a 3-tier escalation system based on relapse frequency:

1. **1st Relapse**: +4 addiction points
2. **2nd Relapse within 7 days**: +6 addiction points  
3. **3rd+ Relapse within 3 days**: +8 addiction points

### Escalation Reset
- **Reset Condition**: Escalation level resets to 1 after 7+ consecutive clean days
- **Automatic Reset**: Occurs during weekly decay calculations

## Database Schema

### New Fields Added
- `users/{userId}/profile/lastRelapseDate`: ISO string timestamp of last relapse
- `users/{userId}/profile/relapseEscalationLevel`: Current escalation level (1, 2, or 3)

### Existing Fields Used
- `users/{userId}/profile/relapseDate`: Legacy field (maintained for compatibility)
- `users/{userId}/quitDate`: User's original quit date

## Implementation Details

### StatManager Methods

#### `updateAddictionFromCleanTime()`
- Calculates weeks since last relapse or quit date
- Applies -2 points per week of clean time
- Resets escalation level after 7+ clean days
- Called during daily stat updates

#### `handleRelapse()`
- Determines escalation level based on time since last relapse
- Applies appropriate addiction penalty (+4, +6, or +8 points)
- Updates `lastRelapseDate` and `relapseEscalationLevel`
- Also applies -3 mental strength and -3 trigger defense penalties

#### `getAddictionStatus()`
- Returns comprehensive addiction status information
- Includes last relapse date, escalation level, days since relapse, clean weeks
- Used for UI display and status tracking

#### `resetRelapseEscalationLevel()`
- Manually resets escalation level to 1
- Called automatically after 7+ clean days

### Integration Points

#### Daily Updates
The addiction decay is automatically applied during daily stat updates via `runDailyUpdates()`.

#### Relapse Handling
When a user reports a relapse through the UI, `handleRelapse()` is called to apply penalties and update tracking.

#### Status Display
The `getAddictionStatus()` method provides data for UI components showing:
- Current escalation level
- Days since last relapse
- Clean time progress

## Testing

### Test Coverage
Comprehensive unit tests cover:
- ✅ Weekly decay calculation (2 points per week)
- ✅ First relapse penalty (+4 points)
- ✅ Second relapse within 7 days (+6 points)
- ✅ Third+ relapse within 3 days (+8 points)
- ✅ Escalation reset after 7 clean days
- ✅ Database field updates
- ✅ Status tracking accuracy

### Test File
- `tests/statManager/addiction-simple.test.js`: 8 passing tests covering all core functionality

## Usage Examples

### Weekly Decay
```javascript
// User has been clean for 3 weeks
// Addiction level: 50 → 44 (50 - 6 points)
await statManager.updateAddictionFromCleanTime();
```

### Relapse Escalation
```javascript
// First relapse
await statManager.handleRelapse(); // +4 addiction points

// Second relapse 3 days later
await statManager.handleRelapse(); // +6 addiction points

// Third relapse 2 days later  
await statManager.handleRelapse(); // +8 addiction points
```

### Status Tracking
```javascript
const status = await statManager.getAddictionStatus();
console.log(status);
// {
//   lastRelapseDate: Date,
//   escalationLevel: 2,
//   daysSinceLastRelapse: 3,
//   cleanWeeks: 0,
//   isCleanFor7Days: false
// }
```

## Benefits

1. **Realistic Progression**: Mirrors real addiction recovery patterns
2. **Motivational Design**: Rewards clean time with stat improvements
3. **Escalating Consequences**: Discourages rapid relapses
4. **Recovery Opportunity**: Resets escalation after sustained clean time
5. **Comprehensive Tracking**: Detailed status information for users

## Future Enhancements

- **Customizable Decay Rates**: Allow different decay rates per user type
- **Milestone Bonuses**: Additional rewards for extended clean periods
- **Relapse Prevention**: Early warning system for high-risk periods
- **Analytics Integration**: Track relapse patterns and recovery trends
