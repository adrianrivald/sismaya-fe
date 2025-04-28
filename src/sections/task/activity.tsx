import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Stack, Typography, Paper, Button, TextField } from '@mui/material';
import { useTimerStore, useLastActivity, useTimerActionStore } from 'src/services/task/timer';
import { SvgColor } from 'src/components/svg-color';
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
            {activity.timerName}
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
  step,
  refetch,
  assigneeCompanyId,
  userAssignee = true,
}: {
  taskId: number;
  requestName: string;
  taskName: string;
  lastTimer: number;
  step?: string;
  refetch?: any;
  assigneeCompanyId?: number;
  userAssignee?: boolean;
}) {
  const lastActivity = useLastActivity({ taskId });
  const actionStore = useTimerActionStore();
  const store = useTimerStore();
  const isCurrentTimer = store.taskId === taskId;
  const requestName = isCurrentTimer ? store.request : request;
  const taskName = isCurrentTimer ? store.activity : task;

  return (
    <Paper component={Stack} spacing={2} elevation={3} p={3} width="50%">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Activities</Typography>
        {lastActivity?.data && (
          <Button size="small" variant="text" color="inherit" component={Link} to="activities">
            View all
          </Button>
        )}
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

          {isCurrentTimer &&
            store.state !== 'running' &&
            store.state !== 'idle' &&
            store.state !== 'idlePaused' && (
              <Button
                onClick={() => {
                  if (store.state === 'paused') {
                    actionStore.send({
                      type: 'idlePaused',
                      taskId: store.taskId,
                      activity: store.activity,
                      request: store.request,
                      timer: store.timer,
                      name: store.name,
                    });

                    return;
                  }
                  if (store.state !== 'running' && store.state !== 'idle') {
                    actionStore.send({
                      type: 'start',
                      taskId,
                      activity: store.activity,
                      request: store.request,
                      timer: store.timer,
                      name: store.name,
                    });
                  }
                }}
                startIcon={
                  <SvgColor
                    sx={{ width: 20, height: 20, bgcolor: 'grey.500' }}
                    src="/assets/icons/minimize_square.svg"
                  />
                }
                sx={{ height: 10, width: 10, p: 0, minWidth: 5, mt: 1, mb: 2 }}
              />
            )}
        </Box>

        <Typography color="rgba(145, 158, 171, 1)" variant="subtitle1">
          {lastActivity?.tmtName ?? (store.taskId === taskId ? store?.name : '')}
        </Typography>

        <Box display="flex" alignItems="center" justifyContent="space-between">
          <TimerCountdown
            size="large"
            taskId={taskId}
            lastTimer={isCurrentTimer ? store?.timer || lastTimer : lastTimer}
          />

          <TimerActionButton
            activity={taskName}
            request={requestName}
            taskId={taskId}
            state={lastActivity?.state}
            lastTimer={isCurrentTimer ? store?.timer || lastTimer : lastTimer}
            name={lastActivity?.tmtName}
            step={step}
            refetch={refetch}
            assigneeCompanyId={assigneeCompanyId}
            userAssignee={userAssignee}
          />
        </Box>
      </Stack>

      {lastActivity ? <LastActivity activity={lastActivity} /> : null}
    </Paper>
  );
}
