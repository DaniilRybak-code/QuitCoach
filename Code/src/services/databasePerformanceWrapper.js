/**
 * Database Performance Wrapper
 * Wraps Firebase database operations to track performance metrics
 */

import performanceMonitor from './performanceMonitor.js';
import { ref, get, set, push, update, remove, onValue, off, query } from 'firebase/database';

class DatabasePerformanceWrapper {
  constructor() {
    this.originalMethods = {
      ref,
      get,
      set,
      push,
      update,
      remove,
      onValue,
      off,
      query
    };
  }

  /**
   * Wrap ref function with performance tracking
   */
  ref(db, path) {
    const timer = performanceMonitor.startTimer(`ref_${path}`);
    const result = this.originalMethods.ref(db, path);
    performanceMonitor.endTimer(timer, 'database', 'ref', { path });
    return result;
  }

  /**
   * Wrap get function with performance tracking
   */
  async get(ref) {
    const timer = performanceMonitor.startTimer(`get_${ref.key || 'unknown'}`);
    try {
      const result = await this.originalMethods.get(ref);
      performanceMonitor.endTimer(timer, 'database', 'get', { 
        path: ref.key || 'unknown',
        success: true,
        hasData: result.exists()
      });
      return result;
    } catch (error) {
      performanceMonitor.endTimer(timer, 'database', 'get', { 
        path: ref.key || 'unknown',
        success: false,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Wrap set function with performance tracking
   */
  async set(ref, value) {
    const timer = performanceMonitor.startTimer(`set_${ref.key || 'unknown'}`);
    try {
      const result = await this.originalMethods.set(ref, value);
      performanceMonitor.endTimer(timer, 'database', 'set', { 
        path: ref.key || 'unknown',
        success: true,
        dataSize: JSON.stringify(value).length
      });
      return result;
    } catch (error) {
      performanceMonitor.endTimer(timer, 'database', 'set', { 
        path: ref.key || 'unknown',
        success: false,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Wrap push function with performance tracking
   */
  push(ref) {
    const timer = performanceMonitor.startTimer(`push_${ref.key || 'unknown'}`);
    const result = this.originalMethods.push(ref);
    performanceMonitor.endTimer(timer, 'database', 'push', { 
      path: ref.key || 'unknown',
      newKey: result.key
    });
    return result;
  }

  /**
   * Wrap update function with performance tracking
   */
  async update(ref, values) {
    const timer = performanceMonitor.startTimer(`update_${ref.key || 'unknown'}`);
    try {
      const result = await this.originalMethods.update(ref, values);
      performanceMonitor.endTimer(timer, 'database', 'update', { 
        path: ref.key || 'unknown',
        success: true,
        updateCount: Object.keys(values).length
      });
      return result;
    } catch (error) {
      performanceMonitor.endTimer(timer, 'database', 'update', { 
        path: ref.key || 'unknown',
        success: false,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Wrap remove function with performance tracking
   */
  async remove(ref) {
    const timer = performanceMonitor.startTimer(`remove_${ref.key || 'unknown'}`);
    try {
      const result = await this.originalMethods.remove(ref);
      performanceMonitor.endTimer(timer, 'database', 'remove', { 
        path: ref.key || 'unknown',
        success: true
      });
      return result;
    } catch (error) {
      performanceMonitor.endTimer(timer, 'database', 'remove', { 
        path: ref.key || 'unknown',
        success: false,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Wrap onValue function with performance tracking
   */
  onValue(ref, callback, cancelCallback, options) {
    const timer = performanceMonitor.startTimer(`onValue_${ref.key || 'unknown'}`);
    
    const wrappedCallback = (snapshot) => {
      performanceMonitor.endTimer(timer, 'database', 'onValue', { 
        path: ref.key || 'unknown',
        success: true,
        hasData: snapshot.exists()
      });
      callback(snapshot);
    };

    return this.originalMethods.onValue(ref, wrappedCallback, cancelCallback, options);
  }

  /**
   * Wrap off function with performance tracking
   */
  off(ref, callback) {
    const timer = performanceMonitor.startTimer(`off_${ref.key || 'unknown'}`);
    const result = this.originalMethods.off(ref, callback);
    performanceMonitor.endTimer(timer, 'database', 'off', { 
      path: ref.key || 'unknown'
    });
    return result;
  }

  /**
   * Wrap query function with performance tracking
   */
  query(ref, ...queryConstraints) {
    const timer = performanceMonitor.startTimer(`query_${ref.key || 'unknown'}`);
    const result = this.originalMethods.query(ref, ...queryConstraints);
    performanceMonitor.endTimer(timer, 'database', 'query', { 
      path: ref.key || 'unknown',
      constraintCount: queryConstraints.length
    });
    return result;
  }

  /**
   * Track custom database operations
   */
  async trackOperation(operationName, operation, metadata = {}) {
    const timer = performanceMonitor.startTimer(operationName);
    try {
      const result = await operation();
      performanceMonitor.endTimer(timer, 'database', operationName, { 
        ...metadata,
        success: true
      });
      return result;
    } catch (error) {
      performanceMonitor.endTimer(timer, 'database', operationName, { 
        ...metadata,
        success: false,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Get database performance metrics
   */
  getDatabaseMetrics() {
    return performanceMonitor.getMetricsSummary().database;
  }

  /**
   * Get slow queries
   */
  getSlowQueries(limit = 10) {
    return performanceMonitor.metrics.database.queries
      .filter(query => query.duration > performanceMonitor.thresholds.slowQuery)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, limit);
  }

  /**
   * Get recent queries
   */
  getRecentQueries(limit = 20) {
    return performanceMonitor.metrics.database.queries
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }
}

// Create singleton instance
const databasePerformanceWrapper = new DatabasePerformanceWrapper();

export default databasePerformanceWrapper;
