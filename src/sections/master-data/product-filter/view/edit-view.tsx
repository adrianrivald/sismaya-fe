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

  const [selectedHoldingProducts, setSelectedHoldingProducts] = useState<number[]>([]);
  const [selectedSubCompaniesProducts, setSelectedSubCompaniesProducts] =
    useState<Record<string, number[]>>();

  const { mutate: addProductFilter } = useAddProductFilter();
  const { mutate: deleteProductFilter } = useDeleteProductFilterById();

  const onCheckAllHolding = () => {
    const allProducts = productUse?.result[0].products;
    const newArr = allProducts?.map((item: any) => item.id);
    const hasCheckAll = allProducts
      ?.map((item: any) => item?.id)
      ?.every((item: any) => selectedHoldingProducts?.includes(item));
    if (hasCheckAll) {
      setSelectedHoldingProducts([]);
    } else {
      setSelectedHoldingProducts(newArr);
    }
  };

  const onChangeProductHolding = (childId: number) => {
    const hasValue = selectedHoldingProducts?.some((item) => item === childId);
    if (hasValue) {
      const newArr = selectedHoldingProducts?.filter((item) => item !== childId);
      setSelectedHoldingProducts(newArr);
    } else {
      const newArr = [...selectedHoldingProducts, childId];
      setSelectedHoldingProducts(newArr);
    }
  };

  const onChangeSubCompanyProduct = (parentIndex: number, childIdValue: number) => {
    setSelectedSubCompaniesProducts((prev = {}) => {
      const currentArr = prev[parentIndex] ?? [];
      const hasValue = currentArr.includes(childIdValue);

      return {
        ...prev,
        [parentIndex]: hasValue
          ? currentArr.filter((idFiltered: number) => idFiltered !== childIdValue) // remove
          : [...currentArr, childIdValue], // add
      };
    });
  };

  useEffect(() => {
    if (productFilter) {
      setSelectedProducts(defaultIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productFilter]);

  const { data: companyById } = useCompanyById(Number(id));
  const { data: internalCompanyById } = useCompanyById(Number(vendorId));

  const handleSubmit = async () => {
    addProductFilter({
      product_id: selectedHoldingProducts,
      company_id: Number(id),
    });
    // Convert object into an array of promises
    const promises = Object.entries(selectedSubCompaniesProducts ?? {}).map(
      ([companyId, productIds]) =>
        addProductFilter({
          product_id: productIds,
          company_id: Number(companyId),
        })
    );

    // Wait for all API calls to finish
    await Promise.all(promises);
  };

  useEffect(() => {
    const activeProductsHolding = productUse?.result[0].products
      ?.filter((item: any) => item?.is_active === 1)
      .map((item: any) => item?.id);
    setSelectedHoldingProducts(activeProductsHolding);

    const activeProductsSub = productUse?.result?.slice(1);
    if (activeProductsSub) {
      const mappedData = activeProductsSub.reduce(
        (acc: any, company: any) => {
          acc[company.id] = company.products
            .filter((product: any) => product.is_active === 1)
            .map((product: any) => product.id);
          return acc;
        },
        {} as Record<number, number[]>
      );
      setSelectedSubCompaniesProducts(mappedData);
    }
  }, [productUse]);

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
                checked={productUse?.result[0].products
                  ?.map((item: any) => item?.id)
                  ?.every((item: any) => selectedHoldingProducts?.includes(item))}
                onChange={onCheckAllHolding}
              />{' '}
              <Typography sx={{ cursor: 'pointer' }} component="label" htmlFor="check-all-holding">
                Check All Product in Holding Company
              </Typography>
            </Box>
          </Box>
          {productUse?.result?.slice(0, 1).map((product: any) => (
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
                    <Checkbox /> {product?.name}
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
                        checked={selectedHoldingProducts?.includes(child?.id)}
                        value={selectedHoldingProducts?.filter((item) => item === child?.id)}
                        onChange={() => onChangeProductHolding(child?.id)}
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

          {productUse?.result?.slice(1).map((product: any, index: number) => (
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
                    // checked={selectedHoldingProducts?.includes(child?.id)}
                    // value={selectedHoldingProducts?.filter((item) => item === child?.id)}
                    // onChange={() => onChangeSubCompanyProduct(index, child?.id)}
                    />{' '}
                    {product?.name}
                  </Box>
                </AccordionHeader>
                {product?.products?.map((child: any, indexChild: number) => (
                  <AccordionDetails key={child?.id} sx={{ py: 1, px: 0 }}>
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                      sx={{ backgroundColor: 'blue.50', borderRadius: '8px' }}
                    >
                      <Checkbox
                        id={`item-sub-${child?.id}`}
                        onChange={() => onChangeSubCompanyProduct(product?.id, child?.id)}
                        checked={Boolean(
                          (selectedSubCompaniesProducts?.[product?.id] ?? []).includes(child?.id)
                        )}
                      />
                      <Typography
                        sx={{ cursor: 'pointer' }}
                        component="label"
                        htmlFor={`item-sub-${child?.id}`}
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
