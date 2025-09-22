import React, { useState, useEffect } from 'react';

const OfflineIndicator = ({ offlineManager }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);
  const [queuedActions, setQueuedActions] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
      console.log('🌐 Connection restored');
      
      // Start syncing when back online
      if (offlineManager && queuedActions > 0) {
        setIsSyncing(true);
        // Simulate sync completion after a delay
        setTimeout(() => {
          setIsSyncing(false);
          setQueuedActions(0);
        }, 2000);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
      console.log('📡 Connection lost');
    };

    // Listen for network changes
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial status
    setIsOnline(navigator.onLine);

    // Update queued actions count periodically
    const updateQueuedActions = async () => {
      if (offlineManager) {
        try {
          const actions = await offlineManager.getQueuedActionsCount();
          setQueuedActions(actions);
        } catch (error) {
          console.warn('Could not get queued actions count:', error);
        }
      }
    };

    updateQueuedActions();
    const interval = setInterval(updateQueuedActions, 5000); // Check every 5 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [offlineManager, queuedActions]);

  // Show sync status when online but syncing
  if (isOnline && isSyncing) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-blue-600 text-white p-3 text-center shadow-lg">
        <div className="flex items-center justify-center space-x-2">
          <svg 
            className="w-5 h-5 animate-spin" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
            />
          </svg>
          <span className="font-medium">
            Syncing {queuedActions} offline actions...
          </span>
        </div>
      </div>
    );
  }

  // Show sync completion briefly
  if (isOnline && !isSyncing && queuedActions === 0) {
    return null;
  }

  // Show offline indicator
  if (!isOnline) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-600 text-white p-3 text-center shadow-lg">
        <div className="flex items-center justify-center space-x-2">
          <svg 
            className="w-5 h-5 animate-pulse" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
            />
          </svg>
          <span className="font-medium">
            You're offline. Some features may be limited.
            {queuedActions > 0 && ` (${queuedActions} actions queued)`}
          </span>
          <button
            onClick={() => setShowOfflineMessage(false)}
            className="ml-2 text-white hover:text-yellow-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      
        {showOfflineMessage && (
          <div className="mt-2 text-sm bg-yellow-700 p-2 rounded">
            <p className="mb-2">While offline, you can:</p>
            <ul className="text-left space-y-1 ml-4">
              <li>• View your current stats and progress</li>
              <li>• Track habits and cravings</li>
              <li>• Log water intake and breathing exercises</li>
              <li>• Record craving assessments and resistance</li>
              <li>• Play distraction games</li>
              <li>• View your profile information</li>
            </ul>
            <p className="mt-2 text-yellow-200">
              All changes will sync automatically when you're back online.
              {queuedActions > 0 && (
                <span className="block mt-1 font-medium">
                  💾 {queuedActions} action{queuedActions !== 1 ? 's' : ''} queued for sync
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    );
  }

  // Default return (should not reach here)
  return null;
};

export default OfflineIndicator;
