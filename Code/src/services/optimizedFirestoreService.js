/**
 * Optimized Firestore Service
 * Provides efficient query patterns, caching, and pagination for mobile users
 */

import { 
  collection, 
  doc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  getDocs, 
  getDoc,
  onSnapshot,
  Timestamp,
  writeBatch
} from 'firebase/firestore';

class OptimizedFirestoreService {
  constructor(firestore) {
    this.firestore = firestore;
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    this.maxCacheSize = 100; // Maximum cached queries
    
    console.log('🚀 OptimizedFirestoreService initialized');
  }

  // ===== QUERY CACHING =====
  
  /**
   * Generate cache key for query
   */
  generateCacheKey(collectionName, queryParams) {
    return `${collectionName}_${JSON.stringify(queryParams)}`;
  }

  /**
   * Check if query result is cached and valid
   */
  getCachedResult(cacheKey) {
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      console.log('📦 Cache hit for query:', cacheKey);
      return cached.data;
    }
    return null;
  }

  /**
   * Cache query result
   */
  setCachedResult(cacheKey, data) {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxCacheSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    
    console.log('💾 Cached query result:', cacheKey);
  }

  /**
   * Clear cache for specific collection
   */
  clearCacheForCollection(collectionName) {
    for (const [key, value] of this.cache.entries()) {
      if (key.startsWith(collectionName)) {
        this.cache.delete(key);
      }
    }
    console.log('🗑️ Cleared cache for collection:', collectionName);
  }

  // ===== PAGINATED QUERIES =====
  
  /**
   * Get paginated behavioral data with caching
   */
  async getPaginatedBehavioralData(collectionName, userId, options = {}) {
    const {
      pageSize = 20,
      startAfterDoc = null,
      orderByField = 'timestamp',
      orderDirection = 'desc',
      filters = {},
      useCache = true
    } = options;

    const cacheKey = this.generateCacheKey(collectionName, {
      userId,
      pageSize,
      startAfterDoc: startAfterDoc?.id,
      orderByField,
      orderDirection,
      filters
    });

    // Check cache first
    if (useCache) {
      const cached = this.getCachedResult(cacheKey);
      if (cached) return cached;
    }

    try {
      let q = query(
        collection(this.firestore, collectionName),
        where('userId', '==', userId),
        orderBy(orderByField, orderDirection),
        limit(pageSize)
      );

      // Add filters
      Object.entries(filters).forEach(([field, value]) => {
        if (value !== undefined && value !== null) {
          q = query(q, where(field, '==', value));
        }
      });

      // Add pagination
      if (startAfterDoc) {
        q = query(q, startAfter(startAfterDoc));
      }

      const querySnapshot = await getDocs(q);
      const data = [];
      let lastDoc = null;

      querySnapshot.forEach((doc) => {
        data.push({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() || new Date()
        });
        lastDoc = doc;
      });

      const result = {
        data,
        lastDoc,
        hasMore: data.length === pageSize,
        totalFetched: data.length
      };

      // Cache the result
      if (useCache) {
        this.setCachedResult(cacheKey, result);
      }

      console.log(`✅ Retrieved ${data.length} ${collectionName} records (paginated)`);
      return result;
    } catch (error) {
      console.error(`❌ Error retrieving paginated ${collectionName} data:`, error);
      throw error;
    }
  }

  // ===== OPTIMIZED BEHAVIORAL DATA QUERIES =====
  
  /**
   * Get recent behavioral data with smart caching
   */
  async getRecentBehavioralData(userId, dataType, days = 7, pageSize = 50) {
    const collectionName = `behavioral_${dataType}`;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const cacheKey = this.generateCacheKey(collectionName, {
      userId,
      days,
      pageSize,
      type: 'recent'
    });

    const cached = this.getCachedResult(cacheKey);
    if (cached) return cached;

    try {
      const q = query(
        collection(this.firestore, collectionName),
        where('userId', '==', userId),
        where('timestamp', '>=', Timestamp.fromDate(startDate)),
        where('timestamp', '<=', Timestamp.fromDate(endDate)),
        orderBy('timestamp', 'desc'),
        limit(pageSize)
      );

      const querySnapshot = await getDocs(q);
      const data = [];

      querySnapshot.forEach((doc) => {
        data.push({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() || new Date()
        });
      });

      this.setCachedResult(cacheKey, data);
      console.log(`✅ Retrieved ${data.length} recent ${dataType} records`);
      return data;
    } catch (error) {
      console.error(`❌ Error retrieving recent ${dataType} data:`, error);
      throw error;
    }
  }

  /**
   * Get behavioral data summary (counts, averages) without fetching all data
   */
  async getBehavioralDataSummary(userId, dataType, days = 30) {
    const collectionName = `behavioral_${dataType}`;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const cacheKey = this.generateCacheKey(collectionName, {
      userId,
      days,
      type: 'summary'
    });

    const cached = this.getCachedResult(cacheKey);
    if (cached) return cached;

    try {
      // Get only essential fields for summary
      const q = query(
        collection(this.firestore, collectionName),
        where('userId', '==', userId),
        where('timestamp', '>=', Timestamp.fromDate(startDate)),
        where('timestamp', '<=', Timestamp.fromDate(endDate)),
        orderBy('timestamp', 'desc')
      );

      const querySnapshot = await getDocs(q);
      let totalCount = 0;
      let totalValue = 0;
      const dailyData = {};

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        totalCount++;
        
        // Calculate daily summaries
        const date = data.timestamp?.toDate()?.toDateString() || new Date().toDateString();
        if (!dailyData[date]) {
          dailyData[date] = { count: 0, totalValue: 0 };
        }
        dailyData[date].count++;
        
        // Sum numeric values for averages
        if (data.strength !== undefined) {
          totalValue += data.strength;
          dailyData[date].totalValue += data.strength;
        } else if (data.duration !== undefined) {
          totalValue += data.duration;
          dailyData[date].totalValue += data.duration;
        }
      });

      const summary = {
        totalCount,
        averageValue: totalCount > 0 ? totalValue / totalCount : 0,
        dailyData,
        period: { startDate, endDate, days }
      };

      this.setCachedResult(cacheKey, summary);
      console.log(`✅ Generated ${dataType} summary for ${days} days`);
      return summary;
    } catch (error) {
      console.error(`❌ Error generating ${dataType} summary:`, error);
      throw error;
    }
  }

  // ===== OPTIMIZED BUDDY MATCHING QUERIES =====
  
  /**
   * Get available users for matching with pagination
   */
  async getAvailableUsersForMatching(userId, pageSize = 10, startAfterDoc = null) {
    const cacheKey = this.generateCacheKey('matchingPool', {
      userId,
      pageSize,
      startAfterDoc: startAfterDoc?.id,
      type: 'available'
    });

    const cached = this.getCachedResult(cacheKey);
    if (cached) return cached;

    try {
      let q = query(
        collection(this.firestore, 'matchingPool'),
        where('availableForMatching', '==', true),
        where('userId', '!=', userId),
        orderBy('lastActive', 'desc'),
        limit(pageSize)
      );

      if (startAfterDoc) {
        q = query(q, startAfter(startAfterDoc));
      }

      const querySnapshot = await getDocs(q);
      const users = [];
      let lastDoc = null;

      querySnapshot.forEach((doc) => {
        users.push({
          id: doc.id,
          ...doc.data()
        });
        lastDoc = doc;
      });

      const result = {
        users,
        lastDoc,
        hasMore: users.length === pageSize
      };

      this.setCachedResult(cacheKey, result);
      console.log(`✅ Retrieved ${users.length} available users for matching`);
      return result;
    } catch (error) {
      console.error('❌ Error retrieving available users:', error);
      throw error;
    }
  }

  /**
   * Get user's buddy pair with caching
   */
  async getUserBuddyPair(userId) {
    const cacheKey = this.generateCacheKey('buddyPairs', {
      userId,
      type: 'userPair'
    });

    const cached = this.getCachedResult(cacheKey);
    if (cached) return cached;

    try {
      // Query both user1Id and user2Id in parallel
      const q1 = query(
        collection(this.firestore, 'buddyPairs'),
        where('user1Id', '==', userId),
        where('status', '==', 'active')
      );
      
      const q2 = query(
        collection(this.firestore, 'buddyPairs'),
        where('user2Id', '==', userId),
        where('status', '==', 'active')
      );

      const [snapshot1, snapshot2] = await Promise.all([
        getDocs(q1),
        getDocs(q2)
      ]);

      let buddyPair = null;
      if (!snapshot1.empty) {
        const doc = snapshot1.docs[0];
        buddyPair = { id: doc.id, ...doc.data() };
      } else if (!snapshot2.empty) {
        const doc = snapshot2.docs[0];
        buddyPair = { id: doc.id, ...doc.data() };
      }

      this.setCachedResult(cacheKey, buddyPair);
      console.log(`✅ Retrieved buddy pair for user ${userId}`);
      return buddyPair;
    } catch (error) {
      console.error('❌ Error retrieving buddy pair:', error);
      throw error;
    }
  }

  // ===== EFFICIENT REAL-TIME LISTENERS =====
  
  /**
   * Create optimized real-time listener with debouncing
   */
  createOptimizedListener(collectionName, queryParams, callback, options = {}) {
    const {
      debounceMs = 1000,
      maxRetries = 3,
      retryDelay = 5000
    } = options;

    let debounceTimer = null;
    let retryCount = 0;
    let isActive = true;

    const debouncedCallback = (snapshot) => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      
      debounceTimer = setTimeout(() => {
        if (isActive) {
          try {
            callback(snapshot);
            retryCount = 0; // Reset retry count on success
          } catch (error) {
            console.error('❌ Error in real-time listener callback:', error);
            if (retryCount < maxRetries) {
              retryCount++;
              setTimeout(() => {
                if (isActive) {
                  console.log(`🔄 Retrying listener (attempt ${retryCount}/${maxRetries})`);
                  // Recreate listener on retry
                  this.createOptimizedListener(collectionName, queryParams, callback, options);
                }
              }, retryDelay);
            }
          }
        }
      }, debounceMs);
    };

    try {
      const q = this.buildQuery(collectionName, queryParams);
      const unsubscribe = onSnapshot(q, debouncedCallback, (error) => {
        console.error('❌ Real-time listener error:', error);
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(() => {
            if (isActive) {
              console.log(`🔄 Retrying listener after error (attempt ${retryCount}/${maxRetries})`);
              this.createOptimizedListener(collectionName, queryParams, callback, options);
            }
          }, retryDelay);
        }
      });

      // Return enhanced unsubscribe function
      return () => {
        isActive = false;
        if (debounceTimer) {
          clearTimeout(debounceTimer);
        }
        unsubscribe();
      };
    } catch (error) {
      console.error('❌ Error creating real-time listener:', error);
      throw error;
    }
  }

  /**
   * Build query from parameters
   */
  buildQuery(collectionName, queryParams) {
    const { whereClauses = [], orderByClauses = [], limitCount = null } = queryParams;
    
    let q = collection(this.firestore, collectionName);
    
    whereClauses.forEach(clause => {
      q = query(q, where(clause.field, clause.operator, clause.value));
    });
    
    orderByClauses.forEach(clause => {
      q = query(q, orderBy(clause.field, clause.direction || 'asc'));
    });
    
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    
    return q;
  }

  // ===== BATCH OPERATIONS =====
  
  /**
   * Perform batch write operations for better performance
   */
  async batchWrite(operations) {
    const batch = writeBatch(this.firestore);
    
    operations.forEach(operation => {
      const { type, collection, docId, data } = operation;
      const docRef = doc(this.firestore, collection, docId);
      
      switch (type) {
        case 'set':
          batch.set(docRef, data);
          break;
        case 'update':
          batch.update(docRef, data);
          break;
        case 'delete':
          batch.delete(docRef);
          break;
        default:
          throw new Error(`Unknown batch operation type: ${type}`);
      }
    });
    
    try {
      await batch.commit();
      console.log(`✅ Batch write completed: ${operations.length} operations`);
      
      // Clear relevant cache entries
      operations.forEach(op => {
        this.clearCacheForCollection(op.collection);
      });
    } catch (error) {
      console.error('❌ Batch write failed:', error);
      throw error;
    }
  }

  // ===== MOBILE OPTIMIZATION =====
  
  /**
   * Get lightweight user stats for mobile
   */
  async getLightweightUserStats(userId) {
    const cacheKey = this.generateCacheKey('users', {
      userId,
      type: 'lightweightStats'
    });

    const cached = this.getCachedResult(cacheKey);
    if (cached) return cached;

    try {
      const userDoc = await getDoc(doc(this.firestore, 'users', userId));
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      const userData = userDoc.data();
      const lightweightStats = {
        streak: userData.stats?.streakDisplayText || '0 days',
        cravingsResisted: userData.stats?.cravingsResisted || 0,
        addictionLevel: userData.stats?.addictionLevel || 0,
        mentalStrength: userData.stats?.mentalStrength || 0,
        lastUpdated: userData.stats?.lastUpdated || new Date().toISOString()
      };

      this.setCachedResult(cacheKey, lightweightStats);
      console.log(`✅ Retrieved lightweight stats for user ${userId}`);
      return lightweightStats;
    } catch (error) {
      console.error('❌ Error retrieving lightweight user stats:', error);
      throw error;
    }
  }

  // ===== CACHE MANAGEMENT =====
  
  /**
   * Clear all cache
   */
  clearAllCache() {
    this.cache.clear();
    console.log('🗑️ Cleared all cache');
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
      timeout: this.cacheTimeout,
      entries: Array.from(this.cache.keys())
    };
  }
}

export default OptimizedFirestoreService;
