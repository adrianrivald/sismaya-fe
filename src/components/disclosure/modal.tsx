import { Dialog, type DialogProps } from '@mui/material';
import { useDisclosure } from './base';

export { Root, OpenButton, DismissButton, useDisclosure } from './base';

interface ContentProps extends Omit<DialogProps, 'open' | 'onClose'> {}

export function Content(props: ContentProps) {
  const { isOpen, onClose } = useDisclosure();

  return (
    // eslint-disable-next-line react/destructuring-assignment
    <Dialog {...props} open={isOpen} onClose={onClose} sx={{ borderRadius: 4, ...props.sx }} />
  );
}
