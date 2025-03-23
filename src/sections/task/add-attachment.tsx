import { useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Bounce, toast } from 'react-toastify';
import { uploadFilesBulk as uploads } from 'src/services/utils/upload-image';
import Button from '@mui/material/Button';
import { useMutationAttachment } from 'src/services/task/task-management';
import { useUserPermissions } from 'src/services/auth/use-user-permissions';

export default function AddAttachment({ taskId }: { taskId?: number }) {
  const { data: userPermissionsList } = useUserPermissions();
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);

  const [_, uploadOrDeleteFileFn] = useMutationAttachment(taskId ?? 0);

  async function handleUpload(files: File[]) {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('files', file);
    });

    await toast.promise(uploadOrDeleteFileFn({ kind: 'create', taskId: taskId || 0, files }), {
      pending: 'Uploading...',
      error: {
        // @ts-ignore
        render: ({ data }) => data?.message || 'Upload failed',
      },
    });

    queryClient.invalidateQueries({
      queryKey: taskId ? ['task', `task-detail=${taskId}`] : ['task'],
    });
  }

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

  return (
    <>
      <Button
        size="small"
        variant="contained"
        onClick={() => {
          if (
            userPermissionsList?.includes('task:update') ||
            userPermissionsList?.includes('task:create')
          ) {
            inputRef.current?.click();
          } else {
            onShowErrorToast();
          }
        }}
      >
        Add
      </Button>

      <input
        type="file"
        accept="image/*"
        name="attachment"
        id="attachment"
        style={{ display: 'none' }}
        ref={inputRef}
        multiple
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          const MAX_SIZE = 5 * 1024 * 1024; // 5MB in bytes

          const oversizedFiles = files.filter((file) => file.size > MAX_SIZE);
          if (oversizedFiles.length > 0) {
            toast.error('File size should not exceed 5MB', {
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
            return;
          }

          handleUpload(files);
        }}
      />
    </>
  );
}
