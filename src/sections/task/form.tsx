import { useEffect } from 'react';
import {
  Divider,
  Box,
  Stack,
  Typography,
  TextField,
  MenuItem,
  Button,
  IconButton,
} from '@mui/material';
import * as Drawer from 'src/components/disclosure/drawer';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AssigneeChooserField, MultipleDropzoneField } from 'src/components/form';
import { Iconify } from 'src/components/iconify';
import * as formUtils from 'src/utils/form';
import {
  type Task,
  useCreateOrUpdateTask,
  useDeleteTask,
  useMutationAssignee,
  useMutationAttachment,
} from 'src/services/task/task-management';
import { taskStatusMap } from 'src/constants/status';

interface TaskFormProps {
  children: React.ReactElement;
  requestId: number;
  requestName?: string;
  task?: Task;
}

interface FormProps extends Omit<TaskFormProps, 'children'> {}

function Form({ requestId, requestName, task }: FormProps) {
  const { onClose } = Drawer.useDisclosure();
  const [_, assigneeFn] = useMutationAssignee(requestId);
  const [isUploadingOrDeletingFile, uploadOrDeleteFileFn] = useMutationAttachment(requestId);
  const [form, createOrUpdateFn] = useCreateOrUpdateTask(requestId, {
    onSuccess: () => {
      onClose();
      form.reset({});
    },
  });
  const [isDeleting, deleteFn] = useDeleteTask(requestId, {
    onSuccess: () => {
      onClose();
      form.reset({});
    },
  });

  useEffect(() => {
    form.reset({
      ...task,
      title: task?.name,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task]);

  return (
    <Drawer.Content anchor="right">
      <Box
        display="flex"
        flexDirection="column"
        component="form"
        onSubmit={createOrUpdateFn}
        role="presentation"
        sx={{ width: 480, height: '100%' }}
      >
        <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
          <Typography color="#919EAB" fontWeight="bold" textAlign="center">
            {task?.id ? 'Task Detail' : 'Create Task'}
          </Typography>

          {task?.id ? (
            <IconButton
              aria-label="delete task"
              color="error"
              onClick={() => deleteFn({ taskId: task?.id })}
              disabled={isDeleting}
            >
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          ) : null}
        </Box>

        <Divider />

        <Stack p={2} spacing={3} flexGrow={1}>
          {/* TODO: when `task.id` is not provided: get request list and enable select */}
          <TextField
            label="Request"
            {...formUtils.getTextProps(form, 'title')}
            select
            disabled
            defaultValue={0}
          >
            <option value="0">{requestName}</option>
          </TextField>

          <TextField label="Task Name" {...formUtils.getTextProps(form, 'title')} />

          <AssigneeChooserField
            name="assignees"
            // @ts-ignore
            control={form.control}
            requestId={requestId}
            assignees={task?.assignees ?? []}
            onAssign={(assignee) =>
              assigneeFn({ kind: 'assign', taskId: task?.id ?? 0, assigneeId: assignee.id })
            }
            onUnassign={(assignee) => assigneeFn({ kind: 'unassign', assigneeId: assignee.id })}
          />

          <DatePicker
            disablePast
            label="Due date"
            {...formUtils.getDatePickerProps(form, 'dueDate')}
          />

          <TextField
            label="Status"
            defaultValue={task?.status}
            disabled={task?.id === undefined || task?.id === 0}
            {...formUtils.getSelectProps(form, 'status')}
          >
            {Object.entries(taskStatusMap).map(([key, value]) => (
              <MenuItem key={key} value={key} children={value.label} />
            ))}
          </TextField>

          <TextField
            label="Description"
            multiline
            rows={3}
            {...formUtils.getTextProps(form, 'description')}
          />

          <MultipleDropzoneField
            label="Attachment"
            disabled={isUploadingOrDeletingFile}
            onDropAccepted={(files) => {
              if (!task?.id) return;
              uploadOrDeleteFileFn({ kind: 'create', taskId: task?.id, files });
            }}
            onRemove={(fileId) => {
              if (!task?.id) return;
              uploadOrDeleteFileFn({ kind: 'delete', fileId: fileId ?? 'all' });
            }}
            {...formUtils.getMultipleDropzoneProps(form, 'files')}
          />
        </Stack>

        <Divider />

        <Stack p={2} spacing={1.5} direction="row" justifyContent="flex-end">
          <Drawer.DismissButton>
            <Button variant="outlined" type="reset">
              Cancel
            </Button>
          </Drawer.DismissButton>
          <Button
            variant="contained"
            type="submit"
            disabled={isDeleting || form.formState.isSubmitting}
          >
            {task?.id ? 'Update' : 'Create'}
          </Button>
        </Stack>
      </Box>
    </Drawer.Content>
  );
}

export function TaskForm({ children, ...formProps }: TaskFormProps) {
  return (
    <Drawer.Root>
      <Drawer.OpenButton>{children}</Drawer.OpenButton>
      <Form {...formProps} />
    </Drawer.Root>
  );
}
