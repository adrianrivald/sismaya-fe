import Typography from '@mui/material/Typography';
import { Box, FormHelperText, Grid, TextField, useTheme } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { Form } from 'src/components/form/form';
import React from 'react';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { FieldDropzone } from 'src/components/form';
import type { CompanyDTO } from 'src/services/master-data/company/schemas/company-schema';
import { useAddCompany } from 'src/services/master-data/company';

export function CreateClientCompanyView() {
  const { mutate: addCompany } = useAddCompany();
  const handleSubmit = (formData: CompanyDTO) => {
    // setIsLoading(true);
    addCompany({
      ...formData,
      type: 'holding',
    });
  };
  const theme = useTheme();
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
        Client Company
      </Typography>
      <Box display="flex" gap={2} sx={{ mb: { xs: 3, md: 5 } }}>
        <Typography>Master Data</Typography>
        <Typography color="grey.500">•</Typography>
        <Typography color="grey.500">Client Company</Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: { xs: 3, md: 5 }, ml: 0 }}>
        <Form width="100%" onSubmit={handleSubmit}>
          {({ register, watch, formState, setValue, control }) => (
            <Grid container spacing={3} xs={12}>
              <Grid item xs={12} md={12}>
                <TextField
                  error={Boolean(formState?.errors?.name)}
                  sx={{
                    width: '100%',
                  }}
                  label="Client Name"
                  {...register('name', {
                    required: 'Client Name must be filled out',
                  })}
                  autoComplete="off"
                />
                {formState?.errors?.name && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {String(formState?.errors?.name?.message)}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  error={Boolean(formState?.errors?.abbreviation)}
                  multiline
                  sx={{
                    width: '100%',
                  }}
                  label="Client Description"
                  rows={4}
                  {...register('abbreviation', {
                    required: 'Client Description must be filled out',
                  })}
                />
                {formState?.errors?.abbreviation && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {String(formState?.errors?.abbreviation?.message)}
                  </FormHelperText>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <FieldDropzone
                  label="Upload Picture"
                  helperText="Picture maximum 5mb size"
                  controller={{
                    name: 'cover',
                    control,
                    // rules: {
                    //   required: {
                    //     value: true,
                    //     message: 'Picture must be uploaded',
                    //   },
                    // },
                  }}
                  error={formState.errors?.cover}
                  maxSize={5000000}
                />
              </Grid>

              <Box
                display="flex"
                justifyContent="end"
                width="100%"
                sx={{
                  mt: 8,
                }}
              >
                <LoadingButton
                  size="small"
                  loading={isLoading}
                  loadingIndicator="Submitting..."
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{
                    width: 120,
                  }}
                >
                  Submit
                </LoadingButton>
              </Box>
            </Grid>
          )}
        </Form>
      </Grid>
    </DashboardContent>
  );
}
