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
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { Controller } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Form } from 'src/components/form/form';
import { DashboardContent } from 'src/layouts/dashboard';
import { useAuth } from 'src/sections/auth/providers/auth';
import { useClientCompanies, useInternalCompanies } from 'src/services/master-data/company';
import type {
  TitleDTO,
  TitleSuperDTO,
} from 'src/services/master-data/company/title/schema/title-schema';
import {
  titleSchema,
  titleSuperAdminSchema,
} from 'src/services/master-data/company/title/schema/title-schema';
import { useAddTitle } from 'src/services/master-data/company/title/use-title-create';
import { useTitleDetail } from 'src/services/master-data/company/title/use-title-detail';
import { useUpdateTitle } from 'src/services/master-data/company/title/use-title-update';

export function CreateTitleView() {
  const location = useLocation();
  const isClientCompanyPage = location.pathname.includes('/client-company');
  const isInternalCompanyPage = location.pathname.includes('/internal-company');
  const { mutate: addTitle } = useAddTitle();
  const { mutate: updateTitle } = useUpdateTitle();
  const navigate = useNavigate();
  const { vendor, id } = useParams();
  const { user } = useAuth();
  const { data: internalCompanies } = useInternalCompanies(isInternalCompanyPage);
  const { data: clientCompanies } = useClientCompanies(true, isClientCompanyPage);
  const companiesData = isInternalCompanyPage ? internalCompanies : clientCompanies;
  const isSuperAdmin = user?.user_info?.role_id === 1;
  const idCurrentCompany =
    user?.internal_companies?.find((item) => item?.company?.name?.toLowerCase() === vendor)?.company
      ?.id ?? 0;

  const { data } = useTitleDetail(Number(id) || 0);

  const handleSubmit = (formData: TitleDTO | TitleSuperDTO) => {
    const superAdminData = formData as TitleSuperDTO;

    if (id) {
      updateTitle(
        {
          id: Number(id),
          name: formData.name,
          company_id: !isSuperAdmin ? idCurrentCompany : data?.company?.id,
          is_active: formData.is_active,
        },
        {
          onSuccess: () => {
            navigate(`/${vendor ?? 'internal-company'}/title`);
          },
          onError: () => {},
        }
      );
    } else {
      addTitle(
        {
          name: superAdminData.name,
          company_id: isSuperAdmin ? superAdminData?.company_id : idCurrentCompany,
          is_active: superAdminData.is_active,
        },
        {
          onSuccess: () => {
            navigate(`/${vendor ?? 'internal-company'}/title`);
          },
          onError: () => {},
        }
      );
    }
  };
  const defaultValues: TitleDTO | TitleSuperDTO = {
    name: data?.name || '',
    is_active: data?.is_active || false,
    company_id: data?.company?.id,
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
          schema={isSuperAdmin ? titleSuperAdminSchema : titleSchema}
          options={{
            defaultValues: {
              ...defaultValues,
            },
          }}
        >
          {({ register, setValue, control, formState }) => (
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
                                options={companiesData || []}
                                getOptionLabel={(option) => option?.name || ''}
                                isOptionEqualToValue={(option, val) => option?.id === val?.id}
                                value={
                                  companiesData?.find((company) => company.id === value) || null
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
                  {data !== undefined ? 'Save Title' : 'Create New Title'}
                </LoadingButton>
              </Box>
            </Box>
          )}
        </Form>
      </Grid>
    </DashboardContent>
  );
}
