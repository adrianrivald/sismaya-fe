import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { Form } from 'src/components/form/form';
import { DashboardContent } from 'src/layouts/dashboard';
import { useAuth } from 'src/sections/auth/providers/auth';
import { useUpdateProduct } from 'src/services/master-data/company';
import {
  ProductDTO,
  productSchema,
} from 'src/services/master-data/company/product/schema/product-schema';
import { useAddProduct } from 'src/services/master-data/company/product/use-product-create';
import { useProductDetail } from 'src/services/master-data/company/product/use-product-detail';

export function CreateProductView() {
  const { mutate: addProduct } = useAddProduct();
  const { mutate: updateProduct } = useUpdateProduct();
  const navigate = useNavigate();
  const { vendor, id } = useParams();
  const { user } = useAuth();
  const idCurrentCompany =
    user?.internal_companies?.find((item) => item?.company?.name?.toLowerCase() === vendor)?.company
      ?.id ?? 0;

  const { data } = useProductDetail(Number(id) || 0);

  const handleSubmit = (formData: ProductDTO) => {
    if (id) {
      updateProduct(
        {
          id: Number(id),
          name: formData.name,
          company_id: idCurrentCompany,
          is_active: formData.is_active,
        },
        {
          onSuccess: () => {
            navigate(`/${vendor}/product`);
          },
          onError: () => {},
        }
      );
    } else {
      addProduct(
        {
          name: formData.name,
          company_id: idCurrentCompany,
          is_active: formData.is_active,
        },
        {
          onSuccess: () => {
            navigate(`/${vendor}/product`);
          },
          onError: () => {},
        }
      );
    }
  };
  const defaultValues: ProductDTO = {
    name: data?.name || '',
    is_active: false,
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
          schema={productSchema}
          options={{
            defaultValues: {
              ...defaultValues,
            },
          }}
        >
          {({ register, setValue }) => (
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
                    <Grid item xs={12} md={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            onChange={(_, checked) => {
                              setValue('is_active', checked);
                            }}
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
                  Create New Product
                </LoadingButton>
              </Box>
            </Box>
          )}
        </Form>
      </Grid>
    </DashboardContent>
  );
}
