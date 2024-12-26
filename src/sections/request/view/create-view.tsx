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
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import React, { ChangeEvent, ChangeEventHandler } from 'react';
import { useAuth } from 'src/sections/auth/providers/auth';
import { RequestDTO } from 'src/services/request/schemas/request-schema';
import { useUserById, useUsers } from 'src/services/master-data/user';
import { useAddRequest } from 'src/services/request';
import {
  useCategoryByCompanyId,
  useClientCompanies,
  useProductByCompanyId,
} from 'src/services/master-data/company';
import { Department } from 'src/services/master-data/company/types';
import { API_URL } from 'src/constants';
import { getSession } from 'src/sections/auth/session/session';
import { useRole } from 'src/services/master-data/role';

export function CreateRequestView() {
  const { user } = useAuth();
  const { data } = useUserById(user?.id);
  const location = useLocation();
  const { vendor } = useParams();
  const idCurrentCompany = user?.internal_companies?.find(
    (item) => item?.company?.name?.toLowerCase() === vendor
  )?.company?.id;
  const { data: products } = useProductByCompanyId(idCurrentCompany ?? 0);
  const { data: categories } = useCategoryByCompanyId(idCurrentCompany ?? 0);
  const [files, setFiles] = React.useState<FileList | any>([]);
  const [divisions, setDivisions] = React.useState<Department[] | []>([]);
  const { data: companies } = useClientCompanies();
  const { data: clientUsers } = useUsers('client');
  const { mutate: addRequest } = useAddRequest();
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
    console.log(payload, 'test');
  };

  const fetchDivision = async (companyId: number) => {
    const departmentData = await fetch(`${API_URL}/departments?company_id=${companyId}`, {
      headers: {
        Authorization: `Bearer ${getSession()}`,
      },
    }).then((res) =>
      res.json().then((value) => {
        console.log(value?.data, 'value?.data');
        setDivisions(value?.data);
      })
    );
    return departmentData;
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Convert FileList to an array and update state
    console.log(e.target.files, 'e.target.files');
    const selectedFiles = Array.from(e.target.files as ArrayLike<File>);
    const mergedFiles = [...files, ...selectedFiles];
    if (e.target.files) {
      setFiles(e.target.files);
    }
  };

  const requesterList =
    clientUsers &&
    (clientUsers?.map((clientUser) => ({
      label: clientUser?.user_info?.name,
      id: clientUser?.id,
    })) as readonly any[]);

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
                        onChange={(event: any, newValue: { id: number; label: string }) => {
                          setValue('user_id', newValue?.id);
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
                      <FormControl fullWidth>
                        <InputLabel id="select-company">Company</InputLabel>
                        <Select
                          labelId="select-company"
                          error={Boolean(formState?.errors?.company_id)}
                          {...register('company_id', {
                            required: 'Company must be filled out',
                            onChange: async () => {
                              await fetchDivision(watch('company_id'));
                            },
                          })}
                          label="Company"
                        >
                          {companies?.map((company) => (
                            <MenuItem value={company?.id}>{company?.name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
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
                      <FormControl fullWidth>
                        <InputLabel id="select-division">Division</InputLabel>
                        <Select
                          labelId="select-division"
                          error={Boolean(formState?.errors?.department_id)}
                          {...register('department_id', {
                            required: 'Division must be filled out',
                          })}
                          label="Division"
                        >
                          {divisions?.map((division) => (
                            <MenuItem value={division?.id}>{division?.name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
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
                      width: { xs: '100%', md: '25%' },
                    }}
                  >
                    <Typography fontWeight="bold">CITO Status</Typography>
                    <FormControlLabel
                      control={<Checkbox {...register('is_cito')} />}
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
                          <Box>
                            <Typography fontWeight="bold">{file?.name}</Typography>
                            {(file.size / (1024 * 1024)).toFixed(2)} Mb
                          </Box>
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
