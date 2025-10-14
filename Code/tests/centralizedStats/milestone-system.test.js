import { describe, it, expect, beforeEach, vi } from 'vitest';
import CentralizedStatService from '../../src/services/centralizedStatService.js';

// Mock Firebase
const mockGet = vi.fn();
const mockSet = vi.fn();
const mockRef = vi.fn();

vi.mock('firebase/database', () => ({
  ref: mockRef,
  get: mockGet,
  set: mockSet,
  onValue: vi.fn()
}));

describe('CentralizedStatService - Milestone System', () => {
  let service;
  const userId = 'test-user-123';
  const mockDb = {};

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup mock ref
    mockRef.mockImplementation((db, path) => ({ path, toString: () => path }));
    
    service = new CentralizedStatService(mockDb, userId);
  });

  describe('Milestone Detection and Bonuses', () => {
    it('should award 7-day milestone bonus correctly', async () => {
      const effectiveQuitDate = new Date();
      effectiveQuitDate.setDate(effectiveQuitDate.getDate() - 7); // 7 days ago
      
      const currentStats = {
        mentalStrength: 50,
        addictionLevel: 60,
        triggerDefense: 40
      };

      // Mock milestone not yet achieved
      mockGet.mockResolvedValueOnce({
        exists: () => false
      });

      const result = await service.checkMilestones(effectiveQuitDate.toISOString(), currentStats);

      expect(result.mentalStrength).toBe(55); // 50 + 5 bonus
      expect(mockSet).toHaveBeenCalledWith(
        expect.objectContaining({ path: expect.stringContaining('milestone_7') }),
        expect.objectContaining({
          achieved: true,
          bonus: 5,
          cleanDaysAtAchievement: 7
        })
      );
    });

    it('should award 30-day milestone bonus correctly', async () => {
      const effectiveQuitDate = new Date();
      effectiveQuitDate.setDate(effectiveQuitDate.getDate() - 30); // 30 days ago
      
      const currentStats = {
        mentalStrength: 60,
        addictionLevel: 45,
        triggerDefense: 50
      };

      // Mock milestone not yet achieved
      mockGet.mockResolvedValueOnce({
        exists: () => false
      });

      const result = await service.checkMilestones(effectiveQuitDate.toISOString(), currentStats);

      expect(result.mentalStrength).toBe(70); // 60 + 10 bonus
      expect(mockSet).toHaveBeenCalledWith(
        expect.objectContaining({ path: expect.stringContaining('milestone_30') }),
        expect.objectContaining({
          achieved: true,
          bonus: 10,
          cleanDaysAtAchievement: 30
        })
      );
    });

    it('should award 90-day milestone bonus correctly', async () => {
      const effectiveQuitDate = new Date();
      effectiveQuitDate.setDate(effectiveQuitDate.getDate() - 90); // 90 days ago
      
      const currentStats = {
        mentalStrength: 70,
        addictionLevel: 35,
        triggerDefense: 60
      };

      // Mock milestone not yet achieved
      mockGet.mockResolvedValueOnce({
        exists: () => false
      });

      const result = await service.checkMilestones(effectiveQuitDate.toISOString(), currentStats);

      expect(result.mentalStrength).toBe(85); // 70 + 15 bonus
      expect(mockSet).toHaveBeenCalledWith(
        expect.objectContaining({ path: expect.stringContaining('milestone_90') }),
        expect.objectContaining({
          achieved: true,
          bonus: 15,
          cleanDaysAtAchievement: 90
        })
      );
    });

    it('should not award milestone bonus twice', async () => {
      const effectiveQuitDate = new Date();
      effectiveQuitDate.setDate(effectiveQuitDate.getDate() - 10); // 10 days ago (past 7-day milestone)
      
      const currentStats = {
        mentalStrength: 55, // Already has 7-day bonus
        addictionLevel: 60,
        triggerDefense: 40
      };

      // Mock milestone already achieved
      mockGet.mockResolvedValueOnce({
        exists: () => true,
        val: () => ({
          achieved: true,
          achievedDate: '2025-09-14T12:00:00.000Z',
          bonus: 5,
          cleanDaysAtAchievement: 7
        })
      });

      const result = await service.checkMilestones(effectiveQuitDate.toISOString(), currentStats);

      expect(result).toEqual({}); // No updates
      expect(mockSet).not.toHaveBeenCalled(); // No new milestone set
    });

    it('should cap mental strength at 100', async () => {
      const effectiveQuitDate = new Date();
      effectiveQuitDate.setDate(effectiveQuitDate.getDate() - 90); // 90 days ago
      
      const currentStats = {
        mentalStrength: 95, // High mental strength
        addictionLevel: 30,
        triggerDefense: 70
      };

      // Mock milestone not yet achieved
      mockGet.mockResolvedValueOnce({
        exists: () => false
      });

      const result = await service.checkMilestones(effectiveQuitDate.toISOString(), currentStats);

      expect(result.mentalStrength).toBe(100); // Capped at 100, not 110
    });
  });

  describe('Weekly Addiction Reduction', () => {
    it('should calculate addiction reduction correctly for multiple weeks', async () => {
      const profileData = {};
      const effectiveQuitDate = new Date();
      effectiveQuitDate.setDate(effectiveQuitDate.getDate() - 21); // 3 weeks ago
      
      // Mock current stats
      mockGet.mockResolvedValueOnce({
        exists: () => true,
        val: () => ({ addictionLevel: 70 })
      });

      const result = await service.calculateAddictionLevel(profileData, effectiveQuitDate.toISOString());

      // 3 weeks * 2 points = 6 points reduction
      expect(result).toBe(64); // 70 - 6 = 64
    });

    it('should respect minimum addiction level of 30', async () => {
      const profileData = {};
      const effectiveQuitDate = new Date();
      effectiveQuitDate.setDate(effectiveQuitDate.getDate() - 84); // 12 weeks ago
      
      // Mock current stats
      mockGet.mockResolvedValueOnce({
        exists: () => true,
        val: () => ({ addictionLevel: 50 })
      });

      const result = await service.calculateAddictionLevel(profileData, effectiveQuitDate.toISOString());

      // 12 weeks * 2 points = 24 points reduction
      // 50 - 24 = 26, but minimum is 30
      expect(result).toBe(30);
    });
  });

  describe('Milestone Reset on Relapse', () => {
    it('should reset all milestones when user relapses', async () => {
      // Mock current stats and relapse data
      mockGet
        .mockResolvedValueOnce({ exists: () => false }) // lastRelapseDate
        .mockResolvedValueOnce({ exists: () => false }) // escalationLevel
        .mockResolvedValueOnce({ // statsSnapshot
          exists: () => true,
          val: () => ({
            mentalStrength: 65, // Has milestone bonuses
            addictionLevel: 40,
            triggerDefense: 50
          })
        });

      await service.handleRelapse();

      // Verify milestones are reset
      expect(mockSet).toHaveBeenCalledWith(
        expect.objectContaining({ path: expect.stringContaining('milestones') }),
        null
      );
    });
  });

  describe('User Journey Simulation', () => {
    it('should handle complete user journey: 0 → 7 → 30 → 90 days', async () => {
      const baseStats = {
        mentalStrength: 50,
        addictionLevel: 70,
        triggerDefense: 40
      };

      // Day 0: No milestones
      let effectiveQuitDate = new Date().toISOString();
      mockGet.mockResolvedValueOnce({ exists: () => false });
      
      let result = await service.checkMilestones(effectiveQuitDate, baseStats);
      expect(result).toEqual({}); // No bonuses yet

      // Day 7: First milestone
      effectiveQuitDate = new Date();
      effectiveQuitDate.setDate(effectiveQuitDate.getDate() - 7);
      mockGet.mockResolvedValueOnce({ exists: () => false });
      
      result = await service.checkMilestones(effectiveQuitDate.toISOString(), baseStats);
      expect(result.mentalStrength).toBe(55); // +5 bonus

      // Day 30: Second milestone (with previous bonus)
      effectiveQuitDate = new Date();
      effectiveQuitDate.setDate(effectiveQuitDate.getDate() - 30);
      const statsAfter7Days = { ...baseStats, mentalStrength: 55 };
      mockGet.mockResolvedValueOnce({ exists: () => false });
      
      result = await service.checkMilestones(effectiveQuitDate.toISOString(), statsAfter7Days);
      expect(result.mentalStrength).toBe(65); // 55 + 10 bonus

      // Day 90: Third milestone (with previous bonuses)
      effectiveQuitDate = new Date();
      effectiveQuitDate.setDate(effectiveQuitDate.getDate() - 90);
      const statsAfter30Days = { ...baseStats, mentalStrength: 65 };
      mockGet.mockResolvedValueOnce({ exists: () => false });
      
      result = await service.checkMilestones(effectiveQuitDate.toISOString(), statsAfter30Days);
      expect(result.mentalStrength).toBe(80); // 65 + 15 bonus
    });
  });
});
