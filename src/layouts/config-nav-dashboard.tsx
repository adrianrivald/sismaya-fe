import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

export interface Menus {
  isShownInRole?: number[];
  id?: string;
  isAccordion?: boolean;
  heading: string;
  icon?: React.ReactNode;
  list: any[];
  path?: string;
  permissionId?: number;
}

export const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);
interface ChildMenus {
  heading: string;
  path?: string;
}

export const generalMenus = (
  internalCompaniesDashboard?: ChildMenus[],
  internalCompaniesReport?: ChildMenus[],
  internalCompaniesFaq?: ChildMenus[],
  userType?: string
) => [
  {
    heading: 'Dashboard',
    id: 'dashboard',
    path: '/dashboard',
    icon: icon('ic-analytics'),
    list:
      userType === 'internal'
        ? internalCompaniesDashboard?.filter((item) => item?.heading !== undefined)
        : [],
  },
  ...(userType === 'internal'
    ? [
        {
          heading: 'Reports',
          id: 'report',
          // path: '/report/request',
          icon: icon('ic-file'),
          list:
            userType === 'internal'
              ? internalCompaniesReport?.filter((item) => item?.heading !== undefined)
              : [],
        },
      ]
    : []),
  ...(userType === 'client'
    ? [
        {
          heading: 'FAQ',
          id: 'dashboard',
          // path: '/faq',
          icon: icon('ic-file'),
          list: internalCompaniesFaq?.filter((item) => item?.heading !== undefined),
        },
      ]
    : []),
];

export const managementMenus = (
  internalCompaniesRequest?: ChildMenus[],
  internalCompaniesTask?: ChildMenus[]
) => [
  {
    heading: 'Request',
    id: 'request:read',
    icon: icon('ic-chat'),
    list: internalCompaniesRequest,
  },
  {
    heading: 'Task Management',
    id: 'task:read',
    icon: icon('ic-book'),
    list: internalCompaniesTask,
  },
];

export const settingMenus = (
  internalCompaniesAutoResponse?: ChildMenus[],
  internalCompaniesMasterData?: ChildMenus[],
  internalCompaniesMasterDataSuperAdmin?: ChildMenus[],
  clientCompaniesMasterDataSuperAdmin?: ChildMenus[],
  userRole?: number
) => [
  {
    heading: 'Auto-Reponse',
    id: 'chat',
    icon: icon('ic-chat'),
    list: internalCompaniesAutoResponse,
  },
  {
    heading: 'Access Control',
    id: 'user group:read',
    path: '/access-control/user-list',
    icon: icon('ic-authenticator'),
    list: [],
  },
  {
    heading: 'Master Data',
    id: 'master-data',
    icon: <Iconify icon="solar:database-bold" />,
    list:
      userRole === 2
        ? internalCompaniesMasterData
        : [
            {
              heading: 'Internal Company',
              list: internalCompaniesMasterDataSuperAdmin,
            },
            {
              heading: 'Client Company',
              list: clientCompaniesMasterDataSuperAdmin,
            },
            // {
            //   heading: 'Internal User',
            //   path: '/internal-user',
            // }, Moved to RBAC
            {
              heading: 'Client User',
              path: '/client-user',
            },
            {
              heading: 'Product Filter',
              path: '/product-filter',
            },
          ],
  },
];

export const masterDataMenus = () => [];

export const menuItems = (
  internalCompaniesDashboard?: ChildMenus[],
  internalCompaniesRequest?: ChildMenus[],
  internalCompaniesTask?: ChildMenus[],
  internalCompaniesAutoResponse?: ChildMenus[],
  internalCompaniesReport?: ChildMenus[],
  internalCompaniesMasterData?: ChildMenus[],
  internalCompaniesMasterDataSuperAdmin?: ChildMenus[],
  clientCompaniesMasterDataSuperAdmin?: ChildMenus[],
  internalCompaniesFaq?: ChildMenus[],
  userType?: string,
  userRole?: number
) => [
  ...(userRole !== 1
    ? [
        {
          heading: 'GENERAL',
          id: 'general',
          list: generalMenus(
            internalCompaniesDashboard,
            internalCompaniesReport,
            internalCompaniesFaq,
            userType
          ),
        },
      ]
    : []),
  {
    heading: 'MANAGEMENT',
    id: 'management',
    list: managementMenus(internalCompaniesRequest, internalCompaniesTask),
  },

  {
    heading: 'SETTINGS',
    id: 'settings',
    list: settingMenus(
      internalCompaniesAutoResponse,
      internalCompaniesMasterData,
      internalCompaniesMasterDataSuperAdmin,
      clientCompaniesMasterDataSuperAdmin,
      userRole
    ),
  },

  {
    heading: 'MASTER DATA',
    id: 'master-data',
    list: masterDataMenus(),
  },
];
