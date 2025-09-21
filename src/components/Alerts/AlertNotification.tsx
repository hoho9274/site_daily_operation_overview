import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Snackbar, Alert, Stack } from '@mui/material';
import { RootState } from '../../store';
import { removeAlert } from '../../store/slices/alertSlice';

const AlertNotification: React.FC = () => {
  const dispatch = useDispatch();
  const alerts = useSelector((state: RootState) => state.alerts.alerts);

  const handleClose = (alertId: string) => {
    dispatch(removeAlert(alertId));
  };

  useEffect(() => {
    // Auto-remove alerts after duration
    const timers: NodeJS.Timeout[] = [];
    
    alerts.forEach((alert) => {
      if (alert.duration) {
        const timer = setTimeout(() => {
          dispatch(removeAlert(alert.id));
        }, alert.duration);
        timers.push(timer);
      }
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [alerts, dispatch]);

  return (
    <Stack spacing={1} sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999 }}>
      {alerts.map((alert) => (
        <Snackbar
          key={alert.id}
          open={true}
          autoHideDuration={alert.duration || 6000}
          onClose={() => handleClose(alert.id)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => handleClose(alert.id)}
            severity={alert.type}
            sx={{ width: '100%', minWidth: 300 }}
          >
            <strong>{alert.title}</strong>
            {alert.message && <div>{alert.message}</div>}
          </Alert>
        </Snackbar>
      ))}
    </Stack>
  );
};

export default AlertNotification;
