import { LoadingButton } from '@mui/lab';
import type { SelectChangeEvent } from '@mui/material';
import {
  Box,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { Form } from 'src/components/form/form';
import { DashboardContent } from 'src/layouts/dashboard';
import { useAuth } from 'src/sections/auth/providers/auth';
import { useAddStatus, useUpdateStatus } from 'src/services/master-data/company';
import type { StatusDTO } from 'src/services/master-data/company/status/schema/status-schema';
import { statusSchema } from 'src/services/master-data/company/status/schema/status-schema';
import { useStatusDetail } from 'src/services/master-data/company/status/use-status-detail';

export function CreateStatusView() {
  const { mutate: addStatus } = useAddStatus();
  const { mutate: updateStatus } = useUpdateStatus();
  const navigate = useNavigate();
  const { vendor, id } = useParams();
  const { user } = useAuth();
  const idCurrentCompany =
    user?.internal_companies?.find((item) => item?.company?.name?.toLowerCase() === vendor)?.company
      ?.id ?? 0;

  const { data } = useStatusDetail(Number(id) || 0);

  const handleSubmit = (formData: StatusDTO) => {
    if (id) {
      updateStatus(
        {
          id: Number(id),
          name: formData.name,
          company_id: idCurrentCompany,
          is_active: formData.is_active,
          step: formData.step,
          sort: 1,
        },
        {
          onSuccess: () => {
            navigate(`/${vendor}/status`);
          },
          onError: () => {},
        }
      );
    } else {
      addStatus(
        {
          name: formData.name,
          company_id: idCurrentCompany,
          sort: 1,
          step: formData.step,
          is_active: formData.is_active,
        },
        {
          onSuccess: () => {
            navigate(`/${vendor}/status`);
          },
          onError: () => {},
        }
      );
    }
  };
  const defaultValues: StatusDTO = {
    name: data?.name || '',
    is_active: false,
    step: data?.step || '',
  };

  return (
    <DashboardContent maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
            Master Request Status
          </Typography>
          <Box display="flex" gap={2} sx={{ mb: { xs: 3, md: 5 } }}>
            <Typography>Master Data</Typography>
            <Typography color="grey.500">•</Typography>
            <Typography color="grey.500">Request Status</Typography>
          </Box>
        </Box>
      </Box>

      <Grid container sx={{ my: 2 }}>
        <Form
          width="100%"
          onSubmit={handleSubmit}
          schema={statusSchema}
          options={{
            defaultValues: {
              ...defaultValues,
            },
          }}
        >
          {({ register, watch, setValue }) => (
            <Box>
              <Card>
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography fontSize={14} fontWeight="bold" sx={{ mb: 1 }}>
                        Status Name
                      </Typography>
                      <FormControl fullWidth>
                        <TextField fullWidth label="Status Name" {...register('name')} />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography fontSize={14} fontWeight="bold" sx={{ mb: 1 }}>
                        Status Type
                      </Typography>
                      <FormControl fullWidth>
                        <InputLabel id="type">Status Type</InputLabel>
                        <Select label="Type" value={watch('step')} {...register('step')}>
                          <MenuItem value="to_do">Todo</MenuItem>
                          <MenuItem value="in_progress">In Progress</MenuItem>
                          <MenuItem value="done">Done</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            onChange={(_, checked) => {
                              setValue('is_active', checked);
                            }}
                          />
                        }
                        label="Set status as Active"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              <Box
                display="flex"
                justifyContent="end"
                width="100%"
                sx={{
                  mt: 3,
                }}
              >
                <LoadingButton
                  size="medium"
                  loading={false}
                  loadingIndicator="Submitting..."
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  {data !== undefined ? 'Save Status' : 'Create New Status'}
                </LoadingButton>
              </Box>
            </Box>
          )}
        </Form>
      </Grid>
    </DashboardContent>
  );
}
