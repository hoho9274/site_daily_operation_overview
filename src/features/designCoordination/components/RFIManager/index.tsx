import React, { useEffect, useState } from 'react';
import { useDesignCoordination } from '../../context/DesignCoordinationContext';
import { RFI, RFIStatus, Priority } from '../../types';
import RFIForm from './RFIForm';
import './RFIManager.css';

const RFIManager: React.FC = () => {
  const { state, actions } = useDesignCoordination();
  const { items: rfis, loading } = state.rfis;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<RFIStatus | ''>('');
  const [selectedPriority, setSelectedPriority] = useState<Priority | ''>('');
  const [showForm, setShowForm] = useState(false);
  const [selectedRFI, setSelectedRFI] = useState<RFI | null>(null);

  useEffect(() => {
    actions.loadRFIs();
  }, []);

  const filteredRFIs = rfis.filter(rfi => {
    const matchesSearch = 
      rfi.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rfi.rfiNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || rfi.status === selectedStatus;
    const matchesPriority = !selectedPriority || rfi.priority === selectedPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const formatDate = (date?: Date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadgeClass = (status: RFIStatus) => {
    switch (status) {
      case RFIStatus.OPEN:
        return 'badge-open';
      case RFIStatus.IN_REVIEW:
        return 'badge-in-review';
      case RFIStatus.RESPONDED:
        return 'badge-responded';
      case RFIStatus.CLOSED:
        return 'badge-closed';
      default:
        return '';
    }
  };

  const getPriorityBadgeClass = (priority: Priority) => {
    switch (priority) {
      case Priority.CRITICAL:
        return 'badge-critical';
      case Priority.HIGH:
        return 'badge-high';
      case Priority.MEDIUM:
        return 'badge-medium';
      case Priority.LOW:
        return 'badge-low';
      default:
        return '';
    }
  };

  const handleCreateRFI = (rfiData: Partial<RFI>) => {
    actions.createRFI(rfiData);
    setShowForm(false);
  };

  const handleUpdateRFI = (id: string, updates: Partial<RFI>) => {
    actions.updateRFI(id, updates);
    setSelectedRFI(null);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="rfi-manager">
      <div className="page-header">
        <h1 className="page-title">RFI Management</h1>
        <p className="page-subtitle">
          Track and manage Requests for Information
        </p>
      </div>

      <div className="rfi-controls">
        <div className="control-left">
          <input
            type="text"
            placeholder="Search RFIs..."
            className="form-control search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="form-control form-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as RFIStatus | '')}
          >
            <option value="">All Status</option>
            <option value={RFIStatus.OPEN}>Open</option>
            <option value={RFIStatus.IN_REVIEW}>In Review</option>
            <option value={RFIStatus.RESPONDED}>Responded</option>
            <option value={RFIStatus.CLOSED}>Closed</option>
          </select>
          <select
            className="form-control form-select"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value as Priority | '')}
          >
            <option value="">All Priorities</option>
            <option value={Priority.CRITICAL}>Critical</option>
            <option value={Priority.HIGH}>High</option>
            <option value={Priority.MEDIUM}>Medium</option>
            <option value={Priority.LOW}>Low</option>
          </select>
        </div>
        <div className="control-right">
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <span>➕</span> Create RFI
          </button>
        </div>
      </div>

      {showForm && (
        <RFIForm
          onSubmit={handleCreateRFI}
          onCancel={() => setShowForm(false)}
        />
      )}

      {filteredRFIs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">❓</div>
          <h3 className="empty-state-title">No RFIs found</h3>
          <p className="empty-state-text">
            {searchTerm || selectedStatus || selectedPriority
              ? 'Try adjusting your filters'
              : 'Create your first RFI to get started'}
          </p>
        </div>
      ) : (
        <div className="rfi-list">
          {filteredRFIs.map((rfi) => (
            <div key={rfi.id} className="rfi-card">
              <div className="rfi-card-header">
                <div className="rfi-card-title-group">
                  <h3 className="rfi-card-number">{rfi.rfiNumber}</h3>
                  <h4 className="rfi-card-title">{rfi.title}</h4>
                </div>
                <div className="rfi-card-badges">
                  <span className={`badge ${getStatusBadgeClass(rfi.status)}`}>
                    {rfi.status.replace('_', ' ')}
                  </span>
                  <span className={`badge ${getPriorityBadgeClass(rfi.priority)}`}>
                    {rfi.priority}
                  </span>
                </div>
              </div>

              {rfi.description && (
                <p className="rfi-card-description">{rfi.description}</p>
              )}

              <div className="rfi-card-meta">
                <div className="meta-row">
                  <span className="meta-label">Created by:</span>
                  <span className="meta-value">{rfi.createdByName}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Assigned to:</span>
                  <span className="meta-value">{rfi.assignedToName || 'Unassigned'}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Due Date:</span>
                  <span className="meta-value">
                    {formatDate(rfi.dueDate)}
                    {rfi.dueDate && new Date(rfi.dueDate) < new Date() && 
                     rfi.status !== RFIStatus.CLOSED && rfi.status !== RFIStatus.RESPONDED && (
                      <span className="overdue-indicator"> ⚠️ Overdue</span>
                    )}
                  </span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Created:</span>
                  <span className="meta-value">{formatDate(rfi.createdAt)}</span>
                </div>
              </div>

              {rfi.response && (
                <div className="rfi-response">
                  <h5 className="response-title">Response</h5>
                  <p className="response-text">{rfi.response}</p>
                  <span className="response-date">
                    Responded on {formatDate(rfi.respondedAt)}
                  </span>
                </div>
              )}

              <div className="rfi-card-actions">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setSelectedRFI(rfi)}
                >
                  View Details
                </button>
                {rfi.status === RFIStatus.OPEN && (
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleUpdateRFI(rfi.id, { status: RFIStatus.IN_REVIEW })}
                  >
                    Start Review
                  </button>
                )}
                {rfi.status === RFIStatus.IN_REVIEW && (
                  <button 
                    className="btn btn-success"
                    onClick={() => handleUpdateRFI(rfi.id, { 
                      status: RFIStatus.RESPONDED,
                      respondedAt: new Date(),
                      response: 'Response pending...'
                    })}
                  >
                    Add Response
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RFIManager;