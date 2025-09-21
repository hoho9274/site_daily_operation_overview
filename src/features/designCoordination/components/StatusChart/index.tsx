import React from 'react';
import { RFI, DesignIssue, RFIStatus, IssueStatus, Severity, Priority } from '../../types';
import './StatusChart.css';

interface StatusChartProps {
  type: 'rfi' | 'issue';
  data: RFI[] | DesignIssue[];
}

const StatusChart: React.FC<StatusChartProps> = ({ type, data }) => {
  const getStatusData = () => {
    if (type === 'rfi') {
      const rfis = data as RFI[];
      const statusCounts = {
        [RFIStatus.OPEN]: rfis.filter(r => r.status === RFIStatus.OPEN).length,
        [RFIStatus.IN_REVIEW]: rfis.filter(r => r.status === RFIStatus.IN_REVIEW).length,
        [RFIStatus.RESPONDED]: rfis.filter(r => r.status === RFIStatus.RESPONDED).length,
        [RFIStatus.CLOSED]: rfis.filter(r => r.status === RFIStatus.CLOSED).length,
      };
      return [
        { label: 'Open', value: statusCounts[RFIStatus.OPEN], color: '#3b82f6' },
        { label: 'In Review', value: statusCounts[RFIStatus.IN_REVIEW], color: '#f59e0b' },
        { label: 'Responded', value: statusCounts[RFIStatus.RESPONDED], color: '#10b981' },
        { label: 'Closed', value: statusCounts[RFIStatus.CLOSED], color: '#6b7280' },
      ];
    } else {
      const issues = data as DesignIssue[];
      const severityCounts = {
        [Severity.CRITICAL]: issues.filter(i => i.severity === Severity.CRITICAL).length,
        [Severity.HIGH]: issues.filter(i => i.severity === Severity.HIGH).length,
        [Severity.MEDIUM]: issues.filter(i => i.severity === Severity.MEDIUM).length,
        [Severity.LOW]: issues.filter(i => i.severity === Severity.LOW).length,
      };
      return [
        { label: 'Critical', value: severityCounts[Severity.CRITICAL], color: '#ef4444' },
        { label: 'High', value: severityCounts[Severity.HIGH], color: '#f97316' },
        { label: 'Medium', value: severityCounts[Severity.MEDIUM], color: '#f59e0b' },
        { label: 'Low', value: severityCounts[Severity.LOW], color: '#6366f1' },
      ];
    }
  };

  const chartData = getStatusData();
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="status-chart">
      <div className="chart-bars">
        {chartData.map((item) => {
          const percentage = total > 0 ? (item.value / total) * 100 : 0;
          return (
            <div key={item.label} className="chart-bar-container">
              <div className="chart-bar-header">
                <span className="chart-bar-label">{item.label}</span>
                <span className="chart-bar-value">{item.value}</span>
              </div>
              <div className="chart-bar-track">
                <div
                  className="chart-bar-fill"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
              <span className="chart-bar-percentage">{percentage.toFixed(1)}%</span>
            </div>
          );
        })}
      </div>
      <div className="chart-total">
        <span className="total-label">Total:</span>
        <span className="total-value">{total}</span>
      </div>
    </div>
  );
};

export default StatusChart;