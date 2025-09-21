import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HealthOverview from '../HealthOverview';
import { Schedule, ScheduleHealth } from '../../../types/schedule.types';
import { mockSchedules } from '../../../mocks/scheduleMockData';
import { mockHealth } from '../../../mocks/healthMockData';

describe('HealthOverview', () => {
  const mockSchedule: Schedule = mockSchedules[0];

  it('renders overall health score', () => {
    render(<HealthOverview schedule={mockSchedule} health={mockHealth} />);
    
    const healthScore = screen.getByText(`${Math.round(mockHealth.overall)}%`);
    expect(healthScore).toBeInTheDocument();
  });

  it('displays health status label based on score', () => {
    render(<HealthOverview schedule={mockSchedule} health={mockHealth} />);
    
    // For score of 78.5%, should show "At Risk"
    expect(screen.getByText('At Risk')).toBeInTheDocument();
  });

  it('shows schedule performance metrics', () => {
    render(<HealthOverview schedule={mockSchedule} health={mockHealth} />);
    
    expect(screen.getByText('SPI')).toBeInTheDocument();
    expect(screen.getByText(mockHealth.schedule.spi.toFixed(2))).toBeInTheDocument();
    expect(screen.getByText('Schedule Variance')).toBeInTheDocument();
  });

  it('shows cost performance metrics', () => {
    render(<HealthOverview schedule={mockSchedule} health={mockHealth} />);
    
    expect(screen.getByText('CPI')).toBeInTheDocument();
    expect(screen.getByText(mockHealth.cost.cpi.toFixed(2))).toBeInTheDocument();
    expect(screen.getByText('Cost Variance')).toBeInTheDocument();
  });

  it('displays task progress information', () => {
    render(<HealthOverview schedule={mockSchedule} health={mockHealth} />);
    
    expect(screen.getByText('Task Progress')).toBeInTheDocument();
    expect(screen.getByText('Completion')).toBeInTheDocument();
    
    const completedText = `${mockHealth.schedule.completedTasks} / ${mockHealth.schedule.totalTasks}`;
    expect(screen.getByText(completedText)).toBeInTheDocument();
  });

  it('shows delayed tasks warning when tasks are delayed', () => {
    render(<HealthOverview schedule={mockSchedule} health={mockHealth} />);
    
    if (mockHealth.schedule.delayedTasks > 0) {
      expect(screen.getByText(`${mockHealth.schedule.delayedTasks} tasks delayed`)).toBeInTheDocument();
    }
  });

  it('displays forecast completion date', () => {
    render(<HealthOverview schedule={mockSchedule} health={mockHealth} />);
    
    const forecastDate = new Date(mockHealth.schedule.forecastCompletionDate).toLocaleDateString();
    expect(screen.getByText(`Forecast: ${forecastDate}`)).toBeInTheDocument();
  });

  it('shows critical path status', () => {
    render(<HealthOverview schedule={mockSchedule} health={mockHealth} />);
    
    expect(screen.getByText(mockHealth.schedule.criticalPathStatus)).toBeInTheDocument();
  });

  it('displays last updated timestamp', () => {
    render(<HealthOverview schedule={mockSchedule} health={mockHealth} />);
    
    const lastUpdated = new Date(mockHealth.lastCalculated).toLocaleString();
    expect(screen.getByText(`Last updated: ${lastUpdated}`)).toBeInTheDocument();
  });

  it('renders healthy status for high scores', () => {
    const healthyHealth = {
      ...mockHealth,
      overall: 90,
    };
    
    render(<HealthOverview schedule={mockSchedule} health={healthyHealth} />);
    expect(screen.getByText('Healthy')).toBeInTheDocument();
  });

  it('renders critical status for low scores', () => {
    const criticalHealth = {
      ...mockHealth,
      overall: 50,
    };
    
    render(<HealthOverview schedule={mockSchedule} health={criticalHealth} />);
    expect(screen.getByText('Critical')).toBeInTheDocument();
  });
});
