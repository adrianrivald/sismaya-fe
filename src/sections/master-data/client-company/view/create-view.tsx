import Typography from '@mui/material/Typography';
import {
  Box,
  Button,
  Chip,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Input,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  useTheme,
  Theme,
} from '@mui/material';

import { _tasks, _posts, _timeline, _users, _projects } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { Form } from 'src/components/form/form';
import React from 'react';
import { API_URL } from 'src/constants';
import { UseFormSetValue } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';

export function CreateClientCompanyView() {
  const theme = useTheme();
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleSubmit = (formData: any) => {
    console.log(formData, 'test');
    setTimeout(() => {
      setIsLoading(false);
      navigate('/client-company/test/edit');
    }, 1000);
  };
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
          {({ register, watch, formState, setValue }) => {
            console.log(formState.errors, 'formstate');
            console.log(watch(), 'watch');
            return (
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
                    error={Boolean(formState?.errors?.description)}
                    multiline
                    sx={{
                      width: '100%',
                    }}
                    label="Client Description"
                    rows={4}
                    {...register('description', {
                      required: 'Client Description must be filled out',
                    })}
                  />
                  {formState?.errors?.description && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {String(formState?.errors?.description?.message)}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormLabel htmlFor="upload-pic">
                    <Box
                      display="flex"
                      sx={{
                        cursor: 'pointer',
                        border: 1,
                        borderColor: formState?.errors?.photo
                          ? theme.palette.error.main
                          : theme.palette.grey[500],
                        borderStyle: 'dashed',
                        borderRadius: 4,
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 16,
                        height: '200px',
                        '&:hover': {
                          backgroundColor: theme.palette.grey[100],
                          cursor: 'pointer',
                        },
                      }}
                    >
                      Upload Picture
                    </Box>
                  </FormLabel>
                  <FormHelperText>File maximum size is 5mb</FormHelperText>

                  {formState?.errors?.photo && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      {String(formState?.errors?.photo?.message)}
                    </FormHelperText>
                  )}
                  <Input
                    type="file"
                    id="upload-pic"
                    sx={{ display: 'none' }}
                    {...register('photo', {
                      required: 'Photo must be uploaded',
                    })}
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
            );
          }}
        </Form>
      </Grid>
    </DashboardContent>
  );
}
