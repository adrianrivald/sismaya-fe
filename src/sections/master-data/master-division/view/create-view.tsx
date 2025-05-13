import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { Form } from 'src/components/form/form';
import { DashboardContent } from 'src/layouts/dashboard';
import { useAuth } from 'src/sections/auth/providers/auth';
import { useAddDivision, useUpdateDivision } from 'src/services/master-data/company';
import type { DivisionDTO } from 'src/services/master-data/company/division/schema/division-schema';
import { divisionSchema } from 'src/services/master-data/company/division/schema/division-schema';
import { useDivisionDetail } from 'src/services/master-data/company/division/use-division-detail';

export function CreateDivisionView() {
  const { mutate: addDivision } = useAddDivision();
  const { mutate: updateDivision } = useUpdateDivision();
  const navigate = useNavigate();
  const { vendor, id } = useParams();
  const { user } = useAuth();
  const idCurrentCompany =
    user?.internal_companies?.find((item) => item?.company?.name?.toLowerCase() === vendor)?.company
      ?.id ?? 0;

  const { data } = useDivisionDetail(Number(id) || 0);

  const handleSubmit = (formData: DivisionDTO) => {
    if (id) {
      updateDivision(
        {
          id: Number(id),
          name: formData.name,
          company_id: idCurrentCompany,
          is_active: formData.is_active,
        },
        {
          onSuccess: () => {
            navigate(`/${vendor}/division`);
          },
          onError: () => {},
        }
      );
    } else {
      addDivision(
        {
          name: formData.name,
          company_id: idCurrentCompany,
          is_active: formData.is_active,
        },
        {
          onSuccess: () => {
            navigate(`/${vendor}/division`);
          },
          onError: () => {},
        }
      );
    }
  };
  const defaultValues: DivisionDTO = {
    name: data?.name || '',
    is_active: data?.is_active || false,
  };

  return (
    <DashboardContent maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
            Master Divisions
          </Typography>
          <Box display="flex" gap={2} sx={{ mb: { xs: 3, md: 5 } }}>
            <Typography>Master Data</Typography>
            <Typography color="grey.500">•</Typography>
            <Typography color="grey.500">Division</Typography>
          </Box>
        </Box>
      </Box>

      <Grid container sx={{ my: 2 }}>
        <Form
          width="100%"
          onSubmit={handleSubmit}
          schema={divisionSchema}
          options={{
            defaultValues: {
              ...defaultValues,
            },
          }}
        >
          {({ register, setValue }) => (
            <Box>
              <Card>
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography fontSize={14} fontWeight="bold" sx={{ mb: 1 }}>
                        Division Name
                      </Typography>
                      <FormControl fullWidth>
                        <TextField fullWidth label="Division Name" {...register('name')} />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            onChange={(_, checked) => {
                              setValue('is_active', checked);
                            }}
                            defaultChecked={defaultValues?.is_active}
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
                  {data !== undefined ? 'Save Division' : 'Create New Division'}
                </LoadingButton>
              </Box>
            </Box>
          )}
        </Form>
      </Grid>
    </DashboardContent>
  );
}
