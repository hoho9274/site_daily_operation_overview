import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  LinearProgress,
  Chip,
  Paper,
  Stack,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Schedule as ScheduleIcon,
  Assessment as AssessmentIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { AppDispatch, RootState } from '../../store';
import { fetchSchedules } from '../../store/slices/scheduleSlice';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { schedules, loading } = useSelector((state: RootState) => state.schedule);

  useEffect(() => {
    // Fetch schedules for project-1 (mock data)
    dispatch(fetchSchedules('project-1'));
  }, [dispatch]);

  const getHealthColor = (health: number) => {
    if (health >= 85) return 'success';
    if (health >= 70) return 'warning';
    return 'error';
  };

  const getHealthIcon = (health: number) => {
    if (health >= 85) return <CheckCircleIcon color="success" />;
    if (health >= 70) return <WarningIcon color="warning" />;
    return <WarningIcon color="error" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ON_TRACK': return 'success';
      case 'AT_RISK': return 'warning';
      case 'DELAYED': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Project Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Downtown Office Complex - Real-time Overview
      </Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Summary Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Active Schedules
                  </Typography>
                  <Typography variant="h4">
                    {schedules.length}
                  </Typography>
                </Box>
                <ScheduleIcon color="primary" sx={{ fontSize: 40 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Avg Health Score
                  </Typography>
                  <Typography variant="h4">
                    {schedules.length > 0 
                      ? Math.round(schedules.reduce((acc, s) => acc + s.health.overall, 0) / schedules.length)
                      : 0}%
                  </Typography>
                </Box>
                <AssessmentIcon color="primary" sx={{ fontSize: 40 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    At Risk Tasks
                  </Typography>
                  <Typography variant="h4">
                    {schedules.reduce((acc, s) => acc + s.health.schedule.delayedTasks, 0)}
                  </Typography>
                </Box>
                <WarningIcon color="warning" sx={{ fontSize: 40 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Completion
                  </Typography>
                  <Typography variant="h4">
                    {schedules.length > 0 
                      ? Math.round(
                          schedules.reduce((acc, s) => 
                            acc + (s.health.schedule.completedTasks / s.health.schedule.totalTasks * 100), 0
                          ) / schedules.length
                        )
                      : 0}%
                  </Typography>
                </Box>
                <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Schedule Cards */}
        {schedules.map((schedule) => (
          <Grid item xs={12} md={6} key={schedule.id}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" component="div">
                    {schedule.name}
                  </Typography>
                  {getHealthIcon(schedule.health.overall)}
                </Stack>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {schedule.description}
                </Typography>

                <Box sx={{ mt: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2">Overall Health</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {schedule.health.overall.toFixed(1)}%
                    </Typography>
                  </Stack>
                  <LinearProgress 
                    variant="determinate" 
                    value={schedule.health.overall} 
                    color={getHealthColor(schedule.health.overall) as any}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={6}>
                    <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        Schedule Performance
                      </Typography>
                      <Stack direction="row" justifyContent="center" alignItems="center" mt={0.5}>
                        {schedule.health.schedule.spi >= 1 ? (
                          <TrendingUpIcon color="success" fontSize="small" />
                        ) : (
                          <TrendingDownIcon color="error" fontSize="small" />
                        )}
                        <Typography variant="h6" ml={0.5}>
                          {schedule.health.schedule.spi.toFixed(2)}
                        </Typography>
                      </Stack>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        Cost Performance
                      </Typography>
                      <Stack direction="row" justifyContent="center" alignItems="center" mt={0.5}>
                        {schedule.health.cost.cpi >= 1 ? (
                          <TrendingUpIcon color="success" fontSize="small" />
                        ) : (
                          <TrendingDownIcon color="error" fontSize="small" />
                        )}
                        <Typography variant="h6" ml={0.5}>
                          {schedule.health.cost.cpi.toFixed(2)}
                        </Typography>
                      </Stack>
                    </Paper>
                  </Grid>
                </Grid>

                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Chip 
                    label={`${schedule.health.schedule.completedTasks}/${schedule.health.schedule.totalTasks} Tasks`}
                    size="small"
                    variant="outlined"
                  />
                  <Chip 
                    label={schedule.health.schedule.criticalPathStatus}
                    size="small"
                    color={getStatusColor(schedule.health.schedule.criticalPathStatus) as any}
                  />
                  {schedule.health.schedule.delayedTasks > 0 && (
                    <Chip 
                      label={`${schedule.health.schedule.delayedTasks} Delayed`}
                      size="small"
                      color="warning"
                    />
                  )}
                </Stack>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  onClick={() => navigate(`/schedule-health/${schedule.id}`)}
                  startIcon={<AssessmentIcon />}
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button 
                  variant="contained" 
                  startIcon={<AssessmentIcon />}
                  onClick={() => navigate('/schedule-health')}
                >
                  Schedule Health Analysis
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<WarningIcon />}
                  onClick={() => navigate('/critical-alerts')}
                >
                  View Critical Alerts
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<ScheduleIcon />}
                  onClick={() => navigate('/field-kanban')}
                >
                  Field Kanban Board
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
