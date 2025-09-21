// Service Worker for QuitCard Arena
// Provides offline caching and improves app performance

const CACHE_NAME = 'quitcard-arena-v1.0.0';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/offline.html',
  '/src/index.css',
  '/src/main.jsx',
  '/src/App.jsx',
  '/src/components/AuthScreen.jsx',
  '/src/services/firebase.js',
  '/src/services/offlineManager.js',
  '/src/services/statManager.js',
  '/src/data/mockUsers.js',
  '/src/services/buddyMatching.js'
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
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('🧹 Cleaning up old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker activated and old caches cleaned');
        return self.clients.claim();
      })
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
  if (request.destination === 'document' || request.destination === '') {
    // HTML pages - try cache first, then network
    event.respondWith(handlePageRequest(request));
  } else if (request.destination === 'script' || request.destination === 'style') {
    // Static assets - cache first strategy
    event.respondWith(handleStaticRequest(request));
  } else {
    // Other requests - network first, cache fallback
    event.respondWith(handleDynamicRequest(request));
  }
});

// Handle page requests (HTML)
async function handlePageRequest(request) {
  try {
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

console.log('🔄 Service Worker loaded successfully');
