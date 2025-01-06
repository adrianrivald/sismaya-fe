import { Drawer, type DrawerProps } from '@mui/material';
import { useDisclosure } from './base';

export { Root, OpenButton, DismissButton, useDisclosure } from './base';

interface ContentProps extends Omit<DrawerProps, 'open' | 'onClose'> {}

export function Content(props: ContentProps) {
  const { isOpen, onClose } = useDisclosure();

  return <Drawer {...props} open={isOpen} onClose={onClose} />;
}
