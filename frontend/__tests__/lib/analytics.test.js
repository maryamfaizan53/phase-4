import { calculateKPIs } from '../../lib/analytics'

describe('analytics utilities', () => {
  describe('calculateKPIs', () => {
    it('calculates correct totals for empty task list', () => {
      const tasks = []
      const kpis = calculateKPIs(tasks)

      expect(kpis.totalTasks).toBe(0)
      expect(kpis.completedTasks).toBe(0)
      expect(kpis.pendingTasks).toBe(0)
      expect(kpis.overdueTasks).toBe(0)
    })

    it('calculates correct totals for mixed tasks', () => {
      const tasks = [
        { id: 1, status: 'pending', completed: false, created_at: new Date().toISOString() },
        { id: 2, status: 'completed', completed: true, created_at: new Date().toISOString() },
        { id: 3, status: 'pending', completed: false, created_at: new Date().toISOString() },
      ]
      const kpis = calculateKPIs(tasks)

      expect(kpis.totalTasks).toBe(3)
      expect(kpis.completedTasks).toBe(1)
      expect(kpis.pendingTasks).toBe(2)
    })

    it('correctly identifies overdue tasks (older than 7 days)', () => {
      const eightDaysAgo = new Date()
      eightDaysAgo.setDate(eightDaysAgo.getDate() - 8)

      const tasks = [
        { id: 1, status: 'pending', completed: false, created_at: eightDaysAgo.toISOString() },
        { id: 2, status: 'pending', completed: false, created_at: new Date().toISOString() },
      ]
      const kpis = calculateKPIs(tasks)

      expect(kpis.overdueTasks).toBe(1)
      expect(kpis.pendingTasks).toBe(2)
    })

    it('does not count completed tasks as overdue', () => {
      const eightDaysAgo = new Date()
      eightDaysAgo.setDate(eightDaysAgo.getDate() - 8)

      const tasks = [
        { id: 1, status: 'completed', completed: true, created_at: eightDaysAgo.toISOString() },
      ]
      const kpis = calculateKPIs(tasks)

      expect(kpis.overdueTasks).toBe(0)
      expect(kpis.completedTasks).toBe(1)
    })
  })
})
