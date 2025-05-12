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
import type { TitleDTO } from 'src/services/master-data/company/title/schema/title-schema';
import { titleSchema } from 'src/services/master-data/company/title/schema/title-schema';
import { useAddTitle } from 'src/services/master-data/company/title/use-title-create';
import { useTitleDetail } from 'src/services/master-data/company/title/use-title-detail';
import { useUpdateTitle } from 'src/services/master-data/company/title/use-title-update';

export function CreateTitleView() {
  const { mutate: addTitle } = useAddTitle();
  const { mutate: updateTitle } = useUpdateTitle();
  const navigate = useNavigate();
  const { vendor, id } = useParams();
  const { user } = useAuth();
  const idCurrentCompany =
    user?.internal_companies?.find((item) => item?.company?.name?.toLowerCase() === vendor)?.company
      ?.id ?? 0;

  const { data } = useTitleDetail(Number(id) || 0);

  const handleSubmit = (formData: TitleDTO) => {
    if (id) {
      updateTitle(
        {
          id: Number(id),
          name: formData.name,
          company_id: idCurrentCompany,
          is_active: formData.is_active,
        },
        {
          onSuccess: () => {
            navigate(`/${vendor}/title`);
          },
          onError: () => {},
        }
      );
    } else {
      addTitle(
        {
          name: formData.name,
          company_id: idCurrentCompany,
        },
        {
          onSuccess: () => {
            navigate(`/${vendor}/title`);
          },
          onError: () => {},
        }
      );
    }
  };
  const defaultValues: TitleDTO = {
    name: data?.name || '',
    is_active: false,
  };

  return (
    <DashboardContent maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
            Master Titles
          </Typography>
          <Box display="flex" gap={2} sx={{ mb: { xs: 3, md: 5 } }}>
            <Typography>Master Data</Typography>
            <Typography color="grey.500">•</Typography>
            <Typography color="grey.500">Title</Typography>
          </Box>
        </Box>
      </Box>

      <Grid container sx={{ my: 2 }}>
        <Form
          width="100%"
          onSubmit={handleSubmit}
          schema={titleSchema}
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
                        Title Name
                      </Typography>
                      <FormControl fullWidth>
                        <TextField fullWidth label="Title Name" {...register('name')} />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            onChange={(_, checked) => {
                              setValue('isActive', checked);
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
                  Create New Title
                </LoadingButton>
              </Box>
            </Box>
          )}
        </Form>
      </Grid>
    </DashboardContent>
  );
}
