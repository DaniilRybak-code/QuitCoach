/**
 * Session Manager
 * Handles user sessions, timeouts, and session-related UI feedback
 */

import { auth } from './firebase.js';
import { signOut, onAuthStateChanged } from 'firebase/auth';

class SessionManager {
  constructor() {
    this.sessionTimeout = null;
    this.warningTimeout = null;
    this.activityTimeout = null;
    this.lastActivity = Date.now();
    this.sessionStartTime = null;
    this.isSessionActive = false;
    this.warningShown = false;
    
    // Configuration
    this.config = {
      sessionTimeoutDuration: 30 * 60 * 1000, // 30 minutes
      warningDuration: 5 * 60 * 1000, // 5 minutes before timeout
      activityTimeoutDuration: 15 * 60 * 1000, // 15 minutes of inactivity
      enableActivityTracking: true,
      enableSessionTimeout: true,
      enableWarning: true,
      autoLogout: true
    };
    
    this.init();
  }

  // ===== INITIALIZATION =====

  init() {
    console.log('🕐 Initializing SessionManager...');
    
    // Set up authentication state listener
    this.setupAuthStateListener();
    
    // Set up activity tracking
    this.setupActivityTracking();
    
    // Set up visibility change handling
    this.setupVisibilityChangeHandler();
    
    console.log('✅ SessionManager initialized');
  }

  setupAuthStateListener() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.startSession(user);
      } else {
        this.endSession();
      }
    });
  }

  setupActivityTracking() {
    if (!this.config.enableActivityTracking) return;
    
    const activityEvents = [
      'mousedown', 'mousemove', 'keypress', 'keydown', 
      'scroll', 'touchstart', 'click', 'focus'
    ];
    
    const updateActivity = () => {
      this.lastActivity = Date.now();
      this.resetActivityTimeout();
      
      if (this.isSessionActive) {
        this.resetSessionTimeout();
      }
    };
    
    activityEvents.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });
    
    // Track page visibility
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        updateActivity();
      }
    });
  }

  setupVisibilityChangeHandler() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.handlePageHidden();
      } else {
        this.handlePageVisible();
      }
    });
  }

  // ===== SESSION MANAGEMENT =====

  startSession(user) {
    console.log('🕐 Starting session for user:', user.uid);
    
    this.sessionStartTime = Date.now();
    this.isSessionActive = true;
    this.lastActivity = Date.now();
    this.warningShown = false;
    
    // Set up session timeout
    this.setupSessionTimeout();
    
    // Set up activity timeout
    this.setupActivityTimeout();
    
    // Show session started notification
    this.showSessionStartedNotification();
  }

  endSession() {
    console.log('🕐 Ending session');
    
    this.isSessionActive = false;
    this.sessionStartTime = null;
    this.warningShown = false;
    
    // Clear all timeouts
    this.clearSessionTimeout();
    this.clearWarningTimeout();
    this.clearActivityTimeout();
    
    // Show session ended notification
    this.showSessionEndedNotification();
  }

  setupSessionTimeout() {
    if (!this.config.enableSessionTimeout) return;
    
    this.clearSessionTimeout();
    
    this.sessionTimeout = setTimeout(() => {
      this.handleSessionTimeout();
    }, this.config.sessionTimeoutDuration);
    
    // Set up warning timeout
    if (this.config.enableWarning) {
      this.warningTimeout = setTimeout(() => {
        this.showSessionWarning();
      }, this.config.sessionTimeoutDuration - this.config.warningDuration);
    }
  }

  setupActivityTimeout() {
    if (!this.config.enableActivityTracking) return;
    
    this.clearActivityTimeout();
    
    this.activityTimeout = setTimeout(() => {
      this.handleActivityTimeout();
    }, this.config.activityTimeoutDuration);
  }

  resetSessionTimeout() {
    if (!this.isSessionActive) return;
    
    this.clearSessionTimeout();
    this.setupSessionTimeout();
  }

  resetActivityTimeout() {
    if (!this.isSessionActive) return;
    
    this.clearActivityTimeout();
    this.setupActivityTimeout();
  }

  clearSessionTimeout() {
    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout);
      this.sessionTimeout = null;
    }
    
    if (this.warningTimeout) {
      clearTimeout(this.warningTimeout);
      this.warningTimeout = null;
    }
  }

  clearActivityTimeout() {
    if (this.activityTimeout) {
      clearTimeout(this.activityTimeout);
      this.activityTimeout = null;
    }
  }

  clearWarningTimeout() {
    if (this.warningTimeout) {
      clearTimeout(this.warningTimeout);
      this.warningTimeout = null;
    }
  }

  // ===== SESSION EVENTS =====

  handleSessionTimeout() {
    console.log('⏰ Session timeout reached');
    
    if (this.config.autoLogout) {
      this.showSessionTimeoutNotification();
      
      // Sign out user after a short delay
      setTimeout(async () => {
        try {
          await signOut(auth);
        } catch (error) {
          console.error('❌ Error signing out:', error);
        }
      }, 3000);
    } else {
      this.showSessionTimeoutWarning();
    }
  }

  handleActivityTimeout() {
    console.log('⏰ Activity timeout reached');
    
    this.showInactivityWarning();
  }

  handlePageHidden() {
    console.log('👁️ Page hidden');
    
    // Pause session timeout when page is hidden
    this.pauseSessionTimeout();
  }

  handlePageVisible() {
    console.log('👁️ Page visible');
    
    // Resume session timeout when page becomes visible
    this.resumeSessionTimeout();
  }

  pauseSessionTimeout() {
    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout);
      this.sessionTimeout = null;
    }
  }

  resumeSessionTimeout() {
    if (this.isSessionActive) {
      this.setupSessionTimeout();
    }
  }

  // ===== UI NOTIFICATIONS =====

  showSessionStartedNotification() {
    this.showNotification({
      type: 'success',
      title: '🕐 Session Started',
      message: 'You are now logged in and your session is active.',
      duration: 3000
    });
  }

  showSessionEndedNotification() {
    this.showNotification({
      type: 'info',
      title: '👋 Session Ended',
      message: 'You have been logged out.',
      duration: 3000
    });
  }

  showSessionWarning() {
    if (this.warningShown) return;
    
    this.warningShown = true;
    
    const warningMinutes = Math.floor(this.config.warningDuration / 60000);
    
    this.showNotification({
      type: 'warning',
      title: '⏰ Session Warning',
      message: `Your session will expire in ${warningMinutes} minutes. Please save your work.`,
      duration: 10000,
      actions: [
        {
          text: 'Extend Session',
          action: () => this.extendSession()
        }
      ]
    });
  }

  showSessionTimeoutNotification() {
    this.showNotification({
      type: 'error',
      title: '⏰ Session Expired',
      message: 'Your session has expired. You will be logged out automatically.',
      duration: 0, // Persistent until dismissed
      actions: [
        {
          text: 'Stay Logged In',
          action: () => this.extendSession()
        }
      ]
    });
  }

  showSessionTimeoutWarning() {
    this.showNotification({
      type: 'warning',
      title: '⏰ Session Expired',
      message: 'Your session has expired. Please refresh the page to continue.',
      duration: 15000,
      actions: [
        {
          text: 'Refresh Page',
          action: () => window.location.reload()
        }
      ]
    });
  }

  showInactivityWarning() {
    this.showNotification({
      type: 'info',
      title: '😴 Inactive Session',
      message: 'You have been inactive for a while. Your session will timeout soon.',
      duration: 8000,
      actions: [
        {
          text: 'Stay Active',
          action: () => this.resetActivityTimeout()
        }
      ]
    });
  }

  showNotification({ type, title, message, duration = 5000, actions = [] }) {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm ${
      type === 'success' ? 'bg-green-500' :
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
    
    if (duration > 0) {
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, duration);
    }
  }

  // ===== SESSION ACTIONS =====

  extendSession() {
    console.log('🕐 Extending session');
    
    this.warningShown = false;
    this.resetSessionTimeout();
    this.resetActivityTimeout();
    
    this.showNotification({
      type: 'success',
      title: '✅ Session Extended',
      message: 'Your session has been extended.',
      duration: 3000
    });
  }

  async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('❌ Error during logout:', error);
    }
  }

  // ===== SESSION INFO =====

  getSessionInfo() {
    if (!this.isSessionActive) {
      return {
        isActive: false,
        startTime: null,
        duration: 0,
        lastActivity: null,
        timeUntilTimeout: 0,
        timeUntilWarning: 0
      };
    }
    
    const now = Date.now();
    const duration = now - this.sessionStartTime;
    const timeSinceActivity = now - this.lastActivity;
    const timeUntilTimeout = this.config.sessionTimeoutDuration - timeSinceActivity;
    const timeUntilWarning = timeUntilTimeout - this.config.warningDuration;
    
    return {
      isActive: this.isSessionActive,
      startTime: this.sessionStartTime,
      duration: Math.floor(duration / 1000), // seconds
      lastActivity: this.lastActivity,
      timeUntilTimeout: Math.max(0, Math.floor(timeUntilTimeout / 1000)),
      timeUntilWarning: Math.max(0, Math.floor(timeUntilWarning / 1000))
    };
  }

  getSessionDuration() {
    if (!this.isSessionActive || !this.sessionStartTime) {
      return 0;
    }
    
    return Math.floor((Date.now() - this.sessionStartTime) / 1000);
  }

  getTimeUntilTimeout() {
    if (!this.isSessionActive) {
      return 0;
    }
    
    const timeSinceActivity = Date.now() - this.lastActivity;
    return Math.max(0, this.config.sessionTimeoutDuration - timeSinceActivity);
  }

  // ===== CONFIGURATION =====

  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    
    // Update timeouts if durations changed
    if (this.isSessionActive) {
      this.resetSessionTimeout();
      this.resetActivityTimeout();
    }
  }

  // ===== CLEANUP =====

  destroy() {
    this.clearSessionTimeout();
    this.clearWarningTimeout();
    this.clearActivityTimeout();
  }
}

export default SessionManager;
