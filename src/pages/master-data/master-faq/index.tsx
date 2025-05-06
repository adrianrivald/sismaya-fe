import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { Iconify } from 'src/components/iconify';
import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { useState } from 'react';
import { SvgColor } from 'src/components/svg-color';
import { useNavigate } from 'react-router-dom';
import { DialogArrange } from './DialogArrange';

export default function MasterFaqPage() {
  const [dialogArrange, setDialogArrange] = useState({ isOpen: false });
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [search, setSearch] = useState('');
  const navigation = useNavigate();
  return (
    <>
      <Helmet>
        <title> {`Master FAQ - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content="The starting point for your next project with Minimal UI Kit, built on the newest version of Material-UI ©, ready to be customized to your style"
        />
        <meta name="keywords" content="react,material,kit,application,dashboard,admin,template" />
      </Helmet>
      <DashboardContent maxWidth="xl">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
              Master FAQ
            </Typography>
            <Box display="flex" gap={2} sx={{ mb: { xs: 3, md: 5 } }}>
              <Typography>Master Data</Typography>
              <Typography color="grey.500">•</Typography>
              <Typography color="grey.500">FAQ</Typography>
            </Box>
          </Box>
          <Stack sx={{ flexDirection: 'row', gap: 1 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="material-symbols-light:add" />}
              onClick={() => {
                navigation('/master-faq/create');
              }}
            >
              Create FAQ
            </Button>
            <Button
              onClick={() => setDialogArrange({ isOpen: true })}
              variant="outlined"
              color="primary"
              startIcon={<Iconify icon="solar:sort-outline" />}
            >
              Arrange FAQ Order
            </Button>
          </Stack>
        </Box>
        <Card>
          <CardContent>
            <Grid container rowSpacing={3} columnSpacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mt: 3 }}>
                  <TextField
                    sx={{ width: '100%' }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SvgColor width={18} height={24} src="/assets/icons/ic-search.svg" />
                        </InputAdornment>
                      ),
                    }}
                    value={search}
                    placeholder="Search..."
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mt: 3 }}>
                  <InputLabel id="select-product">Product</InputLabel>
                  <Select
                    fullWidth
                    labelId="select-product"
                    id="select-product"
                    value={selectedProduct}
                    label="Product"
                    onChange={(e) => {
                      setSelectedProduct(e.target.value);
                    }}
                    variant="outlined"
                  >
                    <MenuItem value="-" disabled selected>
                      Choose Product
                    </MenuItem>
                    <MenuItem value="all">All Products</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Typography>TBD Table</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <DialogArrange
          open={dialogArrange.isOpen}
          onClose={() => setDialogArrange({ isOpen: false })}
        />
      </DashboardContent>
    </>
  );
}
