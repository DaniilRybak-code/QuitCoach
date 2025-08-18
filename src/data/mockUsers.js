/**
 * Mock User Data for Buddy Matching Testing
 * Contains 20 realistic user profiles with various quit dates, addiction levels, and preferences
 */

// Helper function to generate dates within a range
const getRandomDate = (startDaysAgo, endDaysAgo) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - startDaysAgo);
  const endDate = new Date();
  endDate.setDate(endDate.getDate() - endDaysAgo);
  
  const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
  return new Date(randomTime).toISOString();
};

// Helper function to get random items from array
const getRandomItems = (array, minCount, maxCount) => {
  const count = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const mockUsers = [
  // Perfect Match Candidates (similar quit dates, addiction levels, timezones)
  {
    id: 'user_001',
    heroName: 'Sarah the Determined',
    avatar: null,
    quitDate: getRandomDate(5, 7),
    timezone: 'UTC-5',
    stats: {
      addictionLevel: 65,
      mentalStrength: 45,
      motivation: 70,
      triggerDefense: 35
    },
    triggers: ['Stress/anxiety', 'Work breaks', 'After meals'],
    dailyPatterns: ['Morning routine', 'Work breaks', 'Evening wind-down'],
    copingStrategies: ['Breathing exercises', 'Exercise/physical activity', 'Distraction techniques'],
    hasActiveBuddy: false
  },
  
  {
    id: 'user_002',
    heroName: 'Mike the Fighter',
    avatar: null,
    quitDate: getRandomDate(4, 6),
    timezone: 'UTC-5',
    stats: {
      addictionLevel: 68,
      mentalStrength: 42,
      motivation: 68,
      triggerDefense: 38
    },
    triggers: ['Stress/anxiety', 'Work breaks', 'Social situations'],
    dailyPatterns: ['Morning routine', 'Work breaks', 'After meals'],
    copingStrategies: ['Breathing exercises', 'Exercise/physical activity', 'Nicotine replacement therapy'],
    hasActiveBuddy: false
  },
  
  // Good Match Candidates (within 7 days, similar addiction levels)
  {
    id: 'user_003',
    heroName: 'Emma the Warrior',
    avatar: null,
    quitDate: getRandomDate(10, 12),
    timezone: 'UTC-6',
    stats: {
      addictionLevel: 72,
      mentalStrength: 38,
      motivation: 65,
      triggerDefense: 32
    },
    triggers: ['Boredom', 'Social situations', 'Drinking alcohol'],
    dailyPatterns: ['Work breaks', 'Social events', 'Evening wind-down'],
    copingStrategies: ['Distraction techniques', 'Exercise/physical activity', 'Nothing - this is new to me'],
    hasActiveBuddy: false
  },
  
  {
    id: 'user_004',
    heroName: 'Alex the Seeker',
    avatar: null,
    quitDate: getRandomDate(8, 10),
    timezone: 'UTC-6',
    stats: {
      addictionLevel: 70,
      mentalStrength: 40,
      motivation: 62,
      triggerDefense: 35
    },
    triggers: ['Boredom', 'Social situations', 'After meals'],
    dailyPatterns: ['Work breaks', 'Social events', 'Throughout the day'],
    copingStrategies: ['Distraction techniques', 'Exercise/physical activity', 'Breathing exercises'],
    hasActiveBuddy: false
  },
  
  // First Timer Group (new to quitting)
  {
    id: 'user_005',
    heroName: 'Jordan the Newbie',
    avatar: null,
    quitDate: getRandomDate(2, 3),
    timezone: 'UTC-8',
    stats: {
      addictionLevel: 55,
      mentalStrength: 25,
      motivation: 45,
      triggerDefense: 20
    },
    triggers: ['Stress/anxiety', 'Morning routine'],
    dailyPatterns: ['Morning routine', 'Work breaks'],
    copingStrategies: ['Nothing - this is new to me'],
    hasActiveBuddy: false
  },
  
  {
    id: 'user_006',
    heroName: 'Casey the Beginner',
    avatar: null,
    quitDate: getRandomDate(1, 2),
    timezone: 'UTC-8',
    stats: {
      addictionLevel: 58,
      mentalStrength: 28,
      motivation: 48,
      triggerDefense: 22
    },
    triggers: ['Stress/anxiety', 'Work breaks'],
    dailyPatterns: ['Morning routine', 'Work breaks'],
    copingStrategies: ['Nothing - this is new to me', 'Breathing exercises'],
    hasActiveBuddy: false
  },
  
  // Veteran Quitter Group (experienced with multiple strategies)
  {
    id: 'user_007',
    heroName: 'Taylor the Veteran',
    avatar: null,
    quitDate: getRandomDate(15, 18),
    timezone: 'UTC-7',
    stats: {
      addictionLevel: 45,
      mentalStrength: 65,
      motivation: 75,
      triggerDefense: 55
    },
    triggers: ['Driving', 'Work breaks', 'After meals'],
    dailyPatterns: ['Work breaks', 'After meals', 'Evening wind-down'],
    copingStrategies: ['Breathing exercises', 'Nicotine replacement therapy', 'Exercise/physical activity', 'Distraction techniques'],
    hasActiveBuddy: false
  },
  
  {
    id: 'user_008',
    heroName: 'Riley the Experienced',
    avatar: null,
    quitDate: getRandomDate(12, 15),
    timezone: 'UTC-7',
    stats: {
      addictionLevel: 42,
      mentalStrength: 68,
      motivation: 72,
      triggerDefense: 58
    },
    triggers: ['Driving', 'Work breaks', 'Social situations'],
    dailyPatterns: ['Work breaks', 'After meals', 'Social events'],
    copingStrategies: ['Breathing exercises', 'Nicotine replacement therapy', 'Exercise/physical activity', 'Distraction techniques'],
    hasActiveBuddy: false
  },
  
  // High Addiction Group (challenging cases)
  {
    id: 'user_009',
    heroName: 'Morgan the Struggler',
    avatar: null,
    quitDate: getRandomDate(20, 25),
    timezone: 'UTC-4',
    stats: {
      addictionLevel: 88,
      mentalStrength: 20,
      motivation: 35,
      triggerDefense: 15
    },
    triggers: ['Throughout the day', 'Stress/anxiety', 'Boredom', 'Social situations', 'Drinking alcohol'],
    dailyPatterns: ['Throughout the day', 'Morning routine', 'Work breaks', 'After meals', 'Evening wind-down'],
    copingStrategies: ['Distraction techniques'],
    hasActiveBuddy: false
  },
  
  {
    id: 'user_010',
    heroName: 'Quinn the Challenged',
    avatar: null,
    quitDate: getRandomDate(18, 22),
    timezone: 'UTC-4',
    stats: {
      addictionLevel: 85,
      mentalStrength: 22,
      motivation: 38,
      triggerDefense: 18
    },
    triggers: ['Throughout the day', 'Stress/anxiety', 'Boredom', 'Work breaks'],
    dailyPatterns: ['Throughout the day', 'Morning routine', 'Work breaks'],
    copingStrategies: ['Distraction techniques', 'Breathing exercises'],
    hasActiveBuddy: false
  },
  
  // Low Addiction Group (easier cases)
  {
    id: 'user_011',
    heroName: 'Avery the Light',
    avatar: null,
    quitDate: getRandomDate(30, 35),
    timezone: 'UTC-3',
    stats: {
      addictionLevel: 32,
      mentalStrength: 75,
      motivation: 85,
      triggerDefense: 70
    },
    triggers: ['Work breaks'],
    dailyPatterns: ['Work breaks', 'Evening wind-down'],
    copingStrategies: ['Breathing exercises', 'Exercise/physical activity'],
    hasActiveBuddy: false
  },
  
  {
    id: 'user_012',
    heroName: 'Blake the Easy',
    avatar: null,
    quitDate: getRandomDate(28, 32),
    timezone: 'UTC-3',
    stats: {
      addictionLevel: 35,
      mentalStrength: 72,
      motivation: 82,
      triggerDefense: 68
    },
    triggers: ['Work breaks', 'After meals'],
    dailyPatterns: ['Work breaks', 'After meals'],
    copingStrategies: ['Breathing exercises', 'Exercise/physical activity', 'Distraction techniques'],
    hasActiveBuddy: false
  },
  
  // Social Vaper Group
  {
    id: 'user_013',
    heroName: 'Drew the Social',
    avatar: null,
    quitDate: getRandomDate(9, 11),
    timezone: 'UTC-5',
    stats: {
      addictionLevel: 60,
      mentalStrength: 45,
      motivation: 55,
      triggerDefense: 40
    },
    triggers: ['Social situations', 'Drinking alcohol', 'Work breaks'],
    dailyPatterns: ['Social events', 'Work breaks', 'Evening wind-down'],
    copingStrategies: ['Exercise/physical activity', 'Distraction techniques'],
    hasActiveBuddy: false
  },
  
  {
    id: 'user_014',
    heroName: 'Sam the Party',
    avatar: null,
    quitDate: getRandomDate(7, 9),
    timezone: 'UTC-5',
    stats: {
      addictionLevel: 62,
      mentalStrength: 42,
      motivation: 58,
      triggerDefense: 38
    },
    triggers: ['Social situations', 'Drinking alcohol', 'Boredom'],
    dailyPatterns: ['Social events', 'Evening wind-down', 'Work breaks'],
    copingStrategies: ['Exercise/physical activity', 'Distraction techniques', 'Breathing exercises'],
    hasActiveBuddy: false
  },
  
  // Stress Vaper Group
  {
    id: 'user_015',
    heroName: 'Parker the Stressed',
    avatar: null,
    quitDate: getRandomDate(14, 16),
    timezone: 'UTC-6',
    stats: {
      addictionLevel: 75,
      mentalStrength: 30,
      motivation: 50,
      triggerDefense: 25
    },
    triggers: ['Stress/anxiety', 'Work breaks', 'Driving'],
    dailyPatterns: ['Morning routine', 'Work breaks', 'Evening wind-down'],
    copingStrategies: ['Breathing exercises', 'Exercise/physical activity'],
    hasActiveBuddy: false
  },
  
  {
    id: 'user_016',
    heroName: 'Rowan the Anxious',
    avatar: null,
    quitDate: getRandomDate(13, 15),
    timezone: 'UTC-6',
    stats: {
      addictionLevel: 78,
      mentalStrength: 28,
      motivation: 48,
      triggerDefense: 22
    },
    triggers: ['Stress/anxiety', 'Work breaks', 'Morning routine'],
    dailyPatterns: ['Morning routine', 'Work breaks', 'Throughout the day'],
    copingStrategies: ['Breathing exercises', 'Distraction techniques'],
    hasActiveBuddy: false
  },
  
  // Habit Vaper Group (after meals)
  {
    id: 'user_017',
    heroName: 'Finley the Habitual',
    avatar: null,
    quitDate: getRandomDate(6, 8),
    timezone: 'UTC-7',
    stats: {
      addictionLevel: 55,
      mentalStrength: 50,
      motivation: 60,
      triggerDefense: 45
    },
    triggers: ['After meals', 'Work breaks'],
    dailyPatterns: ['After meals', 'Work breaks', 'Evening wind-down'],
    copingStrategies: ['Breathing exercises', 'Exercise/physical activity', 'Distraction techniques'],
    hasActiveBuddy: false
  },
  
  {
    id: 'user_018',
    heroName: 'River the Routine',
    avatar: null,
    quitDate: getRandomDate(5, 7),
    timezone: 'UTC-7',
    stats: {
      addictionLevel: 58,
      mentalStrength: 48,
      motivation: 62,
      triggerDefense: 42
    },
    triggers: ['After meals', 'Work breaks', 'Morning routine'],
    dailyPatterns: ['After meals', 'Work breaks', 'Morning routine'],
    copingStrategies: ['Breathing exercises', 'Exercise/physical activity'],
    hasActiveBuddy: false
  },
  
  // Driving Vaper Group
  {
    id: 'user_019',
    heroName: 'Skyler the Driver',
    avatar: null,
    quitDate: getRandomDate(11, 13),
    timezone: 'UTC-8',
    stats: {
      addictionLevel: 65,
      mentalStrength: 40,
      motivation: 55,
      triggerDefense: 35
    },
    triggers: ['Driving', 'Work breaks', 'Social situations'],
    dailyPatterns: ['Work breaks', 'Social events'],
    copingStrategies: ['Distraction techniques', 'Breathing exercises'],
    hasActiveBuddy: false
  },
  
  {
    id: 'user_020',
    heroName: 'Phoenix the Commuter',
    avatar: null,
    quitDate: getRandomDate(10, 12),
    timezone: 'UTC-8',
    stats: {
      addictionLevel: 68,
      mentalStrength: 38,
      motivation: 52,
      triggerDefense: 32
    },
    triggers: ['Driving', 'Work breaks', 'Morning routine'],
    dailyPatterns: ['Morning routine', 'Work breaks'],
    copingStrategies: ['Distraction techniques', 'Breathing exercises', 'Exercise/physical activity'],
    hasActiveBuddy: false
  }
];

/**
 * Get a specific user by ID
 * @param {string} userId - User ID to find
 * @returns {Object|null} User object or null if not found
 */
export const getUserById = (userId) => {
  return mockUsers.find(user => user.id === userId) || null;
};

/**
 * Get users by specific criteria
 * @param {Object} criteria - Search criteria
 * @returns {Array} Array of matching users
 */
export const getUsersByCriteria = (criteria = {}) => {
  return mockUsers.filter(user => {
    if (criteria.timezone && user.timezone !== criteria.timezone) return false;
    if (criteria.hasActiveBuddy !== undefined && user.hasActiveBuddy !== criteria.hasActiveBuddy) return false;
    if (criteria.minAddictionLevel && user.stats.addictionLevel < criteria.minAddictionLevel) return false;
    if (criteria.maxAddictionLevel && user.stats.addictionLevel > criteria.maxAddictionLevel) return false;
    return true;
  });
};

/**
 * Get random users for testing
 * @param {number} count - Number of users to return
 * @returns {Array} Array of random users
 */
export const getRandomUsers = (count = 5) => {
  const shuffled = [...mockUsers].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

/**
 * Get users with specific trigger types
 * @param {string} trigger - Trigger type to search for
 * @returns {Array} Array of users with that trigger
 */
export const getUsersByTrigger = (trigger) => {
  return mockUsers.filter(user => user.triggers.includes(trigger));
};

/**
 * Get users with specific daily patterns
 * @param {string} pattern - Daily pattern to search for
 * @returns {Array} Array of users with that pattern
 */
export const getUsersByPattern = (pattern) => {
  return mockUsers.filter(user => user.dailyPatterns.includes(pattern));
};

/**
 * Get users by experience level
 * @param {string} level - 'first-timer' or 'veteran'
 * @returns {Array} Array of users with that experience level
 */
export const getUsersByExperience = (level) => {
  if (level === 'first-timer') {
    return mockUsers.filter(user => user.copingStrategies.includes('Nothing - this is new to me'));
  } else if (level === 'veteran') {
    return mockUsers.filter(user => user.copingStrategies.length >= 3);
  }
  return [];
};

// Export default for convenience
export default mockUsers;
