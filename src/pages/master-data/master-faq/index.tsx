import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { Iconify } from 'src/components/iconify';
import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { useState } from 'react';
import { DialogArrange } from './DialogArrange';

export default function MasterFaqPage() {
  const [dialogArrange, setDialogArrange] = useState({ isOpen: false });
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
        <Grid container spacing={3}>
          <Grid xs={12}>
            <Typography>TBD Table</Typography>
          </Grid>
        </Grid>

        <DialogArrange
          open={dialogArrange.isOpen}
          onClose={() => setDialogArrange({ isOpen: false })}
        />
      </DashboardContent>
    </>
  );
}
