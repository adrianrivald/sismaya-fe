import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Bounce, toast } from 'react-toastify';
import { uploadFilesBulk as uploads } from 'src/services/utils/upload-image';
import Button from '@mui/material/Button';
import { useMutationAttachment } from 'src/services/task/task-management';
import { useUserPermissions } from 'src/services/auth/use-user-permissions';
import { toBlobURL } from '@ffmpeg/util';

export default function AddAttachment({
  taskId,
  userOnAssignee,
  transcode,
  setVideoFiles,
}: {
  taskId?: number;
  userOnAssignee?: any;
  transcode: any;
  setVideoFiles: any;
}) {
  const { data: userPermissionsList } = useUserPermissions();
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);

  const [_, uploadOrDeleteFileFn] = useMutationAttachment(taskId ?? 0);

  async function handleUpload(files: File[]) {
    const formData = new FormData();

    const videoFile: any = files
      .filter((file) => {
        const extension = file.name.toLowerCase().split('.').pop() || '';
        return ['mp4', 'avi', 'mov', 'ogg', 'mkv'].includes(extension);
      })
      .map((file) => ({
        id: Math.random().toString(36).substring(7),
        file,
        originalSize: file.size,
        compressedSize: '',
        status: 'pending' as const,
        originalUrl: URL.createObjectURL(file),
      }));

    if (videoFile.length > 0) {
      setVideoFiles((prev: any) => [...prev, ...videoFile]);
      try {
        // Process videos sequentially
        await Promise.all(videoFile.map((newFile: any) => transcode(newFile)));
      } catch (error) {
        console.error('Error processing videos:', error);
        toast.error('Failed to process video files');
      }
    }

    const otherFile = files.filter((file) => {
      const extension = file.name.toLowerCase().split('.').pop() || '';
      return !['mp4', 'avi', 'mov', 'ogg', 'mkv'].includes(extension);
    });

    otherFile.forEach((file) => {
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
            (userPermissionsList?.includes('task:update') ||
              userPermissionsList?.includes('task:create')) &&
            userOnAssignee()
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
        accept=".jpg,.jpeg,.png,.gif,.bmp,.webp,.svg,.xls,.xlsx,.doc,.docx,.pdf,.mov,.mp4,.avi"
        name="attachment"
        id="attachment"
        style={{ display: 'none' }}
        ref={inputRef}
        multiple
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          const MAX_SIZE = 5 * 1024 * 1024; // 5MB in bytes

          // const oversizedFiles = files.filter((file) => file.size > MAX_SIZE);
          // if (oversizedFiles.length > 0) {
          //   toast.error('File size should not exceed 5MB', {
          //     position: 'top-right',
          //     autoClose: 5000,
          //     hideProgressBar: true,
          //     closeOnClick: true,
          //     pauseOnHover: true,
          //     draggable: true,
          //     progress: undefined,
          //     theme: 'light',
          //     transition: Bounce,
          //   });
          //   return;
          // }

          handleUpload(files);
        }}
      />
    </>
  );
}
