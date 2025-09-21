import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  Alert,
} from '@mui/material';
import { Deviation, DeviationType } from '../../types/schedule.types';

interface DeviationAnalysisProps {
  deviations: Deviation[];
}

const DeviationAnalysis: React.FC<DeviationAnalysisProps> = ({ deviations }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'error';
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

  const getTypeLabel = (type: DeviationType) => {
    switch (type) {
      case DeviationType.SCHEDULE_DELAY:
        return 'Schedule Delay';
      case DeviationType.COST_OVERRUN:
        return 'Cost Overrun';
      case DeviationType.RESOURCE_CONFLICT:
        return 'Resource Conflict';
      case DeviationType.SCOPE_CHANGE:
        return 'Scope Change';
      case DeviationType.QUALITY_ISSUE:
        return 'Quality Issue';
      default:
        return type;
    }
  };

  const formatCurrency = (value: number | undefined) => {
    if (!value) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const activeDeviations = deviations.filter(d => !d.resolved);
  const resolvedDeviations = deviations.filter(d => d.resolved);

  return (
    <Stack spacing={3}>
      {activeDeviations.length > 0 && (
        <Alert severity="warning">
          There are {activeDeviations.length} active deviations requiring attention.
        </Alert>
      )}

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Active Deviations
          </Typography>
          {activeDeviations.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Severity</TableCell>
                    <TableCell>Days Delayed</TableCell>
                    <TableCell>Cost Impact</TableCell>
                    <TableCell>Detected</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activeDeviations.map((deviation) => (
                    <TableRow key={deviation.id}>
                      <TableCell>
                        <Chip
                          label={getTypeLabel(deviation.type)}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{deviation.description}</TableCell>
                      <TableCell>
                        <Chip
                          label={deviation.severity}
                          size="small"
                          color={getSeverityColor(deviation.severity) as any}
                        />
                      </TableCell>
                      <TableCell>{deviation.daysDelayed || '-'}</TableCell>
                      <TableCell>{formatCurrency(deviation.costImpact)}</TableCell>
                      <TableCell>
                        {new Date(deviation.detectedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Chip label="Active" size="small" color="warning" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No active deviations found.
            </Typography>
          )}
        </CardContent>
      </Card>

      {resolvedDeviations.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Resolved Deviations
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Severity</TableCell>
                    <TableCell>Resolution</TableCell>
                    <TableCell>Detected</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {resolvedDeviations.map((deviation) => (
                    <TableRow key={deviation.id}>
                      <TableCell>
                        <Chip
                          label={getTypeLabel(deviation.type)}
                          size="small"
                          color="default"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{deviation.description}</TableCell>
                      <TableCell>
                        <Chip
                          label={deviation.severity}
                          size="small"
                          color="default"
                        />
                      </TableCell>
                      <TableCell>{deviation.resolution || '-'}</TableCell>
                      <TableCell>
                        {new Date(deviation.detectedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Chip label="Resolved" size="small" color="success" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
};

export default DeviationAnalysis;
