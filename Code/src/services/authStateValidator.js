/**
 * Authentication State Validator
 * Comprehensive authentication validation and session management
 */

import { auth } from './firebase.js';
import { onAuthStateChanged, signOut, getIdToken, onIdTokenChanged } from 'firebase/auth';

class AuthStateValidator {
  constructor() {
    this.isAuthenticated = false;
    this.currentUser = null;
    this.authStateListeners = new Set();
    this.sessionTimeout = null;
    this.tokenRefreshInterval = null;
    this.lastActivity = Date.now();
    this.sessionTimeoutDuration = 30 * 60 * 1000; // 30 minutes
    this.tokenRefreshIntervalDuration = 5 * 60 * 1000; // 5 minutes
    this.isInitialized = false;
    this.pendingOperations = new Map();
    
    // Configuration
    this.config = {
      sessionTimeout: 30 * 60 * 1000, // 30 minutes
      tokenRefreshInterval: 5 * 60 * 1000, // 5 minutes
      maxRetries: 3,
      retryDelay: 1000, // 1 second
      enableActivityTracking: true,
      enableSessionTimeout: true,
      enableTokenRefresh: true
    };
    
    this.init();
  }

  // ===== INITIALIZATION =====

  async init() {
    try {
      console.log('🔐 Initializing AuthStateValidator...');
      
      // Set up authentication state listener
      this.setupAuthStateListener();
      
      // Set up token refresh listener
      this.setupTokenRefreshListener();
      
      // Set up activity tracking
      this.setupActivityTracking();
      
      // Set up session timeout
      this.setupSessionTimeout();
      
      this.isInitialized = true;
      console.log('✅ AuthStateValidator initialized');
    } catch (error) {
      console.error('❌ Failed to initialize AuthStateValidator:', error);
      throw error;
    }
  }

  setupAuthStateListener() {
    onAuthStateChanged(auth, async (user) => {
      console.log('🔐 Auth state changed:', user ? `User: ${user.uid}` : 'No user');
      
      const wasAuthenticated = this.isAuthenticated;
      this.isAuthenticated = !!user;
      this.currentUser = user;
      
      if (user) {
        // User authenticated
        await this.handleUserAuthenticated(user);
      } else {
        // User signed out
        await this.handleUserSignedOut();
      }
      
      // Notify listeners
      this.notifyAuthStateChange({
        isAuthenticated: this.isAuthenticated,
        user: this.currentUser,
        wasAuthenticated,
        timestamp: Date.now()
      });
    });
  }

  setupTokenRefreshListener() {
    if (!this.config.enableTokenRefresh) return;
    
    onIdTokenChanged(auth, async (user) => {
      if (user) {
        console.log('🔄 Token refreshed for user:', user.uid);
        this.lastActivity = Date.now();
        this.resetSessionTimeout();
      }
    });
  }

  setupActivityTracking() {
    if (!this.config.enableActivityTracking) return;
    
    // Track user activity
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const updateActivity = () => {
      this.lastActivity = Date.now();
      this.resetSessionTimeout();
    };
    
    activityEvents.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });
    
    // Track visibility changes
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        updateActivity();
      }
    });
  }

  setupSessionTimeout() {
    if (!this.config.enableSessionTimeout) return;
    
    this.resetSessionTimeout();
  }

  // ===== AUTHENTICATION HANDLING =====

  async handleUserAuthenticated(user) {
    try {
      console.log('✅ User authenticated:', user.uid);
      
      // Validate user token
      await this.validateUserToken(user);
      
      // Reset session timeout
      this.resetSessionTimeout();
      
      // Process pending operations
      await this.processPendingOperations();
      
      // Set up token refresh
      this.setupTokenRefresh();
      
    } catch (error) {
      console.error('❌ Error handling user authentication:', error);
      await this.handleAuthError(error);
    }
  }

  async handleUserSignedOut() {
    try {
      console.log('👋 User signed out');
      
      // Clear session timeout
      this.clearSessionTimeout();
      
      // Clear token refresh
      this.clearTokenRefresh();
      
      // Clear pending operations
      this.pendingOperations.clear();
      
      // Reset state
      this.isAuthenticated = false;
      this.currentUser = null;
      this.lastActivity = Date.now();
      
    } catch (error) {
      console.error('❌ Error handling user sign out:', error);
    }
  }

  async validateUserToken(user) {
    try {
      const token = await getIdToken(user, true); // Force refresh
      
      if (!token) {
        throw new Error('No valid token available');
      }
      
      // Decode token to check expiration
      const payload = this.decodeToken(token);
      const now = Date.now() / 1000;
      
      if (payload.exp < now) {
        throw new Error('Token has expired');
      }
      
      console.log('✅ User token validated');
      return true;
    } catch (error) {
      console.error('❌ Token validation failed:', error);
      throw error;
    }
  }

  decodeToken(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('❌ Error decoding token:', error);
      throw error;
    }
  }

  // ===== SESSION MANAGEMENT =====

  resetSessionTimeout() {
    if (!this.config.enableSessionTimeout) return;
    
    this.clearSessionTimeout();
    
    this.sessionTimeout = setTimeout(async () => {
      console.log('⏰ Session timeout reached');
      await this.handleSessionTimeout();
    }, this.config.sessionTimeout);
  }

  clearSessionTimeout() {
    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout);
      this.sessionTimeout = null;
    }
  }

  async handleSessionTimeout() {
    try {
      console.log('⏰ Handling session timeout...');
      
      // Show timeout warning
      this.showSessionTimeoutWarning();
      
      // Sign out user
      await signOut(auth);
      
    } catch (error) {
      console.error('❌ Error handling session timeout:', error);
    }
  }

  setupTokenRefresh() {
    if (!this.config.enableTokenRefresh) return;
    
    this.clearTokenRefresh();
    
    this.tokenRefreshInterval = setInterval(async () => {
      if (this.isAuthenticated && this.currentUser) {
        try {
          await getIdToken(this.currentUser, true);
          console.log('🔄 Token refreshed automatically');
        } catch (error) {
          console.error('❌ Token refresh failed:', error);
          await this.handleAuthError(error);
        }
      }
    }, this.config.tokenRefreshInterval);
  }

  clearTokenRefresh() {
    if (this.tokenRefreshInterval) {
      clearInterval(this.tokenRefreshInterval);
      this.tokenRefreshInterval = null;
    }
  }

  // ===== OPERATION VALIDATION =====

  async validateAuthState(operation, retryCount = 0) {
    try {
      // Check if authenticated
      if (!this.isAuthenticated || !this.currentUser) {
        throw new Error('User not authenticated');
      }
      
      // Validate token
      await this.validateUserToken(this.currentUser);
      
      // Check session timeout
      if (this.isSessionExpired()) {
        throw new Error('Session has expired');
      }
      
      console.log('✅ Auth state validated for operation:', operation);
      return true;
      
    } catch (error) {
      console.error('❌ Auth state validation failed:', error);
      
      // Retry logic
      if (retryCount < this.config.maxRetries) {
        console.log(`🔄 Retrying auth validation (${retryCount + 1}/${this.config.maxRetries})...`);
        await this.delay(this.config.retryDelay * (retryCount + 1));
        return await this.validateAuthState(operation, retryCount + 1);
      }
      
      // Handle auth error
      await this.handleAuthError(error);
      throw error;
    }
  }

  async executeWithAuth(operation, operationFunction) {
    try {
      // Validate authentication
      await this.validateAuthState(operation);
      
      // Execute operation
      const result = await operationFunction();
      return result;
      
    } catch (error) {
      console.error(`❌ Operation failed: ${operation}`, error);
      
      // If auth error, queue operation for retry
      if (this.isAuthError(error)) {
        await this.queueOperation(operation, operationFunction);
        throw new Error(`Operation queued due to auth error: ${error.message}`);
      }
      
      throw error;
    }
  }

  async queueOperation(operation, operationFunction) {
    const operationId = `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.pendingOperations.set(operationId, {
      id: operationId,
      operation,
      function: operationFunction,
      timestamp: Date.now(),
      retryCount: 0
    });
    
    console.log(`📝 Operation queued: ${operation} (${operationId})`);
    return operationId;
  }

  async processPendingOperations() {
    if (this.pendingOperations.size === 0) return;
    
    console.log(`🔄 Processing ${this.pendingOperations.size} pending operations...`);
    
    const operations = Array.from(this.pendingOperations.values());
    
    for (const op of operations) {
      try {
        await this.executeWithAuth(op.operation, op.function);
        this.pendingOperations.delete(op.id);
        console.log(`✅ Pending operation completed: ${op.operation}`);
      } catch (error) {
        console.error(`❌ Pending operation failed: ${op.operation}`, error);
        op.retryCount++;
        
        if (op.retryCount >= this.config.maxRetries) {
          this.pendingOperations.delete(op.id);
          console.log(`❌ Pending operation permanently failed: ${op.operation}`);
        }
      }
    }
  }

  // ===== ERROR HANDLING =====

  async handleAuthError(error) {
    console.error('🔐 Authentication error:', error);
    
    // Determine error type
    if (this.isTokenExpiredError(error)) {
      this.showTokenExpiredError();
    } else if (this.isNetworkError(error)) {
      this.showNetworkError();
    } else if (this.isPermissionError(error)) {
      this.showPermissionError();
    } else {
      this.showGenericAuthError(error);
    }
    
    // Sign out user if critical error
    if (this.isCriticalAuthError(error)) {
      await signOut(auth);
    }
  }

  isAuthError(error) {
    const authErrorCodes = [
      'auth/user-not-found',
      'auth/wrong-password',
      'auth/invalid-email',
      'auth/user-disabled',
      'auth/too-many-requests',
      'auth/network-request-failed',
      'auth/requires-recent-login',
      'auth/invalid-credential',
      'auth/token-expired',
      'auth/invalid-token'
    ];
    
    return authErrorCodes.includes(error.code) || 
           error.message.includes('not authenticated') ||
           error.message.includes('Session has expired');
  }

  isTokenExpiredError(error) {
    return error.code === 'auth/token-expired' || 
           error.message.includes('Token has expired');
  }

  isNetworkError(error) {
    return error.code === 'auth/network-request-failed' ||
           error.message.includes('network');
  }

  isPermissionError(error) {
    return error.code === 'auth/requires-recent-login' ||
           error.message.includes('permission');
  }

  isCriticalAuthError(error) {
    const criticalErrors = [
      'auth/user-disabled',
      'auth/invalid-credential',
      'auth/token-expired',
      'auth/invalid-token'
    ];
    
    return criticalErrors.includes(error.code) ||
           error.message.includes('Session has expired');
  }

  isSessionExpired() {
    if (!this.config.enableSessionTimeout) return false;
    
    const timeSinceActivity = Date.now() - this.lastActivity;
    return timeSinceActivity > this.config.sessionTimeout;
  }

  // ===== UI FEEDBACK =====

  showSessionTimeoutWarning() {
    this.showNotification({
      type: 'warning',
      title: '⏰ Session Timeout',
      message: 'Your session has expired. Please sign in again.',
      duration: 10000,
      actions: [
        {
          text: 'Sign In',
          action: () => window.location.reload()
        }
      ]
    });
  }

  showTokenExpiredError() {
    this.showNotification({
      type: 'error',
      title: '🔐 Session Expired',
      message: 'Your session has expired. Please sign in again.',
      duration: 15000,
      actions: [
        {
          text: 'Sign In',
          action: () => window.location.reload()
        }
      ]
    });
  }

  showNetworkError() {
    this.showNotification({
      type: 'error',
      title: '🌐 Network Error',
      message: 'Unable to connect to the server. Please check your connection.',
      duration: 10000
    });
  }

  showPermissionError() {
    this.showNotification({
      type: 'error',
      title: '🚫 Permission Denied',
      message: 'You do not have permission to perform this action.',
      duration: 8000
    });
  }

  showGenericAuthError(error) {
    this.showNotification({
      type: 'error',
      title: '🔐 Authentication Error',
      message: `Authentication failed: ${error.message}`,
      duration: 10000
    });
  }

  showNotification({ type, title, message, duration = 5000, actions = [] }) {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm ${
      type === 'error' ? 'bg-red-500' :
      type === 'warning' ? 'bg-yellow-500' :
      type === 'info' ? 'bg-blue-500' :
      'bg-gray-500'
    } text-white`;
    
    let content = `
      <div class="font-bold">${title}</div>
      <div class="text-sm opacity-90 mt-1">${message}</div>
    `;
    
    if (actions.length > 0) {
      content += '<div class="mt-3 flex gap-2">';
      actions.forEach(action => {
        content += `
          <button 
            class="px-3 py-1 bg-white bg-opacity-20 rounded text-sm hover:bg-opacity-30 transition-colors"
            onclick="(${action.action.toString()})()"
          >
            ${action.text}
          </button>
        `;
      });
      content += '</div>';
    }
    
    content += `
      <button class="mt-2 text-sm underline" onclick="this.parentElement.remove()">Dismiss</button>
    `;
    
    notification.innerHTML = content;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, duration);
  }

  // ===== LISTENERS =====

  addAuthStateListener(callback) {
    this.authStateListeners.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.authStateListeners.delete(callback);
    };
  }

  notifyAuthStateChange(authState) {
    this.authStateListeners.forEach(callback => {
      try {
        callback(authState);
      } catch (error) {
        console.error('❌ Error in auth state listener:', error);
      }
    });
  }

  // ===== UTILITY METHODS =====

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ===== PUBLIC API =====

  getAuthState() {
    return {
      isAuthenticated: this.isAuthenticated,
      user: this.currentUser,
      isInitialized: this.isInitialized,
      lastActivity: this.lastActivity,
      pendingOperations: this.pendingOperations.size
    };
  }

  async requireAuth(operation, operationFunction) {
    return await this.executeWithAuth(operation, operationFunction);
  }

  isUserAuthenticated() {
    return this.isAuthenticated && !!this.currentUser;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getUserId() {
    return this.currentUser?.uid || null;
  }

  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    
    // Update session timeout if changed
    if (newConfig.sessionTimeout) {
      this.config.sessionTimeout = newConfig.sessionTimeout;
      this.resetSessionTimeout();
    }
    
    // Update token refresh if changed
    if (newConfig.tokenRefreshInterval) {
      this.config.tokenRefreshInterval = newConfig.tokenRefreshInterval;
      this.setupTokenRefresh();
    }
  }

  // ===== CLEANUP =====

  destroy() {
    this.clearSessionTimeout();
    this.clearTokenRefresh();
    this.authStateListeners.clear();
    this.pendingOperations.clear();
  }
}

export default AuthStateValidator;
