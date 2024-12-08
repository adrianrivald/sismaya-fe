import { Table } from 'src/components/table/table';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';

import { _tasks, _posts, _timeline, _users, _projects } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

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

export function RequestDetail() {
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
        Request #1234
      </Typography>
      <Box display="flex" gap={2} sx={{ mb: { xs: 3, md: 5 } }}>
        <Typography variant="h5">Request</Typography>
        <Typography variant="h5">KMI Request Management</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={4}>
          Test
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
