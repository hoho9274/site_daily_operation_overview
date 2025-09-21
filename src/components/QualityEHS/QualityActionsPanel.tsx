import React, { useState } from 'react';
import { QualityAction } from '../../types/QualityEHS';
import ActionCard from './ActionCard';
import './QualityActionsPanel.css';

interface QualityActionsPanelProps {
  actions: QualityAction[];
  onCreateAction: () => void;
}

const QualityActionsPanel: React.FC<QualityActionsPanelProps> = ({ actions, onCreateAction }) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredActions = actions.filter((action) => {
    const matchesCategory = filterCategory === 'all' || action.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || action.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || action.priority === filterPriority;
    const matchesSearch = 
      searchTerm === '' || 
      action.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesStatus && matchesPriority && matchesSearch;
  });

  const stats = {
    total: actions.length,
    open: actions.filter(a => a.status === 'open').length,
    inProgress: actions.filter(a => a.status === 'in_progress').length,
    resolved: actions.filter(a => a.status === 'resolved').length,
    closed: actions.filter(a => a.status === 'closed').length,
    critical: actions.filter(a => a.priority === 'critical').length,
    overdue: actions.filter(a => new Date(a.dueDate) < new Date() && a.status !== 'closed').length,
  };

  return (
    <div className="quality-actions-panel">
      <div className="panel-header">
        <div className="panel-stats">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Actions</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.open}</div>
            <div className="stat-label">Open</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.inProgress}</div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.resolved}</div>
            <div className="stat-label">Resolved</div>
          </div>
          <div className="stat-card stat-critical">
            <div className="stat-value">{stats.critical}</div>
            <div className="stat-label">Critical</div>
          </div>
          <div className="stat-card stat-overdue">
            <div className="stat-value">{stats.overdue}</div>
            <div className="stat-label">Overdue</div>
          </div>
        </div>
      </div>

      <div className="panel-filters">
        <div className="search-box">
          <input
            type="text"
            className="search-input"
            placeholder="Search actions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select
            className="filter-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="quality">Quality</option>
            <option value="safety">Safety</option>
            <option value="environmental">Environmental</option>
          </select>
          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <select
            className="filter-select"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <button className="btn btn-primary" onClick={onCreateAction}>
          + New Action
        </button>
      </div>

      <div className="actions-grid">
        {filteredActions.length === 0 ? (
          <div className="no-results">
            <p>No actions found matching your filters.</p>
            <button className="btn btn-primary" onClick={onCreateAction}>
              Create New Action
            </button>
          </div>
        ) : (
          filteredActions.map((action) => (
            <ActionCard key={action.id} action={action} />
          ))
        )}
      </div>
    </div>
  );
};

export default QualityActionsPanel;