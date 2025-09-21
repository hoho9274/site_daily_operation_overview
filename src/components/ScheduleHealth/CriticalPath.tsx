import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Chip,
  Paper,
  Alert,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import {
  Flag as FlagIcon,
  Engineering as EngineeringIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { Schedule, CriticalPathAnalysis } from '../../types/schedule.types';

interface CriticalPathProps {
  schedule: Schedule;
  criticalPath: CriticalPathAnalysis | null;
}

const CriticalPath: React.FC<CriticalPathProps> = ({ schedule, criticalPath }) => {
  if (!criticalPath) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6">Critical Path Analysis</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Loading critical path analysis...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const getCriticalTask = (taskId: string) => {
    return schedule.tasks.find(t => t.id === taskId);
  };

  const formatDuration = (days: number) => {
    if (days === 1) return '1 day';
    return `${days} days`;
  };

  return (
    <Stack spacing={3}>
      {/* Summary */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Critical Path Summary
          </Typography>
          <Stack direction="row" spacing={3}>
            <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Total Duration
              </Typography>
              <Typography variant="h5">{formatDuration(criticalPath.totalDuration)}</Typography>
            </Paper>
            <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Critical Tasks
              </Typography>
              <Typography variant="h5">{criticalPath.criticalTasks.length} tasks</Typography>
            </Paper>
            <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Bottlenecks
              </Typography>
              <Typography variant="h5">{criticalPath.bottlenecks.length} identified</Typography>
            </Paper>
          </Stack>
        </CardContent>
      </Card>

      {/* Critical Path Timeline */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Critical Path Timeline
          </Typography>
          <Timeline position="alternate">
            {criticalPath.path.map((taskId, index) => {
              const task = getCriticalTask(taskId);
              if (!task) return null;

              const isBottleneck = criticalPath.bottlenecks.includes(taskId);
              const isFirst = index === 0;
              const isLast = index === criticalPath.path.length - 1;

              return (
                <TimelineItem key={taskId}>
                  <TimelineSeparator>
                    <TimelineDot 
                      color={isBottleneck ? 'error' : 'primary'} 
                      variant={isFirst || isLast ? 'filled' : 'outlined'}
                    >
                      {isFirst && <FlagIcon />}
                      {isLast && <FlagIcon />}
                      {isBottleneck && !isFirst && !isLast && <WarningIcon />}
                      {!isBottleneck && !isFirst && !isLast && <EngineeringIcon />}
                    </TimelineDot>
                    {index < criticalPath.path.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>
                    <Paper elevation={3} sx={{ p: 2 }}>
                      <Stack spacing={1}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {task.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {task.description}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          <Chip
                            label={`${task.duration} days`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                          <Chip
                            label={`${task.progress}% complete`}
                            size="small"
                            color={task.progress === 100 ? 'success' : 'default'}
                          />
                          {isBottleneck && (
                            <Chip
                              label="Bottleneck"
                              size="small"
                              color="error"
                              icon={<WarningIcon />}
                            />
                          )}
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                          Float: {criticalPath.float[taskId] || 0} days
                        </Typography>
                      </Stack>
                    </Paper>
                  </TimelineContent>
                </TimelineItem>
              );
            })}
          </Timeline>
        </CardContent>
      </Card>

      {/* Bottleneck Analysis */}
      {criticalPath.bottlenecks.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Bottleneck Analysis
            </Typography>
            <Alert severity="warning" sx={{ mb: 2 }}>
              The following tasks are identified as bottlenecks and require immediate attention.
            </Alert>
            <Stack spacing={2}>
              {criticalPath.bottlenecks.map(taskId => {
                const task = getCriticalTask(taskId);
                if (!task) return null;

                return (
                  <Paper key={taskId} variant="outlined" sx={{ p: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {task.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Zero float - Any delay will impact project completion
                        </Typography>
                      </Box>
                      <Stack direction="column" alignItems="flex-end" spacing={1}>
                        <Chip
                          label={task.status}
                          size="small"
                          color={task.status === 'DELAYED' ? 'error' : 'default'}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {task.resources.length} resources allocated
                        </Typography>
                      </Stack>
                    </Stack>
                  </Paper>
                );
              })}
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Float Analysis */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Float Analysis
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Tasks not on the critical path with available float time
          </Typography>
          <Stack spacing={1} sx={{ mt: 2 }}>
            {Object.entries(criticalPath.float)
              .filter(([, float]) => float > 0)
              .sort(([, a], [, b]) => b - a)
              .map(([taskId, float]) => {
                const task = schedule.tasks.find(t => t.id === taskId);
                if (!task) return null;

                return (
                  <Paper key={taskId} variant="outlined" sx={{ p: 1.5 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2">{task.name}</Typography>
                      <Chip
                        label={`${float} days float`}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    </Stack>
                  </Paper>
                );
              })}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default CriticalPath;
