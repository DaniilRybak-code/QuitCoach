import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Activity, 
  Shield, 
  AlertTriangle, 
  Database, 
  Wifi, 
  Clock, 
  BarChart3, 
  RefreshCw,
  Download,
  Eye,
  EyeOff,
  Lock,
  Unlock
} from 'lucide-react';

const BetaMonitoringDashboard = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [monitoringData, setMonitoringData] = useState(null);
  const [privacyMode, setPrivacyMode] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Refresh monitoring data
  const refreshData = async () => {
    if (!isOpen) return;

    setIsLoading(true);
    try {
      const data = await gatherMonitoringData();
      setMonitoringData(data);
    } catch (error) {
      console.error('❌ BetaMonitoringDashboard: Error refreshing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Gather comprehensive monitoring data
  const gatherMonitoringData = async () => {
    const data = {
      timestamp: new Date().toISOString(),
      userMetrics: await getUserMetrics(),
      systemHealth: await getSystemHealth(),
      errorStats: await getErrorStats(),
      performanceMetrics: await getPerformanceMetrics(),
      privacyCompliance: await getPrivacyCompliance(),
      rateLimiting: await getRateLimitingStats(),
      dataBackup: await getDataBackupStats()
    };

    return data;
  };

  // Get user metrics (anonymized)
  const getUserMetrics = async () => {
    if (!window.privacyProtectionService) return null;

    const settings = window.privacyProtectionService.getPrivacySettings();
    const auditLog = window.privacyProtectionService.getAuditLog();

    return {
      hasConsent: settings.hasConsent,
      privacyMode: settings.isPrivacyModeEnabled,
      dataRetentionDays: settings.dataRetentionDays,
      auditEvents: auditLog.length,
      lastConsentUpdate: auditLog.find(e => e.eventType === 'consent_granted')?.timestamp
    };
  };

  // Get system health metrics
  const getSystemHealth = async () => {
    if (!window.gracefulDegradationService) return null;

    const status = window.gracefulDegradationService.getServiceStatus();
    
    return {
      firebase: status.firebase,
      firestore: status.firestore,
      offline: status.offline,
      degradationMode: status.degradationMode,
      fallbackDataCount: status.fallbackDataCount
    };
  };

  // Get error statistics
  const getErrorStats = async () => {
    if (!window.errorLoggingService) return null;

    const queueStatus = window.errorLoggingService.getErrorQueueStatus();
    const recentErrors = await window.errorLoggingService.getRecentErrors(10);

    return {
      queueLength: queueStatus.queueLength,
      isOnline: queueStatus.isOnline,
      errorCounts: queueStatus.errorCounts,
      recentErrors: recentErrors.slice(0, 5), // Last 5 errors
      criticalErrors: recentErrors.filter(e => e.severity === 'critical').length
    };
  };

  // Get performance metrics
  const getPerformanceMetrics = async () => {
    if (!window.performanceIntegrationService) return null;

    const summary = window.performanceIntegrationService.getMetricsSummary();
    const healthScore = window.performanceIntegrationService.getPerformanceHealthScore();
    const recommendations = window.performanceIntegrationService.getPerformanceRecommendations();

    return {
      healthScore,
      database: summary.database,
      authentication: summary.authentication,
      offlineQueue: summary.offlineQueue,
      general: summary.general,
      recommendations: recommendations.slice(0, 3) // Top 3 recommendations
    };
  };

  // Get privacy compliance status
  const getPrivacyCompliance = async () => {
    if (!window.privacyProtectionService) return null;

    const settings = window.privacyProtectionService.getPrivacySettings();
    
    return {
      anonymizationEnabled: settings.anonymizationEnabled,
      encryptionEnabled: settings.encryptionEnabled,
      dataRetentionCompliant: settings.dataRetentionDays <= 30,
      consentValid: settings.hasConsent,
      gdprCompliant: settings.hasConsent && settings.anonymizationEnabled
    };
  };

  // Get rate limiting statistics
  const getRateLimitingStats = async () => {
    if (!window.rateLimitingService) return null;

    const status = window.rateLimitingService.getRateLimitStatus();
    const suspiciousUsers = window.rateLimitingService.getSuspiciousUsers();
    const blockedUsers = window.rateLimitingService.getBlockedUsers();

    return {
      isBlocked: status?.isBlocked || false,
      isSuspicious: status?.isSuspicious || false,
      suspiciousUserCount: suspiciousUsers.length,
      blockedUserCount: blockedUsers.length,
      limits: status?.limits || {}
    };
  };

  // Get data backup statistics
  const getDataBackupStats = async () => {
    if (!window.dataBackupService) return null;

    const status = window.dataBackupService.getBackupStatus();
    const history = await window.dataBackupService.getBackupHistory(5);

    return {
      isEnabled: status.isEnabled,
      lastBackupTime: status.lastBackupTime,
      backupCount: status.backupCount,
      nextBackupIn: status.nextBackupIn,
      recentBackups: history
    };
  };

  // Auto-refresh effect
  useEffect(() => {
    if (!isOpen) return;

    refreshData();

    if (autoRefresh) {
      const interval = setInterval(refreshData, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isOpen, autoRefresh]);

  // Export monitoring data
  const exportData = async () => {
    try {
      const data = await gatherMonitoringData();
      const exportData = {
        ...data,
        exportMetadata: {
          exportedAt: new Date().toISOString(),
          version: '1.0.0',
          privacyMode: privacyMode
        }
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `beta-monitoring-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('❌ BetaMonitoringDashboard: Error exporting data:', error);
      alert('Error exporting data. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Beta Monitoring Dashboard</h2>
            {privacyMode && (
              <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                <Lock className="w-3 h-3" />
                <span>Privacy Mode</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setPrivacyMode(!privacyMode)}
              className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm ${
                privacyMode ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {privacyMode ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              <span>{privacyMode ? 'Privacy On' : 'Privacy Off'}</span>
            </button>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm ${
                autoRefresh ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
              <span>Auto Refresh</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <span className="sr-only">Close</span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'system', label: 'System', icon: Activity },
            { id: 'errors', label: 'Errors', icon: AlertTriangle },
            { id: 'privacy', label: 'Privacy', icon: Shield },
            { id: 'performance', label: 'Performance', icon: Database }
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
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading monitoring data...</span>
            </div>
          )}

          {!isLoading && monitoringData && (
            <>
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* System Health Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-600">System Health</p>
                          <p className="text-2xl font-bold text-blue-900">
                            {monitoringData.performanceMetrics?.healthScore || 0}%
                          </p>
                        </div>
                        <Activity className="w-8 h-8 text-blue-500" />
                      </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-600">Privacy Compliance</p>
                          <p className="text-2xl font-bold text-green-900">
                            {monitoringData.privacyCompliance?.gdprCompliant ? '100%' : '0%'}
                          </p>
                        </div>
                        <Shield className="w-8 h-8 text-green-500" />
                      </div>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-orange-600">Error Rate</p>
                          <p className="text-2xl font-bold text-orange-900">
                            {monitoringData.errorStats?.criticalErrors || 0}
                          </p>
                        </div>
                        <AlertTriangle className="w-8 h-8 text-orange-500" />
                      </div>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-purple-600">Backup Status</p>
                          <p className="text-2xl font-bold text-purple-900">
                            {monitoringData.dataBackup?.isEnabled ? 'Active' : 'Inactive'}
                          </p>
                        </div>
                        <Database className="w-8 h-8 text-purple-500" />
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={refreshData}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Refresh Data</span>
                      </button>
                      <button
                        onClick={exportData}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        <Download className="w-4 h-4" />
                        <span>Export Data</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'users' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">User Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-3">Privacy Status</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Consent Given:</span>
                          <span className={`font-medium ${monitoringData.userMetrics?.hasConsent ? 'text-green-600' : 'text-red-600'}`}>
                            {monitoringData.userMetrics?.hasConsent ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Privacy Mode:</span>
                          <span className={`font-medium ${monitoringData.userMetrics?.privacyMode ? 'text-green-600' : 'text-red-600'}`}>
                            {monitoringData.userMetrics?.privacyMode ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Data Retention:</span>
                          <span className="font-medium">{monitoringData.userMetrics?.dataRetentionDays || 0} days</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-3">Rate Limiting</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">User Blocked:</span>
                          <span className={`font-medium ${monitoringData.rateLimiting?.isBlocked ? 'text-red-600' : 'text-green-600'}`}>
                            {monitoringData.rateLimiting?.isBlocked ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Suspicious Activity:</span>
                          <span className={`font-medium ${monitoringData.rateLimiting?.isSuspicious ? 'text-orange-600' : 'text-green-600'}`}>
                            {monitoringData.rateLimiting?.isSuspicious ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Suspicious Users:</span>
                          <span className="font-medium">{monitoringData.rateLimiting?.suspiciousUserCount || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'system' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-3">Service Status</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Firebase:</span>
                          <span className={`font-medium ${monitoringData.systemHealth?.firebase === 'healthy' ? 'text-green-600' : 'text-red-600'}`}>
                            {monitoringData.systemHealth?.firebase || 'Unknown'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Firestore:</span>
                          <span className={`font-medium ${monitoringData.systemHealth?.firestore === 'healthy' ? 'text-green-600' : 'text-red-600'}`}>
                            {monitoringData.systemHealth?.firestore || 'Unknown'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Offline Mode:</span>
                          <span className={`font-medium ${monitoringData.systemHealth?.offline ? 'text-orange-600' : 'text-green-600'}`}>
                            {monitoringData.systemHealth?.offline ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Degradation Mode:</span>
                          <span className={`font-medium ${monitoringData.systemHealth?.degradationMode ? 'text-orange-600' : 'text-green-600'}`}>
                            {monitoringData.systemHealth?.degradationMode ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-3">Data Backup</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Backup Enabled:</span>
                          <span className={`font-medium ${monitoringData.dataBackup?.isEnabled ? 'text-green-600' : 'text-red-600'}`}>
                            {monitoringData.dataBackup?.isEnabled ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Backup Count:</span>
                          <span className="font-medium">{monitoringData.dataBackup?.backupCount || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Last Backup:</span>
                          <span className="font-medium text-xs">
                            {monitoringData.dataBackup?.lastBackupTime ? 
                              new Date(monitoringData.dataBackup.lastBackupTime).toLocaleString() : 
                              'Never'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'errors' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Error Statistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-3">Error Queue</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Queue Length:</span>
                          <span className="font-medium">{monitoringData.errorStats?.queueLength || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Online Status:</span>
                          <span className={`font-medium ${monitoringData.errorStats?.isOnline ? 'text-green-600' : 'text-red-600'}`}>
                            {monitoringData.errorStats?.isOnline ? 'Online' : 'Offline'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Critical Errors:</span>
                          <span className="font-medium text-red-600">{monitoringData.errorStats?.criticalErrors || 0}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-3">Recent Errors</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {monitoringData.errorStats?.recentErrors?.length > 0 ? (
                          monitoringData.errorStats.recentErrors.map((error, index) => (
                            <div key={index} className="text-xs p-2 bg-gray-50 rounded">
                              <div className="font-medium">{error.type}</div>
                              <div className="text-gray-600">{error.message}</div>
                              <div className="text-gray-500">{new Date(error.timestamp).toLocaleString()}</div>
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-500 text-sm">No recent errors</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Privacy Compliance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-3">Privacy Settings</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Anonymization:</span>
                          <span className={`font-medium ${monitoringData.privacyCompliance?.anonymizationEnabled ? 'text-green-600' : 'text-red-600'}`}>
                            {monitoringData.privacyCompliance?.anonymizationEnabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Encryption:</span>
                          <span className={`font-medium ${monitoringData.privacyCompliance?.encryptionEnabled ? 'text-green-600' : 'text-red-600'}`}>
                            {monitoringData.privacyCompliance?.encryptionEnabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Data Retention:</span>
                          <span className={`font-medium ${monitoringData.privacyCompliance?.dataRetentionCompliant ? 'text-green-600' : 'text-red-600'}`}>
                            {monitoringData.privacyCompliance?.dataRetentionCompliant ? 'Compliant' : 'Non-compliant'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">GDPR Compliant:</span>
                          <span className={`font-medium ${monitoringData.privacyCompliance?.gdprCompliant ? 'text-green-600' : 'text-red-600'}`}>
                            {monitoringData.privacyCompliance?.gdprCompliant ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-3">User Consent</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Consent Valid:</span>
                          <span className={`font-medium ${monitoringData.privacyCompliance?.consentValid ? 'text-green-600' : 'text-red-600'}`}>
                            {monitoringData.privacyCompliance?.consentValid ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Audit Events:</span>
                          <span className="font-medium">{monitoringData.userMetrics?.auditEvents || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'performance' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-3">Database Performance</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Total Queries:</span>
                          <span className="font-medium">{monitoringData.performanceMetrics?.database?.totalQueries || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Average Time:</span>
                          <span className="font-medium">{monitoringData.performanceMetrics?.database?.averageQueryTime || 0}ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Slow Queries:</span>
                          <span className="font-medium text-orange-600">{monitoringData.performanceMetrics?.database?.slowQueries || 0}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-3">Authentication Performance</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Total Attempts:</span>
                          <span className="font-medium">{monitoringData.performanceMetrics?.authentication?.totalAttempts || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Success Rate:</span>
                          <span className="font-medium text-green-600">{monitoringData.performanceMetrics?.authentication?.successRate || 0}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Average Time:</span>
                          <span className="font-medium">{monitoringData.performanceMetrics?.authentication?.averageLoginTime || 0}ms</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Performance Recommendations */}
                  {monitoringData.performanceMetrics?.recommendations?.length > 0 && (
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-3">Performance Recommendations</h4>
                      <div className="space-y-2">
                        {monitoringData.performanceMetrics.recommendations.map((rec, index) => (
                          <div key={index} className={`p-3 rounded-lg ${
                            rec.type === 'critical' ? 'bg-red-50 border border-red-200' :
                            rec.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                            'bg-blue-50 border border-blue-200'
                          }`}>
                            <div className="font-medium text-sm">{rec.message}</div>
                            <div className="text-xs text-gray-600 mt-1">{rec.action}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BetaMonitoringDashboard;
