import Typography from '@mui/material/Typography';
import {
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
  Autocomplete,
  Chip,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { Form } from 'src/components/form/form';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useAuth } from 'src/sections/auth/providers/auth';
import { RequestDTO } from 'src/services/request/schemas/request-schema';
import {
  useInternalProduct,
  useInternalUsers,
  useUserById,
  useUsers,
} from 'src/services/master-data/user';
import {
  useAddAttachment,
  useAddRequest,
  useAddRequestAssignee,
  useCitoById,
  useDeleteAttachmentById,
  useDeleteRequestAssigneeById,
  useRequestById,
  useUpdateRequest,
} from 'src/services/request';
import {
  useCategoryByCompanyId,
  useDivisionByCompanyId,
  useProductByCompanyId,
} from 'src/services/master-data/company';
import { SvgColor } from 'src/components/svg-color';
import { Bounce, toast } from 'react-toastify';
import { getFileExtension } from 'src/utils/get-file-format';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import ModalDialog from 'src/components/modal/modal';
import { useSearchDebounce } from 'src/utils/hooks/use-debounce';
import PdfPreview from 'src/utils/pdf-viewer';
import FilePreview from 'src/utils/file-preview';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { Iconify } from 'src/components/iconify';
import { AttachmentModal } from 'src/pages/task/attachment-modal';
import { useUserPermissions } from 'src/services/auth/use-user-permissions';
import {
  useAddRelatedDepartment,
  useDeleteRelatedDepartment,
} from 'src/services/request/use-related-department';
import { AddAssigneeModal } from '../add-assignee';

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

export function EditRequestView() {
  const { user } = useAuth();
  const { data: userPermissions } = useUserPermissions();

  const userType = user?.user_info?.user_type;
  const clientCompanyId = user?.user_info?.company?.id;
  const navigate = useNavigate();
  const { vendor, id } = useParams();
  const idCurrentCompany = user?.internal_companies?.find(
    (item) => item?.company?.name?.toLowerCase() === vendor
  )?.company?.id;

  const { data: requestDetail } = useRequestById(id ?? '');
  const { data: cito } = useCitoById(
    userType === 'client'
      ? clientCompanyId.toString()
      : (requestDetail?.company?.id?.toString() ?? '')
  );

  const { data: products } = useProductByCompanyId(
    userType === 'client' ? clientCompanyId : (requestDetail?.company?.id ?? 0),
    true
  );
  const { data: internalUser } = useInternalProduct(
    String(idCurrentCompany),
    String(requestDetail?.product?.id)
  );
  const { data: categories } = useCategoryByCompanyId(idCurrentCompany ?? 0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [files, setFiles] = React.useState<FileList | any>([]);
  const [searchTerm, setSearchTerm] = useSearchDebounce();

  const { data: divisions } = useDivisionByCompanyId(Number(requestDetail?.company?.id));
  const divisionList = divisions;
  const [attachmentModal, setAttachmentModal] = React.useState({
    isOpen: false,
    url: '',
    path: '',
  });
  const filteredInternalUser = internalUser?.filter((item) =>
    item?.user_info?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const [openAssigneeModal, setOpenAssigneeModal] = useState(false);

  const [dateValue, setDateValue] = useState<Dayjs | null>(dayjs(requestDetail?.start_date));
  const [endDateValue, setEndDateValue] = useState<Dayjs | null>(dayjs(requestDetail?.end_date));
  const { mutate: updateRequest } = useUpdateRequest(vendor ?? '');
  const { mutate: addAttachment } = useAddAttachment();
  const { mutate: deleteAttachmentById } = useDeleteAttachmentById();
  const defaultValues = {
    name: requestDetail?.name,
    creator_id: requestDetail?.creator?.id,
    user_id: user?.id,
    company_id: requestDetail?.company?.id,
    department_id: requestDetail?.department?.id,
    attachments: requestDetail?.attachments?.map((attachment) => ({
      file_path: attachment?.file_path,
      file_name: attachment?.file_name,
    })),
    category_id: requestDetail?.category?.id,
    description: requestDetail?.description,
    product_id: requestDetail?.product?.id,
    is_cito: requestDetail?.is_cito,
    related_department: requestDetail?.related_department
      ?.filter((item) => item.is_main !== true)
      .map((department) => department.department_id),
  };
  const { mutate: addRequestAssignee } = useAddRequestAssignee();
  const { mutate: deleteRequestAssignee } = useDeleteRequestAssigneeById();
  const { mutate: addRelatedDepartment } = useAddRelatedDepartment();
  const { mutate: deleteRelatedDepartment } = useDeleteRelatedDepartment();
  const [selectedPic, setSelectedPic] = React.useState<
    { id: number; picture: string; assignee_id?: number; name: string }[] | undefined
  >(
    requestDetail?.assignees?.map((item) => ({
      assignee_id: item?.assignee_id,
      picture: item?.assignee?.user_info?.profile_picture,
      id: item?.id,
      name: item?.assignee?.user_info?.name,
    }))
  );
  const [attachments, setAttachments] = React.useState<Attachment[]>([]);
  const [attachmentIdx, setAttachmentIdx] = React.useState(0);
  const [isCito, setIsCito] = React.useState(requestDetail?.is_cito);
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

      const filesArr = [compressedFile];
      addAttachment({
        request_id: Number(id),
        files: filesArr,
      });

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

  useEffect(() => {
    setSelectedPic(
      requestDetail?.assignees?.map((item) => ({
        assignee_id: item?.assignee_id,
        picture: item?.assignee?.user_info?.profile_picture,
        id: item?.id,
        name: item?.assignee?.user_info?.name,
      }))
    );
  }, [requestDetail]);

  const onSearchUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const onBackToDetail = () => {
    navigate(`/${vendor}/request/${id}`);
  };

  const handleSubmit = (formData: RequestDTO) => {
    // setIsLoading(true);
    console.log(formData, 'formdata');
    const payload = {
      ...formData,
      id: Number(id),
      is_cito: isCito,
      ...(requestDetail?.step === 'to_do' && { start_date: dateValue }),
      ...(requestDetail?.step === 'to_do' && { end_date: endDateValue }),
    };
    if (endDateValue?.isBefore(dateValue ?? dayjs())) {
      toast.error('End date must later than start date');
    } else {
      updateRequest(payload);
    }
    // setTimeout(() => {
    //   navigate('/request/test');
    //   setIsLoading(false);
    // }, 1000);
    // await createRequest(payload) //Todo: soon
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    // Convert FileList to an array and update state
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
          addAttachment({
            request_id: Number(id),
            files: e.target.files,
          });
        }
      }
    }
  };

  const handleChangeDate = (newValue: Dayjs | null) => {
    setDateValue(newValue);
    if (dayjs(endDateValue).isBefore(newValue)) {
      setEndDateValue(newValue);
    }
  };

  const handleChangeEndDate = (newValue: Dayjs | null) => {
    setEndDateValue(newValue);
  };

  const onDeleteAttachment = (attachmentId: number) => {
    deleteAttachmentById(attachmentId);
  };
  const handleAddPicItemFromDetail = (userId: number) => {
    addRequestAssignee({
      assignee_id: userId,
      request_id: Number(id),
    });
  };

  console.log(isCito, 'value');

  const handleDeletePicItemFromDetail = (_userId: number, assigneeId?: number) => {
    if (assigneeId) deleteRequestAssignee(assigneeId);
  };

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
        <Form
          width="100%"
          onSubmit={handleSubmit}
          options={{
            defaultValues: {
              ...defaultValues,
            },
          }}
        >
          {({ register, formState, watch, setValue }) => (
            <Grid container spacing={3} xs={12}>
              <Grid item xs={12} md={12}>
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
                    <Typography>{requestDetail?.requester?.name}</Typography>
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
                    <Typography>{requestDetail?.company?.name}</Typography>
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
                    <Typography>{requestDetail?.department?.name}</Typography>
                  </Stack>

                  <Stack
                    sx={{
                      width: { xs: '100%', md: '25%' },
                    }}
                    display="flex"
                    flexDirection="column"
                    gap={0.5}
                  >
                    <Typography color="grey.600">Job Title</Typography>
                    <Typography>{requestDetail?.requester?.title ?? '-'}</Typography>
                  </Stack>
                </Stack>
              </Grid>

              <Grid item xs={12} md={12}>
                <Stack direction="row" gap={3} alignItems="center">
                  <Box
                    sx={{
                      width: { xs: '100%', md: '50%' },
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
                      disabled={userType === 'internal'}
                    />
                    {formState?.errors?.name && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {String(formState?.errors?.name?.message)}
                      </FormHelperText>
                    )}
                  </Box>
                  <Box
                    sx={{
                      width: { xs: '100%', md: '50%' },
                    }}
                  >
                    <FormControl fullWidth>
                      <Autocomplete
                        disabled={!watch('company_id')}
                        multiple
                        options={
                          divisionList?.filter((item) => item.id !== watch('department_id')) || []
                        }
                        getOptionLabel={(option) => option.name}
                        value={(divisionList || [])?.filter((division) =>
                          (watch('related_department') || [])?.includes(division.id)
                        )}
                        onChange={(event, newValue) => {
                          const previousIds = watch('related_department') || [];
                          const newIds = newValue.map((division) => division.id);

                          const added = newIds.filter((newId) => !previousIds.includes(newId));
                          const removed = previousIds.filter(
                            (prevId: number) => !newIds.includes(prevId)
                          );
                          const removedRelatedId = requestDetail?.related_department?.find((item) =>
                            removed.includes(item.department_id)
                          )?.id;

                          if (added.length > 0) {
                            console.log('Added:', added);
                            addRelatedDepartment({
                              department_id: Number(added),
                              request_id: requestDetail?.id ?? 0,
                            });
                          }

                          if (removed.length > 0) {
                            console.log('Removed:', removed);
                            deleteRelatedDepartment(removedRelatedId ?? 0);
                          }

                          setValue('related_department', newIds);
                        }}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip
                              label={option.name}
                              {...getTagProps({ index })}
                              key={option.id}
                              sx={{
                                bgcolor: '#D6F3F9',
                                color: 'info.dark',
                              }}
                            />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Related Divisions"
                            label="Related Divisions"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        )}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                      />
                    </FormControl>
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
                        value={watch('product_id')}
                        disabled={userType === 'internal'}
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
                        value={watch('category_id')}
                        disabled={userType === 'internal'}
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
                      width: { xs: '100%', md: '35%' },
                    }}
                  >
                    <Typography fontWeight="bold">CITO Status</Typography>
                    <Box display="flex" alignItems="center" gap={2}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            onChange={(e) => {
                              setIsCito((prev) => !prev);
                            }}
                            value={isCito}
                            defaultChecked={isCito}
                            disabled={
                              userType === 'internal' ||
                              (userType === 'client' &&
                                requestDetail?.step?.toLowerCase() !== 'pending')
                            }
                          />
                        }
                        label="Request CITO"
                      />
                      <Typography>
                        {cito?.used}/{cito?.quota} used
                      </Typography>
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
                  disabled={userType === 'internal'}
                />
                {formState?.errors?.description && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {String(formState?.errors?.description?.message)}
                  </FormHelperText>
                )}
              </Grid>

              {userType === 'internal' &&
                (requestDetail?.step === 'to_do' || requestDetail?.step === 'in_progress') && (
                  <Grid item xs={12} md={12}>
                    <Box mt={4} display="flex" alignItems="center" gap={2}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                          sx={{
                            width: '300px',
                          }}
                          label="Start Date"
                          value={dateValue}
                          onChange={handleChangeDate}
                          // minDate={dayjs()}
                          // renderInput={(params: any) => <TextField {...params} />}
                        />
                      </LocalizationProvider>

                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                          sx={{
                            width: '300px',
                          }}
                          label="End Date"
                          value={endDateValue}
                          onChange={handleChangeEndDate}
                          minDate={dateValue ?? dayjs()}
                          // renderInput={(params: any) => <TextField {...params} />}
                        />
                      </LocalizationProvider>

                      <Box display="flex" flexDirection="column">
                        <Typography>PIC</Typography>
                        <Box display="flex" gap={2} alignItems="center">
                          <Box display="flex" alignItems="center">
                            {selectedPic?.map((item) => (
                              <Box
                                width={36}
                                height={36}
                                sx={{
                                  marginRight: '-10px',
                                }}
                              >
                                <Box
                                  component="img"
                                  src={
                                    item?.picture !== '' ? item?.picture : '/assets/icons/user.png'
                                  }
                                  sx={{
                                    cursor: 'pointer',
                                    borderRadius: 100,
                                    width: 36,
                                    height: 36,
                                    borderColor: 'white',
                                    borderWidth: 2,
                                    borderStyle: 'solid',
                                  }}
                                />
                              </Box>
                            ))}
                          </Box>
                          <ModalDialog
                            open={openAssigneeModal}
                            setOpen={setOpenAssigneeModal}
                            minWidth={600}
                            title="Assignee"
                            content={
                              (
                                <AddAssigneeModal
                                  internalUsers={filteredInternalUser}
                                  handleAddPicItem={handleAddPicItemFromDetail}
                                  selectedPic={selectedPic}
                                  handleDeletePicItem={handleDeletePicItemFromDetail}
                                  isDetail
                                  onSearchUser={onSearchUser}
                                  setOpenAssigneeModal={setOpenAssigneeModal}
                                />
                              ) as JSX.Element & string
                            }
                          >
                            <Box
                              component="button"
                              type="button"
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              sx={{
                                width: 36,
                                height: 36,
                                cursor: 'pointer',
                                paddingX: 1.5,
                                paddingY: 1.5,
                                border: 1,
                                borderStyle: 'dashed',
                                borderColor: 'grey.500',
                                borderRadius: 100,
                              }}
                            >
                              <SvgColor
                                color="#637381"
                                width={12}
                                height={12}
                                src="/assets/icons/ic-plus.svg"
                              />
                            </Box>
                          </ModalDialog>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                )}
              <Grid item xs={12} md={12}>
                <FormControl fullWidth>
                  <Typography mb={1}>Attachment</Typography>
                  {videoFiles.length > 0 && (
                    <Typography mb={2}>Compressing the video, please wait...</Typography>
                  )}
                  {videoFiles?.length > 0 &&
                    videoFiles?.map((item, index) => {
                      const { id: videoId, status } = item;
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
                                setVideoFiles((prev) => prev.filter((f) => f.id !== videoId));
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
                  {(requestDetail?.attachments ?? [])?.length > 0 || files?.length > 0 ? (
                    <>
                      {requestDetail?.attachments?.map((attachment, index) => (
                        <Box
                          display="flex"
                          flexWrap="wrap"
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

                              <Box
                                sx={{ cursor: 'pointer' }}
                                onClick={() => {
                                  if (userPermissions?.includes('request:read')) {
                                    if (
                                      !['mp4', 'avi', 'mov', 'ogg', 'mkv'].includes(
                                        attachment.file_name.split('.')[
                                          attachment.file_name.split('.').length - 1
                                        ]
                                      )
                                    ) {
                                      setAttachmentModal({
                                        isOpen: true,
                                        url: `${attachment?.file_path}/${attachment?.file_name}`,
                                        path: attachment.file_name,
                                      });
                                    }
                                  } else {
                                    onShowErrorToast();
                                  }
                                }}
                              >
                                <Typography fontWeight="bold">{attachment?.file_name}</Typography>
                              </Box>
                            </Box>
                            {userType === 'client' && (
                              <Box
                                sx={{ cursor: 'pointer' }}
                                onClick={() => onDeleteAttachment(attachment?.id)}
                              >
                                <SvgColor
                                  sx={{ width: 10, height: 10 }}
                                  src="/assets/icons/ic-cross.svg"
                                />
                              </Box>
                            )}
                          </Box>
                        </Box>
                      ))}
                    </>
                  ) : null}
                  {/* <InputLabel id="attachment-files">Attachment</InputLabel> */}
                  <input
                    type="file"
                    id="upload-files"
                    hidden
                    onChange={handleFileChange}
                    multiple
                    disabled={userType === 'internal'}
                    max={5000000}
                  />
                  <Button
                    disabled={userType === 'internal'}
                    type="button"
                    sx={{
                      cursor: userType === 'internal' ? 'not-allowed' : 'pointer',
                      padding: 0,
                      border: 1,
                      borderColor: 'primary.main',
                      width: '200px',
                      opacity: userType === 'internal' ? 0.5 : 1,
                    }}
                  >
                    <FormLabel
                      sx={{
                        color: 'primary.main',
                        fontWeight: 'bold',
                        cursor: userType === 'internal' ? 'not-allowed' : 'pointer',
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
                  onClick={onBackToDetail}
                  sx={{
                    border: 1,
                    borderColor: 'primary',
                  }}
                >
                  Back
                </Button>
                <LoadingButton
                  size="small"
                  loading={isLoading}
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

      {/* Attachment Modal */}

      <AttachmentModal
        isOpen={attachmentModal.isOpen}
        url={attachmentModal.url}
        onClose={() => {
          setAttachmentModal({ isOpen: false, url: '', path: '' });
        }}
        path={attachmentModal.path}
      />
    </DashboardContent>
  );
}
