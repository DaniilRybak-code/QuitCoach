/**
 * Onboarding Models and Constants
 */

import { Shield, Users, Heart, DollarSign, LucideIcon } from 'lucide-react';

export interface ArchetypeOption {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: LucideIcon;
}

export const ARCHETYPE_OPTIONS: ArchetypeOption[] = [
  { id: 'DETERMINED', name: 'The Determined', description: 'Unstoppable willpower and determination', color: 'bg-red-500', icon: Shield },
  { id: 'SOCIAL_FIGHTER', name: 'The Social Fighter', description: 'Thrives on community support', color: 'bg-blue-500', icon: Users },
  { id: 'HEALTH_WARRIOR', name: 'The Health Warrior', description: 'Focused on physical and mental wellness', color: 'bg-green-500', icon: Heart },
  { id: 'MONEY_SAVER', name: 'The Money Saver', description: 'Motivated by financial freedom', color: 'bg-yellow-500', icon: DollarSign }
];

export const TRIGGER_OPTIONS = [
  'Stress/anxiety',
  'Social situations',
  'Boredom',
  'After meals',
  'Drinking alcohol',
  'Work breaks',
  'Driving'
];

export const DAILY_PATTERN_OPTIONS = [
  'Morning routine',
  'Work breaks',
  'After meals',
  'Evening wind-down',
  'Social events',
  'Throughout the day'
];

export const COPING_STRATEGY_OPTIONS = [
  'Breathing exercises',
  'Nicotine replacement therapy',
  'Exercise/physical activity',
  'Distraction techniques',
  'Nothing - this is new to me'
];

export const VAPE_PODS_OPTIONS = [
  { value: 0.5, label: '0.5 pods' },
  { value: 1, label: '1 pod' },
  { value: 2, label: '2 pods' },
  { value: 3, label: '3 pods' },
  { value: 4, label: '4 pods' },
  { value: 5, label: '5 pods' },
  { value: 6, label: '6 pods' },
  { value: 7, label: '7 pods' },
  { value: 8, label: '8+ pods' }
];

export const TOTAL_ONBOARDING_STEPS = 12;

export const NICOTINE_STRENGTH_OPTIONS = [
  '3mg',
  '6mg',
  '12mg',
  '18mg',
  '20mg',
  '50mg'
];

export const QUIT_ATTEMPTS_OPTIONS = [
  { value: 'first', label: 'This is my first attempt' },
  { value: '1', label: 'Once before' },
  { value: '2', label: 'Twice before' },
  { value: '3', label: '3-5 times' },
  { value: '5', label: 'More than 5 times' }
];

export const QUITTING_TYPES = [
  { id: 'vaping', label: 'Vaping', emoji: '💨' },
  { id: 'smoking', label: 'Smoking', emoji: '🚬' }
];

export interface OnboardingUserData {
  heroName: string;
  quittingTypes: string[]; // 'vaping', 'smoking', or both
  quitDate: string;
  archetype: string;
  avatar: string | null;
  avatarSeed: string;
  triggers: string[];
  dailyPatterns: string[];
  copingStrategies: string[];
  vapePodsPerWeek: number;
  nicotineStrength: string;
  quitAttempts: string;
  confidence: number;
}

export const INITIAL_ONBOARDING_DATA: OnboardingUserData = {
  heroName: '',
  quittingTypes: [],
  quitDate: new Date().toISOString().split('T')[0],
  archetype: '',
  avatar: null,
  avatarSeed: Math.random().toString(36).substring(7),
  triggers: [],
  dailyPatterns: [],
  copingStrategies: [],
  vapePodsPerWeek: 0,
  nicotineStrength: '',
  quitAttempts: '',
  confidence: 5
};

