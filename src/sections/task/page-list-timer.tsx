import {
  Stack,
  Box,
  Typography,
  TableCell,
  InputAdornment,
  MenuItem,
  TextField,
} from '@mui/material';
import { createColumnHelper } from '@tanstack/react-table';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Iconify } from 'src/components/iconify';
import { DataTable } from 'src/components/table/data-tables';
import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import products from 'src/pages/products';
import { useAssigneeCompanyId, useTaskDetail } from 'src/services/task/task-management';
import { fDate, formatSecondToHMS } from 'src/utils/format-time';
import { useSearchDebounce } from 'src/utils/hooks/use-debounce';
import { usePaginationQuery } from 'src/utils/hooks/use-pagination-query';
import { http } from 'src/utils/http';

export function useTimerList(taskId: number, search: string, user_id?: any) {
  return usePaginationQuery<any>(
    ['timer', 'table', taskId, search, user_id],
    async (paginationState) => {
      const response = await http('/tasks/get-all-timer', {
        params: {
          page: paginationState.pageIndex + 1,
          page_size: paginationState.pageSize,
          task_id: taskId,
          search: search || '',
          user_id: user_id || '',
        },
      });

      return {
        ...response,
        data: response.data.map((item: any) => item),
      };
    }
  );
}

const columnHelper = createColumnHelper<any>();

const columns = [
  columnHelper.accessor('created_at', {
    header: 'Date',
    cell: (info) => {
      const created_at = info.getValue();

      return (
        <div data-testid="td" key={info.getValue()}>
          {fDate(created_at, 'DD-MM-YYYY')}
        </div>
      );
    },
  }),
  columnHelper.accessor('creator.name', {
    header: 'User',
  }),
  columnHelper.accessor('name', {
    header: 'Activity',
  }),

  columnHelper.accessor('started_at', {
    header: 'Start Time',
    cell: (info) => {
      const created_at = info.getValue();

      return (
        <div data-testid="td" key={info.getValue()}>
          {fDate(created_at, 'HH:mm:ss')}
        </div>
      );
    },
  }),
  columnHelper.accessor('ended_at', {
    header: 'End Time',
    cell: (info) => {
      const created_at = info.getValue();

      return (
        <div data-testid="td" key={info.getValue()}>
          {fDate(created_at, 'HH:mm:ss')}
        </div>
      );
    },
  }),
  columnHelper.accessor('is_pause', {
    header: 'Type',
    cell: (info) => {
      const is_pause = info.getValue();

      return (
        <div data-testid="td" key={info.getValue()}>
          {is_pause ? 'Paused' : 'Stopped'}
        </div>
      );
    },
  }),
  columnHelper.accessor('duration', {
    header: 'Duration',
    cell: (info) => {
      const priority = info.getValue();

      return (
        <div data-testid="td" key={info.getValue()}>
          {formatSecondToHMS(priority)}
        </div>
      );
    },
  }),
];

export default function PageListTimer() {
  const { taskId } = useParams();
  const assigneeCompanyId = useAssigneeCompanyId();
  const [search, setSearch] = useSearchDebounce();
  const [searchParams, setSearchParams] = useSearchParams();
  const { getDataTableProps, refetch } = useTimerList(
    Number(taskId),
    searchParams.get('search') || '',
    searchParams.get('user_id') === 'all' ? '' : searchParams.get('user_id') || ''
  );
  const { data } = useTaskDetail(Number(taskId), assigneeCompanyId);

  useEffect(() => {
    if (search) {
      setSearchParams({ search }, { replace: true });
      refetch();
    } else {
      refetch();
    }
  }, [search, setSearchParams, refetch]);

  // const { task, request } = data;
  const title = data?.task?.name;

  return (
    <DashboardContent maxWidth="xl">
      <Helmet>
        <title>Task Management - {CONFIG.appName}</title>
      </Helmet>

      <Stack spacing={3}>
        <Box
          component="section"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          aria-label="page header"
        >
          <Stack spacing={1}>
            <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
              Task Management
            </Typography>

            <Box display="flex" gap={2}>
              <Typography component={Link} to="/" sx={{ textDecoration: 'none', color: 'inherit' }}>
                Dashboard
              </Typography>
              <Typography color="grey.500">•</Typography>
              <Typography color="grey.500">Task Management</Typography>
              <Typography color="grey.500">•</Typography>
              <Typography color="grey.500">
                Development for REQ#{data?.request?.id}: {title}
              </Typography>
              <Typography color="grey.500">•</Typography>
              <Typography color="grey.500">Activities</Typography>
            </Box>
          </Stack>
        </Box>
      </Stack>
      <Stack spacing={2.5} sx={{ mt: 5 }}>
        <Stack spacing={3} direction={{ xs: 'column', md: 'row' }} alignItems="center">
          <TextField
            select
            label="User"
            defaultValue="all"
            sx={{ width: { xs: '100%', md: 350 } }}
            value={searchParams.get('user_id') || 'all'}
            onChange={(e) => setSearchParams({ user_id: e.target.value }, { replace: true })}
          >
            <MenuItem value="all">All</MenuItem>
            {data?.task?.assignees?.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            placeholder="Search..."
            sx={{ flexGrow: 1 }}
            defaultValue={searchParams.get('search') || ''}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="solar:magnifer-linear" />
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <DataTable columns={columns} {...getDataTableProps()} />
      </Stack>
    </DashboardContent>
  );
}
