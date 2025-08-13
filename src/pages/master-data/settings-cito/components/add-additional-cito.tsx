import { Icon } from '@iconify/react';
import { Dialog, Box, Typography, Stack, Button, TextField } from '@mui/material';
import { useRef } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Bounce, toast } from 'react-toastify';

interface DialogAddAdditionalCitoProps {
  open: boolean;
  onClose: () => void;
}

function bytesToMB(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(2)} MB`;
}

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export default function DialogAddAdditionalCito({ open, onClose }: DialogAddAdditionalCitoProps) {
  const methods = useForm<{
    files: { file_size: number; file_name: string; file_number: string; files: File }[];
    cito_type: string;
    quota: { company_id: number; quota: number; name: string; type: string }[];
  }>({
    defaultValues: {
      files: [],
      cito_type: '',
      quota: [],
    },
  });
  const { control } = methods;
  const { append, remove } = useFieldArray({
    control,
    name: 'files',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!files) return;

    const validFiles: File[] = [];
    const rejectedFiles: string[] = [];

    /* eslint-disable no-restricted-syntax */
    for (const file of Array.from(files)) {
      if (file.size <= MAX_FILE_SIZE_BYTES) {
        validFiles.push(file);
      } else {
        rejectedFiles.push(`${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
      }
    }

    if (rejectedFiles.length > 0) {
      toast.error('Please check your file. Some file more than 5 MB', {
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

    if (validFiles.length > 0) {
      const existingLength = methods.watch('files').length;

      validFiles.forEach((file, index) => {
        const sequenceNumber = existingLength + index + 1; // Start from next index
        append({
          file_size: file.size,
          file_name: file.name,
          file_number: `PO_${String(sequenceNumber).padStart(3, '0')}`,
          files: file,
        });
      });
    }

    event.target.value = '';
  };
  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose();
      }}
      maxWidth="md"
      fullWidth
      sx={{ p: 3 }}
    >
      <Box sx={{ px: 3, pt: 1, pb: 3 }}>
        <Typography mt={2} fontWeight="bold">
          Add Additional CITO Quota
        </Typography>

        <Stack sx={{ mt: 2 }} direction="row" alignItems="center" justifyContent="space-between">
          <Typography fontSize={14}>PO Documents</Typography>
          <Button
            variant="contained"
            onClick={() => {
              handleButtonClick();
            }}
          >
            Add PO Document
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.xls,.xlsx,image/*"
            style={{ display: 'none' }}
            multiple
          />
        </Stack>
        <Box>
          <Stack direction="row" gap={1} sx={{ my: 1.5 }}>
            <Box sx={{ minWidth: 24, minHeight: 24 }}>
              <Icon icon="solar:info-circle-bold" color="red" height={20} width={20} />
            </Box>

            <Typography fontSize={14} color="#919EAB">
              Please upload the Purchase Order (PO) document before proceeding with additional
              quota.
            </Typography>
          </Stack>
          {methods.watch('files').map((item, index) => (
            <Box border={0.2} borderRadius={1} mt={1} key={index}>
              <Stack p={1.5} flexDirection="row" justifyContent="space-between">
                <Stack flexDirection="row" alignItems="center" gap={1}>
                  <Icon icon="bxs:file" width="22" height="22" color="orange" />
                  <Box>
                    <Typography fontSize={14} fontWeight="bold">
                      {item.file_name}
                    </Typography>
                    <Typography fontSize={12}>{bytesToMB(item.file_size)}</Typography>
                  </Box>
                </Stack>

                <Button
                  onClick={() => {
                    remove(index);
                  }}
                  sx={{ p: 0, pl: 1.5, minWidth: 4 }}
                  startIcon={<Icon icon="material-symbols-light:close" width="18" height="18" />}
                />
              </Stack>
            </Box>
          ))}
          {methods.watch('files').length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Stack direction="row" gap={0.5}>
                <Typography fontSize={14} fontWeight="bold">
                  PO Number
                </Typography>
                <Typography fontSize={14} color="#919EAB">
                  (Use separator if more than one PO number)
                </Typography>
              </Stack>

              <TextField
                value={methods
                  .watch('files')
                  .map((item) => item.file_number)
                  .join(', ')}
                fullWidth
                sx={{ mt: 2 }}
                disabled
              />
            </Box>
          )}
        </Box>

        <Stack direction="row" gap={2} sx={{ mt: 3 }} justifyContent="flex-end">
          <Button
            variant="outlined"
            onClick={() => {
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={() => {}}>
            Save
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
}
