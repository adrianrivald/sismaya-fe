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
  path: string;
}

export const generalMenus = (internalCompaniesDashboard?: ChildMenus[], userType?: string) => [
  {
    heading: 'Dashboard',
    id: 'dashboard',
    path: '/',
    icon: icon('ic-analytics'),
    list: userType === 'internal' ? internalCompaniesDashboard : [],
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

export const rbacMenus = () => [
  {
    heading: 'Access Control',
    id: 'user group:read',
    path: '/access-control/user-list',
    icon: icon('ic-authenticator'),
    list: [],
  },
];

export const menuItems = (
  internalCompaniesDashboard?: ChildMenus[],
  internalCompaniesRequest?: ChildMenus[],
  internalCompaniesTask?: ChildMenus[],
  userType?: string
) => [
  {
    heading: 'GENERAL',
    id: 'general',
    list: generalMenus(internalCompaniesDashboard, userType),
  },
  {
    heading: 'MANAGEMENT',
    id: 'management',
    list: managementMenus(internalCompaniesRequest, internalCompaniesTask),
  },

  {
    heading: 'SETTINGS',
    id: 'management',
    list: rbacMenus(),
  },
];
