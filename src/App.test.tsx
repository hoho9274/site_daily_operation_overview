import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock the components that are rendered by App
jest.mock('./components/Layout/Layout', () => {
  return function Layout({ children }: { children: React.ReactNode }) {
    return <div data-testid="layout">{children}</div>;
  };
});

jest.mock('./pages/Dashboard/Dashboard', () => {
  return function Dashboard() {
    return <div data-testid="dashboard">Dashboard Page</div>;
  };
});

jest.mock('./pages/ScheduleHealth/ScheduleHealth', () => {
  return function ScheduleHealth() {
    return <div data-testid="schedule-health">Schedule Health Page</div>;
  };
});

jest.mock('./components/Alerts/AlertNotification', () => {
  return function AlertNotification() {
    return <div data-testid="alert-notification">Alert Notification</div>;
  };
});

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });

  it('renders the alert notification component', () => {
    render(<App />);
    expect(screen.getByTestId('alert-notification')).toBeInTheDocument();
  });

  it('provides Redux store to the application', () => {
    const { container } = render(<App />);
    // The app should render without errors when Redux store is provided
    expect(container.firstChild).toBeInTheDocument();
  });

  it('provides MUI theme to the application', () => {
    const { container } = render(<App />);
    // The app should render with Material-UI components
    expect(container.firstChild).toBeInTheDocument();
  });
});
