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
import React from 'react';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { FieldDropzone } from 'src/components/form';
import type { CompanyDTO } from 'src/services/master-data/company/schemas/company-schema';
import {
  useAddCompany,
  useAddCompanyBulk,
  useAddCompanyRelation,
  useInternalCompanies,
} from 'src/services/master-data/company';
import { Iconify } from 'src/components/iconify';
import { Bounce, toast } from 'react-toastify';
import { Icon } from '@iconify/react';

export function CreateClientCompanyView() {
  const { mutate: addCompany } = useAddCompanyBulk();
  const { mutate: addCompanyRelation } = useAddCompanyRelation();
  const handleSubmit = (formData: CompanyDTO) => {
    console.log(formData, 'log: formDatanya');
    // setIsLoading(true);
    addCompany(
      {
        ...formData,
        type: 'holding',
        clientSubCompanies: subCompanies,
      },
      {
        onSuccess(data) {
          formData.internal_id?.map((item: any) => {
            addCompanyRelation({
              internal_company_id: item,
              client_company_id: Number(data?.data?.id),
            });
            return null;
          });
        },
      }
    );
  };
  const theme = useTheme();
  const [isLoading, setIsLoading] = React.useState(false);

  const { data: internalCompanies } = useInternalCompanies();
  const [internalCompanyId, setInternalCompanyId] = React.useState<number>(0);

  const [subCompanies, setSubCompanies] = React.useState([
    {
      name: '',
      abbreviation: '',
      image: '',
      internal_id: null,
    },
  ]);

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

  console.log(subCompanies, 'subCompanies');

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
                  {watch('internal_id') &&
                    watch('internal_id').map((item: any, index: number) => (
                      <FormControl fullWidth>
                        <Stack
                          key={index}
                          direction="row"
                          justifyContent="space-between"
                          spacing={3}
                          alignItems="center"
                        >
                          <Box width="100%">
                            <InputLabel id={`type-${item.id}`}>Internal Company</InputLabel>
                            <Select
                              id={String(item.id)}
                              label="Internal Company"
                              value={item}
                              fullWidth
                              onChange={(e: SelectChangeEvent<number>) => {
                                const currentIds = watch('internal_id') || [];
                                const updatedIds = currentIds.map((id: number) =>
                                  id === item ? Number(e.target.value) : id
                                );
                                setValue('internal_id', updatedIds);
                              }}
                            >
                              {internalCompanies?.map((company) => (
                                <MenuItem value={company?.id}>{company?.name}</MenuItem>
                              ))}
                            </Select>
                          </Box>
                          <MenuList
                            disablePadding
                            sx={{
                              p: 0.5,
                              gap: 0.5,
                              display: 'flex',
                              flexDirection: 'row',
                              [`& .${menuItemClasses.root}`]: {
                                px: 1,
                                gap: 2,
                                borderRadius: 0.75,
                                [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
                              },
                            }}
                          >
                            <MenuItem
                              onClick={() => {
                                const currentIds = watch('internal_id') || [];
                                const filteredIds = currentIds.filter((id: number) => id !== item);
                                setValue('internal_id', filteredIds);
                              }}
                              sx={{ color: 'error.main' }}
                            >
                              <Iconify icon="solar:trash-bin-trash-bold" />
                              Delete
                            </MenuItem>
                          </MenuList>
                        </Stack>
                      </FormControl>
                    ))}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={3}
                    alignItems="center"
                  >
                    <Box width="100%">
                      <FormControl fullWidth>
                        <InputLabel id="userCompany">Internal Company</InputLabel>
                        <Select
                          label="Internal Company"
                          value={internalCompanyId}
                          onChange={(e: SelectChangeEvent<number>) =>
                            setInternalCompanyId(Number(e.target.value))
                          }
                        >
                          {internalCompanies?.map((company) => (
                            <MenuItem value={company?.id}>{company?.name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                    <Box
                      sx={{
                        p: 0.5,
                        gap: 0.5,
                        display: 'flex',
                        flexDirection: 'row',
                        [`& .${menuItemClasses.root}`]: {
                          px: 1,
                          gap: 2,
                          borderRadius: 0.75,
                          [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
                        },
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          const currentIds = watch('internal_id') || [];
                          if (!currentIds.includes(internalCompanyId)) {
                            setValue('internal_id', [...currentIds, internalCompanyId]);
                            setInternalCompanyId(0);
                          } else {
                            toast.error('You cant add the same internal company', {
                              position: 'top-right',
                              autoClose: 5000,
                              hideProgressBar: true,
                              closeOnClick: true,
                              pauseOnHover: true,
                              draggable: true,
                              progress: undefined,
                              theme: 'light',
                              transition: Bounce,
                            });
                          }
                        }}
                        sx={{ marginY: 2 }}
                      >
                        Save
                      </Button>
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
                                  (subCompanies[index].internal_id || []).includes(
                                    internalCompany.id as never
                                  )
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
