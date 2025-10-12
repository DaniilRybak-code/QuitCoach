import { 
  collection, 
  doc, 
  addDoc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

/**
 * Comprehensive Firestore service for all behavioral data logging
 * Designed for predictive analytics and cross-platform data persistence
 */
class FirestoreBehavioralService {
  constructor(firestore) {
    this.firestore = firestore;
    
    // Collection references for different behavioral data types
    this.collections = {
      // Core behavioral data
      cravings: 'behavioral_cravings',
      relapses: 'behavioral_relapses', 
      
      // Wellness activities
      hydration: 'behavioral_hydration',
      breathing: 'behavioral_breathing',
      meditation: 'behavioral_meditation',
      physicalActivity: 'behavioral_physical_activity',
      
      // Mood and mental state
      moodTracking: 'behavioral_mood',
      stressLevels: 'behavioral_stress',
      
      // Sleep and recovery
      sleepTracking: 'behavioral_sleep',
      
      // Social and environmental
      socialTriggers: 'behavioral_social_triggers',
      environmentalFactors: 'behavioral_environmental'
    };
    
    console.log('🚀 FirestoreBehavioralService initialized for predictive analytics');
  }

  /**
   * Log a craving event with comprehensive data for analytics
   */
  async logCraving(userId, cravingData) {
    try {
      const cravingDocument = {
        userId,
        timestamp: Timestamp.now(),
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
        
        // Core craving data
        outcome: cravingData.outcome, // 'resisted' or 'relapsed'
        strength: cravingData.strength || 0, // 1-10 scale
        duration: cravingData.duration || null, // minutes
        
        // Context and triggers
        context: cravingData.context || 'unknown',
        triggers: cravingData.triggers || [],
        location: cravingData.location || null,
        mood: cravingData.mood || null,
        stressLevel: cravingData.stressLevel || null,
        
        // Coping strategies used
        copingStrategiesUsed: cravingData.copingStrategiesUsed || [],
        helpfulStrategies: cravingData.helpfulStrategies || [],
        
        // Environmental factors
        socialSituation: cravingData.socialSituation || null,
        timeOfDay: new Date().getHours(),
        dayOfWeek: new Date().getDay(),
        
        // Metadata for analytics
        appVersion: '1.0.0',
        deviceType: navigator.userAgent.includes('Mobile') ? 'mobile' : 'desktop'
      };

      const docRef = await addDoc(collection(this.firestore, this.collections.cravings), cravingDocument);
      console.log('✅ Craving logged to Firestore for analytics:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error logging craving to Firestore:', error);
      throw error;
    }
  }

  /**
   * Log a relapse event with escalation tracking
   */
  async logRelapse(userId, relapseData) {
    try {
      const relapseDocument = {
        userId,
        timestamp: Timestamp.now(),
        date: new Date().toISOString().split('T')[0],
        
        // Relapse details
        escalationLevel: relapseData.escalationLevel || 1,
        daysSinceLastRelapse: relapseData.daysSinceLastRelapse || 0,
        
        // Context
        triggers: relapseData.triggers || [],
        mood: relapseData.mood || null,
        stressLevel: relapseData.stressLevel || null,
        location: relapseData.location || null,
        socialSituation: relapseData.socialSituation || null,
        
        // Recovery data
        timeToRelapse: relapseData.timeToRelapse || null, // minutes since last craving
        copingAttempts: relapseData.copingAttempts || [],
        
        // Stats impact
        addictionIncrease: relapseData.addictionIncrease || 0,
        mentalStrengthDecrease: relapseData.mentalStrengthDecrease || 0,
        triggerDefenseDecrease: relapseData.triggerDefenseDecrease || 0,
        
        // Metadata
        timeOfDay: new Date().getHours(),
        dayOfWeek: new Date().getDay()
      };

      const docRef = await addDoc(collection(this.firestore, this.collections.relapses), relapseDocument);
      console.log('✅ Relapse logged to Firestore for analytics:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error logging relapse to Firestore:', error);
      throw error;
    }
  }

  /**
   * Log hydration activity
   */
  async logHydration(userId, hydrationData) {
    try {
      const hydrationDocument = {
        userId,
        timestamp: Timestamp.now(),
        date: new Date().toISOString().split('T')[0],
        
        // Hydration details
        glassesConsumed: hydrationData.glassesConsumed || 0,
        targetGlasses: hydrationData.targetGlasses || 6,
        achievedTarget: (hydrationData.glassesConsumed || 0) >= (hydrationData.targetGlasses || 6),
        
        // Timing
        timeOfDay: new Date().getHours(),
        loggedAt: new Date().toISOString(),
        
        // Streak data
        currentStreak: hydrationData.currentStreak || 0,
        
        // Context
        mood: hydrationData.mood || null,
        energyLevel: hydrationData.energyLevel || null
      };

      const docRef = await addDoc(collection(this.firestore, this.collections.hydration), hydrationDocument);
      console.log('✅ Hydration logged to Firestore for analytics:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error logging hydration to Firestore:', error);
      throw error;
    }
  }

  /**
   * Log breathing exercise completion
   */
  async logBreathingExercise(userId, breathingData) {
    try {
      const breathingDocument = {
        userId,
        timestamp: Timestamp.now(),
        date: new Date().toISOString().split('T')[0],
        
        // Exercise details
        duration: breathingData.duration || 0, // minutes
        breathingRate: breathingData.breathingRate || null, // e.g., "4-7-8"
        completed: breathingData.completed || true,
        
        // Context
        triggerContext: breathingData.triggerContext || null, // what prompted the exercise
        moodBefore: breathingData.moodBefore || null,
        moodAfter: breathingData.moodAfter || null,
        stressLevelBefore: breathingData.stressLevelBefore || null,
        stressLevelAfter: breathingData.stressLevelAfter || null,
        
        // Effectiveness
        helpfulness: breathingData.helpfulness || null, // 1-10 scale
        
        // Timing
        timeOfDay: new Date().getHours(),
        
        // Streak data
        currentStreak: breathingData.currentStreak || 0
      };

      const docRef = await addDoc(collection(this.firestore, this.collections.breathing), breathingDocument);
      console.log('✅ Breathing exercise logged to Firestore for analytics:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error logging breathing exercise to Firestore:', error);
      throw error;
    }
  }

  /**
   * Log meditation session
   */
  async logMeditation(userId, meditationData) {
    try {
      const meditationDocument = {
        userId,
        timestamp: Timestamp.now(),
        date: new Date().toISOString().split('T')[0],
        
        // Session details
        duration: meditationData.duration || 0, // minutes
        type: meditationData.type || 'mindfulness', // mindfulness, body-scan, loving-kindness, etc.
        completed: meditationData.completed || true,
        
        // Context
        triggerContext: meditationData.triggerContext || null,
        moodBefore: meditationData.moodBefore || null,
        moodAfter: meditationData.moodAfter || null,
        stressLevelBefore: meditationData.stressLevelBefore || null,
        stressLevelAfter: meditationData.stressLevelAfter || null,
        
        // Effectiveness
        helpfulness: meditationData.helpfulness || null, // 1-10 scale
        
        // Timing
        timeOfDay: new Date().getHours()
      };

      const docRef = await addDoc(collection(this.firestore, this.collections.meditation), meditationDocument);
      console.log('✅ Meditation logged to Firestore for analytics:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error logging meditation to Firestore:', error);
      throw error;
    }
  }

  /**
   * Log physical activity
   */
  async logPhysicalActivity(userId, activityData) {
    try {
      const activityDocument = {
        userId,
        timestamp: Timestamp.now(),
        date: new Date().toISOString().split('T')[0],
        
        // Activity details
        type: activityData.type || 'walk', // walk, run, gym, yoga, etc.
        duration: activityData.duration || 0, // minutes
        intensity: activityData.intensity || 'moderate', // low, moderate, high
        completed: activityData.completed || true,
        
        // Context
        triggerContext: activityData.triggerContext || null, // craving-triggered or scheduled
        moodBefore: activityData.moodBefore || null,
        moodAfter: activityData.moodAfter || null,
        energyBefore: activityData.energyBefore || null,
        energyAfter: activityData.energyAfter || null,
        
        // Effectiveness
        helpfulness: activityData.helpfulness || null, // 1-10 scale
        cravingReduction: activityData.cravingReduction || null, // 1-10 scale
        
        // Timing
        timeOfDay: new Date().getHours(),
        
        // Location
        location: activityData.location || null // indoor, outdoor, gym, etc.
      };

      const docRef = await addDoc(collection(this.firestore, this.collections.physicalActivity), activityDocument);
      console.log('✅ Physical activity logged to Firestore for analytics:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error logging physical activity to Firestore:', error);
      throw error;
    }
  }

  /**
   * Log mood tracking data
   */
  async logMood(userId, moodData) {
    try {
      const moodDocument = {
        userId,
        timestamp: Timestamp.now(),
        date: new Date().toISOString().split('T')[0],
        
        // Mood details
        mood: moodData.mood, // happy, sad, anxious, stressed, etc.
        intensity: moodData.intensity || 5, // 1-10 scale
        
        // Context
        triggers: moodData.triggers || [],
        activities: moodData.activities || [],
        socialContext: moodData.socialContext || null,
        
        // Timing
        timeOfDay: new Date().getHours(),
        
        // Coping
        copingStrategiesUsed: moodData.copingStrategiesUsed || []
      };

      const docRef = await addDoc(collection(this.firestore, this.collections.moodTracking), moodDocument);
      console.log('✅ Mood logged to Firestore for analytics:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error logging mood to Firestore:', error);
      throw error;
    }
  }

  /**
   * Get user's behavioral data for analytics
   */
  async getUserBehavioralData(userId, dataType, startDate = null, endDate = null) {
    try {
      if (!this.collections[dataType]) {
        throw new Error(`Unknown data type: ${dataType}`);
      }

      let q = query(
        collection(this.firestore, this.collections[dataType]),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc')
      );

      // Add date filtering if provided
      if (startDate) {
        q = query(q, where('timestamp', '>=', Timestamp.fromDate(new Date(startDate))));
      }
      if (endDate) {
        q = query(q, where('timestamp', '<=', Timestamp.fromDate(new Date(endDate))));
      }

      const querySnapshot = await getDocs(q);
      const data = [];
      
      querySnapshot.forEach((doc) => {
        data.push({
          id: doc.id,
          ...doc.data(),
          // Convert Firestore timestamp to JavaScript Date
          timestamp: doc.data().timestamp?.toDate() || new Date()
        });
      });

      console.log(`✅ Retrieved ${data.length} ${dataType} records for analytics`);
      return data;
    } catch (error) {
      console.error(`❌ Error retrieving ${dataType} data:`, error);
      throw error;
    }
  }

  /**
   * Get comprehensive behavioral analytics for a user
   */
  async getUserAnalytics(userId, days = 30) {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      console.log(`📊 Generating behavioral analytics for user ${userId} (last ${days} days)`);

      // Fetch all behavioral data types in parallel
      const [
        cravings,
        relapses,
        hydration,
        breathing,
        meditation,
        physicalActivity,
        moodTracking
      ] = await Promise.all([
        this.getUserBehavioralData(userId, 'cravings', startDate, endDate).catch(e => {
          console.warn('⚠️ Cravings data not available yet (indexes building):', e.message);
          return [];
        }),
        this.getUserBehavioralData(userId, 'relapses', startDate, endDate).catch(e => {
          console.warn('⚠️ Relapses data not available yet (indexes building):', e.message);
          return [];
        }),
        this.getUserBehavioralData(userId, 'hydration', startDate, endDate).catch(e => {
          console.warn('⚠️ Hydration data not available yet (indexes building):', e.message);
          return [];
        }),
        this.getUserBehavioralData(userId, 'breathing', startDate, endDate).catch(e => {
          console.warn('⚠️ Breathing data not available yet (indexes building):', e.message);
          return [];
        }),
        this.getUserBehavioralData(userId, 'meditation', startDate, endDate).catch(e => {
          console.warn('⚠️ Meditation data not available yet (indexes building):', e.message);
          return [];
        }),
        this.getUserBehavioralData(userId, 'physicalActivity', startDate, endDate).catch(e => {
          console.warn('⚠️ Physical activity data not available yet (indexes building):', e.message);
          return [];
        }),
        this.getUserBehavioralData(userId, 'moodTracking', startDate, endDate).catch(e => {
          console.warn('⚠️ Mood data not available yet (indexes building):', e.message);
          return [];
        })
      ]);

      const analytics = {
        userId,
        period: { startDate, endDate, days },
        
        // Craving analytics
        cravingStats: {
          total: cravings.length,
          resisted: cravings.filter(c => c.outcome === 'resisted').length,
          relapsed: cravings.filter(c => c.outcome === 'relapsed').length,
          averageStrength: cravings.length > 0 ? cravings.reduce((sum, c) => sum + (c.strength || 0), 0) / cravings.length : 0,
          commonTriggers: this.getCommonTriggers(cravings),
          timePatterns: this.getTimePatterns(cravings)
        },
        
        // Relapse analytics
        relapseStats: {
          total: relapses.length,
          averageEscalationLevel: relapses.length > 0 ? relapses.reduce((sum, r) => sum + (r.escalationLevel || 1), 0) / relapses.length : 0,
          commonTriggers: this.getCommonTriggers(relapses),
          recoveryTimes: relapses.map(r => r.daysSinceLastRelapse || 0)
        },
        
        // Wellness analytics
        wellnessStats: {
          hydrationDays: hydration.filter(h => h.achievedTarget).length,
          breathingExercises: breathing.length,
          meditationSessions: meditation.length,
          physicalActivities: physicalActivity.length,
          totalWellnessActivities: breathing.length + meditation.length + physicalActivity.length
        },
        
        // Mood analytics
        moodStats: {
          entries: moodTracking.length,
          averageMood: moodTracking.length > 0 ? moodTracking.reduce((sum, m) => sum + (m.intensity || 5), 0) / moodTracking.length : 5,
          moodTrends: this.getMoodTrends(moodTracking)
        },
        
        // Correlation insights
        insights: this.generateInsights(cravings, relapses, hydration, breathing, meditation, physicalActivity, moodTracking),
        
        generatedAt: new Date()
      };

      console.log('📊 Behavioral analytics generated:', analytics);
      return analytics;
    } catch (error) {
      console.error('❌ Error generating user analytics:', error);
      throw error;
    }
  }

  /**
   * Helper: Get common triggers from behavioral data
   */
  getCommonTriggers(data) {
    const triggerCounts = {};
    data.forEach(item => {
      if (item.triggers && Array.isArray(item.triggers)) {
        item.triggers.forEach(trigger => {
          triggerCounts[trigger] = (triggerCounts[trigger] || 0) + 1;
        });
      }
    });
    
    return Object.entries(triggerCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([trigger, count]) => ({ trigger, count }));
  }

  /**
   * Helper: Get time patterns from behavioral data
   */
  getTimePatterns(data) {
    const hourCounts = {};
    data.forEach(item => {
      const hour = item.timeOfDay || new Date(item.timestamp).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    return Object.entries(hourCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([hour, count]) => ({ hour: parseInt(hour), count }));
  }

  /**
   * Helper: Get mood trends
   */
  getMoodTrends(moodData) {
    if (moodData.length < 2) return [];
    
    const sortedMoods = moodData.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    const trends = [];
    
    for (let i = 1; i < sortedMoods.length; i++) {
      const current = sortedMoods[i];
      const previous = sortedMoods[i - 1];
      const change = (current.intensity || 5) - (previous.intensity || 5);
      
      if (Math.abs(change) >= 2) {
        trends.push({
          date: current.date,
          change,
          direction: change > 0 ? 'improved' : 'declined',
          from: previous.mood,
          to: current.mood
        });
      }
    }
    
    return trends.slice(-5); // Last 5 significant mood changes
  }

  /**
   * Helper: Generate behavioral insights
   */
  generateInsights(cravings, relapses, hydration, breathing, meditation, physicalActivity, moodTracking) {
    const insights = [];
    
    // Craving resistance insights
    const resistedCount = cravings.filter(c => c.outcome === 'resisted').length;
    const totalCravings = cravings.length;
    if (totalCravings > 0) {
      const resistanceRate = (resistedCount / totalCravings) * 100;
      insights.push(`Craving resistance rate: ${resistanceRate.toFixed(1)}%`);
    }
    
    // Wellness activity correlation
    const wellnessActivities = breathing.length + meditation.length + physicalActivity.length;
    if (wellnessActivities > 0 && relapses.length > 0) {
      insights.push(`${wellnessActivities} wellness activities vs ${relapses.length} relapses - wellness correlation analysis available`);
    }
    
    // Hydration correlation
    const hydrationDays = hydration.filter(h => h.achievedTarget).length;
    if (hydrationDays > 0) {
      insights.push(`Achieved hydration target on ${hydrationDays} days`);
    }
    
    return insights;
  }

  /**
   * Migrate existing data from Firebase Realtime Database to Firestore
   */
  async migrateUserData(userId, realtimeDb) {
    try {
      console.log(`🔄 Starting data migration for user ${userId} from Realtime DB to Firestore...`);
      
      // Import Firebase Realtime Database functions
      const { ref, get } = await import('firebase/database');
      
      // Migrate cravings data
      const cravingsRef = ref(realtimeDb, `users/${userId}/cravings`);
      const cravingsSnapshot = await get(cravingsRef);
      
      if (cravingsSnapshot.exists()) {
        const cravingsData = cravingsSnapshot.val();
        let migratedCount = 0;
        
        for (const [key, craving] of Object.entries(cravingsData)) {
          try {
            // Convert to new format
            const migratedCraving = {
              userId,
              timestamp: craving.timestamp ? Timestamp.fromDate(new Date(craving.timestamp)) : serverTimestamp(),
              date: craving.date || new Date().toISOString().split('T')[0],
              outcome: craving.outcome || 'unknown',
              strength: craving.strength || 0,
              context: craving.context || 'migrated',
              mood: craving.mood || null,
              triggers: [], // Will need to be filled from user profile
              timeOfDay: craving.timestamp ? new Date(craving.timestamp).getHours() : 12,
              dayOfWeek: craving.timestamp ? new Date(craving.timestamp).getDay() : 0,
              migrated: true,
              originalId: key
            };
            
            await addDoc(collection(this.firestore, this.collections.cravings), migratedCraving);
            migratedCount++;
          } catch (error) {
            console.error(`❌ Error migrating craving ${key}:`, error);
          }
        }
        
        console.log(`✅ Migrated ${migratedCount} cravings to Firestore`);
      }
      
      console.log(`✅ Data migration completed for user ${userId}`);
      return true;
    } catch (error) {
      console.error('❌ Error during data migration:', error);
      throw error;
    }
  }

  /**
   * Test connectivity and permissions
   */
  async testConnectivity() {
    try {
      console.log('🧪 FirestoreBehavioralService: Testing connectivity...');
      
      if (this.firestore && typeof this.firestore.app !== 'undefined') {
        console.log('✅ FirestoreBehavioralService: Ready for behavioral data logging');
        return true;
      } else {
        console.warn('⚠️ FirestoreBehavioralService: Not properly initialized');
        return false;
      }
    } catch (error) {
      console.warn('⚠️ FirestoreBehavioralService: Connectivity test failed:', error?.message || error);
      return false;
    }
  }

  /**
   * Get basic analytics without complex queries (fallback for when indexes are building)
   */
  async getBasicAnalytics(userId) {
    try {
      console.log(`📊 Getting basic analytics for user ${userId} (no indexes required)`);
      
      // Simple count queries that don't require compound indexes
      const collections = [
        'behavioral_cravings',
        'behavioral_relapses', 
        'behavioral_hydration',
        'behavioral_breathing',
        'behavioral_meditation',
        'behavioral_physical_activity'
      ];

      const counts = {};
      
      for (const collectionName of collections) {
        try {
          const q = query(
            collection(this.db, collectionName),
            where("userId", "==", userId)
          );
          const snapshot = await getDocs(q);
          counts[collectionName] = snapshot.size;
        } catch (error) {
          console.warn(`⚠️ Could not get count for ${collectionName}:`, error.message);
          counts[collectionName] = 0;
        }
      }

      return {
        userId,
        cravingStats: {
          total: counts.behavioral_cravings || 0,
          resisted: Math.max(0, counts.behavioral_cravings - counts.behavioral_relapses),
          averageStrength: 5, // Default placeholder
          commonTriggers: [],
          timePatterns: []
        },
        relapseStats: {
          total: counts.behavioral_relapses || 0
        },
        wellnessStats: {
          breathingExercises: counts.behavioral_breathing || 0,
          meditationSessions: counts.behavioral_meditation || 0,
          physicalActivities: counts.behavioral_physical_activity || 0,
          hydrationDays: counts.behavioral_hydration || 0,
          totalWellnessActivities: (counts.behavioral_breathing || 0) + 
                                   (counts.behavioral_meditation || 0) + 
                                   (counts.behavioral_physical_activity || 0)
        },
        insights: [
          'Analytics dashboard is ready for behavioral tracking!',
          'Indexes are being built for advanced analytics.',
          'Start logging activities to see detailed insights.'
        ]
      };
    } catch (error) {
      console.error('❌ Error generating basic analytics:', error);
      throw error;
    }
  }
}

export default FirestoreBehavioralService;
