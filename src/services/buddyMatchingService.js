// Buddy Matching Service for Real Users
// Manages the matching pool and buddy pairing using Firebase Realtime Database

import { ref, set, get, push, remove, query, orderByChild, equalTo, limitToFirst, onValue, off } from 'firebase/database';

class BuddyMatchingService {
  constructor(db) {
    this.db = db;
    this.matchingPoolRef = ref(db, 'matchingPool');
    this.buddyPairsRef = ref(db, 'buddyPairs');
    this.usersRef = ref(db, 'users');
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
        lastActive: new Date().toISOString(),
        createdAt: new Date().toISOString(),
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

      await set(ref(this.db, `matchingPool/${userId}`), matchingProfile);
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
      await remove(ref(this.db, `matchingPool/${userId}`));
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
      await set(ref(this.db, `matchingPool/${userId}/availableForMatching`), available);
      await set(ref(this.db, `matchingPool/${userId}/lastActive`), new Date().toISOString());
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
      await set(ref(this.db, `matchingPool/${userId}/lastActive`), new Date().toISOString());
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
      const userSnapshot = await get(ref(this.db, `matchingPool/${userId}`));
      if (!userSnapshot.exists()) {
        console.log('❌ User not found in matching pool');
        return [];
      }

      const userProfile = userSnapshot.val();
      
      // Get all available users in matching pool
      const poolSnapshot = await get(this.matchingPoolRef);
      if (!poolSnapshot.exists()) {
        console.log('❌ No users in matching pool');
        return [];
      }

      const allUsers = poolSnapshot.val();
      const matches = [];

      // Calculate compatibility scores for each potential match
      for (const [potentialUserId, potentialProfile] of Object.entries(allUsers)) {
        if (potentialUserId === userId || !potentialProfile.availableForMatching) {
          continue; // Skip self and unavailable users
        }

        const compatibilityScore = this.calculateCompatibilityScore(userProfile, potentialProfile);
        
        if (compatibilityScore >= 0.6) { // Minimum 60% compatibility
          matches.push({
            userId: potentialUserId,
            profile: potentialProfile,
            compatibilityScore: compatibilityScore,
            matchReasons: this.getMatchReasons(userProfile, potentialProfile)
          });
        }
      }

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
   * @returns {Promise<boolean>} Success status
   */
  async createBuddyPair(user1Id, user2Id, matchData = {}) {
    try {
      const pairId = push(this.buddyPairsRef).key;
      const pairData = {
        pairId: pairId,
        users: [user1Id, user2Id],
        matchedAt: new Date().toISOString(),
        compatibilityScore: matchData.compatibilityScore || 0,
        matchReasons: matchData.matchReasons || [],
        status: 'active',
        lastMessageAt: new Date().toISOString(),
        // Remove both users from matching pool
        user1RemovedFromPool: false,
        user2RemovedFromPool: false
      };

      // Create the buddy pair
      await set(ref(this.db, `buddyPairs/${pairId}`), pairData);

      // Remove both users from matching pool
      await Promise.all([
        this.removeFromMatchingPool(user1Id),
        this.removeFromMatchingPool(user2Id)
      ]);

      // Update user profiles to show they have a buddy
      await Promise.all([
        set(ref(this.db, `users/${user1Id}/buddyInfo`), {
          hasBuddy: true,
          buddyId: user2Id,
          pairId: pairId,
          matchedAt: pairData.matchedAt
        }),
        set(ref(this.db, `users/${user2Id}/buddyInfo`), {
          hasBuddy: true,
          buddyId: user1Id,
          pairId: pairId,
          matchedAt: pairData.matchedAt
        })
      ]);

      console.log(`✅ Buddy pair created between ${user1Id} and ${user2Id}`);
      return true;

    } catch (error) {
      console.error('❌ Error creating buddy pair:', error);
      return false;
    }
  }

  /**
   * Get user's current buddy information
   * @param {string} userId - User's unique ID
   * @returns {Promise<Object|null>} Buddy information or null
   */
  async getUserBuddyInfo(userId) {
    try {
      const userSnapshot = await get(ref(this.db, `users/${userId}/buddyInfo`));
      if (!userSnapshot.exists()) {
        return null;
      }
      return userSnapshot.val();
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
      const pairSnapshot = await get(ref(this.db, `buddyPairs/${pairId}`));
      if (!pairSnapshot.exists()) {
        return null;
      }
      return pairSnapshot.val();
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
      const poolSnapshot = await get(this.matchingPoolRef);
      if (!poolSnapshot.exists()) {
        return 0;
      }

      const allUsers = poolSnapshot.val();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysInactive);

      let removedCount = 0;

      for (const [userId, userProfile] of Object.entries(allUsers)) {
        const lastActive = new Date(userProfile.lastActive);
        if (lastActive < cutoffDate) {
          await this.removeFromMatchingPool(userId);
          removedCount++;
        }
      }

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
      const poolSnapshot = await get(this.matchingPoolRef);
      if (!poolSnapshot.exists()) {
        return {
          totalUsers: 0,
          availableUsers: 0,
          averageAddictionLevel: 0,
          topTriggers: [],
          timezoneDistribution: {}
        };
      }

      const allUsers = poolSnapshot.val();
      const users = Object.values(allUsers);
      
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
    const userRef = ref(this.db, `matchingPool/${userId}`);
    
    const unsubscribe = onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val());
      } else {
        callback(null);
      }
    });

    return unsubscribe;
  }

  /**
   * Listen for changes in buddy pair information
   * @param {string} pairId - Buddy pair ID
   * @param {Function} callback - Callback function for updates
   * @returns {Function} Unsubscribe function
   */
  listenToBuddyPair(pairId, callback) {
    const pairRef = ref(this.db, `buddyPairs/${pairId}`);
    
    const unsubscribe = onValue(pairRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val());
      } else {
        callback(null);
      }
    });

    return unsubscribe;
  }
}

export default BuddyMatchingService;
