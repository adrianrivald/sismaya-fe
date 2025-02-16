import Typography from '@mui/material/Typography';
import {
  Box,
  Button,
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
  TextField,
  Theme,
  useTheme,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { Form } from 'src/components/form/form';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import React, { useEffect } from 'react';
import { Iconify } from 'src/components/iconify';
import { useAddUser } from 'src/services/master-data/user';
import { useRole } from 'src/services/master-data/role';
import { FieldDropzone } from 'src/components/form';
import {
  fetchDivisionByCompanyId,
  useClientCompanies,
  useCompanies,
  useDivisionByCompanyId,
  useInternalCompanies,
} from 'src/services/master-data/company';
import { API_URL } from 'src/constants';
import { getSession } from 'src/sections/auth/session/session';
import { Department } from 'src/services/master-data/company/types';
import {
  UserInternalDTO,
  UserClientDTO,
  userClientSchema,
  userInternalSchema,
} from 'src/services/master-data/user/schemas/user-schema';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';

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
interface CreateUserProps {
  type: 'client' | 'internal';
}

export function CreateUserView({ type }: CreateUserProps) {
  const theme = useTheme();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [divisions, setDivisions] = React.useState<Department[] | []>([]);
  const { mutate: addUser } = useAddUser({ isRbac: false });
  const { data: roles } = useRole();
  const { data: companies } = useClientCompanies();
  const { data: internalCompanies } = useInternalCompanies();

  const defaultValues = {
    internal_id: [],
  };

  const fetchDivision = async (companyId: number) => {
    const data = await fetch(`${API_URL}/departments?company_id=${companyId}`, {
      headers: {
        Authorization: `Bearer ${getSession()}`,
      },
    }).then((res) =>
      res.json().then((value) => {
        setDivisions(value?.data);
      })
    );
    return data;
  };

  const handleSubmit = (formData: UserClientDTO | UserInternalDTO) => {
    setIsLoading(true);
    // const { internal_id, ...restForm } = formData;
    try {
      addUser({
        ...formData,
        user_type: type,
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const onChangePhone = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setValuePhone: UseFormSetValue<any>,
    watchPhone: UseFormWatch<any>
  ) => {
    const phoneValue = e.target.value;
    const numRegex = /^\d+$/;
    if (numRegex.test(phoneValue) || watchPhone('phone').length === 1) {
      setValuePhone('phone', phoneValue);
    }
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
          schema={type === 'client' ? userClientSchema : userInternalSchema}
          options={{
            defaultValues: {
              ...defaultValues,
            },
          }}
        >
          {({ register, control, watch, formState, setValue }) => (
            <Grid container spacing={3} xs={12}>
              <Grid item xs={12} md={12}>
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

              {type === 'client' ? (
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
              {type === 'client' ? (
                watch('company_id') ? (
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
                ) : null
              ) : null}

              {/* {type === 'internal' ? ( */}
              <Grid item xs={12} md={12}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-outlined-label-type">
                    Internal Company
                  </InputLabel>
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
                    renderValue={() => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {watch('internal_id').map((value: any) => (
                          <Chip
                            key={value}
                            label={internalCompanies?.find((item) => item?.id === value)?.name}
                          />
                        ))}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                  >
                    {internalCompanies &&
                      internalCompanies?.map((company) => (
                        <MenuItem
                          key={company?.id}
                          value={company?.id}
                          style={getStyles(company?.id, watch('internal_id'), theme)}
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
              {/* ) : null} */}

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
                  value={watch('phone')}
                  onChange={(e) => onChangePhone(e, setValue, watch)}
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
                    error={Boolean(formState?.errors?.role_id)}
                    {...register('role_id', {
                      required: 'Role must be filled out',
                    })}
                    label="Role"
                  >
                    {roles
                      ?.filter((role) => (type === 'client' ? role?.id === 6 : role?.id !== 6))
                      .map((role) => <MenuItem value={role?.id}>{role?.name}</MenuItem>)}
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
