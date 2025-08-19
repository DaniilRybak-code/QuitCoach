// Test Script for Buddy Matching Database Structure
// Run this to verify the database setup works correctly

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, remove } from 'firebase/database';
import BuddyMatchingService from './src/services/buddyMatchingService.js';

// Firebase configuration (use your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyAdJ3lRxhgZWhnqH8SNQsT1bTFB8E0-cDg",
  authDomain: "quitarena-a97de.firebaseapp.com",
  databaseURL: "https://quitarena-a97de-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "quitarena-a97de",
  storageBucket: "quitarena-a97de.firebasestorage.app",
  messagingSenderId: "693525963288",
  appId: "1:693525963288:web:a175e9a9bd56fffb35596d",
  measurementId: "G-H2CCRXYY74"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Initialize Buddy Matching Service
const buddyService = new BuddyMatchingService(db);

// Test data
const testUsers = [
  {
    userId: 'test-user-1',
    quitDate: '2025-01-15T00:00:00.000Z',
    stats: { addictionLevel: 75 },
    triggers: ['stress', 'social', 'boredom'],
    timezone: 'America/New_York',
    quitExperience: 'first-timer',
    archetype: 'DETERMINED',
    dailyPatterns: ['morning', 'after meals'],
    copingStrategies: ['breathing', 'exercise'],
    confidence: 7
  },
  {
    userId: 'test-user-2',
    quitDate: '2025-01-18T00:00:00.000Z',
    stats: { addictionLevel: 70 },
    triggers: ['stress', 'social', 'work'],
    timezone: 'America/New_York',
    quitExperience: 'first-timer',
    archetype: 'SOCIAL_FIGHTER',
    dailyPatterns: ['morning', 'work breaks'],
    copingStrategies: ['breathing', 'distraction'],
    confidence: 6
  },
  {
    userId: 'test-user-3',
    quitDate: '2025-01-10T00:00:00.000Z',
    stats: { addictionLevel: 80 },
    triggers: ['boredom', 'after meals'],
    timezone: 'Europe/London',
    quitExperience: 'veteran',
    archetype: 'HEALTH_WARRIOR',
    dailyPatterns: ['evening', 'weekends'],
    copingStrategies: ['exercise', 'meditation'],
    confidence: 8
  }
];

// Test functions
async function testMatchingPool() {
  console.log('🧪 Testing Matching Pool Operations...');
  
  try {
    // Test 1: Add users to matching pool
    console.log('\n1️⃣ Adding users to matching pool...');
    for (const user of testUsers) {
      const success = await buddyService.addToMatchingPool(user.userId, user);
      console.log(`   ${success ? '✅' : '❌'} Added ${user.userId}`);
    }

    // Test 2: Get pool statistics
    console.log('\n2️⃣ Getting pool statistics...');
    const stats = await buddyService.getMatchingPoolStats();
    console.log('   Pool Stats:', stats);

    // Test 3: Find compatible matches
    console.log('\n3️⃣ Finding compatible matches...');
    const matches = await buddyService.findCompatibleMatches('test-user-1', 3);
    console.log(`   Found ${matches.length} compatible matches:`);
    matches.forEach((match, index) => {
      console.log(`   ${index + 1}. ${match.userId} (${Math.round(match.compatibilityScore * 100)}% compatible)`);
      console.log(`      Reasons: ${match.matchReasons.join(', ')}`);
    });

    // Test 4: Create buddy pair
    if (matches.length > 0) {
      console.log('\n4️⃣ Creating buddy pair...');
      const bestMatch = matches[0];
      const pairId = await buddyService.createBuddyPair(
        'test-user-1', 
        bestMatch.userId, 
        {
          compatibilityScore: bestMatch.compatibilityScore,
          matchReasons: bestMatch.matchReasons
        }
      );
      console.log(`   ${pairId ? '✅' : '❌'} Buddy pair created: ${pairId}`);

      // Test 5: Get buddy info
      if (pairId) {
        console.log('\n5️⃣ Getting buddy information...');
        const buddyInfo = await buddyService.getUserBuddyInfo('test-user-1');
        console.log('   Buddy Info:', buddyInfo);

        const pairInfo = await buddyService.getBuddyPairInfo(pairId);
        console.log('   Pair Info:', pairInfo);
      }
    }

    // Test 6: Update availability
    console.log('\n6️⃣ Testing availability updates...');
    const updateSuccess = await buddyService.updateMatchingAvailability('test-user-2', false);
    console.log(`   ${updateSuccess ? '✅' : '❌'} Updated availability for test-user-2`);

    // Test 7: Cleanup inactive users (should not remove any in this test)
    console.log('\n7️⃣ Testing cleanup (should not remove any users)...');
    const removedCount = await buddyService.cleanupInactiveUsers(30);
    console.log(`   Removed ${removedCount} inactive users`);

    console.log('\n🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

async function cleanupTestData() {
  console.log('\n🧹 Cleaning up test data...');
  
  try {
    // Remove test users from matching pool
    for (const user of testUsers) {
      await buddyService.removeFromMatchingPool(user.userId);
    }

    // Remove test buddy pairs (if any exist)
    const pairsRef = ref(db, 'buddyPairs');
    const pairsSnapshot = await get(pairsRef);
    if (pairsSnapshot.exists()) {
      const pairs = pairsSnapshot.val();
      for (const [pairId, pairData] of Object.entries(pairs)) {
        if (pairData.users.some(userId => userId.startsWith('test-user-'))) {
          await remove(ref(db, `buddyPairs/${pairId}`));
          console.log(`   Removed test pair: ${pairId}`);
        }
      }
    }

    // Remove test user profiles
    for (const user of testUsers) {
      await remove(ref(db, `users/${user.userId}`));
    }

    console.log('   ✅ Test data cleaned up');

  } catch (error) {
    console.error('   ❌ Cleanup failed:', error);
  }
}

// Main test execution
async function runTests() {
  console.log('🚀 Starting Buddy Matching Database Tests...\n');
  
  await testMatchingPool();
  await cleanupTestData();
  
  console.log('\n✨ Tests completed! Check the console for results.');
}

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  runTests().catch(console.error);
} else {
  // Browser environment
  window.runBuddyMatchingTests = runTests;
  console.log('🌐 Browser environment detected. Run window.runBuddyMatchingTests() to start tests.');
}

export { runTests, cleanupTestData };
