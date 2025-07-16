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
  Switch,
  TextField,
  Typography,
  MenuItem,
  Select,
  Chip,
  SelectChangeEvent,
} from '@mui/material';
import { Controller } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Form } from 'src/components/form/form';
import { DashboardContent } from 'src/layouts/dashboard';
import { useAuth } from 'src/sections/auth/providers/auth';
import {
  useAddDivision,
  useClientCompanies,
  useInternalCompanies,
  useInternalCompaniesAll,
  useNonInternalCompanies,
  useUpdateDivision,
} from 'src/services/master-data/company';
import type {
  DivisionDTO,
  DivisionSuperDTO,
} from 'src/services/master-data/company/division/schema/division-schema';
import {
  divisionSchema,
  divisionSuperAdminSchema,
} from 'src/services/master-data/company/division/schema/division-schema';
import { useDivisionDetail } from 'src/services/master-data/company/division/use-division-detail';

export function CreateDivisionView() {
  const location = useLocation();
  const isClientCompanyPage = location.pathname.includes('/client-company');
  const isInternalCompanyPage = location.pathname.includes('/internal-company');
  const { mutate: addDivision } = useAddDivision();
  const { mutate: updateDivision } = useUpdateDivision();
  const navigate = useNavigate();
  const { vendor, id } = useParams();
  const { user } = useAuth();

  const { data: internalCompanies } = useInternalCompaniesAll();
  const { data: clientCompanies } = useNonInternalCompanies(true);
  const companiesData = isInternalCompanyPage ? internalCompanies : clientCompanies;
  const isSuperAdmin = user?.user_info?.role_id === 1;
  const idCurrentCompany =
    user?.internal_companies?.find((item) => item?.company?.name?.toLowerCase() === vendor)?.company
      ?.id ?? 0;

  const { data } = useDivisionDetail(Number(id) || 0);

  const handleSubmit = (formData: DivisionDTO | DivisionSuperDTO) => {
    const superAdminData = formData as DivisionSuperDTO;
    if (id) {
      updateDivision(
        {
          id: Number(id),
          name: formData.name,
          company_id: !isSuperAdmin ? idCurrentCompany : data?.company?.id,
          is_active: formData.is_active,
          is_show_all: superAdminData.is_show_all === 'true',
        },
        {
          onSuccess: () => {
            navigate(`/${vendor ?? 'internal-company'}/division`);
          },
          onError: () => {},
        }
      );
    } else {
      addDivision(
        {
          name: superAdminData.name,
          company_id: isSuperAdmin
            ? superAdminData?.company_id.filter((item: number) => item !== undefined)
            : [idCurrentCompany],
          is_active: superAdminData.is_active,
          is_show_all: superAdminData.is_show_all === 'true',
        },
        {
          onSuccess: () => {
            navigate(`/${vendor ?? 'internal-company'}/division`);
          },
          onError: () => {},
        }
      );
    }
  };
  const defaultValues: DivisionDTO | DivisionSuperDTO = {
    name: data?.name || '',
    is_active: data?.is_active || false,
    company_id: [data?.company?.id],
    is_show_all: data?.is_show_all.toString() || '',
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
          schema={isSuperAdmin ? divisionSuperAdminSchema : divisionSchema}
          options={{
            defaultValues: {
              ...defaultValues,
              ...(id ? { company_id: defaultValues?.company_id[0] } : []),
            },
          }}
        >
          {({ register, setValue, control, formState, watch }) => (
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
                    {isClientCompanyPage && (
                      <Grid item xs={12}>
                        <Typography fontSize={14} fontWeight="bold" sx={{ mb: 1 }}>
                          Show Type
                        </Typography>

                        <FormControl fullWidth>
                          <InputLabel id="type">Show Type</InputLabel>
                          <Select
                            label="Type"
                            {...register('is_show_all')}
                            defaultValue={defaultValues?.is_show_all}
                          >
                            <MenuItem value="true">Show all division</MenuItem>
                            <MenuItem value="false">Only show this division</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    )}

                    {isSuperAdmin && !id && (
                      <Grid item xs={12} md={12}>
                        <Typography fontSize={14} fontWeight="bold" sx={{ mb: 1 }}>
                          Select Company
                        </Typography>
                        <FormControl fullWidth>
                          <Autocomplete
                            multiple
                            options={companiesData || []}
                            getOptionLabel={(option) => option.name}
                            value={(companiesData || []).filter((company) =>
                              (watch('company_id') || []).includes(company.id)
                            )}
                            onChange={(event, newValue) => {
                              setValue(
                                'company_id',
                                newValue.map((company) => company.id)
                              );
                            }}
                            renderTags={(value, getTagProps) =>
                              value.map((option, index) => (
                                <Chip
                                  label={option.name}
                                  {...getTagProps({ index })}
                                  key={option.id}
                                  sx={{
                                    bgcolor: '#D6F3F9',
                                    color: 'info.dark',
                                  }}
                                />
                              ))
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                placeholder="Company"
                                label="Company"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                              />
                            )}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                          />
                        </FormControl>
                      </Grid>
                    )}
                    {isSuperAdmin && id && (
                      <Grid item xs={12} md={12}>
                        <Typography fontSize={14} fontWeight="bold" sx={{ mb: 1 }}>
                          Select Company
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
