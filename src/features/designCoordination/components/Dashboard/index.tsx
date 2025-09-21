import React, { useEffect } from 'react';
import { useDesignCoordination } from '../../context/DesignCoordinationContext';
import StatsCard from '../StatsCard';
import ActivityFeed from '../ActivityFeed';
import StatusChart from '../StatusChart';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { state, actions } = useDesignCoordination();
  const { stats, loading } = state.dashboard;

  useEffect(() => {
    actions.loadDashboardStats();
    actions.loadDocuments();
    actions.loadRFIs();
    actions.loadIssues();
  }, []);

  if (loading || !stats) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1 className="page-title">Design Coordination Dashboard</h1>
        <p className="page-subtitle">
          Overview of design documents, RFIs, and issues
        </p>
      </div>

      <div className="dashboard-stats">
        <StatsCard
          title="Total Documents"
          value={stats.totalDocuments}
          icon="📁"
          trend="+12%"
          trendUp={true}
        />
        <StatsCard
          title="Open RFIs"
          value={stats.openRFIs}
          total={stats.totalRFIs}
          icon="❓"
          trend="-8%"
          trendUp={false}
        />
        <StatsCard
          title="Open Issues"
          value={stats.openIssues}
          total={stats.totalIssues}
          icon="⚠️"
          trend="+5%"
          trendUp={true}
        />
        <StatsCard
          title="Critical Items"
          value={stats.criticalItems}
          icon="🚨"
          trend="+2"
          trendUp={true}
          highlight={true}
        />
      </div>

      <div className="dashboard-content">
        <div className="dashboard-main">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">RFI Status Distribution</h2>
            </div>
            <StatusChart type="rfi" data={state.rfis.items} />
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Issue Severity Breakdown</h2>
            </div>
            <StatusChart type="issue" data={state.issues.items} />
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Response Time Metrics</h2>
            </div>
            <div className="metrics-content">
              <div className="metric-item">
                <span className="metric-label">Average Response Time</span>
                <span className="metric-value">{stats.avgResponseTime} days</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">RFIs Due This Week</span>
                <span className="metric-value">
                  {state.rfis.items.filter(rfi => {
                    if (!rfi.dueDate) return false;
                    const dueDate = new Date(rfi.dueDate);
                    const weekFromNow = new Date();
                    weekFromNow.setDate(weekFromNow.getDate() + 7);
                    return dueDate <= weekFromNow;
                  }).length}
                </span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Overdue RFIs</span>
                <span className="metric-value highlight">
                  {state.rfis.items.filter(rfi => {
                    if (!rfi.dueDate || rfi.status === 'closed' || rfi.status === 'responded') return false;
                    return new Date(rfi.dueDate) < new Date();
                  }).length}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-sidebar">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Recent Activities</h2>
              <button className="btn btn-secondary btn-sm">View All</button>
            </div>
            <ActivityFeed activities={stats.recentActivities} />
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Quick Actions</h2>
            </div>
            <div className="quick-actions">
              <button className="quick-action-btn" onClick={() => window.location.href = '/documents'}>
                <span className="quick-action-icon">📤</span>
                <span>Upload Document</span>
              </button>
              <button className="quick-action-btn" onClick={() => window.location.href = '/rfis'}>
                <span className="quick-action-icon">➕</span>
                <span>Create RFI</span>
              </button>
              <button className="quick-action-btn" onClick={() => window.location.href = '/issues'}>
                <span className="quick-action-icon">🚩</span>
                <span>Report Issue</span>
              </button>
              <button className="quick-action-btn">
                <span className="quick-action-icon">📊</span>
                <span>Export Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;