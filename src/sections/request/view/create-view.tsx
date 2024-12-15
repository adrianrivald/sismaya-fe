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
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import React, { ChangeEvent, ChangeEventHandler } from 'react';

export function CreateRequestView() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();
  const handleSubmit = (formData: any) => {
    setIsLoading(true);
    const payload = {
      ...formData,
      files,
    };
    console.log(payload, 'test');
    setTimeout(() => {
      navigate('/request/test');
      setIsLoading(false);
    }, 1000);
    // await createRequest(payload) //Todo: soon
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Convert FileList to an array and update state
    const selectedFiles = Array.from(e.target.files as ArrayLike<File>);
    const mergedFiles = [...files, ...selectedFiles];
    setFiles(mergedFiles);
  };

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
        Request Detail
      </Typography>
      <Box display="flex" gap={2} sx={{ mb: { xs: 3, md: 5 } }}>
        <Typography>Request</Typography>
        <Typography color="grey.500">•</Typography>
        <Typography color="grey.500">KMI Request Management</Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: { xs: 3, md: 5 }, ml: 0 }}>
        <Form width="100%" onSubmit={handleSubmit}>
          {({ register, control, formState }) => (
            <Grid container spacing={3} xs={12}>
              <Grid item xs={12} md={12}>
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
                    <TextField
                      error={Boolean(formState?.errors?.name)}
                      sx={{
                        width: '100%',
                      }}
                      label="Request Name"
                      {...register('name', {
                        required: 'Request Name must be filled out',
                      })}
                      autoComplete="off"
                    />
                    {formState?.errors?.name && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {String(formState?.errors?.name?.message)}
                      </FormHelperText>
                    )}
                  </Box>
                  <Box
                    sx={{
                      width: { xs: '100%', md: '25%' },
                    }}
                  >
                    <FormControl fullWidth>
                      <InputLabel id="select-source">Source</InputLabel>
                      <Select
                        labelId="select-source"
                        error={Boolean(formState?.errors?.source)}
                        {...register('source', {
                          required: 'Source must be filled out',
                        })}
                        label="Source"
                      >
                        <MenuItem value="source1">PHTA</MenuItem>
                        <MenuItem value="source2">Source 2</MenuItem>
                      </Select>
                    </FormControl>
                    {formState?.errors?.source && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {String(formState?.errors?.source?.message)}
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
                        error={Boolean(formState?.errors?.division)}
                        {...register('division', {
                          required: 'Division must be filled out',
                        })}
                        label="Divison"
                      >
                        <MenuItem value="division1">Pengadaan</MenuItem>
                        <MenuItem value="division2">Division 2</MenuItem>
                      </Select>
                    </FormControl>
                    {formState?.errors?.division && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {String(formState?.errors?.division?.message)}
                      </FormHelperText>
                    )}
                  </Box>
                  <Box
                    sx={{
                      width: { xs: '100%', md: '25%' },
                    }}
                  >
                    <FormControl fullWidth>
                      <InputLabel id="select-role">Role</InputLabel>
                      <Select
                        labelId="select-role"
                        error={Boolean(formState?.errors?.role)}
                        {...register('role', {
                          required: 'Role must be filled out',
                        })}
                        label="Role"
                      >
                        <MenuItem value="role1">Asset Manager</MenuItem>
                        <MenuItem value="role2">Admin</MenuItem>
                      </Select>
                    </FormControl>
                    {formState?.errors?.role && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {String(formState?.errors?.role?.message)}
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
                      <InputLabel id="select-category">Category</InputLabel>
                      <Select
                        labelId="select-category"
                        error={Boolean(formState?.errors?.category)}
                        {...register('category', {
                          required: 'Category must be filled out',
                        })}
                        label="Category"
                      >
                        <MenuItem value="category1">Kalibrasi</MenuItem>
                        <MenuItem value="category2">Category 2</MenuItem>
                      </Select>
                    </FormControl>
                    {formState?.errors?.category && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {String(formState?.errors?.category?.message)}
                      </FormHelperText>
                    )}
                  </Box>
                  <Box
                    sx={{
                      width: { xs: '100%', md: '25%' },
                    }}
                  >
                    <Typography fontWeight="bold">CITO Status</Typography>
                    <FormControlLabel control={<Checkbox />} label="Request CITO" />
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
                      {files?.map((file) => (
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
