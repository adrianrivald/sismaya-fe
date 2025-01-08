import React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Box, Card, CardHeader, MenuItem, Select, Stack, styled, useTheme } from '@mui/material';

import { SvgColor } from 'src/components/svg-color';
import { createColumnHelper } from '@tanstack/react-table';
import { Request } from 'src/services/request/types';
import { useRequestList } from 'src/services/request';
import { DashboardContent } from 'src/layouts/dashboard';
import { FormControlLabel } from '@mui/material';
import { Switch } from '@mui/material';
import { DataTable } from 'src/components/table/data-tables';
import { AnalyticsWebsiteVisits } from '../../analytics-website-visits';
import { RequestDueChart } from '../../request-due-chart';

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

export function DashboardClientView() {
  const [dateFilter, setDateFilter] = React.useState<string>(null);
  const { isEmpty, getDataTableProps, data } = useRequestList({}, String(29));
  const theme = useTheme();

  const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
      margin: 1,
      padding: 0,
      transform: 'translateX(6px)',
      '&.Mui-checked': {
        color: '#fff',
        transform: 'translateX(22px)',
        '& .MuiSwitch-thumb:before': {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
            '#fff'
          )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
        },
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        },
      },
    },
    '& .MuiSwitch-thumb': {
      backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
      width: 32,
      height: 32,
      '&::before': {
        content: "''",
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff'
        )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
      },
    },
    '& .MuiSwitch-track': {
      opacity: 1,
      backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      borderRadius: 20 / 2,
    },
  }));

  return (
    <DashboardContent maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
            Dashboard
          </Typography>
        </Box>
        {/* <Box>
          <Button onClick={onClickAddNew} variant="contained" color="primary">
            Create New Request
          </Button>
        </Box> */}
      </Box>

      <Grid container spacing={2}>
        <Grid xs={12} sm={6} md={8} spacing={2}>
          <Card
            sx={{
              p: 3,
              boxShadow: '2',
              position: 'relative',
              backgroundColor: 'common.white',
              borderRadius: 4,
            }}
          >
            <Stack direction="column" gap={2}>
              <Box>
                <Select
                  labelId="date-filter-label"
                  id="date-filter"
                  label="Filter"
                  onChange={() => {}}
                  defaultValue={7}
                >
                  <MenuItem defaultChecked value={7}>
                    Last 7 days
                  </MenuItem>
                  <MenuItem value={14}>Last 14 days</MenuItem>
                </Select>
              </Box>
              <Stack direction="row" gap={2}>
                <Box
                  display="flex"
                  justifyContent="center"
                  flexDirection="column"
                  alignItems="center"
                  width="40%"
                  gap={1}
                  sx={{
                    backgroundColor: 'primary.main',
                    paddingY: 3,
                    paddingX: 6,
                    color: 'common.white',
                    borderRadius: 2,
                  }}
                >
                  <Typography fontSize={14}>Total Request</Typography>
                  <Typography fontSize={12}>for the last 7 days</Typography>
                  <Typography fontSize={36} fontWeight="bold">
                    106
                  </Typography>
                  <Box display="flex" gap={1} alignItems="center">
                    <SvgColor src="/assets/icons/ic-grow.svg" />
                    <Typography fontSize={14} sx={{ color: 'mint.500' }}>
                      2.6%
                    </Typography>
                  </Box>
                  <Typography sx={{ color: '#80ADBF' }} fontSize={14}>
                    than previous 7 days
                  </Typography>
                </Box>
                <Card
                  sx={{
                    width: '100%',
                    p: 3,
                    boxShadow: '2',
                    position: 'relative',
                    backgroundColor: 'common.white',
                    borderRadius: 2,
                  }}
                >
                  <Box display="flex" flexDirection="row" gap={2} alignItems="center">
                    <Typography variant="h5">Total Request</Typography>

                    {/* <FormControlLabel
                      control={<MaterialUISwitch sx={{ m: 1 }} defaultChecked />}
                      label="MUI switch"
                    /> */}
                    <Box
                      display="flex"
                      gap={1}
                      alignItems="center"
                      sx={{ backgroundColor: 'grey.200', padding: 1, borderRadius: 1 }}
                    >
                      <Box sx={{ backgroundColor: 'common.white', padding: 1, borderRadius: 1 }}>
                        <Typography>Priority</Typography>
                      </Box>
                      <Typography>Status</Typography>
                    </Box>
                  </Box>
                  <Stack direction="row" gap={2} mt={2}>
                    <Box
                      position="relative"
                      sx={{
                        borderRadius: 2,
                        background: 'linear-gradient(to right bottom, #FFE9D5, #FFAC82)',
                        padding: 2,
                        width: '100%',
                        color: 'error.darker',
                      }}
                    >
                      <Typography>High</Typography>
                      <Typography mt={2} variant="h4">
                        26
                      </Typography>
                      <Typography fontSize={12}>Requests</Typography>
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
                        background: 'linear-gradient(to right bottom, #FFF5CC, #FFD666)',
                        padding: 2,
                        width: '100%',
                        color: 'warning.darker',
                      }}
                    >
                      <Typography>Medium</Typography>
                      <Typography mt={2} variant="h4">
                        50
                      </Typography>
                      <Typography fontSize={12}>Requests</Typography>
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
                        background: 'linear-gradient(to right bottom,  #C8FAD6, #5BE49B)',
                        padding: 2,
                        width: '100%',
                        color: 'primary.darker',
                      }}
                    >
                      <Typography>Low</Typography>
                      <Typography mt={2} variant="h4">
                        30
                      </Typography>
                      <Typography fontSize={12}>Requests</Typography>
                      <Box
                        component="img"
                        src="/assets/background/shape-square.png"
                        sx={{ position: 'absolute', top: 2, left: 2 }}
                      />
                    </Box>
                  </Stack>
                </Card>
              </Stack>
            </Stack>
            <Card
              sx={{
                mt: 2,
                p: 3,
                boxShadow: '2',
                position: 'relative',
                backgroundColor: 'common.white',
                borderRadius: 4,
              }}
            >
              <DataTable
                withPagination={false}
                columns={columns()}
                {...getDataTableProps()}
                data={data?.items?.slice(0, 5)}
              />
            </Card>
            <AnalyticsWebsiteVisits
              sx={{ mt: 2 }}
              title="Total Requests Over Time"
              chart={{
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                series: [
                  { name: 'Team A', data: [43, 33, 22, 37, 67, 68, 37, 24, 55] },
                  // { name: 'Team B', data: [51, 70, 47, 67, 40, 37, 24, 70, 24] },
                ],
              }}
            />
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={4} spacing={2}>
          <Box
            sx={{
              p: 3,
              position: 'relative',
              backgroundColor: 'grey.200',
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                p: 3,
                position: 'relative',
                backgroundColor: 'common.white',
                borderRadius: 2,
              }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Typography>Request Due</Typography>

                <Select
                  labelId="date-filter-label"
                  id="date-filter"
                  label="Filter"
                  onChange={() => {}}
                  defaultValue="today"
                >
                  <MenuItem defaultChecked value="today">
                    Today
                  </MenuItem>
                  <MenuItem value="yesterday">Yesterday</MenuItem>
                </Select>
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography fontSize={24} fontWeight="bold">
                      8
                    </Typography>
                    <Typography color="grey.600">Requests</Typography>
                  </Box>
                  <Box>
                    <Typography fontStyle="underline" color="warning.dark">
                      2 unresolved requests
                    </Typography>
                  </Box>

                  <RequestDueChart
                    chart={{
                      series: [70],
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
