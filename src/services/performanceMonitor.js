/**
 * Performance Monitoring Service
 * Tracks and manages performance metrics across the application
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      database: {
        queries: [],
        totalQueries: 0,
        averageQueryTime: 0,
        slowQueries: 0
      },
      authentication: {
        loginAttempts: [],
        totalAttempts: 0,
        averageLoginTime: 0,
        failedAttempts: 0
      },
      offlineQueue: {
        operations: [],
        totalOperations: 0,
        averageProcessTime: 0,
        failedOperations: 0
      },
      general: {
        pageLoads: [],
        totalPageLoads: 0,
        averagePageLoadTime: 0
      }
    };
    
    this.alerts = [];
    this.thresholds = {
      slowQuery: 1000, // 1 second
      slowLogin: 3000, // 3 seconds
      slowOperation: 2000, // 2 seconds
      slowPageLoad: 5000 // 5 seconds
    };
    
    this.isEnabled = true;
    this.maxMetricsHistory = 1000; // Keep last 1000 entries per category
  }

  /**
   * Start timing an operation
   */
  startTimer(operationId) {
    return {
      operationId,
      startTime: performance.now(),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * End timing an operation and record metrics
   */
  endTimer(timer, category, operation, metadata = {}) {
    if (!this.isEnabled) return;

    const endTime = performance.now();
    const duration = endTime - timer.startTime;
    
    const metric = {
      operationId: timer.operationId,
      operation,
      duration,
      timestamp: timer.timestamp,
      endTime: new Date().toISOString(),
      metadata
    };

    // Add to appropriate category
    if (this.metrics[category]) {
      this.metrics[category].operations = this.metrics[category].operations || [];
      this.metrics[category].operations.push(metric);
      
      // Update totals
      this.metrics[category].totalOperations = (this.metrics[category].totalOperations || 0) + 1;
      
      // Calculate average
      const totalDuration = this.metrics[category].operations.reduce((sum, op) => sum + op.duration, 0);
      this.metrics[category].averageProcessTime = totalDuration / this.metrics[category].operations.length;
      
      // Check for slow operations
      const threshold = this.thresholds[`slow${category.charAt(0).toUpperCase() + category.slice(1)}`] || this.thresholds.slowOperation;
      if (duration > threshold) {
        this.metrics[category].slowOperations = (this.metrics[category].slowOperations || 0) + 1;
        this.createAlert('slow_operation', {
          category,
          operation,
          duration,
          threshold
        });
      }
      
      // Trim history if too large
      if (this.metrics[category].operations.length > this.maxMetricsHistory) {
        this.metrics[category].operations = this.metrics[category].operations.slice(-this.maxMetricsHistory);
      }
    }

    return metric;
  }

  /**
   * Record a database query
   */
  recordDatabaseQuery(operation, duration, metadata = {}) {
    if (!this.isEnabled) return;

    const query = {
      operation,
      duration,
      timestamp: new Date().toISOString(),
      metadata
    };

    this.metrics.database.queries.push(query);
    this.metrics.database.totalQueries++;
    
    // Update average
    const totalDuration = this.metrics.database.queries.reduce((sum, q) => sum + q.duration, 0);
    this.metrics.database.averageQueryTime = totalDuration / this.metrics.database.queries.length;
    
    // Check for slow queries
    if (duration > this.thresholds.slowQuery) {
      this.metrics.database.slowQueries++;
      this.createAlert('slow_query', {
        operation,
        duration,
        threshold: this.thresholds.slowQuery
      });
    }
    
    // Trim history
    if (this.metrics.database.queries.length > this.maxMetricsHistory) {
      this.metrics.database.queries = this.metrics.database.queries.slice(-this.maxMetricsHistory);
    }
  }

  /**
   * Record an authentication attempt
   */
  recordAuthAttempt(operation, duration, success, metadata = {}) {
    if (!this.isEnabled) return;

    const attempt = {
      operation,
      duration,
      success,
      timestamp: new Date().toISOString(),
      metadata
    };

    this.metrics.authentication.loginAttempts.push(attempt);
    this.metrics.authentication.totalAttempts++;
    
    if (!success) {
      this.metrics.authentication.failedAttempts++;
      this.createAlert('auth_failure', {
        operation,
        duration,
        metadata
      });
    }
    
    // Update average
    const totalDuration = this.metrics.authentication.loginAttempts.reduce((sum, a) => sum + a.duration, 0);
    this.metrics.authentication.averageLoginTime = totalDuration / this.metrics.authentication.loginAttempts.length;
    
    // Check for slow logins
    if (duration > this.thresholds.slowLogin) {
      this.createAlert('slow_login', {
        operation,
        duration,
        threshold: this.thresholds.slowLogin
      });
    }
    
    // Trim history
    if (this.metrics.authentication.loginAttempts.length > this.maxMetricsHistory) {
      this.metrics.authentication.loginAttempts = this.metrics.authentication.loginAttempts.slice(-this.maxMetricsHistory);
    }
  }

  /**
   * Record an offline queue operation
   */
  recordOfflineOperation(operation, duration, success, metadata = {}) {
    if (!this.isEnabled) return;

    const op = {
      operation,
      duration,
      success,
      timestamp: new Date().toISOString(),
      metadata
    };

    this.metrics.offlineQueue.operations.push(op);
    this.metrics.offlineQueue.totalOperations++;
    
    if (!success) {
      this.metrics.offlineQueue.failedOperations++;
      this.createAlert('offline_failure', {
        operation,
        duration,
        metadata
      });
    }
    
    // Update average
    const totalDuration = this.metrics.offlineQueue.operations.reduce((sum, o) => sum + o.duration, 0);
    this.metrics.offlineQueue.averageProcessTime = totalDuration / this.metrics.offlineQueue.operations.length;
    
    // Check for slow operations
    if (duration > this.thresholds.slowOperation) {
      this.createAlert('slow_offline_operation', {
        operation,
        duration,
        threshold: this.thresholds.slowOperation
      });
    }
    
    // Trim history
    if (this.metrics.offlineQueue.operations.length > this.maxMetricsHistory) {
      this.metrics.offlineQueue.operations = this.metrics.offlineQueue.operations.slice(-this.maxMetricsHistory);
    }
  }

  /**
   * Record page load performance
   */
  recordPageLoad(page, duration, metadata = {}) {
    if (!this.isEnabled) return;

    const load = {
      page,
      duration,
      timestamp: new Date().toISOString(),
      metadata
    };

    this.metrics.general.pageLoads.push(load);
    this.metrics.general.totalPageLoads++;
    
    // Update average
    const totalDuration = this.metrics.general.pageLoads.reduce((sum, p) => sum + p.duration, 0);
    this.metrics.general.averagePageLoadTime = totalDuration / this.metrics.general.pageLoads.length;
    
    // Check for slow page loads
    if (duration > this.thresholds.slowPageLoad) {
      this.createAlert('slow_page_load', {
        page,
        duration,
        threshold: this.thresholds.slowPageLoad
      });
    }
    
    // Trim history
    if (this.metrics.general.pageLoads.length > this.maxMetricsHistory) {
      this.metrics.general.pageLoads = this.metrics.general.pageLoads.slice(-this.maxMetricsHistory);
    }
  }

  /**
   * Create an alert
   */
  createAlert(type, data) {
    const alert = {
      id: Date.now() + Math.random(),
      type,
      data,
      timestamp: new Date().toISOString(),
      severity: this.getAlertSeverity(type)
    };

    this.alerts.push(alert);
    
    // Keep only last 100 alerts
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-100);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.warn(`🚨 Performance Alert [${type}]:`, data);
    }

    return alert;
  }

  /**
   * Get alert severity
   */
  getAlertSeverity(type) {
    const severityMap = {
      slow_query: 'warning',
      slow_login: 'warning',
      slow_operation: 'warning',
      slow_offline_operation: 'warning',
      slow_page_load: 'warning',
      auth_failure: 'error',
      offline_failure: 'error'
    };
    return severityMap[type] || 'info';
  }

  /**
   * Get current metrics summary
   */
  getMetricsSummary() {
    return {
      database: {
        totalQueries: this.metrics.database.totalQueries,
        averageQueryTime: Math.round(this.metrics.database.averageQueryTime),
        slowQueries: this.metrics.database.slowQueries,
        slowQueryRate: this.metrics.database.totalQueries > 0 ? 
          (this.metrics.database.slowQueries / this.metrics.database.totalQueries * 100).toFixed(2) : 0
      },
      authentication: {
        totalAttempts: this.metrics.authentication.totalAttempts,
        averageLoginTime: Math.round(this.metrics.authentication.averageLoginTime),
        failedAttempts: this.metrics.authentication.failedAttempts,
        successRate: this.metrics.authentication.totalAttempts > 0 ? 
          ((this.metrics.authentication.totalAttempts - this.metrics.authentication.failedAttempts) / this.metrics.authentication.totalAttempts * 100).toFixed(2) : 0
      },
      offlineQueue: {
        totalOperations: this.metrics.offlineQueue.totalOperations,
        averageProcessTime: Math.round(this.metrics.offlineQueue.averageProcessTime),
        failedOperations: this.metrics.offlineQueue.failedOperations,
        successRate: this.metrics.offlineQueue.totalOperations > 0 ? 
          ((this.metrics.offlineQueue.totalOperations - this.metrics.offlineQueue.failedOperations) / this.metrics.offlineQueue.totalOperations * 100).toFixed(2) : 0
      },
      general: {
        totalPageLoads: this.metrics.general.totalPageLoads,
        averagePageLoadTime: Math.round(this.metrics.general.averagePageLoadTime)
      },
      alerts: {
        total: this.alerts.length,
        recent: this.alerts.slice(-10),
        byType: this.getAlertsByType()
      }
    };
  }

  /**
   * Get alerts grouped by type
   */
  getAlertsByType() {
    const byType = {};
    this.alerts.forEach(alert => {
      byType[alert.type] = (byType[alert.type] || 0) + 1;
    });
    return byType;
  }

  /**
   * Clear all metrics
   */
  clearMetrics() {
    this.metrics = {
      database: { queries: [], totalQueries: 0, averageQueryTime: 0, slowQueries: 0 },
      authentication: { loginAttempts: [], totalAttempts: 0, averageLoginTime: 0, failedAttempts: 0 },
      offlineQueue: { operations: [], totalOperations: 0, averageProcessTime: 0, failedOperations: 0 },
      general: { pageLoads: [], totalPageLoads: 0, averagePageLoadTime: 0 }
    };
    this.alerts = [];
  }

  /**
   * Enable/disable monitoring
   */
  setEnabled(enabled) {
    this.isEnabled = enabled;
  }

  /**
   * Update thresholds
   */
  updateThresholds(newThresholds) {
    this.thresholds = { ...this.thresholds, ...newThresholds };
  }

  /**
   * Export metrics for analysis
   */
  exportMetrics() {
    return {
      metrics: this.metrics,
      alerts: this.alerts,
      thresholds: this.thresholds,
      exportedAt: new Date().toISOString()
    };
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

export default performanceMonitor;
