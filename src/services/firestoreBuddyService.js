/* Firestore Buddy Matching Service - Phase 1 Implementation */
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  writeBatch,
  Timestamp,
  serverTimestamp 
} from 'firebase/firestore';

class FirestoreBuddyService {
  constructor(firestore) {
    if (!firestore) {
      throw new Error('Firestore instance is required for FirestoreBuddyService');
    }
    
    this.firestore = firestore;
    this.matchingPoolCollection = collection(firestore, 'matchingPool');
    this.buddyPairsCollection = collection(firestore, 'buddyPairs');
    
    console.log('🚀 FirestoreBuddyService initialized with Firestore instance:', !!firestore);
    console.log('📁 Collections configured:', {
      matchingPool: this.matchingPoolCollection.path,
      buddyPairs: this.buddyPairsCollection.path
    });
  }

  /**
   * Add a user to the Firestore matching pool
   * @param {string} userId - Firebase Auth UID
   * @param {Object} userData - User profile data for matching
   * @returns {Promise<boolean>} - Success status
   */
  async addToMatchingPool(userId, userData) {
    try {
      console.log('🔄 Firestore: Adding user to matching pool:', userId);
      
      // Prepare user data for Firestore
      const matchingPoolData = {
        userId,
        ...userData,
        createdAt: serverTimestamp(),
        lastActive: serverTimestamp(),
        status: 'waiting'
      };

      // Use setDoc to create/update the document
      await setDoc(doc(this.matchingPoolCollection, userId), matchingPoolData);
      
      console.log('✅ Firestore: User successfully added to matching pool:', userId);
      return true;
      
    } catch (error) {
      console.error('❌ Firestore: Failed to add user to matching pool:', error);
      console.error('❌ Error details:', {
        code: error.code,
        message: error.message,
        userId,
        userData: Object.keys(userData || {})
      });
      return false;
    }
  }

  /**
   * Remove a user from the Firestore matching pool
   * @param {string} userId - Firebase Auth UID
   * @returns {Promise<boolean>} - Success status
   */
  async removeFromMatchingPool(userId) {
    try {
      console.log('🔄 Firestore: Removing user from matching pool:', userId);
      
      await deleteDoc(doc(this.matchingPoolCollection, userId));
      
      console.log('✅ Firestore: User successfully removed from matching pool:', userId);
      return true;
      
    } catch (error) {
      console.error('❌ Firestore: Failed to remove user from matching pool:', error);
      console.error('❌ Error details:', {
        code: error.code,
        message: error.message,
        userId
      });
      return false;
    }
  }

  /**
   * Create a buddy pair in Firestore
   * @param {string} user1Id - First user's Firebase Auth UID
   * @param {string} user2Id - Second user's Firebase Auth UID
   * @param {Object} pairData - Additional pair information
   * @returns {Promise<string|null>} - Document ID if successful, null if failed
   */
  async createBuddyPair(user1Id, user2Id, pairData = {}) {
    try {
      console.log('🔄 Firestore: Creating buddy pair:', { user1Id, user2Id });
      
      const buddyPairData = {
        user1Id,
        user2Id,
        createdAt: serverTimestamp(),
        status: 'active',
        ...pairData
      };

      // Add the document to get an auto-generated ID
      const docRef = await addDoc(this.buddyPairsCollection, buddyPairData);
      
      console.log('✅ Firestore: Buddy pair created successfully:', docRef.id);
      return docRef.id;
      
    } catch (error) {
      console.error('❌ Firestore: Failed to create buddy pair:', error);
      console.error('❌ Error details:', {
        code: error.code,
        message: error.message,
        user1Id,
        user2Id
      });
      return null;
    }
  }

  /**
   * Get all users currently in the Firestore matching pool
   * @returns {Promise<Array>} - Array of user data objects
   */
  async getAllMatchingPoolUsers() {
    try {
      console.log('🔄 Firestore: Fetching all matching pool users');
      
      const querySnapshot = await getDocs(this.matchingPoolCollection);
      const users = [];
      
      querySnapshot.forEach((doc) => {
        users.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      console.log('✅ Firestore: Retrieved', users.length, 'users from matching pool');
      return users;
      
    } catch (error) {
      console.error('❌ Firestore: Failed to fetch matching pool users:', error);
      console.error('❌ Error details:', {
        code: error.code,
        message: error.message
      });
      return [];
    }
  }

  /**
   * Get a specific user from the Firestore matching pool
   * @param {string} userId - Firebase Auth UID
   * @returns {Promise<Object|null>} - User data or null if not found
   */
  async getMatchingPoolUser(userId) {
    try {
      console.log('🔄 Firestore: Fetching user from matching pool:', userId);
      
      const docRef = doc(this.matchingPoolCollection, userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const userData = { id: docSnap.id, ...docSnap.data() };
        console.log('✅ Firestore: User found in matching pool:', userId);
        return userData;
      } else {
        console.log('ℹ️ Firestore: User not found in matching pool:', userId);
        return null;
      }
      
    } catch (error) {
      console.error('❌ Firestore: Failed to fetch user from matching pool:', error);
      console.error('❌ Error details:', {
        code: error.code,
        message: error.message,
        userId
      });
      return null;
    }
  }

  /**
   * Test Firestore connectivity by writing a test document
   * @returns {Promise<boolean>} - Success status
   */
  async testConnectivity() {
    try {
      console.log('🧪 Firestore: Testing connectivity...');
      
      const testCollection = collection(this.firestore, 'connectionTest');
      const testDoc = doc(testCollection, 'test-' + Date.now());
      
      const testData = {
        test: true,
        timestamp: serverTimestamp(),
        message: 'Firestore connectivity test',
        service: 'FirestoreBuddyService'
      };

      await setDoc(testDoc, testData);
      console.log('✅ Firestore: Connectivity test successful');
      
      // Clean up test document
      await deleteDoc(testDoc);
      console.log('🧹 Firestore: Test document cleaned up');
      
      return true;
      
    } catch (error) {
      console.error('❌ Firestore: Connectivity test failed:', error);
      console.error('❌ Error details:', {
        code: error.code,
        message: error.message
      });
      return false;
    }
  }

  /**
   * Get service status and configuration
   * @returns {Object} - Service status information
   */
  getServiceStatus() {
    return {
      firestore: !!this.firestore,
      matchingPoolCollection: this.matchingPoolCollection?.path || 'not configured',
      buddyPairsCollection: this.buddyPairsCollection?.path || 'not configured',
      timestamp: new Date().toISOString()
    };
  }
}

export default FirestoreBuddyService;
