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
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import React from 'react';
import { Iconify } from 'src/components/iconify';

export function CreateUserView() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();
  const handleSubmit = (formData: any) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/user/test/edit');
    }, 1000);
    console.log(formData, 'test');
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
        <Form width="100%" onSubmit={handleSubmit}>
          {({ register, control, formState }) => (
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
                  autoComplete="off"
                />
                {formState?.errors?.name && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {String(formState?.errors?.name?.message)}
                  </FormHelperText>
                )}
              </Grid>

              <Grid item xs={12} md={12}>
                <FormControl fullWidth>
                  <InputLabel id="select-company">Company</InputLabel>
                  <Select
                    labelId="select-company"
                    error={Boolean(formState?.errors?.company)}
                    {...register('company', {
                      required: 'Company must be filled out',
                    })}
                    label="Company"
                  >
                    <MenuItem value="company1">Company 1</MenuItem>
                    <MenuItem value="company2">Company 2</MenuItem>
                  </Select>
                </FormControl>
                {formState?.errors?.company && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {String(formState?.errors?.company?.message)}
                  </FormHelperText>
                )}
              </Grid>

              <Grid item xs={12} md={12}>
                <FormControl fullWidth>
                  <InputLabel id="select-division">Division</InputLabel>
                  <Select
                    labelId="select-division"
                    error={Boolean(formState?.errors?.division)}
                    {...register('division', {
                      required: 'Division must be filled out',
                    })}
                    label="Division"
                  >
                    <MenuItem value="div1">Division 1</MenuItem>
                    <MenuItem value="div2">Division 2</MenuItem>
                  </Select>
                </FormControl>
                {formState?.errors?.division && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {String(formState?.errors?.division?.message)}
                  </FormHelperText>
                )}
              </Grid>
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

              <Grid item xs={12} md={12}>
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
              </Grid>

              <Grid item xs={12} md={12}>
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
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="staff">Staff</MenuItem>
                  </Select>
                </FormControl>
                {formState?.errors?.role && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {String(formState?.errors?.role?.message)}
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
