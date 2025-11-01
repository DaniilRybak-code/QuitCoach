/**
 * Query Performance Monitor
 * Tracks and optimizes Firestore query performance for mobile users
 */

class QueryPerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.slowQueryThreshold = 1000; // 1 second
    this.maxMetricsHistory = 1000;
    
    console.log('🚀 QueryPerformanceMonitor initialized');
  }

  // ===== QUERY TRACKING =====
  
  /**
   * Start tracking a query
   */
  startQuery(queryId, queryType, collectionName, userId) {
    const startTime = performance.now();
    const queryInfo = {
      queryId,
      queryType,
      collectionName,
      userId,
      startTime,
      status: 'running'
    };
    
    this.metrics.set(queryId, queryInfo);
    
    console.log(`🔍 Started tracking query: ${queryType} on ${collectionName}`);
    return queryId;
  }

  /**
   * Complete query tracking
   */
  completeQuery(queryId, resultCount = 0, error = null) {
    const queryInfo = this.metrics.get(queryId);
    if (!queryInfo) {
      console.warn(`⚠️ Query ${queryId} not found in metrics`);
      return;
    }

    const endTime = performance.now();
    const duration = endTime - queryInfo.startTime;
    
    const completedQuery = {
      ...queryInfo,
      endTime,
      duration,
      resultCount,
      error: error?.message || null,
      status: error ? 'error' : 'completed',
      timestamp: new Date().toISOString()
    };

    this.metrics.set(queryId, completedQuery);
    
    // Log slow queries
    if (duration > this.slowQueryThreshold) {
      console.warn(`🐌 Slow query detected: ${queryInfo.queryType} took ${duration.toFixed(2)}ms`);
    }

    // Clean up old metrics
    this.cleanupOldMetrics();
    
    console.log(`✅ Completed query: ${queryInfo.queryType} in ${duration.toFixed(2)}ms (${resultCount} results)`);
  }

  /**
   * Clean up old metrics to prevent memory leaks
   */
  cleanupOldMetrics() {
    if (this.metrics.size > this.maxMetricsHistory) {
      const entries = Array.from(this.metrics.entries());
      const sortedEntries = entries.sort((a, b) => 
        new Date(b[1].timestamp) - new Date(a[1].timestamp)
      );
      
      // Keep only the most recent entries
      const entriesToKeep = sortedEntries.slice(0, this.maxMetricsHistory);
      this.metrics.clear();
      entriesToKeep.forEach(([key, value]) => {
        this.metrics.set(key, value);
      });
    }
  }

  // ===== PERFORMANCE ANALYSIS =====
  
  /**
   * Get query performance statistics
   */
  getPerformanceStats(timeRange = 24) {
    const cutoffTime = new Date(Date.now() - timeRange * 60 * 60 * 1000);
    const recentQueries = Array.from(this.metrics.values())
      .filter(query => new Date(query.timestamp) > cutoffTime);

    if (recentQueries.length === 0) {
      return {
        totalQueries: 0,
        averageDuration: 0,
        slowQueries: 0,
        errorRate: 0,
        topSlowQueries: [],
        collectionStats: {}
      };
    }

    const completedQueries = recentQueries.filter(q => q.status === 'completed');
    const errorQueries = recentQueries.filter(q => q.status === 'error');
    const slowQueries = completedQueries.filter(q => q.duration > this.slowQueryThreshold);

    // Calculate collection-specific stats
    const collectionStats = {};
    completedQueries.forEach(query => {
      const collection = query.collectionName;
      if (!collectionStats[collection]) {
        collectionStats[collection] = {
          count: 0,
          totalDuration: 0,
          averageDuration: 0,
          slowQueries: 0
        };
      }
      
      collectionStats[collection].count++;
      collectionStats[collection].totalDuration += query.duration;
      
      if (query.duration > this.slowQueryThreshold) {
        collectionStats[collection].slowQueries++;
      }
    });

    // Calculate averages
    Object.keys(collectionStats).forEach(collection => {
      const stats = collectionStats[collection];
      stats.averageDuration = stats.totalDuration / stats.count;
    });

    // Get top slow queries
    const topSlowQueries = completedQueries
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10)
      .map(query => ({
        queryType: query.queryType,
        collection: query.collectionName,
        duration: query.duration,
        resultCount: query.resultCount
      }));

    return {
      totalQueries: recentQueries.length,
      completedQueries: completedQueries.length,
      errorQueries: errorQueries.length,
      averageDuration: completedQueries.reduce((sum, q) => sum + q.duration, 0) / completedQueries.length,
      slowQueries: slowQueries.length,
      errorRate: (errorQueries.length / recentQueries.length) * 100,
      topSlowQueries,
      collectionStats
    };
  }

  /**
   * Get recommendations for query optimization
   */
  getOptimizationRecommendations() {
    const stats = this.getPerformanceStats(24);
    const recommendations = [];

    // Check for slow queries
    if (stats.slowQueries > 0) {
      recommendations.push({
        type: 'slow_queries',
        priority: 'high',
        message: `${stats.slowQueries} slow queries detected (>${this.slowQueryThreshold}ms)`,
        suggestion: 'Consider adding composite indexes or implementing pagination'
      });
    }

    // Check for high error rate
    if (stats.errorRate > 10) {
      recommendations.push({
        type: 'high_error_rate',
        priority: 'high',
        message: `High error rate: ${stats.errorRate.toFixed(1)}%`,
        suggestion: 'Review query logic and add error handling'
      });
    }

    // Check for collection-specific issues
    Object.entries(stats.collectionStats).forEach(([collection, collectionStats]) => {
      if (collectionStats.averageDuration > 500) {
        recommendations.push({
          type: 'slow_collection',
          priority: 'medium',
          message: `Slow queries on ${collection}: ${collectionStats.averageDuration.toFixed(2)}ms average`,
          suggestion: `Optimize queries for ${collection} collection`
        });
      }
    });

    // Check for frequent queries
    Object.entries(stats.collectionStats).forEach(([collection, collectionStats]) => {
      if (collectionStats.count > 100) {
        recommendations.push({
          type: 'frequent_queries',
          priority: 'low',
          message: `Frequent queries on ${collection}: ${collectionStats.count} queries`,
          suggestion: `Consider implementing caching for ${collection} collection`
        });
      }
    });

    return recommendations;
  }

  // ===== MOBILE OPTIMIZATION =====
  
  /**
   * Get mobile-specific performance metrics
   */
  getMobilePerformanceMetrics() {
    const stats = this.getPerformanceStats(24);
    const mobileMetrics = {
      bandwidthUsage: this.estimateBandwidthUsage(stats),
      batteryImpact: this.estimateBatteryImpact(stats),
      networkEfficiency: this.calculateNetworkEfficiency(stats),
      recommendations: []
    };

    // Bandwidth recommendations
    if (mobileMetrics.bandwidthUsage > 1000000) { // 1MB
      mobileMetrics.recommendations.push({
        type: 'bandwidth',
        message: 'High bandwidth usage detected',
        suggestion: 'Implement data pagination and field selection'
      });
    }

    // Battery impact recommendations
    if (mobileMetrics.batteryImpact > 0.1) {
      mobileMetrics.recommendations.push({
        type: 'battery',
        message: 'High battery impact from queries',
        suggestion: 'Reduce query frequency and implement caching'
      });
    }

    return mobileMetrics;
  }

  /**
   * Estimate bandwidth usage based on query results
   */
  estimateBandwidthUsage(stats) {
    // Rough estimation: 1KB per document + 0.5KB overhead per query
    const totalResults = Object.values(stats.collectionStats)
      .reduce((sum, collectionStats) => sum + collectionStats.count, 0);
    
    return totalResults * 1500; // 1.5KB per result
  }

  /**
   * Estimate battery impact based on query frequency and duration
   */
  estimateBatteryImpact(stats) {
    // Rough estimation based on query frequency and duration
    const totalDuration = Object.values(stats.collectionStats)
      .reduce((sum, collectionStats) => sum + collectionStats.totalDuration, 0);
    
    return totalDuration / 100000; // Normalized impact score
  }

  /**
   * Calculate network efficiency score
   */
  calculateNetworkEfficiency(stats) {
    if (stats.totalQueries === 0) return 1;
    
    const efficiency = 1 - (stats.slowQueries / stats.totalQueries) - (stats.errorRate / 100);
    return Math.max(0, Math.min(1, efficiency));
  }

  // ===== QUERY OPTIMIZATION SUGGESTIONS =====
  
  /**
   * Get specific optimization suggestions for a query type
   */
  getQueryOptimizationSuggestions(queryType, collectionName) {
    const suggestions = [];

    switch (queryType) {
      case 'getBehavioralData':
        suggestions.push({
          type: 'pagination',
          message: 'Consider implementing pagination for large datasets',
          implementation: 'Use limit() and startAfter() for pagination'
        });
        suggestions.push({
          type: 'caching',
          message: 'Implement query result caching',
          implementation: 'Cache results for 5-10 minutes to reduce repeated queries'
        });
        break;

      case 'getUserAnalytics':
        suggestions.push({
          type: 'summary_queries',
          message: 'Use summary queries instead of fetching all data',
          implementation: 'Pre-calculate analytics and store summary documents'
        });
        break;

      default:
        suggestions.push({
          type: 'general',
          message: 'Review query structure for optimization opportunities',
          implementation: 'Analyze query patterns and add appropriate indexes'
        });
    }

    return suggestions;
  }

  // ===== REPORTING =====
  
  /**
   * Generate performance report
   */
  generatePerformanceReport() {
    const stats = this.getPerformanceStats(24);
    const recommendations = this.getOptimizationRecommendations();
    const mobileMetrics = this.getMobilePerformanceMetrics();

    return {
      summary: {
        totalQueries: stats.totalQueries,
        averageDuration: Math.round(stats.averageDuration),
        slowQueries: stats.slowQueries,
        errorRate: Math.round(stats.errorRate * 10) / 10
      },
      performance: {
        networkEfficiency: Math.round(mobileMetrics.networkEfficiency * 100),
        bandwidthUsage: Math.round(mobileMetrics.bandwidthUsage / 1024), // KB
        batteryImpact: Math.round(mobileMetrics.batteryImpact * 100) / 100
      },
      recommendations,
      topSlowQueries: stats.topSlowQueries.slice(0, 5),
      collectionStats: stats.collectionStats
    };
  }

  // ===== UTILITY METHODS =====
  
  /**
   * Reset all metrics
   */
  reset() {
    this.metrics.clear();
    console.log('🔄 Query performance metrics reset');
  }

  /**
   * Get current metrics count
   */
  getMetricsCount() {
    return this.metrics.size;
  }
}

export default QueryPerformanceMonitor;
