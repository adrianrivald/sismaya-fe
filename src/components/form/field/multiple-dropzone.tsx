import * as React from 'react';
import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  Stack,
  Typography,
  IconButton,
  Button,
  useTheme,
} from '@mui/material';
import { useDropzone, type DropzoneOptions } from 'react-dropzone';
import {
  useController,
  useFieldArray,
  type FieldValues,
  type UseControllerProps,
  useWatch,
} from 'react-hook-form';
import { Bounce, toast } from 'react-toastify';
import { Iconify } from 'src/components/iconify';
import { useState } from 'react';

export interface MultipleDropzoneFieldProps<TFormFields extends FieldValues = FieldValues>
  extends DropzoneOptions,
    UseControllerProps<TFormFields> {
  label?: string;
  onRemove?: (fileId?: number) => void;
  disabledForm?: boolean;
  acceptForm?: string;
  maxSizeForm?: number;
  onPreview?: any;
}

interface MultipleField {
  id: number;
  path: string;
  name: string;
  size: string;
  // size: number;
}

export function MultipleDropzoneField<TFormFields extends FieldValues = FieldValues>({
  label = 'Attachment',
  name,
  control,
  onRemove,
  disabledForm,
  acceptForm = '*',
  maxSizeForm = 10,
  onPreview,
  ...dropzoneOptions
}: MultipleDropzoneFieldProps<TFormFields>) {
  const [attachments, setAttachments] = useState([]);
  const theme = useTheme();
  const { fieldState } = useController({ control, name });
  const { fields, append, remove } = useFieldArray({ control, name: name as any, keyName: '_id' });
  const watchFields = useWatch({
    control,
    name: name as any,
  });
  const { getRootProps, getInputProps } = useDropzone({
    ...dropzoneOptions,
    multiple: true,
    onDropAccepted: (files, event) => {
      const MAX_SIZE = maxSizeForm * 1024 * 1024; // 5MB in bytes
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

      dropzoneOptions.onDropAccepted?.(files, event);

      // append(files as any);
    },
  });

  const hasError = !!fieldState.error;
  const fieldError = fieldState.error?.message;

  React.useEffect(() => {
    setAttachments(watchFields);
  }, [watchFields]);

  React.useEffect(() => {
    if (fieldError) {
      toast.error(fieldError);
    }
  }, [fieldError]);

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
    <Stack spacing={2}>
      <Stack spacing={2}>
        <FormLabel sx={{ px: 2, py: 0 }}>{label ?? 'Attachment'}</FormLabel>
        <input
          {...getInputProps()}
          style={{ display: 'none' }}
          type="file"
          accept={acceptForm}
          disabled={!disabledForm}
        />

        <FormControl
          component="div"
          {...getRootProps({
            // https://github.com/react-dropzone/react-dropzone/issues/182#issuecomment-466629651
            onClick: (event: any) => event.preventDefault(),
          })}
        >
          <Box
            sx={{
              display: 'flex',
              cursor: 'pointer',
              border: 1,
              borderColor: hasError ? theme.palette.error.main : theme.palette.grey[500],
              borderStyle: 'dashed',
              borderRadius: 4,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              padding: 16,
              height: '200px',
              position: 'relative',
              textAlign: 'center',
              width: '100%',
              '&:hover': {
                backgroundColor: theme.palette.grey[100],
                cursor: 'pointer',
              },
            }}
          >
            <Typography color="gray.600">Choose or drop your image into this box</Typography>
          </Box>
        </FormControl>

        {hasError ? (
          <FormHelperText sx={{ color: 'error.main' }}>{fieldError}</FormHelperText>
        ) : null}
      </Stack>

      {attachments?.length > 0 &&
        attachments?.map((field: any, index) => {
          const { id: fileId, name: savedFileName, path = '' } = field as unknown as MultipleField;
          const fileName = savedFileName || path.split('/').pop();

          return (
            <Box
              key={fileId}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              border="1px solid rgba(145, 158, 171, 0.32)"
              borderRadius={1}
              px={1}
              py={2}
            >
              <Stack
                direction="row"
                spacing={1}
                flexGrow={1}
                width="90%"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onPreview) {
                    // const fileExtension = field.name?.toLowerCase().split('.').pop() || '';
                    // const nonPreviewableExtensions = ['xlsx', 'xls', 'doc', 'docx', 'csv'];

                    // if (nonPreviewableExtensions.includes(fileExtension)) {
                    //   return;
                    // }

                    onPreview({
                      isOpen: true,
                      url: field.url || URL.createObjectURL(field),
                      path: field.name,
                    });
                  }
                }}
              >
                <Iconify icon="solar:document-outline" />

                <Typography
                  fontWeight={500}
                  fontSize={14}
                  lineHeight="20px"
                  color="#212B36"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {fileName}
                </Typography>
              </Stack>

              <IconButton
                aria-label={`remove ${fileName}`}
                onClick={() => {
                  if (!disabledForm) {
                    onShowErrorToast();
                  } else {
                    remove(index);
                    onRemove?.(fileId);
                  }
                }}
              >
                <Iconify icon="mdi:close" />
              </IconButton>
            </Box>
          );
        })}

      {/* {fields.length > 0 ? (
        <Box display="flex" justifyContent="flex-end">
          <Button
            size="small"
            color="error"
            variant="text"
            onClick={() => {
              remove();
              onRemove?.();
            }}
            sx={{ width: 'fit-content' }}
          >
            Remove all
          </Button>
        </Box>
      ) : null} */}
    </Stack>
  );
}
