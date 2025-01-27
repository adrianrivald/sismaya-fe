import { Box, Button, Dialog, DialogTitle, Typography } from '@mui/material';
import type { Dispatch, SetStateAction } from 'react';

interface RemoveActionProps {
  openRemoveModal: boolean;
  setOpenRemoveModal: Dispatch<SetStateAction<boolean>>;
  onRemove: () => void;
}

export function RemoveAction({ openRemoveModal, setOpenRemoveModal, onRemove }: RemoveActionProps) {
  return (
    <Dialog
      onClose={() => setOpenRemoveModal(false)}
      open={!!openRemoveModal}
      sx={{
        p: 3,
      }}
    >
      <DialogTitle>Remove Item</DialogTitle>

      <Box px={3}>
        <Typography>
          Are you sure want to remove this item? This action can not be undone!
        </Typography>

        <Box mt={3} pb={3} display="flex" justifyContent="flex-end" alignItems="center" gap={2}>
          <Button
            onClick={() => setOpenRemoveModal(false)}
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
            onClick={onRemove}
            sx={{
              paddingY: 0.5,
              border: 1,
              borderRadius: 1.5,
              backgroundColor: 'primary.main',
              borderColor: 'primary.main',
              color: 'white',
            }}
          >
            Remove
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
