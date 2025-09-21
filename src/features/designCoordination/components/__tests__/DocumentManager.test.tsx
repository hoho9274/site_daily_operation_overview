import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { DesignCoordinationProvider } from '../../context/DesignCoordinationContext';
import DocumentManager from '../DocumentManager';

describe('DocumentManager Component', () => {
  const renderDocumentManager = () => {
    return render(
      <DesignCoordinationProvider>
        <DocumentManager />
      </DesignCoordinationProvider>
    );
  };

  test('renders document manager title', () => {
    renderDocumentManager();
    expect(screen.getByText('Document Management')).toBeInTheDocument();
  });

  test('displays search input', () => {
    renderDocumentManager();
    expect(screen.getByPlaceholderText('Search documents...')).toBeInTheDocument();
  });

  test('displays filter dropdowns', () => {
    renderDocumentManager();
    expect(screen.getByText('All Types')).toBeInTheDocument();
    expect(screen.getByText('All Disciplines')).toBeInTheDocument();
  });

  test('displays upload button', () => {
    renderDocumentManager();
    expect(screen.getByText('Upload Document')).toBeInTheDocument();
  });

  test('loads and displays documents', async () => {
    renderDocumentManager();
    await waitFor(() => {
      expect(screen.getByText('Foundation Layout Plan.pdf')).toBeInTheDocument();
      expect(screen.getByText('Electrical Single Line Diagram.dwg')).toBeInTheDocument();
    });
  });

  test('filters documents by search term', async () => {
    renderDocumentManager();
    await waitFor(() => {
      expect(screen.getByText('Foundation Layout Plan.pdf')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search documents...');
    fireEvent.change(searchInput, { target: { value: 'Foundation' } });

    expect(screen.getByText('Foundation Layout Plan.pdf')).toBeInTheDocument();
    expect(screen.queryByText('Electrical Single Line Diagram.dwg')).not.toBeInTheDocument();
  });

  test('filters documents by type', async () => {
    renderDocumentManager();
    await waitFor(() => {
      expect(screen.getByText('Foundation Layout Plan.pdf')).toBeInTheDocument();
    });

    const typeFilter = screen.getByDisplayValue('All Types');
    fireEvent.change(typeFilter, { target: { value: 'pdf' } });

    await waitFor(() => {
      expect(screen.getByText('Foundation Layout Plan.pdf')).toBeInTheDocument();
      expect(screen.queryByText('Electrical Single Line Diagram.dwg')).not.toBeInTheDocument();
    });
  });

  test('toggles between list and grid view', async () => {
    renderDocumentManager();
    await waitFor(() => {
      expect(document.querySelector('.document-list')).toBeInTheDocument();
    });

    const gridButton = screen.getByText('⚏');
    fireEvent.click(gridButton);

    expect(document.querySelector('.document-grid')).toBeInTheDocument();
    expect(document.querySelector('.document-list')).not.toBeInTheDocument();
  });

  test('shows empty state when no documents match filters', async () => {
    renderDocumentManager();
    
    const searchInput = screen.getByPlaceholderText('Search documents...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

    await waitFor(() => {
      expect(screen.getByText('No documents found')).toBeInTheDocument();
      expect(screen.getByText('Try adjusting your filters')).toBeInTheDocument();
    });
  });

  test('displays document metadata correctly', async () => {
    renderDocumentManager();
    await waitFor(() => {
      expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
      expect(screen.getByText('v3')).toBeInTheDocument();
      expect(screen.getByText(/2\.35 MB/)).toBeInTheDocument();
    });
  });
});