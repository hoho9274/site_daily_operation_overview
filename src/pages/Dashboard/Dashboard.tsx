import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const metrics = [
    {
      title: 'Active Quality Actions',
      value: 25,
      change: '+3',
      trend: 'up',
      color: 'blue',
    },
    {
      title: 'Open EHS Incidents',
      value: 3,
      change: '-2',
      trend: 'down',
      color: 'red',
    },
    {
      title: 'Compliance Rate',
      value: '95%',
      change: '+2%',
      trend: 'up',
      color: 'green',
    },
    {
      title: 'Overdue Actions',
      value: 5,
      change: '+1',
      trend: 'up',
      color: 'orange',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'quality',
      description: 'New quality inspection scheduled for Zone A',
      time: '2 hours ago',
      user: 'Sarah Johnson',
    },
    {
      id: 2,
      type: 'safety',
      description: 'Safety incident reported in Warehouse B',
      time: '4 hours ago',
      user: 'Mike Chen',
    },
    {
      id: 3,
      type: 'action',
      description: 'Action item #QA-123 marked as complete',
      time: '6 hours ago',
      user: 'Emily Davis',
    },
    {
      id: 4,
      type: 'compliance',
      description: 'Weekly compliance report submitted',
      time: '1 day ago',
      user: 'Robert Wilson',
    },
  ];

  const upcomingTasks = [
    { id: 1, title: 'Safety Walkthrough - Zone C', due: 'Today, 2:00 PM', priority: 'high' },
    { id: 2, title: 'Quality Inspection - Building 2', due: 'Tomorrow, 10:00 AM', priority: 'medium' },
    { id: 3, title: 'EHS Monthly Report', due: 'Friday, 5:00 PM', priority: 'high' },
    { id: 4, title: 'Compliance Audit Prep', due: 'Next Week', priority: 'low' },
  ];

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back! Here's your site overview for today.</p>
        </div>
      </div>

      <div className="grid grid-cols-4 dashboard-metrics">
        {metrics.map((metric, index) => (
          <div key={index} className={`card metric-card metric-${metric.color}`}>
            <h3 className="metric-title">{metric.title}</h3>
            <div className="metric-value">{metric.value}</div>
            <div className={`metric-change trend-${metric.trend}`}>
              {metric.trend === 'up' ? '↑' : '↓'} {metric.change} from last week
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent Activities</h2>
            <Link to="/activities" className="btn btn-secondary">View All</Link>
          </div>
          <div className="activity-list">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className={`activity-icon icon-${activity.type}`}>
                  {activity.type === 'quality' && '✓'}
                  {activity.type === 'safety' && '⚠'}
                  {activity.type === 'action' && '📋'}
                  {activity.type === 'compliance' && '📊'}
                </div>
                <div className="activity-content">
                  <p className="activity-description">{activity.description}</p>
                  <div className="activity-meta">
                    <span className="activity-user">{activity.user}</span>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Upcoming Tasks</h2>
            <Link to="/quality-ehs" className="btn btn-primary">Manage Tasks</Link>
          </div>
          <div className="task-list">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="task-item">
                <div className="task-content">
                  <p className="task-title">{task.title}</p>
                  <p className="task-due">{task.due}</p>
                </div>
                <span className={`badge badge-${task.priority}`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Quick Actions</h2>
        </div>
        <div className="quick-actions">
          <Link to="/quality-ehs" className="quick-action-btn">
            <span className="quick-action-icon">📝</span>
            <span className="quick-action-text">Report Incident</span>
          </Link>
          <Link to="/quality-ehs" className="quick-action-btn">
            <span className="quick-action-icon">✅</span>
            <span className="quick-action-text">Create Action</span>
          </Link>
          <Link to="/quality-ehs" className="quick-action-btn">
            <span className="quick-action-icon">📊</span>
            <span className="quick-action-text">View Reports</span>
          </Link>
          <Link to="/quality-ehs" className="quick-action-btn">
            <span className="quick-action-icon">🔍</span>
            <span className="quick-action-text">Start Inspection</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;