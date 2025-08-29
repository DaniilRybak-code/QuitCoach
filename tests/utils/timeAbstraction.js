/**
 * Time abstraction utility for testing
 * Allows tests to set explicit 'now' times and control date-based logic
 */

class TimeAbstraction {
  constructor() {
    this.fixedTime = null;
    this.originalDate = global.Date;
    this.originalNow = Date.now;
  }

  /**
   * Set a fixed time for testing
   * @param {string|Date} time - ISO string or Date object
   */
  setFixedTime(time) {
    if (typeof time === 'string') {
      this.fixedTime = new Date(time);
    } else if (time instanceof Date) {
      this.fixedTime = new Date(time.getTime());
    } else {
      throw new Error('Time must be a string or Date object');
    }

    // Override Date constructor
    global.Date = class extends this.originalDate {
      constructor(...args) {
        if (args.length === 0) {
          super(this.fixedTime);
          return this;
        }
        super(...args);
        return this;
      }
    };

    // Override Date.now()
    global.Date.now = () => this.fixedTime.getTime();
  }

  /**
   * Reset time to real time
   */
  resetTime() {
    this.fixedTime = null;
    global.Date = this.originalDate;
    global.Date.now = this.originalNow;
  }

  /**
   * Get current time (either fixed or real)
   */
  now() {
    return this.fixedTime || new Date();
  }

  /**
   * Get date string for a specific offset from current time
   * @param {number} daysOffset - Days to offset (negative for past, positive for future)
   */
  getDateString(daysOffset = 0) {
    const date = new Date(this.now());
    date.setDate(date.getDate() + daysOffset);
    return date.toDateString();
  }

  /**
   * Get ISO string for a specific offset from current time
   * @param {number} daysOffset - Days to offset (negative for past, positive for future)
   */
  getISOString(daysOffset = 0) {
    const date = new Date(this.now());
    date.setDate(date.getDate() + daysOffset);
    return date.toISOString();
  }

  /**
   * Set time to a specific date and timezone
   * @param {string} dateString - Date string (e.g., "2024-01-15")
   * @param {string} timeString - Time string (e.g., "14:30:00")
   * @param {string} timezone - Timezone (e.g., "Europe/London" or "UTC")
   */
  setDateTime(dateString, timeString = "00:00:00", timezone = "UTC") {
    const dateTimeString = `${dateString}T${timeString}`;
    
    if (timezone === "UTC") {
      this.setFixedTime(`${dateTimeString}Z`);
    } else {
      // For non-UTC timezones, we'll use the local timezone
      // Note: This is a simplified approach - in production you might want to use a library like date-fns-tz
      const date = new Date(dateTimeString);
      this.setFixedTime(date);
    }
  }
}

// Create singleton instance
const timeAbstraction = new TimeAbstraction();

export default timeAbstraction;
