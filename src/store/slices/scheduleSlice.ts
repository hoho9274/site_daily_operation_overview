import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Schedule, Task, Deviation } from '../../types/schedule.types';
import { scheduleService } from '../../services/scheduleService';

interface ScheduleState {
  schedules: Schedule[];
  selectedSchedule: Schedule | null;
  deviations: Deviation[];
  loading: boolean;
  error: string | null;
}

const initialState: ScheduleState = {
  schedules: [],
  selectedSchedule: null,
  deviations: [],
  loading: false,
  error: null,
};

export const fetchSchedules = createAsyncThunk(
  'schedule/fetchSchedules',
  async (projectId: string) => {
    const response = await scheduleService.getSchedulesByProject(projectId);
    return response;
  }
);

export const fetchScheduleById = createAsyncThunk(
  'schedule/fetchScheduleById',
  async (scheduleId: string) => {
    const response = await scheduleService.getScheduleById(scheduleId);
    return response;
  }
);

export const updateTask = createAsyncThunk(
  'schedule/updateTask',
  async ({ scheduleId, taskId, updates }: { 
    scheduleId: string; 
    taskId: string; 
    updates: Partial<Task> 
  }) => {
    const response = await scheduleService.updateTask(scheduleId, taskId, updates);
    return response;
  }
);

export const fetchDeviations = createAsyncThunk(
  'schedule/fetchDeviations',
  async (scheduleId: string) => {
    const response = await scheduleService.getDeviations(scheduleId);
    return response;
  }
);

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    selectSchedule: (state, action: PayloadAction<string>) => {
      state.selectedSchedule = state.schedules.find(s => s.id === action.payload) || null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateScheduleHealth: (state, action: PayloadAction<{ scheduleId: string; health: any }>) => {
      const schedule = state.schedules.find(s => s.id === action.payload.scheduleId);
      if (schedule) {
        schedule.health = action.payload.health;
      }
      if (state.selectedSchedule?.id === action.payload.scheduleId) {
        state.selectedSchedule.health = action.payload.health;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch schedules
      .addCase(fetchSchedules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSchedules.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules = action.payload;
      })
      .addCase(fetchSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch schedules';
      })
      // Fetch schedule by ID
      .addCase(fetchScheduleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchScheduleById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSchedule = action.payload;
        const index = state.schedules.findIndex(s => s.id === action.payload.id);
        if (index >= 0) {
          state.schedules[index] = action.payload;
        } else {
          state.schedules.push(action.payload);
        }
      })
      .addCase(fetchScheduleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch schedule';
      })
      // Update task
      .addCase(updateTask.fulfilled, (state, action) => {
        const { scheduleId, task } = action.payload;
        const schedule = state.schedules.find(s => s.id === scheduleId);
        if (schedule) {
          const taskIndex = schedule.tasks.findIndex(t => t.id === task.id);
          if (taskIndex >= 0) {
            schedule.tasks[taskIndex] = task;
          }
        }
        if (state.selectedSchedule?.id === scheduleId) {
          const taskIndex = state.selectedSchedule.tasks.findIndex(t => t.id === task.id);
          if (taskIndex >= 0) {
            state.selectedSchedule.tasks[taskIndex] = task;
          }
        }
      })
      // Fetch deviations
      .addCase(fetchDeviations.fulfilled, (state, action) => {
        state.deviations = action.payload;
      });
  },
});

export const { selectSchedule, clearError, updateScheduleHealth } = scheduleSlice.actions;
export default scheduleSlice.reducer;
