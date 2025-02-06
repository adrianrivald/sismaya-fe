import React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import type { SelectChangeEvent } from '@mui/material';
import { Box, Button, Card, MenuItem, Select, Stack } from '@mui/material';

import {
  useRequestCito,
  useRequestStats,
  useRequestSummary,
  useRequestSummaryCompany,
} from 'src/services/dashboard';
import { DashboardContent } from 'src/layouts/dashboard';
import { DataTable } from 'src/components/table/data-tables';
import { createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { SvgColor } from 'src/components/svg-color';
import type { RequestSummaryCompany } from 'src/services/dashboard/types';
import { useNavigate } from 'react-router-dom';
import { RequestSummaryCard } from '../../request-summary-card';
import { RequestStatsChart } from '../../request-stats-chart';
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
  const navigate = useNavigate();
  const [periodFilter, setPeriodFilter] = React.useState('year');
  const { data: requestSummary } = useRequestSummary(periodFilter);
  const { getDataTableProps, data: requestSummaryCompany } = useRequestSummaryCompany({
    period: periodFilter,
  });
  const { data: requestCito } = useRequestCito({
    period: periodFilter,
  });
  const totalRequestCito = requestCito?.meta?.total;

  const { data: requestStats } = useRequestStats(periodFilter);

  const filtered = requestStats?.map((item: any) => {
    const filterednya = Object.keys(item)
      .filter((key) => key !== 'month')
      .reduce((obj: any, key: string) => {
        obj[key] = item[key] as any;
        return obj;
      }, {});
    return filterednya;
  });

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

  const convertedDataToChart = [newRequestValue, inProgressValue, doneValue];

  const onChangePeriodFilter = (e: SelectChangeEvent<string>) => {
    setPeriodFilter(e.target.value);
  };

  const renderTime = (timeValue: string) => {
    switch (periodFilter) {
      case 'year':
        return timeValue;
      case 'month':
        return dayjs(timeValue).format('D');
      case 'week':
        return dayjs(timeValue).format('dd');
      default:
        return dayjs(timeValue).format('D');
    }
  };
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'April',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  console.log(convertedDataToChart, 'convertedDataToChart');

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
            onChange={onChangePeriodFilter}
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
            <MenuItem defaultChecked value="month">
              Month
            </MenuItem>
            <MenuItem defaultChecked value="week">
              Week
            </MenuItem>
            <MenuItem defaultChecked value="day">
              Day
            </MenuItem>
          </Select>
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid xs={12} sm={6} md={4} spacing={2}>
          <Stack spacing={2}>
            <Stack spacing={2} direction="row">
              <RequestSummaryCard
                title="Open Request"
                total={requestSummary?.to_do}
                color="primary.main"
              />
              <RequestSummaryCard
                title="Unassigned"
                total={requestSummary?.pending}
                color="#FF6C40"
              />
            </Stack>
            <Stack spacing={2} direction="row">
              <RequestSummaryCard
                title="On Progress"
                total={requestSummary?.in_progress}
                color="#FFE16A"
              />

              <RequestSummaryCard
                title="Due Today"
                total={requestSummary?.due_today}
                color="#FF6C40"
              />
            </Stack>{' '}
            <Stack spacing={2} direction="row">
              <RequestSummaryCard title="Solved" total={requestSummary?.done} color="#2CD9C5" />

              <RequestSummaryCard title="Overdue" total={requestSummary?.overdue} color="#FF6C40" />
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
              categories:
                periodFilter === 'year'
                  ? requestStats
                      ?.sort((a, b) => months.indexOf(a.time) - months.indexOf(b.time))
                      ?.map((item) => renderTime(item?.time))
                  : requestStats?.map((item) => renderTime(item?.time)),
              series: convertedDataToChart,
              colors: ['#005B7F', '#FFE700', '#2CD9C5'],
              // series:
            }}
          />
        </Grid>
        <Grid xs={12} sm={12} md={6}>
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

        <Grid xs={12} sm={12} md={6}>
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
                  <Typography color="warning.600">Request CITO : {totalRequestCito}</Typography>
                </Box>
                <Button
                  onClick={() => navigate(`/request/cito?period=${periodFilter}`)}
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
