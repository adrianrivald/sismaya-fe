import { Suspense, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
  useParams,
} from 'react-router-dom';
import {
  Box,
  Stack,
  CircularProgress as Loader,
  Typography,
  TextField,
  InputAdornment,
  MenuItem,
} from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import * as Tab from 'src/components/tabs';
import { useAuth } from 'src/sections/auth/providers/auth';
import { useProductByCompanyId } from 'src/services/master-data/company';
import { useSearchDebounce } from 'src/utils/hooks/use-debounce';

// ----------------------------------------------------------------------

export default function TaskLayout() {
  const navigate = useNavigate();
  const lastPath = useLocation().pathname.split('/').pop();
  const currentTab = lastPath === 'task' ? 'kanban' : lastPath;
  const [searchParams, setSearchParams] = useSearchParams();
  const { vendor } = useParams();

  const { user } = useAuth();
  const { data: products = [] } = useProductByCompanyId(user?.user_info?.company_id);

  const [search, setSearch] = useSearchDebounce();
  useEffect(() => {
    if (search.length > 0) {
      setSearchParams({ search }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [search, setSearchParams]);

  return (
    <DashboardContent maxWidth="xl">
      <Helmet>
        <title>Task Management - {CONFIG.appName}</title>
      </Helmet>

      <Stack spacing={3}>
        <Box
          component="section"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          aria-label="page header"
        >
          <Stack spacing={1}>
            <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
              Task Management
            </Typography>

            <Box display="flex" gap={2}>
              <Typography component={Link} to="/" sx={{ textDecoration: 'none', color: 'inherit' }}>
                Dashboard
              </Typography>
              <Typography color="grey.500">•</Typography>
              <Typography color="grey.500">Task Management</Typography>
            </Box>
          </Stack>

          <Box width="30%">
            <Tab.Root
              defaultValue={currentTab}
              value={currentTab}
              onChange={(_, value) => navigate(`/${vendor}/task/${value}`, { replace: true })}
            >
              <Tab.List>
                <Tab.Item value="kanban">Kanban View</Tab.Item>
                <Tab.Item value="list">List View</Tab.Item>
              </Tab.List>
            </Tab.Root>
          </Box>
        </Box>

        <Stack spacing={2.5}>
          <Stack spacing={3} direction={{ xs: 'column', md: 'row' }} alignItems="center">
            <TextField
              select
              label="Product"
              defaultValue="all"
              sx={{ width: { xs: '100%', md: 350 } }}
              value={searchParams.get('productId') || 'all'}
              onChange={(e) => setSearchParams({ productId: e.target.value }, { replace: true })}
            >
              <MenuItem value="all">All</MenuItem>
              {products?.map((product) => <MenuItem value={product.id}>{product.name}</MenuItem>)}
            </TextField>

            <TextField
              fullWidth
              placeholder="Search..."
              sx={{ flexGrow: 1 }}
              defaultValue={searchParams.get('search') || ''}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="solar:magnifer-linear" />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          <Suspense
            fallback={
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 400,
                }}
              >
                <Loader />
              </Box>
            }
          >
            <Outlet />
          </Suspense>
        </Stack>
      </Stack>
    </DashboardContent>
  );
}
