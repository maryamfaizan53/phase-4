# Testing Guide - Dashboard Enhancement Feature

## Testing Stack

- **Unit Testing**: Jest + React Testing Library
- **E2E Testing**: Playwright (recommended) or Cypress
- **Accessibility Testing**: axe-core, Lighthouse
- **Performance Testing**: Lighthouse, Web Vitals

## Setup Testing Environment

### Install Dependencies

```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install --save-dev jest jest-environment-jsdom
npm install --save-dev @axe-core/react
npm install --save-dev eslint-plugin-testing-library

# For E2E testing (optional)
npm install --save-dev @playwright/test
# or
npm install --save-dev cypress
```

### Jest Configuration

Create `jest.config.js`:

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
  },
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
```

Create `jest.setup.js`:

```javascript
import '@testing-library/jest-dom'
```

## Test Categories

### T041: Integration Tests

Integration tests verify that multiple components work together correctly.

#### Dashboard Integration Test

Create `__tests__/dashboard/Dashboard.integration.test.js`:

```javascript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DashboardPage from '@/app/dashboard/page';
import { tasksAPI } from '@/lib/api';

// Mock API calls
jest.mock('@/lib/api');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

// Mock localStorage
const mockUser = { id: 1, email: 'test@example.com' };
global.localStorage = {
  getItem: jest.fn(() => JSON.stringify(mockUser)),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

describe('Dashboard Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('loads and displays tasks correctly', async () => {
    const mockTasks = [
      { id: 1, title: 'Task 1', status: 'pending', created_at: '2025-01-01' },
      { id: 2, title: 'Task 2', status: 'completed', created_at: '2025-01-02' },
    ];

    tasksAPI.list.mockResolvedValue(mockTasks);

    render(<DashboardPage />);

    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });

    // Verify KPIs are calculated correctly
    expect(screen.getByText('2')).toBeInTheDocument(); // Total tasks
    expect(screen.getByText('1')).toBeInTheDocument(); // Completed tasks
  });

  test('handles task completion toggle', async () => {
    const mockTasks = [
      { id: 1, title: 'Task 1', status: 'pending', created_at: '2025-01-01' },
    ];

    tasksAPI.list.mockResolvedValue(mockTasks);
    tasksAPI.toggleComplete.mockResolvedValue({});

    render(<DashboardPage />);

    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    // Click checkbox to complete task
    const checkbox = screen.getByRole('checkbox', { name: /Mark task "Task 1" as complete/i });
    await userEvent.click(checkbox);

    // Verify API was called
    expect(tasksAPI.toggleComplete).toHaveBeenCalledWith(1, 1, true);
  });

  test('filters tasks by status', async () => {
    const mockTasks = [
      { id: 1, title: 'Pending Task', status: 'pending', created_at: '2025-01-01' },
      { id: 2, title: 'Completed Task', status: 'completed', created_at: '2025-01-02' },
    ];

    tasksAPI.list.mockResolvedValue(mockTasks);

    render(<DashboardPage />);

    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Pending Task')).toBeInTheDocument();
    });

    // Filter by completed
    const filterSelect = screen.getByLabelText(/Filter tasks by status/i);
    await userEvent.selectOptions(filterSelect, 'completed');

    // Verify only completed task is visible
    expect(screen.queryByText('Pending Task')).not.toBeInTheDocument();
    expect(screen.getByText('Completed Task')).toBeInTheDocument();
  });

  test('searches tasks by title', async () => {
    const mockTasks = [
      { id: 1, title: 'Buy groceries', status: 'pending', created_at: '2025-01-01' },
      { id: 2, title: 'Write report', status: 'pending', created_at: '2025-01-02' },
    ];

    tasksAPI.list.mockResolvedValue(mockTasks);

    render(<DashboardPage />);

    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    });

    // Search for "report"
    const searchInput = screen.getByLabelText(/Search tasks/i);
    await userEvent.type(searchInput, 'report');

    // Wait for debounce (300ms)
    await waitFor(() => {
      expect(screen.queryByText('Buy groceries')).not.toBeInTheDocument();
      expect(screen.getByText('Write report')).toBeInTheDocument();
    }, { timeout: 500 });
  });
});
```

#### ChatWidget Integration Test

Create `__tests__/chat/ChatWidget.integration.test.js`:

```javascript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatWidget from '@/components/chat/ChatWidget';
import { chatAPI } from '@/lib/api';

jest.mock('@/lib/api');

describe('ChatWidget Integration Tests', () => {
  const mockUserId = 1;
  const mockOnTaskUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('opens and closes chat widget', async () => {
    render(<ChatWidget userId={mockUserId} onTaskUpdate={mockOnTaskUpdate} />);

    // Initially closed
    expect(screen.queryByText('AI Assistant')).not.toBeInTheDocument();

    // Click to open
    const openButton = screen.getByLabelText('Open chat');
    await userEvent.click(openButton);

    // Now open
    expect(screen.getByText('AI Assistant')).toBeInTheDocument();

    // Click to close
    const closeButton = screen.getByLabelText('Close chat');
    await userEvent.click(closeButton);

    // Closed again
    expect(screen.queryByText('AI Assistant')).not.toBeInTheDocument();
  });

  test('sends message and receives response', async () => {
    chatAPI.sendMessage.mockResolvedValue({ response: 'Task created successfully!' });

    render(<ChatWidget userId={mockUserId} onTaskUpdate={mockOnTaskUpdate} />);

    // Open chat
    const openButton = screen.getByLabelText('Open chat');
    await userEvent.click(openButton);

    // Type and send message
    const input = screen.getByPlaceholderText('Type a message...');
    await userEvent.type(input, 'Create a task');

    const sendButton = screen.getByLabelText('Send message');
    await userEvent.click(sendButton);

    // Wait for response
    await waitFor(() => {
      expect(screen.getByText('Task created successfully!')).toBeInTheDocument();
    });

    // Verify onTaskUpdate was called
    expect(mockOnTaskUpdate).toHaveBeenCalled();
  });
});
```

### T042: Manual QA Testing

Manual testing checklist for comprehensive QA.

#### Functional Testing Checklist

**Dashboard Page**
- [ ] Page loads without errors
- [ ] All 4 KPI cards display correctly
- [ ] KPI values calculate correctly
- [ ] Charts render without errors
- [ ] Task table displays all tasks
- [ ] Pagination works correctly
- [ ] Search filter works
- [ ] Status filter works
- [ ] Task completion toggle works
- [ ] Task edit navigation works
- [ ] Task delete confirmation shows
- [ ] Task delete works

**Chat Widget**
- [ ] Chat button visible in bottom-right
- [ ] Chat opens on button click
- [ ] Chat closes on X button
- [ ] Greeting message displays
- [ ] Text input accepts input
- [ ] Send button sends message
- [ ] Message appears in chat
- [ ] Response appears after API call
- [ ] Dashboard refreshes after task modification
- [ ] Auto-scroll works
- [ ] Loading indicator shows during API call

**Error Handling**
- [ ] API errors display error message
- [ ] Retry button works
- [ ] Empty states display correctly
- [ ] Network errors handled gracefully

### T043: Cross-Browser Testing

Test on the following browsers:

**Desktop**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Safari (latest Mac only)

**Mobile**
- [ ] Chrome Mobile (Android)
- [ ] Safari Mobile (iOS)
- [ ] Samsung Internet (Android)

**Test Points for Each Browser**
- [ ] Layout renders correctly
- [ ] Glassmorphism effects display
- [ ] Charts render correctly
- [ ] All interactions work
- [ ] Chat widget functions
- [ ] Voice input works (if supported)
- [ ] No console errors

### T044: Performance Testing

Performance metrics to measure:

#### Lighthouse Metrics

Run Lighthouse audit and target these scores:

```bash
# Desktop
- Performance: 85+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 85+

# Mobile
- Performance: 75+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 85+
```

#### Core Web Vitals

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

#### Performance Optimizations Implemented

- [x] Lazy loading for charts (dynamic imports)
- [x] Memoized expensive calculations
- [x] Debounced search input (300ms)
- [x] Skeleton loaders for better perceived performance
- [x] Optimized images and SVGs
- [x] Code splitting with Next.js

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run E2E tests (if Playwright installed)
npx playwright test

# Run specific test file
npm test Dashboard.integration.test.js
```

## Test Coverage Goals

- **Unit Tests**: 70%+ coverage
- **Integration Tests**: Key user flows covered
- **E2E Tests**: Critical paths tested
- **Accessibility Tests**: All pages pass axe-core audit

## Continuous Integration

Add to `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test -- --coverage
      - run: npm run build
```

## Bug Reporting Template

When bugs are found during testing:

```markdown
**Bug Title**: [Clear, concise title]

**Severity**: Critical | High | Medium | Low

**Environment**:
- Browser:
- OS:
- Device:

**Steps to Reproduce**:
1.
2.
3.

**Expected Behavior**:

**Actual Behavior**:

**Screenshots/Videos**:

**Console Errors**:
```

## Test Maintenance

- Update tests when features change
- Remove tests for deprecated features
- Keep test data realistic
- Mock external dependencies
- Run tests before each commit
- Review test coverage reports monthly
