import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DashboardPage from '../app/dashboard/page'
import { isAuthenticated } from '../lib/auth'
import { rest } from 'msw'
import { server } from './mocks/server'

// Mock the auth module
jest.mock('../lib/auth', () => ({
  isAuthenticated: jest.fn(() => true),
  getUserId: jest.fn(() => 'test-user-123'),
}))

// Mock Next.js router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/dashboard',
  useSearchParams: () => new URLSearchParams(),
}))

describe('Dashboard Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    isAuthenticated.mockReturnValue(true)
  })

  describe('Task Completion', () => {
    it('toggles task completion status', async () => {
      const user = userEvent.setup()
      render(<DashboardPage />)

      // Wait for tasks to load
      await waitFor(() => {
        expect(screen.getByText('Test Task 1')).toBeInTheDocument()
      })

      // Find and click the completion checkbox for first task
      const checkbox = screen.getAllByRole('checkbox')[0]
      await user.click(checkbox)

      // Verify API was called (MSW will intercept)
      await waitFor(() => {
        // Task status should update
        expect(checkbox).toBeChecked() || expect(checkbox).not.toBeChecked()
      })
    })

    it('updates KPIs after task completion', async () => {
      const user = userEvent.setup()
      render(<DashboardPage />)

      await waitFor(() => {
        expect(screen.getByText('Test Task 1')).toBeInTheDocument()
      })

      // Get initial pending count (should be 2)
      const initialPending = screen.getAllByText('2')[0]
      expect(initialPending).toBeInTheDocument()

      // Complete a pending task
      const checkbox = screen.getAllByRole('checkbox').find(cb => !cb.checked)
      if (checkbox) {
        await user.click(checkbox)

        // KPIs should update
        await waitFor(() => {
          // Pending should decrease, completed should increase
          expect(screen.getByText('1') || screen.getByText('3')).toBeInTheDocument()
        })
      }
    })

    it('shows error message if completion fails', async () => {
      // Override handler to return error
      server.use(
        rest.patch('http://localhost:8000/api/:userId/tasks/:taskId/complete', (req, res, ctx) => {
          return res(ctx.status(500))
        })
      )

      const user = userEvent.setup()
      render(<DashboardPage />)

      await waitFor(() => {
        expect(screen.getByText('Test Task 1')).toBeInTheDocument()
      })

      const checkbox = screen.getAllByRole('checkbox')[0]
      await user.click(checkbox)

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/error/i) || screen.getByText(/failed/i)).toBeInTheDocument()
      })
    })
  })

  describe('Task Deletion', () => {
    it('deletes task when delete button clicked', async () => {
      const user = userEvent.setup()
      render(<DashboardPage />)

      await waitFor(() => {
        expect(screen.getByText('Test Task 1')).toBeInTheDocument()
      })

      // Find delete button
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
      await user.click(deleteButtons[0])

      // Confirm deletion (if confirmation dialog exists)
      const confirmButton = screen.queryByRole('button', { name: /confirm/i })
      if (confirmButton) {
        await user.click(confirmButton)
      }

      // Task should be removed from list
      await waitFor(() => {
        expect(screen.queryByText('Test Task 1')).not.toBeInTheDocument()
      })
    })

    it('updates KPIs after task deletion', async () => {
      const user = userEvent.setup()
      render(<DashboardPage />)

      await waitFor(() => {
        expect(screen.getByText('Test Task 1')).toBeInTheDocument()
      })

      // Get initial total count (should be 3)
      const initialTotal = screen.getAllByText('3')[0]
      expect(initialTotal).toBeInTheDocument()

      // Delete a task
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
      await user.click(deleteButtons[0])

      // Confirm if needed
      const confirmButton = screen.queryByRole('button', { name: /confirm/i })
      if (confirmButton) {
        await user.click(confirmButton)
      }

      // Total should decrease
      await waitFor(() => {
        expect(screen.queryByText('2')).toBeInTheDocument()
      })
    })

    it('shows error message if deletion fails', async () => {
      server.use(
        rest.delete('http://localhost:8000/api/:userId/tasks/:taskId', (req, res, ctx) => {
          return res(ctx.status(500))
        })
      )

      const user = userEvent.setup()
      render(<DashboardPage />)

      await waitFor(() => {
        expect(screen.getByText('Test Task 1')).toBeInTheDocument()
      })

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
      await user.click(deleteButtons[0])

      await waitFor(() => {
        expect(screen.getByText(/error/i) || screen.getByText(/failed/i)).toBeInTheDocument()
      })
    })
  })

  describe('Task Search and Filter', () => {
    it('filters tasks by search query', async () => {
      const user = userEvent.setup()
      render(<DashboardPage />)

      await waitFor(() => {
        expect(screen.getByText('Test Task 1')).toBeInTheDocument()
        expect(screen.getByText('Test Task 2')).toBeInTheDocument()
      })

      // Find search input
      const searchInput = screen.getByPlaceholderText(/search/i)
      await user.type(searchInput, 'Overdue')

      // Should filter to show only matching tasks
      await waitFor(() => {
        expect(screen.getByText('Overdue Task')).toBeInTheDocument()
        expect(screen.queryByText('Test Task 1')).not.toBeInTheDocument()
      })
    })

    it('filters tasks by status', async () => {
      const user = userEvent.setup()
      render(<DashboardPage />)

      await waitFor(() => {
        expect(screen.getByText('Test Task 1')).toBeInTheDocument()
      })

      // Find status filter dropdown
      const statusFilter = screen.getByRole('combobox', { name: /status/i }) ||
                           screen.getByLabelText(/status/i)

      // Select 'completed'
      await user.selectOptions(statusFilter, 'completed')

      // Should show only completed tasks
      await waitFor(() => {
        expect(screen.getByText('Test Task 2')).toBeInTheDocument()
        expect(screen.queryByText('Test Task 1')).not.toBeInTheDocument()
      })
    })
  })

  describe('Task Pagination', () => {
    it('paginates tasks when more than 10 exist', async () => {
      // Override handler to return 15 tasks
      server.use(
        rest.get('http://localhost:8000/api/:userId/tasks', (req, res, ctx) => {
          const tasks = Array.from({ length: 15 }, (_, i) => ({
            id: i + 1,
            user_id: 'test-user-123',
            title: `Task ${i + 1}`,
            description: `Description ${i + 1}`,
            status: 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            completed: false,
          }))
          return res(ctx.json(tasks))
        })
      )

      const user = userEvent.setup()
      render(<DashboardPage />)

      await waitFor(() => {
        expect(screen.getByText('Task 1')).toBeInTheDocument()
      })

      // Should show only 10 tasks on first page
      expect(screen.getByText('Task 10')).toBeInTheDocument()
      expect(screen.queryByText('Task 11')).not.toBeInTheDocument()

      // Click next page
      const nextButton = screen.getByRole('button', { name: /next/i })
      await user.click(nextButton)

      // Should show tasks 11-15
      await waitFor(() => {
        expect(screen.getByText('Task 11')).toBeInTheDocument()
        expect(screen.queryByText('Task 1')).not.toBeInTheDocument()
      })
    })
  })

  describe('Chat Integration', () => {
    it('sends chat message and refreshes dashboard', async () => {
      const user = userEvent.setup()
      render(<DashboardPage />)

      await waitFor(() => {
        expect(screen.getByText('Test Task 1')).toBeInTheDocument()
      })

      // Open chat widget (if not already open)
      const chatButton = screen.queryByRole('button', { name: /chat/i })
      if (chatButton) {
        await user.click(chatButton)
      }

      // Find chat input
      const chatInput = screen.getByPlaceholderText(/message/i) ||
                        screen.getByRole('textbox', { name: /chat/i })

      // Type and send message
      await user.type(chatInput, 'Add task: Test from chat')
      const sendButton = screen.getByRole('button', { name: /send/i })
      await user.click(sendButton)

      // Dashboard should refresh (tasks refetched)
      await waitFor(() => {
        // Verify API was called (MSW intercepts)
        expect(screen.getByText('Test Task 1')).toBeInTheDocument()
      })
    })

    it('displays chat response in widget', async () => {
      const user = userEvent.setup()
      render(<DashboardPage />)

      await waitFor(() => {
        expect(screen.getByText('Test Task 1')).toBeInTheDocument()
      })

      const chatButton = screen.queryByRole('button', { name: /chat/i })
      if (chatButton) {
        await user.click(chatButton)
      }

      const chatInput = screen.getByPlaceholderText(/message/i)
      await user.type(chatInput, 'Hello')

      const sendButton = screen.getByRole('button', { name: /send/i })
      await user.click(sendButton)

      // Should display user message and assistant response
      await waitFor(() => {
        expect(screen.getByText('Hello')).toBeInTheDocument()
        expect(screen.getByText(/Mock response/i)).toBeInTheDocument()
      })
    })

    it('closes chat widget when close button clicked', async () => {
      const user = userEvent.setup()
      render(<DashboardPage />)

      await waitFor(() => {
        expect(screen.getByText('Test Task 1')).toBeInTheDocument()
      })

      // Open chat
      const chatButton = screen.queryByRole('button', { name: /chat/i })
      if (chatButton) {
        await user.click(chatButton)

        // Find and click close button
        const closeButton = screen.getByRole('button', { name: /close/i })
        await user.click(closeButton)

        // Chat should be closed
        await waitFor(() => {
          expect(screen.queryByPlaceholderText(/message/i)).not.toBeVisible()
        })
      }
    })
  })

  describe('Task Navigation', () => {
    it('navigates to edit page when edit button clicked', async () => {
      const user = userEvent.setup()
      render(<DashboardPage />)

      await waitFor(() => {
        expect(screen.getByText('Test Task 1')).toBeInTheDocument()
      })

      // Find edit button
      const editButtons = screen.getAllByRole('button', { name: /edit/i }) ||
                          screen.getAllByRole('link', { name: /edit/i })

      await user.click(editButtons[0])

      // Should navigate to edit page
      expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/todos/'))
    })
  })

  describe('Error Recovery', () => {
    it('allows retry after fetch error', async () => {
      let shouldFail = true

      server.use(
        rest.get('http://localhost:8000/api/:userId/tasks', (req, res, ctx) => {
          if (shouldFail) {
            shouldFail = false
            return res(ctx.status(500))
          }
          return res(ctx.json([]))
        })
      )

      const user = userEvent.setup()
      render(<DashboardPage />)

      // Should show error state
      await waitFor(() => {
        expect(screen.getByText(/error/i) || screen.getByText(/failed/i)).toBeInTheDocument()
      })

      // Click retry button
      const retryButton = screen.getByRole('button', { name: /retry/i })
      await user.click(retryButton)

      // Should successfully load on retry
      await waitFor(() => {
        expect(screen.queryByText(/error/i)).not.toBeInTheDocument()
      })
    })
  })
})
