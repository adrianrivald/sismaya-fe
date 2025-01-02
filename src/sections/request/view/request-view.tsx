import React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Box, Button, capitalize, MenuItem, menuItemClasses, MenuList } from '@mui/material';
import { Request } from 'src/services/request/types';

import { DashboardContent } from 'src/layouts/dashboard';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from 'src/sections/auth/providers/auth';
import { DataTable } from 'src/components/table/data-tables';
import { CellContext, createColumnHelper } from '@tanstack/react-table';
import { useDeleteRequestById, useRequestList } from 'src/services/request';
import { AnalyticsProjectSummary } from '../analytics-project-summary';
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
    cell: (info) => {
      const value = info.getValue();
      return '-';
    },
  }),

  columnHelper.accessor((row) => row, {
    header: 'Status',
    cell: (info) => {
      const value = info.getValue()?.progress_status?.name;
      return <Typography>{value ? capitalize(`${value}`) : 'Requested'}</Typography>;
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
  console.log(requestId, 'requestId');
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
  console.log(assigneeCompanyId, 'assigneeCompanyId');
  const { isEmpty, getDataTableProps } = useRequestList({}, String(assigneeCompanyId));
  const { mutate: deleteRequestById } = useDeleteRequestById();
  const location = useLocation();
  const currentCompany = location?.pathname?.split('/request')[0].replace('/', '');

  // console.log(getDataTableProps(), 'get data table props');
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
        <Grid xs={12} sm={6} md={4}>
          <AnalyticsProjectSummary title="Total Active Projects" total={714000} />
        </Grid>

        <Grid xs={12} sm={6} md={4}>
          <AnalyticsProjectSummary title="Projects in Progress" total={714000} />
        </Grid>

        <Grid xs={12} sm={6} md={4}>
          <AnalyticsProjectSummary title="Pending Approvals" total={714000} />
        </Grid>

        {/* <Grid container spacing={3}> */}
        <Grid xs={12}>
          <DataTable columns={columns(popoverFuncs())} {...getDataTableProps()} />
        </Grid>
        {/* </Grid> */}
        {/* Default overview items */}
        {/* <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentVisits
            title="Current visits"
            chart={{
              series: [
                { label: 'America', value: 3500 },
                { label: 'Asia', value: 2500 },
                { label: 'Europe', value: 1500 },
                { label: 'Africa', value: 500 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsWebsiteVisits
            title="Website visits"
            subheader="(+43%) than last year"
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
              series: [
                { name: 'Team A', data: [43, 33, 22, 37, 67, 68, 37, 24, 55] },
                { name: 'Team B', data: [51, 70, 47, 67, 40, 37, 24, 70, 24] },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsConversionRates
            title="Conversion rates"
            subheader="(+43%) than last year"
            chart={{
              categories: ['Italy', 'Japan', 'China', 'Canada', 'France'],
              series: [
                { name: '2022', data: [44, 55, 41, 64, 22] },
                { name: '2023', data: [53, 32, 33, 52, 13] },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentSubject
            title="Current subject"
            chart={{
              categories: ['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math'],
              series: [
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsNews title="News" list={_posts.slice(0, 5)} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsOrderTimeline title="Order timeline" list={_timeline} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsTrafficBySite
            title="Traffic by site"
            list={[
              { value: 'facebook', label: 'Facebook', total: 323234 },
              { value: 'google', label: 'Google', total: 341212 },
              { value: 'linkedin', label: 'Linkedin', total: 411213 },
              { value: 'twitter', label: 'Twitter', total: 443232 },
            ]}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsTasks title="Tasks" list={_tasks} />
        </Grid> */}
      </Grid>
    </DashboardContent>
  );
}
