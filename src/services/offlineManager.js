// Offline Manager Service
// Handles offline data storage, action queuing, and synchronization

class OfflineManager {
  constructor() {
    this.isOnline = navigator.onLine;
    this.syncQueue = [];
    this.offlineData = {};
    this.lastSyncTime = null;
    
    // Initialize offline storage
    this.initOfflineStorage();
    
    // Set up network listeners
    this.setupNetworkListeners();
    
    // Load existing offline data
    this.loadOfflineData();
  }

  // ===== INITIALIZATION =====

  initOfflineStorage() {
    // Check if IndexedDB is available, fallback to localStorage
    if (window.indexedDB) {
      this.storageType = 'indexedDB';
      this.initIndexedDB();
    } else {
      this.storageType = 'localStorage';
      console.log('IndexedDB not available, using localStorage for offline storage');
    }
  }

  initIndexedDB() {
    const request = indexedDB.open('QuitCoachOffline', 1);
    
    request.onerror = () => {
      console.warn('IndexedDB failed, falling back to localStorage');
      this.storageType = 'localStorage';
    };

    request.onsuccess = (event) => {
      this.db = event.target.result;
      console.log('IndexedDB initialized for offline storage');
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create object stores for different data types
      if (!db.objectStoreNames.contains('userData')) {
        db.createObjectStore('userData', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('offlineActions')) {
        db.createObjectStore('offlineActions', { keyPath: 'timestamp' });
      }
      if (!db.objectStoreNames.contains('syncQueue')) {
        db.createObjectStore('syncQueue', { keyPath: 'id' });
      }
    };
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

    // Also listen for visibility changes to detect when app becomes visible
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.isOnline) {
        this.checkForPendingSync();
      }
    });
  }

  // ===== OFFLINE STORAGE OPERATIONS =====

  async storeData(key, data) {
    try {
      if (this.storageType === 'indexedDB' && this.db) {
        const transaction = this.db.transaction(['userData'], 'readwrite');
        const store = transaction.objectStore('userData');
        await store.put({ id: key, data, timestamp: Date.now() });
      } else {
        localStorage.setItem(`offline_${key}`, JSON.stringify({
          data,
          timestamp: Date.now()
        }));
      }
      console.log(`✅ Data stored offline: ${key}`);
    } catch (error) {
      console.error('Error storing offline data:', error);
    }
  }

  async getData(key) {
    try {
      if (this.storageType === 'indexedDB' && this.db) {
        const transaction = this.db.transaction(['userData'], 'readonly');
        const store = transaction.objectStore('userData');
        const request = store.get(key);
        
        return new Promise((resolve, reject) => {
          request.onsuccess = () => {
            resolve(request.result?.data || null);
          };
          request.onerror = () => reject(request.error);
        });
      } else {
        const stored = localStorage.getItem(`offline_${key}`);
        return stored ? JSON.parse(stored).data : null;
      }
    } catch (error) {
      console.error('Error retrieving offline data:', error);
      return null;
    }
  }

  async removeData(key) {
    try {
      if (this.storageType === 'indexedDB' && this.db) {
        const transaction = this.db.transaction(['userData'], 'readwrite');
        const store = transaction.objectStore('userData');
        await store.delete(key);
      } else {
        localStorage.removeItem(`offline_${key}`);
      }
    } catch (error) {
      console.error('Error removing offline data:', error);
    }
  }

  // ===== OFFLINE ACTION QUEUING =====

  async queueOfflineAction(action) {
    const queuedAction = {
      id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      action,
      timestamp: Date.now(),
      retryCount: 0,
      maxRetries: 3
    };

    try {
      if (this.storageType === 'indexedDB' && this.db) {
        const transaction = this.db.transaction(['syncQueue'], 'readwrite');
        const store = transaction.objectStore('syncQueue');
        await store.add(queuedAction);
      } else {
        const existingQueue = JSON.parse(localStorage.getItem('offline_syncQueue') || '[]');
        existingQueue.push(queuedAction);
        localStorage.setItem('offline_syncQueue', JSON.stringify(existingQueue));
      }

      this.syncQueue.push(queuedAction);
      console.log(`📝 Action queued for sync: ${action.type}`);
      
      // Show offline indicator
      this.showOfflineIndicator();
      
      return queuedAction.id;
    } catch (error) {
      console.error('Error queuing offline action:', error);
      return null;
    }
  }

  async getQueuedActions() {
    try {
      if (this.storageType === 'indexedDB' && this.db) {
        const transaction = this.db.transaction(['syncQueue'], 'readonly');
        const store = transaction.objectStore('syncQueue');
        const request = store.getAll();
        
        return new Promise((resolve, reject) => {
          request.onsuccess = () => {
            resolve(request.result || []);
          };
          request.onerror = () => reject(request.error);
        });
      } else {
        return JSON.parse(localStorage.getItem('offline_syncQueue') || '[]');
      }
    } catch (error) {
      console.error('Error getting queued actions:', error);
      return [];
    }
  }

  // Get count of queued actions
  async getQueuedActionsCount() {
    try {
      const actions = await this.getQueuedActions();
      return actions.length;
    } catch (error) {
      console.error('Error getting queued actions count:', error);
      return 0;
    }
  }

  async removeQueuedAction(actionId) {
    try {
      if (this.storageType === 'indexedDB' && this.db) {
        const transaction = this.db.transaction(['syncQueue'], 'readwrite');
        const store = transaction.objectStore('syncQueue');
        await store.delete(actionId);
      } else {
        const existingQueue = JSON.parse(localStorage.getItem('offline_syncQueue') || '[]');
        const filteredQueue = existingQueue.filter(action => action.id !== actionId);
        localStorage.setItem('offline_syncQueue', JSON.stringify(filteredQueue));
      }

      this.syncQueue = this.syncQueue.filter(action => action.id !== actionId);
    } catch (error) {
      console.error('Error removing queued action:', error);
    }
  }

  // ===== CORE DATA CACHING =====

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

    await this.storeData('userData', essentialData);
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

    await this.storeData('profileData', essentialProfile);
    this.offlineData.profileData = essentialProfile;
  }

  async getCachedUserData() {
    if (!this.offlineData.userData) {
      this.offlineData.userData = await this.getData('userData');
    }
    return this.offlineData.userData;
  }

  async getCachedProfileData() {
    if (!this.offlineData.profileData) {
      this.offlineData.profileData = await this.getData('profileData');
    }
    return this.offlineData.profileData;
  }

  // ===== OFFLINE FUNCTIONALITY =====

  async handleOfflineAction(action) {
    if (this.isOnline) {
      // If online, try to execute immediately
      return await this.executeAction(action);
    } else {
      // If offline, queue for later sync
      return await this.queueOfflineAction(action);
    }
  }

  // ===== BEHAVIORAL LOGGING OFFLINE SUPPORT =====

  async handleOfflineBehavioralLog(logType, logData) {
    const action = {
      type: 'BEHAVIORAL_LOG',
      logType,
      logData,
      timestamp: Date.now(),
      userId: logData.userId || 'unknown'
    };

    if (this.isOnline) {
      // If online, try to log immediately
      return await this.executeBehavioralLog(action);
    } else {
      // If offline, queue for later sync
      const actionId = await this.queueOfflineAction(action);
      this.showOfflineSaveNotification(logType);
      return actionId;
    }
  }

  async executeBehavioralLog(action) {
    try {
      // Send to service worker for queuing if online but Firestore fails
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'QUEUE_BEHAVIORAL_LOG',
          data: action
        });
      }
      
      console.log(`✅ Behavioral log executed: ${action.logType}`);
      return true;
    } catch (error) {
      console.error('Error executing behavioral log:', error);
      // Queue for offline sync if execution fails
      await this.queueOfflineAction(action);
      return false;
    }
  }

  async handleOfflineFirestoreAction(actionType, actionData) {
    const action = {
      type: 'FIRESTORE_ACTION',
      actionType,
      actionData,
      timestamp: Date.now(),
      userId: actionData.userId || 'unknown'
    };

    if (this.isOnline) {
      // If online, try to execute immediately
      return await this.executeFirestoreAction(action);
    } else {
      // If offline, queue for later sync
      const actionId = await this.queueOfflineAction(action);
      this.showOfflineSaveNotification(actionType);
      return actionId;
    }
  }

  async executeFirestoreAction(action) {
    try {
      // Send to service worker for queuing if online but Firestore fails
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'QUEUE_FIRESTORE_ACTION',
          data: action
        });
      }
      
      console.log(`✅ Firestore action executed: ${action.actionType}`);
      return true;
    } catch (error) {
      console.error('Error executing Firestore action:', error);
      // Queue for offline sync if execution fails
      await this.queueOfflineAction(action);
      return false;
    }
  }

  async executeAction(action) {
    try {
      const { ref, set, push } = await import('firebase/database');
      
      switch (action.type) {
        case 'UPDATE_STATS':
          const statsRef = ref(window.db, `users/${action.userId}/stats`);
          await set(statsRef, action.data);
          break;
          
        case 'UPDATE_PROFILE':
          const profileRef = ref(window.db, `users/${action.userId}/profile`);
          await set(profileRef, action.data);
          break;
          
        case 'TRACK_HABIT':
          const habitRef = ref(window.db, `users/${action.userId}/profile/daily/${action.date}/${action.habitType}`);
          await set(habitRef, action.value);
          break;
          
        case 'RESIST_CRAVING':
          const cravingRef = ref(window.db, `users/${action.userId}/profile/cravingsResisted`);
          await set(cravingRef, action.count);
          break;
          
        default:
          console.warn('Unknown action type:', action.type);
          return false;
      }
      
      console.log(`✅ Action executed successfully: ${action.type}`);
      return true;
    } catch (error) {
      console.error('Error executing action:', error);
      return false;
    }
  }

  // ===== SYNCHRONIZATION =====

  async handleReconnection() {
    console.log('🔄 Handling reconnection...');
    
    // Update UI to show online status
    this.hideOfflineIndicator();
    
    // Wait a moment for network to stabilize
    setTimeout(async () => {
      await this.syncOfflineActions();
      await this.refreshOnlineData();
    }, 2000);
  }

  async syncOfflineActions() {
    console.log('🔄 Syncing offline actions...');
    
    const queuedActions = await this.getQueuedActions();
    if (queuedActions.length === 0) {
      console.log('✅ No offline actions to sync');
      return;
    }

    let successCount = 0;
    let failureCount = 0;

    for (const action of queuedActions) {
      try {
        const success = await this.executeAction(action.action);
        if (success) {
          await this.removeQueuedAction(action.id);
          successCount++;
        } else {
          action.retryCount++;
          if (action.retryCount >= action.maxRetries) {
            console.warn(`Action failed after ${action.maxRetries} retries:`, action);
            await this.removeQueuedAction(action.id);
            failureCount++;
          }
        }
      } catch (error) {
        console.error('Error syncing action:', error);
        action.retryCount++;
        if (action.retryCount >= action.maxRetries) {
          await this.removeQueuedAction(action.id);
          failureCount++;
        }
      }
    }

    console.log(`🔄 Sync complete: ${successCount} successful, ${failureCount} failed`);
    
    if (successCount > 0) {
      this.showSyncSuccessNotification(successCount);
    }
    
    if (failureCount > 0) {
      this.showSyncFailureNotification(failureCount);
    }
  }

  async refreshOnlineData() {
    console.log('🔄 Refreshing online data...');
    
    try {
      // This will be called by the main app's data loading system
      // We just need to trigger a refresh
      if (window.refreshUserData) {
        await window.refreshUserData();
      }
    } catch (error) {
      console.error('Error refreshing online data:', error);
    }
  }

  // ===== UI UPDATES =====

  showOfflineIndicator() {
    // Remove existing indicator if present
    this.hideOfflineIndicator();
    
    const indicator = document.createElement('div');
    indicator.id = 'offline-indicator';
    indicator.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2';
    indicator.innerHTML = `
      <span>📡</span>
      <span>You're offline - actions will sync when reconnected</span>
    `;
    
    document.body.appendChild(indicator);
  }

  hideOfflineIndicator() {
    const indicator = document.getElementById('offline-indicator');
    if (indicator) {
      indicator.remove();
    }
  }

  showSyncSuccessNotification(count) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm';
    notification.innerHTML = `
      <div class="font-bold">✅ Sync Complete!</div>
      <div class="text-sm opacity-90">${count} offline action(s) synced successfully</div>
      <button class="mt-2 text-sm underline" onclick="this.parentElement.remove()">Dismiss</button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  }

  showSyncFailureNotification(count) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm';
    notification.innerHTML = `
      <div class="font-bold">⚠️ Sync Issues</div>
      <div class="text-sm opacity-90">${count} action(s) failed to sync. Check your connection.</div>
      <button class="mt-2 text-sm underline" onclick="this.parentElement.remove()">Dismiss</button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 8000);
  }

  showOfflineSaveNotification(actionType) {
    const actionNames = {
      'hydration': '💧 Water intake',
      'craving': '🫁 Craving resistance',
      'relapse': '⚠️ Relapse event',
      'breathing': '🧘 Breathing exercise',
      'walk': '🚶 Physical activity',
      'meditation': '🧘‍♀️ Meditation',
      'FIRESTORE_ACTION': '📊 Data sync',
      'BEHAVIORAL_LOG': '📈 Analytics'
    };

    const actionName = actionNames[actionType] || actionType;
    
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm';
    notification.innerHTML = `
      <div class="font-bold">💾 Saved Offline</div>
      <div class="text-sm opacity-90">${actionName} will sync when you're back online</div>
      <button class="mt-2 text-sm underline" onclick="this.parentElement.remove()">Dismiss</button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 4000);
  }

  updateOfflineStatus() {
    if (!this.isOnline) {
      this.showOfflineIndicator();
    }
  }

  // ===== UTILITY METHODS =====

  async loadOfflineData() {
    this.offlineData.userData = await this.getData('userData');
    this.offlineData.profileData = await this.getData('profileData');
    
    // Load sync queue
    this.syncQueue = await this.getQueuedActions();
    
    console.log('📱 Offline data loaded:', {
      userData: !!this.offlineData.userData,
      profileData: !!this.offlineData.profileData,
      queuedActions: this.syncQueue.length
    });
  }

  async checkForPendingSync() {
    if (this.isOnline && this.syncQueue.length > 0) {
      console.log('🔄 Checking for pending sync...');
      await this.syncOfflineActions();
    }
  }

  getConnectionStatus() {
    return {
      isOnline: this.isOnline,
      queuedActions: this.syncQueue.length,
      lastSync: this.lastSyncTime
    };
  }

  // ===== CLEANUP =====

  async clearOfflineData() {
    try {
      if (this.storageType === 'indexedDB' && this.db) {
        const transaction = this.db.transaction(['userData', 'offlineActions', 'syncQueue'], 'readwrite');
        await Promise.all([
          transaction.objectStore('userData').clear(),
          transaction.objectStore('offlineActions').clear(),
          transaction.objectStore('syncQueue').clear()
        ]);
      } else {
        // Clear localStorage
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('offline_')) {
            localStorage.removeItem(key);
          }
        });
      }
      
      this.offlineData = {};
      this.syncQueue = [];
      console.log('🧹 Offline data cleared');
    } catch (error) {
      console.error('Error clearing offline data:', error);
    }
  }
}

export default OfflineManager;
