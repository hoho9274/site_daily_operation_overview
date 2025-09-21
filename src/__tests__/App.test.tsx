import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  test('renders main application title', () => {
    render(<App />);
    const titleElement = screen.getByText(/Site Daily Operations - Logistics Management/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders navigation links', () => {
    render(<App />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Deliveries')).toBeInTheDocument();
    expect(screen.getByText('Material Inspections')).toBeInTheDocument();
    expect(screen.getByText('Inspection Reports')).toBeInTheDocument();
    expect(screen.getByText('All Inspections')).toBeInTheDocument();
  });

  test('renders without crashing', () => {
    const div = document.createElement('div');
    render(<App />, { container: div });
    expect(div.querySelector('.app')).toBeInTheDocument();
  });
});