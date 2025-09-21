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
          
          // Check and apply milestone bonuses
          const milestoneUpdates = await this.checkMilestones(effectiveQuitDate, currentStats);
          
          // Generate Special Features based on onboarding data
          const specialFeatures = await this.generateSpecialFeatures(profileData);
      
          // Build final stats object
          const updatedStats = {
            ...currentStats,
            ...milestoneUpdates, // Apply any milestone bonuses
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
   * Calculate effective quit date considering relapses (universal for all users)
   */
  calculateEffectiveQuitDate(profileData) {
    // Use user's actual quit date, or current time if not set
    const baseQuitDate = profileData.quitDate || new Date().toISOString();
    
    // If user has relapsed, use the most recent date (original quit date or last relapse)
    if (profileData.lastRelapseDate) {
      const relapseDate = new Date(profileData.lastRelapseDate);
      const originalDate = new Date(baseQuitDate);
      
      // Use the more recent date as the effective quit date
      const effectiveDate = relapseDate > originalDate ? profileData.lastRelapseDate : baseQuitDate;
      console.log(`📊 CentralizedStats: Effective quit date for ${this.userId}: ${effectiveDate} (original: ${baseQuitDate}, lastRelapse: ${profileData.lastRelapseDate})`);
      return effectiveDate;
    }
    
    console.log(`📊 CentralizedStats: Using base quit date for ${this.userId}: ${baseQuitDate}`);
    return baseQuitDate;
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
    try {
      // Get current stats and relapse data
      const [statsSnapshot, relapseSnapshot, escalationSnapshot] = await Promise.all([
        get(this.statsRef),
        get(ref(this.db, `users/${this.userId}/profile/lastRelapseDate`)),
        get(ref(this.db, `users/${this.userId}/profile/relapseEscalationLevel`))
      ]);

      // Start with current addiction level or default
      let baseAddictionLevel = 50;
      if (statsSnapshot.exists()) {
        baseAddictionLevel = statsSnapshot.val().addictionLevel || 50;
      }

      // If no relapse data exists, return current level
      if (!relapseSnapshot.exists()) {
        console.log(`📊 CentralizedStats: No relapses found, returning base addiction: ${baseAddictionLevel}`);
        return baseAddictionLevel;
      }

      // Calculate relapse penalties using same logic as StatManager
      const lastRelapseDate = new Date(relapseSnapshot.val());
      const now = new Date();
      const daysSinceLastRelapse = Math.floor((now - lastRelapseDate) / (1000 * 60 * 60 * 24));
      
      // Get current escalation level
      const currentEscalationLevel = escalationSnapshot.exists() ? escalationSnapshot.val() : 1;
      
      console.log(`📊 CentralizedStats: Last relapse: ${lastRelapseDate.toISOString()}`);
      console.log(`📊 CentralizedStats: Days since last relapse: ${daysSinceLastRelapse}`);
      console.log(`📊 CentralizedStats: Current escalation level: ${currentEscalationLevel}`);

      // Determine current escalation level based on timing
      let escalationLevel = 1;
      if (daysSinceLastRelapse >= 7) {
        // Reset escalation level after 7+ days clean
        escalationLevel = 1;
        // Update escalation level in Firebase
        await set(ref(this.db, `users/${this.userId}/profile/relapseEscalationLevel`), 1);
      } else {
        // Use current escalation level (will be incremented on next relapse)
        escalationLevel = currentEscalationLevel;
      }

      // Apply weekly decay (-2 points per week clean)
      const weeksClean = Math.floor(daysSinceLastRelapse / 7);
      const decayAmount = weeksClean * 2;
      
      // Calculate final addiction level with decay
      let finalAddictionLevel = Math.max(30, baseAddictionLevel - decayAmount);
      
      console.log(`📊 CentralizedStats: Base addiction: ${baseAddictionLevel}, Weeks clean: ${weeksClean}, Decay: -${decayAmount}, Final: ${finalAddictionLevel}`);
      
      return finalAddictionLevel;
      
    } catch (error) {
      console.error(`❌ CentralizedStats: Error calculating addiction level:`, error);
      return 50;
    }
  }

  /**
   * Check and apply milestone bonuses for clean time achievements
   */
  async checkMilestones(effectiveQuitDate, currentStats) {
    try {
      const now = new Date();
      const quitDate = new Date(effectiveQuitDate);
      const cleanDays = Math.floor((now - quitDate) / (1000 * 60 * 60 * 24));
      
      console.log(`📊 CentralizedStats: Checking milestones for ${this.userId}, clean days: ${cleanDays}`);
      
      // Define milestone requirements
      const milestones = [
        { days: 7, bonus: 5, name: 'First week', key: 'milestone_7' },
        { days: 30, bonus: 10, name: 'First month', key: 'milestone_30' },
        { days: 90, bonus: 15, name: 'Three months', key: 'milestone_90' }
      ];

      let statUpdates = {};
      let milestoneAchieved = false;

      for (const milestone of milestones) {
        if (cleanDays >= milestone.days) {
          // Check if this milestone has already been awarded
          const milestoneRef = ref(this.db, `users/${this.userId}/profile/milestones/${milestone.key}`);
          const milestoneSnapshot = await get(milestoneRef);
          
          if (!milestoneSnapshot.exists()) {
            // Award milestone bonus
            const newMentalStrength = Math.min(100, (currentStats.mentalStrength || 50) + milestone.bonus);
            statUpdates.mentalStrength = newMentalStrength;
            milestoneAchieved = true;
            
            // Mark milestone as achieved
            await set(milestoneRef, {
              achieved: true,
              achievedDate: new Date().toISOString(),
              bonus: milestone.bonus,
              cleanDaysAtAchievement: cleanDays
            });
            
            console.log(`🎉 CentralizedStats: Milestone achieved for ${this.userId}! ${milestone.name} (+${milestone.bonus} Mental Strength)`);
            
            // Show milestone achievement notification
            this.showMilestoneNotification(milestone, cleanDays);
            
            // Only award the highest milestone reached to avoid multiple bonuses in one update
            break;
          }
        }
      }

      return statUpdates;
      
    } catch (error) {
      console.error(`❌ CentralizedStats: Error checking milestones for ${this.userId}:`, error);
      return {};
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
   * Show milestone achievement notification
   */
  showMilestoneNotification(milestone, cleanDays) {
    try {
      // Try to access the global showQuickActionPopup function
      if (typeof window !== 'undefined' && window.showQuickActionPopup) {
        const messages = {
          7: {
            title: '🎉 First Week Milestone!',
            message: `Congratulations! You've been clean for 7 days!\n\n🧠 Mental Strength: +${milestone.bonus} points\n\nYou're building incredible willpower! Keep going! 💪`
          },
          30: {
            title: '🏆 One Month Champion!',
            message: `Amazing! You've reached 30 days clean!\n\n🧠 Mental Strength: +${milestone.bonus} points\n\nYou're proving your strength every day! 🌟`
          },
          90: {
            title: '👑 Three Month Legend!',
            message: `Incredible! You've achieved 90 days clean!\n\n🧠 Mental Strength: +${milestone.bonus} points\n\nYou're a true inspiration! 🎯✨`
          }
        };

        const notification = messages[milestone.days] || {
          title: '🎉 Milestone Achieved!',
          message: `You've reached ${cleanDays} days clean!\n\n🧠 Mental Strength: +${milestone.bonus} points`
        };

        window.showQuickActionPopup(notification.title, notification.message, 'success');
      } else {
        console.log(`🎉 Milestone achieved: ${milestone.name} (+${milestone.bonus} Mental Strength)`);
      }
    } catch (error) {
      console.error('Error showing milestone notification:', error);
    }
  }

  /**
   * Reset all milestones (called when user relapses)
   */
  async resetMilestones() {
    try {
      console.log(`🔄 CentralizedStats: Resetting milestones for ${this.userId} after relapse`);
      
      const milestonesRef = ref(this.db, `users/${this.userId}/profile/milestones`);
      await set(milestonesRef, null); // Remove all milestone achievements
      
      console.log(`✅ CentralizedStats: Milestones reset for ${this.userId} - can be earned again`);
      
    } catch (error) {
      console.error(`❌ CentralizedStats: Error resetting milestones for ${this.userId}:`, error);
    }
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
      
      const now = new Date();
      const nowISO = now.toISOString();
      
      // Get current relapse data to determine escalation level
      const [lastRelapseSnapshot, escalationSnapshot, statsSnapshot] = await Promise.all([
        get(ref(this.db, `users/${this.userId}/profile/lastRelapseDate`)),
        get(ref(this.db, `users/${this.userId}/profile/relapseEscalationLevel`)),
        get(this.statsRef)
      ]);

      let escalationLevel = 1; // Default for first relapse
      
      if (lastRelapseSnapshot.exists()) {
        const lastRelapse = new Date(lastRelapseSnapshot.val());
        const daysSinceLastRelapse = Math.floor((now - lastRelapse) / (1000 * 60 * 60 * 24));
        
        // Get current escalation level
        const currentEscalationLevel = escalationSnapshot.exists() ? escalationSnapshot.val() : 1;
        console.log(`🔄 CentralizedStats: Current escalation level: ${currentEscalationLevel}`);
        console.log(`🔄 CentralizedStats: Days since last relapse: ${daysSinceLastRelapse}`);
        
        // Determine escalation level based on timing
        if (daysSinceLastRelapse >= 7) {
          // First relapse after clean period (7+ days) - reset to 1
          escalationLevel = 1;
          console.log(`🔄 CentralizedStats: After 7+ days clean → escalation level reset to: ${escalationLevel}`);
        } else {
          // Relapse within 7 days - increment from current level
          escalationLevel = currentEscalationLevel + 1;
          console.log(`🔄 CentralizedStats: Within ${daysSinceLastRelapse} days → escalation level: ${currentEscalationLevel} + 1 = ${escalationLevel}`);
        }
      }

      // Apply addiction penalty based on escalation level
      let addictionIncrease = 0;
      switch (escalationLevel) {
        case 1: addictionIncrease = 4; break;  // 1st relapse = +4 points
        case 2: addictionIncrease = 6; break;  // 2nd relapse within 7 days = +6 points
        default: addictionIncrease = 8; break; // 3rd+ relapse = +8 points
      }

      console.log(`🔄 CentralizedStats: Escalation level ${escalationLevel} → addiction increase: +${addictionIncrease}`);

      // Get current stats
      const currentStats = statsSnapshot.exists() ? statsSnapshot.val() : this.getDefaultStats();
      
      // Calculate new stat values
      const newAddictionLevel = Math.max(0, Math.min(100, (currentStats.addictionLevel || 50) + addictionIncrease));
      const newMentalStrength = Math.max(0, Math.min(100, (currentStats.mentalStrength || 50) - 3));
      const newTriggerDefense = Math.max(0, Math.min(100, (currentStats.triggerDefense || 30) - 3));
      
      console.log(`🔄 CentralizedStats: addictionLevel change: ${currentStats.addictionLevel} → ${newAddictionLevel} (+${addictionIncrease})`);
      console.log(`🔄 CentralizedStats: mentalStrength change: ${currentStats.mentalStrength} → ${newMentalStrength} (-3)`);
      console.log(`🔄 CentralizedStats: triggerDefense change: ${currentStats.triggerDefense} → ${newTriggerDefense} (-3)`);

      // Update all data in parallel
      await Promise.all([
        // Update relapse tracking data
        set(ref(this.db, `users/${this.userId}/profile/lastRelapseDate`), nowISO),
        set(ref(this.db, `users/${this.userId}/profile/relapseDate`), nowISO),
        set(ref(this.db, `users/${this.userId}/profile/relapseEscalationLevel`), escalationLevel),
        
        // Reset milestones (user can earn them again after relapse)
        this.resetMilestones(),
        
        // Update stats with relapse penalties
        set(this.statsRef, {
          ...currentStats,
          addictionLevel: newAddictionLevel,
          mentalStrength: newMentalStrength,
          triggerDefense: newTriggerDefense,
          lastUpdated: nowISO
        })
      ]);
      
      console.log(`✅ CentralizedStats: Relapse handled with escalation level ${escalationLevel}, addiction +${addictionIncrease} for ${this.userId}`);
      
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
