import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActionCard from '../ActionCard';
import { QualityAction } from '../../../types/QualityEHS';

const mockAction: QualityAction = {
  id: '1',
  title: 'Test Quality Action',
  description: 'This is a test description for the quality action',
  category: 'quality',
  priority: 'high',
  status: 'open',
  assignee: { id: '1', name: 'John Doe', email: 'john@test.com' },
  dueDate: new Date('2025-12-31'),
  attachments: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('ActionCard', () => {
  it('renders action details correctly', () => {
    render(<ActionCard action={mockAction} />);

    expect(screen.getByText('Test Quality Action')).toBeInTheDocument();
    expect(screen.getByText('This is a test description for the quality action')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('quality')).toBeInTheDocument();
  });

  it('displays correct priority badge', () => {
    render(<ActionCard action={mockAction} />);
    
    expect(screen.getByText('high')).toBeInTheDocument();
  });

  it('displays correct status indicator', () => {
    render(<ActionCard action={mockAction} />);
    
    expect(screen.getByText('Open')).toBeInTheDocument();
  });

  it('shows overdue indicator for past due dates', () => {
    const overdueAction = {
      ...mockAction,
      dueDate: new Date('2020-01-01'),
    };

    render(<ActionCard action={overdueAction} />);
    
    expect(screen.getByText('Overdue')).toBeInTheDocument();
  });

  it('displays attachments count when present', () => {
    const actionWithAttachments = {
      ...mockAction,
      attachments: [
        { id: '1', name: 'file1.pdf', url: '/file1.pdf', type: 'pdf', size: 1000 },
        { id: '2', name: 'file2.jpg', url: '/file2.jpg', type: 'image', size: 2000 },
      ],
    };

    render(<ActionCard action={actionWithAttachments} />);
    
    expect(screen.getByText('📎 2 attachment(s)')).toBeInTheDocument();
  });

  it('displays correct category icon', () => {
    const safetyAction = {
      ...mockAction,
      category: 'safety' as const,
    };

    const { rerender } = render(<ActionCard action={mockAction} />);
    expect(screen.getByText('✓')).toBeInTheDocument(); // Quality icon

    rerender(<ActionCard action={safetyAction} />);
    expect(screen.getByText('🛡️')).toBeInTheDocument(); // Safety icon
  });
});