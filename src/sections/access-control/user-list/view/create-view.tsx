import Typography from '@mui/material/Typography';
import type { Theme } from '@mui/material';
import {
  Box,
  Chip,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  useTheme,
  Card,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { Form } from 'src/components/form/form';
import { LoadingButton } from '@mui/lab';
import React from 'react';
import { Iconify } from 'src/components/iconify';
import { useAddUser } from 'src/services/master-data/user';
import { useRole } from 'src/services/master-data/role';
import { useClientCompanies, useInternalCompanies } from 'src/services/master-data/company';
import { API_URL } from 'src/constants';
import { getSession } from 'src/sections/auth/session/session';
import type { Department } from 'src/services/master-data/company/types';
import type {
  UserInternalDTO,
  UserClientDTO,
} from 'src/services/master-data/user/schemas/user-schema';
import { userInternalSchema } from 'src/services/master-data/user/schemas/user-schema';
import type { UseFormSetValue, UseFormWatch } from 'react-hook-form';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(id: number, selectedInternalCompanies: readonly number[], theme: Theme) {
  return {
    fontWeight:
      selectedInternalCompanies.indexOf(id) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export function CreateAccessControlUserView() {
  const theme = useTheme();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { mutate: addUser } = useAddUser();
  const { data: roles } = useRole();
  const { data: internalCompanies } = useInternalCompanies();

  const defaultValues = {
    internal_id: [],
  };

  const handleSubmit = (formData: UserClientDTO | UserInternalDTO) => {
    setIsLoading(true);
    // const { internal_id, ...restForm } = formData;
    try {
      addUser({
        ...formData,
        user_type: 'internal',
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
        Create User
      </Typography>
      <Box display="flex" gap={2} sx={{ mb: { xs: 3, md: 5 } }}>
        <Typography>Access Control</Typography>
        <Typography color="grey.500">•</Typography>
        <Typography color="grey.500">Create User</Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: { xs: 3, md: 5 }, ml: 0 }}>
        <Form
          width="100%"
          onSubmit={handleSubmit}
          schema={userInternalSchema}
          options={{
            defaultValues: {
              ...defaultValues,
            },
          }}
        >
          {({ register, control, watch, formState, setValue }) => (
            <>
              <Card
                sx={{
                  mt: 2,
                  px: 4,
                  py: 6,
                  boxShadow: '2',
                  position: 'relative',
                  backgroundColor: 'common.white',
                  borderRadius: 4,
                }}
              >
                <Grid container spacing={3} xs={12}>
                  <Grid item xs={12} md={12}>
                    <FormControl sx={{ width: '100%' }}>
                      <Typography mb={1} component="label" htmlFor="name">
                        Username
                      </Typography>

                      <OutlinedInput
                        {...register('name', {
                          required: 'Name must be filled out',
                        })}
                        id="name"
                        placeholder="Name"
                        sx={{ width: '100%' }}
                      />
                    </FormControl>
                    {formState?.errors?.name && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {String(formState?.errors?.name?.message)}
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <FormControl sx={{ width: '100%' }}>
                      <Typography mb={1} component="label" htmlFor="email">
                        Email
                      </Typography>

                      <OutlinedInput
                        {...register('email', {
                          required: 'Email must be filled out',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address',
                          },
                        })}
                        id="email"
                        placeholder="Email"
                        sx={{ width: '100%' }}
                        autoComplete="off"
                      />
                    </FormControl>
                    {formState?.errors?.email && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {String(formState?.errors?.email?.message)}
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <FormControl sx={{ width: '100%' }} variant="outlined">
                      <Typography mb={1} component="label" htmlFor="password">
                        Password
                      </Typography>

                      <OutlinedInput
                        error={Boolean(formState?.errors?.password)}
                        id="password"
                        {...register('password', {
                          required: 'Password must be filled out',
                        })}
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                              <Iconify
                                icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                              />
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </FormControl>

                    {formState?.errors?.password && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {String(formState?.errors?.password?.message)}
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <FormControl fullWidth>
                      {/* <Typography mb={1} component="label" htmlFor="internal_id">
                              Company
                            </Typography>{' '} */}
                      <InputLabel id="select-company">Company</InputLabel>

                      <Select
                        label="Internal Company"
                        labelId="demo-simple-select-outlined-label-type"
                        error={Boolean(formState?.errors?.internal_id)}
                        id="internal_id"
                        {...register('internal_id', {
                          required: 'Internal Company must be filled out',
                        })}
                        multiple
                        value={watch('internal_id')}
                        input={
                          <OutlinedInput
                            error={Boolean(formState?.errors?.internal_id)}
                            id="select-multiple-chip"
                            label="Chip"
                          />
                        }
                        onMouseDown={(event) => {
                          event.stopPropagation();
                        }}
                        renderValue={() => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {watch('internal_id')?.map((value: any) => (
                              <Chip
                                sx={{
                                  bgcolor: '#D6F3F9',
                                  color: 'info.dark',
                                }}
                                key={value}
                                label={internalCompanies?.find((item) => item?.id === value)?.name}
                              />
                            ))}
                          </Box>
                        )}
                        MenuProps={MenuProps}
                        inputProps={{ 'aria-label': 'Without label' }}
                      >
                        {internalCompanies &&
                          internalCompanies?.map((company) => (
                            <MenuItem
                              key={company?.id}
                              value={company?.id}
                              style={getStyles(company?.id, watch('internal_id') ?? [], theme)}
                            >
                              {company?.name}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                    {formState?.errors?.internal_id && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {String(formState?.errors?.internal_id?.message)}
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <FormControl fullWidth>
                      <InputLabel id="select-role">Role</InputLabel>
                      <Select
                        labelId="select-role"
                        error={Boolean(formState?.errors?.role_id)}
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
                </Grid>
              </Card>

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
                  Create User
                </LoadingButton>
              </Box>
            </>
          )}
        </Form>
      </Grid>
    </DashboardContent>
  );
}
