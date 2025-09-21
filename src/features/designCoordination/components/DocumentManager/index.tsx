import React, { useEffect, useState } from 'react';
import { useDesignCoordination } from '../../context/DesignCoordinationContext';
import { DocumentType, Discipline, Document } from '../../types';
import './DocumentManager.css';

const DocumentManager: React.FC = () => {
  const { state, actions } = useDesignCoordination();
  const { items: documents, loading } = state.documents;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<DocumentType | ''>('');
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline | ''>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  useEffect(() => {
    actions.loadDocuments();
  }, []);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || doc.type === selectedType;
    const matchesDiscipline = !selectedDiscipline || doc.discipline === selectedDiscipline;
    return matchesSearch && matchesType && matchesDiscipline;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileIcon = (type: DocumentType) => {
    switch (type) {
      case DocumentType.PDF:
        return '📄';
      case DocumentType.DWG:
      case DocumentType.DXF:
        return '📐';
      case DocumentType.IMAGE:
        return '🖼️';
      default:
        return '📎';
    }
  };

  const getDisciplineColor = (discipline?: Discipline) => {
    switch (discipline) {
      case Discipline.ARCHITECTURAL:
        return '#3b82f6';
      case Discipline.STRUCTURAL:
        return '#ef4444';
      case Discipline.MEP:
        return '#10b981';
      case Discipline.CIVIL:
        return '#f59e0b';
      case Discipline.LANDSCAPE:
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="document-manager">
      <div className="page-header">
        <h1 className="page-title">Document Management</h1>
        <p className="page-subtitle">
          Manage design documents and drawings
        </p>
      </div>

      <div className="document-controls">
        <div className="control-left">
          <input
            type="text"
            placeholder="Search documents..."
            className="form-control search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="form-control form-select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as DocumentType | '')}
          >
            <option value="">All Types</option>
            <option value={DocumentType.PDF}>PDF</option>
            <option value={DocumentType.DWG}>DWG</option>
            <option value={DocumentType.DXF}>DXF</option>
            <option value={DocumentType.IMAGE}>Image</option>
          </select>
          <select
            className="form-control form-select"
            value={selectedDiscipline}
            onChange={(e) => setSelectedDiscipline(e.target.value as Discipline | '')}
          >
            <option value="">All Disciplines</option>
            <option value={Discipline.ARCHITECTURAL}>Architectural</option>
            <option value={Discipline.STRUCTURAL}>Structural</option>
            <option value={Discipline.MEP}>MEP</option>
            <option value={Discipline.CIVIL}>Civil</option>
            <option value={Discipline.LANDSCAPE}>Landscape</option>
          </select>
        </div>
        <div className="control-right">
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              📋
            </button>
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              ⚏
            </button>
          </div>
          <button className="btn btn-primary">
            <span>📤</span> Upload Document
          </button>
        </div>
      </div>

      {filteredDocuments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📁</div>
          <h3 className="empty-state-title">No documents found</h3>
          <p className="empty-state-text">
            {searchTerm || selectedType || selectedDiscipline
              ? 'Try adjusting your filters'
              : 'Upload your first document to get started'}
          </p>
        </div>
      ) : viewMode === 'list' ? (
        <div className="document-list">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Discipline</th>
                <th>Size</th>
                <th>Version</th>
                <th>Uploaded By</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <div className="document-name">
                      <span className="document-icon">{getFileIcon(doc.type)}</span>
                      <span>{doc.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="document-type">{doc.type.toUpperCase()}</span>
                  </td>
                  <td>
                    <span
                      className="document-discipline"
                      style={{ color: getDisciplineColor(doc.discipline) }}
                    >
                      {doc.discipline || '-'}
                    </span>
                  </td>
                  <td>{formatFileSize(doc.fileSize)}</td>
                  <td>
                    <span className="document-version">v{doc.version}</span>
                  </td>
                  <td>{doc.uploadedByName}</td>
                  <td>{formatDate(doc.updatedAt)}</td>
                  <td>
                    <div className="document-actions">
                      <button className="action-btn" title="View">👁️</button>
                      <button className="action-btn" title="Download">⬇️</button>
                      <button className="action-btn" title="Share">🔗</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="document-grid">
          {filteredDocuments.map((doc) => (
            <div key={doc.id} className="document-card">
              <div className="document-card-icon">{getFileIcon(doc.type)}</div>
              <div className="document-card-body">
                <h3 className="document-card-title">{doc.name}</h3>
                <div className="document-card-meta">
                  <span className="meta-item">
                    <span
                      className="meta-badge"
                      style={{ backgroundColor: getDisciplineColor(doc.discipline) }}
                    >
                      {doc.discipline || 'General'}
                    </span>
                  </span>
                  <span className="meta-item">{formatFileSize(doc.fileSize)}</span>
                  <span className="meta-item">v{doc.version}</span>
                </div>
                <div className="document-card-footer">
                  <span className="upload-info">
                    By {doc.uploadedByName} • {formatDate(doc.updatedAt)}
                  </span>
                  <div className="document-actions">
                    <button className="action-btn" title="View">👁️</button>
                    <button className="action-btn" title="Download">⬇️</button>
                    <button className="action-btn" title="Share">🔗</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentManager;