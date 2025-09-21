import React from 'react';
import { Activity } from '../../types';
import './ActivityFeed.css';

interface ActivityFeedProps {
  activities: Activity[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'document_upload':
        return '📤';
      case 'rfi_created':
        return '❓';
      case 'rfi_responded':
        return '✅';
      case 'issue_created':
        return '🚩';
      case 'issue_resolved':
        return '✓';
      default:
        return '📌';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="activity-feed">
      {activities.map((activity) => (
        <div key={activity.id} className="activity-item">
          <span className="activity-icon">{getActivityIcon(activity.type)}</span>
          <div className="activity-content">
            <p className="activity-title">{activity.title}</p>
            <p className="activity-description">{activity.description}</p>
            <span className="activity-time">{formatTime(activity.timestamp)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityFeed;