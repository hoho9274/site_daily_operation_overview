import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import LogisticsDashboard from '../LogisticsDashboard';
import { LogisticsProvider } from '../../../context/LogisticsContext';
import * as logisticsService from '../../../services/logisticsService';
import * as mirService from '../../../services/mirService';
import * as irService from '../../../services/irService';

// Mock the services
jest.mock('../../../services/logisticsService');
jest.mock('../../../services/mirService');
jest.mock('../../../services/irService');

describe('LogisticsDashboard Component', () => {
  const mockDeliveries = [
    {
      id: '1',
      deliveryNumber: 'DEL-2024-001',
      vendor: {
        id: '1',
        name: 'ABC Supplies',
        contactPerson: 'John',
        email: 'john@abc.com',
        phone: '123-456-7890',
        address: '123 Main St',
      },
      materials: [
        {
          id: '1',
          name: 'Concrete',
          description: 'High-strength concrete',
          unit: 'bags',
          quantity: 100,
        },
      ],
      scheduledDate: new Date('2024-01-15'),
      actualDate: new Date('2024-01-15'),
      status: 'delivered' as const,
      notes: 'Delivered on time',
      createdBy: 'user1',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-15'),
    },
  ];

  const mockMIRs = [
    {
      id: '1',
      mirNumber: 'MIR-2024-001',
      inspectionDate: new Date('2024-01-15'),
      inspector: {
        id: 'user1',
        name: 'Jane Inspector',
        email: 'jane@company.com',
        role: 'Quality Inspector',
      },
      materials: [
        {
          materialId: '1',
          materialName: 'Concrete',
          quantity: 100,
          unit: 'bags',
          checklist: [],
          status: 'passed' as const,
          comments: 'Good quality',
        },
      ],
      overallStatus: 'passed' as const,
      photos: [],
      nonConformances: [],
      signature: 'Jane Inspector',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
  ];

  const mockIRs = [
    {
      id: '1',
      irNumber: 'IR-2024-001',
      type: 'safety' as const,
      inspectionDate: new Date('2024-01-14'),
      inspector: {
        id: 'user2',
        name: 'Mike Safety',
        email: 'mike@company.com',
        role: 'Safety Inspector',
      },
      location: 'Site A',
      findings: [
        {
          id: '1',
          description: 'PPE compliance issue',
          severity: 'major' as const,
          category: 'PPE Compliance',
        },
      ],
      correctiveActions: [
        {
          id: '1',
          findingId: '1',
          action: 'Conduct safety briefing',
          responsiblePerson: 'Site Supervisor',
          dueDate: new Date('2024-01-16'),
          status: 'completed' as const,
          completionDate: new Date('2024-01-15'),
        },
      ],
      status: 'closed' as const,
      photos: [],
      createdAt: new Date('2024-01-14'),
      updatedAt: new Date('2024-01-15'),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (logisticsService.fetchDeliveries as jest.Mock).mockResolvedValue(mockDeliveries);
    (mirService.fetchMIRs as jest.Mock).mockResolvedValue(mockMIRs);
    (irService.fetchIRs as jest.Mock).mockResolvedValue(mockIRs);
  });

  const renderWithProvider = () => {
    return render(
      <LogisticsProvider>
        <LogisticsDashboard />
      </LogisticsProvider>
    );
  };

  test('renders dashboard title', async () => {
    renderWithProvider();
    
    await waitFor(() => {
      expect(screen.getByText('Logistics Operations Dashboard')).toBeInTheDocument();
    });
  });

  test('displays loading state initially', () => {
    renderWithProvider();
    
    expect(screen.getByText(/Loading dashboard data/i)).toBeInTheDocument();
  });

  test('displays metrics cards after loading', async () => {
    renderWithProvider();
    
    await waitFor(() => {
      expect(screen.getByText('Deliveries')).toBeInTheDocument();
      expect(screen.getByText('Material Inspections')).toBeInTheDocument();
      expect(screen.getByText('Inspection Reports')).toBeInTheDocument();
      expect(screen.getByText('Performance')).toBeInTheDocument();
    });
  });

  test('displays delivery metrics correctly', async () => {
    renderWithProvider();
    
    await waitFor(() => {
      // Check for delivery count
      const deliveryCard = screen.getByText('Deliveries').closest('.metric-card');
      expect(deliveryCard).toBeInTheDocument();
      expect(deliveryCard).toHaveTextContent('1'); // Total deliveries
      expect(deliveryCard).toHaveTextContent('0 Scheduled');
      expect(deliveryCard).toHaveTextContent('1 Completed');
    });
  });

  test('displays MIR metrics correctly', async () => {
    renderWithProvider();
    
    await waitFor(() => {
      const mirCard = screen.getByText('Material Inspections').closest('.metric-card');
      expect(mirCard).toBeInTheDocument();
      expect(mirCard).toHaveTextContent('1'); // Total MIRs
      expect(mirCard).toHaveTextContent('1 Passed');
      expect(mirCard).toHaveTextContent('0 Failed');
    });
  });

  test('displays IR metrics correctly', async () => {
    renderWithProvider();
    
    await waitFor(() => {
      const irCard = screen.getByText('Inspection Reports').closest('.metric-card');
      expect(irCard).toBeInTheDocument();
      expect(irCard).toHaveTextContent('1'); // Total IRs
      expect(irCard).toHaveTextContent('0 Open');
      expect(irCard).toHaveTextContent('1 Closed');
    });
  });

  test('displays recent deliveries list', async () => {
    renderWithProvider();
    
    await waitFor(() => {
      expect(screen.getByText('Recent Deliveries')).toBeInTheDocument();
      expect(screen.getByText('DEL-2024-001')).toBeInTheDocument();
      expect(screen.getByText('ABC Supplies')).toBeInTheDocument();
    });
  });

  test('displays recent MIRs list', async () => {
    renderWithProvider();
    
    await waitFor(() => {
      expect(screen.getByText('Recent MIRs')).toBeInTheDocument();
      expect(screen.getByText('MIR-2024-001')).toBeInTheDocument();
      expect(screen.getByText('Jane Inspector')).toBeInTheDocument();
      expect(screen.getByText('passed')).toBeInTheDocument();
    });
  });

  test('displays recent IRs list', async () => {
    renderWithProvider();
    
    await waitFor(() => {
      expect(screen.getByText('Recent IRs')).toBeInTheDocument();
      expect(screen.getByText('IR-2024-001')).toBeInTheDocument();
      expect(screen.getByText('Site A')).toBeInTheDocument();
      expect(screen.getByText('closed')).toBeInTheDocument();
    });
  });

  test('shows empty state when no deliveries', async () => {
    (logisticsService.fetchDeliveries as jest.Mock).mockResolvedValue([]);
    
    renderWithProvider();
    
    await waitFor(() => {
      expect(screen.getByText('No deliveries scheduled')).toBeInTheDocument();
    });
  });

  test('shows empty state when no MIRs', async () => {
    (mirService.fetchMIRs as jest.Mock).mockResolvedValue([]);
    
    renderWithProvider();
    
    await waitFor(() => {
      expect(screen.getByText('No material inspections recorded')).toBeInTheDocument();
    });
  });

  test('shows empty state when no IRs', async () => {
    (irService.fetchIRs as jest.Mock).mockResolvedValue([]);
    
    renderWithProvider();
    
    await waitFor(() => {
      expect(screen.getByText('No inspection reports available')).toBeInTheDocument();
    });
  });

  test('displays error message when loading fails', async () => {
    const errorMessage = 'Failed to load data';
    (logisticsService.fetchDeliveries as jest.Mock).mockRejectedValue(new Error(errorMessage));
    
    renderWithProvider();
    
    await waitFor(() => {
      expect(screen.getByText(`Error loading dashboard: ${errorMessage}`)).toBeInTheDocument();
    });
  });

  test('calculates and displays on-time delivery rate', async () => {
    renderWithProvider();
    
    await waitFor(() => {
      const deliveryCard = screen.getByText('Deliveries').closest('.metric-card');
      expect(deliveryCard).toHaveTextContent('On-time Rate: 100.0%');
    });
  });

  test('calculates and displays inspection compliance rate', async () => {
    renderWithProvider();
    
    await waitFor(() => {
      const mirCard = screen.getByText('Material Inspections').closest('.metric-card');
      expect(mirCard).toHaveTextContent('Compliance Rate: 100.0%');
    });
  });

  test('displays non-conformance warnings for MIRs', async () => {
    const mirWithNC = {
      ...mockMIRs[0],
      nonConformances: [
        {
          id: '1',
          description: 'Material defect',
          severity: 'major' as const,
          correctiveAction: 'Replace material',
          status: 'open' as const,
        },
      ],
    };
    
    (mirService.fetchMIRs as jest.Mock).mockResolvedValue([mirWithNC]);
    
    renderWithProvider();
    
    await waitFor(() => {
      expect(screen.getByText(/1 non-conformance/)).toBeInTheDocument();
    });
  });

  test('displays finding and action counts for IRs', async () => {
    renderWithProvider();
    
    await waitFor(() => {
      const irSection = screen.getByText('Recent IRs').parentElement;
      expect(irSection).toHaveTextContent('1 finding(s)');
      expect(irSection).toHaveTextContent('1 action(s)');
    });
  });

  test('displays correct status badges for different statuses', async () => {
    const multiStatusDeliveries = [
      { ...mockDeliveries[0], id: '1', status: 'delivered' as const },
      { ...mockDeliveries[0], id: '2', deliveryNumber: 'DEL-2024-002', status: 'scheduled' as const },
      { ...mockDeliveries[0], id: '3', deliveryNumber: 'DEL-2024-003', status: 'in-transit' as const },
    ];
    
    (logisticsService.fetchDeliveries as jest.Mock).mockResolvedValue(multiStatusDeliveries);
    
    renderWithProvider();
    
    await waitFor(() => {
      expect(screen.getByText('delivered')).toHaveClass('badge-success');
      expect(screen.getByText('scheduled')).toHaveClass('badge-warning');
      expect(screen.getByText('in-transit')).toHaveClass('badge-warning');
    });
  });
});