/**
 * Firestore Security Rules Test Suite
 * Tests various user scenarios to ensure proper access control
 */

// Mock Firebase Auth and Firestore for testing
const mockAuth = {
  uid: 'test-user-123',
  email: 'test@example.com'
};

const mockOtherUser = {
  uid: 'other-user-456',
  email: 'other@example.com'
};

// Test scenarios
const testScenarios = [
  {
    name: 'User can read their own user document',
    collection: 'users',
    documentId: 'test-user-123',
    operation: 'read',
    auth: mockAuth,
    shouldSucceed: true
  },
  {
    name: 'User cannot read another user\'s document',
    collection: 'users',
    documentId: 'other-user-456',
    operation: 'read',
    auth: mockAuth,
    shouldSucceed: false
  },
  {
    name: 'User can create their own user document with valid data',
    collection: 'users',
    documentId: 'test-user-123',
    operation: 'create',
    auth: mockAuth,
    data: {
      uid: 'test-user-123',
      email: 'test@example.com',
      createdAt: new Date(),
      displayName: 'Test User'
    },
    shouldSucceed: true
  },
  {
    name: 'User cannot create user document with invalid email',
    collection: 'users',
    documentId: 'test-user-123',
    operation: 'create',
    auth: mockAuth,
    data: {
      uid: 'test-user-123',
      email: 'invalid-email',
      createdAt: new Date()
    },
    shouldSucceed: false
  },
  {
    name: 'User cannot create user document with mismatched UID',
    collection: 'users',
    documentId: 'test-user-123',
    operation: 'create',
    auth: mockAuth,
    data: {
      uid: 'different-user-789',
      email: 'test@example.com',
      createdAt: new Date()
    },
    shouldSucceed: false
  },
  {
    name: 'User can create their own matching pool entry',
    collection: 'matchingPool',
    documentId: 'test-user-123',
    operation: 'create',
    auth: mockAuth,
    data: {
      userId: 'test-user-123',
      createdAt: new Date(),
      status: 'waiting',
      preferences: {
        ageRange: { min: 25, max: 35 },
        timezone: 'UTC'
      }
    },
    shouldSucceed: true
  },
  {
    name: 'User cannot create matching pool entry for another user',
    collection: 'matchingPool',
    documentId: 'other-user-456',
    operation: 'create',
    auth: mockAuth,
    data: {
      userId: 'other-user-456',
      createdAt: new Date(),
      status: 'waiting'
    },
    shouldSucceed: false
  },
  {
    name: 'User can read buddy pair they are part of',
    collection: 'buddyPairs',
    documentId: 'pair-123',
    operation: 'read',
    auth: mockAuth,
    existingData: {
      user1Id: 'test-user-123',
      user2Id: 'other-user-456',
      createdAt: new Date(),
      status: 'active'
    },
    shouldSucceed: true
  },
  {
    name: 'User cannot read buddy pair they are not part of',
    collection: 'buddyPairs',
    documentId: 'pair-456',
    operation: 'read',
    auth: mockAuth,
    existingData: {
      user1Id: 'user-789',
      user2Id: 'user-101',
      createdAt: new Date(),
      status: 'active'
    },
    shouldSucceed: false
  },
  {
    name: 'User can create behavioral craving data',
    collection: 'behavioral_cravings',
    documentId: 'craving-123',
    operation: 'create',
    auth: mockAuth,
    data: {
      userId: 'test-user-123',
      timestamp: new Date(),
      outcome: 'resisted',
      strength: 5,
      context: 'work'
    },
    shouldSucceed: true
  },
  {
    name: 'User cannot create behavioral data for another user',
    collection: 'behavioral_cravings',
    documentId: 'craving-456',
    operation: 'create',
    auth: mockAuth,
    data: {
      userId: 'other-user-456',
      timestamp: new Date(),
      outcome: 'resisted'
    },
    shouldSucceed: false
  },
  {
    name: 'User cannot create behavioral data with invalid outcome',
    collection: 'behavioral_cravings',
    documentId: 'craving-789',
    operation: 'create',
    auth: mockAuth,
    data: {
      userId: 'test-user-123',
      timestamp: new Date(),
      outcome: 'invalid-outcome'
    },
    shouldSucceed: false
  },
  {
    name: 'User cannot create behavioral data with invalid strength',
    collection: 'behavioral_cravings',
    documentId: 'craving-101',
    operation: 'create',
    auth: mockAuth,
    data: {
      userId: 'test-user-123',
      timestamp: new Date(),
      outcome: 'resisted',
      strength: 15 // Invalid: should be 0-10
    },
    shouldSucceed: false
  },
  {
    name: 'User cannot create behavioral data with future timestamp',
    collection: 'behavioral_cravings',
    documentId: 'craving-102',
    operation: 'create',
    auth: mockAuth,
    data: {
      userId: 'test-user-123',
      timestamp: new Date(Date.now() + 86400000), // Tomorrow
      outcome: 'resisted'
    },
    shouldSucceed: false
  },
  {
    name: 'User cannot create document larger than 1MB',
    collection: 'behavioral_cravings',
    documentId: 'craving-103',
    operation: 'create',
    auth: mockAuth,
    data: {
      userId: 'test-user-123',
      timestamp: new Date(),
      outcome: 'resisted',
      largeField: 'x'.repeat(1048576) // 1MB of data
    },
    shouldSucceed: false
  },
  {
    name: 'User cannot access non-existent collection',
    collection: 'unauthorized_collection',
    documentId: 'doc-123',
    operation: 'read',
    auth: mockAuth,
    shouldSucceed: false
  }
];

// Test helper functions
function runSecurityTests() {
  console.log('🔒 Running Firestore Security Rules Tests...\n');
  
  let passedTests = 0;
  let failedTests = 0;
  
  testScenarios.forEach((scenario, index) => {
    console.log(`Test ${index + 1}: ${scenario.name}`);
    
    try {
      // Simulate the security rule evaluation
      const result = evaluateSecurityRule(scenario);
      
      if (result === scenario.shouldSucceed) {
        console.log(`✅ PASS - Expected: ${scenario.shouldSucceed}, Got: ${result}`);
        passedTests++;
      } else {
        console.log(`❌ FAIL - Expected: ${scenario.shouldSucceed}, Got: ${result}`);
        failedTests++;
      }
    } catch (error) {
      console.log(`❌ ERROR - ${error.message}`);
      failedTests++;
    }
    
    console.log(''); // Empty line for readability
  });
  
  console.log('📊 Test Results:');
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${failedTests}`);
  console.log(`📈 Success Rate: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`);
}

// Mock security rule evaluation (simplified)
function evaluateSecurityRule(scenario) {
  const { collection, documentId, operation, auth, data, existingData } = scenario;
  
  // Check authentication
  if (!auth) {
    return false;
  }
  
  // Check user ownership for user documents
  if (collection === 'users') {
    if (documentId !== auth.uid) {
      return false;
    }
    
    if (operation === 'create' && data) {
      // Validate user data
      if (data.uid !== documentId) return false;
      if (!data.email || !data.email.includes('@')) return false;
      if (!data.createdAt) return false;
    }
    
    return true;
  }
  
  // Check user ownership for matching pool
  if (collection === 'matchingPool') {
    if (documentId !== auth.uid) {
      return false;
    }
    
    if (operation === 'create' && data) {
      if (data.userId !== auth.uid) return false;
      if (!data.createdAt) return false;
      if (!['waiting', 'matched', 'inactive'].includes(data.status)) return false;
    }
    
    return true;
  }
  
  // Check buddy pairs access
  if (collection === 'buddyPairs') {
    if (operation === 'read' && existingData) {
      return existingData.user1Id === auth.uid || existingData.user2Id === auth.uid;
    }
    
    if (operation === 'create' && data) {
      if (data.user1Id !== auth.uid && data.user2Id !== auth.uid) return false;
      if (data.user1Id === data.user2Id) return false;
      if (!data.createdAt) return false;
    }
    
    return true;
  }
  
  // Check behavioral data access
  if (collection.startsWith('behavioral_')) {
    if (operation === 'create' && data) {
      if (data.userId !== auth.uid) return false;
      if (!data.timestamp) return false;
      
      // Validate specific fields based on collection
      if (collection === 'behavioral_cravings') {
        if (!['resisted', 'relapsed'].includes(data.outcome)) return false;
        if (data.strength && (data.strength < 0 || data.strength > 10)) return false;
      }
      
      // Check document size (simplified)
      const dataSize = JSON.stringify(data).length;
      if (dataSize > 1048576) return false; // 1MB limit
    }
    
    if (operation === 'read' && existingData) {
      return existingData.userId === auth.uid;
    }
    
    return true;
  }
  
  // Deny access to unknown collections
  return false;
}

// Run the tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runSecurityTests, testScenarios };
} else {
  runSecurityTests();
}
