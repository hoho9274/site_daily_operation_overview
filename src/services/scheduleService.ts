import axios from 'axios';
import { Schedule, Task, Deviation } from '../types/schedule.types';
import { mockSchedules, mockDeviations } from '../mocks/scheduleMockData';

const API_BASE_URL = process.env['REACT_APP_API_URL'] || 'http://localhost:3001/api';
const USE_MOCK_DATA = process.env['REACT_APP_USE_MOCK_DATA'] !== 'false';

class ScheduleService {
  private baseURL = `${API_BASE_URL}/schedules`;

  async getSchedulesByProject(projectId: string): Promise<Schedule[]> {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockSchedules.filter(s => s.projectId === projectId);
    }

    const response = await axios.get(`${this.baseURL}`, {
      params: { projectId }
    });
    return response.data;
  }

  async getScheduleById(scheduleId: string): Promise<Schedule> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const schedule = mockSchedules.find(s => s.id === scheduleId);
      if (!schedule) {
        throw new Error('Schedule not found');
      }
      return schedule;
    }

    const response = await axios.get(`${this.baseURL}/${scheduleId}`);
    return response.data;
  }

  async updateTask(
    scheduleId: string, 
    taskId: string, 
    updates: Partial<Task>
  ): Promise<{ scheduleId: string; task: Task }> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const schedule = mockSchedules.find(s => s.id === scheduleId);
      if (!schedule) {
        throw new Error('Schedule not found');
      }
      const task = schedule.tasks.find(t => t.id === taskId);
      if (!task) {
        throw new Error('Task not found');
      }
      Object.assign(task, updates);
      return { scheduleId, task };
    }

    const response = await axios.patch(
      `${this.baseURL}/${scheduleId}/tasks/${taskId}`,
      updates
    );
    return response.data;
  }

  async getDeviations(scheduleId: string): Promise<Deviation[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return mockDeviations.filter(d => d.scheduleId === scheduleId);
    }

    const response = await axios.get(`${this.baseURL}/${scheduleId}/deviations`);
    return response.data;
  }

  async createSchedule(schedule: Partial<Schedule>): Promise<Schedule> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newSchedule: Schedule = {
        ...schedule,
        id: `schedule-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Schedule;
      mockSchedules.push(newSchedule);
      return newSchedule;
    }

    const response = await axios.post(this.baseURL, schedule);
    return response.data;
  }

  async deleteSchedule(scheduleId: string): Promise<void> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const index = mockSchedules.findIndex(s => s.id === scheduleId);
      if (index >= 0) {
        mockSchedules.splice(index, 1);
      }
      return;
    }

    await axios.delete(`${this.baseURL}/${scheduleId}`);
  }
}

export const scheduleService = new ScheduleService();
