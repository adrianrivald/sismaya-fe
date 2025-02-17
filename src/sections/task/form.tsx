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
import * as Dialog from 'src/components/disclosure/modal';
import * as Drawer from 'src/components/disclosure/drawer';
import { DatePicker, type DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { AssigneeChooserField, MultipleDropzoneField } from 'src/components/form';
import { Iconify } from 'src/components/iconify';
import * as formUtils from 'src/utils/form';
import {
  type Task,
  type Request,
  useCreateOrUpdateTask,
  useDeleteTask,
  useMutationAssignee,
  useMutationAttachment,
} from 'src/services/task/task-management';
import { taskStatusMap } from 'src/constants/status';
import dayjs from 'dayjs';
import { useTaskRequestList } from 'src/services/request/use-request-list';

interface TaskFormProps {
  children: React.ReactElement;
  request: Partial<Request>;
  task?: Task;
}

interface FormProps extends Omit<TaskFormProps, 'children'> {}

export function DueDatePicker({
  endDate,
  ...props
}: { endDate?: string } & DatePickerProps<any, any>) {
  const date = dayjs(endDate);
  return (
    <DatePicker
      {...props}
      disablePast
      label="Due date"
      shouldDisableDate={(day) => day.isAfter(date)}
      shouldDisableMonth={(month) => month.isAfter(date)}
      shouldDisableYear={(year) => year.isAfter(date)}
    />
  );
}

function Form({ request, task }: FormProps) {
  const requestId = request?.id ?? 0;
  const { onClose } = Drawer.useDisclosure();

  const [form, createOrUpdateFn] = useCreateOrUpdateTask(requestId, {
    onSuccess: () => {
      onClose();
      form.reset({});
    },
  });
  const taskId = form.getValues('taskId') ?? 0;
  const { data } = useTaskRequestList(
    { page: 1, page_size: 100 },
    request?.assignee_company_id ?? 0
  );
  const requests = taskId ? [{ id: 0, name: request?.name }] : (data?.items ?? []);

  const [_, assigneeFn] = useMutationAssignee(requestId);

  const [isUploadingOrDeletingFile, uploadOrDeleteFileFn] = useMutationAttachment(requestId);

  const [isDeleting, deleteFn] = useDeleteTask(requestId, {
    onSuccess: () => {
      onClose();
      form.reset({});
    },
  });

  useEffect(() => {
    form.reset({
      ...task,
      taskId: task?.id,
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
            {taskId ? 'Task Detail' : 'Create Task'}
          </Typography>

          {taskId ? (
            <Dialog.Root>
              <Dialog.OpenButton>
                <IconButton aria-label="delete task" color="error" disabled={isDeleting}>
                  <Iconify icon="solar:trash-bin-trash-bold" />
                </IconButton>
              </Dialog.OpenButton>
              <Dialog.AlertConfirmation
                message="Are you sure you want to delete this task?"
                onConfirm={() => deleteFn({ taskId })}
                disabledAction={isDeleting}
              />
            </Dialog.Root>
          ) : null}
        </Box>

        <Divider />

        <Stack p={2} spacing={3} flexGrow={1}>
          {/* TODO: when `task.id` is not provided: get request list and enable select */}
          <TextField
            label="Request"
            select
            defaultValue={0}
            disabled={taskId ? true : requests.length === 0}
            {...formUtils.getTextProps(form, 'requestId')}
          >
            {requests.map((r) => (
              <MenuItem key={r.id} value={r.id}>
                {r?.name || `REQ#${r.id}`}
              </MenuItem>
            ))}
          </TextField>

          <TextField label="Task Name" {...formUtils.getTextProps(form, 'title')} />

          <AssigneeChooserField
            name="assignees"
            // @ts-ignore
            control={form.control}
            requestId={requestId}
            assignees={task?.assignees ?? []}
            onAssign={(assignee) => assigneeFn({ kind: 'assign', taskId, assigneeId: assignee.id })}
            onUnassign={(assignee) => assigneeFn({ kind: 'unassign', assigneeId: assignee.id })}
          />

          <DueDatePicker
            endDate={request?.end_date}
            {...formUtils.getDatePickerProps(form, 'dueDate')}
          />

          <TextField
            label="Status"
            defaultValue={task?.status ?? 'to-do'}
            disabled={taskId === undefined || taskId === 0}
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
              if (!taskId) return;
              uploadOrDeleteFileFn({ kind: 'create', taskId, files });
            }}
            onRemove={(fileId) => {
              if (!taskId) return;
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
            {taskId ? 'Update' : 'Create'}
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
