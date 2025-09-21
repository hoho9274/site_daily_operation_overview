import React from 'react';
import { QualityAction } from '../../types/QualityEHS';
import PriorityBadge from './PriorityBadge';
import StatusIndicator from './StatusIndicator';
import './ActionCard.css';

interface ActionCardProps {
  action: QualityAction;
}

const ActionCard: React.FC<ActionCardProps> = ({ action }) => {
  const isOverdue = new Date(action.dueDate) < new Date() && action.status !== 'closed';
  const daysUntilDue = Math.ceil((new Date(action.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'quality': return '✓';
      case 'safety': return '🛡️';
      case 'environmental': return '🌱';
      default: return '📋';
    }
  };

  return (
    <div className={`action-card ${isOverdue ? 'action-card-overdue' : ''}`}>
      <div className="action-card-header">
        <div className="action-category">
          <span className="category-icon">{getCategoryIcon(action.category)}</span>
          <span className="category-name">{action.category}</span>
        </div>
        <PriorityBadge priority={action.priority} />
      </div>

      <h3 className="action-title">{action.title}</h3>
      <p className="action-description">{action.description}</p>

      <div className="action-meta">
        <div className="assignee">
          <span className="assignee-icon">👤</span>
          <span className="assignee-name">{action.assignee.name}</span>
        </div>
        <div className={`due-date ${isOverdue ? 'due-date-overdue' : ''}`}>
          <span className="due-date-icon">📅</span>
          <span className="due-date-text">
            {isOverdue ? 'Overdue' : `Due in ${daysUntilDue} days`}
          </span>
        </div>
      </div>

      <div className="action-card-footer">
        <StatusIndicator status={action.status} />
        <div className="action-buttons">
          <button className="action-btn" title="View Details">👁️</button>
          <button className="action-btn" title="Edit">✏️</button>
          <button className="action-btn" title="Add Comment">💬</button>
        </div>
      </div>

      {action.attachments.length > 0 && (
        <div className="attachments-count">
          📎 {action.attachments.length} attachment(s)
        </div>
      )}
    </div>
  );
};

export default ActionCard;