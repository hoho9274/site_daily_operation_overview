import React from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import './LogisticsDashboard.css';

const LogisticsDashboard: React.FC = () => {
  const { deliveries, mirs, irs, metrics, loading, error } = useLogistics();

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        Error loading dashboard: {error.message}
      </div>
    );
  }

  return (
    <div className="logistics-dashboard">
      <h2 className="dashboard-title">Logistics Operations Dashboard</h2>
      
      {/* Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card deliveries-card">
          <div className="metric-icon">📦</div>
          <div className="metric-content">
            <h3>Deliveries</h3>
            <div className="metric-value">{metrics?.totalDeliveries || 0}</div>
            <div className="metric-details">
              <span className="metric-badge scheduled">{metrics?.scheduledDeliveries || 0} Scheduled</span>
              <span className="metric-badge completed">{metrics?.completedDeliveries || 0} Completed</span>
            </div>
            <div className="metric-rate">
              On-time Rate: <strong>{metrics?.deliveryOnTimeRate?.toFixed(1) || 0}%</strong>
            </div>
          </div>
        </div>

        <div className="metric-card mir-card">
          <div className="metric-icon">📋</div>
          <div className="metric-content">
            <h3>Material Inspections</h3>
            <div className="metric-value">{metrics?.totalMIRs || 0}</div>
            <div className="metric-details">
              <span className="metric-badge passed">{metrics?.passedMIRs || 0} Passed</span>
              <span className="metric-badge failed">{metrics?.failedMIRs || 0} Failed</span>
            </div>
            <div className="metric-rate">
              Compliance Rate: <strong>{metrics?.inspectionComplianceRate?.toFixed(1) || 0}%</strong>
            </div>
          </div>
        </div>

        <div className="metric-card ir-card">
          <div className="metric-icon">🔍</div>
          <div className="metric-content">
            <h3>Inspection Reports</h3>
            <div className="metric-value">{metrics?.totalIRs || 0}</div>
            <div className="metric-details">
              <span className="metric-badge open">{metrics?.openIRs || 0} Open</span>
              <span className="metric-badge closed">{metrics?.closedIRs || 0} Closed</span>
            </div>
            <div className="metric-rate">
              CA Completion: <strong>{metrics?.correctiveActionCompletionRate?.toFixed(1) || 0}%</strong>
            </div>
          </div>
        </div>

        <div className="metric-card performance-card">
          <div className="metric-icon">📊</div>
          <div className="metric-content">
            <h3>Performance</h3>
            <div className="metric-value">{metrics?.nonConformanceRate?.toFixed(2) || 0}</div>
            <div className="metric-label">Avg Non-conformances per MIR</div>
            <div className="metric-details">
              <span className="metric-badge">Avg Inspection: {metrics?.averageInspectionTime || 0} min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="dashboard-sections">
        <div className="dashboard-section">
          <h3 className="section-title">Recent Deliveries</h3>
          <div className="activity-list">
            {deliveries.slice(0, 5).map(delivery => (
              <div key={delivery.id} className="activity-item">
                <div className="activity-icon">🚚</div>
                <div className="activity-content">
                  <div className="activity-header">
                    <span className="activity-title">{delivery.deliveryNumber}</span>
                    <span className={`badge badge-${delivery.status === 'delivered' ? 'success' : 'warning'}`}>
                      {delivery.status}
                    </span>
                  </div>
                  <div className="activity-details">
                    <span>{delivery.vendor.name}</span>
                    <span>{new Date(delivery.scheduledDate).toLocaleDateString()}</span>
                  </div>
                  <div className="activity-materials">
                    {delivery.materials.length} material type(s)
                  </div>
                </div>
              </div>
            ))}
            {deliveries.length === 0 && (
              <div className="empty-state">No deliveries scheduled</div>
            )}
          </div>
        </div>

        <div className="dashboard-section">
          <h3 className="section-title">Recent MIRs</h3>
          <div className="activity-list">
            {mirs.slice(0, 5).map(mir => (
              <div key={mir.id} className="activity-item">
                <div className="activity-icon">📝</div>
                <div className="activity-content">
                  <div className="activity-header">
                    <span className="activity-title">{mir.mirNumber}</span>
                    <span className={`badge badge-${
                      mir.overallStatus === 'passed' ? 'success' : 
                      mir.overallStatus === 'failed' ? 'danger' : 'warning'
                    }`}>
                      {mir.overallStatus}
                    </span>
                  </div>
                  <div className="activity-details">
                    <span>{mir.inspector.name}</span>
                    <span>{new Date(mir.inspectionDate).toLocaleDateString()}</span>
                  </div>
                  {mir.nonConformances.length > 0 && (
                    <div className="activity-alert">
                      ⚠️ {mir.nonConformances.length} non-conformance(s)
                    </div>
                  )}
                </div>
              </div>
            ))}
            {mirs.length === 0 && (
              <div className="empty-state">No material inspections recorded</div>
            )}
          </div>
        </div>

        <div className="dashboard-section">
          <h3 className="section-title">Recent IRs</h3>
          <div className="activity-list">
            {irs.slice(0, 5).map(ir => (
              <div key={ir.id} className="activity-item">
                <div className="activity-icon">
                  {ir.type === 'safety' ? '⚠️' : ir.type === 'quality' ? '✓' : '🌱'}
                </div>
                <div className="activity-content">
                  <div className="activity-header">
                    <span className="activity-title">{ir.irNumber}</span>
                    <span className={`badge badge-${
                      ir.status === 'closed' ? 'success' : 
                      ir.status === 'open' ? 'warning' : 'info'
                    }`}>
                      {ir.status}
                    </span>
                  </div>
                  <div className="activity-details">
                    <span className="ir-type">{ir.type}</span>
                    <span>{ir.location}</span>
                    <span>{new Date(ir.inspectionDate).toLocaleDateString()}</span>
                  </div>
                  <div className="activity-stats">
                    <span>{ir.findings.length} finding(s)</span>
                    <span>{ir.correctiveActions.length} action(s)</span>
                  </div>
                </div>
              </div>
            ))}
            {irs.length === 0 && (
              <div className="empty-state">No inspection reports available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogisticsDashboard;