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

describe('StatManager User Isolation', () => {
  let mockDb;
  let statManagerUserA;
  let statManagerUserB;
  
  const userA = { uid: 'userA123', name: 'User A' };
  const userB = { uid: 'userB456', name: 'User B' };

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Mock database
    mockDb = { mock: true };
    
    // Create separate StatManager instances for each user
    statManagerUserA = new StatManager(mockDb, userA.uid);
    statManagerUserB = new StatManager(mockDb, userB.uid);
    
    // Mock successful database operations
    get.mockResolvedValue({ exists: () => true, val: () => ({}) });
    set.mockResolvedValue();
    push.mockResolvedValue({ key: 'mockKey' });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Constructor Isolation', () => {
    it('should create separate user-scoped references for each user', () => {
      // Verify User A references
      expect(statManagerUserA.userRef.path).toBe(`users/${userA.uid}`);
      expect(statManagerUserA.statsRef.path).toBe(`users/${userA.uid}/stats`);
      expect(statManagerUserA.profileRef.path).toBe(`users/${userA.uid}/profile`);
      expect(statManagerUserA.behaviorLogRef.path).toBe(`users/${userA.uid}/behaviorLog`);

      // Verify User B references
      expect(statManagerUserB.userRef.path).toBe(`users/${userB.uid}`);
      expect(statManagerUserB.statsRef.path).toBe(`users/${userB.uid}/stats`);
      expect(statManagerUserB.profileRef.path).toBe(`users/${userB.uid}/profile`);
      expect(statManagerUserB.behaviorLogRef.path).toBe(`users/${userB.uid}/behaviorLog`);

      // Verify different paths
      expect(statManagerUserA.userRef.path).not.toBe(statManagerUserB.userRef.path);
    });
  });

  describe('Hydration Behavior Isolation', () => {
    it('should log hydration to user-specific paths', async () => {
      await statManagerUserA.handleHydrationUpdate(6);
      await statManagerUserB.handleHydrationUpdate(8);

      // Verify User A hydration logged to correct path
      expect(set).toHaveBeenCalledWith(
        expect.objectContaining({ path: `users/${userA.uid}/profile/daily/${new Date().toDateString()}/water` }),
        6
      );

      // Verify User B hydration logged to correct path
      expect(set).toHaveBeenCalledWith(
        expect.objectContaining({ path: `users/${userB.uid}/profile/${new Date().toDateString()}/water` }),
        8
      );

      // Verify different paths were used
      const setCalls = set.mock.calls;
      const userAPath = setCalls.find(call => call[0].path.includes(userA.uid));
      const userBPath = setCalls.find(call => call[0].path.includes(userB.uid));
      
      expect(userAPath).toBeDefined();
      expect(userBPath).toBeDefined();
      expect(userAPath[0].path).not.toBe(userBPath[0].path);
    });
  });

  describe('Breathing Exercise Isolation', () => {
    it('should log breathing exercises to user-specific paths', async () => {
      await statManagerUserA.handleBreathingExercise();
      await statManagerUserB.handleBreathingExercise();

      // Verify User A breathing logged to correct path
      expect(set).toHaveBeenCalledWith(
        expect.objectContaining({ path: `users/${userA.uid}/profile/daily/${new Date().toDateString()}/breathing` }),
        true
      );

      // Verify User B breathing logged to correct path
      expect(set).toHaveBeenCalledWith(
        expect.objectContaining({ path: `users/${userB.uid}/profile/daily/${new Date().toDateString()}/breathing` }),
        true
      );
    });
  });

  describe('Craving Behavior Isolation', () => {
    it('should log craving resistance to user-specific paths', async () => {
      await statManagerUserA.handleCravingResistance();
      await statManagerUserB.handleCravingResistance();

      // Verify behavior logging calls use correct user paths
      const pushCalls = push.mock.calls;
      expect(pushCalls.length).toBeGreaterThan(0);
      
      // Each user should have their own behavior log
      pushCalls.forEach(call => {
        expect(call[0].path).toMatch(/^users\/(userA123|userB456)\/behaviorLog$/);
      });
    });

    it('should log craving awareness to user-specific paths', async () => {
      await statManagerUserA.handleCravingLogged();
      await statManagerUserB.handleCravingLogged();

      // Verify behavior logging calls use correct user paths
      const pushCalls = push.mock.calls;
      expect(pushCalls.length).toBeGreaterThan(0);
      
      pushCalls.forEach(call => {
        expect(call[0].path).toMatch(/^users\/(userA123|userB456)\/behaviorLog$/);
      });
    });
  });

  describe('Relapse Handling Isolation', () => {
    it('should log relapses to user-specific paths', async () => {
      await statManagerUserA.handleRelapse();
      await statManagerUserB.handleRelapse();

      // Verify relapse dates logged to correct user paths
      expect(set).toHaveBeenCalledWith(
        expect.objectContaining({ path: `users/${userA.uid}/profile/relapseDate` }),
        expect.any(String)
      );

      expect(set).toHaveBeenCalledWith(
        expect.objectContaining({ path: `users/${userB.uid}/profile/relapseDate` }),
        expect.any(String)
      );

      // Verify behavior logging calls use correct user paths
      const pushCalls = push.mock.calls;
      expect(pushCalls.length).toBeGreaterThan(0);
      
      pushCalls.forEach(call => {
        expect(call[0].path).toMatch(/^users\/(userA123|userB456)\/behaviorLog$/);
      });
    });
  });

  describe('Activity Tracking Isolation', () => {
    it('should track activity to user-specific paths', async () => {
      await statManagerUserA.trackLoggingActivity();
      await statManagerUserB.trackLoggingActivity();

      // Verify daily activity logged to correct user paths
      expect(set).toHaveBeenCalledWith(
        expect.objectContaining({ path: `users/${userA.uid}/profile/daily/${new Date().toDateString()}/logged` }),
        true
      );

      expect(set).toHaveBeenCalledWith(
        expect.objectContaining({ path: `users/${userB.uid}/profile/daily/${new Date().toDateString()}/logged` }),
        true
      );

      // Verify last activity timestamps logged to correct user paths
      expect(set).toHaveBeenCalledWith(
        expect.objectContaining({ path: `users/${userA.uid}/profile/lastActivity` }),
        expect.any(String)
      );

      expect(set).toHaveBeenCalledWith(
        expect.objectContaining({ path: `users/${userB.uid}/profile/lastActivity` }),
        expect.any(String)
      );
    });
  });

  describe('Milestone Tracking Isolation', () => {
    it('should track milestones to user-specific paths', async () => {
      // Mock user data for milestone checking
      get.mockResolvedValueOnce({ exists: () => true, val: () => ({ quitDate: '2024-01-01' }) });
      get.mockResolvedValueOnce({ exists: () => false }); // No milestone yet
      get.mockResolvedValueOnce({ exists: () => true, val: () => ({ quitDate: '2024-01-01' }) });
      get.mockResolvedValueOnce({ exists: () => false }); // No milestone yet

      await statManagerUserA.checkMilestoneBonuses();
      await statManagerUserB.checkMilestoneBonuses();

      // Verify milestone tracking uses correct user paths
      const setCalls = set.mock.calls;
      const milestoneCalls = setCalls.filter(call => call[0].path.includes('milestone_'));
      
      expect(milestoneCalls.length).toBeGreaterThan(0);
      
      milestoneCalls.forEach(call => {
        expect(call[0].path).toMatch(/^users\/(userA123|userB456)\/profile\/milestone_\d+$/);
      });
    });
  });

  describe('Streak Checking Isolation', () => {
    it('should check streaks from user-specific paths', async () => {
      // Mock streak data for different users
      get.mockResolvedValue({ exists: () => true, val: () => 6 }); // User A has 6 glasses
      get.mockResolvedValue({ exists: () => true, val: () => 8 }); // User B has 8 glasses

      const userAStreak = await statManagerUserA.checkHydrationStreak();
      const userBStreak = await statManagerUserB.checkHydrationStreak();

      expect(userAStreak).toBe(1); // Will find one day with water > 0
      expect(userBStreak).toBe(1); // Will find one day with water > 0

      // Verify all database calls used correct user paths
      const getCalls = get.mock.calls;
      getCalls.forEach(call => {
        expect(call[0].path).toMatch(/^users\/(userA123|userB456)\/profile\/daily\//);
      });
    });
  });

  describe('App Usage Tracking Isolation', () => {
    it('should track app usage during cravings to user-specific paths', async () => {
      await statManagerUserA.trackAppUsageDuringCravings();
      await statManagerUserB.trackAppUsageDuringCravings();

      // Verify app usage tracking uses correct user paths
      const setCalls = set.mock.calls;
      const usageCalls = setCalls.filter(call => call[0].path.includes('appUsage_'));
      
      expect(usageCalls.length).toBeGreaterThan(0);
      
      usageCalls.forEach(call => {
        expect(call[0].path).toMatch(/^users\/(userA123|userB456)\/profile\/appUsage_/);
      });
    });
  });

  describe('Cross-User Contamination Prevention', () => {
    it('should never read from other users\' data', async () => {
      // Mock that User A has some data
      get.mockResolvedValueOnce({ exists: () => true, val: () => ({ quitDate: '2024-01-01' }) });
      
      // User A checks milestones
      await statManagerUserA.checkMilestoneBonuses();
      
      // Verify all database reads were to User A's paths only
      const getCalls = get.mock.calls;
      getCalls.forEach(call => {
        expect(call[0].path).toContain(userA.uid);
        expect(call[0].path).not.toContain(userB.uid);
      });
    });

    it('should never write to other users\' data', async () => {
      // User A logs some behaviors
      await statManagerUserA.handleCravingResistance();
      await statManagerUserA.handleHydrationUpdate(6);
      
      // Verify all database writes were to User A's paths only
      const setCalls = set.mock.calls;
      setCalls.forEach(call => {
        expect(call[0].path).toContain(userA.uid);
        expect(call[0].path).not.toContain(userB.uid);
      });
    });
  });

  describe('Behavior Logging Isolation', () => {
    it('should log all behaviors to user-specific behavior logs', async () => {
      // Perform various behaviors for both users
      await statManagerUserA.handleCravingResistance();
      await statManagerUserA.handleHydrationUpdate(6);
      await statManagerUserA.handleBreathingExercise();
      
      await statManagerUserB.handleRelapse();
      await statManagerUserB.handleCravingLogged();
      
      // Verify all behavior logging uses correct user paths
      const pushCalls = push.mock.calls;
      expect(pushCalls.length).toBeGreaterThan(0);
      
      pushCalls.forEach(call => {
        expect(call[0].path).toMatch(/^users\/(userA123|userB456)\/behaviorLog$/);
      });
      
      // Count behaviors per user
      const userABehaviors = pushCalls.filter(call => call[0].path.includes(userA.uid));
      const userBBehaviors = pushCalls.filter(call => call[0].path.includes(userB.uid));
      
      expect(userABehaviors.length).toBe(3); // 3 behaviors for User A
      expect(userBBehaviors.length).toBe(2); // 2 behaviors for User B
    });
  });

  describe('Daily Updates Isolation', () => {
    it('should run daily updates only for the specific user', async () => {
      // Mock user data
      get.mockResolvedValueOnce({ exists: () => true, val: () => ({ createdAt: '2024-01-01' }) });
      get.mockResolvedValueOnce({ exists: () => true, val: () => ({ createdAt: '2024-01-01' }) });
      
      await statManagerUserA.runDailyUpdates();
      await statManagerUserB.runDailyUpdates();
      
      // Verify all database operations were user-scoped
      const allCalls = [...get.mock.calls, ...set.mock.calls];
      allCalls.forEach(call => {
        expect(call[0].path).toMatch(/^users\/(userA123|userB456)\//);
      });
    });
  });
});
