import Typography from '@mui/material/Typography';
import {
  Box,
  Grid,
  TableContainer,
  useTheme,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
} from '@mui/material';

import { _tasks, _posts, _timeline, _users, _projects } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { StatusBadge } from '../status-badge';

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

export function RequestDetailView() {
  const theme = useTheme();
  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3} xs={12}>
        <Grid item xs={12} md={8}>
          <Box>
            <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
              Request #1234
            </Typography>
            <Box display="flex" gap={2} sx={{ mb: { xs: 3, md: 5 } }}>
              <Typography variant="h5">Request</Typography>
              <Typography variant="h5">KMI Request Management</Typography>
            </Box>
            <Box>
              <Box
                width="max-content"
                py={1}
                px={3}
                sx={{
                  border: 1,
                  borderColor: 'grey.150',
                  borderRadius: 2,
                }}
                display="flex"
                alignItems="center"
                gap={1}
              >
                Status <StatusBadge type="info" label="Requested" />
              </Box>
            </Box>
            <Box
              p={3}
              bgcolor="blue.50"
              sx={{
                borderRadius: 2,
                marginTop: 2,
              }}
            >
              <Box display="flex" gap={1} alignItems="center">
                <StatusBadge type="danger" label="CITO" />
                <Typography fontWeight="bold" color="primary">
                  REQUEST #1234
                </Typography>
              </Box>
              <TableContainer>
                <Table sx={{ marginTop: 2 }}>
                  <TableBody>
                    <TableRow>
                      <TableCell size="small" width={200}>
                        Requester Name
                      </TableCell>
                      <TableCell size="small">Alice</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell size="small" width={200}>
                        Source
                      </TableCell>
                      <TableCell size="small">PHTA</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell size="small" width={200}>
                        Division
                      </TableCell>
                      <TableCell size="small">Pengadaan</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell size="small" width={200}>
                        Category
                      </TableCell>
                      <TableCell size="small">Kalibrasi</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell size="small" width={200}>
                        Request Description
                      </TableCell>
                      <TableCell size="small">
                        Saya ingin mengajukan permintaan kalibrasi untuk 25 alat kesehatan.
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell size="small" width={200}>
                        Attachments
                      </TableCell>
                      <TableCell size="small">
                        <Box
                          width="max-content"
                          display="flex"
                          gap={3}
                          px={2}
                          py={1}
                          sx={{ border: 1, borderRadius: 1, borderColor: 'grey.300' }}
                        >
                          {/* {files?.map((file) => ( */}
                          <Box display="flex" gap={1} alignItems="center">
                            <Box component="img" src="/assets/icons/file.png" />
                            <Box>
                              <Typography fontWeight="bold">Daftar alat kalibrasi.xls</Typography>2
                              Mb
                            </Box>
                          </Box>
                          {/* ))} */}
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          Chatbox
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
