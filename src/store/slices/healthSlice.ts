import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  ScheduleHealth, 
  CriticalPathAnalysis, 
  DelayPrediction,
  Recommendation 
} from '../../types/schedule.types';
import { healthService } from '../../services/healthService';

interface HealthState {
  health: ScheduleHealth | null;
  criticalPath: CriticalPathAnalysis | null;
  predictions: DelayPrediction[];
  recommendations: Recommendation[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

const initialState: HealthState = {
  health: null,
  criticalPath: null,
  predictions: [],
  recommendations: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

export const calculateHealth = createAsyncThunk(
  'health/calculate',
  async (scheduleId: string) => {
    const response = await healthService.calculateHealth(scheduleId);
    return response;
  }
);

export const analyzeCriticalPath = createAsyncThunk(
  'health/analyzeCriticalPath',
  async (scheduleId: string) => {
    const response = await healthService.getCriticalPath(scheduleId);
    return response;
  }
);

export const predictDelays = createAsyncThunk(
  'health/predictDelays',
  async ({ scheduleId, params }: { 
    scheduleId: string; 
    params: { horizon: number; confidence: number } 
  }) => {
    const response = await healthService.predictDelays(scheduleId, params);
    return response;
  }
);

export const generateRecommendations = createAsyncThunk(
  'health/generateRecommendations',
  async (scheduleId: string) => {
    const response = await healthService.getRecommendations(scheduleId);
    return response;
  }
);

const healthSlice = createSlice({
  name: 'health',
  initialState,
  reducers: {
    updateHealth: (state, action: PayloadAction<ScheduleHealth>) => {
      state.health = action.payload;
      state.lastUpdated = new Date();
    },
    clearHealth: (state) => {
      state.health = null;
      state.criticalPath = null;
      state.predictions = [];
      state.recommendations = [];
      state.lastUpdated = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Calculate health
      .addCase(calculateHealth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(calculateHealth.fulfilled, (state, action) => {
        state.loading = false;
        state.health = action.payload;
        state.lastUpdated = new Date();
      })
      .addCase(calculateHealth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to calculate health';
      })
      // Analyze critical path
      .addCase(analyzeCriticalPath.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(analyzeCriticalPath.fulfilled, (state, action) => {
        state.loading = false;
        state.criticalPath = action.payload;
      })
      .addCase(analyzeCriticalPath.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to analyze critical path';
      })
      // Predict delays
      .addCase(predictDelays.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(predictDelays.fulfilled, (state, action) => {
        state.loading = false;
        state.predictions = action.payload;
      })
      .addCase(predictDelays.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to predict delays';
      })
      // Generate recommendations
      .addCase(generateRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendations = action.payload;
      })
      .addCase(generateRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to generate recommendations';
      });
  },
});

export const { updateHealth, clearHealth, clearError } = healthSlice.actions;
export default healthSlice.reducer;
