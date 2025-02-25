import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes, type NonIndexRouteObject } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';

import { useAuth } from 'src/sections/auth/providers/auth';
import PageListTimer from 'src/sections/task/page-list-timer';

// ----------------------------------------------------------------------
export const HomePage = lazy(() => import('src/pages/home'));

export const DashboardInternalPage = lazy(() => import('src/pages/dashboard/dashboard-internal'));
export const DashboardClientPage = lazy(() => import('src/pages/dashboard/dashboard-client'));

// Request
export const RequestListPage = lazy(() => import('src/pages/request/list'));
export const RequestDetailLayout = lazy(() => import('src/sections/request/view/detail-layout'));
export const RequestDetailPage = lazy(() => import('src/pages/request/detail'));
export const RequestTaskPage = lazy(() => import('src/pages/request/task'));
export const RequestCreatePage = lazy(() => import('src/pages/request/create'));
export const RequestEditPage = lazy(() => import('src/pages/request/edit'));
export const UnresolvedCitoListPage = lazy(() => import('src/pages/request/unresolved-cito-list'));
export const CitoListPage = lazy(() => import('src/pages/request/cito-list'));
export const PendingListPage = lazy(() => import('src/pages/request/pending-list'));
export const FeedbackListPage = lazy(() => import('src/pages/request/feedback-list'));
export const RequestReviewPage = lazy(() => import('src/pages/request/review'));

// Task Management
export const TaskLayout = lazy(() => import('src/pages/task/layout'));
export const TaskListPage = lazy(() => import('src/pages/task/list'));
export const TaskKanbanPage = lazy(() => import('src/pages/task/kanban'));
export const TaskDetailPage = lazy(() => import('src/pages/task/detail'));

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

// Internal User
export const UserInternalListPage = lazy(
  () => import('src/pages/master-data/user/internal-user/list')
);
export const UserInternalCreatePage = lazy(
  () => import('src/pages/master-data/user/internal-user/create')
);
export const UserInternalEditPage = lazy(
  () => import('src/pages/master-data/user/internal-user/edit')
);

export const DashboardInternalCompanyPage = lazy(
  () => import('src/pages/dashboard/dashboard-internal/dashboard-company')
);

// Client
export const UserClientListPage = lazy(() => import('src/pages/master-data/user/client-user/list'));
export const UserClientCreatePage = lazy(
  () => import('src/pages/master-data/user/client-user/create')
);
export const UserClientEditPage = lazy(() => import('src/pages/master-data/user/client-user/edit'));

// Monitor Personal Load
export const MonitorPersonalLoadPage = lazy(() => import('src/pages/monitor-personal-load/index'));

// Auto Reponse
export const AutoResponsePage = lazy(() => import('src/pages/auto-response/index'));

// Access Control
export const AccessControlUserListPage = lazy(() => import('src/pages/access-control/user-list'));
export const AccessControlUserListEditPage = lazy(
  () => import('src/pages/access-control/user-list/edit')
);
export const AccessControlUserListCreatePage = lazy(
  () => import('src/pages/access-control/user-list/create')
);

export const AccessControlUserGroupPage = lazy(() => import('src/pages/access-control/user-group'));
export const AccessControlUserGroupCreatePage = lazy(
  () => import('src/pages/access-control/user-group/create')
);
export const AccessControlUserGroupEditPage = lazy(
  () => import('src/pages/access-control/user-group/edit')
);

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

const superAdminRoutes: NonIndexRouteObject = {
  children: [
    { element: <HomePage />, index: true },
    { path: 'dashboard', element: <DashboardInternalPage /> },

    // Master Data
    // Internal Company
    { path: 'internal-company', element: <InternalCompanyListPage /> },
    { path: 'internal-company/create', element: <InternalCompanyCreatePage /> },
    { path: 'internal-company/:id/edit', element: <InternalCompanyEditPage /> },
    // Client Company
    { path: 'client-company', element: <ClientCompanyListPage /> },
    { path: 'client-company/create', element: <ClientCompanyCreatePage /> },
    { path: 'client-company/:id/edit', element: <ClientCompanyEditPage /> },
    // Internal User
    { path: 'internal-user', element: <UserInternalListPage /> },
    { path: 'internal-user/create', element: <UserInternalCreatePage /> },
    { path: 'internal-user/:id/edit', element: <UserInternalEditPage /> },

    // Internal User
    { path: 'client-user', element: <UserClientListPage /> },
    { path: 'client-user/create', element: <UserClientCreatePage /> },
    { path: 'client-user/:id/edit', element: <UserClientEditPage /> },

    // Access Control User List
    { path: 'access-control/user-list', element: <AccessControlUserListPage /> },
    { path: 'access-control/user-list/:id/edit', element: <AccessControlUserListEditPage /> },
    { path: 'access-control/user-list/create', element: <AccessControlUserListCreatePage /> },

    { path: 'access-control/user-group', element: <AccessControlUserGroupPage /> },
    { path: 'access-control/user-group/create', element: <AccessControlUserGroupCreatePage /> },
    { path: 'access-control/user-group/:id/edit', element: <AccessControlUserGroupEditPage /> },
  ],
};

const internalRoutes: NonIndexRouteObject = {
  children: [
    { element: <HomePage />, index: true },
    { path: 'dashboard', element: <DashboardInternalPage /> },

    // Request
    { path: '/:vendor/request', element: <RequestListPage /> },
    { path: '/:vendor/request/unresolved-cito', element: <UnresolvedCitoListPage /> },
    { path: '/request/cito', element: <CitoListPage /> },
    { path: '/:vendor/request/pending', element: <PendingListPage /> },
    { path: '/:vendor/request/feedback', element: <FeedbackListPage /> },
    {
      path: '/:vendor/request/:id',
      element: <RequestDetailLayout />,
      children: [
        { index: true, element: <RequestDetailPage /> },
        { path: 'task', element: <RequestTaskPage /> },
      ],
    },
    { path: '/:vendor/request/create', element: <RequestCreatePage /> },
    { path: '/:vendor/request/:id/edit', element: <RequestEditPage /> },
    { path: '/:vendor/dashboard', element: <DashboardInternalCompanyPage /> },

    // Task Management
    {
      path: '/:vendor/task',
      element: <TaskLayout />,
      children: [
        { index: true, element: <TaskKanbanPage /> },
        { path: '/:vendor/task/list', element: <TaskListPage /> },
        { path: '/:vendor/task/kanban', element: <TaskKanbanPage /> },
      ],
    },

    {
      path: '/:vendor/task/:taskId',
      element: <TaskDetailPage />,
    },
    {
      path: '/:vendor/task/:taskId/activities',
      element: <PageListTimer />,
    },

    // Monitor Personal Load

    {
      path: '/monitor-personal-load',
      element: <MonitorPersonalLoadPage />,
    },

    // Access Control User List
    { path: 'access-control/user-list', element: <AccessControlUserListPage /> },
    { path: 'access-control/user-list/:id/edit', element: <AccessControlUserListEditPage /> },
    { path: 'access-control/user-list/create', element: <AccessControlUserListCreatePage /> },

    { path: 'access-control/user-group', element: <AccessControlUserGroupPage /> },
    { path: 'access-control/user-group/create', element: <AccessControlUserGroupCreatePage /> },
    { path: 'access-control/user-group/:id/edit', element: <AccessControlUserGroupEditPage /> },

    // Auto Reponse
    { path: '/:vendor/auto-response', element: <AutoResponsePage /> },
  ],
};

const clientRoutes: NonIndexRouteObject = {
  children: [
    { element: <HomePage />, index: true },
    { path: 'dashboard', element: <DashboardClientPage /> },

    // Request
    { path: '/:vendor/request', element: <RequestListPage /> },
    { path: '/request/unresolved-cito', element: <UnresolvedCitoListPage /> },
    { path: '/request/cito', element: <CitoListPage /> },
    { path: '/request/pending', element: <PendingListPage /> },
    {
      path: '/:vendor/request/:id',
      element: <RequestDetailLayout />,
      children: [
        { index: true, element: <RequestDetailPage /> },
        { path: 'task', element: <RequestTaskPage /> },
      ],
    },
    { path: '/:vendor/request/create', element: <RequestCreatePage /> },
    { path: '/:vendor/request/:id/edit', element: <RequestEditPage /> },
    { path: '/:vendor/request/:id/review', element: <RequestReviewPage /> },
  ],
};

export function Router() {
  const { user } = useAuth();
  const role = user?.user_info?.role_id;
  const type = user?.user_info?.user_type;
  const isSuperAdmin = role === 1;
  const isClient = type === 'client';
  const isInternal = type === 'internal';

  const routingCondition = () => {
    if (isSuperAdmin) return superAdminRoutes;
    if (isClient) return clientRoutes;
    if (isInternal) return internalRoutes;

    return superAdminRoutes;
    // switch (role) {
    //   case 1:
    //     return superAdminRoutes;
    //   case 6:
    //     return clientRoutes;

    //   default:
    //     return superAdminRoutes;
    // }
  };

  return useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense fallback={renderFallback}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      ...routingCondition(),
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
