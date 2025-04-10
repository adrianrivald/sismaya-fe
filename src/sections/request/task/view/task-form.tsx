import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
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
import { DueDatePicker } from 'src/sections/task/form';
import { AssigneeChooserField, MultipleDropzoneField } from 'src/components/form';
import { Iconify } from 'src/components/iconify';
import * as taskService from 'src/services/request/task';
import * as formUtils from 'src/utils/form';
import { useUserPermissions } from 'src/services/auth/use-user-permissions';
import { toast, Bounce } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useRequestById } from 'src/services/request';
import { AttachmentDialog } from 'src/pages/task/attachment-dialog';
import { RequestTask } from 'src/services/request/task';

interface RequestTaskFormProps {
  children: React.ReactElement;
  requestId: number;
  requestNumber?: string;
  task?: taskService.RequestTask;
}

interface TaskFormProps extends Omit<RequestTaskFormProps, 'children'> {}

const defaultFormValues = taskService.RequestTask.fromJson({
  status: 'to-do',
  dueDate: dayjs().toDate(),
});

function TaskForm({ requestId, task = defaultFormValues, requestNumber }: TaskFormProps) {
  const { onClose } = Drawer.useDisclosure();
  const [attachmentModal, setAttachmentModal] = useState({ isOpen: false, url: '', path: '' });
  const [_, assigneeFn] = taskService.useMutationAssignee(requestId);
  const { id } = useParams();
  const { data: requestDetail } = useRequestById(id ?? '');
  const [isUploadingOrDeletingFile, uploadOrDeleteFileFn] =
    taskService.useMutationAttachment(requestId);
  const { data: userPermissionsList } = useUserPermissions();
  const [form, createOrUpdateFn] = taskService.useCreateOrUpdateTask(requestId, {
    defaultValues: task,
    onSuccess: () => {
      form.reset({});
      onClose();
    },
  });
  const [isDeleting, deleteFn] = taskService.useDeleteTask(requestId, {
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
    form.reset({ ...task, requestId, status: task.status.length > 0 ? task.status : 'to-do' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task]);

  console.log('dataa 123', form.watch());

  return (
    <>
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
                Request {requestDetail?.name || requestDetail?.number}
              </Typography>
            </Box>

            {task?.taskId ? (
              <Dialog.Root>
                <Dialog.OpenButton>
                  <IconButton aria-label="delete task" color="error" disabled={isDeleting}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Dialog.OpenButton>
                <Dialog.AlertConfirmation
                  message="Are you sure you want to delete this task?"
                  onConfirm={() => deleteFn({ taskId: task?.taskId })}
                  disabledAction={isDeleting}
                />
              </Dialog.Root>
            ) : null}
          </Box>

          <Divider />

          <Stack p={2} spacing={3} flexGrow={1}>
            <TextField label="Request Task Name" {...formUtils.getTextProps(form, 'title')} />

            <AssigneeChooserField
              isCreate={task?.taskId === undefined || task?.taskId === 0}
              name="assignees"
              productId={String(requestDetail?.product?.id)}
              // @ts-ignore
              control={form.control}
              requestId={requestId}
              assignees={task?.assignees ?? []}
              onAssign={(assignee) => {
                assigneeFn({ kind: 'assign', taskId: task?.taskId, assigneeId: assignee.id });
              }}
              onUnassign={(assignee) => assigneeFn({ kind: 'unassign', assigneeId: assignee.id })}
            />

            <DueDatePicker
              endDate={task?.endDate}
              {...formUtils.getDatePickerProps(form, 'dueDate')}
            />
            <TextField
              label="Status"
              defaultValue={form.watch('status')}
              disabled={task?.taskId === undefined || task?.taskId === 0}
              {...formUtils.getSelectProps(form, 'status')}
            >
              {Object.entries(taskService.RequestTask.statusMap).map(([key, value]) => (
                <MenuItem key={key} value={key} children={value.label} />
              ))}
            </TextField>

            <TextField
              label="Description"
              multiline
              minRows={3}
              type="textarea"
              {...formUtils.getTextProps(form, 'description')}
            />

            <MultipleDropzoneField
              acceptForm=".jpg,.jpeg,.png,.gif,.bmp,.webp,.svg,.xls,.xlsx,.doc,.docx,.pdf,.mov,.mp4,.avi"
              label="Attachment"
              maxSizeForm={5}
              disabled={isUploadingOrDeletingFile}
              onPreview={setAttachmentModal}
              onDropAccepted={async (files) => {
                if (
                  userPermissionsList?.includes('task:update') ||
                  userPermissionsList?.includes('task:create')
                ) {
                  if (task?.taskId) {
                    uploadOrDeleteFileFn({ kind: 'create', taskId: task?.taskId, files });
                  } else {
                    const result = await RequestTask.toJson({
                      ...form.watch(),
                      files,
                    });

                    // Get existing files
                    const existingFiles = form.watch('files') || [];

                    const attachment: {
                      id: number;
                      name: string;
                      url: string;
                      createdAt: string;
                      file: any;
                    }[] = result.attachments.map((item: any, index: any) => ({
                      id: existingFiles.length + index, // Increment ID based on existing files
                      name: item.file_name,
                      url: `${item.file_path}/${item.file_name}`,
                      path: item.file_path,
                      createdAt: new Date().toISOString(),
                      file: item,
                    }));
                    // Combine existing files with new ones
                    form.setValue('files', [...existingFiles, ...attachment]);
                  }
                } else {
                  onShowErrorToast();
                }
              }}
              disabledForm={
                userPermissionsList?.includes('task:update') ||
                userPermissionsList?.includes('task:create')
              }
              onRemove={(fileId) => {
                if (
                  userPermissionsList?.includes('task:update') ||
                  userPermissionsList?.includes('task:create')
                ) {
                  if (!task?.taskId) return;
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
              {task?.taskId ? 'Update' : 'Create'}
            </Button>
          </Stack>
        </Box>
      </Drawer.Content>
      <AttachmentDialog
        isOpen={attachmentModal.isOpen}
        url={attachmentModal.url}
        onClose={() => {
          setAttachmentModal({ isOpen: false, url: '', path: '' });
        }}
        path={attachmentModal.path}
      />
    </>
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
