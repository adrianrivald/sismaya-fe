import Typography from '@mui/material/Typography';
import {
  Box,
  Button,
  Chip,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  useTheme,
  Theme,
  MenuList,
  menuItemClasses,
} from '@mui/material';

import { _tasks, _posts, _timeline, _users, _projects } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { Form } from 'src/components/form/form';
import React, { useEffect } from 'react';
import { API_URL } from 'src/constants';
import { FieldDropzone } from 'src/components/form';
import { Bounce, toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useAddCategory,
  useAddProduct,
  useAddStatus,
  useCompanyById,
  useDeleteCategoryItem,
  useDeleteProductItem,
  useDeleteStatusItem,
  useUpdateCategory,
  useUpdateCompany,
  useUpdateProduct,
  useUpdateStatus,
} from 'src/services/master-data/company';
import { Iconify } from 'src/components/iconify';
import { CompanyDTO, companySchema } from 'src/services/master-data/company/schemas/company-schema';
import { Status } from 'src/services/master-data/company/types';

export function EditInternalCompanyView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data } = useCompanyById(Number(id));
  const { mutate: updateCompany } = useUpdateCompany();

  // Category CRUD
  const { mutate: deleteCategory } = useDeleteCategoryItem(Number(id));
  const { mutate: addCategory } = useAddCategory();
  const { mutate: updateCategory } = useUpdateCategory();
  const [categories, setCategories] = React.useState(data?.categories ?? []);
  const [category, setCategory] = React.useState('');

  // Product CRUD
  const { mutate: deleteProduct } = useDeleteProductItem(Number(id));
  const { mutate: addProduct } = useAddProduct();
  const { mutate: updateProduct } = useUpdateProduct();
  const [products, setProducts] = React.useState(data?.products ?? []);
  const [product, setProduct] = React.useState('');

  // Status CRUD
  const { mutate: deleteStatus } = useDeleteStatusItem(Number(id));
  const { mutate: addStatus } = useAddStatus();
  const { mutate: updateStatus } = useUpdateStatus();
  const [statuses, setStatuses] = React.useState(data?.progress_statuses ?? []);
  const [status, setStatus] = React.useState<Partial<Status>>({
    name: '',
    step: '',
  });

  const defaultValues = {
    name: data?.name,
    abbreviation: data?.abbreviation,
    status: data?.progress_statuses ?? [],
    category: data?.categories ?? [],
    product: data?.products ?? [],
    image: data?.image,
  };
  // Status
  const onAddStatus = () => {
    console.log(status, 'status sekarang');
    addStatus({
      name: status?.name,
      company_id: data?.id,
      step: status?.step,
      sort: statuses.length + 1,
    });
    setStatus({
      name: '',
      step: '',
    });
  };

  useEffect(() => {
    console.log(status, 'status now');
  }, [status]);

  const onChangeStatus = (e: SelectChangeEvent<string>, itemId: number, type: string) => {
    if (type === 'status') {
      setStatuses((prevStatuses) => {
        const updatedStatuses = [...prevStatuses];
        // Update the string at the specified index
        const index = updatedStatuses?.findIndex((item) => item?.id === itemId);
        updatedStatuses[index].name = e.target.value;
        return updatedStatuses;
      });
    } else {
      setStatuses((prevStatuses) => {
        const updatedStatuses = [...prevStatuses];
        // Update the string at the specified index
        const index = updatedStatuses?.findIndex((item) => item?.id === itemId);
        updatedStatuses[index].step = e.target.value;
        return updatedStatuses;
      });
    }
  };

  const onChangeStatusNew = (e: SelectChangeEvent<string>, type: string) => {
    if (type === 'status') {
      setStatus({
        ...status,
        name: e.target.value,
      });
    } else {
      setStatus({
        ...status,
        step: e.target.value,
      });
    }
  };

  const onClickDeleteStatus = async (statusId: number) => {
    deleteStatus(statusId);
  };

  const onClickEditStatus = async (value: string, step: string, statusId: number) => {
    updateStatus({
      name: value,
      id: statusId,
      company_id: Number(id),
      step,
      sort: statuses.length + 1,
    });
  };

  // Category
  const onAddCategory = () => {
    addCategory({
      name: category,
      company_id: data?.id,
    });
    setCategory('');
  };

  const onChangeCategory = (e: React.ChangeEvent<HTMLInputElement>, itemId: number) => {
    setCategories((prevCategories) => {
      const updatedCategories = [...prevCategories];
      // Update the string at the specified index
      const index = updatedCategories?.findIndex((item) => item?.id === itemId);
      updatedCategories[index].name = e.target.value;
      return updatedCategories;
    });
  };

  const onChangeCategoryNew = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(e.target.value);
  };

  const onClickDeleteCategory = async (categoryId: number) => {
    deleteCategory(categoryId);
  };

  const onClickEditCategory = async (value: string, categoryId: number) => {
    updateCategory({
      name: value,
      id: categoryId,
      company_id: Number(id),
    });
  };

  // Product
  const onAddProduct = () => {
    addProduct({
      name: product,
      company_id: data?.id,
    });
    setProduct('');
  };

  const onChangeProduct = (e: React.ChangeEvent<HTMLInputElement>, itemId: number) => {
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      // Update the string at the specified index
      const index = updatedProducts?.findIndex((item) => item?.id === itemId);
      updatedProducts[index].name = e.target.value;
      return updatedProducts;
    });
  };

  const onChangeProductNew = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value, 'value product');
    setProduct(e.target.value);
  };

  const onClickDeleteProduct = async (productId: number) => {
    deleteProduct(productId);
  };

  const onClickEditProduct = async (value: string, productId: number) => {
    updateProduct({
      name: value,
      id: productId,
      company_id: Number(id),
    });
  };

  React.useEffect(() => {
    setProducts(data?.products ?? []);
  }, [data]);

  React.useEffect(() => {
    setCategories(data?.categories ?? []);
  }, [data]);

  React.useEffect(() => {
    setStatuses(data?.progress_statuses ?? []);
  }, [data]);

  const handleSubmit = (formData: CompanyDTO) => {
    const payload = {
      ...formData,
      id: Number(id),
      type: 'vendor',
    };
    if (defaultValues?.image) {
      Object.assign(payload, {
        image: defaultValues?.image,
      });
    }
    updateCompany(payload);
  };
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
        Internal Company
      </Typography>
      <Box display="flex" gap={2} sx={{ mb: { xs: 3, md: 5 } }}>
        <Typography>Master Data</Typography>
        <Typography color="grey.500">•</Typography>
        <Typography color="grey.500">Internal Company</Typography>
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
          schema={companySchema}
        >
          {({ register, control, watch, formState }) => (
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
                />
                {formState?.errors?.name && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {String(formState?.errors?.name?.message)}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  error={Boolean(formState?.errors?.abbreviation)}
                  multiline
                  sx={{
                    width: '100%',
                  }}
                  label="Description"
                  rows={4}
                  {...register('abbreviation', {
                    required: 'Description must be filled out',
                  })}
                />
                {formState?.errors?.abbreviation && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {String(formState?.errors?.abbreviation?.message)}
                  </FormHelperText>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <FieldDropzone
                  label="Upload Picture"
                  helperText="Picture maximum 5mb size"
                  controller={{
                    name: 'cover',
                    control,
                  }}
                  defaultImage={defaultValues?.image}
                />
              </Grid>

              <Grid item xs={12} md={12}>
                <Typography variant="h4" color="primary" mb={4}>
                  Progress Status
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  {data?.progress_statuses?.map((item, index) => (
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      spacing={3}
                      alignItems="center"
                    >
                      <Box width="50%">
                        <TextField
                          error={Boolean(formState?.errors?.status)}
                          sx={{
                            width: '100%',
                          }}
                          label="Status"
                          value={item?.name}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            onChangeStatus(e, item?.id, 'status')
                          }
                        />

                        {formState?.errors?.status && (
                          <FormHelperText sx={{ color: 'error.main' }}>
                            {String(formState?.errors?.status?.message)}
                          </FormHelperText>
                        )}
                      </Box>

                      <Box width="50%">
                        <FormControl fullWidth>
                          <InputLabel id="type">Type</InputLabel>
                          <Select
                            error={Boolean(formState?.errors?.type)}
                            label="Type"
                            value={item?.step}
                            onChange={(e: SelectChangeEvent<string>) =>
                              onChangeStatus(e, item?.id, 'step')
                            }
                          >
                            <MenuItem value="to_do">Todo</MenuItem>
                            <MenuItem value="in_progress">In Progress</MenuItem>
                            <MenuItem value="done">Done</MenuItem>
                          </Select>
                        </FormControl>
                        {formState?.errors?.type && (
                          <FormHelperText sx={{ color: 'error.main' }}>
                            {String(formState?.errors?.type?.message)}
                          </FormHelperText>
                        )}
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
                        <MenuItem
                          onClick={() =>
                            onClickEditStatus(statuses[index].name, statuses[index].step, item?.id)
                          }
                        >
                          <Iconify icon="solar:pen-bold" />
                          Edit
                        </MenuItem>
                        <MenuItem
                          onClick={() => onClickDeleteStatus(item?.id)}
                          sx={{ color: 'error.main' }}
                        >
                          <Iconify icon="solar:trash-bin-trash-bold" />
                          Delete
                        </MenuItem>
                      </MenuList>
                    </Stack>
                  ))}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={3}
                    alignItems="center"
                  >
                    <Box width="50%">
                      <TextField
                        error={Boolean(formState?.errors?.status)}
                        sx={{
                          width: '100%',
                        }}
                        label="Status"
                        value={status?.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          onChangeStatusNew(e, 'status')
                        }
                      />

                      {formState?.errors?.status && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {String(formState?.errors?.status?.message)}
                        </FormHelperText>
                      )}
                    </Box>

                    <Box width="50%">
                      <FormControl fullWidth>
                        <InputLabel id="type">Type</InputLabel>
                        <Select
                          error={Boolean(formState?.errors?.type)}
                          label="Type"
                          value={status?.step}
                          onChange={(e: SelectChangeEvent<string>) => onChangeStatusNew(e, 'step')}
                          defaultValue=""
                        >
                          <MenuItem value="to_do">Todo</MenuItem>
                          <MenuItem value="in_progress">In Progress</MenuItem>
                          <MenuItem value="done">Done</MenuItem>
                        </Select>
                      </FormControl>
                      {formState?.errors?.type && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {String(formState?.errors?.type?.message)}
                        </FormHelperText>
                      )}
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
                      <Button onClick={onAddStatus} sx={{ marginY: 2 }}>
                        Add More
                      </Button>
                    </Box>
                  </Stack>
                </Box>
              </Grid>

              <Grid item xs={12} md={12}>
                <Typography variant="h4" color="primary" mb={4}>
                  Category
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  {data?.categories?.map((item, index) => (
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      spacing={3}
                      alignItems="center"
                    >
                      <TextField
                        error={Boolean(formState?.errors?.category)}
                        sx={{
                          width: '100%',
                        }}
                        label="Category"
                        value={item.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          onChangeCategory(e, item?.id)
                        }
                        // InputProps={{
                        //   readOnly: true,
                        // }}
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
                        <MenuItem
                          onClick={() => onClickEditCategory(categories[index].name, item?.id)}
                        >
                          <Iconify icon="solar:pen-bold" />
                          Edit
                        </MenuItem>
                        <MenuItem
                          onClick={() => onClickDeleteCategory(item?.id)}
                          sx={{ color: 'error.main' }}
                        >
                          <Iconify icon="solar:trash-bin-trash-bold" />
                          Delete
                        </MenuItem>
                      </MenuList>
                      {formState?.errors?.category && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {String(formState?.errors?.category?.message)}
                        </FormHelperText>
                      )}
                    </Stack>
                  ))}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={3}
                    alignItems="center"
                  >
                    <TextField
                      error={Boolean(formState?.errors?.category)}
                      sx={{
                        width: '100%',
                      }}
                      label="Category"
                      value={category}
                      onChange={onChangeCategoryNew}
                    />
                    {formState?.errors?.category && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {String(formState?.errors?.category?.message)}
                      </FormHelperText>
                    )}
                  </Stack>
                </Box>
                <Button onClick={onAddCategory} sx={{ marginY: 2 }}>
                  Add More
                </Button>
              </Grid>

              <Grid item xs={12} md={12}>
                <Typography variant="h4" color="primary" mb={4}>
                  Product
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  {data?.products?.map((item, index) => (
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      spacing={3}
                      alignItems="center"
                    >
                      <TextField
                        error={Boolean(formState?.errors?.product)}
                        sx={{
                          width: '100%',
                        }}
                        label="Product"
                        value={item.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          onChangeProduct(e, item?.id)
                        }
                        // InputProps={{
                        //   readOnly: true,
                        // }}
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
                        <MenuItem
                          onClick={() => onClickEditProduct(products[index].name, item?.id)}
                        >
                          <Iconify icon="solar:pen-bold" />
                          Edit
                        </MenuItem>
                        <MenuItem
                          onClick={() => onClickDeleteProduct(item?.id)}
                          sx={{ color: 'error.main' }}
                        >
                          <Iconify icon="solar:trash-bin-trash-bold" />
                          Delete
                        </MenuItem>
                      </MenuList>
                      {formState?.errors?.product && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {String(formState?.errors?.product?.message)}
                        </FormHelperText>
                      )}
                    </Stack>
                  ))}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={3}
                    alignItems="center"
                  >
                    <TextField
                      error={Boolean(formState?.errors?.product)}
                      sx={{
                        width: '100%',
                      }}
                      label="Product"
                      value={product}
                      onChange={onChangeProductNew}
                    />
                    {formState?.errors?.product && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {String(formState?.errors?.product?.message)}
                      </FormHelperText>
                    )}
                  </Stack>
                </Box>
                <Button onClick={onAddProduct} sx={{ marginY: 2 }}>
                  Add More
                </Button>
              </Grid>

              <Box
                display="flex"
                justifyContent="end"
                width="100%"
                sx={{
                  mt: 8,
                }}
              >
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </Box>
            </Grid>
          )}
        </Form>
      </Grid>
    </DashboardContent>
  );
}
