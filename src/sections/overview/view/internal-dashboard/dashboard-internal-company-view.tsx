import React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Box, Button, Card, MenuItem, Select, type SelectChangeEvent, Stack } from '@mui/material';
import dayjs from 'dayjs';

import {
  useInternalTotalRequestByCompany,
  usePendingRequestInternal,
  useTotalRequestOvertimeInternal,
  useRequestDueInternal,
  useInternalTotalRequestByState,
  useUnresolvedCitoInternal,
  useInternalTopRequester,
  useInternalTopStaff,
} from 'src/services/dashboard';
import { SvgColor } from 'src/components/svg-color';
import { createColumnHelper } from '@tanstack/react-table';
import { DashboardContent } from 'src/layouts/dashboard';
import { DataTable } from 'src/components/table/data-tables';
import type { UnresolvedCito } from 'src/services/dashboard/types';
import { TotalRequestOvertimeChart } from '../../total-request-overtime-chart';
import { RequestDueChart } from '../../request-due-chart';
import { RequestSuccessRate } from '../../request-success-rate';
import { TopRequesterChart } from '../../top-requester-chart';
import { TopStaffChart } from '../../top-staff-chart';

const columnHelper = createColumnHelper<UnresolvedCito>();

const columns = () => [
  columnHelper.accessor('id', {
    header: 'ID',
  }),
  columnHelper.accessor('category', {
    header: 'Category',
  }),

  columnHelper.accessor('requester', {
    header: 'Requester',
  }),

  columnHelper.accessor('created_at', {
    header: 'Created',
    cell: (info) => {
      const value = info.getValue();
      const createdAt = dayjs(value).format('DD MMM YYYY hh:mm:ss');
      return createdAt;
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

export function DashboardInternalCompanyView({
  idCompany,
  vendor,
}: {
  idCompany: number;
  vendor: string;
}) {
  const [dateFrom, setDateFrom] = React.useState<string>('2024-12-25');
  const [dateFromTopRequester, setDateFromTopRequester] = React.useState<string>('2024-12-25');
  const [dateFromTopStaff, setDateFromTopStaff] = React.useState<string>('2024-12-25');
  const [requestDueDate, setRequestDueDate] = React.useState<string>('2024-12-25');
  const [requestState, setRequestState] = React.useState<'priority' | 'status'>('priority');
  const [staffState, setStaffState] = React.useState<'quantity' | 'hour'>('quantity');
  const { getDataTableProps, data } = useUnresolvedCitoInternal({}, idCompany);
  const dateNow = dayjs().format('YYYY-MM-DD');
  const { data: internalTotalRequest } = useInternalTotalRequestByCompany(
    idCompany,
    dateFrom,
    dateNow
  );
  const { data: internalTotalRequestByState } = useInternalTotalRequestByState(
    idCompany,
    dateFrom,
    dateNow
  );
  const { data: pendingRequest } = usePendingRequestInternal(idCompany);
  const { data: totalRequestOvertime } = useTotalRequestOvertimeInternal(idCompany);
  const { data: requestDue } = useRequestDueInternal(idCompany, requestDueDate);
  const { data: topRequester } = useInternalTopRequester(idCompany, dateFromTopRequester, dateNow);
  const { data: topStaff } = useInternalTopStaff(idCompany, dateFromTopStaff, dateNow);
  console.log(topStaff, 'topStaff ');

  // const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  //   width: 62,
  //   height: 34,
  //   padding: 7,
  //   '& .MuiSwitch-switchBase': {
  //     margin: 1,
  //     padding: 0,
  //     transform: 'translateX(6px)',
  //     '&.Mui-checked': {
  //       color: '#fff',
  //       transform: 'translateX(22px)',
  //       '& .MuiSwitch-thumb:before': {
  //         backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
  //           '#fff'
  //         )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
  //       },
  //       '& + .MuiSwitch-track': {
  //         opacity: 1,
  //         backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
  //       },
  //     },
  //   },
  //   '& .MuiSwitch-thumb': {
  //     backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
  //     width: 32,
  //     height: 32,
  //     '&::before': {
  //       content: "''",
  //       position: 'absolute',
  //       width: '100%',
  //       height: '100%',
  //       left: 0,
  //       top: 0,
  //       backgroundRepeat: 'no-repeat',
  //       backgroundPosition: 'center',
  //       backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
  //         '#fff'
  //       )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
  //     },
  //   },
  //   '& .MuiSwitch-track': {
  //     opacity: 1,
  //     backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
  //     borderRadius: 20 / 2,
  //   },
  // }));

  const handleChangeRequestState = (state: 'priority' | 'status') => {
    setRequestState(state);
  };

  const handleChangeStaffState = (state: 'quantity' | 'hour') => {
    setStaffState(state);
  };

  const handleChangeDateFilter = (e: SelectChangeEvent<number>) => {
    const filterValue = e.target.value;

    const dateFromValue = dayjs()
      .subtract(filterValue as number, 'day')
      .format('YYYY-MM-DD');
    setDateFrom(dateFromValue);
  };

  const handleChangeRequestDueDateFilter = (e: SelectChangeEvent<string>) => {
    const filterValue = e.target.value;

    setRequestDueDate(filterValue);
  };

  const handleChangeDateTopRequesterFilter = (e: SelectChangeEvent<number>) => {
    const filterValue = e.target.value;

    const dateFromValue = dayjs()
      .subtract(filterValue as number, 'day')
      .format('YYYY-MM-DD');
    setDateFromTopRequester(dateFromValue);
  };

  const handleChangeDateTopStaffFilter = (e: SelectChangeEvent<number>) => {
    const filterValue = e.target.value;

    const dateFromValue = dayjs()
      .subtract(filterValue as number, 'day')
      .format('YYYY-MM-DD');
    setDateFromTopStaff(dateFromValue);
  };

  return (
    <DashboardContent maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
            {vendor.toUpperCase()} Dashboard
          </Typography>
        </Box>
      </Box>
      {(pendingRequest?.pending_request ?? 0) > 0 && (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            backgroundColor: 'warning.200',
            p: 3,
            borderRadius: 2,
            mb: 2,
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <SvgColor color="#FFC107" src="/assets/icons/ic-alert.svg" />
            <Typography color="warning.600">
              {pendingRequest?.pending_request} requests haven&apos;t been approved
            </Typography>
          </Box>
          <Button
            sx={{
              borderWidth: 1,
              borderStyle: 'solid',
              color: 'warning.600',
              borderColor: 'warning.600',
            }}
          >
            View Requests
          </Button>
        </Box>
      )}

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
                  onChange={handleChangeDateFilter}
                  defaultValue={7}
                  sx={{
                    fontWeight: 'bold',
                    height: 40,
                    paddingY: 0.5,
                    paddingX: 1,
                    ml: 1,
                    borderWidth: 1,
                    borderStyle: 'solid',
                    borderColor: 'grey.175',
                    borderRadius: 1.5,
                    width: 'max-content',
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 0,
                    },
                    '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                  }}
                >
                  <MenuItem value={0}>Today</MenuItem>
                  <MenuItem defaultChecked value={7}>
                    Last 7 days
                  </MenuItem>
                  <MenuItem value={30}>Last 30 days</MenuItem>
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
                    {internalTotalRequest?.total_request}
                  </Typography>
                  <Box display="flex" gap={1} alignItems="center">
                    <SvgColor src="/assets/icons/ic-grow.svg" />
                    <Typography fontSize={14} sx={{ color: 'mint.500' }}>
                      {internalTotalRequest?.percentage}%
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
                      <Box
                        onClick={() => handleChangeRequestState('priority')}
                        sx={{
                          cursor: 'pointer',
                          backgroundColor: requestState === 'priority' ? 'common.white' : '',
                          padding: 1,
                          borderRadius: 1,
                        }}
                      >
                        <Typography>Priority</Typography>
                      </Box>
                      <Box
                        onClick={() => handleChangeRequestState('status')}
                        sx={{
                          cursor: 'pointer',
                          backgroundColor: requestState === 'status' ? 'common.white' : '',
                          padding: 1,
                          borderRadius: 1,
                        }}
                      >
                        <Typography>Status</Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Stack direction="row" gap={2} mt={2}>
                    {internalTotalRequestByState?.[requestState]
                      ?.map((item, index) => {
                        const getKey = Object.keys as <T extends object>(obj: T) => Array<keyof T>;
                        const renderedBackground = () => {
                          if (requestState === 'priority') {
                            switch (getKey(item)[0]) {
                              case 'high':
                                return 'linear-gradient(to right bottom, #FFE9D5, #FFAC82)';
                              case 'medium':
                                return 'linear-gradient(to right bottom, #FFF5CC, #FFD666)';
                              case 'low':
                                return 'linear-gradient(to right bottom,  #C8FAD6, #5BE49B)';
                              default:
                                return '';
                            }
                          } else {
                            switch (getKey(item)[0]) {
                              case 'to_do':
                                return 'linear-gradient(to right bottom, #FFE9D5, #FFAC82)';
                              case 'in_progress':
                                return 'linear-gradient(to right bottom, #FFF5CC, #FFD666)';
                              case 'done':
                                return 'linear-gradient(to right bottom,  #C8FAD6, #5BE49B)';
                              default:
                                return '';
                            }
                          }
                        };
                        console.log(getKey(item)[0], 'item');
                        return (
                          <Box
                            position="relative"
                            sx={{
                              borderRadius: 2,
                              background: renderedBackground(),
                              padding: 2,
                              width: '100%',
                              color: 'error.darker',
                            }}
                          >
                            <Typography textTransform="capitalize">{getKey(item)}</Typography>
                            <Typography mt={2} variant="h4">
                              {item[`${getKey(item)}`]}
                            </Typography>
                            <Typography fontSize={12}>Requests</Typography>
                            <Box
                              component="img"
                              src="/assets/background/shape-square.png"
                              sx={{ position: 'absolute', top: 2, left: 2 }}
                            />
                          </Box>
                        );
                      })
                      .reverse()}
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
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <SvgColor width={20} color="error.light" src="/assets/icons/ic-alert-rounded.svg" />
                <Typography>{data?.items?.length} Unresolved CITO Requests</Typography>
              </Box>
              <DataTable
                withPagination={false}
                withViewAll
                viewAllHref="/unresolved-cito"
                columns={columns()}
                {...getDataTableProps()}
                data={data?.items?.slice(0, 5)}
              />
            </Card>
            <TotalRequestOvertimeChart
              sx={{ mt: 2 }}
              title="Total Requests Over Time"
              chart={{
                categories: totalRequestOvertime?.map((item) => item?.date),
                series: [
                  {
                    name: 'Team A',
                    data: totalRequestOvertime?.map((item) => item?.request_count) ?? [],
                  },
                  // { name: 'Team B', data: [51, 70, 47, 67, 40, 37, 24, 70, 24] },
                ],
              }}
            />
            <TopRequesterChart
              title="Top 5 Requester"
              chart={{
                categories: topRequester?.map((item) => item?.company_name),
                series: [
                  { name: 'Request', data: topRequester?.map((item) => item?.request_count) ?? [] },
                ],
                colors: ['#2CD9C5'],
              }}
              sx={{ mt: 2 }}
              handleChangeDate={handleChangeDateTopRequesterFilter}
            />
            <TopStaffChart
              title="Top 5 Staff"
              chart={{
                categories: topStaff?.map((item) => item?.staff_name),
                series: [{ name: 'Task', data: topStaff?.map((item) => item?.task_count) ?? [] }],
                colors: ['#FF6C40'],
              }}
              sx={{ mt: 2 }}
              handleChangeDate={handleChangeDateTopStaffFilter}
              handleChangeStaffState={handleChangeStaffState}
              staffState={staffState}
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
                  onChange={handleChangeRequestDueDateFilter}
                  defaultValue="today"
                  sx={{
                    fontWeight: 'bold',
                    height: 40,
                    paddingY: 0.5,
                    paddingX: 1,
                    ml: 1,
                    borderWidth: 1,
                    borderStyle: 'solid',
                    borderColor: 'grey.175',
                    borderRadius: 1.5,
                    width: 'max-content',
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 0,
                    },
                    '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                  }}
                >
                  <MenuItem defaultChecked value="today">
                    Today
                  </MenuItem>
                  <MenuItem value="this-week">This week</MenuItem>
                  <MenuItem value="this-month">This month</MenuItem>
                </Select>
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                flexDirection="row"
                alignItems="center"
              >
                <Box flex="none">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography fontSize={24} fontWeight="bold">
                      {requestDue?.resolved}
                    </Typography>
                    <Typography color="grey.600">Requests</Typography>
                  </Box>
                  {(requestDue?.unresolved ?? 0) > 0 && (
                    <Box display="flex" alignItems="center" gap={1} mt={2}>
                      <SvgColor
                        width={20}
                        color="#FFC107"
                        src="/assets/icons/ic-alert-rounded.svg"
                      />

                      <Typography
                        color="warning.dark"
                        sx={{
                          textDecoration: 'underline',
                          fontSize: '12px',
                        }}
                      >
                        {requestDue?.unresolved} unresolved requests
                      </Typography>
                    </Box>
                  )}
                </Box>

                <RequestDueChart value={requestDue?.resolved_percentage ?? 0} />
              </Box>
            </Box>
            <Box
              sx={{
                mt: 2,
                pt: 3,
                position: 'relative',
                backgroundColor: 'common.white',
                borderRadius: 2,
              }}
              display="flex"
              justifyContent="center"
              flexDirection="column"
              alignItems="center"
            >
              <Typography fontSize="36px" fontWeight="bold" sx={{ mb: 2 }}>
                56
              </Typography>
              <Typography>Average Handling Time</Typography>
              <Box display="flex" alignItems="center" gap={1} mt={3}>
                <SvgColor color="error.dark" src="/assets/icons/ic-grow.svg" />
                <Typography>
                  <Typography color="error.dark" component="span">
                    8 minutes
                  </Typography>{' '}
                  than last month
                </Typography>
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                sx={{
                  mt: 2,
                  width: '100%',
                  borderStyle: 'solid',
                  borderTopWidth: 1,
                  borderBottomWidth: 0,
                  borderLeftWidth: 0,
                  borderRightWidth: 0,
                  borderColor: 'grey.200',
                }}
              >
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  flexDirection="column"
                  sx={{
                    p: 3,
                    width: '50%',
                    borderStyle: 'solid',
                    borderRightWidth: 1,
                    borderBottomWidth: 0,
                    borderLeftWidth: 0,
                    borderTopWidth: 0,
                    borderColor: 'grey.200',
                  }}
                >
                  <Typography color="grey.600" fontSize="12px" textAlign="center">
                    First Response Time
                  </Typography>
                  <Typography color="blue.700" fontSize="24px" fontWeight="bold" textAlign="center">
                    1h 30m
                  </Typography>
                </Box>

                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  flexDirection="column"
                  sx={{
                    p: 3,
                    width: '50%',
                  }}
                >
                  <Typography color="grey.600" fontSize="12px" textAlign="center">
                    Next Response Time
                  </Typography>
                  <Typography color="blue.700" fontSize="24px" fontWeight="bold" textAlign="center">
                    45m
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
