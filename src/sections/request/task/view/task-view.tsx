import { Link } from 'react-router-dom';
import { Stack, Typography, IconButton } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { useAllTask } from 'src/services/request/task';
import { RequestTaskForm } from './task-form';
import { TaskEmpty } from './task-empty';
import { TaskItem } from './task-item';

interface TaskListProps {
  requestId: number;
}

function TaskList({ requestId }: TaskListProps) {
  const { data = [] } = useAllTask({ request_id: requestId });

  if (!data || data.length < 1) {
    return <TaskEmpty />;
  }

  return data.map((task) => (
    // @ts-ignore
    <RequestTaskForm key={task.taskId} requestId={requestId} task={{ ...task }}>
      <TaskItem task={task} />
    </RequestTaskForm>
  ));
}

export function RequestTaskView({ requestId }: TaskListProps) {
  return (
    <Stack spacing={3} p={2} bgcolor="blue.50" minHeight={420} borderRadius={2} marginTop={2}>
      <Stack spacing={1} direction="row" justifyContent="start" alignItems="center" width="100%">
        <IconButton component={Link} to="/request" aria-label="back" color="primary" size="small">
          <Iconify icon="solar:arrow-left-outline" />
        </IconButton>

        <Typography color="primary" fontWeight="bold">
          Tasks
        </Typography>
      </Stack>

      <TaskList requestId={requestId} />
    </Stack>
  );
}