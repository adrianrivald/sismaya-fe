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

export const menuByRole: any = {
  1: {
    menus: ['master-data'],
  },
  6: {
    menus: ['request'],
  },
};

export const menus: Menus[] = [
  {
    // isShownInRole: [6],
    heading: 'GENERAL',
    id: 'general',
    list: [
      {
        heading: 'Dashboard',
        path: '/',
        icon: icon('ic-analytics'),
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
        list: [
          {
            heading: 'SIM',
            path: '/sim/request',
          },
          {
            heading: 'SAS',
            path: '/sas/request',
          },
          {
            heading: 'KMI',
            path: '/kmi/request',
          },
          {
            heading: 'FPA',
            path: '/fpa/request',
          },
        ],
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
