/**
 * Authentication Guard Service
 * Wraps Firebase operations with authentication validation
 */

import { auth, db, firestore } from './firebase.js';
import { ref, get, set, push, update, remove, onValue, off, query } from 'firebase/database';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, addDoc, getDocs, query as firestoreQuery, onSnapshot, where, orderBy, limit, startAfter } from 'firebase/firestore';
import AuthStateValidator from './authStateValidator.js';

class AuthGuard {
  constructor() {
    this.authValidator = new AuthStateValidator();
    this.operationCount = 0;
    this.failedOperations = 0;
    this.retryQueue = new Map();
    
    // Operation tracking
    this.operationStats = {
      total: 0,
      successful: 0,
      failed: 0,
      retried: 0,
      authErrors: 0
    };
  }

  // ===== DATABASE OPERATIONS =====

  async databaseGet(path, options = {}) {
    return await this.executeWithAuth('DATABASE_GET', async () => {
      const dbRef = ref(db, path);
      const snapshot = await get(dbRef);
      
      if (options.requireExists && !snapshot.exists()) {
        throw new Error(`Data not found at path: ${path}`);
      }
      
      return snapshot.exists() ? snapshot.val() : null;
    });
  }

  async databaseSet(path, data, options = {}) {
    return await this.executeWithAuth('DATABASE_SET', async () => {
      const dbRef = ref(db, path);
      await set(dbRef, data);
      return true;
    });
  }

  async databaseUpdate(path, data, options = {}) {
    return await this.executeWithAuth('DATABASE_UPDATE', async () => {
      const dbRef = ref(db, path);
      await update(dbRef, data);
      return true;
    });
  }

  async databasePush(path, data, options = {}) {
    return await this.executeWithAuth('DATABASE_PUSH', async () => {
      const dbRef = ref(db, path);
      const newRef = await push(dbRef, data);
      return newRef.key;
    });
  }

  async databaseRemove(path, options = {}) {
    return await this.executeWithAuth('DATABASE_REMOVE', async () => {
      const dbRef = ref(db, path);
      await remove(dbRef);
      return true;
    });
  }

  databaseOnValue(path, callback, options = {}) {
    return this.executeWithAuth('DATABASE_ON_VALUE', async () => {
      const dbRef = ref(db, path);
      const unsubscribe = onValue(dbRef, (snapshot) => {
        try {
          const data = snapshot.exists() ? snapshot.val() : null;
          callback(data, snapshot);
        } catch (error) {
          console.error('❌ Error in onValue callback:', error);
          this.handleOperationError('DATABASE_ON_VALUE', error);
        }
      }, options.errorCallback);
      
      return unsubscribe;
    });
  }

  // ===== FIRESTORE OPERATIONS =====

  async firestoreGetDoc(collection, docId, options = {}) {
    return await this.executeWithAuth('FIRESTORE_GET_DOC', async () => {
      const docRef = doc(firestore, collection, docId);
      const snapshot = await getDoc(docRef);
      
      if (options.requireExists && !snapshot.exists()) {
        throw new Error(`Document not found: ${collection}/${docId}`);
      }
      
      return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
    });
  }

  async firestoreSetDoc(collection, docId, data, options = {}) {
    return await this.executeWithAuth('FIRESTORE_SET_DOC', async () => {
      const docRef = doc(firestore, collection, docId);
      await setDoc(docRef, data, options);
      return true;
    });
  }

  async firestoreUpdateDoc(collection, docId, data, options = {}) {
    return await this.executeWithAuth('FIRESTORE_UPDATE_DOC', async () => {
      const docRef = doc(firestore, collection, docId);
      await updateDoc(docRef, data);
      return true;
    });
  }

  async firestoreDeleteDoc(collection, docId, options = {}) {
    return await this.executeWithAuth('FIRESTORE_DELETE_DOC', async () => {
      const docRef = doc(firestore, collection, docId);
      await deleteDoc(docRef);
      return true;
    });
  }

  async firestoreAddDoc(collection, data, options = {}) {
    return await this.executeWithAuth('FIRESTORE_ADD_DOC', async () => {
      const collectionRef = collection(firestore, collection);
      const docRef = await addDoc(collectionRef, data);
      return docRef.id;
    });
  }

  async firestoreGetDocs(collection, queryOptions = {}) {
    return await this.executeWithAuth('FIRESTORE_GET_DOCS', async () => {
      const collectionRef = collection(firestore, collection);
      let q = collectionRef;
      
      // Apply query options
      if (queryOptions.where) {
        q = firestoreQuery(q, where(queryOptions.where.field, queryOptions.where.operator, queryOptions.where.value));
      }
      if (queryOptions.orderBy) {
        q = firestoreQuery(q, orderBy(queryOptions.orderBy.field, queryOptions.orderBy.direction || 'asc'));
      }
      if (queryOptions.limit) {
        q = firestoreQuery(q, limit(queryOptions.limit));
      }
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    });
  }

  firestoreOnSnapshot(collection, docId, callback, options = {}) {
    return this.executeWithAuth('FIRESTORE_ON_SNAPSHOT', async () => {
      const docRef = doc(firestore, collection, docId);
      const unsubscribe = onSnapshot(docRef, (snapshot) => {
        try {
          const data = snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
          callback(data, snapshot);
        } catch (error) {
          console.error('❌ Error in onSnapshot callback:', error);
          this.handleOperationError('FIRESTORE_ON_SNAPSHOT', error);
        }
      }, options.errorCallback);
      
      return unsubscribe;
    });
  }

  // ===== USER-SPECIFIC OPERATIONS =====

  async getUserData(userId, options = {}) {
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    return await this.databaseGet(`users/${userId}`, options);
  }

  async setUserData(userId, data, options = {}) {
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    return await this.databaseSet(`users/${userId}`, data, options);
  }

  async updateUserData(userId, data, options = {}) {
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    return await this.databaseUpdate(`users/${userId}`, data, options);
  }

  async getUserStats(userId, options = {}) {
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    return await this.databaseGet(`users/${userId}/stats`, options);
  }

  async setUserStats(userId, stats, options = {}) {
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    return await this.databaseSet(`users/${userId}/stats`, stats, options);
  }

  async updateUserStats(userId, stats, options = {}) {
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    return await this.databaseUpdate(`users/${userId}/stats`, stats, options);
  }

  // ===== BEHAVIORAL LOGGING =====

  async logBehavioralData(userId, logType, logData, options = {}) {
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    return await this.executeWithAuth('BEHAVIORAL_LOG', async () => {
      const logEntry = {
        ...logData,
        logType,
        userId,
        timestamp: Date.now(),
        date: new Date().toISOString().split('T')[0]
      };
      
      const logRef = ref(db, `users/${userId}/behavioral_logs/${logType}`);
      const newLogRef = await push(logRef, logEntry);
      
      return newLogRef.key;
    });
  }

  async getBehavioralLogs(userId, logType, options = {}) {
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    return await this.databaseGet(`users/${userId}/behavioral_logs/${logType}`, options);
  }

  // ===== CORE AUTHENTICATION WRAPPER =====

  async executeWithAuth(operation, operationFunction) {
    this.operationCount++;
    this.operationStats.total++;
    
    try {
      // Validate authentication
      await this.authValidator.validateAuthState(operation);
      
      // Execute operation
      const result = await operationFunction();
      
      this.operationStats.successful++;
      console.log(`✅ Operation completed: ${operation}`);
      
      return result;
      
    } catch (error) {
      this.operationStats.failed++;
      this.failedOperations++;
      
      console.error(`❌ Operation failed: ${operation}`, error);
      
      // Handle authentication errors
      if (this.authValidator.isAuthError(error)) {
        this.operationStats.authErrors++;
        await this.handleAuthError(operation, operationFunction, error);
      }
      
      throw error;
    }
  }

  async handleAuthError(operation, operationFunction, error) {
    console.log(`🔐 Auth error for operation: ${operation}`, error);
    
    // Queue operation for retry
    const retryId = `retry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.retryQueue.set(retryId, {
      id: retryId,
      operation,
      function: operationFunction,
      timestamp: Date.now(),
      retryCount: 0,
      maxRetries: 3
    });
    
    // Attempt retry after delay
    setTimeout(async () => {
      await this.retryOperation(retryId);
    }, 2000);
  }

  async retryOperation(retryId) {
    const retryOp = this.retryQueue.get(retryId);
    if (!retryOp) return;
    
    try {
      retryOp.retryCount++;
      this.operationStats.retried++;
      
      console.log(`🔄 Retrying operation: ${retryOp.operation} (attempt ${retryOp.retryCount})`);
      
      await this.executeWithAuth(retryOp.operation, retryOp.function);
      
      // Success - remove from retry queue
      this.retryQueue.delete(retryId);
      console.log(`✅ Retry successful: ${retryOp.operation}`);
      
    } catch (error) {
      console.error(`❌ Retry failed: ${retryOp.operation}`, error);
      
      if (retryOp.retryCount >= retryOp.maxRetries) {
        console.log(`❌ Operation permanently failed: ${retryOp.operation}`);
        this.retryQueue.delete(retryId);
      } else {
        // Schedule another retry
        setTimeout(async () => {
          await this.retryOperation(retryId);
        }, 5000 * retryOp.retryCount);
      }
    }
  }

  handleOperationError(operation, error) {
    console.error(`❌ Operation error: ${operation}`, error);
    
    // Show user feedback
    this.showOperationError(operation, error);
  }

  showOperationError(operation, error) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 left-4 p-4 rounded-lg shadow-lg z-50 max-w-sm bg-red-500 text-white';
    notification.innerHTML = `
      <div class="font-bold">❌ Operation Failed</div>
      <div class="text-sm opacity-90 mt-1">${operation}: ${error.message}</div>
      <button class="mt-2 text-sm underline" onclick="this.parentElement.remove()">Dismiss</button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 8000);
  }

  // ===== STATISTICS =====

  getOperationStats() {
    return {
      ...this.operationStats,
      retryQueueSize: this.retryQueue.size,
      successRate: this.operationStats.total > 0 
        ? Math.round((this.operationStats.successful / this.operationStats.total) * 100)
        : 0
    };
  }

  getRetryQueue() {
    return Array.from(this.retryQueue.values());
  }

  clearRetryQueue() {
    this.retryQueue.clear();
  }

  // ===== AUTHENTICATION STATE =====

  getAuthState() {
    return this.authValidator.getAuthState();
  }

  isUserAuthenticated() {
    return this.authValidator.isUserAuthenticated();
  }

  getCurrentUser() {
    return this.authValidator.getCurrentUser();
  }

  getUserId() {
    return this.authValidator.getUserId();
  }

  addAuthStateListener(callback) {
    return this.authValidator.addAuthStateListener(callback);
  }

  // ===== CONFIGURATION =====

  updateConfig(config) {
    this.authValidator.updateConfig(config);
  }

  // ===== CLEANUP =====

  destroy() {
    this.authValidator.destroy();
    this.retryQueue.clear();
  }
}

export default AuthGuard;
