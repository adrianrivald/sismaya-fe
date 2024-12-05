import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
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
    title: 'Request',
    path: '/request',
    icon: icon('ic-chat'),
  },
];
