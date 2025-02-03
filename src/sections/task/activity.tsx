// import { Link } from 'react-router-dom';
import { Box, Stack, Typography, /* Button, */ Paper } from '@mui/material';
import { useTimerStore, useLastActivity } from 'src/services/task/timer';
import { TimerActionButton, TimerCountdown } from './timer';

function LastActivity({ activity }: { activity: ReturnType<typeof useLastActivity> }) {
  if (!activity) {
    return null;
  }

  return (
    <Stack spacing={1} aria-label="last activity">
      <Typography
        color="rgba(145, 158, 171, 1)"
        sx={{ fontWeight: 500, fontSize: '14px', lineHeight: '20px' }}
      >
        Last Activity
      </Typography>

      <Box
        display="flex"
        alignItems="center"
        bgcolor="rgba(244, 246, 248, 1)"
        px={1.5}
        py={1}
        borderRadius={1}
      >
        <Stack spacing={0.5} flexGrow={1}>
          <Typography
            color="rgba(99, 115, 129, 1)"
            sx={{ fontWeight: 500, fontSize: '14px', lineHeight: '20px' }}
          >
            {activity.data}
          </Typography>
          <Typography
            color="rgba(33, 43, 54, 1)"
            sx={{ fontWeight: 700, fontSize: '14px', lineHeight: '20px' }}
          >
            {activity.name}
          </Typography>
        </Stack>

        <Stack spacing={0.5} alignItems="end">
          <Typography
            color="rgba(99, 115, 129, 1)"
            sx={{ fontWeight: 500, fontSize: '14px', lineHeight: '20px' }}
          >
            {activity.time}
          </Typography>
          <Typography
            color="rgba(33, 43, 54, 1)"
            sx={{ fontWeight: 700, fontSize: '14px', lineHeight: '20px' }}
          >
            {activity.diff}
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
}

export function CardActivity({
  taskId,
  taskName: task,
  requestName: request,
  lastTimer,
}: {
  taskId: number;
  requestName: string;
  taskName: string;
  lastTimer: number;
}) {
  const lastActivity = useLastActivity({ taskId });

  const store = useTimerStore();
  const isCurrentTimer = store.taskId === taskId;
  const requestName = isCurrentTimer ? store.request : request;
  const taskName = isCurrentTimer ? store.activity : task;

  return (
    <Paper component={Stack} spacing={2} elevation={3} p={3} width="50%">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Activities</Typography>

        {/* <Button
          size="small"
          variant="text"
          color="inherit"
          component={Link}
          to={`/task/${taskId}/activities`}
        >
          View all
        </Button> */}
      </Box>

      <Stack
        spacing={2}
        border="1px solid rgba(145, 158, 171, 0.2)"
        borderRadius={2}
        px={2.5}
        py={2}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography color="rgba(145, 158, 171, 1)" variant="subtitle2">
            {requestName}
          </Typography>
        </Box>

        <Typography color="rgba(145, 158, 171, 1)" variant="subtitle1">
          {taskName}
        </Typography>

        <Box display="flex" alignItems="center" justifyContent="space-between">
          <TimerCountdown size="large" taskId={taskId} lastTimer={lastTimer} />
          <TimerActionButton
            activity={taskName}
            request={requestName}
            taskId={taskId}
            state={lastActivity?.state}
            lastTimer={lastTimer}
          />
        </Box>
      </Stack>

      {lastActivity ? <LastActivity activity={lastActivity} /> : null}
    </Paper>
  );
}
