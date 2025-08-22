import Typography from '@mui/material/Typography';
import type { SelectChangeEvent, Theme } from '@mui/material';
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
  Select,
  Stack,
  TextField,
  useTheme,
  Autocomplete,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { Form } from 'src/components/form/form';
import { useParams } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import React, { useEffect, useState } from 'react';
import { Iconify } from 'src/components/iconify';
import { useAddUser, useUpdateUser, useUserById } from 'src/services/master-data/user';
import { useRole } from 'src/services/master-data/role';
import {
  useInternalCompanies,
  useNonInternalCompanies,
  useProductByCompanyId,
} from 'src/services/master-data/company';
import { API_URL } from 'src/constants';
import { getSession } from 'src/sections/auth/session/session';
import type { Department } from 'src/services/master-data/company/types';
import type {
  UserInternalDTO,
  UserClientDTO,
} from 'src/services/master-data/user/schemas/user-schema';
import {
  userClientSchema,
  userInternalSchema,
} from 'src/services/master-data/user/schemas/user-schema';
import type { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import type { Company } from 'src/services/request/types';
import { RemoveAction } from 'src/sections/master-data/user/view/remove-action';
import { Icon } from '@iconify/react';
import ModalDialog from 'src/components/modal/modal';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: { style: { maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP, width: 250 } },
};

// internal_id: null,
// department_id: '',
// title_id: null,
// product_id: null,

interface SelectedInternalCompanies {
  internal_id: number | null;
  department_id: string;
  title_id: number | null;
  product_id: number[] | null;
}

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

export function CreateUserView({ isEdit }: { isEdit?: boolean }) {
  const theme = useTheme();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [divisions, setDivisions] = React.useState<Department[] | []>([]);
  const [titles, setTitles] = React.useState<any[] | []>([]);
  const { mutate: addUser } = useAddUser({ isRbac: false });
  const { mutate: updateUser } = useUpdateUser({ isRbac: false });
  const { data: roles } = useRole();
  const [isOpenCompanySelection, setIsOpenCompanySelection] = useState(false);
  const { data: companies } = useNonInternalCompanies(true);
  const { data: internalCompanies } = useInternalCompanies();
  const [userCompany, setUserCompany] = React.useState<number | null>(null);
  const [existingUserCompany, setExistingUserCompany] = React.useState<number | null>(null);
  const { data: companyProducts } = useProductByCompanyId(Number(userCompany), false, () =>
    setIsOpenCompanySelection(false)
  );
  const { data: existingCompanyProducts } = useProductByCompanyId(Number(existingUserCompany));
  const [userCompanies, setUserCompanies] = React.useState<number[]>([]);
  const [openRemoveModal, setOpenRemoveModal] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<number | undefined>();
  const [companyRelation, setCompanyRelation] = useState<Company[]>([]);

  const [divisionsOption, setDivisionsOption] = useState<any[]>([]);
  const [titlesOption, setTitlesOption] = useState<any[]>([]);
  const [productsOption, setProductsOption] = useState<any[]>([]);

  const fetchDivision = async (companyId: number, index?: number) => {
    const data = await fetch(`${API_URL}/departments?company_id=${companyId}`, {
      headers: { Authorization: `Bearer ${getSession()}` },
    }).then((res) =>
      res.json().then((value) => {
        if (typeof index === 'number') {
          setDivisionsOption((prev) => {
            const updated = [...prev];
            updated[index] = value?.data;
            return updated;
          });
        } else {
          setDivisions(value?.data);
        }
      })
    );
    return data;
  };

  const fetchTitles = async (companyId: number, index?: number) => {
    const data = await fetch(`${API_URL}/titles?company_id=${companyId}`, {
      headers: { Authorization: `Bearer ${getSession()}` },
    }).then((res) =>
      res.json().then((value) => {
        if (typeof index === 'number') {
          setTitlesOption((prev) => {
            const updated = [...prev];
            updated[index] = value?.data;
            return updated;
          });
        } else {
          setTitles(value?.data);
        }
      })
    );
    return data;
  };

  const fetchProducts = async (companyId: number, index?: number) => {
    const data = await fetch(`${API_URL}/products?company_id=${companyId}`, {
      headers: { Authorization: `Bearer ${getSession()}` },
    }).then((res) =>
      res.json().then((value) => {
        if (typeof index === 'number') {
          setProductsOption((prev) => {
            const updated = [...prev];
            updated[index] = value?.data;
            return updated;
          });
        }
      })
    );
    return data;
  };

  const fetchRelationCompany = async (companyId: number) => {
    const data = await fetch(
      `${API_URL}/company-relation?client_company_id=${companyId}&page_size=999`,
      {
        headers: { Authorization: `Bearer ${getSession()}` },
      }
    ).then((res) =>
      res.json().then((value) => {
        if (value?.data?.length > 0) {
          setCompanyRelation(value?.data?.map((item: any) => item?.internal_company));
        }
      })
    );
    return data;
  };

  const handleSubmit = (formData: UserClientDTO | UserInternalDTO) => {
    console.log(formData, 'formData');
    setIsLoading(true);
    const payload = {
      ...formData,
      user_type: companyType,
      // internal_id: selectedCompanies?.length > 0 ? selectedCompanies : formData?.internal_id,
      // product_id: selectedProducts,
      // internalCompanies: selectedInternalCompanies,
      // internal_arr: internalCompanyData,
    };
    if (companyType === 'internal') {
      Object.assign(payload, {
        internal_arr: selectedInternalCompanies,
      });
    }
    console.log(payload, 'payloadnya');

    try {
      if (isEdit) {
        updateUser({
          id: user?.id ?? 0,
          ...payload,
        });
      } else {
        addUser(payload);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsOpenCompanySelection(false);
  }, [existingCompanyProducts, companyProducts]);

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

  const [internalCompanyData, setInternalCompanyData] = useState<any[]>([]);

  const onRemove = () => {
    const newCompanies = userCompanies?.filter((item) => item !== selectedId);
    const newInternalCompanyData = internalCompanyData?.filter(
      (item) => item?.internal_id !== selectedId
    );
    setUserCompanies(newCompanies);
    setInternalCompanyData(newInternalCompanyData);
    setOpenRemoveModal(false);
  };

  const [companyType, setCompanyType] = useState('');
  const [selectedInternalCompanies, setSelectedInternalCompanies] = useState<
    SelectedInternalCompanies[]
  >([
    {
      internal_id: null,
      department_id: '',
      title_id: null,
      product_id: null,
    },
  ]);

  const onChangeCompanyType = (e: SelectChangeEvent) => {
    console.log(e.target.value);
    setCompanyType(e.target.value);
  };

  const onClickAddInternalCompany = () => {
    setSelectedInternalCompanies((prev) => [
      ...prev,
      {
        internal_id: null,
        department_id: '',
        title_id: null,
        product_id: null,
      },
    ]);
  };

  console.log(selectedInternalCompanies, 'log: selected');

  const handleChangeInternalCompanies = (e: React.ChangeEvent<any>, index: number) => {
    const newArr = selectedInternalCompanies?.map((company, companyIndex) => {
      if (companyIndex === index) {
        return {
          ...company,
          [e.target.name]: e.target.value,
        };
      }
      return company;
    });
    setSelectedInternalCompanies(newArr);
  };

  const onDeleteSelectedInternalCompany = (index: number) => {
    const newArr = selectedInternalCompanies?.filter((_, companyIndex) => companyIndex !== index);
    if (selectedInternalCompanies.length > 1) {
      setSelectedInternalCompanies(newArr);
    }
  };

  // Edit states
  const { id } = useParams();
  const { data: user } = useUserById(Number(id));
  const [tempPassword, setTempPassword] = useState('');
  const [isOpenResetPassword, setIsOpenResetPassword] = useState<boolean>(false);

  const defaultValues = isEdit
    ? user?.user_info?.user_type === 'internal'
      ? {
          name: user?.user_info?.name,
          email: user?.email,
          phone: user?.phone,
          role_id: user?.user_info?.role_id,
          profile_picture: user?.user_info?.profile_picture ?? '',
          companyType: 'internal',
          selectedInternalCompanies: user?.internal_companies?.map((internal) => ({
            department_id: internal.department_id,
            title_id: internal.title_id,
            internal_id: internal.id,
            product_id: [],
          })),
        }
      : {
          name: user?.user_info?.name,
          email: user?.email,
          phone: user?.phone,
          role_id: user?.user_info?.role_id,
          profile_picture: user?.user_info?.profile_picture ?? '',
          company_id: user?.user_info?.company_id,
          department_id: user?.user_info?.department_id,
          internal_id: user?.internal_companies?.map((item) => item?.company_id) ?? [],
        }
    : {};

  const onChangeTempPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempPassword(e.target.value);
  };

  const onSavePassword = (setValue: UseFormSetValue<UserInternalDTO>) => {
    setValue('password', tempPassword);
    setIsOpenResetPassword(false);
  };
  const productAssignments = user?.products_handled; // the array you showed

  const productsByCompany = productAssignments?.reduce(
    (acc, item) => {
      const companyId = item.product.company_id;

      if (!acc[companyId]) {
        acc[companyId] = [];
      }

      acc[companyId].push(item.product_id);

      return acc;
    },
    {} as Record<number, number[]>
  );
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
        {!isEdit ? 'Create New User' : 'Edit User'}
      </Typography>
      <Box display="flex" gap={2} sx={{ mb: { xs: 3, md: 5 } }}>
        <Typography>Access Control</Typography>
        <Typography color="grey.500">•</Typography>
        <Typography color="grey.500">{!isEdit ? 'Create New User' : 'Edit User'}</Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: { xs: 3, md: 5 }, ml: 0 }}>
        <Form
          width="100%"
          onSubmit={handleSubmit}
          schema={companyType === 'internal' ? userInternalSchema : userClientSchema}
          options={{ defaultValues: { ...defaultValues } }}
        >
          {({ register, control, watch, formState, setValue }) => {
            useEffect(() => {
              if (isEdit && user?.user_info) {
                console.log('set role?');
                setValue('role_id', user.user_info.role_id);
                setCompanyType(user.user_info.user_type);
                const newArr =
                  user?.internal_companies?.map((internal) => ({
                    department_id: String(internal.department_id),
                    title_id: internal.title_id,
                    internal_id: internal.company_id ?? null,
                    product_id: productsByCompany?.[internal.company_id] ?? [],
                  })) ?? [];
                setSelectedInternalCompanies(newArr);
              }
              // fetch dependent options for each internal company
              user?.internal_companies?.forEach((internal, index) => {
                fetchDivision(internal.company_id, index);
                fetchTitles(internal.company_id, index);
                fetchProducts(internal.company_id, index);
              });
              // eslint-disable-next-line react-hooks/exhaustive-deps
            }, [roles, user, isEdit, setValue]);
            return (
              <Grid container spacing={3} xs={12}>
                {/* <Grid item xs={12} md={12}>
              <FieldDropzone
                label="Upload Picture"
                helperText="Picture maximum 5mb size"
                controller={{ name: 'cover', control }}
              />
            </Grid> */}
                <Grid item xs={12} md={12}>
                  <TextField
                    error={Boolean(formState?.errors?.name)}
                    sx={{ width: '100%' }}
                    label="Username"
                    {...register('name', { required: 'Name must be filled out' })}
                    autoComplete="off"
                  />
                  {formState?.errors?.name && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {String(formState?.errors?.name?.message)}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={12}>
                  <TextField
                    error={Boolean(formState?.errors?.email)}
                    sx={{ width: '100%' }}
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
                    sx={{ width: '100%' }}
                    label="Phone No."
                    {...register('phone', { required: 'Phone Number must be filled out' })}
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
                {!isEdit ? (
                  <Grid item xs={12} md={12}>
                    <TextField
                      error={Boolean(formState?.errors?.password)}
                      fullWidth
                      placeholder="at least 8 characters"
                      label="Password"
                      {...register('password', { required: 'Password must be filled out' })}
                      // InputLabelProps={{ shrink: true }}
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
                ) : (
                  <Grid item xs={12} md={12}>
                    <ModalDialog
                      open={isOpenResetPassword}
                      setOpen={setIsOpenResetPassword}
                      minWidth={600}
                      title="Reset Password"
                      content={
                        (
                          <Box mt={2}>
                            <Box sx={{ mb: 3 }}>
                              <Typography mb={1} fontWeight={500}>
                                New Password
                              </Typography>
                              <TextField
                                error={Boolean(formState?.errors?.password)}
                                fullWidth
                                {...register('password', {
                                  required: 'Password must be filled out',
                                })}
                                onChange={onChangeTempPassword}
                                variant="outlined"
                                InputLabelProps={{ shrink: false }}
                                type={showPassword ? 'text' : 'password'}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                      >
                                        <Iconify
                                          icon={
                                            showPassword
                                              ? 'solar:eye-bold'
                                              : 'solar:eye-closed-bold'
                                          }
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
                            </Box>
                            <Box display="flex" justifyContent="flex-end">
                              <Button
                                onClick={() => onSavePassword(setValue)}
                                variant="contained"
                                color="primary"
                              >
                                Save
                              </Button>
                            </Box>
                          </Box>
                        ) as any
                      }
                    >
                      {/* Button Open Modal */}
                      <Button
                        type="button"
                        sx={{
                          paddingY: 0.5,
                          border: 1,
                          borderColor: 'primary.main',
                          borderRadius: 1.5,
                        }}
                      >
                        Reset Password
                      </Button>
                    </ModalDialog>
                  </Grid>
                )}

                <Grid item xs={12} md={12}>
                  <FormControl fullWidth>
                    <InputLabel id="company-type">Company Type</InputLabel>
                    <Select
                      labelId="company-type"
                      onChange={onChangeCompanyType}
                      label="Company Type"
                      value={companyType}
                      defaultValue={isEdit ? user?.user_info.user_type : ''}
                    >
                      <MenuItem value="internal">Internal</MenuItem>
                      <MenuItem value="holding">Holding</MenuItem>
                      <MenuItem value="sub-company">Sub-Company</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {companyType === 'holding' || companyType === 'sub-company' ? (
                  <Grid item xs={12} md={12}>
                    <FormControl fullWidth>
                      {/* <InputLabel id="select-company">Company</InputLabel> */}

                      <Controller
                        name="company_id"
                        control={control}
                        rules={{
                          required: 'Company must be filled out',
                        }}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <Autocomplete
                            options={companies || []}
                            getOptionLabel={(option) => option?.name || ''}
                            isOptionEqualToValue={(option, val) => option?.id === val?.id}
                            value={companies?.find((company) => company.id === value) || null}
                            onChange={async (_, selectedCompany) => {
                              const selectedIdCompany = selectedCompany?.id || null;
                              onChange(selectedIdCompany);
                              if (selectedIdCompany) {
                                await fetchDivision(selectedIdCompany);
                                await fetchTitles(selectedIdCompany);
                                await fetchRelationCompany(selectedIdCompany);
                              }
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Company"
                                error={!!error}
                                helperText={error?.message}
                              />
                            )}
                          />
                        )}
                      />
                    </FormControl>
                    {formState?.errors?.company_id && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {String(formState?.errors?.company_id?.message)}
                      </FormHelperText>
                    )}
                  </Grid>
                ) : null}

                {companyType === 'holding' || companyType === 'sub-company' ? (
                  <Grid item xs={12} md={12}>
                    <FormControl fullWidth>
                      <InputLabel id="select-division">Division</InputLabel>
                      <Select
                        labelId="select-division"
                        error={Boolean(formState?.errors?.department_id)}
                        {...register('department_id', { required: 'Division must be filled out' })}
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
                {(companyType === 'holding' || companyType === 'sub-company') && (
                  <Grid item xs={12} md={12}>
                    <FormControl fullWidth>
                      <InputLabel id="select-division">Title</InputLabel>
                      <Select
                        labelId="select-title"
                        error={Boolean(formState?.errors?.title_id)}
                        {...register('title_id', { required: 'Title must be filled out' })}
                        label="Title"
                      >
                        {titles?.map((title) => (
                          <MenuItem value={title?.id}>{title?.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {formState?.errors?.title_id && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {String(formState?.errors?.title_id?.message)}
                      </FormHelperText>
                    )}
                  </Grid>
                )}
                {/* {type === 'internal' ? ( */}
                {/* {companyType === 'holding' || companyType === 'sub-company' && (
              <>
                {companyRelation.length > 0 && (
                  <Grid item xs={12} md={12}>
                    <Typography variant="h4" color="primary" mb={2}>
                      Internal Company
                    </Typography>
                    <FormControl fullWidth>
                      <Card
                        sx={{
                          width: '100%',
                          mt: 2,
                          p: 4,
                          boxShadow: '2',
                          position: 'relative',
                          backgroundColor: 'blue.50',
                          borderRadius: 4,
                        }}
                      >
                        <Box display="flex" flexDirection="column" gap={2}>
                          {companyRelation?.map((item, index) => (
                            <Box display="flex" alignItems="center" gap={1} key={index}>
                              <Checkbox
                                value={item?.id}
                                id={`item-${item?.id}`}
                                onChange={(e) => {
                                  const currentIds = watch('internal_id') || [];
                                  if (e.target.checked) {
                                    setValue('internal_id', [...currentIds, item.id]);
                                  } else {
                                    setValue(
                                      'internal_id',
                                      currentIds.filter((id: number) => id !== item.id)
                                    );
                                  }
                                }}
                                checked={watch('internal_id')?.some(
                                  (itm: any) => item.id === itm
                                )}
                              />{' '}
                              <Typography
                                sx={{ cursor: 'pointer' }}
                                component="label"
                                htmlFor={`item-${item?.id}`}
                              >
                                {item?.name}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Card>
                    </FormControl>
                    {formState?.errors?.internal_id && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {String(formState?.errors?.internal_id?.message)}
                      </FormHelperText>
                    )}
                  </Grid>
                )}
              </>
            )} */}

                {companyType === 'internal' && (
                  <>
                    <Grid item xs={12} md={12}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography fontWeight="bold" color="black" fontSize={20}>
                          Choose Internal Company
                        </Typography>

                        <Button
                          onClick={onClickAddInternalCompany}
                          variant="contained"
                          color="primary"
                        >
                          Add Company
                        </Button>
                      </Stack>
                    </Grid>
                    {/* <Grid item xs={12} md={12}>
                      <Box display="flex" flexDirection="column" gap={2}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          spacing={3}
                          alignItems="center"
                        >
                          <Box width="100%">
                            <Autocomplete
                              multiple
                              options={internalCompanies || []}
                              getOptionLabel={(option) => option.name || ''}
                              value={(internalCompanies || []).filter((internalCompany) =>
                                (selectedCompanies || []).includes(internalCompany.id as never)
                              )}
                              onChange={(event, newValue) => {
                                setSelectedCompanies(newValue.map((c) => c.id));
                              }}
                              renderTags={(value, getTagProps) =>
                                value.map((option, idx) => (
                                  <Chip
                                    label={option.name}
                                    {...getTagProps({ index: idx })}
                                    key={option.id}
                                    sx={{ bgcolor: '#D6F3F9', color: 'info.dark' }}
                                  />
                                ))
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="outlined"
                                  placeholder="Internal Company"
                                  label="Internal Company"
                                  InputLabelProps={{ shrink: true }}
                                />
                              )}
                              isOptionEqualToValue={(option, value) => option.id === value.id}
                            />
                          </Box>
                        </Stack>
                      </Box>
                      {formState?.errors?.internal_id && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {String(formState?.errors?.internal_id?.message)}
                        </FormHelperText>
                      )}
                    </Grid> */}
                  </>
                )}

                {companyType === 'internal' && (
                  <>
                    {selectedInternalCompanies?.map((userSelectedCompany, index) => (
                      <Box
                        sx={{
                          bgcolor: '#F5F9FA',
                          p: 4,
                          mt: 2,
                          borderRadius: '8px',
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 3,
                        }}
                      >
                        {companyType === 'internal' ? (
                          <Grid item xs={12} md={12}>
                            <Box display="flex" flexDirection="column" gap={2}>
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                                spacing={3}
                                alignItems="center"
                              >
                                <Box width="100%">
                                  <FormControl fullWidth>
                                    {/* <InputLabel id="userCompany">Internal Company</InputLabel> */}
                                    <Autocomplete
                                      options={internalCompanies || []}
                                      getOptionLabel={(option) => option?.name || ''}
                                      isOptionEqualToValue={(option, val) => option?.id === val?.id}
                                      value={
                                        internalCompanies?.find(
                                          (c) => c.id === userSelectedCompany.internal_id
                                        ) || null
                                      }
                                      onChange={async (_, selectedCompany) => {
                                        if (selectedCompany) {
                                          handleChangeInternalCompanies(
                                            {
                                              target: {
                                                name: 'internal_id',
                                                value: selectedCompany.id,
                                              },
                                            } as any,
                                            index
                                          );
                                          await fetchDivision(selectedCompany?.id, index);
                                          await fetchTitles(selectedCompany?.id, index);
                                          await fetchProducts(selectedCompany?.id, index);
                                        }
                                      }}
                                      open={isOpenCompanySelection}
                                      onOpen={() => setIsOpenCompanySelection(true)}
                                      onClose={() => setIsOpenCompanySelection(false)}
                                      renderInput={(params) => (
                                        <TextField {...params} label="Internal Company" />
                                      )}
                                    />
                                  </FormControl>
                                </Box>
                              </Stack>
                            </Box>
                          </Grid>
                        ) : null}
                        {companyType === 'internal' ? (
                          <Grid item xs={12} md={12}>
                            <FormControl fullWidth>
                              <InputLabel id="select-division">Division</InputLabel>
                              <Select
                                labelId="select-division"
                                error={Boolean(formState?.errors?.department_id)}
                                onChange={async (e, selectedCompanyDivision) => {
                                  if (selectedCompanyDivision) {
                                    handleChangeInternalCompanies(
                                      {
                                        target: {
                                          name: 'department_id',
                                          value: e.target.value,
                                        },
                                      } as any,
                                      index
                                    );
                                  }
                                }}
                                value={userSelectedCompany.department_id}
                                label="Division"
                              >
                                {divisionsOption[index]?.map((division: any) => (
                                  <MenuItem value={division?.id.toString()}>
                                    {division?.name}
                                  </MenuItem>
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

                        {companyType === 'internal' && watch('department_id') !== null ? (
                          <Grid item xs={12} md={12}>
                            <FormControl fullWidth>
                              <InputLabel id="select-title">Title</InputLabel>
                              <Select
                                labelId="select-title"
                                error={Boolean(formState?.errors?.title_id)}
                                onChange={async (e, selectedTitleDivision) => {
                                  if (selectedTitleDivision) {
                                    handleChangeInternalCompanies(
                                      {
                                        target: {
                                          name: 'title_id',
                                          value: e.target.value,
                                        },
                                      } as any,
                                      index
                                    );
                                  }
                                }}
                                value={userSelectedCompany.title_id}
                                label="Title"
                              >
                                {titlesOption[index]?.map((title: any) => (
                                  <MenuItem value={title?.id.toString()}>{title?.name}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            {formState?.errors?.title_id && (
                              <FormHelperText sx={{ color: 'error.main' }}>
                                {String(formState?.errors?.title_id?.message)}
                              </FormHelperText>
                            )}
                          </Grid>
                        ) : null}

                        {companyType === 'internal' ? (
                          <Grid item xs={12} md={12}>
                            <Box display="flex" flexDirection="column" gap={2}>
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                                spacing={3}
                                alignItems="center"
                              >
                                <Box width="100%">
                                  <Autocomplete
                                    multiple
                                    options={productsOption[index] || []}
                                    getOptionLabel={(option) => option.name || ''}
                                    value={(productsOption[index] || []).filter((product: any) =>
                                      (userSelectedCompany.product_id || []).includes(
                                        product.id as never
                                      )
                                    )}
                                    onChange={(event, newValue) => {
                                      handleChangeInternalCompanies(
                                        {
                                          target: {
                                            name: 'product_id',
                                            value: newValue.map((c) => c.id),
                                          },
                                        } as any,
                                        index
                                      );
                                    }}
                                    renderTags={(value, getTagProps) =>
                                      value.map((option, idx) => (
                                        <Chip
                                          label={option.name}
                                          {...getTagProps({ index: idx })}
                                          key={option.id}
                                          sx={{ bgcolor: '#D6F3F9', color: 'info.dark' }}
                                        />
                                      ))
                                    }
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        variant="outlined"
                                        placeholder="Select product"
                                        label="Product Handled"
                                        InputLabelProps={{ shrink: true }}
                                      />
                                    )}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                  />
                                </Box>
                              </Stack>
                            </Box>
                          </Grid>
                        ) : null}
                        <Grid
                          item
                          xs={12}
                          md={12}
                          display="flex"
                          sx={{ justifyContent: 'flex-end' }}
                        >
                          <Button
                            onClick={() => onDeleteSelectedInternalCompany(index)}
                            startIcon={
                              <Icon icon="solar:trash-bin-trash-bold" width="20" height="20" />
                            }
                            color="error"
                            disabled={selectedInternalCompanies?.length < 2}
                          >
                            Hapus
                          </Button>
                        </Grid>
                      </Box>
                    ))}
                  </>
                )}

                <Grid item xs={12} md={12}>
                  <FormControl fullWidth>
                    <InputLabel id="select-role">Role</InputLabel>
                    <Select
                      labelId="select-role"
                      error={Boolean(formState?.errors?.role_id)}
                      {...register('role_id', { required: 'Role must be filled out' })}
                      label="Role"
                      defaultValue={isEdit ? user?.user_info.role_id : null}
                    >
                      {roles
                        ?.filter((role) =>
                          companyType === 'holding' || companyType === 'sub-company'
                            ? role?.id === 6
                            : role?.id !== 6
                        )
                        .map((role) => <MenuItem value={role?.id}>{role?.name}</MenuItem>)}
                    </Select>
                  </FormControl>
                  {formState?.errors?.role_id && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {String(formState?.errors?.role_id?.message)}
                    </FormHelperText>
                  )}
                </Grid>

                <Box display="flex" justifyContent="end" width="100%" sx={{ mt: 4 }}>
                  <LoadingButton
                    size="small"
                    loading={isLoading}
                    loadingIndicator="Submitting..."
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ width: 120 }}
                  >
                    Submit
                  </LoadingButton>
                </Box>
              </Grid>
            );
          }}
        </Form>
      </Grid>
      <RemoveAction
        onRemove={onRemove}
        openRemoveModal={openRemoveModal}
        setOpenRemoveModal={setOpenRemoveModal}
      />
    </DashboardContent>
  );
}
