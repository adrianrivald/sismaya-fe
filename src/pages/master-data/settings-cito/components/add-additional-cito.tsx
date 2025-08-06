import { Dialog, Box, Typography } from '@mui/material';

interface DialogAddAdditionalCitoProps {
  open: boolean;
  onClose: () => void;
}

export default function DialogAddAdditionalCito({ open, onClose }: DialogAddAdditionalCitoProps) {
  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose();
      }}
      maxWidth="md"
      fullWidth
      sx={{ p: 3 }}
    >
      <Box sx={{ px: 3, pt: 1, pb: 3 }}>
        <Typography mt={2} fontWeight="bold">
          Add Cito Quota
        </Typography>
      </Box>
    </Dialog>
  );
}
