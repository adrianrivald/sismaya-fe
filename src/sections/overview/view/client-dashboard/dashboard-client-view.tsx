import React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Box, Card, CardHeader, MenuItem, Select, Stack } from '@mui/material';

import { SvgColor } from 'src/components/svg-color';
import { createColumnHelper } from '@tanstack/react-table';
import { Request } from 'src/services/request/types';
import { useRequestList } from 'src/services/request';
import { DashboardContent } from 'src/layouts/dashboard';

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
                  <Typography>than previous 7 days</Typography>
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
                    <Box>tes</Box>
                  </Box>
                </Card>
              </Stack>
            </Stack>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={4} spacing={2}>
          <Card>Tes</Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
