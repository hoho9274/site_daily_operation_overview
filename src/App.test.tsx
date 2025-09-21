import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText(/Site Daily Operations/i)).toBeInTheDocument();
  });

  it('renders navigation menu', () => {
    render(<App />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Quality & EHS')).toBeInTheDocument();
  });

  it('renders main content area', () => {
    render(<App />);
    const mainContent = document.querySelector('.main-content');
    expect(mainContent).toBeInTheDocument();
  });
});