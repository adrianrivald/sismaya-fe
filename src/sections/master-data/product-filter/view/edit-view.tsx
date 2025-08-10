import Typography from '@mui/material/Typography';
import type { AccordionSummaryProps } from '@mui/material';
import {
  Box,
  Grid,
  Card,
  Checkbox,
  Button,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  styled,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  useAddProductFilter,
  useDeleteProductFilterById,
  useProductFilter,
} from 'src/services/master-data/product-filter';
import { useProductByCompanyId } from 'src/services/master-data/company/product/use-product-list';
import { useCompanyById } from 'src/services/master-data/company';
import { useProductUseById } from 'src/services/master-data/product-filter/use-product-use-detail';
import { SvgColor } from 'src/components/svg-color';

const AccordionHeader = styled((props: AccordionSummaryProps) => (
  <AccordionSummary
    expandIcon={<SvgColor width={15} src="/assets/icons/ic-chevron-down.svg" />}
    {...props}
  />
))(() => ({
  fontWeight: '600',
  '& .MuiAccordionSummary-content.Mui-expanded': {
    backgroundColor: 'unset',
    color: 'black',
  },
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    backgroundColor: 'unset',
  },
}));

export function EditProductFilterView() {
  const { id, vendorId } = useParams();
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [unSelectedProducts, setUnSelectedProducts] = useState<number[]>([]);
  const { data: products } = useProductByCompanyId(
    Number(vendorId),
    undefined,
    undefined,
    undefined,
    true
  );
  const { data: productFilter } = useProductFilter({
    company_id: id,
    internal_company_id: vendorId,
  });

  const { data: productUse } = useProductUseById({
    clientCompanyId: Number(id),
    internalCompanyId: Number(vendorId),
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
        <Box mt={4} width="100%">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography fontSize={18} variant="h6">
              List Product Holding: {companyById?.name}
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Checkbox
                id="check-all-holding"
                // onChange={() => onChangeProductFilter(item?.id)}
                // checked={selectedProducts?.includes(item?.id)}
              />{' '}
              <Typography sx={{ cursor: 'pointer' }} component="label" htmlFor="check-all-holding">
                Check All Product in Holding Company
              </Typography>
            </Box>
          </Box>
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
              <Box display="flex" alignItems="center" gap={1} py={1}>
                <Checkbox
                  id={`item-${item?.id}`}
                  onChange={() => onChangeProductFilter(item?.id)}
                  checked={selectedProducts?.includes(item?.id)}
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
          </Card>
        </Box>
        <Box mt={4} width="100%">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography fontSize={18} variant="h6">
              List Product Every Sub Company
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Checkbox
                id="check-all-sub"
                // onChange={() => onChangeProductFilter(item?.id)}
                // checked={selectedProducts?.includes(item?.id)}
              />{' '}
              <Typography sx={{ cursor: 'pointer' }} component="label" htmlFor="check-all-sub">
                Check All Product in All Sub Company
              </Typography>
            </Box>
          </Box>

          {productUse?.result?.map((product: any) => (
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
              <Accordion
                sx={{
                  backgroundColor: 'transparent',
                }}
              >
                <AccordionHeader
                  expandIcon={<SvgColor width={15} src="/assets/icons/ic-chevron-down.svg" />}
                  aria-controls="general"
                  id="general-header"
                  sx={{
                    padding: 0,
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <Checkbox
                      // checked={generalChilds
                      //   ?.map((item) => item?.id)
                      //   ?.every((item) => selectedPermissions?.includes(item))}
                      // onChange={onCheckAllGeneral}
                      onClick={(e) => e.stopPropagation()} // Stops accordion toggle
                    />{' '}
                    {product?.name}
                  </Box>
                </AccordionHeader>
                {product?.products?.map((child: any) => (
                  <AccordionDetails sx={{ py: 1, px: 0 }}>
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                      sx={{ backgroundColor: 'blue.50', borderRadius: '8px' }}
                    >
                      <Checkbox
                        id={`item-${child?.id}`}
                        // defaultChecked={defaultValues?.permissions?.includes(child?.id)}
                        // onChange={() => onChangePermission(child?.id)}
                        // checked={selectedPermissions?.includes(child?.id)}
                      />{' '}
                      <Typography
                        sx={{ cursor: 'pointer' }}
                        component="label"
                        htmlFor={`item-${child?.id}`}
                      >
                        {child?.name}
                      </Typography>
                    </Box>
                  </AccordionDetails>
                ))}
              </Accordion>
            </Card>
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
              Save Changes
            </Button>
          </Box>
        </Box>
      </Grid>
    </DashboardContent>
  );
}
