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

const divisions = ['Div 1', 'Div 2', 'Div 3', 'Div 4', 'Div 5'];

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
function getStyles(name: string, selectedDiv: readonly string[], theme: Theme) {
  return {
    fontWeight:
      selectedDiv.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export function EditClientCompanyView() {
  console.log(API_URL, 'API URL');
  const theme = useTheme();
  const defaultDummyData = {
    name: 'Test nama',
    description: 'Test desc',
    division: ['Div 1', 'Div 2'],
  };
  const [selectedDiv, setSelectedDiv] = React.useState<string[]>(defaultDummyData?.division ?? []);

  const handleChange = (
    event: SelectChangeEvent<typeof selectedDiv>,
    setValue: UseFormSetValue<any>
  ) => {
    const {
      target: { value },
    } = event;
    setSelectedDiv(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
    setValue('division', typeof value === 'string' ? value.split(',') : value);
  };

  const handleSubmit = (formData: any) => {
    console.log(formData, 'test');
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
              ...defaultDummyData,
            },
          }}
        >
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
                      Upload Foto
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

                <Grid item xs={12} md={12}>
                  <FormControl fullWidth>
                    <InputLabel id="client-division-select">Client Division</InputLabel>
                    <Select
                      error={Boolean(formState?.errors?.division)}
                      label="Client Division"
                      labelId="client-division-select"
                      id="division"
                      {...register('division', {
                        required: 'Division must be filled out',
                      })}
                      multiple
                      value={selectedDiv}
                      onChange={(e) => handleChange(e, setValue)}
                      input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                      MenuProps={MenuProps}
                    >
                      {divisions.map((name) => (
                        <MenuItem
                          key={name}
                          value={name}
                          style={getStyles(name, selectedDiv, theme)}
                        >
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                    {formState?.errors?.division && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {String(formState?.errors?.division?.message)}
                      </FormHelperText>
                    )}
                  </FormControl>
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
          }}
        </Form>
      </Grid>
    </DashboardContent>
  );
}
