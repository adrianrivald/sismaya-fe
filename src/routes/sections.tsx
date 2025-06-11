import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes, type NonIndexRouteObject } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';

import { useAuth } from 'src/sections/auth/providers/auth';
import PageListTimer from 'src/sections/task/page-list-timer';
import MyRequestTask from 'src/sections/task/my-request';

// ----------------------------------------------------------------------
export const HomePage = lazy(() => import('src/pages/home'));

// Dashboard
export const DashboardInternalPage = lazy(() => import('src/pages/dashboard/dashboard-internal'));
export const DashboardClientPage = lazy(() => import('src/pages/dashboard/dashboard-client'));

// Report
export const ReportRequestPage = lazy(() => import('src/pages/report/request'));
export const ReportWorkAllocationPage = lazy(() => import('src/pages/report/work-allocation'));
export const ReportWorkPerformancePage = lazy(() => import('src/pages/report/work-performance'));

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

export const ClientSubCompanyEditPage = lazy(
  () => import('src/pages/master-data/client-company/edit-sub')
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

export const ProductFilterPage = lazy(() => import('src/pages/master-data/product-filter/list'));
export const ProductFilterLinkedPage = lazy(
  () => import('src/pages/master-data/product-filter/linked-list')
);
export const ProductFilterEditPage = lazy(
  () => import('src/pages/master-data/product-filter/edit')
);

export const CompanyRelationCreatePage = lazy(
  () => import('src/pages/master-data/product-filter/create')
);

export const BlogPage = lazy(() => import('src/pages/blog'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// MASTER FAQ
export const MasterFaqPage = lazy(() => import('src/pages/master-data/master-faq'));
export const MasterFaqCreatePage = lazy(() => import('src/pages/master-data/master-faq/create'));
export const FAQPage = lazy(() => import('src/pages/faq'));

// Master product
export const MasterProductPage = lazy(() => import('src/pages/master-data/master-product/list'));
export const MasterCreateProductPage = lazy(
  () => import('src/pages/master-data/master-product/create')
);

// Master category
export const MasterCategoryPage = lazy(() => import('src/pages/master-data/master-category/list'));
export const MasterCreateCategoryPage = lazy(
  () => import('src/pages/master-data/master-category/create')
);

// Master status
export const MasterStatusPage = lazy(() => import('src/pages/master-data/master-status/list'));
export const MasterCreateStatusPage = lazy(
  () => import('src/pages/master-data/master-status/create')
);
export const MasterEditStatusOrderPage = lazy(
  () => import('src/pages/master-data/master-status/sort')
);

// Master division
export const MasterDivisionPage = lazy(() => import('src/pages/master-data/master-division/list'));
export const MasterCreateDivisionPage = lazy(
  () => import('src/pages/master-data/master-division/create')
);

// Master title
export const MasterTitlePage = lazy(() => import('src/pages/master-data/master-title/list'));
export const MasterCreateTitlePage = lazy(
  () => import('src/pages/master-data/master-title/create')
);

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

    { path: 'report/request', element: <ReportRequestPage /> },
    { path: 'report/work-allocation', element: <ReportWorkAllocationPage /> },
    { path: 'report/work-performance', element: <ReportWorkPerformancePage /> },

    // Internal Company
    { path: 'internal-company/companies', element: <InternalCompanyListPage /> },
    { path: 'internal-company/companies/create', element: <InternalCompanyCreatePage /> },
    { path: 'internal-company/companies/:id/edit', element: <InternalCompanyEditPage /> },
    // { path: 'internal-company/companies', element: <InternalCompanyListPage /> },

    // Product
    { path: '/internal-company/product', element: <MasterProductPage /> },
    { path: '/internal-company/product/create', element: <MasterCreateProductPage /> },
    { path: '/internal-company/product/:id/edit', element: <MasterCreateProductPage /> },

    // FAQ
    { path: '/internal-company/master-faq', element: <MasterFaqPage /> },
    { path: '/internal-company/master-faq/create', element: <MasterFaqCreatePage /> },
    { path: '/internal-company/master-faq/:id/edit', element: <MasterFaqCreatePage /> },

    // Category
    { path: '/:vendor/category', element: <MasterCategoryPage /> },
    { path: '/:vendor/category/create', element: <MasterCreateCategoryPage /> },
    { path: '/:vendor/category/:id/edit', element: <MasterCreateCategoryPage /> },

    // Status
    { path: '/:vendor/status', element: <MasterStatusPage /> },
    { path: '/:vendor/status/create', element: <MasterCreateStatusPage /> },
    { path: '/:vendor/status/:id/edit', element: <MasterCreateStatusPage /> },
    { path: '/:vendor/status/sort', element: <MasterEditStatusOrderPage /> },

    // Division
    { path: '/:vendor/division', element: <MasterDivisionPage /> },
    { path: '/:vendor/division/create', element: <MasterCreateDivisionPage /> },
    { path: '/:vendor/division/:id/edit', element: <MasterCreateDivisionPage /> },

    // Title
    { path: '/:vendor/title', element: <MasterTitlePage /> },
    { path: '/:vendor/title/create', element: <MasterCreateTitlePage /> },
    { path: '/:vendor/title/:id/edit', element: <MasterCreateTitlePage /> },

    { path: 'internal-company/faq', element: <>Content Here</> },

    // Client Company
    { path: 'client-company/companies', element: <ClientCompanyListPage /> },
    { path: 'client-company/companies/create', element: <ClientCompanyCreatePage /> },
    { path: 'client-company/companies/:id/edit', element: <ClientCompanyEditPage /> },
    { path: 'client-company/companies/:id/:subId/edit', element: <ClientSubCompanyEditPage /> },

    // Internal User
    { path: 'internal-user', element: <UserInternalListPage /> },
    { path: 'internal-user/create', element: <UserInternalCreatePage /> },
    { path: 'internal-user/:id/edit', element: <UserInternalEditPage /> },

    // Client User
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

    { path: 'product-filter', element: <ProductFilterPage /> },
    { path: 'product-filter/:id', element: <ProductFilterLinkedPage /> },
    { path: 'product-filter/:id/:vendorId/edit', element: <ProductFilterEditPage /> },
    { path: 'product-filter/:id/create', element: <CompanyRelationCreatePage /> },

    // FAQ
    { path: 'master-faq', element: <MasterFaqPage /> },
    { path: 'master-faq/create', element: <MasterFaqCreatePage /> },
  ],
};

const internalRoutes: NonIndexRouteObject = {
  children: [
    { element: <HomePage />, index: true },
    { path: 'dashboard', element: <DashboardInternalPage /> },
    { path: 'faq', element: <FAQPage /> },

    // Report
    { path: '/:vendor/report/request', element: <ReportRequestPage /> },
    { path: '/:vendor/report/work-allocation', element: <ReportWorkAllocationPage /> },
    { path: '/:vendor/report/work-performance', element: <ReportWorkPerformancePage /> },
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
    { path: '/:vendor/faq', element: <FAQPage /> },

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
    {
      path: '/:vendor/my-request/:id',
      element: <MyRequestTask />,
    },

    // Monitor Personal Load

    {
      path: '/monitor-personal-load',
      element: <MonitorPersonalLoadPage />,
    },

    // Master Data
    // Internal Company
    { path: 'internal-company/companies', element: <InternalCompanyListPage /> },
    { path: 'internal-company/companies/create', element: <InternalCompanyCreatePage /> },
    { path: 'internal-company/companies/:id/edit', element: <InternalCompanyEditPage /> },
    // Client Company
    { path: 'client-company/companies', element: <ClientCompanyListPage /> },
    { path: 'client-company/companies/create', element: <ClientCompanyCreatePage /> },
    { path: 'client-company/companies/:id/edit', element: <ClientCompanyEditPage /> },
    { path: 'client-company/companies/:id/:subId/edit', element: <ClientSubCompanyEditPage /> },

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

    // Auto Reponse
    { path: '/:vendor/auto-response', element: <AutoResponsePage /> },

    // Admin Master Data
    // Product
    { path: '/:vendor/product', element: <MasterProductPage /> },
    { path: '/:vendor/product/create', element: <MasterCreateProductPage /> },
    { path: '/:vendor/product/:id/edit', element: <MasterCreateProductPage /> },

    // FAQ
    { path: '/:vendor/master-faq', element: <MasterFaqPage /> },
    { path: '/:vendor/master-faq/create', element: <MasterFaqCreatePage /> },
    { path: '/:vendor/master-faq/:id/edit', element: <MasterFaqCreatePage /> },

    // Category
    { path: '/:vendor/category', element: <MasterCategoryPage /> },
    { path: '/:vendor/category/create', element: <MasterCreateCategoryPage /> },
    { path: '/:vendor/category/:id/edit', element: <MasterCreateCategoryPage /> },

    // Status
    { path: '/:vendor/status', element: <MasterStatusPage /> },
    { path: '/:vendor/status/create', element: <MasterCreateStatusPage /> },
    { path: '/:vendor/status/:id/edit', element: <MasterCreateStatusPage /> },
    { path: '/:vendor/status/sort', element: <MasterEditStatusOrderPage /> },

    // Division
    { path: '/:vendor/division', element: <MasterDivisionPage /> },
    { path: '/:vendor/division/create', element: <MasterCreateDivisionPage /> },
    { path: '/:vendor/division/:id/edit', element: <MasterCreateDivisionPage /> },

    // Title
    { path: '/:vendor/title', element: <MasterTitlePage /> },
    { path: '/:vendor/title/create', element: <MasterCreateTitlePage /> },
    { path: '/:vendor/title/:id/edit', element: <MasterCreateTitlePage /> },
  ],
};

const clientRoutes: NonIndexRouteObject = {
  children: [
    { element: <HomePage />, index: true },
    { path: 'dashboard', element: <DashboardClientPage /> },
    { path: 'faq', element: <FAQPage /> },
    { path: '/:vendor/faq', element: <FAQPage /> },
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
