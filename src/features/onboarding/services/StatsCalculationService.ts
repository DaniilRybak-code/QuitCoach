/**
 * Stats Calculation Service
 * Calculates initial user stats based on onboarding responses
 */

export interface OnboardingData {
  heroName: string;
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

export interface CalculatedStats {
  addictionLevel: number;
  mentalStrength: number;
  motivation: number;
  triggerDefense: number;
}

/**
 * Calculate initial stats based on user's onboarding responses
 */
export function calculateInitialStats(userData: OnboardingData): CalculatedStats {
  console.log('Calculating stats with userData:', userData);
  
  // ADDICTION LEVEL (Scale 30-100) - Higher = more addicted
  // Note: This is displayed as "Addiction Freedom" = (100 - addictionLevel) so users see progress
  let addictionScore = 40; // Base

  // Pods per week
  if (userData.vapePodsPerWeek <= 1) addictionScore += 5;
  else if (userData.vapePodsPerWeek <= 3) addictionScore += 15;
  else if (userData.vapePodsPerWeek <= 5) addictionScore += 25;
  else if (userData.vapePodsPerWeek <= 7) addictionScore += 35;
  else addictionScore += 40;

  // Nicotine strength - extract number from "3mg" format
  const nicotineStr = userData.nicotineStrength || '';
  const nicotine = parseInt(nicotineStr.replace('mg', '')) || 0;
  if (nicotine <= 5) addictionScore += 0;
  else if (nicotine <= 11) addictionScore += 10;
  else if (nicotine <= 20) addictionScore += 20;
  else addictionScore += 25;

  // Daily pattern
  if (userData.dailyPatterns.includes("Throughout the day")) addictionScore += 20;
  else if (userData.dailyPatterns.length > 2) addictionScore += 10;
  else addictionScore += 0;

  addictionScore = Math.min(addictionScore, 100);

  // MENTAL STRENGTH (Scale 10-80)
  let mentalScore = 25; // Base

  // Confidence level
  if (userData.confidence >= 9) mentalScore += 35;
  else if (userData.confidence >= 7) mentalScore += 25;
  else if (userData.confidence >= 4) mentalScore += 15;
  else mentalScore += 0;

  // Previous attempts
  if (userData.quitAttempts === "first") mentalScore += 15;
  else if (parseInt(userData.quitAttempts) <= 3) mentalScore += 10;
  else mentalScore += 5;

  // Coping strategies
  if (userData.copingStrategies.length >= 3) mentalScore += 15;
  else if (userData.copingStrategies.length >= 1) mentalScore += 10;
  else mentalScore += 0;

  mentalScore = Math.min(mentalScore, 80);

  // MOTIVATION (Scale 20-90)
  let motivationScore = 35; // Base

  // Archetype bonus
  const archetypeBonus: Record<string, number> = {
    "DETERMINED": 20,
    "HEALTH_WARRIOR": 15,
    "SOCIAL_FIGHTER": 15,
    "MONEY_SAVER": 10
  };
  motivationScore += archetypeBonus[userData.archetype] || 0;

  // Confidence level
  if (userData.confidence >= 8) motivationScore += 25;
  else if (userData.confidence >= 5) motivationScore += 15;
  else motivationScore += 0;

  // Previous attempts pattern
  if (userData.quitAttempts === "first") motivationScore += 10;
  else if (parseInt(userData.quitAttempts) <= 3) motivationScore += 5;
  else motivationScore += 15;

  motivationScore = Math.min(motivationScore, 90);

  // TRIGGER DEFENSE (Scale 5-60)
  let triggerScore = 15; // Base

  // Number of triggers
  if (userData.triggers.length <= 2) triggerScore += 15;
  else if (userData.triggers.length <= 4) triggerScore += 10;
  else triggerScore += 5;

  // Trigger complexity
  const hasAlcohol = userData.triggers.includes("Drinking alcohol");
  const hasSocial = userData.triggers.includes("Social situations");
  if (hasAlcohol && hasSocial) triggerScore += 0; // High-risk combo
  else if (userData.triggers.length > 3) triggerScore += 5; // Mixed categories
  else triggerScore += 10; // Single category

  // Coping experience
  if (userData.copingStrategies.length >= 3) triggerScore += 25;
  else if (userData.copingStrategies.length >= 1) triggerScore += 15;
  else triggerScore += 0;

  // Daily routine spread
  if (userData.dailyPatterns.includes("Throughout the day")) triggerScore += 0;
  else if (userData.dailyPatterns.length > 2) triggerScore += 5;
  else triggerScore += 10;

  triggerScore = Math.min(triggerScore, 60);

  return {
    addictionLevel: addictionScore,
    mentalStrength: mentalScore,
    motivation: motivationScore,
    triggerDefense: triggerScore
  };
}

/**
 * Get color based on confidence level
 */
export function getConfidenceColor(confidence: number): string {
  if (confidence <= 3) {
    return '#ef4444'; // Red for low confidence
  } else if (confidence <= 6) {
    return '#fbbf24'; // Yellow for medium confidence
  } else if (confidence <= 9) {
    return '#84cc16'; // Greenish for high confidence
  } else {
    return '#22c55e'; // Green for maximum confidence
  }
}

