import { Box, Button, Dialog, Grid, Stack, Typography } from '@mui/material';

interface DialogAddCitoQuotaProps {
  open: boolean;
  onClose: () => void;
  onClick?: (type: string, id: string) => void;
  id: string;
}
export default function DialogAddCitoQuota({
  open,
  onClose,
  onClick,
  id,
}: DialogAddCitoQuotaProps) {
  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose();
      }}
      maxWidth="sm"
      fullWidth
      sx={{ p: 3 }}
    >
      <Box sx={{ px: 3, pt: 1, pb: 3 }}>
        <Typography mt={2} fontWeight="bold">
          Add Cito Quota
        </Typography>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 3 }}>
          <Typography>Initial Quota</Typography>
          <Button variant="contained" onClick={() => onClick && onClick('initial', id)}>
            Add Initial Quota
          </Button>
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 3 }}>
          <Typography>Additional Quota</Typography>
          <Button variant="contained" onClick={() => onClick && onClick('additional', id)}>
            Add Additional Quota
          </Button>
        </Stack>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            sx={{ mt: 5 }}
            variant="outlined"
            onClick={() => {
              onClose();
            }}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
