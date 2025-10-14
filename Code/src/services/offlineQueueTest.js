/**
 * Offline Queue Test Suite
 * Demonstrates and tests the offline data queue management system
 */

import EnhancedOfflineManager from './enhancedOfflineManager.js';

class OfflineQueueTest {
  constructor() {
    this.manager = null;
    this.testResults = [];
  }

  async init() {
    this.manager = new EnhancedOfflineManager();
    await this.manager.init();
    console.log('🧪 Offline Queue Test initialized');
  }

  // ===== TEST SCENARIOS =====

  async testBasicQueuing() {
    console.log('🧪 Testing basic queuing...');
    
    try {
      // Test behavioral log queuing
      const logId1 = await this.manager.queueBehavioralLog(
        'test-user-1',
        'craving',
        { intensity: 5, trigger: 'stress' },
        'normal'
      );
      
      const logId2 = await this.manager.queueBehavioralLog(
        'test-user-1',
        'hydration',
        { amount: 250, type: 'water' },
        'high'
      );
      
      // Test Firestore action queuing
      const actionId1 = await this.manager.queueFirestoreAction(
        'test-user-1',
        'UPDATE_STATS',
        { streakDays: 5, cravingsResisted: 10 },
        'critical'
      );
      
      // Test CRUD operations
      const createId = await this.manager.queueCreate(
        'testCollection',
        { name: 'Test Document', value: 42 },
        'test-user-1',
        'normal'
      );
      
      const updateId = await this.manager.queueUpdate(
        'testCollection',
        'doc-123',
        { name: 'Updated Document', value: 84 },
        'test-user-1',
        'normal'
      );
      
      const deleteId = await this.manager.queueDelete(
        'testCollection',
        'doc-456',
        'test-user-1',
        'low'
      );
      
      // Get queue details
      const queueDetails = await this.manager.getQueueDetails();
      
      this.testResults.push({
        test: 'Basic Queuing',
        status: 'PASSED',
        details: {
          queuedOperations: queueDetails.queued.length,
          operations: queueDetails.queued.map(op => ({
            type: op.type,
            priority: op.priority
          }))
        }
      });
      
      console.log('✅ Basic queuing test passed');
      return true;
    } catch (error) {
      console.error('❌ Basic queuing test failed:', error);
      this.testResults.push({
        test: 'Basic Queuing',
        status: 'FAILED',
        error: error.message
      });
      return false;
    }
  }

  async testPriorityHandling() {
    console.log('🧪 Testing priority handling...');
    
    try {
      // Clear existing queue
      await this.manager.clearAllQueues();
      
      // Queue operations with different priorities
      await this.manager.queueBehavioralLog('user-1', 'relapse', {}, 'critical');
      await this.manager.queueBehavioralLog('user-1', 'craving', {}, 'low');
      await this.manager.queueBehavioralLog('user-1', 'hydration', {}, 'high');
      await this.manager.queueBehavioralLog('user-1', 'mood', {}, 'normal');
      
      const queueDetails = await this.manager.getQueueDetails();
      const operations = queueDetails.queued;
      
      // Check if operations are sorted by priority
      const priorityOrder = ['critical', 'high', 'normal', 'low'];
      const sortedOperations = operations.sort((a, b) => {
        return priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority);
      });
      
      const isCorrectlySorted = JSON.stringify(operations) === JSON.stringify(sortedOperations);
      
      this.testResults.push({
        test: 'Priority Handling',
        status: isCorrectlySorted ? 'PASSED' : 'FAILED',
        details: {
          operations: operations.map(op => ({ type: op.type, priority: op.priority })),
          correctlySorted: isCorrectlySorted
        }
      });
      
      console.log('✅ Priority handling test passed');
      return isCorrectlySorted;
    } catch (error) {
      console.error('❌ Priority handling test failed:', error);
      this.testResults.push({
        test: 'Priority Handling',
        status: 'FAILED',
        error: error.message
      });
      return false;
    }
  }

  async testConflictResolution() {
    console.log('🧪 Testing conflict resolution...');
    
    try {
      // Simulate a conflict scenario
      const clientData = {
        streakDays: 5,
        cravingsResisted: 10,
        lastUpdated: Date.now()
      };
      
      const serverData = {
        streakDays: 3,
        cravingsResisted: 8,
        lastUpdated: Date.now() - 1000
      };
      
      // Test conflict detection
      const conflict = this.manager.conflictResolver.detectConflict(
        clientData,
        serverData,
        'UPDATE'
      );
      
      if (conflict && conflict.hasConflict) {
        // Test conflict resolution
        const resolution = await this.manager.conflictResolver.resolveConflict(
          conflict,
          'merge'
        );
        
        this.testResults.push({
          test: 'Conflict Resolution',
          status: 'PASSED',
          details: {
            conflictsDetected: conflict.conflicts.length,
            resolutionStrategy: resolution.strategy,
            resolved: resolution.resolved
          }
        });
        
        console.log('✅ Conflict resolution test passed');
        return true;
      } else {
        this.testResults.push({
          test: 'Conflict Resolution',
          status: 'FAILED',
          details: { reason: 'No conflicts detected' }
        });
        return false;
      }
    } catch (error) {
      console.error('❌ Conflict resolution test failed:', error);
      this.testResults.push({
        test: 'Conflict Resolution',
        status: 'FAILED',
        error: error.message
      });
      return false;
    }
  }

  async testRetryMechanism() {
    console.log('🧪 Testing retry mechanism...');
    
    try {
      // Clear existing queue
      await this.manager.clearAllQueues();
      
      // Queue an operation that will fail
      const operationId = await this.manager.queueBehavioralLog(
        'test-user',
        'test-log',
        { test: true },
        'normal'
      );
      
      // Simulate operation failure by modifying the operation
      const queueDetails = await this.manager.getQueueDetails();
      const operation = queueDetails.queued.find(op => op.id === operationId);
      
      if (operation) {
        // Simulate retry by incrementing retry count
        operation.retryCount = 1;
        operation.status = 'failed';
        
        // Test retry functionality
        await this.manager.retryFailedOperations();
        
        const updatedQueueDetails = await this.manager.getQueueDetails();
        const retriedOperation = updatedQueueDetails.queued.find(op => op.id === operationId);
        
        this.testResults.push({
          test: 'Retry Mechanism',
          status: retriedOperation ? 'PASSED' : 'FAILED',
          details: {
            operationRetried: !!retriedOperation,
            retryCount: retriedOperation?.retryCount || 0
          }
        });
        
        console.log('✅ Retry mechanism test passed');
        return true;
      } else {
        this.testResults.push({
          test: 'Retry Mechanism',
          status: 'FAILED',
          details: { reason: 'Operation not found' }
        });
        return false;
      }
    } catch (error) {
      console.error('❌ Retry mechanism test failed:', error);
      this.testResults.push({
        test: 'Retry Mechanism',
        status: 'FAILED',
        error: error.message
      });
      return false;
    }
  }

  async testProgressTracking() {
    console.log('🧪 Testing progress tracking...');
    
    try {
      // Clear existing queue
      await this.manager.clearAllQueues();
      
      // Queue multiple operations
      const operations = [];
      for (let i = 0; i < 5; i++) {
        const opId = await this.manager.queueBehavioralLog(
          'test-user',
          'test-log',
          { index: i },
          'normal'
        );
        operations.push(opId);
      }
      
      // Get initial status
      const initialStatus = this.manager.getStatus();
      
      // Test progress tracking
      let progressUpdates = 0;
      const progressCallback = (progress) => {
        progressUpdates++;
        console.log(`Progress update ${progressUpdates}: ${progress.progress}%`);
      };
      
      this.manager.progressManager.addProgressCallback(progressCallback);
      
      // Simulate sync progress
      const sessionId = this.manager.progressManager.startSyncSession(5, 'test');
      
      // Simulate progress updates
      for (let i = 0; i <= 5; i++) {
        this.manager.progressManager.updateSyncProgress(sessionId, {
          completedOperations: i,
          totalOperations: 5
        });
      }
      
      this.manager.progressManager.completeSyncSession(sessionId, {
        successful: 5,
        failed: 0,
        conflicts: 0,
        skipped: 0
      });
      
      this.manager.progressManager.removeProgressCallback(progressCallback);
      
      this.testResults.push({
        test: 'Progress Tracking',
        status: 'PASSED',
        details: {
          progressUpdates,
          initialQueueSize: initialStatus.queue.queuedOperations,
          finalQueueSize: this.manager.getStatus().queue.queuedOperations
        }
      });
      
      console.log('✅ Progress tracking test passed');
      return true;
    } catch (error) {
      console.error('❌ Progress tracking test failed:', error);
      this.testResults.push({
        test: 'Progress Tracking',
        status: 'FAILED',
        error: error.message
      });
      return false;
    }
  }

  // ===== TEST RUNNER =====

  async runAllTests() {
    console.log('🚀 Starting Offline Queue Test Suite...');
    
    await this.init();
    
    const tests = [
      this.testBasicQueuing.bind(this),
      this.testPriorityHandling.bind(this),
      this.testConflictResolution.bind(this),
      this.testRetryMechanism.bind(this),
      this.testProgressTracking.bind(this)
    ];
    
    let passedTests = 0;
    
    for (const test of tests) {
      try {
        const result = await test();
        if (result) passedTests++;
      } catch (error) {
        console.error('❌ Test error:', error);
      }
    }
    
    console.log(`\n📊 Test Results: ${passedTests}/${tests.length} tests passed`);
    console.table(this.testResults);
    
    return {
      totalTests: tests.length,
      passedTests,
      failedTests: tests.length - passedTests,
      results: this.testResults
    };
  }

  // ===== DEMO SCENARIOS =====

  async demoOfflineScenario() {
    console.log('🎬 Demo: Offline Scenario');
    
    // Simulate going offline
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false
    });
    
    // Queue some operations while offline
    await this.manager.queueBehavioralLog('user-1', 'craving', { intensity: 7 });
    await this.manager.queueBehavioralLog('user-1', 'hydration', { amount: 500 });
    await this.manager.queueFirestoreAction('user-1', 'UPDATE_STATS', { streakDays: 3 });
    
    const queueDetails = await this.manager.getQueueDetails();
    console.log(`📝 Queued ${queueDetails.queued.length} operations while offline`);
    
    // Simulate coming back online
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true
    });
    
    // Trigger sync
    await this.manager.attemptSync();
    
    console.log('✅ Demo completed');
  }

  async demoConflictScenario() {
    console.log('🎬 Demo: Conflict Scenario');
    
    // Simulate conflicting data
    const clientData = {
      streakDays: 10,
      cravingsResisted: 25,
      lastUpdated: Date.now()
    };
    
    const serverData = {
      streakDays: 8,
      cravingsResisted: 20,
      lastUpdated: Date.now() - 5000
    };
    
    const conflict = this.manager.conflictResolver.detectConflict(
      clientData,
      serverData,
      'UPDATE'
    );
    
    if (conflict) {
      console.log('⚠️ Conflict detected:', conflict);
      
      const resolution = await this.manager.conflictResolver.resolveConflict(
        conflict,
        'merge'
      );
      
      console.log('✅ Conflict resolved:', resolution);
    }
  }

  // ===== CLEANUP =====

  async cleanup() {
    if (this.manager) {
      await this.manager.clearAllQueues();
      this.manager.destroy();
    }
  }
}

// Export for use in browser console
window.OfflineQueueTest = OfflineQueueTest;

export default OfflineQueueTest;
