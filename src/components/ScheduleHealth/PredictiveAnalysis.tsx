import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Chip,
  Paper,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Build as BuildIcon,
} from '@mui/icons-material';
import { DelayPrediction } from '../../types/schedule.types';

interface PredictiveAnalysisProps {
  predictions: DelayPrediction[];
}

const PredictiveAnalysis: React.FC<PredictiveAnalysisProps> = ({ predictions }) => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'HIGH':
        return 'error';
      case 'MEDIUM':
        return 'warning';
      case 'LOW':
        return 'info';
      default:
        return 'default';
    }
  };

  const getProbabilityLevel = (probability: number) => {
    if (probability >= 0.7) return { label: 'High Risk', color: 'error' };
    if (probability >= 0.4) return { label: 'Medium Risk', color: 'warning' };
    return { label: 'Low Risk', color: 'success' };
  };

  const highRiskPredictions = predictions.filter(p => p.probability >= 0.7);
  const mediumRiskPredictions = predictions.filter(p => p.probability >= 0.4 && p.probability < 0.7);
  const lowRiskPredictions = predictions.filter(p => p.probability < 0.4);

  return (
    <Stack spacing={3}>
      {/* Summary Alert */}
      {highRiskPredictions.length > 0 && (
        <Alert severity="error" icon={<WarningIcon />}>
          <Typography variant="subtitle2">
            {highRiskPredictions.length} high-risk delays predicted
          </Typography>
          <Typography variant="body2">
            Immediate action recommended to prevent potential {highRiskPredictions.reduce((sum, p) => sum + p.expectedDelay, 0)} days of total delay.
          </Typography>
        </Alert>
      )}

      {/* Risk Summary */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Delay Risk Summary
          </Typography>
          <Stack direction="row" spacing={2}>
            <Paper
              variant="outlined"
              sx={{ p: 2, flex: 1, borderColor: 'error.main', backgroundColor: 'error.lighter' }}
            >
              <Stack alignItems="center">
                <Typography variant="h4" color="error.main">
                  {highRiskPredictions.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  High Risk Tasks
                </Typography>
              </Stack>
            </Paper>
            <Paper
              variant="outlined"
              sx={{ p: 2, flex: 1, borderColor: 'warning.main', backgroundColor: 'warning.lighter' }}
            >
              <Stack alignItems="center">
                <Typography variant="h4" color="warning.main">
                  {mediumRiskPredictions.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Medium Risk Tasks
                </Typography>
              </Stack>
            </Paper>
            <Paper
              variant="outlined"
              sx={{ p: 2, flex: 1, borderColor: 'success.main', backgroundColor: 'success.lighter' }}
            >
              <Stack alignItems="center">
                <Typography variant="h4" color="success.main">
                  {lowRiskPredictions.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Low Risk Tasks
                </Typography>
              </Stack>
            </Paper>
          </Stack>
        </CardContent>
      </Card>

      {/* Detailed Predictions */}
      {predictions.map((prediction) => {
        const probabilityInfo = getProbabilityLevel(prediction.probability);

        return (
          <Card key={prediction.taskId}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Box>
                  <Typography variant="h6">{prediction.taskName}</Typography>
                  <Stack direction="row" spacing={1} mt={1}>
                    <Chip
                      label={probabilityInfo.label}
                      size="small"
                      color={probabilityInfo.color as any}
                    />
                    <Chip
                      label={`${prediction.expectedDelay} days delay`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={`${prediction.impact} Impact`}
                      size="small"
                      color={getImpactColor(prediction.impact) as any}
                    />
                  </Stack>
                </Box>
                <Box sx={{ minWidth: 200 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Delay Probability
                  </Typography>
                  <Stack spacing={1}>
                    <Typography variant="h5">
                      {(prediction.probability * 100).toFixed(0)}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={prediction.probability * 100}
                      color={probabilityInfo.color as any}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Stack>
                </Box>
              </Stack>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                {/* Causes */}
                <Box flex={1}>
                  <Typography variant="subtitle2" gutterBottom>
                    <WarningIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                    Risk Causes
                  </Typography>
                  <List dense>
                    {prediction.causes.map((cause, index) => (
                      <ListItem key={index}>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <TrendingUpIcon fontSize="small" color="error" />
                        </ListItemIcon>
                        <ListItemText primary={cause} />
                      </ListItem>
                    ))}
                  </List>
                </Box>

                {/* Preventive Measures */}
                <Box flex={1}>
                  <Typography variant="subtitle2" gutterBottom>
                    <BuildIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                    Preventive Measures
                  </Typography>
                  <List dense>
                    {prediction.preventiveMeasures.map((measure, index) => (
                      <ListItem key={index}>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <CheckCircleIcon fontSize="small" color="success" />
                        </ListItemIcon>
                        <ListItemText primary={measure} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        );
      })}

      {predictions.length === 0 && (
        <Card>
          <CardContent>
            <Typography variant="body1" color="text.secondary" textAlign="center">
              No delay predictions available at this time.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
};

export default PredictiveAnalysis;
