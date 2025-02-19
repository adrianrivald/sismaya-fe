import React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Box, Button, Rating } from '@mui/material';
import type { Request, RequestFeedback } from 'src/services/request/types';

import { DashboardContent } from 'src/layouts/dashboard';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from 'src/sections/auth/providers/auth';
import { DataTable } from 'src/components/table/data-tables';
import { createColumnHelper, type CellContext } from '@tanstack/react-table';
import { useDeleteRequestById } from 'src/services/request';
import { useRequestFeedbacks } from 'src/services/dashboard';

// ----------------------------------------------------------------------

interface PopoverProps {
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
}

const columnHelper = createColumnHelper<RequestFeedback>();

const columns = (popoverProps: PopoverProps, vendor: string) => [
  columnHelper.accessor('number', {
    header: 'Request ID',
  }),

  columnHelper.accessor((row) => row.rating, {
    header: 'Rating',
    cell: (info) => {
      const rating = info.getValue();
      return <Rating value={rating} disabled />;
    },
  }),

  columnHelper.accessor((row) => row.review, {
    header: 'Review',
    cell: (info) => {
      const value = info.getValue();
      return <Typography>{value}</Typography>;
    },
  }),

  columnHelper.display({
    header: 'Action',
    id: 'actions-[center]',
    cell: (info) => ButtonActions(info, popoverProps, vendor),
  }),
];

function ButtonActions(
  props: CellContext<RequestFeedback, unknown>,
  popoverProps: PopoverProps,
  vendor: string
) {
  const { user } = useAuth();
  const userType = user?.user_info?.user_type;
  const { row } = props;
  const navigate = useNavigate();
  const requestId = row.original.id;
  const onClickDetail = () => {
    navigate(`/${vendor}/request/${requestId}`);
  };
  return userType === 'internal' ? (
    <Box display="flex" justifyContent="center">
      <Button
        onClick={onClickDetail}
        type="button"
        sx={{
          paddingY: 0.5,
          border: 1,
          borderColor: 'primary.main',
          borderRadius: 1.5,
        }}
      >
        View Detail
      </Button>
    </Box>
  ) : (
    <Button
      onClick={onClickDetail}
      type="button"
      sx={{
        paddingY: 0.5,
        border: 1,
        borderColor: 'primary.main',
        borderRadius: 1.5,
      }}
    >
      View Detail
    </Button>
  );
}

export function RequestFeedbackView({ type }: { type: string }) {
  const { user } = useAuth();
  const { vendor } = useParams();
  const assigneeCompanyId = user?.internal_companies?.find(
    (item) => item?.company?.name?.toLowerCase() === vendor
  )?.company?.id;
  const { getDataTableProps } = useRequestFeedbacks({
    internalCompanyId: Number(assigneeCompanyId),
  });
  const { mutate: deleteRequestById } = useDeleteRequestById();
  const location = useLocation();
  const currentCompany = location?.pathname?.split('/request')[0].replace('/', '');

  const navigate = useNavigate();

  const popoverFuncs = () => {
    const handleEdit = (id: number) => {
      navigate(`${id}/edit`);
    };

    const handleDelete = (id: number) => {
      deleteRequestById(id);
    };

    return { handleEdit, handleDelete };
  };

  return (
    <DashboardContent maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
            Pending Requests
          </Typography>
          <Box display="flex" gap={2} sx={{ mb: { xs: 3, md: 5 } }}>
            <Typography>Dashboard {currentCompany?.toUpperCase()}</Typography>
            <Typography color="grey.500">•</Typography>
            <Typography color="grey.500">Pending Requests</Typography>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid xs={12}>
          <DataTable columns={columns(popoverFuncs(), vendor ?? '')} {...getDataTableProps()} />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
