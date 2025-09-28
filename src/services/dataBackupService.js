/**
 * Data Backup Service
 * Provides comprehensive data backup strategies for beta testing
 */

import { ref, get, set, push } from 'firebase/database';
import { collection, addDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db, firestore } from './firebase.js';

class DataBackupService {
  constructor() {
    this.backupInterval = null;
    this.isBackupEnabled = true;
    this.maxBackupRetries = 3;
    this.backupRetryDelay = 5000; // 5 seconds
    this.lastBackupTime = null;
    this.backupHistory = [];
  }

  /**
   * Initialize automatic backup system
   */
  initialize(userId) {
    if (!userId) {
      console.error('❌ DataBackupService: User ID required for initialization');
      return;
    }

    this.userId = userId;
    this.startAutomaticBackups();
    console.log('✅ DataBackupService: Initialized for user', userId);
  }

  /**
   * Start automatic backup schedule
   */
  startAutomaticBackups() {
    if (this.backupInterval) {
      clearInterval(this.backupInterval);
    }

    // Backup every 30 minutes during beta testing
    this.backupInterval = setInterval(() => {
      this.performBackup('scheduled');
    }, 30 * 60 * 1000);

    // Perform initial backup
    this.performBackup('initial');
  }

  /**
   * Stop automatic backups
   */
  stopAutomaticBackups() {
    if (this.backupInterval) {
      clearInterval(this.backupInterval);
      this.backupInterval = null;
    }
  }

  /**
   * Perform comprehensive data backup
   */
  async performBackup(trigger = 'manual') {
    if (!this.userId) {
      console.error('❌ DataBackupService: User ID not set');
      return false;
    }

    const backupId = `backup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();

    try {
      console.log(`🔄 DataBackupService: Starting backup ${backupId} (trigger: ${trigger})`);

      // Collect all user data
      const userData = await this.collectUserData();
      
      // Create backup record
      const backupRecord = {
        id: backupId,
        userId: this.userId,
        timestamp: new Date().toISOString(),
        trigger,
        dataSize: JSON.stringify(userData).length,
        version: '1.0.0',
        status: 'in_progress'
      };

      // Store backup in Firebase
      await this.storeBackup(backupRecord, userData);

      // Update backup record with success status
      backupRecord.status = 'completed';
      backupRecord.duration = Date.now() - startTime;
      await this.updateBackupStatus(backupRecord);

      // Store in local history
      this.backupHistory.push(backupRecord);
      this.lastBackupTime = new Date();

      console.log(`✅ DataBackupService: Backup ${backupId} completed in ${backupRecord.duration}ms`);
      return true;

    } catch (error) {
      console.error(`❌ DataBackupService: Backup ${backupId} failed:`, error);
      
      // Record failed backup
      const failedBackup = {
        id: backupId,
        userId: this.userId,
        timestamp: new Date().toISOString(),
        trigger,
        status: 'failed',
        error: error.message,
        duration: Date.now() - startTime
      };

      this.backupHistory.push(failedBackup);
      return false;
    }
  }

  /**
   * Collect all user data for backup
   */
  async collectUserData() {
    const userData = {
      profile: null,
      stats: null,
      behavioralData: [],
      settings: null,
      backupMetadata: {
        collectedAt: new Date().toISOString(),
        version: '1.0.0'
      }
    };

    try {
      // Get user profile from Realtime Database
      const profileRef = ref(db, `users/${this.userId}/profile`);
      const profileSnapshot = await get(profileRef);
      if (profileSnapshot.exists()) {
        userData.profile = profileSnapshot.val();
      }

      // Get user stats from Realtime Database
      const statsRef = ref(db, `users/${this.userId}/stats`);
      const statsSnapshot = await get(statsRef);
      if (statsSnapshot.exists()) {
        userData.stats = statsSnapshot.val();
      }

      // Get behavioral data from Firestore
      const behavioralQuery = query(
        collection(firestore, 'behavioral_cravings'),
        where('userId', '==', this.userId),
        orderBy('timestamp', 'desc'),
        limit(100) // Limit to last 100 entries for backup
      );
      
      const behavioralSnapshot = await getDocs(behavioralQuery);
      userData.behavioralData = behavioralSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Get user settings (if stored separately)
      const settingsRef = ref(db, `users/${this.userId}/settings`);
      const settingsSnapshot = await get(settingsRef);
      if (settingsSnapshot.exists()) {
        userData.settings = settingsSnapshot.val();
      }

      return userData;

    } catch (error) {
      console.error('❌ DataBackupService: Error collecting user data:', error);
      throw error;
    }
  }

  /**
   * Store backup data in Firebase
   */
  async storeBackup(backupRecord, userData) {
    try {
      // Store backup metadata
      const backupRef = ref(db, `backups/${this.userId}/${backupRecord.id}`);
      await set(backupRef, backupRecord);

      // Store actual data
      const dataRef = ref(db, `backup_data/${this.userId}/${backupRecord.id}`);
      await set(dataRef, userData);

      console.log(`✅ DataBackupService: Backup data stored for ${backupRecord.id}`);

    } catch (error) {
      console.error('❌ DataBackupService: Error storing backup:', error);
      throw error;
    }
  }

  /**
   * Update backup status
   */
  async updateBackupStatus(backupRecord) {
    try {
      const backupRef = ref(db, `backups/${this.userId}/${backupRecord.id}`);
      await set(backupRef, backupRecord);
    } catch (error) {
      console.error('❌ DataBackupService: Error updating backup status:', error);
    }
  }

  /**
   * Restore user data from backup
   */
  async restoreFromBackup(backupId) {
    if (!this.userId) {
      throw new Error('User ID not set');
    }

    try {
      console.log(`🔄 DataBackupService: Restoring from backup ${backupId}`);

      // Get backup data
      const dataRef = ref(db, `backup_data/${this.userId}/${backupId}`);
      const dataSnapshot = await get(dataRef);
      
      if (!dataSnapshot.exists()) {
        throw new Error('Backup data not found');
      }

      const userData = dataSnapshot.val();

      // Restore profile data
      if (userData.profile) {
        const profileRef = ref(db, `users/${this.userId}/profile`);
        await set(profileRef, userData.profile);
      }

      // Restore stats data
      if (userData.stats) {
        const statsRef = ref(db, `users/${this.userId}/stats`);
        await set(statsRef, userData.stats);
      }

      // Restore settings data
      if (userData.settings) {
        const settingsRef = ref(db, `users/${this.userId}/settings`);
        await set(settingsRef, userData.settings);
      }

      console.log(`✅ DataBackupService: Successfully restored from backup ${backupId}`);
      return true;

    } catch (error) {
      console.error(`❌ DataBackupService: Error restoring from backup ${backupId}:`, error);
      throw error;
    }
  }

  /**
   * Get backup history for user
   */
  async getBackupHistory(limit = 10) {
    if (!this.userId) {
      return [];
    }

    try {
      const backupsRef = ref(db, `backups/${this.userId}`);
      const snapshot = await get(backupsRef);
      
      if (!snapshot.exists()) {
        return [];
      }

      const backups = Object.values(snapshot.val());
      return backups
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, limit);

    } catch (error) {
      console.error('❌ DataBackupService: Error getting backup history:', error);
      return [];
    }
  }

  /**
   * Clean up old backups (keep last 10)
   */
  async cleanupOldBackups() {
    if (!this.userId) {
      return;
    }

    try {
      const backups = await this.getBackupHistory(50); // Get more than we want to keep
      
      if (backups.length > 10) {
        const backupsToDelete = backups.slice(10);
        
        for (const backup of backupsToDelete) {
          // Delete backup metadata
          const backupRef = ref(db, `backups/${this.userId}/${backup.id}`);
          await set(backupRef, null);
          
          // Delete backup data
          const dataRef = ref(db, `backup_data/${this.userId}/${backup.id}`);
          await set(dataRef, null);
        }

        console.log(`✅ DataBackupService: Cleaned up ${backupsToDelete.length} old backups`);
      }

    } catch (error) {
      console.error('❌ DataBackupService: Error cleaning up old backups:', error);
    }
  }

  /**
   * Get backup status
   */
  getBackupStatus() {
    return {
      isEnabled: this.isBackupEnabled,
      lastBackupTime: this.lastBackupTime,
      backupCount: this.backupHistory.length,
      nextBackupIn: this.backupInterval ? '30 minutes' : 'disabled'
    };
  }

  /**
   * Enable/disable backups
   */
  setBackupEnabled(enabled) {
    this.isBackupEnabled = enabled;
    
    if (enabled && this.userId) {
      this.startAutomaticBackups();
    } else {
      this.stopAutomaticBackups();
    }
  }

  /**
   * Export backup data for external storage
   */
  async exportBackupData(backupId) {
    if (!this.userId) {
      throw new Error('User ID not set');
    }

    try {
      const dataRef = ref(db, `backup_data/${this.userId}/${backupId}`);
      const dataSnapshot = await get(dataRef);
      
      if (!dataSnapshot.exists()) {
        throw new Error('Backup data not found');
      }

      const userData = dataSnapshot.val();
      const exportData = {
        ...userData,
        exportMetadata: {
          exportedAt: new Date().toISOString(),
          backupId,
          userId: this.userId,
          version: '1.0.0'
        }
      };

      return exportData;

    } catch (error) {
      console.error('❌ DataBackupService: Error exporting backup data:', error);
      throw error;
    }
  }
}

// Create singleton instance
const dataBackupService = new DataBackupService();

export default dataBackupService;
