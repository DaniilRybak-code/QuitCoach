// Comprehensive Stat Management Service
// Handles all behavioral stat updates based on app's stat modification rules

import { ref, get, set, push, onValue } from 'firebase/database';

class StatManager {
  constructor(db, userUID) {
    this.db = db;
    this.userUID = userUID;
    this.userRef = ref(db, `users/${userUID}`);
    this.statsRef = ref(db, `users/${userUID}/stats`);
    this.profileRef = ref(db, `users/${userUID}/profile`);
    this.behaviorLogRef = ref(db, `users/${userUID}/behaviorLog`);
  }

  // ===== CORE STAT UPDATE METHODS =====

  async updateStat(statName, change, reason = '') {
    try {
      const snapshot = await get(this.statsRef);
      if (!snapshot.exists()) return false;

      const currentStats = snapshot.val();
      const currentValue = currentStats[statName] || 0;
      const newValue = Math.max(0, Math.min(100, currentValue + change));

      // Update the stat
      await set(this.statsRef, {
        ...currentStats,
        [statName]: newValue
      });

      // Log the behavior
      await this.logBehavior(statName, change, reason);

      // Show notification
      this.showStatNotification(statName, change, reason);

      console.log(`${statName}: ${change > 0 ? '+' : ''}${change} (${reason})`);
      return true;
    } catch (error) {
      console.error(`Error updating ${statName}:`, error);
      return false;
    }
  }

  // ===== ADDICTION STAT MANAGEMENT =====

  async updateAddictionFromCleanTime() {
    try {
      const relapseSnapshot = await get(ref(this.db, `users/${this.userUID}/profile/relapseDate`));
      const userSnapshot = await get(this.userRef);
      
      if (!userSnapshot.exists()) return;

      const userData = userSnapshot.val();
      const lastRelapse = relapseSnapshot.exists() ? new Date(relapseSnapshot.val()) : new Date(userData.quitDate || Date.now());
      const now = new Date();
      const cleanWeeks = Math.floor((now - lastRelapse) / (1000 * 60 * 60 * 24 * 7));

      if (cleanWeeks >= 1) {
        // Standard recovery: -2 points per week
        const decrease = cleanWeeks * 2;
        await this.updateStat('addictionLevel', -decrease, `Clean time: ${cleanWeeks} week(s)`);
        
        // Reset penalty level after 7 clean days
        if (cleanWeeks >= 1) {
          await this.resetRelapsePenaltyLevel();
        }
      }
    } catch (error) {
      console.error('Error updating addiction from clean time:', error);
    }
  }

  async handleRelapse() {
    try {
      const now = new Date();
      const lastRelapseSnapshot = await get(ref(this.db, `users/${this.userUID}/profile/relapseDate`));
      
      let penaltyLevel = 1; // Default penalty level
      
      if (lastRelapseSnapshot.exists()) {
        const lastRelapse = new Date(lastRelapseSnapshot.val());
        const daysSinceLastRelapse = Math.floor((now - lastRelapse) / (1000 * 60 * 60 * 24));
        
        // Determine penalty level based on timing
        if (daysSinceLastRelapse <= 3) {
          penaltyLevel = 3; // Third relapse and on
        } else if (daysSinceLastRelapse <= 7) {
          penaltyLevel = 2; // Second relapse within 7 days
        } else {
          penaltyLevel = 1; // First relapse after clean period
        }
      }

      // Apply addiction penalty based on level
      let addictionIncrease = 0;
      switch (penaltyLevel) {
        case 1: addictionIncrease = 4; break;  // First relapse
        case 2: addictionIncrease = 6; break;  // Second relapse
        case 3: addictionIncrease = 8; break;  // Third+ relapse
      }

      // Update stats
      await Promise.all([
        this.updateStat('addictionLevel', addictionIncrease, `Relapse penalty level ${penaltyLevel}`),
        this.updateStat('mentalStrength', -3, 'Relapse setback'),
        this.updateStat('triggerDefense', -3, 'Relapse to known trigger')
      ]);

      // Update relapse date
      await set(ref(this.db, `users/${this.userUID}/profile/relapseDate`), now.toISOString());
      
      // Log relapse behavior
      await this.logBehavior('relapse', penaltyLevel, `Penalty level ${penaltyLevel} - ${addictionIncrease} addiction, -3 mental, -3 trigger defense`);
      
      return true;
    } catch (error) {
      console.error('Error handling relapse:', error);
      return false;
    }
  }

  async resetRelapsePenaltyLevel() {
    try {
      await set(ref(this.db, `users/${this.userUID}/profile/relapsePenaltyLevel`), 1);
      console.log('Relapse penalty level reset');
    } catch (error) {
      console.error('Error resetting relapse penalty level:', error);
    }
  }

  // ===== MENTAL STRENGTH MANAGEMENT =====

  async handleCravingResistance() {
    try {
      await Promise.all([
        this.updateStat('mentalStrength', 1, 'Successful craving resistance'),
        this.updateStat('triggerDefense', 3, 'Surviving trigger situation')
      ]);

      // Track app usage during cravings
      await this.trackAppUsageDuringCravings();
      
      return true;
    } catch (error) {
      console.error('Error handling craving resistance:', error);
      return false;
    }
  }

  async handleCravingLogged() {
    try {
      await Promise.all([
        this.updateStat('motivation', 0.25, 'Craving awareness and tracking'),
        this.updateStat('triggerDefense', 0.25, 'Craving awareness and tracking')
      ]);
      
      return true;
    } catch (error) {
      console.error('Error handling craving logged:', error);
      return false;
    }
  }

  async handleBreathingExercise() {
    try {
      const today = new Date().toDateString();
      await set(ref(this.db, `users/${this.userUID}/profile/daily/${today}/breathing`), true);
      
      // Check for 3-day streak
      const streak = await this.checkBreathingStreak();
      if (streak >= 3) {
        await this.updateStat('mentalStrength', 1, '3-day breathing exercise streak');
      }
      
      return true;
    } catch (error) {
      console.error('Error handling breathing exercise:', error);
      return false;
    }
  }

  async handleHydrationUpdate(glasses) {
    try {
      const today = new Date().toDateString();
      await set(ref(this.db, `users/${this.userUID}/profile/daily/${today}/water`), glasses);
      
      // Check for 3-day hydration streak
      const streak = await this.checkHydrationStreak();
      if (streak >= 3) {
        await this.updateStat('mentalStrength', 1, '3-day hydration streak');
      }
      
      return true;
    } catch (error) {
      console.error('Error handling hydration update:', error);
      return false;
    }
  }

  async checkMilestoneBonuses() {
    try {
      const relapseSnapshot = await get(ref(this.db, `users/${this.userUID}/profile/relapseDate`));
      const userSnapshot = await get(this.userRef);
      
      if (!userSnapshot.exists()) return;

      const userData = userSnapshot.val();
      const lastRelapse = relapseSnapshot.exists() ? new Date(relapseSnapshot.val()) : new Date(userData.quitDate || Date.now());
      const now = new Date();
      const cleanDays = Math.floor((now - lastRelapse) / (1000 * 60 * 60 * 24));

      // Check for milestone bonuses
      const milestones = [
        { days: 7, bonus: 5, name: 'First week' },
        { days: 30, bonus: 10, name: 'First month' },
        { days: 90, bonus: 15, name: 'Three months' }
      ];

      for (const milestone of milestones) {
        if (cleanDays >= milestone.days) {
          const milestoneKey = `milestone_${milestone.days}`;
          const milestoneSnapshot = await get(ref(this.db, `users/${this.userUID}/profile/${milestoneKey}`));
          
          if (!milestoneSnapshot.exists()) {
            await Promise.all([
              this.updateStat('mentalStrength', milestone.bonus, `${milestone.name} milestone bonus`),
              set(ref(this.db, `users/${this.userUID}/profile/${milestoneKey}`), true)
            ]);
          }
        }
      }
    } catch (error) {
      console.error('Error checking milestone bonuses:', error);
    }
  }

  // ===== MOTIVATION MANAGEMENT =====

  async trackLoggingActivity() {
    try {
      const today = new Date().toDateString();
      const now = new Date();
      
      // Update daily logging activity
      await set(ref(this.db, `users/${this.userUID}/profile/daily/${today}/logged`), true);
      
      // Update last activity timestamp
      await set(ref(this.db, `users/${this.userUID}/profile/lastActivity`), now.toISOString());
      
      // Check weekly logging frequency
      const weeklyLogging = await this.checkWeeklyLoggingFrequency();
      if (weeklyLogging >= 3) {
        await this.updateStat('motivation', 2, 'Regular logging (3+ days this week)');
      }
      
      // Note: Inactivity penalty is now only checked during daily updates, not on every activity
      // This prevents immediate penalties for new users
      
      return true;
    } catch (error) {
      console.error('Error tracking logging activity:', error);
      return false;
    }
  }

  async handleAchievementShare() {
    try {
      await this.updateStat('motivation', 3, 'Sharing achievement');
      return true;
    } catch (error) {
      console.error('Error handling achievement share:', error);
      return false;
    }
  }



  // ===== TRIGGER DEFENSE MANAGEMENT =====

  async handleTriggerPlanning() {
    try {
      await this.updateStat('triggerDefense', 1, 'Pre-planning for known triggers');
      return true;
    } catch (error) {
      console.error('Error handling trigger planning:', error);
      return false;
    }
  }

  async handleTriggerListUpdate() {
    try {
      await this.updateStat('triggerDefense', 1, 'Updating trigger list');
      return true;
    } catch (error) {
      console.error('Error handling trigger list update:', error);
      return false;
    }
  }

  async handleUnpreparedTrigger() {
    try {
      await this.updateStat('triggerDefense', -1, 'Entering trigger situation unprepared');
      return true;
    } catch (error) {
      console.error('Error handling unprepared trigger:', error);
      return false;
    }
  }

  // ===== HELPER METHODS =====

  async checkBreathingStreak() {
    try {
      let streak = 0;
      for (let i = 0; i < 7; i++) {
        const checkDate = new Date();
        checkDate.setDate(checkDate.getDate() - i);
        const checkDateStr = checkDate.toDateString();
        const breathingSnapshot = await get(ref(this.db, `users/${this.userUID}/profile/daily/${checkDateStr}/breathing`));
        
        if (breathingSnapshot.exists() && breathingSnapshot.val()) {
          streak++;
        } else {
          break;
        }
      }
      return streak;
    } catch (error) {
      console.error('Error checking breathing streak:', error);
      return 0;
    }
  }

  async checkHydrationStreak() {
    try {
      let streak = 0;
      for (let i = 0; i < 7; i++) {
        const checkDate = new Date();
        checkDate.setDate(checkDate.getDate() - i);
        const checkDateStr = checkDate.toDateString();
        const waterSnapshot = await get(ref(this.db, `users/${this.userUID}/profile/daily/${checkDateStr}/water`));
        
        if (waterSnapshot.exists() && waterSnapshot.val() > 0) {
          streak++;
        } else {
          break;
        }
      }
      return streak;
    } catch (error) {
      console.error('Error checking hydration streak:', error);
      return 0;
    }
  }

  async checkWeeklyLoggingFrequency() {
    try {
      let loggedDays = 0;
      for (let i = 0; i < 7; i++) {
        const checkDate = new Date();
        checkDate.setDate(checkDate.getDate() - i);
        const checkDateStr = checkDate.toDateString();
        const loggedSnapshot = await get(ref(this.db, `users/${this.userUID}/profile/daily/${checkDateStr}/logged`));
        
        if (loggedSnapshot.exists() && loggedSnapshot.val()) {
          loggedDays++;
        }
      }
      return loggedDays;
    } catch (error) {
      console.error('Error checking weekly logging frequency:', error);
      return 0;
    }
  }

  async checkInactivityPenalty() {
    try {
      // Get user profile to check registration date and last activity
      const userSnapshot = await get(this.userRef);
      if (!userSnapshot.exists()) return;
      
      const userData = userSnapshot.val();
      const now = new Date();
      
      // Check if user has been registered for at least 7 days
      const registrationDate = userData.createdAt ? new Date(userData.createdAt) : 
                              userData.quitStartDate ? new Date(userData.quitStartDate) : 
                              now;
      const daysSinceRegistration = Math.floor((now - registrationDate) / (1000 * 60 * 60 * 24));
      
      // Apply 7-day grace period for new users
      if (daysSinceRegistration < 7) {
        console.log(`User registered ${daysSinceRegistration} days ago - grace period active, no inactivity penalty`);
        return;
      }
      
      // First check if we have a lastActivity timestamp (more accurate)
      const lastActivitySnapshot = await get(ref(this.db, `users/${this.userUID}/profile/lastActivity`));
      if (lastActivitySnapshot.exists()) {
        const lastActivityDate = new Date(lastActivitySnapshot.val());
        const daysSinceLastActivity = Math.floor((now - lastActivityDate) / (1000 * 60 * 60 * 24));
        
        // Only apply penalty if user has been inactive for 7+ days AND registered for 7+ days
        if (daysSinceLastActivity >= 7 && daysSinceRegistration >= 7) {
          await this.updateStat('motivation', -3, 'Long period inactive (7+ days)');
          console.log(`Inactivity penalty applied: ${daysSinceLastActivity} days since last activity`);
          return;
        }
      }
      
      // Fallback: Check for last activity in the last 10 days (for users without lastActivity timestamp)
      let lastActivity = null;
      let lastActivityDate = null;
      
      for (let i = 0; i < 10; i++) {
        const checkDate = new Date();
        checkDate.setDate(checkDate.getDate() - i);
        const checkDateStr = checkDate.toDateString();
        const loggedSnapshot = await get(ref(this.db, `users/${this.userUID}/profile/daily/${checkDateStr}/logged`));
        
        if (loggedSnapshot.exists() && loggedSnapshot.val()) {
          lastActivity = i;
          lastActivityDate = checkDate;
          break;
        }
      }
      
      // Only apply penalty if user has been registered long enough AND has been inactive for 7+ days
      if (lastActivity === null || lastActivity >= 7) {
        // Additional safety check: ensure we're not penalizing users who just registered
        if (lastActivityDate) {
          const daysSinceLastActivity = Math.floor((now - lastActivityDate) / (1000 * 60 * 60 * 24));
          if (daysSinceLastActivity >= 7 && daysSinceRegistration >= 7) {
            await this.updateStat('motivation', -3, 'Long period inactive (7+ days)');
            console.log(`Inactivity penalty applied: ${daysSinceLastActivity} days since last activity`);
          }
        } else if (daysSinceRegistration >= 7) {
          // Only apply penalty if user has been registered for 7+ days and has no activity at all
          await this.updateStat('motivation', -3, 'Long period inactive (7+ days)');
          console.log(`Inactivity penalty applied: ${daysSinceRegistration} days since registration with no activity`);
        }
      }
    } catch (error) {
      console.error('Error checking inactivity penalty:', error);
    }
  }

  async trackAppUsageDuringCravings() {
    try {
      const today = new Date().toDateString();
      const usageKey = `appUsage_${today}`;
      const usageSnapshot = await get(ref(this.db, `users/${this.userUID}/profile/${usageKey}`));
      
      let usageCount = usageSnapshot.exists() ? usageSnapshot.val() : 0;
      usageCount++;
      
      await set(ref(this.db, `users/${this.userUID}/profile/${usageKey}`), usageCount);
      
      // Check if this is the 3rd usage with no relapse
      if (usageCount === 3) {
        await this.updateStat('mentalStrength', 1, 'Using app during cravings (3 times, no relapse)');
      }
      
    } catch (error) {
      console.error('Error tracking app usage during cravings:', error);
    }
  }

  async logBehavior(statName, change, reason) {
    try {
      const behaviorLog = {
        timestamp: Date.now(),
        statName,
        change,
        reason,
        date: new Date().toISOString()
      };

      await push(ref(this.db, `users/${this.userUID}/behaviorLog`), behaviorLog);
    } catch (error) {
      console.error('Error logging behavior:', error);
    }
  }

  showStatNotification(statName, change, reason) {
    // Create a notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-500 transform translate-x-full ${
      change > 0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`;
    
    notification.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="text-lg">${change > 0 ? '↗' : '↘'}</span>
        <span class="font-bold">${statName}</span>
        <span class="text-xl">${change > 0 ? '+' : ''}${change}</span>
      </div>
      <div class="text-sm opacity-90">${reason}</div>
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
    }, 100);

    // Animate out and remove
    setTimeout(() => {
      notification.classList.add('translate-x-full');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 500);
    }, 3000);
  }

  // ===== DAILY STAT UPDATES =====

  async runDailyUpdates() {
    try {
      // Check if user has been registered for at least 1 day before running updates
      const userSnapshot = await get(this.userRef);
      if (!userSnapshot.exists()) return;
      
      const userData = userSnapshot.val();
      const now = new Date();
      const registrationDate = userData.createdAt ? new Date(userData.createdAt) : 
                              userData.quitStartDate ? new Date(userData.quitStartDate) : 
                              now;
      const daysSinceRegistration = Math.floor((now - registrationDate) / (1000 * 60 * 60 * 24));
      
      // Only run daily updates if user has been registered for at least 1 day
      if (daysSinceRegistration < 1) {
        console.log(`User registered ${daysSinceRegistration} days ago - skipping daily updates for new user`);
        return;
      }
      
      await Promise.all([
        this.updateAddictionFromCleanTime(),
        this.checkMilestoneBonuses(),
        this.checkInactivityPenalty()
      ]);
    } catch (error) {
      console.error('Error running daily updates:', error);
    }
  }

  // ===== INITIALIZATION =====

  async initialize() {
    try {
      // Ensure user has proper activity tracking initialized
      await this.ensureActivityTrackingInitialized();
      
      // Set up daily update interval (runs every 24 hours)
      setInterval(() => {
        this.runDailyUpdates();
      }, 24 * 60 * 60 * 1000);

      // Run initial daily updates
      await this.runDailyUpdates();
      
      console.log('StatManager initialized successfully');
    } catch (error) {
      console.error('Error initializing StatManager:', error);
    }
  }

  async ensureActivityTrackingInitialized() {
    try {
      // Check if user has lastActivity timestamp
      const lastActivitySnapshot = await get(ref(this.db, `users/${this.userUID}/profile/lastActivity`));
      const createdAtSnapshot = await get(ref(this.db, `users/${this.userUID}/createdAt`));
      
      if (!lastActivitySnapshot.exists()) {
        // Set initial activity timestamp if missing
        const now = new Date();
        await set(ref(this.db, `users/${this.userUID}/profile/lastActivity`), now.toISOString());
        console.log('Initialized lastActivity timestamp for new user');
      }
      
      if (!createdAtSnapshot.exists()) {
        // Set creation timestamp if missing (fallback)
        const now = new Date();
        await set(ref(this.db, `users/${this.userUID}/createdAt`), now.toISOString());
        console.log('Initialized createdAt timestamp for new user');
      }
      
      // Ensure today's daily activity is marked
      const today = new Date().toDateString();
      const todayActivitySnapshot = await get(ref(this.db, `users/${this.userUID}/profile/daily/${today}/logged`));
      
      if (!todayActivitySnapshot.exists()) {
        await set(ref(this.db, `users/${this.userUID}/profile/daily/${today}/logged`), true);
        console.log('Initialized today\'s activity tracking for new user');
      }
      
    } catch (error) {
      console.error('Error ensuring activity tracking initialization:', error);
    }
  }
}

export default StatManager;
