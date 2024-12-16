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
import React from 'react';
import { API_URL } from 'src/constants';
import { FieldDropzone } from 'src/components/form';
import { Bounce, toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useAddCategory,
  useAddProduct,
  useCompanyById,
  useDeleteCategoryItem,
  useDeleteProductItem,
  useUpdateCategory,
  useUpdateCompany,
  useUpdateProduct,
} from 'src/services/master-data/company';
import { Iconify } from 'src/components/iconify';
import { companySchema } from 'src/services/master-data/company/schemas/company-schema';

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

  const [selectedStatuses, setSelectedStatuses] = React.useState([
    {
      status: null,
      type: null,
    },
  ]);

  const defaultValues = {
    name: data?.name,
    abbreviation: data?.abbreviation,
    status: data?.progress_statuses ?? [],
    category: data?.categories ?? [],
    product: data?.products ?? [],
  };

  const onAddStatus = () => {
    setSelectedStatuses([
      ...selectedStatuses,
      [
        {
          status: null,
          type: null,
        },
      ],
    ] as any);
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
    await deleteCategory(categoryId);
  };

  const onClickEditCategory = async (value: string, categoryId: number) => {
    await updateCategory({
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
    await deleteProduct(productId);
  };

  const onClickEditProduct = async (value: string, productId: number) => {
    await updateProduct({
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

  const handleChangeStatus = (e: SelectChangeEvent<string>, index: number) => {
    const value = e?.target?.value;
    console.log(value, 'status');
  };
  const handleChangeType = (e: SelectChangeEvent<string>, index: number) => {
    const value = e?.target?.value;
  };

  const handleSubmit = (formData: any) => {
    toast.success('Data added successfully', {
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
    navigate('/internal-company');
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
                />
              </Grid>

              <Grid item xs={12} md={12}>
                <Box display="flex" flexDirection="column" gap={2}>
                  {selectedStatuses?.map((item, index) => (
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
                          {...register('status')}
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
                            {...register('type')}
                            label="Type"
                            onChange={(e: SelectChangeEvent<string>) => handleChangeType(e, index)}
                          >
                            <MenuItem value="todo">Todo</MenuItem>
                            <MenuItem value="inprogress">In Progress</MenuItem>
                            <MenuItem value="done">Done</MenuItem>
                          </Select>
                        </FormControl>
                        {formState?.errors?.type && (
                          <FormHelperText sx={{ color: 'error.main' }}>
                            {String(formState?.errors?.type?.message)}
                          </FormHelperText>
                        )}
                      </Box>
                    </Stack>
                  ))}
                </Box>
                <Button onClick={onAddStatus} sx={{ marginY: 2 }}>
                  Add More
                </Button>
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
                          width: 140,
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
                          width: 140,
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
