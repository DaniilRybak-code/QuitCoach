/**
 * Sync Progress Manager
 * Provides detailed user feedback about synchronization progress and status
 */

class SyncProgressManager {
  constructor() {
    this.syncSessions = new Map();
    this.currentSession = null;
    this.progressCallbacks = new Set();
    this.statusCallbacks = new Set();
    
    // Sync status constants
    this.STATUS = {
      IDLE: 'idle',
      CONNECTING: 'connecting',
      SYNCING: 'syncing',
      COMPLETED: 'completed',
      FAILED: 'failed',
      PAUSED: 'paused'
    };
    
    // Progress update intervals
    this.PROGRESS_UPDATE_INTERVAL = 100; // ms
    this.STATUS_UPDATE_INTERVAL = 1000; // ms
    
    this.init();
  }

  init() {
    // Set up periodic updates
    this.progressInterval = setInterval(() => {
      this.updateProgress();
    }, this.PROGRESS_UPDATE_INTERVAL);
    
    this.statusInterval = setInterval(() => {
      this.updateStatus();
    }, this.STATUS_UPDATE_INTERVAL);
  }

  // ===== SYNC SESSION MANAGEMENT =====

  startSyncSession(operationCount, sessionType = 'manual') {
    const sessionId = this.generateSessionId();
    const session = {
      id: sessionId,
      type: sessionType,
      startTime: Date.now(),
      endTime: null,
      status: this.STATUS.CONNECTING,
      totalOperations: operationCount,
      completedOperations: 0,
      failedOperations: 0,
      conflictedOperations: 0,
      skippedOperations: 0,
      currentOperation: null,
      progress: 0,
      estimatedTimeRemaining: null,
      operations: [],
      errors: [],
      conflicts: []
    };

    this.syncSessions.set(sessionId, session);
    this.currentSession = session;
    
    console.log(`🔄 Started sync session ${sessionId} with ${operationCount} operations`);
    
    this.notifyStatusChange(session);
    return sessionId;
  }

  updateSyncProgress(sessionId, update) {
    const session = this.syncSessions.get(sessionId);
    if (!session) return;

    // Update session data
    Object.assign(session, update);
    
    // Calculate progress percentage
    if (session.totalOperations > 0) {
      session.progress = Math.round(
        (session.completedOperations / session.totalOperations) * 100
      );
    }

    // Calculate estimated time remaining
    if (session.completedOperations > 0) {
      const elapsed = Date.now() - session.startTime;
      const avgTimePerOp = elapsed / session.completedOperations;
      const remainingOps = session.totalOperations - session.completedOperations;
      session.estimatedTimeRemaining = Math.round(avgTimePerOp * remainingOps);
    }

    this.notifyProgressChange(session);
  }

  completeSyncSession(sessionId, results) {
    const session = this.syncSessions.get(sessionId);
    if (!session) return;

    session.endTime = Date.now();
    session.status = results.success ? this.STATUS.COMPLETED : this.STATUS.FAILED;
    session.progress = 100;
    session.estimatedTimeRemaining = 0;

    // Store results
    Object.assign(session, results);

    console.log(`✅ Completed sync session ${sessionId}:`, results);
    
    this.notifyStatusChange(session);
    this.showSyncResults(session);
    
    // Clean up old sessions after a delay
    setTimeout(() => {
      this.cleanupOldSessions();
    }, 30000);
  }

  failSyncSession(sessionId, error) {
    const session = this.syncSessions.get(sessionId);
    if (!session) return;

    session.endTime = Date.now();
    session.status = this.STATUS.FAILED;
    session.errors.push({
      message: error.message,
      timestamp: Date.now(),
      operation: session.currentOperation
    });

    console.error(`❌ Failed sync session ${sessionId}:`, error);
    
    this.notifyStatusChange(session);
    this.showSyncError(session, error);
  }

  // ===== OPERATION TRACKING =====

  startOperation(sessionId, operation) {
    const session = this.syncSessions.get(sessionId);
    if (!session) return;

    session.currentOperation = {
      id: operation.id,
      type: operation.type,
      startTime: Date.now(),
      status: 'processing'
    };

    this.notifyStatusChange(session);
  }

  completeOperation(sessionId, operationId, result) {
    const session = this.syncSessions.get(sessionId);
    if (!session) return;

    if (session.currentOperation && session.currentOperation.id === operationId) {
      session.currentOperation.endTime = Date.now();
      session.currentOperation.status = 'completed';
      session.currentOperation.result = result;
      
      session.completedOperations++;
      session.operations.push(session.currentOperation);
    }

    this.updateSyncProgress(sessionId, {});
  }

  failOperation(sessionId, operationId, error) {
    const session = this.syncSessions.get(sessionId);
    if (!session) return;

    if (session.currentOperation && session.currentOperation.id === operationId) {
      session.currentOperation.endTime = Date.now();
      session.currentOperation.status = 'failed';
      session.currentOperation.error = error;
      
      session.failedOperations++;
      session.operations.push(session.currentOperation);
      session.errors.push({
        message: error.message,
        timestamp: Date.now(),
        operation: session.currentOperation
      });
    }

    this.updateSyncProgress(sessionId, {});
  }

  conflictOperation(sessionId, operationId, conflict) {
    const session = this.syncSessions.get(sessionId);
    if (!session) return;

    if (session.currentOperation && session.currentOperation.id === operationId) {
      session.currentOperation.endTime = Date.now();
      session.currentOperation.status = 'conflicted';
      session.currentOperation.conflict = conflict;
      
      session.conflictedOperations++;
      session.operations.push(session.currentOperation);
      session.conflicts.push({
        operationId,
        conflict,
        timestamp: Date.now()
      });
    }

    this.updateSyncProgress(sessionId, {});
  }

  // ===== PROGRESS NOTIFICATIONS =====

  addProgressCallback(callback) {
    this.progressCallbacks.add(callback);
  }

  removeProgressCallback(callback) {
    this.progressCallbacks.delete(callback);
  }

  addStatusCallback(callback) {
    this.statusCallbacks.add(callback);
  }

  removeStatusCallback(callback) {
    this.statusCallbacks.delete(callback);
  }

  notifyProgressChange(session) {
    this.progressCallbacks.forEach(callback => {
      try {
        callback({
          sessionId: session.id,
          progress: session.progress,
          completed: session.completedOperations,
          total: session.totalOperations,
          estimatedTimeRemaining: session.estimatedTimeRemaining,
          currentOperation: session.currentOperation
        });
      } catch (error) {
        console.error('Error in progress callback:', error);
      }
    });
  }

  notifyStatusChange(session) {
    this.statusCallbacks.forEach(callback => {
      try {
        callback({
          sessionId: session.id,
          status: session.status,
          startTime: session.startTime,
          endTime: session.endTime,
          totalOperations: session.totalOperations,
          completedOperations: session.completedOperations,
          failedOperations: session.failedOperations,
          conflictedOperations: session.conflictedOperations
        });
      } catch (error) {
        console.error('Error in status callback:', error);
      }
    });
  }

  // ===== UI NOTIFICATIONS =====

  showSyncResults(session) {
    const duration = session.endTime - session.startTime;
    const successRate = session.totalOperations > 0 
      ? Math.round((session.completedOperations / session.totalOperations) * 100)
      : 0;

    let notificationType = 'success';
    let title = '✅ Sync Complete';
    let message = `${session.completedOperations} of ${session.totalOperations} operations synced successfully`;

    if (session.failedOperations > 0) {
      notificationType = 'warning';
      title = '⚠️ Sync Complete with Issues';
      message += ` (${session.failedOperations} failed)`;
    }

    if (session.conflictedOperations > 0) {
      message += ` (${session.conflictedOperations} conflicts)`;
    }

    this.showNotification({
      type: notificationType,
      title,
      message,
      duration: 8000,
      details: {
        duration: this.formatDuration(duration),
        successRate: `${successRate}%`,
        operations: {
          completed: session.completedOperations,
          failed: session.failedOperations,
          conflicted: session.conflictedOperations,
          total: session.totalOperations
        }
      }
    });
  }

  showSyncError(session, error) {
    this.showNotification({
      type: 'error',
      title: '❌ Sync Failed',
      message: `Sync failed: ${error.message}`,
      duration: 10000,
      details: {
        sessionId: session.id,
        error: error.message,
        operations: {
          completed: session.completedOperations,
          failed: session.failedOperations,
          total: session.totalOperations
        }
      }
    });
  }

  showSyncProgress(session) {
    if (session.status !== this.STATUS.SYNCING) return;

    const progress = session.progress || 0;
    const currentOp = session.currentOperation;
    const eta = session.estimatedTimeRemaining;

    let message = `Syncing... ${progress}%`;
    if (currentOp) {
      message += ` (${currentOp.type})`;
    }
    if (eta) {
      message += ` - ${this.formatDuration(eta)} remaining`;
    }

    this.showNotification({
      type: 'info',
      title: '🔄 Syncing Data',
      message,
      duration: 0, // Persistent until sync completes
      progress: progress,
      showProgress: true
    });
  }

  showNotification({ type, title, message, duration = 5000, details = null, progress = null, showProgress = false }) {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm ${
      type === 'success' ? 'bg-green-500' :
      type === 'error' ? 'bg-red-500' :
      type === 'warning' ? 'bg-yellow-500' :
      'bg-blue-500'
    } text-white`;

    let content = `
      <div class="font-bold">${title}</div>
      <div class="text-sm opacity-90 mt-1">${message}</div>
    `;

    if (showProgress && progress !== null) {
      content += `
        <div class="mt-2 bg-white bg-opacity-20 rounded-full h-2">
          <div class="bg-white h-2 rounded-full transition-all duration-300" style="width: ${progress}%"></div>
        </div>
      `;
    }

    if (details) {
      content += `
        <div class="mt-2 text-xs opacity-75">
          ${details.duration ? `Duration: ${details.duration}` : ''}
          ${details.successRate ? ` | Success: ${details.successRate}` : ''}
        </div>
      `;
    }

    content += `
      <button class="mt-2 text-sm underline" onclick="this.parentElement.remove()">Dismiss</button>
    `;

    notification.innerHTML = content;
    notification.id = `sync-notification-${Date.now()}`;
    
    document.body.appendChild(notification);
    
    if (duration > 0) {
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, duration);
    }

    return notification;
  }

  // ===== PROGRESS UPDATES =====

  updateProgress() {
    if (!this.currentSession || this.currentSession.status !== this.STATUS.SYNCING) {
      return;
    }

    this.showSyncProgress(this.currentSession);
  }

  updateStatus() {
    // Update any active sync sessions
    this.syncSessions.forEach(session => {
      if (session.status === this.STATUS.SYNCING) {
        this.notifyStatusChange(session);
      }
    });
  }

  // ===== UTILITY METHODS =====

  generateSessionId() {
    return `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  formatDuration(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }

  cleanupOldSessions() {
    const cutoffTime = Date.now() - (24 * 60 * 60 * 1000); // 24 hours ago
    
    this.syncSessions.forEach((session, sessionId) => {
      if (session.endTime && session.endTime < cutoffTime) {
        this.syncSessions.delete(sessionId);
      }
    });
  }

  // ===== PUBLIC API =====

  getCurrentSession() {
    return this.currentSession;
  }

  getSession(sessionId) {
    return this.syncSessions.get(sessionId);
  }

  getAllSessions() {
    return Array.from(this.syncSessions.values());
  }

  getSyncStatistics() {
    const sessions = this.getAllSessions();
    const completedSessions = sessions.filter(s => s.status === this.STATUS.COMPLETED);
    const failedSessions = sessions.filter(s => s.status === this.STATUS.FAILED);

    const totalOperations = sessions.reduce((sum, s) => sum + s.totalOperations, 0);
    const completedOperations = sessions.reduce((sum, s) => sum + s.completedOperations, 0);
    const failedOperations = sessions.reduce((sum, s) => sum + s.failedOperations, 0);

    return {
      totalSessions: sessions.length,
      completedSessions: completedSessions.length,
      failedSessions: failedSessions.length,
      totalOperations,
      completedOperations,
      failedOperations,
      successRate: totalOperations > 0 ? Math.round((completedOperations / totalOperations) * 100) : 0,
      averageSessionDuration: completedSessions.length > 0 
        ? completedSessions.reduce((sum, s) => sum + (s.endTime - s.startTime), 0) / completedSessions.length
        : 0
    };
  }

  // ===== CLEANUP =====

  destroy() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
    
    if (this.statusInterval) {
      clearInterval(this.statusInterval);
    }
    
    this.progressCallbacks.clear();
    this.statusCallbacks.clear();
    this.syncSessions.clear();
  }
}

export default SyncProgressManager;
