import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ref, get, set, push } from 'firebase/database';
import StatManager from '../../src/services/statManager.js';

// Mock Firebase
vi.mock('firebase/database', () => ({
  ref: vi.fn((db, path) => ({ db, path })),
  get: vi.fn(),
  set: vi.fn(),
  push: vi.fn()
}));

describe('Daily Limits Verification - Fixed Bug', () => {
  let mockDb;
  let statManager;
  
  const userId = 'testUser123';
  const today = new Date().toDateString();

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Mock database
    mockDb = { mock: true };
    
    // Create StatManager instance
    statManager = new StatManager(mockDb, userId);
    
    // Mock successful database operations
    get.mockResolvedValue({ exists: () => true, val: () => ({}) });
    set.mockResolvedValue();
    push.mockResolvedValue({ key: 'mockKey' });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Craving Resistance Daily Limits - Fixed', () => {
    it('should NOT exceed 5 trigger defense points per day', async () => {
      // Mock no existing daily stats
      get.mockResolvedValueOnce({ exists: () => false });
      get.mockResolvedValueOnce({ exists: () => true, val: () => ({}) }); // For updateStat
      get.mockResolvedValueOnce({ exists: () => true, val: () => ({}) }); // For updateStat
      
      // First resistance - should award 3 trigger defense points
      await statManager.handleCravingResistance();
      
      // Mock existing daily stats with 3 trigger defense points already used
      get.mockResolvedValueOnce({ 
        exists: () => true, 
        val: () => ({ mentalStrength: 1, triggerDefense: 3 }) 
      });
      get.mockResolvedValueOnce({ exists: () => true, val: () => ({}) }); // For updateStat
      
      // Second resistance - should award 2 more trigger defense points (total: 5)
      await statManager.handleCravingResistance();
      
      // Mock existing daily stats with 5 trigger defense points already used
      get.mockResolvedValueOnce({ 
        exists: () => true, 
        val: () => ({ mentalStrength: 2, triggerDefense: 5 }) 
      });
      
      // Third resistance - should NOT award any trigger defense points (limit reached)
      await statManager.handleCravingResistance();
      
      // Verify the daily stats were updated correctly
      const setCalls = set.mock.calls;
      const cravingResistanceCalls = setCalls.filter(call => 
        call[0].path.includes('cravingResistanceStats')
      );
      
      expect(cravingResistanceCalls.length).toBe(3);
      
      // First call: 1 mental strength, 3 trigger defense
      expect(cravingResistanceCalls[0][1]).toEqual({
        mentalStrength: 1,
        triggerDefense: 3
      });
      
      // Second call: 2 mental strength, 5 trigger defense
      expect(cravingResistanceCalls[1][1]).toEqual({
        mentalStrength: 2,
        triggerDefense: 5
      });
      
      // Third call: 3 mental strength, 5 trigger defense (no change to trigger defense)
      expect(cravingResistanceCalls[2][1]).toEqual({
        mentalStrength: 3,
        triggerDefense: 5
      });
      
      // Verify trigger defense never exceeded 5
      cravingResistanceCalls.forEach(call => {
        expect(call[1].triggerDefense).toBeLessThanOrEqual(5);
      });
    });

    it('should NOT exceed 3 mental strength points per day', async () => {
      // Mock no existing daily stats
      get.mockResolvedValueOnce({ exists: () => false });
      get.mockResolvedValueOnce({ exists: () => true, val: () => ({}) }); // For updateStat
      get.mockResolvedValueOnce({ exists: () => true, val: () => ({}) }); // For updateStat
      
      // First resistance - should award 1 mental strength point
      await statManager.handleCravingResistance();
      
      // Mock existing daily stats with 1 mental strength point already used
      get.mockResolvedValueOnce({ 
        exists: () => true, 
        val: () => ({ mentalStrength: 1, triggerDefense: 3 }) 
      });
      get.mockResolvedValueOnce({ exists: () => true, val: () => ({}) }); // For updateStat
      
      // Second resistance - should award 1 more mental strength point (total: 2)
      await statManager.handleCravingResistance();
      
      // Mock existing daily stats with 2 mental strength points already used
      get.mockResolvedValueOnce({ 
        exists: () => true, 
        val: () => ({ mentalStrength: 2, triggerDefense: 6 }) 
      });
      get.mockResolvedValueOnce({ exists: () => true, val: () => ({}) }); // For updateStat
      
      // Third resistance - should award 1 more mental strength point (total: 3)
      await statManager.handleCravingResistance();
      
      // Mock existing daily stats with 3 mental strength points already used
      get.mockResolvedValueOnce({ 
        exists: () => true, 
        val: () => ({ mentalStrength: 3, triggerDefense: 9 }) 
      });
      
      // Fourth resistance - should NOT award any mental strength points (limit reached)
      await statManager.handleCravingResistance();
      
      // Verify the daily stats were updated correctly
      const setCalls = set.mock.calls;
      const cravingResistanceCalls = setCalls.filter(call => 
        call[0].path.includes('cravingResistanceStats')
      );
      
      expect(cravingResistanceCalls.length).toBe(4);
      
      // Verify mental strength never exceeded 3
      cravingResistanceCalls.forEach(call => {
        expect(call[1].mentalStrength).toBeLessThanOrEqual(3);
      });
      
      // Last call should show 3 mental strength (limit reached)
      expect(cravingResistanceCalls[3][1].mentalStrength).toBe(3);
    });
  });

  describe('Daily Limits Integration', () => {
    it('should properly track daily limits across multiple resistances', async () => {
      // Simulate a user resisting cravings multiple times in one day
      const resistances = [
        { mentalStrength: 0, triggerDefense: 0 },    // First: +1, +3
        { mentalStrength: 1, triggerDefense: 3 },    // Second: +1, +2
        { mentalStrength: 2, triggerDefense: 5 },    // Third: +1, +0 (limit reached)
        { mentalStrength: 3, triggerDefense: 5 },    // Fourth: +0, +0 (both limits reached)
      ];
      
      for (let i = 0; i < resistances.length; i++) {
        const currentStats = resistances[i];
        
        if (i === 0) {
          // First resistance - no existing stats
          get.mockResolvedValueOnce({ exists: () => false });
          get.mockResolvedValueOnce({ exists: () => true, val: () => ({}) }); // For updateStat
          get.mockResolvedValueOnce({ exists: () => true, val: () => ({}) }); // For updateStat
        } else {
          // Subsequent resistances - mock existing stats
          get.mockResolvedValueOnce({ 
            exists: () => true, 
            val: () => currentStats 
          });
          
          // Only mock updateStat calls if points will be awarded
          if (currentStats.mentalStrength < 3) {
            get.mockResolvedValueOnce({ exists: () => true, val: () => ({}) });
          }
          if (currentStats.triggerDefense < 5) {
            get.mockResolvedValueOnce({ exists: () => true, val: () => ({}) });
          }
        }
        
        await statManager.handleCravingResistance();
      }
      
      // Verify all daily stats updates
      const setCalls = set.mock.calls;
      const cravingResistanceCalls = setCalls.filter(call => 
        call[0].path.includes('cravingResistanceStats')
      );
      
      expect(cravingResistanceCalls.length).toBe(4);
      
      // Verify progression
      expect(cravingResistanceCalls[0][1]).toEqual({ mentalStrength: 1, triggerDefense: 3 });
      expect(cravingResistanceCalls[1][1]).toEqual({ mentalStrength: 2, triggerDefense: 5 });
      expect(cravingResistanceCalls[2][1]).toEqual({ mentalStrength: 3, triggerDefense: 5 });
      expect(cravingResistanceCalls[3][1]).toEqual({ mentalStrength: 3, triggerDefense: 5 });
      
      // Verify limits were never exceeded
      cravingResistanceCalls.forEach(call => {
        expect(call[1].mentalStrength).toBeLessThanOrEqual(3);
        expect(call[1].triggerDefense).toBeLessThanOrEqual(5);
      });
    });
  });
});
