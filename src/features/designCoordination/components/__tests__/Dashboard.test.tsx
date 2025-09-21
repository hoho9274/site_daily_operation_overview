import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { DesignCoordinationProvider } from '../../context/DesignCoordinationContext';
import Dashboard from '../Dashboard';

describe('Dashboard Component', () => {
  const renderDashboard = () => {
    return render(
      <DesignCoordinationProvider>
        <Dashboard />
      </DesignCoordinationProvider>
    );
  };

  test('renders dashboard title', async () => {
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText('Design Coordination Dashboard')).toBeInTheDocument();
    });
  });

  test('displays stats cards after loading', async () => {
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText('Total Documents')).toBeInTheDocument();
      expect(screen.getByText('Open RFIs')).toBeInTheDocument();
      expect(screen.getByText('Open Issues')).toBeInTheDocument();
      expect(screen.getByText('Critical Items')).toBeInTheDocument();
    });
  });

  test('shows loading spinner initially', () => {
    renderDashboard();
    expect(document.querySelector('.spinner')).toBeInTheDocument();
  });

  test('renders recent activities section', async () => {
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText('Recent Activities')).toBeInTheDocument();
    });
  });

  test('renders quick actions section', async () => {
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText('Quick Actions')).toBeInTheDocument();
      expect(screen.getByText('Upload Document')).toBeInTheDocument();
      expect(screen.getByText('Create RFI')).toBeInTheDocument();
      expect(screen.getByText('Report Issue')).toBeInTheDocument();
    });
  });

  test('displays RFI status distribution chart', async () => {
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText('RFI Status Distribution')).toBeInTheDocument();
    });
  });

  test('displays issue severity breakdown chart', async () => {
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText('Issue Severity Breakdown')).toBeInTheDocument();
    });
  });

  test('displays response time metrics', async () => {
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText('Response Time Metrics')).toBeInTheDocument();
      expect(screen.getByText('Average Response Time')).toBeInTheDocument();
      expect(screen.getByText('RFIs Due This Week')).toBeInTheDocument();
      expect(screen.getByText('Overdue RFIs')).toBeInTheDocument();
    });
  });
});