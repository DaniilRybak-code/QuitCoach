# Firestore Security Rules Documentation

## Overview

This document outlines the comprehensive security rules implemented for the QuitCoach Arena Firestore database. The rules ensure proper authentication, authorization, and data validation across all collections.

## Security Principles

### 1. Authentication Required
- All operations require valid Firebase Authentication
- No anonymous access is permitted
- User identity is verified for every request

### 2. User Ownership Validation
- Users can only access their own data
- Cross-user data access is strictly prohibited
- Document ownership is validated at the field level

### 3. Data Validation
- All data is validated for type, format, and range
- Required fields are enforced
- Reasonable limits are set for all data fields

### 4. Size Limits
- Maximum document size: 1MB
- Array length limits for all list fields
- String length limits for all text fields

## Collection Security Rules

### Users Collection (`/users/{userId}`)

**Access Control:**
- Users can only read/write their own documents
- Document ID must match the authenticated user's UID

**Data Validation:**
- Required fields: `uid`, `email`, `createdAt`
- Email must be valid format
- UID must match document ID
- Timestamps must not be in the future
- Optional fields have length limits

**Stats Validation:**
- All numeric stats must be within 0-100 range
- Streak days limited to 0-3650 (10 years max)
- Experience points limited to 0-1,000,000

### Buddy Matching Collections

#### Matching Pool (`/matchingPool/{userId}`)
**Access Control:**
- Users can only access their own matching pool entry
- Document ID must match user's UID

**Data Validation:**
- Required fields: `userId`, `createdAt`, `status`
- Status must be one of: `waiting`, `matched`, `inactive`
- User ID must match document ID
- Preferences have reasonable limits

#### Buddy Pairs (`/buddyPairs/{pairId}`)
**Access Control:**
- Users can only read pairs they are part of
- Users can only create pairs they are included in
- Users can only update/delete pairs they are part of

**Data Validation:**
- Required fields: `user1Id`, `user2Id`, `createdAt`, `status`
- Users cannot pair with themselves
- User IDs must be valid Firebase UIDs
- Status must be one of: `active`, `inactive`, `blocked`

### Behavioral Data Collections

All behavioral collections follow the same security pattern:

#### Access Control
- Users can only access their own behavioral data
- Document ownership validated by `userId` field
- No cross-user data access permitted

#### Data Validation
- Required fields: `userId`, `timestamp`
- User ID must match authenticated user
- Timestamp must not be in the future
- All numeric fields have reasonable ranges
- String fields have length limits
- Array fields have count limits

#### Specific Collections

**Cravings (`/behavioral_cravings/{document}`)**
- Outcome must be `resisted` or `relapsed`
- Strength: 0-10 scale
- Duration: 0-1440 minutes (24 hours max)
- Triggers: max 20 items
- Coping strategies: max 10 items

**Relapses (`/behavioral_relapses/{document}`)**
- Escalation level: 0-10 scale
- Triggers: max 20 items
- Notes: max 1000 characters

**Hydration (`/behavioral_hydration/{document}`)**
- Amount: 0-10000 (max 10L)
- Unit must be `ml`, `oz`, or `cups`
- Notes: max 500 characters

**Breathing (`/behavioral_breathing/{document}`)**
- Duration: 1-120 minutes
- Rate: 1-60 breaths per minute
- Effectiveness: 1-10 scale
- Notes: max 500 characters

**Meditation (`/behavioral_meditation/{document}`)**
- Duration: 1-180 minutes
- Effectiveness: 1-10 scale
- Notes: max 500 characters

**Physical Activity (`/behavioral_physical_activity/{document}`)**
- Duration: 1-480 minutes (8 hours max)
- Intensity: 1-10 scale
- Calories: 0-5000
- Notes: max 500 characters

**Mood (`/behavioral_mood/{document}`)**
- Mood: 1-10 scale
- Energy: 1-10 scale
- Stress: 1-10 scale
- Notes: max 1000 characters

**Stress (`/behavioral_stress/{document}`)**
- Level: 1-10 scale
- Triggers: max 20 items
- Coping strategies: max 10 items
- Notes: max 1000 characters

**Sleep (`/behavioral_sleep/{document}`)**
- Duration: 1-16 hours
- Quality: 1-10 scale
- Notes: max 500 characters

**Social Triggers (`/behavioral_social_triggers/{document}`)**
- Triggers: max 20 items
- Impact: 1-10 scale
- Notes: max 1000 characters

**Environmental (`/behavioral_environmental/{document}`)**
- Factors: max 20 items
- Noise level: 1-10 scale
- Notes: max 1000 characters

## Security Features

### 1. Helper Functions
- `isAuthenticated()`: Checks if user is authenticated
- `isOwner(userId)`: Checks if user owns the document
- `isResourceOwner()`: Checks if user owns existing data
- `isRequestOwner()`: Checks if user owns new data
- `isValidSize()`: Validates document size (1MB limit)
- `isValidTimestamp()`: Validates timestamp is not in future
- `isValidStringLength()`: Validates string length
- `isValidArrayLength()`: Validates array length
- `isValidNumericRange()`: Validates numeric ranges
- `isValidEmail()`: Validates email format
- `isValidUserId()`: Validates Firebase UID format

### 2. Data Validation
- Type checking for all fields
- Range validation for numeric fields
- Length limits for string fields
- Count limits for array fields
- Format validation for special fields (email, timestamps)

### 3. Access Control
- User ownership validation
- Cross-user access prevention
- Document-level permissions
- Collection-level restrictions

### 4. Rate Limiting
- Structure in place for rate limiting (max 100 writes per hour per user)
- Rate limit collection: `/rate_limits/{userId}`

## Testing

### Security Test Suite
The `firestore-security-tests.js` file contains comprehensive tests for:
- Authentication requirements
- User ownership validation
- Data validation rules
- Access control enforcement
- Error handling

### Test Scenarios
1. User can access their own data
2. User cannot access other users' data
3. Data validation prevents invalid inputs
4. Size limits prevent oversized documents
5. Required fields are enforced
6. Unauthorized collections are blocked

## Deployment

### Prerequisites
- Firebase CLI installed
- Firebase project configured
- Authentication enabled

### Deployment Steps
1. Validate rules syntax: `firebase firestore:rules:validate firestore.rules`
2. Run security tests: `node firestore-security-tests.js`
3. Deploy rules: `firebase deploy --only firestore:rules`

### Automated Deployment
Use the `deploy-security-rules.js` script for automated deployment:
```bash
node deploy-security-rules.js
```

## Monitoring and Maintenance

### Security Monitoring
- Monitor failed authentication attempts
- Track unauthorized access attempts
- Review data validation failures
- Monitor document size violations

### Regular Updates
- Review and update validation rules as needed
- Add new collections with proper security rules
- Update rate limiting as usage patterns change
- Regular security audits

## Best Practices

### For Developers
1. Always validate data on the client side before sending to Firestore
2. Handle security rule violations gracefully
3. Use proper error handling for authentication failures
4. Implement proper loading states for security checks

### For Administrators
1. Regularly review security logs
2. Monitor for unusual access patterns
3. Keep security rules updated
4. Test security rules after any changes

## Compliance

### Data Protection
- User data is isolated per user
- No cross-user data access possible
- Data validation prevents malicious inputs
- Size limits prevent resource abuse

### Privacy
- Users can only access their own data
- No data sharing between users without explicit consent
- Behavioral data is user-specific
- Buddy matching respects user privacy

## Troubleshooting

### Common Issues
1. **Authentication errors**: Ensure user is properly authenticated
2. **Permission denied**: Check user ownership of data
3. **Validation errors**: Verify data format and limits
4. **Size limit exceeded**: Reduce document size or split data

### Debug Tips
1. Check Firebase Console for security rule violations
2. Use Firebase CLI to test rules locally
3. Review error messages for specific validation failures
4. Test with different user scenarios

## Conclusion

The implemented security rules provide comprehensive protection for the QuitCoach Arena Firestore database. They ensure proper authentication, authorization, and data validation while maintaining usability for legitimate operations. Regular monitoring and updates will help maintain security as the application evolves.
