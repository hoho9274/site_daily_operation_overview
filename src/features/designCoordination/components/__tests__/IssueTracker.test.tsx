import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { DesignCoordinationProvider } from '../../context/DesignCoordinationContext';
import IssueTracker from '../IssueTracker';

describe('IssueTracker Component', () => {
  const renderIssueTracker = () => {
    return render(
      <DesignCoordinationProvider>
        <IssueTracker />
      </DesignCoordinationProvider>
    );
  };

  test('renders issue tracker title', () => {
    renderIssueTracker();
    expect(screen.getByText('Design Issues')).toBeInTheDocument();
  });

  test('displays search and filter controls', () => {
    renderIssueTracker();
    expect(screen.getByPlaceholderText('Search issues...')).toBeInTheDocument();
    expect(screen.getByText('All Status')).toBeInTheDocument();
    expect(screen.getByText('All Severities')).toBeInTheDocument();
    expect(screen.getByText('All Types')).toBeInTheDocument();
  });

  test('displays report issue button', () => {
    renderIssueTracker();
    expect(screen.getByText('Report Issue')).toBeInTheDocument();
  });

  test('loads and displays issues', async () => {
    renderIssueTracker();
    await waitFor(() => {
      expect(screen.getByText('ISS-2025-001')).toBeInTheDocument();
      expect(screen.getByText('Structural Beam Conflicts with HVAC Duct')).toBeInTheDocument();
    });
  });

  test('displays issue impact information', async () => {
    renderIssueTracker();
    await waitFor(() => {
      expect(screen.getByText('Cost Impact')).toBeInTheDocument();
      expect(screen.getByText('Schedule Impact')).toBeInTheDocument();
      expect(screen.getByText('$15,000')).toBeInTheDocument();
      expect(screen.getByText('5 days')).toBeInTheDocument();
    });
  });

  test('filters issues by search term', async () => {
    renderIssueTracker();
    await waitFor(() => {
      expect(screen.getByText('ISS-2025-001')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search issues...');
    fireEvent.change(searchInput, { target: { value: 'Structural' } });

    expect(screen.getByText('Structural Beam Conflicts with HVAC Duct')).toBeInTheDocument();
    expect(screen.queryByText('Missing Electrical Panel Schedule')).not.toBeInTheDocument();
  });

  test('filters issues by severity', async () => {
    renderIssueTracker();
    await waitFor(() => {
      expect(screen.getByText('ISS-2025-001')).toBeInTheDocument();
    });

    const severityFilter = screen.getByDisplayValue('All Severities');
    fireEvent.change(severityFilter, { target: { value: 'critical' } });

    await waitFor(() => {
      expect(screen.getByText('ISS-2025-001')).toBeInTheDocument();
      expect(screen.queryByText('ISS-2025-003')).not.toBeInTheDocument();
    });
  });

  test('displays issue type icons', async () => {
    renderIssueTracker();
    await waitFor(() => {
      expect(screen.getByText('⚔️')).toBeInTheDocument(); // Conflict
      expect(screen.getByText('❓')).toBeInTheDocument(); // Missing Info
      expect(screen.getByText('❌')).toBeInTheDocument(); // Error
    });
  });

  test('shows resolution for resolved issues', async () => {
    renderIssueTracker();
    await waitFor(() => {
      expect(screen.getByText(/Door schedule has been updated/)).toBeInTheDocument();
    });
  });

  test('displays action buttons based on issue status', async () => {
    renderIssueTracker();
    await waitFor(() => {
      expect(screen.getByText('Start Work')).toBeInTheDocument();
      expect(screen.getByText('Mark Resolved')).toBeInTheDocument();
      expect(screen.getByText('Close Issue')).toBeInTheDocument();
    });
  });

  test('updates issue status when action button is clicked', async () => {
    renderIssueTracker();
    await waitFor(() => {
      const startWorkButton = screen.getAllByText('Start Work')[0];
      fireEvent.click(startWorkButton);
    });

    // The status should change in the UI
    await waitFor(() => {
      expect(screen.getByText('Mark Resolved')).toBeInTheDocument();
    });
  });

  test('shows empty state when no issues match filters', async () => {
    renderIssueTracker();
    
    const searchInput = screen.getByPlaceholderText('Search issues...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

    await waitFor(() => {
      expect(screen.getByText('No issues found')).toBeInTheDocument();
      expect(screen.getByText('Try adjusting your filters')).toBeInTheDocument();
    });
  });
});