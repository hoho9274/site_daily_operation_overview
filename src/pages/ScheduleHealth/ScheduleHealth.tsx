import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Tab,
  Tabs,
  Typography,
  Paper,
  CircularProgress,
  Stack,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { AppDispatch, RootState } from '../../store';
import { fetchSchedules, fetchScheduleById, fetchDeviations } from '../../store/slices/scheduleSlice';
import { calculateHealth, analyzeCriticalPath, predictDelays, generateRecommendations } from '../../store/slices/healthSlice';
import HealthOverview from '../../components/ScheduleHealth/HealthOverview';
import MetricsGrid from '../../components/ScheduleHealth/MetricsGrid';
import GanttChart from '../../components/ScheduleHealth/GanttChart';
import DeviationAnalysis from '../../components/ScheduleHealth/DeviationAnalysis';
import CriticalPath from '../../components/ScheduleHealth/CriticalPath';
import PredictiveAnalysis from '../../components/ScheduleHealth/PredictiveAnalysis';
import RecommendationsPanel from '../../components/ScheduleHealth/RecommendationsPanel';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`schedule-tabpanel-${index}`}
      aria-labelledby={`schedule-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const ScheduleHealth: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { scheduleId: urlScheduleId } = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>('');
  
  const { schedules, selectedSchedule, deviations, loading: scheduleLoading } = useSelector(
    (state: RootState) => state.schedule
  );
  const { health, criticalPath, predictions, recommendations, loading: healthLoading } = useSelector(
    (state: RootState) => state.health
  );

  useEffect(() => {
    // Fetch all schedules for the project
    dispatch(fetchSchedules('project-1'));
  }, [dispatch]);

  useEffect(() => {
    // Set selected schedule from URL or default to first
    if (urlScheduleId) {
      setSelectedScheduleId(urlScheduleId);
    } else if (schedules.length > 0 && !selectedScheduleId) {
      if (schedules[0]?.id) {
        setSelectedScheduleId(schedules[0].id);
      }
    }
  }, [urlScheduleId, schedules, selectedScheduleId]);

  useEffect(() => {
    // Fetch schedule details and health data when selection changes
    if (selectedScheduleId) {
      dispatch(fetchScheduleById(selectedScheduleId));
      dispatch(fetchDeviations(selectedScheduleId));
      dispatch(calculateHealth(selectedScheduleId));
      dispatch(analyzeCriticalPath(selectedScheduleId));
      dispatch(predictDelays({ scheduleId: selectedScheduleId, params: { horizon: 30, confidence: 0.95 } }));
      dispatch(generateRecommendations(selectedScheduleId));
    }
  }, [dispatch, selectedScheduleId]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleScheduleChange = (event: SelectChangeEvent) => {
    setSelectedScheduleId(event.target.value);
  };

  const handleRefresh = () => {
    if (selectedScheduleId) {
      dispatch(calculateHealth(selectedScheduleId));
      dispatch(fetchDeviations(selectedScheduleId));
    }
  };

  const isLoading = scheduleLoading || healthLoading;

  if (isLoading && !selectedSchedule) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Schedule Health Monitor
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Real-time schedule performance analysis and insights
          </Typography>
        </Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 250 }}>
            <InputLabel id="schedule-select-label">Select Schedule</InputLabel>
            <Select
              labelId="schedule-select-label"
              id="schedule-select"
              value={selectedScheduleId}
              label="Select Schedule"
              onChange={handleScheduleChange}
            >
              {schedules.map((schedule) => (
                <MenuItem key={schedule.id} value={schedule.id}>
                  {schedule.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={isLoading}
          >
            Refresh
          </Button>
          <Button variant="outlined" startIcon={<DownloadIcon />}>
            Export
          </Button>
          <Button variant="outlined" startIcon={<ShareIcon />}>
            Share
          </Button>
        </Stack>
      </Stack>

      {selectedSchedule && health && (
        <>
          <HealthOverview schedule={selectedSchedule} health={health} />

          <Paper sx={{ mt: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="schedule health tabs">
              <Tab label="Overview" />
              <Tab label="Gantt Chart" />
              <Tab label="Critical Path" />
              <Tab label="Deviations" />
              <Tab label="Predictions" />
              <Tab label="Recommendations" />
            </Tabs>
          </Paper>

          <TabPanel value={tabValue} index={0}>
            <MetricsGrid schedule={selectedSchedule} health={health} />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <GanttChart schedule={selectedSchedule} criticalPath={criticalPath} />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <CriticalPath schedule={selectedSchedule} criticalPath={criticalPath} />
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <DeviationAnalysis deviations={deviations} />
          </TabPanel>

          <TabPanel value={tabValue} index={4}>
            <PredictiveAnalysis predictions={predictions} />
          </TabPanel>

          <TabPanel value={tabValue} index={5}>
            <RecommendationsPanel recommendations={recommendations} />
          </TabPanel>
        </>
      )}
    </Box>
  );
};

export default ScheduleHealth;
