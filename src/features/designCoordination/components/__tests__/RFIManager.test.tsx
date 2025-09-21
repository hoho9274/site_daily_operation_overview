import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { DesignCoordinationProvider } from '../../context/DesignCoordinationContext';
import RFIManager from '../RFIManager';

describe('RFIManager Component', () => {
  const renderRFIManager = () => {
    return render(
      <DesignCoordinationProvider>
        <RFIManager />
      </DesignCoordinationProvider>
    );
  };

  test('renders RFI manager title', () => {
    renderRFIManager();
    expect(screen.getByText('RFI Management')).toBeInTheDocument();
  });

  test('displays search and filter controls', () => {
    renderRFIManager();
    expect(screen.getByPlaceholderText('Search RFIs...')).toBeInTheDocument();
    expect(screen.getByText('All Status')).toBeInTheDocument();
    expect(screen.getByText('All Priorities')).toBeInTheDocument();
  });

  test('displays create RFI button', () => {
    renderRFIManager();
    expect(screen.getByText('Create RFI')).toBeInTheDocument();
  });

  test('loads and displays RFIs', async () => {
    renderRFIManager();
    await waitFor(() => {
      expect(screen.getByText('RFI-2025-001')).toBeInTheDocument();
      expect(screen.getByText('Foundation Rebar Spacing Clarification')).toBeInTheDocument();
    });
  });

  test('filters RFIs by search term', async () => {
    renderRFIManager();
    await waitFor(() => {
      expect(screen.getByText('RFI-2025-001')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search RFIs...');
    fireEvent.change(searchInput, { target: { value: 'Foundation' } });

    expect(screen.getByText('Foundation Rebar Spacing Clarification')).toBeInTheDocument();
    expect(screen.queryByText('HVAC Duct Routing Conflict')).not.toBeInTheDocument();
  });

  test('filters RFIs by status', async () => {
    renderRFIManager();
    await waitFor(() => {
      expect(screen.getByText('RFI-2025-001')).toBeInTheDocument();
    });

    const statusFilter = screen.getByDisplayValue('All Status');
    fireEvent.change(statusFilter, { target: { value: 'open' } });

    await waitFor(() => {
      expect(screen.getByText('RFI-2025-001')).toBeInTheDocument();
      expect(screen.queryByText('RFI-2025-003')).not.toBeInTheDocument();
    });
  });

  test('displays RFI metadata correctly', async () => {
    renderRFIManager();
    await waitFor(() => {
      expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
      expect(screen.getByText(/Robert Brown/)).toBeInTheDocument();
      expect(screen.getByText(/high/i)).toBeInTheDocument();
    });
  });

  test('shows RFI response when available', async () => {
    renderRFIManager();
    await waitFor(() => {
      expect(screen.getByText(/Window type W-3 should be W-2A/)).toBeInTheDocument();
    });
  });

  test('indicates overdue RFIs', async () => {
    renderRFIManager();
    await waitFor(() => {
      const overdueIndicators = screen.queryAllByText(/Overdue/);
      expect(overdueIndicators.length).toBeGreaterThan(0);
    });
  });

  test('opens RFI form when create button is clicked', async () => {
    renderRFIManager();
    const createButton = screen.getByText('Create RFI');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('Create New RFI')).toBeInTheDocument();
    });
  });

  test('shows empty state when no RFIs match filters', async () => {
    renderRFIManager();
    
    const searchInput = screen.getByPlaceholderText('Search RFIs...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

    await waitFor(() => {
      expect(screen.getByText('No RFIs found')).toBeInTheDocument();
      expect(screen.getByText('Try adjusting your filters')).toBeInTheDocument();
    });
  });

  test('displays action buttons based on RFI status', async () => {
    renderRFIManager();
    await waitFor(() => {
      expect(screen.getByText('Start Review')).toBeInTheDocument();
      expect(screen.getByText('Add Response')).toBeInTheDocument();
    });
  });
});