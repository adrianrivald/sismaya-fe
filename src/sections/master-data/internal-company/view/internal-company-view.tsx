import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Box, Button } from '@mui/material';

import { _tasks, _posts, _timeline, _users, _projects } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'src/components/table/data-tables';
import { createColumnHelper } from '@tanstack/react-table';
import { useInternalCompanyList } from 'src/services/master-data/internal-company/use-internal-company';
import { Table } from '../sample/table/table';
import { _internalComp } from '../sample/data';

export type ProjectProps = {
  id: string;
  requestId: string;
  requester: string;
  category: string;
  deadline: string;
  status: string;
  priority: string;
};

// ----------------------------------------------------------------------

// const columnHelper = createColumnHelper<any>();

// const columns = [
//   columnHelper.accessor('package_name', {
//     header: 'Label',
//   }),

//   columnHelper.accessor('package_coin_value', {
//     header: 'Nominal',
//   }),

//   columnHelper.accessor('bonus_coin', {
//     header: 'Bonus',
//   }),
//   columnHelper.accessor('package_price', {
//     header: 'Harga Normal',
//   }),
// ];

const columns = [
  { id: 'name', label: 'Name' },
  { id: 'desc', label: 'Description' },
  { id: 'picture', label: 'Picture' },
  { id: 'status', label: 'Status' },
  { id: 'category', label: 'Category' },
  { id: 'product', label: 'Product' },
  { id: '', label: 'Action' },
];

export function InternalCompanyView() {
  const { isEmpty, getDataTableProps } = useInternalCompanyList({}, false);
  // console.log(getDataTableProps(), 'get data table props');
  const navigate = useNavigate();
  const onClickAddNew = () => {
    navigate('/internal-company/create');
  };

  return (
    <DashboardContent maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
            Internal Company
          </Typography>
          <Box display="flex" gap={2} sx={{ mb: { xs: 3, md: 5 } }}>
            <Typography>Master Data</Typography>
            <Typography color="grey.500">•</Typography>
            <Typography color="grey.500">Internal Company</Typography>
          </Box>
        </Box>
        <Box>
          <Button onClick={onClickAddNew} variant="contained" color="primary">
            Create New Internal Company
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid xs={12}>
          {/* <DataTable columns={columns} {...getDataTableProps()} /> */}
          <Table columns={columns} data={_internalComp} />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
