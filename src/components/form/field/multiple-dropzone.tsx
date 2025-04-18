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
import { useEffect, useRef, useState } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';

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

interface VideoFile {
  id: string;
  file: File;
  originalSize: string;
  compressedSize: string;
  status: 'pending' | 'compressing' | 'done' | 'error';
  errorMessage?: string;
  originalUrl?: string;
  compressedUrl?: string;
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
  const [videoFiles, setVideoFiles] = useState<VideoFile[]>([]);
  const [attachments, setAttachments] = useState([]);
  const theme = useTheme();
  const ffmpegRef = useRef(new FFmpeg());
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);
  const { fieldState } = useController({ control, name });
  const [loaded, setLoaded] = useState(false);
  const messageRef = useRef<HTMLParagraphElement | null>(null);
  const { remove } = useFieldArray({ control, name: name as any, keyName: '_id' });
  const watchFields = useWatch({
    control,
    name: name as any,
  });
  const { getRootProps, getInputProps } = useDropzone({
    ...dropzoneOptions,
    multiple: true,
    onDropAccepted: async (files, event) => {
      const MAX_SIZE = maxSizeForm * 1024 * 1024;
      const oversizedFiles = files.filter((file) => file.size > MAX_SIZE);

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
        setVideoFiles((prev) => [...prev, ...videoFile]);
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
      dropzoneOptions.onDropAccepted?.(otherFile, event);
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

  // Add this near the top of the component

  const load = async () => {
    try {
      // Check if FFmpeg is already loaded
      if (ffmpegRef.current.loaded) {
        setLoaded(true);
        return;
      }

      setLoaded(true);
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm';
      const ffmpeg = ffmpegRef.current;

      // Try to load from cache first
      const cacheKey = 'ffmpeg-core-cache';
      let coreModule;
      let wasmModule;
      let workerModule;

      try {
        const cache = await caches.open(cacheKey);
        coreModule = await cache.match(`${baseURL}/ffmpeg-core.js`);
        wasmModule = await cache.match(`${baseURL}/ffmpeg-core.wasm`);
        workerModule = await cache.match(`${baseURL}/ffmpeg-core.js`);
      } catch (e) {
        console.log('Cache not available:', e);
      }

      // Configure FFmpeg
      ffmpeg.on('log', ({ message }) => {
        if (messageRef.current) messageRef.current.innerText = message;
      });

      // Load FFmpeg with cached or new modules
      await ffmpeg.load({
        coreURL: coreModule
          ? URL.createObjectURL(await coreModule.blob())
          : await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: wasmModule
          ? URL.createObjectURL(await wasmModule.blob())
          : await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        workerURL: workerModule
          ? URL.createObjectURL(await workerModule.blob())
          : await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      });

      // Cache the modules for future use
      try {
        const cache = await caches.open(cacheKey);
        if (!coreModule) await cache.add(`${baseURL}/ffmpeg-core.js`);
        if (!wasmModule) await cache.add(`${baseURL}/ffmpeg-core.wasm`);
        if (!workerModule) await cache.add(`${baseURL}/ffmpeg-core.worker.js`);
      } catch (e) {
        console.log('Failed to cache FFmpeg modules:', e);
      }

      console.log('FFmpeg loaded successfully');
      ffmpegRef.current = ffmpeg;
      setLoaded(true);
      setFfmpegLoaded(true);
    } catch (error) {
      console.error('Failed to load FFmpeg:', error);
      setLoaded(false);
      toast.error('Failed to initialize video compression');
    }
  };

  useEffect(() => {
    load();
  }, []);

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

  const transcode = async (videoFile: VideoFile) => {
    try {
      setVideoFiles((prev) =>
        prev.map((f) => (f.id === videoFile.id ? { ...f, status: 'compressing' } : f))
      );

      const ffmpeg = ffmpegRef.current;
      const inputFile = videoFile.file.name;
      const outputFile = `compressed_${videoFile.file.name.split('.')[0]}.mp4`;

      // Clean up any existing URLs and files
      if (videoFile.compressedUrl) {
        URL.revokeObjectURL(videoFile.compressedUrl);
      }

      // await ffmpeg.deleteFile(inputFile);
      // await ffmpeg.deleteFile(outputFile);

      const fileData = await fetchFile(videoFile.file);
      await ffmpeg.writeFile(inputFile, fileData);

      const result = await ffmpeg.exec([
        '-i',
        inputFile,
        '-vf',
        "scale='min(720,iw)':min'(720,ih)':force_original_aspect_ratio=decrease",
        '-c:v',
        'libx264',
        '-crf',
        '28',
        '-preset',
        'ultrafast',
        '-tune',
        'film',
        '-c:a',
        'aac',
        '-b:a',
        '128k',
        '-movflags',
        '+faststart',
        '-threads',
        '0',
        outputFile,
      ]);
      const data = await ffmpeg.readFile(outputFile);

      // @ts-ignore
      const blob = new Blob([data.buffer], { type: 'video/mp4' });

      const compressedFile = new File([blob], `compressed_${videoFile.file.name}`, {
        type: 'video/mp4',
        lastModified: new Date().getTime(),
      });

      setVideoFiles((prev) => prev.filter((f) => f.id !== videoFile.id));
      dropzoneOptions.onDropAccepted?.([compressedFile], {} as any);

      // Cleanup FFmpeg files
      await ffmpeg.deleteFile(inputFile);
      await ffmpeg.deleteFile(outputFile);
    } catch (error: any) {
      console.error('Transcode failed:', error);
      setVideoFiles((prev) =>
        prev.map((f) =>
          f.id === videoFile.id ? { ...f, status: 'error', errorMessage: error.message } : f
        )
      );
      // toast.error(`Failed to compress video: ${error.message}`);
    }
  };

  return (
    <Stack spacing={2}>
      <Stack spacing={2}>
        <FormLabel sx={{ py: 0 }}>{label ?? 'Attachment'}</FormLabel>
        {!loaded && <Typography fontSize={14}>Initializing video compression module...</Typography>}
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

      {videoFiles.length > 0 && <Typography>Compressing the video, please wait...</Typography>}
      {videoFiles?.length > 0 &&
        videoFiles?.map((item, index) => {
          const { id, status } = item;
          return (
            <Box
              key={index}
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
                  {item.file.name}
                </Typography>
              </Stack>

              <IconButton
                aria-label={`status ${item.file.name}`}
                disabled={status === 'compressing'}
                onClick={() => {
                  if (status !== 'compressing') {
                    setVideoFiles((prev) => prev.filter((f) => f.id !== id));
                  }
                }}
              >
                {status === 'compressing' ? (
                  <Iconify icon="eos-icons:loading" className="animate-spin" />
                ) : (
                  <Iconify icon="mdi:close" />
                )}
              </IconButton>
            </Box>
          );
        })}
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
