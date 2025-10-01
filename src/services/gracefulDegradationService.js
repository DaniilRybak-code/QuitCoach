/**
 * Graceful Degradation Service
 * Handles service failures and provides fallback functionality
 */

import { ref, get, set } from 'firebase/database';
import { collection, addDoc, getDocs, query, where, limit, deleteDoc } from 'firebase/firestore';
import { db, firestore } from './firebase.js';

class GracefulDegradationService {
  constructor() {
    this.serviceStatus = {
      firebase: 'unknown',
      firestore: 'unknown',
      auth: 'unknown',
      offline: false
    };
    this.fallbackData = new Map();
    this.retryAttempts = new Map();
    this.maxRetries = 3;
    this.retryDelay = 2000; // 2 seconds
    this.degradationMode = false;
    this.setupServiceMonitoring();
  }

  /**
   * Initialize graceful degradation for user
   */
  initialize(userId) {
    this.userId = userId;
    this.setupFallbackData();
    this.startServiceHealthChecks();
    console.log('✅ GracefulDegradationService: Initialized for user', userId);
  }

  /**
   * Setup service monitoring
   */
  setupServiceMonitoring() {
    // Monitor network status
    window.addEventListener('online', () => {
      this.serviceStatus.offline = false;
      this.attemptServiceRecovery();
    });

    window.addEventListener('offline', () => {
      this.serviceStatus.offline = true;
      this.enableDegradationMode();
    });

    // Monitor Firebase connection
    this.monitorFirebaseConnection();
  }

  /**
   * Monitor Firebase connection
   */
  monitorFirebaseConnection() {
    setInterval(async () => {
      await this.checkFirebaseHealth();
    }, 30000); // Check every 30 seconds
  }

  /**
   * Check Firebase service health
   */
  async checkFirebaseHealth() {
    try {
      // Test Realtime Database
      const testRef = ref(db, 'health_check');
      await get(testRef);
      this.serviceStatus.firebase = 'healthy';
    } catch (error) {
      this.serviceStatus.firebase = 'unhealthy';
      this.handleServiceFailure('firebase', error);
    }

    try {
      // Only test Firestore if user is authenticated
      if (!this.userId) {
        console.log('⚠️ GracefulDegradationService: Skipping Firestore health check - no user ID');
        this.serviceStatus.firestore = 'unknown';
        return;
      }

      // Test Firestore with proper data structure (simplified test)
      const testCollection = collection(firestore, 'health_check');
      const testData = {
        userId: this.userId,
        timestamp: new Date(),
        service: 'health_check',
        status: 'testing'
      };
      
      // Try to add a test document
      const testDoc = await addDoc(testCollection, testData);
      
      // Clean up the test document
      await testDoc.delete();
      
      this.serviceStatus.firestore = 'healthy';
    } catch (error) {
      // Don't treat Firestore permission errors as service failures during health checks
      if (error.code === 'permission-denied' || error.message.includes('Missing or insufficient permissions')) {
        console.log('⚠️ GracefulDegradationService: Firestore health check skipped due to permissions');
        this.serviceStatus.firestore = 'unknown';
      } else {
        this.serviceStatus.firestore = 'unhealthy';
        this.handleServiceFailure('firestore', error);
      }
    }
  }

  /**
   * Handle service failure
   */
  handleServiceFailure(service, error) {
    // Don't treat permission errors as critical service failures
    if (error.code === 'permission-denied' || error.message.includes('Missing or insufficient permissions')) {
      console.log(`⚠️ GracefulDegradationService: ${service} service access denied - not treating as failure`);
      return;
    }
    
    console.warn(`⚠️ GracefulDegradationService: ${service} service failure:`, error);
    
    // Enable degradation mode if critical services fail
    if (service === 'firebase' || service === 'firestore') {
      this.enableDegradationMode();
    }

    // Log the failure
    if (window.errorLoggingService) {
      window.errorLoggingService.logError('service_failure', {
        service,
        error: error.message,
        severity: 'warning'
      });
    }
  }

  /**
   * Enable degradation mode
   */
  enableDegradationMode() {
    this.degradationMode = true;
    console.log('🔄 GracefulDegradationService: Degradation mode enabled');
    
    // Notify user if needed
    this.notifyUserOfDegradation();
  }

  /**
   * Disable degradation mode
   */
  disableDegradationMode() {
    this.degradationMode = false;
    console.log('✅ GracefulDegradationService: Degradation mode disabled');
  }

  /**
   * Notify user of degradation
   */
  notifyUserOfDegradation() {
    // Show a subtle notification to the user
    if (window.showQuickActionPopup) {
      window.showQuickActionPopup(
        'Service Temporarily Unavailable',
        'Some features may be limited while we restore full service. Your data is safe.',
        'info'
      );
    }
  }

  /**
   * Setup fallback data
   */
  setupFallbackData() {
    // Load cached data from localStorage
    this.loadCachedData();
  }

  /**
   * Load cached data from localStorage
   */
  loadCachedData() {
    try {
      const cachedData = {
        profile: this.getCachedData('offline_profileData'),
        stats: this.getCachedData('offline_cachedStats'),
        userData: this.getCachedData('offline_userData')
      };

      Object.entries(cachedData).forEach(([key, value]) => {
        if (value) {
          this.fallbackData.set(key, value);
        }
      });

      console.log('✅ GracefulDegradationService: Cached data loaded');

    } catch (error) {
      console.error('❌ GracefulDegradationService: Error loading cached data:', error);
    }
  }

  /**
   * Get cached data from localStorage
   */
  getCachedData(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn(`⚠️ GracefulDegradationService: Error getting cached ${key}:`, error);
      return null;
    }
  }

  /**
   * Start service health checks
   */
  startServiceHealthChecks() {
    // Initial health check
    this.checkFirebaseHealth();

    // Periodic health checks
    setInterval(() => {
      this.checkFirebaseHealth();
    }, 60000); // Check every minute
  }

  /**
   * Attempt service recovery
   */
  async attemptServiceRecovery() {
    console.log('🔄 GracefulDegradationService: Attempting service recovery...');
    
    await this.checkFirebaseHealth();
    
    if (this.serviceStatus.firebase === 'healthy' && this.serviceStatus.firestore === 'healthy') {
      this.disableDegradationMode();
      this.syncCachedData();
    }
  }

  /**
   * Sync cached data when services recover
   */
  async syncCachedData() {
    console.log('🔄 GracefulDegradationService: Syncing cached data...');
    
    // This would sync any offline changes back to Firebase
    // Implementation depends on your offline queue system
    if (window.offlineManager) {
      try {
        await window.offlineManager.syncOperations();
        console.log('✅ GracefulDegradationService: Cached data synced');
      } catch (error) {
        console.error('❌ GracefulDegradationService: Error syncing cached data:', error);
      }
    }
  }

  /**
   * Get data with fallback
   */
  async getDataWithFallback(dataType, firebasePath, fallbackKey) {
    try {
      // Try to get data from Firebase first
      if (!this.degradationMode && this.serviceStatus.firebase === 'healthy') {
        const dataRef = ref(db, firebasePath);
        const snapshot = await get(dataRef);
        
        if (snapshot.exists()) {
          const data = snapshot.val();
          // Cache the data
          this.fallbackData.set(fallbackKey, data);
          return data;
        }
      }

      // Fall back to cached data
      const cachedData = this.fallbackData.get(fallbackKey);
      if (cachedData) {
        console.log(`📱 GracefulDegradationService: Using cached ${dataType} data`);
        return cachedData;
      }

      // Return default data
      return this.getDefaultData(dataType);

    } catch (error) {
      console.warn(`⚠️ GracefulDegradationService: Error getting ${dataType}:`, error);
      
      // Return cached data if available
      const cachedData = this.fallbackData.get(fallbackKey);
      if (cachedData) {
        return cachedData;
      }

      // Return default data
      return this.getDefaultData(dataType);
    }
  }

  /**
   * Set data with fallback
   */
  async setDataWithFallback(dataType, firebasePath, data, fallbackKey) {
    try {
      // Try to set data in Firebase first
      if (!this.degradationMode && this.serviceStatus.firebase === 'healthy') {
        const dataRef = ref(db, firebasePath);
        await set(dataRef, data);
        console.log(`✅ GracefulDegradationService: ${dataType} data saved to Firebase`);
      } else {
        console.log(`📱 GracefulDegradationService: ${dataType} data cached (offline mode)`);
      }

      // Always cache the data locally
      this.fallbackData.set(fallbackKey, data);
      this.cacheData(fallbackKey, data);

      return true;

    } catch (error) {
      console.warn(`⚠️ GracefulDegradationService: Error setting ${dataType}:`, error);
      
      // Cache the data locally even if Firebase fails
      this.fallbackData.set(fallbackKey, data);
      this.cacheData(fallbackKey, data);
      
      return false;
    }
  }

  /**
   * Cache data in localStorage
   */
  cacheData(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.warn(`⚠️ GracefulDegradationService: Error caching ${key}:`, error);
    }
  }

  /**
   * Get default data for a type
   */
  getDefaultData(dataType) {
    const defaults = {
      profile: {
        heroName: 'Anonymous Hero',
        archetype: 'DETERMINED',
        avatar: null,
        quitDate: new Date().toISOString(),
        triggers: [],
        dailyPatterns: [],
        copingStrategies: []
      },
      stats: {
        mentalStrength: 50,
        motivation: 50,
        triggerDefense: 30,
        addictionLevel: 50,
        cravingsResisted: 0,
        streakDays: 0,
        experiencePoints: 0
      },
      userData: {
        email: '',
        displayName: 'Anonymous User',
        photoURL: null,
        lastLogin: new Date().toISOString()
      }
    };

    return defaults[dataType] || {};
  }

  /**
   * Get service status
   */
  getServiceStatus() {
    return {
      ...this.serviceStatus,
      degradationMode: this.degradationMode,
      fallbackDataCount: this.fallbackData.size,
      retryAttempts: Object.fromEntries(this.retryAttempts)
    };
  }

  /**
   * Check if service is available
   */
  isServiceAvailable(service) {
    if (this.serviceStatus.offline) return false;
    return this.serviceStatus[service] === 'healthy';
  }

  /**
   * Get user profile with fallback
   */
  async getUserProfile() {
    return this.getDataWithFallback(
      'profile',
      `users/${this.userId}/profile`,
      'profile'
    );
  }

  /**
   * Set user profile with fallback
   */
  async setUserProfile(profileData) {
    return this.setDataWithFallback(
      'profile',
      `users/${this.userId}/profile`,
      profileData,
      'profile'
    );
  }

  /**
   * Get user stats with fallback
   */
  async getUserStats() {
    return this.getDataWithFallback(
      'stats',
      `users/${this.userId}/stats`,
      'stats'
    );
  }

  /**
   * Set user stats with fallback
   */
  async setUserStats(statsData) {
    return this.setDataWithFallback(
      'stats',
      `users/${this.userId}/stats`,
      statsData,
      'stats'
    );
  }

  /**
   * Get behavioral data with fallback
   */
  async getBehavioralData(limit = 10) {
    try {
      if (!this.degradationMode && this.serviceStatus.firestore === 'healthy') {
        const behavioralQuery = query(
          collection(firestore, 'behavioral_cravings'),
          where('userId', '==', this.userId),
          limit(limit)
        );
        
        const snapshot = await getDocs(behavioralQuery);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }

      // Fall back to cached data
      const cachedData = this.fallbackData.get('behavioralData') || [];
      return cachedData.slice(0, limit);

    } catch (error) {
      console.warn('⚠️ GracefulDegradationService: Error getting behavioral data:', error);
      return this.fallbackData.get('behavioralData') || [];
    }
  }

  /**
   * Set behavioral data with fallback
   */
  async setBehavioralData(behavioralData) {
    try {
      if (!this.degradationMode && this.serviceStatus.firestore === 'healthy') {
        // Ensure behavioral data has required fields
        const validatedData = {
          ...behavioralData,
          userId: this.userId,
          timestamp: behavioralData.timestamp || new Date()
        };
        
        await addDoc(collection(firestore, 'behavioral_cravings'), validatedData);
        console.log('✅ GracefulDegradationService: Behavioral data saved to Firestore');
      } else {
        console.log('📱 GracefulDegradationService: Behavioral data cached (offline mode)');
      }

      // Cache the data locally
      const cachedData = this.fallbackData.get('behavioralData') || [];
      cachedData.unshift(behavioralData);
      this.fallbackData.set('behavioralData', cachedData.slice(0, 100)); // Keep last 100 entries

      return true;

    } catch (error) {
      console.warn('⚠️ GracefulDegradationService: Error setting behavioral data:', error);
      return false;
    }
  }

  /**
   * Force service recovery
   */
  async forceRecovery() {
    console.log('🔄 GracefulDegradationService: Forcing service recovery...');
    await this.checkFirebaseHealth();
    await this.attemptServiceRecovery();
  }
}

// Create singleton instance
const gracefulDegradationService = new GracefulDegradationService();

export default gracefulDegradationService;
