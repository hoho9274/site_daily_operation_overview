import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock providers and contexts can be added here
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Common test utilities
export const createMockUser = (overrides = {}) => ({
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'user',
  ...overrides,
});

export const createMockFamily = (overrides = {}) => ({
  id: '1',
  name: 'Test Family',
  code: 'TEST123',
  members: [],
  ...overrides,
});

export const createMockChild = (overrides = {}) => ({
  id: '1',
  name: 'Test Child',
  birthDate: '2020-01-01',
  familyId: '1',
  ...overrides,
});

// Mock API responses
export const mockApiResponse = <T>(data: T, delay = 0) => {
  return new Promise<T>((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

// Mock error responses
export const mockApiError = (message = 'API Error', status = 500) => {
  return Promise.reject({
    message,
    status,
    response: { status },
  });
};

// Test data factories
export const testData = {
  users: {
    valid: createMockUser(),
    admin: createMockUser({ role: 'admin' }),
    family: createMockUser({ role: 'family' }),
  },
  families: {
    valid: createMockFamily(),
    withMembers: createMockFamily({
      members: [createMockUser(), createMockUser({ id: '2' })],
    }),
  },
  children: {
    valid: createMockChild(),
    infant: createMockChild({ birthDate: '2023-01-01' }),
    toddler: createMockChild({ birthDate: '2021-01-01' }),
  },
};

// Common test helpers
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));

export const mockLocalStorage = () => {
  const store: Record<string, string> = {};
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
  };
};

export const mockSessionStorage = () => {
  const store: Record<string, string> = {};
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
  };
};
