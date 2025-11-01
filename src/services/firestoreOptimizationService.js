/**
 * Firestore Optimization Service
 * Main service that integrates all optimization features
 */

import OptimizedFirestoreService from './optimizedFirestoreService.js';
import OptimizedBehavioralService from './optimizedBehavioralService.js';
import QueryPerformanceMonitor from './queryPerformanceMonitor.js';

class FirestoreOptimizationService {
  constructor(firestore) {
    this.firestore = firestore;
    this.optimizedService = new OptimizedFirestoreService(firestore);
    this.behavioralService = new OptimizedBehavioralService(firestore);
    this.performanceMonitor = new QueryPerformanceMonitor();
    
    // Configuration
    this.config = {
      enableCaching: true,
      enablePagination: true,
      enablePerformanceMonitoring: true,
      defaultPageSize: 20,
      cacheTimeout: 5 * 60 * 1000, // 5 minutes
      slowQueryThreshold: 1000 // 1 second
    };
    
    console.log('🚀 FirestoreOptimizationService initialized');
  }

  // ===== CONFIGURATION =====
  
  /**
   * Update service configuration
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    
    // Update sub-services
    this.optimizedService.cacheTimeout = this.config.cacheTimeout;
    this.performanceMonitor.slowQueryThreshold = this.config.slowQueryThreshold;
    
    console.log('⚙️ Configuration updated:', this.config);
  }

  // ===== OPTIMIZED QUERY METHODS =====
  
  /**
   * Get behavioral data with optimization
   */
  async getBehavioralData(userId, dataType, options = {}) {
    const queryId = this.performanceMonitor.startQuery(
      `behavioral_${dataType}`,
      'getBehavioralData',
      `behavioral_${dataType}`,
      userId
    );

    try {
      const result = await this.behavioralService.getBehavioralData(
        userId,
        dataType,
        {
          ...options,
          useCache: this.config.enableCaching
        }
      );

      this.performanceMonitor.completeQuery(queryId, result.length);
      return result;
    } catch (error) {
      this.performanceMonitor.completeQuery(queryId, 0, error);
      throw error;
    }
  }

  /**
   * Get paginated behavioral data
   */
  async getPaginatedBehavioralData(userId, dataType, options = {}) {
    const queryId = this.performanceMonitor.startQuery(
      `paginated_behavioral_${dataType}`,
      'getPaginatedBehavioralData',
      `behavioral_${dataType}`,
      userId
    );

    try {
      const result = await this.behavioralService.getRecentData(
        userId,
        dataType,
        {
          pageSize: this.config.defaultPageSize,
          ...options,
          useCache: this.config.enableCaching
        }
      );

      this.performanceMonitor.completeQuery(queryId, result.data.length);
      return result;
    } catch (error) {
      this.performanceMonitor.completeQuery(queryId, 0, error);
      throw error;
    }
  }

  /**
   * Get behavioral data summary
   */
  async getBehavioralDataSummary(userId, dataType, days = 30) {
    const queryId = this.performanceMonitor.startQuery(
      `summary_behavioral_${dataType}`,
      'getBehavioralDataSummary',
      `behavioral_${dataType}`,
      userId
    );

    try {
      const result = await this.behavioralService.getDataSummary(
        userId,
        dataType,
        days
      );

      this.performanceMonitor.completeQuery(queryId, 1);
      return result;
    } catch (error) {
      this.performanceMonitor.completeQuery(queryId, 0, error);
      throw error;
    }
  }

  /**
   * Get comprehensive analytics
   */
  async getOptimizedAnalytics(userId, days = 30) {
    const queryId = this.performanceMonitor.startQuery(
      'analytics',
      'getOptimizedAnalytics',
      'multiple',
      userId
    );

    try {
      const result = await this.behavioralService.getOptimizedAnalytics(
        userId,
        days
      );

      this.performanceMonitor.completeQuery(queryId, 1);
      return result;
    } catch (error) {
      this.performanceMonitor.completeQuery(queryId, 0, error);
      throw error;
    }
  }

  // ===== CACHE MANAGEMENT =====
  
  /**
   * Clear cache for specific user
   */
  clearUserCache(userId) {
    this.behavioralService.clearUserCache(userId);
    console.log(`🗑️ Cleared all cache for user ${userId}`);
  }

  /**
   * Clear all cache
   */
  clearAllCache() {
    this.optimizedService.clearAllCache();
    console.log('🗑️ Cleared all cache');
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      optimizedService: this.optimizedService.getCacheStats(),
      behavioralService: this.behavioralService.getCacheStats()
    };
  }

  // ===== PERFORMANCE MONITORING =====
  
  /**
   * Get performance statistics
   */
  getPerformanceStats(timeRange = 24) {
    return this.performanceMonitor.getPerformanceStats(timeRange);
  }

  /**
   * Get optimization recommendations
   */
  getOptimizationRecommendations() {
    return this.performanceMonitor.getOptimizationRecommendations();
  }

  /**
   * Get mobile performance metrics
   */
  getMobilePerformanceMetrics() {
    return this.performanceMonitor.getMobilePerformanceMetrics();
  }

  /**
   * Generate performance report
   */
  generatePerformanceReport() {
    return this.performanceMonitor.generatePerformanceReport();
  }

  // ===== REAL-TIME LISTENERS =====
  
  /**
   * Create optimized real-time listener
   */
  createOptimizedListener(collectionName, queryParams, callback, options = {}) {
    return this.optimizedService.createOptimizedListener(
      collectionName,
      queryParams,
      callback,
      {
        debounceMs: 1000,
        maxRetries: 3,
        retryDelay: 5000,
        ...options
      }
    );
  }

  // ===== BATCH OPERATIONS =====
  
  /**
   * Perform batch write operations
   */
  async batchWrite(operations) {
    return this.optimizedService.batchWrite(operations);
  }

  // ===== MOBILE OPTIMIZATION =====
  
  /**
   * Get lightweight user stats for mobile
   */
  async getLightweightUserStats(userId) {
    const queryId = this.performanceMonitor.startQuery(
      'lightweight_stats',
      'getLightweightUserStats',
      'users',
      userId
    );

    try {
      const result = await this.optimizedService.getLightweightUserStats(userId);

      this.performanceMonitor.completeQuery(queryId, 1);
      return result;
    } catch (error) {
      this.performanceMonitor.completeQuery(queryId, 0, error);
      throw error;
    }
  }

  // ===== QUERY OPTIMIZATION =====
  
  /**
   * Get query optimization suggestions
   */
  getQueryOptimizationSuggestions(queryType, collectionName) {
    return this.performanceMonitor.getQueryOptimizationSuggestions(
      queryType,
      collectionName
    );
  }

  // ===== HEALTH CHECK =====
  
  /**
   * Perform health check on all services
   */
  async healthCheck() {
    const health = {
      status: 'healthy',
      services: {},
      recommendations: []
    };

    try {
      // Check cache health
      const cacheStats = this.getCacheStats();
      health.services.cache = {
        status: 'healthy',
        size: cacheStats.optimizedService.size,
        maxSize: cacheStats.optimizedService.maxSize
      };

      // Check performance health
      const performanceStats = this.getPerformanceStats(1); // Last hour
      health.services.performance = {
        status: performanceStats.errorRate > 20 ? 'degraded' : 'healthy',
        errorRate: performanceStats.errorRate,
        averageDuration: performanceStats.averageDuration
      };

      // Check for issues
      if (performanceStats.errorRate > 20) {
        health.status = 'degraded';
        health.recommendations.push('High error rate detected - review query logic');
      }

      if (performanceStats.averageDuration > 2000) {
        health.status = 'degraded';
        health.recommendations.push('Slow queries detected - consider optimization');
      }

      // Get optimization recommendations
      const recommendations = this.getOptimizationRecommendations();
      health.recommendations.push(...recommendations.map(r => r.suggestion));

    } catch (error) {
      health.status = 'unhealthy';
      health.error = error.message;
    }

    return health;
  }

  // ===== UTILITY METHODS =====
  
  /**
   * Reset all monitoring data
   */
  reset() {
    this.performanceMonitor.reset();
    console.log('🔄 All monitoring data reset');
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      config: this.config,
      cacheStats: this.getCacheStats(),
      performanceStats: this.getPerformanceStats(1),
      metricsCount: this.performanceMonitor.getMetricsCount()
    };
  }
}

export default FirestoreOptimizationService;
