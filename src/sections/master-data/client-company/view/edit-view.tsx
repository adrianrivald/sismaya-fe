import Typography from '@mui/material/Typography';
import type { SelectChangeEvent } from '@mui/material';
import {
  Box,
  Button,
  FormHelperText,
  Grid,
  MenuItem,
  Stack,
  TextField,
  MenuList,
  menuItemClasses,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Chip,
  Autocomplete,
  IconButton,
} from '@mui/material';
import { Icon } from '@iconify/react';

import { DashboardContent } from 'src/layouts/dashboard';
import { Form } from 'src/components/form/form';
import React, { useEffect } from 'react';
import { FieldDropzone } from 'src/components/form';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useAddCompany,
  useAddDivision,
  useCompanyById,
  useDeleteDivisionItem,
  useUpdateCompany,
  useUpdateDivision,
  useDeleteCompanyById,
  useInternalCompanies,
  useAddCompanyRelation,
  useUpdateCompanyRelation,
  useDeleteCompanyRelation,
} from 'src/services/master-data/company';
import { Iconify } from 'src/components/iconify';
import type { CompanyDTO } from 'src/services/master-data/company/schemas/company-schema';
import type { Control, FormState, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import type { Company, Department } from 'src/services/master-data/company/types';
import { toast } from 'react-toastify';
import { RemoveAction } from './remove-action';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

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
interface EditFormProps {
  formState: FormState<CompanyDTO>;
  register: UseFormRegister<CompanyDTO>;
  control: Control<CompanyDTO>;
  setValue: UseFormSetValue<CompanyDTO>;
  defaultValues: ClientCompanyValues;
  onChangeDivision: (
    e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<boolean>,
    itemId: number,
    type: string
  ) => void;
  onClickEdit: (value: string, type: boolean, divisionId: number) => void;
  onClickEditCompany: (companyId: number) => void;
  onClickDelete: (divisionId: number) => void;
  onChangeDivisionNew: (
    e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<boolean>,
    type: string
  ) => void;
  onChangeSubCompanyNew: (
    e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<boolean>,
    type: string
  ) => void;
  data: Company | undefined;
  department: Partial<Department>;
  departments: Department[];
  subCompany: Partial<Company>;
  subCompanies: {
    name: string;
    abbreviation: string;
    image: string;
    internalCompany: any;
  }[];
  onAddDepartment: () => void;
  onAddSubCompany: () => void;
  onClickRemove: (id: number, type: string) => void;
  watch: any;
  internalCompanies: Company[] | undefined;
  onChangeVendors: any;
  onAddVendors: any;
  onRemoveVendors: any;
  handleChangeSubCompany: (e: React.ChangeEvent<any>, index: number) => void;
  onDeleteSubCompany: (index: number) => void;
}

function EditForm({
  formState,
  register,
  control,
  setValue,
  defaultValues,
  onChangeDivision,
  onClickEdit,
  onClickDelete,
  onChangeDivisionNew,
  onChangeSubCompanyNew,
  department,
  departments,
  subCompany,
  subCompanies,
  data,
  onAddDepartment,
  onAddSubCompany,
  onClickRemove,
  onClickEditCompany,
  watch,
  internalCompanies,
  onAddVendors,
  onChangeVendors,
  onRemoveVendors,
  handleChangeSubCompany,
  onDeleteSubCompany,
}: EditFormProps) {
  useEffect(() => {
    setValue('name', defaultValues?.name);
    setValue('abbreviation', defaultValues?.abbreviation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  const [internalCompanyId, setInternalCompanyId] = React.useState<number>(0);
  return (
    <Grid container spacing={3} xs={12}>
      <Grid item xs={12} md={12}>
        <TextField
          error={Boolean(formState?.errors?.name)}
          sx={{
            width: '100%',
          }}
          label="Name"
          {...register('name', {
            required: 'Name must be filled out',
          })}
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
          label="Description"
          rows={4}
          {...register('abbreviation', {
            required: 'Description must be filled out',
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
          }}
          defaultImage={defaultValues?.image}
          maxSize={5000000}
        />
      </Grid>

      <Grid item xs={12} md={12}>
        <Typography variant="h4" color="primary" mb={2}>
          Internal Company
        </Typography>

        {/* <InputLabel id="demo-simple-select-outlined-label-type">Internal Company</InputLabel> */}
        <Box display="flex" flexDirection="column" gap={2}>
          <Stack direction="row" justifyContent="space-between" spacing={3} alignItems="center">
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

      {/* <Grid item xs={12} md={12}>
        <Typography variant="h4" color="primary" mb={4}>
          Sub-Company
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          {data?.subsidiaries?.map((item, index) => (
            <Stack direction="row" justifyContent="space-between" spacing={3} alignItems="center">
              <Box width="50%">
                <TextField
                  sx={{
                    width: '100%',
                  }}
                  label="Sub-Company Name"
                  value={item.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onChangeDivision(e, item?.id, 'name')
                  }
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
              <Box width="50%">
                <TextField
                  sx={{
                    width: '100%',
                  }}
                  label="Sub-Company Description"
                  value={item?.abbreviation}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onChangeDivisionNew(e, 'abbreviation')
                  }
                  InputProps={{
                    readOnly: true,
                  }}
                />
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
                <MenuItem onClick={() => onClickEditCompany(item?.id)}>
                  <Iconify icon="solar:pen-bold" />
                  Edit
                </MenuItem>
                <MenuItem
                  onClick={() => onClickRemove(item?.id, 'company')}
                  sx={{ color: 'error.main' }}
                >
                  <Iconify icon="solar:trash-bin-trash-bold" />
                  Delete
                </MenuItem>
              </MenuList>
            </Stack>
          ))}
          <Stack direction="row" justifyContent="space-between" spacing={3} alignItems="center">
            <Box width="50%">
              <TextField
                sx={{
                  width: '100%',
                }}
                label="Sub-Company Name"
                value={subCompany?.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onChangeSubCompanyNew(e, 'name')
                }
              />
            </Box>

            <Box width="50%">
              <TextField
                sx={{
                  width: '100%',
                }}
                // required
                label="Sub-Company Description"
                value={subCompany?.abbreviation}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onChangeSubCompanyNew(e, 'abbreviation')
                }
              />
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={onAddSubCompany}
              sx={{ marginY: 2 }}
            >
              Create Sub-Company
            </Button>
          </Stack>
        </Box>
      </Grid> */}

      <Grid item xs={12} md={12}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" color="primary" mb={2}>
            Client Sub Company
          </Typography>

          <Button onClick={onAddSubCompany} variant="contained" color="primary">
            <IconButton aria-label="Create Client Sub Company" size="small" sx={{ color: 'white' }}>
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
                          (subCompanies[index].internalCompany || []).includes(
                            internalCompany.id as never
                          )
                        )}
                        onChange={(event, newValue) => {
                          handleChangeSubCompany(
                            {
                              target: {
                                name: 'internalCompany',
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
                  startIcon={<Icon icon="solar:trash-bin-trash-bold" width="20" height="20" />}
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
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </Box>
    </Grid>
  );
}

export function EditClientCompanyView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, refetch } = useCompanyById(Number(id));
  const { mutate: addSubCompany } = useAddCompany();
  const { mutate: updateCompany } = useUpdateCompany(true);
  const { mutate: deleteCompany } = useDeleteCompanyById();
  const { mutate: deleteDivision } = useDeleteDivisionItem(Number(id));
  const { mutate: addDivision } = useAddDivision();
  const { mutate: updateDivision } = useUpdateDivision();
  const { mutate: addCompanyRelation } = useAddCompanyRelation();
  const { mutate: updateCompanyRelation } = useUpdateCompanyRelation();
  const { mutate: deleteCompanyRelation } = useDeleteCompanyRelation();
  const [openRemoveModal, setOpenRemoveModal] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<number | undefined>();
  const { data: internalCompanies } = useInternalCompanies();
  // Division
  const [departments, setDepartments] = React.useState(data?.department ?? []);
  const [department, setDepartment] = React.useState<Partial<Department>>({
    name: '',
    is_show_all: false,
  });

  const [subCompanies, setSubCompanies] = React.useState([
    {
      name: '',
      abbreviation: '',
      image: '',
      internalCompany: null,
    },
  ]);
  const [subCompany, setSubCompany] = React.useState({
    name: '',
    abbreviation: '',
  });
  const [deleteType, setDeleteType] = React.useState('');

  const defaultValues: ClientCompanyValues = {
    name: data?.name,
    abbreviation: data?.abbreviation,
    department: data?.department ?? [],
    image: data?.image,
    subsidiaries: data?.subsidiaries ?? [],
    vendors: data?.vendors ?? [],
    internal_id: data?.vendors?.map((item) => item.internal_company_id) || [],
  };

  const onAddDepartment = () => {
    addDivision({
      name: department?.name,
      is_show_all: department?.is_show_all,
      company_id: data?.id,
    });
    setDepartment({
      name: '',
      is_show_all: false,
    });
  };

  const onAddSubCompany = () => {
    if (subCompany.name === '') {
      toast.error('Please fill out Sub-company name!');
    } else if (subCompany.abbreviation === '') {
      toast.error('Please fill out Sub-company description!');
    } else {
      addSubCompany({
        name: subCompany?.name,
        abbreviation: subCompany?.abbreviation,
        parent_id: id?.toString(),
        type: 'subsidiary',
      });
      setSubCompany({
        name: '',
        abbreviation: '',
      });
    }
  };

  const onClickRemove = (itemId?: number, type?: string) => {
    if (itemId) setSelectedId(itemId);
    if (type) setDeleteType(type);
    setOpenRemoveModal(true);
  };

  const onRemove = () => {
    if (deleteType === 'division') {
      deleteDivision(selectedId ?? 0);
    } else {
      deleteCompany(selectedId ?? 0);
    }
    setDeleteType('');
    setOpenRemoveModal(false);
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

  const handleSubmit = (formData: CompanyDTO) => {
    const payload = {
      ...formData,
      cito_quota: data?.cito_quota,
      id: Number(id),
      type: 'holding',
    };
    if (defaultValues?.image) {
      Object.assign(payload, {
        image: defaultValues?.image,
      });
    }
    updateCompany(payload);
  };

  React.useEffect(() => {
    setDepartments(data?.department ?? []);
  }, [data]);

  const onChangeDivision = (
    e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<boolean>,
    itemId: number,
    type: string
  ) => {
    if (type === 'name') {
      setDepartments((prevDepartments) => {
        const updatedDeparments = [...prevDepartments];
        // Update the string at the specified index
        const index = updatedDeparments?.findIndex((item) => item?.id === itemId);
        updatedDeparments[index].name = e.target.value as string;
        return updatedDeparments;
      });
    } else {
      setDepartments((prevDepartments) => {
        const updatedDeparments = [...prevDepartments];
        // Update the string at the specified index
        const index = updatedDeparments?.findIndex((item) => item?.id === itemId);
        updatedDeparments[index].is_show_all = e.target.value as boolean;
        return updatedDeparments;
      });
    }
  };

  const onChangeDivisionNew = (
    e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<boolean>,
    type: string
  ) => {
    if (type === 'name') {
      setDepartment({
        ...department,
        name: e.target.value as string,
      });
    } else {
      setDepartment({
        ...department,
        is_show_all: e.target.value as boolean,
      });
    }
  };

  const onChangeSubCompanyNew = (
    e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<boolean>,
    type: string
  ) => {
    if (type === 'name') {
      setSubCompany({
        ...subCompany,
        name: e.target.value as string,
      });
    } else {
      setSubCompany({
        ...subCompany,
        abbreviation: e.target.value as string,
      });
    }
  };

  const onClickDelete = async (divisionId: number) => {
    deleteDivision(divisionId);
  };

  const onClickEditCompany = (companyId: number) => {
    navigate(`/client-company/companies/${id}/${companyId}/edit`);
  };

  const onClickEdit = async (value: string, type: boolean, divisionId: number) => {
    updateDivision({
      name: value,
      id: divisionId,
      company_id: Number(id),
      is_show_all: type,
    });
  };

  const onAddVendors = (internal_id: number) => {
    addCompanyRelation({
      client_company_id: Number(id),
      internal_company_id: internal_id,
    });
    refetch();
  };

  const onChangeVendors = (id_relation: number, internal_id: number) => {
    updateCompanyRelation({
      client_company_id: Number(id),
      internal_company_id: internal_id,
      id_relation,
    });
    refetch();
  };

  const onRemoveVendors = (id_relation: number) => {
    deleteCompanyRelation(id_relation);
    refetch();
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
            defaultValues: {
              ...defaultValues,
            },
          }}
        >
          {({ register, control, formState, setValue, watch }) => (
            <EditForm
              register={register}
              control={control}
              formState={formState}
              setValue={setValue}
              data={data}
              defaultValues={defaultValues}
              department={department}
              departments={departments}
              onAddDepartment={onAddDepartment}
              onChangeDivision={onChangeDivision}
              onChangeDivisionNew={onChangeDivisionNew}
              onClickDelete={onClickDelete}
              onClickEdit={onClickEdit}
              onClickRemove={onClickRemove}
              onChangeSubCompanyNew={onChangeSubCompanyNew}
              subCompany={subCompany}
              subCompanies={subCompanies}
              onAddSubCompany={onAddSubCompany}
              onClickEditCompany={onClickEditCompany}
              watch={watch}
              internalCompanies={internalCompanies}
              onChangeVendors={onChangeVendors}
              onAddVendors={onAddVendors}
              onRemoveVendors={onRemoveVendors}
              handleChangeSubCompany={handleChangeSubCompany}
              onDeleteSubCompany={onDeleteSubCompany}
            />
          )}
        </Form>
      </Grid>

      <RemoveAction
        onRemove={onRemove}
        openRemoveModal={openRemoveModal}
        setOpenRemoveModal={setOpenRemoveModal}
      />
    </DashboardContent>
  );
}
