import React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import {
  Box,
  Button,
  Card,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Stack,
  styled,
  Switch,
} from '@mui/material';
import dayjs from 'dayjs';

import {
  useClientTotalRequest,
  useClientTotalRequestByState,
  usePendingRequest,
  useRequestDeliveryRate,
  useRequestDue,
  useTotalRequestOvertime,
  useUnresolvedCito,
} from 'src/services/dashboard';
import { SvgColor } from 'src/components/svg-color';
import { createColumnHelper } from '@tanstack/react-table';
import { DashboardContent } from 'src/layouts/dashboard';
import { DataTable } from 'src/components/table/data-tables';
import { UnresolvedCito } from 'src/services/dashboard/types';
import { TotalRequestOvertimeChart } from '../../total-request-overtime-chart';
import { RequestDueChart } from '../../request-due-chart';
import { RequestSuccessRate } from '../../request-success-rate';

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

export function DashboardClientView() {
  const [dateFrom, setDateFrom] = React.useState<string>('2024-12-25');
  const [requestDueDate, setRequestDueDate] = React.useState<string>('2024-12-25');
  const [requestState, setRequestState] = React.useState<'priority' | 'status'>('priority');
  const { getDataTableProps, data } = useUnresolvedCito({});
  const dateNow = dayjs().format('YYYY-MM-DD');
  const { data: clientTotalRequest } = useClientTotalRequest(dateFrom, dateNow);
  const { data: clientTotalRequestByState } = useClientTotalRequestByState(dateFrom, dateNow);
  const { data: pendingRequest } = usePendingRequest();
  const { data: totalRequestOvertime } = useTotalRequestOvertime();
  const { data: requestDue } = useRequestDue(requestDueDate);
  const { data: requestDeliveryRate } = useRequestDeliveryRate();
  const requestDeliveryRateValues = Object.entries(requestDeliveryRate).map(
    (entry) => entry[1] as number
  );
  const handleChangeRequestState = (state: 'priority' | 'status') => {
    setRequestState(state);
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

  const arrRequestByState =
    clientTotalRequestByState?.[requestState]?.map((item, index) => {
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
      const label = getKey(item).toString();
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
          <Typography textTransform="capitalize">{label.replaceAll('_', '-')}</Typography>
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
    }) ?? [];

  return (
    <DashboardContent maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
            Dashboard
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
                    {clientTotalRequest?.total_request}
                  </Typography>
                  <Box display="flex" gap={1} alignItems="center">
                    <SvgColor src="/assets/icons/ic-grow.svg" />
                    <Typography fontSize={14} sx={{ color: 'mint.500' }}>
                      {clientTotalRequest?.percentage}%
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
                    {requestState === 'priority' ? arrRequestByState.reverse() : arrRequestByState}
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
                p: 3,
                position: 'relative',
                backgroundColor: 'common.white',
                borderRadius: 2,
              }}
            >
              <Typography sx={{ mb: 4 }}>Requests Delivery Success Rate</Typography>
              <RequestSuccessRate value={requestDeliveryRateValues} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
