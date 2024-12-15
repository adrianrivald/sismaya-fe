import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Box, Button } from '@mui/material';

import { _tasks, _posts, _timeline, _users, _projects } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { useNavigate } from 'react-router-dom';
import { _clientComp } from '../sample/data';
import { Table } from '../sample/table/table';

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

const columns = [
  { id: 'name', label: 'Name' },
  { id: 'desc', label: 'Description' },
  { id: 'picture', label: 'Picture' },
  { id: 'division', label: 'Division' },
  { id: '', label: 'Action' },
];

export function ClientCompanyView() {
  const navigate = useNavigate();
  const onClickAddNew = () => {
    navigate('/client-company/create');
  };
  return (
    <DashboardContent maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
            Client Company
          </Typography>
          <Box display="flex" gap={2} sx={{ mb: { xs: 3, md: 5 } }}>
            <Typography>Master Data</Typography>
            <Typography color="grey.500">•</Typography>
            <Typography color="grey.500">Client Company</Typography>
          </Box>
        </Box>
        <Box>
          <Button onClick={onClickAddNew} variant="contained" color="primary">
            Create New Client Company
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid xs={12}>
          <Table columns={columns} data={_clientComp} />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
