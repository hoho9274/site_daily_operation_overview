import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  LinearProgress,
  Chip,
  Stack,
  Avatar,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { Schedule, ScheduleHealth } from '../../types/schedule.types';

interface HealthOverviewProps {
  schedule: Schedule;
  health: ScheduleHealth;
}

const HealthOverview: React.FC<HealthOverviewProps> = ({ health }) => {
  const getHealthColor = (score: number): string => {
    if (score >= 85) return '#4caf50';
    if (score >= 70) return '#ff9800';
    return '#f44336';
  };

  const getHealthIcon = (score: number) => {
    if (score >= 85) return <CheckCircleIcon />;
    if (score >= 70) return <WarningIcon />;
    return <ErrorIcon />;
  };

  const getHealthLabel = (score: number) => {
    if (score >= 85) return 'Healthy';
    if (score >= 70) return 'At Risk';
    return 'Critical';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Grid container spacing={3}>
      {/* Overall Health Card */}
      <Grid item xs={12} md={3}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6" color="text.secondary">
                Overall Health
              </Typography>
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: `conic-gradient(${getHealthColor(health.overall)} ${health.overall * 3.6}deg, #e0e0e0 0deg)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      backgroundColor: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                    }}
                  >
                    <Typography variant="h4" fontWeight="bold">
                      {Math.round(health.overall)}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {getHealthLabel(health.overall)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Stack direction="row" spacing={1}>
                <Avatar sx={{ bgcolor: getHealthColor(health.overall), width: 24, height: 24 }}>
                  {React.cloneElement(getHealthIcon(health.overall), { sx: { fontSize: 16 } })}
                </Avatar>
                <Typography variant="body2">
                  Last updated: {new Date(health.lastCalculated).toLocaleString()}
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* Schedule Performance */}
      <Grid item xs={12} md={3}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Schedule Performance
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">SPI</Typography>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    {health.schedule.spi >= 1 ? (
                      <TrendingUpIcon color="success" fontSize="small" />
                    ) : (
                      <TrendingDownIcon color="error" fontSize="small" />
                    )}
                    <Typography variant="h6">{health.schedule.spi.toFixed(2)}</Typography>
                  </Stack>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(health.schedule.spi * 100, 100)}
                  color={health.schedule.spi >= 1 ? 'success' : 'error'}
                  sx={{ mt: 1, height: 6, borderRadius: 3 }}
                />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Schedule Variance
                </Typography>
                <Typography variant="h6">
                  {health.schedule.sv > 0 ? '+' : ''}{formatCurrency(health.schedule.sv)}
                </Typography>
              </Box>
              <Chip
                label={health.schedule.criticalPathStatus}
                color={
                  health.schedule.criticalPathStatus === 'ON_TRACK'
                    ? 'success'
                    : health.schedule.criticalPathStatus === 'AT_RISK'
                    ? 'warning'
                    : 'error'
                }
                size="small"
              />
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* Cost Performance */}
      <Grid item xs={12} md={3}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Cost Performance
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">CPI</Typography>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    {health.cost.cpi >= 1 ? (
                      <TrendingUpIcon color="success" fontSize="small" />
                    ) : (
                      <TrendingDownIcon color="error" fontSize="small" />
                    )}
                    <Typography variant="h6">{health.cost.cpi.toFixed(2)}</Typography>
                  </Stack>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(health.cost.cpi * 100, 100)}
                  color={health.cost.cpi >= 1 ? 'success' : 'error'}
                  sx={{ mt: 1, height: 6, borderRadius: 3 }}
                />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Cost Variance
                </Typography>
                <Typography variant="h6">
                  {health.cost.cv > 0 ? '+' : ''}{formatCurrency(health.cost.cv)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  EAC / Budget
                </Typography>
                <Typography variant="body2">
                  {formatCurrency(health.cost.eac)} / {formatCurrency(health.cost.plannedCost)}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* Task Progress */}
      <Grid item xs={12} md={3}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Task Progress
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">Completion</Typography>
                  <Typography variant="h6">
                    {Math.round((health.schedule.completedTasks / health.schedule.totalTasks) * 100)}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={(health.schedule.completedTasks / health.schedule.totalTasks) * 100}
                  color="primary"
                  sx={{ mt: 1, height: 6, borderRadius: 3 }}
                />
              </Box>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Completed
                </Typography>
                <Typography variant="body2">
                  {health.schedule.completedTasks} / {health.schedule.totalTasks}
                </Typography>
              </Stack>
              {health.schedule.delayedTasks > 0 && (
                <Chip
                  label={`${health.schedule.delayedTasks} tasks delayed`}
                  color="warning"
                  size="small"
                  icon={<WarningIcon />}
                />
              )}
              <Typography variant="caption" color="text.secondary">
                Forecast: {new Date(health.schedule.forecastCompletionDate).toLocaleDateString()}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default HealthOverview;
