/**
 * Performance Integration Service
 * Integrates all performance monitoring components and provides unified API
 */

import performanceMonitor from './performanceMonitor.js';
import databasePerformanceWrapper from './databasePerformanceWrapper.js';
import authPerformanceWrapper from './authPerformanceWrapper.js';
import stressTestService from './stressTestService.js';

class PerformanceIntegrationService {
  constructor() {
    this.isInitialized = false;
    this.originalFirebaseMethods = null;
    this.originalAuthMethods = null;
  }

  /**
   * Initialize the performance monitoring system
   */
  initialize() {
    if (this.isInitialized) {
      console.log('Performance monitoring already initialized');
      return;
    }

    try {
      // Store original methods for potential restoration
      this.storeOriginalMethods();
      
      // Initialize performance monitoring
      performanceMonitor.setEnabled(true);
      
      // Set up global access
      if (typeof window !== 'undefined') {
        window.performanceMonitor = performanceMonitor;
        window.databasePerformanceWrapper = databasePerformanceWrapper;
        window.authPerformanceWrapper = authPerformanceWrapper;
        window.stressTestService = stressTestService;
        window.performanceIntegrationService = this;
      }

      this.isInitialized = true;
      console.log('✅ Performance monitoring system initialized');
      
    } catch (error) {
      console.error('❌ Failed to initialize performance monitoring:', error);
      throw error;
    }
  }

  /**
   * Store original Firebase methods for potential restoration
   */
  storeOriginalMethods() {
    // This would store original methods if we were overriding them globally
    // For now, we'll use the wrappers when needed
  }

  /**
   * Get comprehensive metrics summary
   */
  getMetricsSummary() {
    return performanceMonitor.getMetricsSummary();
  }

  /**
   * Get recent alerts
   */
  getRecentAlerts(limit = 20) {
    return performanceMonitor.alerts.slice(-limit);
  }

  /**
   * Clear all metrics
   */
  clearAllMetrics() {
    performanceMonitor.clearMetrics();
    stressTestService.clearTestResults();
  }

  /**
   * Get database performance metrics
   */
  getDatabaseMetrics() {
    return databasePerformanceWrapper.getDatabaseMetrics();
  }

  /**
   * Get authentication performance metrics
   */
  getAuthMetrics() {
    return authPerformanceWrapper.getAuthMetrics();
  }

  /**
   * Get stress test results
   */
  getStressTestResults(limit = 10) {
    return stressTestService.getTestResults(limit);
  }

  /**
   * Run a stress test
   */
  async runStressTest(testType, options = {}) {
    return await stressTestService.runStressTest(testType, options);
  }

  /**
   * Get performance alerts by type
   */
  getAlertsByType() {
    return performanceMonitor.getAlertsByType();
  }

  /**
   * Get slow operations
   */
  getSlowOperations(category = 'database', limit = 10) {
    switch (category) {
      case 'database':
        return databasePerformanceWrapper.getSlowQueries(limit);
      case 'auth':
        return authPerformanceWrapper.getSlowOperations(limit);
      default:
        return [];
    }
  }

  /**
   * Get recent operations
   */
  getRecentOperations(category = 'database', limit = 20) {
    switch (category) {
      case 'database':
        return databasePerformanceWrapper.getRecentQueries(limit);
      case 'auth':
        return authPerformanceWrapper.getRecentAttempts(limit);
      default:
        return [];
    }
  }

  /**
   * Get failed operations
   */
  getFailedOperations(category = 'auth', limit = 10) {
    switch (category) {
      case 'auth':
        return authPerformanceWrapper.getFailedAttempts(limit);
      default:
        return [];
    }
  }

  /**
   * Get success rates by operation type
   */
  getSuccessRatesByOperation(category = 'auth') {
    switch (category) {
      case 'auth':
        return authPerformanceWrapper.getSuccessRateByOperation();
      default:
        return {};
    }
  }

  /**
   * Enable/disable performance monitoring
   */
  setMonitoringEnabled(enabled) {
    performanceMonitor.setEnabled(enabled);
  }

  /**
   * Update performance thresholds
   */
  updateThresholds(thresholds) {
    performanceMonitor.updateThresholds(thresholds);
  }

  /**
   * Export all performance data
   */
  exportPerformanceData() {
    return {
      metrics: performanceMonitor.exportMetrics(),
      stressTests: stressTestService.getTestResults(),
      exportedAt: new Date().toISOString(),
      version: '1.0.0'
    };
  }

  /**
   * Get performance health score (0-100)
   */
  getPerformanceHealthScore() {
    const metrics = this.getMetricsSummary();
    let score = 100;

    // Deduct points for slow queries
    if (metrics.database.slowQueryRate > 10) {
      score -= 20;
    } else if (metrics.database.slowQueryRate > 5) {
      score -= 10;
    }

    // Deduct points for auth failures
    if (metrics.authentication.successRate < 90) {
      score -= 15;
    } else if (metrics.authentication.successRate < 95) {
      score -= 5;
    }

    // Deduct points for offline queue failures
    if (metrics.offlineQueue.successRate < 90) {
      score -= 10;
    }

    // Deduct points for slow page loads
    if (metrics.general.averagePageLoadTime > 3000) {
      score -= 15;
    } else if (metrics.general.averagePageLoadTime > 2000) {
      score -= 5;
    }

    // Deduct points for recent alerts
    const recentAlerts = this.getRecentAlerts(10);
    const errorAlerts = recentAlerts.filter(alert => alert.severity === 'error').length;
    score -= errorAlerts * 5;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Get performance recommendations
   */
  getPerformanceRecommendations() {
    const recommendations = [];
    const metrics = this.getMetricsSummary();
    const healthScore = this.getPerformanceHealthScore();

    if (healthScore < 70) {
      recommendations.push({
        type: 'critical',
        message: 'Performance health is below 70%. Consider optimizing database queries and reducing load.',
        action: 'Review slow queries and optimize database operations'
      });
    }

    if (metrics.database.slowQueryRate > 10) {
      recommendations.push({
        type: 'warning',
        message: `High slow query rate: ${metrics.database.slowQueryRate}%. Consider adding database indexes.`,
        action: 'Add database indexes for frequently queried fields'
      });
    }

    if (metrics.authentication.successRate < 95) {
      recommendations.push({
        type: 'warning',
        message: `Low authentication success rate: ${metrics.authentication.successRate}%. Check for auth issues.`,
        action: 'Review authentication flow and error handling'
      });
    }

    if (metrics.general.averagePageLoadTime > 2000) {
      recommendations.push({
        type: 'info',
        message: `Slow page load times: ${metrics.general.averagePageLoadTime}ms average. Consider optimizing assets.`,
        action: 'Optimize images, reduce bundle size, and implement lazy loading'
      });
    }

    if (metrics.offlineQueue.failedOperations > 0) {
      recommendations.push({
        type: 'info',
        message: `${metrics.offlineQueue.failedOperations} offline operations failed. Check sync reliability.`,
        action: 'Review offline queue error handling and retry logic'
      });
    }

    return recommendations;
  }

  /**
   * Start continuous monitoring
   */
  startContinuousMonitoring(intervalMs = 30000) {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    this.monitoringInterval = setInterval(() => {
      const healthScore = this.getPerformanceHealthScore();
      const recommendations = this.getPerformanceRecommendations();
      
      if (healthScore < 50) {
        console.warn('🚨 Critical performance issues detected:', recommendations);
      } else if (healthScore < 80) {
        console.warn('⚠️ Performance warnings:', recommendations);
      }
    }, intervalMs);
  }

  /**
   * Stop continuous monitoring
   */
  stopContinuousMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }

  /**
   * Get system status
   */
  getSystemStatus() {
    return {
      isInitialized: this.isInitialized,
      isMonitoring: performanceMonitor.isEnabled,
      healthScore: this.getPerformanceHealthScore(),
      lastUpdate: new Date().toISOString(),
      recommendations: this.getPerformanceRecommendations()
    };
  }
}

// Create singleton instance
const performanceIntegrationService = new PerformanceIntegrationService();

export default performanceIntegrationService;
