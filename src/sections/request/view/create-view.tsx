import React, { useEffect, useRef } from 'react';
import Typography from '@mui/material/Typography';
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  IconButton,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { Form } from 'src/components/form/form';
import { useParams } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { useAuth } from 'src/sections/auth/providers/auth';
import { getFileExtension } from 'src/utils/get-file-format';
import type { RequestDTO } from 'src/services/request/schemas/request-schema';
import { useClientUsers, useUsers } from 'src/services/master-data/user';
import { useAddRequest, useCitoById } from 'src/services/request';
import {
  useCategoryByCompanyId,
  useCompanyById,
  useInternalCompanies,
  useProductByCompanyId,
} from 'src/services/master-data/company';
import { Bounce, toast } from 'react-toastify';
import ModalDialog from 'src/components/modal/modal';
import { SvgColor } from 'src/components/svg-color';
import PdfPreview from 'src/utils/pdf-viewer';
import { uploadFilesBulk } from 'src/services/utils/upload-image';
import FilePreview from 'src/utils/file-preview';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { Iconify } from 'src/components/iconify';

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
interface Attachment {
  file_path: string;
  file_name: string;
}

export function CreateRequestView() {
  const { user } = useAuth();
  const userType = user.user_info.user_type;
  const { vendor } = useParams();
  const clientCompanyId = user?.user_info?.company?.id;
  const idCurrentCompany = user?.internal_companies?.find(
    (item) => item?.company?.name?.toLowerCase() === vendor
  )?.company?.id;
  const [selectedCompanyId, setSelectedCompanyId] = React.useState('');
  const { data: cito } = useCitoById(
    userType === 'client' ? clientCompanyId.toString() : selectedCompanyId
  );

  const { data: products } = useProductByCompanyId(
    userType === 'client' ? clientCompanyId : (Number(selectedCompanyId) ?? 0),
    true,
    () => {},
    idCurrentCompany
  );
  const { data: categories } = useCategoryByCompanyId(idCurrentCompany ?? 0);
  const [files, setFiles] = React.useState<FileList | any>([]);
  const { data: clientUsers } = useClientUsers(String(idCurrentCompany));
  const { mutate: addRequest } = useAddRequest();

  const [selectedCompany, setSelectedCompany] = React.useState('');
  const [selectedDepartment, setSelectedDepartment] = React.useState('');
  const [attachments, setAttachments] = React.useState<Attachment[]>([]);
  const [attachmentIdx, setAttachmentIdx] = React.useState(0);
  const [isImagePreviewModal, setIsImagePreviewModal] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState('');
  const [loaded, setLoaded] = React.useState(false);
  const messageRef = useRef<HTMLParagraphElement | null>(null);
  const ffmpegRef = useRef(new FFmpeg());
  const [ffmpegLoaded, setFfmpegLoaded] = React.useState(false);
  const [videoFiles, setVideoFiles] = React.useState<VideoFile[]>([]);
  // const [_, uploadOrDeleteFileFn] = useMutationAttachment(Number(taskId) ?? 0);
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
    } catch (errors) {
      console.error('Failed to load FFmpeg:', errors);
      setLoaded(false);
      toast.error('Failed to initialize video compression');
    }
  };

  useEffect(() => {
    load();
  }, []);

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
      const datas = await ffmpeg.readFile(outputFile);

      // @ts-ignore
      const blob = new Blob([datas.buffer], { type: 'video/mp4' });

      const compressedFile = new File([blob], `compressed_${videoFile.file.name}`, {
        type: 'video/mp4',
        lastModified: new Date().getTime(),
      });

      setVideoFiles((prev: any) => prev.filter((f: any) => f.id !== videoFile.id));
      setFiles((prev: any) => [...prev, compressedFile]);
      const videoData = new FormData();
      videoData.append(`files`, compressedFile as unknown as File);
      const { data } = await uploadFilesBulk(videoData);
      setAttachments((prev) => [
        ...prev,
        ...(data?.map((item) => ({
          file_path: item?.path,
          file_name: item?.filename,
        })) || []),
      ]);
      // await toast.promise(
      //   uploadOrDeleteFileFn({
      //     kind: 'create',
      //     taskId: Number(taskId) || 0,
      //     files: [compressedFile],
      //   }),
      //   {
      //     pending: 'Uploading...',
      //     error: {
      //       // @ts-ignore @typescript-eslint/no-shadow
      //       render: ({ data: resp }) => resp?.message || 'Upload failed',
      //     },
      //   }
      // );

      // queryClient.invalidateQueries({
      //   queryKey: taskId ? ['task', `task-detail=${taskId}`] : ['task'],
      // });

      // Cleanup FFmpeg files
      await ffmpeg.deleteFile(inputFile);
      await ffmpeg.deleteFile(outputFile);
    } catch (errors: any) {
      console.error('Transcode failed:', errors);
      setVideoFiles((prev) =>
        prev.map((f) =>
          f.id === videoFile.id ? { ...f, status: 'error', errorMessage: errors.message } : f
        )
      );
      // toast.error(`Failed to compress video: ${error.message}`);
    }
  };

  const onPreviewFile = (fileName: string, index: number) => {
    const fileExtension = getFileExtension(fileName);
    const allowedExtensions = [
      'jpg',
      'jpeg',
      'png',
      'gif',
      'bmp',
      'webp',
      'svg',
      'xls',
      'xlsx',
      'doc',
      'docx',
      'pdf',
    ];
    const isAllowedExtensions = allowedExtensions.includes(fileExtension);

    if (isAllowedExtensions) {
      setIsImagePreviewModal(true);
      setSelectedImage(fileName);
      setAttachmentIdx(index);
    }
  };

  let payload = {};
  const handleSubmit = (formData: RequestDTO) => {
    if (user?.user_info?.user_type === 'client') {
      payload = {
        ...formData,
        creator_id: user?.id,
        user_id: user?.id,
        company_id: user?.user_info?.company?.id,
        department_id: user?.user_info?.department?.id,
        assignee_company_id: idCurrentCompany,
        attachments,
      };
    } else {
      payload = {
        ...formData,
        creator_id: user?.id,
        assignee_company_id: idCurrentCompany,
        attachments,
      };
    }
    addRequest(payload);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const formData = new FormData();
    const videoFilesData = Array.from(e.target.files || []);

    if (e.target.files) {
      const size = e.target.files[0]?.size;

      if (size > 5000000) {
        const reason = `File is larger than ${Math.round(5000000 / 1000000)} mb`;
        toast.error(reason, {
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
      } else {
        const videoFile: any = videoFilesData
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

        const otherFile = videoFilesData.filter((file) => {
          const extension = file.name.toLowerCase().split('.').pop() || '';
          return !['mp4', 'avi', 'mov', 'ogg', 'mkv'].includes(extension);
        });

        otherFile.forEach((file) => {
          formData.append('files', file);
        });
        const extension = e.target.files[0]?.name.toLowerCase().split('.').pop() || '';
        const isVideo = ['mp4', 'avi', 'mov', 'ogg', 'mkv'].includes(extension);
        if (!isVideo) {
          const selectedFiles = Array.from(e.target.files as ArrayLike<File>);
          const mergedFiles = [...files, ...selectedFiles];
          if (e.target.files) {
            setFiles(mergedFiles);
            const filesData = new FormData();
            filesData.append(`files`, e.target.files[0] as unknown as File);
            const { data } = await uploadFilesBulk(filesData);
            setAttachments((prev) => [
              ...prev,
              ...(data?.map((item) => ({
                file_path: item?.path,
                file_name: item?.filename,
              })) || []),
            ]);
          }
        }
      }
    }
  };

  const onRemoveFile = (index: number) => {
    const newFiles = files?.filter((file: any, indexItem: number) => indexItem !== index);
    const newAttachments = attachments?.filter((_: any, indexItem: number) => indexItem !== index);
    setFiles(newFiles);
    setAttachments(newAttachments);
  };

  const requesterList =
    clientUsers &&
    clientUsers?.map((clientUser) => ({
      label: clientUser?.user_info?.name,
      id: clientUser?.id,
      company_id: clientUser?.user_info?.company_id,
      company_name: clientUser?.user_info?.company?.name,
      department_id: clientUser?.user_info?.department_id,
      department_name: clientUser?.user_info?.department?.name,
    }));

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
        Request Detail
      </Typography>
      <Box display="flex" gap={2} sx={{ mb: { xs: 3, md: 5 } }}>
        <Typography>Request</Typography>
        <Typography color="grey.500">•</Typography>
        <Typography color="grey.500">{vendor?.toUpperCase()} Request Management</Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: { xs: 3, md: 5 }, ml: 0 }}>
        <Form width="100%" onSubmit={handleSubmit}>
          {({ register, formState, watch, setValue }) => (
            <Grid container spacing={3} xs={12}>
              <Grid item xs={12} md={12}>
                {user?.user_info?.user_type === 'client' ? (
                  <Stack
                    justifyContent="space-between"
                    gap={3}
                    alignItems="center"
                    direction={{ xs: 'column', md: 'row' }}
                    bgcolor="blue.50"
                    p={2}
                    borderRadius={2}
                  >
                    <Stack
                      sx={{
                        width: { xs: '100%', md: '25%' },
                      }}
                      display="flex"
                      flexDirection="column"
                      gap={0.5}
                    >
                      <Typography color="grey.600">Requester Name</Typography>
                      <Typography>{user?.user_info?.name}</Typography>
                    </Stack>

                    <Stack
                      sx={{
                        width: { xs: '100%', md: '25%' },
                      }}
                      display="flex"
                      flexDirection="column"
                      gap={0.5}
                    >
                      <Typography color="grey.600">Company</Typography>
                      <Typography>{user?.user_info?.company?.name}</Typography>
                    </Stack>

                    <Stack
                      sx={{
                        width: { xs: '100%', md: '25%' },
                      }}
                      display="flex"
                      flexDirection="column"
                      gap={0.5}
                    >
                      <Typography color="grey.600">Division</Typography>
                      <Typography>{user?.user_info?.department?.name}</Typography>
                    </Stack>

                    <Stack
                      sx={{
                        width: { xs: '100%', md: '25%' },
                      }}
                      display="flex"
                      flexDirection="column"
                      gap={0.5}
                    >
                      <Typography color="grey.600">Role</Typography>
                      <Typography>{user?.user_info?.role?.name}</Typography>
                    </Stack>
                  </Stack>
                ) : (
                  <Stack
                    justifyContent="space-between"
                    gap={3}
                    alignItems="center"
                    direction={{ xs: 'column', md: 'row' }}
                  >
                    <Box
                      sx={{
                        width: { xs: '100%', md: '25%' },
                      }}
                    >
                      <Autocomplete
                        disablePortal
                        id="combo-box-requester"
                        options={requesterList ?? []}
                        sx={{
                          width: '100%',
                        }}
                        onChange={(_event: any, newValue: any) => {
                          setValue('user_id', newValue?.id);
                          setValue('company_id', newValue?.company_id);
                          setValue('department_id', newValue?.department_id);
                          setSelectedCompany(newValue?.company_name);
                          setSelectedCompanyId(newValue?.company_id.toString());
                          setSelectedDepartment(newValue?.department_name);
                        }}
                        value={watch('user_id')}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={Boolean(formState?.errors?.user_id)}
                            label="Requester"
                          />
                        )}
                      />
                      {formState?.errors?.user_id && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {String(formState?.errors?.user_id?.message)}
                        </FormHelperText>
                      )}
                    </Box>
                    <Box
                      sx={{
                        width: { xs: '100%', md: '25%' },
                      }}
                    >
                      <TextField
                        error={Boolean(formState?.errors?.company_id)}
                        sx={{
                          width: '100%',
                        }}
                        label="Company"
                        autoComplete="off"
                        value={watch('user_id') !== undefined ? selectedCompany : ''}
                        disabled
                      />
                      {formState?.errors?.company_id && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {String(formState?.errors?.company_id?.message)}
                        </FormHelperText>
                      )}
                    </Box>
                    <Box
                      sx={{
                        width: { xs: '100%', md: '25%' },
                      }}
                    >
                      <TextField
                        error={Boolean(formState?.errors?.department_id)}
                        sx={{
                          width: '100%',
                        }}
                        label="Division"
                        autoComplete="off"
                        value={watch('user_id') !== undefined ? selectedDepartment : ''}
                        disabled
                      />
                      {formState?.errors?.department_id && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {String(formState?.errors?.department_id?.message)}
                        </FormHelperText>
                      )}
                    </Box>
                    <Box
                      sx={{
                        width: { xs: '100%', md: '25%' },
                      }}
                    >
                      <TextField
                        error={Boolean(formState?.errors?.title)}
                        sx={{
                          width: '100%',
                        }}
                        label="Title"
                        {...register('title', {
                          required: 'Title must be filled out',
                        })}
                        autoComplete="off"
                      />
                      {formState?.errors?.title && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {String(formState?.errors?.title?.message)}
                        </FormHelperText>
                      )}
                    </Box>
                  </Stack>
                )}
              </Grid>

              <Grid item xs={12} md={12}>
                <Stack direction="row" gap={3} alignItems="center">
                  <Box
                    sx={{
                      width: { xs: '100%', md: '48%' },
                    }}
                  >
                    <TextField
                      error={Boolean(formState?.errors?.name)}
                      sx={{
                        width: '100%',
                      }}
                      label="Name"
                      {...register('name', {
                        required: 'Name must be filled out',
                      })}
                      autoComplete="off"
                    />
                    {formState?.errors?.name && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {String(formState?.errors?.name?.message)}
                      </FormHelperText>
                    )}
                  </Box>
                </Stack>
              </Grid>

              <Grid item xs={12} md={12}>
                <Stack direction="row" gap={3} alignItems="center">
                  <Box
                    sx={{
                      width: { xs: '100%', md: '25%' },
                    }}
                  >
                    <FormControl fullWidth>
                      <InputLabel id="select-category">Product</InputLabel>
                      <Select
                        labelId="select-category"
                        error={Boolean(formState?.errors?.product_id)}
                        {...register('product_id', {
                          required: 'Product must be filled out',
                        })}
                        label="Product"
                      >
                        {products?.map((product) => (
                          <MenuItem value={product?.id}>{product?.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {formState?.errors?.product_id && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {String(formState?.errors?.product_id?.message)}
                      </FormHelperText>
                    )}
                  </Box>
                  <Box
                    sx={{
                      width: { xs: '100%', md: '25%' },
                    }}
                  >
                    <FormControl fullWidth>
                      <InputLabel id="select-category">Category</InputLabel>
                      <Select
                        labelId="select-category"
                        error={Boolean(formState?.errors?.category_id)}
                        {...register('category_id', {
                          required: 'Category must be filled out',
                        })}
                        label="Category"
                      >
                        {categories?.map((category) => (
                          <MenuItem value={category?.id}>{category?.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {formState?.errors?.category_id && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {String(formState?.errors?.category_id?.message)}
                      </FormHelperText>
                    )}
                  </Box>
                  <Box
                    sx={{
                      width: { xs: '100%', md: '45%' },
                    }}
                  >
                    <Typography fontWeight="bold">CITO Status</Typography>

                    <Box display="flex" alignItems="center" gap={2}>
                      <FormControlLabel
                        control={<Checkbox {...register('is_cito')} />}
                        label="Request CITO"
                      />
                      {selectedCompanyId !== '' && (
                        <Typography>
                          {cito?.used}/{cito?.quota} used
                        </Typography>
                      )}
                      {user.user_info.user_type === 'client' && (
                        <Typography>
                          {cito?.used}/{cito?.quota} used
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      width: { xs: '100%', md: '25%' },
                    }}
                  />
                  <Box
                    sx={{
                      width: { xs: '100%', md: '25%' },
                    }}
                  />
                </Stack>
              </Grid>

              <Grid item xs={12} md={12}>
                <TextField
                  error={Boolean(formState?.errors?.description)}
                  sx={{
                    width: '100%',
                  }}
                  multiline
                  rows={4}
                  label="Request Description"
                  {...register('description', {
                    required: 'Request Description must be filled out',
                  })}
                />
                {formState?.errors?.description && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {String(formState?.errors?.description?.message)}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} md={12}>
                <FormControl fullWidth>
                  <Typography mb={1}>Attachment</Typography>
                  {videoFiles.length > 0 && (
                    <Typography mb={2}>Compressing the video, please wait...</Typography>
                  )}
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
                          mb={2}
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
                  {files?.length > 0 ? (
                    <>
                      {Array.from(files)?.map((file: any, index: number) => (
                        <Box
                          display="flex"
                          flexDirection="column"
                          gap={3}
                          p={4}
                          mb={3}
                          sx={{ border: 1, borderRadius: 1, borderColor: 'grey.500' }}
                        >
                          <Box
                            display="flex"
                            width="100%"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Box display="flex" gap={1} alignItems="center">
                              <Box component="img" src="/assets/icons/file.png" />
                              <ModalDialog
                                onClose={() => {
                                  setIsImagePreviewModal(false);
                                  setSelectedImage('');
                                }}
                                open={isImagePreviewModal && selectedImage === file?.name}
                                setOpen={setIsImagePreviewModal}
                                minWidth={600}
                                title="Preview"
                                content={
                                  (
                                    <>
                                      {file?.type === 'application/pdf' ? (
                                        <PdfPreview pdfFile={URL.createObjectURL(file)} />
                                      ) : file?.type === 'application/msword' ||
                                        file?.type === 'application/vnd.ms-excel' ? (
                                        <FilePreview
                                          fileUrl={`${attachments[attachmentIdx]?.file_path}/${attachments[attachmentIdx]?.file_name}`}
                                        />
                                      ) : (
                                        <Box
                                          component="img"
                                          sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            mt: 4,
                                            maxHeight: '500px',
                                            mx: 'auto',
                                          }}
                                          src={URL.createObjectURL(file)}
                                        />
                                      )}
                                    </>
                                  ) as JSX.Element & string
                                }
                              >
                                <Box
                                  sx={{ cursor: 'pointer' }}
                                  onClick={() => onPreviewFile(file?.name, index)}
                                >
                                  <Typography fontWeight="bold">{file?.name}</Typography>
                                  {(file.size / (1024 * 1024)).toFixed(2)} Mb
                                </Box>
                              </ModalDialog>
                            </Box>
                            <Box sx={{ cursor: 'pointer' }} onClick={() => onRemoveFile(index)}>
                              <SvgColor
                                sx={{ width: 10, height: 10 }}
                                src="/assets/icons/ic-cross.svg"
                              />
                            </Box>
                          </Box>
                        </Box>
                      ))}
                    </>
                  ) : null}
                  {/* <InputLabel id="attachment-files">Attachment</InputLabel> */}
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.gif,.bmp,.webp,.svg,.xls,.xlsx,.doc,.docx,.pdf,.mov,.mp4,.avi"
                    id="upload-files"
                    hidden
                    onChange={handleFileChange}
                    multiple
                  />
                  <Button
                    type="button"
                    sx={{
                      padding: 0,
                      border: 1,
                      borderColor: 'primary.main',
                      width: '200px',
                    }}
                  >
                    <FormLabel
                      sx={{
                        color: 'primary.main',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        width: '100%',
                        padding: '6px 8px',
                      }}
                      htmlFor="upload-files"
                    >
                      {files?.length === 0 ? 'Upload attachment' : 'Upload Additional Files'}
                    </FormLabel>
                  </Button>
                </FormControl>
              </Grid>
              <Box
                display="flex"
                justifyContent="end"
                width="100%"
                sx={{
                  mt: 4,
                }}
                gap={3}
              >
                <Button
                  sx={{
                    border: 1,
                    borderColor: 'primary',
                  }}
                >
                  Back
                </Button>
                <LoadingButton
                  size="small"
                  loadingIndicator="Submitting..."
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{
                    width: 120,
                  }}
                >
                  Send Request
                </LoadingButton>
              </Box>
            </Grid>
          )}
        </Form>
      </Grid>
    </DashboardContent>
  );
}
