/**
 * Authentication Performance Wrapper
 * Wraps Firebase authentication operations to track performance metrics
 */

import performanceMonitor from './performanceMonitor.js';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from 'firebase/auth';

class AuthPerformanceWrapper {
  constructor() {
    this.originalMethods = {
      signInWithEmailAndPassword,
      createUserWithEmailAndPassword,
      signOut,
      onAuthStateChanged,
      setPersistence,
      browserLocalPersistence,
      browserSessionPersistence
    };
  }

  /**
   * Wrap signInWithEmailAndPassword with performance tracking
   */
  async signInWithEmailAndPassword(auth, email, password) {
    const timer = performanceMonitor.startTimer(`signIn_${email}`);
    try {
      const result = await this.originalMethods.signInWithEmailAndPassword(auth, email, password);
      performanceMonitor.recordAuthAttempt('signIn', timer.duration, true, {
        email,
        uid: result.user.uid,
        method: 'email'
      });
      return result;
    } catch (error) {
      performanceMonitor.recordAuthAttempt('signIn', timer.duration, false, {
        email,
        error: error.code,
        method: 'email'
      });
      throw error;
    }
  }

  /**
   * Wrap createUserWithEmailAndPassword with performance tracking
   */
  async createUserWithEmailAndPassword(auth, email, password) {
    const timer = performanceMonitor.startTimer(`createUser_${email}`);
    try {
      const result = await this.originalMethods.createUserWithEmailAndPassword(auth, email, password);
      performanceMonitor.recordAuthAttempt('createUser', timer.duration, true, {
        email,
        uid: result.user.uid,
        method: 'email'
      });
      return result;
    } catch (error) {
      performanceMonitor.recordAuthAttempt('createUser', timer.duration, false, {
        email,
        error: error.code,
        method: 'email'
      });
      throw error;
    }
  }

  /**
   * Wrap signOut with performance tracking
   */
  async signOut(auth) {
    const timer = performanceMonitor.startTimer('signOut');
    try {
      const result = await this.originalMethods.signOut(auth);
      performanceMonitor.recordAuthAttempt('signOut', timer.duration, true, {
        method: 'signOut'
      });
      return result;
    } catch (error) {
      performanceMonitor.recordAuthAttempt('signOut', timer.duration, false, {
        error: error.code,
        method: 'signOut'
      });
      throw error;
    }
  }

  /**
   * Wrap onAuthStateChanged with performance tracking
   */
  onAuthStateChanged(auth, nextOrObserver, error, completed) {
    const timer = performanceMonitor.startTimer('onAuthStateChanged');
    
    const wrappedNextOrObserver = (user) => {
      const duration = performance.now() - timer.startTime;
      performanceMonitor.recordAuthAttempt('authStateChange', duration, true, {
        hasUser: !!user,
        uid: user?.uid,
        method: 'onAuthStateChanged'
      });
      
      if (typeof nextOrObserver === 'function') {
        nextOrObserver(user);
      } else if (nextOrObserver && nextOrObserver.next) {
        nextOrObserver.next(user);
      }
    };

    const wrappedError = (error) => {
      const duration = performance.now() - timer.startTime;
      performanceMonitor.recordAuthAttempt('authStateChange', duration, false, {
        error: error?.code || 'unknown',
        method: 'onAuthStateChanged'
      });
      
      if (error && typeof error === 'function') {
        error(error);
      } else if (error && error.error) {
        error.error(error);
      }
    };

    const wrappedCompleted = () => {
      const duration = performance.now() - timer.startTime;
      performanceMonitor.recordAuthAttempt('authStateChange', duration, true, {
        method: 'onAuthStateChanged',
        completed: true
      });
      
      if (completed && typeof completed === 'function') {
        completed();
      } else if (completed && completed.complete) {
        completed.complete();
      }
    };

    return this.originalMethods.onAuthStateChanged(auth, wrappedNextOrObserver, wrappedError, wrappedCompleted);
  }

  /**
   * Wrap setPersistence with performance tracking
   */
  async setPersistence(auth, persistence) {
    const timer = performanceMonitor.startTimer('setPersistence');
    try {
      const result = await this.originalMethods.setPersistence(auth, persistence);
      performanceMonitor.recordAuthAttempt('setPersistence', timer.duration, true, {
        persistence: persistence === browserLocalPersistence ? 'local' : 
                    persistence === browserSessionPersistence ? 'session' : 'unknown'
      });
      return result;
    } catch (error) {
      performanceMonitor.recordAuthAttempt('setPersistence', timer.duration, false, {
        error: error.code,
        persistence: persistence === browserLocalPersistence ? 'local' : 
                    persistence === browserSessionPersistence ? 'session' : 'unknown'
      });
      throw error;
    }
  }

  /**
   * Track custom authentication operations
   */
  async trackAuthOperation(operationName, operation, metadata = {}) {
    const timer = performanceMonitor.startTimer(operationName);
    try {
      const result = await operation();
      performanceMonitor.recordAuthAttempt(operationName, timer.duration, true, metadata);
      return result;
    } catch (error) {
      performanceMonitor.recordAuthAttempt(operationName, timer.duration, false, {
        ...metadata,
        error: error.code || error.message
      });
      throw error;
    }
  }

  /**
   * Get authentication performance metrics
   */
  getAuthMetrics() {
    return performanceMonitor.getMetricsSummary().authentication;
  }

  /**
   * Get failed authentication attempts
   */
  getFailedAttempts(limit = 10) {
    return performanceMonitor.metrics.authentication.loginAttempts
      .filter(attempt => !attempt.success)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }

  /**
   * Get recent authentication attempts
   */
  getRecentAttempts(limit = 20) {
    return performanceMonitor.metrics.authentication.loginAttempts
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }

  /**
   * Get slow authentication operations
   */
  getSlowOperations(limit = 10) {
    return performanceMonitor.metrics.authentication.loginAttempts
      .filter(attempt => attempt.duration > performanceMonitor.thresholds.slowLogin)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, limit);
  }

  /**
   * Get authentication success rate by operation type
   */
  getSuccessRateByOperation() {
    const operations = {};
    
    performanceMonitor.metrics.authentication.loginAttempts.forEach(attempt => {
      if (!operations[attempt.operation]) {
        operations[attempt.operation] = { total: 0, successful: 0 };
      }
      operations[attempt.operation].total++;
      if (attempt.success) {
        operations[attempt.operation].successful++;
      }
    });

    // Calculate success rates
    Object.keys(operations).forEach(operation => {
      const op = operations[operation];
      op.successRate = op.total > 0 ? (op.successful / op.total * 100).toFixed(2) : 0;
    });

    return operations;
  }
}

// Create singleton instance
const authPerformanceWrapper = new AuthPerformanceWrapper();

export default authPerformanceWrapper;
