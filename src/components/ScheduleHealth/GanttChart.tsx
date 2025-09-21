import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Paper,
  LinearProgress,
} from '@mui/material';
import { Schedule, CriticalPathAnalysis, TaskStatus } from '../../types/schedule.types';

interface GanttChartProps {
  schedule: Schedule;
  criticalPath: CriticalPathAnalysis | null;
}

const GanttChart: React.FC<GanttChartProps> = ({ schedule, criticalPath }) => {
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return 'success';
      case TaskStatus.IN_PROGRESS:
        return 'primary';
      case TaskStatus.DELAYED:
        return 'error';
      case TaskStatus.ON_HOLD:
        return 'warning';
      default:
        return 'default';
    }
  };

  const calculateTaskPosition = (startDate: Date, endDate: Date) => {
    const projectStart = new Date(schedule.startDate);
    const projectEnd = new Date(schedule.endDate);
    const projectDuration = projectEnd.getTime() - projectStart.getTime();
    
    const taskStart = new Date(startDate);
    const taskEnd = new Date(endDate);
    
    const startOffset = ((taskStart.getTime() - projectStart.getTime()) / projectDuration) * 100;
    const width = ((taskEnd.getTime() - taskStart.getTime()) / projectDuration) * 100;
    
    return { left: `${startOffset}%`, width: `${width}%` };
  };

  const isTaskOnCriticalPath = (taskId: string) => {
    return criticalPath?.path.includes(taskId) || false;
  };

  return (
    <Card>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Project Gantt Chart</Typography>
          <Stack direction="row" spacing={1}>
            <Chip label="Critical Path" color="error" size="small" />
            <Chip label="Normal Task" size="small" />
          </Stack>
        </Stack>

        <Box sx={{ overflowX: 'auto' }}>
          <Box sx={{ minWidth: 800 }}>
            {/* Timeline Header */}
            <Paper variant="outlined" sx={{ p: 1, mb: 2, backgroundColor: '#f5f5f5' }}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="caption">
                  {new Date(schedule.startDate).toLocaleDateString()}
                </Typography>
                <Typography variant="caption">
                  {new Date(schedule.endDate).toLocaleDateString()}
                </Typography>
              </Stack>
            </Paper>

            {/* Tasks */}
            <Stack spacing={2}>
              {schedule.tasks.map((task) => {
                const position = calculateTaskPosition(task.startDate, task.endDate);
                const isCritical = isTaskOnCriticalPath(task.id);

                return (
                  <Box key={task.id}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box sx={{ width: 200, flexShrink: 0 }}>
                        <Typography variant="body2" noWrap>
                          {task.name}
                        </Typography>
                        <Stack direction="row" spacing={0.5} mt={0.5}>
                          <Chip
                            label={task.status}
                            size="small"
                            color={getStatusColor(task.status) as any}
                          />
                          {isCritical && (
                            <Chip label="Critical" size="small" color="error" />
                          )}
                        </Stack>
                      </Box>

                      <Box sx={{ flex: 1, position: 'relative', height: 50 }}>
                        <Box
                          sx={{
                            position: 'absolute',
                            ...position,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            backgroundColor: isCritical ? '#f44336' : '#1976d2',
                            borderRadius: 1,
                            p: 0.5,
                            minHeight: 30,
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <LinearProgress
                            variant="determinate"
                            value={task.progress}
                            sx={{
                              width: '100%',
                              height: '100%',
                              backgroundColor: 'rgba(255,255,255,0.3)',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: 'rgba(255,255,255,0.8)',
                              },
                            }}
                          />
                          <Typography
                            variant="caption"
                            sx={{
                              position: 'absolute',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              color: 'white',
                              fontWeight: 'bold',
                            }}
                          >
                            {task.progress}%
                          </Typography>
                        </Box>

                        {/* Dependencies */}
                        {task.dependencies.length > 0 && (
                          <Typography
                            variant="caption"
                            sx={{
                              position: 'absolute',
                              left: -10,
                              top: '50%',
                              transform: 'translateY(-50%)',
                            }}
                          >
                            ◀
                          </Typography>
                        )}
                      </Box>

                      <Box sx={{ width: 100, flexShrink: 0, textAlign: 'right' }}>
                        <Typography variant="caption" color="text.secondary">
                          {task.duration} days
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                );
              })}
            </Stack>

            {/* Milestones */}
            {schedule.milestones.length > 0 && (
              <>
                <Typography variant="subtitle2" sx={{ mt: 3, mb: 2 }}>
                  Milestones
                </Typography>
                <Stack spacing={1}>
                  {schedule.milestones.map((milestone) => {
                    const position = calculateTaskPosition(milestone.date, milestone.date);
                    return (
                      <Stack key={milestone.id} direction="row" alignItems="center" spacing={2}>
                        <Box sx={{ width: 200, flexShrink: 0 }}>
                          <Typography variant="body2">{milestone.name}</Typography>
                        </Box>
                        <Box sx={{ flex: 1, position: 'relative', height: 30 }}>
                          <Box
                            sx={{
                              position: 'absolute',
                              left: position.left,
                              top: '50%',
                              transform: 'translateY(-50%)',
                              width: 0,
                              height: 0,
                              borderLeft: '10px solid transparent',
                              borderRight: '10px solid transparent',
                              borderBottom: '20px solid #ff9800',
                            }}
                          />
                        </Box>
                        <Box sx={{ width: 100, flexShrink: 0 }}>
                          <Chip
                            label={milestone.status}
                            size="small"
                            color={
                              milestone.status === 'ACHIEVED'
                                ? 'success'
                                : milestone.status === 'AT_RISK'
                                ? 'warning'
                                : milestone.status === 'MISSED'
                                ? 'error'
                                : 'default'
                            }
                          />
                        </Box>
                      </Stack>
                    );
                  })}
                </Stack>
              </>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default GanttChart;
