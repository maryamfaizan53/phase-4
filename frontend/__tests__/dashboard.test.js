import { render, screen, waitFor } from '@testing-library/react'
import DashboardPage from '../app/dashboard/page'
import { isAuthenticated } from '../lib/auth'

// Mock the auth module
jest.mock('../lib/auth', () => ({
  isAuthenticated: jest.fn(),
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

describe('Dashboard Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockPush.mockClear()
  })

  describe('Authentication Guard', () => {
    it('redirects to /login if not authenticated', () => {
      isAuthenticated.mockReturnValue(false)

      render(<DashboardPage />)

      expect(mockPush).toHaveBeenCalledWith('/login')
    })

    it('renders dashboard if authenticated', async () => {
      isAuthenticated.mockReturnValue(true)

      render(<DashboardPage />)

      // Should not redirect
      expect(mockPush).not.toHaveBeenCalled()

      // Should show loading state first, then dashboard content
      await waitFor(() => {
        expect(screen.queryByText(/Dashboard/i)).toBeInTheDocument()
      })
    })
  })

  describe('Data Loading', () => {
    beforeEach(() => {
      isAuthenticated.mockReturnValue(true)
    })

    it('shows loading skeletons while fetching tasks', () => {
      render(<DashboardPage />)

      // Should show skeleton loaders (if implemented)
      // This test will need adjustment based on actual loading state implementation
      expect(screen.queryByRole('progressbar') || screen.queryByTestId('skeleton-loader')).toBeTruthy()
    })

    it('fetches and displays tasks on mount', async () => {
      render(<DashboardPage />)

      await waitFor(() => {
        // Wait for tasks to be loaded (mocked by MSW)
        // Check if tasks appear in the table
        expect(screen.queryByText('Test Task 1')).toBeInTheDocument()
      })
    })

    it('displays error state when fetch fails', async () => {
      // This will be handled by MSW error handlers if configured
      // Or we can override the handler for this specific test
      render(<DashboardPage />)

      // Test error state rendering
      // Needs implementation of error state in dashboard
    })
  })

  describe('KPI Cards', () => {
    beforeEach(() => {
      isAuthenticated.mockReturnValue(true)
    })

    it('calculates and displays correct KPIs', async () => {
      render(<DashboardPage />)

      await waitFor(() => {
        // Total tasks (mocked data has 3 tasks)
        expect(screen.getByText('3')).toBeInTheDocument()

        // Completed tasks (1 completed)
        expect(screen.getByText('1')).toBeInTheDocument()

        // Pending tasks (2 pending)
        expect(screen.getByText('2')).toBeInTheDocument()
      })
    })

    it('displays KPI labels correctly', async () => {
      render(<DashboardPage />)

      await waitFor(() => {
        expect(screen.getByText(/Total Tasks/i)).toBeInTheDocument()
        expect(screen.getByText(/Completed/i)).toBeInTheDocument()
        expect(screen.getByText(/Pending/i)).toBeInTheDocument()
        expect(screen.getByText(/Overdue/i)).toBeInTheDocument()
      })
    })

    it('identifies overdue tasks correctly', async () => {
      render(<DashboardPage />)

      await waitFor(() => {
        // Mock data includes 1 overdue task (created on 2024-12-20)
        const overdueElement = screen.getByText(/Overdue/i).closest('div')
        expect(overdueElement).toHaveTextContent('1')
      })
    })
  })

  describe('Charts', () => {
    beforeEach(() => {
      isAuthenticated.mockReturnValue(true)
    })

    it('renders donut chart with task distribution', async () => {
      render(<DashboardPage />)

      await waitFor(() => {
        // Check for chart presence (Recharts renders SVG)
        const charts = screen.getAllByRole('img', { hidden: true })
        expect(charts.length).toBeGreaterThan(0)
      })
    })

    it('renders line chart with activity trend', async () => {
      render(<DashboardPage />)

      await waitFor(() => {
        expect(screen.getByText(/Activity Trend/i)).toBeInTheDocument()
      })
    })

    it('renders bar chart with status breakdown', async () => {
      render(<DashboardPage />)

      await waitFor(() => {
        expect(screen.getByText(/Status Breakdown/i) || screen.getByText(/Tasks by Status/i)).toBeInTheDocument()
      })
    })
  })

  describe('Task Table', () => {
    beforeEach(() => {
      isAuthenticated.mockReturnValue(true)
    })

    it('displays tasks in table format', async () => {
      render(<DashboardPage />)

      await waitFor(() => {
        expect(screen.getByText('Test Task 1')).toBeInTheDocument()
        expect(screen.getByText('Test Task 2')).toBeInTheDocument()
        expect(screen.getByText('Overdue Task')).toBeInTheDocument()
      })
    })

    it('shows task descriptions', async () => {
      render(<DashboardPage />)

      await waitFor(() => {
        expect(screen.getByText('This is a test task')).toBeInTheDocument()
        expect(screen.getByText('This is another test task')).toBeInTheDocument()
      })
    })

    it('displays task status correctly', async () => {
      render(<DashboardPage />)

      await waitFor(() => {
        // Completed task should have visual indicator (checkbox checked, badge, etc.)
        const completedTask = screen.getByText('Test Task 2').closest('tr')
        expect(completedTask).toHaveClass(/completed/i) || expect(completedTask).toContainHTML('completed')
      })
    })

    it('shows action buttons (edit, delete)', async () => {
      render(<DashboardPage />)

      await waitFor(() => {
        const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
        expect(deleteButtons.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Responsive Design', () => {
    beforeEach(() => {
      isAuthenticated.mockReturnValue(true)
    })

    it('applies mobile styles on small screens', () => {
      // Mock window.matchMedia for mobile
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query.includes('max-width: 768px'),
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }))

      render(<DashboardPage />)

      // Test mobile-specific classes or layout
      // This will depend on implementation
    })
  })

  describe('Accessibility', () => {
    beforeEach(() => {
      isAuthenticated.mockReturnValue(true)
    })

    it('has skip-to-main link for screen readers', async () => {
      render(<DashboardPage />)

      const skipLink = screen.getByText(/Skip to main content/i)
      expect(skipLink).toBeInTheDocument()
      expect(skipLink).toHaveAttribute('href', '#main-content')
    })

    it('has proper ARIA labels on interactive elements', async () => {
      render(<DashboardPage />)

      await waitFor(() => {
        // Charts should have aria-labels
        const charts = document.querySelectorAll('[aria-label*="chart"]')
        expect(charts.length).toBeGreaterThan(0)
      })
    })

    it('has semantic HTML structure', () => {
      render(<DashboardPage />)

      // Should have main landmark
      expect(screen.getByRole('main')).toBeInTheDocument()
    })
  })

  describe('Empty States', () => {
    it('displays empty state when no tasks exist', async () => {
      // Override MSW handler to return empty array
      const { server } = require('./mocks/server')
      const { rest } = require('msw')

      server.use(
        rest.get('http://localhost:8000/api/:userId/tasks', (req, res, ctx) => {
          return res(ctx.json([]))
        })
      )

      isAuthenticated.mockReturnValue(true)
      render(<DashboardPage />)

      await waitFor(() => {
        expect(screen.getByText(/No tasks/i) || screen.getByText(/Get started/i)).toBeInTheDocument()
      })
    })
  })
})
