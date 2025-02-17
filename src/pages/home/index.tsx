import { Box, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { useAuth } from 'src/sections/auth/providers/auth';

// ----------------------------------------------------------------------

export default function HomePage() {
  const { user } = useAuth();
  return (
    <>
      <Helmet>
        <title> {`Dashboard - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content="The starting point for your next project with Minimal UI Kit, built on the newest version of Material-UI ©, ready to be customized to your style"
        />
        <meta name="keywords" content="react,material,kit,application,dashboard,admin,template" />
      </Helmet>

      <Box display="flex" justifyContent="center">
        <Typography fontWeight="bold" fontSize={36}>
          Welcome, {user?.user_info?.name}
        </Typography>
      </Box>
    </>
  );
}
