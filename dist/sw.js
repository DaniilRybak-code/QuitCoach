// Service Worker for QuitArena
// Provides offline caching and improves app performance

const CACHE_NAME = 'quitarena-v1.0.1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Files to cache immediately (avoid hashed build assets here)
const STATIC_FILES = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/favicon.svg',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('🔄 Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('📦 Caching static files...');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('✅ Static files cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Error caching static files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...');
  
  event.waitUntil(
    (async () => {
      // Enable navigation preload to speed up navigation requests
      if ('navigationPreload' in self.registration) {
        try {
          await self.registration.navigationPreload.enable();
        } catch (e) {
          // no-op
        }
      }
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('🧹 Cleaning up old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
      console.log('✅ Service Worker activated and old caches cleaned');
      await self.clients.claim();
    })()
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip external requests (Firebase, analytics, etc.)
  if (url.origin !== self.location.origin) {
    return;
  }
  
  // Handle different types of requests
  if (request.mode === 'navigate' || request.destination === 'document' || request.destination === '') {
    // HTML navigations - try preload/network, then cache, then offline fallback
    event.respondWith(handlePageRequest(request, event));
  } else if (request.destination === 'script' || request.destination === 'style') {
    // Static assets - cache first strategy
    event.respondWith(handleStaticRequest(request));
  } else {
    // Other requests - network first, cache fallback
    event.respondWith(handleDynamicRequest(request));
  }
});

// Handle page requests (HTML)
async function handlePageRequest(request, event) {
  try {
    // Use navigation preload response if available
    const preload = event && event.preloadResponse ? await event.preloadResponse : null;
    if (preload) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, preload.clone());
      return preload;
    }
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache the response for offline use
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    console.log('📡 Network failed for page request, trying cache...');
  }
  
  // Fallback to cache
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // For SPA routes, serve index.html from cache
  const indexCached = await caches.match('/index.html');
  if (indexCached) {
    return indexCached;
  }
  
  // If no cache, return offline page
  return caches.match('/offline.html');
}

// Handle static requests (JS, CSS)
async function handleStaticRequest(request) {
  // Check cache first
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    // Try network
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache for future use
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    console.log('📡 Network failed for static request:', error);
  }
  
  // Return empty response if both cache and network fail
  return new Response('', { status: 404 });
}

// Handle dynamic requests (API calls, etc.)
async function handleDynamicRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    console.log('📡 Network failed for dynamic request, trying cache...');
  }
  
  // Fallback to cache
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Return empty response if both fail
  return new Response('', { status: 404 });
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync triggered:', event.tag);
  
  if (event.tag === 'offline-actions') {
    event.waitUntil(syncOfflineActions());
  } else if (event.tag === 'firestore-sync') {
    event.waitUntil(syncFirestoreActions());
  } else if (event.tag === 'behavioral-logging') {
    event.waitUntil(syncBehavioralLogs());
  }
});

// Sync offline actions when connection is restored
async function syncOfflineActions() {
  try {
    console.log('🔄 Syncing offline actions in background...');
    
    // Get all clients
    const clients = await self.clients.matchAll();
    
    // Send sync message to main app
    clients.forEach((client) => {
      client.postMessage({
        type: 'SYNC_OFFLINE_ACTIONS',
        timestamp: Date.now()
      });
    });
    
    console.log('✅ Background sync message sent to clients');
  } catch (error) {
    console.error('❌ Error in background sync:', error);
  }
}

// Handle messages from main app
self.addEventListener('message', (event) => {
  // Check if event.data exists and has the expected structure
  if (!event.data || typeof event.data !== 'object') {
    return; // Silently ignore malformed messages
  }
  
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'CACHE_DATA':
      cacheAppData(data);
      break;
      
    case 'GET_CACHED_DATA':
      getCachedAppData(event.source);
      break;
      
    case 'QUEUE_FIRESTORE_ACTION':
      queueFirestoreAction(data);
      break;
      
    case 'QUEUE_BEHAVIORAL_LOG':
      queueBehavioralLog(data);
      break;
      
    default:
      // Only log if type is defined but unknown
      if (type !== undefined) {
        console.log('📨 Unknown message type:', type);
      }
  }
});

// Cache app data for offline use
async function cacheAppData(data) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const response = new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
    
    await cache.put('/api/cached-data', response);
    console.log('✅ App data cached for offline use');
  } catch (error) {
    console.error('❌ Error caching app data:', error);
  }
}

// Get cached app data
async function getCachedAppData(client) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const response = await cache.match('/api/cached-data');
    
    if (response) {
      const data = await response.json();
      client.postMessage({
        type: 'CACHED_DATA_RESPONSE',
        data
      });
    }
  } catch (error) {
    console.error('❌ Error getting cached data:', error);
  }
}

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  console.log('📱 Push notification received:', event);
  
  const options = {
    body: 'Stay strong! Your quit journey continues.',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'open',
        title: 'Open App',
        icon: '/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-192x192.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('QuitCard Arena', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('📱 Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        if (clients.length > 0) {
          clients[0].focus();
        } else {
          self.clients.openWindow('/');
        }
      })
    );
  }
});

// ===== OFFLINE LOGGING FUNCTIONS =====

// Queue Firestore actions for offline sync
async function queueFirestoreAction(actionData) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const response = new Response(JSON.stringify(actionData), {
      headers: { 'Content-Type': 'application/json' }
    });
    
    const actionId = `firestore_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await cache.put(`/api/offline-actions/${actionId}`, response);
    
    console.log('✅ Firestore action queued for offline sync:', actionData.type);
    
    // Register for background sync
    if (self.registration && self.registration.sync) {
      await self.registration.sync.register('firestore-sync');
    }
  } catch (error) {
    console.error('❌ Error queuing Firestore action:', error);
  }
}

// Queue behavioral logs for offline sync
async function queueBehavioralLog(logData) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const response = new Response(JSON.stringify(logData), {
      headers: { 'Content-Type': 'application/json' }
    });
    
    const logId = `behavioral_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await cache.put(`/api/behavioral-logs/${logId}`, response);
    
    console.log('✅ Behavioral log queued for offline sync:', logData.type);
    
    // Register for background sync
    if (self.registration && self.registration.sync) {
      await self.registration.sync.register('behavioral-logging');
    }
  } catch (error) {
    console.error('❌ Error queuing behavioral log:', error);
  }
}

// Sync Firestore actions when online
async function syncFirestoreActions() {
  try {
    console.log('🔄 Syncing Firestore actions...');
    
    const cache = await caches.open(DYNAMIC_CACHE);
    const keys = await cache.keys();
    const firestoreActions = keys.filter(key => key.url.includes('/api/offline-actions/'));
    
    let successCount = 0;
    let failureCount = 0;
    
    for (const key of firestoreActions) {
      try {
        const response = await cache.match(key);
        const actionData = await response.json();
        
        // Attempt to sync the action
        const success = await syncSingleFirestoreAction(actionData);
        
        if (success) {
          await cache.delete(key);
          successCount++;
          console.log('✅ Firestore action synced:', actionData.type);
        } else {
          failureCount++;
          console.warn('⚠️ Failed to sync Firestore action:', actionData.type);
        }
      } catch (error) {
        console.error('❌ Error syncing Firestore action:', error);
        failureCount++;
      }
    }
    
    console.log(`🔄 Firestore sync complete: ${successCount} successful, ${failureCount} failed`);
    
    // Notify main app about sync results
    const clients = await self.clients.matchAll();
    clients.forEach((client) => {
      client.postMessage({
        type: 'FIRESTORE_SYNC_RESULT',
        successCount,
        failureCount,
        timestamp: Date.now()
      });
    });
  } catch (error) {
    console.error('❌ Error in Firestore sync:', error);
  }
}

// Sync behavioral logs when online
async function syncBehavioralLogs() {
  try {
    console.log('🔄 Syncing behavioral logs...');
    
    const cache = await caches.open(DYNAMIC_CACHE);
    const keys = await cache.keys();
    const behavioralLogs = keys.filter(key => key.url.includes('/api/behavioral-logs/'));
    
    let successCount = 0;
    let failureCount = 0;
    
    for (const key of behavioralLogs) {
      try {
        const response = await cache.match(key);
        const logData = await response.json();
        
        // Attempt to sync the log
        const success = await syncSingleBehavioralLog(logData);
        
        if (success) {
          await cache.delete(key);
          successCount++;
          console.log('✅ Behavioral log synced:', logData.type);
        } else {
          failureCount++;
          console.warn('⚠️ Failed to sync behavioral log:', logData.type);
        }
      } catch (error) {
        console.error('❌ Error syncing behavioral log:', error);
        failureCount++;
      }
    }
    
    console.log(`🔄 Behavioral sync complete: ${successCount} successful, ${failureCount} failed`);
    
    // Notify main app about sync results
    const clients = await self.clients.matchAll();
    clients.forEach((client) => {
      client.postMessage({
        type: 'BEHAVIORAL_SYNC_RESULT',
        successCount,
        failureCount,
        timestamp: Date.now()
      });
    });
  } catch (error) {
    console.error('❌ Error in behavioral sync:', error);
  }
}

// Sync a single Firestore action
async function syncSingleFirestoreAction(actionData) {
  try {
    // This would typically make a fetch request to your Firestore API
    // For now, we'll simulate success and let the main app handle the actual sync
    console.log('📤 Syncing Firestore action:', actionData.type, actionData);
    
    // Notify main app to handle the sync
    const clients = await self.clients.matchAll();
    clients.forEach((client) => {
      client.postMessage({
        type: 'SYNC_FIRESTORE_ACTION',
        actionData
      });
    });
    
    return true; // Assume success for now
  } catch (error) {
    console.error('❌ Error syncing single Firestore action:', error);
    return false;
  }
}

// Sync a single behavioral log
async function syncSingleBehavioralLog(logData) {
  try {
    // This would typically make a fetch request to your Firestore API
    // For now, we'll simulate success and let the main app handle the actual sync
    console.log('📤 Syncing behavioral log:', logData.type, logData);
    
    // Notify main app to handle the sync
    const clients = await self.clients.matchAll();
    clients.forEach((client) => {
      client.postMessage({
        type: 'SYNC_BEHAVIORAL_LOG',
        logData
      });
    });
    
    return true; // Assume success for now
  } catch (error) {
    console.error('❌ Error syncing single behavioral log:', error);
    return false;
  }
}

console.log('🔄 Service Worker loaded successfully');

// Note: beforeinstallprompt and appinstalled events are available on the Window, not in the Service Worker.
// The app should capture them in the page context and, if needed, postMessage the SW to persist any analytics.
