# 🗄️ Buddy Matching Database Schema - QuitCard Arena

This document outlines the complete database structure for the real user buddy matching system, replacing the current mock user system.

## 🏗️ **Database Structure Overview**

### **Current Setup: Firebase Realtime Database**
- **Primary Database**: Firebase Realtime Database (RTDB)
- **Alternative**: Firestore (prepared for future migration)
- **Real-time Sync**: Automatic data synchronization across devices

### **Collections/Paths Structure**
```
quitarena-a97de-default-rtdb/
├── users/
│   └── [userId]/
│       ├── profile/
│       ├── stats/
│       ├── buddyInfo/          ← NEW: Buddy relationship data
│       └── ...
├── matchingPool/               ← NEW: Users seeking matches
│   └── [userId]/
│       ├── userId
│       ├── quitStartDate
│       ├── addictionLevel
│       ├── triggers
│       ├── timezone
│       ├── quitExperience
│       ├── availableForMatching
│       ├── lastActive
│       └── ...
├── buddyPairs/                 ← NEW: Active buddy relationships
│   └── [pairId]/
│       ├── users
│       ├── matchedAt
│       ├── compatibilityScore
│       ├── matchReasons
│       ├── status
│       └── ...
└── messages/                   ← Future: Chat messages between buddies
    └── [pairId]/
        └── [messageId]/
```

## 📊 **Collection Details**

### **1. matchingPool Collection**
**Purpose**: Store users who are actively seeking buddy matches

**Path**: `matchingPool/[userId]`

**Fields**:
```json
{
  "userId": "string (required)",
  "quitStartDate": "ISO date string (required)",
  "addictionLevel": "number 0-100 (required)",
  "triggers": ["array of strings"],
  "timezone": "string (required)",
  "quitExperience": "string: 'first-timer' | 'veteran' (required)",
  "availableForMatching": "boolean (required)",
  "lastActive": "ISO date string (required)",
  "createdAt": "ISO date string (required)",
  "archetype": "string: 'DETERMINED' | 'SOCIAL_FIGHTER' | 'HEALTH_WARRIOR' | 'MONEY_SAVER'",
  "dailyPatterns": ["array of strings"],
  "copingStrategies": ["array of strings"],
  "confidence": "number 1-10",
  "preferredContactMethod": "string: 'chat' | 'voice' | 'video'",
  "availabilityHours": "string",
  "language": "string: 'en' | 'es' | 'fr' | ..."
}
```

**Example Document**:
```json
{
  "userId": "user123",
  "quitStartDate": "2025-01-15T00:00:00.000Z",
  "addictionLevel": 75,
  "triggers": ["stress", "social", "boredom"],
  "timezone": "America/New_York",
  "quitExperience": "first-timer",
  "availableForMatching": true,
  "lastActive": "2025-01-20T10:30:00.000Z",
  "createdAt": "2025-01-20T10:00:00.000Z",
  "archetype": "DETERMINED",
  "dailyPatterns": ["morning", "after meals"],
  "copingStrategies": ["breathing", "exercise"],
  "confidence": 7,
  "preferredContactMethod": "chat",
  "availabilityHours": "anytime",
  "language": "en"
}
```

### **2. buddyPairs Collection**
**Purpose**: Store active buddy relationships between matched users

**Path**: `buddyPairs/[pairId]`

**Fields**:
```json
{
  "pairId": "string (auto-generated)",
  "users": ["array of 2 userIds (required)"],
  "matchedAt": "ISO date string (required)",
  "compatibilityScore": "number 0-1 (required)",
  "matchReasons": ["array of strings"],
  "status": "string: 'active' | 'inactive' | 'ended' (required)",
  "lastMessageAt": "ISO date string (required)",
  "user1RemovedFromPool": "boolean",
  "user2RemovedFromPool": "boolean"
}
```

**Example Document**:
```json
{
  "pairId": "pair456",
  "users": ["user123", "user789"],
  "matchedAt": "2025-01-20T11:00:00.000Z",
  "compatibilityScore": 0.85,
  "matchReasons": [
    "Started quitting around the same time",
    "Similar addiction levels",
    "Shared triggers: stress, social"
  ],
  "status": "active",
  "lastMessageAt": "2025-01-20T15:30:00.000Z",
  "user1RemovedFromPool": true,
  "user2RemovedFromPool": true
}
```

### **3. Users Collection Updates**
**Purpose**: Store buddy relationship information in user profiles

**New Path**: `users/[userId]/buddyInfo`

**Fields**:
```json
{
  "hasBuddy": "boolean (required)",
  "buddyId": "string (userId of buddy)",
  "pairId": "string (buddy pair ID)",
  "matchedAt": "ISO date string"
}
```

**Example Document**:
```json
{
  "hasBuddy": true,
  "buddyId": "user789",
  "pairId": "pair456",
  "matchedAt": "2025-01-20T11:00:00.000Z"
}
```

## 🔄 **Data Flow & Lifecycle**

### **User Journey Through Matching System**

1. **Onboarding Completion**
   ```
   User completes onboarding → Add to matchingPool → availableForMatching: true
   ```

2. **Matching Process**
   ```
   System finds compatible matches → User reviews matches → User accepts match
   ```

3. **Buddy Pairing**
   ```
   Create buddyPair → Remove both users from matchingPool → Update user buddyInfo
   ```

4. **Relationship Management**
   ```
   Users chat and support each other → Update lastMessageAt → Monitor activity
   ```

5. **End of Relationship** (Optional)
   ```
   User ends relationship → Update buddyPair status → Re-add to matchingPool
   ```

### **Automatic Cleanup Processes**

- **Inactive Users**: Remove users inactive for 30+ days
- **Expired Matches**: Archive old buddy pairs
- **Data Consistency**: Regular validation of relationships

## 🧮 **Matching Algorithm Details**

### **Compatibility Scoring (0-1 Scale)**

**Primary Criteria (80% weight)**:
- **Quit Start Date Proximity (30%)**: Closer dates = higher score
- **Addiction Level Similarity (25%)**: Similar levels = higher score
- **Timezone Compatibility (20%)**: Same timezone = 1.0, different = 0.5
- **Quit Experience (15%)**: Same experience = 1.0, different = 0.7

**Secondary Criteria (20% bonus)**:
- **Shared Triggers (10%)**: More shared triggers = higher score
- **Archetype Compatibility (5%)**: Complementary archetypes
- **Daily Pattern Overlap (5%)**: Similar daily routines

### **Minimum Compatibility Threshold**
- **Required Score**: 0.6 (60% compatibility)
- **Ideal Score**: 0.8+ (80%+ compatibility)
- **Premium Matches**: 0.9+ (90%+ compatibility)

## 🔧 **Integration Points**

### **1. Onboarding Flow**
```javascript
// When user completes onboarding
const buddyMatchingService = new BuddyMatchingService(db);
await buddyMatchingService.addToMatchingPool(userId, userData);
```

### **2. User Profile Updates**
```javascript
// When user stats change
await buddyMatchingService.updateMatchingAvailability(userId, true);
await buddyMatchingService.updateLastActive(userId);
```

### **3. Match Discovery**
```javascript
// Find compatible matches
const matches = await buddyMatchingService.findCompatibleMatches(userId, 5);
```

### **4. Buddy Pairing**
```javascript
// Create buddy relationship
const pairId = await buddyMatchingService.createBuddyPair(user1Id, user2Id, matchData);
```

## 📱 **Frontend Integration**

### **Chat with Buddy Tab Updates**
- **Replace mock data** with real user data from `buddyPairs`
- **Show compatibility score** and match reasons
- **Display buddy profile** information
- **Real-time updates** when buddy is online/active

### **Profile Tab Updates**
- **Show buddy status** (has buddy or seeking match)
- **Display buddy information** if matched
- **Option to end relationship** and return to matching pool

### **Arena Tab Updates**
- **Buddy support bonus** to stats when buddy is active
- **Shared achievements** between buddies
- **Motivation boost** from buddy interactions

## 🚀 **Migration from Mock System**

### **Phase 1: Database Setup**
- [x] Create `matchingPool` collection structure
- [x] Create `buddyPairs` collection structure
- [x] Update `users` collection with `buddyInfo` field

### **Phase 2: Service Integration**
- [x] Create `BuddyMatchingService` class
- [x] Implement matching algorithm
- [x] Add pool management functions

### **Phase 3: Frontend Updates**
- [ ] Update Chat with Buddy tab to use real data
- [ ] Integrate with onboarding completion
- [ ] Add buddy management UI
- [ ] Implement real-time updates

### **Phase 4: Testing & Optimization**
- [ ] Test matching algorithm with real users
- [ ] Optimize compatibility scoring
- [ ] Monitor pool health and cleanup
- [ ] Gather user feedback

## 🔒 **Security & Privacy**

### **Data Access Rules**
- **Users can only see**: Their own matching profile and buddy information
- **Public data**: Only basic matching criteria (no personal details)
- **Chat data**: Only between matched buddies

### **Privacy Controls**
- **Profile visibility**: Users control what matching data is shared
- **Contact preferences**: Users choose how they want to communicate
- **Relationship control**: Users can end relationships at any time

## 📊 **Analytics & Monitoring**

### **Pool Health Metrics**
- **Total users** in matching pool
- **Available users** for matching
- **Average compatibility** scores
- **Top triggers** and patterns
- **Timezone distribution**

### **Matching Success Metrics**
- **Match acceptance rate**
- **Relationship duration**
- **User satisfaction scores**
- **Chat activity levels**

## 🔮 **Future Enhancements**

### **Advanced Matching Features**
- **AI-powered compatibility**: Machine learning for better matches
- **Preference learning**: Adapt matching based on user feedback
- **Group matching**: Support for multiple buddy relationships

### **Communication Features**
- **Voice/video calls**: Beyond text chat
- **Shared goals**: Collaborative quit journey tracking
- **Group challenges**: Multi-user support activities

---

**QuitCard Arena** - Building meaningful connections for successful quit journeys! 🤝
