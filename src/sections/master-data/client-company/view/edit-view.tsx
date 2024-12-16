import Typography from '@mui/material/Typography';
import {
  Box,
  Button,
  Chip,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  useTheme,
  Theme,
  MenuList,
  menuItemClasses,
} from '@mui/material';

import { _tasks, _posts, _timeline, _users, _projects } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { Form } from 'src/components/form/form';
import React, { useEffect } from 'react';
import { API_URL } from 'src/constants';
import { FieldDropzone } from 'src/components/form';
import { Bounce, toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useAddDivision,
  useCompanyById,
  useDeleteDivisionItem,
  useUpdateCompany,
  useUpdateDivision,
} from 'src/services/master-data/company';
import { Iconify } from 'src/components/iconify';

export function EditClientCompanyView() {
  const { id } = useParams();
  const { data } = useCompanyById(Number(id));
  const { mutate: updateCompany } = useUpdateCompany();
  const { mutate: deleteDivision } = useDeleteDivisionItem(Number(id));
  const { mutate: addDivision } = useAddDivision();
  const { mutate: updateDivision } = useUpdateDivision();
  const [departments, setDepartments] = React.useState(data?.department ?? []);
  const [department, setDepartment] = React.useState('');

  const defaultValues = {
    name: data?.name,
    abbreviation: data?.abbreviation,
    department: data?.department ?? [],
  };

  const onAddDepartment = () => {
    addDivision({
      name: department,
      company_id: data?.id,
    });
    setDepartment('');
  };

  const handleSubmit = (formData: any) => {
    updateCompany({
      ...formData,
      type: 'holding',
      id,
    });
  };

  React.useEffect(() => {
    setDepartments(data?.department ?? []);
  }, [data]);

  const onChangeDivision = (e: React.ChangeEvent<HTMLInputElement>, itemId: number) => {
    setDepartments((prevDepartments) => {
      const updatedDeparments = [...prevDepartments];
      // Update the string at the specified index
      const index = updatedDeparments?.findIndex((item) => item?.id === itemId);
      updatedDeparments[index].name = e.target.value;
      return updatedDeparments;
    });
  };

  const onChangeDivisionNew = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDepartment(e.target.value);
  };

  const onClickDelete = async (divisionId: number) => {
    await deleteDivision(divisionId);
  };

  const onClickEdit = async (value: string, divisionId: number) => {
    await updateDivision({
      name: value,
      id: divisionId,
      company_id: Number(id),
    });
  };

  useEffect(() => {
    console.log(departments, 'departments');
  }, [departments]);

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
          {({ register, control, watch, formState }) => (
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
                />
              </Grid>

              <Grid item xs={12} md={12}>
                <Typography variant="h4" color="primary" mb={4}>
                  Division
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  {data?.department?.map((item, index) => (
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      spacing={3}
                      alignItems="center"
                    >
                      <TextField
                        error={Boolean(formState?.errors?.division)}
                        sx={{
                          width: '100%',
                        }}
                        label="Division"
                        value={item.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          onChangeDivision(e, item?.id)
                        }
                        // InputProps={{
                        //   readOnly: true,
                        // }}
                      />

                      <MenuList
                        disablePadding
                        sx={{
                          p: 0.5,
                          gap: 0.5,
                          width: 140,
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
                        <MenuItem onClick={() => onClickEdit(departments[index].name, item?.id)}>
                          <Iconify icon="solar:pen-bold" />
                          Edit
                        </MenuItem>
                        <MenuItem
                          onClick={() => onClickDelete(item?.id)}
                          sx={{ color: 'error.main' }}
                        >
                          <Iconify icon="solar:trash-bin-trash-bold" />
                          Delete
                        </MenuItem>
                      </MenuList>
                      {formState?.errors?.division && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {String(formState?.errors?.division?.message)}
                        </FormHelperText>
                      )}
                    </Stack>
                  ))}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={3}
                    alignItems="center"
                  >
                    <TextField
                      error={Boolean(formState?.errors?.division)}
                      sx={{
                        width: '100%',
                      }}
                      label="Division"
                      value={department}
                      onChange={onChangeDivisionNew}
                    />
                    {formState?.errors?.division && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {String(formState?.errors?.division?.message)}
                      </FormHelperText>
                    )}
                  </Stack>
                </Box>
                <Button onClick={onAddDepartment} sx={{ marginY: 2 }}>
                  Add More
                </Button>
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
          )}
        </Form>
      </Grid>
    </DashboardContent>
  );
}
