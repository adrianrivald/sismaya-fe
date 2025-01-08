import React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Box, Button, MenuItem, menuItemClasses, MenuList, Stack } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'src/components/table/data-tables';
import { CellContext, createColumnHelper } from '@tanstack/react-table';
import { Iconify } from 'src/components/iconify';
import { useDeleteRequestById, useRequestList } from 'src/services/request';
import { _posts, _tasks, _timeline } from 'src/_mock';
import { Request } from 'src/services/request/types';
import { AnalyticsProjectSummary } from '../../analytics-project-summary';
import { AnalyticsCurrentVisits } from '../../analytics-current-visits';
import { AnalyticsCurrentSubject } from '../../analytics-current-subject';
import { AnalyticsNews } from '../../analytics-news';
import { AnalyticsOrderTimeline } from '../../analytics-order-timeline';
import { AnalyticsTrafficBySite } from '../../analytics-traffic-by-site';
import { AnalyticsTasks } from '../../analytics-tasks';
import { AnalyticsConversionRates } from '../../analytics-conversion-rates';
import { TotalRequestOvertimeChart } from '../../total-request-overtime-chart';

const columnHelper = createColumnHelper<Request & { isCenter?: boolean }>();

const columns = () => [
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
];

export function DashboardInternalView() {
  const [openPopover, setOpenPopover] = React.useState<HTMLButtonElement | null>(null);
  const { isEmpty, getDataTableProps, data } = useRequestList({}, String(29));

  console.log(data, 'datanya');

  // console.log(getDataTableProps(), 'get data table props');
  const navigate = useNavigate();
  const onClickAddNew = () => {
    navigate('/request/create');
  };

  return (
    <DashboardContent maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
            General Dashboard
          </Typography>
          <Box display="flex" gap={2} sx={{ mb: { xs: 3, md: 5 } }}>
            <Typography>Dashboard</Typography>
          </Box>
        </Box>
        {/* <Box>
          <Button onClick={onClickAddNew} variant="contained" color="primary">
            Create New Request
          </Button>
        </Box> */}
      </Box>

      <Grid container spacing={2}>
        <Grid xs={12} sm={6} md={4} spacing={2}>
          <Stack spacing={2}>
            <Stack spacing={2} direction={{ xs: 'column', xl: 'row' }}>
              <Box width="100%">
                <AnalyticsProjectSummary title="Total Active Projects" total={714000} />
              </Box>
              <Box width="100%">
                <AnalyticsProjectSummary title="Projects in Progress" total={714000} />
              </Box>
            </Stack>
            <Stack spacing={2} direction={{ xs: 'column', xl: 'row' }}>
              <Box width="100%">
                <AnalyticsProjectSummary title="Total Active Projects" total={714000} />
              </Box>
              <Box width="100%">
                <AnalyticsProjectSummary title="Projects in Progress" total={714000} />
              </Box>
            </Stack>{' '}
            <Stack spacing={2} direction={{ xs: 'column', xl: 'row' }}>
              <Box width="100%">
                <AnalyticsProjectSummary title="Total Active Projects" total={714000} />
              </Box>
              <Box width="100%">
                <AnalyticsProjectSummary title="Projects in Progress" total={714000} />
              </Box>
            </Stack>
          </Stack>
        </Grid>
        <Grid xs={12} sm={6} md={8} spacing={2}>
          <DataTable
            withPagination={false}
            columns={columns()}
            {...getDataTableProps()}
            data={data?.items?.slice(0, 5)}
          />
        </Grid>

        {/* Default overview items */}
        <Grid xs={12} md={6} lg={4}>
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
          <TotalRequestOvertimeChart
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
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
