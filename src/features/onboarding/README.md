# Onboarding Feature

This module handles the complete user onboarding flow for QuitCoach, collecting essential information to personalize the user's quit journey.

## Overview

The onboarding feature guides new users through an 11-step process to:
- Create their hero identity
- Set their quit date
- Choose an archetype that reflects their motivation
- Create a custom avatar
- Identify triggers and daily patterns
- Assess their addiction level
- Calculate personalized initial stats

## Components

### OnboardingFlow (`components/OnboardingFlow.jsx`)
Main component that orchestrates the entire onboarding process. Displays different UI for each of the 11 steps and collects user input.

**Props:**
- `onComplete`: Callback function called when onboarding is complete
- `authUser`: Firebase authenticated user object
- `db`: Firebase database instance
- `pwaInstallAvailable`: Boolean indicating if PWA install prompt is available
- `promptInstall`: Function to trigger PWA install prompt

### OnboardingProgressBar (`components/OnboardingProgressBar.tsx`)
Visual progress indicator showing the current step out of 11 total steps.

### OnboardingNavigation (`components/OnboardingNavigation.tsx`)
Navigation buttons (Back/Next) with conditional styling based on step completion.

## Services

### AvatarService (`services/AvatarService.ts`)
Handles avatar generation using DiceBear API with fallback to local SVG generation.

**Functions:**
- `generateAvatar(seed, style)`: Generates avatar using DiceBear API
- `generateFallbackAvatar(seed)`: Creates a simple SVG avatar with initials
- `processPhotoToAnime(photoPreview)`: Converts uploaded photo to anime style
- `readFileAsDataURL(file)`: Reads file and converts to data URL

### StatsCalculationService (`services/StatsCalculationService.ts`)
Calculates initial user stats based on onboarding responses.

**Functions:**
- `calculateInitialStats(userData)`: Calculates addiction level, mental strength, motivation, and trigger defense
- `getConfidenceColor(confidence)`: Returns color code based on confidence level (1-10)

### OnboardingFirebaseService (`services/OnboardingFirebaseService.ts`)
Manages Firebase persistence for onboarding progress.

**Functions:**
- `saveOnboardingStep(db, userId, stepData, stepNumber)`: Saves step progress to Firebase
- `loadOnboardingProgress(db, userId)`: Loads saved onboarding progress

## Models

### OnboardingModels (`models/OnboardingModels.ts`)
Contains TypeScript interfaces and constants used throughout the onboarding flow.

**Constants:**
- `ARCHETYPE_OPTIONS`: Array of available character archetypes
- `TRIGGER_OPTIONS`: Common vaping triggers
- `DAILY_PATTERN_OPTIONS`: When users typically vape
- `COPING_STRATEGY_OPTIONS`: Strategies users have tried
- `VAPE_PODS_OPTIONS`: Pod consumption options
- `NICOTINE_STRENGTH_OPTIONS`: Available nicotine strengths
- `QUIT_ATTEMPTS_OPTIONS`: Previous quit attempt counts
- `INITIAL_ONBOARDING_DATA`: Default starting data

## Onboarding Steps

1. **Hero Name**: User enters their preferred username
2. **Quit Date**: Select when they started/will start their quit journey
3. **Archetype**: Choose character type (Determined, Social Fighter, Health Warrior, Money Saver)
4. **Avatar Creation**: Upload photo or generate random avatar
5. **Trigger Identification**: Select common vaping triggers
6. **Daily Routine**: Identify when they vape most
7. **Coping Experience**: Select strategies they've tried
8. **Vape Usage**: Number of pods per week
9. **Nicotine Strength**: Current nicotine level
10. **Previous Attempts**: How many times they've tried to quit
11. **Confidence Level**: Rate confidence 1-10

## Stats Calculation Algorithm

The initial stats are calculated based on user responses:

- **Addiction Level** (30-100): Based on pods/week, nicotine strength, and daily patterns
  - Displayed as "Addiction Freedom" (100 - addictionLevel) to users
- **Mental Strength** (10-80): Based on confidence, previous attempts, and coping strategies
- **Motivation** (20-90): Based on archetype, confidence, and quit history
- **Trigger Defense** (5-60): Based on number of triggers, complexity, and coping experience

## Usage Example

```jsx
import { OnboardingFlow } from '@/features/onboarding';
import { db, auth } from '@/lib/firebase';

function App() {
  const [authUser, setAuthUser] = useState(null);
  
  const handleOnboardingComplete = async (userData) => {
    // Save user data and navigate to main app
    console.log('Onboarding complete:', userData);
  };

  return (
    <OnboardingFlow
      onComplete={handleOnboardingComplete}
      authUser={authUser}
      db={db}
      pwaInstallAvailable={false}
      promptInstall={() => {}}
    />
  );
}
```

## Data Flow

1. User completes each step → Data stored in local state
2. On step completion → Auto-saves to Firebase (if authenticated)
3. On final step completion → Calculates stats → Calls `onComplete` callback
4. Parent component receives full user data with calculated stats

## Firebase Schema

```
users/
  {userId}/
    onboarding/
      progress/
        currentStep: number
        completedSteps: array
        lastUpdated: timestamp
      step1/
        heroName: string
        timestamp: number
      step2/
        quitDate: string
        timestamp: number
      ...
```

## Future Enhancements

- [ ] Resume onboarding from saved progress
- [ ] A/B testing different onboarding flows
- [ ] Analytics tracking for drop-off rates per step
- [ ] Localization support
- [ ] Accessibility improvements (ARIA labels, keyboard navigation)

