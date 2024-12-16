import Typography from '@mui/material/Typography';
import {
  Box,
  Button,
  Chip,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  useTheme,
  Theme,
} from '@mui/material';

import { _tasks, _posts, _timeline, _users, _projects } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { Form } from 'src/components/form/form';
import React from 'react';
import { API_URL } from 'src/constants';
import { FieldDropzone } from 'src/components/form';
import { Bounce, toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { useCompanyById } from 'src/services/master-data/company';

export function EditInternalCompanyView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data } = useCompanyById(Number(id));

  const [selectedStatuses, setSelectedStatuses] = React.useState([
    {
      status: null,
      type: null,
    },
  ]);

  const [categories, setCategories] = React.useState(['']);
  const [products, setProducts] = React.useState(['']);

  const defaultValues = {
    name: data?.name,
    abbreviation: data?.abbreviation,
    status: data?.progress_statuses ?? [],
    category: data?.categories ?? [],
    product: data?.products ?? [],
  };

  const onAddStatus = () => {
    setSelectedStatuses([
      ...selectedStatuses,
      [
        {
          status: null,
          type: null,
        },
      ],
    ] as any);
  };

  const onAddCategory = () => {
    setCategories([...categories, ''] as any);
  };

  const onAddProduct = () => {
    setProducts([...products, ''] as any);
  };

  const handleChangeStatus = (e: SelectChangeEvent<string>, index: number) => {
    const value = e?.target?.value;
    console.log(value, 'status');
  };
  const handleChangeType = (e: SelectChangeEvent<string>, index: number) => {
    const value = e?.target?.value;
  };

  const handleSubmit = (formData: any) => {
    toast.success('Data added successfully', {
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
    navigate('/internal-company');
  };
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
        Internal Company
      </Typography>
      <Box display="flex" gap={2} sx={{ mb: { xs: 3, md: 5 } }}>
        <Typography>Master Data</Typography>
        <Typography color="grey.500">•</Typography>
        <Typography color="grey.500">Internal Company</Typography>
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
          {({ register, control, watch, formState }) => (
            <Grid container spacing={3} xs={12}>
              <Grid item xs={12} md={12}>
                <TextField
                  error={Boolean(formState?.errors?.name)}
                  sx={{
                    width: '100%',
                  }}
                  label="Name"
                  {...register('name', {
                    required: 'Name must be filled out',
                  })}
                />
                {formState?.errors?.name && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {String(formState?.errors?.name?.message)}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  error={Boolean(formState?.errors?.abbreviation)}
                  multiline
                  sx={{
                    width: '100%',
                  }}
                  label="Description"
                  rows={4}
                  {...register('abbreviation', {
                    required: 'Description must be filled out',
                  })}
                />
                {formState?.errors?.abbreviation && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {String(formState?.errors?.abbreviation?.message)}
                  </FormHelperText>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <FieldDropzone
                  label="Upload Picture"
                  helperText="Picture maximum 5mb size"
                  controller={{
                    name: 'cover',
                    control,
                  }}
                />
              </Grid>

              <Grid item xs={12} md={12}>
                <Box display="flex" flexDirection="column" gap={2}>
                  {selectedStatuses?.map((item, index) => (
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      spacing={3}
                      alignItems="center"
                    >
                      <Box width="50%">
                        <TextField
                          error={Boolean(formState?.errors?.status)}
                          sx={{
                            width: '100%',
                          }}
                          label="Status"
                          {...register('status')}
                        />
                        {formState?.errors?.status && (
                          <FormHelperText sx={{ color: 'error.main' }}>
                            {String(formState?.errors?.status?.message)}
                          </FormHelperText>
                        )}
                      </Box>

                      <Box width="50%">
                        <FormControl fullWidth>
                          <InputLabel id="type">Type</InputLabel>
                          <Select
                            error={Boolean(formState?.errors?.type)}
                            {...register('type')}
                            label="Type"
                            onChange={(e: SelectChangeEvent<string>) => handleChangeType(e, index)}
                          >
                            <MenuItem value="todo">Todo</MenuItem>
                            <MenuItem value="inprogress">In Progress</MenuItem>
                            <MenuItem value="done">Done</MenuItem>
                          </Select>
                        </FormControl>
                        {formState?.errors?.type && (
                          <FormHelperText sx={{ color: 'error.main' }}>
                            {String(formState?.errors?.type?.message)}
                          </FormHelperText>
                        )}
                      </Box>
                    </Stack>
                  ))}
                </Box>
                <Button onClick={onAddStatus} sx={{ marginY: 2 }}>
                  Add More
                </Button>
              </Grid>

              <Grid item xs={12} md={12}>
                <Typography variant="h4" color="primary" mb={4}>
                  Category
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  {categories?.map((item, index) => (
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      spacing={3}
                      alignItems="center"
                    >
                      <TextField
                        error={Boolean(formState?.errors?.category)}
                        sx={{
                          width: '100%',
                        }}
                        label="Category"
                        {...register('category')}
                      />
                      {formState?.errors?.category && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {String(formState?.errors?.category?.message)}
                        </FormHelperText>
                      )}
                    </Stack>
                  ))}
                </Box>
                <Button onClick={onAddCategory} sx={{ marginY: 2 }}>
                  Add More
                </Button>
              </Grid>

              <Grid item xs={12} md={12}>
                <Typography variant="h4" color="primary" mb={4}>
                  Product
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  {products?.map((item, index) => (
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      spacing={3}
                      alignItems="center"
                    >
                      <TextField
                        error={Boolean(formState?.errors?.products)}
                        sx={{
                          width: '100%',
                        }}
                        label="Product"
                        {...register('product')}
                      />
                      {formState?.errors?.product && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {String(formState?.errors?.product?.message)}
                        </FormHelperText>
                      )}
                    </Stack>
                  ))}
                </Box>
                <Button onClick={onAddCategory} sx={{ marginY: 2 }}>
                  Add More
                </Button>
              </Grid>

              <Box
                display="flex"
                justifyContent="end"
                width="100%"
                sx={{
                  mt: 8,
                }}
              >
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </Box>
            </Grid>
          )}
        </Form>
      </Grid>
    </DashboardContent>
  );
}
