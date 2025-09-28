/**
 * Stress Testing Service
 * Simulates various load conditions to test system performance
 */

import performanceMonitor from './performanceMonitor.js';
import { db } from './firebase.js';
import { ref, get, set, push } from 'firebase/database';

class StressTestService {
  constructor() {
    this.isRunning = false;
    this.activeTests = new Map();
    this.testResults = [];
  }

  /**
   * Run a stress test scenario
   */
  async runStressTest(scenario, options = {}) {
    if (this.isRunning) {
      throw new Error('Stress test already running');
    }

    this.isRunning = true;
    const testId = Date.now().toString();
    
    try {
      console.log(`🧪 Starting stress test: ${scenario.name}`);
      
      const result = await this.executeScenario(scenario, options);
      
      this.testResults.push({
        id: testId,
        scenario: scenario.name,
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        duration: result.duration,
        success: result.success,
        metrics: result.metrics,
        errors: result.errors
      });

      console.log(`✅ Stress test completed: ${scenario.name}`);
      return result;
      
    } catch (error) {
      console.error(`❌ Stress test failed: ${scenario.name}`, error);
      throw error;
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Execute a stress test scenario
   */
  async executeScenario(scenario, options) {
    const startTime = performance.now();
    const errors = [];
    const metrics = {
      operations: 0,
      successfulOperations: 0,
      failedOperations: 0,
      averageResponseTime: 0,
      maxResponseTime: 0,
      minResponseTime: Infinity
    };

    try {
      // Run the scenario
      await scenario.execute(options, {
        onOperation: (operationName, duration, success) => {
          metrics.operations++;
          if (success) {
            metrics.successfulOperations++;
          } else {
            metrics.failedOperations++;
          }
          
          metrics.averageResponseTime = (metrics.averageResponseTime + duration) / 2;
          metrics.maxResponseTime = Math.max(metrics.maxResponseTime, duration);
          metrics.minResponseTime = Math.min(metrics.minResponseTime, duration);
        },
        onError: (error) => {
          errors.push({
            message: error.message,
            timestamp: new Date().toISOString(),
            stack: error.stack
          });
        }
      });

      const endTime = performance.now();
      const duration = endTime - startTime;

      return {
        success: errors.length === 0,
        duration,
        metrics,
        errors
      };

    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      errors.push({
        message: error.message,
        timestamp: new Date().toISOString(),
        stack: error.stack
      });

      return {
        success: false,
        duration,
        metrics,
        errors
      };
    }
  }

  /**
   * Database load test - simulates multiple concurrent database operations
   */
  async databaseLoadTest(options = {}) {
    const {
      concurrentUsers = 10,
      operationsPerUser = 5,
      operationDelay = 100
    } = options;

    const scenario = {
      name: 'Database Load Test',
      execute: async (opts, callbacks) => {
        const promises = [];
        
        for (let i = 0; i < concurrentUsers; i++) {
          const userPromise = this.simulateUserDatabaseOperations(
            `test_user_${i}`,
            operationsPerUser,
            operationDelay,
            callbacks
          );
          promises.push(userPromise);
        }

        await Promise.all(promises);
      }
    };

    return this.runStressTest(scenario, options);
  }

  /**
   * Simulate database operations for a single user
   */
  async simulateUserDatabaseOperations(userId, operationCount, delay, callbacks) {
    for (let i = 0; i < operationCount; i++) {
      try {
        const startTime = performance.now();
        
        // Simulate various database operations
        const operations = [
          () => this.simulateReadOperation(userId, i),
          () => this.simulateWriteOperation(userId, i),
          () => this.simulateUpdateOperation(userId, i),
          () => this.simulateQueryOperation(userId, i)
        ];
        
        const operation = operations[i % operations.length];
        await operation();
        
        const duration = performance.now() - startTime;
        callbacks.onOperation(`db_operation_${i}`, duration, true);
        
        // Add delay between operations
        if (delay > 0) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
        
      } catch (error) {
        const duration = performance.now() - startTime;
        callbacks.onOperation(`db_operation_${i}`, duration, false);
        callbacks.onError(error);
      }
    }
  }

  /**
   * Simulate read operation
   */
  async simulateReadOperation(userId, index) {
    const testRef = ref(db, `stress_test/${userId}/read_${index}`);
    await get(testRef);
  }

  /**
   * Simulate write operation
   */
  async simulateWriteOperation(userId, index) {
    const testRef = ref(db, `stress_test/${userId}/write_${index}`);
    await set(testRef, {
      data: `test_data_${index}`,
      timestamp: Date.now(),
      index
    });
  }

  /**
   * Simulate update operation
   */
  async simulateUpdateOperation(userId, index) {
    const testRef = ref(db, `stress_test/${userId}/update_${index}`);
    await set(testRef, {
      data: `updated_data_${index}`,
      timestamp: Date.now(),
      index,
      updated: true
    });
  }

  /**
   * Simulate query operation
   */
  async simulateQueryOperation(userId, index) {
    const testRef = ref(db, `stress_test/${userId}`);
    await get(testRef);
  }

  /**
   * Authentication load test - simulates multiple concurrent login attempts
   */
  async authLoadTest(options = {}) {
    const {
      concurrentAttempts = 20,
      delayBetweenAttempts = 50
    } = options;

    const scenario = {
      name: 'Authentication Load Test',
      execute: async (opts, callbacks) => {
        const promises = [];
        
        for (let i = 0; i < concurrentAttempts; i++) {
          const attemptPromise = this.simulateAuthAttempt(i, delayBetweenAttempts, callbacks);
          promises.push(attemptPromise);
        }

        await Promise.all(promises);
      }
    };

    return this.runStressTest(scenario, options);
  }

  /**
   * Simulate authentication attempt
   */
  async simulateAuthAttempt(index, delay, callbacks) {
    try {
      const startTime = performance.now();
      
      // Simulate auth attempt (without actually calling Firebase)
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 100));
      
      const duration = performance.now() - startTime;
      const success = Math.random() > 0.1; // 90% success rate
      
      callbacks.onOperation(`auth_attempt_${index}`, duration, success);
      
      if (!success) {
        callbacks.onError(new Error(`Simulated auth failure ${index}`));
      }
      
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
    } catch (error) {
      callbacks.onError(error);
    }
  }

  /**
   * Offline/Online transition test
   */
  async offlineOnlineTest(options = {}) {
    const {
      transitionCount = 5,
      offlineDuration = 2000,
      onlineDuration = 2000
    } = options;

    const scenario = {
      name: 'Offline/Online Transition Test',
      execute: async (opts, callbacks) => {
        for (let i = 0; i < transitionCount; i++) {
          // Simulate going offline
          callbacks.onOperation(`offline_transition_${i}`, 0, true);
          await new Promise(resolve => setTimeout(resolve, offlineDuration));
          
          // Simulate coming back online
          callbacks.onOperation(`online_transition_${i}`, 0, true);
          await new Promise(resolve => setTimeout(resolve, onlineDuration));
        }
      }
    };

    return this.runStressTest(scenario, options);
  }

  /**
   * Memory usage test
   */
  async memoryUsageTest(options = {}) {
    const {
      iterations = 100,
      dataSize = 1000
    } = options;

    const scenario = {
      name: 'Memory Usage Test',
      execute: async (opts, callbacks) => {
        const data = [];
        
        for (let i = 0; i < iterations; i++) {
          const startTime = performance.now();
          
          // Create large data structure
          const largeData = new Array(dataSize).fill(0).map((_, index) => ({
            id: index,
            data: `test_data_${i}_${index}`,
            timestamp: Date.now()
          }));
          
          data.push(largeData);
          
          const duration = performance.now() - startTime;
          callbacks.onOperation(`memory_allocation_${i}`, duration, true);
          
          // Simulate garbage collection
          if (i % 10 === 0) {
            data.splice(0, data.length / 2);
          }
        }
      }
    };

    return this.runStressTest(scenario, options);
  }

  /**
   * Get test results
   */
  getTestResults(limit = 10) {
    return this.testResults
      .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
      .slice(0, limit);
  }

  /**
   * Clear test results
   */
  clearTestResults() {
    this.testResults = [];
  }

  /**
   * Get performance summary during stress test
   */
  getPerformanceSummary() {
    return performanceMonitor.getMetricsSummary();
  }

  /**
   * Stop all active tests
   */
  stopAllTests() {
    this.isRunning = false;
    this.activeTests.clear();
  }

  /**
   * Check if stress test is running
   */
  isTestRunning() {
    return this.isRunning;
  }
}

// Create singleton instance
const stressTestService = new StressTestService();

export default stressTestService;
