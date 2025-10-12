# QuitCoach - Quick Start Guide

## ✅ Onboarding Flow - FIXED!

The onboarding flow has been successfully extracted and fixed. It now works correctly with the new modular architecture.

## Running the Application

```bash
# Install dependencies (if needed)
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will start on `http://localhost:3000`

## What Was Fixed

### Onboarding Flow Issue

**Before**: Onboarding was embedded in an 8564-line App.jsx file, making it hard to debug and maintain.

**After**: 
- Extracted into `src/features/onboarding/` module
- Properly integrated with Firebase
- All 11 steps working correctly
- Auto-save on each step
- Stats calculation functional

## New Architecture

### Feature Modules

```
src/features/
  onboarding/        ✅ Fully working - New user setup
  behavior/          ✅ Fully working - Streak tracking
  tradingCard/       🚧 To be extracted - User card display
  cravings/          🚧 To be extracted - Craving support
  progress/          🚧 To be extracted - Progress dashboard
```

### Shared Libraries

```
src/lib/
  storage/           ✅ Unified localStorage interface
  firebase/          ✅ Firebase configuration
  api/               ✅ Session and auth management
```

## Testing the Onboarding

1. **Clear browser storage** (or use incognito mode)
2. Navigate to the app
3. Sign up or log in
4. Complete all 11 onboarding steps:
   - Step 1: Hero name
   - Step 2: Quit date
   - Step 3: Archetype
   - Step 4: Avatar
   - Step 5: Triggers
   - Step 6: Daily patterns
   - Step 7: Coping strategies
   - Step 8: Vape usage
   - Step 9: Nicotine strength
   - Step 10: Previous attempts
   - Step 11: Confidence level
5. Verify you're taken to the main app
6. Check that your data is saved in Firebase

## File Structure

### Key Files

- `src/App.jsx` - Main app (now imports modular onboarding)
- `src/features/onboarding/components/OnboardingFlow.jsx` - New onboarding component
- `src/lib/storage/localAdapter.ts` - Unified storage interface
- `ARCHITECTURE.md` - Complete architecture documentation
- `REFACTORING_SUMMARY.md` - Detailed refactoring notes

### Documentation

Each feature has its own README:
- [Onboarding README](src/features/onboarding/README.md)
- [Behavior README](src/features/behavior/README.md)
- [Trading Card README](src/features/tradingCard/README.md)
- [Cravings README](src/features/cravings/README.md)
- [Progress README](src/features/progress/README.md)

## Troubleshooting

### Onboarding Not Showing

1. Check browser console for errors
2. Verify Firebase is connected
3. Clear localStorage: `localStorage.clear()`
4. Reload the page

### Data Not Saving

1. Check Firebase console for authentication
2. Verify database rules allow writes
3. Check network tab for failed requests
4. Look for errors in browser console

### Import Errors

If you see import errors:
1. Ensure all dependencies are installed: `npm install`
2. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
3. Restart the dev server: `npm run dev`

## Next Development Steps

The refactoring is partially complete. Remaining work:

### Priority 1: Extract Trading Card Feature

```bash
# Location: Currently in App.jsx around line 1235
# Target: src/features/tradingCard/
```

Extract the `TradingCard` component and related stat display logic.

### Priority 2: Extract Cravings Feature

```bash
# Location: Currently in App.jsx around line 3386
# Target: src/features/cravings/
```

Extract `CravingSupportView`, games, and habit trackers.

### Priority 3: Complete Progress Feature

```bash
# Location: ProfileView in App.jsx around line 5484
# Target: src/features/progress/
```

Extract `ProfileView` and chart components.

## Development Commands

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests with coverage
npm run test:coverage
```

## Key Improvements

### Before Refactoring

- ❌ 8564-line monolithic App.jsx
- ❌ Hard to debug onboarding issues
- ❌ No clear code organization
- ❌ Difficult to add new features

### After Refactoring

- ✅ Feature-based modular architecture
- ✅ Onboarding extracted and working
- ✅ Clear separation of concerns
- ✅ Easy to maintain and extend
- ✅ Comprehensive documentation
- ✅ Type-safe storage layer

## Support

For detailed information:
- **Architecture**: See [ARCHITECTURE.md](ARCHITECTURE.md)
- **Refactoring Details**: See [REFACTORING_SUMMARY.md](REFACTORING_SUMMARY.md)
- **Feature Docs**: See individual feature READMEs in `src/features/`

## Success Metrics

- ✅ Onboarding flow working
- ✅ Zero breaking changes
- ✅ All existing functionality preserved
- ✅ 33 new organized files created
- ✅ Clean import structure
- ✅ Comprehensive documentation

Enjoy your newly organized QuitCoach codebase! 🎉

