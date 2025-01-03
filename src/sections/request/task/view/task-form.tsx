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
import { AssigneeField, MultipleDropzoneField } from 'src/components/form';
import { Iconify } from 'src/components/iconify';
import {
  Task,
  useCreateOrUpdateTask,
  useDeleteTask,
  useMutationAttachment,
} from 'src/services/request/task';
import { getFieldProps } from 'src/utils/form';
import dayjs from 'dayjs';

interface RequestTaskFormProps {
  children: React.ReactElement;
  requestId: number;
  task?: Task;
}

interface TaskFormProps extends Omit<RequestTaskFormProps, 'children'> {}

const defaultFormValues = Task.fromJson({});

function TaskForm({ requestId, task = defaultFormValues }: TaskFormProps) {
  const { onClose } = Drawer.useDisclosure();
  const [isDeleting, deleteFn] = useDeleteTask(requestId);
  const [isUploadingOrDeletingFile, uploadOrDeleteFile] = useMutationAttachment(requestId);
  const [form, createOrUpdateFn] = useCreateOrUpdateTask(requestId, {
    defaultValues: task,
    onSuccess: () => {
      onClose();
      form.reset({});
    },
  });

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
          <Box
            bgcolor="#F0F2F5"
            color="#919EAB"
            borderRadius={0.5}
            px={1}
            py="1px"
            width="max-content"
          >
            <Typography color="#919EAB" fontWeight="bold" textAlign="center">
              Request #{requestId}
            </Typography>
          </Box>

          {task?.taskId ? (
            <IconButton
              aria-label="delete task"
              color="error"
              onClick={() => deleteFn({ taskId: task?.taskId })}
              disabled={isDeleting}
            >
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          ) : null}
        </Box>

        <Divider />

        <Stack p={2} spacing={3} flexGrow={1}>
          <TextField label="Task Name" {...getFieldProps(form, 'title')} />

          <AssigneeField
            name="assignees"
            // @ts-ignore
            control={form.control}
            requestId={requestId}
            defaultAssignees={task?.assignees ?? []}
          />

          <DatePicker
            disablePast
            label="Due date"
            onChange={(value) => form.setValue('dueDate', value?.toISOString() ?? '')}
            value={task?.dueDate ? dayjs(task.dueDate) : null}
          />

          <TextField
            label="Status"
            select
            disabled={task?.taskId === undefined || task?.taskId === 0}
            defaultValue={task?.status}
            {...getFieldProps(form, 'status')}
          >
            {Object.entries(Task.statusMap).map(([key, value]) => (
              <MenuItem key={key} value={key} children={value.label} />
            ))}
          </TextField>

          <TextField
            label="Description"
            multiline
            rows={3}
            {...getFieldProps(form, 'description')}
          />

          <MultipleDropzoneField
            label="Attachment"
            name="files"
            control={form.control}
            disabled={isUploadingOrDeletingFile}
            onDropAccepted={(files) => {
              if (!task?.taskId) return;
              uploadOrDeleteFile({ kind: 'create', taskId: task?.taskId, files });
            }}
            onRemove={(fileId) => {
              if (!task?.taskId) return;
              if (!fileId) return; // TODO: remove all files
              uploadOrDeleteFile({ kind: 'delete', fileId });
            }}
          />
        </Stack>

        <Divider />

        <Stack p={2} spacing={1.5} direction="row" justifyContent="flex-end">
          <Drawer.DismissButton>
            <Button variant="outlined" type="reset">
              Cancel
            </Button>
          </Drawer.DismissButton>
          <Button variant="contained" type="submit" disabled={form.formState.isSubmitting}>
            {task?.taskId ? 'Update' : 'Create'}
          </Button>
        </Stack>
      </Box>
    </Drawer.Content>
  );
}

export function RequestTaskForm({ children, ...formProps }: RequestTaskFormProps) {
  return (
    <Drawer.Root>
      <Drawer.OpenButton>{children}</Drawer.OpenButton>
      <TaskForm {...formProps} />
    </Drawer.Root>
  );
}
