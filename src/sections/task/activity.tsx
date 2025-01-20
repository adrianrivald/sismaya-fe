import { Link } from 'react-router-dom';
import { Box, Stack, Typography, Button, Paper } from '@mui/material';
import { fTime } from 'src/utils/format-time';
import { useTimerStore, useLastActivity } from 'src/services/task/timer';
import { useTaskDetail } from 'src/services/task/task-management';
import { TimerActionButton, TimerCountdown } from './timer';

function LastActivity({ taskId }: { taskId: number }) {
  const activity = useLastActivity({ taskId });

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
            {fTime(activity.diff)}
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
}

export function CardActivity({ taskId }: { taskId: number }) {
  const store = useTimerStore();
  const { data } = useTaskDetail(Number(taskId));

  return (
    <Paper component={Stack} spacing={2} elevation={3} p={3} width="50%">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Activities</Typography>

        <Button
          size="small"
          variant="text"
          color="inherit"
          component={Link}
          to={`/task/${taskId}/activities`}
        >
          View all
        </Button>
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
            {store.request || data?.request?.name}
          </Typography>
        </Box>

        <Typography color="rgba(145, 158, 171, 1)" variant="subtitle1">
          {store.activity || data?.task?.name}
        </Typography>

        <Box display="flex" alignItems="center" justifyContent="space-between">
          <TimerCountdown variant="large" />
          <TimerActionButton
            activity={data?.task?.name}
            request={data?.request?.name}
            taskId={taskId}
          />
        </Box>
      </Stack>

      <LastActivity taskId={taskId} />
    </Paper>
  );
}
