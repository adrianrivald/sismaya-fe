import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

export const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navDataTop = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Reports',
    path: '/reports',
    icon: icon('ic-user'),
  },
];

export const navDataBottom = [
  {
    title: 'SIM',
    path: '/sim',
  },
  {
    title: 'SAS',
    path: '/sas',
  },
  {
    title: 'KMI',
    path: '/kmi',
  },
  {
    title: 'FPA',
    path: '/fpa',
  },
];

export const navMasterData = [
  {
    title: 'Internal Company',
    path: '/internal-company',
  },
  {
    title: 'Client Company',
    path: '/client-company',
  },
  {
    title: 'User',
    path: '/user',
  },
  {
    title: 'FPA',
    path: '/fpa',
  },
];
