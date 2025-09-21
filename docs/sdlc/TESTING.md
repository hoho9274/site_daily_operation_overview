# Testing Best Practices

## Table of Contents
- [Testing Setup](#testing-setup)
- [Types of Tests](#types-of-tests)
- [Writing Tests](#writing-tests)
- [Test Coverage](#test-coverage)
- [Testing Workflow](#testing-workflow)
- [E2E Testing](#e2e-testing)

## Testing Setup

Our project uses the following testing stack:
- Jest as the test runner
- React Native Testing Library for component testing
- Jest mocks for external dependencies
- Custom test utilities for common testing scenarios

### Running Tests
```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage

# CI mode with limited workers
npm run test:ci
```

## Types of Tests

### 1. Unit Tests
- Test individual functions and utilities
- Located in `__tests__` folders next to the code being tested
- Focus on pure logic and data transformations

Example:
```typescript
// utils/__tests__/familyPermissions.test.ts
describe('hasPermission', () => {
  it('returns true for admin role', () => {
    expect(hasPermission('admin', 'edit')).toBe(true);
  });
});
```

### 2. Component Tests
- Test React components in isolation
- Use `@testing-library/react-native`
- Focus on user interactions and rendering
- Located in `__tests__` folders next to components

Example:
```typescript
// components/__tests__/KidCard.test.tsx
import { render, fireEvent } from '@testing-library/react-native';

describe('KidCard', () => {
  it('renders kid details correctly', () => {
    const { getByText } = render(<KidCard name="John" />);
    expect(getByText('John')).toBeTruthy();
  });
});
```

### 3. Integration Tests
- Test multiple components working together
- Test context providers and data flow
- Use the custom render utility from `test-utils.tsx`

Example:
```typescript
// screens/__tests__/FamilyScreen.test.tsx
import { render, waitFor } from '../../../utils/test-utils';

describe('FamilyScreen', () => {
  it('loads and displays family data', async () => {
    const { getByText } = render(<FamilyScreen />);
    await waitFor(() => {
      expect(getByText('Family Members')).toBeTruthy();
    });
  });
});
```

## Writing Tests

### Best Practices

1. **Test File Organization**
   ```
   src/
   ├── components/
   │   ├── Button.tsx
   │   └── __tests__/
   │       └── Button.test.tsx
   ```

2. **Test Structure**
   - Use descriptive test names
   - Follow the Arrange-Act-Assert pattern
   - Group related tests with `describe`
   - Use `beforeEach` for common setup

3. **Mocking**
   - Mock external dependencies in `jest.setup.js`
   - Use `jest.mock()` for local mocks
   - Reset mocks between tests with `beforeEach`

4. **Async Testing**
   - Use `async/await` with `waitFor`
   - Test loading states
   - Test error states
   - Test success states

### Common Patterns

1. **Testing User Input**
```typescript
it('handles user input', () => {
  const { getByPlaceholderText } = render(<Input />);
  const input = getByPlaceholderText('Enter text');
  fireEvent.changeText(input, 'test');
  expect(input.props.value).toBe('test');
});
```

2. **Testing Navigation**
```typescript
it('navigates on button press', () => {
  const navigation = { navigate: jest.fn() };
  const { getByText } = render(<Screen navigation={navigation} />);
  fireEvent.press(getByText('Go'));
  expect(navigation.navigate).toHaveBeenCalledWith('NextScreen');
});
```

3. **Testing Context**
```typescript
it('uses context value', () => {
  const wrapper = ({ children }) => (
    <AuthProvider initialValue={{ user: null }}>
      {children}
    </AuthProvider>
  );
  const { getByText } = render(<Component />, { wrapper });
  expect(getByText('Sign In')).toBeTruthy();
});
```

## Test Coverage

### Coverage Requirements

#### Standard Features
- Statements: 80%
- Branches: 75%
- Functions: 80%
- Lines: 80%

#### Critical Flows
See [CRITICAL_FLOWS.md](./CRITICAL_FLOWS.md) for complete list.
- Core Logic: 100%
- Error Handling: 100%
- Edge Cases: 100%
- Integration Points: 100%

### Critical Paths
The following must have 100% coverage:
- Authentication flows
- Data mutation operations
- Permission checks
- Form validation
- Navigation guards
- All flows listed in CRITICAL_FLOWS.md

## Testing Workflow

### For New Features

1. **Critical Flow Assessment**
   - Review [CRITICAL_FLOWS.md](./CRITICAL_FLOWS.md)
   - Complete assessment checklist
   - Determine testing requirements

2. **Test Planning**
   - Standard features:
     - Write unit tests
     - Add integration tests
     - Consider E2E tests
   - Critical flows:
     - Complete test coverage
     - Mandatory E2E tests
     - Security test cases
     - Performance test cases

3. **Implementation**
   - Write tests first (TDD approach)
   - Implement the feature
   - Ensure tests pass
   - Check coverage requirements
   - Add regression tests if needed

### For Bug Fixes

1. **Impact Assessment**
   - Check if bug affects critical flows
   - Review security implications
   - Check data integrity impact

2. **Test Implementation**
   - Write failing test that reproduces the bug
   - Fix the bug
   - Verify test passes
   - For critical flows:
     - Add regression tests
     - Update E2E tests
     - Verify all related flows

### Pre-commit Checks
```bash
# Run before committing
npm run test
npm run test:coverage

# For critical flows
npm run e2e:test:ios
npm run e2e:test:android
```

## E2E Testing

### Critical Flow Coverage

1. **Authentication Flows**
```typescript
describe('Authentication', () => {
  it('should complete full login flow', async () => {
    await element(by.id('email')).typeText('user@example.com');
    await element(by.id('password')).typeText('password');
    await element(by.id('login-button')).tap();
    await expect(element(by.id('dashboard'))).toBeVisible();
  });

  it('should handle invalid credentials', async () => {
    await element(by.id('email')).typeText('invalid@example.com');
    await element(by.id('password')).typeText('wrong');
    await element(by.id('login-button')).tap();
    await expect(element(by.text('Invalid credentials'))).toBeVisible();
  });
});
```

2. **Family Management**
```typescript
describe('Family Management', () => {
  it('should create and share family code', async () => {
    await element(by.id('create-family')).tap();
    await element(by.id('family-name')).typeText('Test Family');
    await element(by.id('submit')).tap();
    await expect(element(by.id('family-code'))).toBeVisible();
  });
});
```

3. **Data Synchronization**
```typescript
describe('Data Sync', () => {
  it('should handle offline operations', async () => {
    await device.setNetworkConnection({ wifi: false, data: false });
    // Perform operations
    await device.setNetworkConnection({ wifi: true, data: true });
    // Verify sync
  });
});
```

### Test Stability for Critical Flows

1. **Retry Logic**
```typescript
const retryOptions = {
  retries: 3,
  interval: 1000,
};

it('should handle flaky operations', async () => {
  await retry(async () => {
    await element(by.id('sync-button')).tap();
    await expect(element(by.id('sync-complete'))).toBeVisible();
  }, retryOptions);
});
```

2. **Cleanup**
```typescript
beforeEach(async () => {
  await device.reloadReactNative();
  await clearTestData(); // Clear any test data
});

afterEach(async () => {
  await resetAppState(); // Reset to known state
});
```

### Monitoring and Reporting

1. **Test Reports**
   - Generate detailed reports for critical flows
   - Track success rates
   - Monitor test duration
   - Alert on failures

2. **Performance Metrics**
   - Response times
   - Animation smoothness
   - Resource usage
   - Network calls

### Setup

We use Detox for end-to-end testing. The setup includes:
- Detox configuration in `.detoxrc.js`
- E2E test configuration in `e2e/jest.config.js`
- Test files in `e2e/` directory

### Running E2E Tests

#### iOS
```bash
# Build app for testing
npm run e2e:build:ios

# Run tests
npm run e2e:test:ios

# Build and test release version
npm run e2e:build:ios:release
npm run e2e:test:ios:release
```

#### Android
```bash
# Build app for testing
npm run e2e:build:android

# Run tests
npm run e2e:test:android

# Build and test release version
npm run e2e:build:android:release
npm run e2e:test:android:release
```

### Writing E2E Tests

1. **Test Structure**
```typescript
describe('Feature Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should perform action', async () => {
    await element(by.id('element-id')).tap();
    await expect(element(by.text('Result'))).toBeVisible();
  });
});
```

2. **Element Selection**
```typescript
// By ID
element(by.id('button-id'))

// By text
element(by.text('Button Text'))

// By type
element(by.type('RCTTextInput'))

// By traits
element(by.traits(['button']))
```

3. **Actions**
```typescript
// Tap
await element(by.id('button')).tap();

// Type text
await element(by.id('input')).typeText('Hello');

// Clear text
await element(by.id('input')).clearText();

// Scroll
await element(by.id('scrollview')).scroll(50, 'down');

// Swipe
await element(by.id('element')).swipe('left');
```

4. **Assertions**
```typescript
// Visibility
await expect(element(by.id('element'))).toBeVisible();
await expect(element(by.id('element'))).not.toBeVisible();

// Text
await expect(element(by.id('text'))).toHaveText('Expected');

// Value
await expect(element(by.id('input'))).toHaveValue('Expected');

// Exists
await expect(element(by.id('element'))).toExist();
```

### Best Practices

1. **Test Organization**
   - Group tests by feature or flow
   - Use descriptive test names
   - Keep tests independent
   - Clean up after each test

2. **Element IDs**
   - Use consistent ID naming convention
   - Add testID props to key elements
   ```jsx
   <Button testID="submit-button" />
   ```

3. **Test Stability**
   - Add appropriate waits and expectations
   - Handle loading states
   - Consider network conditions
   - Test both success and failure paths

4. **Device Considerations**
   - Test on different screen sizes
   - Test both iOS and Android
   - Consider platform-specific behaviors

### Example Test Flows

1. **Authentication Flow**
```typescript
describe('Authentication', () => {
  it('should login successfully', async () => {
    await element(by.id('email')).typeText('user@example.com');
    await element(by.id('password')).typeText('password');
    await element(by.id('login-button')).tap();
    await expect(element(by.id('dashboard'))).toBeVisible();
  });
});
```

2. **Form Validation**
```typescript
describe('Form Validation', () => {
  it('should show errors for empty fields', async () => {
    await element(by.id('submit')).tap();
    await expect(element(by.text('Required'))).toBeVisible();
  });
});
```

3. **Navigation Flow**
```typescript
describe('Navigation', () => {
  it('should navigate through tabs', async () => {
    await element(by.id('settings-tab')).tap();
    await expect(element(by.id('settings-screen'))).toBeVisible();
  });
});
```

### CI/CD Integration

1. **GitHub Actions Setup**
```yaml
jobs:
  e2e-test:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm install
      - name: Build iOS app
        run: npm run e2e:build:ios
      - name: Run E2E tests
        run: npm run e2e:test:ios
```

2. **Test Reports**
   - Configure Detox to generate test reports
   - Upload reports as artifacts
   - Track test metrics over time

### Troubleshooting

Common issues and solutions:
1. **App not building**
   - Check native dependencies
   - Verify build configuration
   - Clean build folders

2. **Tests failing inconsistently**
   - Add appropriate waits
   - Check element visibility
   - Handle async operations properly

3. **Device/Simulator issues**
   - Reset device state
   - Clear app data
   - Update Detox configuration 