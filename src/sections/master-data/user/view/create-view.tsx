import Typography from '@mui/material/Typography';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  MenuList,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Theme,
  useTheme,
  menuItemClasses,
  Autocomplete,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { Form } from 'src/components/form/form';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import React, { useEffect, useState } from 'react';
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
  useNonInternalCompanies,
  useProductByCompanyId,
} from 'src/services/master-data/company';
import { API_URL } from 'src/constants';
import { getSession } from 'src/sections/auth/session/session';
import { Department, InternalCompany } from 'src/services/master-data/company/types';
import {
  UserInternalDTO,
  UserClientDTO,
  userClientSchema,
  userInternalSchema,
} from 'src/services/master-data/user/schemas/user-schema';
import { Controller, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { Bounce, toast } from 'react-toastify';
import { Company } from 'src/services/request/types';
import { RemoveAction } from './remove-action';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: { style: { maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP, width: 250 } },
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
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [selectedProductsTemp, setSelectedProductsTemp] = useState<number[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [companyRelation, setCompanyRelation] = useState<Company[]>([]);

  const defaultValues = { internal_id: [] };

  const fetchDivision = async (companyId: number) => {
    const data = await fetch(`${API_URL}/departments?company_id=${companyId}`, {
      headers: { Authorization: `Bearer ${getSession()}` },
    }).then((res) =>
      res.json().then((value) => {
        setDivisions(value?.data);
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
    setIsLoading(true);
    try {
      addUser({
        ...formData,
        user_type: type,
        internal_id: userCompanies?.length > 0 ? userCompanies : formData?.internal_id,
        product_id: selectedProducts,
      });
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

  const onChangeUserCompany = (e: SelectChangeEvent<number>, itemId: number) => {
    setUserCompanies((prevUserCompanies) => {
      const updatedUserCompanies = [...prevUserCompanies];
      // Update the string at the specified index
      const index = updatedUserCompanies?.findIndex((item) => item === itemId);
      updatedUserCompanies[index] = Number(e.target.value);
      return updatedUserCompanies;
    });
  };

  const onClickEdit = (selectedItemId: number) => {
    setIsEditMode(true);
    setSelectedProductsTemp(selectedProducts);
    if (selectedCompanyId === null) {
      setSelectedCompanyId(selectedItemId);
      setExistingUserCompany(selectedItemId);
    } else if (selectedItemId !== selectedCompanyId) {
      setSelectedCompanyId(selectedItemId);
      setExistingUserCompany(selectedItemId);
    } else {
      setSelectedCompanyId(null);
      setExistingUserCompany(null);
    }
  };

  const onSaveUserCompany = () => {
    setSelectedProducts(selectedProductsTemp);
    setSelectedCompanyId(null);
    setExistingUserCompany(null);
  };

  // User Company
  const onAddUserCompany = () => {
    const hasUserCompanies = userCompanies?.some((item) => item === userCompany);

    if (!hasUserCompanies) {
      setUserCompanies((prevUserCompanies: any) => {
        const updatedUserCompanies = [...prevUserCompanies, userCompany];
        return updatedUserCompanies;
      });
      setSelectedProducts(selectedProductsTemp);
      setUserCompany(null);
    } else {
      toast.error(`Company already selected`, {
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
    }
  };

  const onClickRemove = (itemId?: number) => {
    if (itemId) setSelectedId(itemId);
    setOpenRemoveModal(true);
  };

  const onRemove = () => {
    const newCompanies = userCompanies?.filter((item) => item !== selectedId);
    setUserCompanies(newCompanies);
    setOpenRemoveModal(false);
  };

  const onChangeUserCompanyNew = (e: SelectChangeEvent<number>) => {
    setUserCompany(Number(e.target.value));
  };

  const onChangeProductFilter = (productFilterId: number) => {
    const hasProduct = selectedProductsTemp?.includes(productFilterId);
    if (!hasProduct) {
      setSelectedProductsTemp([...selectedProductsTemp, productFilterId]);
    } else {
      const newArr = selectedProductsTemp?.filter((item) => item !== productFilterId);
      setSelectedProductsTemp(newArr);
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
          options={{ defaultValues: { ...defaultValues } }}
        >
          {({ register, control, watch, formState, setValue }) => (
            <Grid container spacing={3} xs={12}>
              <Grid item xs={12} md={12}>
                <FieldDropzone
                  label="Upload Picture"
                  helperText="Picture maximum 5mb size"
                  controller={{ name: 'cover', control }}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  error={Boolean(formState?.errors?.name)}
                  sx={{ width: '100%' }}
                  label="Name"
                  {...register('name', { required: 'Name must be filled out' })}
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
              {/* {type === 'internal' ? ( */}
              {type === 'internal' ? (
                <Grid item xs={12} md={12}>
                  <Typography variant="h4" color="primary" mb={2}>
                    Internal Company
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={2}>
                    {internalCompanies
                      ?.filter((item) =>
                        userCompanies?.some((userCompanyItem) => userCompanyItem === item?.id)
                      )
                      ?.map((item, index) => (
                        <>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            spacing={3}
                            alignItems="center"
                          >
                            <Box width="100%">
                              <FormControl fullWidth>
                                <InputLabel id="existing-company">Internal Company</InputLabel>
                                <Select
                                  label="Internal Company"
                                  value={userCompanies[index]}
                                  disabled
                                >
                                  {internalCompanies?.map((company) => (
                                    <MenuItem value={company?.id}>{company?.name}</MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Box>
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
                              <MenuItem onClick={() => onClickEdit(item?.id)}>
                                <Iconify icon="solar:pen-bold" />
                                Edit
                              </MenuItem>
                              <MenuItem
                                onClick={() => onClickRemove(item?.id)}
                                sx={{ color: 'error.main' }}
                              >
                                <Iconify icon="solar:trash-bin-trash-bold" />
                                Delete
                              </MenuItem>
                            </MenuList>
                          </Stack>

                          {item?.id === selectedCompanyId && (
                            <Card
                              sx={{
                                width: '100%',
                                p: 4,
                                boxShadow: '2',
                                position: 'relative',
                                backgroundColor: 'blue.50',
                                borderRadius: 4,
                              }}
                            >
                              <Typography fontSize={18} fontWeight="bold">
                                Product Handled
                              </Typography>
                              <Box
                                display="grid"
                                gridTemplateColumns="repeat(2, 1fr)"
                                gap={2}
                                mt={2}
                              >
                                {existingCompanyProducts &&
                                  existingCompanyProducts?.map((existingItem, existingIndex) => (
                                    <Box
                                      gridColumn={`${existingIndex % 2 === 0 ? '1 / 2' : '2 / 4'}`}
                                    >
                                      <Box display="flex" alignItems="center" gap={1}>
                                        <Checkbox
                                          id={`item-${existingItem?.id}`}
                                          onChange={() => onChangeProductFilter(existingItem?.id)}
                                          checked={selectedProductsTemp?.includes(existingItem?.id)}
                                        />{' '}
                                        <Typography
                                          sx={{ cursor: 'pointer' }}
                                          component="label"
                                          htmlFor={`item-${existingItem?.id}`}
                                        >
                                          {existingItem?.name}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  ))}
                              </Box>
                              <Box display="flex" justifyContent="end" width="100%" sx={{ mt: 4 }}>
                                <Button
                                  size="small"
                                  onClick={onSaveUserCompany}
                                  variant="contained"
                                  color="primary"
                                  sx={{ width: 120 }}
                                >
                                  Save
                                </Button>
                              </Box>
                            </Card>
                          )}
                        </>
                      ))}
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
                              internalCompanies?.find((company) => company.id === userCompany) ||
                              null
                            }
                            onChange={(_, selectedCompany) => {
                              if (selectedCompany) {
                                onChangeUserCompanyNew({
                                  target: { value: selectedCompany.id },
                                } as any);
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
              ) : (
                companyRelation.length > 0 && (
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
                                checked={watch('internal_id')?.some((itm: any) => item.id === itm)}
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
                )
              )}

              {type === 'client' ? (
                watch('company_id') ? (
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
                ) : null
              ) : null}
              {/* ) : null} */}

              {userCompany !== null && type === 'internal' ? (
                <Grid item xs={12} md={12}>
                  <Card
                    sx={{
                      width: '100%',
                      p: 4,
                      boxShadow: '2',
                      position: 'relative',
                      backgroundColor: 'blue.50',
                      borderRadius: 4,
                    }}
                  >
                    <Typography fontSize={18} fontWeight="bold">
                      Product Handled
                    </Typography>
                    <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2} mt={2}>
                      {companyProducts &&
                        companyProducts?.map((item, index) => (
                          <Box gridColumn={`${index % 2 === 0 ? '1 / 2' : '2 / 4'}`}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Checkbox
                                id={`item-${item?.id}`}
                                onChange={() => onChangeProductFilter(item?.id)}
                                checked={selectedProductsTemp?.includes(item?.id)}
                              />{' '}
                              <Typography
                                sx={{ cursor: 'pointer' }}
                                component="label"
                                htmlFor={`item-${item?.id}`}
                              >
                                {item?.name}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                    </Box>
                    <Box display="flex" justifyContent="end" width="100%" sx={{ mt: 4 }}>
                      <Button
                        size="small"
                        onClick={onAddUserCompany}
                        variant="contained"
                        color="primary"
                        sx={{ width: 120 }}
                      >
                        Save
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ) : null}

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

              <Grid item xs={12} md={12}>
                <TextField
                  error={Boolean(formState?.errors?.password)}
                  fullWidth
                  label="Password"
                  {...register('password', { required: 'Password must be filled out' })}
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
                    {...register('role_id', { required: 'Role must be filled out' })}
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
          )}
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
