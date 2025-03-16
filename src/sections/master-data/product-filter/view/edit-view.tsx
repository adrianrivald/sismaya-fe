import Typography from '@mui/material/Typography';
import { Box, Grid, Card, Checkbox } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { Form } from 'src/components/form/form';
import React, { useState } from 'react';
import { roleSchema, type RoleDTO } from 'src/services/master-data/role/schemas/role-schema';
import { useParams } from 'react-router-dom';
import {
  useAddProductFilter,
  useDeleteProductFilterById,
  useProductFilter,
} from 'src/services/master-data/product-filter';
import { useProductByCompanyId } from 'src/services/master-data/company/product/use-product-list';

export function EditProductFilterView() {
  const { id, vendorId } = useParams();
  const { data: products } = useProductByCompanyId(Number(vendorId));
  const { data: productFilter } = useProductFilter({
    company_id: id,
    internal_company_id: vendorId,
  });
  const { mutate: addProductFilter } = useAddProductFilter();
  const { mutate: deleteProductFilter } = useDeleteProductFilterById();
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedProductFilter, setSelectedProductFilter] = useState<string[]>(
    productFilter?.map((item: any) => item?.product?.id.toString())
  );
  const onChangeProductFilter = (productFilterId?: string) => {
    if (productFilterId) {
      if (!selectedProductFilter?.includes(productFilterId)) {
        setSelectedProductFilter((prev) => [...prev, productFilterId]);
        addProductFilter({
          product_id: Number(productFilterId),
          company_id: Number(id),
        });
      } else {
        const newArr = selectedProductFilter?.filter((item) => item !== productFilterId);
        setSelectedProductFilter(newArr);
        const productUseId = productFilter?.find(
          (item: any) => item?.product?.id === Number(productFilterId)
        ).id;
        deleteProductFilter(Number(productUseId));
      }
    }
  };

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
        Product Filter
      </Typography>
      <Box display="flex" gap={2} sx={{ mb: { xs: 3, md: 5 } }}>
        <Typography>Master Data</Typography>
        <Typography color="grey.500">•</Typography>
        <Typography color="grey.500">Product Filter</Typography>
        <Typography color="grey.500">•</Typography>
        <Typography color="grey.500">Product Filter</Typography>
      </Box>

      <Grid container spacing={3} sx={{ width: 'auto', mb: { xs: 3, md: 5 }, ml: 0 }}>
        <Card
          sx={{
            mt: 2,
            p: 4,
            boxShadow: '2',
            position: 'relative',
            backgroundColor: 'blue.50',
            borderRadius: 4,
          }}
        >
          {products?.map((item) => (
            <Box display="flex" alignItems="center" gap={1}>
              <Checkbox
                id={`item-${item?.id}`}
                onChange={() => onChangeProductFilter(item?.id.toString())}
                checked={selectedProductFilter?.includes(item?.id.toString())}
              />{' '}
              <Typography sx={{ cursor: 'pointer' }} component="label" htmlFor={`item-${item?.id}`}>
                {item?.name}
              </Typography>
            </Box>
          ))}
        </Card>
      </Grid>
    </DashboardContent>
  );
}
