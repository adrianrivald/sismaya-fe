import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('src/pages/home'));
export const RequestDetailPage = lazy(() => import('src/pages/request/request-detail'));

// Master Data

// Internal Company
export const InternalCompanyListPage = lazy(
  () => import('src/pages/master-data/internal-company/list')
);
export const InternalCompanyCreatePage = lazy(
  () => import('src/pages/master-data/internal-company/create')
);
export const InternalCompanyEditPage = lazy(
  () => import('src/pages/master-data/internal-company/edit')
);

// Client Company
export const ClientCompanyListPage = lazy(
  () => import('src/pages/master-data/client-company/list')
);
export const ClientCompanyCreatePage = lazy(
  () => import('src/pages/master-data/client-company/create')
);
export const ClientCompanyEditPage = lazy(
  () => import('src/pages/master-data/client-company/edit')
);

// User
export const UserListPage = lazy(() => import('src/pages/master-data/user/list'));
export const UserCreatePage = lazy(() => import('src/pages/master-data/user/create'));
export const UserEditPage = lazy(() => import('src/pages/master-data/user/edit'));

export const BlogPage = lazy(() => import('src/pages/blog'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export function Router() {
  return useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense fallback={renderFallback}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <HomePage />, index: true },
        { path: 'request/:id', element: <RequestDetailPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },

        // Master Data
        // Internal Company
        { path: 'internal-company', element: <InternalCompanyListPage /> },
        { path: 'internal-company/create', element: <InternalCompanyCreatePage /> },
        { path: 'internal-company/:id/edit', element: <InternalCompanyEditPage /> },
        // Client Company
        { path: 'client-company', element: <ClientCompanyListPage /> },
        { path: 'client-company/create', element: <ClientCompanyCreatePage /> },
        { path: 'client-company/:id/edit', element: <ClientCompanyEditPage /> },
        // User
        { path: 'user', element: <UserListPage /> },
        { path: 'user/create', element: <UserCreatePage /> },
        { path: 'user/:id/edit', element: <UserEditPage /> },
      ],
    },
    {
      path: 'sign-in',
      element: (
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      ),
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
