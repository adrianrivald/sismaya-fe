import Typography from '@mui/material/Typography';
import {
  Box,
  Chip,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  useTheme,
  Theme,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { Form } from 'src/components/form/form';
import { useParams } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import React, { useEffect } from 'react';
import { useUpdateUser, useUserById } from 'src/services/master-data/user';
import { type Role, useRole } from 'src/services/master-data/role';
import { FieldDropzone } from 'src/components/form';
import {
  UserClientUpdateDTO,
  UserInternalUpdateDTO,
  userClientSchema,
  userInternalUpdateSchema,
} from 'src/services/master-data/user/schemas/user-schema';
import {
  useAddDivision,
  useClientCompanies,
  useCompanies,
  useDeleteDivisionItem,
  useInternalCompanies,
  useUpdateDivision,
} from 'src/services/master-data/company';
import { getSession } from 'src/sections/auth/session/session';
import { API_URL } from 'src/constants';
import { Company, Department } from 'src/services/master-data/company/types';
import {
  Control,
  FormState,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { User } from 'src/services/master-data/user/types';

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
  console.log(selectedInternalCompanies, 'selectedComp');
  return {
    fontWeight:
      selectedInternalCompanies.indexOf(id) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}
interface UserValues {
  name: string | undefined;
  email: string | undefined;
  phone: string | undefined;
  role_id: number | undefined;
  profile_picture: string;
  company_id: number | undefined;
  department_id: number | undefined;
  internal_companies: number[];
}
interface EditFormProps {
  formState: FormState<UserClientUpdateDTO>;
  register: UseFormRegister<UserClientUpdateDTO>;
  control: Control<UserClientUpdateDTO>;
  setValue: UseFormSetValue<UserClientUpdateDTO>;
  watch: UseFormWatch<UserClientUpdateDTO>;
  defaultValues: UserValues;
  fetchDivision: (companyId: number) => void;
  clientCompanies: Company[] | undefined;
  internalCompanies: Company[] | undefined;
  divisions: Department[] | [];
  roles: Role[] | undefined;
  isLoading: boolean;
  user: User | undefined;
  onClickDeleteVendor: (vendorId: number) => void;
  vendor: string;
  vendors: any[];
  onClickEditVendor: (value: string, vendorId: number) => void;
  onChangeVendorNew: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddVendor: () => void;
  onChangeVendor: (e: React.ChangeEvent<HTMLInputElement>, itemId: number) => void;
  type: 'client' | 'internal';
  theme: Theme;
}

function EditForm({
  formState,
  register,
  control,
  setValue,
  watch,
  defaultValues,
  fetchDivision,
  clientCompanies,
  divisions,
  roles,
  isLoading,
  user,
  type,
  theme,
  internalCompanies,
}: EditFormProps) {
  console.log(watch(), 'formwatch');
  useEffect(() => {
    setValue('name', defaultValues?.name);
    setValue('email', defaultValues?.email);
    setValue('phone', defaultValues?.phone);
    setValue('role_id', defaultValues?.role_id);
    setValue('company_id', defaultValues?.company_id);
    setValue('internal_companies', defaultValues?.internal_companies);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  console.log(watch(), 'watchform');

  useEffect(() => {
    if (divisions?.length) {
      setValue('department_id', defaultValues?.department_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [divisions]);

  return (
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

      {type === 'client' ? (
        <Grid item xs={12} md={12}>
          <FormControl fullWidth>
            <InputLabel id="select-company">Company</InputLabel>
            <Select
              labelId="select-company"
              error={Boolean(formState?.errors?.company_id)}
              {...register('company_id', {
                required: 'Company must be filled out',
                onChange: () => {
                  fetchDivision(watch('company_id') as number);
                },
              })}
              label="Company"
              value={watch('company_id')}
            >
              {clientCompanies?.map((company) => (
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
                value={watch('department_id')}
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
          <InputLabel id="demo-simple-select-outlined-label-type">Internal Company</InputLabel>
          <Select
            label="Internal Company"
            labelId="demo-simple-select-outlined-label-type"
            id="internal_companies"
            {...register('internal_companies', {
              required: 'Internal Company must be filled out',
            })}
            multiple
            value={watch('internal_companies')}
            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {(watch('internal_companies') ?? []).map((value: any) => (
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
                  style={getStyles(company?.id, watch('internal_companies') ?? [], theme)}
                >
                  {company?.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        {formState?.errors?.internal_companies && (
          <FormHelperText sx={{ color: 'error.main' }}>
            {String(formState?.errors?.internal_companies?.message)}
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
  );
}

interface EditUserProps {
  type: 'client' | 'internal';
}

export function EditUserView({ type }: EditUserProps) {
  const theme = useTheme();
  const { id } = useParams();
  const [isLoading, setIsLoading] = React.useState(false);
  const [divisions, setDivisions] = React.useState<Department[] | []>([]);

  const { data: user } = useUserById(Number(id));
  const { data: roles } = useRole();
  const { mutate: updateUser } = useUpdateUser();
  const { data: clientCompanies } = useClientCompanies();
  const { data: internalCompanies } = useInternalCompanies();

  const { mutate: deleteVendor } = useDeleteDivisionItem(Number(id));
  const { mutate: addVendor } = useAddDivision();
  const { mutate: updateVendor } = useUpdateDivision();

  const [vendors, setVendors] = React.useState(user?.internal_companies ?? []);
  const [vendor, setVendor] = React.useState('');

  const defaultValues = {
    name: user?.user_info?.name,
    email: user?.email,
    phone: user?.phone,
    role_id: user?.user_info?.role_id,
    profile_picture: user?.user_info?.profile_picture ?? '',
    company_id: user?.user_info?.company_id,
    department_id: user?.user_info?.department_id,
    internal_companies: user?.internal_companies ?? [],
  };

  console.log(defaultValues, 'defaultValues');

  useEffect(() => {
    if (defaultValues?.company_id) {
      fetchDivision(defaultValues?.company_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues?.company_id]);

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

  const handleSubmit = (formData: UserClientUpdateDTO) => {
    const payload = {
      ...formData,
      id: Number(id),
    };
    console.log(payload, 'payload');
    if (defaultValues?.profile_picture) {
      Object.assign(payload, {
        profile_picture: defaultValues?.profile_picture,
      });
    }
    updateUser(payload);
  };

  const onAddVendor = () => {
    addVendor({
      name: vendor,
      company_id: user?.id,
    });
    setVendor('');
  };

  React.useEffect(() => {
    setVendors(user?.internal_companies ?? []);
  }, [user]);

  const onChangeVendor = (e: React.ChangeEvent<HTMLInputElement>, itemId: number) => {
    setVendors((prevVendors) => {
      const updatedVendors = [...prevVendors];
      // Update the string at the specified index
      const index = updatedVendors?.findIndex((item) => item?.id === itemId);
      updatedVendors[index].name = e.target.value;
      return updatedVendors;
    });
  };

  const onChangeVendorNew = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVendor(e.target.value);
  };

  const onClickDeleteVendor = async (vendorId: number) => {
    deleteVendor(vendorId);
  };

  const onClickEditVendor = async (value: string, vendorId: number) => {
    updateVendor({
      name: value,
      id: vendorId,
      company_id: Number(id),
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
          schema={type === 'client' ? userClientSchema : userInternalUpdateSchema}
        >
          {({ register, watch, control, formState, setValue }) => (
            <EditForm
              formState={formState}
              register={register}
              control={control}
              setValue={setValue}
              watch={watch}
              defaultValues={defaultValues}
              fetchDivision={fetchDivision}
              clientCompanies={clientCompanies}
              internalCompanies={internalCompanies}
              divisions={divisions}
              roles={roles}
              isLoading={isLoading}
              user={user}
              type={type}
              vendor={vendor}
              onChangeVendorNew={onChangeVendorNew}
              onClickDeleteVendor={onClickDeleteVendor}
              onClickEditVendor={onClickEditVendor}
              vendors={vendors}
              onAddVendor={onAddVendor}
              onChangeVendor={onChangeVendor}
              theme={theme}
            />
          )}
        </Form>
      </Grid>
    </DashboardContent>
  );
}
