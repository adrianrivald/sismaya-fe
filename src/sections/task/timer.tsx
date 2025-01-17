import { Iconify } from 'src/components/iconify';
import { Stack, IconButton, Typography } from '@mui/material';
import { useTimer, useTimerStore, useTimerAction } from 'src/services/task/timer';

export function TimerActionButton({ taskId }: { taskId: number }) {
  const { state } = useTimerStore();
  const mutation = useTimerAction();

  const btnStart = (
    <IconButton
      aria-label="start"
      size="small"
      sx={{ bgcolor: 'success.main', color: 'white' }}
      onClick={() => mutation.mutate({ action: 'start', taskId })}
    >
      <Iconify icon="solar:play-bold" />
    </IconButton>
  );

  const btnPause = (
    <IconButton
      aria-label="pause"
      size="small"
      sx={{ bgcolor: 'warning.main', color: 'white' }}
      onClick={() => mutation.mutate({ action: 'pause', taskId })}
    >
      <Iconify icon="solar:pause-bold" />
    </IconButton>
  );

  const btnStop = (
    <IconButton
      aria-label="stop"
      size="small"
      sx={{ bgcolor: 'error.main', color: 'white' }}
      onClick={() => mutation.mutate({ action: 'stop', taskId })}
    >
      <Iconify icon="solar:stop-bold" />
    </IconButton>
  );

  if (state === 'idle' || state === 'stopped') {
    return btnStart;
  }

  if (state === 'running') {
    return (
      <Stack direction="row" spacing={1}>
        {btnPause}
        {btnStop}
      </Stack>
    );
  }

  if (state === 'paused') {
    return (
      <Stack direction="row" spacing={1}>
        {btnStart}
        {btnStop}
      </Stack>
    );
  }

  return null;
}

export function TimerCountdown({ variant }: { variant: 'large' | 'small' }) {
  const text = useTimer();

  if (variant === 'small') {
    return (
      <Typography
        color="rgba(33, 43, 54, 1)"
        sx={{ fontWeight: 500, fontSize: '20px', lineHeight: '28px' }}
      >
        {text}
      </Typography>
    );
  }

  if (variant === 'large') {
    return (
      <Typography color="rgba(33, 43, 54, 1)" variant="h4">
        {text}
      </Typography>
    );
  }

  return null;
}
