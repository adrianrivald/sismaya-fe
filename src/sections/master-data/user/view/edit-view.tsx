import Typography from '@mui/material/Typography';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { Form } from 'src/components/form/form';
import { useNavigate, useParams } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import React, { useEffect } from 'react';
import { Iconify } from 'src/components/iconify';
import { Bounce, toast } from 'react-toastify';
import { useUpdateUser, useUserById } from 'src/services/master-data/user';
import { useRole } from 'src/services/master-data/role';
import { FieldDropzone } from 'src/components/form';
import { UserDTO, userSchema } from 'src/services/master-data/user/schemas/user-schema';
import { useCompanies } from 'src/services/master-data/company';
import { getSession } from 'src/sections/auth/session/session';
import { API_URL } from 'src/constants';
import { Department } from 'src/services/master-data/company/types';

export function EditUserView() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = React.useState(false);
  const [divisions, setDivisions] = React.useState<Department[] | []>([]);

  const { data: user } = useUserById(Number(id));
  const { data: roles } = useRole();
  const { mutate: updateUser } = useUpdateUser();
  const { data: companies } = useCompanies();

  const defaultValues = {
    name: user?.user_info?.name,
    email: user?.email,
    phone: user?.phone,
    role_id: user?.user_info?.role_id,
    profile_picture: user?.user_info?.profile_picture ?? '',
    company_id: user?.user_info?.company_id,
    department: user?.user_info?.department_id,
  };

  console.log(defaultValues, 'defaultValues');

  useEffect(() => {
    if (defaultValues?.company_id) {
      fetchDivision(defaultValues?.company_id);
    }
  }, [companies, defaultValues?.company_id]);

  const fetchDivision = async (companyId: number) => {
    const data = await fetch(`${API_URL}/departments?company_id=${companyId}`, {
      headers: {
        Authorization: `Bearer ${getSession()}`,
      },
    }).then((res) =>
      res.json().then((value) => {
        console.log(value?.data, 'value?.data');
        setDivisions(value?.data);
      })
    );
    return data;
  };

  const handleSubmit = (formData: UserDTO) => {
    updateUser({
      ...formData,
      id: Number(id),
    });
  };

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
        User
      </Typography>
      <Box display="flex" gap={2} sx={{ mb: { xs: 3, md: 5 } }}>
        <Typography>Master Data</Typography>
        <Typography color="grey.500">•</Typography>
        <Typography color="grey.500">User</Typography>
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
          schema={userSchema}
        >
          {({ register, watch, control, formState }) => (
            <Grid container spacing={3} xs={12}>
              <Grid item xs={12} md={12}>
                <FieldDropzone
                  label="Upload Picture"
                  helperText="Picture maximum 5mb size"
                  controller={{
                    name: 'cover',
                    control,
                  }}
                  defaultImage={defaultValues?.profile_picture}
                />
              </Grid>
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
                  autoComplete="off"
                />
                {formState?.errors?.name && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {String(formState?.errors?.name?.message)}
                  </FormHelperText>
                )}
              </Grid>

              {watch('company_id') ? (
                <Grid item xs={12} md={12}>
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
                </Grid>
              ) : null}
              {watch('company_id') ? (
                <Grid item xs={12} md={12}>
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
                </Grid>
              ) : null}
              <Grid item xs={12} md={12}>
                <TextField
                  error={Boolean(formState?.errors?.email)}
                  sx={{
                    width: '100%',
                  }}
                  type="email"
                  label="Email"
                  {...register('email', {
                    required: 'Email must be filled out',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  autoComplete="off"
                />
                {formState?.errors?.email && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {String(formState?.errors?.email?.message)}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  error={Boolean(formState?.errors?.phone)}
                  sx={{
                    width: '100%',
                  }}
                  label="Phone No."
                  {...register('phone', {
                    required: 'Phone Number must be filled out',
                  })}
                  autoComplete="off"
                />
                {formState?.errors?.phone && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {String(formState?.errors?.phone?.message)}
                  </FormHelperText>
                )}
              </Grid>

              {/* <Grid item xs={12} md={12}>
                <TextField
                  error={Boolean(formState?.errors?.password)}
                  fullWidth
                  label="Password"
                  {...register('password', {
                    required: 'Password must be filled out',
                  })}
                  InputLabelProps={{ shrink: true }}
                  type={showPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          <Iconify
                            icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {formState?.errors?.password && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {String(formState?.errors?.password?.message)}
                  </FormHelperText>
                )}
              </Grid> */}

              <Grid item xs={12} md={12}>
                <FormControl fullWidth>
                  <InputLabel id="select-role">Role</InputLabel>
                  <Select
                    value={watch('role_id')}
                    labelId="select-role"
                    error={Boolean(formState?.errors?.role)}
                    {...register('role_id', {
                      required: 'Role must be filled out',
                    })}
                    label="Role"
                  >
                    {roles?.map((role) => <MenuItem value={role?.id}>{role?.name}</MenuItem>)}
                  </Select>
                </FormControl>
                {formState?.errors?.role_id && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {String(formState?.errors?.role_id?.message)}
                  </FormHelperText>
                )}
              </Grid>
              <Box
                display="flex"
                justifyContent="end"
                width="100%"
                sx={{
                  mt: 4,
                }}
              >
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
                  Submit
                </LoadingButton>
              </Box>
            </Grid>
          )}
        </Form>
      </Grid>
    </DashboardContent>
  );
}
