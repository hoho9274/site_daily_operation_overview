import React, { useState } from 'react';
import './QualityEHSDashboard.css';
import QualityActionsPanel from '../../components/QualityEHS/QualityActionsPanel';
import EHSIncidentForm from '../../components/QualityEHS/EHSIncidentForm';
import MetricsDisplay from '../../components/QualityEHS/MetricsDisplay';
import ComplianceTracker from '../../components/QualityEHS/ComplianceTracker';
import ActionItemList from '../../components/QualityEHS/ActionItemList';
import { QualityAction, EHSIncident } from '../../types/QualityEHS';

const QualityEHSDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'actions' | 'incidents' | 'compliance'>('overview');
  const [showIncidentForm, setShowIncidentForm] = useState(false);
  const [showActionForm, setShowActionForm] = useState(false);

  // Mock data - in production, this would come from API
  const [actions] = useState<QualityAction[]>([
    {
      id: '1',
      title: 'Repair safety barrier in Zone A',
      description: 'Safety barrier damaged during construction work needs immediate repair',
      category: 'safety',
      priority: 'critical',
      status: 'open',
      assignee: { id: '1', name: 'John Smith', email: 'john.smith@construction.com' },
      dueDate: new Date('2025-09-25'),
      attachments: [],
      createdAt: new Date('2025-09-20'),
      updatedAt: new Date('2025-09-20'),
    },
    {
      id: '2',
      title: 'Quality inspection for concrete pour',
      description: 'Perform quality check on concrete pour in Building B, Level 3',
      category: 'quality',
      priority: 'high',
      status: 'in_progress',
      assignee: { id: '2', name: 'Sarah Johnson', email: 'sarah.j@construction.com' },
      dueDate: new Date('2025-09-23'),
      attachments: [],
      createdAt: new Date('2025-09-19'),
      updatedAt: new Date('2025-09-21'),
    },
    {
      id: '3',
      title: 'Environmental compliance audit',
      description: 'Monthly environmental compliance check for waste management',
      category: 'environmental',
      priority: 'medium',
      status: 'open',
      assignee: { id: '3', name: 'Mike Chen', email: 'mike.chen@construction.com' },
      dueDate: new Date('2025-09-30'),
      attachments: [],
      createdAt: new Date('2025-09-15'),
      updatedAt: new Date('2025-09-15'),
    },
  ]);

  const [incidents] = useState<EHSIncident[]>([
    {
      id: '1',
      type: 'safety',
      severity: 'minor',
      description: 'Worker slipped on wet surface in warehouse',
      location: 'Warehouse B',
      reportedBy: { id: '4', name: 'Emily Davis', email: 'emily.d@construction.com' },
      witnesses: [],
      actions: [],
      status: 'investigating',
      createdAt: new Date('2025-09-21T08:30:00'),
    },
    {
      id: '2',
      type: 'environmental',
      severity: 'moderate',
      description: 'Oil spill detected in parking area',
      location: 'Parking Lot C',
      reportedBy: { id: '5', name: 'Robert Wilson', email: 'robert.w@construction.com' },
      witnesses: [],
      actions: [],
      status: 'reported',
      createdAt: new Date('2025-09-20T14:15:00'),
    },
  ]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            <MetricsDisplay actions={actions} incidents={incidents} />
            <div className="grid grid-cols-2">
              <ActionItemList actions={actions.filter(a => a.status !== 'closed')} />
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Recent Incidents</h2>
                  <button 
                    className="btn btn-danger"
                    onClick={() => setShowIncidentForm(true)}
                  >
                    Report Incident
                  </button>
                </div>
                <div className="incident-list">
                  {incidents.map((incident) => (
                    <div key={incident.id} className="incident-item">
                      <div className={`incident-severity severity-${incident.severity}`}>
                        {incident.severity}
                      </div>
                      <div className="incident-details">
                        <h4 className="incident-title">{incident.description}</h4>
                        <div className="incident-meta">
                          <span>📍 {incident.location}</span>
                          <span>👤 {incident.reportedBy.name}</span>
                          <span>📅 {new Date(incident.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className={`incident-status status-${incident.status}`}>
                          {incident.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        );
      case 'actions':
        return <QualityActionsPanel actions={actions} onCreateAction={() => setShowActionForm(true)} />;
      case 'incidents':
        return (
          <div className="incidents-tab">
            <div className="tab-header">
              <h2>EHS Incidents Management</h2>
              <button 
                className="btn btn-danger"
                onClick={() => setShowIncidentForm(true)}
              >
                Report New Incident
              </button>
            </div>
            <div className="incidents-grid">
              {incidents.map((incident) => (
                <div key={incident.id} className="incident-card">
                  <div className="incident-card-header">
                    <span className={`incident-type type-${incident.type}`}>
                      {incident.type}
                    </span>
                    <span className={`incident-severity severity-${incident.severity}`}>
                      {incident.severity}
                    </span>
                  </div>
                  <h3>{incident.description}</h3>
                  <div className="incident-info">
                    <p>📍 Location: {incident.location}</p>
                    <p>👤 Reported by: {incident.reportedBy.name}</p>
                    <p>📅 Date: {new Date(incident.createdAt).toLocaleString()}</p>
                    <p>🔍 Status: <span className={`status-badge status-${incident.status}`}>
                      {incident.status}
                    </span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'compliance':
        return <ComplianceTracker actions={actions} incidents={incidents} />;
      default:
        return null;
    }
  };

  return (
    <div className="quality-ehs-dashboard">
      <div className="page-header">
        <div>
          <h1 className="page-title">Quality & EHS Management</h1>
          <p className="page-subtitle">
            Monitor quality actions, track EHS incidents, and ensure compliance
          </p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setShowActionForm(true)}
          >
            + New Action
          </button>
          <button 
            className="btn btn-danger"
            onClick={() => setShowIncidentForm(true)}
          >
            ⚠ Report Incident
          </button>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab ${activeTab === 'actions' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('actions')}
        >
          Quality Actions
        </button>
        <button
          className={`tab ${activeTab === 'incidents' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('incidents')}
        >
          EHS Incidents
        </button>
        <button
          className={`tab ${activeTab === 'compliance' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('compliance')}
        >
          Compliance
        </button>
      </div>

      <div className="tab-content">
        {renderTabContent()}
      </div>

      {showIncidentForm && (
        <EHSIncidentForm onClose={() => setShowIncidentForm(false)} />
      )}

      {showActionForm && (
        <div className="modal-overlay" onClick={() => setShowActionForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Create New Action</h2>
              <button className="modal-close" onClick={() => setShowActionForm(false)}>×</button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input type="text" className="form-input" placeholder="Enter action title" />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-textarea" placeholder="Enter detailed description" />
                </div>
                <div className="grid grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-select">
                      <option value="quality">Quality</option>
                      <option value="safety">Safety</option>
                      <option value="environmental">Environmental</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Priority</label>
                    <select className="form-select">
                      <option value="critical">Critical</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Assignee</label>
                    <select className="form-select">
                      <option>John Smith</option>
                      <option>Sarah Johnson</option>
                      <option>Mike Chen</option>
                      <option>Emily Davis</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Due Date</label>
                    <input type="date" className="form-input" />
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowActionForm(false)}>
                Cancel
              </button>
              <button className="btn btn-primary">Create Action</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QualityEHSDashboard;