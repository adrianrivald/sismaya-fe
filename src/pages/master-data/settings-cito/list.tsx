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
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { SvgColor } from 'src/components/svg-color';
import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import DialogAddCitoQuota from './components/add-cito-quota';
import DialogAddAdditionalCito from './components/add-additional-cito';
import DialogAddInitialCito from './components/add-initial-cito';

export default function SettingCitoList() {
  const [form, setForm] = useState({
    search: '',
    company_type: 'all',
    cito_type: 'all',
  });

  const [openAdditionalQuota, setOpenAdditionalQuota] = useState({
    isOpen: false,
    id: '',
    index: 0,
  });
  const [openInitialQuota, setOpenInitialQuota] = useState({ isOpen: false, id: '', index: 0 });
  const [openCitoQuota, setOpenCitoQuota] = useState({ isOpen: false, id: '', index: 0 });

  return (
    <div>
      <Helmet>
        <title> {`Settings Cito - ${CONFIG.appName}`}</title>
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
              Master Setting Cito
            </Typography>
            <Box display="flex" gap={2} sx={{ mb: { xs: 3, md: 5 } }}>
              <Typography>Master Data</Typography>
              <Typography color="grey.500">•</Typography>
              <Typography color="grey.500">Setting Cito</Typography>
            </Box>
          </Box>
        </Box>
        <Card>
          <CardContent>
            <Grid container rowSpacing={3} columnSpacing={2} mb={3}>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth sx={{ mt: 3 }}>
                  <InputLabel id="select-company">Company Type</InputLabel>
                  <Select
                    value={form.company_type}
                    defaultValue="all"
                    fullWidth
                    placeholder="All"
                    onChange={(e: SelectChangeEvent<any>) => {
                      setForm({ ...form, company_type: e.target.value });
                    }}
                  >
                    <MenuItem value="all" selected>
                      All
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth sx={{ mt: 3 }}>
                  <InputLabel id="select-company">Cito Type</InputLabel>
                  <Select
                    value={form.cito_type}
                    defaultValue="all"
                    fullWidth
                    placeholder="All"
                    onChange={(e: SelectChangeEvent<any>) => {
                      setForm({ ...form, cito_type: e.target.value });
                    }}
                  >
                    <MenuItem value="all" selected>
                      All
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
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
                    value={form.search}
                    placeholder="Search..."
                    onChange={(e) => setForm({ ...form, search: e.target.value })}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>

          <Button
            onClick={() => {
              setOpenCitoQuota({ isOpen: true, id: '', index: 0 });
            }}
          >
            Add cito quota
          </Button>
        </Card>
      </DashboardContent>

      <DialogAddCitoQuota
        open={openCitoQuota.isOpen}
        onClose={() => {
          setOpenCitoQuota({ isOpen: false, id: '', index: 0 });
        }}
        id={openCitoQuota.id}
        onClick={(type: string, id: string) => {
          setOpenCitoQuota({ isOpen: false, id: '', index: 0 });
          setTimeout(() => {
            if (type === 'additional') {
              setOpenAdditionalQuota({ isOpen: true, id, index: 0 });
            } else {
              setOpenInitialQuota({ isOpen: true, id, index: 0 });
            }
          }, 500);
        }}
      />

      <DialogAddAdditionalCito
        open={openAdditionalQuota.isOpen}
        onClose={() => {
          setOpenAdditionalQuota({ isOpen: false, id: '', index: 0 });
        }}
      />
      <DialogAddInitialCito
        open={openInitialQuota.isOpen}
        onClose={() => {
          setOpenInitialQuota({ isOpen: false, id: '', index: 0 });
        }}
      />
    </div>
  );
}
