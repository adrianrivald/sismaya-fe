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
}

export const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);
interface InternalCompanyMenus {
  heading: string;
  path: string;
}

export const menus = (
  type: 'internal' | 'client',
  internalCompaniesDashboard?: InternalCompanyMenus[],
  internalCompaniesRequest?: InternalCompanyMenus[],
  internalCompaniesTask?: InternalCompanyMenus[],
  roleId?: number
) => [
  {
    isAccordion: type === 'internal',
    heading: 'GENERAL',
    id: 'general',
    path: '/',
    list: [
      {
        heading: 'Dashboard',
        path: '/',
        id: 'dashboard',
        icon: icon('ic-analytics'),
        isAccordion: type === 'internal' && roleId !== 1,
        list: internalCompaniesDashboard,
      },
      {
        heading: 'Reports',
        path: '/reports',
        icon: icon('ic-user'),
      },
    ],
  },
  {
    heading: 'MANAGEMENT',
    id: 'management',
    list: [
      {
        isAccordion: true,
        heading: 'Request',
        id: 'request',
        icon: icon('ic-chat'),
        list: internalCompaniesRequest,
      },
      {
        isAccordion: true,
        heading: 'Task Management',
        id: 'task-management',
        path: '/task',
        icon: icon('ic-book'),
        list: internalCompaniesTask,
      },
      {
        isAccordion: true,
        heading: 'Master Data',
        id: 'master-data',
        icon: <Iconify icon="solar:database-bold" />,
        list: [
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
        ],
      },
      {
        isAccordion: false,
        heading: 'Monitor Personal Load',
        id: 'monitor-personal-load',
        icon: icon('ic-person'),
        path: '/monitor-personal-load',
      },
    ],
  },
];
