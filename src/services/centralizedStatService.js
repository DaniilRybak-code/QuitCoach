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
      
      // Generate Special Features based on onboarding data
      const specialFeatures = await this.generateSpecialFeatures(profileData);
      
      // Build final stats object
      const updatedStats = {
        ...currentStats,
        streakDays: streakData.value,
        streakUnit: streakData.unit,
        streakDisplayText: streakData.displayText,
        cravingsResisted: cravingsResisted,
        addictionLevel: addictionLevel,
        specialFeatures: specialFeatures, // Add Special Features to centralized stats
        lastUpdated: new Date().toISOString()
      };

      // Write to Firebase (single source of truth)
      await set(this.statsRef, updatedStats);
      
      console.log(`✅ CentralizedStats: Stats updated in Firebase for ${this.userId}:`, {
        streak: streakData.displayText,
        cravingsResisted,
        addictionLevel,
        specialFeatures: specialFeatures?.length || 0,
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
   * Generate Special Features based on user's onboarding data
   */
  async generateSpecialFeatures(profileData) {
    try {
      // Check if features are already stored
      const existingFeaturesSnapshot = await get(ref(this.db, `users/${this.userId}/specialFeatures`));
      if (existingFeaturesSnapshot.exists()) {
        const features = existingFeaturesSnapshot.val();
        if (Array.isArray(features) && features.length > 0) {
          console.log(`📊 CentralizedStats: Using existing Special Features for ${this.userId}:`, features);
          return features;
        }
      }

      // Generate features from onboarding data - check multiple locations
      let triggers = profileData.triggers || [];
      let dailyPatterns = profileData.dailyPatterns || [];
      let copingStrategies = profileData.copingStrategies || [];

      // If not found in profile, check root user object
      if (triggers.length === 0 || dailyPatterns.length === 0 || copingStrategies.length === 0) {
        try {
          const userSnapshot = await get(ref(this.db, `users/${this.userId}`));
          if (userSnapshot.exists()) {
            const userData = userSnapshot.val();
            triggers = triggers.length > 0 ? triggers : (userData.triggers || []);
            dailyPatterns = dailyPatterns.length > 0 ? dailyPatterns : (userData.dailyPatterns || []);
            copingStrategies = copingStrategies.length > 0 ? copingStrategies : (userData.copingStrategies || []);
            
            console.log(`📊 CentralizedStats: Found onboarding data for ${this.userId}:`, {
              triggers: triggers.length,
              dailyPatterns: dailyPatterns.length,
              copingStrategies: copingStrategies.length
            });
          }
        } catch (error) {
          console.warn(`⚠️ CentralizedStats: Could not read user onboarding data for ${this.userId}:`, error.message);
        }
      }

      const features = [];

      // Special Features categorized by onboarding response types
      const SPECIAL_FEATURES = {
        triggers: [
          'Stress Vaper', 'Social Smoker', 'Coffee Companion', 'Work Breaker',
          'Gaming Buddy', 'Party Animal', 'Peer Pressure', 'Celebration Trigger',
          'Anxiety Soother', 'Focus Enhancer', 'Boredom Fighter', 'Emotional Support'
        ],
        dailyPatterns: [
          'Night Owl', 'Morning Struggler', 'Weekend Warrior', 'Routine Builder',
          'Habit Former', 'Work Breaker', 'Coffee Companion', 'Party Animal'
        ],
        copingStrategies: [
          'First Timer', 'Veteran Quitter', 'Cold Turkey', 'Gradual Reduction',
          'Stress Reliever', 'Mood Stabilizer', 'Reward Seeker', 'Social Lubricant'
        ]
      };

      console.log(`📊 CentralizedStats: Generating features from onboarding data for ${this.userId}:`, {
        triggers,
        dailyPatterns,
        copingStrategies
      });

      // Generate features based on triggers
      if (triggers.includes('Stress/anxiety')) features.push('Stress Vaper');
      if (triggers.includes('Social situations')) features.push('Social Smoker');
      if (triggers.includes('Boredom')) features.push('Boredom Fighter');
      if (triggers.includes('After meals')) features.push('Coffee Companion');
      if (triggers.includes('Work breaks')) features.push('Work Breaker');

      // Generate features based on daily patterns
      if (dailyPatterns.includes('Evening wind-down')) features.push('Night Owl');
      if (dailyPatterns.includes('Morning routine')) features.push('Morning Struggler');
      if (dailyPatterns.includes('Social events')) features.push('Party Animal');
      if (dailyPatterns.includes('Work breaks')) features.push('Work Breaker');

      // Generate features based on coping strategies
      if (copingStrategies.includes('Breathing exercises')) features.push('Stress Reliever');
      if (copingStrategies.includes('Exercise/physical activity')) features.push('Health Seeker');
      if (copingStrategies.includes('Nicotine replacement therapy')) features.push('Veteran Quitter');
      if (copingStrategies.includes('Nothing - this is new to me')) features.push('First Timer');

      console.log(`📊 CentralizedStats: Generated ${features.length} personalized features:`, features);

      // Ensure we have at least 4 features, add generic ones if needed
      const genericFeatures = ['Freedom Chaser', 'Nicotine Fighter', 'Health Seeker', 'Willpower Warrior'];
      while (features.length < 4) {
        const randomGeneric = genericFeatures[Math.floor(Math.random() * genericFeatures.length)];
        if (!features.includes(randomGeneric)) {
          features.push(randomGeneric);
        }
      }

      // Limit to 4 features
      const finalFeatures = features.slice(0, 4);

      // Store in Firebase for future use
      await set(ref(this.db, `users/${this.userId}/specialFeatures`), finalFeatures);
      
      console.log(`📊 CentralizedStats: Generated and stored Special Features for ${this.userId}:`, finalFeatures);
      return finalFeatures;

    } catch (error) {
      console.error(`❌ CentralizedStats: Error generating Special Features for ${this.userId}:`, error);
      // Return default features
      return ['Freedom Chaser', 'Nicotine Fighter', 'Health Seeker', 'Willpower Warrior'];
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
