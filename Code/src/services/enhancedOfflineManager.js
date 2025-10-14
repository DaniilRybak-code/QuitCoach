/**
 * Enhanced Offline Manager
 * Integrates queue management, conflict resolution, and progress tracking
 */

import OfflineQueueManager from './offlineQueueManager.js';
import ConflictResolutionService from './conflictResolutionService.js';
import SyncProgressManager from './syncProgressManager.js';

class EnhancedOfflineManager {
  constructor() {
    this.isOnline = navigator.onLine;
    this.isInitialized = false;
    
    // Initialize core services
    this.queueManager = new OfflineQueueManager();
    this.conflictResolver = new ConflictResolutionService();
    this.progressManager = new SyncProgressManager();
    
    // Enhanced offline data storage
    this.offlineData = {
      userData: null,
      profileData: null,
      cachedStats: null,
      lastSyncTime: null
    };
    
    // Sync configuration
    this.syncConfig = {
      autoSync: true,
      syncInterval: 30000, // 30 seconds
      maxRetries: 3,
      conflictResolution: 'merge',
      batchSize: 10
    };
    
    this.init();
  }

  // ===== INITIALIZATION =====

  async init() {
    try {
      // Set up network listeners
      this.setupNetworkListeners();
      
      // Set up progress callbacks
      this.setupProgressCallbacks();
      
      // Load offline data
      await this.loadOfflineData();
      
      // Start auto-sync if enabled
      if (this.syncConfig.autoSync) {
        this.startAutoSync();
      }
      
      this.isInitialized = true;
      console.log('🚀 Enhanced Offline Manager initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Enhanced Offline Manager:', error);
    }
  }

  setupNetworkListeners() {
    window.addEventListener('online', () => {
      console.log('🌐 Network connection restored');
      this.isOnline = true;
      this.handleReconnection();
    });

    window.addEventListener('offline', () => {
      console.log('📡 Network connection lost');
      this.isOnline = false;
      this.updateOfflineStatus();
    });

    // Listen for visibility changes
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.isOnline) {
        this.attemptSync();
      }
    });
  }

  setupProgressCallbacks() {
    // Set up progress tracking
    this.progressManager.addProgressCallback((progress) => {
      this.updateProgressUI(progress);
    });

    this.progressManager.addStatusCallback((status) => {
      this.updateStatusUI(status);
    });
  }

  // ===== OFFLINE DATA MANAGEMENT =====

  async loadOfflineData() {
    try {
      // Load user data from localStorage as fallback
      this.offlineData.userData = JSON.parse(localStorage.getItem('offline_userData') || 'null');
      
      // Load profile data from localStorage as fallback
      this.offlineData.profileData = JSON.parse(localStorage.getItem('offline_profileData') || 'null');
      
      // Load cached stats from localStorage as fallback
      this.offlineData.cachedStats = JSON.parse(localStorage.getItem('offline_cachedStats') || 'null');
      
      // Load last sync time from localStorage as fallback
      this.offlineData.lastSyncTime = JSON.parse(localStorage.getItem('offline_lastSyncTime') || 'null');
      
      console.log('📱 Offline data loaded:', {
        userData: !!this.offlineData.userData,
        profileData: !!this.offlineData.profileData,
        cachedStats: !!this.offlineData.cachedStats,
        lastSyncTime: this.offlineData.lastSyncTime
      });
    } catch (error) {
      console.error('❌ Error loading offline data:', error);
    }
  }

  async cacheUserData(userData) {
    if (!userData) return;
    
    const essentialData = {
      profile: {
        uid: userData.uid,
        heroName: userData.heroName,
        archetype: userData.archetype,
        avatar: userData.avatar,
        quitDate: userData.quitDate,
        onboardingCompleted: userData.onboardingCompleted
      },
      stats: userData.stats || {},
      lastUpdated: Date.now()
    };

    await this.queueManager.storeData('userData', essentialData);
    this.offlineData.userData = essentialData;
  }

  async cacheProfileData(profileData) {
    if (!profileData) return;
    
    const essentialProfile = {
      dailyWater: profileData.dailyWater || 0,
      dailyMood: profileData.dailyMood || null,
      dailyBreathing: profileData.dailyBreathing || false,
      scheduledTriggers: profileData.scheduledTriggers || [],
      relapseDate: profileData.relapseDate || null,
      cravingsResisted: profileData.cravingsResisted || 0,
      lastUpdated: Date.now()
    };

    await this.queueManager.storeData('profileData', essentialProfile);
    this.offlineData.profileData = essentialProfile;
  }

  async cacheStats(stats) {
    if (!stats) return;
    
    const essentialStats = {
      streakDays: stats.streakDays || 0,
      cravingsResisted: stats.cravingsResisted || 0,
      addictionLevel: stats.addictionLevel || 50,
      mentalStrength: stats.mentalStrength || 50,
      lastUpdated: Date.now()
    };

    await this.queueManager.storeData('cachedStats', essentialStats);
    this.offlineData.cachedStats = essentialStats;
  }

  // ===== OPERATION QUEUING =====

  async queueBehavioralLog(userId, logType, logData, priority = 'normal') {
    try {
      const operationId = await this.queueManager.queueBehavioralLog(
        userId, 
        logType, 
        logData, 
        priority
      );
      
      console.log(`📝 Behavioral log queued: ${logType} (${operationId})`);
      return operationId;
    } catch (error) {
      console.error('❌ Error queuing behavioral log:', error);
      throw error;
    }
  }

  async queueFirestoreAction(userId, actionType, actionData, priority = 'normal') {
    try {
      const operationId = await this.queueManager.queueFirestoreAction(
        userId, 
        actionType, 
        actionData, 
        priority
      );
      
      console.log(`📝 Firestore action queued: ${actionType} (${operationId})`);
      return operationId;
    } catch (error) {
      console.error('❌ Error queuing Firestore action:', error);
      throw error;
    }
  }

  async queueCreate(collection, data, userId, priority = 'normal') {
    try {
      const operationId = await this.queueManager.queueCreate(
        collection, 
        data, 
        userId, 
        priority
      );
      
      console.log(`📝 Create operation queued: ${collection} (${operationId})`);
      return operationId;
    } catch (error) {
      console.error('❌ Error queuing create operation:', error);
      throw error;
    }
  }

  async queueUpdate(collection, docId, data, userId, priority = 'normal') {
    try {
      const operationId = await this.queueManager.queueUpdate(
        collection, 
        docId, 
        data, 
        userId, 
        priority
      );
      
      console.log(`📝 Update operation queued: ${collection}/${docId} (${operationId})`);
      return operationId;
    } catch (error) {
      console.error('❌ Error queuing update operation:', error);
      throw error;
    }
  }

  async queueDelete(collection, docId, userId, priority = 'normal') {
    try {
      const operationId = await this.queueManager.queueDelete(
        collection, 
        docId, 
        userId, 
        priority
      );
      
      console.log(`📝 Delete operation queued: ${collection}/${docId} (${operationId})`);
      return operationId;
    } catch (error) {
      console.error('❌ Error queuing delete operation:', error);
      throw error;
    }
  }

  // ===== SYNCHRONIZATION =====

  async attemptSync() {
    if (!this.isOnline || !this.isInitialized) {
      return;
    }

    try {
      const queueStatus = this.queueManager.getQueueStatus();
      
      if (queueStatus.queuedOperations === 0) {
        console.log('✅ No operations to sync');
        return;
      }

      console.log(`🔄 Starting sync with ${queueStatus.queuedOperations} operations`);
      
      // Start sync session
      const sessionId = this.progressManager.startSyncSession(
        queueStatus.queuedOperations,
        'auto'
      );

      // Perform sync with progress tracking
      const results = await this.performSyncWithProgress(sessionId);
      
      // Complete sync session
      this.progressManager.completeSyncSession(sessionId, results);
      
      // Update last sync time
      this.offlineData.lastSyncTime = Date.now();
      await this.queueManager.storeData('lastSyncTime', this.offlineData.lastSyncTime);
      
    } catch (error) {
      console.error('❌ Sync failed:', error);
      this.progressManager.failSyncSession(sessionId, error);
    }
  }

  async performSyncWithProgress(sessionId) {
    const results = {
      successful: 0,
      failed: 0,
      conflicts: 0,
      skipped: 0
    };

    try {
      // Get queued operations
      const queueDetails = await this.queueManager.getQueueDetails();
      const operations = queueDetails.queued;
      
      // Process operations in batches
      const batches = this.createBatches(operations, this.syncConfig.batchSize);
      
      for (const batch of batches) {
        const batchResults = await this.processBatch(sessionId, batch);
        
        // Aggregate results
        results.successful += batchResults.successful;
        results.failed += batchResults.failed;
        results.conflicts += batchResults.conflicts;
        results.skipped += batchResults.skipped;
      }
      
      return results;
    } catch (error) {
      console.error('❌ Error in sync progress:', error);
      throw error;
    }
  }

  createBatches(operations, batchSize) {
    const batches = [];
    for (let i = 0; i < operations.length; i += batchSize) {
      batches.push(operations.slice(i, i + batchSize));
    }
    return batches;
  }

  async processBatch(sessionId, batch) {
    const results = {
      successful: 0,
      failed: 0,
      conflicts: 0,
      skipped: 0
    };

    for (const operation of batch) {
      try {
        // Start operation tracking
        this.progressManager.startOperation(sessionId, operation);
        
        // Execute operation
        const result = await this.executeOperation(operation);
        
        if (result.success) {
          results.successful++;
          this.progressManager.completeOperation(sessionId, operation.id, result);
        } else if (result.conflict) {
          results.conflicts++;
          this.progressManager.conflictOperation(sessionId, operation.id, result.conflict);
        } else {
          results.failed++;
          this.progressManager.failOperation(sessionId, operation.id, result.error);
        }
      } catch (error) {
        results.failed++;
        this.progressManager.failOperation(sessionId, operation.id, error);
      }
    }

    return results;
  }

  async executeOperation(operation) {
    try {
      // Execute the operation using the queue manager
      const result = await this.queueManager.executeOperation(operation);
      
      if (result.success) {
        return { success: true, result };
      } else if (result.conflict) {
        // Handle conflict
        const resolution = await this.conflictResolver.resolveConflict(
          result.conflict, 
          this.syncConfig.conflictResolution
        );
        
        if (resolution.resolved) {
          // Apply resolution and retry
          operation.data = resolution.data;
          const retryResult = await this.queueManager.executeOperation(operation);
          return { success: retryResult.success, result: retryResult };
        } else {
          return { success: false, conflict: result.conflict };
        }
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error };
    }
  }

  // ===== AUTO-SYNC =====

  startAutoSync() {
    if (this.autoSyncInterval) {
      clearInterval(this.autoSyncInterval);
    }

    this.autoSyncInterval = setInterval(() => {
      if (this.isOnline) {
        this.attemptSync();
      }
    }, this.syncConfig.syncInterval);
  }

  stopAutoSync() {
    if (this.autoSyncInterval) {
      clearInterval(this.autoSyncInterval);
      this.autoSyncInterval = null;
    }
  }

  // ===== CONNECTION HANDLING =====

  async handleReconnection() {
    console.log('🔄 Handling reconnection...');
    
    // Wait for network to stabilize
    setTimeout(async () => {
      await this.attemptSync();
    }, 2000);
  }

  updateOfflineStatus() {
    // Update UI to show offline status
    const indicator = document.getElementById('offline-indicator');
    if (!indicator && !this.isOnline) {
      this.showOfflineIndicator();
    } else if (indicator && this.isOnline) {
      this.hideOfflineIndicator();
    }
  }

  showOfflineIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'offline-indicator';
    indicator.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2';
    
    const queueStatus = this.queueManager.getQueueStatus();
    indicator.innerHTML = `
      <span>📡</span>
      <span>You're offline - ${queueStatus.queuedOperations} action(s) queued</span>
    `;
    
    document.body.appendChild(indicator);
  }

  hideOfflineIndicator() {
    const indicator = document.getElementById('offline-indicator');
    if (indicator) {
      indicator.remove();
    }
  }

  // ===== UI UPDATES =====

  updateProgressUI(progress) {
    // Update progress UI elements
    const progressElements = document.querySelectorAll('.sync-progress');
    progressElements.forEach(element => {
      element.style.width = `${progress.progress}%`;
      element.textContent = `${progress.progress}%`;
    });
  }

  updateStatusUI(status) {
    // Update status UI elements
    const statusElements = document.querySelectorAll('.sync-status');
    statusElements.forEach(element => {
      element.textContent = status.status;
      element.className = `sync-status ${status.status}`;
    });
  }

  // ===== CONFIGURATION =====

  updateSyncConfig(newConfig) {
    this.syncConfig = { ...this.syncConfig, ...newConfig };
    
    // Restart auto-sync if interval changed
    if (newConfig.syncInterval) {
      this.stopAutoSync();
      if (this.syncConfig.autoSync) {
        this.startAutoSync();
      }
    }
  }

  // ===== PUBLIC API =====

  getStatus() {
    const queueStatus = this.queueManager.getQueueStatus();
    const syncStats = this.progressManager.getSyncStatistics();
    
    return {
      isOnline: this.isOnline,
      isInitialized: this.isInitialized,
      queue: queueStatus,
      sync: syncStats,
      config: this.syncConfig
    };
  }

  async getQueueDetails() {
    return await this.queueManager.getQueueDetails();
  }

  async retryFailedOperations() {
    await this.queueManager.retryFailedOperations();
    if (this.isOnline) {
      await this.attemptSync();
    }
  }

  async clearAllQueues() {
    await this.queueManager.clearAllQueues();
  }

  async getConflictHistory() {
    return await this.conflictResolver.getConflictHistory();
  }

  async getConflictStatistics() {
    return await this.conflictResolver.getConflictStatistics();
  }

  // ===== CLEANUP =====

  destroy() {
    this.stopAutoSync();
    this.progressManager.destroy();
    this.queueManager = null;
    this.conflictResolver = null;
    this.progressManager = null;
  }
}

export default EnhancedOfflineManager;
