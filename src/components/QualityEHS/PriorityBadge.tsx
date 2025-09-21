import React from 'react';
import './PriorityBadge.css';

interface PriorityBadgeProps {
  priority: 'critical' | 'high' | 'medium' | 'low';
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const getPriorityIcon = () => {
    switch (priority) {
      case 'critical': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      case 'low': return '🔵';
      default: return '';
    }
  };

  return (
    <span className={`priority-badge priority-${priority}`}>
      {getPriorityIcon()} {priority}
    </span>
  );
};

export default PriorityBadge;