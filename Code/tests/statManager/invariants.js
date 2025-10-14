/**
 * Global invariants for StatManager tests
 * Defines business rules and constraints that must always hold
 */

/**
 * Stat value constraints
 */
export const STAT_CONSTRAINTS = {
  MIN_VALUE: 0,
  MAX_VALUE: 100,
  MENTAL_STRENGTH_FLOOR: 0,
  MOTIVATION_FLOOR: 0,
  TRIGGER_DEFENSE_FLOOR: 0,
  ADDICTION_LEVEL_FLOOR: 0
};

/**
 * Bonus and penalty constraints
 */
export const BONUS_CONSTRAINTS = {
  CRAVING_RESISTANCE: {
    MENTAL_STRENGTH: 1,
    TRIGGER_DEFENSE: 3
  },
  CRAVING_LOGGED: {
    MOTIVATION: 0.25,
    TRIGGER_DEFENSE: 0.25,
    DAILY_MAX: 2 // Max logs per day that award points
  },
  BREATHING_STREAK: {
    MENTAL_STRENGTH: 1,
    STREAK_REQUIRED: 3
  },
  HYDRATION_STREAK: {
    MENTAL_STRENGTH: 1,
    STREAK_REQUIRED: 3
  },
  MILESTONE_BONUSES: {
    FIRST_WEEK: { days: 7, bonus: 5 },
    FIRST_MONTH: { days: 30, bonus: 10 },
    THREE_MONTHS: { days: 90, bonus: 15 }
  },
  REGULAR_LOGGING: {
    MOTIVATION: 2,
    FREQUENCY_REQUIRED: 3
  },
  ACHIEVEMENT_SHARE: {
    MOTIVATION: 3
  },
  APP_USAGE_DURING_CRAVINGS: {
    MENTAL_STRENGTH: 1,
    USAGE_COUNT_REQUIRED: 3
  }
};

/**
 * Penalty constraints
 */
export const PENALTY_CONSTRAINTS = {
  RELAPSE: {
    ADDICTION_LEVEL: {
      FIRST: 4,
      SECOND: 6,
      THIRD_PLUS: 8
    },
    MENTAL_STRENGTH: -3,
    TRIGGER_DEFENSE: -3,
    TIMING_WINDOWS: {
      SECOND_RELAPSE: 7, // days
      THIRD_RELAPSE: 3   // days
    }
  },
  INACTIVITY: {
    MOTIVATION: -3,
    GRACE_PERIOD: 7, // days after registration
    PENALTY_THRESHOLD: 7 // days of inactivity
  },
  UNPREPARED_TRIGGER: {
    TRIGGER_DEFENSE: -1
  }
};

/**
 * Streak and progression constraints
 */
export const STREAK_CONSTRAINTS = {
  BREATHING: {
    CHECK_DAYS: 7,
    BONUS_THRESHOLD: 3
  },
  HYDRATION: {
    CHECK_DAYS: 7,
    BONUS_THRESHOLD: 3
  },
  LOGGING: {
    CHECK_DAYS: 7,
    BONUS_THRESHOLD: 3
  }
};

/**
 * Time-based constraints
 */
export const TIME_CONSTRAINTS = {
  ADDICTION_REDUCTION: {
    CHECK_INTERVAL: 7, // days
    REDUCTION_PER_WEEK: 2
  },
  MILESTONE_CHECK_INTERVAL: 1, // days
  DAILY_UPDATE_INTERVAL: 24 * 60 * 60 * 1000 // milliseconds
};

/**
 * Assert that a stat value is within valid bounds
 * @param {string} statName - Name of the stat
 * @param {number} value - Value to check
 */
export function assertStatBounds(statName, value) {
  if (value < STAT_CONSTRAINTS.MIN_VALUE || value > STAT_CONSTRAINTS.MAX_VALUE) {
    throw new Error(
      `Stat ${statName} value ${value} is outside valid bounds [${STAT_CONSTRAINTS.MIN_VALUE}, ${STAT_CONSTRAINTS.MAX_VALUE}]`
    );
  }
}

/**
 * Assert that a stat change is valid
 * @param {string} statName - Name of the stat
 * @param {number} change - Change amount
 * @param {number} currentValue - Current stat value
 */
export function assertStatChange(statName, change, currentValue) {
  const newValue = currentValue + change;
  assertStatBounds(statName, newValue);
}

/**
 * Assert that a streak count is valid
 * @param {string} streakType - Type of streak
 * @param {number} count - Streak count
 */
export function assertStreakCount(streakType, count) {
  if (count < 0 || count > 365) { // Reasonable upper bound
    throw new Error(
      `Invalid ${streakType} streak count: ${count}. Must be between 0 and 365.`
    );
  }
}

/**
 * Assert that a date is valid
 * @param {Date} date - Date to validate
 */
export function assertValidDate(date) {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${date}`);
  }
}

/**
 * Assert that a user ID is valid
 * @param {string} userId - User ID to validate
 */
export function assertValidUserId(userId) {
  if (!userId || typeof userId !== 'string' || userId.trim() === '') {
    throw new Error(`Invalid user ID: ${userId}`);
  }
}

/**
 * Assert that a reason string is provided
 * @param {string} reason - Reason string to validate
 */
export function assertValidReason(reason) {
  if (!reason || typeof reason !== 'string' || reason.trim() === '') {
    throw new Error(`Invalid reason: ${reason}`);
  }
}
