import { Table } from 'src/components/table/table';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Box, Button } from '@mui/material';

import { _tasks, _posts, _timeline, _users, _projects } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { useNavigate } from 'react-router-dom';

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
  { id: 'requestId', label: 'Requiest ID' },
  { id: 'requester', label: 'Requester' },
  { id: 'category', label: 'Category', align: 'center' },
  { id: 'deadline', label: 'Project Deadline' },
  { id: 'status', label: 'Status' },
  { id: 'priority', label: 'Priority' },
  { id: '', label: 'Action' },
];

export function InternalCompanyView() {
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
          <Table columns={columns} data={_projects} />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
