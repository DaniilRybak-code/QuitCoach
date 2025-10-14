import React, { useState, useEffect } from 'react';

const SessionStatusIndicator = ({ sessionManager, authGuard }) => {
  const [sessionInfo, setSessionInfo] = useState({
    isActive: false,
    duration: 0,
    timeUntilTimeout: 0,
    timeUntilWarning: 0
  });
  const [showDetails, setShowDetails] = useState(false);
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    if (!sessionManager) return;

    // Update session info periodically
    const updateSessionInfo = () => {
      const info = sessionManager.getSessionInfo();
      setSessionInfo(info);
      
      // Check if warning should be shown
      setIsWarning(info.timeUntilWarning <= 0 && info.timeUntilTimeout > 0);
    };

    updateSessionInfo();
    const interval = setInterval(updateSessionInfo, 1000);

    return () => clearInterval(interval);
  }, [sessionManager]);

  const formatTime = (seconds) => {
    if (seconds <= 0) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  const getStatusColor = () => {
    if (!sessionInfo.isActive) return 'text-gray-500';
    if (isWarning) return 'text-yellow-600';
    if (sessionInfo.timeUntilTimeout <= 60) return 'text-red-600';
    return 'text-green-600';
  };

  const getStatusIcon = () => {
    if (!sessionInfo.isActive) return '⏸️';
    if (isWarning) return '⚠️';
    if (sessionInfo.timeUntilTimeout <= 60) return '🔴';
    return '🟢';
  };

  const getStatusText = () => {
    if (!sessionInfo.isActive) return 'Inactive';
    if (isWarning) return 'Warning';
    if (sessionInfo.timeUntilTimeout <= 60) return 'Expiring';
    return 'Active';
  };

  const handleExtendSession = () => {
    if (sessionManager) {
      sessionManager.extendSession();
    }
  };

  const handleLogout = async () => {
    if (authGuard) {
      try {
        await authGuard.logout();
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
  };

  if (!sessionInfo.isActive) return null;

  return (
    <div className="fixed top-4 left-4 z-50">
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
          {sessionInfo.timeUntilTimeout > 0 && (
            <div className="text-xs opacity-75">
              {formatTime(sessionInfo.timeUntilTimeout)}
            </div>
          )}
        </div>
        
        {/* Progress Bar */}
        {sessionInfo.timeUntilTimeout > 0 && (
          <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
            <div 
              className={`h-1 rounded-full transition-all duration-300 ${
                isWarning ? 'bg-yellow-500' : 
                sessionInfo.timeUntilTimeout <= 60 ? 'bg-red-500' : 
                'bg-green-500'
              }`}
              style={{ 
                width: `${Math.max(0, Math.min(100, (sessionInfo.timeUntilTimeout / 1800) * 100))}%` 
              }}
            ></div>
          </div>
        )}
      </div>

      {/* Detailed Status Panel */}
      {showDetails && (
        <div className="absolute top-16 left-0 bg-white rounded-lg shadow-xl p-4 w-80 border">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-800">Session Status</h3>
            <button 
              onClick={() => setShowDetails(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {/* Session Duration */}
          <div className="mb-3">
            <div className="text-sm font-medium text-gray-700 mb-1">Session Duration</div>
            <div className="text-lg font-mono text-gray-900">
              {formatDuration(sessionInfo.duration)}
            </div>
          </div>

          {/* Time Until Timeout */}
          {sessionInfo.timeUntilTimeout > 0 && (
            <div className="mb-3">
              <div className="text-sm font-medium text-gray-700 mb-1">Time Until Timeout</div>
              <div className={`text-lg font-mono ${
                isWarning ? 'text-yellow-600' : 
                sessionInfo.timeUntilTimeout <= 60 ? 'text-red-600' : 
                'text-gray-900'
              }`}>
                {formatTime(sessionInfo.timeUntilTimeout)}
              </div>
            </div>
          )}

          {/* Session Status */}
          <div className="mb-3">
            <div className="text-sm font-medium text-gray-700 mb-1">Status</div>
            <div className={`text-sm font-medium ${
              isWarning ? 'text-yellow-600' : 
              sessionInfo.timeUntilTimeout <= 60 ? 'text-red-600' : 
              'text-green-600'
            }`}>
              {getStatusText()}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {isWarning && (
              <button
                onClick={handleExtendSession}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm py-2 px-3 rounded transition-colors"
              >
                Extend Session
              </button>
            )}
            
            <button
              onClick={handleLogout}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm py-2 px-3 rounded transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Session Statistics */}
          {authGuard && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>Operations:</span>
                  <span>{authGuard.getOperationStats().total}</span>
                </div>
                <div className="flex justify-between">
                  <span>Success Rate:</span>
                  <span>{authGuard.getOperationStats().successRate}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SessionStatusIndicator;
