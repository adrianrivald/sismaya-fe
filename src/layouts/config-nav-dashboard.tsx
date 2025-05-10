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
  isAdmin?: boolean
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
    list: isAdmin
      ? internalCompaniesMasterData
      : [
          {
            heading: 'Internal Company',
            path: '/internal-company',
          },
          {
            heading: 'Client Company',
            path: '/client-company',
          },
          {
            heading: 'Internal User',
            path: '/internal-user',
          },
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
  userType?: string,
  isAdmin?: boolean
) => [
  {
    heading: 'GENERAL',
    id: 'general',
    list: generalMenus(internalCompaniesDashboard, internalCompaniesReport, userType),
  },
  {
    heading: 'MANAGEMENT',
    id: 'management',
    list: managementMenus(internalCompaniesRequest, internalCompaniesTask),
  },

  {
    heading: 'SETTINGS',
    id: 'settings',
    list: settingMenus(internalCompaniesAutoResponse, internalCompaniesMasterData, isAdmin),
  },

  {
    heading: 'MASTER DATA',
    id: 'master-data',
    list: masterDataMenus(),
  },
];
