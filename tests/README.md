# StatManager Testing Harness

This directory contains a comprehensive testing suite for the `StatManager` service using Vitest. The testing harness is designed to run without Firebase dependencies and provides full control over time-based operations.

## 🏗️ Architecture

### Test Structure
```
tests/
├── setup.js                    # Global test setup and Firebase mocking
├── utils/
│   └── timeAbstraction.js     # Time control utility for tests
├── statManager/
│   ├── factories.js           # Test data factories
│   ├── invariants.js          # Business rule constraints
│   ├── mockStatManager.js     # Firebase-free StatManager implementation
│   ├── cravings.test.js       # Craving management tests
│   ├── hydration.test.js      # Hydration management tests
│   └── index.test.js          # Main test index
└── README.md                  # This file
```

### Key Components

1. **Time Abstraction** (`timeAbstraction.js`)
   - Allows tests to set explicit "now" times
   - Supports UTC and timezone-specific testing
   - Provides date string and ISO string utilities

2. **Mock StatManager** (`mockStatManager.js`)
   - Implements StatManager interface without Firebase
   - Uses in-memory storage for testing
   - Maintains all business logic and constraints

3. **Test Factories** (`factories.js`)
   - Generates consistent test data
   - Creates users, stats, events, and logs
   - Supports date range generation for streaks

4. **Global Invariants** (`invariants.js`)
   - Defines business rule constraints
   - Provides validation functions
   - Ensures consistent behavior across tests

## 🕐 Time Policy

### UTC vs Europe/London

The testing harness uses a **UTC-first approach** with timezone flexibility:

- **Default**: All tests run in UTC by default for consistency
- **Timezone Support**: Tests can specify timezones when needed
- **Date Handling**: Uses ISO strings for precise time control

### Time Control Methods

```javascript
import timeAbstraction from '../utils/timeAbstraction.js';

// Set fixed time (UTC)
timeAbstraction.setFixedTime('2024-01-15T10:00:00Z');

// Set specific date/time with timezone
timeAbstraction.setDateTime('2024-01-15', '14:30:00', 'Europe/London');

// Get relative dates
const yesterday = timeAbstraction.getDateString(-1);
const tomorrow = timeAbstraction.getDateString(1);

// Reset to real time
timeAbstraction.resetTime();
```

### Time-Dependent Testing

Tests that depend on time (streaks, milestones, etc.) use the time abstraction:

```javascript
describe('Hydration Streak', () => {
  beforeEach(() => {
    timeAbstraction.setFixedTime('2024-01-15T10:00:00Z');
  });

  afterEach(() => {
    timeAbstraction.resetTime();
  });

  it('should award bonus for 3-day streak', async () => {
    // Set up consecutive days
    timeAbstraction.setFixedTime('2024-01-15T10:00:00Z');
    await statManager.handleHydrationUpdate(6);
    
    timeAbstraction.setFixedTime('2024-01-16T10:00:00Z');
    await statManager.handleHydrationUpdate(6);
    
    timeAbstraction.setFixedTime('2024-01-17T10:00:00Z');
    await statManager.handleHydrationUpdate(6);
    
    // Verify bonus was awarded
    const stats = statManager.getStats();
    expect(stats.mentalStrength).toBe(51); // 50 + 1
  });
});
```

## 🚀 Running Tests

### Available Commands

```bash
# Run tests in watch mode (development)
npm run test

# Run tests with UI
npm run test:ui

# Run tests once
npm run test:run

# Run tests with coverage report
npm run test:coverage
```

### Running Specific Test Suites

```bash
# Run only craving tests
npm run test cravings.test.js

# Run only hydration tests
npm run test hydration.test.js

# Run tests matching a pattern
npm run test -- --grep "streak"
```

### Coverage Reports

Coverage reports are generated in multiple formats:
- **Text**: Console output
- **JSON**: `coverage/coverage-summary.json`
- **HTML**: `coverage/index.html` (open in browser)

## 🧪 Test Organization

### Test Suites by Feature

1. **Cravings** (`cravings.test.js`)
   - Craving resistance bonuses
   - Craving logging awareness
   - App usage tracking
   - Stat bounds validation

2. **Hydration** (`hydration.test.js`)
   - Water intake recording
   - Streak calculation
   - Mental strength bonuses
   - Time-based logic

3. **Breathing** (planned)
   - Exercise tracking
   - Streak bonuses
   - Daily consistency

4. **Relapse** (planned)
   - Penalty progression
   - Addiction level increases
   - Mental strength setbacks

5. **Milestones** (planned)
   - Clean time bonuses
   - Achievement rewards
   - One-time awards

6. **Inactivity** (planned)
   - Grace periods
   - Penalty thresholds
   - User registration logic

7. **Weekly Reduction** (planned)
   - Addiction level decreases
   - Clean time calculations
   - Penalty resets

### Test Categories

Each test suite includes:

- **Unit Tests**: Individual method functionality
- **Integration Tests**: Multi-method interactions
- **Edge Cases**: Boundary conditions and error handling
- **Invariant Validation**: Business rule enforcement
- **State Consistency**: Data integrity verification

## 🔧 Test Data Management

### Using Factories

```javascript
import { makeUser, makeStats, makeHydrationLogs } from './factories.js';

// Create test user
const user = makeUser({ 
  uid: 'test-123',
  quitDate: '2024-01-01T00:00:00Z'
});

// Create test stats
const stats = makeStats({ 
  mentalStrength: 75,
  motivation: 80
});

// Create hydration logs for date range
const logs = makeHydrationLogs('2024-01-10', '2024-01-17', {
  glassesPerDay: 6,
  skipDays: ['2024-01-13'], // Skip Sunday
  partialDays: ['2024-01-15'] // Partial hydration
});
```

### Mock Data Setup

```javascript
// Set up StatManager with specific data
statManager.setStats(makeStats({ mentalStrength: 45 }));
statManager.setProfile(makeUser({ relapseDate: '2024-01-10T00:00:00Z' }));
statManager.setDailyLogs(makeHydrationLogs('2024-01-10', '2024-01-17'));
```

## ✅ Invariant Validation

### Business Rules

The testing harness enforces several key invariants:

- **Stat Bounds**: All stats must be between 0-100
- **Bonus Consistency**: Bonuses match defined constants
- **Penalty Progression**: Relapse penalties increase with frequency
- **Streak Validation**: Streak counts are reasonable (0-365)
- **Date Validation**: All dates are valid and consistent
- **User Isolation**: User IDs are valid and non-empty

### Validation Functions

```javascript
import { 
  assertStatBounds, 
  assertStatChange, 
  assertStreakCount 
} from './invariants.js';

// Validate stat values
assertStatBounds('mentalStrength', 75);

// Validate stat changes
assertStatChange('motivation', 5, 45); // 45 + 5 = 50 ✓

// Validate streak counts
assertStreakCount('hydration', 7);
```

## 🐛 Debugging Tests

### Common Issues

1. **Time-Related Failures**
   - Ensure `timeAbstraction.resetTime()` is called in `afterEach`
   - Check that time is set before each test that needs it

2. **State Pollution**
   - Use `beforeEach` to create fresh StatManager instances
   - Avoid sharing state between tests

3. **Async/Await**
   - All StatManager methods are async
   - Use `await` when calling methods
   - Use `async` in test functions

### Debug Mode

```bash
# Run tests with verbose output
npm run test -- --reporter=verbose

# Run single test file
npm run test -- hydration.test.js

# Run tests with console.log output
npm run test -- --reporter=verbose --no-coverage
```

## 📈 Adding New Tests

### Creating New Test Suites

1. Create test file: `tests/statManager/feature.test.js`
2. Import dependencies and MockStatManager
3. Set up time abstraction in `beforeEach`/`afterEach`
4. Write tests using the established patterns
5. Import in `tests/statManager/index.test.js`

### Test Patterns

```javascript
describe('Feature Name', () => {
  let statManager;

  beforeEach(() => {
    timeAbstraction.setFixedTime('2024-01-15T10:00:00Z');
    statManager = new MockStatManager('test-user-123');
  });

  afterEach(() => {
    timeAbstraction.resetTime();
  });

  describe('Method Name', () => {
    it('should do something specific', async () => {
      // Arrange
      const initialStats = statManager.getStats();
      
      // Act
      await statManager.someMethod();
      
      // Assert
      const finalStats = statManager.getStats();
      expect(finalStats.someStat).toBe(expectedValue);
    });
  });
});
```

## 🔮 Future Enhancements

- **Performance Testing**: Add benchmarks for critical paths
- **Stress Testing**: Test with large datasets and rapid operations
- **Snapshot Testing**: Capture expected outputs for regression detection
- **Property-Based Testing**: Use libraries like fast-check for generative testing
- **Integration Testing**: Test with real Firebase (optional)

## 📚 Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Best Practices](https://vitest.dev/guide/best-practices.html)
- [Mocking Strategies](https://vitest.dev/guide/mocking.html)
- [Time Testing Patterns](https://github.com/sinonjs/fake-timers)
