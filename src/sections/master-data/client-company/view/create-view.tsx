import Typography from '@mui/material/Typography';
import type { SelectChangeEvent } from '@mui/material';
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  MenuList,
  Select,
  Stack,
  TextField,
  menuItemClasses,
  useTheme,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { Form } from 'src/components/form/form';
import React, { useEffect } from 'react';
import { LoadingButton } from '@mui/lab';
import { useNavigate, useParams } from 'react-router-dom';
import { FieldDropzone } from 'src/components/form';
import type { CompanyDTO } from 'src/services/master-data/company/schemas/company-schema';
import {
  useAddCompany,
  useAddCompanyBulk,
  // useAddCompanyRelation,
  useCompanyById,
  useInternalCompanies,
  useUpdateCompany,
} from 'src/services/master-data/company';
import { Iconify } from 'src/components/iconify';
import { Bounce, toast } from 'react-toastify';
import { Icon } from '@iconify/react';
import { Department } from 'src/services/master-data/company/types';

interface ClientCompanyValues {
  name: string | undefined;
  abbreviation: string | undefined;
  department: Department[];
  image: string | undefined;
  subsidiaries: {
    abbreviation: string;
    id: number;
    image: string;
    name: string;
    type: string;
  }[];
  vendors: {
    id: number;
    created_at: string;
    updated_at: string;
    client_company_id: number;
    internal_company_id: number;
    internal_company: {
      id: number;
      created_at: string;
      updated_at: string;
      parent_id: number;
      name: string;
      abbreviation: string;
      type: string;
      image: string;
    };
  }[];
  internal_id: number[];
}
export function CreateClientCompanyView() {
  const { id } = useParams();
  console.log(Number(id), 'Number(id)');
  const { data } = useCompanyById(Number(id));

  const { mutate: addCompany } = useAddCompanyBulk();
  const { mutate: updateCompany } = useUpdateCompany();

  // const { mutate: addCompanyRelation } = useAddCompanyRelation();

  const defaultValues: any = {
    name: data?.name,
    abbreviation: data?.abbreviation,
    department: data?.department ?? [],
    image: data?.image,
    // subsidiaries: data?.subsidiaries ?? [],
    // vendors: data?.vendors ?? [],
    internal_id: data?.vendors?.map((item) => item.internal_company_id) || [],
  };

  const handleSubmit = (formData: CompanyDTO) => {
    // setIsLoading(true);
    if (id) {
      const payload = {
        ...formData,
        cito_quota: data?.cito_quota,
        id: Number(id),
        type: 'holding',
        clientSubCompanies: subCompanies,
      };
      if (defaultValues?.image) {
        Object.assign(payload, {
          image: defaultValues?.image,
        });
      }
      updateCompany(payload);
    } else {
      addCompany({
        ...formData,
        type: 'holding',
        clientSubCompanies: subCompanies,
      });
    }
  };
  const theme = useTheme();
  const [isLoading, setIsLoading] = React.useState(false);

  const { data: internalCompanies } = useInternalCompanies();

  const [subCompanies, setSubCompanies] = React.useState<
    {
      name: string;
      abbreviation: string;
      image: string;
      internal_id: number[] | null;
    }[]
  >([{ name: '', abbreviation: '', image: '', internal_id: null }]);

  useEffect(() => {
    if (id) {
      setSubCompanies(
        (data?.subsidiaries ?? []).map((item) => ({
          id: item?.id,
          name: item?.name ?? '',
          abbreviation: item?.abbreviation ?? '',
          image: item?.image ?? '',
          internal_id: item?.vendors?.map((internalItem) => internalItem?.internal_company_id),
        }))
      );
    }
  }, [data?.subsidiaries, id]);

  const onAddSubCompany = () => {
    setSubCompanies((prev) => [
      ...prev,
      {
        name: '',
        abbreviation: '',
        image: '',
        internal_id: null,
      },
    ]);
  };

  const onDeleteSubCompany = (index: number) => {
    const newArr = subCompanies?.filter((_, companyIndex) => companyIndex !== index);
    if (subCompanies.length > 1) {
      setSubCompanies(newArr);
    }
  };

  const handleChangeSubCompany = (e: React.ChangeEvent<any>, index: number) => {
    const newArr = subCompanies?.map((company, companyIndex) => {
      if (companyIndex === index) {
        return {
          ...company,
          [e.target.name]: e.target.value,
        };
      }
      return company;
    });
    setSubCompanies(newArr);
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
        <Form
          width="100%"
          onSubmit={handleSubmit}
          options={{
            defaultValues: { ...defaultValues },
          }}
        >
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

              <Grid item xs={12} md={12}>
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
                  defaultImage={defaultValues?.image}
                  error={formState.errors?.cover}
                  maxSize={5000000}
                />
              </Grid>

              <Grid item xs={12} md={12}>
                <Typography variant="h4" color="primary" mb={2}>
                  Internal Company
                </Typography>

                {/* <InputLabel id="demo-simple-select-outlined-label-type">Internal Company</InputLabel> */}
                <Box display="flex" flexDirection="column" gap={2}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={3}
                    alignItems="center"
                  >
                    <Box width="100%">
                      <Autocomplete
                        multiple
                        options={internalCompanies || []}
                        getOptionLabel={(option) => option.name || ''}
                        value={(internalCompanies || []).filter((internalCompany) =>
                          (watch('internal_id') || []).includes(internalCompany.id as never)
                        )}
                        onChange={(event, newValue) => {
                          setValue(
                            'internal_id',
                            newValue.map((companyValue) => companyValue.id)
                          );
                        }}
                        renderTags={(value, getTagProps) =>
                          value.map((option, idx) => (
                            <Chip
                              label={option.name}
                              {...getTagProps({ index: idx })}
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
                            placeholder="Internal Company"
                            label="Internal Company"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        )}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                      />
                    </Box>
                  </Stack>
                </Box>
                {formState?.errors?.internal_id && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {String(formState?.errors?.internal_id?.message)}
                  </FormHelperText>
                )}
              </Grid>

              <Grid item xs={12} md={12}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h4" color="primary" mb={2}>
                    Client Sub Company
                  </Typography>

                  <Button onClick={onAddSubCompany} variant="contained" color="primary">
                    <IconButton
                      aria-label="Create Client Sub Company"
                      size="small"
                      sx={{ color: 'white' }}
                    >
                      <Iconify icon="mdi:plus" />
                    </IconButton>
                    <Typography>Tambah Client Sub Company</Typography>
                  </Button>
                </Stack>
                {subCompanies?.map((company, index) => (
                  <Box
                    sx={{
                      bgcolor: '#F5F9FA',
                      p: 4,
                      mt: 4,
                      borderRadius: '8px',
                    }}
                  >
                    <Grid container spacing={3} xs={12}>
                      <Grid item xs={12} md={12}>
                        <TextField
                          error={Boolean(formState?.errors?.name)}
                          sx={{
                            width: '100%',
                          }}
                          label="Client Name"
                          autoComplete="off"
                          name="name"
                          value={company.name}
                          onChange={(e) => handleChangeSubCompany(e, index)}
                        />
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
                          name="abbreviation"
                          value={company.abbreviation}
                          onChange={(e) => handleChangeSubCompany(e, index)}
                        />
                        {formState?.errors?.abbreviation && (
                          <FormHelperText sx={{ color: 'error.main' }}>
                            {String(formState?.errors?.abbreviation?.message)}
                          </FormHelperText>
                        )}
                      </Grid>

                      <Grid item xs={12} md={12}>
                        <FieldDropzone
                          label="Upload Picture"
                          helperText="Picture maximum 5mb size"
                          controller={{
                            name: `subCompaniesCover[${index}]`,
                            control,
                            // rules: {
                            //   required: {
                            //     value: true,
                            //     message: 'Picture must be uploaded',
                            //   },
                            // },
                          }}
                          defaultImage={company.image}
                          error={formState.errors?.cover}
                          maxSize={5000000}
                        />
                      </Grid>

                      <Grid item xs={12} md={12}>
                        <Typography variant="h4" color="primary" mb={2}>
                          Internal Company
                        </Typography>

                        {/* <InputLabel id="demo-simple-select-outlined-label-type">Internal Company</InputLabel> */}
                        <Box display="flex" flexDirection="column" gap={2}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            spacing={3}
                            alignItems="center"
                          >
                            <Box width="100%">
                              <Autocomplete
                                multiple
                                options={internalCompanies || []}
                                getOptionLabel={(option) => option.name || ''}
                                value={(internalCompanies || []).filter((internalCompany) =>
                                  (company.internal_id || []).includes(internalCompany.id as never)
                                )}
                                onChange={(event, newValue) => {
                                  handleChangeSubCompany(
                                    {
                                      target: {
                                        name: 'internal_id',
                                        value: newValue.map((companyValue) => companyValue.id),
                                      },
                                    } as any,
                                    index
                                  );
                                }}
                                renderTags={(value, getTagProps) =>
                                  value.map((option, idx) => (
                                    <Chip
                                      label={option.name}
                                      {...getTagProps({ index: idx })}
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
                                    placeholder="Internal Company"
                                    label="Internal Company"
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                  />
                                )}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                              />
                            </Box>
                          </Stack>
                        </Box>
                        {formState?.errors?.internal_id && (
                          <FormHelperText sx={{ color: 'error.main' }}>
                            {String(formState?.errors?.internal_id?.message)}
                          </FormHelperText>
                        )}
                      </Grid>

                      <Grid item xs={12} md={12} display="flex" sx={{ justifyContent: 'flex-end' }}>
                        <Button
                          onClick={() => onDeleteSubCompany(index)}
                          startIcon={
                            <Icon icon="solar:trash-bin-trash-bold" width="20" height="20" />
                          }
                          color="error"
                          disabled={subCompanies?.length < 2}
                        >
                          Hapus
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
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
