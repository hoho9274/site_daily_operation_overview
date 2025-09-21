import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import QualityActionsPanel from '../QualityActionsPanel';
import { QualityAction } from '../../../types/QualityEHS';

const mockActions: QualityAction[] = [
  {
    id: '1',
    title: 'Test Action 1',
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
    title: 'Test Action 2',
    description: 'Description 2',
    category: 'safety',
    priority: 'critical',
    status: 'in_progress',
    assignee: { id: '2', name: 'Jane Smith', email: 'jane@test.com' },
    dueDate: new Date('2025-12-25'),
    attachments: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe('QualityActionsPanel', () => {
  const mockOnCreateAction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with actions', () => {
    render(
      <QualityActionsPanel 
        actions={mockActions} 
        onCreateAction={mockOnCreateAction}
      />
    );

    expect(screen.getByText('Test Action 1')).toBeInTheDocument();
    expect(screen.getByText('Test Action 2')).toBeInTheDocument();
  });

  it('displays correct statistics', () => {
    render(
      <QualityActionsPanel 
        actions={mockActions} 
        onCreateAction={mockOnCreateAction}
      />
    );

    expect(screen.getByText('2')).toBeInTheDocument(); // Total actions
    expect(screen.getByText('1')).toBeInTheDocument(); // Open actions
  });

  it('filters actions by category', () => {
    render(
      <QualityActionsPanel 
        actions={mockActions} 
        onCreateAction={mockOnCreateAction}
      />
    );

    const categoryFilter = screen.getByDisplayValue('All Categories');
    fireEvent.change(categoryFilter, { target: { value: 'quality' } });

    expect(screen.getByText('Test Action 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Action 2')).not.toBeInTheDocument();
  });

  it('filters actions by search term', () => {
    render(
      <QualityActionsPanel 
        actions={mockActions} 
        onCreateAction={mockOnCreateAction}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search actions...');
    fireEvent.change(searchInput, { target: { value: 'Action 1' } });

    expect(screen.getByText('Test Action 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Action 2')).not.toBeInTheDocument();
  });

  it('calls onCreateAction when New Action button is clicked', () => {
    render(
      <QualityActionsPanel 
        actions={mockActions} 
        onCreateAction={mockOnCreateAction}
      />
    );

    const newActionButton = screen.getByText('+ New Action');
    fireEvent.click(newActionButton);

    expect(mockOnCreateAction).toHaveBeenCalledTimes(1);
  });

  it('displays no results message when no actions match filters', () => {
    render(
      <QualityActionsPanel 
        actions={mockActions} 
        onCreateAction={mockOnCreateAction}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search actions...');
    fireEvent.change(searchInput, { target: { value: 'NonExistentAction' } });

    expect(screen.getByText('No actions found matching your filters.')).toBeInTheDocument();
  });
});