import { Box, Stack, Typography, Portal } from '@mui/material';
import { useTimerStore, useCheckTimer } from 'src/services/task/timer';
import { TimerActionButton, TimerCountdown } from './timer';

export function TimerPip() {
  useCheckTimer();
  const store = useTimerStore();

  if (store.state === 'idle') {
    return null;
  }

  return (
    <Portal container={document.body}>
      <Box
        bgcolor="white"
        position="absolute"
        bottom="1rem"
        right="1rem"
        border="1px solid rgba(145, 158, 171, 0.16)"
        borderRadius={2}
        px={1.5}
        py={2}
        boxShadow="-20px 20px 40px -4px rgba(145, 158, 171, 0.24)"
      >
        <Typography
          color="rgba(99, 115, 129, 1)"
          sx={{ fontWeight: 500, fontSize: '14px', lineHeight: '20px' }}
        >
          {store.request}
        </Typography>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            flexGrow={1}
            color="rgba(99, 115, 129, 1)"
            sx={{ fontWeight: 700, fontSize: '14px', lineHeight: '20px' }}
          >
            {store.activity}
          </Typography>

          <Stack spacing={1.5} direction="row" alignItems="center">
            <TimerCountdown variant="small" />
            <TimerActionButton taskId={store.taskId} />
          </Stack>
        </Box>
      </Box>
    </Portal>
  );
}
