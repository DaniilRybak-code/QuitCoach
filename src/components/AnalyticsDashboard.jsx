import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Calendar, Target } from 'lucide-react';

const AnalyticsDashboard = ({ user, behavioralService, onClose }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState(30);

  useEffect(() => {
    if (behavioralService && user?.uid) {
      loadAnalytics();
    }
  }, [behavioralService, user?.uid, selectedPeriod]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      // Try to get full analytics first, fallback to basic analytics if indexes aren't ready
      try {
        const analyticsData = await behavioralService.getUserAnalytics(user.uid, selectedPeriod);
        setAnalytics(analyticsData);
      } catch (indexError) {
        console.warn('Full analytics not available (indexes building), using basic analytics:', indexError.message);
        
        // Fallback to basic analytics that don't require compound indexes
        const basicAnalytics = await behavioralService.getBasicAnalytics(user.uid);
        setAnalytics(basicAnalytics);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!behavioralService) {
    return (
      <div className="modal-backdrop">
        <div className="modal-container">
          <div className="modal-content bg-slate-800 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Analytics Dashboard</h2>
          <p className="text-gray-300">Behavioral service not available. Analytics require Firestore connection.</p>
          <button 
            onClick={onClose}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded transition-colors min-h-[44px]"
          >
            Close
          </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <div className="modal-content bg-slate-800 max-w-4xl">
          <div className="modal-scrollable">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Behavioral Analytics</h2>
          </div>
          <div className="flex items-center gap-4">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(parseInt(e.target.value))}
              className="bg-slate-700 text-white px-3 py-3 rounded border border-slate-600 min-h-[44px]"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white w-11 h-11 flex items-center justify-center min-h-[44px] min-w-[44px]"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
              <p className="text-gray-300">Loading behavioral analytics...</p>
            </div>
          ) : analytics ? (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-gray-300 text-sm">Craving Resistance</p>
                      <p className="text-white font-bold">
                        {analytics.cravingStats.total > 0 
                          ? `${((analytics.cravingStats.resisted / analytics.cravingStats.total) * 100).toFixed(1)}%`
                          : 'No data'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-gray-300 text-sm">Wellness Activities</p>
                      <p className="text-white font-bold">{analytics.wellnessStats.totalWellnessActivities}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-gray-300 text-sm">Relapses</p>
                      <p className="text-white font-bold">{analytics.relapseStats.total}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-orange-400">💧</span>
                    <div>
                      <p className="text-gray-300 text-sm">Hydration Days</p>
                      <p className="text-white font-bold">{analytics.wellnessStats.hydrationDays}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Craving Patterns */}
                <div className="bg-slate-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Craving Patterns</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-300 text-sm">Total Cravings</p>
                      <p className="text-white font-bold">{analytics.cravingStats.total}</p>
                    </div>
                    <div>
                      <p className="text-gray-300 text-sm">Average Strength</p>
                      <p className="text-white font-bold">{analytics.cravingStats.averageStrength.toFixed(1)}/10</p>
                    </div>
                    <div>
                      <p className="text-gray-300 text-sm">Common Triggers</p>
                      <div className="space-y-1">
                        {analytics.cravingStats.commonTriggers.slice(0, 3).map((trigger, index) => (
                          <p key={index} className="text-blue-400 text-sm">
                            {trigger.trigger} ({trigger.count}x)
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Wellness Activities */}
                <div className="bg-slate-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Wellness Activities</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">🫁 Breathing Exercises</span>
                      <span className="text-white font-bold">{analytics.wellnessStats.breathingExercises}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">🧘‍♀️ Meditation Sessions</span>
                      <span className="text-white font-bold">{analytics.wellnessStats.meditationSessions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">🚶‍♂️ Physical Activities</span>
                      <span className="text-white font-bold">{analytics.wellnessStats.physicalActivities}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">💧 Hydration Goals Met</span>
                      <span className="text-white font-bold">{analytics.wellnessStats.hydrationDays}</span>
                    </div>
                  </div>
                </div>

                {/* Time Patterns */}
                <div className="bg-slate-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Time Patterns</h3>
                  <div className="space-y-2">
                    <p className="text-gray-300 text-sm">Peak Craving Hours</p>
                    {analytics.cravingStats.timePatterns.map((pattern, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-blue-400">{pattern.hour}:00</span>
                        <span className="text-white">{pattern.count} cravings</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Insights */}
                <div className="bg-slate-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">AI Insights</h3>
                  <div className="space-y-2">
                    {analytics.insights.map((insight, index) => (
                      <p key={index} className="text-gray-300 text-sm">
                        • {insight}
                      </p>
                    ))}
                    {analytics.insights.length === 0 && (
                      <p className="text-gray-400 text-sm italic">
                        More insights will appear as you track more activities.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* System Status */}
              <div className="bg-slate-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4">📡 System Status</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    <span className="text-gray-300 text-sm">Behavioral Service Connected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></span>
                    <span className="text-gray-300 text-sm">Database Indexes Building (may take 5-10 minutes)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                    <span className="text-gray-300 text-sm">Data Logging Active</span>
                  </div>
                </div>
                <p className="text-gray-400 text-xs">
                  Full analytics will be available once indexes are built. Basic analytics are shown in the meantime.
                </p>
              </div>

              {/* Data Export */}
              <div className="bg-slate-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Data Export</h3>
                <p className="text-gray-300 text-sm mb-4">
                  All your behavioral data is stored in Firestore for predictive analytics and research purposes.
                </p>
                <button 
                  onClick={() => {
                    const dataBlob = new Blob([JSON.stringify(analytics, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(dataBlob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `behavioral-analytics-${user.heroName}-${new Date().toISOString().split('T')[0]}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded transition-colors min-h-[44px]"
                >
                  Export Analytics Data
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-300">No analytics data available.</p>
              <p className="text-gray-400 text-sm mt-2">Start tracking activities to see insights!</p>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
