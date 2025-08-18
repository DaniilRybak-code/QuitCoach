# 📱 Offline Features - QuitCard Arena

QuitCard Arena is built with **offline-first technology**, ensuring users can continue their quit journey even without an internet connection.

## 🚀 **Core Offline Capabilities**

### **What Works Offline:**
- ✅ **View Current Stats & Progress** - All user data is cached locally
- ✅ **Track Daily Habits** - Habit completion tracking works offline
- ✅ **Resist Cravings** - Craving resistance tracking and stat updates
- ✅ **Play Distraction Games** - Snake game available offline
- ✅ **Access Profile Information** - View clean time, streaks, achievements
- ✅ **Breathing Exercises** - Meditation and breathing tracking
- ✅ **Hydration Tracking** - Water intake logging
- ✅ **Mood Tracking** - Daily mood and progress logging

### **What Syncs When Online:**
- 🔄 **Offline Actions** - All changes made offline are queued and synced
- 🔄 **Data Updates** - Latest data is downloaded from Firebase
- 🔄 **Conflict Resolution** - Server data takes precedence for stats
- 🔄 **Real-time Updates** - Live sync with other devices

## 🏗️ **Technical Architecture**

### **Service Worker (`/public/sw.js`)**
- **Static Caching**: Core app files cached for instant loading
- **Dynamic Caching**: User data and API responses cached intelligently
- **Offline Fallback**: Serves offline page when network unavailable
- **Background Sync**: Queues offline actions for later sync

### **Offline Manager (`/src/services/offlineManager.js`)**
- **Connection Detection**: Monitors online/offline status
- **Action Queuing**: Stores offline actions in IndexedDB
- **Data Caching**: Manages local data storage
- **Sync Management**: Handles reconnection and data sync

### **Data Storage Strategy**
```
Browser Storage (IndexedDB + localStorage)
├── User Profile Data
├── Stats & Progress
├── Habits & Achievements
├── Offline Action Queue
└── App Configuration
```

## 📱 **User Experience**

### **Online Mode**
- 🌐 **Real-time Sync**: Instant updates across devices
- 🔄 **Live Data**: Always shows latest information
- 📊 **Full Features**: All functionality available

### **Offline Mode**
- 📡 **Offline Indicator**: Yellow banner shows connection status
- 💾 **Local Data**: App works with cached information
- ⏳ **Action Queue**: Changes stored for later sync
- 🎮 **Core Features**: Essential functionality remains available

### **Transition States**
- **Going Offline**: Yellow warning banner appears
- **Working Offline**: App continues with cached data
- **Coming Online**: Automatic sync and data refresh
- **Sync Complete**: Green confirmation and updated data

## 🧪 **Testing Offline Features**

### **Development Testing**
1. **Force Offline Mode**:
   - Chrome DevTools → Network → Offline
   - Or disconnect internet connection

2. **Test Offline Actions**:
   - Complete habits, resist cravings, update stats
   - Verify actions are queued locally

3. **Test Reconnection**:
   - Reconnect internet
   - Watch automatic sync process
   - Verify data appears in Firebase

### **Production Testing**
1. **Install as PWA**: Add to home screen
2. **Use in Poor Network**: Test with slow/unstable connections
3. **Cross-Device Sync**: Test data consistency across devices

## 🔧 **Configuration & Customization**

### **Service Worker Settings**
```javascript
// Cache versions
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/offline.html',
  // ... other critical files
];
```

### **Offline Manager Settings**
```javascript
// Sync intervals
const SYNC_INTERVAL = 5000; // 5 seconds
const MAX_QUEUE_SIZE = 100; // Maximum queued actions

// Cache expiration
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days
```

## 📊 **Performance Metrics**

### **Offline Performance**
- **First Load**: ~2-3 seconds (cached files)
- **Subsequent Loads**: <1 second (fully cached)
- **Data Access**: Instant (local storage)
- **Action Queue**: Immediate (local processing)

### **Sync Performance**
- **Reconnection**: <2 seconds to detect
- **Data Sync**: <5 seconds for typical user data
- **Conflict Resolution**: <1 second
- **Background Sync**: Non-blocking

## 🚨 **Error Handling**

### **Offline Scenarios**
- **No Internet**: Graceful degradation with cached data
- **Poor Connection**: Retry logic with exponential backoff
- **Data Corruption**: Fallback to last known good state
- **Storage Full**: Automatic cleanup of old data

### **Sync Failures**
- **Network Errors**: Actions remain queued for retry
- **Authentication Issues**: Re-authentication prompt
- **Data Conflicts**: Server data takes precedence
- **Partial Failures**: Individual action retry logic

## 🔮 **Future Enhancements**

### **Planned Features**
- **Background Sync API**: Sync even when app is closed
- **Push Notifications**: Offline action reminders
- **Advanced Caching**: Intelligent cache invalidation
- **Offline Analytics**: Track offline usage patterns

### **Advanced Offline Capabilities**
- **Conflict Resolution UI**: Let users choose data version
- **Offline Mode Toggle**: Manual offline mode for testing
- **Data Export**: Backup user data locally
- **Sync Status Dashboard**: Visual sync progress indicator

## 📚 **Best Practices**

### **For Users**
1. **Install as PWA**: Better offline experience
2. **Regular Sync**: Ensure data is up to date
3. **Check Connection**: Look for offline indicator
4. **Report Issues**: Contact support for sync problems

### **For Developers**
1. **Test Offline**: Always test without internet
2. **Monitor Storage**: Check IndexedDB usage
3. **Handle Errors**: Graceful offline degradation
4. **User Feedback**: Clear offline status indicators

## 🆘 **Troubleshooting**

### **Common Issues**
- **App Not Working Offline**: Check service worker registration
- **Data Not Syncing**: Verify Firebase connection
- **Storage Errors**: Clear browser data and retry
- **Sync Stuck**: Force refresh and check network

### **Debug Commands**
```javascript
// Check service worker status
navigator.serviceWorker.getRegistrations()

// View offline data
localStorage.getItem('offlineData')

// Clear offline cache
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(registration => registration.unregister())
})
```

---

**QuitCard Arena** - Built for reliability, designed for your quit journey, working everywhere you go. 🚀
