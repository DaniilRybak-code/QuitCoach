/**
 * Rate Limiting Service
 * Prevents abuse and ensures fair usage during beta testing
 */

class RateLimitingService {
  constructor() {
    this.rateLimits = {
      // API calls per minute
      apiCalls: { limit: 60, window: 60000 },
      // Authentication attempts per minute
      authAttempts: { limit: 5, window: 60000 },
      // Database writes per minute
      databaseWrites: { limit: 30, window: 60000 },
      // Database reads per minute
      databaseReads: { limit: 100, window: 60000 },
      // Behavioral logs per hour
      behavioralLogs: { limit: 50, window: 3600000 },
      // Stress test runs per hour
      stressTests: { limit: 3, window: 3600000 },
      // Error reports per minute
      errorReports: { limit: 10, window: 60000 },
      // Profile updates per hour
      profileUpdates: { limit: 10, window: 3600000 }
    };

    this.userLimits = new Map();
    this.globalLimits = new Map();
    this.blockedUsers = new Set();
    this.suspiciousActivity = new Map();
    this.setupRateLimitCleanup();
  }

  /**
   * Initialize rate limiting for user
   */
  initialize(userId) {
    this.userId = userId;
    this.initializeUserLimits();
    console.log('✅ RateLimitingService: Initialized for user', userId);
  }

  /**
   * Initialize user-specific limits
   */
  initializeUserLimits() {
    if (!this.userId) return;

    const userLimits = {
      apiCalls: [],
      authAttempts: [],
      databaseWrites: [],
      databaseReads: [],
      behavioralLogs: [],
      stressTests: [],
      errorReports: [],
      profileUpdates: []
    };

    this.userLimits.set(this.userId, userLimits);
  }

  /**
   * Check if action is allowed
   */
  isAllowed(action, userId = null) {
    const targetUserId = userId || this.userId;
    
    if (!targetUserId) {
      console.error('❌ RateLimitingService: User ID required for rate limiting');
      return false;
    }

    // Check if user is blocked
    if (this.blockedUsers.has(targetUserId)) {
      console.warn(`🚫 RateLimitingService: User ${targetUserId} is blocked`);
      return false;
    }

    // Check if user is suspicious
    if (this.isSuspiciousUser(targetUserId)) {
      console.warn(`⚠️ RateLimitingService: User ${targetUserId} has suspicious activity`);
      return false;
    }

    const limit = this.rateLimits[action];
    if (!limit) {
      console.warn(`⚠️ RateLimitingService: Unknown action: ${action}`);
      return true; // Allow unknown actions
    }

    const userLimits = this.userLimits.get(targetUserId);
    if (!userLimits) {
      this.initializeUserLimits();
      return true; // Allow first action
    }

    const now = Date.now();
    const windowStart = now - limit.window;

    // Clean old entries
    userLimits[action] = userLimits[action].filter(timestamp => timestamp > windowStart);

    // Check if limit exceeded
    if (userLimits[action].length >= limit.limit) {
      this.recordRateLimitExceeded(action, targetUserId);
      return false;
    }

    // Record the action
    userLimits[action].push(now);
    this.userLimits.set(targetUserId, userLimits);

    return true;
  }

  /**
   * Record rate limit exceeded
   */
  recordRateLimitExceeded(action, userId) {
    console.warn(`🚫 RateLimitingService: Rate limit exceeded for ${action} by user ${userId}`);
    
    // Log the event
    if (window.errorLoggingService) {
      window.errorLoggingService.logError('rate_limit_exceeded', {
        action,
        userId,
        severity: 'warning'
      });
    }

    // Track suspicious activity
    this.trackSuspiciousActivity(userId, action);
  }

  /**
   * Track suspicious activity
   */
  trackSuspiciousActivity(userId, action) {
    if (!this.suspiciousActivity.has(userId)) {
      this.suspiciousActivity.set(userId, []);
    }

    const activities = this.suspiciousActivity.get(userId);
    activities.push({
      action,
      timestamp: Date.now()
    });

    // Keep only last 10 activities
    if (activities.length > 10) {
      activities.splice(0, activities.length - 10);
    }

    this.suspiciousActivity.set(userId, activities);

    // Check if user should be blocked
    this.checkForBlocking(userId);
  }

  /**
   * Check if user should be blocked
   */
  checkForBlocking(userId) {
    const activities = this.suspiciousActivity.get(userId) || [];
    const now = Date.now();
    const recentActivities = activities.filter(activity => 
      now - activity.timestamp < 300000 // Last 5 minutes
    );

    // Block if more than 5 rate limit violations in 5 minutes
    if (recentActivities.length > 5) {
      this.blockUser(userId, 'Excessive rate limit violations');
    }
  }

  /**
   * Block user
   */
  blockUser(userId, reason) {
    this.blockedUsers.add(userId);
    console.warn(`🚫 RateLimitingService: User ${userId} blocked. Reason: ${reason}`);
    
    // Log the blocking
    if (window.errorLoggingService) {
      window.errorLoggingService.logError('user_blocked', {
        userId,
        reason,
        severity: 'critical'
      });
    }

    // Store in localStorage for persistence
    const blockedUsers = JSON.parse(localStorage.getItem('blocked_users') || '[]');
    blockedUsers.push({ userId, reason, timestamp: Date.now() });
    localStorage.setItem('blocked_users', JSON.stringify(blockedUsers));
  }

  /**
   * Unblock user
   */
  unblockUser(userId) {
    this.blockedUsers.delete(userId);
    console.log(`✅ RateLimitingService: User ${userId} unblocked`);
    
    // Remove from localStorage
    const blockedUsers = JSON.parse(localStorage.getItem('blocked_users') || '[]');
    const updatedBlockedUsers = blockedUsers.filter(user => user.userId !== userId);
    localStorage.setItem('blocked_users', JSON.stringify(updatedBlockedUsers));
  }

  /**
   * Check if user is suspicious
   */
  isSuspiciousUser(userId) {
    const activities = this.suspiciousActivity.get(userId) || [];
    const now = Date.now();
    const recentActivities = activities.filter(activity => 
      now - activity.timestamp < 600000 // Last 10 minutes
    );

    return recentActivities.length > 3;
  }

  /**
   * Get remaining attempts for action
   */
  getRemainingAttempts(action, userId = null) {
    const targetUserId = userId || this.userId;
    
    if (!targetUserId) return 0;

    const limit = this.rateLimits[action];
    if (!limit) return 0;

    const userLimits = this.userLimits.get(targetUserId);
    if (!userLimits) return limit.limit;

    const now = Date.now();
    const windowStart = now - limit.window;

    // Clean old entries
    userLimits[action] = userLimits[action].filter(timestamp => timestamp > windowStart);

    return Math.max(0, limit.limit - userLimits[action].length);
  }

  /**
   * Get time until reset for action
   */
  getTimeUntilReset(action, userId = null) {
    const targetUserId = userId || this.userId;
    
    if (!targetUserId) return 0;

    const limit = this.rateLimits[action];
    if (!limit) return 0;

    const userLimits = this.userLimits.get(targetUserId);
    if (!userLimits || userLimits[action].length === 0) return 0;

    const oldestEntry = Math.min(...userLimits[action]);
    const resetTime = oldestEntry + limit.window;
    
    return Math.max(0, resetTime - Date.now());
  }

  /**
   * Setup rate limit cleanup
   */
  setupRateLimitCleanup() {
    // Clean up old entries every 5 minutes
    setInterval(() => {
      this.cleanupOldEntries();
    }, 5 * 60 * 1000);

    // Load blocked users from localStorage
    this.loadBlockedUsers();
  }

  /**
   * Clean up old entries
   */
  cleanupOldEntries() {
    const now = Date.now();
    
    // Clean user limits
    this.userLimits.forEach((limits, userId) => {
      Object.keys(limits).forEach(action => {
        const limit = this.rateLimits[action];
        if (limit) {
          const windowStart = now - limit.window;
          limits[action] = limits[action].filter(timestamp => timestamp > windowStart);
        }
      });
    });

    // Clean suspicious activity
    this.suspiciousActivity.forEach((activities, userId) => {
      const recentActivities = activities.filter(activity => 
        now - activity.timestamp < 3600000 // Keep for 1 hour
      );
      
      if (recentActivities.length === 0) {
        this.suspiciousActivity.delete(userId);
      } else {
        this.suspiciousActivity.set(userId, recentActivities);
      }
    });
  }

  /**
   * Load blocked users from localStorage
   */
  loadBlockedUsers() {
    try {
      const blockedUsers = JSON.parse(localStorage.getItem('blocked_users') || '[]');
      const now = Date.now();
      
      blockedUsers.forEach(user => {
        // Unblock users after 24 hours
        if (now - user.timestamp < 24 * 60 * 60 * 1000) {
          this.blockedUsers.add(user.userId);
        }
      });
    } catch (error) {
      console.error('❌ RateLimitingService: Error loading blocked users:', error);
    }
  }

  /**
   * Get rate limit status
   */
  getRateLimitStatus(userId = null) {
    const targetUserId = userId || this.userId;
    
    if (!targetUserId) return null;

    const status = {
      userId: targetUserId,
      isBlocked: this.blockedUsers.has(targetUserId),
      isSuspicious: this.isSuspiciousUser(targetUserId),
      limits: {}
    };

    Object.keys(this.rateLimits).forEach(action => {
      status.limits[action] = {
        remaining: this.getRemainingAttempts(action, targetUserId),
        resetIn: this.getTimeUntilReset(action, targetUserId),
        limit: this.rateLimits[action].limit,
        window: this.rateLimits[action].window
      };
    });

    return status;
  }

  /**
   * Update rate limits
   */
  updateRateLimits(newLimits) {
    this.rateLimits = { ...this.rateLimits, ...newLimits };
    console.log('✅ RateLimitingService: Rate limits updated');
  }

  /**
   * Reset user limits
   */
  resetUserLimits(userId = null) {
    const targetUserId = userId || this.userId;
    
    if (!targetUserId) return;

    this.userLimits.delete(targetUserId);
    this.suspiciousActivity.delete(targetUserId);
    this.unblockUser(targetUserId);
    
    console.log(`✅ RateLimitingService: Limits reset for user ${targetUserId}`);
  }

  /**
   * Get suspicious users
   */
  getSuspiciousUsers() {
    const suspicious = [];
    
    this.suspiciousActivity.forEach((activities, userId) => {
      if (activities.length > 0) {
        suspicious.push({
          userId,
          activityCount: activities.length,
          lastActivity: Math.max(...activities.map(a => a.timestamp)),
          activities: activities.slice(-5) // Last 5 activities
        });
      }
    });

    return suspicious.sort((a, b) => b.activityCount - a.activityCount);
  }

  /**
   * Get blocked users
   */
  getBlockedUsers() {
    return Array.from(this.blockedUsers);
  }

  /**
   * Check if user can perform action (with detailed response)
   */
  canPerformAction(action, userId = null) {
    const targetUserId = userId || this.userId;
    
    if (!targetUserId) {
      return {
        allowed: false,
        reason: 'User ID required',
        remaining: 0,
        resetIn: 0
      };
    }

    const isAllowed = this.isAllowed(action, targetUserId);
    const remaining = this.getRemainingAttempts(action, targetUserId);
    const resetIn = this.getTimeUntilReset(action, targetUserId);

    return {
      allowed: isAllowed,
      reason: isAllowed ? 'Allowed' : 'Rate limit exceeded',
      remaining,
      resetIn,
      limit: this.rateLimits[action]?.limit || 0
    };
  }
}

// Create singleton instance
const rateLimitingService = new RateLimitingService();

export default rateLimitingService;
