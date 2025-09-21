import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Stack,
  Chip,
  Button,
  Collapse,
  IconButton,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  LightbulbOutlined as LightbulbIcon,
  Speed as SpeedIcon,
  AttachMoney as AttachMoneyIcon,
  Group as GroupIcon,
  Timeline as TimelineIcon,
  Shield as ShieldIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { Recommendation, RecommendationType } from '../../types/schedule.types';

interface RecommendationsPanelProps {
  recommendations: Recommendation[];
}

const RecommendationsPanel: React.FC<RecommendationsPanelProps> = ({ recommendations }) => {
  const [expandedCards, setExpandedCards] = useState<string[]>([]);

  const handleExpandClick = (id: string) => {
    setExpandedCards(prev =>
      prev.includes(id)
        ? prev.filter(cardId => cardId !== id)
        : [...prev, id]
    );
  };

  const getTypeIcon = (type: RecommendationType) => {
    switch (type) {
      case RecommendationType.ADD_RESOURCES:
        return <GroupIcon />;
      case RecommendationType.RESEQUENCE_TASKS:
        return <TimelineIcon />;
      case RecommendationType.FAST_TRACK:
        return <SpeedIcon />;
      case RecommendationType.CRASH_SCHEDULE:
        return <SpeedIcon />;
      case RecommendationType.RISK_MITIGATION:
        return <ShieldIcon />;
      case RecommendationType.COST_OPTIMIZATION:
        return <AttachMoneyIcon />;
      default:
        return <LightbulbIcon />;
    }
  };

  const getTypeLabel = (type: RecommendationType) => {
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'HIGH':
        return 'error';
      case 'MEDIUM':
        return 'warning';
      case 'LOW':
        return 'success';
      default:
        return 'default';
    }
  };

  const highPriorityRecs = recommendations.filter(r => r.priority === 'HIGH');
  const mediumPriorityRecs = recommendations.filter(r => r.priority === 'MEDIUM');
  const lowPriorityRecs = recommendations.filter(r => r.priority === 'LOW');

  return (
    <Stack spacing={3}>
      {/* Summary */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recommendations Summary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="error.main">
                  {highPriorityRecs.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  High Priority Actions
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main">
                  {mediumPriorityRecs.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Medium Priority Actions
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="info.main">
                  {lowPriorityRecs.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Low Priority Actions
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Recommendations List */}
      {recommendations.map((recommendation) => (
        <Card key={recommendation.id}>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Stack direction="row" spacing={2} flex={1}>
                <Box>
                  {React.cloneElement(getTypeIcon(recommendation.type), {
                    fontSize: 'large',
                    color: 'primary',
                  })}
                </Box>
                <Box flex={1}>
                  <Typography variant="h6">{recommendation.title}</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {recommendation.description}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Chip
                      label={getTypeLabel(recommendation.type)}
                      size="small"
                      icon={getTypeIcon(recommendation.type)}
                      variant="outlined"
                    />
                    <Chip
                      label={`${recommendation.priority} Priority`}
                      size="small"
                      color={getPriorityColor(recommendation.priority) as any}
                    />
                    <Chip
                      label={`${recommendation.effort} Effort`}
                      size="small"
                      color={getEffortColor(recommendation.effort) as any}
                      variant="outlined"
                    />
                  </Stack>
                </Box>
              </Stack>
              <IconButton
                onClick={() => handleExpandClick(recommendation.id)}
                sx={{
                  transform: expandedCards.includes(recommendation.id) ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s',
                }}
              >
                <ExpandMoreIcon />
              </IconButton>
            </Stack>

            <Collapse in={expandedCards.includes(recommendation.id)} timeout="auto" unmountOnExit>
              <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      <CheckCircleIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                      Expected Impact
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="body2">{recommendation.impact}</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Implementation Details
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <CheckCircleIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Effort Required"
                          secondary={`${recommendation.effort} level of effort`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <CheckCircleIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Priority Level"
                          secondary={`${recommendation.priority} priority for implementation`}
                        />
                      </ListItem>
                      {recommendation.taskIds && recommendation.taskIds.length > 0 && (
                        <ListItem>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckCircleIcon fontSize="small" color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Affected Tasks"
                            secondary={`${recommendation.taskIds.length} tasks affected`}
                          />
                        </ListItem>
                      )}
                    </List>
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
          </CardContent>
          <CardActions>
            <Button size="small" startIcon={<CheckCircleIcon />}>
              Mark as Implemented
            </Button>
            <Button size="small">Dismiss</Button>
          </CardActions>
        </Card>
      ))}

      {recommendations.length === 0 && (
        <Card>
          <CardContent>
            <Typography variant="body1" color="text.secondary" textAlign="center">
              No recommendations available at this time.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
};

export default RecommendationsPanel;
