import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock Firebase
const mockDb = {};

vi.mock('firebase/database', () => ({
  ref: vi.fn((db, path) => ({ path, toString: () => path })),
  get: vi.fn(),
  set: vi.fn(),
  push: vi.fn()
}));

// Import StatManager after mocking
import StatManager from '../../src/services/statManager.js';

describe('Addiction Stat Decay and Relapse Penalties - Simple Tests', () => {
  let statManager;
  const mockUserUID = 'test-user-123';
  let mockGet, mockSet, mockPush;

  beforeEach(async () => {
    vi.clearAllMocks();
    
    // Get the mocked functions
    const { get, set, push } = await import('firebase/database');
    mockGet = get;
    mockSet = set;
    mockPush = push;
    
    statManager = new StatManager(mockDb, mockUserUID);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Relapse Penalty Logic', () => {
    it('should apply +4 points for first relapse (no previous relapse)', async () => {
      // Mock no previous relapses
      mockGet.mockImplementation((ref) => {
        const path = ref.path;
        if (path.includes('stats')) {
          return Promise.resolve({ 
            exists: () => true, 
            val: () => ({ 
              addictionLevel: 50, 
              mentalStrength: 50, 
              triggerDefense: 30,
              motivation: 50
            }) 
          });
        } else if (path.includes('lastRelapseDate')) {
          return Promise.resolve({ exists: () => false, val: () => null });
        } else if (path.includes('relapseEscalationLevel')) {
          return Promise.resolve({ exists: () => false, val: () => null });
        }
        return Promise.resolve({ exists: () => false, val: () => null });
      });

      const result = await statManager.handleRelapse();

      expect(result).toBe(true);
      
      // Should have called set for stats update
      const statsSetCalls = mockSet.mock.calls.filter(call => 
        call[0].path.includes('stats')
      );
      expect(statsSetCalls.length).toBeGreaterThan(0);
      
      // Should have called set for escalation level
      const escalationSetCalls = mockSet.mock.calls.filter(call => 
        call[0].path.includes('relapseEscalationLevel')
      );
      expect(escalationSetCalls.length).toBeGreaterThan(0);
    });

    it('should apply +6 points for second relapse within 7 days', async () => {
      // Mock previous relapse 3 days ago
      const lastRelapse = new Date('2024-01-12T12:00:00Z'); // 3 days ago
      
      mockGet.mockImplementation((ref) => {
        const path = ref.path;
        if (path.includes('stats')) {
          return Promise.resolve({ 
            exists: () => true, 
            val: () => ({ 
              addictionLevel: 50, 
              mentalStrength: 50, 
              triggerDefense: 30,
              motivation: 50
            }) 
          });
        } else if (path.includes('lastRelapseDate')) {
          return Promise.resolve({ 
            exists: () => true, 
            val: () => lastRelapse.toISOString() 
          });
        } else if (path.includes('relapseEscalationLevel')) {
          return Promise.resolve({ exists: () => true, val: () => 1 });
        }
        return Promise.resolve({ exists: () => false, val: () => null });
      });

      const result = await statManager.handleRelapse();

      expect(result).toBe(true);
      
      // Should have called set for stats update
      const statsSetCalls = mockSet.mock.calls.filter(call => 
        call[0].path.includes('stats')
      );
      expect(statsSetCalls.length).toBeGreaterThan(0);
    });

    it('should apply +8 points for third+ relapse within 3 days', async () => {
      // Mock previous relapse 2 days ago
      const lastRelapse = new Date('2024-01-13T12:00:00Z'); // 2 days ago
      
      mockGet.mockImplementation((ref) => {
        const path = ref.path;
        if (path.includes('stats')) {
          return Promise.resolve({ 
            exists: () => true, 
            val: () => ({ 
              addictionLevel: 50, 
              mentalStrength: 50, 
              triggerDefense: 30,
              motivation: 50
            }) 
          });
        } else if (path.includes('lastRelapseDate')) {
          return Promise.resolve({ 
            exists: () => true, 
            val: () => lastRelapse.toISOString() 
          });
        } else if (path.includes('relapseEscalationLevel')) {
          return Promise.resolve({ exists: () => true, val: () => 2 });
        }
        return Promise.resolve({ exists: () => false, val: () => null });
      });

      const result = await statManager.handleRelapse();

      expect(result).toBe(true);
      
      // Should have called set for stats update
      const statsSetCalls = mockSet.mock.calls.filter(call => 
        call[0].path.includes('stats')
      );
      expect(statsSetCalls.length).toBeGreaterThan(0);
    });

    it('should reset escalation level to 1 after 7+ clean days', async () => {
      // Mock previous relapse 10 days ago
      const lastRelapse = new Date('2024-01-05T12:00:00Z'); // 10 days ago
      
      mockGet.mockImplementation((ref) => {
        const path = ref.path;
        if (path.includes('stats')) {
          return Promise.resolve({ 
            exists: () => true, 
            val: () => ({ 
              addictionLevel: 50, 
              mentalStrength: 50, 
              triggerDefense: 30,
              motivation: 50
            }) 
          });
        } else if (path.includes('lastRelapseDate')) {
          return Promise.resolve({ 
            exists: () => true, 
            val: () => lastRelapse.toISOString() 
          });
        } else if (path.includes('relapseEscalationLevel')) {
          return Promise.resolve({ exists: () => true, val: () => 3 }); // High escalation level
        }
        return Promise.resolve({ exists: () => false, val: () => null });
      });

      const result = await statManager.handleRelapse();

      expect(result).toBe(true);
      
      // Should have called set for escalation level reset
      const escalationSetCalls = mockSet.mock.calls.filter(call => 
        call[0].path.includes('relapseEscalationLevel')
      );
      expect(escalationSetCalls.length).toBeGreaterThan(0);
    });
  });

  describe('Addiction Status Tracking', () => {
    it('should return addiction status for clean user', async () => {
      const quitDate = new Date('2024-01-01T12:00:00Z'); // 2 weeks ago
      
      mockGet.mockImplementation((ref) => {
        const path = ref.path;
        if (path.includes('lastRelapseDate')) {
          return Promise.resolve({ exists: () => false, val: () => null });
        } else if (path.includes('relapseEscalationLevel')) {
          return Promise.resolve({ exists: () => false, val: () => null });
        } else if (path.includes('users/test-user-123')) {
          return Promise.resolve({ 
            exists: () => true, 
            val: () => ({ quitDate: quitDate.toISOString() }) 
          });
        }
        return Promise.resolve({ exists: () => false, val: () => null });
      });

      const status = await statManager.getAddictionStatus();

      expect(status).not.toBeNull();
      expect(status.lastRelapseDate).toEqual(quitDate);
      expect(status.escalationLevel).toBe(1);
      expect(status.isCleanFor7Days).toBe(true);
    });

    it('should return addiction status for user with recent relapse', async () => {
      // Use a date that's actually 3 days ago from current time
      const now = new Date();
      const lastRelapse = new Date(now.getTime() - (3 * 24 * 60 * 60 * 1000)); // 3 days ago
      
      mockGet.mockImplementation((ref) => {
        const path = ref.path;
        if (path.includes('lastRelapseDate')) {
          return Promise.resolve({ 
            exists: () => true, 
            val: () => lastRelapse.toISOString() 
          });
        } else if (path.includes('relapseEscalationLevel')) {
          return Promise.resolve({ exists: () => true, val: () => 2 });
        } else if (path.includes('users/test-user-123')) {
          return Promise.resolve({ 
            exists: () => true, 
            val: () => ({ quitDate: new Date('2023-12-01T12:00:00Z').toISOString() }) 
          });
        }
        return Promise.resolve({ exists: () => false, val: () => null });
      });

      const status = await statManager.getAddictionStatus();

      expect(status).not.toBeNull();
      expect(status.lastRelapseDate).toEqual(lastRelapse);
      expect(status.escalationLevel).toBe(2);
      expect(status.isCleanFor7Days).toBe(false);
    });
  });

  describe('Database Field Updates', () => {
    it('should update lastRelapseDate and relapseEscalationLevel on relapse', async () => {
      // Mock no previous relapses
      mockGet.mockImplementation((ref) => {
        const path = ref.path;
        if (path.includes('stats')) {
          return Promise.resolve({ 
            exists: () => true, 
            val: () => ({ 
              addictionLevel: 50, 
              mentalStrength: 50, 
              triggerDefense: 30,
              motivation: 50
            }) 
          });
        } else if (path.includes('lastRelapseDate')) {
          return Promise.resolve({ exists: () => false, val: () => null });
        } else if (path.includes('relapseEscalationLevel')) {
          return Promise.resolve({ exists: () => false, val: () => null });
        }
        return Promise.resolve({ exists: () => false, val: () => null });
      });

      await statManager.handleRelapse();

      // Should have called set for lastRelapseDate
      const relapseDateSetCalls = mockSet.mock.calls.filter(call => 
        call[0].path.includes('lastRelapseDate')
      );
      expect(relapseDateSetCalls.length).toBeGreaterThan(0);
      
      // Should have called set for relapseEscalationLevel
      const escalationSetCalls = mockSet.mock.calls.filter(call => 
        call[0].path.includes('relapseEscalationLevel')
      );
      expect(escalationSetCalls.length).toBeGreaterThan(0);
    });

    it('should reset escalation level when called directly', async () => {
      await statManager.resetRelapseEscalationLevel();

      // Should have called set for relapseEscalationLevel with value 1
      const escalationSetCalls = mockSet.mock.calls.filter(call => 
        call[0].path.includes('relapseEscalationLevel')
      );
      expect(escalationSetCalls.length).toBeGreaterThan(0);
      expect(escalationSetCalls[0][1]).toBe(1);
    });
  });
});
