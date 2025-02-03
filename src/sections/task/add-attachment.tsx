import { useRef } from 'react';
import { toast } from 'react-toastify';
import { uploadFilesBulk as uploads } from 'src/services/utils/upload-image';
import Button from '@mui/material/Button';

export default function AddAttachment() {
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(files: File[]) {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('files', file);
    });

    await toast.promise(uploads(formData), {
      pending: 'Uploading...',
      success: 'Uploaded successfully',
      error: {
        // @ts-ignore
        render: ({ data }) => data?.message || 'Upload failed',
      },
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
