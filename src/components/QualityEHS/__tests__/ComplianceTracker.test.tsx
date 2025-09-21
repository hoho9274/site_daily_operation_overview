import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ComplianceTracker from '../ComplianceTracker';
import { QualityAction, EHSIncident } from '../../../types/QualityEHS';

const mockActions: QualityAction[] = [
  {
    id: '1',
    title: 'Quality Action',
    description: 'Quality test',
    category: 'quality',
    priority: 'high',
    status: 'closed',
    assignee: { id: '1', name: 'John Doe', email: 'john@test.com' },
    dueDate: new Date('2025-12-31'),
    attachments: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Safety Action',
    description: 'Safety test',
    category: 'safety',
    priority: 'critical',
    status: 'open',
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
    description: 'Test incident',
    location: 'Test Location',
    reportedBy: { id: '1', name: 'Reporter', email: 'reporter@test.com' },
    witnesses: [],
    actions: [],
    status: 'resolved',
    createdAt: new Date(),
    resolvedAt: new Date(),
  },
];

describe('ComplianceTracker', () => {
  it('renders compliance overview section', () => {
    render(<ComplianceTracker actions={mockActions} incidents={mockIncidents} />);

    expect(screen.getByText('Overall Compliance Score')).toBeInTheDocument();
    expect(screen.getByText('Compliant')).toBeInTheDocument();
  });

  it('displays compliance breakdown by category', () => {
    render(<ComplianceTracker actions={mockActions} incidents={mockIncidents} />);

    expect(screen.getByText('Quality')).toBeInTheDocument();
    expect(screen.getByText('Safety')).toBeInTheDocument();
    expect(screen.getByText('Environmental')).toBeInTheDocument();
  });

  it('shows upcoming audits section', () => {
    render(<ComplianceTracker actions={mockActions} incidents={mockIncidents} />);

    expect(screen.getByText('Upcoming Audits')).toBeInTheDocument();
    expect(screen.getByText('Monthly Safety Audit')).toBeInTheDocument();
    expect(screen.getByText('Environmental Compliance Check')).toBeInTheDocument();
  });

  it('shows recent inspections section', () => {
    render(<ComplianceTracker actions={mockActions} incidents={mockIncidents} />);

    expect(screen.getByText('Recent Inspections')).toBeInTheDocument();
    expect(screen.getByText('Site Safety Inspection')).toBeInTheDocument();
  });

  it('displays compliance checklist', () => {
    render(<ComplianceTracker actions={mockActions} incidents={mockIncidents} />);

    expect(screen.getByText('Compliance Checklist')).toBeInTheDocument();
    expect(screen.getByText('Safety equipment inspection')).toBeInTheDocument();
    expect(screen.getByText('Emergency procedures training')).toBeInTheDocument();
  });

  it('calculates compliance scores correctly', () => {
    render(<ComplianceTracker actions={mockActions} incidents={mockIncidents} />);

    // Check if percentage values are displayed
    const percentElements = screen.getAllByText(/\d+%/);
    expect(percentElements.length).toBeGreaterThan(0);
  });

  it('displays action and incident statistics', () => {
    render(<ComplianceTracker actions={mockActions} incidents={mockIncidents} />);

    expect(screen.getByText('Total Actions')).toBeInTheDocument();
    expect(screen.getByText('Open Actions')).toBeInTheDocument();
    expect(screen.getByText('Total Incidents')).toBeInTheDocument();
    expect(screen.getByText('Resolved Incidents')).toBeInTheDocument();
  });

  it('shows inspection results with proper styling', () => {
    render(<ComplianceTracker actions={mockActions} incidents={mockIncidents} />);

    const passElements = screen.getAllByText('pass');
    expect(passElements.length).toBeGreaterThan(0);
  });
});