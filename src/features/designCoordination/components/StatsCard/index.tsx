import React from 'react';
import './StatsCard.css';

interface StatsCardProps {
  title: string;
  value: number;
  total?: number;
  icon: string;
  trend?: string;
  trendUp?: boolean;
  highlight?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  total,
  icon,
  trend,
  trendUp,
  highlight,
}) => {
  return (
    <div className={`stats-card ${highlight ? 'highlight' : ''}`}>
      <div className="stats-card-header">
        <span className="stats-card-icon">{icon}</span>
        {trend && (
          <span className={`stats-card-trend ${trendUp ? 'up' : 'down'}`}>
            <span className="trend-arrow">{trendUp ? '↑' : '↓'}</span>
            {trend}
          </span>
        )}
      </div>
      <div className="stats-card-body">
        <h3 className="stats-card-title">{title}</h3>
        <div className="stats-card-value">
          <span className="value">{value}</span>
          {total !== undefined && (
            <span className="total">/ {total}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;