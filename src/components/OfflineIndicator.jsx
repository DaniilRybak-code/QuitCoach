import React, { useState, useEffect } from 'react';

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
      console.log('🌐 Connection restored');
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

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) {
    return null; // Don't show anything when online
  }

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
            <li>• Play distraction games</li>
            <li>• View your profile information</li>
          </ul>
          <p className="mt-2 text-yellow-200">
            Changes will sync when you're back online.
          </p>
        </div>
      )}
    </div>
  );
};

export default OfflineIndicator;
