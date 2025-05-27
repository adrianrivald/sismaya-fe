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
import { Categories, Company, Products, Status } from 'src/services/master-data/company/types';
import { Control, FormState, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { RemoveAction } from './remove-action';

interface InternalCompanyValues {
  name: string | undefined;
  abbreviation: string | undefined;
  status: Status[];
  category: Categories[];
  product: Products[];
  image: string | undefined;
}
interface EditFormProps {
  formState: FormState<CompanyDTO>;
  register: UseFormRegister<CompanyDTO>;
  control: Control<CompanyDTO>;
  setValue: UseFormSetValue<CompanyDTO>;
  defaultValues: InternalCompanyValues;
  data: Company | undefined;
  onChangeStatus: (e: SelectChangeEvent<string>, itemId: number, type: string) => void;
  onClickEditStatus: (value: string, step: string, statusId: number) => void;
  statuses: Status[];
  onClickDeleteStatus: (statusId: number) => void;
  status: Partial<Status>;
  onChangeStatusNew: (e: SelectChangeEvent<string>, type: string) => void;
  onAddStatus: () => void;
  onChangeCategory: (e: React.ChangeEvent<HTMLInputElement>, itemId: number) => void;
  onClickEditCategory: (value: string, categoryId: number) => void;
  categories: Categories[];
  onClickDeleteCategory: (categoryId: number) => void;
  category: string;
  onChangeCategoryNew: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddCategory: () => void;
  onClickEditProduct: (value: string, productId: number) => void;
  onChangeProduct: (e: React.ChangeEvent<HTMLInputElement>, itemId: number) => void;
  products: Products[];
  onClickDeleteProduct: (productId: number) => void;
  product: string;
  onChangeProductNew: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddProduct: () => void;
  onClickRemove: (mode: string, id: number) => void;
}

function EditForm({
  formState,
  register,
  control,
  setValue,
  defaultValues,
  data,
  onChangeStatus,
  onClickEditStatus,
  statuses,
  status,
  onChangeStatusNew,
  onAddStatus,
  onChangeCategory,
  onClickEditCategory,
  categories,
  category,
  onChangeCategoryNew,
  onAddCategory,
  onClickEditProduct,
  onChangeProduct,
  products,
  product,
  onChangeProductNew,
  onAddProduct,
  onClickRemove,
}: EditFormProps) {
  useEffect(() => {
    setValue('name', defaultValues?.name);
    setValue('abbreviation', defaultValues?.abbreviation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  return (
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
          maxSize={5000000}
        />
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
  );
}

export function EditInternalCompanyView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data } = useCompanyById(Number(id));
  const { mutate: updateCompany } = useUpdateCompany();
  const [openRemoveModal, setOpenRemoveModal] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<number | undefined>();
  const [selectedMode, setSelectedMode] = React.useState<string | undefined>();

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

  const onClickDeleteCategory = async () => {
    if (selectedId) deleteCategory(selectedId);
    setOpenRemoveModal(false);
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

  const onClickRemove = (mode: string, itemId?: number) => {
    if (itemId) setSelectedId(itemId);
    setOpenRemoveModal(true);
    setSelectedMode(mode);
  };

  const onRemove = () => {
    if (selectedMode === 'category') {
      deleteCategory(selectedId ?? 0);
    }
    if (selectedMode === 'product') {
      deleteProduct(selectedId ?? 0);
    }
    if (selectedMode === 'status') {
      deleteStatus(selectedId ?? 0);
    }
    setOpenRemoveModal(false);
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
      type: 'internal',
      cito_quota: data?.cito_quota,
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
          {({ register, control, watch, formState, setValue }) => (
            <EditForm
              formState={formState}
              register={register}
              control={control}
              setValue={setValue}
              defaultValues={defaultValues}
              data={data}
              onChangeStatus={onChangeStatus}
              onClickEditStatus={onClickEditStatus}
              statuses={statuses}
              onClickDeleteStatus={onClickDeleteStatus}
              status={status}
              onChangeStatusNew={onChangeStatusNew}
              onAddStatus={onAddStatus}
              onChangeCategory={onChangeCategory}
              onClickEditCategory={onClickEditCategory}
              categories={categories}
              onClickDeleteCategory={onClickDeleteCategory}
              category={category}
              onChangeCategoryNew={onChangeCategoryNew}
              onAddCategory={onAddCategory}
              onClickEditProduct={onClickEditProduct}
              onChangeProduct={onChangeProduct}
              products={products}
              onClickDeleteProduct={onClickDeleteProduct}
              product={product}
              onChangeProductNew={onChangeProductNew}
              onAddProduct={onAddProduct}
              onClickRemove={onClickRemove}
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
