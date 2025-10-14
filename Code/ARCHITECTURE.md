# QuitCoach Architecture

This document describes the modular, feature-based architecture of QuitCoach.

## Overview

QuitCoach has been refactored from a monolithic 8500+ line `App.jsx` into a clean, feature-based architecture. Each feature is self-contained with its own components, services, hooks, and models.

## Architecture Principles

1. **Feature-Based Organization**: Code is organized by feature/domain, not by file type
2. **Separation of Concerns**: Clear boundaries between UI, business logic, and data
3. **Reusability**: Shared utilities in `lib/` folder
4. **Type Safety**: TypeScript for services and models
5. **Offline-First**: Local storage with Firebase sync
6. **Progressive Enhancement**: Works offline, syncs when online

## Directory Structure

```
src/
  features/           # Feature modules (self-contained)
    onboarding/       # ✅ Implemented
      components/     # UI components
      hooks/          # Feature-specific hooks
      services/       # Business logic
      models/         # TypeScript types and data models
      index.ts        # Public API exports
      README.md       # Feature documentation
    
    tradingCard/      # 🚧 Partial (in App.jsx)
      components/
      hooks/
      services/
      models/
    
    cravings/         # 🚧 To be extracted
      components/
      hooks/
      games/          # Interactive games
      habits/         # Habit tracking
      services/
    
    behavior/         # ✅ Implemented
      components/
      hooks/
      services/
      models/
    
    progress/         # 🚧 Partial (AnalyticsDashboard extracted)
      components/
      hooks/
      charts/
  
  lib/                # Shared utilities
    api/              # API clients and auth
      sessionManager.js
      authGuard.js
    
    storage/          # Data persistence
      localAdapter.ts      # ✅ Unified localStorage interface
      offlineManager.js    # Offline queue
    
    firebase/         # Firebase configuration
      firebase.js
  
  components/         # Shared UI components
    ui/               # Reusable UI primitives
    AuthScreen.jsx
    BreathingModal.jsx
    OfflineIndicator.jsx
    SyncStatusIndicator.jsx
    SessionStatusIndicator.jsx
    ErrorBoundary.jsx
    PerformanceDashboard.jsx
    BetaMonitoringDashboard.jsx
    AnalyticsDashboard.jsx
  
  hooks/              # Shared custom hooks
    useSwipeToDismiss.js
  
  assets/             # Static assets
    glass-empty.svg
    glass-filled.svg
  
  App.jsx             # Main application component
  main.jsx            # Entry point
  index.css           # Global styles
```

## Feature Modules

### ✅ Onboarding (`features/onboarding`)

**Purpose**: New user onboarding flow with 11 steps

**Components**:
- `OnboardingFlow`: Main 11-step wizard
- `OnboardingProgressBar`: Visual progress indicator
- `OnboardingNavigation`: Step navigation

**Services**:
- `AvatarService`: Avatar generation with DiceBear API
- `StatsCalculationService`: Initial stats calculation
- `OnboardingFirebaseService`: Progress persistence

**Key Features**:
- Hero name selection
- Quit date setup
- Archetype selection
- Avatar creation (upload or generate)
- Trigger/pattern identification
- Usage assessment
- Stats calculation based on responses

**Status**: ✅ **Fully Implemented and Integrated**

### ✅ Behavior (`features/behavior`)

**Purpose**: Track behavioral data (streaks, relapses, milestones)

**Services**:
- `StreakService`: Streak calculation and persistence
- `BehavioralService`: Comprehensive behavioral tracking

**Models**:
- `StreakData`: Streak representation
- `RelapseData`: Relapse events
- `BehavioralStats`: Behavioral statistics

**Key Features**:
- Hour/day streak calculation
- Relapse logging
- Longest streak tracking
- Offline fallback support

**Status**: ✅ **Fully Implemented**

### 🚧 Trading Card (`features/tradingCard`)

**Purpose**: Display user as collectible card with stats

**Components** (Currently in App.jsx):
- `TradingCard`: Main card display
- `StatBar`: Individual stat visualization
- `InfoModal`: Stat explanations

**Key Features**:
- Dynamic rarity system (Common → Legendary)
- Real-time stat updates
- Archetype-based theming
- Arena comparison mode

**Status**: 🚧 **Partial** (Need to extract from App.jsx)

### 🚧 Cravings (`features/cravings`)

**Purpose**: Help users resist cravings through games and habits

**Components** (Currently in App.jsx):
- `CravingAssessmentModal`: 11-point assessment
- `GameModal`: Interactive distraction games
- `HydrationModal`: Water intake tracking
- `BreathingModal`: Breathing exercises

**Games**:
- Reaction Game
- Memory Game
- Focus Game

**Key Features**:
- Craving intensity tracking
- Trigger identification
- Interactive distractions
- Habit building tools

**Status**: 🚧 **To be extracted**

### 🚧 Progress (`features/progress`)

**Purpose**: Visualize user progress and achievements

**Components**:
- `ProfileView` (in App.jsx): Main dashboard
- `AnalyticsDashboard` (extracted): Advanced analytics

**Key Features**:
- Streak visualization
- Achievement tracking
- Health metrics
- Financial savings
- Historical charts

**Status**: 🚧 **Partial** (AnalyticsDashboard extracted)

## Shared Libraries

### ✅ Storage (`lib/storage`)

**Purpose**: Unified data persistence layer

**Components**:
- `localAdapter.ts`: Type-safe localStorage wrapper
- `offlineManager.js`: Offline queue management

**Key Features**:
- Consistent API for storage operations
- Type safety with TypeScript
- Offline queue for Firebase sync
- Batch operations support

**Common Keys**:
```typescript
STORAGE_KEYS = {
  USER: 'quitCoachUser',
  RELAPSE_DATE: 'quitCoachRelapseDate',
  CRAVING_WINS: 'cravingWins',
  WATER_PREFIX: 'water_',
  // ... more
}
```

### ✅ Firebase (`lib/firebase`)

**Purpose**: Firebase configuration and initialization

**Exports**:
- `db`: Realtime Database
- `auth`: Authentication
- `firestore`: Firestore (if used)

### ✅ API (`lib/api`)

**Purpose**: API clients and authentication

**Components**:
- `sessionManager.js`: Session management
- `authGuard.js`: Route protection

## Data Flow

### Authentication Flow

```
1. User visits app
   ↓
2. AuthScreen shown (currentView = 'auth')
   ↓
3. User signs up/logs in
   ↓
4. onAuthStateChanged triggered
   ↓
5. Check if user has completed onboarding
   ↓
6a. If yes → Show main app (currentView = 'arena')
6b. If no → Show OnboardingFlow (currentView = 'onboarding')
```

### Onboarding Flow

```
1. OnboardingFlow component mounts
   ↓
2. User completes 11 steps
   ↓
3. Stats calculated from responses
   ↓
4. Data saved to Firebase
   ↓
5. onComplete callback with user data
   ↓
6. App saves to users/{uid}
   ↓
7. Navigate to main app (currentView = 'arena')
```

### Streak Calculation Flow

```
1. Get user's quit date
   ↓
2. Check Firebase for last relapse
   ↓
3. Use most recent date as start
   ↓
4. Calculate time difference
   ↓
5. Return hours (< 24h) or days (≥ 24h)
   ↓
6. Cache in localStorage for offline
```

### Craving Resistance Flow

```
1. User feels craving
   ↓
2. Opens Cravings tab
   ↓
3. Completes assessment
   ↓
4. Plays game or uses tool
   ↓
5. Logs outcome (resisted/relapsed)
   ↓
6. Stats updated in Firebase
   ↓
7. UI refreshes with new data
```

## State Management

### App-Level State (App.jsx)

```javascript
const [currentView, setCurrentView] = useState('auth');
const [user, setUser] = useState(null);
const [authUser, setAuthUser] = useState(null);
const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
const [activeTab, setActiveTab] = useState('arena');
```

### Feature-Level State

Each feature manages its own state through:
- Component state (`useState`)
- Custom hooks (`useOnboarding`, `useStreak`, etc.)
- Context (when needed for deep prop passing)

### Persistence Strategy

1. **Critical Data**: Firebase + localStorage
   - User profile
   - Behavioral stats
   - Onboarding progress

2. **Transient Data**: Component state only
   - UI state (modals, tabs)
   - Form inputs (before save)

3. **Cache Data**: localStorage only
   - Last sync time
   - Offline queue

## Firebase Schema

```
users/
  {userId}/
    # Profile
    heroName: string
    email: string
    quitDate: ISO string
    archetype: string
    avatar: string
    onboardingCompleted: boolean
    
    # Stats
    stats/
      addictionLevel: number
      mentalStrength: number
      motivation: number
      triggerDefense: number
      streakDays: number
      experiencePoints: number
    
    # Behavioral
    lastRelapseDate: ISO string
    longestStreak: number
    relapses/
      {timestamp}/
        date: ISO string
        trigger: string
        notes: string
    
    # Onboarding Progress
    onboarding/
      progress/
        currentStep: number
        completedSteps: array
      step1/, step2/, ...
    
    # Cravings
    cravings/
      {timestamp}/
        intensity: number
        triggers: array
        resisted: boolean
```

## Migration Status

### ✅ Completed

- [x] Feature-based directory structure
- [x] Onboarding feature extraction
- [x] Behavior feature extraction
- [x] Unified storage adapter
- [x] Firebase library organization
- [x] API utilities organization
- [x] Documentation (READMEs)
- [x] App.jsx integration

### 🚧 In Progress

- [ ] Trading card feature extraction
- [ ] Cravings feature extraction
- [ ] Progress feature extraction

### 📋 Planned

- [ ] Shared UI component library
- [ ] Custom hooks library
- [ ] Route-based code splitting
- [ ] Feature flags system
- [ ] A/B testing framework
- [ ] Analytics integration

## Development Guidelines

### Adding a New Feature

1. Create feature directory:
   ```
   src/features/{featureName}/
     components/
     hooks/
     services/
     models/
     index.ts
     README.md
   ```

2. Implement components and services

3. Export public API in `index.ts`:
   ```typescript
   export * from './components/MainComponent';
   export * from './services/FeatureService';
   export * from './models/FeatureModels';
   ```

4. Document in `README.md`:
   - Purpose
   - Components
   - Services
   - Usage examples
   - Data flow

5. Update `ARCHITECTURE.md` with new feature

### Naming Conventions

- **Components**: PascalCase (e.g., `OnboardingFlow.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useOnboarding.ts`)
- **Services**: PascalCase with `Service` suffix (e.g., `AvatarService.ts`)
- **Models**: PascalCase with `Models` suffix (e.g., `BehaviorModels.ts`)
- **Utilities**: camelCase (e.g., `localAdapter.ts`)

### File Organization

- **TypeScript**: `.ts` for logic, `.tsx` for React components
- **JavaScript**: `.js` for legacy code (gradual migration)
- **Index files**: Use `index.ts` to create clean public APIs
- **README files**: Add to every feature folder

### Import Paths

Use absolute imports with `@/` prefix:
```typescript
import { OnboardingFlow } from '@/features/onboarding';
import { localAdapter } from '@/lib/storage';
import { db } from '@/lib/firebase';
```

Configure in `vite.config.js`:
```javascript
resolve: {
  alias: {
    '@': '/src'
  }
}
```

## Testing Strategy

### Unit Tests
- Services and utilities
- Pure functions
- Data transformations

### Integration Tests
- Feature workflows
- Firebase interactions
- Offline/online transitions

### E2E Tests
- Complete user journeys
- Onboarding flow
- Craving resistance flow
- Relapse logging

## Performance Considerations

1. **Code Splitting**: Load features on demand
2. **Lazy Loading**: Import components asynchronously
3. **Memoization**: Cache expensive calculations
4. **Virtualization**: For long lists
5. **Image Optimization**: WebP, lazy loading
6. **Bundle Analysis**: Monitor and optimize

## Security Considerations

1. **Firebase Rules**: Strict user data access
2. **Input Validation**: All user inputs
3. **XSS Prevention**: Sanitize HTML
4. **Auth Guards**: Protect routes
5. **Secure Storage**: Sensitive data encryption

## Accessibility

1. **WCAG 2.1 AA**: Compliance target
2. **Keyboard Navigation**: Full support
3. **Screen Readers**: ARIA labels
4. **Color Contrast**: 4.5:1 minimum
5. **Focus Management**: Clear indicators

## Contributing

See individual feature READMEs for specific contribution guidelines. General process:

1. Create feature branch from `main`
2. Implement changes following architecture
3. Add/update tests
4. Update documentation
5. Submit pull request

## Questions?

For feature-specific questions, see the README in each feature folder:
- [Onboarding](./src/features/onboarding/README.md)
- [Behavior](./src/features/behavior/README.md)
- [Trading Card](./src/features/tradingCard/README.md) 
- [Cravings](./src/features/cravings/README.md)
- [Progress](./src/features/progress/README.md)

