import { Box, Stack, Divider, Typography } from '@mui/material';
import { type Task } from 'src/services/request/task';
import { AssigneeList } from 'src/components/form/field/assignee';
import { TaskAttachment } from './task-attachment';

function TaskStatus({ bg, color, label }: ReturnType<Task['transformStatus']>) {
  return (
    <Box bgcolor={bg} color={color} borderRadius={0.5} px={1} py="1px">
      <Typography fontWeight={600} fontSize={12} lineHeight="20px">
        {label}
      </Typography>
    </Box>
  );
}

function TaskAssignees({ assignees }: Pick<Task, 'assignees'>) {
  if (!assignees || assignees.length < 1) {
    return null;
  }

  return <AssigneeList assignees={assignees} />;
}

interface TaskItemProps {
  task: Task;
  onClick?: () => void;
}

export function TaskItem({ task, onClick }: TaskItemProps) {
  return (
    <Stack
      spacing={1}
      bgcolor="rgba(0, 91, 127, 0.08)"
      borderRadius={1.5}
      px={1.5}
      py={1}
      sx={{ cursor: 'pointer' }}
      onClick={onClick}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography fontWeight={400} fontSize={14} lineHeight="12px">
          {task.title}
        </Typography>
        <Typography fontWeight={400} fontSize={12} lineHeight="16px" color="#637381">
          Due {task.formattedDueDate()}
        </Typography>
      </Stack>

      <Typography variant="body2" color="text.secondary">
        {task.description || '-'}
      </Typography>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" alignItems="center" flexGrow={1} spacing={1}>
          {!!task.assignees && <TaskAssignees assignees={task.assignees} />}

          <Divider orientation="vertical" flexItem />

          <TaskStatus {...task.transformStatus()} />
        </Stack>

        <TaskAttachment files={task.files} />
      </Stack>
    </Stack>
  );
}
