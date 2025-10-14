/**
 * Test suite for craving-related functionality
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import MockStatManager from './mockStatManager.js';
import timeAbstraction from '../utils/timeAbstraction.js';
import { 
  BONUS_CONSTRAINTS, 
  PENALTY_CONSTRAINTS,
  assertStatBounds,
  assertStatChange 
} from './invariants.js';

describe('Craving Management', () => {
  let statManager;

  beforeEach(() => {
    timeAbstraction.setFixedTime('2024-01-15T10:00:00Z');
    statManager = new MockStatManager('test-user-123');
  });

  afterEach(() => {
    timeAbstraction.resetTime();
  });

  describe('handleCravingResistance', () => {
    it('should award correct bonuses for successful craving resistance', async () => {
      const initialStats = statManager.getStats();
      
      await statManager.handleCravingResistance();
      
      const newStats = statManager.getStats();
      
      expect(newStats.mentalStrength).toBe(
        initialStats.mentalStrength + BONUS_CONSTRAINTS.CRAVING_RESISTANCE.MENTAL_STRENGTH
      );
      expect(newStats.triggerDefense).toBe(
        initialStats.triggerDefense + BONUS_CONSTRAINTS.CRAVING_RESISTANCE.TRIGGER_DEFENSE
      );
    });

    it('should track app usage during cravings', async () => {
      // First two uses - no bonus yet
      await statManager.handleCravingResistance();
      await statManager.handleCravingResistance();
      
      let appUsage = statManager.getAppUsageDuringCravings();
      const today = timeAbstraction.getDateString();
      const usageKey = `appUsage_${today}`;
      
      expect(appUsage[usageKey]).toBe(2);
      
      // Third use - should trigger bonus
      await statManager.handleCravingResistance();
      
      appUsage = statManager.getAppUsageDuringCravings();
      expect(appUsage[usageKey]).toBe(3);
      
      const stats = statManager.getStats();
      expect(stats.mentalStrength).toBe(54); // 50 + 1 + 1 + 1 + 1 (app usage bonus)
    });

    it('should log behavior correctly', async () => {
      await statManager.handleCravingResistance();
      
      const behaviorLog = statManager.getBehaviorLog();
      const resistanceEntry = behaviorLog.find(log => log.reason.includes('Successful craving resistance'));
      
      expect(resistanceEntry).toBeDefined();
      expect(resistanceEntry.statName).toBe('mentalStrength');
      expect(resistanceEntry.change).toBe(1);
    });
  });

  describe('handleCravingLogged', () => {
    it('should award correct bonuses for craving logging', async () => {
      const initialStats = statManager.getStats();
      
      await statManager.handleCravingLogged();
      
      const newStats = statManager.getStats();
      
      expect(newStats.motivation).toBe(
        initialStats.motivation + BONUS_CONSTRAINTS.CRAVING_LOGGED.MOTIVATION
      );
      expect(newStats.triggerDefense).toBe(
        initialStats.triggerDefense + BONUS_CONSTRAINTS.CRAVING_LOGGED.TRIGGER_DEFENSE
      );
    });

    it('should log behavior correctly', async () => {
      await statManager.handleCravingLogged();
      
      const behaviorLog = statManager.getBehaviorLog();
      const loggingEntry = behaviorLog.find(log => log.reason.includes('Craving awareness and tracking'));
      
      expect(loggingEntry).toBeDefined();
      expect(loggingEntry.statName).toBe('motivation');
      expect(loggingEntry.change).toBe(BONUS_CONSTRAINTS.CRAVING_LOGGED.MOTIVATION);
    });
  });

  describe('Stat Bounds Validation', () => {
    it('should not allow stats to exceed maximum value', async () => {
      // Set stats to near maximum
      statManager.setStats({
        mentalStrength: 99,
        motivation: 50,
        triggerDefense: 99,
        addictionLevel: 30
      });
      
      await statManager.handleCravingResistance();
      
      const stats = statManager.getStats();
      expect(stats.mentalStrength).toBe(100); // Capped at maximum
      expect(stats.triggerDefense).toBe(100); // Capped at maximum
    });

    it('should not allow stats to go below minimum value', async () => {
      // Set stats to near minimum
      statManager.setStats({
        mentalStrength: 2,
        motivation: 50,
        triggerDefense: 2,
        addictionLevel: 30
      });
      
      await statManager.handleRelapse();
      
      const stats = statManager.getStats();
      expect(stats.mentalStrength).toBe(0); // Capped at minimum
      expect(stats.triggerDefense).toBe(0); // Capped at minimum
    });
  });

  describe('Behavior Logging', () => {
    it('should log all stat changes with correct metadata', async () => {
      await statManager.handleCravingResistance();
      
      const behaviorLog = statManager.getBehaviorLog();
      expect(behaviorLog).toHaveLength(2); // mentalStrength, triggerDefense (app usage tracking only logs when bonus is awarded)
      
      const mentalStrengthEntry = behaviorLog.find(log => 
        log.statName === 'mentalStrength' && log.reason.includes('Successful craving resistance')
      );
      expect(mentalStrengthEntry).toBeDefined();
      expect(mentalStrengthEntry.change).toBe(1);
      expect(mentalStrengthEntry.timestamp).toBeGreaterThan(0);
      
      const triggerDefenseEntry = behaviorLog.find(log => 
        log.statName === 'triggerDefense' && log.reason.includes('Surviving trigger situation')
      );
      expect(triggerDefenseEntry).toBeDefined();
      expect(triggerDefenseEntry.change).toBe(3);
    });

    it('should include valid dates in behavior logs', async () => {
      await statManager.handleCravingLogged();
      
      const behaviorLog = statManager.getBehaviorLog();
      const entry = behaviorLog[0];
      
      expect(entry.date).toBeDefined();
      expect(new Date(entry.date).getTime()).toBeGreaterThan(0);
    });
  });

  describe('Integration Tests', () => {
    it('should handle multiple craving events correctly', async () => {
      const initialStats = statManager.getStats();
      
      // Log a craving
      await statManager.handleCravingLogged();
      
      // Resist a craving
      await statManager.handleCravingResistance();
      
      // Log another craving
      await statManager.handleCravingLogged();
      
      const finalStats = statManager.getStats();
      
      // Verify all bonuses were applied
      expect(finalStats.motivation).toBe(
        initialStats.motivation + 
        BONUS_CONSTRAINTS.CRAVING_LOGGED.MOTIVATION * 2
      );
      expect(finalStats.mentalStrength).toBe(
        initialStats.mentalStrength + 
        BONUS_CONSTRAINTS.CRAVING_RESISTANCE.MENTAL_STRENGTH
      );
      expect(finalStats.triggerDefense).toBe(
        initialStats.triggerDefense + 
        BONUS_CONSTRAINTS.CRAVING_LOGGED.TRIGGER_DEFENSE * 2 +
        BONUS_CONSTRAINTS.CRAVING_RESISTANCE.TRIGGER_DEFENSE
      );
    });

    it('should maintain consistent state across multiple operations', async () => {
      const initialState = {
        stats: statManager.getStats(),
        profile: statManager.getProfile(),
        behaviorLog: statManager.getBehaviorLog()
      };
      
      // Perform multiple operations
      await statManager.handleCravingLogged();
      await statManager.handleCravingResistance();
      await statManager.handleCravingLogged();
      
      const finalState = {
        stats: statManager.getStats(),
        profile: statManager.getProfile(),
        behaviorLog: statManager.getBehaviorLog()
      };
      
      // Verify state consistency
      expect(finalState.stats).toBeDefined();
      expect(finalState.profile).toBeDefined();
      expect(finalState.behaviorLog).toBeDefined();
      expect(finalState.behaviorLog.length).toBeGreaterThan(initialState.behaviorLog.length);
      
      // Verify all stats are within bounds
      Object.values(finalState.stats).forEach(value => {
        assertStatBounds('test', value);
      });
    });
  });
});
