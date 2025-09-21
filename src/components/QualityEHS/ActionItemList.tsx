import React from 'react';
import { QualityAction } from '../../types/QualityEHS';
import PriorityBadge from './PriorityBadge';
import StatusIndicator from './StatusIndicator';
import './ActionItemList.css';

interface ActionItemListProps {
  actions: QualityAction[];
}

const ActionItemList: React.FC<ActionItemListProps> = ({ actions }) => {
  const sortedActions = [...actions].sort((a, b) => {
    // Sort by priority first
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    
    // Then by due date
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Active Action Items</h2>
        <span className="action-count">{actions.length} items</span>
      </div>
      
      <div className="action-item-list">
        {sortedActions.length === 0 ? (
          <div className="empty-state">
            <p>No active action items</p>
          </div>
        ) : (
          sortedActions.map((action) => (
            <div key={action.id} className="action-item">
              <div className="action-item-left">
                <div className="action-item-header">
                  <h4 className="action-item-title">{action.title}</h4>
                  <PriorityBadge priority={action.priority} />
                </div>
                <p className="action-item-description">{action.description}</p>
                <div className="action-item-meta">
                  <span className="meta-item">
                    👤 {action.assignee.name}
                  </span>
                  <span className="meta-item">
                    📅 {new Date(action.dueDate).toLocaleDateString()}
                  </span>
                  <span className="meta-item">
                    {action.category === 'quality' && '✓'}
                    {action.category === 'safety' && '🛡️'}
                    {action.category === 'environmental' && '🌱'}
                    {' '}{action.category}
                  </span>
                </div>
              </div>
              <div className="action-item-right">
                <StatusIndicator status={action.status} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActionItemList;