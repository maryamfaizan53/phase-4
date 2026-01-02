import { rest } from 'msw'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Mock tasks data
const mockTasks = [
  {
    id: 1,
    user_id: 'test-user-123',
    title: 'Test Task 1',
    description: 'This is a test task',
    status: 'pending',
    created_at: '2025-01-01T10:00:00Z',
    updated_at: '2025-01-01T10:00:00Z',
    completed: false,
  },
  {
    id: 2,
    user_id: 'test-user-123',
    title: 'Test Task 2',
    description: 'This is another test task',
    status: 'completed',
    created_at: '2025-01-02T10:00:00Z',
    updated_at: '2025-01-02T11:00:00Z',
    completed: true,
  },
  {
    id: 3,
    user_id: 'test-user-123',
    title: 'Overdue Task',
    description: 'This task is overdue',
    status: 'pending',
    created_at: '2024-12-20T10:00:00Z',
    updated_at: '2024-12-20T10:00:00Z',
    completed: false,
  },
]

export const handlers = [
  // Health check
  rest.get(`${API_URL}/health`, (req, res, ctx) => {
    return res(ctx.json({ status: 'ok' }))
  }),

  // List tasks
  rest.get(`${API_URL}/api/:userId/tasks`, (req, res, ctx) => {
    return res(ctx.json(mockTasks))
  }),

  // Create task
  rest.post(`${API_URL}/api/:userId/tasks`, async (req, res, ctx) => {
    const body = await req.json()
    const newTask = {
      id: Date.now(),
      user_id: 'test-user-123',
      title: body.title,
      description: body.description || '',
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      completed: false,
    }
    return res(ctx.status(201), ctx.json(newTask))
  }),

  // Toggle task completion
  rest.patch(`${API_URL}/api/:userId/tasks/:taskId/complete`, (req, res, ctx) => {
    const task = mockTasks.find(t => t.id === parseInt(req.params.taskId))
    if (!task) {
      return res(ctx.status(404))
    }
    const updatedTask = {
      ...task,
      completed: !task.completed,
      status: task.completed ? 'pending' : 'completed',
      updated_at: new Date().toISOString(),
    }
    return res(ctx.json(updatedTask))
  }),

  // Update task
  rest.put(`${API_URL}/api/:userId/tasks/:taskId`, async (req, res, ctx) => {
    const task = mockTasks.find(t => t.id === parseInt(req.params.taskId))
    if (!task) {
      return res(ctx.status(404))
    }
    const body = await req.json()
    const updatedTask = {
      ...task,
      ...body,
      updated_at: new Date().toISOString(),
    }
    return res(ctx.json(updatedTask))
  }),

  // Delete task
  rest.delete(`${API_URL}/api/:userId/tasks/:taskId`, (req, res, ctx) => {
    const task = mockTasks.find(t => t.id === parseInt(req.params.taskId))
    if (!task) {
      return res(ctx.status(404))
    }
    return res(ctx.status(204))
  }),

  // Chat endpoint
  rest.post(`${API_URL}/api/:userId/chat`, async (req, res, ctx) => {
    const body = await req.json()
    const response = {
      response: `Mock response to: ${body.message}`,
      conversation_id: 1,
    }
    return res(ctx.json(response))
  }),
]
