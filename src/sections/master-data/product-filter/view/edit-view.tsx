import Typography from '@mui/material/Typography';
import { Box, Grid, Card, Checkbox, Button } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { Form } from 'src/components/form/form';
import React, { useEffect, useState } from 'react';
import { roleSchema, type RoleDTO } from 'src/services/master-data/role/schemas/role-schema';
import { useParams } from 'react-router-dom';
import {
  useAddProductFilter,
  useDeleteProductFilterById,
  useProductFilter,
} from 'src/services/master-data/product-filter';
import { useProductByCompanyId } from 'src/services/master-data/company/product/use-product-list';
import { useCompanyById } from 'src/services/master-data/company';

export function EditProductFilterView() {
  const { id, vendorId } = useParams();
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [unSelectedProducts, setUnSelectedProducts] = useState<number[]>([]);
  const { data: products } = useProductByCompanyId(Number(vendorId));
  const { data: productFilter } = useProductFilter({
    company_id: id,
    internal_company_id: vendorId,
  });
  const defaultIds = productFilter?.map((item: any) => item?.product?.id);

  const { mutate: addProductFilter } = useAddProductFilter();
  const { mutate: deleteProductFilter } = useDeleteProductFilterById();
  const onChangeProductFilter = (productFilterId?: number) => {
    if (productFilterId) {
      const isHasId = selectedProducts?.includes(productFilterId);
      if (isHasId) {
        const newArr = selectedProducts?.filter((item) => item !== productFilterId);
        setSelectedProducts(newArr);
        setUnSelectedProducts((prev) => [...prev, productFilterId]);
      } else {
        const newArr = selectedProducts?.filter((item) => item === productFilterId);
        setUnSelectedProducts(newArr);
        setSelectedProducts((prev) => [...prev, productFilterId]);
      }
    }
    // if (productFilterId) {
    //   if (
    //     !productFilter?.map((item: any) => item?.product?.id?.toString()).includes(productFilterId)
    //   ) {
    //     addProductFilter({
    //       product_id: Number(productFilterId),
    //       company_id: Number(id),
    //     });
    //   } else {
    //     const productUseId = productFilter?.find(
    //       (item: any) => item?.product?.id === Number(productFilterId)
    //     ).id;
    //     deleteProductFilter(Number(productUseId));
    //   }
    // }
  };

  console.log(selectedProducts, 'log: selectedProducts');
  console.log(unSelectedProducts, 'log: unSelectedProducts');

  useEffect(() => {
    if (productFilter) {
      setSelectedProducts(defaultIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productFilter]);

  console.log(productFilter, 'selected');

  const { data: companyById } = useCompanyById(Number(id));
  const { data: internalCompanyById } = useCompanyById(Number(vendorId));

  const handleSubmit = () => {
    addProductFilter({
      product_id: selectedProducts,
      company_id: Number(id),
    });
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
        <Typography color="grey.500">{companyById?.name}</Typography>
        <Typography color="grey.500">•</Typography>
        <Typography color="grey.500">{internalCompanyById?.name}</Typography>
      </Box>

      <Grid container spacing={3} sx={{ width: 'auto', mb: { xs: 3, md: 5 }, ml: 0 }}>
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
          {products?.map((item) => (
            <Box display="flex" alignItems="center" gap={1}>
              <Checkbox
                id={`item-${item?.id}`}
                onChange={() => onChangeProductFilter(item?.id)}
                checked={selectedProducts?.includes(item?.id)}
              />{' '}
              <Typography sx={{ cursor: 'pointer' }} component="label" htmlFor={`item-${item?.id}`}>
                {item?.name}
              </Typography>
            </Box>
          ))}

          <Box
            display="flex"
            justifyContent="end"
            width="100%"
            sx={{
              mt: 8,
            }}
          >
            <Button onClick={handleSubmit} type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Box>
        </Card>
      </Grid>
    </DashboardContent>
  );
}
