import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  Chip,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
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
  useAddCategory,
  useInternalCompaniesAll,
  useUpdateCategory,
} from 'src/services/master-data/company';
import {
  CategoryDTO,
  categorySchema,
  categorySuperAdminSchema,
  CategorySuperDTO,
} from 'src/services/master-data/company/category/schema/category-schema';
import { useCategoryDetail } from 'src/services/master-data/company/category/use-category-detail';

export function CreateCategoryView() {
  const { mutate: addCategory } = useAddCategory();
  const { mutate: updateCategory } = useUpdateCategory();
  const navigate = useNavigate();
  const { vendor, id } = useParams();
  const { user } = useAuth();
  const { data: internalCompanies } = useInternalCompaniesAll();

  const isSuperAdmin = user?.user_info?.role_id === 1;
  const idCurrentCompany =
    user?.internal_companies?.find((item) => item?.company?.name?.toLowerCase() === vendor)?.company
      ?.id ?? 0;

  const { data } = useCategoryDetail(Number(id) || 0);

  const handleSubmit = (formData: CategoryDTO | CategorySuperDTO) => {
    const superAdminData = formData as CategorySuperDTO;

    if (id) {
      updateCategory(
        {
          id: Number(id),
          name: formData.name,
          company_id: !isSuperAdmin ? idCurrentCompany : data?.company?.id,
          is_active: formData.is_active,
        },
        {
          onSuccess: () => {
            navigate(`/${vendor ?? 'internal-company'}/category`);
          },
          onError: () => {},
        }
      );
    } else {
      addCategory(
        {
          name: superAdminData.name,

          company_id: isSuperAdmin
            ? superAdminData?.company_id.filter((item: number) => item !== undefined)
            : [idCurrentCompany],
          is_active: superAdminData.is_active,
        },
        {
          onSuccess: () => {
            navigate(`/${vendor ?? 'internal-company'}/category`);
          },
          onError: () => {},
        }
      );
    }
  };
  const defaultValues: CategoryDTO | CategorySuperDTO = {
    name: data?.name || '',
    is_active: data?.is_active || false,
    company_id: [data?.company?.id],
  };

  return (
    <DashboardContent maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
            Master Categories
          </Typography>
          <Box display="flex" gap={2} sx={{ mb: { xs: 3, md: 5 } }}>
            <Typography>Master Data</Typography>
            <Typography color="grey.500">•</Typography>
            <Typography color="grey.500">Categories</Typography>
          </Box>
        </Box>
      </Box>

      <Grid container sx={{ my: 2 }}>
        <Form
          width="100%"
          onSubmit={handleSubmit}
          schema={isSuperAdmin ? categorySuperAdminSchema : categorySchema}
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
                        Category Name
                      </Typography>
                      <FormControl fullWidth>
                        <TextField fullWidth label="Category Name" {...register('name')} />
                      </FormControl>
                    </Grid>

                    {isSuperAdmin && !id && (
                      <Grid item xs={12} md={12}>
                        <Typography fontSize={14} fontWeight="bold" sx={{ mb: 1 }}>
                          Company Name
                        </Typography>
                        <FormControl fullWidth>
                          <Select
                            multiple
                            value={watch('company_id') || []}
                            defaultValue={[]}
                            fullWidth
                            displayEmpty
                            placeholder="Company"
                            onChange={(e: SelectChangeEvent<number[]>) => {
                              setValue('company_id', e.target.value);
                            }}
                            renderValue={(selected) => {
                              if (selected.length === 0) {
                                return (
                                  <Typography fontSize={14} color="GrayText">
                                    Company
                                  </Typography>
                                );
                              }
                              return (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                  {[...(internalCompanies || [])]
                                    ?.filter((company) => selected?.includes(company.id))
                                    .map((company) => (
                                      <Chip
                                        sx={{
                                          bgcolor: '#D6F3F9',
                                          color: 'info.dark',
                                        }}
                                        key={company.id}
                                        label={company.name}
                                      />
                                    ))}
                                </Box>
                              );
                            }}
                          >
                            {internalCompanies?.map((company) => (
                              <MenuItem key={company.id} value={company.id}>
                                {company.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    )}
                    {isSuperAdmin && id && (
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
                  {data !== undefined ? 'Save Category' : 'Create New Category'}
                </LoadingButton>
              </Box>
            </Box>
          )}
        </Form>
      </Grid>
    </DashboardContent>
  );
}
