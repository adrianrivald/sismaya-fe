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
} from '@mui/material';

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
  subCompanies: Company[];
  onAddDepartment: () => void;
  onAddSubCompany: () => void;
  onClickRemove: (id: number, type: string) => void;
  watch: any;
  internalCompanies: Company[] | undefined;
  onChangeVendors: any;
  onAddVendors: any;
  onRemoveVendors: any;
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
        <Typography variant="h4" color="primary" mb={4}>
          Division
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          {data?.department?.map((item, index) => (
            <Stack direction="row" justifyContent="space-between" spacing={3} alignItems="center">
              <Box width="50%">
                <TextField
                  sx={{
                    width: '100%',
                  }}
                  label="Division"
                  value={item.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onChangeDivision(e, item?.id, 'name')
                  }
                  // InputProps={{
                  //   readOnly: true,
                  // }}
                />
              </Box>
              <Box width="50%">
                <FormControl fullWidth>
                  <InputLabel id="type">Show Type</InputLabel>
                  <Select
                    label="Type"
                    value={item?.is_show_all}
                    onChange={(e: SelectChangeEvent<boolean>) =>
                      onChangeDivision(e, item?.id, 'type')
                    }
                  >
                    <MenuItem value="true">Show all division</MenuItem>
                    <MenuItem value="false">Only show this division</MenuItem>
                  </Select>
                </FormControl>
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
                  onClick={() =>
                    onClickEdit(departments[index].name, departments[index].is_show_all, item?.id)
                  }
                >
                  <Iconify icon="solar:pen-bold" />
                  Edit
                </MenuItem>
                <MenuItem
                  onClick={() => onClickRemove(item?.id, 'division')}
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
                label="Division"
                value={department?.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onChangeDivisionNew(e, 'name')
                }
              />
            </Box>

            <Box width="50%">
              <FormControl fullWidth>
                <InputLabel id="type">Show Type</InputLabel>
                <Select
                  label="Type"
                  value={department?.is_show_all}
                  onChange={(e: SelectChangeEvent<boolean>) => onChangeDivisionNew(e, 'type')}
                >
                  <MenuItem value="true">Show all division</MenuItem>
                  <MenuItem value="false">Only show this division</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={onAddDepartment}
              sx={{ marginY: 2 }}
            >
              Save
            </Button>
          </Stack>
        </Box>
      </Grid>

      <Grid item xs={12} md={12}>
        <Typography variant="h4" color="primary" mb={2}>
          Internal Company
        </Typography>

        {/* <InputLabel id="demo-simple-select-outlined-label-type">Internal Company</InputLabel> */}
        <Box display="flex" flexDirection="column" gap={2}>
          {data?.vendors &&
            data?.vendors?.length > 0 &&
            data?.vendors?.map((item, index) => (
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
                      value={item?.internal_company_id}
                      fullWidth
                      onChange={(e: SelectChangeEvent<number>) => {
                        onChangeVendors(item.id, item.internal_company_id);
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
                    <MenuItem onClick={() => onRemoveVendors(item.id)} sx={{ color: 'error.main' }}>
                      <Iconify icon="solar:trash-bin-trash-bold" />
                      Delete
                    </MenuItem>
                  </MenuList>
                </Stack>
              </FormControl>
            ))}
          <Stack direction="row" justifyContent="space-between" spacing={3} alignItems="center">
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
                  onAddVendors(internalCompanyId);
                  setInternalCompanyId(0);
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
  const { mutate: updateCompany } = useUpdateCompany();
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

  const [subCompanies, setSubCompanies] = React.useState([]);
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
    navigate(`/client-company/${id}/${companyId}/edit`);
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
