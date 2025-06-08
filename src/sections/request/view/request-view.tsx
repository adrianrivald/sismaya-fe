import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Box, Button, capitalize } from '@mui/material';
import type { Request } from 'src/services/request/types';

import { DashboardContent } from 'src/layouts/dashboard';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from 'src/sections/auth/providers/auth';
import { DataTable } from 'src/components/table/data-tables';
import { createColumnHelper, type CellContext } from '@tanstack/react-table';
import {
  useDeleteRequestById,
  useRequestList,
  useRequestStatusSummary,
  useRequestSummary,
} from 'src/services/request';
import { RequestSummaryCard } from 'src/sections/overview/request-summary-card';
import { StatusBadge } from '../status-badge';

// ----------------------------------------------------------------------

interface PopoverProps {
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
}

const columnHelper = createColumnHelper<Request & { isCenter?: boolean }>();

const columns = (popoverProps: PopoverProps) => [
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
    cell: (info) => '-',
  }),

  columnHelper.accessor((row) => row, {
    header: 'Status',
    cell: (info) => {
      const progressStatus = info.getValue()?.progress_status?.name;
      const step = info.getValue()?.step;
      return (
        <Typography>
          {step === 'pending' || step === 'rejected'
            ? step === 'pending'
              ? 'Requested'
              : capitalize(step || '')
            : capitalize(progressStatus || '')}
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
    cell: (info) => ButtonActions(info, popoverProps),
  }),
];

function ButtonActions(props: CellContext<Request, unknown>, popoverProps: PopoverProps) {
  const { user } = useAuth();
  const userType = user?.user_info?.user_type;
  const { row } = props;
  const navigate = useNavigate();
  const requestId = row.original.id;
  const step = row?.original?.step;
  const onClickDetail = () => {
    navigate(`${requestId}`);
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

export function RequestView() {
  const { user } = useAuth();
  const { vendor } = useParams();
  const assigneeCompanyId = user?.internal_companies?.find(
    (item) => item?.company?.name?.toLowerCase() === vendor
  )?.company?.id;
  const [filter, setFilter] = useState<any>({});
  const [totalData, setTotalData] = useState(0);
  const { getDataTableProps } = useRequestList(filter, Number(assigneeCompanyId));
  const { data: requestSummary } = useRequestSummary(String(assigneeCompanyId));
  const { data: requestStatusSummary } = useRequestStatusSummary(String(assigneeCompanyId));
  const { mutate: deleteRequestById } = useDeleteRequestById();
  const location = useLocation();
  const currentCompany = location?.pathname?.split('/request')[0].replace('/', '');

  const navigate = useNavigate();
  const onClickAddNew = () => {
    navigate('create');
  };

  const popoverFuncs = () => {
    const handleEdit = (id: number) => {
      navigate(`${id}/edit`);
    };

    const handleDelete = (id: number) => {
      deleteRequestById(id);
    };

    return { handleEdit, handleDelete };
  };

  const onFilterByStatus = (statusId: number) => {
    setFilter({
      ...filter,
      status: statusId,
    });
  };

  const onRemoveFilter = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { status, ...rest } = filter;
    setFilter({
      ...rest,
    });
  };

  useEffect(() => {
    if (filter?.status === undefined) {
      setTotalData(getDataTableProps().total);
    }
  }, [filter, getDataTableProps]);

  return (
    <DashboardContent maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
            {currentCompany?.toUpperCase()} Request Management
          </Typography>
          <Box display="flex" gap={2} sx={{ mb: { xs: 3, md: 5 } }}>
            <Typography>Request</Typography>
            <Typography color="grey.500">•</Typography>
            <Typography color="grey.500">
              {currentCompany?.toUpperCase()} Request Management
            </Typography>
          </Box>
        </Box>
        <Box>
          <Button onClick={onClickAddNew} variant="contained" color="primary">
            Create New Request
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} lg={12 / 5}>
          <RequestSummaryCard
            title="Total Active Project"
            total={requestSummary?.active}
            color="#005B7F"
          />
        </Grid>
        <Grid xs={12} sm={6} lg={12 / 5}>
          <RequestSummaryCard
            title="In Progress"
            total={requestSummary?.in_progress}
            color="#FFE16A"
          />
        </Grid>
        <Grid xs={12} sm={6} lg={12 / 5}>
          <RequestSummaryCard
            title="Pending Approvals"
            total={requestSummary?.pending}
            color="#2CD9C5"
          />
        </Grid>
        <Grid xs={12} sm={6} lg={12 / 5}>
          <RequestSummaryCard title="Completed" total={requestSummary?.done} color="#2CD9C5" />
        </Grid>
        <Grid xs={12} sm={6} lg={12 / 5}>
          <RequestSummaryCard title="Canceled" total={requestSummary?.rejected} color="#FF6C40" />
        </Grid>
        <Grid xs={12}>
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              display="flex"
              alignItems="center"
              gap={1}
              sx={{
                borderBottomWidth: filter?.status !== undefined ? 0 : 2,
                pb: 1,
                borderBottomColor: 'primary.main',
                borderBottomStyle: 'solid',
                cursor: 'pointer',
              }}
              onClick={onRemoveFilter}
            >
              <Typography color="primary.main">All</Typography>
              <Box
                sx={{
                  px: 1.5,
                  py: 0.25,
                  backgroundColor: '#B3B3B3',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                }}
              >
                {totalData === 0 ? getDataTableProps().total : totalData}
              </Box>
            </Box>
            {requestStatusSummary?.map((item) => (
              <Box
                display="flex"
                alignItems="center"
                id={item?.id.toString()}
                gap={1}
                sx={{
                  borderBottomWidth: filter?.status === item?.id ? 2 : 0,
                  pb: 1,
                  borderBottomColor: 'primary.main',
                  borderBottomStyle: 'solid',
                  cursor: 'pointer',
                }}
                onClick={() => onFilterByStatus(item?.id)}
              >
                <Typography color="grey.600">{capitalize(item?.name)}</Typography>
                <Box
                  sx={{
                    px: 1.5,
                    py: 0.25,
                    backgroundColor: '#B3B3B3',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                  }}
                >
                  {item?.count}
                </Box>
              </Box>
            ))}
          </Box>
        </Grid>

        <Grid xs={12}>
          <DataTable columns={columns(popoverFuncs())} {...getDataTableProps()} />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
