import Typography from '@mui/material/Typography';
import type { AccordionSummaryProps } from '@mui/material';
import {
  Box,
  FormControl,
  FormHelperText,
  Grid,
  OutlinedInput,
  Card,
  AccordionSummary,
  Accordion,
  AccordionDetails,
  Checkbox,
  styled,
  Divider,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { Form } from 'src/components/form/form';
import { LoadingButton } from '@mui/lab';
import React, { useEffect, useState } from 'react';
import { SvgColor } from 'src/components/svg-color';
import { usePermissions, useRoleById, useUpdateRole } from 'src/services/master-data/role';
import { roleSchema, type RoleDTO } from 'src/services/master-data/role/schemas/role-schema';
import { useParams } from 'react-router-dom';
import { useProductFilter } from 'src/services/master-data/product-filter';
import { useProductByCompanyId } from 'src/services/master-data/company/product/use-product-list';

export function EditProductFilterView() {
  const { id } = useParams();
  const { data: products } = useProductByCompanyId(Number(id));
  const { data: productFilter } = useProductFilter({ company_id: id });
  console.log(productFilter, 'data product filter');
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const onChangePermission = (permissionId?: string) => {
    if (permissionId) {
      if (!selectedPermissions?.includes(permissionId)) {
        setSelectedPermissions((prev) => [...prev, permissionId]);
      } else {
        const newArr = selectedPermissions?.filter((item) => item !== permissionId);
        setSelectedPermissions(newArr);
      }
    }
  };

  const handleSubmit = (formData: RoleDTO) => {
    setIsLoading(true);

    try {
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

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

  const generalChilds = [
    {
      id: 'dashboard',
      name: 'Dashboard',
    },
    {
      id: 'report',
      name: 'Report',
    },
  ];

  const managementChilds = [
    {
      id: 'request:create',
      name: 'Create',
    },
    {
      id: 'request:read',
      name: 'Read',
    },
    {
      id: 'request:update',
      name: 'Update',
    },
    {
      id: 'request:approve/reject',
      name: 'Approve/Reject',
    },
    {
      id: 'request:change status',
      name: 'Change Status',
    },
    {
      id: 'request:assign',
      name: 'Assign',
    },
  ];

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

      <Grid container spacing={3} sx={{ mb: { xs: 3, md: 5 }, ml: 0 }}>
        <Form width="100%" onSubmit={handleSubmit} schema={roleSchema}>
          {({ register, control, watch, formState, setValue }) => (
            <>
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
                {managementChilds?.map((item) => (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Checkbox
                      id={`item-${item?.id}`}
                      onChange={() => onChangePermission(item?.id)}
                      checked={selectedPermissions?.includes(item?.id)}
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
                  Save User Group
                </LoadingButton>
              </Box>
            </>
          )}
        </Form>
      </Grid>
    </DashboardContent>
  );
}
