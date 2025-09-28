import { ref, get, set, onValue } from 'firebase/database';
import AuthGuard from './authGuard.js';

/**
 * Centralized Stat Service - Single source of truth for all user stats
 * This service ensures that stats are calculated once, stored in Firebase, 
 * and automatically synced in real-time to all views (user and buddy)
 */
class CentralizedStatService {
  constructor(db, userId, authGuard = null) {
    this.db = db;
    this.userId = userId;
    this.authGuard = authGuard;
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
      // console.log(`📊 CentralizedStats: Refreshing all stats for user ${this.userId}`);
      
      // Get current user data with auth validation
      let profileData, statsData, userRootData;
      
      if (this.authGuard) {
        [profileData, statsData, userRootData] = await Promise.all([
          this.authGuard.databaseGet(`users/${this.userId}/profile`),
          this.authGuard.databaseGet(`users/${this.userId}/stats`),
          this.authGuard.databaseGet(`users/${this.userId}`)
        ]);
      } else {
        const [profileSnapshot, statsSnapshot, userRootSnapshot] = await Promise.all([
          get(this.profileRef),
          get(this.statsRef),
          get(ref(this.db, `users/${this.userId}`))
        ]);
        
        profileData = profileSnapshot.exists() ? profileSnapshot.val() : {};
        statsData = statsSnapshot.exists() ? statsSnapshot.val() : {};
        userRootData = userRootSnapshot.exists() ? userRootSnapshot.val() : {};
      }

      // Merge profile data with fallbacks from root user object to ensure quit date sources exist
      const mergedProfile = {
        ...profileData,
        createdAt: profileData.createdAt || userRootData.createdAt || null,
        quitDate: profileData.quitDate || userRootData.quitDate || userRootData.quitStartDate || null,
        lastQuitDate: profileData.lastQuitDate || userRootData.lastQuitDate || null
      };

      // If the user has no relapse and no quit dates anywhere, seed profile/quitDate with createdAt for a sensible baseline
      if (!mergedProfile.lastRelapseDate && !mergedProfile.quitDate && mergedProfile.createdAt) {
        try {
          await set(ref(this.db, `users/${this.userId}/profile/quitDate`), mergedProfile.createdAt);
          mergedProfile.quitDate = mergedProfile.createdAt;
          console.log(`📊 CentralizedStats: Seeded missing quitDate with createdAt for ${this.userId}: ${mergedProfile.createdAt}`);
        } catch (seedErr) {
          console.warn(`⚠️ CentralizedStats: Could not seed quitDate for ${this.userId}:`, seedErr.message);
        }
      }

      const currentStats = statsData || this.getDefaultStats();

          // Calculate effective quit date (considering relapses)
          const effectiveQuitDate = this.calculateEffectiveQuitDate(mergedProfile);
          
          // Calculate streak based on LATEST RELAPSE DATE (not quit date)
          const streakData = this.calculateStreakFromRelapse(mergedProfile);
          
          // Calculate cravings resisted
          const cravingsResisted = await this.calculateCravingsResisted();
          
          // Calculate addiction level (with decay and relapse penalties)
          const addictionLevel = await this.calculateAddictionLevel(mergedProfile, effectiveQuitDate);
          
          // Calculate mental strength based on cravings resisted (persistent, not daily reset)
          const mentalStrengthData = this.calculateMentalStrength(currentStats, cravingsResisted);
          const mentalStrength = mentalStrengthData.strength;
          const cravingsApplied = mentalStrengthData.cravingsApplied;
          
          // Check and apply milestone bonuses (use relapse-based streak for milestones)
          const milestoneUpdates = await this.checkMilestonesFromRelapse(mergedProfile, currentStats);
          
          // Generate Special Features based on onboarding data
          const specialFeatures = await this.generateSpecialFeatures(mergedProfile);
      
          // Build final stats object
          const updatedStats = {
            ...currentStats,
            ...milestoneUpdates, // Apply any milestone bonuses
            streakDays: streakData.value,
            streakUnit: streakData.unit,
            streakDisplayText: streakData.displayText,
            cravingsResisted: cravingsResisted,
            addictionLevel: addictionLevel,
            mentalStrength: mentalStrength, // Add mental strength calculation
            mentalStrengthCravingsApplied: cravingsApplied, // Track how many cravings have been applied to mental strength
            specialFeatures: specialFeatures, // Add Special Features to centralized stats
            lastUpdated: new Date().toISOString()
          };

      // Write to Firebase (single source of truth)
      if (this.authGuard) {
        await this.authGuard.databaseSet(`users/${this.userId}/stats`, updatedStats);
      } else {
        await set(this.statsRef, updatedStats);
      }
      
      console.log(`✅ CentralizedStats: Stats updated in Firebase for ${this.userId}:`, {
        streak: streakData.displayText,
        cravingsResisted,
        addictionLevel,
        mentalStrength,
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
    const baseQuitDate = profileData.quitDate || null;
    
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
   * Calculate streak from LATEST RELAPSE DATE
   * First 24 hours shown in hours, then in days
   */
  calculateStreakFromRelapse(profileData) {
    const now = new Date();
    
    // Get the latest relapse date
    const lastRelapseDate = profileData.lastRelapseDate;
    
    if (!lastRelapseDate) {
      // If no relapse date, use quit date as fallback
      // Check multiple possible quit date fields
      const quitDate = profileData.lastQuitDate || 
                      profileData.originalQuitDate || 
                      profileData.quitDate || 
                      profileData.createdAt || 
                      null;
      console.log(`📊 CentralizedStats: No relapse date found for ${this.userId}, using quit date: ${quitDate}`);
      if (quitDate) {
        return this.calculateStreak(quitDate);
      }
      // No dates at all – return neutral display without inventing a timestamp
      return { value: 0, unit: 'hours', displayText: '0 hours', streakDays: 0 };
    }
    
    const relapseDate = new Date(lastRelapseDate);
    const diffMs = now - relapseDate;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    // console.log(`📊 CentralizedStats: Streak calculation for ${this.userId}:`);
    // console.log(`  - Last relapse: ${lastRelapseDate}`);
    // console.log(`  - Current time: ${now.toISOString()}`);
    // console.log(`  - Hours since relapse: ${diffHours}`);
    // console.log(`  - Days since relapse: ${diffDays}`);

    // First 24 hours shown in hours, then in days
    if (diffHours < 24) {
      return {
        value: diffHours,
        unit: 'hours',
        displayText: `${diffHours} hour${diffHours === 1 ? '' : 's'}`,
        streakDays: 0
      };
    } else {
      return {
        value: diffDays,
        unit: 'days',
        displayText: `${diffDays} day${diffDays === 1 ? '' : 's'}`,
        streakDays: diffDays
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
        // console.log(`📊 CentralizedStats: Counted cravings from collection: ${cravingsResisted}`);
      }
      
      return cravingsResisted;
    } catch (error) {
      console.warn(`⚠️ CentralizedStats: Could not get cravings for ${this.userId}:`, error.message);
      return 0;
    }
  }

  /**
   * Calculate mental strength based on cravings resisted (persistent, not daily reset)
   * Note: Daily bonus is now handled in handleCravingResisted() to ensure proper capping
   */
  calculateMentalStrength(currentStats, cravingsResisted) {
    try {
      // Get current mental strength or default to 50 (should be set during onboarding)
      const currentMentalStrength = currentStats.mentalStrength || 50;
      const previouslyAppliedCravings = currentStats.mentalStrengthCravingsApplied || 0;
      
      // console.log(`📊 CentralizedStats: Mental strength calculation for ${this.userId}: ${currentMentalStrength} (cravings applied: ${previouslyAppliedCravings}/3)`);
      
      // Return current values without applying daily bonus
      // Daily bonus is handled separately in handleCravingResisted() to ensure proper capping
      return {
        strength: currentMentalStrength,
        cravingsApplied: previouslyAppliedCravings
      };
      
    } catch (error) {
      console.warn(`⚠️ CentralizedStats: Could not calculate mental strength for ${this.userId}:`, error.message);
      return {
        strength: currentStats.mentalStrength || 50,
        cravingsApplied: currentStats.mentalStrengthCravingsApplied || 0
      };
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
   * Check and apply milestone bonuses based on relapse date
   */
  async checkMilestonesFromRelapse(profileData, currentStats) {
    try {
      const now = new Date();
      
      // Get the latest relapse date
      const lastRelapseDate = profileData.lastRelapseDate;
      
      if (!lastRelapseDate) {
        console.log(`📊 CentralizedStats: No relapse date found for ${this.userId}, skipping milestones`);
        return {};
      }
      
      const relapseDate = new Date(lastRelapseDate);
      const cleanDays = Math.floor((now - relapseDate) / (1000 * 60 * 60 * 24));
      
      console.log(`📊 CentralizedStats: Checking milestones for ${this.userId}, clean days since relapse: ${cleanDays}`);
      
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
      console.error(`❌ CentralizedStats: Error checking milestones from relapse for ${this.userId}:`, error);
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
        
        // Reset quit date to relapse time (user starts new quit journey)
        set(ref(this.db, `users/${this.userId}/lastQuitDate`), nowISO),
        set(ref(this.db, `users/${this.userId}/profile/lastQuitDate`), nowISO),
        
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
   * Get current stats without refreshing
   */
  async getCurrentStats() {
    try {
      const statsSnapshot = await get(this.statsRef);
      return statsSnapshot.exists() ? statsSnapshot.val() : this.getDefaultStats();
    } catch (error) {
      console.error(`❌ CentralizedStats: Error getting current stats for ${this.userId}:`, error);
      return this.getDefaultStats();
    }
  }

  /**
   * Handle craving resisted - update stats immediately
   */
  async handleCravingResisted() {
    try {
      console.log(`🔄 CentralizedStats: Handling craving resisted for ${this.userId}`);
      
      // Check if we need to reset daily counter (use dedicated daily date, not global lastUpdated)
      await this.checkAndResetDailyCounter();
      
      // Get current stats to check daily limit
      const currentStats = await this.getCurrentStats();
      const previouslyAppliedCravings = currentStats.mentalStrengthCravingsApplied || 0;
      
      console.log(`🔄 CentralizedStats: Current mental strength cravings applied: ${previouslyAppliedCravings}`);
      
      // Check if we can still apply mental strength bonus (max 3 per day)
      if (previouslyAppliedCravings < 3) {
        // Apply +1 mental strength for this craving
        const newMentalStrength = Math.min(100, (currentStats.mentalStrength || 50) + 1);
        const newCravingsApplied = previouslyAppliedCravings + 1;
        
        // Update stats with new mental strength and cravings applied count
        const statsToUpdate = {
          ...currentStats,
          mentalStrength: newMentalStrength,
          mentalStrengthCravingsApplied: newCravingsApplied,
          // Track the date for the daily counter separately from lastUpdated
          mentalStrengthCravingsAppliedDate: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        };
        
        if (this.authGuard) {
          await this.authGuard.databaseSet(`users/${this.userId}/stats`, statsToUpdate);
        } else {
          await set(this.statsRef, statsToUpdate);
        }
        
        console.log(`✅ CentralizedStats: Applied +1 mental strength (${currentStats.mentalStrength} → ${newMentalStrength}), cravings applied: ${newCravingsApplied}/3`);
        // Refresh all other stats (streak, addiction level, etc.)
        await this.refreshAllStats();
        console.log(`✅ CentralizedStats: Craving resistance updated for ${this.userId}`);
        return { applied: true, cravingsApplied: newCravingsApplied, limitReached: newCravingsApplied >= 3 };
      } else {
        console.log(`📊 CentralizedStats: Daily mental strength limit reached (${previouslyAppliedCravings}/3), no bonus applied`);
        // Still refresh to keep other stats in sync
        await this.refreshAllStats();
        console.log(`✅ CentralizedStats: Craving resistance updated for ${this.userId}`);
        return { applied: false, cravingsApplied: previouslyAppliedCravings, limitReached: true };
      }
      
    } catch (error) {
      console.error(`❌ CentralizedStats: Error handling craving resistance for ${this.userId}:`, error);
      throw error;
    }
  }

  /**
   * Check if daily counter needs to be reset (new day)
   */
  async checkAndResetDailyCounter() {
    try {
      const currentStats = await this.getCurrentStats();
      const appliedDate = currentStats.mentalStrengthCravingsAppliedDate;
      const today = new Date();
      const todayKey = today.toDateString();
      
      if (!appliedDate) {
        // If we don't have a daily stamp, this is the first check today.
        // Reset the counter to 0 and stamp today to avoid carrying over previous days' counts.
        const resetStats = {
          ...currentStats,
          mentalStrengthCravingsApplied: 0,
          mentalStrengthCravingsAppliedDate: today.toISOString(),
          lastUpdated: new Date().toISOString()
        };
        
        if (this.authGuard) {
          await this.authGuard.databaseSet(`users/${this.userId}/stats`, resetStats);
        } else {
          await set(this.statsRef, resetStats);
        }
        console.log(`✅ CentralizedStats: Initialized daily counter for ${this.userId} (reset to 0)`);
        return;
      }
      
      const lastAppliedDate = new Date(appliedDate);
      if (lastAppliedDate.toDateString() !== todayKey) {
        console.log(`🔄 CentralizedStats: New day detected, resetting daily mental strength counter for ${this.userId}`);
        const newDayStats = {
          ...currentStats,
          mentalStrengthCravingsApplied: 0,
          mentalStrengthCravingsAppliedDate: today.toISOString(),
          lastUpdated: new Date().toISOString()
        };
        
        if (this.authGuard) {
          await this.authGuard.databaseSet(`users/${this.userId}/stats`, newDayStats);
        } else {
          await set(this.statsRef, newDayStats);
        }
        console.log(`✅ CentralizedStats: Daily mental strength counter reset for ${this.userId}`);
      }
    } catch (error) {
      console.warn(`⚠️ CentralizedStats: Could not check/reset daily counter for ${this.userId}:`, error.message);
    }
  }
}

export default CentralizedStatService;
