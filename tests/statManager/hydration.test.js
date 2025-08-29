/**
 * Test suite for hydration-related functionality
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import MockStatManager from './mockStatManager.js';
import timeAbstraction from '../utils/timeAbstraction.js';
import { 
  BONUS_CONSTRAINTS, 
  STREAK_CONSTRAINTS,
  assertStatBounds,
  assertStreakCount 
} from './invariants.js';

describe('Hydration Management', () => {
  let statManager;

  beforeEach(() => {
    timeAbstraction.setFixedTime('2024-01-15T10:00:00Z');
    statManager = new MockStatManager('test-user-123');
  });

  afterEach(() => {
    timeAbstraction.resetTime();
  });

  describe('handleHydrationUpdate', () => {
    it('should record hydration data correctly', async () => {
      const glasses = 6;
      await statManager.handleHydrationUpdate(glasses);
      
      const dailyLogs = statManager.getDailyLogs();
      const today = timeAbstraction.getDateString();
      
      expect(dailyLogs[today].water).toBe(glasses);
    });

    it('should handle different glass counts', async () => {
      const testCases = [1, 3, 6, 8];
      
      for (const glasses of testCases) {
        await statManager.handleHydrationUpdate(glasses);
        
        const dailyLogs = statManager.getDailyLogs();
        const today = timeAbstraction.getDateString();
        
        expect(dailyLogs[today].water).toBe(glasses);
      }
    });

    it('should not award mental strength bonus for single day', async () => {
      const initialStats = statManager.getStats();
      
      await statManager.handleHydrationUpdate(6);
      
      const newStats = statManager.getStats();
      expect(newStats.mentalStrength).toBe(initialStats.mentalStrength);
    });
  });

  describe('checkHydrationStreak', () => {
    it('should return 0 for no hydration logs', async () => {
      const streak = await statManager.checkHydrationStreak();
      expect(streak).toBe(0);
    });

    it('should return 1 for single day hydration', async () => {
      await statManager.handleHydrationUpdate(6);
      
      const streak = await statManager.checkHydrationStreak();
      expect(streak).toBe(1);
    });

    it('should calculate consecutive day streak correctly', async () => {
      // Set up 3 consecutive days of hydration
      timeAbstraction.setFixedTime('2024-01-15T10:00:00Z');
      await statManager.handleHydrationUpdate(6);
      
      timeAbstraction.setFixedTime('2024-01-16T10:00:00Z');
      await statManager.handleHydrationUpdate(6);
      
      timeAbstraction.setFixedTime('2024-01-17T10:00:00Z');
      await statManager.handleHydrationUpdate(6);
      
      const streak = await statManager.checkHydrationStreak();
      expect(streak).toBe(3);
    });

    it('should break streak on missed day', async () => {
      // Set up 2 consecutive days
      timeAbstraction.setFixedTime('2024-01-15T10:00:00Z');
      await statManager.handleHydrationUpdate(6);
      
      timeAbstraction.setFixedTime('2024-01-16T10:00:00Z');
      await statManager.handleHydrationUpdate(6);
      
      // Skip a day
      timeAbstraction.setFixedTime('2024-01-18T10:00:00Z');
      await statManager.handleHydrationUpdate(6);
      
      const streak = await statManager.checkHydrationStreak();
      expect(streak).toBe(1); // Only the last day counts
    });

    it('should handle partial hydration days', async () => {
      // Set up days with different hydration levels
      timeAbstraction.setFixedTime('2024-01-15T10:00:00Z');
      await statManager.handleHydrationUpdate(3); // Partial
      
      timeAbstraction.setFixedTime('2024-01-16T10:00:00Z');
      await statManager.handleHydrationUpdate(6); // Full
      
      timeAbstraction.setFixedTime('2024-01-17T10:00:00Z');
      await statManager.handleHydrationUpdate(1); // Partial
      
      const streak = await statManager.checkHydrationStreak();
      expect(streak).toBe(3); // All days with > 0 glasses count
    });

    it('should validate streak count bounds', async () => {
      // Set up a very long streak (unrealistic but tests bounds)
      for (let i = 0; i < 10; i++) {
        timeAbstraction.setFixedTime(`2024-01-${15 + i}T10:00:00Z`);
        await statManager.handleHydrationUpdate(6);
      }
      
      const streak = await statManager.checkHydrationStreak();
      assertStreakCount('hydration', streak);
      expect(streak).toBe(7); // Only checks last 7 days
    });
  });

  describe('Mental Strength Bonus for Hydration Streak', () => {
    it('should award mental strength bonus for 3-day streak', async () => {
      const initialStats = statManager.getStats();
      
      // Set up 3 consecutive days
      for (let i = 0; i < 3; i++) {
        timeAbstraction.setFixedTime(`2024-01-${15 + i}T10:00:00Z`);
        await statManager.handleHydrationUpdate(6);
      }
      
      const finalStats = statManager.getStats();
      expect(finalStats.mentalStrength).toBe(
        initialStats.mentalStrength + BONUS_CONSTRAINTS.HYDRATION_STREAK.MENTAL_STRENGTH
      );
    });

    it('should not award bonus for 2-day streak', async () => {
      const initialStats = statManager.getStats();
      
      // Set up only 2 consecutive days
      for (let i = 0; i < 2; i++) {
        timeAbstraction.setFixedTime(`2024-01-${15 + i}T10:00:00Z`);
        await statManager.handleHydrationUpdate(6);
      }
      
      const finalStats = statManager.getStats();
      expect(finalStats.mentalStrength).toBe(initialStats.mentalStrength);
    });

    it('should award bonus only once per streak', async () => {
      const initialStats = statManager.getStats();
      
      // Set up 5 consecutive days
      for (let i = 0; i < 5; i++) {
        timeAbstraction.setFixedTime(`2024-01-${15 + i}T10:00:00Z`);
        await statManager.handleHydrationUpdate(6);
      }
      
      const finalStats = statManager.getStats();
      // Should only get +1, not +3 (one bonus per streak)
      expect(finalStats.mentalStrength).toBe(
        initialStats.mentalStrength + BONUS_CONSTRAINTS.HYDRATION_STREAK.MENTAL_STRENGTH
      );
      
      // Verify the bonus was only awarded once by checking behavior log
      const behaviorLog = statManager.getBehaviorLog();
      const hydrationBonuses = behaviorLog.filter(log => 
        log.reason.includes('3-day hydration streak')
      );
      expect(hydrationBonuses).toHaveLength(1);
    });

    it('should award bonus again after streak breaks and rebuilds', async () => {
      const initialStats = statManager.getStats();
      
      // First 3-day streak
      for (let i = 0; i < 3; i++) {
        timeAbstraction.setFixedTime(`2024-01-${15 + i}T10:00:00Z`);
        await statManager.handleHydrationUpdate(6);
      }
      
      // Break streak
      timeAbstraction.setFixedTime('2024-01-18T10:00:00Z');
      // No hydration logged
      
      // Rebuild streak
      for (let i = 0; i < 3; i++) {
        timeAbstraction.setFixedTime(`2024-01-${19 + i}T10:00:00Z`);
        await statManager.handleHydrationUpdate(6);
      }
      
      const finalStats = statManager.getStats();
      // Should get +2 (one bonus for each 3-day streak)
      expect(finalStats.mentalStrength).toBe(
        initialStats.mentalStrength + BONUS_CONSTRAINTS.HYDRATION_STREAK.MENTAL_STRENGTH * 2
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero glasses correctly', async () => {
      await statManager.handleHydrationUpdate(0);
      
      const dailyLogs = statManager.getDailyLogs();
      const today = timeAbstraction.getDateString();
      
      expect(dailyLogs[today].water).toBe(0);
    });

    it('should handle very high glass counts', async () => {
      await statManager.handleHydrationUpdate(20);
      
      const dailyLogs = statManager.getDailyLogs();
      const today = timeAbstraction.getDateString();
      
      expect(dailyLogs[today].water).toBe(20);
    });

    it('should handle timezone changes correctly', async () => {
      // Test with different timezone representations
      timeAbstraction.setDateTime('2024-01-15', '14:30:00', 'UTC');
      await statManager.handleHydrationUpdate(6);
      
      timeAbstraction.setDateTime('2024-01-16', '14:30:00', 'Europe/London');
      await statManager.handleHydrationUpdate(6);
      
      const dailyLogs = statManager.getDailyLogs();
      expect(Object.keys(dailyLogs)).toHaveLength(2);
    });
  });

  describe('Integration with Other Systems', () => {
    it('should not interfere with other stat updates', async () => {
      const initialStats = statManager.getStats();
      
      // Update hydration and other stats
      await statManager.handleHydrationUpdate(6);
      await statManager.handleCravingLogged();
      
      const finalStats = statManager.getStats();
      
      // Hydration should not affect motivation or trigger defense
      expect(finalStats.motivation).toBe(
        initialStats.motivation + BONUS_CONSTRAINTS.CRAVING_LOGGED.MOTIVATION
      );
      expect(finalStats.triggerDefense).toBe(
        initialStats.triggerDefense + BONUS_CONSTRAINTS.CRAVING_LOGGED.TRIGGER_DEFENSE
      );
    });

    it('should maintain data consistency across operations', async () => {
      const initialState = {
        stats: statManager.getStats(),
        dailyLogs: statManager.getDailyLogs()
      };
      
      // Perform hydration operations
      await statManager.handleHydrationUpdate(6);
      await statManager.handleHydrationUpdate(4);
      
      const finalState = {
        stats: statManager.getStats(),
        dailyLogs: statManager.getDailyLogs()
      };
      
      // Verify state consistency
      expect(finalState.dailyLogs).toBeDefined();
      expect(finalState.stats).toBeDefined();
      
      // Verify hydration data is preserved
      const today = timeAbstraction.getDateString();
      expect(finalState.dailyLogs[today].water).toBe(4); // Last update should overwrite
    });
  });
});
