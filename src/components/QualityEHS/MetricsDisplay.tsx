import React from 'react';
import { QualityAction, EHSIncident } from '../../types/QualityEHS';
import './MetricsDisplay.css';

interface MetricsDisplayProps {
  actions: QualityAction[];
  incidents: EHSIncident[];
}

const MetricsDisplay: React.FC<MetricsDisplayProps> = ({ actions, incidents }) => {
  // Calculate metrics
  const totalActions = actions.length;
  const openActions = actions.filter(a => a.status === 'open').length;
  const overdueActions = actions.filter(a => 
    new Date(a.dueDate) < new Date() && a.status !== 'closed'
  ).length;
  const completionRate = totalActions > 0 
    ? Math.round((actions.filter(a => a.status === 'closed').length / totalActions) * 100)
    : 0;

  const totalIncidents = incidents.length;
  const openIncidents = incidents.filter(i => i.status !== 'resolved').length;
  
  // Calculate days without incident (mock data for demo)
  const lastIncidentDate = incidents.length > 0 
    ? new Date(Math.max(...incidents.map(i => new Date(i.createdAt).getTime())))
    : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const daysWithoutIncident = Math.floor((Date.now() - lastIncidentDate.getTime()) / (1000 * 60 * 60 * 24));

  const severityDistribution = {
    minor: incidents.filter(i => i.severity === 'minor').length,
    moderate: incidents.filter(i => i.severity === 'moderate').length,
    major: incidents.filter(i => i.severity === 'major').length,
    critical: incidents.filter(i => i.severity === 'critical').length,
  };

  // Quality metrics by category
  const qualityMetrics = {
    quality: actions.filter(a => a.category === 'quality').length,
    safety: actions.filter(a => a.category === 'safety').length,
    environmental: actions.filter(a => a.category === 'environmental').length,
  };

  return (
    <div className="metrics-display">
      <div className="metrics-section">
        <h3 className="metrics-section-title">Quality Actions Overview</h3>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon">📋</div>
            <div className="metric-content">
              <div className="metric-value">{totalActions}</div>
              <div className="metric-label">Total Actions</div>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">📂</div>
            <div className="metric-content">
              <div className="metric-value">{openActions}</div>
              <div className="metric-label">Open Actions</div>
            </div>
          </div>
          <div className="metric-card metric-warning">
            <div className="metric-icon">⏰</div>
            <div className="metric-content">
              <div className="metric-value">{overdueActions}</div>
              <div className="metric-label">Overdue</div>
            </div>
          </div>
          <div className="metric-card metric-success">
            <div className="metric-icon">✅</div>
            <div className="metric-content">
              <div className="metric-value">{completionRate}%</div>
              <div className="metric-label">Completion Rate</div>
            </div>
          </div>
        </div>
      </div>

      <div className="metrics-section">
        <h3 className="metrics-section-title">EHS Performance</h3>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon">⚠️</div>
            <div className="metric-content">
              <div className="metric-value">{totalIncidents}</div>
              <div className="metric-label">Total Incidents</div>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">🔍</div>
            <div className="metric-content">
              <div className="metric-value">{openIncidents}</div>
              <div className="metric-label">Under Investigation</div>
            </div>
          </div>
          <div className="metric-card metric-success">
            <div className="metric-icon">🛡️</div>
            <div className="metric-content">
              <div className="metric-value">{daysWithoutIncident}</div>
              <div className="metric-label">Days Without Incident</div>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">📊</div>
            <div className="metric-content">
              <div className="metric-value">
                {severityDistribution.critical > 0 ? 'Critical' : 
                 severityDistribution.major > 0 ? 'Major' :
                 severityDistribution.moderate > 0 ? 'Moderate' : 'Minor'}
              </div>
              <div className="metric-label">Highest Severity</div>
            </div>
          </div>
        </div>
      </div>

      <div className="metrics-charts">
        <div className="chart-card">
          <h4 className="chart-title">Actions by Category</h4>
          <div className="category-bars">
            <div className="category-bar">
              <div className="bar-label">
                <span>Quality</span>
                <span>{qualityMetrics.quality}</span>
              </div>
              <div className="bar-container">
                <div 
                  className="bar bar-quality" 
                  style={{ width: `${(qualityMetrics.quality / totalActions) * 100 || 0}%` }}
                />
              </div>
            </div>
            <div className="category-bar">
              <div className="bar-label">
                <span>Safety</span>
                <span>{qualityMetrics.safety}</span>
              </div>
              <div className="bar-container">
                <div 
                  className="bar bar-safety" 
                  style={{ width: `${(qualityMetrics.safety / totalActions) * 100 || 0}%` }}
                />
              </div>
            </div>
            <div className="category-bar">
              <div className="bar-label">
                <span>Environmental</span>
                <span>{qualityMetrics.environmental}</span>
              </div>
              <div className="bar-container">
                <div 
                  className="bar bar-environmental" 
                  style={{ width: `${(qualityMetrics.environmental / totalActions) * 100 || 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h4 className="chart-title">Incident Severity Distribution</h4>
          <div className="severity-grid">
            <div className={`severity-stat ${severityDistribution.minor > 0 ? 'active' : ''}`}>
              <div className="severity-count">{severityDistribution.minor}</div>
              <div className="severity-label">Minor</div>
            </div>
            <div className={`severity-stat ${severityDistribution.moderate > 0 ? 'active' : ''}`}>
              <div className="severity-count">{severityDistribution.moderate}</div>
              <div className="severity-label">Moderate</div>
            </div>
            <div className={`severity-stat ${severityDistribution.major > 0 ? 'active' : ''}`}>
              <div className="severity-count">{severityDistribution.major}</div>
              <div className="severity-label">Major</div>
            </div>
            <div className={`severity-stat ${severityDistribution.critical > 0 ? 'active' : ''}`}>
              <div className="severity-count">{severityDistribution.critical}</div>
              <div className="severity-label">Critical</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsDisplay;