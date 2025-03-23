import Typography from '@mui/material/Typography';
import {
  Box,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  useTheme,
  MenuList,
  menuItemClasses,
  Button,
  SelectChangeEvent,
  Checkbox,
  Card,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { Form } from 'src/components/form/form';
import { useParams } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import React, { useEffect } from 'react';
import {
  useAddUserCompany,
  useAddUserProduct,
  useDeleteUserProductById,
  useUpdateUser,
  useUpdateUserChangeCompany,
  useUserById,
  useUserCompanyById,
} from 'src/services/master-data/user';
import { type Role, useRole } from 'src/services/master-data/role';
import { FieldDropzone } from 'src/components/form';
import {
  UserClientUpdateDTO,
  UserInternalUpdateDTO,
  userClientSchema,
  userInternalUpdateSchema,
} from 'src/services/master-data/user/schemas/user-schema';
import {
  useClientCompanies,
  useInternalCompanies,
  useProductByCompanyId,
} from 'src/services/master-data/company';
import { getSession } from 'src/sections/auth/session/session';
import { API_URL } from 'src/constants';
import {
  Company,
  Department,
  InternalCompany,
  Products,
} from 'src/services/master-data/company/types';
import {
  Control,
  FormState,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { User } from 'src/services/master-data/user/types';
import { Iconify } from 'src/components/iconify';
import { useDeleteUserCompanyById } from 'src/services/master-data/user/use-user-company-delete';
import { Bounce, toast } from 'react-toastify';
import { RemoveAction } from './remove-action';

interface UserValues {
  name: string | undefined;
  email: string | undefined;
  phone: string | undefined;
  role_id: number | undefined;
  profile_picture: string;
  company_id: number | undefined;
  department_id: number | undefined;
  internal_id: number[];
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
  divisions: Department[] | [];
  roles: Role[] | undefined;
  isLoading: boolean;
  user: User | undefined;
  type: 'client' | 'internal';
  userCompany: any;
  userCompanies: InternalCompany[];
  onClickDeleteUserCompany: (userCompanyId: number) => void;
  onChangeUserCompanyNew: (e: SelectChangeEvent<number>) => void;
  onAddUserCompany: () => void;
  onChangeUserCompany: (e: SelectChangeEvent<number>, itemId: number) => void;
  internalCompanies: Company[] | undefined;
  onClickRemove: (id: number) => void;
  onAddCompany: (id: number) => void;
  onFetchRelationCompany: any;
  companyRelations: any[];
  companyProducts: Products[] | undefined;
  selectedProducts: number[];
  onChangeProductFilter: (productFilterId: number) => void;
  onClickEdit: (selectedItemId: number) => void;
  onSaveUserCompany: () => void;
  selectedCompanyId: number | null;
  existingCompanyProducts: Products[] | undefined;
  onChangeProductFilterEdit: (productFilterId: number, productId?: number) => void;
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
  onAddUserCompany,
  onChangeUserCompany,
  onClickDeleteUserCompany,
  internalCompanies,
  onClickRemove,
  onAddCompany,
  onFetchRelationCompany,
  companyRelations,
  companyProducts,
  selectedProducts,
  onChangeProductFilter,
  onClickEdit,
  onSaveUserCompany,
  selectedCompanyId,
  existingCompanyProducts,
  onChangeProductFilterEdit,
}: EditFormProps) {
  const { mutate: updateUser } = useUpdateUserChangeCompany({ isRbac: false });
  const { id } = useParams();
  useEffect(() => {
    setValue('name', defaultValues?.name);
    setValue('email', defaultValues?.email);
    setValue('phone', defaultValues?.phone);
    setValue('role_id', defaultValues?.role_id);
    setValue('company_id', defaultValues?.company_id);
    setValue('internal_id', defaultValues?.internal_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (divisions?.length) {
      setValue('department_id', defaultValues?.department_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [divisions]);

  const removeAllCompanies = async (internal_ids: number[]) => {
    if (internal_ids.length === 0) return;
    try {
      // Create an array of promises for each deletion
      const deletePromises = internal_ids.map(async (internal_id) => {
        try {
          await fetch(`${API_URL}/user-company/${internal_id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${getSession()}`,
            },
          });
          return { id, success: true };
        } catch (error) {
          return { id, success: false, error };
        }
      });

      await Promise.allSettled(deletePromises);

      toast.success('Successfully reset the company', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
        transition: Bounce,
      });
      setValue('internal_id', []);
    } catch (error) {
      toast.error('Failed to process deletions', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
        transition: Bounce,
      });
    }
  };

  const onSubmit = (formData: UserClientUpdateDTO) => {
    const payload = {
      ...formData,
      id: Number(id),
      user_type: type,
    };
    if (defaultValues?.profile_picture) {
      Object.assign(payload, {
        profile_picture: defaultValues?.profile_picture,
      });
    }
    updateUser(payload);
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
          maxSize={5000000}
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
                  onFetchRelationCompany(watch('company_id') as number);
                  removeAllCompanies(userCompanies?.map((itm) => itm.id));
                  onSubmit(watch());
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

      <Grid item xs={12} md={12}>
        <Typography variant="h4" color="primary" mb={2}>
          Internal Company
        </Typography>
        {type === 'client' ? (
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
              {companyRelations?.map((item, index) => (
                <Box display="flex" alignItems="center" gap={1} key={index}>
                  <Checkbox
                    value={item?.id}
                    id={`item-${item?.id}`}
                    onChange={(e) => {
                      if (!e.target.checked) {
                        onClickRemove(
                          userCompanies?.find((itm) => item.id === itm.company_id)?.id as number
                        );
                      } else {
                        onAddCompany(item?.id);
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
        ) : (
          <Box display="flex" flexDirection="column" gap={2}>
            {userCompanies?.map((item, index) => (
              <>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  spacing={3}
                  alignItems="center"
                >
                  <Box width="100%">
                    <FormControl fullWidth>
                      <InputLabel id="type">Internal Company</InputLabel>
                      <Select
                        label="Internal Company"
                        value={item?.company?.id}
                        onChange={(e: SelectChangeEvent<number>) =>
                          onChangeUserCompany(e, item?.id)
                        }
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
                    {type === 'internal' && (
                      <MenuItem onClick={() => onClickEdit(item?.company_id)}>
                        <Iconify icon="solar:pen-bold" />
                        Edit
                      </MenuItem>
                    )}
                    <MenuItem onClick={() => onClickRemove(item?.id)} sx={{ color: 'error.main' }}>
                      <Iconify icon="solar:trash-bin-trash-bold" />
                      Delete
                    </MenuItem>
                  </MenuList>
                </Stack>

                {item?.company_id === selectedCompanyId && (
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
                      {existingCompanyProducts &&
                        existingCompanyProducts?.map((existingItem, existingIndex) => (
                          <Box gridColumn={`${existingIndex % 2 === 0 ? '1 / 2' : '2 / 4'}`}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Checkbox
                                id={`item-${existingItem?.id}`}
                                onChange={() =>
                                  onChangeProductFilterEdit(
                                    existingItem?.id,
                                    user?.products_handled?.find(
                                      (userProduct) => userProduct?.product_id === existingItem?.id
                                    )?.id ?? 0
                                  )
                                }
                                checked={selectedProducts?.includes(existingItem?.id)}
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
                    {/* <Box display="flex" justifyContent="end" width="100%" sx={{ mt: 4 }}>
                    <Button
                      size="small"
                      onClick={onSaveUserCompany}
                      variant="contained"
                      color="primary"
                      sx={{ width: 120 }}
                    >
                      Save
                    </Button>
                  </Box> */}
                  </Card>
                )}
              </>
            ))}
            <Stack direction="row" justifyContent="space-between" spacing={3} alignItems="center">
              <Box width="100%">
                <FormControl fullWidth>
                  <InputLabel id="userCompany">Internal Company</InputLabel>
                  <Select
                    label="Internal Company"
                    value={userCompany}
                    onChange={(e: SelectChangeEvent<number>) => onChangeUserCompanyNew(e)}
                  >
                    {internalCompanies?.map((company) => (
                      <MenuItem value={company?.id}>{company?.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box
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
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onAddUserCompany}
                  sx={{ marginY: 2 }}
                >
                  Save
                </Button>
              </Box>
            </Stack>
          </Box>
        )}
      </Grid>

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
  const [openRemoveModal, setOpenRemoveModal] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<number | undefined>();
  const [isOpenCompanySelection, setIsOpenCompanySelection] = React.useState(false);
  const [userCompany, setUserCompany] = React.useState<number | null>(null);
  const [userProduct, setUserProduct] = React.useState<number | null>(null);
  const [userCompanies, setUserCompanies] = React.useState<InternalCompany[]>([]);
  const { data: companyProducts } = useProductByCompanyId(Number(userCompany), false, () =>
    setIsOpenCompanySelection(false)
  );
  const [existingUserCompany, setExistingUserCompany] = React.useState<number | null>(null);
  const [selectedProducts, setSelectedProducts] = React.useState<number[]>([]);
  const [selectedProductsTemp, setSelectedProductsTemp] = React.useState<number[]>([]);
  const { data: user } = useUserById(Number(id));
  const { data: roles } = useRole();
  const { mutate: updateUser } = useUpdateUser({ isRbac: false });
  const { data: clientCompanies } = useClientCompanies(true);
  const { data: internalCompanies } = useInternalCompanies();
  const [selectedCompanyId, setSelectedCompanyId] = React.useState<number | null>(null);
  // const { data: userCompaniesData } = useUserCompanyById(Number(id));
  const { mutate: addUserCompany } = useAddUserCompany();
  const { mutate: deleteUserCompany } = useDeleteUserCompanyById(Number(id));
  const [companyRelations, setCompanyRelations] = React.useState<InternalCompany[]>([]);
  const { mutate: addUserProduct } = useAddUserProduct();
  const { mutate: deleteUserProduct } = useDeleteUserProductById(Number(id));
  const { data: existingCompanyProducts } = useProductByCompanyId(Number(existingUserCompany));

  console.log(userCompanies, 'userCompanies');

  const defaultValues = {
    name: user?.user_info?.name,
    email: user?.email,
    phone: user?.phone,
    role_id: user?.user_info?.role_id,
    profile_picture: user?.user_info?.profile_picture ?? '',
    company_id: user?.user_info?.company_id,
    department_id: user?.user_info?.department_id,
    internal_id: user?.internal_companies?.map((item) => item?.company_id) ?? [],
  };

  useEffect(() => {
    if (defaultValues?.company_id) {
      fetchDivision(defaultValues?.company_id);
      fetchRelationCompany(defaultValues?.company_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues?.company_id]);

  const fetchRelationCompany = async (companyId: number) => {
    const data = await fetch(
      `${API_URL}/company-relation?client_company_id=${companyId}&page_size=999`,
      {
        headers: { Authorization: `Bearer ${getSession()}` },
      }
    ).then((res) =>
      res.json().then((value) => {
        if (value?.data?.length > 0) {
          setCompanyRelations(value?.data?.map((item: any) => item?.internal_company));
        }
      })
    );
    return data;
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

  const onClickEdit = (selectedItemId: number) => {
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

  const onClickRemove = (itemId?: number) => {
    if (itemId) setSelectedId(itemId);
    setOpenRemoveModal(true);
  };

  const onRemove = () => {
    deleteUserCompany(selectedId ?? 0);
    setOpenRemoveModal(false);
  };

  const handleSubmit = (formData: UserClientUpdateDTO) => {
    const payload = {
      ...formData,
      id: Number(id),
      user_type: type,
      product_id: selectedProducts,
    };
    if (defaultValues?.profile_picture) {
      Object.assign(payload, {
        profile_picture: defaultValues?.profile_picture,
      });
    }
    updateUser(payload);
  };

  // User Company
  const onAddUserCompany = () => {
    const hasUserCompanies = userCompanies?.some((item) => item.company_id === userCompany);

    if (!hasUserCompanies) {
      addUserCompany({
        user_id: Number(id),
        company_id: userCompany,
      });
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

  const onChangeUserCompany = (e: SelectChangeEvent<number>, itemId: number) => {
    setUserCompanies((prevUserCompanies) => {
      const updatedUserCompanies = [...prevUserCompanies];
      // Update the string at the specified index
      const index = updatedUserCompanies?.findIndex((item) => item?.id === itemId);
      updatedUserCompanies[index].id = Number(e.target.value);
      return updatedUserCompanies;
    });
  };

  const onAddCompany = (company_id: number | null) => {
    addUserCompany({
      user_id: Number(id),
      company_id,
    });
  };

  const onChangeUserCompanyNew = (e: SelectChangeEvent<number>) => {
    setUserCompany(Number(e.target.value));
  };

  const onClickDeleteUserCompany = async (userCompanyId: number) => {
    deleteUserCompany(userCompanyId);
  };

  React.useEffect(() => {
    setUserCompanies(user?.internal_companies ?? []);
    console.log('hitt');
    setSelectedProducts(user?.products_handled?.map((item) => item?.product_id) ?? []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  console.log(selectedProducts, 'selectedProducts');

  const onChangeProductFilterEdit = (productFilterId: number, productId?: number) => {
    const hasProduct = selectedProducts?.includes(productFilterId);
    if (hasProduct) {
      if (productId) {
        deleteUserProduct(productId);
      }
    } else {
      addUserProduct({
        user_id: Number(id),
        product_id: productFilterId,
      });
    }
    setUserProduct(null);
  };

  const onChangeProductFilter = (productFilterId: number) => {
    const hasProduct = selectedProducts?.includes(productFilterId);
    if (!hasProduct) {
      setSelectedProductsTemp([...selectedProductsTemp, productFilterId]);
    } else {
      const newArr = selectedProductsTemp?.filter((item) => item !== productFilterId);
      setSelectedProductsTemp(newArr);
    }
  };

  const onSaveUserCompany = () => {
    setSelectedProducts(selectedProductsTemp);
    setSelectedCompanyId(null);
    setExistingUserCompany(null);
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
              divisions={divisions}
              roles={roles}
              isLoading={isLoading}
              user={user}
              type={type}
              userCompany={userCompany}
              userCompanies={userCompanies}
              onChangeUserCompanyNew={onChangeUserCompanyNew}
              onAddUserCompany={onAddUserCompany}
              onChangeUserCompany={onChangeUserCompany}
              internalCompanies={internalCompanies}
              onClickDeleteUserCompany={onClickDeleteUserCompany}
              onClickRemove={onClickRemove}
              onAddCompany={onAddCompany}
              companyRelations={companyRelations}
              onFetchRelationCompany={fetchRelationCompany}
              companyProducts={companyProducts}
              onChangeProductFilter={onChangeProductFilter}
              selectedProducts={selectedProducts}
              onClickEdit={onClickEdit}
              onSaveUserCompany={onSaveUserCompany}
              selectedCompanyId={selectedCompanyId}
              existingCompanyProducts={existingCompanyProducts}
              onChangeProductFilterEdit={onChangeProductFilterEdit}
            />
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
