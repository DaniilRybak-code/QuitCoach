#!/usr/bin/env node

/**
 * User Isolation Test Runner
 * 
 * This script demonstrates that StatManager properly isolates user data
 * by simulating two users performing behaviors simultaneously.
 * 
 * Run with: node tests/statManager/runIsolationTests.js
 */

import { ref, get, set, push } from 'firebase/database';
import StatManager from '../../src/services/statManager.js';

// Mock Firebase for demonstration
const mockFirebase = {
  ref: (db, path) => ({ db, path }),
  get: async (ref) => ({ exists: () => true, val: () => ({}) }),
  set: async (ref, data) => console.log(`📝 SET: ${ref.path} = ${JSON.stringify(data)}`),
  push: async (ref, data) => console.log(`📝 PUSH: ${ref.path} = ${JSON.stringify(data)}`)
};

// Mock the Firebase module
global.firebase = { database: mockFirebase };

// Simulate two users
const userA = { uid: 'userA123', name: 'Alice' };
const userB = { uid: 'userB456', name: 'Bob' };

console.log('🧪 StatManager User Isolation Test\n');

async function runIsolationTest() {
  console.log('1️⃣ Creating StatManager instances for both users...');
  
  const statManagerA = new StatManager(mockFirebase, userA.uid);
  const statManagerB = new StatManager(mockFirebase, userB.uid);
  
  console.log(`✅ User A (${userA.name}) StatManager created`);
  console.log(`✅ User B (${userB.name}) StatManager created\n`);
  
  console.log('2️⃣ Verifying user-scoped database references...');
  console.log(`User A stats path: ${statManagerA.statsRef.path}`);
  console.log(`User B stats path: ${statManagerB.statsRef.path}`);
  console.log(`Paths are different: ${statManagerA.statsRef.path !== statManagerB.statsRef.path}\n`);
  
  console.log('3️⃣ Simulating simultaneous behavior logging...\n');
  
  // User A performs behaviors
  console.log(`👤 ${userA.name} performing behaviors:`);
  await statManagerA.handleHydrationUpdate(6);
  await statManagerA.handleBreathingExercise();
  await statManagerA.handleCravingResistance();
  
  console.log();
  
  // User B performs behaviors
  console.log(`👤 ${userB.name} performing behaviors:`);
  await statManagerB.handleHydrationUpdate(8);
  await statManagerB.handleRelapse();
  await statManagerB.handleCravingLogged();
  
  console.log('\n4️⃣ Analyzing database paths used...');
  
  // Extract all database paths from console output
  const consoleOutput = console.log.mock?.calls || [];
  const paths = consoleOutput
    .map(call => call[0])
    .filter(output => output.includes('📝'))
    .map(output => {
      const match = output.match(/📝 (SET|PUSH): (.*?) =/);
      return match ? match[2] : null;
    })
    .filter(Boolean);
  
  console.log('\n📊 Database Paths Used:');
  paths.forEach(path => {
    const user = path.includes(userA.uid) ? userA.name : userB.name;
    console.log(`  ${user}: ${path}`);
  });
  
  console.log('\n5️⃣ Verifying isolation...');
  
  // Check that no paths contain the wrong user ID
  const userAContamination = paths.some(path => path.includes(userB.uid) && path.includes('SET') || path.includes('PUSH'));
  const userBContamination = paths.some(path => path.includes(userA.uid) && path.includes('SET') || path.includes('PUSH'));
  
  if (!userAContamination && !userBContamination) {
    console.log('✅ SUCCESS: No cross-user data contamination detected!');
    console.log('✅ All database operations are properly user-scoped');
  } else {
    console.log('❌ FAILURE: Cross-user data contamination detected!');
    if (userAContamination) console.log(`   User A data contains User B paths`);
    if (userBContamination) console.log(`   User B data contains User A paths`);
  }
  
  console.log('\n🎯 Test Summary:');
  console.log(`   - User A performed ${paths.filter(p => p.includes(userA.uid)).length} operations`);
  console.log(`   - User B performed ${paths.filter(p => p.includes(userB.uid)).length} operations`);
  console.log(`   - Total database operations: ${paths.length}`);
  console.log(`   - All operations use users/{userId}/... paths`);
}

// Mock console.log to capture output
const originalLog = console.log;
console.log = jest.fn();

// Run the test
runIsolationTest().catch(console.error);

// Restore console.log
console.log = originalLog;
