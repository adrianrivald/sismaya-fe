import React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Box, Button, MenuItem, menuItemClasses, MenuList, Stack } from '@mui/material';

import {
  useRequestStats,
  useRequestSummary,
  useRequestSummaryCompany,
} from 'src/services/dashboard';
import { DashboardContent } from 'src/layouts/dashboard';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'src/components/table/data-tables';
import { CellContext, createColumnHelper } from '@tanstack/react-table';
import { Iconify } from 'src/components/iconify';
import { useDeleteRequestById, useRequestList } from 'src/services/request';
import { _posts, _tasks, _timeline } from 'src/_mock';
import { Request } from 'src/services/request/types';
import { RequestSummaryCard } from '../../request-summary-card';
import { AnalyticsCurrentVisits } from '../../analytics-current-visits';
import { AnalyticsCurrentSubject } from '../../analytics-current-subject';
import { AnalyticsNews } from '../../analytics-news';
import { AnalyticsOrderTimeline } from '../../analytics-order-timeline';
import { AnalyticsTrafficBySite } from '../../analytics-traffic-by-site';
import { AnalyticsTasks } from '../../analytics-tasks';
import { AnalyticsConversionRates } from '../../analytics-conversion-rates';
import { TotalRequestOvertimeChart } from '../../total-request-overtime-chart';
import { RequestSummaryCompany } from 'src/services/dashboard/types';
import { RequestStatsChart } from '../../request-stats-chart';
import { TimeSummaryCard } from '../../time-summary-card';

const columnHelper = createColumnHelper<RequestSummaryCompany>();

const columns = () => [
  columnHelper.accessor((row) => row.company_name, {
    header: 'Company',
    cell: (info) => {
      const value = info.getValue();
      return <Typography>{value ?? '-'}</Typography>;
    },
  }),

  columnHelper.accessor((row) => row.to_do, {
    header: 'Open Request',
    cell: (info) => {
      const value = info.getValue();
      return <Typography>{value ?? '-'}</Typography>;
    },
  }),

  columnHelper.accessor((row) => row.in_progress, {
    header: 'On Progress',
    cell: (info) => {
      const value = info.getValue();
      return <Typography>{value ?? '-'}</Typography>;
    },
  }),

  columnHelper.accessor((row) => row.done, {
    header: 'Solved',
    cell: (info) => {
      const value = info.getValue();
      return <Typography>{value ?? '-'}</Typography>;
    },
  }),

  columnHelper.accessor((row) => row.pending, {
    header: 'Unasiggned',
    cell: (info) => {
      const value = info.getValue();
      return <Typography>{value ?? '-'}</Typography>;
    },
  }),

  columnHelper.accessor((row) => row.due_today, {
    header: 'Due Today',
    cell: (info) => {
      const value = info.getValue();
      return <Typography>{value ?? '-'}</Typography>;
    },
  }),

  columnHelper.accessor((row) => row.overdue, {
    header: 'Overdue',
    cell: (info) => {
      const value = info.getValue();
      return <Typography>{value ?? '-'}</Typography>;
    },
  }),
];

export function DashboardInternalView() {
  const { data: requestSummary } = useRequestSummary();
  const { getDataTableProps, data: requestSummaryCompany } = useRequestSummaryCompany({});
  const { data: requestStats } = useRequestStats();

  const filtered = requestStats?.map((item) => {
    const filterednya = Object.keys(item)
      .filter((key) => key !== 'month')
      .reduce((obj: any, key: string) => {
        obj[key] = item[key] as any;
        return obj;
      }, {});
    return filterednya;
  });

  // const convertedToChart = filtered?.map((item) => ({
  //   name: Object.keys(item),
  //   data: filtered?.map((item) => {
  //     return item[Object.keys(item)];
  //   }),
  // }));

  const doneValue = filtered?.map(() => {
    return {
      name: 'Done',
      data: filtered?.map((item: any) => item?.done),
    };
  })[0];

  const inProgressValue = filtered?.map(() => {
    return {
      name: 'In Progress',
      data: filtered?.map((item: any) => item?.in_progress),
    };
  })[0];

  const newRequestValue = filtered?.map(() => {
    return {
      name: 'New Request',
      data: filtered?.map((item: any) => item?.new_request),
    };
  })[0];

  const convertedDataToChart = [doneValue, inProgressValue, newRequestValue];

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
                <RequestSummaryCard
                  title="Open Request"
                  total={requestSummary?.to_do}
                  color="primary.main"
                />
              </Box>
              <Box width="100%">
                <RequestSummaryCard
                  title="Unassigned"
                  total={requestSummary?.pending}
                  color="#FF6C40"
                />
              </Box>
            </Stack>
            <Stack spacing={2} direction={{ xs: 'column', xl: 'row' }}>
              <Box width="100%">
                <RequestSummaryCard
                  title="On Progress"
                  total={requestSummary?.in_progress}
                  color="#FFE16A"
                />
              </Box>
              <Box width="100%">
                <RequestSummaryCard
                  title="Due Today"
                  total={requestSummary?.due_today}
                  color="#FF6C40"
                />
              </Box>
            </Stack>{' '}
            <Stack spacing={2} direction={{ xs: 'column', xl: 'row' }}>
              <Box width="100%">
                <RequestSummaryCard title="Solved" total={requestSummary?.done} color="#2CD9C5" />
              </Box>
              <Box width="100%">
                <RequestSummaryCard
                  title="Overdue"
                  total={requestSummary?.overdue}
                  color="#FF6C40"
                />
              </Box>
            </Stack>
          </Stack>
        </Grid>
        <Grid xs={12} sm={6} md={8} spacing={2}>
          <DataTable
            withPagination={false}
            columns={columns()}
            {...getDataTableProps()}
            data={requestSummaryCompany?.items?.slice(0, 5)}
          />
        </Grid>

        <Grid xs={12} md={12} lg={12}>
          <RequestStatsChart
            chart={{
              categories: requestStats?.map((item) => item?.month),
              series: convertedDataToChart,
              // series:
            }}
          />
        </Grid>
        <Grid xs={12} sm={6} md={2} spacing={2} mt={4}>
          <Stack spacing={2}>
            <TimeSummaryCard title="First Response Time" value="1hrs" color="primary.main" />
            <TimeSummaryCard title="Response Time" value="1hrs" color="#FFE16A" />
            <TimeSummaryCard title="Resolution Time" value="1hrs" color="#2CD9C5" />
            <TimeSummaryCard title="Total Time Done" value="1hrs" color="#FF6C40" />
          </Stack>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
