import Typography from '@mui/material/Typography';
import type { SelectChangeEvent, Theme } from '@mui/material';
import {
  Box,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  useTheme,
  OutlinedInput,
  Chip,
  Card,
  Button,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { Form } from 'src/components/form/form';
import { useParams } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import React, { useEffect } from 'react';
import {
  useAddUserCompany,
  useUpdateUser,
  useUpdateUserPassword,
  useUserById,
} from 'src/services/master-data/user';
import { type Role, useRole } from 'src/services/master-data/role';
import type {
  UserAccessControlUpdateDTO,
  UserInternalUpdateDTO,
} from 'src/services/master-data/user/schemas/user-schema';
import { userInternalUpdateSchema } from 'src/services/master-data/user/schemas/user-schema';
import { useClientCompanies, useInternalCompanies } from 'src/services/master-data/company';
import { getSession } from 'src/sections/auth/session/session';
import { API_URL } from 'src/constants';
import type { Company, Department, InternalCompany } from 'src/services/master-data/company/types';
import type {
  Control,
  FormState,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import type { User } from 'src/services/master-data/user/types';
import { ResetPasswordAction } from '../../reset-password-action';

interface UserValues {
  name: string | undefined;
  email: string | undefined;
  role_id: number | undefined;
  profile_picture: string;
  company_id: number | undefined;
  department_id: number | undefined;
  internal_id: number[];
}
interface EditFormProps {
  formState: FormState<UserInternalUpdateDTO>;
  register: UseFormRegister<UserInternalUpdateDTO>;
  control: Control<UserInternalUpdateDTO>;
  setValue: UseFormSetValue<UserInternalUpdateDTO>;
  watch: UseFormWatch<UserInternalUpdateDTO>;
  defaultValues: UserValues;
  fetchDivision: (companyId: number) => void;
  clientCompanies: Company[] | undefined;
  divisions: Department[] | [];
  roles: Role[] | undefined;
  isLoading: boolean;
  user: User | undefined;
  type: 'client' | 'internal';
  userCompany: any;
  userCompanies: InternalCompany[];
  onChangeUserCompanyNew: (e: SelectChangeEvent<number>) => void;
  onaddUserCompany: () => void;
  onChangeUserCompany: (e: SelectChangeEvent<number>, itemId: number) => void;
  internalCompanies: Company[] | undefined;
  theme: Theme;
  onShowResetPasswordPopup: () => void;
}
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
  userCompany,
  userCompanies,
  onChangeUserCompanyNew,
  onaddUserCompany,
  onChangeUserCompany,
  internalCompanies,
  theme,
  onShowResetPasswordPopup,
}: EditFormProps) {
  useEffect(() => {
    setValue('name', defaultValues?.name);
    setValue('email', defaultValues?.email);
    setValue('role_id', defaultValues?.role_id);
    setValue('internal_id', defaultValues?.internal_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleDelete = (companyId: number | undefined, setValueCompany: UseFormSetValue<any>) => {
    if (companyId) {
      setValueCompany('internal_id', []);
    }
  };

  return (
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
        <FormControl>
          <Typography mb={1} component="label" htmlFor="email">
            Password
          </Typography>

          <Button
            onClick={onShowResetPasswordPopup}
            variant="outlined"
            color="primary"
            sx={{ fontWeight: 'normal' }}
          >
            Reset Password
          </Button>
        </FormControl>
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
                    onDelete={() =>
                      handleDelete(
                        internalCompanies?.find((item) => item?.id === value)?.id,
                        setValue
                      )
                    }
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

      {/* <Grid item xs={12} md={12}>
        <FormControl fullWidth>
          <InputLabel id="select-company">User Group</InputLabel>

          <Select
            label="User Group"
            labelId="demo-simple-select-outlined-label-type"
            error={Boolean(formState?.errors?.role_id)}
            id="role_id"
            {...register('role_id', {
              required: 'Role must be filled out',
            })}
            multiple
            value={watch('role_id')}
            input={
              <OutlinedInput
                error={Boolean(formState?.errors?.role_id)}
                id="select-multiple-chip"
                label="Chip"
              />
            }
            onMouseDown={(event) => {
              event.stopPropagation();
            }}
            renderValue={() => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {[watch('role_id')]?.map((value: any) => (
                  <Chip
                    sx={{
                      bgcolor: '#D6F3F9',
                      color: 'info.dark',
                    }}
                    key={value}
                    label={roles?.find((item) => item?.id === value)?.name}
                    onDelete={() =>
                      handleDelete(roles?.find((item) => item?.id === value)?.id, setValue)
                    }
                  />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
            inputProps={{ 'aria-label': 'Without label' }}
          >
            {roles &&
              roles?.map((role) => (
                <MenuItem
                  key={role?.id}
                  value={role?.id}
                  style={getStyles(role?.id, [watch('role_id') ?? 0], theme)}
                >
                  {role?.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        {formState?.errors?.role_id && (
          <FormHelperText sx={{ color: 'error.main' }}>
            {String(formState?.errors?.role_id?.message)}
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
    </Grid>
  );
}

interface EditUserProps {
  type: 'client' | 'internal';
}

export function EditAccessControlUserView({ type }: EditUserProps) {
  const theme = useTheme();
  const { id } = useParams();
  const [isLoading, setIsLoading] = React.useState(false);
  const [divisions, setDivisions] = React.useState<Department[] | []>([]);
  const [isShowResetPasswordPopup, setIsShowResetPasswordPopup] = React.useState(false);

  const { data: user } = useUserById(Number(id));
  const { data: roles } = useRole();
  const { mutate: updateUser } = useUpdateUser({ isRbac: true });
  const { mutate: updatePassword } = useUpdateUserPassword();
  const { data: clientCompanies } = useClientCompanies();
  const { data: internalCompanies } = useInternalCompanies();
  // const { data: userCompaniesData } = useUserCompanyById(Number(id));
  const { mutate: addUserCompany } = useAddUserCompany();
  const [userCompany, setUserCompany] = React.useState<number | null>(null);
  const [userCompanies, setUserCompanies] = React.useState<InternalCompany[]>([]);

  const defaultValues = {
    name: user?.user_info?.name,
    email: user?.email,
    role_id: user?.user_info?.role_id,
    profile_picture: user?.user_info?.profile_picture ?? '',
    company_id: user?.user_info?.company_id,
    department_id: user?.user_info?.department_id,
    internal_id: user?.internal_companies?.map((item) => item?.company?.id) ?? [],
  };

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

  const handleSubmit = (formData: UserAccessControlUpdateDTO) => {
    const payload = {
      ...formData,
      id: Number(id),
      user_type: type,
    };
    // if (defaultValues?.profile_picture) {
    //   Object.assign(payload, {
    //     profile_picture: defaultValues?.profile_picture,
    //   });
    // }
    updateUser(payload);
  };

  // User Company
  const onaddUserCompany = () => {
    addUserCompany({
      user_id: Number(id),
      company_id: userCompany,
    });
    setUserCompany(null);
  };

  const onChangeUserCompany = (e: SelectChangeEvent<number>, itemId: number) => {
    setUserCompanies((prevUserCompanies) => {
      const updatedUserCompanies = [...prevUserCompanies];
      // Update the string at the specified index
      const index = updatedUserCompanies?.findIndex((item) => item?.id === itemId);
      updatedUserCompanies[index].id = Number(e.target.value);
      return updatedUserCompanies;
    });
  };

  const onChangeUserCompanyNew = (e: SelectChangeEvent<number>) => {
    setUserCompany(Number(e.target.value));
  };

  const onShowResetPasswordPopup = () => {
    setIsShowResetPasswordPopup(true);
  };

  const onSubmitResetPassword = (formData: { password: string }) => {
    updatePassword({
      email: defaultValues?.email ?? '',
      password: formData?.password,
      id: Number(id),
    });
  };

  React.useEffect(() => {
    setUserCompanies(user?.internal_companies ?? []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
        Edit User
      </Typography>
      <Box display="flex" gap={2} sx={{ mb: { xs: 3, md: 5 } }}>
        <Typography>Access Control</Typography>
        <Typography color="grey.500">•</Typography>
        <Typography color="grey.500">Edit User</Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: { xs: 3, md: 5 }, ml: 0 }}>
        <Form
          onSubmit={handleSubmit}
          options={{
            defaultValues: {
              ...defaultValues,
            },
          }}
          schema={userInternalUpdateSchema}
        >
          {({ register, watch, control, formState, setValue }) => (
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
                <EditForm
                  formState={formState}
                  register={register}
                  control={control}
                  setValue={setValue}
                  watch={watch}
                  defaultValues={defaultValues}
                  fetchDivision={fetchDivision}
                  clientCompanies={clientCompanies}
                  divisions={divisions}
                  roles={roles}
                  isLoading={isLoading}
                  user={user}
                  type={type}
                  userCompany={userCompany}
                  userCompanies={userCompanies}
                  onChangeUserCompanyNew={onChangeUserCompanyNew}
                  onaddUserCompany={onaddUserCompany}
                  onChangeUserCompany={onChangeUserCompany}
                  internalCompanies={internalCompanies}
                  theme={theme}
                  onShowResetPasswordPopup={onShowResetPasswordPopup}
                />
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
                  Save Changes
                </LoadingButton>
              </Box>
            </>
          )}
        </Form>
      </Grid>
      <ResetPasswordAction
        isShowResetPasswordPopup={isShowResetPasswordPopup}
        setIsShowResetPasswordPopup={setIsShowResetPasswordPopup}
        onSubmitResetPassword={onSubmitResetPassword}
      />
    </DashboardContent>
  );
}
