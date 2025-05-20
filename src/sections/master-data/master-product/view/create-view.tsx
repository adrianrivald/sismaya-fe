import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Form } from 'src/components/form/form';
import { DashboardContent } from 'src/layouts/dashboard';
import { useAuth } from 'src/sections/auth/providers/auth';
import { useInternalCompanies, useUpdateProduct } from 'src/services/master-data/company';
import type {
  ProductDTO,
  ProductSuperDTO,
} from 'src/services/master-data/company/product/schema/product-schema';
import {
  productSchema,
  productSuperAdminSchema,
} from 'src/services/master-data/company/product/schema/product-schema';
import { useAddProduct } from 'src/services/master-data/company/product/use-product-create';
import { useProductDetail } from 'src/services/master-data/company/product/use-product-detail';

export function CreateProductView() {
  const { mutate: addProduct } = useAddProduct();
  const { mutate: updateProduct } = useUpdateProduct();
  const navigate = useNavigate();
  const { vendor, id } = useParams();
  const { user } = useAuth();
  const { data: internalCompanies } = useInternalCompanies();
  const isSuperAdmin = user?.user_info?.role_id === 1;
  const idCurrentCompany =
    user?.internal_companies?.find((item) => item?.company?.name?.toLowerCase() === vendor)?.company
      ?.id ?? 0;

  const { data } = useProductDetail(Number(id) || 0);

  const handleSubmit = (formData: ProductDTO | ProductSuperDTO) => {
    const superAdminData = formData as ProductSuperDTO;
    if (id) {
      updateProduct(
        {
          id: Number(id),
          name: formData.name,
          company_id: !isSuperAdmin ? idCurrentCompany : data?.company?.id,
          is_active: formData.is_active,
        },
        {
          onSuccess: () => {
            navigate(`/${vendor ?? 'internal-company'}/product`);
          },
          onError: () => {},
        }
      );
    } else {
      addProduct(
        {
          name: superAdminData.name,
          company_id: isSuperAdmin ? superAdminData?.company_id : idCurrentCompany,
          is_active: superAdminData.is_active,
        },
        {
          onSuccess: () => {
            navigate(`/${vendor ?? 'internal-company'}/product`);
          },
          onError: () => {},
        }
      );
    }
  };
  const defaultValues: ProductDTO | ProductSuperDTO = {
    name: data?.name || '',
    is_active: data?.is_active || false,
    company_id: data?.company?.id,
  };

  return (
    <DashboardContent maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
            Master Products
          </Typography>
          <Box display="flex" gap={2} sx={{ mb: { xs: 3, md: 5 } }}>
            <Typography>Master Data</Typography>
            <Typography color="grey.500">•</Typography>
            <Typography color="grey.500">Products</Typography>
          </Box>
        </Box>
      </Box>

      <Grid container sx={{ my: 2 }}>
        <Form
          width="100%"
          onSubmit={handleSubmit}
          schema={isSuperAdmin ? productSuperAdminSchema : productSchema}
          options={{
            defaultValues: {
              ...defaultValues,
            },
          }}
        >
          {({ register, setValue, control, formState }) => (
            <Box>
              <Card>
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography fontSize={14} fontWeight="bold" sx={{ mb: 1 }}>
                        Product Name
                      </Typography>
                      <FormControl fullWidth>
                        <TextField fullWidth label="Product Name" {...register('name')} />
                      </FormControl>
                    </Grid>
                    {isSuperAdmin && (
                      <Grid item xs={12} md={12}>
                        <Typography fontSize={14} fontWeight="bold" sx={{ mb: 1 }}>
                          Company Name
                        </Typography>
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
                                options={internalCompanies || []}
                                getOptionLabel={(option) => option?.name || ''}
                                isOptionEqualToValue={(option, val) => option?.id === val?.id}
                                value={
                                  internalCompanies?.find((company) => company.id === value) || null
                                }
                                disabled={id !== undefined}
                                onChange={async (_, selectedCompany) => {
                                  const selectedIdCompany = selectedCompany?.id || null;
                                  onChange(selectedIdCompany);
                                }}
                                renderInput={(params) => (
                                  <TextField {...params} label="Company" error={!!error} />
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
                    )}
                    <Grid item xs={12} md={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            onChange={(_, checked) => {
                              setValue('is_active', checked);
                            }}
                            defaultChecked={defaultValues?.is_active}
                          />
                        }
                        label="Set status as Active"
                      />
                      <Typography fontSize={14} mt={1} color="#637381">
                        When a product status is <span className="font-bold">not</span> set to
                        Active, no new requests can be assigned to it. However, its existing history
                        will remain accessible.
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              <Box
                display="flex"
                justifyContent="end"
                width="100%"
                sx={{
                  mt: 3,
                }}
              >
                <LoadingButton
                  size="medium"
                  loading={false}
                  loadingIndicator="Submitting..."
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  {data !== undefined ? 'Save Product' : 'Create New Product'}
                </LoadingButton>
              </Box>
            </Box>
          )}
        </Form>
      </Grid>
    </DashboardContent>
  );
}
