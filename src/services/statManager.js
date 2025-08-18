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
      await set(ref(this.db, `users/${this.userUID}/profile/daily/${today}/logged`), true);
      
      // Check weekly logging frequency
      const weeklyLogging = await this.checkWeeklyLoggingFrequency();
      if (weeklyLogging >= 3) {
        await this.updateStat('motivation', 2, 'Regular logging (3+ days this week)');
      }
      
      // Check for inactivity penalty
      await this.checkInactivityPenalty();
      
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

  async checkMoneyMilestones() {
    try {
      const relapseSnapshot = await get(ref(this.db, `users/${this.userUID}/profile/relapseDate`));
      const userSnapshot = await get(this.userRef);
      
      if (!userSnapshot.exists()) return;

      const userData = userSnapshot.val();
      const lastRelapse = relapseSnapshot.exists() ? new Date(relapseSnapshot.val()) : new Date(userData.quitDate || Date.now());
      const now = new Date();
      const cleanDays = Math.floor((now - lastRelapse) / (1000 * 60 * 60 * 24));

      // Calculate money saved (example: $10 per day)
      const moneyPerDay = 10;
      const moneySaved = cleanDays * moneyPerDay;

      // Check for money milestones
      const milestones = [50, 100, 200, 500, 1000];
      for (const milestone of milestones) {
        if (moneySaved >= milestone) {
          const milestoneKey = `moneyMilestone_${milestone}`;
          const milestoneSnapshot = await get(ref(this.db, `users/${this.userUID}/profile/${milestoneKey}`));
          
          if (!milestoneSnapshot.exists()) {
            await Promise.all([
              this.updateStat('motivation', 2, `$${milestone} saved milestone`),
              set(ref(this.db, `users/${this.userUID}/profile/${milestoneKey}`), true)
            ]);
          }
        }
      }

      // Update money saved in stats
      await this.updateStat('moneySaved', moneySaved - (userSnapshot.val().stats?.moneySaved || 0), 'Money saved calculation');
      
    } catch (error) {
      console.error('Error checking money milestones:', error);
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
      let lastActivity = null;
      for (let i = 0; i < 10; i++) {
        const checkDate = new Date();
        checkDate.setDate(checkDate.getDate() - i);
        const checkDateStr = checkDate.toDateString();
        const loggedSnapshot = await get(ref(this.db, `users/${this.userUID}/profile/daily/${checkDateStr}/logged`));
        
        if (loggedSnapshot.exists() && loggedSnapshot.val()) {
          lastActivity = i;
          break;
        }
      }

      if (lastActivity === null || lastActivity >= 7) {
        await this.updateStat('motivation', -3, 'Long period inactive (7+ days)');
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
      await Promise.all([
        this.updateAddictionFromCleanTime(),
        this.checkMilestoneBonuses(),
        this.checkMoneyMilestones(),
        this.checkInactivityPenalty()
      ]);
    } catch (error) {
      console.error('Error running daily updates:', error);
    }
  }

  // ===== INITIALIZATION =====

  async initialize() {
    try {
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
}

export default StatManager;
