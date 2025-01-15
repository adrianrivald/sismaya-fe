import React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import {
  Box,
  Button,
  Card,
  MenuItem,
  menuItemClasses,
  MenuList,
  Select,
  Stack,
} from '@mui/material';

import {
  useRequestStats,
  useRequestSummary,
  useRequestSummaryCompany,
} from 'src/services/dashboard';
import { DashboardContent } from 'src/layouts/dashboard';
import { DataTable } from 'src/components/table/data-tables';
import { createColumnHelper } from '@tanstack/react-table';
import { _posts, _tasks, _timeline } from 'src/_mock';
import { SvgColor } from 'src/components/svg-color';
import { RequestSummaryCompany } from 'src/services/dashboard/types';
import { RequestSummaryCard } from '../../request-summary-card';
import { RequestStatsChart } from '../../request-stats-chart';
import { TimeSummaryCard } from '../../time-summary-card';
import { RequestDueChart } from '../../request-due-chart';
import { SlaComplianceChart } from '../../sla-compliance-chart';

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

  const filtered = requestStats?.map((item: any) => {
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

  const doneValue = filtered?.map(() => ({
    name: 'Done',
    data: filtered?.map((item: any) => item?.done),
  }))[0];

  const inProgressValue = filtered?.map(() => ({
    name: 'In Progress',
    data: filtered?.map((item: any) => item?.in_progress),
  }))[0];

  const newRequestValue = filtered?.map(() => ({
    name: 'New Request',
    data: filtered?.map((item: any) => item?.new_request),
  }))[0];

  const convertedDataToChart = [doneValue, inProgressValue, newRequestValue];

  return (
    <DashboardContent maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box sx={{ mb: { xs: 1, md: 4 } }}>
          <Typography variant="h4">General Dashboard</Typography>
        </Box>
        <Box>
          <Typography component="span" color="#637381">
            Filter Period:{' '}
          </Typography>
          <Select
            labelId="date-filter-label"
            id="date-filter"
            label="Filter"
            onChange={() => {}}
            defaultValue="year"
            sx={{
              height: 28,
              paddingY: 0.5,
              paddingX: 1,
              ml: 1,
              backgroundColor: 'grey.200',
              borderRadius: 1,
              width: 'max-content',
              '& .MuiOutlinedInput-notchedOutline': {
                border: 0,
              },
              '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
            }}
          >
            <MenuItem defaultChecked value="year">
              Year
            </MenuItem>
            <MenuItem value="month">Month</MenuItem>
          </Select>
        </Box>
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
        <Grid xs={12} sm={12} md={2} spacing={2} mt={4}>
          <Stack spacing={2}>
            <TimeSummaryCard title="First Response Time" value="1hrs" color="primary.main" />
            <TimeSummaryCard title="Response Time" value="1hrs" color="#FFE16A" />
            <TimeSummaryCard title="Resolution Time" value="1hrs" color="#2CD9C5" />
            <TimeSummaryCard title="Total Time Done" value="1hrs" color="#FF6C40" />
          </Stack>
        </Grid>
        <Grid xs={12} sm={12} md={5}>
          <Card
            sx={{
              width: '100%',
              boxShadow: '2',
              position: 'relative',
              backgroundColor: 'common.white',
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                width: '100%',
                borderBottomWidth: 1,
                borderBottomStyle: 'solid',
                borderBottomColor: 'grey.250',
              }}
            >
              <Typography
                sx={{
                  px: 3,
                  py: 2,
                }}
                variant="h5"
              >
                Happiness Rating
              </Typography>
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
              gap={2}
              sx={{
                p: 3,
              }}
            >
              <Box
                position="relative"
                sx={{
                  borderRadius: 0.5,
                  background: 'linear-gradient(to right bottom,  #C8FAD6, #5BE49B)',
                  padding: 2,
                  width: '100%',
                  color: '#004B50',
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h5" fontSize={20} fontWeight="bold">
                    PT SIM
                  </Typography>

                  <Typography fontWeight="bold" variant="h3" fontSize={32} color="#004B50">
                    4.42{' '}
                    <Typography component="span" fontSize={16} fontWeight="normal">
                      / 5.00
                    </Typography>
                  </Typography>
                </Box>
                <Box
                  component="img"
                  src="/assets/background/shape-square.png"
                  sx={{ position: 'absolute', top: 2, left: 2 }}
                />
              </Box>
              <Box
                position="relative"
                sx={{
                  borderRadius: 0.5,
                  background: 'linear-gradient(to right bottom,  #C8FAD6, #5BE49B)',
                  padding: 2,
                  width: '100%',
                  color: '#004B50',
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h5" fontSize={20} fontWeight="bold">
                    PT SAS
                  </Typography>

                  <Typography fontWeight="bold" variant="h3" fontSize={32} color="#004B50">
                    4.42{' '}
                    <Typography component="span" fontSize={16} fontWeight="normal">
                      / 5.00
                    </Typography>
                  </Typography>
                </Box>
                <Box
                  component="img"
                  src="/assets/background/shape-square.png"
                  sx={{ position: 'absolute', top: 2, left: 2 }}
                />
              </Box>
              <Box
                position="relative"
                sx={{
                  borderRadius: 0.5,
                  background: 'linear-gradient(to right bottom, #FFF5CC, #FFD666)',
                  padding: 2,
                  width: '100%',
                  color: '#7A4100',
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h5" fontSize={20} fontWeight="bold">
                    PT KMI
                  </Typography>

                  <Typography fontWeight="bold" variant="h3" fontSize={32} color="#7A4F01">
                    3.52{' '}
                    <Typography component="span" fontSize={16} fontWeight="normal">
                      / 5.00
                    </Typography>
                  </Typography>
                </Box>
                <Box
                  component="img"
                  src="/assets/background/shape-square.png"
                  sx={{ position: 'absolute', top: 2, left: 2 }}
                />
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid xs={12} sm={12} md={5}>
          <Card
            sx={{
              width: '100%',
              boxShadow: '2',
              position: 'relative',
              backgroundColor: 'common.white',
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                width: '100%',
                borderBottomWidth: 1,
                borderBottomStyle: 'solid',
                borderBottomColor: 'grey.250',
              }}
            >
              <Typography
                sx={{
                  px: 3,
                  py: 2,
                }}
                variant="h5"
              >
                SLA Compliance
              </Typography>
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
              gap={2}
              sx={{
                p: 3,
              }}
            >
              <SlaComplianceChart value={80} />
            </Box>

            <Box
              sx={{
                px: 1,
                pt: 2,
                width: '100%',
                borderTopWidth: 1,
                borderTopStyle: 'solid',
                borderTopColor: 'grey.250',
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                  backgroundColor: 'warning.200',
                  px: 3,
                  py: 1,
                  borderRadius: 1,
                  mb: 2,
                }}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <SvgColor color="#FFC107" src="/assets/icons/ic-alert.svg" />
                  <Typography color="warning.600">Resolved CITO : 4</Typography>
                </Box>
                <Button
                  sx={{
                    borderWidth: 1,
                    borderStyle: 'solid',
                    color: 'warning.600',
                    borderColor: 'warning.600',
                  }}
                >
                  Lihat
                </Button>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
