import React, { useState, useEffect } from 'react';
import { X, Activity, Database, Shield, Wifi, AlertTriangle, CheckCircle, Clock, BarChart3, Play, Square, RefreshCw } from 'lucide-react';

const PerformanceDashboard = ({ isOpen, onClose }) => {
  const [metrics, setMetrics] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Refresh metrics every 5 seconds
  useEffect(() => {
    if (!isOpen) return;

    const refreshMetrics = () => {
      if (window.performanceIntegrationService) {
        const currentMetrics = window.performanceIntegrationService.getMetricsSummary();
        const currentAlerts = window.performanceIntegrationService.getRecentAlerts(20);
        setMetrics(currentMetrics);
        setAlerts(currentAlerts);
      }
    };

    refreshMetrics();

    if (autoRefresh) {
      const interval = setInterval(refreshMetrics, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen, autoRefresh]);

  const runStressTest = async (testType) => {
    if (!window.stressTestService) return;

    setIsRunning(true);
    try {
      let result;
      switch (testType) {
        case 'database':
          result = await window.stressTestService.databaseLoadTest({
            concurrentUsers: 5,
            operationsPerUser: 3
          });
          break;
        case 'auth':
          result = await window.stressTestService.authLoadTest({
            concurrentAttempts: 10
          });
          break;
        case 'offline':
          result = await window.stressTestService.offlineOnlineTest({
            transitionCount: 3
          });
          break;
        case 'memory':
          result = await window.stressTestService.memoryUsageTest({
            iterations: 50
          });
          break;
        default:
          throw new Error('Unknown test type');
      }
      
      console.log(`✅ Stress test completed:`, result);
    } catch (error) {
      console.error('❌ Stress test failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const clearMetrics = () => {
    if (window.performanceIntegrationService) {
      window.performanceIntegrationService.clearAllMetrics();
      setMetrics(null);
      setAlerts([]);
    }
  };

  const getAlertIcon = (type) => {
    if (type.includes('slow')) return <Clock className="w-4 h-4 text-yellow-500" />;
    if (type.includes('failure') || type.includes('error')) return <AlertTriangle className="w-4 h-4 text-red-500" />;
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  };

  const getAlertColor = (type) => {
    if (type.includes('slow')) return 'bg-yellow-50 border-yellow-200';
    if (type.includes('failure') || type.includes('error')) return 'bg-red-50 border-red-200';
    return 'bg-green-50 border-green-200';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Activity className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Performance Dashboard</h2>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm ${
                autoRefresh ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
              <span>Auto Refresh</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'database', label: 'Database', icon: Database },
            { id: 'auth', label: 'Authentication', icon: Shield },
            { id: 'offline', label: 'Offline Queue', icon: Wifi },
            { id: 'alerts', label: 'Alerts', icon: AlertTriangle }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Database Queries</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {metrics?.database?.totalQueries || 0}
                      </p>
                    </div>
                    <Database className="w-8 h-8 text-blue-500" />
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    Avg: {metrics?.database?.averageQueryTime || 0}ms
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Auth Success Rate</p>
                      <p className="text-2xl font-bold text-green-900">
                        {metrics?.authentication?.successRate || 0}%
                      </p>
                    </div>
                    <Shield className="w-8 h-8 text-green-500" />
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    {metrics?.authentication?.totalAttempts || 0} attempts
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Offline Operations</p>
                      <p className="text-2xl font-bold text-purple-900">
                        {metrics?.offlineQueue?.totalOperations || 0}
                      </p>
                    </div>
                    <Wifi className="w-8 h-8 text-purple-500" />
                  </div>
                  <p className="text-xs text-purple-600 mt-1">
                    Success: {metrics?.offlineQueue?.successRate || 0}%
                  </p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600">Page Loads</p>
                      <p className="text-2xl font-bold text-orange-900">
                        {metrics?.general?.totalPageLoads || 0}
                      </p>
                    </div>
                    <Activity className="w-8 h-8 text-orange-500" />
                  </div>
                  <p className="text-xs text-orange-600 mt-1">
                    Avg: {metrics?.general?.averagePageLoadTime || 0}ms
                  </p>
                </div>
              </div>

              {/* Stress Test Controls */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Stress Testing</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button
                    onClick={() => runStressTest('database')}
                    disabled={isRunning}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isRunning ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>Database Load</span>
                  </button>
                  <button
                    onClick={() => runStressTest('auth')}
                    disabled={isRunning}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isRunning ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>Auth Load</span>
                  </button>
                  <button
                    onClick={() => runStressTest('offline')}
                    disabled={isRunning}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isRunning ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>Offline/Online</span>
                  </button>
                  <button
                    onClick={() => runStressTest('memory')}
                    disabled={isRunning}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isRunning ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>Memory Usage</span>
                  </button>
                </div>
                {isRunning && (
                  <div className="mt-4 text-center">
                    <div className="inline-flex items-center space-x-2 text-blue-600">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Running stress test...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex justify-between items-center">
                <button
                  onClick={clearMetrics}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Clear All Metrics
                </button>
                <div className="text-sm text-gray-500">
                  Last updated: {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Database Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Query Statistics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Queries:</span>
                      <span className="font-medium">{metrics?.database?.totalQueries || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Average Time:</span>
                      <span className="font-medium">{metrics?.database?.averageQueryTime || 0}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Slow Queries:</span>
                      <span className="font-medium text-yellow-600">{metrics?.database?.slowQueries || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Slow Query Rate:</span>
                      <span className="font-medium">{metrics?.database?.slowQueryRate || 0}%</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Performance Trends</h4>
                  <div className="text-center text-gray-500 py-8">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>Performance trends will be displayed here</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'auth' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Authentication Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Auth Statistics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Attempts:</span>
                      <span className="font-medium">{metrics?.authentication?.totalAttempts || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Success Rate:</span>
                      <span className="font-medium text-green-600">{metrics?.authentication?.successRate || 0}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Failed Attempts:</span>
                      <span className="font-medium text-red-600">{metrics?.authentication?.failedAttempts || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Average Time:</span>
                      <span className="font-medium">{metrics?.authentication?.averageLoginTime || 0}ms</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Recent Attempts</h4>
                  <div className="text-center text-gray-500 py-8">
                    <Shield className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>Recent authentication attempts will be displayed here</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'offline' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Offline Queue Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Queue Statistics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Operations:</span>
                      <span className="font-medium">{metrics?.offlineQueue?.totalOperations || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Success Rate:</span>
                      <span className="font-medium text-green-600">{metrics?.offlineQueue?.successRate || 0}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Failed Operations:</span>
                      <span className="font-medium text-red-600">{metrics?.offlineQueue?.failedOperations || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Average Time:</span>
                      <span className="font-medium">{metrics?.offlineQueue?.averageProcessTime || 0}ms</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Queue Status</h4>
                  <div className="text-center text-gray-500 py-8">
                    <Wifi className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>Offline queue status will be displayed here</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Performance Alerts</h3>
              <div className="space-y-3">
                {alerts.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-400" />
                    <p>No alerts at this time</p>
                  </div>
                ) : (
                  alerts.map((alert, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${getAlertColor(alert.type)}`}
                    >
                      <div className="flex items-start space-x-3">
                        {getAlertIcon(alert.type)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900 capitalize">
                              {alert.type.replace(/_/g, ' ')}
                            </h4>
                            <span className="text-xs text-gray-500">
                              {new Date(alert.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {JSON.stringify(alert.data, null, 2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard;
