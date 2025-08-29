/**
 * Test factories for StatManager tests
 * Provides consistent test data generation
 */

import timeAbstraction from '../utils/timeAbstraction.js';

/**
 * Create a mock user object
 * @param {Object} overrides - Properties to override defaults
 */
export function makeUser(overrides = {}) {
  const now = timeAbstraction.now();
  const defaultUser = {
    uid: 'test-user-123',
    email: 'test@example.com',
    quitDate: now.toISOString(),
    createdAt: now.toISOString(),
    lastActivity: now.toISOString(),
    ...overrides
  };

  return defaultUser;
}

/**
 * Create mock user stats
 * @param {Object} overrides - Properties to override defaults
 */
export function makeStats(overrides = {}) {
  const defaultStats = {
    mentalStrength: 50,
    motivation: 50,
    triggerDefense: 50,
    addictionLevel: 30,
    ...overrides
  };

  return defaultStats;
}

/**
 * Create a mock behavior event
 * @param {Object} overrides - Properties to override defaults
 */
export function makeEvent(overrides = {}) {
  const now = timeAbstraction.now();
  const defaultEvent = {
    timestamp: now.getTime(),
    statName: 'mentalStrength',
    change: 1,
    reason: 'Test event',
    date: now.toISOString(),
    ...overrides
  };

  return defaultEvent;
}

/**
 * Create hydration logs for a date range
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @param {Object} options - Logging options
 */
export function makeHydrationLogs(startDate, endDate, options = {}) {
  const { 
    glassesPerDay = 6, 
    skipDays = [], 
    partialDays = [] 
  } = options;

  const logs = {};
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toDateString();
    const dateKey = d.toISOString().split('T')[0];
    
    if (skipDays.includes(dateKey)) {
      continue;
    }
    
    if (partialDays.includes(dateKey)) {
      logs[dateStr] = Math.floor(glassesPerDay / 2);
    } else {
      logs[dateStr] = glassesPerDay;
    }
  }
  
  return logs;
}

/**
 * Create breathing exercise logs for a date range
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @param {Object} options - Logging options
 */
export function makeBreathingLogs(startDate, endDate, options = {}) {
  const { 
    exercisePerDay = true, 
    skipDays = [], 
    partialDays = [] 
  } = options;

  const logs = {};
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toDateString();
    const dateKey = d.toISOString().split('T')[0];
    
    if (skipDays.includes(dateKey)) {
      continue;
    }
    
    if (partialDays.includes(dateKey)) {
      logs[dateStr] = false; // Skip some days
    } else {
      logs[dateStr] = exercisePerDay;
    }
  }
  
  return logs;
}

/**
 * Create craving logs for a date range
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @param {Object} options - Logging options
 */
export function makeCravingLogs(startDate, endDate, options = {}) {
  const { 
    logsPerDay = 2, 
    skipDays = [], 
    outcomes = ['resisted', 'logged', 'relapsed'] 
  } = options;

  const logs = {};
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toDateString();
    const dateKey = d.toISOString().split('T')[0];
    
    if (skipDays.includes(dateKey)) {
      continue;
    }
    
    logs[dateStr] = {
      count: logsPerDay,
      entries: Array.from({ length: logsPerDay }, (_, i) => ({
        strength: Math.floor(Math.random() * 11), // 0-10
        mood: ['stressed', 'lonely', 'happy', 'bored', 'excited', 'down', 'angry', 'anxious'][Math.floor(Math.random() * 8)],
        context: ['break', 'party', 'alcohol', 'car', 'coffee', 'eating', 'intimate', 'tv', 'wakeup'][Math.floor(Math.random() * 9)],
        outcome: outcomes[Math.floor(Math.random() * outcomes.length)],
        timestamp: new Date(d.getTime() + i * 60000).toISOString(), // 1 min apart
        date: dateStr
      }))
    };
  }
  
  return logs;
}

/**
 * Create daily activity logs for a date range
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @param {Object} options - Logging options
 */
export function makeActivityLogs(startDate, endDate, options = {}) {
  const { 
    activePerDay = true, 
    skipDays = [], 
    partialDays = [] 
  } = options;

  const logs = {};
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toDateString();
    const dateKey = d.toISOString().split('T')[0];
    
    if (skipDays.includes(dateKey)) {
      continue;
    }
    
    if (partialDays.includes(dateKey)) {
      logs[dateStr] = false; // Skip some days
    } else {
      logs[dateStr] = activePerDay;
    }
  }
  
  return logs;
}

/**
 * Create a mock Firebase snapshot
 * @param {any} value - Value to return
 * @param {boolean} exists - Whether the snapshot exists
 */
export function makeSnapshot(value, exists = true) {
  return {
    exists: () => exists,
    val: () => value,
    key: 'test-key'
  };
}

/**
 * Create a mock Firebase reference
 * @param {string} path - Reference path
 */
export function makeRef(path) {
  return {
    toString: () => path,
    key: path.split('/').pop()
  };
}
