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
  type FieldError,
  type FieldErrorsImpl,
  type Merge,
  type FieldValues,
  type UseControllerProps,
} from 'react-hook-form';
import { Bounce, toast } from 'react-toastify';
import { Iconify } from 'src/components/iconify';

const acceptedFileExtension = {
  'image/*': ['.png', '.jpg', '.jpeg'],
};

export interface FieldDropzoneProps<TFormFields extends FieldValues = FieldValues> {
  label?: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  helperText?: string;
  defaultImage?: string;
  controller: UseControllerProps<TFormFields>;
  isDisabled?: boolean;
  maxSize?: number;
}

export function FieldDropzone(props: FieldDropzoneProps) {
  const { helperText, error, ...restProps } = props;

  return (
    <Stack spacing={2}>
      <Dropzone {...restProps} />

      <FormHelperText>{helperText}</FormHelperText>
      {error ? (
        <FormHelperText sx={{ color: 'error.main' }}>{error?.message as any}</FormHelperText>
      ) : null}
    </Stack>
  );
}

function Dropzone<TFormFields extends Record<string, unknown> = Record<string, unknown>>(
  props: Omit<FieldDropzoneProps<TFormFields>, 'helperText'>
) {
  const { defaultImage, controller, label } = props;
  const theme = useTheme();
  const [preview, setPreview] = React.useState<string>();
  const { field, formState, fieldState } = useController(controller);
  const { isDisabled, maxSize } = props;
  const { getRootProps, getInputProps } = useDropzone({
    accept: acceptedFileExtension,
    disabled: isDisabled,
    maxSize,
    onDropAccepted: (acceptedFiles) => {
      const [newFile] = acceptedFiles;

      setPreview(URL.createObjectURL(newFile));
      field.onChange(newFile);
    },
    onDropRejected: (fileRejections) => {
      const [{ errors }] = fileRejections;
      const [{ message }] = errors;

      toast.error(message, {
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
    },
  });

  const fieldError = fieldState.error?.message;

  React.useEffect(() => {
    if (fieldError) {
      toast.error('Oops', {
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
    }
  }, [fieldError]); // eslint-disable-line react-hooks/exhaustive-deps -- excluding `toast`

  React.useEffect(
    () => () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    },
    [preview]
  );

  function handleLoadImage() {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
  }

  const image = preview || defaultImage;

  return (
    <FormControl
      component="div"
      {...getRootProps({
        // https://github.com/react-dropzone/react-dropzone/issues/182#issuecomment-466629651
        onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => event.preventDefault(),
      })}
    >
      <FormLabel
        component="label"
        sx={{
          display: 'flex',
          cursor: 'pointer',
          border: 1,
          borderColor: formState?.errors?.photo
            ? theme.palette.error.main
            : theme.palette.grey[500],
          borderStyle: 'dashed',
          borderRadius: 4,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          padding: 16,
          height: '200px',
          position: 'relative',
          width: '100%',
          '&:hover': {
            backgroundColor: theme.palette.grey[100],
            cursor: 'pointer',
          },
        }}
      >
        {image ? (
          <Box
            component="img"
            alt="image"
            sx={{
              maxHeight: '200px',
              borderRadius: 4,
            }}
            onLoad={() => handleLoadImage()}
            src={image}
          />
        ) : (
          <Box textAlign="center" p={2}>
            <Typography>{label ?? 'Upload picture'}</Typography>
            <Typography color="gray.600">or drop your image into this box</Typography>
          </Box>
        )}

        <input
          {...getInputProps()}
          id={field.name}
          name={field.name}
          style={{ display: 'none' }}
          type="file"
          disabled={isDisabled}
        />
      </FormLabel>
    </FormControl>
  );
}

interface MultipleDropzoneFieldProps<TFormFields extends FieldValues = FieldValues>
  extends DropzoneOptions,
    UseControllerProps<TFormFields> {
  label?: string;
  onRemove?: (fileId?: number) => void;
}

interface MultipleField {
  id: number;
  path: string;
  name: string;
  // size: number;
}

export function MultipleDropzoneField<TFormFields extends FieldValues = FieldValues>({
  label = 'Attachment',
  name,
  control,
  onRemove,
  ...dropzoneOptions
}: MultipleDropzoneFieldProps<TFormFields>) {
  const theme = useTheme();
  const { fieldState } = useController({ control, name });
  const { fields, append, remove } = useFieldArray({ control, name: name as any, keyName: '_id' });
  const { getRootProps, getInputProps } = useDropzone({
    ...dropzoneOptions,
    multiple: true,
    onDropAccepted: (files, event) => {
      dropzoneOptions.onDropAccepted?.(files, event);
      append(files as any);
    },
  });

  const hasError = !!fieldState.error;
  const fieldError = fieldState.error?.message;

  React.useEffect(() => {
    if (fieldError) {
      toast.error(fieldError);
    }
  }, [fieldError]);

  return (
    <Stack spacing={2}>
      <Stack spacing={2}>
        <FormLabel sx={{ px: 2, py: 0 }}>{label ?? 'Attachment'}</FormLabel>
        <input {...getInputProps()} style={{ display: 'none' }} type="file" />

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

      {fields.map((field, index) => {
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
            <Stack direction="row" spacing={1} flexGrow={1} width="90%">
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
                remove(index);
                onRemove?.(fileId);
              }}
            >
              <Iconify icon="mdi:close" />
            </IconButton>
          </Box>
        );
      })}

      {fields.length > 0 ? (
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
      ) : null}
    </Stack>
  );
}
