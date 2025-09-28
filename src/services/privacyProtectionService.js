/**
 * Privacy Protection Service
 * Implements comprehensive user data privacy protections for beta testing
 */

class PrivacyProtectionService {
  constructor() {
    this.isPrivacyModeEnabled = true;
    this.dataRetentionDays = 30; // Beta testing data retention
    this.anonymizationEnabled = true;
    this.consentRequired = true;
    this.encryptionEnabled = true;
    this.auditLog = [];
  }

  /**
   * Initialize privacy protection for user
   */
  initialize(userId) {
    this.userId = userId;
    this.setupPrivacyControls();
    console.log('✅ PrivacyProtectionService: Initialized for user', userId);
  }

  /**
   * Setup privacy controls and consent management
   */
  setupPrivacyControls() {
    // Check if user has given consent
    const consent = this.getUserConsent();
    if (!consent) {
      this.requestConsent();
    }

    // Setup data retention timer
    this.setupDataRetentionTimer();

    // Setup anonymization for sensitive data
    this.setupAnonymization();
  }

  /**
   * Get user consent status
   */
  getUserConsent() {
    const consent = localStorage.getItem(`privacy_consent_${this.userId}`);
    return consent ? JSON.parse(consent) : null;
  }

  /**
   * Request user consent for data collection
   */
  requestConsent() {
    const consentData = {
      dataCollection: true,
      analytics: true,
      behavioralTracking: true,
      dataRetention: this.dataRetentionDays,
      anonymization: this.anonymizationEnabled,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };

    // Store consent request
    localStorage.setItem(`privacy_consent_request_${this.userId}`, JSON.stringify(consentData));
    
    // Log consent request
    this.logPrivacyEvent('consent_requested', {
      userId: this.anonymizeUserId(this.userId),
      timestamp: new Date().toISOString()
    });

    return consentData;
  }

  /**
   * Record user consent
   */
  recordConsent(consentData) {
    const consent = {
      ...consentData,
      grantedAt: new Date().toISOString(),
      userId: this.userId
    };

    localStorage.setItem(`privacy_consent_${this.userId}`, JSON.stringify(consent));
    
    this.logPrivacyEvent('consent_granted', {
      userId: this.anonymizeUserId(this.userId),
      dataCollection: consent.dataCollection,
      analytics: consent.analytics,
      behavioralTracking: consent.behavioralTracking
    });

    console.log('✅ PrivacyProtectionService: User consent recorded');
  }

  /**
   * Anonymize user ID for logging
   */
  anonymizeUserId(userId) {
    if (!this.anonymizationEnabled) return userId;
    
    // Create a hash of the user ID for consistent anonymization
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return `user_${Math.abs(hash).toString(36)}`;
  }

  /**
   * Anonymize sensitive data
   */
  anonymizeData(data, fieldsToAnonymize = []) {
    if (!this.anonymizationEnabled) return data;

    const anonymized = { ...data };
    
    // Default fields to anonymize
    const defaultFields = ['email', 'name', 'phone', 'address'];
    const fields = [...defaultFields, ...fieldsToAnonymize];
    
    fields.forEach(field => {
      if (anonymized[field]) {
        anonymized[field] = this.anonymizeString(anonymized[field]);
      }
    });

    return anonymized;
  }

  /**
   * Anonymize a string value
   */
  anonymizeString(str) {
    if (!str || typeof str !== 'string') return str;
    
    if (str.length <= 3) {
      return '*'.repeat(str.length);
    }
    
    return str.charAt(0) + '*'.repeat(str.length - 2) + str.charAt(str.length - 1);
  }

  /**
   * Encrypt sensitive data
   */
  encryptData(data) {
    if (!this.encryptionEnabled) return data;
    
    try {
      // Simple encryption for demo purposes
      // In production, use proper encryption libraries
      const encrypted = btoa(JSON.stringify(data));
      return {
        encrypted: true,
        data: encrypted,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ PrivacyProtectionService: Encryption failed:', error);
      return data;
    }
  }

  /**
   * Decrypt sensitive data
   */
  decryptData(encryptedData) {
    if (!encryptedData.encrypted) return encryptedData;
    
    try {
      const decrypted = JSON.parse(atob(encryptedData.data));
      return decrypted;
    } catch (error) {
      console.error('❌ PrivacyProtectionService: Decryption failed:', error);
      return encryptedData;
    }
  }

  /**
   * Sanitize data before storage
   */
  sanitizeData(data) {
    const sanitized = { ...data };
    
    // Remove sensitive fields that shouldn't be stored
    const sensitiveFields = ['password', 'ssn', 'creditCard', 'bankAccount'];
    sensitiveFields.forEach(field => {
      delete sanitized[field];
    });

    // Anonymize personal information
    if (this.anonymizationEnabled) {
      return this.anonymizeData(sanitized);
    }

    return sanitized;
  }

  /**
   * Setup data retention timer
   */
  setupDataRetentionTimer() {
    // Check for old data every hour
    setInterval(() => {
      this.cleanupExpiredData();
    }, 60 * 60 * 1000);
  }

  /**
   * Clean up expired data
   */
  async cleanupExpiredData() {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.dataRetentionDays);

      // Clean up local storage
      this.cleanupLocalStorage(cutoffDate);

      // Log cleanup event
      this.logPrivacyEvent('data_cleanup', {
        userId: this.anonymizeUserId(this.userId),
        cutoffDate: cutoffDate.toISOString(),
        retentionDays: this.dataRetentionDays
      });

      console.log('✅ PrivacyProtectionService: Expired data cleaned up');

    } catch (error) {
      console.error('❌ PrivacyProtectionService: Error cleaning up expired data:', error);
    }
  }

  /**
   * Clean up local storage
   */
  cleanupLocalStorage(cutoffDate) {
    const keysToCheck = [
      'offline_userData',
      'offline_profileData',
      'offline_cachedStats',
      'behavioral_logs',
      'session_data'
    ];

    keysToCheck.forEach(key => {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          const parsed = JSON.parse(data);
          if (parsed.timestamp && new Date(parsed.timestamp) < cutoffDate) {
            localStorage.removeItem(key);
            console.log(`🗑️ PrivacyProtectionService: Cleaned up expired ${key}`);
          }
        }
      } catch (error) {
        console.warn(`⚠️ PrivacyProtectionService: Error cleaning up ${key}:`, error);
      }
    });
  }

  /**
   * Setup anonymization for behavioral data
   */
  setupAnonymization() {
    // Override console.log to anonymize sensitive data
    const originalLog = console.log;
    console.log = (...args) => {
      const anonymizedArgs = args.map(arg => {
        if (typeof arg === 'object' && arg !== null) {
          return this.anonymizeData(arg);
        }
        return arg;
      });
      originalLog.apply(console, anonymizedArgs);
    };
  }

  /**
   * Log privacy-related events
   */
  logPrivacyEvent(eventType, data) {
    const event = {
      id: Date.now().toString(),
      eventType,
      data: this.anonymizeData(data),
      timestamp: new Date().toISOString(),
      userId: this.anonymizeUserId(this.userId)
    };

    this.auditLog.push(event);

    // Keep only last 100 events
    if (this.auditLog.length > 100) {
      this.auditLog = this.auditLog.slice(-100);
    }

    // Store in localStorage for persistence
    localStorage.setItem(`privacy_audit_${this.userId}`, JSON.stringify(this.auditLog));
  }

  /**
   * Get privacy audit log
   */
  getAuditLog() {
    return this.auditLog;
  }

  /**
   * Export user data (GDPR compliance)
   */
  async exportUserData() {
    if (!this.userId) {
      throw new Error('User ID not set');
    }

    try {
      const userData = {
        profile: this.getStoredData('profile'),
        stats: this.getStoredData('stats'),
        behavioralData: this.getStoredData('behavioralData'),
        settings: this.getStoredData('settings'),
        auditLog: this.auditLog,
        exportMetadata: {
          exportedAt: new Date().toISOString(),
          userId: this.anonymizeUserId(this.userId),
          version: '1.0.0',
          dataRetentionDays: this.dataRetentionDays
        }
      };

      return userData;

    } catch (error) {
      console.error('❌ PrivacyProtectionService: Error exporting user data:', error);
      throw error;
    }
  }

  /**
   * Get stored data from localStorage
   */
  getStoredData(key) {
    try {
      const data = localStorage.getItem(`offline_${key}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn(`⚠️ PrivacyProtectionService: Error getting ${key}:`, error);
      return null;
    }
  }

  /**
   * Delete all user data (GDPR right to be forgotten)
   */
  async deleteAllUserData() {
    if (!this.userId) {
      throw new Error('User ID not set');
    }

    try {
      // Clear localStorage
      const keysToRemove = [
        `privacy_consent_${this.userId}`,
        `privacy_consent_request_${this.userId}`,
        `privacy_audit_${this.userId}`,
        'offline_userData',
        'offline_profileData',
        'offline_cachedStats',
        'behavioral_logs',
        'session_data'
      ];

      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });

      // Log deletion event
      this.logPrivacyEvent('data_deletion', {
        userId: this.anonymizeUserId(this.userId),
        deletedAt: new Date().toISOString()
      });

      console.log('✅ PrivacyProtectionService: All user data deleted');
      return true;

    } catch (error) {
      console.error('❌ PrivacyProtectionService: Error deleting user data:', error);
      throw error;
    }
  }

  /**
   * Get privacy settings
   */
  getPrivacySettings() {
    return {
      isPrivacyModeEnabled: this.isPrivacyModeEnabled,
      dataRetentionDays: this.dataRetentionDays,
      anonymizationEnabled: this.anonymizationEnabled,
      consentRequired: this.consentRequired,
      encryptionEnabled: this.encryptionEnabled,
      hasConsent: !!this.getUserConsent()
    };
  }

  /**
   * Update privacy settings
   */
  updatePrivacySettings(settings) {
    if (settings.dataRetentionDays) {
      this.dataRetentionDays = settings.dataRetentionDays;
    }
    if (typeof settings.anonymizationEnabled === 'boolean') {
      this.anonymizationEnabled = settings.anonymizationEnabled;
    }
    if (typeof settings.encryptionEnabled === 'boolean') {
      this.encryptionEnabled = settings.encryptionEnabled;
    }

    this.logPrivacyEvent('settings_updated', {
      userId: this.anonymizeUserId(this.userId),
      settings: this.anonymizeData(settings)
    });
  }

  /**
   * Check if data collection is allowed
   */
  isDataCollectionAllowed() {
    const consent = this.getUserConsent();
    return consent && consent.dataCollection;
  }

  /**
   * Check if analytics is allowed
   */
  isAnalyticsAllowed() {
    const consent = this.getUserConsent();
    return consent && consent.analytics;
  }

  /**
   * Check if behavioral tracking is allowed
   */
  isBehavioralTrackingAllowed() {
    const consent = this.getUserConsent();
    return consent && consent.behavioralTracking;
  }
}

// Create singleton instance
const privacyProtectionService = new PrivacyProtectionService();

export default privacyProtectionService;
