/**
 * Mock StatManager for testing
 * Provides the same interface as StatManager but with in-memory storage
 */

import timeAbstraction from '../utils/timeAbstraction.js';
import { assertStatBounds, assertValidUserId, assertValidReason } from './invariants.js';

class MockStatManager {
  constructor(userUID) {
    assertValidUserId(userUID);
    
    this.userUID = userUID;
    this.stats = {
      mentalStrength: 50,
      motivation: 50,
      triggerDefense: 50,
      addictionLevel: 30
    };
    
    this.profile = {
      relapseDate: null,
      relapsePenaltyLevel: 1,
      lastActivity: timeAbstraction.now().toISOString(),
      createdAt: timeAbstraction.now().toISOString(),
      quitDate: timeAbstraction.now().toISOString()
    };
    
    this.dailyLogs = {};
    this.behaviorLog = [];
    this.milestones = {};
    this.appUsageDuringCravings = {};
    this.awardedBonuses = {}; // Track awarded bonuses to prevent duplicates
  }

  // ===== CORE STAT UPDATE METHODS =====

  async updateStat(statName, change, reason = '') {
    assertValidReason(reason);
    
    const currentValue = this.stats[statName] || 0;
    const newValue = Math.max(0, Math.min(100, currentValue + change));
    
    this.stats[statName] = newValue;
    
    // Log the behavior
    await this.logBehavior(statName, change, reason);
    
    // Show notification (mocked)
    this.showStatNotification(statName, change, reason);
    
    console.log(`${statName}: ${change > 0 ? '+' : ''}${change} (${reason})`);
    return true;
  }

  // ===== ADDICTION STAT MANAGEMENT =====

  async updateAddictionFromCleanTime() {
    const lastRelapse = this.profile.relapseDate ? 
      new Date(this.profile.relapseDate) : 
      new Date(this.profile.quitDate);
    
    const now = timeAbstraction.now();
    const cleanWeeks = Math.floor((now - lastRelapse) / (1000 * 60 * 60 * 24 * 7));

    if (cleanWeeks >= 1) {
      const decrease = cleanWeeks * 2;
      await this.updateStat('addictionLevel', -decrease, `Clean time: ${cleanWeeks} week(s)`);
      
      if (cleanWeeks >= 1) {
        await this.resetRelapsePenaltyLevel();
      }
    }
  }

  async handleRelapse() {
    const now = timeAbstraction.now();
    let penaltyLevel = 1;
    
    if (this.profile.relapseDate) {
      const lastRelapse = new Date(this.profile.relapseDate);
      const daysSinceLastRelapse = Math.floor((now - lastRelapse) / (1000 * 60 * 60 * 24));
      
      if (daysSinceLastRelapse <= 3) {
        penaltyLevel = 3;
      } else if (daysSinceLastRelapse <= 7) {
        penaltyLevel = 2;
      } else {
        penaltyLevel = 1;
      }
    }

    let addictionIncrease = 0;
    switch (penaltyLevel) {
      case 1: addictionIncrease = 4; break;
      case 2: addictionIncrease = 6; break;
      case 3: addictionIncrease = 8; break;
    }

    await Promise.all([
      this.updateStat('addictionLevel', addictionIncrease, `Relapse penalty level ${penaltyLevel}`),
      this.updateStat('mentalStrength', -3, 'Relapse setback'),
      this.updateStat('triggerDefense', -3, 'Relapse to known trigger')
    ]);

    this.profile.relapseDate = now.toISOString();
    await this.logBehavior('relapse', penaltyLevel, `Penalty level ${penaltyLevel} - ${addictionIncrease} addiction, -3 mental, -3 trigger defense`);
    
    return true;
  }

  async resetRelapsePenaltyLevel() {
    this.profile.relapsePenaltyLevel = 1;
    console.log('Relapse penalty level reset');
  }

  // ===== MENTAL STRENGTH MANAGEMENT =====

  async handleCravingResistance() {
    await Promise.all([
      this.updateStat('mentalStrength', 1, 'Successful craving resistance'),
      this.updateStat('triggerDefense', 3, 'Surviving trigger situation')
    ]);

    await this.trackAppUsageDuringCravings();
    return true;
  }

  async handleCravingLogged() {
    await Promise.all([
      this.updateStat('motivation', 0.25, 'Craving awareness and tracking'),
      this.updateStat('triggerDefense', 0.25, 'Craving awareness and tracking')
    ]);
    
    return true;
  }

  async handleBreathingExercise() {
    const today = timeAbstraction.getDateString();
    this.dailyLogs[today] = this.dailyLogs[today] || {};
    this.dailyLogs[today].breathing = true;
    
    const streak = await this.checkBreathingStreak();
    if (streak >= 3) {
      const bonusKey = `breathing_${streak}`;
      if (!this.awardedBonuses[bonusKey]) {
        await this.updateStat('mentalStrength', 1, '3-day breathing exercise streak');
        this.awardedBonuses[bonusKey] = true;
      }
    }
    
    return true;
  }

  async handleHydrationUpdate(glasses) {
    const today = timeAbstraction.getDateString();
    this.dailyLogs[today] = this.dailyLogs[today] || {};
    this.dailyLogs[today].water = glasses;
    
    const streak = await this.checkHydrationStreak();
    if (streak >= 3) {
      const bonusKey = 'hydration_streak';
      if (!this.awardedBonuses[bonusKey]) {
        await this.updateStat('mentalStrength', 1, '3-day hydration streak');
        this.awardedBonuses[bonusKey] = true;
      }
    }
    
    return true;
  }

  // ===== HELPER METHODS =====

  async checkBreathingStreak() {
    let streak = 0;
    for (let i = 0; i < 7; i++) {
      const checkDate = timeAbstraction.getDateString(-i);
      const breathingData = this.dailyLogs[checkDate]?.breathing;
      
      if (breathingData) {
        streak++;
      } else {
        // Streak broken, reset bonus tracking
        if (streak < 3) {
          this.awardedBonuses['breathing_streak'] = false;
        }
        break;
      }
    }
    return streak;
  }

  async checkHydrationStreak() {
    let streak = 0;
    for (let i = 0; i < 7; i++) {
      const checkDate = timeAbstraction.getDateString(-i);
      const waterData = this.dailyLogs[checkDate]?.water;
      
      if (waterData && waterData > 0) {
        streak++;
      } else {
        // Streak broken, reset bonus tracking
        if (streak < 3) {
          this.awardedBonuses['hydration_streak'] = false;
        }
        break;
      }
    }
    return streak;
  }

  async checkWeeklyLoggingFrequency() {
    let loggedDays = 0;
    for (let i = 0; i < 7; i++) {
      const checkDate = timeAbstraction.getDateString(-i);
      const loggedData = this.dailyLogs[checkDate]?.logged;
      
      if (loggedData) {
        loggedDays++;
      }
    }
    return loggedDays;
  }

  async trackAppUsageDuringCravings() {
    const today = timeAbstraction.getDateString();
    const usageKey = `appUsage_${today}`;
    
    this.appUsageDuringCravings[usageKey] = (this.appUsageDuringCravings[usageKey] || 0) + 1;
    
    if (this.appUsageDuringCravings[usageKey] === 3) {
      await this.updateStat('mentalStrength', 1, 'Using app during cravings (3 times, no relapse)');
    }
  }

  async logBehavior(statName, change, reason) {
    const behaviorLog = {
      timestamp: timeAbstraction.now().getTime(),
      statName,
      change,
      reason,
      date: timeAbstraction.now().toISOString()
    };

    this.behaviorLog.push(behaviorLog);
  }

  showStatNotification(statName, change, reason) {
    // Mock notification - just log to console
    console.log(`Notification: ${statName} ${change > 0 ? '+' : ''}${change} - ${reason}`);
  }

  // ===== GETTERS FOR TESTING =====

  getStats() {
    return { ...this.stats };
  }

  getProfile() {
    return { ...this.profile };
  }

  getDailyLogs() {
    return { ...this.dailyLogs };
  }

  getBehaviorLog() {
    return [...this.behaviorLog];
  }

  getMilestones() {
    return { ...this.milestones };
  }

  getAppUsageDuringCravings() {
    return { ...this.appUsageDuringCravings };
  }

  // ===== SETTERS FOR TESTING =====

  setStats(stats) {
    this.stats = { ...stats };
  }

  setProfile(profile) {
    this.profile = { ...profile };
  }

  setDailyLogs(dailyLogs) {
    this.dailyLogs = { ...dailyLogs };
  }

  setRelapseDate(date) {
    this.profile.relapseDate = date.toISOString();
  }

  setQuitDate(date) {
    this.profile.quitDate = date.toISOString();
  }

  setCreatedAt(date) {
    this.profile.createdAt = date.toISOString();
  }
}

export default MockStatManager;
