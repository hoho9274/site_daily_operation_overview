import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Divider,
  Paper,
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Schedule, ScheduleHealth } from '../../types/schedule.types';

interface MetricsGridProps {
  schedule: Schedule;
  health: ScheduleHealth;
}

const MetricsGrid: React.FC<MetricsGridProps> = ({ health }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // const formatPercent = (value: number) => {
  //   return `${(value * 100).toFixed(1)}%`;
  // };

  // Resource utilization data for pie chart
  const resourceData = [
    { name: 'Utilized', value: health.resource.allocatedResources },
    { name: 'Available', value: health.resource.availableResources },
  ];

  const COLORS = ['#1976d2', '#e0e0e0'];

  // Risk distribution data
  const riskData = health.risks.map(risk => ({
    name: risk.name.substring(0, 20) + '...',
    probability: risk.probability === 'HIGH' ? 3 : risk.probability === 'MEDIUM' ? 2 : 1,
    impact: risk.impact === 'HIGH' ? 3 : risk.impact === 'MEDIUM' ? 2 : 1,
  }));

  return (
    <Grid container spacing={3}>
      {/* Performance Metrics */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Performance Indices
            </Typography>
            <Stack spacing={2}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Schedule Performance Index (SPI)
                    </Typography>
                    <Typography variant="h5">{health.schedule.spi.toFixed(3)}</Typography>
                    <Typography variant="caption" color={health.schedule.spi >= 1 ? 'success.main' : 'error.main'}>
                      {health.schedule.spi >= 1 ? '✓ On Schedule' : '⚠ Behind Schedule'}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Cost Performance Index (CPI)
                    </Typography>
                    <Typography variant="h5">{health.cost.cpi.toFixed(3)}</Typography>
                    <Typography variant="caption" color={health.cost.cpi >= 1 ? 'success.main' : 'error.main'}>
                      {health.cost.cpi >= 1 ? '✓ Under Budget' : '⚠ Over Budget'}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* Cost Analysis */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Cost Analysis
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Stack direction="row" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    Actual Cost
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {formatCurrency(health.cost.actualCost)}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    Planned Cost
                  </Typography>
                  <Typography variant="body2">
                    {formatCurrency(health.cost.plannedCost)}
                  </Typography>
                </Stack>
                <Divider sx={{ my: 1 }} />
                <Stack direction="row" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    Cost Variance (CV)
                  </Typography>
                  <Typography 
                    variant="body2" 
                    fontWeight="bold"
                    color={health.cost.cv >= 0 ? 'success.main' : 'error.main'}
                  >
                    {health.cost.cv >= 0 ? '+' : ''}{formatCurrency(health.cost.cv)}
                  </Typography>
                </Stack>
              </Box>
              <Divider />
              <Box>
                <Stack direction="row" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">
                    Estimate at Completion
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {formatCurrency(health.cost.eac)}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Estimate to Complete
                  </Typography>
                  <Typography variant="body2">
                    {formatCurrency(health.cost.etc)}
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* Resource Utilization */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Resource Utilization
            </Typography>
            <Box sx={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={resourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {resourceData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Stack spacing={1} mt={2}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Utilization Rate
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {health.resource.utilizationRate}%
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Allocated Resources
                </Typography>
                <Typography variant="body2">
                  {health.resource.allocatedResources}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Available Resources
                </Typography>
                <Typography variant="body2">
                  {health.resource.availableResources}
                </Typography>
              </Stack>
              {health.resource.overallocatedResources > 0 && (
                <Typography variant="body2" color="warning.main">
                  ⚠ {health.resource.overallocatedResources} resources overallocated
                </Typography>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* Risk Matrix */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Risk Analysis
            </Typography>
            {riskData.length > 0 ? (
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={riskData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="probability" fill="#ff9800" name="Probability" />
                    <Bar dataKey="impact" fill="#f44336" name="Impact" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No active risks identified
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default MetricsGrid;
