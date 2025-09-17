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
      const relapseSnapshot = await get(ref(this.db, `users/${this.userUID}/profile/lastRelapseDate`));
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
        
        // Reset escalation level after 7 clean days
        if (cleanWeeks >= 1) {
          await this.resetRelapseEscalationLevel();
        }
      }
    } catch (error) {
      console.error('Error updating addiction from clean time:', error);
    }
  }

  async handleRelapse() {
    try {
      const now = new Date();
      const lastRelapseSnapshot = await get(ref(this.db, `users/${this.userUID}/profile/lastRelapseDate`));
      const escalationLevelSnapshot = await get(ref(this.db, `users/${this.userUID}/profile/relapseEscalationLevel`));
      
      let escalationLevel = 1; // Default escalation level
      
      if (lastRelapseSnapshot.exists()) {
        const lastRelapse = new Date(lastRelapseSnapshot.val());
        const daysSinceLastRelapse = Math.floor((now - lastRelapse) / (1000 * 60 * 60 * 24));
        
        // Get current escalation level
        const currentEscalationLevel = escalationLevelSnapshot.exists() ? escalationLevelSnapshot.val() : 1;
        
        // Determine escalation level based on timing
        if (daysSinceLastRelapse <= 3) {
          // 3rd+ relapse within 3 days
          escalationLevel = Math.max(3, currentEscalationLevel + 1);
        } else if (daysSinceLastRelapse <= 7) {
          // 2nd relapse within 7 days
          escalationLevel = Math.max(2, currentEscalationLevel);
        } else {
          // First relapse after clean period (7+ days)
          escalationLevel = 1;
        }
      }

      // Apply addiction penalty based on escalation level
      let addictionIncrease = 0;
      switch (escalationLevel) {
        case 1: addictionIncrease = 4; break;  // 1st relapse = +4 points
        case 2: addictionIncrease = 6; break;  // 2nd relapse within 7 days = +6 points
        case 3: addictionIncrease = 8; break;  // 3rd+ relapse within 3 days = +8 points
        default: addictionIncrease = 8; break; // Default to highest penalty
      }

      // Update stats
      await Promise.all([
        this.updateStat('addictionLevel', addictionIncrease, `Relapse escalation level ${escalationLevel}`),
        this.updateStat('mentalStrength', -3, 'Relapse setback'),
        this.updateStat('triggerDefense', -3, 'Relapse to known trigger')
      ]);

      // Update relapse date and escalation level
      await Promise.all([
        set(ref(this.db, `users/${this.userUID}/profile/lastRelapseDate`), now.toISOString()),
        set(ref(this.db, `users/${this.userUID}/profile/relapseDate`), now.toISOString()), // Also update the field used by streak calculation
        set(ref(this.db, `users/${this.userUID}/profile/relapseEscalationLevel`), escalationLevel)
      ]);
      
      // Log relapse behavior
      await this.logBehavior('relapse', escalationLevel, `Escalation level ${escalationLevel} - ${addictionIncrease} addiction, -3 mental, -3 trigger defense`);
      
      return true;
    } catch (error) {
      console.error('Error handling relapse:', error);
      return false;
    }
  }

  async resetRelapseEscalationLevel() {
    try {
      await set(ref(this.db, `users/${this.userUID}/profile/relapseEscalationLevel`), 1);
      console.log('Relapse escalation level reset');
    } catch (error) {
      console.error('Error resetting relapse escalation level:', error);
    }
  }

  async getAddictionStatus() {
    try {
      const lastRelapseSnapshot = await get(ref(this.db, `users/${this.userUID}/profile/lastRelapseDate`));
      const escalationLevelSnapshot = await get(ref(this.db, `users/${this.userUID}/profile/relapseEscalationLevel`));
      const userSnapshot = await get(this.userRef);
      
      if (!userSnapshot.exists()) return null;

      const userData = userSnapshot.val();
      const lastRelapse = lastRelapseSnapshot.exists() ? new Date(lastRelapseSnapshot.val()) : new Date(userData.quitDate || Date.now());
      const escalationLevel = escalationLevelSnapshot.exists() ? escalationLevelSnapshot.val() : 1;
      const now = new Date();
      
      const daysSinceLastRelapse = Math.floor((now - lastRelapse) / (1000 * 60 * 60 * 24));
      const cleanWeeks = Math.floor((now - lastRelapse) / (1000 * 60 * 60 * 24 * 7));
      
      return {
        lastRelapseDate: lastRelapse,
        escalationLevel,
        daysSinceLastRelapse,
        cleanWeeks,
        isCleanFor7Days: daysSinceLastRelapse >= 7
      };
    } catch (error) {
      console.error('Error getting addiction status:', error);
      return null;
    }
  }

  // ===== MENTAL STRENGTH MANAGEMENT =====

  async handleCravingResistance() {
    try {
      const today = new Date().toDateString();
      
      // Check daily limits for craving resistance
      const dailyLimits = await this.checkDailyCravingResistanceLimits(today);
      
      if (!dailyLimits.canAwardMentalStrength && !dailyLimits.canAwardTriggerDefense) {
        console.log('Daily craving resistance limits reached for both stats');
        // Still track app usage even if no points awarded
        await this.trackAppUsageDuringCravings();
        return true;
      }
      
      // Award points based on remaining daily limits
      const updates = [];
      
      if (dailyLimits.canAwardMentalStrength) {
        updates.push(this.updateStat('mentalStrength', 1, 'Successful craving resistance'));
      } else {
        console.log('Daily mental strength limit reached for craving resistance');
      }
      
      if (dailyLimits.canAwardTriggerDefense) {
        updates.push(this.updateStat('triggerDefense', 3, 'Surviving trigger situation'));
      } else {
        console.log('Daily trigger defense limit reached for craving resistance');
      }
      
      if (updates.length > 0) {
        await Promise.all(updates);
      }
      
      // Track app usage during cravings
      await this.trackAppUsageDuringCravings();
      
      // Log the craving resistance for daily tracking
      await this.logDailyCravingResistance(today, dailyLimits);
      
      return true;
    } catch (error) {
      console.error('Error handling craving resistance:', error);
      return false;
    }
  }

  async handleCravingLogged() {
    try {
      const today = new Date().toDateString();
      
      // Check daily limits for craving logging (awareness bonuses)
      const dailyLimits = await this.checkDailyCravingLoggingLimits(today);
      
      if (!dailyLimits.canAwardMotivation && !dailyLimits.canAwardTriggerDefense) {
        console.log('Daily craving logging limits reached for both stats');
        return true;
      }
      
      // Award points based on remaining daily limits
      const updates = [];
      
      if (dailyLimits.canAwardMotivation) {
        updates.push(this.updateStat('motivation', 0.25, 'Craving awareness and tracking'));
      } else {
        console.log('Daily motivation limit reached for craving logging');
      }
      
      if (dailyLimits.canAwardTriggerDefense) {
        updates.push(this.updateStat('triggerDefense', 0.25, 'Craving awareness and tracking'));
      } else {
        console.log('Daily trigger defense limit reached for craving logging');
      }
      
      if (updates.length > 0) {
        await Promise.all(updates);
      }
      
      // Log the craving logging for daily tracking
      await this.logDailyCravingLogging(today, dailyLimits);
      
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
      
      // Check if user has been registered for at least 7 days before running updates
      const registrationDate = userData.createdAt ? new Date(userData.createdAt) : 
                              userData.quitStartDate ? new Date(userData.quitStartDate) : 
                              now;
      const daysSinceRegistration = Math.floor((now - registrationDate) / (1000 * 60 * 60 * 24));
      
      // Only run daily updates if user has been registered for at least 1 day
      if (daysSinceRegistration < 1) {
        console.log(`User registered ${daysSinceRegistration} days ago - skipping daily updates for new user`);
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
          await this.updateStat('motivation', 1, 'Long period inactive (7+ days)');
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
      const usageSnapshot = await get(ref(this.db, `users/${this.userUID}/profile/daily/${usageKey}`));
      
      let usageCount = usageSnapshot.exists() ? usageSnapshot.val() : 0;
      usageCount++;
      
      await set(ref(this.db, `users/${this.userUID}/profile/daily/${usageKey}`), usageCount);
      
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
      const userSnapshot = await get(ref(this.db, `users/${this.userUID}`));
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
        return;
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

  async checkDailyCravingResistanceLimits(today) {
    try {
      const todayStats = await get(ref(this.db, `users/${this.userUID}/profile/daily/${today}/cravingResistanceStats`));
      if (!todayStats.exists()) {
        await set(ref(this.db, `users/${this.userUID}/profile/daily/${today}/cravingResistanceStats`), {
          mentalStrength: 0,
          triggerDefense: 0
        });
        return { canAwardMentalStrength: true, canAwardTriggerDefense: true };
      }

      const todayData = todayStats.val();
      const mentalStrengthToday = todayData.mentalStrength || 0;
      const triggerDefenseToday = todayData.triggerDefense || 0;

      const dailyLimits = {
        canAwardMentalStrength: mentalStrengthToday < 3,
        canAwardTriggerDefense: triggerDefenseToday < 5
      };
      return dailyLimits;
    } catch (error) {
      console.error('Error checking daily craving resistance limits:', error);
      return { canAwardMentalStrength: true, canAwardTriggerDefense: true }; // Default to true on error
    }
  }

  async logDailyCravingResistance(today, dailyLimits) {
    try {
      const todayStats = await get(ref(this.db, `users/${this.userUID}/profile/daily/${today}/cravingResistanceStats`));
      if (!todayStats.exists()) {
        await set(ref(this.db, `users/${this.userUID}/profile/daily/${today}/cravingResistanceStats`), {
          mentalStrength: 0,
          triggerDefense: 0
        });
      }

      const todayData = todayStats.val();
      const mentalStrengthToday = todayData.mentalStrength || 0;
      const triggerDefenseToday = todayData.triggerDefense || 0;

      // Only add points that were actually awarded based on daily limits
      const mentalStrengthToAdd = dailyLimits.canAwardMentalStrength ? 1 : 0;
      const triggerDefenseToAdd = dailyLimits.canAwardTriggerDefense ? 3 : 0;

      await set(ref(this.db, `users/${this.userUID}/profile/daily/${today}/cravingResistanceStats`), {
        mentalStrength: Math.min(3, mentalStrengthToday + mentalStrengthToAdd),
        triggerDefense: Math.min(5, triggerDefenseToday + triggerDefenseToAdd)
      });
    } catch (error) {
      console.error('Error logging daily craving resistance:', error);
    }
  }

  async getDailyCravingResistanceStats(today = null) {
    try {
      const dateToCheck = today || new Date().toDateString();
      const todayStats = await get(ref(this.db, `users/${this.userUID}/profile/daily/${dateToCheck}/cravingResistanceStats`));
      
      if (!todayStats.exists()) {
        return {
          mentalStrength: 0,
          triggerDefense: 0,
          mentalStrengthLimit: 3,
          triggerDefenseLimit: 5,
          mentalStrengthRemaining: 3,
          triggerDefenseRemaining: 5
        };
      }

      const todayData = todayStats.val();
      const mentalStrengthToday = todayData.mentalStrength || 0;
      const triggerDefenseToday = todayData.triggerDefense || 0;

      return {
        mentalStrength: mentalStrengthToday,
        triggerDefense: triggerDefenseToday,
        mentalStrengthLimit: 3,
        triggerDefenseLimit: 5,
        mentalStrengthRemaining: Math.max(0, 3 - mentalStrengthToday),
        triggerDefenseRemaining: Math.max(0, 5 - triggerDefenseToday)
      };
    } catch (error) {
      console.error('Error getting daily craving resistance stats:', error);
      return {
        mentalStrength: 0,
        triggerDefense: 0,
        mentalStrengthLimit: 3,
        triggerDefenseLimit: 5,
        mentalStrengthRemaining: 3,
        triggerDefenseRemaining: 5
      };
    }
  }

  async checkDailyCravingLoggingLimits(today) {
    try {
      const todayStats = await get(ref(this.db, `users/${this.userUID}/profile/daily/${today}/cravingLoggingStats`));
      if (!todayStats.exists()) {
        await set(ref(this.db, `users/${this.userUID}/profile/daily/${today}/cravingLoggingStats`), {
          motivation: 0,
          triggerDefense: 0
        });
        return { canAwardMotivation: true, canAwardTriggerDefense: true };
      }

      const todayData = todayStats.val();
      const motivationToday = todayData.motivation || 0;
      const triggerDefenseToday = todayData.triggerDefense || 0;

      const dailyLimits = {
        canAwardMotivation: motivationToday < 0.5, // 0.5 points per day
        canAwardTriggerDefense: triggerDefenseToday < 0.5 // 0.5 points per day
      };
      return dailyLimits;
    } catch (error) {
      console.error('Error checking daily craving logging limits:', error);
      return { canAwardMotivation: true, canAwardTriggerDefense: true }; // Default to true on error
    }
  }

  async logDailyCravingLogging(today, dailyLimits) {
    try {
      const todayStats = await get(ref(this.db, `users/${this.userUID}/profile/daily/${today}/cravingLoggingStats`));
      if (!todayStats.exists()) {
        await set(ref(this.db, `users/${this.userUID}/profile/daily/${today}/cravingLoggingStats`), {
          motivation: 0,
          triggerDefense: 0
        });
      }

      const todayData = todayStats.val();
      const motivationToday = todayData.motivation || 0;
      const triggerDefenseToday = todayData.triggerDefense || 0;

      // Only add points that were actually awarded based on daily limits
      const motivationToAdd = dailyLimits.canAwardMotivation ? 0.25 : 0;
      const triggerDefenseToAdd = dailyLimits.canAwardTriggerDefense ? 0.25 : 0;

      await set(ref(this.db, `users/${this.userUID}/profile/daily/${today}/cravingLoggingStats`), {
        motivation: Math.min(0.5, motivationToday + motivationToAdd),
        triggerDefense: Math.min(0.5, triggerDefenseToday + triggerDefenseToAdd)
      });
    } catch (error) {
      console.error('Error logging daily craving logging:', error);
    }
  }

  async getDailyCravingLoggingStats(today = null) {
    try {
      const dateToCheck = today || new Date().toDateString();
      const todayStats = await get(ref(this.db, `users/${this.userUID}/profile/daily/${dateToCheck}/cravingLoggingStats`));
      
      if (!todayStats.exists()) {
        return {
          motivation: 0,
          triggerDefense: 0,
          motivationLimit: 0.5,
          triggerDefenseLimit: 0.5,
          motivationRemaining: 0.5,
          triggerDefenseRemaining: 0.5
        };
      }

      const todayData = todayStats.val();
      const motivationToday = todayData.motivation || 0;
      const triggerDefenseToday = todayData.triggerDefense || 0;

      return {
        motivation: motivationToday,
        triggerDefense: triggerDefenseToday,
        motivationLimit: 0.5,
        triggerDefenseLimit: 0.5,
        motivationRemaining: Math.max(0, 0.5 - motivationToday),
        triggerDefenseRemaining: Math.max(0, 0.5 - triggerDefenseToday)
      };
    } catch (error) {
      console.error('Error getting daily craving logging stats:', error);
      return {
        motivation: 0,
        triggerDefense: 0,
        motivationLimit: 0.5,
        triggerDefenseLimit: 0.5,
        motivationRemaining: 0.5,
        triggerDefenseRemaining: 0.5
      };
    }
  }
}

export default StatManager;
