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
import React, { ChangeEvent, useEffect } from 'react';
import { useAuth } from 'src/sections/auth/providers/auth';
import { RequestDTO } from 'src/services/request/schemas/request-schema';
import { useUserById } from 'src/services/master-data/user';
import {
  useAddAttachment,
  useAddRequest,
  useDeleteAttachmentById,
  useRequestById,
  useUpdateRequest,
} from 'src/services/request';
import { useCategoryByCompanyId, useProductByCompanyId } from 'src/services/master-data/company';
import { SvgColor } from 'src/components/svg-color';

export function EditRequestView() {
  const { user } = useAuth();
  const { data } = useUserById(user?.id);
  const location = useLocation();
  const { vendor, id } = useParams();
  const idCurrentCompany = user?.internal_companies?.find(
    (item) => item?.company?.name?.toLowerCase() === vendor
  )?.company?.id;
  const { data: requestDetail } = useRequestById(id ?? '');
  const { data: products } = useProductByCompanyId(idCurrentCompany ?? 0);
  const { data: categories } = useCategoryByCompanyId(idCurrentCompany ?? 0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [files, setFiles] = React.useState<FileList | any>([]);
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

  console.log(defaultValues, 'defaultValuesdefaultValues');

  const handleSubmit = (formData: RequestDTO) => {
    // setIsLoading(true);
    const payload = {
      ...formData,
      id: Number(id),
    };
    updateRequest(payload);
    console.log(payload, 'test');
    // setTimeout(() => {
    //   navigate('/request/test');
    //   setIsLoading(false);
    // }, 1000);
    // await createRequest(payload) //Todo: soon
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Convert FileList to an array and update state
    console.log(e.target.files, 'e.target.files');
    const selectedFiles = Array.from(e.target.files as ArrayLike<File>);
    const mergedFiles = [...files, ...selectedFiles];
    if (e.target.files) {
      setFiles(e.target.files);
    }
    addAttachment({
      request_id: Number(id),
      files: e.target.files,
    });
  };

  const onDeleteAttachment = (attachmentId: number) => {
    deleteAttachmentById(attachmentId);
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
          {({ register, control, formState, watch }) => (
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
                      width: { xs: '100%', md: '25%' },
                    }}
                  >
                    <Typography fontWeight="bold">CITO Status</Typography>
                    <FormControlLabel
                      control={<Checkbox {...register('is_cito')} value={watch('is_cito')} />}
                      label="Request CITO"
                    />
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
                              <Box>
                                <Typography fontWeight="bold">{attachment?.file_name}</Typography>
                                {/* {(file.size / (1024 * 1024)).toFixed(2)} Mb */}
                              </Box>
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
                          {/* {Array.from(files)?.map((file: any) => (
                        <Box display="flex" gap={1} alignItems="center">
                          <Box component="img" src="/assets/icons/file.png" />
                          <Box>
                            <Typography fontWeight="bold">{file?.name}</Typography>
                            {(file.size / (1024 * 1024)).toFixed(2)} Mb
                          </Box>
                        </Box>
                      ))} */}
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
