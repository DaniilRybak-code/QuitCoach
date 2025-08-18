/**
 * Test file for Buddy Matching Service
 * Demonstrates how to use the service and verify functionality
 * 
 * To test: Open browser console and run the functions below
 */

import { 
  calculateCompatibility, 
  findBuddyMatch, 
  createBuddyPair, 
  addToWaitingPool,
  SCORING_WEIGHTS,
  MIN_COMPATIBILITY_THRESHOLD
} from './buddyMatching.js';

import { 
  mockUsers, 
  getUserById, 
  getUsersByCriteria,
  getUsersByTrigger,
  getUsersByExperience 
} from '../data/mockUsers.js';

/**
 * Test compatibility calculation between two users
 */
export const testCompatibilityCalculation = () => {
  console.log('🧪 Testing Compatibility Calculation...');
  
  const user1 = getUserById('user_001'); // Sarah
  const user2 = getUserById('user_002'); // Mike
  
  if (!user1 || !user2) {
    console.error('Test users not found');
    return;
  }
  
  const score = calculateCompatibility(user1, user2);
  console.log(`Compatibility between ${user1.heroName} and ${user2.heroName}: ${score}/100`);
  
  // Show detailed breakdown
  console.log('User 1:', user1.heroName, {
    quitDate: user1.quitDate,
    addictionLevel: user1.stats.addictionLevel,
    timezone: user1.timezone,
    triggers: user1.triggers,
    dailyPatterns: user1.dailyPatterns,
    copingStrategies: user1.copingStrategies
  });
  
  console.log('User 2:', user2.heroName, {
    quitDate: user2.quitDate,
    addictionLevel: user2.stats.addictionLevel,
    timezone: user2.timezone,
    triggers: user2.triggers,
    dailyPatterns: user2.dailyPatterns,
    copingStrategies: user2.copingStrategies
  });
  
  return score;
};

/**
 * Test finding buddy matches
 */
export const testBuddyMatching = () => {
  console.log('🧪 Testing Buddy Matching...');
  
  const currentUser = getUserById('user_001'); // Sarah
  const availableUsers = mockUsers.filter(user => user.id !== currentUser.id);
  
  if (!currentUser) {
    console.error('Current user not found');
    return;
  }
  
  console.log(`Looking for buddy for: ${currentUser.heroName}`);
  console.log(`Available users: ${availableUsers.length}`);
  
  const bestMatch = findBuddyMatch(currentUser, availableUsers);
  
  if (bestMatch) {
    console.log(`✅ Best match found: ${bestMatch.heroName}`);
    const compatibilityScore = calculateCompatibility(currentUser, bestMatch);
    console.log(`Compatibility score: ${compatibilityScore}/100`);
    
    // Create buddy pair
    const buddyPair = createBuddyPair(currentUser, bestMatch);
    console.log('Buddy pair created:', buddyPair);
    
    return bestMatch;
  } else {
    console.log('❌ No suitable match found');
    
    // Add to waiting pool
    addToWaitingPool(currentUser);
    console.log('User added to waiting pool');
    
    return null;
  }
};

/**
 * Test different user scenarios
 */
export const testVariousScenarios = () => {
  console.log('🧪 Testing Various Scenarios...');
  
  // Test first-timer matching
  console.log('\n--- First Timer Matching ---');
  const firstTimers = getUsersByExperience('first-timer');
  console.log(`First timers found: ${firstTimers.length}`);
  
  if (firstTimers.length >= 2) {
    const score1 = calculateCompatibility(firstTimers[0], firstTimers[1]);
    console.log(`Compatibility between first timers: ${score1}/100`);
  }
  
  // Test veteran matching
  console.log('\n--- Veteran Matching ---');
  const veterans = getUsersByExperience('veteran');
  console.log(`Veterans found: ${veterans.length}`);
  
  if (veterans.length >= 2) {
    const score2 = calculateCompatibility(veterans[0], veterans[1]);
    console.log(`Compatibility between veterans: ${score2}/100`);
  }
  
  // Test stress vapers
  console.log('\n--- Stress Vaper Matching ---');
  const stressVapers = getUsersByTrigger('Stress/anxiety');
  console.log(`Stress vapers found: ${stressVapers.length}`);
  
  if (stressVapers.length >= 2) {
    const score3 = calculateCompatibility(stressVapers[0], stressVapers[1]);
    console.log(`Compatibility between stress vapers: ${score3}/100`);
  }
  
  // Test timezone compatibility
  console.log('\n--- Timezone Compatibility ---');
  const utc5Users = getUsersByCriteria({ timezone: 'UTC-5' });
  console.log(`UTC-5 users found: ${utc5Users.length}`);
  
  if (utc5Users.length >= 2) {
    const score4 = calculateCompatibility(utc5Users[0], utc5Users[1]);
    console.log(`Compatibility between UTC-5 users: ${score4}/100`);
  }
};

/**
 * Test edge cases
 */
export const testEdgeCases = () => {
  console.log('🧪 Testing Edge Cases...');
  
  // Test with invalid users
  console.log('\n--- Invalid User Test ---');
  const invalidScore = calculateCompatibility(null, {});
  console.log(`Score with invalid users: ${invalidScore}`);
  
  // Test with missing data
  console.log('\n--- Missing Data Test ---');
  const userWithMissingData = {
    id: 'test_user',
    heroName: 'Test User',
    // Missing quitDate, stats, etc.
  };
  const score = calculateCompatibility(userWithMissingData, mockUsers[0]);
  console.log(`Score with missing data: ${score}`);
  
  // Test empty user pool
  console.log('\n--- Empty Pool Test ---');
  const emptyPoolMatch = findBuddyMatch(mockUsers[0], []);
  console.log(`Match from empty pool: ${emptyPoolMatch}`);
  
  // Test all users with buddies
  console.log('\n--- All Users Have Buddies Test ---');
  const usersWithBuddies = mockUsers.map(user => ({ ...user, hasActiveBuddy: true }));
  const noAvailableMatch = findBuddyMatch(mockUsers[0], usersWithBuddies);
  console.log(`Match when all have buddies: ${noAvailableMatch}`);
};

/**
 * Run all tests
 */
export const runAllTests = () => {
  console.log('🚀 Running All Buddy Matching Tests...\n');
  
  try {
    testCompatibilityCalculation();
    console.log('\n' + '='.repeat(50) + '\n');
    
    testBuddyMatching();
    console.log('\n' + '='.repeat(50) + '\n');
    
    testVariousScenarios();
    console.log('\n' + '='.repeat(50) + '\n');
    
    testEdgeCases();
    console.log('\n' + '='.repeat(50) + '\n');
    
    console.log('✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

/**
 * Show scoring weights and threshold
 */
export const showScoringSystem = () => {
  console.log('📊 Buddy Matching Scoring System:');
  console.log('Primary Factors:');
  console.log(`  - Quit Date: Perfect (${SCORING_WEIGHTS.QUIT_DATE.PERFECT}), Good (${SCORING_WEIGHTS.QUIT_DATE.GOOD}), Acceptable (${SCORING_WEIGHTS.QUIT_DATE.ACCEPTABLE})`);
  console.log(`  - Addiction Level: ${SCORING_WEIGHTS.ADDICTION_LEVEL} max`);
  console.log(`  - Timezone: ${SCORING_WEIGHTS.TIMEZONE} max`);
  console.log(`  - Experience: ${SCORING_WEIGHTS.EXPERIENCE} max`);
  console.log('Secondary Factors:');
  console.log(`  - Shared Triggers: ${SCORING_WEIGHTS.SHARED_TRIGGERS} per trigger`);
  console.log(`  - Daily Patterns: ${SCORING_WEIGHTS.DAILY_PATTERNS} max`);
  console.log(`  - Coping Strategies: ${SCORING_WEIGHTS.COPING_STRATEGIES} max`);
  console.log(`\nMinimum Threshold: ${MIN_COMPATIBILITY_THRESHOLD}/100`);
};

// Export test functions for console testing
window.testBuddyMatching = {
  testCompatibilityCalculation,
  testBuddyMatching,
  testVariousScenarios,
  testEdgeCases,
  runAllTests,
  showScoringSystem,
  mockUsers,
  getUserById,
  getUsersByCriteria
};

console.log('🧪 Buddy Matching Tests loaded!');
console.log('Run testBuddyMatching.runAllTests() to test everything');
console.log('Run testBuddyMatching.showScoringSystem() to see scoring details');
