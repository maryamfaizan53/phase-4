import { differenceInDays, parseISO } from 'date-fns';

/**
 * Calculate key performance indicators from task array
 * @param {Array} tasks - Array of task objects
 * @returns {Object} KPI object with totalTasks, completedTasks, pendingTasks, overdueTasks
 */
export function calculateKPIs(tasks = []) {
  if (!tasks || !Array.isArray(tasks)) {
    return { totalTasks: 0, completedTasks: 0, pendingTasks: 0, overdueTasks: 0, urgentTasks: 0 };
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;

  // Count overdue tasks: pending tasks created more than 7 days ago
  const now = new Date();
  const overdueTasks = tasks.filter(task => {
    if (task.status !== 'pending') return false;
    try {
      const createdDate = parseISO(task.created_at);
      return differenceInDays(now, createdDate) > 7;
    } catch {
      return false;
    }
  }).length;

  // Count urgent tasks: pending tasks with 'urgent' priority
  const urgentTasks = tasks.filter(task =>
    task.status === 'pending' && task.priority === 'urgent'
  ).length;

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    overdueTasks,
    urgentTasks
  };
}

/**
 * Get status distribution for pie/donut charts
 * @param {Array} tasks - Array of task objects
 * @returns {Array} Array of { name, value } objects
 */
export function getStatusDistribution(tasks = []) {
  if (!tasks || !Array.isArray(tasks)) {
    return [];
  }

  const pending = tasks.filter(task => task.status === 'pending').length;
  const completed = tasks.filter(task => task.status === 'completed').length;

  return [
    { name: 'Pending', value: pending },
    { name: 'Completed', value: completed }
  ].filter(item => item.value > 0); // Only include non-zero values
}

/**
 * Get time series data for line charts showing created/completed tasks over time
 * @param {Array} tasks - Array of task objects
 * @param {number} days - Number of days to include (default 7)
 * @returns {Array} Array of { date, created, completed } objects
 */
export function getTimeSeriesData(tasks = [], days = 7) {
  if (!tasks || !Array.isArray(tasks)) {
    return [];
  }

  const now = new Date();
  const dateMap = {};

  // Initialize all dates in the range
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
    dateMap[dateKey] = { date: dateKey, created: 0, completed: 0 };
  }

  // Count created and completed tasks per day
  tasks.forEach(task => {
    try {
      // Count created tasks
      const createdDate = parseISO(task.created_at).toISOString().split('T')[0];
      if (dateMap[createdDate]) {
        dateMap[createdDate].created += 1;
      }

      // Count completed tasks (if status is completed and updated_at is different from created_at)
      if (task.status === 'completed' && task.updated_at && task.updated_at !== task.created_at) {
        const completedDate = parseISO(task.updated_at).toISOString().split('T')[0];
        if (dateMap[completedDate]) {
          dateMap[completedDate].completed += 1;
        }
      }
    } catch {
      // Skip invalid dates
    }
  });

  // Convert to array and format dates for display
  return Object.values(dateMap).map(item => {
    try {
      const date = parseISO(item.date);
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const displayDate = `${monthNames[date.getMonth()]} ${date.getDate()}`;
      return {
        date: displayDate,
        created: item.created,
        completed: item.completed
      };
    } catch {
      return item;
    }
  });
}

/**
 * Get status breakdown for bar charts
 * @param {Array} tasks - Array of task objects
 * @returns {Array} Array of { status, count } objects
 */
export function getStatusBreakdown(tasks = []) {
  if (!tasks || !Array.isArray(tasks)) {
    return [];
  }

  const statusCounts = {};

  tasks.forEach(task => {
    const status = task.status || 'unknown';
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  return Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count
  }));
}

/**
 * Calculate priority distribution from task array
 * @param {Array} tasks - Array of task objects
 * @returns {Object} Priority counts object { low: 2, medium: 7, high: 5, urgent: 3 }
 */
export function calculatePriorityDistribution(tasks = []) {
  if (!tasks || !Array.isArray(tasks)) {
    return { low: 0, medium: 0, high: 0, urgent: 0 };
  }

  const distribution = {
    low: 0,
    medium: 0,
    high: 0,
    urgent: 0
  };

  tasks.forEach(task => {
    const priority = task.priority || 'medium';
    if (distribution.hasOwnProperty(priority)) {
      distribution[priority] += 1;
    }
  });

  return distribution;
}

/**
 * Get priority distribution for pie/donut charts
 * @param {Array} tasks - Array of task objects
 * @returns {Array} Array of { name, value, priority } objects for Recharts
 */
export function getPriorityDistribution(tasks = []) {
  if (!tasks || !Array.isArray(tasks)) {
    return [];
  }

  const distribution = calculatePriorityDistribution(tasks);

  // Convert to Recharts format with priority key for color mapping
  return Object.entries(distribution)
    .filter(([_, count]) => count > 0) // Only include non-zero values
    .map(([priority, count]) => ({
      name: priority.charAt(0).toUpperCase() + priority.slice(1),
      value: count,
      priority: priority
    }));
}
