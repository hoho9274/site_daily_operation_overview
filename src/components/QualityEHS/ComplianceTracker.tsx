import React from 'react';
import { QualityAction, EHSIncident } from '../../types/QualityEHS';
import './ComplianceTracker.css';

interface ComplianceTrackerProps {
  actions: QualityAction[];
  incidents: EHSIncident[];
}

const ComplianceTracker: React.FC<ComplianceTrackerProps> = ({ actions, incidents }) => {
  // Calculate compliance scores
  const calculateComplianceScore = (category: 'quality' | 'safety' | 'environmental') => {
    const categoryActions = actions.filter(a => a.category === category);
    const closedActions = categoryActions.filter(a => a.status === 'closed');
    return categoryActions.length > 0 
      ? Math.round((closedActions.length / categoryActions.length) * 100)
      : 100;
  };

  const overallCompliance = Math.round(
    (calculateComplianceScore('quality') + 
     calculateComplianceScore('safety') + 
     calculateComplianceScore('environmental')) / 3
  );

  // Mock data for audits and inspections
  const upcomingAudits = [
    { id: '1', name: 'Monthly Safety Audit', date: '2025-09-28', type: 'Safety' },
    { id: '2', name: 'Environmental Compliance Check', date: '2025-10-05', type: 'Environmental' },
    { id: '3', name: 'Quality Standards Review', date: '2025-10-12', type: 'Quality' },
  ];

  const recentInspections = [
    { id: '1', name: 'Site Safety Inspection', date: '2025-09-15', result: 'pass' as const },
    { id: '2', name: 'Quality Control Check', date: '2025-09-10', result: 'conditional' as const },
    { id: '3', name: 'Environmental Assessment', date: '2025-09-05', result: 'pass' as const },
  ];

  const complianceChecklist = [
    { id: '1', item: 'Safety equipment inspection', completed: true },
    { id: '2', item: 'Emergency procedures training', completed: true },
    { id: '3', item: 'Environmental waste disposal records', completed: false },
    { id: '4', item: 'Quality control documentation', completed: true },
    { id: '5', item: 'Incident reporting system active', completed: true },
    { id: '6', item: 'PPE compliance check', completed: false },
    { id: '7', item: 'Safety signage updated', completed: true },
    { id: '8', item: 'First aid supplies restocked', completed: true },
  ];

  const getComplianceColor = (score: number) => {
    if (score >= 90) return 'compliance-excellent';
    if (score >= 75) return 'compliance-good';
    if (score >= 60) return 'compliance-fair';
    return 'compliance-poor';
  };

  return (
    <div className="compliance-tracker">
      <div className="compliance-overview">
        <div className="compliance-score-card">
          <h3>Overall Compliance Score</h3>
          <div className={`compliance-score ${getComplianceColor(overallCompliance)}`}>
            <span className="score-value">{overallCompliance}%</span>
            <span className="score-label">Compliant</span>
          </div>
          <div className="compliance-breakdown">
            <div className="breakdown-item">
              <span className="breakdown-label">Quality</span>
              <div className="breakdown-bar">
                <div 
                  className="bar-fill quality"
                  style={{ width: `${calculateComplianceScore('quality')}%` }}
                />
              </div>
              <span className="breakdown-value">{calculateComplianceScore('quality')}%</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">Safety</span>
              <div className="breakdown-bar">
                <div 
                  className="bar-fill safety"
                  style={{ width: `${calculateComplianceScore('safety')}%` }}
                />
              </div>
              <span className="breakdown-value">{calculateComplianceScore('safety')}%</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">Environmental</span>
              <div className="breakdown-bar">
                <div 
                  className="bar-fill environmental"
                  style={{ width: `${calculateComplianceScore('environmental')}%` }}
                />
              </div>
              <span className="breakdown-value">{calculateComplianceScore('environmental')}%</span>
            </div>
          </div>
        </div>

        <div className="compliance-stats">
          <div className="stat-row">
            <span className="stat-label">Total Actions</span>
            <span className="stat-value">{actions.length}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Open Actions</span>
            <span className="stat-value">{actions.filter(a => a.status === 'open').length}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Total Incidents</span>
            <span className="stat-value">{incidents.length}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Resolved Incidents</span>
            <span className="stat-value">{incidents.filter(i => i.status === 'resolved').length}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Upcoming Audits</h3>
          </div>
          <div className="audit-list">
            {upcomingAudits.map((audit) => (
              <div key={audit.id} className="audit-item">
                <div className="audit-info">
                  <h4>{audit.name}</h4>
                  <div className="audit-meta">
                    <span className="audit-type">{audit.type}</span>
                    <span className="audit-date">📅 {audit.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Inspections</h3>
          </div>
          <div className="inspection-list">
            {recentInspections.map((inspection) => (
              <div key={inspection.id} className="inspection-item">
                <div className="inspection-info">
                  <h4>{inspection.name}</h4>
                  <span className="inspection-date">{inspection.date}</span>
                </div>
                <span className={`inspection-result result-${inspection.result}`}>
                  {inspection.result}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Compliance Checklist</h3>
          <span className="checklist-progress">
            {complianceChecklist.filter(item => item.completed).length} / {complianceChecklist.length} Complete
          </span>
        </div>
        <div className="checklist-grid">
          {complianceChecklist.map((item) => (
            <div key={item.id} className="checklist-item">
              <input
                type="checkbox"
                checked={item.completed}
                readOnly
                className="checklist-checkbox"
              />
              <label className="checklist-label">{item.item}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComplianceTracker;