/**
 * Optimized Behavioral Service
 * Uses efficient query patterns, caching, and pagination for better mobile performance
 */

import OptimizedFirestoreService from './optimizedFirestoreService.js';

class OptimizedBehavioralService {
  constructor(firestore) {
    this.firestore = firestore;
    this.optimizedService = new OptimizedFirestoreService(firestore);
    
    // Collection references
    this.collections = {
      cravings: 'behavioral_cravings',
      relapses: 'behavioral_relapses',
      hydration: 'behavioral_hydration',
      breathing: 'behavioral_breathing',
      meditation: 'behavioral_meditation',
      physicalActivity: 'behavioral_physical_activity',
      moodTracking: 'behavioral_mood',
      stressLevels: 'behavioral_stress',
      sleepTracking: 'behavioral_sleep',
      socialTriggers: 'behavioral_social_triggers',
      environmentalFactors: 'behavioral_environmental'
    };
    
    console.log('🚀 OptimizedBehavioralService initialized');
  }

  // ===== OPTIMIZED DATA RETRIEVAL =====
  
  /**
   * Get recent behavioral data with pagination
   */
  async getRecentData(userId, dataType, options = {}) {
    const {
      days = 7,
      pageSize = 20,
      page = 1,
      filters = {},
      useCache = true
    } = options;

    const collectionName = this.collections[dataType];
    if (!collectionName) {
      throw new Error(`Unknown data type: ${dataType}`);
    }

    try {
      const result = await this.optimizedService.getPaginatedBehavioralData(
        collectionName,
        userId,
        {
          pageSize,
          startAfterDoc: null, // TODO: Implement pagination cursor
          orderByField: 'timestamp',
          orderDirection: 'desc',
          filters,
          useCache
        }
      );

      return {
        data: result.data,
        pagination: {
          page,
          pageSize,
          hasMore: result.hasMore,
          totalFetched: result.totalFetched
        }
      };
    } catch (error) {
      console.error(`❌ Error retrieving recent ${dataType} data:`, error);
      throw error;
    }
  }

  /**
   * Get behavioral data summary without fetching all records
   */
  async getDataSummary(userId, dataType, days = 30) {
    const collectionName = this.collections[dataType];
    if (!collectionName) {
      throw new Error(`Unknown data type: ${dataType}`);
    }

    try {
      return await this.optimizedService.getBehavioralDataSummary(
        userId,
        dataType,
        days
      );
    } catch (error) {
      console.error(`❌ Error retrieving ${dataType} summary:`, error);
      throw error;
    }
  }

  /**
   * Get cravings with outcome filtering
   */
  async getCravingsByOutcome(userId, outcome, options = {}) {
    const {
      days = 30,
      pageSize = 20,
      useCache = true
    } = options;

    try {
      const result = await this.optimizedService.getPaginatedBehavioralData(
        this.collections.cravings,
        userId,
        {
          pageSize,
          filters: { outcome },
          useCache
        }
      );

      return result;
    } catch (error) {
      console.error('❌ Error retrieving cravings by outcome:', error);
      throw error;
    }
  }

  /**
   * Get high-intensity cravings (strength >= 7)
   */
  async getHighIntensityCravings(userId, options = {}) {
    const {
      days = 30,
      pageSize = 20,
      minStrength = 7,
      useCache = true
    } = options;

    try {
      // Note: This would require a composite index for strength + timestamp
      const result = await this.optimizedService.getPaginatedBehavioralData(
        this.collections.cravings,
        userId,
        {
          pageSize,
          filters: { strength: minStrength },
          useCache
        }
      );

      // Filter by strength on client side if needed
      const filteredData = result.data.filter(item => 
        item.strength >= minStrength
      );

      return {
        ...result,
        data: filteredData
      };
    } catch (error) {
      console.error('❌ Error retrieving high-intensity cravings:', error);
      throw error;
    }
  }

  // ===== ANALYTICS OPTIMIZATION =====
  
  /**
   * Get comprehensive analytics with minimal data fetching
   */
  async getOptimizedAnalytics(userId, days = 30) {
    try {
      console.log(`📊 Generating optimized analytics for user ${userId} (last ${days} days)`);

      // Get summaries for all data types in parallel
      const [
        cravingsSummary,
        relapsesSummary,
        hydrationSummary,
        breathingSummary,
        meditationSummary,
        physicalActivitySummary,
        moodSummary,
        stressSummary,
        sleepSummary
      ] = await Promise.all([
        this.getDataSummary(userId, 'cravings', days),
        this.getDataSummary(userId, 'relapses', days),
        this.getDataSummary(userId, 'hydration', days),
        this.getDataSummary(userId, 'breathing', days),
        this.getDataSummary(userId, 'meditation', days),
        this.getDataSummary(userId, 'physicalActivity', days),
        this.getDataSummary(userId, 'moodTracking', days),
        this.getDataSummary(userId, 'stressLevels', days),
        this.getDataSummary(userId, 'sleepTracking', days)
      ]);

      // Calculate insights
      const insights = this.calculateInsights({
        cravings: cravingsSummary,
        relapses: relapsesSummary,
        hydration: hydrationSummary,
        breathing: breathingSummary,
        meditation: meditationSummary,
        physicalActivity: physicalActivitySummary,
        mood: moodSummary,
        stress: stressSummary,
        sleep: sleepSummary
      });

      return {
        summaries: {
          cravings: cravingsSummary,
          relapses: relapsesSummary,
          hydration: hydrationSummary,
          breathing: breathingSummary,
          meditation: meditationSummary,
          physicalActivity: physicalActivitySummary,
          mood: moodSummary,
          stress: stressSummary,
          sleep: sleepSummary
        },
        insights,
        period: { days, startDate: cravingsSummary.period.startDate, endDate: cravingsSummary.period.endDate }
      };
    } catch (error) {
      console.error('❌ Error generating optimized analytics:', error);
      throw error;
    }
  }

  /**
   * Calculate insights from summaries
   */
  calculateInsights(summaries) {
    const insights = {
      trends: {},
      recommendations: [],
      riskFactors: [],
      positivePatterns: []
    };

    // Cravings analysis
    if (summaries.cravings.totalCount > 0) {
      const avgCravingsPerDay = summaries.cravings.totalCount / summaries.cravings.period.days;
      insights.trends.cravingsPerDay = avgCravingsPerDay;
      
      if (avgCravingsPerDay > 3) {
        insights.riskFactors.push('High craving frequency detected');
        insights.recommendations.push('Consider increasing coping strategies');
      }
    }

    // Relapse analysis
    if (summaries.relapses.totalCount > 0) {
      const relapseRate = summaries.relapses.totalCount / summaries.relapses.period.days;
      insights.trends.relapseRate = relapseRate;
      
      if (relapseRate > 0.1) {
        insights.riskFactors.push('High relapse rate detected');
        insights.recommendations.push('Consider seeking additional support');
      }
    }

    // Hydration analysis
    if (summaries.hydration.averageValue > 0) {
      insights.trends.avgHydration = summaries.hydration.averageValue;
      
      if (summaries.hydration.averageValue < 2000) {
        insights.recommendations.push('Increase daily water intake');
      } else {
        insights.positivePatterns.push('Good hydration habits maintained');
      }
    }

    // Mood analysis
    if (summaries.mood.averageValue > 0) {
      insights.trends.avgMood = summaries.mood.averageValue;
      
      if (summaries.mood.averageValue < 5) {
        insights.riskFactors.push('Low mood patterns detected');
        insights.recommendations.push('Consider mood tracking and support');
      } else if (summaries.mood.averageValue > 7) {
        insights.positivePatterns.push('Positive mood patterns maintained');
      }
    }

    // Stress analysis
    if (summaries.stress.averageValue > 0) {
      insights.trends.avgStress = summaries.stress.averageValue;
      
      if (summaries.stress.averageValue > 7) {
        insights.riskFactors.push('High stress levels detected');
        insights.recommendations.push('Practice stress management techniques');
      }
    }

    // Sleep analysis
    if (summaries.sleep.averageValue > 0) {
      insights.trends.avgSleep = summaries.sleep.averageValue;
      
      if (summaries.sleep.averageValue < 6) {
        insights.riskFactors.push('Insufficient sleep detected');
        insights.recommendations.push('Improve sleep hygiene');
      } else if (summaries.sleep.averageValue >= 7) {
        insights.positivePatterns.push('Good sleep habits maintained');
      }
    }

    return insights;
  }

  // ===== CACHE MANAGEMENT =====
  
  /**
   * Clear cache for specific user
   */
  clearUserCache(userId) {
    Object.values(this.collections).forEach(collectionName => {
      this.optimizedService.clearCacheForCollection(collectionName);
    });
    console.log(`🗑️ Cleared cache for user ${userId}`);
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return this.optimizedService.getCacheStats();
  }

  // ===== BACKWARD COMPATIBILITY =====
  
  /**
   * Get behavioral data (backward compatible with existing code)
   */
  async getBehavioralData(userId, dataType, options = {}) {
    const {
      startDate = null,
      endDate = null,
      limitCount = 100
    } = options;

    try {
      const result = await this.optimizedService.getPaginatedBehavioralData(
        this.collections[dataType],
        userId,
        {
          pageSize: limitCount,
          filters: {
            ...(startDate && { timestamp: { gte: startDate } }),
            ...(endDate && { timestamp: { lte: endDate } })
          }
        }
      );

      return result.data;
    } catch (error) {
      console.error(`❌ Error retrieving ${dataType} data:`, error);
      throw error;
    }
  }

  /**
   * Log behavioral data (backward compatible)
   */
  async logBehavioralData(userId, dataType, data) {
    try {
      const collectionName = this.collections[dataType];
      if (!collectionName) {
        throw new Error(`Unknown data type: ${dataType}`);
      }

      // Use the original logging method for now
      // TODO: Implement optimized logging with batch operations
      const { addDoc, collection, serverTimestamp } = await import('firebase/firestore');
      
      const document = {
        userId,
        timestamp: serverTimestamp(),
        ...data
      };

      const docRef = await addDoc(collection(this.firestore, collectionName), document);
      
      // Clear cache for this collection
      this.optimizedService.clearCacheForCollection(collectionName);
      
      console.log(`✅ Logged ${dataType} data:`, docRef.id);
      return docRef.id;
    } catch (error) {
      console.error(`❌ Error logging ${dataType} data:`, error);
      throw error;
    }
  }
}

export default OptimizedBehavioralService;
