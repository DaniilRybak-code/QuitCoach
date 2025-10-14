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

describe('StatManager Daily Point Limits', () => {
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

  describe('Craving Resistance Daily Limits', () => {
    it('should award points on first craving resistance of the day', async () => {
      // Mock no existing daily stats
      get.mockResolvedValueOnce({ exists: () => false });
      get.mockResolvedValueOnce({ exists: () => true, val: () => ({}) }); // For updateStat
      get.mockResolvedValueOnce({ exists: () => true, val: () => ({}) }); // For updateStat
      
      const result = await statManager.handleCravingResistance();
      
      expect(result).toBe(true);
      
      // Should award both stats
      expect(set).toHaveBeenCalledWith(
        expect.objectContaining({ path: `users/${userId}/profile/daily/${today}/cravingResistanceStats` }),
        { mentalStrength: 1, triggerDefense: 3 }
      );
    });

    it('should enforce mental strength limit of 3 points per day', async () => {
      // Mock existing daily stats with 3 mental strength points already awarded
      get.mockResolvedValueOnce({ 
        exists: () => true, 
        val: () => ({ mentalStrength: 3, triggerDefense: 0 }) 
      });
      get.mockResolvedValueOnce({ exists: () => true, val: () => ({}) }); // For updateStat
      
      const result = await statManager.handleCravingResistance();
      
      expect(result).toBe(true);
      
      // Should only award trigger defense, not mental strength
      expect(set).toHaveBeenCalledWith(
        expect.objectContaining({ path: `users/${userId}/profile/daily/${today}/cravingResistanceStats` }),
        { mentalStrength: 3, triggerDefense: 3 }
      );
    });

    it('should enforce trigger defense limit of 5 points per day', async () => {
      // Mock existing daily stats with 5 trigger defense points already awarded
      get.mockResolvedValueOnce({ 
        exists: () => true, 
        val: () => ({ mentalStrength: 0, triggerDefense: 5 }) 
      });
      get.mockResolvedValueOnce({ exists: () => true, val: () => ({}) }); // For updateStat
      
      const result = await statManager.handleCravingResistance();
      
      expect(result).toBe(true);
      
      // Should only award mental strength, not trigger defense
      expect(set).toHaveBeenCalledWith(
        expect.objectContaining({ path: `users/${userId}/profile/daily/${today}/cravingResistanceStats` }),
        { mentalStrength: 1, triggerDefense: 5 }
      );
    });

    it('should not award any points when both limits are reached', async () => {
      // Mock existing daily stats with both limits reached
      get.mockResolvedValueOnce({ 
        exists: () => true, 
        val: () => ({ mentalStrength: 3, triggerDefense: 5 }) 
      });
      
      const result = await statManager.handleCravingResistance();
      
      expect(result).toBe(true);
      
      // Should not call updateStat at all
      expect(set).toHaveBeenCalledWith(
        expect.objectContaining({ path: `users/${userId}/profile/daily/${today}/cravingResistanceStats` }),
        { mentalStrength: 3, triggerDefense: 5 }
      );
    });

    it('should handle partial limits correctly', async () => {
      // Mock existing daily stats with partial usage
      get.mockResolvedValueOnce({ 
        exists: () => true, 
        val: () => ({ mentalStrength: 2, triggerDefense: 3 }) 
      });
      get.mockResolvedValueOnce({ exists: () => true, val: () => ({}) }); // For updateStat
      get.mockResolvedValueOnce({ exists: () => true, val: () => ({}) }); // For updateStat
      
      const result = await statManager.handleCravingResistance();
      
      expect(result).toBe(true);
      
      // Should award both stats (1 mental strength, 2 trigger defense)
      expect(set).toHaveBeenCalledWith(
        expect.objectContaining({ path: `users/${userId}/profile/daily/${today}/cravingResistanceStats` }),
        { mentalStrength: 3, triggerDefense: 5 }
      );
    });
  });

  describe('Craving Logging Daily Limits', () => {
    it('should award points on first craving logging of the day', async () => {
      // Mock no existing daily stats
      get.mockResolvedValueOnce({ exists: () => false });
      get.mockResolvedValueOnce({ exists: () => true, val: () => ({}) }); // For updateStat
      get.mockResolvedValueOnce({ exists: () => true, val: () => ({}) }); // For updateStat
      
      const result = await statManager.handleCravingLogged();
      
      expect(result).toBe(true);
      
      // Should award both stats
      expect(set).toHaveBeenCalledWith(
        expect.objectContaining({ path: `users/${userId}/profile/daily/${today}/cravingLoggingStats` }),
        { motivation: 0.25, triggerDefense: 0.25 }
      );
    });

    it('should enforce motivation limit of 0.5 points per day', async () => {
      // Mock existing daily stats with 0.5 motivation points already awarded
      get.mockResolvedValueOnce({ 
        exists: () => true, 
        val: () => ({ motivation: 0.5, triggerDefense: 0 }) 
      });
      get.mockResolvedValueOnce({ exists: () => true, val: () => ({}) }); // For updateStat
      
      const result = await statManager.handleCravingLogged();
      
      expect(result).toBe(true);
      
      // Should only award trigger defense, not motivation
      expect(set).toHaveBeenCalledWith(
        expect.objectContaining({ path: `users/${userId}/profile/daily/${today}/cravingLoggingStats` }),
        { motivation: 0.5, triggerDefense: 0.25 }
      );
    });

    it('should enforce trigger defense limit of 0.5 points per day', async () => {
      // Mock existing daily stats with 0.5 trigger defense points already awarded
      get.mockResolvedValueOnce({ 
        exists: () => true, 
        val: () => ({ motivation: 0, triggerDefense: 0.5 }) 
      });
      get.mockResolvedValueOnce({ exists: () => true, val: () => ({}) }); // For updateStat
      
      const result = await statManager.handleCravingLogged();
      
      expect(result).toBe(true);
      
      // Should only award motivation, not trigger defense
      expect(set).toHaveBeenCalledWith(
        expect.objectContaining({ path: `users/${userId}/profile/daily/${today}/cravingLoggingStats` }),
        { motivation: 0.25, triggerDefense: 0.5 }
      );
    });

    it('should not award any points when both limits are reached', async () => {
      // Mock existing daily stats with both limits reached
      get.mockResolvedValueOnce({ 
        exists: () => true, 
        val: () => ({ motivation: 0.5, triggerDefense: 0.5 }) 
      });
      
      const result = await statManager.handleCravingLogged();
      
      expect(result).toBe(true);
      
      // Should not call updateStat at all
      expect(set).toHaveBeenCalledWith(
        expect.objectContaining({ path: `users/${userId}/profile/daily/${today}/cravingLoggingStats` }),
        { motivation: 0.5, triggerDefense: 0.5 }
      );
    });
  });

  describe('Daily Stats Retrieval', () => {
    it('should return correct daily craving resistance stats', async () => {
      // Mock existing daily stats
      get.mockResolvedValueOnce({ 
        exists: () => true, 
        val: () => ({ mentalStrength: 2, triggerDefense: 3 }) 
      });
      
      const stats = await statManager.getDailyCravingResistanceStats();
      
      expect(stats).toEqual({
        mentalStrength: 2,
        triggerDefense: 3,
        mentalStrengthLimit: 3,
        triggerDefenseLimit: 5,
        mentalStrengthRemaining: 1,
        triggerDefenseRemaining: 2
      });
    });

    it('should return correct daily craving logging stats', async () => {
      // Mock existing daily stats
      get.mockResolvedValueOnce({ 
        exists: () => true, 
        val: () => ({ motivation: 0.25, triggerDefense: 0.25 }) 
      });
      
      const stats = await statManager.getDailyCravingLoggingStats();
      
      expect(stats).toEqual({
        motivation: 0.25,
        triggerDefense: 0.25,
        motivationLimit: 0.5,
        triggerDefenseLimit: 0.5,
        motivationRemaining: 0.25,
        triggerDefenseRemaining: 0.25
      });
    });

    it('should return default stats when no daily data exists', async () => {
      // Mock no existing daily stats
      get.mockResolvedValueOnce({ exists: () => false });
      
      const stats = await statManager.getDailyCravingResistanceStats();
      
      expect(stats).toEqual({
        mentalStrength: 0,
        triggerDefense: 0,
        mentalStrengthLimit: 3,
        triggerDefenseLimit: 5,
        mentalStrengthRemaining: 3,
        triggerDefenseRemaining: 5
      });
    });
  });

  describe('Daily Limit Enforcement Edge Cases', () => {
    it('should handle database errors gracefully', async () => {
      // Mock database error
      get.mockRejectedValueOnce(new Error('Database error'));
      
      const result = await statManager.handleCravingResistance();
      
      expect(result).toBe(true);
      // Should default to allowing points on error
    });

    it('should reset limits at midnight', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();
      
      // Mock yesterday's stats with limits reached
      get.mockResolvedValueOnce({ 
        exists: () => true, 
        val: () => ({ mentalStrength: 3, triggerDefense: 5 }) 
      });
      
      // Mock today's stats (should be empty)
      get.mockResolvedValueOnce({ exists: () => false });
      get.mockResolvedValueOnce({ exists: () => true, val: () => ({}) }); // For updateStat
      get.mockResolvedValueOnce({ exists: () => true, val: () => ({}) }); // For updateStat
      
      const result = await statManager.handleCravingResistance();
      
      expect(result).toBe(true);
      
      // Should award points since it's a new day
      expect(set).toHaveBeenCalledWith(
        expect.objectContaining({ path: `users/${userId}/profile/daily/${today}/cravingResistanceStats` }),
        { mentalStrength: 1, triggerDefense: 3 }
      );
    });

    it('should handle multiple craving resistances in the same day', async () => {
      // First resistance
      get.mockResolvedValueOnce({ exists: () => false });
      get.mockResolvedValueOnce({ exists: () => true, val: () => ({}) }); // For updateStat
      get.mockResolvedValueOnce({ exists: () => true, val: () => ({}) }); // For updateStat
      
      await statManager.handleCravingResistance();
      
      // Second resistance
      get.mockResolvedValueOnce({ 
        exists: () => true, 
        val: () => ({ mentalStrength: 1, triggerDefense: 3 }) 
      });
      get.mockResolvedValueOnce({ exists: () => true, val: () => ({}) }); // For updateStat
      get.mockResolvedValueOnce({ exists: () => true, val: () => ({}) }); // For updateStat
      
      await statManager.handleCravingResistance();
      
      // Third resistance (should hit mental strength limit)
      get.mockResolvedValueOnce({ 
        exists: () => true, 
        val: () => ({ mentalStrength: 3, triggerDefense: 6 }) 
      });
      get.mockResolvedValueOnce({ exists: () => true, val: () => ({}) }); // For updateStat
      
      await statManager.handleCravingResistance();
      
      // Fourth resistance (should hit both limits)
      get.mockResolvedValueOnce({ 
        exists: () => true, 
        val: () => ({ mentalStrength: 3, triggerDefense: 9 }) 
      });
      
      await statManager.handleCravingResistance();
      
      // Verify all calls were made
      expect(set).toHaveBeenCalledTimes(4);
    });
  });
});
