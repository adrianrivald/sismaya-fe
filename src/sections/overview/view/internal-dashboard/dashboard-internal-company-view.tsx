import React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Box, Button, Card, MenuItem, Select, type SelectChangeEvent, Stack } from '@mui/material';
import dayjs from 'dayjs';
import { parseDuration } from 'src/utils/format-duration';
import {
  useInternalTotalRequestByCompany,
  usePendingRequestInternal,
  useTotalRequestOvertimeInternal,
  useRequestDueInternal,
  useInternalTotalRequestByState,
  useUnresolvedCitoInternal,
  useInternalTopRequester,
  useInternalTopStaff,
  useInternalTopStaffbyHour,
  useRequestHandlingTime,
  useHappinessRating,
  useRequestFeedbacksAll,
} from 'src/services/dashboard';
import { SvgColor } from 'src/components/svg-color';
import { createColumnHelper } from '@tanstack/react-table';
import { DashboardContent } from 'src/layouts/dashboard';
import { DataTable } from 'src/components/table/data-tables';
import type { UnresolvedCito } from 'src/services/dashboard/types';
import { Link, useNavigate } from 'react-router-dom';
import { TotalRequestOvertimeChart } from '../../total-request-overtime-chart';
import { RequestDueChart } from '../../request-due-chart';
import { TopRequesterChart } from '../../top-requester-chart';
import { TopStaffChart } from '../../top-staff-chart';
import { HappinessRatingChart } from '../../happiness-rating-chart';

const columnHelper = createColumnHelper<UnresolvedCito>();

const columns = () => [
  columnHelper.accessor('id', {
    header: 'ID',
  }),
  columnHelper.accessor('category.name', {
    header: 'Category',
  }),

  columnHelper.accessor('requester.name', {
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
    cell: (info) => '-',
  }),
];

export function DashboardInternalCompanyView({
  idCompany,
  vendor,
}: {
  idCompany: number;
  vendor: string;
}) {
  const navigate = useNavigate();
  const [dateFrom, setDateFrom] = React.useState<string>(
    dayjs()
      .subtract(7 as number, 'day')
      .format('YYYY-MM-DD')
  );
  const [dateFromTopRequester, setDateFromTopRequester] = React.useState<string>(
    dayjs()
      .subtract(7 as number, 'day')
      .format('YYYY-MM-DD')
  );
  const [dateFromTopStaff, setDateFromTopStaff] = React.useState<string>(
    dayjs()
      .subtract(7 as number, 'day')
      .format('YYYY-MM-DD')
  );
  const [requestDueDate, setRequestDueDate] = React.useState<string>(
    dayjs()
      .subtract(7 as number, 'day')
      .format('YYYY-MM-DD')
  );
  const [requestState, setRequestState] = React.useState<'priority' | 'status'>('priority');
  const [staffState, setStaffState] = React.useState<'quantity' | 'hour'>('quantity');
  const [dateFilter, setDateFilter] = React.useState(7);
  const dateNow = dayjs().format('YYYY-MM-DD');
  const { getDataTableProps, data } = useUnresolvedCitoInternal({
    from: dateFrom,
    to: dateNow,
    internalCompanyId: idCompany,
  });
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
  const { data: totalRequestOvertime } = useTotalRequestOvertimeInternal(
    idCompany,
    dateFrom,
    dateNow
  );
  const { data: requestDue } = useRequestDueInternal(idCompany, requestDueDate);
  const { data: topRequester } = useInternalTopRequester(idCompany, dateFromTopRequester, dateNow);
  const { data: topStaff } = useInternalTopStaff(idCompany, dateFromTopStaff, dateNow);
  const { data: topStaffbyHour } = useInternalTopStaffbyHour(idCompany, dateFromTopStaff, dateNow);
  const { data: requestHandlingTime } = useRequestHandlingTime(idCompany, dateFrom, dateNow);
  const { data: happinessRating } = useHappinessRating(idCompany, dateFrom, dateNow);
  const { data: requestFeedbacks } = useRequestFeedbacksAll(idCompany);

  // eslint-disable-next-line no-unsafe-optional-chaining
  const happinessRatingPercentage = (happinessRating?.summary / 5) * 100;

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
    setDateFilter(Number(filterValue));
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

  const arrRequestByState =
    internalTotalRequestByState?.[requestState]?.map((item, index) => {
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

  const renderDateFilter = () => {
    switch (dateFilter) {
      case 0:
        return {
          label: 'Today',
          value: 'day',
        };
      case 7:
        return {
          label: '7',
          value: 'week',
        };
      case 30:
        return {
          label: '30',
          value: 'year',
        };

      default:
        return {
          label: '',
          value: '',
        };
    }
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
            onClick={() => navigate(`/${vendor}/request/pending`)}
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
                  <Typography fontSize={12}>
                    {dateFilter !== 0
                      ? `for the last ${renderDateFilter().label} days`
                      : `Today`}{' '}
                  </Typography>
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
                    {dateFilter !== 0
                      ? `than previous ${renderDateFilter().label} days`
                      : `than yesterday`}
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
                viewAllHref={`/${vendor}/request/unresolved-cito?from=${dateFrom}&to=${dateNow}`}
                columns={columns()}
                {...getDataTableProps()}
                data={data?.items?.slice(0, 5)}
              />
            </Card>
            <TotalRequestOvertimeChart
              sx={{ mt: 2 }}
              title="Total Requests Over Time"
              chart={{
                categories: totalRequestOvertime?.map((item) => dayjs(item?.date).format('ddd')),
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
                categories:
                  staffState === 'quantity'
                    ? topStaff?.map((item) => item?.staff_name)
                    : topStaffbyHour?.map((item) => item?.staff_name),
                series: [
                  {
                    name: 'Task',
                    data:
                      staffState === 'quantity'
                        ? (topStaff?.map((item) => item?.task_count) ?? [])
                        : (topStaffbyHour?.map((item) => item?.task_count) ?? []),
                  },
                ],
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
              <Typography sx={{ mb: 2 }}>Average Handling Time</Typography>
              {requestHandlingTime?.is_empty === false ? (
                <>
                  <Typography
                    fontSize="36px"
                    fontWeight="bold"
                    color={
                      requestHandlingTime?.realization === 'faster'
                        ? 'success.main'
                        : requestHandlingTime?.realization === 'slower'
                          ? 'error.dark'
                          : ''
                    }
                  >
                    {requestHandlingTime?.average} {requestHandlingTime?.realization}
                  </Typography>
                  {requestHandlingTime?.realization !== '' ? (
                    <Typography color="grey.600">than expectation</Typography>
                  ) : null}
                  <Box display="flex" alignItems="center" gap={1} mt={3}>
                    <SvgColor
                      color={
                        requestHandlingTime?.comparison_last_month.startsWith('-')
                          ? 'error.dark'
                          : 'success.main'
                      }
                      src={
                        requestHandlingTime?.comparison_last_month.startsWith('-')
                          ? '/assets/icons/ic-trend-down.svg'
                          : '/assets/icons/ic-grow.svg'
                      }
                    />
                    <Typography>
                      <Typography
                        color={
                          requestHandlingTime?.comparison_last_month.startsWith('-')
                            ? 'error.dark'
                            : 'success.main'
                        }
                        component="span"
                      >
                        {parseDuration(requestHandlingTime?.comparison_last_month)}
                      </Typography>{' '}
                      <Typography component="span" color="grey.600">
                        than last month
                      </Typography>
                    </Typography>
                  </Box>
                </>
              ) : (
                <Box display="flex" justifyContent="center" p={4}>
                  <Typography color="grey.500" fontWeight="bold">
                    No Data yet
                  </Typography>
                </Box>
              )}

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
                  alignItems="start"
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
                  {requestHandlingTime?.is_empty === false ? (
                    <Typography
                      color="blue.700"
                      fontSize="24px"
                      fontWeight="bold"
                      textAlign="center"
                    >
                      1h 30m
                    </Typography>
                  ) : (
                    <Typography color="grey.500" fontWeight="bold" mt={2}>
                      No Data yet
                    </Typography>
                  )}
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
                  {requestHandlingTime?.is_empty === false ? (
                    <Typography
                      color="blue.700"
                      fontSize="24px"
                      fontWeight="bold"
                      textAlign="center"
                    >
                      45m
                    </Typography>
                  ) : (
                    <Typography color="grey.500" fontWeight="bold" mt={2}>
                      No Data yet
                    </Typography>
                  )}
                </Box>
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
              display="flex"
              justifyContent="center"
              flexDirection="column"
              alignItems="center"
            >
              <Typography fontSize="18px" fontWeight="600" variant="h6">
                Happiness Rating
              </Typography>
              <HappinessRatingChart
                ratingSummary={happinessRating?.summary}
                value={happinessRatingPercentage}
              />
              <Box textAlign="center">
                <Typography color="grey.500" fontSize={12}>
                  Based on
                </Typography>
                <Typography
                  component={Link}
                  to={`/${vendor}/request/feedback`}
                  color="blue.700"
                  fontSize={12}
                  sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                >
                  {requestFeedbacks?.meta?.total_data} performance evaluation feedbacks
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
