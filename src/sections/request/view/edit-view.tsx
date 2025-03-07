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
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { Form } from 'src/components/form/form';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useAuth } from 'src/sections/auth/providers/auth';
import { RequestDTO } from 'src/services/request/schemas/request-schema';
import { useUserById, useUsers } from 'src/services/master-data/user';
import {
  useAddAttachment,
  useAddRequest,
  useAddRequestAssignee,
  useDeleteAttachmentById,
  useDeleteRequestAssigneeById,
  useRequestById,
  useUpdateRequest,
} from 'src/services/request';
import { useCategoryByCompanyId, useProductByCompanyId } from 'src/services/master-data/company';
import { SvgColor } from 'src/components/svg-color';
import { Bounce, toast } from 'react-toastify';
import { getFileExtension } from 'src/utils/get-file-format';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import ModalDialog from 'src/components/modal/modal';
import { useSearchDebounce } from 'src/utils/hooks/use-debounce';
import { AddAssigneeModal } from '../add-assignee';

export function EditRequestView() {
  const { user } = useAuth();
  const { data } = useUserById(user?.id);
  const navigate = useNavigate();
  const { vendor, id } = useParams();
  const idCurrentCompany = user?.internal_companies?.find(
    (item) => item?.company?.name?.toLowerCase() === vendor
  )?.company?.id;
  const { data: internalUser } = useUsers('internal', String(idCurrentCompany));
  const { data: requestDetail } = useRequestById(id ?? '');
  const { data: products } = useProductByCompanyId(idCurrentCompany ?? 0);
  const { data: categories } = useCategoryByCompanyId(idCurrentCompany ?? 0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [files, setFiles] = React.useState<FileList | any>([]);
  const [searchTerm, setSearchTerm] = useSearchDebounce();

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
  };
  const { mutate: addRequestAssignee } = useAddRequestAssignee();
  const { mutate: deleteRequestAssignee } = useDeleteRequestAssigneeById();

  const [selectedPic, setSelectedPic] = React.useState<
    { id: number; picture: string; assignee_id?: number }[] | undefined
  >(
    requestDetail?.assignees?.map((item) => ({
      assignee_id: item?.assignee_id,
      picture: item?.assignee?.user_info?.profile_picture,
      id: item?.id,
    }))
  );

  const [isImagePreviewModal, setIsImagePreviewModal] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState('');
  const onPreviewFile = (filePath: string, fileName: string) => {
    const fileExtension = getFileExtension(fileName);
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
    const isImage = imageExtensions.includes(fileExtension);
    if (isImage) {
      setIsImagePreviewModal(true);
      setSelectedImage(fileName);
    }
  };

  useEffect(() => {
    setSelectedPic(
      requestDetail?.assignees?.map((item) => ({
        assignee_id: item?.assignee_id,
        picture: item?.assignee?.user_info?.profile_picture,
        id: item?.id,
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
    const payload = {
      ...formData,
      id: Number(id),
      ...(requestDetail?.step === 'to_do' && { start_date: dateValue }),
      ...(requestDetail?.step === 'to_do' && { end_date: endDateValue }),
    };
    updateRequest(payload);
    // setTimeout(() => {
    //   navigate('/request/test');
    //   setIsLoading(false);
    // }, 1000);
    // await createRequest(payload) //Todo: soon
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Convert FileList to an array and update state
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
        addAttachment({
          request_id: Number(id),
          files: e.target.files,
        });
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

  const handleDeletePicItemFromDetail = (_userId: number, assigneeId?: number) => {
    if (assigneeId) deleteRequestAssignee(assigneeId);
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
          {({ register, formState, watch }) => (
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
                            {...register('is_cito')}
                            defaultChecked={watch('is_cito')}
                            value={watch('is_cito')}
                          />
                        }
                        label="Request CITO"
                      />
                      <Typography>
                        {requestDetail?.internal_company?.cito_used}/
                        {requestDetail?.internal_company?.cito_quota} used
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
                />
                {formState?.errors?.description && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {String(formState?.errors?.description?.message)}
                  </FormHelperText>
                )}
              </Grid>

              {requestDetail?.step === 'to_do' && (
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
                  {(requestDetail?.attachments ?? [])?.length > 0 || files?.length > 0 ? (
                    <>
                      {requestDetail?.attachments?.map((attachment) => (
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
                              <ModalDialog
                                onClose={() => {
                                  setIsImagePreviewModal(false);
                                  setSelectedImage('');
                                }}
                                open={
                                  isImagePreviewModal && selectedImage === attachment?.file_name
                                }
                                setOpen={setIsImagePreviewModal}
                                minWidth={600}
                                title="Preview"
                                content={
                                  (
                                    <Box
                                      component="img"
                                      sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        mt: 4,
                                        maxHeight: '500px',
                                        mx: 'auto',
                                      }}
                                      src={`${attachment?.file_path}/${attachment?.file_name}`}
                                    />
                                  ) as JSX.Element & string
                                }
                              >
                                <Box
                                  sx={{ cursor: 'pointer' }}
                                  onClick={() =>
                                    onPreviewFile(attachment?.file_path, attachment?.file_name)
                                  }
                                >
                                  <Typography fontWeight="bold">{attachment?.file_name}</Typography>
                                  {/* {(file.size / (1024 * 1024)).toFixed(2)} Mb */}
                                </Box>
                              </ModalDialog>
                            </Box>
                            <Box
                              sx={{ cursor: 'pointer' }}
                              onClick={() => onDeleteAttachment(attachment?.id)}
                            >
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
                    id="upload-files"
                    hidden
                    onChange={handleFileChange}
                    multiple
                    max={5000000}
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
    </DashboardContent>
  );
}
