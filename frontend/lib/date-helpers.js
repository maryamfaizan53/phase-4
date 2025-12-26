import {
  parseISO,
  formatDistanceToNow,
  differenceInDays,
  format,
  isToday,
  isYesterday,
  subDays,
  startOfDay
} from 'date-fns';

/**
 * Format date string to human-readable format
 * - "Today" for today's date
 * - "Yesterday" for yesterday
 * - "2d ago" for 2-7 days ago
 * - "Dec 24, 2025" for > 7 days ago
 * @param {string} dateString - ISO 8601 date string
 * @returns {string} Formatted date string
 */
export function formatDate(dateString) {
  if (!dateString) return 'Unknown';

  try {
    const date = parseISO(dateString);

    if (isToday(date)) {
      return 'Today';
    }

    if (isYesterday(date)) {
      return 'Yesterday';
    }

    const daysAgo = differenceInDays(new Date(), date);

    if (daysAgo >= 1 && daysAgo <= 7) {
      return `${daysAgo}d ago`;
    }

    // For dates > 7 days ago, show full date
    return format(date, 'MMM d, yyyy');
  } catch {
    return 'Invalid date';
  }
}

/**
 * Check if a date is older than the threshold (default 7 days)
 * @param {string} createdAt - ISO 8601 date string
 * @param {number} thresholdDays - Number of days threshold (default 7)
 * @returns {boolean} True if date is older than threshold
 */
export function isOverdue(createdAt, thresholdDays = 7) {
  if (!createdAt) return false;

  try {
    const date = parseISO(createdAt);
    const daysAgo = differenceInDays(new Date(), date);
    return daysAgo > thresholdDays;
  } catch {
    return false;
  }
}

/**
 * Group tasks by date (ignoring time)
 * @param {Array} tasks - Array of task objects
 * @param {string} dateField - Field name to group by (default 'created_at')
 * @returns {Object} Object with date keys and task arrays
 */
export function groupTasksByDate(tasks = [], dateField = 'created_at') {
  if (!tasks || !Array.isArray(tasks)) {
    return {};
  }

  const grouped = {};

  tasks.forEach(task => {
    try {
      const dateStr = task[dateField];
      if (!dateStr) return;

      const date = startOfDay(parseISO(dateStr));
      const dateKey = format(date, 'yyyy-MM-dd');

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }

      grouped[dateKey].push(task);
    } catch {
      // Skip invalid dates
    }
  });

  return grouped;
}

/**
 * Get array of last N days in "MMM dd" format
 * @param {number} days - Number of days to include (default 7)
 * @returns {Array} Array of formatted date strings
 */
export function getLast7Days(days = 7) {
  const dates = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i);
    dates.push(format(date, 'MMM d'));
  }

  return dates;
}
