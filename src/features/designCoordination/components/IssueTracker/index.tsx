import React, { useEffect, useState } from 'react';
import { useDesignCoordination } from '../../context/DesignCoordinationContext';
import { DesignIssue, IssueStatus, Severity, IssueType } from '../../types';
import './IssueTracker.css';

const IssueTracker: React.FC = () => {
  const { state, actions } = useDesignCoordination();
  const { items: issues, loading } = state.issues;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<IssueStatus | ''>('');
  const [selectedSeverity, setSelectedSeverity] = useState<Severity | ''>('');
  const [selectedType, setSelectedType] = useState<IssueType | ''>('');

  useEffect(() => {
    actions.loadIssues();
  }, []);

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = 
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.issueNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || issue.status === selectedStatus;
    const matchesSeverity = !selectedSeverity || issue.severity === selectedSeverity;
    const matchesType = !selectedType || issue.type === selectedType;
    return matchesSearch && matchesStatus && matchesSeverity && matchesType;
  });

  const formatDate = (date?: Date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadgeClass = (status: IssueStatus) => {
    switch (status) {
      case IssueStatus.OPEN:
        return 'badge-open';
      case IssueStatus.IN_PROGRESS:
        return 'badge-in-review';
      case IssueStatus.RESOLVED:
        return 'badge-responded';
      case IssueStatus.CLOSED:
        return 'badge-closed';
      default:
        return '';
    }
  };

  const getSeverityBadgeClass = (severity: Severity) => {
    switch (severity) {
      case Severity.CRITICAL:
        return 'badge-critical';
      case Severity.HIGH:
        return 'badge-high';
      case Severity.MEDIUM:
        return 'badge-medium';
      case Severity.LOW:
        return 'badge-low';
      default:
        return '';
    }
  };

  const getTypeIcon = (type?: IssueType) => {
    switch (type) {
      case IssueType.CONFLICT:
        return '⚔️';
      case IssueType.MISSING_INFO:
        return '❓';
      case IssueType.ERROR:
        return '❌';
      case IssueType.CLARIFICATION:
        return '💬';
      default:
        return '📌';
    }
  };

  const handleUpdateStatus = (issueId: string, newStatus: IssueStatus) => {
    const updates: Partial<DesignIssue> = { status: newStatus };
    if (newStatus === IssueStatus.RESOLVED) {
      updates.resolvedAt = new Date();
    }
    actions.updateIssue(issueId, updates);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="issue-tracker">
      <div className="page-header">
        <h1 className="page-title">Design Issues</h1>
        <p className="page-subtitle">
          Track and resolve design conflicts and issues
        </p>
      </div>

      <div className="issue-controls">
        <div className="control-left">
          <input
            type="text"
            placeholder="Search issues..."
            className="form-control search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="form-control form-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as IssueStatus | '')}
          >
            <option value="">All Status</option>
            <option value={IssueStatus.OPEN}>Open</option>
            <option value={IssueStatus.IN_PROGRESS}>In Progress</option>
            <option value={IssueStatus.RESOLVED}>Resolved</option>
            <option value={IssueStatus.CLOSED}>Closed</option>
          </select>
          <select
            className="form-control form-select"
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value as Severity | '')}
          >
            <option value="">All Severities</option>
            <option value={Severity.CRITICAL}>Critical</option>
            <option value={Severity.HIGH}>High</option>
            <option value={Severity.MEDIUM}>Medium</option>
            <option value={Severity.LOW}>Low</option>
          </select>
          <select
            className="form-control form-select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as IssueType | '')}
          >
            <option value="">All Types</option>
            <option value={IssueType.CONFLICT}>Conflict</option>
            <option value={IssueType.MISSING_INFO}>Missing Info</option>
            <option value={IssueType.ERROR}>Error</option>
            <option value={IssueType.CLARIFICATION}>Clarification</option>
          </select>
        </div>
        <div className="control-right">
          <button className="btn btn-primary">
            <span>🚩</span> Report Issue
          </button>
        </div>
      </div>

      {filteredIssues.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">⚠️</div>
          <h3 className="empty-state-title">No issues found</h3>
          <p className="empty-state-text">
            {searchTerm || selectedStatus || selectedSeverity || selectedType
              ? 'Try adjusting your filters'
              : 'No design issues reported yet'}
          </p>
        </div>
      ) : (
        <div className="issue-grid">
          {filteredIssues.map((issue) => (
            <div key={issue.id} className="issue-card">
              <div className="issue-card-header">
                <div className="issue-type-icon">{getTypeIcon(issue.type)}</div>
                <div className="issue-card-badges">
                  <span className={`badge ${getStatusBadgeClass(issue.status)}`}>
                    {issue.status.replace('_', ' ')}
                  </span>
                  <span className={`badge ${getSeverityBadgeClass(issue.severity)}`}>
                    {issue.severity}
                  </span>
                </div>
              </div>

              <h3 className="issue-card-number">{issue.issueNumber}</h3>
              <h4 className="issue-card-title">{issue.title}</h4>

              {issue.description && (
                <p className="issue-card-description">{issue.description}</p>
              )}

              <div className="issue-impacts">
                <div className="impact-item">
                  <span className="impact-icon">💰</span>
                  <div className="impact-details">
                    <span className="impact-label">Cost Impact</span>
                    <span className="impact-value">{formatCurrency(issue.costImpact)}</span>
                  </div>
                </div>
                <div className="impact-item">
                  <span className="impact-icon">📅</span>
                  <div className="impact-details">
                    <span className="impact-label">Schedule Impact</span>
                    <span className="impact-value">
                      {issue.scheduleImpact ? `${issue.scheduleImpact} days` : '-'}
                    </span>
                  </div>
                </div>
              </div>

              {issue.resolution && (
                <div className="issue-resolution">
                  <h5 className="resolution-title">Resolution</h5>
                  <p className="resolution-text">{issue.resolution}</p>
                  <span className="resolution-date">
                    Resolved on {formatDate(issue.resolvedAt)}
                  </span>
                </div>
              )}

              <div className="issue-card-footer">
                <div className="issue-meta">
                  <span className="meta-item">
                    Assigned to: {issue.assignedToName || 'Unassigned'}
                  </span>
                  <span className="meta-item">
                    Created: {formatDate(issue.createdAt)}
                  </span>
                </div>
                <div className="issue-card-actions">
                  {issue.status === IssueStatus.OPEN && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleUpdateStatus(issue.id, IssueStatus.IN_PROGRESS)}
                    >
                      Start Work
                    </button>
                  )}
                  {issue.status === IssueStatus.IN_PROGRESS && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleUpdateStatus(issue.id, IssueStatus.RESOLVED)}
                    >
                      Mark Resolved
                    </button>
                  )}
                  {issue.status === IssueStatus.RESOLVED && (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleUpdateStatus(issue.id, IssueStatus.CLOSED)}
                    >
                      Close Issue
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IssueTracker;