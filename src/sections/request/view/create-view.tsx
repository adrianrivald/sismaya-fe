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
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { Form } from 'src/components/form/form';
import { useParams } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import type { ChangeEvent } from 'react';
import React from 'react';
import { useAuth } from 'src/sections/auth/providers/auth';
import { getFileExtension } from 'src/utils/get-file-format';
import type { RequestDTO } from 'src/services/request/schemas/request-schema';
import { useUsers } from 'src/services/master-data/user';
import { useAddRequest } from 'src/services/request';
import { useCategoryByCompanyId, useProductByCompanyId } from 'src/services/master-data/company';
import { Bounce, toast } from 'react-toastify';
import ModalDialog from 'src/components/modal/modal';

export function CreateRequestView() {
  const { user } = useAuth();
  const { vendor } = useParams();
  const idCurrentCompany = user?.internal_companies?.find(
    (item) => item?.company?.name?.toLowerCase() === vendor
  )?.company?.id;
  const { data: products } = useProductByCompanyId(idCurrentCompany ?? 0);
  const { data: categories } = useCategoryByCompanyId(idCurrentCompany ?? 0);
  const [files, setFiles] = React.useState<FileList | any>([]);
  const { data: clientUsers } = useUsers('client', String(idCurrentCompany));
  const { mutate: addRequest } = useAddRequest();

  const [selectedCompany, setSelectedCompany] = React.useState('');
  const [selectedDepartment, setSelectedDepartment] = React.useState('');

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

  const handleSubmit = (formData: RequestDTO) => {
    let payload = {};
    if (user?.user_info?.user_type === 'client') {
      payload = {
        ...formData,
        creator_id: user?.id,
        user_id: user?.id,
        company_id: user?.user_info?.company?.id,
        department_id: user?.user_info?.department?.id,
        assignee_company_id: idCurrentCompany,
        files,
      };
    } else {
      payload = {
        ...formData,
        creator_id: user?.id,
        assignee_company_id: idCurrentCompany,
        files,
      };
    }
    addRequest(payload);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
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
        const selectedFiles = Array.from(e.target.files as ArrayLike<File>);
        const mergedFiles = [...files, ...selectedFiles];
        if (e.target.files) {
          setFiles(mergedFiles);
        }
      }
    }
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

  console.log(files, 'filesnya');

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
                      <Typography>0/5 used</Typography>
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
                  {files?.length > 0 ? (
                    <Box
                      display="flex"
                      gap={3}
                      p={4}
                      mb={3}
                      sx={{ border: 1, borderRadius: 1, borderColor: 'grey.500' }}
                    >
                      {Array.from(files)?.map((file: any) => (
                        <Box display="flex" gap={1} alignItems="center">
                          <Box component="img" src="/assets/icons/file.png" />
                          <ModalDialog
                            onClose={() => {
                              setIsImagePreviewModal(false);
                              setSelectedImage('');
                            }}
                            open={isImagePreviewModal && selectedImage === file?.file_name}
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
                                  src={URL.createObjectURL(file)}
                                />
                              ) as JSX.Element & string
                            }
                          >
                            <Box
                              sx={{ cursor: 'pointer' }}
                              onClick={() => onPreviewFile(file?.file_path, file?.file_name)}
                            >
                              <Typography fontWeight="bold">{file?.name}</Typography>
                              {(file.size / (1024 * 1024)).toFixed(2)} Mb
                            </Box>
                          </ModalDialog>
                        </Box>
                      ))}
                    </Box>
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
