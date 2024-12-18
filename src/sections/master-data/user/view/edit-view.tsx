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
  menuItemClasses,
  MenuList,
  Select,
  Stack,
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
import { Role, useRole } from 'src/services/master-data/role';
import { FieldDropzone } from 'src/components/form';
import { UserUpdateDTO, userUpdateSchema } from 'src/services/master-data/user/schemas/user-schema';
import {
  useAddDivision,
  useCompanies,
  useDeleteDivisionItem,
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

interface UserValues {
  name: string | undefined;
  email: string | undefined;
  phone: string | undefined;
  role_id: number | undefined;
  profile_picture: string;
  company_id: number | undefined;
  department_id: number | undefined;
}
interface EditFormProps {
  formState: FormState<UserUpdateDTO>;
  register: UseFormRegister<UserUpdateDTO>;
  control: Control<UserUpdateDTO>;
  setValue: UseFormSetValue<UserUpdateDTO>;
  watch: UseFormWatch<UserUpdateDTO>;
  defaultValues: UserValues;
  fetchDivision: (companyId: number) => void;
  companies: Company[] | undefined;
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
}

function EditForm({
  formState,
  register,
  control,
  setValue,
  watch,
  defaultValues,
  fetchDivision,
  companies,
  divisions,
  roles,
  isLoading,
  user,
  vendor,
  onChangeVendorNew,
  onClickDeleteVendor,
  onClickEditVendor,
  vendors,
  onAddVendor,
  onChangeVendor,
}: EditFormProps) {
  console.log(watch(), 'formwatch');
  useEffect(() => {
    setValue('name', defaultValues?.name);
    setValue('email', defaultValues?.email);
    setValue('phone', defaultValues?.phone);
    setValue('role_id', defaultValues?.role_id);
    setValue('company_id', defaultValues?.company_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (divisions?.length) {
      setValue('department_id', defaultValues?.department_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [divisions]);

  const selectedCompanyType = companies?.find((item) => item?.id === watch('company_id'))?.type;

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
            {companies?.map((company) => <MenuItem value={company?.id}>{company?.name}</MenuItem>)}
          </Select>
        </FormControl>
        {formState?.errors?.company_id && (
          <FormHelperText sx={{ color: 'error.main' }}>
            {String(formState?.errors?.company_id?.message)}
          </FormHelperText>
        )}
      </Grid>
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
      ) : null}

      {/* {selectedCompanyType === 'holding' ? (
        <Grid item xs={12} md={12}>
          <Typography variant="h4" color="primary" mb={4}>
            Division
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            {user?.vendor?.map((item, index) => (
              <Stack direction="row" justifyContent="space-between" spacing={3} alignItems="center">
                <TextField
                  sx={{
                    width: '100%',
                  }}
                  label="Vendor"
                  value={item.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeVendor(e, item?.id)}
                />

                <MenuList
                  disablePadding
                  sx={{
                    p: 0.5,
                    gap: 0.5,
                    display: 'flex',
                    flexDirection: 'row',
                    [`& .${menuItemClasses.root}`]: {
                      px: 1,
                      gap: 2,
                      borderRadius: 0.75,
                      [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
                    },
                  }}
                >
                  <MenuItem onClick={() => onClickEditVendor(vendors[index].name, item?.id)}>
                    <Iconify icon="solar:pen-bold" />
                    Edit
                  </MenuItem>
                  <MenuItem
                    onClick={() => onClickDeleteVendor(item?.id)}
                    sx={{ color: 'error.main' }}
                  >
                    <Iconify icon="solar:trash-bin-trash-bold" />
                    Delete
                  </MenuItem>
                </MenuList>
              </Stack>
            ))}
            <Stack direction="row" justifyContent="space-between" spacing={3} alignItems="center">
              <TextField
                sx={{
                  width: '100%',
                }}
                label="Vendor"
                value={vendor}
                onChange={onChangeVendorNew}
              />
            </Stack>
          </Box>
          <Button onClick={onAddVendor} sx={{ marginY: 2 }}>
            Add More
          </Button>
        </Grid>
      ) : null} */}

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

export function EditUserView() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = React.useState(false);
  const [divisions, setDivisions] = React.useState<Department[] | []>([]);

  const { data: user } = useUserById(Number(id));
  const { data: roles } = useRole();
  const { mutate: updateUser } = useUpdateUser();
  const { data: companies } = useCompanies();

  const { mutate: deleteVendor } = useDeleteDivisionItem(Number(id));
  const { mutate: addVendor } = useAddDivision();
  const { mutate: updateVendor } = useUpdateDivision();

  const [vendors, setVendors] = React.useState(user?.vendor ?? []);
  const [vendor, setVendor] = React.useState('');

  const defaultValues = {
    name: user?.user_info?.name,
    email: user?.email,
    phone: user?.phone,
    role_id: user?.user_info?.role_id,
    profile_picture: user?.user_info?.profile_picture ?? '',
    company_id: user?.user_info?.company_id,
    department_id: user?.user_info?.department_id,
    vendor: user?.vendor,
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

  const handleSubmit = (formData: UserUpdateDTO) => {
    const payload = {
      ...formData,
      id: Number(id),
    };
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
    setVendors(user?.vendor ?? []);
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
          schema={userUpdateSchema}
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
              companies={companies}
              divisions={divisions}
              roles={roles}
              isLoading={isLoading}
              user={user}
              vendor={vendor}
              onChangeVendorNew={onChangeVendorNew}
              onClickDeleteVendor={onClickDeleteVendor}
              onClickEditVendor={onClickEditVendor}
              vendors={vendors}
              onAddVendor={onAddVendor}
              onChangeVendor={onChangeVendor}
            />
          )}
        </Form>
      </Grid>
    </DashboardContent>
  );
}
