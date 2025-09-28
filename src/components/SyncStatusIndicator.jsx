import React, { useState, useEffect } from 'react';

const SyncStatusIndicator = ({ offlineManager }) => {
  const [status, setStatus] = useState({
    isOnline: navigator.onLine,
    queuedOperations: 0,
    failedOperations: 0,
    syncInProgress: false,
    lastSyncTime: null
  });

  const [showDetails, setShowDetails] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentOperation, setCurrentOperation] = useState(null);

  useEffect(() => {
    if (!offlineManager) return;

    // Set up progress callbacks
    const progressCallback = (progressData) => {
      setProgress(progressData.progress);
      setCurrentOperation(progressData.currentOperation);
    };

    const statusCallback = (statusData) => {
      setStatus(prev => ({
        ...prev,
        syncInProgress: statusData.status === 'syncing',
        lastSyncTime: statusData.endTime || prev.lastSyncTime
      }));
    };

    offlineManager.progressManager.addProgressCallback(progressCallback);
    offlineManager.progressManager.addStatusCallback(statusCallback);

    // Update status periodically
    const updateStatus = () => {
      const managerStatus = offlineManager.getStatus();
      setStatus(prev => ({
        ...prev,
        isOnline: managerStatus.isOnline,
        queuedOperations: managerStatus.queue.queuedOperations,
        failedOperations: managerStatus.queue.failedOperations,
        syncInProgress: managerStatus.queue.syncInProgress
      }));
    };

    updateStatus();
    const interval = setInterval(updateStatus, 1000);

    return () => {
      offlineManager.progressManager.removeProgressCallback(progressCallback);
      offlineManager.progressManager.removeStatusCallback(statusCallback);
      clearInterval(interval);
    };
  }, [offlineManager]);

  const handleRetryFailed = async () => {
    if (offlineManager) {
      await offlineManager.retryFailedOperations();
    }
  };

  const handleManualSync = async () => {
    if (offlineManager) {
      await offlineManager.attemptSync();
    }
  };

  const formatLastSync = (timestamp) => {
    if (!timestamp) return 'Never';
    
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getStatusColor = () => {
    if (!status.isOnline) return 'text-yellow-600';
    if (status.failedOperations > 0) return 'text-red-600';
    if (status.queuedOperations > 0) return 'text-blue-600';
    return 'text-green-600';
  };

  const getStatusIcon = () => {
    if (!status.isOnline) return '📡';
    if (status.syncInProgress) return '🔄';
    if (status.failedOperations > 0) return '⚠️';
    if (status.queuedOperations > 0) return '⏳';
    return '✅';
  };

  const getStatusText = () => {
    if (!status.isOnline) return 'Offline';
    if (status.syncInProgress) return 'Syncing...';
    if (status.failedOperations > 0) return `${status.failedOperations} failed`;
    if (status.queuedOperations > 0) return `${status.queuedOperations} queued`;
    return 'Synced';
  };

  if (!offlineManager) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Main Status Indicator */}
      <div 
        className={`bg-white rounded-lg shadow-lg p-3 cursor-pointer transition-all duration-200 hover:shadow-xl ${getStatusColor()}`}
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{getStatusIcon()}</span>
          <div className="text-sm font-medium">
            {getStatusText()}
          </div>
          {status.syncInProgress && (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>
        
        {/* Progress Bar */}
        {status.syncInProgress && (
          <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
            <div 
              className="bg-current h-1 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>

      {/* Detailed Status Panel */}
      {showDetails && (
        <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl p-4 w-80 border">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-800">Sync Status</h3>
            <button 
              onClick={() => setShowDetails(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {/* Connection Status */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-2 h-2 rounded-full ${status.isOnline ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
              <span className="text-sm font-medium">
                {status.isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              Last sync: {formatLastSync(status.lastSyncTime)}
            </div>
          </div>

          {/* Queue Status */}
          <div className="mb-3">
            <div className="text-sm font-medium text-gray-700 mb-1">Queue Status</div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Queued:</span>
                <span className="text-blue-600">{status.queuedOperations}</span>
              </div>
              <div className="flex justify-between">
                <span>Failed:</span>
                <span className="text-red-600">{status.failedOperations}</span>
              </div>
            </div>
          </div>

          {/* Current Operation */}
          {currentOperation && (
            <div className="mb-3">
              <div className="text-sm font-medium text-gray-700 mb-1">Current Operation</div>
              <div className="text-xs text-gray-600">
                {currentOperation.type} - {Math.round(progress)}%
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            {status.failedOperations > 0 && (
              <button
                onClick={handleRetryFailed}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs py-2 px-3 rounded transition-colors"
              >
                Retry Failed
              </button>
            )}
            
            {status.queuedOperations > 0 && status.isOnline && (
              <button
                onClick={handleManualSync}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs py-2 px-3 rounded transition-colors"
              >
                Sync Now
              </button>
            )}
          </div>

          {/* Sync Statistics */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              <div className="flex justify-between">
                <span>Success Rate:</span>
                <span>
                  {offlineManager.getStatus().sync.successRate}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SyncStatusIndicator;
