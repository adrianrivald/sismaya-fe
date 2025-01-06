import * as React from 'react';
import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import {
  useController,
  type FieldError,
  type FieldErrorsImpl,
  type Merge,
  type FieldValues,
  type UseControllerProps,
} from 'react-hook-form';
import { Bounce, toast } from 'react-toastify';

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
