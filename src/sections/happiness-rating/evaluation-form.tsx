import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { DashboardContent } from 'src/layouts/dashboard';
import { useMyRequestById } from 'src/services/request';

export default function EvaluationForm() {
  const { id, vendor } = useParams();
  const { data: requestDetail } = useMyRequestById(id ?? '');
  return (
    <DashboardContent maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box
          component="section"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          aria-label="page header"
        >
          <Stack spacing={1}>
            <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
              Evaluation Form
            </Typography>

            <Box display="flex" gap={2}>
              <Typography component={Link} to="/" sx={{ textDecoration: 'none', color: 'inherit' }}>
                Request
              </Typography>
              <Typography color="grey.500">•</Typography>
              <Typography>
                {vendor ? vendor.charAt(0).toUpperCase() + vendor.slice(1) : ''} Request Management
              </Typography>
              <Typography color="grey.500">•</Typography>
              <Typography>{requestDetail?.number}</Typography>
              <Typography color="grey.500">•</Typography>
              <Typography color="grey.500">Evaluation Form</Typography>
            </Box>
          </Stack>
        </Box>
      </Box>
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Box>
            <Box>
              <Stack
                sx={{
                  backgroundColor: 'rgba(145, 158, 171, 0.08)',
                  p: 1.5,
                  borderRadius: 1,
                  alignItems: 'center',
                }}
                flexDirection="row"
                gap={1}
              >
                <Typography fontSize={12} color="#1C252E">
                  Rating Scale
                </Typography>
                <Typography
                  fontSize={13}
                  sx={{ px: 1, py: 0.5, borderRadius: 1 }}
                  color={'red'}
                  bgcolor={'rgba(255, 86, 48, 0.16)'}
                >
                  1: Very Dissatisfied
                </Typography>
                <Typography
                  fontSize={13}
                  sx={{ px: 1, py: 0.5, borderRadius: 1 }}
                  color={'#B76E00'}
                  bgcolor={'rgba(255, 171, 0, 0.16)'}
                >
                  2: Dissatisfied
                </Typography>
                <Typography
                  fontSize={13}
                  sx={{ px: 1, py: 0.5, borderRadius: 1 }}
                  color={'black'}
                  bgcolor={'rgba(145, 158, 171, 0.08)'}
                >
                  3: Neutral
                </Typography>
                <Typography
                  fontSize={13}
                  sx={{ px: 1, py: 0.5, borderRadius: 1 }}
                  color={'#006C9C'}
                  bgcolor={'rgba(0, 184, 217, 0.16)'}
                >
                  4. Satisfied
                </Typography>
                <Typography
                  fontSize={13}
                  sx={{ px: 1, py: 0.5, borderRadius: 1 }}
                  color={'#118D57'}
                  bgcolor={'rgba(34, 197, 94, 0.16)'}
                >
                  4: Very Satisfied
                </Typography>
              </Stack>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </DashboardContent>
  );
}
