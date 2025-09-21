import { configureStore } from '@reduxjs/toolkit';
import scheduleReducer from './slices/scheduleSlice';
import healthReducer from './slices/healthSlice';
import alertReducer from './slices/alertSlice';

export const store = configureStore({
  reducer: {
    schedule: scheduleReducer,
    health: healthReducer,
    alerts: alertReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['schedule/updateTask'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['schedule.lastUpdated', 'health.lastCalculated'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
