/**
 * Stats Calculation Service
 * Calculates initial user stats based on onboarding responses
 */

export interface OnboardingData {
  heroName: string;
  startDate: string;
  quitDate: string;
  weeklySpend: number;
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
 * Step 1: Calculate base addiction level
 */
function calculateBaseAddiction(startDate: string, quitDate: string, weeklySpend: number) {
  const start = new Date(startDate).getTime();
  const quit = new Date(quitDate).getTime();
  
  // Years of use
  const yearsOfUse = (quit - start) / (365 * 24 * 60 * 60 * 1000);
  
  // Spending intensity (normalized to 0-1 scale)
  const spendIntensity = Math.min(1, weeklySpend / 150); // £150/week = max intensity
  
  // Combined addiction depth score (0-100)
  // Formula: Time dependency (70%) + Intensity (30%)
  let timeComponent;
  if (yearsOfUse < 0.5) timeComponent = 20;      // < 6 months: Light
  else if (yearsOfUse < 1) timeComponent = 35;   // 6-12 months: Mild
  else if (yearsOfUse < 2) timeComponent = 50;   // 1-2 years: Moderate
  else if (yearsOfUse < 5) timeComponent = 65;   // 2-5 years: Heavy
  else if (yearsOfUse < 10) timeComponent = 80;  // 5-10 years: Very Heavy
  else timeComponent = 90;                        // 10+ years: Severe
  
  const intensityComponent = spendIntensity * 30; // 0-30 points
  
  const baseAddiction = Math.min(100, timeComponent + intensityComponent);
  
  return {
    baseAddiction,
    yearsOfUse,
    category: getAddictionCategory(baseAddiction),
  };
}

function getAddictionCategory(score: number): string {
  if (score < 30) return "Light";
  if (score < 50) return "Moderate";
  if (score < 70) return "Heavy";
  return "Severe";
}

/**
 * Step 2: Calculate recovery progress
 */
function calculateRecoveryProgress(quitDate: string, baseAddiction: number): number {
  const quit = new Date(quitDate).getTime();
  const daysSinceQuit = Math.floor((Date.now() - quit) / (24 * 60 * 60 * 1000));
  
  // Recovery follows a logarithmic curve
  // Harder addictions take longer to recover from
  
  // Recovery multiplier based on addiction depth
  // Severe addictions recover slower (take 2x as long to reach same %)
  const recoveryMultiplier = 1 + (baseAddiction / 200); // 1.0 to 1.5x
  
  // Adjusted days (accounts for difficulty)
  const effectiveDays = daysSinceQuit / recoveryMultiplier;
  
  // Recovery percentage (0-100)
  let recoveryPercent;
  
  if (effectiveDays < 1) {
    recoveryPercent = 5;
  } else if (effectiveDays <= 3) {
    // Days 1-3: 5% → 20% (peak withdrawal, rapid improvement)
    recoveryPercent = 5 + (effectiveDays * 5);
  } else if (effectiveDays <= 7) {
    // Days 4-7: 20% → 40%
    recoveryPercent = 20 + ((effectiveDays - 3) * 5);
  } else if (effectiveDays <= 14) {
    // Days 8-14: 40% → 55%
    recoveryPercent = 40 + ((effectiveDays - 7) * 2.14);
  } else if (effectiveDays <= 30) {
    // Days 15-30: 55% → 70%
    recoveryPercent = 55 + ((effectiveDays - 14) * 0.94);
  } else if (effectiveDays <= 90) {
    // Days 31-90: 70% → 85%
    recoveryPercent = 70 + ((effectiveDays - 30) * 0.25);
  } else if (effectiveDays <= 180) {
    // Days 91-180: 85% → 93%
    recoveryPercent = 85 + ((effectiveDays - 90) * 0.089);
  } else if (effectiveDays <= 365) {
    // Days 181-365: 93% → 97%
    recoveryPercent = 93 + ((effectiveDays - 180) * 0.022);
  } else {
    // 365+ days: 97% → 99% (asymptotic)
    const yearsAfterFirst = (effectiveDays - 365) / 365;
    recoveryPercent = 97 + (2 * (1 - Math.exp(-yearsAfterFirst)));
  }
  
  return Math.min(99, recoveryPercent); // Never reaches 100%
}

/**
 * Step 3: Calculate addiction freedom
 */
function calculateAddictionFreedom(
  startDate: string,
  quitDate: string,
  weeklySpend: number,
  cravingsResisted: number = 0,
  totalCravings: number = 0
) {
  // Step 1: Base addiction level
  const { baseAddiction, yearsOfUse } = calculateBaseAddiction(
    startDate,
    quitDate,
    weeklySpend
  );
  
  // Step 2: Recovery progress
  const recoveryPercent = calculateRecoveryProgress(quitDate, baseAddiction);
  
  // Step 3: Starting freedom (inverse of base addiction)
  const startingFreedom = 100 - baseAddiction;
  
  // Step 4: Current freedom (starting point + recovery gained)
  // Recovery percent represents how much of the GAP has been closed
  const freedomGap = baseAddiction; // How much freedom to recover
  const freedomGained = (recoveryPercent / 100) * freedomGap;
  const baseFreedom = startingFreedom + freedomGained;
  
  // Step 5: Engagement bonus (active users get +boost)
  let engagementBonus = 0;
  if (totalCravings > 0) {
    const resistanceRate = cravingsResisted / totalCravings;
    engagementBonus = resistanceRate * 10; // Up to +10%
  }
  
  // Final freedom
  const finalFreedom = Math.min(99, baseFreedom + engagementBonus);
  
  return {
    addictionFreedom: Math.round(finalFreedom),
    baseAddiction,
    recoveryPercent: Math.round(recoveryPercent),
    yearsOfUse,
    breakdown: {
      starting: Math.round(startingFreedom),
      gained: Math.round(freedomGained),
      engagement: Math.round(engagementBonus),
    },
  };
}

/**
 * Calculate initial stats based on user's onboarding responses
 */
export function calculateInitialStats(userData: OnboardingData): CalculatedStats {
  console.log('Calculating stats with userData:', userData);
  
  // ADDICTION FREEDOM (Scale 0-99) - Higher = more freedom
  // Calculate using the new sophisticated algorithm
  const freedomResult = calculateAddictionFreedom(
    userData.startDate,
    userData.quitDate,
    userData.weeklySpend,
    0, // cravingsResisted - will be updated during app usage
    0  // totalCravings - will be updated during app usage
  );
  
  // Store as addictionLevel (inverse of freedom for backwards compatibility)
  const addictionScore = 100 - freedomResult.addictionFreedom;

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

