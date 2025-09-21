import scheduleReducer, {
  selectSchedule,
  clearError,
  updateScheduleHealth,
  fetchSchedules,
  fetchScheduleById,
  updateTask,
  fetchDeviations,
} from '../scheduleSlice';
import { mockSchedules, mockDeviations } from '../../../mocks/scheduleMockData';

describe('scheduleSlice', () => {
  const initialState = {
    schedules: [],
    selectedSchedule: null,
    deviations: [],
    loading: false,
    error: null,
  };

  it('should handle initial state', () => {
    expect(scheduleReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle selectSchedule', () => {
    const previousState = {
      ...initialState,
      schedules: mockSchedules,
    };

    const actual = scheduleReducer(previousState, selectSchedule(mockSchedules[0].id));
    expect(actual.selectedSchedule).toEqual(mockSchedules[0]);
  });

  it('should handle clearError', () => {
    const previousState = {
      ...initialState,
      error: 'Some error',
    };

    const actual = scheduleReducer(previousState, clearError());
    expect(actual.error).toBeNull();
  });

  it('should handle updateScheduleHealth', () => {
    const newHealth = { overall: 85 };
    const previousState = {
      ...initialState,
      schedules: mockSchedules,
      selectedSchedule: mockSchedules[0],
    };

    const actual = scheduleReducer(
      previousState,
      updateScheduleHealth({
        scheduleId: mockSchedules[0].id,
        health: newHealth,
      })
    );

    expect(actual.schedules[0].health).toEqual(newHealth);
    expect(actual.selectedSchedule?.health).toEqual(newHealth);
  });

  describe('async actions', () => {
    it('should handle fetchSchedules.pending', () => {
      const actual = scheduleReducer(initialState, fetchSchedules.pending('', 'project-1'));
      expect(actual.loading).toBe(true);
      expect(actual.error).toBeNull();
    });

    it('should handle fetchSchedules.fulfilled', () => {
      const actual = scheduleReducer(
        initialState,
        fetchSchedules.fulfilled(mockSchedules, '', 'project-1')
      );
      expect(actual.loading).toBe(false);
      expect(actual.schedules).toEqual(mockSchedules);
    });

    it('should handle fetchSchedules.rejected', () => {
      const error = new Error('Failed to fetch');
      const actual = scheduleReducer(
        initialState,
        fetchSchedules.rejected(error, '', 'project-1')
      );
      expect(actual.loading).toBe(false);
      expect(actual.error).toBe('Failed to fetch');
    });

    it('should handle fetchScheduleById.fulfilled', () => {
      const actual = scheduleReducer(
        initialState,
        fetchScheduleById.fulfilled(mockSchedules[0], '', mockSchedules[0].id)
      );
      expect(actual.selectedSchedule).toEqual(mockSchedules[0]);
      expect(actual.schedules).toContainEqual(mockSchedules[0]);
    });

    it('should handle updateTask.fulfilled', () => {
      const updatedTask = {
        ...mockSchedules[0].tasks[0],
        progress: 100,
      };

      const previousState = {
        ...initialState,
        schedules: mockSchedules,
        selectedSchedule: mockSchedules[0],
      };

      const actual = scheduleReducer(
        previousState,
        updateTask.fulfilled(
          {
            scheduleId: mockSchedules[0].id,
            task: updatedTask,
          },
          '',
          {
            scheduleId: mockSchedules[0].id,
            taskId: updatedTask.id,
            updates: { progress: 100 },
          }
        )
      );

      expect(actual.schedules[0].tasks[0].progress).toBe(100);
      expect(actual.selectedSchedule?.tasks[0].progress).toBe(100);
    });

    it('should handle fetchDeviations.fulfilled', () => {
      const actual = scheduleReducer(
        initialState,
        fetchDeviations.fulfilled(mockDeviations, '', 'schedule-1')
      );
      expect(actual.deviations).toEqual(mockDeviations);
    });
  });

  it('should update schedule in both schedules array and selectedSchedule', () => {
    const newHealth = { overall: 95 };
    const previousState = {
      ...initialState,
      schedules: mockSchedules,
      selectedSchedule: mockSchedules[0],
    };

    const actual = scheduleReducer(
      previousState,
      updateScheduleHealth({
        scheduleId: mockSchedules[0].id,
        health: newHealth,
      })
    );

    // Should update in schedules array
    const updatedSchedule = actual.schedules.find(s => s.id === mockSchedules[0].id);
    expect(updatedSchedule?.health).toEqual(newHealth);

    // Should update selectedSchedule if it matches
    expect(actual.selectedSchedule?.health).toEqual(newHealth);
  });

  it('should not update selectedSchedule if it does not match the updated schedule', () => {
    const newHealth = { overall: 95 };
    const previousState = {
      ...initialState,
      schedules: mockSchedules,
      selectedSchedule: mockSchedules[1], // Different schedule selected
    };

    const actual = scheduleReducer(
      previousState,
      updateScheduleHealth({
        scheduleId: mockSchedules[0].id,
        health: newHealth,
      })
    );

    // Should not update selectedSchedule
    expect(actual.selectedSchedule?.health).not.toEqual(newHealth);
    expect(actual.selectedSchedule).toEqual(mockSchedules[1]);
  });
});
