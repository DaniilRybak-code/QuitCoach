import { ref, get, set, onValue } from 'firebase/database';

/**
 * Centralized Stat Service - Single source of truth for all user stats
 * This service ensures that stats are calculated once, stored in Firebase, 
 * and automatically synced in real-time to all views (user and buddy)
 */
class CentralizedStatService {
  constructor(db, userId) {
    this.db = db;
    this.userId = userId;
    this.statsRef = ref(db, `users/${userId}/stats`);
    this.profileRef = ref(db, `users/${userId}/profile`);
    this.listeners = [];
  }

  /**
   * Calculate and update all stats from scratch based on current user data
   * This is the SINGLE place where stats are calculated
   */
  async refreshAllStats() {
    try {
      console.log(`📊 CentralizedStats: Refreshing all stats for user ${this.userId}`);
      
      // Get current user data
      const [profileSnapshot, statsSnapshot] = await Promise.all([
        get(this.profileRef),
        get(this.statsRef)
      ]);

      const profileData = profileSnapshot.exists() ? profileSnapshot.val() : {};
      const currentStats = statsSnapshot.exists() ? statsSnapshot.val() : this.getDefaultStats();

      // Calculate effective quit date (considering relapses)
      const effectiveQuitDate = this.calculateEffectiveQuitDate(profileData);
      
      // Calculate streak based on effective quit date
      const streakData = this.calculateStreak(effectiveQuitDate);
      
      // Calculate cravings resisted
      const cravingsResisted = await this.calculateCravingsResisted();
      
      // Calculate addiction level (with decay and relapse penalties)
      const addictionLevel = await this.calculateAddictionLevel(profileData, effectiveQuitDate);
      
      // Build final stats object
      const updatedStats = {
        ...currentStats,
        streakDays: streakData.value,
        streakUnit: streakData.unit,
        streakDisplayText: streakData.displayText,
        cravingsResisted: cravingsResisted,
        addictionLevel: addictionLevel,
        lastUpdated: new Date().toISOString()
      };

      // Write to Firebase (single source of truth)
      await set(this.statsRef, updatedStats);
      
      console.log(`✅ CentralizedStats: Stats updated in Firebase for ${this.userId}:`, {
        streak: streakData.displayText,
        cravingsResisted,
        addictionLevel,
        effectiveQuitDate
      });

      return updatedStats;
      
    } catch (error) {
      console.error(`❌ CentralizedStats: Error refreshing stats for ${this.userId}:`, error);
      throw error;
    }
  }

  /**
   * Calculate effective quit date considering relapses
   */
  calculateEffectiveQuitDate(profileData) {
    // Handle special cases for User 2 and User 3
    let baseQuitDate = '2025-09-18T13:56:46.584Z'; // Default for User 2 and 3
    
    if (this.userId === 'uGZGbLUytbfu8W3mQPW0YAvXTQn1') {
      // User 3
      if (profileData.lastRelapseDate) {
        const relapseDate = new Date(profileData.lastRelapseDate);
        const originalDate = new Date(baseQuitDate);
        return relapseDate > originalDate ? profileData.lastRelapseDate : baseQuitDate;
      }
      return baseQuitDate;
    } else if (this.userId === 'AmwwlNyHD5T3WthUbyR6bFL0QkF2') {
      // User 2
      if (profileData.lastRelapseDate) {
        const relapseDate = new Date(profileData.lastRelapseDate);
        const originalDate = new Date(baseQuitDate);
        return relapseDate > originalDate ? profileData.lastRelapseDate : baseQuitDate;
      }
      return baseQuitDate;
    } else {
      // Other users - use their actual quit date
      return profileData.quitDate || new Date().toISOString();
    }
  }

  /**
   * Calculate streak from quit date
   */
  calculateStreak(quitDate) {
    const now = new Date();
    const quit = new Date(quitDate);
    const diffMs = now - quit;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays >= 1) {
      return {
        value: diffDays,
        unit: 'days',
        displayText: `${diffDays} day${diffDays === 1 ? '' : 's'}`
      };
    } else {
      return {
        value: diffHours,
        unit: 'hours',
        displayText: `${diffHours} hour${diffHours === 1 ? '' : 's'}`
      };
    }
  }

  /**
   * Calculate total cravings resisted
   */
  async calculateCravingsResisted() {
    try {
      // Try multiple locations for cravings data
      const [profileCravingsSnapshot, cravingsSnapshot] = await Promise.all([
        get(ref(this.db, `users/${this.userId}/profile/cravingsResisted`)),
        get(ref(this.db, `users/${this.userId}/cravings`))
      ]);
      
      let cravingsResisted = 0;
      
      // Check profile location first
      if (profileCravingsSnapshot.exists()) {
        cravingsResisted = Math.max(0, parseInt(profileCravingsSnapshot.val()) || 0);
        console.log(`📊 CentralizedStats: Found cravings in profile: ${cravingsResisted}`);
      }
      // If not in profile, count from cravings collection
      else if (cravingsSnapshot.exists()) {
        const cravingsData = cravingsSnapshot.val();
        // Count cravings where outcome is 'resisted'
        cravingsResisted = Object.values(cravingsData).filter(craving => 
          craving.outcome === 'resisted'
        ).length;
        console.log(`📊 CentralizedStats: Counted cravings from collection: ${cravingsResisted}`);
      }
      
      return cravingsResisted;
    } catch (error) {
      console.warn(`⚠️ CentralizedStats: Could not get cravings for ${this.userId}:`, error.message);
      return 0;
    }
  }

  /**
   * Calculate addiction level with decay and relapse penalties
   */
  async calculateAddictionLevel(profileData, effectiveQuitDate) {
    // This would integrate with StatManager logic
    // For now, return current value or default
    try {
      const statsSnapshot = await get(this.statsRef);
      if (statsSnapshot.exists()) {
        return statsSnapshot.val().addictionLevel || 50;
      }
      return 50;
    } catch (error) {
      return 50;
    }
  }

  /**
   * Set up real-time listener for this user's stats
   * Returns unsubscribe function
   */
  setupRealTimeListener(callback) {
    const unsubscribe = onValue(this.statsRef, (snapshot) => {
      if (snapshot.exists()) {
        const stats = snapshot.val();
        console.log(`🔄 CentralizedStats: Real-time update for ${this.userId}:`, stats);
        callback(stats);
      }
    });

    this.listeners.push(unsubscribe);
    return unsubscribe;
  }

  /**
   * Get default stats
   */
  getDefaultStats() {
    return {
      mentalStrength: 50,
      motivation: 50,
      triggerDefense: 30,
      addictionLevel: 50,
      streakDays: 0,
      streakUnit: 'hours',
      streakDisplayText: '0 hours',
      cravingsResisted: 0,
      experiencePoints: 0
    };
  }

  /**
   * Clean up listeners
   */
  cleanup() {
    this.listeners.forEach(unsubscribe => unsubscribe());
    this.listeners = [];
  }

  /**
   * Handle relapse - update stats immediately
   */
  async handleRelapse() {
    try {
      console.log(`🔄 CentralizedStats: Handling relapse for ${this.userId}`);
      
      // Update relapse date in profile
      const now = new Date().toISOString();
      await set(ref(this.db, `users/${this.userId}/profile/lastRelapseDate`), now);
      await set(ref(this.db, `users/${this.userId}/profile/relapseDate`), now);
      
      // Refresh all stats based on new relapse
      await this.refreshAllStats();
      
      console.log(`✅ CentralizedStats: Relapse handled and stats updated for ${this.userId}`);
      
    } catch (error) {
      console.error(`❌ CentralizedStats: Error handling relapse for ${this.userId}:`, error);
      throw error;
    }
  }

  /**
   * Handle craving resisted - update stats immediately
   */
  async handleCravingResisted() {
    try {
      console.log(`🔄 CentralizedStats: Handling craving resisted for ${this.userId}`);
      
      // Refresh all stats to update cravings count
      await this.refreshAllStats();
      
      console.log(`✅ CentralizedStats: Craving resistance updated for ${this.userId}`);
      
    } catch (error) {
      console.error(`❌ CentralizedStats: Error handling craving resistance for ${this.userId}:`, error);
      throw error;
    }
  }
}

export default CentralizedStatService;
