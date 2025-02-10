import { Dialog, type DialogProps, Typography, Stack, Button } from '@mui/material';
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

interface AlertConfirmationProps extends ContentProps {
  message: React.ReactNode;
  onConfirm: () => void;
  onCancel?: () => void;
  disabledAction?: boolean;
}

export function AlertConfirmation({
  message,
  onCancel,
  onConfirm,
  disabledAction = false,
  ...props
}: AlertConfirmationProps) {
  const { onClose } = useDisclosure();

  const handleCancel = () => {
    onClose();
    onCancel?.();
  };

  const handleConfirm = () => {
    onClose();
    onConfirm();
  };

  return (
    <Content {...props}>
      <Stack spacing={2} p={3}>
        <Typography>{message}</Typography>

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button type="button" variant="outlined" onClick={handleCancel} disabled={disabledAction}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            onClick={handleConfirm}
            disabled={disabledAction}
          >
            Confirm
          </Button>
        </Stack>
      </Stack>
    </Content>
  );
}
