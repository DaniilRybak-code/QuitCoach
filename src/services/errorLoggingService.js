/**
 * Error Logging and Reporting Service
 * Comprehensive error tracking and reporting for beta testing
 */

import { collection, addDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { ref, get, set, push } from 'firebase/database';
import { firestore, db } from './firebase.js';

class ErrorLoggingService {
  constructor() {
    this.errorQueue = [];
    this.isOnline = navigator.onLine;
    this.maxRetries = 3;
    this.retryDelay = 5000; // 5 seconds
    this.errorThresholds = {
      critical: 5,    // 5 critical errors per hour
      warning: 20,    // 20 warnings per hour
      info: 100       // 100 info messages per hour
    };
    this.errorCounts = {
      critical: 0,
      warning: 0,
      info: 0,
      lastReset: Date.now()
    };
    this.setupErrorHandlers();
  }

  /**
   * Initialize error logging for user
   */
  initialize(userId) {
    this.userId = userId;
    this.setupNetworkListeners();
    this.startErrorProcessing();
    console.log('✅ ErrorLoggingService: Initialized for user', userId);
  }

  /**
   * Setup global error handlers
   */
  setupErrorHandlers() {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.logError('javascript_error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        severity: 'critical'
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.logError('unhandled_promise_rejection', {
        reason: event.reason?.toString(),
        stack: event.reason?.stack,
        severity: 'critical'
      });
    });

    // Note: Console method overrides removed to prevent infinite loops
    // Console errors and warnings are handled by the global error handlers above
  }

  /**
   * Setup network status listeners
   */
  setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processErrorQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  /**
   * Start error processing interval
   */
  startErrorProcessing() {
    // Process error queue every 30 seconds
    setInterval(() => {
      this.processErrorQueue();
    }, 30000);

    // Reset error counts every hour
    setInterval(() => {
      this.resetErrorCounts();
    }, 60 * 60 * 1000);
  }

  /**
   * Log an error
   */
  logError(errorType, errorData) {
    const error = {
      id: this.generateErrorId(),
      type: errorType,
      userId: this.userId,
      timestamp: new Date().toISOString(),
      severity: errorData.severity || 'info',
      data: this.sanitizeErrorData(errorData),
      userAgent: navigator.userAgent,
      url: window.location.href,
      sessionId: this.getSessionId(),
      version: '1.0.0'
    };

    // Check if error should be logged based on thresholds
    if (!this.shouldLogError(error)) {
      return;
    }

    // Add to queue
    this.errorQueue.push(error);

    // Process immediately if online
    if (this.isOnline) {
      this.processErrorQueue();
    }

    // Log to console for development
    if (process.env.NODE_ENV === 'development') {
      console.error(`🚨 Error Logged [${error.severity.toUpperCase()}]:`, error);
    }
  }

  /**
   * Generate unique error ID
   */
  generateErrorId() {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Sanitize error data to remove sensitive information
   */
  sanitizeErrorData(data) {
    const sanitized = { ...data };
    
    // Remove sensitive fields
    const sensitiveFields = ['password', 'token', 'key', 'secret', 'ssn', 'email'];
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });

    // Truncate long strings
    Object.keys(sanitized).forEach(key => {
      if (typeof sanitized[key] === 'string' && sanitized[key].length > 1000) {
        sanitized[key] = sanitized[key].substring(0, 1000) + '...[TRUNCATED]';
      }
    });

    return sanitized;
  }

  /**
   * Check if error should be logged based on thresholds
   */
  shouldLogError(error) {
    const severity = error.severity;
    const threshold = this.errorThresholds[severity];
    
    if (!threshold) return true;

    // Reset counts if it's been more than an hour
    if (Date.now() - this.errorCounts.lastReset > 60 * 60 * 1000) {
      this.resetErrorCounts();
    }

    return this.errorCounts[severity] < threshold;
  }

  /**
   * Reset error counts
   */
  resetErrorCounts() {
    this.errorCounts = {
      critical: 0,
      warning: 0,
      info: 0,
      lastReset: Date.now()
    };
  }

  /**
   * Process error queue
   */
  async processErrorQueue() {
    if (!this.isOnline || this.errorQueue.length === 0) {
      return;
    }

    const errorsToProcess = [...this.errorQueue];
    this.errorQueue = [];

    for (const error of errorsToProcess) {
      try {
        await this.sendErrorToServer(error);
        this.errorCounts[error.severity]++;
      } catch (sendError) {
        console.error('❌ ErrorLoggingService: Failed to send error to server:', sendError);
        // Re-queue error for retry
        this.errorQueue.push(error);
      }
    }
  }

  /**
   * Send error to server
   */
  async sendErrorToServer(error) {
    try {
      // Store in Firestore
      await addDoc(collection(firestore, 'error_logs'), error);

      // Store in Realtime Database for real-time monitoring
      const errorRef = ref(db, `error_logs/${this.userId}/${error.id}`);
      await set(errorRef, error);

      console.log(`✅ ErrorLoggingService: Error ${error.id} sent to server`);

    } catch (error) {
      console.error('❌ ErrorLoggingService: Error sending to server:', error);
      throw error;
    }
  }

  /**
   * Get session ID
   */
  getSessionId() {
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Log custom error
   */
  logCustomError(errorType, message, severity = 'info', additionalData = {}) {
    this.logError(errorType, {
      message,
      severity,
      ...additionalData
    });
  }

  /**
   * Log API error
   */
  logApiError(endpoint, method, status, response, requestData = {}) {
    this.logError('api_error', {
      endpoint,
      method,
      status,
      response: this.sanitizeErrorData(response),
      requestData: this.sanitizeErrorData(requestData),
      severity: status >= 500 ? 'critical' : status >= 400 ? 'warning' : 'info'
    });
  }

  /**
   * Log authentication error
   */
  logAuthError(errorType, message, additionalData = {}) {
    this.logError('auth_error', {
      errorType,
      message,
      severity: 'critical',
      ...additionalData
    });
  }

  /**
   * Log database error
   */
  logDatabaseError(operation, error, queryData = {}) {
    this.logError('database_error', {
      operation,
      message: error.message,
      code: error.code,
      queryData: this.sanitizeErrorData(queryData),
      severity: 'critical'
    });
  }

  /**
   * Log performance error
   */
  logPerformanceError(operation, duration, threshold, additionalData = {}) {
    this.logError('performance_error', {
      operation,
      duration,
      threshold,
      severity: 'warning',
      ...additionalData
    });
  }

  /**
   * Get error statistics
   */
  async getErrorStatistics(hours = 24) {
    try {
      const cutoffTime = new Date();
      cutoffTime.setHours(cutoffTime.getHours() - hours);

      const errorQuery = query(
        collection(firestore, 'error_logs'),
        where('userId', '==', this.userId),
        where('timestamp', '>=', cutoffTime.toISOString()),
        orderBy('timestamp', 'desc')
      );

      const snapshot = await getDocs(errorQuery);
      const errors = snapshot.docs.map(doc => doc.data());

      const stats = {
        total: errors.length,
        bySeverity: {
          critical: errors.filter(e => e.severity === 'critical').length,
          warning: errors.filter(e => e.severity === 'warning').length,
          info: errors.filter(e => e.severity === 'info').length
        },
        byType: {},
        recentErrors: errors.slice(0, 10),
        timeRange: `${hours} hours`
      };

      // Count by type
      errors.forEach(error => {
        stats.byType[error.type] = (stats.byType[error.type] || 0) + 1;
      });

      return stats;

    } catch (error) {
      console.error('❌ ErrorLoggingService: Error getting statistics:', error);
      return null;
    }
  }

  /**
   * Get recent errors
   */
  async getRecentErrors(limit = 20) {
    try {
      const errorQuery = query(
        collection(firestore, 'error_logs'),
        where('userId', '==', this.userId),
        orderBy('timestamp', 'desc'),
        limit(limit)
      );

      const snapshot = await getDocs(errorQuery);
      return snapshot.docs.map(doc => doc.data());

    } catch (error) {
      console.error('❌ ErrorLoggingService: Error getting recent errors:', error);
      return [];
    }
  }

  /**
   * Clear old errors
   */
  async clearOldErrors(days = 7) {
    try {
      const cutoffTime = new Date();
      cutoffTime.setDate(cutoffTime.getDate() - days);

      // This would typically be done server-side
      console.log(`🗑️ ErrorLoggingService: Would clear errors older than ${days} days`);
      
    } catch (error) {
      console.error('❌ ErrorLoggingService: Error clearing old errors:', error);
    }
  }

  /**
   * Get error queue status
   */
  getErrorQueueStatus() {
    return {
      queueLength: this.errorQueue.length,
      isOnline: this.isOnline,
      errorCounts: this.errorCounts,
      thresholds: this.errorThresholds
    };
  }

  /**
   * Set error thresholds
   */
  setErrorThresholds(thresholds) {
    this.errorThresholds = { ...this.errorThresholds, ...thresholds };
  }

  /**
   * Export error data
   */
  async exportErrorData(hours = 24) {
    try {
      const errors = await this.getRecentErrors(1000); // Get more errors
      const cutoffTime = new Date();
      cutoffTime.setHours(cutoffTime.getHours() - hours);
      
      const filteredErrors = errors.filter(error => 
        new Date(error.timestamp) >= cutoffTime
      );

      return {
        errors: filteredErrors,
        exportMetadata: {
          exportedAt: new Date().toISOString(),
          userId: this.userId,
          timeRange: `${hours} hours`,
          totalErrors: filteredErrors.length,
          version: '1.0.0'
        }
      };

    } catch (error) {
      console.error('❌ ErrorLoggingService: Error exporting error data:', error);
      throw error;
    }
  }
}

// Create singleton instance
const errorLoggingService = new ErrorLoggingService();

export default errorLoggingService;
