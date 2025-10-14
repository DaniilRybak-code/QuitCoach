/**
 * Onboarding Feature Module
 * Exports all onboarding-related components, services, and models
 */

// Main component
export { OnboardingFlow, default as default } from './components/OnboardingFlow';

// Additional components
export { OnboardingProgressBar } from './components/OnboardingProgressBar';
export { OnboardingNavigation } from './components/OnboardingNavigation';

// Services
export * from './services/AvatarService';
export * from './services/StatsCalculationService';
export * from './services/OnboardingFirebaseService';

// Models and constants
export * from './models/OnboardingModels';

// Hooks
export * from './hooks/useOnboarding';

