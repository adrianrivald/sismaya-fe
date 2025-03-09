import { Iconify } from 'src/components/iconify';
import * as Dialog from 'src/components/disclosure/modal';
import { Stack, IconButton, Typography } from '@mui/material';
import {
  useTimer,
  useTimerStore,
  useTimerAction,
  type TimerState,
  useTimerActionStore,
} from 'src/services/task/timer';

type TimerActionButtonProps = {
  activity?: string;
  request?: string;
  taskId: number;
  lastTimer?: number;
  state?: TimerState;
  name?: string;
  setErrorTask?: (args: boolean) => void;
  errorTask?: boolean;
};

export function TimerActionButton({
  taskId,
  activity,
  request,
  lastTimer = 0,
  state: defaultState = '',
  name,
  setErrorTask,
  errorTask,
}: TimerActionButtonProps) {
  const mutation = useTimerAction();
  const { state, taskId: storeTaskId } = useTimerStore();
  const store = useTimerActionStore();
  const isCurrentTimer = storeTaskId === taskId;
  const isDisabled = defaultState === 'stopped';

  const btnStart = (
    <IconButton
      aria-label="start"
      size="small"
      disabled={isDisabled}
      sx={{ bgcolor: 'success.main', color: 'white' }}
      onClick={() => {
        if (state === 'idle') {
          if (!name) {
            setErrorTask?.(true);
            return;
          }

          setErrorTask?.(false);
          mutation.mutate({
            action: 'start',
            taskId,
            activity: activity || '',
            request: request || '',
            timer: lastTimer,
            name,
          });
        } else {
          store.send({
            type: 'idle',
            taskId,
            activity: activity || '',
            request: request || '',
            timer: lastTimer,
            name,
          });
        }
      }}
    >
      <Iconify icon="solar:play-bold" />
    </IconButton>
  );

  const btnPause = (
    <IconButton
      aria-label="pause"
      size="small"
      disabled={isDisabled}
      sx={{ bgcolor: 'warning.main', color: 'white' }}
      onClick={() => mutation.mutate({ action: 'pause', taskId })}
    >
      <Iconify icon="solar:pause-bold" />
    </IconButton>
  );

  const btnStop = (
    <Dialog.Root>
      <Dialog.OpenButton>
        <IconButton
          aria-label="stop"
          size="small"
          disabled={isDisabled}
          sx={{ bgcolor: 'error.main', color: 'white' }}
        >
          <Iconify icon="solar:stop-bold" />
        </IconButton>
      </Dialog.OpenButton>

      <Dialog.AlertConfirmation
        message="Are you sure you want to stop the timer? This action cannot be undone."
        onConfirm={() => mutation.mutate({ action: 'stop', taskId })}
      />
    </Dialog.Root>
  );

  if (state === 'idle' || state === 'stopped' || isCurrentTimer === false) {
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

export function TimerCountdown({
  size,
  taskId,
  lastTimer = 0,
}: {
  size: 'large' | 'small';
  taskId?: number;
  lastTimer?: number;
}) {
  const text = useTimer(taskId, lastTimer);

  if (size === 'small') {
    return (
      <Typography
        color="rgba(33, 43, 54, 1)"
        sx={{ fontWeight: 500, fontSize: '20px', lineHeight: '28px' }}
      >
        {text}
      </Typography>
    );
  }

  if (size === 'large') {
    return (
      <Typography color="rgba(33, 43, 54, 1)" variant="h4">
        {text}
      </Typography>
    );
  }

  return null;
}
