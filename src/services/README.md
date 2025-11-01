# Services Directory

The `src/services` folder contains cross-cutting infrastructure helpers that support multiple features in the QuitCoach application. Each service is gradually being migrated into feature-scoped modules (`src/features/*`) as we continue to enforce a clear, modular architecture.

## Active Services

- `centralizedStatService.js` – Calculates and persists user stats, streaks, milestones, and special features using Firebase as the single source of truth.
- `statManager.js` – Legacy behavioral analytics helper still referenced by arena flows; scheduled for extraction into `src/features/behavior`.
- `firestoreOptimizationService.js` & `optimizedFirestoreService.js` – Provide batched Firestore reads/writes, caching, and performance instrumentation.
- `performanceIntegrationService.js` & `performanceMonitor.js` – Collect runtime metrics and surface optimization recommendations.
- Resilience helpers (`errorLoggingService.js`, `gracefulDegradationService.js`, `rateLimitingService.js`) – Keep the experience stable during network or API degradation.
- Offline tooling (`offlineManager.js`, `offlineQueueManager.js`, `enhancedOfflineManager.js`) – Queue writes locally and replay them once connectivity returns.
- Data safety wrappers (`dataBackupService.js`, `privacyProtectionService.js`) – Guardrails for sensitive user information.

## Retired Modules

The legacy buddy-matching system (pairing two real users together) has been removed. All references to `buddyPairs`, `matchingPool`, or buddy-specific APIs have been cleaned up in favor of the new AI nemesis experience. Any remaining migration work should:

1. Move behavioral/stat helpers into their respective feature directories.
2. Delete unused legacy files once dependent code has been refactored.
3. Document new services inside the owning feature (e.g. `src/features/arena`).

## Guidelines for New Services

- Place shared, cross-feature utilities here; feature-specific logic belongs under `src/features/<featureName>/services`.
- Expose a minimal public surface area and document responsibilities in this README.
- Prefer TypeScript for new files and keep side effects isolated.
- When introducing a new service, add automated tests and update this document with its purpose.

