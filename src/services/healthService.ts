import axios from 'axios';
import { 
  ScheduleHealth, 
  CriticalPathAnalysis, 
  DelayPrediction,
  Recommendation 
} from '../types/schedule.types';
import { 
  mockHealth, 
  mockCriticalPath, 
  mockPredictions, 
  mockRecommendations 
} from '../mocks/healthMockData';

const API_BASE_URL = process.env['REACT_APP_API_URL'] || 'http://localhost:3001/api';
const USE_MOCK_DATA = process.env['REACT_APP_USE_MOCK_DATA'] !== 'false';

class HealthService {
  private baseURL = `${API_BASE_URL}/schedule-health`;

  async calculateHealth(scheduleId: string): Promise<ScheduleHealth> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 600));
      return { ...mockHealth, lastCalculated: new Date() };
    }

    const response = await axios.get(`${this.baseURL}/${scheduleId}/health`);
    return response.data;
  }

  async getMetrics(scheduleId: string): Promise<any> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        spi: mockHealth.schedule.spi,
        cpi: mockHealth.cost.cpi,
        sv: mockHealth.schedule.sv,
        cv: mockHealth.cost.cv,
        eac: mockHealth.cost.eac,
        etc: mockHealth.cost.etc,
      };
    }

    const response = await axios.get(`${this.baseURL}/${scheduleId}/metrics`);
    return response.data;
  }

  async getCriticalPath(scheduleId: string): Promise<CriticalPathAnalysis> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockCriticalPath;
    }

    const response = await axios.get(`${this.baseURL}/${scheduleId}/critical-path`);
    return response.data;
  }

  async predictDelays(
    scheduleId: string,
    params: { horizon: number; confidence: number }
  ): Promise<DelayPrediction[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 700));
      return mockPredictions;
    }

    const response = await axios.post(
      `${this.baseURL}/${scheduleId}/predict`,
      params
    );
    return response.data;
  }

  async getRecommendations(scheduleId: string): Promise<Recommendation[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return mockRecommendations;
    }

    const response = await axios.get(`${this.baseURL}/${scheduleId}/recommendations`);
    return response.data;
  }

  async subscribeToUpdates(
    scheduleId: string,
    callback: (update: any) => void
  ): Promise<() => void> {
    // In production, this would use WebSocket
    if (USE_MOCK_DATA) {
      // Simulate real-time updates every 10 seconds
      const interval = setInterval(() => {
        callback({
          type: 'health_update',
          scheduleId,
          health: { ...mockHealth, overall: mockHealth.overall + (Math.random() - 0.5) * 5 },
          timestamp: new Date(),
        });
      }, 10000);

      return () => clearInterval(interval);
    }

    // WebSocket implementation would go here
    return () => {};
  }
}

export const healthService = new HealthService();
