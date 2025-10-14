# Refactoring Guidelines - MANDATORY

## 🎯 Core Principle

**ALL future code changes MUST follow the refactored feature-based architecture.**

No exceptions. No shortcuts. No reverting to the old monolithic structure.

## 📁 Mandatory Directory Structure

```
src/
  features/              # ALL new features go here
    onboarding/         ✅ DONE - Follow this pattern
      components/       # Feature UI components
      hooks/            # Feature-specific hooks
      services/         # Feature business logic
      models/           # TypeScript types/interfaces
      index.ts          # Public API exports
      README.md         # Feature documentation
    
    behavior/           ✅ DONE - Follow this pattern
    tradingCard/        🚧 TO DO - Extract following pattern
    cravings/           🚧 TO DO - Extract following pattern
    progress/           🚧 TO DO - Extract following pattern
  
  lib/                  # Shared utilities ONLY
    api/                # API clients, auth
    storage/            # Storage adapters
    firebase/           # Firebase config
  
  components/           # Shared UI components ONLY
    ui/                 # Reusable UI primitives
  
  hooks/                # Shared hooks ONLY
  
  assets/               # Static assets
  
  App.jsx               # Main app - imports from features
  main.jsx              # Entry point
```

## ✅ Rules for Adding New Code

### 1. New Feature → New Feature Module

```typescript
// ❌ WRONG - Don't add to App.jsx
const NewFeature = () => { ... }

// ✅ CORRECT - Create new feature module
src/features/newFeature/
  components/NewFeature.tsx
  services/NewFeatureService.ts
  models/NewFeatureModels.ts
  index.ts
```

### 2. Import from Features, Not Services

```javascript
// ❌ WRONG - Old pattern
import { something } from './services/something';

// ✅ CORRECT - New pattern
import { something } from './features/featureName';
```

### 3. Shared Code Goes to lib/

```typescript
// ❌ WRONG - Creating new top-level folder
src/utils/someUtil.ts

// ✅ CORRECT - Use lib/ structure
src/lib/utils/someUtil.ts
```

### 4. Always Export via index.ts

```typescript
// ❌ WRONG - Direct imports
import { Component } from './features/onboarding/components/Component';

// ✅ CORRECT - Import from feature index
import { Component } from './features/onboarding';
```

### 5. Each Feature is Self-Contained

```typescript
// ❌ WRONG - Feature A importing from Feature B internals
import { helper } from '../featureB/services/helper';

// ✅ CORRECT - Feature A imports from Feature B's public API
import { helper } from '../featureB';

// ✅ BETTER - Move shared code to lib/
import { helper } from '@/lib/utils/helper';
```

## 📝 Naming Conventions - MANDATORY

### Components
- **PascalCase** with `.tsx` extension
- Example: `OnboardingFlow.tsx`, `TradingCard.tsx`

### Hooks
- **camelCase** with `use` prefix and `.ts` extension
- Example: `useOnboarding.ts`, `useStreak.ts`

### Services
- **PascalCase** with `Service` suffix and `.ts` extension
- Example: `AvatarService.ts`, `StreakService.ts`

### Models
- **PascalCase** with `Models` suffix and `.ts` extension
- Example: `OnboardingModels.ts`, `BehaviorModels.ts`

### Utilities
- **camelCase** with `.ts` extension
- Example: `localAdapter.ts`, `helpers.ts`

## 🚫 What NOT to Do

### ❌ Don't Add to App.jsx
```javascript
// ❌ WRONG - Adding 1000 lines to App.jsx
const BigNewFeature = () => {
  // Huge component
}
```

### ❌ Don't Create Random Folders
```
src/
  myNewFolder/     ❌ NO!
  stuff/           ❌ NO!
  temp/            ❌ NO!
```

### ❌ Don't Use Relative Paths for Features
```javascript
// ❌ WRONG
import { Thing } from '../../../features/thing';

// ✅ CORRECT - Use absolute imports (configure in vite.config.js)
import { Thing } from '@/features/thing';
```

### ❌ Don't Mix Old and New Patterns
```javascript
// ❌ WRONG - Old service in new location
src/features/myFeature/services/oldStyleService.js  // No TypeScript!

// ✅ CORRECT - New pattern
src/features/myFeature/services/MyFeatureService.ts
```

## ✅ Checklist for New Code

Before committing ANY new code, verify:

- [ ] Is this a new feature? → Goes in `src/features/newFeature/`
- [ ] Is this shared logic? → Goes in `src/lib/`
- [ ] Is this a shared UI component? → Goes in `src/components/ui/`
- [ ] Does it follow naming conventions? → PascalCase for components, camelCase for hooks
- [ ] Does it use TypeScript? → `.ts` or `.tsx` files
- [ ] Does it have an `index.ts` with exports? → Yes
- [ ] Does it have a `README.md`? → Yes (for features)
- [ ] Does it import correctly? → From feature public API, not internals
- [ ] Is App.jsx minimal? → Only routing and top-level state

## 📚 Documentation Requirements

### Every Feature Must Have

1. **README.md** with:
   - Purpose and overview
   - Components list
   - Services list
   - Usage examples
   - Data flow explanation

2. **index.ts** with:
   - Clean public API
   - Only exported items that other features need
   - No internal implementation details

3. **TypeScript interfaces** in models/

## 🏗️ When Extracting Existing Code

Follow this process (as done with Onboarding):

1. **Create feature directory structure**
   ```bash
   mkdir -p src/features/{featureName}/{components,hooks,services,models}
   ```

2. **Extract components** from App.jsx
   - Move to `components/`
   - Add TypeScript types
   - Create index.ts exports

3. **Extract services** from src/services/
   - Move to feature's `services/`
   - Convert to TypeScript if needed
   - Export via feature index.ts

4. **Create models/**
   - Define TypeScript interfaces
   - Export constants
   - Document data structures

5. **Update imports** in App.jsx
   - Change from old imports
   - Use new feature imports
   - Test that everything works

6. **Document** the feature
   - Create README.md
   - Update ARCHITECTURE.md
   - Add usage examples

## 🎯 Priority for Future Extraction

1. **Trading Card** - Extract from App.jsx (line ~1235)
2. **Cravings** - Extract from App.jsx (line ~3386)
3. **Progress** - Extract from App.jsx (line ~5484)

## 💡 When in Doubt

Ask these questions:

1. **Is it feature-specific?** → `src/features/{featureName}/`
2. **Is it shared across features?** → `src/lib/`
3. **Is it a reusable UI component?** → `src/components/ui/`
4. **Is it a custom hook?** → If feature-specific: `features/{name}/hooks/`, if shared: `src/hooks/`
5. **Should I add it to App.jsx?** → **NO!** (unless it's routing/top-level state)

## 🔒 Commitment

**I will follow this refactored architecture for ALL future changes.**

Any deviation from these guidelines must be:
1. Explicitly discussed
2. Documented with reasoning
3. Reviewed before merging

**The monolithic App.jsx pattern is DEAD. Long live the feature-based architecture!** 🎉

---

*Created: October 12, 2025*
*Status: MANDATORY for all future development*
*Review: Before EVERY code change*

