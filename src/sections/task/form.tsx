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
  FormLabel,
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
  useAssigneeCompanyId,
} from 'src/services/task/task-management';
import { taskStatusMap } from 'src/constants/status';
import dayjs from 'dayjs';
import { useTaskRequestList } from 'src/services/request/use-request-list';
import { useUserPermissions } from 'src/services/auth/use-user-permissions';
import { toast, Bounce } from 'react-toastify';
import { useParams } from 'react-router-dom';

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
  return <DatePicker {...props} label="Due date" defaultValue={dayjs()} />;
}

function Form({ request, task }: FormProps) {
  const requestId = request?.id ?? 0;
  const { onClose, isOpen } = Drawer.useDisclosure();
  const assigneeCompanyId = useAssigneeCompanyId();
  const { vendor } = useParams();
  const [form, createOrUpdateFn] = useCreateOrUpdateTask(requestId, {
    onSuccess: () => {
      onClose();
      form.reset({});
    },
  });

  const taskId = form.getValues('taskId') ?? 0;
  const { data } = useTaskRequestList({ page: 1, page_size: 100 }, assigneeCompanyId ?? 0);
  const requests = taskId ? [{ id: 0, name: request?.name }] : (data?.items ?? []);
  const { data: userPermissionsList } = useUserPermissions();
  const [_, assigneeFn] = useMutationAssignee(requestId);

  const [isUploadingOrDeletingFile, uploadOrDeleteFileFn] = useMutationAttachment(requestId);

  const [isDeleting, deleteFn] = useDeleteTask(requestId, {
    onSuccess: () => {
      onClose();
      form.reset({});
    },
  });

  const onShowErrorToast = () => {
    toast.error(`You don't have permission`, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
      transition: Bounce,
    });
  };

  useEffect(() => {
    if (task?.id) {
      form.reset({
        ...task,
        requestId,
        taskId: task?.id,
        title: task?.name,
        dueDate: new Date().toISOString(),
        files: task?.attachments,
      });
    }

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
          <Stack spacing={1}>
            <TextField
              label="Request"
              select
              defaultValue={0}
              sx={{ pb: '-10px' }}
              disabled={taskId ? true : requests.length === 0}
              {...formUtils.getTextProps(form, 'requestId')}
            >
              {requests?.map((r) => (
                <MenuItem key={r.id} value={r.id} onClick={(e) => e.stopPropagation()}>
                  {r?.name || `REQ${r.number}`}
                </MenuItem>
              ))}
            </TextField>
            {form.watch('requestId') && String(form.watch('requestId')) !== '0' && (
              <FormLabel
                onClick={() => {
                  window.open(`/${vendor}/my-request/${form.watch('requestId')}`, '_blank');
                }}
                sx={{ cursor: 'pointer', textDecoration: 'underline' }}
              >
                View Request
              </FormLabel>
            )}
          </Stack>

          <TextField label="Task Name" {...formUtils.getTextProps(form, 'title')} />

          <AssigneeChooserField
            name="assignees"
            isCreate={!taskId}
            // @ts-ignore
            control={form.control}
            requestId={form.watch('requestId') || requestId}
            assignees={task?.assignees ?? []}
            onAssign={(assignee) =>
              assigneeFn({ kind: 'assign', taskId, assigneeId: assignee.userId })
            }
            onUnassign={(assignee) => {
              const assigneeId = task?.assignees.filter(
                (item) => item.userId === assignee.userId
              )?.[0];
              if (assigneeId) {
                assigneeFn({ kind: 'unassign', assigneeId: assigneeId.id });
              }
            }}
          />

          <DueDatePicker
            endDate={request?.end_date}
            defaultValue={new Date()}
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
            disabledForm={userPermissionsList?.includes('request attachment:create')}
            disabled={isUploadingOrDeletingFile}
            onDropAccepted={(files) => {
              if (userPermissionsList?.includes('request attachment:create')) {
                if (!taskId) return;
                uploadOrDeleteFileFn({ kind: 'create', taskId, files });
              } else {
                onShowErrorToast();
              }
            }}
            onRemove={(fileId) => {
              if (userPermissionsList?.includes('request attachment:delete')) {
                if (!taskId) return;
                uploadOrDeleteFileFn({ kind: 'delete', fileId: fileId ?? 'all' });
              } else {
                onShowErrorToast();
              }
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
