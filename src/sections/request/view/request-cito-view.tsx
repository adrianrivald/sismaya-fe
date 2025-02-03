import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Box, Button, capitalize } from '@mui/material';
import type { Request } from 'src/services/request/types';

import { DashboardContent } from 'src/layouts/dashboard';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from 'src/sections/auth/providers/auth';
import { DataTable } from 'src/components/table/data-tables';
import { createColumnHelper, type CellContext } from '@tanstack/react-table';
import { useDeleteRequestById, useRequestList } from 'src/services/request';
import { StatusBadge } from '../status-badge';

// ----------------------------------------------------------------------

interface PopoverProps {
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
}

const columnHelper = createColumnHelper<Request & { isCenter?: boolean }>();

const columns = (popoverProps: PopoverProps, vendor: string) => [
  columnHelper.accessor('number', {
    header: 'Request ID',
  }),

  columnHelper.accessor((row) => row, {
    header: 'Requester',
    cell: (info) => {
      const requester = info.getValue()?.requester;
      const product = info.getValue()?.product;
      return (
        <Box>
          <Typography>{requester?.name}</Typography>
          <Typography color="grey.600">{product?.name}</Typography>
        </Box>
      );
    },
  }),

  columnHelper.accessor('category', {
    header: 'Category',
    cell: (info) => {
      const categoryName = info.getValue().name;
      return categoryName;
    },
  }),

  columnHelper.accessor((row) => row, {
    header: 'Project Deadline',
    cell: (info) => {
      const value = info.getValue();
      return '-';
    },
  }),

  columnHelper.accessor((row) => row, {
    header: 'Status',
    cell: (info) => {
      const value = info.getValue()?.progress_status?.name;
      return (
        <Typography>
          {info.getValue()?.progress_status !== null ? capitalize(`${value}`) : 'Requested'}
        </Typography>
      );
    },
  }),

  columnHelper.accessor((row) => row, {
    header: 'Priority',
    cell: (info) => {
      const value = info.getValue()?.priority;
      const isCito = info.getValue()?.is_cito;
      return !isCito ? (
        value !== null ? (
          <StatusBadge label={capitalize(`${value}`)} type="info" />
        ) : (
          '-'
        )
      ) : (
        <StatusBadge label="CITO" type="danger" />
      );
    },
  }),

  columnHelper.display({
    header: 'Action',
    id: 'actions-[center]',
    cell: (info) => ButtonActions(info, popoverProps, vendor),
  }),
];

function ButtonActions(
  props: CellContext<Request, unknown>,
  popoverProps: PopoverProps,
  vendor: string
) {
  const { user } = useAuth();
  const userType = user?.user_info?.user_type;
  const { row } = props;
  const navigate = useNavigate();
  const requestId = row.original.id;
  const step = row?.original?.step;
  const onClickDetail = () => {
    navigate(`/${vendor}/request/${requestId}`);
  };
  return userType === 'internal' ? (
    <Box display="flex" justifyContent="center">
      {step === 'pending' ? (
        <Button
          onClick={onClickDetail}
          sx={{
            paddingY: 0.5,
            backgroundColor: '#FFC107',
            fontWeight: 'normal',
            color: 'black',
            borderRadius: 1.5,
          }}
        >
          Review Request
        </Button>
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
          {step !== 'rejected' ? 'Edit' : 'View Detail'}
        </Button>
      )}
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

export function RequestCitoView({ type, step }: { type: string; step: string }) {
  const { user } = useAuth();
  const { vendor } = useParams();
  const [searchParams] = useSearchParams();
  const periodFilter = searchParams.get('period');
  const assigneeCompanyId = user?.internal_companies?.find(
    (item) => item?.company?.name?.toLowerCase() === vendor
  )?.company?.id;
  const { getDataTableProps } = useRequestList(
    { cito: '1', step: step !== 'all' ? step : '' },
    String(type === 'internal' && step !== 'all' ? assigneeCompanyId : '')
  );
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

  const modeTitle = step === 'all' ? '' : 'Unresolved';

  return (
    <DashboardContent maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
            {modeTitle} CITO Requests: Last {capitalize(periodFilter ?? '')}
          </Typography>
          <Box display="flex" gap={2} sx={{ mb: { xs: 3, md: 5 } }}>
            <Typography>Dashboard {currentCompany?.toUpperCase()}</Typography>
            <Typography color="grey.500">•</Typography>
            <Typography color="grey.500">{modeTitle} CITO Requests</Typography>
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
