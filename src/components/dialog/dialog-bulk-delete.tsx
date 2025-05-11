import { Box, Button, Dialog, Stack, Typography } from '@mui/material';
import { SvgColor } from '../svg-color';

interface DialogBulkDeleteProps {
  open: boolean;
  onClick: () => void;
  onClose: () => void;
  title: string;
}

export function DialogBulkDelete({ open, onClick, onClose, title }: DialogBulkDeleteProps) {
  return (
    <Dialog
      onClose={() => {
        onClose();
      }}
      open={open}
      sx={{
        p: 3,
      }}
    >
      <Box px={3} py={4} width={500} height={300}>
        <Stack direction="row" justifyContent="center">
          <SvgColor width={80} height={80} color="#FFA48D" src="/assets/icons/ic-delete-warn.svg" />
        </Stack>
        <Typography fontSize={24} fontWeight="bold" textAlign="center" mt={4}>
          {title}
        </Typography>
        <Typography fontSize={14} textAlign="center" mt={1} color="#637381">
          This action is irreversible.
        </Typography>
        <Stack direction="row" gap={2} mt={4}>
          <Button fullWidth variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="error" fullWidth onClick={onClick}>
            Delete
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
}
