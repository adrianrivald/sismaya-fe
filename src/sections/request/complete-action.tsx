import { Box, Button, Dialog, DialogTitle, Typography } from '@mui/material';
import type { Dispatch, SetStateAction } from 'react';

interface CompleteActionProps {
  openCompleteRequest: boolean;
  setOpenCompleteRequest: Dispatch<SetStateAction<boolean>>;
  onCompleteRequest: () => void;
}

export function CompleteAction({
  openCompleteRequest,
  setOpenCompleteRequest,
  onCompleteRequest,
}: CompleteActionProps) {
  return (
    <Dialog
      onClose={() => setOpenCompleteRequest(false)}
      open={!!openCompleteRequest}
      sx={{
        p: 3,
      }}
    >
      <DialogTitle>Complete Request</DialogTitle>

      <Box px={3}>
        <Typography>
          Are you sure want to complete request? This action can not be undone!
        </Typography>

        <Box mt={3} pb={3} display="flex" justifyContent="flex-end" alignItems="center" gap={2}>
          <Button
            onClick={() => setOpenCompleteRequest(false)}
            type="button"
            sx={{
              paddingY: 0.5,
              border: 1,
              borderColor: 'primary.main',
              borderRadius: 1.5,
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={onCompleteRequest}
            sx={{
              paddingY: 0.5,
              border: 1,
              borderRadius: 1.5,
              backgroundColor: 'primary.main',
              borderColor: 'primary.main',
              color: 'white',
            }}
          >
            Complete Request
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
