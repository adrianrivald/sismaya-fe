import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Form } from 'src/components/form/form';
import { DashboardContent } from 'src/layouts/dashboard';
import { useAuth } from 'src/sections/auth/providers/auth';
import {
  useAddStatus,
  useInternalCompanies,
  useUpdateStatus,
} from 'src/services/master-data/company';
import type {
  StatusDTO,
  StatusSuperDTO,
} from 'src/services/master-data/company/status/schema/status-schema';
import {
  statusSchema,
  statusSuperAdminSchema,
} from 'src/services/master-data/company/status/schema/status-schema';
import { useStatusDetail } from 'src/services/master-data/company/status/use-status-detail';

export function CreateStatusView() {
  const { mutate: addStatus } = useAddStatus();
  const { mutate: updateStatus } = useUpdateStatus();
  const navigate = useNavigate();
  const { vendor, id } = useParams();
  const { user } = useAuth();
  const { data: internalCompanies } = useInternalCompanies();
  const isSuperAdmin = user?.user_info?.role_id === 1;
  const idCurrentCompany =
    user?.internal_companies?.find((item) => item?.company?.name?.toLowerCase() === vendor)?.company
      ?.id ?? 0;

  const { data } = useStatusDetail(Number(id) || 0);

  const handleSubmit = (formData: StatusDTO | StatusSuperDTO) => {
    const superAdminData = formData as StatusSuperDTO;

    if (id) {
      updateStatus(
        {
          id: Number(id),
          name: formData.name,
          company_id: !isSuperAdmin ? idCurrentCompany : data?.company?.id,
          is_active: formData.is_active,
          step: formData.step,
          sort: 1, // TODO: Fix this hardcoded sort
        },
        {
          onSuccess: () => {
            navigate(`/${vendor ?? 'internal-company'}/status`);
          },
          onError: () => {},
        }
      );
    } else {
      addStatus(
        {
          name: superAdminData.name,
          company_id: isSuperAdmin ? superAdminData?.company_id : idCurrentCompany,
          step: superAdminData.step,
          is_active: superAdminData.is_active,
          sort: 1, // TODO: Fix this hardcoded sort
        },
        {
          onSuccess: () => {
            navigate(`/${vendor ?? 'internal-company'}/status`);
          },
          onError: () => {},
        }
      );
    }
  };
  const defaultValues: StatusDTO | StatusSuperDTO = {
    name: data?.name || '',
    is_active: data?.is_active || false,
    step: data?.step || '',
    sort: data?.sort || 0,
    company_id: data?.company?.id,
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
          schema={isSuperAdmin ? statusSuperAdminSchema : statusSchema}
          options={{
            defaultValues: {
              ...defaultValues,
            },
          }}
        >
          {({ register, setValue, watch, control, formState }) => (
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

                    {isSuperAdmin && (
                      <Grid item xs={12} md={12}>
                        <Typography fontSize={14} fontWeight="bold" sx={{ mb: 1 }}>
                          Company Name
                        </Typography>
                        <FormControl fullWidth>
                          {/* <InputLabel id="select-company">Company</InputLabel> */}

                          <Controller
                            name="company_id"
                            control={control}
                            rules={{
                              required: 'Company must be filled out',
                            }}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                              <Autocomplete
                                options={internalCompanies || []}
                                getOptionLabel={(option) => option?.name || ''}
                                isOptionEqualToValue={(option, val) => option?.id === val?.id}
                                value={
                                  internalCompanies?.find((company) => company.id === value) || null
                                }
                                disabled={id !== undefined}
                                onChange={async (_, selectedCompany) => {
                                  const selectedIdCompany = selectedCompany?.id || null;
                                  onChange(selectedIdCompany);
                                }}
                                renderInput={(params) => (
                                  <TextField {...params} label="Company" error={!!error} />
                                )}
                              />
                            )}
                          />
                        </FormControl>
                        {formState?.errors?.company_id && (
                          <FormHelperText sx={{ color: 'error.main' }}>
                            {String(formState?.errors?.company_id?.message)}
                          </FormHelperText>
                        )}
                      </Grid>
                    )}
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
