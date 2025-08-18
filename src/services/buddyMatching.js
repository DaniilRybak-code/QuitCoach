/**
 * Buddy Matching Service for QuitCoach App
 * Handles compatibility scoring and buddy matching based on user profiles
 */

// Constants for scoring weights
const SCORING_WEIGHTS = {
  QUIT_DATE: {
    PERFECT: 50,      // Same day
    GOOD: 35,         // ±3 days
    ACCEPTABLE: 20    // ±7 days
  },
  ADDICTION_LEVEL: 30,    // Max points for perfect match
  TIMEZONE: 20,           // Max points for same timezone
  EXPERIENCE: 15,         // Max points for compatible experience
  SHARED_TRIGGERS: 5,     // Per shared trigger
  DAILY_PATTERNS: 10,     // For similar patterns
  COPING_STRATEGIES: 8    // For similar strategies
};

// Minimum compatibility threshold for valid matches
const MIN_COMPATIBILITY_THRESHOLD = 60;

/**
 * Calculate compatibility score between two users
 * @param {Object} user1 - First user profile
 * @param {Object} user2 - Second user profile
 * @returns {number} Compatibility score (0-100)
 */
export const calculateCompatibility = (user1, user2) => {
  try {
    let totalScore = 0;
    
    // 1. Quit Start Date Compatibility (Primary Factor)
    const quitDateScore = calculateQuitDateScore(user1.quitDate, user2.quitDate);
    totalScore += quitDateScore;
    
    // 2. Addiction Level Compatibility (Primary Factor)
    const addictionScore = calculateAddictionScore(user1.stats?.addictionLevel, user2.stats?.addictionLevel);
    totalScore += addictionScore;
    
    // 3. Timezone Compatibility (Primary Factor)
    const timezoneScore = calculateTimezoneScore(user1.timezone, user2.timezone);
    totalScore += timezoneScore;
    
    // 4. Quit Experience Compatibility (Primary Factor)
    const experienceScore = calculateExperienceScore(user1.copingStrategies, user2.copingStrategies);
    totalScore += experienceScore;
    
    // 5. Shared Triggers (Secondary Factor)
    const triggerScore = calculateTriggerScore(user1.triggers, user2.triggers);
    totalScore += triggerScore;
    
    // 6. Daily Patterns (Secondary Factor)
    const patternScore = calculatePatternScore(user1.dailyPatterns, user2.dailyPatterns);
    totalScore += patternScore;
    
    // 7. Coping Strategies (Secondary Factor)
    const copingScore = calculateCopingScore(user1.copingStrategies, user2.copingStrategies);
    totalScore += copingScore;
    
    // Ensure score doesn't exceed 100
    return Math.min(100, Math.round(totalScore));
    
  } catch (error) {
    console.error('Error calculating compatibility:', error);
    return 0;
  }
};

/**
 * Calculate quit date compatibility score
 */
const calculateQuitDateScore = (date1, date2) => {
  if (!date1 || !date2) return 0;
  
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const daysDiff = Math.abs(d1.getTime() - d2.getTime()) / (1000 * 3600 * 24);
  
  if (daysDiff === 0) return SCORING_WEIGHTS.QUIT_DATE.PERFECT;
  if (daysDiff <= 3) return SCORING_WEIGHTS.QUIT_DATE.GOOD;
  if (daysDiff <= 7) return SCORING_WEIGHTS.QUIT_DATE.ACCEPTABLE;
  
  return 0;
};

/**
 * Calculate addiction level compatibility score
 */
const calculateAddictionScore = (level1, level2) => {
  if (level1 === undefined || level2 === undefined) return 0;
  
  const difference = Math.abs(level1 - level2);
  if (difference <= 5) return SCORING_WEIGHTS.ADDICTION_LEVEL;
  if (difference <= 10) return Math.round(SCORING_WEIGHTS.ADDICTION_LEVEL * 0.8);
  if (difference <= 20) return Math.round(SCORING_WEIGHTS.ADDICTION_LEVEL * 0.6);
  if (difference <= 30) return Math.round(SCORING_WEIGHTS.ADDICTION_LEVEL * 0.4);
  
  return 0;
};

/**
 * Calculate timezone compatibility score
 */
const calculateTimezoneScore = (tz1, tz2) => {
  if (!tz1 || !tz2) return 0;
  
  if (tz1 === tz2) return SCORING_WEIGHTS.TIMEZONE;
  
  // Extract hour offset from timezone strings (e.g., "UTC-5" -> -5)
  const offset1 = parseInt(tz1.replace('UTC', '')) || 0;
  const offset2 = parseInt(tz2.replace('UTC', '')) || 0;
  const hourDiff = Math.abs(offset1 - offset2);
  
  if (hourDiff <= 1) return Math.round(SCORING_WEIGHTS.TIMEZONE * 0.8);
  if (hourDiff <= 2) return Math.round(SCORING_WEIGHTS.TIMEZONE * 0.6);
  if (hourDiff <= 3) return Math.round(SCORING_WEIGHTS.TIMEZONE * 0.4);
  
  return 0;
};

/**
 * Calculate quit experience compatibility score
 */
const calculateExperienceScore = (strategies1, strategies2) => {
  if (!strategies1 || !strategies2) return 0;
  
  const isFirstTimer1 = strategies1.includes('Nothing - this is new to me');
  const isFirstTimer2 = strategies2.includes('Nothing - this is new to me');
  
  // Match first-timers with first-timers, veterans with veterans
  if (isFirstTimer1 === isFirstTimer2) return SCORING_WEIGHTS.EXPERIENCE;
  
  // Partial credit for mixed experience (veteran can help first-timer)
  if (isFirstTimer1 || isFirstTimer2) return Math.round(SCORING_WEIGHTS.EXPERIENCE * 0.5);
  
  return 0;
};

/**
 * Calculate shared triggers score
 */
const calculateTriggerScore = (triggers1, triggers2) => {
  if (!triggers1 || !triggers2) return 0;
  
  const sharedTriggers = triggers1.filter(trigger => triggers2.includes(trigger));
  return sharedTriggers.length * SCORING_WEIGHTS.SHARED_TRIGGERS;
};

/**
 * Calculate daily patterns compatibility score
 */
const calculatePatternScore = (patterns1, patterns2) => {
  if (!patterns1 || !patterns2) return 0;
  
  const sharedPatterns = patterns1.filter(pattern => patterns2.includes(pattern));
  
  if (sharedPatterns.length >= 2) return SCORING_WEIGHTS.DAILY_PATTERNS;
  if (sharedPatterns.length === 1) return Math.round(SCORING_WEIGHTS.DAILY_PATTERNS * 0.5);
  
  return 0;
};

/**
 * Calculate coping strategies compatibility score
 */
const calculateCopingScore = (strategies1, strategies2) => {
  if (!strategies1 || !strategies2) return 0;
  
  const sharedStrategies = strategies1.filter(strategy => strategies2.includes(strategy));
  
  if (sharedStrategies.length >= 2) return SCORING_WEIGHTS.COPING_STRATEGIES;
  if (sharedStrategies.length === 1) return Math.round(SCORING_WEIGHTS.COPING_STRATEGIES * 0.5);
  
  return 0;
};

/**
 * Find the best buddy match from available users
 * @param {Object} currentUser - Current user looking for a buddy
 * @param {Array} availableUserPool - Array of available users
 * @returns {Object|null} Best matching user or null if no good matches
 */
export const findBuddyMatch = (currentUser, availableUserPool) => {
  try {
    if (!availableUserPool || availableUserPool.length === 0) {
      console.log('No available users in pool');
      return null;
    }
    
    // Filter out users who already have buddies
    const trulyAvailableUsers = availableUserPool.filter(user => 
      user.id !== currentUser.id && !user.hasActiveBuddy
    );
    
    if (trulyAvailableUsers.length === 0) {
      console.log('No truly available users found');
      return null;
    }
    
    // Calculate compatibility scores for all available users
    const compatibilityScores = trulyAvailableUsers.map(user => ({
      user,
      score: calculateCompatibility(currentUser, user)
    }));
    
    // Sort by score (highest first)
    compatibilityScores.sort((a, b) => b.score - a.score);
    
    console.log('Compatibility scores:', compatibilityScores.map(cs => 
      `${cs.user.heroName}: ${cs.score}`
    ));
    
    // Check if best match meets threshold
    const bestMatch = compatibilityScores[0];
    if (bestMatch.score >= MIN_COMPATIBILITY_THRESHOLD) {
      console.log(`Best match found: ${bestMatch.user.heroName} with score ${bestMatch.score}`);
      return bestMatch.user;
    }
    
    console.log(`No matches meet threshold. Best score: ${bestMatch.score} (need ${MIN_COMPATIBILITY_THRESHOLD})`);
    return null;
    
  } catch (error) {
    console.error('Error finding buddy match:', error);
    return null;
  }
};

/**
 * Create a buddy pair relationship
 * @param {Object} user1 - First user
 * @param {Object} user2 - Second user
 * @returns {Object} Buddy relationship object
 */
export const createBuddyPair = (user1, user2) => {
  try {
    const compatibilityScore = calculateCompatibility(user1, user2);
    
    const buddyPair = {
      id: `buddy_${Date.now()}`,
      user1: {
        id: user1.id,
        heroName: user1.heroName,
        avatar: user1.avatar
      },
      user2: {
        id: user2.id,
        heroName: user2.heroName,
        avatar: user2.avatar
      },
      compatibilityScore,
      matchDate: new Date().toISOString(),
      status: 'active',
      lastActivity: new Date().toISOString()
    };
    
    console.log(`Buddy pair created: ${user1.heroName} + ${user2.heroName} (Score: ${compatibilityScore})`);
    return buddyPair;
    
  } catch (error) {
    console.error('Error creating buddy pair:', error);
    return null;
  }
};

/**
 * Add user to waiting pool when no matches found
 * @param {Object} user - User to add to waiting pool
 * @returns {boolean} Success status
 */
export const addToWaitingPool = (user) => {
  try {
    const waitingPoolKey = 'buddyWaitingPool';
    let waitingPool = JSON.parse(localStorage.getItem(waitingPoolKey) || '[]');
    
    // Check if user is already in waiting pool
    const existingIndex = waitingPool.findIndex(waitingUser => waitingUser.id === user.id);
    
    if (existingIndex >= 0) {
      // Update existing entry
      waitingPool[existingIndex] = {
        ...user,
        addedToPool: new Date().toISOString(),
        lastAttempt: new Date().toISOString()
      };
    } else {
      // Add new user to waiting pool
      waitingPool.push({
        ...user,
        addedToPool: new Date().toISOString(),
        lastAttempt: new Date().toISOString()
      });
    }
    
    localStorage.setItem(waitingPoolKey, JSON.stringify(waitingPool));
    console.log(`User ${user.heroName} added to waiting pool`);
    return true;
    
  } catch (error) {
    console.error('Error adding user to waiting pool:', error);
    return false;
  }
};

/**
 * Get users from waiting pool
 * @returns {Array} Array of users in waiting pool
 */
export const getWaitingPool = () => {
  try {
    const waitingPoolKey = 'buddyWaitingPool';
    return JSON.parse(localStorage.getItem(waitingPoolKey) || '[]');
  } catch (error) {
    console.error('Error getting waiting pool:', error);
    return [];
  }
};

/**
 * Remove user from waiting pool
 * @param {string} userId - ID of user to remove
 * @returns {boolean} Success status
 */
export const removeFromWaitingPool = (userId) => {
  try {
    const waitingPoolKey = 'buddyWaitingPool';
    let waitingPool = JSON.parse(localStorage.getItem(waitingPoolKey) || '[]');
    
    waitingPool = waitingPool.filter(user => user.id !== userId);
    localStorage.setItem(waitingPoolKey, JSON.stringify(waitingPool));
    
    console.log(`User ${userId} removed from waiting pool`);
    return true;
    
  } catch (error) {
    console.error('Error removing user from waiting pool:', error);
    return false;
  }
};

/**
 * Get active buddy pairs
 * @returns {Array} Array of active buddy pairs
 */
export const getActiveBuddyPairs = () => {
  try {
    const buddyPairsKey = 'activeBuddyPairs';
    return JSON.parse(localStorage.getItem(buddyPairsKey) || '[]');
  } catch (error) {
    console.error('Error getting active buddy pairs:', error);
    return [];
  }
};

/**
 * Save active buddy pair
 * @param {Object} buddyPair - Buddy pair to save
 * @returns {boolean} Success status
 */
export const saveBuddyPair = (buddyPair) => {
  try {
    const buddyPairsKey = 'activeBuddyPairs';
    let buddyPairs = JSON.parse(localStorage.getItem(buddyPairsKey) || '[]');
    
    // Check if pair already exists
    const existingIndex = buddyPairs.findIndex(pair => 
      (pair.user1.id === buddyPair.user1.id && pair.user2.id === buddyPair.user2.id) ||
      (pair.user1.id === buddyPair.user2.id && pair.user2.id === buddyPair.user1.id)
    );
    
    if (existingIndex >= 0) {
      // Update existing pair
      buddyPairs[existingIndex] = buddyPair;
    } else {
      // Add new pair
      buddyPairs.push(buddyPair);
    }
    
    localStorage.setItem(buddyPairsKey, JSON.stringify(buddyPairs));
    console.log(`Buddy pair saved: ${buddyPair.user1.heroName} + ${buddyPair.user2.heroName}`);
    return true;
    
  } catch (error) {
    console.error('Error saving buddy pair:', error);
    return false;
  }
};

/**
 * Check if user has an active buddy
 * @param {string} userId - User ID to check
 * @returns {Object|null} Active buddy pair or null
 */
export const getUserActiveBuddy = (userId) => {
  try {
    const buddyPairs = getActiveBuddyPairs();
    
    const activePair = buddyPairs.find(pair => 
      pair.status === 'active' && 
      (pair.user1.id === userId || pair.user2.id === userId)
    );
    
    if (activePair) {
      const buddy = activePair.user1.id === userId ? activePair.user2 : activePair.user1;
      return { buddy, pair: activePair };
    }
    
    return null;
    
  } catch (error) {
    console.error('Error getting user active buddy:', error);
    return null;
  }
};

// Export constants for testing
export { SCORING_WEIGHTS, MIN_COMPATIBILITY_THRESHOLD };
