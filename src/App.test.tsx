import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  test('renders Site Daily Operations header', () => {
    render(<App />);
    const headerElement = screen.getByText(/Site Daily Operations/i);
    expect(headerElement).toBeInTheDocument();
  });

  test('renders navigation links', () => {
    render(<App />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Documents')).toBeInTheDocument();
    expect(screen.getByText('RFIs')).toBeInTheDocument();
    expect(screen.getByText('Issues')).toBeInTheDocument();
  });
});