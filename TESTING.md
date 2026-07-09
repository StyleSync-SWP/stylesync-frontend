# Frontend Testing Guide

This project uses Vitest with React Testing Library for unit and integration testing.

## Setup

The testing framework is already configured with:
- **Vitest**: Fast unit test framework
- **React Testing Library**: For testing React components
- **jsdom**: DOM environment for Node.js
- **@testing-library/user-event**: For simulating user interactions

## Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm test -- --coverage
```

## Test Structure

```
src/test/
├── setup.ts           # Global test setup
├── components/        # Component tests
│   └── Logo.test.tsx
├── stores/            # State management tests
│   └── authStore.test.ts
└── utils/             # Utility function tests
    └── filterUtils.test.ts
```

## Writing Tests

### Component Tests

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyComponent from '../components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Store Tests

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useMyStore from '../stores/myStore';

describe('MyStore', () => {
  beforeEach(() => {
    useMyStore.setState({ /* initial state */ });
  });

  it('updates state correctly', () => {
    const { result } = renderHook(() => useMyStore());
    act(() => {
      result.current.someAction();
    });
    expect(result.current.someValue).toBe('expected');
  });
});
```

## Best Practices

1. **Test user behavior, not implementation details**
   - Focus on what users see and interact with
   - Avoid testing internal state or implementation

2. **Use meaningful test names**
   - Describe what the test does and what's expected

3. **Keep tests isolated**
   - Each test should be independent
   - Clean up after each test

4. **Test edge cases**
   - Empty states
   - Error conditions
   - Boundary values

5. **Mock external dependencies**
   - API calls
   - Browser APIs
   - Third-party libraries

## Current Test Coverage

- ✅ Logo component rendering and styling
- ✅ Auth store state management
- ✅ Filter utilities for wardrobe/outfit filtering

## Adding More Tests

When adding new features, consider adding tests for:

1. **Components**: Rendering, user interactions, state changes
2. **Stores**: State updates, actions, selectors
3. **Utilities**: Pure functions, data transformations
4. **API**: Mock API responses, error handling
5. **Integration**: Component + Store interactions

## Troubleshooting

If tests fail:
1. Check that all dependencies are installed
2. Ensure the test environment is properly configured
3. Verify that component imports are correct
4. Check for async issues (use `waitFor` for async operations)
