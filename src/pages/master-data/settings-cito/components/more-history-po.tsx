import { Icon } from '@iconify/react';
import { Dialog, Box, Typography, Stack, Button } from '@mui/material';

interface DocumentPoHistoryProps {
  open: boolean;
  onClose: () => void;
  id: string;
}

export default function DialogDocumentPoHistory({ open, onClose, id }: DocumentPoHistoryProps) {
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
          Documents
        </Typography>
        <Typography sx={{ fontSize: 12 }}>Development</Typography>
        {[1, 2].map((_, index) => (
          <Box border={0.2} borderRadius={1} mt={2} key={index}>
            <Stack p={1.5} flexDirection="row" justifyContent="space-between">
              <Stack flexDirection="row" alignItems="center" gap={1}>
                <Icon icon="bxs:file" width="20" height="20" color="orange" />
                <Typography fontSize={14}>PO_001.pdf</Typography>
              </Stack>
              <Stack flexDirection="row" alignItems="center" gap={1}>
                <Typography fontSize={12} color="#919EAB">
                  08 Apr 2022 16:22
                </Typography>
                <Icon icon="lineicons:arrow-angular-top-right" width="20" height="20" />
              </Stack>
            </Stack>
          </Box>
        ))}
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Button
            size="small"
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
