// Buddy Matching Service for Real Users - Firestore Version
// Manages the matching pool and buddy pairing using Firestore

import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';

class BuddyMatchingFirestoreService {
  constructor(firestore) {
    this.firestore = firestore;
    this.matchingPoolCollection = collection(firestore, 'matchingPool');
    this.buddyPairsCollection = collection(firestore, 'buddyPairs');
    this.usersCollection = collection(firestore, 'users');
  }

  // ===== MATCHING POOL MANAGEMENT =====

  /**
   * Add user to the matching pool
   * @param {string} userId - User's unique ID
   * @param {Object} userData - User's profile and matching data
   * @returns {Promise<boolean>} Success status
   */
  async addToMatchingPool(userId, userData) {
    try {
      const matchingProfile = {
        userId: userId,
        quitStartDate: userData.quitDate || new Date().toISOString(),
        addictionLevel: userData.stats?.addictionLevel || 50,
        triggers: userData.triggers || [],
        timezone: userData.timezone || 'UTC',
        quitExperience: userData.quitExperience || 'first-timer',
        availableForMatching: true,
        lastActive: serverTimestamp(),
        createdAt: serverTimestamp(),
        // Additional matching criteria
        archetype: userData.archetype || 'DETERMINED',
        dailyPatterns: userData.dailyPatterns || [],
        copingStrategies: userData.copingStrategies || [],
        confidence: userData.confidence || 5,
        // Contact preferences
        preferredContactMethod: 'chat', // chat, voice, video
        availabilityHours: userData.availabilityHours || 'anytime',
        language: userData.language || 'en'
      };

      await setDoc(doc(this.matchingPoolCollection, userId), matchingProfile);
      console.log(`✅ User ${userId} added to matching pool`);
      return true;
    } catch (error) {
      console.error('❌ Error adding user to matching pool:', error);
      return false;
    }
  }

  /**
   * Remove user from matching pool
   * @param {string} userId - User's unique ID
   * @returns {Promise<boolean>} Success status
   */
  async removeFromMatchingPool(userId) {
    try {
      await deleteDoc(doc(this.matchingPoolCollection, userId));
      console.log(`✅ User ${userId} removed from matching pool`);
      return true;
    } catch (error) {
      console.error('❌ Error removing user from matching pool:', error);
      return false;
    }
  }

  /**
   * Update user's matching availability
   * @param {string} userId - User's unique ID
   * @param {boolean} available - Whether user is available for matching
   * @returns {Promise<boolean>} Success status
   */
  async updateMatchingAvailability(userId, available) {
    try {
      await updateDoc(doc(this.matchingPoolCollection, userId), {
        availableForMatching: available,
        lastActive: serverTimestamp()
      });
      console.log(`✅ User ${userId} matching availability updated to: ${available}`);
      return true;
    } catch (error) {
      console.error('❌ Error updating matching availability:', error);
      return false;
    }
  }

  /**
   * Update user's last active timestamp
   * @param {string} userId - User's unique ID
   * @returns {Promise<boolean>} Success status
   */
  async updateLastActive(userId) {
    try {
      await updateDoc(doc(this.matchingPoolCollection, userId), {
        lastActive: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('❌ Error updating last active:', error);
      return false;
    }
  }

  // ===== BUDDY MATCHING ALGORITHM =====

  /**
   * Find compatible buddy matches for a user
   * @param {string} userId - User's unique ID
   * @param {number} limit - Maximum number of matches to return
   * @returns {Promise<Array>} Array of compatible matches
   */
  async findCompatibleMatches(userId, limit = 5) {
    try {
      // Get user's matching profile
      const userDoc = await getDoc(doc(this.matchingPoolCollection, userId));
      if (!userDoc.exists()) {
        console.log('❌ User not found in matching pool');
        return [];
      }

      const userProfile = userDoc.data();
      
      // Query for available users in matching pool
      const availableUsersQuery = query(
        this.matchingPoolCollection,
        where('availableForMatching', '==', true),
        where('userId', '!=', userId)
      );

      const poolSnapshot = await getDocs(availableUsersQuery);
      if (poolSnapshot.empty) {
        console.log('❌ No available users in matching pool');
        return [];
      }

      const matches = [];

      // Calculate compatibility scores for each potential match
      poolSnapshot.forEach(doc => {
        const potentialProfile = doc.data();
        const compatibilityScore = this.calculateCompatibilityScore(userProfile, potentialProfile);
        
        if (compatibilityScore >= 0.6) { // Minimum 60% compatibility
          matches.push({
            userId: potentialProfile.userId,
            profile: potentialProfile,
            compatibilityScore: compatibilityScore,
            matchReasons: this.getMatchReasons(userProfile, potentialProfile)
          });
        }
      });

      // Sort by compatibility score (highest first) and return top matches
      matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
      return matches.slice(0, limit);

    } catch (error) {
      console.error('❌ Error finding compatible matches:', error);
      return [];
    }
  }

  /**
   * Calculate compatibility score between two users (0-1)
   * @param {Object} user1 - First user's profile
   * @param {Object} user2 - Second user's profile
   * @returns {number} Compatibility score (0-1)
   */
  calculateCompatibilityScore(user1, user2) {
    let totalScore = 0;
    let maxScore = 0;

    // Primary matching criteria (weighted heavily)
    
    // Quit start date proximity (closer dates = higher score)
    const date1 = new Date(user1.quitStartDate);
    const date2 = new Date(user2.quitStartDate);
    const daysDifference = Math.abs(date1 - date2) / (1000 * 60 * 60 * 24);
    const dateScore = Math.max(0, 1 - (daysDifference / 30)); // 30 days = 0 score
    totalScore += dateScore * 0.3; // 30% weight
    maxScore += 0.3;

    // Addiction level similarity
    const addictionDiff = Math.abs(user1.addictionLevel - user2.addictionLevel);
    const addictionScore = Math.max(0, 1 - (addictionDiff / 100));
    totalScore += addictionScore * 0.25; // 25% weight
    maxScore += 0.25;

    // Timezone compatibility
    const timezoneScore = user1.timezone === user2.timezone ? 1 : 0.5;
    totalScore += timezoneScore * 0.2; // 20% weight
    maxScore += 0.2;

    // Quit experience compatibility
    const experienceScore = user1.quitExperience === user2.quitExperience ? 1 : 0.7;
    totalScore += experienceScore * 0.15; // 15% weight
    maxScore += 0.15;

    // Secondary matching criteria (bonus points)
    
    // Shared triggers
    const sharedTriggers = user1.triggers.filter(trigger => 
      user2.triggers.includes(trigger)
    ).length;
    const triggerScore = Math.min(1, sharedTriggers / Math.max(user1.triggers.length, 1));
    totalScore += triggerScore * 0.1; // 10% bonus
    maxScore += 0.1;

    return totalScore / maxScore;
  }

  /**
   * Get reasons why two users are a good match
   * @param {Object} user1 - First user's profile
   * @param {Object} user2 - Second user's profile
   * @returns {Array} Array of match reasons
   */
  getMatchReasons(user1, user2) {
    const reasons = [];

    // Quit date proximity
    const date1 = new Date(user1.quitStartDate);
    const date2 = new Date(user2.quitStartDate);
    const daysDifference = Math.abs(date1 - date2) / (1000 * 60 * 60 * 24);
    if (daysDifference <= 7) {
      reasons.push('Started quitting around the same time');
    } else if (daysDifference <= 30) {
      reasons.push('Similar quit journey timeline');
    }

    // Addiction level
    const addictionDiff = Math.abs(user1.addictionLevel - user2.addictionLevel);
    if (addictionDiff <= 10) {
      reasons.push('Similar addiction levels');
    }

    // Timezone
    if (user1.timezone === user2.timezone) {
      reasons.push('Same timezone for easy communication');
    }

    // Experience level
    if (user1.quitExperience === user2.quitExperience) {
      reasons.push(`Both ${user1.quitExperience}s`);
    }

    // Shared triggers
    const sharedTriggers = user1.triggers.filter(trigger => 
      user2.triggers.includes(trigger)
    );
    if (sharedTriggers.length > 0) {
      reasons.push(`Shared triggers: ${sharedTriggers.join(', ')}`);
    }

    return reasons;
  }

  // ===== BUDDY PAIRING =====

  /**
   * Create a buddy pair between two users
   * @param {string} user1Id - First user's ID
   * @param {string} user2Id - Second user's ID
   * @param {Object} matchData - Additional match information
   * @returns {Promise<string|null>} Pair ID or null
   */
  async createBuddyPair(user1Id, user2Id, matchData = {}) {
    try {
      const pairData = {
        users: [user1Id, user2Id],
        matchedAt: serverTimestamp(),
        compatibilityScore: matchData.compatibilityScore || 0,
        matchReasons: matchData.matchReasons || [],
        status: 'active',
        lastMessageAt: serverTimestamp()
      };

      // Create the buddy pair
      const pairDoc = await addDoc(this.buddyPairsCollection, pairData);
      const pairId = pairDoc.id;

      // Remove both users from matching pool
      await Promise.all([
        this.removeFromMatchingPool(user1Id),
        this.removeFromMatchingPool(user2Id)
      ]);

      // Update user profiles to show they have a buddy
      await Promise.all([
        updateDoc(doc(this.usersCollection, user1Id), {
          buddyInfo: {
            hasBuddy: true,
            buddyId: user2Id,
            pairId: pairId,
            matchedAt: pairData.matchedAt
          }
        }),
        updateDoc(doc(this.usersCollection, user2Id), {
          buddyInfo: {
            hasBuddy: true,
            buddyId: user1Id,
            pairId: pairId,
            matchedAt: pairData.matchedAt
          }
        })
      ]);

      console.log(`✅ Buddy pair created between ${user1Id} and ${user2Id}`);
      return pairId;

    } catch (error) {
      console.error('❌ Error creating buddy pair:', error);
      return null;
    }
  }

  /**
   * Get user's current buddy information
   * @param {string} userId - User's unique ID
   * @returns {Promise<Object|null>} Buddy information or null
   */
  async getUserBuddyInfo(userId) {
    try {
      const userDoc = await getDoc(doc(this.usersCollection, userId));
      if (!userDoc.exists()) {
        return null;
      }
      return userDoc.data().buddyInfo || null;
    } catch (error) {
      console.error('❌ Error getting user buddy info:', error);
      return null;
    }
  }

  /**
   * Get buddy pair information
   * @param {string} pairId - Buddy pair ID
   * @returns {Promise<Object|null>} Pair information or null
   */
  async getBuddyPairInfo(pairId) {
    try {
      const pairDoc = await getDoc(doc(this.buddyPairsCollection, pairId));
      if (!pairDoc.exists()) {
        return null;
      }
      return { id: pairDoc.id, ...pairDoc.data() };
    } catch (error) {
      console.error('❌ Error getting buddy pair info:', error);
      return null;
    }
  }

  // ===== POOL MAINTENANCE =====

  /**
   * Clean up inactive users from matching pool
   * @param {number} daysInactive - Number of days of inactivity to trigger removal
   * @returns {Promise<number>} Number of users removed
   */
  async cleanupInactiveUsers(daysInactive = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysInactive);
      const cutoffTimestamp = Timestamp.fromDate(cutoffDate);

      // Query for inactive users
      const inactiveUsersQuery = query(
        this.matchingPoolCollection,
        where('lastActive', '<', cutoffTimestamp)
      );

      const inactiveSnapshot = await getDocs(inactiveUsersQuery);
      let removedCount = 0;

      // Remove inactive users
      const removePromises = inactiveSnapshot.docs.map(async (doc) => {
        await deleteDoc(doc.ref);
        removedCount++;
      });

      await Promise.all(removePromises);

      console.log(`✅ Cleaned up ${removedCount} inactive users from matching pool`);
      return removedCount;

    } catch (error) {
      console.error('❌ Error cleaning up inactive users:', error);
      return 0;
    }
  }

  /**
   * Get matching pool statistics
   * @returns {Promise<Object>} Pool statistics
   */
  async getMatchingPoolStats() {
    try {
      const poolSnapshot = await getDocs(this.matchingPoolCollection);
      if (poolSnapshot.empty) {
        return {
          totalUsers: 0,
          availableUsers: 0,
          averageAddictionLevel: 0,
          topTriggers: [],
          timezoneDistribution: {}
        };
      }

      const users = poolSnapshot.docs.map(doc => doc.data());
      
      const stats = {
        totalUsers: users.length,
        availableUsers: users.filter(u => u.availableForMatching).length,
        averageAddictionLevel: users.reduce((sum, u) => sum + (u.addictionLevel || 0), 0) / users.length,
        topTriggers: this.getTopTriggers(users),
        timezoneDistribution: this.getTimezoneDistribution(users),
        quitExperienceDistribution: this.getQuitExperienceDistribution(users)
      };

      return stats;

    } catch (error) {
      console.error('❌ Error getting matching pool stats:', error);
      return null;
    }
  }

  /**
   * Get top triggers among users in matching pool
   * @param {Array} users - Array of user profiles
   * @returns {Array} Top triggers with counts
   */
  getTopTriggers(users) {
    const triggerCounts = {};
    
    users.forEach(user => {
      user.triggers?.forEach(trigger => {
        triggerCounts[trigger] = (triggerCounts[trigger] || 0) + 1;
      });
    });

    return Object.entries(triggerCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([trigger, count]) => ({ trigger, count }));
  }

  /**
   * Get timezone distribution among users
   * @param {Array} users - Array of user profiles
   * @returns {Object} Timezone distribution
   */
  getTimezoneDistribution(users) {
    const distribution = {};
    
    users.forEach(user => {
      const timezone = user.timezone || 'Unknown';
      distribution[timezone] = (distribution[timezone] || 0) + 1;
    });

    return distribution;
  }

  /**
   * Get quit experience distribution among users
   * @param {Array} users - Array of user profiles
   * @returns {Object} Experience distribution
   */
  getQuitExperienceDistribution(users) {
    const distribution = {};
    
    users.forEach(user => {
      const experience = user.quitExperience || 'unknown';
      distribution[experience] = (distribution[experience] || 0) + 1;
    });

    return distribution;
  }

  // ===== REAL-TIME LISTENERS =====

  /**
   * Listen for changes in user's matching pool status
   * @param {string} userId - User's unique ID
   * @param {Function} callback - Callback function for updates
   * @returns {Function} Unsubscribe function
   */
  listenToMatchingPoolStatus(userId, callback) {
    return onSnapshot(doc(this.matchingPoolCollection, userId), (doc) => {
      if (doc.exists()) {
        callback(doc.data());
      } else {
        callback(null);
      }
    });
  }

  /**
   * Listen for changes in buddy pair information
   * @param {string} pairId - Buddy pair ID
   * @param {Function} callback - Callback function for updates
   * @returns {Function} Unsubscribe function
   */
  listenToBuddyPair(pairId, callback) {
    return onSnapshot(doc(this.buddyPairsCollection, pairId), (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() });
      } else {
        callback(null);
      }
    });
  }
}

export default BuddyMatchingFirestoreService;
