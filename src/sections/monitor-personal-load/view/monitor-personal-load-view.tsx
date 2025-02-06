import React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import type { SelectChangeEvent } from '@mui/material';
import { Box, capitalize, Card, Stack } from '@mui/material';

import { useRequestCito, useRequestStats } from 'src/services/dashboard';
import { DashboardContent } from 'src/layouts/dashboard';
import { DataTable } from 'src/components/table/data-tables';
import { createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { SvgColor } from 'src/components/svg-color';
import { Link, useNavigate } from 'react-router-dom';
import {
  useIncompleteTask,
  useTotalTaskByStatus,
  useTotalTaskCompleted,
} from 'src/services/monitor-personal-load/use-monitor-personal-load';
import { StatusBadge } from 'src/sections/request/status-badge';
import { TotalTaskCompletedChart } from '../total-task-completed-chart';

const columnHelper = createColumnHelper<any>();

const columns = () => [
  columnHelper.accessor((row) => row.request, {
    header: 'Request',
    cell: (info) => {
      const value = info.getValue();
      return <Typography>{value ?? '-'}</Typography>;
    },
  }),

  columnHelper.accessor((row) => row.product, {
    header: 'Product',
    cell: (info) => {
      const value = info.getValue();
      return <Typography>{value ?? '-'}</Typography>;
    },
  }),

  columnHelper.accessor((row) => row.task, {
    header: 'Task',
    cell: (info) => {
      const value = info.getValue();
      return <Typography>{value ?? '-'}</Typography>;
    },
  }),

  columnHelper.accessor((row) => row.due_date, {
    header: 'Due',
    cell: (info) => {
      const value = info.getValue();
      return <Typography>{dayjs(value).format('DD-MM-YYYY') ?? '-'}</Typography>;
    },
  }),

  columnHelper.accessor((row) => row.priority, {
    header: 'Priority',
    cell: (info) => {
      const value = info.getValue();
      return value !== 'cito' ? (
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
];

export function MonitorPersonalLoadView() {
  const navigate = useNavigate();
  const { data: totalTaskByStatus } = useTotalTaskByStatus();
  const { getDataTableProps, data: incompleteTask } = useIncompleteTask({});

  const { data: totalTaskCompleted } = useTotalTaskCompleted();
  console.log(totalTaskCompleted, 'totalTaskCompleted');
  const filtered = totalTaskCompleted?.map((item: any) => {
    const filterednya = Object.keys(item)
      .filter((key) => key !== 'month')
      .reduce((obj: any, key: string) => {
        obj[key] = item[key] as any;
        return obj;
      }, {});
    return filterednya;
  });

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

  console.log(
    totalTaskCompleted?.map((item) => item),
    'totalTaskCompleted?.map((item) => item)'
  );

  return (
    <DashboardContent maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box sx={{ mb: { xs: 1, md: 4 } }}>
          <Typography variant="h4">Monitor Personal Load</Typography>
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid xs={12} md={12} lg={12}>
          <Card
            sx={{
              p: 3,
              boxShadow: '2',
              position: 'relative',
              backgroundColor: 'common.white',
              borderRadius: 4,
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography fontWeight="bold">Total Task by Status</Typography>
              <Box
                display="flex"
                gap={1}
                alignItems="center"
                component={Link}
                to="/task"
                sx={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Typography>View All Tasks</Typography>
                <SvgColor color="blue.700" width={15} src="/assets/icons/ic-chevron-right.svg" />
              </Box>
            </Stack>
            <Stack direction="row" gap={2} mt={2}>
              {totalTaskByStatus?.status?.map((item, index) => {
                const renderedColors = () => {
                  switch (index) {
                    case 0:
                      return {
                        background: 'linear-gradient(to right bottom, #FFE9D5, #FFAC82)',
                        color: 'error.darker',
                      };
                    case 1:
                      return {
                        background: 'linear-gradient(to right bottom, #FFF5CC, #FFD666)',
                        color: 'warning.darker',
                      };

                    default:
                      return {
                        background: 'linear-gradient(to right bottom,  #C8FAD6, #5BE49B)',
                        color: 'primary.darker',
                      };
                  }
                };

                const getKey = Object.keys as <T extends object>(obj: T) => Array<keyof T>;
                const label = getKey(item).toString();

                return (
                  <Box
                    position="relative"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                      borderRadius: 2,
                      background: renderedColors().background,
                      padding: 2,
                      width: '100%',
                      color: renderedColors().color,
                    }}
                  >
                    <Typography textTransform="capitalize">{label.replaceAll('_', '-')}</Typography>
                    <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
                      <Typography variant="h4">{item[`${getKey(item)}`]}</Typography>
                      <Typography>Tasks</Typography>
                    </Box>
                    <Box
                      component="img"
                      src="/assets/background/shape-square.png"
                      sx={{ position: 'absolute', top: 2, left: 2 }}
                    />
                  </Box>
                );
              })}
              <Stack width="20%" flex="none" direction="column" gap={1}>
                <Box
                  position="relative"
                  sx={{
                    borderRadius: 2,
                    background: 'linear-gradient(to right bottom,  #CCDEE5, #80ADBF)',
                    paddingX: 2,
                    paddingY: 1,
                    width: '100%',
                    color: '#005B7F',
                  }}
                  justifyContent="center"
                >
                  <Box display="flex" alignItems="center" gap={1} justifyContent="center">
                    <Typography variant="h4" fontSize="14">
                      2
                    </Typography>
                    <Typography>
                      tasks are <strong>on-hold</strong>
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
                    borderRadius: 2,
                    background: 'linear-gradient(to right bottom,  #CCDEE5, #80ADBF)',
                    paddingX: 2,
                    paddingY: 1,
                    width: '100%',
                    color: '#005B7F',
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1} justifyContent="center">
                    <Typography variant="h4" fontSize="14">
                      12
                    </Typography>
                    <Typography>
                      tasks are <strong>cancelled</strong>
                    </Typography>
                  </Box>
                  <Box
                    component="img"
                    src="/assets/background/shape-square.png"
                    sx={{ position: 'absolute', top: 2, left: 2 }}
                  />
                </Box>
              </Stack>
            </Stack>
          </Card>
        </Grid>
        <Grid xs={12} md={12} lg={12}>
          <DataTable
            withPagination={false}
            withViewAll
            viewAllHref="/task"
            columns={columns()}
            {...getDataTableProps()}
            data={incompleteTask?.items?.slice(0, 5)}
          />
        </Grid>
        <Grid xs={12} md={12} lg={12}>
          <TotalTaskCompletedChart
            chart={{
              categories: months,
              series: [
                {
                  name: 'Tes',
                  data: totalTaskCompleted
                    ?.sort(
                      (a, b) =>
                        months.indexOf(Object.keys(a).toString()) -
                        months.indexOf(Object.keys(b).toString())
                    )
                    .map((item) => Object.values(item)[0]),
                },
              ],
              colors: ['#005B7F', '#FFE700', '#2CD9C5'],
              // series:
            }}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
