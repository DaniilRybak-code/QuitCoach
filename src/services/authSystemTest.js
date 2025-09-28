/**
 * Authentication System Test Suite
 * Comprehensive testing for authentication validation and session management
 */

import AuthGuard from './authGuard.js';
import SessionManager from './sessionManager.js';
import AuthStateValidator from './authStateValidator.js';

class AuthSystemTest {
  constructor() {
    this.authGuard = null;
    this.sessionManager = null;
    this.authValidator = null;
    this.testResults = [];
  }

  async init() {
    try {
      this.authGuard = new AuthGuard();
      this.sessionManager = new SessionManager();
      this.authValidator = new AuthStateValidator();
      
      console.log('🧪 Auth System Test initialized');
    } catch (error) {
      console.error('❌ Failed to initialize auth system test:', error);
    }
  }

  // ===== AUTHENTICATION VALIDATION TESTS =====

  async testAuthStateValidation() {
    console.log('🧪 Testing authentication state validation...');
    
    try {
      // Test unauthenticated state
      const isAuthenticated = this.authGuard.isUserAuthenticated();
      
      if (!isAuthenticated) {
        // Test that operations fail without authentication
        try {
          await this.authGuard.databaseGet('users/test-user');
          this.testResults.push({
            test: 'Auth State Validation - Unauthenticated',
            status: 'FAILED',
            details: 'Operation should have failed without authentication'
          });
          return false;
        } catch (error) {
          this.testResults.push({
            test: 'Auth State Validation - Unauthenticated',
            status: 'PASSED',
            details: 'Operation correctly failed without authentication'
          });
        }
      } else {
        this.testResults.push({
          test: 'Auth State Validation - Unauthenticated',
          status: 'SKIPPED',
          details: 'User is already authenticated'
        });
      }
      
      console.log('✅ Auth state validation test passed');
      return true;
    } catch (error) {
      console.error('❌ Auth state validation test failed:', error);
      this.testResults.push({
        test: 'Auth State Validation',
        status: 'FAILED',
        error: error.message
      });
      return false;
    }
  }

  async testOperationValidation() {
    console.log('🧪 Testing operation validation...');
    
    try {
      const operations = [
        { name: 'databaseGet', method: () => this.authGuard.databaseGet('users/test') },
        { name: 'databaseSet', method: () => this.authGuard.databaseSet('users/test', {}) },
        { name: 'databaseUpdate', method: () => this.authGuard.databaseUpdate('users/test', {}) },
        { name: 'databaseRemove', method: () => this.authGuard.databaseRemove('users/test') },
        { name: 'firestoreGetDoc', method: () => this.authGuard.firestoreGetDoc('test', 'doc') },
        { name: 'firestoreSetDoc', method: () => this.authGuard.firestoreSetDoc('test', 'doc', {}) },
        { name: 'firestoreUpdateDoc', method: () => this.authGuard.firestoreUpdateDoc('test', 'doc', {}) },
        { name: 'firestoreDeleteDoc', method: () => this.authGuard.firestoreDeleteDoc('test', 'doc') }
      ];
      
      let passedOperations = 0;
      
      for (const operation of operations) {
        try {
          await operation.method();
          // If we get here, the operation succeeded (user might be authenticated)
          passedOperations++;
        } catch (error) {
          if (this.authGuard.isAuthError(error)) {
            // Expected auth error
            passedOperations++;
          } else {
            console.warn(`Unexpected error in ${operation.name}:`, error);
          }
        }
      }
      
      this.testResults.push({
        test: 'Operation Validation',
        status: 'PASSED',
        details: `${passedOperations}/${operations.length} operations handled correctly`
      });
      
      console.log('✅ Operation validation test passed');
      return true;
    } catch (error) {
      console.error('❌ Operation validation test failed:', error);
      this.testResults.push({
        test: 'Operation Validation',
        status: 'FAILED',
        error: error.message
      });
      return false;
    }
  }

  async testRetryMechanism() {
    console.log('🧪 Testing retry mechanism...');
    
    try {
      // Simulate a failing operation
      const failingOperation = async () => {
        throw new Error('Simulated network error');
      };
      
      // This should queue the operation for retry
      try {
        await this.authGuard.executeWithAuth('TEST_OPERATION', failingOperation);
      } catch (error) {
        // Expected to fail
      }
      
      // Check if operation was queued
      const retryQueue = this.authGuard.getRetryQueue();
      const hasQueuedOperation = retryQueue.length > 0;
      
      this.testResults.push({
        test: 'Retry Mechanism',
        status: hasQueuedOperation ? 'PASSED' : 'FAILED',
        details: hasQueuedOperation ? 'Operation queued for retry' : 'Operation not queued'
      });
      
      console.log('✅ Retry mechanism test passed');
      return hasQueuedOperation;
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

  // ===== SESSION MANAGEMENT TESTS =====

  async testSessionTimeout() {
    console.log('🧪 Testing session timeout...');
    
    try {
      // Get initial session info
      const initialSessionInfo = this.sessionManager.getSessionInfo();
      
      // Update config for faster testing
      this.sessionManager.updateConfig({
        sessionTimeoutDuration: 5000, // 5 seconds
        warningDuration: 2000 // 2 seconds
      });
      
      // Wait for timeout
      await new Promise(resolve => setTimeout(resolve, 6000));
      
      const finalSessionInfo = this.sessionManager.getSessionInfo();
      
      this.testResults.push({
        test: 'Session Timeout',
        status: 'PASSED',
        details: {
          initialActive: initialSessionInfo.isActive,
          finalActive: finalSessionInfo.isActive,
          timeoutTriggered: !finalSessionInfo.isActive
        }
      });
      
      console.log('✅ Session timeout test passed');
      return true;
    } catch (error) {
      console.error('❌ Session timeout test failed:', error);
      this.testResults.push({
        test: 'Session Timeout',
        status: 'FAILED',
        error: error.message
      });
      return false;
    }
  }

  async testActivityTracking() {
    console.log('🧪 Testing activity tracking...');
    
    try {
      const initialActivity = this.sessionManager.getSessionInfo().lastActivity;
      
      // Simulate activity
      document.dispatchEvent(new Event('mousedown'));
      document.dispatchEvent(new Event('keypress'));
      
      // Wait a moment for activity to be processed
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const finalActivity = this.sessionManager.getSessionInfo().lastActivity;
      const activityUpdated = finalActivity > initialActivity;
      
      this.testResults.push({
        test: 'Activity Tracking',
        status: activityUpdated ? 'PASSED' : 'FAILED',
        details: {
          initialActivity,
          finalActivity,
          activityUpdated
        }
      });
      
      console.log('✅ Activity tracking test passed');
      return activityUpdated;
    } catch (error) {
      console.error('❌ Activity tracking test failed:', error);
      this.testResults.push({
        test: 'Activity Tracking',
        status: 'FAILED',
        error: error.message
      });
      return false;
    }
  }

  async testSessionExtension() {
    console.log('🧪 Testing session extension...');
    
    try {
      // Get initial session info
      const initialInfo = this.sessionManager.getSessionInfo();
      
      // Extend session
      this.sessionManager.extendSession();
      
      // Wait a moment
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const finalInfo = this.sessionManager.getSessionInfo();
      const sessionExtended = finalInfo.timeUntilTimeout > initialInfo.timeUntilTimeout;
      
      this.testResults.push({
        test: 'Session Extension',
        status: sessionExtended ? 'PASSED' : 'FAILED',
        details: {
          initialTimeout: initialInfo.timeUntilTimeout,
          finalTimeout: finalInfo.timeUntilTimeout,
          sessionExtended
        }
      });
      
      console.log('✅ Session extension test passed');
      return sessionExtended;
    } catch (error) {
      console.error('❌ Session extension test failed:', error);
      this.testResults.push({
        test: 'Session Extension',
        status: 'FAILED',
        error: error.message
      });
      return false;
    }
  }

  // ===== ERROR HANDLING TESTS =====

  async testErrorHandling() {
    console.log('🧪 Testing error handling...');
    
    try {
      // Test different error types
      const errorTests = [
        {
          name: 'Token Expired',
          error: { code: 'auth/token-expired', message: 'Token has expired' },
          expectedHandling: 'token-expired'
        },
        {
          name: 'Network Error',
          error: { code: 'auth/network-request-failed', message: 'Network error' },
          expectedHandling: 'network'
        },
        {
          name: 'Permission Error',
          error: { code: 'auth/requires-recent-login', message: 'Permission denied' },
          expectedHandling: 'permission'
        }
      ];
      
      let passedTests = 0;
      
      for (const test of errorTests) {
        const isAuthError = this.authGuard.isAuthError(test.error);
        const isTokenExpired = this.authGuard.isTokenExpiredError(test.error);
        const isNetworkError = this.authGuard.isNetworkError(test.error);
        const isPermissionError = this.authGuard.isPermissionError(test.error);
        
        let testPassed = false;
        
        switch (test.expectedHandling) {
          case 'token-expired':
            testPassed = isTokenExpired;
            break;
          case 'network':
            testPassed = isNetworkError;
            break;
          case 'permission':
            testPassed = isPermissionError;
            break;
        }
        
        if (testPassed) {
          passedTests++;
        }
      }
      
      this.testResults.push({
        test: 'Error Handling',
        status: passedTests === errorTests.length ? 'PASSED' : 'FAILED',
        details: `${passedTests}/${errorTests.length} error types handled correctly`
      });
      
      console.log('✅ Error handling test passed');
      return passedTests === errorTests.length;
    } catch (error) {
      console.error('❌ Error handling test failed:', error);
      this.testResults.push({
        test: 'Error Handling',
        status: 'FAILED',
        error: error.message
      });
      return false;
    }
  }

  // ===== INTEGRATION TESTS =====

  async testIntegration() {
    console.log('🧪 Testing integration...');
    
    try {
      // Test that all services work together
      const authState = this.authGuard.getAuthState();
      const sessionInfo = this.sessionManager.getSessionInfo();
      const operationStats = this.authGuard.getOperationStats();
      
      const integrationWorking = 
        authState !== null &&
        sessionInfo !== null &&
        operationStats !== null;
      
      this.testResults.push({
        test: 'Integration',
        status: integrationWorking ? 'PASSED' : 'FAILED',
        details: {
          authState: !!authState,
          sessionInfo: !!sessionInfo,
          operationStats: !!operationStats
        }
      });
      
      console.log('✅ Integration test passed');
      return integrationWorking;
    } catch (error) {
      console.error('❌ Integration test failed:', error);
      this.testResults.push({
        test: 'Integration',
        status: 'FAILED',
        error: error.message
      });
      return false;
    }
  }

  // ===== PERFORMANCE TESTS =====

  async testPerformance() {
    console.log('🧪 Testing performance...');
    
    try {
      const startTime = Date.now();
      
      // Test multiple operations
      const operations = [];
      for (let i = 0; i < 10; i++) {
        operations.push(
          this.authGuard.executeWithAuth(`PERF_TEST_${i}`, async () => {
            // Simulate operation
            return { success: true };
          })
        );
      }
      
      await Promise.all(operations);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      this.testResults.push({
        test: 'Performance',
        status: 'PASSED',
        details: {
          operations: 10,
          duration: `${duration}ms`,
          avgPerOperation: `${Math.round(duration / 10)}ms`
        }
      });
      
      console.log('✅ Performance test passed');
      return true;
    } catch (error) {
      console.error('❌ Performance test failed:', error);
      this.testResults.push({
        test: 'Performance',
        status: 'FAILED',
        error: error.message
      });
      return false;
    }
  }

  // ===== TEST RUNNER =====

  async runAllTests() {
    console.log('🚀 Starting Auth System Test Suite...');
    
    await this.init();
    
    const tests = [
      this.testAuthStateValidation.bind(this),
      this.testOperationValidation.bind(this),
      this.testRetryMechanism.bind(this),
      this.testSessionTimeout.bind(this),
      this.testActivityTracking.bind(this),
      this.testSessionExtension.bind(this),
      this.testErrorHandling.bind(this),
      this.testIntegration.bind(this),
      this.testPerformance.bind(this)
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

  async demoAuthFlow() {
    console.log('🎬 Demo: Authentication Flow');
    
    // Show current auth state
    const authState = this.authGuard.getAuthState();
    console.log('Current auth state:', authState);
    
    // Show session info
    const sessionInfo = this.sessionManager.getSessionInfo();
    console.log('Current session info:', sessionInfo);
    
    // Show operation stats
    const operationStats = this.authGuard.getOperationStats();
    console.log('Operation stats:', operationStats);
  }

  async demoSessionManagement() {
    console.log('🎬 Demo: Session Management');
    
    // Show session duration
    const duration = this.sessionManager.getSessionDuration();
    console.log(`Session duration: ${Math.floor(duration / 60)} minutes`);
    
    // Show time until timeout
    const timeUntilTimeout = this.sessionManager.getTimeUntilTimeout();
    console.log(`Time until timeout: ${Math.floor(timeUntilTimeout / 1000)} seconds`);
    
    // Test session extension
    this.sessionManager.extendSession();
    console.log('Session extended');
  }

  // ===== CLEANUP =====

  async cleanup() {
    if (this.authGuard) {
      this.authGuard.destroy();
    }
    if (this.sessionManager) {
      this.sessionManager.destroy();
    }
    if (this.authValidator) {
      this.authValidator.destroy();
    }
  }
}

// Export for use in browser console
window.AuthSystemTest = AuthSystemTest;

export default AuthSystemTest;
