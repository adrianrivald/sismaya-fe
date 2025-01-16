import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';
import { InternalCompany } from 'src/services/master-data/company/types';

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

interface MenuList {
  id?: string;
  path: string;
  heading: string;
  icon?: React.ReactNode;
  info?: React.ReactNode;
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
  internalCompaniesRequest?: InternalCompanyMenus[]
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
    isAccordion: true,
    heading: 'MANAGEMENT',
    id: 'management',
    list: [
      {
        heading: 'Request',
        id: 'request',
        icon: icon('ic-chat'),
        list: internalCompaniesRequest,
      },
      {
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
    ],
  },
];
