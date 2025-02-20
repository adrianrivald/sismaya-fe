import { useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { uploadFilesBulk as uploads } from 'src/services/utils/upload-image';
import Button from '@mui/material/Button';
import { useMutationAttachment } from 'src/services/task/task-management';

export default function AddAttachment({ taskId }: { taskId?: number }) {
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

  return (
    <>
      <Button size="small" variant="contained" onClick={() => inputRef.current?.click()}>
        Add
      </Button>

      <input
        type="file"
        name="attachment"
        id="attachment"
        style={{ display: 'none' }}
        ref={inputRef}
        multiple
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          handleUpload(files);
        }}
      />
    </>
  );
}
