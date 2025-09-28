/**
 * Enhanced Offline Data Queue Management System
 * Handles robust queuing, retry logic, conflict resolution, and user feedback
 */

class OfflineQueueManager {
  constructor() {
    this.isOnline = navigator.onLine;
    this.queue = new Map(); // Active queue
    this.failedQueue = new Map(); // Failed operations
    this.syncInProgress = false;
    this.retryDelays = [1000, 5000, 15000, 60000]; // Progressive retry delays
    this.maxRetries = 4;
    this.conflictResolution = 'server-wins'; // or 'client-wins', 'merge'
    
    // Operation types and their handlers
    this.operationHandlers = {
      'CREATE': this.handleCreateOperation.bind(this),
      'UPDATE': this.handleUpdateOperation.bind(this),
      'DELETE': this.handleDeleteOperation.bind(this),
      'BEHAVIORAL_LOG': this.handleBehavioralLogOperation.bind(this),
      'FIRESTORE_ACTION': this.handleFirestoreActionOperation.bind(this)
    };
    
    // Initialize storage and listeners
    this.initStorage();
    this.setupNetworkListeners();
    this.loadPersistedQueue();
    
    console.log('🚀 OfflineQueueManager initialized');
  }

  // ===== INITIALIZATION =====

  initStorage() {
    // Use IndexedDB for robust offline storage
    this.dbName = 'QuitCoachOfflineQueue';
    this.dbVersion = 2;
    this.initIndexedDB();
  }

  initIndexedDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => {
        console.error('❌ Failed to open IndexedDB for offline queue');
        reject(request.error);
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        console.log('✅ IndexedDB initialized for offline queue');
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('operations')) {
          const operationsStore = db.createObjectStore('operations', { keyPath: 'id' });
          operationsStore.createIndex('timestamp', 'timestamp', { unique: false });
          operationsStore.createIndex('type', 'type', { unique: false });
          operationsStore.createIndex('status', 'status', { unique: false });
          operationsStore.createIndex('userId', 'userId', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('conflicts')) {
          const conflictsStore = db.createObjectStore('conflicts', { keyPath: 'id' });
          conflictsStore.createIndex('operationId', 'operationId', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('syncHistory')) {
          const syncStore = db.createObjectStore('syncHistory', { keyPath: 'id' });
          syncStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
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

    // Listen for visibility changes to sync when app becomes active
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.isOnline) {
        this.attemptSync();
      }
    });

    // Periodic sync attempt (every 30 seconds when online)
    setInterval(() => {
      if (this.isOnline && !this.syncInProgress) {
        this.attemptSync();
      }
    }, 30000);
  }

  // ===== QUEUE OPERATIONS =====

  async queueOperation(operation) {
    const queuedOperation = {
      id: this.generateOperationId(),
      type: operation.type,
      data: operation.data,
      userId: operation.userId,
      timestamp: Date.now(),
      status: 'queued',
      retryCount: 0,
      maxRetries: this.maxRetries,
      priority: operation.priority || 'normal', // low, normal, high, critical
      dependencies: operation.dependencies || [],
      metadata: operation.metadata || {}
    };

    try {
      // Store in IndexedDB
      await this.storeOperation(queuedOperation);
      
      // Add to active queue
      this.queue.set(queuedOperation.id, queuedOperation);
      
      console.log(`📝 Operation queued: ${operation.type} (${queuedOperation.id})`);
      
      // Show user feedback
      this.showQueueNotification(queuedOperation);
      
      // If online, try to execute immediately
      if (this.isOnline) {
        this.attemptSync();
      }
      
      return queuedOperation.id;
    } catch (error) {
      console.error('❌ Error queuing operation:', error);
      throw error;
    }
  }

  async storeOperation(operation) {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['operations'], 'readwrite');
      const store = transaction.objectStore('operations');
      const request = store.put(operation);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async loadPersistedQueue() {
    if (!this.db) return;

    try {
      const operations = await this.getAllOperations();
      
      // Load queued and failed operations
      operations.forEach(op => {
        if (op.status === 'queued' || op.status === 'failed') {
          this.queue.set(op.id, op);
        } else if (op.status === 'failed') {
          this.failedQueue.set(op.id, op);
        }
      });
      
      console.log(`📱 Loaded ${this.queue.size} queued operations from storage`);
    } catch (error) {
      console.error('❌ Error loading persisted queue:', error);
    }
  }

  async getAllOperations() {
    if (!this.db) return [];

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['operations'], 'readonly');
      const store = transaction.objectStore('operations');
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // ===== OPERATION EXECUTION =====

  async attemptSync() {
    if (this.syncInProgress || !this.isOnline) {
      return;
    }

    this.syncInProgress = true;
    console.log('🔄 Starting sync attempt...');

    try {
      const syncResults = await this.syncOperations();
      this.handleSyncResults(syncResults);
    } catch (error) {
      console.error('❌ Sync failed:', error);
      this.showSyncErrorNotification(error.message);
    } finally {
      this.syncInProgress = false;
    }
  }

  async syncOperations() {
    const results = {
      successful: 0,
      failed: 0,
      conflicts: 0,
      skipped: 0
    };

    // Process operations by priority
    const operationsByPriority = this.getOperationsByPriority();
    
    for (const priority of ['critical', 'high', 'normal', 'low']) {
      const operations = operationsByPriority[priority] || [];
      
      for (const operation of operations) {
        try {
          const result = await this.executeOperation(operation);
          
          if (result.success) {
            results.successful++;
            await this.removeOperation(operation.id);
            this.queue.delete(operation.id);
          } else if (result.conflict) {
            results.conflicts++;
            await this.handleConflict(operation, result.conflict);
          } else {
            results.failed++;
            await this.handleOperationFailure(operation, result.error);
          }
        } catch (error) {
          console.error(`❌ Error processing operation ${operation.id}:`, error);
          results.failed++;
          await this.handleOperationFailure(operation, error);
        }
      }
    }

    return results;
  }

  getOperationsByPriority() {
    const operations = Array.from(this.queue.values());
    return operations.reduce((acc, op) => {
      if (!acc[op.priority]) {
        acc[op.priority] = [];
      }
      acc[op.priority].push(op);
      return acc;
    }, {});
  }

  async executeOperation(operation) {
    const handler = this.operationHandlers[operation.type];
    if (!handler) {
      throw new Error(`No handler for operation type: ${operation.type}`);
    }

    // Check dependencies
    const dependenciesMet = await this.checkDependencies(operation);
    if (!dependenciesMet) {
      return { success: false, skipped: true };
    }

    // Execute the operation
    const result = await handler(operation);
    
    // Update operation status
    operation.status = 'completed';
    operation.completedAt = Date.now();
    await this.storeOperation(operation);

    return result;
  }

  async checkDependencies(operation) {
    if (!operation.dependencies || operation.dependencies.length === 0) {
      return true;
    }

    for (const depId of operation.dependencies) {
      const depOperation = this.queue.get(depId);
      if (depOperation && depOperation.status !== 'completed') {
        return false;
      }
    }

    return true;
  }

  // ===== OPERATION HANDLERS =====

  async handleCreateOperation(operation) {
    try {
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
      const { firestore } = await import('../services/firebase');
      
      const docRef = await addDoc(collection(firestore, operation.data.collection), {
        ...operation.data.data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return { success: true, docId: docRef.id };
    } catch (error) {
      console.error('❌ Create operation failed:', error);
      return { success: false, error };
    }
  }

  async handleUpdateOperation(operation) {
    try {
      const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore');
      const { firestore } = await import('../services/firebase');
      
      const docRef = doc(firestore, operation.data.collection, operation.data.docId);
      await updateDoc(docRef, {
        ...operation.data.data,
        updatedAt: serverTimestamp()
      });

      return { success: true };
    } catch (error) {
      console.error('❌ Update operation failed:', error);
      return { success: false, error };
    }
  }

  async handleDeleteOperation(operation) {
    try {
      const { doc, deleteDoc } = await import('firebase/firestore');
      const { firestore } = await import('../services/firebase');
      
      const docRef = doc(firestore, operation.data.collection, operation.data.docId);
      await deleteDoc(docRef);

      return { success: true };
    } catch (error) {
      console.error('❌ Delete operation failed:', error);
      return { success: false, error };
    }
  }

  async handleBehavioralLogOperation(operation) {
    try {
      // Use the existing behavioral service
      const { default: BehavioralService } = await import('./firestoreBehavioralService');
      const behavioralService = new BehavioralService();
      
      const result = await behavioralService.logBehavioralData(
        operation.userId,
        operation.data.logType,
        operation.data.logData
      );

      return { success: true, result };
    } catch (error) {
      console.error('❌ Behavioral log operation failed:', error);
      return { success: false, error };
    }
  }

  async handleFirestoreActionOperation(operation) {
    try {
      // Use the existing Firestore service
      const { default: FirestoreService } = await import('./firestoreBehavioralService');
      const firestoreService = new FirestoreService();
      
      const result = await firestoreService.logBehavioralData(
        operation.userId,
        operation.data.actionType,
        operation.data.actionData
      );

      return { success: true, result };
    } catch (error) {
      console.error('❌ Firestore action operation failed:', error);
      return { success: false, error };
    }
  }

  // ===== CONFLICT RESOLUTION =====

  async handleConflict(operation, conflictData) {
    console.log(`⚠️ Conflict detected for operation ${operation.id}:`, conflictData);
    
    const conflict = {
      id: this.generateOperationId(),
      operationId: operation.id,
      conflictData,
      timestamp: Date.now(),
      resolution: null
    };

    // Store conflict for manual resolution
    await this.storeConflict(conflict);
    
    // Apply conflict resolution strategy
    const resolution = await this.resolveConflict(operation, conflictData);
    
    if (resolution.resolved) {
      operation.status = 'resolved';
      operation.resolution = resolution;
      await this.storeOperation(operation);
    } else {
      operation.status = 'conflict';
      await this.storeOperation(operation);
    }
  }

  async resolveConflict(operation, conflictData) {
    switch (this.conflictResolution) {
      case 'server-wins':
        return { resolved: true, strategy: 'server-wins', data: conflictData.serverData };
      
      case 'client-wins':
        return { resolved: true, strategy: 'client-wins', data: operation.data };
      
      case 'merge':
        return await this.mergeConflictData(operation.data, conflictData);
      
      default:
        return { resolved: false, strategy: 'manual' };
    }
  }

  async mergeConflictData(clientData, conflictData) {
    // Simple merge strategy - can be enhanced based on data structure
    const mergedData = {
      ...conflictData.serverData,
      ...clientData,
      // Preserve server timestamps but add client metadata
      clientUpdatedAt: clientData.updatedAt,
      serverUpdatedAt: conflictData.serverData.updatedAt,
      mergedAt: Date.now()
    };

    return { resolved: true, strategy: 'merge', data: mergedData };
  }

  async storeConflict(conflict) {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['conflicts'], 'readwrite');
      const store = transaction.objectStore('conflicts');
      const request = store.put(conflict);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // ===== FAILURE HANDLING =====

  async handleOperationFailure(operation, error) {
    operation.retryCount++;
    operation.lastError = error.message;
    operation.lastRetryAt = Date.now();

    if (operation.retryCount >= operation.maxRetries) {
      operation.status = 'failed';
      this.failedQueue.set(operation.id, operation);
      this.queue.delete(operation.id);
      
      console.error(`❌ Operation ${operation.id} failed permanently after ${operation.maxRetries} retries`);
      this.showOperationFailedNotification(operation);
    } else {
      operation.status = 'queued';
      const retryDelay = this.retryDelays[Math.min(operation.retryCount - 1, this.retryDelays.length - 1)];
      
      console.log(`⏳ Operation ${operation.id} will retry in ${retryDelay}ms (attempt ${operation.retryCount}/${operation.maxRetries})`);
      
      setTimeout(() => {
        if (this.isOnline) {
          this.attemptSync();
        }
      }, retryDelay);
    }

    await this.storeOperation(operation);
  }

  // ===== QUEUE MANAGEMENT =====

  async removeOperation(operationId) {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['operations'], 'readwrite');
      const store = transaction.objectStore('operations');
      const request = store.delete(operationId);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async clearCompletedOperations() {
    if (!this.db) return;

    try {
      const operations = await this.getAllOperations();
      const completedOps = operations.filter(op => op.status === 'completed');
      
      for (const op of completedOps) {
        await this.removeOperation(op.id);
      }
      
      console.log(`🧹 Cleared ${completedOps.length} completed operations`);
    } catch (error) {
      console.error('❌ Error clearing completed operations:', error);
    }
  }

  // ===== USER FEEDBACK =====

  showQueueNotification(operation) {
    const actionNames = {
      'CREATE': '📝 Creating',
      'UPDATE': '✏️ Updating',
      'DELETE': '🗑️ Deleting',
      'BEHAVIORAL_LOG': '📊 Logging',
      'FIRESTORE_ACTION': '🔄 Syncing'
    };

    const actionName = actionNames[operation.type] || operation.type;
    
    this.showNotification({
      type: 'info',
      title: '💾 Saved Offline',
      message: `${actionName} will sync when you're back online`,
      duration: 3000
    });
  }

  showSyncResultsNotification(results) {
    if (results.successful > 0) {
      this.showNotification({
        type: 'success',
        title: '✅ Sync Complete',
        message: `${results.successful} operation(s) synced successfully`,
        duration: 5000
      });
    }

    if (results.failed > 0) {
      this.showNotification({
        type: 'error',
        title: '⚠️ Sync Issues',
        message: `${results.failed} operation(s) failed to sync`,
        duration: 8000
      });
    }

    if (results.conflicts > 0) {
      this.showNotification({
        type: 'warning',
        title: '⚠️ Conflicts Detected',
        message: `${results.conflicts} operation(s) have conflicts that need attention`,
        duration: 10000
      });
    }
  }

  showOperationFailedNotification(operation) {
    this.showNotification({
      type: 'error',
      title: '❌ Operation Failed',
      message: `Operation ${operation.type} failed permanently. Check your data.`,
      duration: 10000
    });
  }

  showSyncErrorNotification(message) {
    this.showNotification({
      type: 'error',
      title: '❌ Sync Error',
      message: `Sync failed: ${message}`,
      duration: 8000
    });
  }

  showNotification({ type, title, message, duration = 5000 }) {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm ${
      type === 'success' ? 'bg-green-500' :
      type === 'error' ? 'bg-red-500' :
      type === 'warning' ? 'bg-yellow-500' :
      'bg-blue-500'
    } text-white`;
    
    notification.innerHTML = `
      <div class="font-bold">${title}</div>
      <div class="text-sm opacity-90 mt-1">${message}</div>
      <button class="mt-2 text-sm underline" onclick="this.parentElement.remove()">Dismiss</button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, duration);
  }

  // ===== UTILITY METHODS =====

  generateOperationId() {
    return `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

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
    indicator.innerHTML = `
      <span>📡</span>
      <span>You're offline - ${this.queue.size} action(s) queued</span>
    `;
    
    document.body.appendChild(indicator);
  }

  hideOfflineIndicator() {
    const indicator = document.getElementById('offline-indicator');
    if (indicator) {
      indicator.remove();
    }
  }

  // ===== PUBLIC API =====

  async queueBehavioralLog(userId, logType, logData, priority = 'normal') {
    return await this.queueOperation({
      type: 'BEHAVIORAL_LOG',
      userId,
      data: { logType, logData },
      priority
    });
  }

  async queueFirestoreAction(userId, actionType, actionData, priority = 'normal') {
    return await this.queueOperation({
      type: 'FIRESTORE_ACTION',
      userId,
      data: { actionType, actionData },
      priority
    });
  }

  async queueCreate(collection, data, userId, priority = 'normal') {
    return await this.queueOperation({
      type: 'CREATE',
      userId,
      data: { collection, data },
      priority
    });
  }

  async queueUpdate(collection, docId, data, userId, priority = 'normal') {
    return await this.queueOperation({
      type: 'UPDATE',
      userId,
      data: { collection, docId, data },
      priority
    });
  }

  async queueDelete(collection, docId, userId, priority = 'normal') {
    return await this.queueOperation({
      type: 'DELETE',
      userId,
      data: { collection, docId },
      priority
    });
  }

  getQueueStatus() {
    return {
      isOnline: this.isOnline,
      queuedOperations: this.queue.size,
      failedOperations: this.failedQueue.size,
      syncInProgress: this.syncInProgress
    };
  }

  async getQueueDetails() {
    const operations = Array.from(this.queue.values());
    const failed = Array.from(this.failedQueue.values());
    
    return {
      queued: operations.map(op => ({
        id: op.id,
        type: op.type,
        timestamp: op.timestamp,
        retryCount: op.retryCount,
        priority: op.priority
      })),
      failed: failed.map(op => ({
        id: op.id,
        type: op.type,
        timestamp: op.timestamp,
        lastError: op.lastError
      }))
    };
  }

  async retryFailedOperations() {
    const failedOps = Array.from(this.failedQueue.values());
    
    for (const op of failedOps) {
      op.status = 'queued';
      op.retryCount = 0;
      op.lastError = null;
      
      this.queue.set(op.id, op);
      this.failedQueue.delete(op.id);
      await this.storeOperation(op);
    }
    
    console.log(`🔄 Retrying ${failedOps.length} failed operations`);
    
    if (this.isOnline) {
      this.attemptSync();
    }
  }

  async clearAllQueues() {
    this.queue.clear();
    this.failedQueue.clear();
    
    if (this.db) {
      const transaction = this.db.transaction(['operations'], 'readwrite');
      const store = transaction.objectStore('operations');
      await store.clear();
    }
    
    console.log('🧹 All queues cleared');
  }
}

export default OfflineQueueManager;
