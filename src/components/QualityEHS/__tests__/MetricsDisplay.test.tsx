import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MetricsDisplay from '../MetricsDisplay';
import { QualityAction, EHSIncident } from '../../../types/QualityEHS';

const mockActions: QualityAction[] = [
  {
    id: '1',
    title: 'Action 1',
    description: 'Description 1',
    category: 'quality',
    priority: 'high',
    status: 'open',
    assignee: { id: '1', name: 'John Doe', email: 'john@test.com' },
    dueDate: new Date('2025-12-31'),
    attachments: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Action 2',
    description: 'Description 2',
    category: 'safety',
    priority: 'critical',
    status: 'closed',
    assignee: { id: '2', name: 'Jane Smith', email: 'jane@test.com' },
    dueDate: new Date('2025-12-25'),
    attachments: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockIncidents: EHSIncident[] = [
  {
    id: '1',
    type: 'safety',
    severity: 'minor',
    description: 'Minor safety incident',
    location: 'Zone A',
    reportedBy: { id: '1', name: 'Reporter', email: 'reporter@test.com' },
    witnesses: [],
    actions: [],
    status: 'investigating',
    createdAt: new Date(),
  },
];

describe('MetricsDisplay', () => {
  it('renders quality actions metrics correctly', () => {
    render(<MetricsDisplay actions={mockActions} incidents={mockIncidents} />);

    expect(screen.getByText('Quality Actions Overview')).toBeInTheDocument();
    expect(screen.getByText('Total Actions')).toBeInTheDocument();
    expect(screen.getByText('Open Actions')).toBeInTheDocument();
    expect(screen.getByText('Completion Rate')).toBeInTheDocument();
  });

  it('renders EHS performance metrics correctly', () => {
    render(<MetricsDisplay actions={mockActions} incidents={mockIncidents} />);

    expect(screen.getByText('EHS Performance')).toBeInTheDocument();
    expect(screen.getByText('Total Incidents')).toBeInTheDocument();
    expect(screen.getByText('Under Investigation')).toBeInTheDocument();
    expect(screen.getByText('Days Without Incident')).toBeInTheDocument();
  });

  it('calculates metrics correctly', () => {
    render(<MetricsDisplay actions={mockActions} incidents={mockIncidents} />);

    // Check total actions (2)
    const totalActionsElements = screen.getAllByText('2');
    expect(totalActionsElements.length).toBeGreaterThan(0);

    // Check open actions (1)
    const openActionsElements = screen.getAllByText('1');
    expect(openActionsElements.length).toBeGreaterThan(0);

    // Check completion rate (50%)
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('displays category distribution chart', () => {
    render(<MetricsDisplay actions={mockActions} incidents={mockIncidents} />);

    expect(screen.getByText('Actions by Category')).toBeInTheDocument();
    expect(screen.getByText('Quality')).toBeInTheDocument();
    expect(screen.getByText('Safety')).toBeInTheDocument();
    expect(screen.getByText('Environmental')).toBeInTheDocument();
  });

  it('displays incident severity distribution', () => {
    render(<MetricsDisplay actions={mockActions} incidents={mockIncidents} />);

    expect(screen.getByText('Incident Severity Distribution')).toBeInTheDocument();
    expect(screen.getByText('Minor')).toBeInTheDocument();
    expect(screen.getByText('Moderate')).toBeInTheDocument();
    expect(screen.getByText('Major')).toBeInTheDocument();
    expect(screen.getByText('Critical')).toBeInTheDocument();
  });

  it('handles empty data gracefully', () => {
    render(<MetricsDisplay actions={[]} incidents={[]} />);

    expect(screen.getByText('Total Actions')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument(); // Completion rate
  });
});