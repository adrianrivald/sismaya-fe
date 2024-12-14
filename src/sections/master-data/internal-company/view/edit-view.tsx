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
} from '@mui/material';

import { _tasks, _posts, _timeline, _users, _projects } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { Form } from 'src/components/form/form';
import React from 'react';
import { API_URL } from 'src/constants';
import { FieldDropzone } from 'src/components/form';

const categories = ['Cat 1', 'Cat 2', 'Cat 3', 'Cat 4', 'Cat 5'];
const products = ['Product 1', 'Product 2', 'Product 3', 'Product 4', 'Product 5'];

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
function getStyles(name: string, selectedCat: readonly string[], theme: Theme) {
  return {
    fontWeight:
      selectedCat.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

function getStylesProduct(name: string, selectedProduct: readonly string[], theme: Theme) {
  return {
    fontWeight:
      selectedProduct.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export function EditInternalCompanyView() {
  console.log(API_URL, 'API URL');
  const theme = useTheme();
  const defaultDummyData = {
    name: 'Test Name',
    description: 'Test desc',
    status: 'todo',
    category: ['Cat 1', 'Cat 2'],
    product: ['Product 2', 'Product 4'],
  };
  const [selectedCat, setSelectedCat] = React.useState<string[]>(defaultDummyData?.category ?? []);
  const [selectedProduct, setSelectedProduct] = React.useState<string[]>(
    defaultDummyData?.product ?? []
  );

  const handleChange = (event: SelectChangeEvent<typeof selectedCat>) => {
    const {
      target: { value },
    } = event;
    setSelectedCat(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const handleChangeProduct = (event: SelectChangeEvent<typeof selectedProduct>) => {
    const {
      target: { value },
    } = event;
    setSelectedProduct(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const handleSubmit = (formData: any) => {
    console.log(formData, 'test');
  };
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
        Internal Company
      </Typography>
      <Box display="flex" gap={2} sx={{ mb: { xs: 3, md: 5 } }}>
        <Typography>Master Data</Typography>
        <Typography color="grey.500">•</Typography>
        <Typography color="grey.500">Internal Company</Typography>
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
          {({ register, control, formState }) => (
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
                  error={Boolean(formState?.errors?.description)}
                  multiline
                  sx={{
                    width: '100%',
                  }}
                  label="Deskripsi"
                  rows={4}
                  {...register('description', {
                    required: 'Deskripsi must be filled out',
                  })}
                />
                {formState?.errors?.description && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {String(formState?.errors?.description?.message)}
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
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  spacing={3}
                  alignItems="center"
                >
                  <Box width="50%">
                    <FormControl fullWidth>
                      <InputLabel id="status">Status</InputLabel>
                      <Select
                        error={Boolean(formState?.errors?.status)}
                        {...register('status', {
                          required: 'Status must be filled out',
                        })}
                        label="Status"
                        value="todo"
                        // onChange={handleChange}
                      >
                        <MenuItem value="todo">Todo</MenuItem>
                        <MenuItem value="in-progress">In Progress</MenuItem>
                        <MenuItem value="done">Done</MenuItem>
                      </Select>
                    </FormControl>
                    {formState?.errors?.status && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {String(formState?.errors?.status?.message)}
                      </FormHelperText>
                    )}
                  </Box>

                  <Box width="50%">
                    <FormControl fullWidth>
                      <InputLabel id="category">Kategori</InputLabel>
                      <Select
                        error={Boolean(formState?.errors?.category)}
                        {...register('category', {
                          required: 'Kategori must be filled out',
                        })}
                        label="Kategori"
                        // onChange={handleChange}
                      >
                        <MenuItem value="cat1">Cat 1</MenuItem>
                        <MenuItem value="cat2">Cat 2</MenuItem>
                        <MenuItem value="cat3">Cat 3</MenuItem>
                      </Select>
                    </FormControl>
                    {formState?.errors?.category && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {String(formState?.errors?.category?.message)}
                      </FormHelperText>
                    )}
                  </Box>
                </Stack>
              </Grid>

              <Grid item xs={12} md={12}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-outlined-label-type">Kategori</InputLabel>
                  <Select
                    label="Kategori"
                    labelId="demo-simple-select-outlined-label-type"
                    id="category"
                    {...register('category', {
                      required: 'Kategori must be filled out',
                    })}
                    multiple
                    value={selectedCat}
                    onChange={handleChange}
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
                    {categories.map((name) => (
                      <MenuItem key={name} value={name} style={getStyles(name, selectedCat, theme)}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {formState?.errors?.category && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {String(formState?.errors?.category?.message)}
                  </FormHelperText>
                )}
              </Grid>

              <Grid item xs={12} md={12}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-outlined-label-type">Produk</InputLabel>
                  <Select
                    label="Produk"
                    labelId="demo-simple-select-outlined-label-type"
                    id="product"
                    {...register('product', {
                      required: 'Produk must be filled out',
                    })}
                    multiple
                    value={selectedProduct}
                    onChange={handleChangeProduct}
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
                    {products.map((name) => (
                      <MenuItem
                        key={name}
                        value={name}
                        style={getStyles(name, selectedProduct, theme)}
                      >
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {formState?.errors?.product && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {String(formState?.errors?.product?.message)}
                  </FormHelperText>
                )}
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
