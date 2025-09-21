import React from 'react';
import './StatusIndicator.css';

interface StatusIndicatorProps {
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'open': return '○';
      case 'in_progress': return '◐';
      case 'resolved': return '◉';
      case 'closed': return '●';
      default: return '';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'open': return 'Open';
      case 'in_progress': return 'In Progress';
      case 'resolved': return 'Resolved';
      case 'closed': return 'Closed';
      default: return '';
    }
  };

  return (
    <div className={`status-indicator status-${status}`}>
      <span className="status-icon">{getStatusIcon()}</span>
      <span className="status-text">{getStatusText()}</span>
    </div>
  );
};

export default StatusIndicator;