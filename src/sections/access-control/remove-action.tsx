import { Box, Button, Dialog, Stack, Typography } from '@mui/material';
import type { Dispatch, SetStateAction } from 'react';
import { SvgColor } from 'src/components/svg-color';

interface RemoveActionProps {
  openRemoveModal: boolean;
  setOpenRemoveModal: Dispatch<SetStateAction<boolean>>;
  onRemove: () => void;
  selectedUser: string;
  setSelectedUser: Dispatch<SetStateAction<string>>;
  mode: 'user-list' | 'user-group';
}

export function RemoveAction({
  openRemoveModal,
  setOpenRemoveModal,
  onRemove,
  selectedUser,
  setSelectedUser,
  mode,
}: RemoveActionProps) {
  return (
    <Dialog
      onClose={() => {
        setOpenRemoveModal(false);
        setTimeout(() => {
          setSelectedUser('');
        }, 500);
      }}
      open={!!openRemoveModal}
      sx={{
        p: 3,
      }}
    >
      <Box px={3} py={4}>
        <Stack direction="row" justifyContent="center">
          <SvgColor width={80} height={80} color="#FFA48D" src="/assets/icons/ic-user-delete.svg" />
        </Stack>

        <Typography
          textAlign="center"
          color="grey.800"
          fontWeight="bold"
          fontSize={24}
          variant="h4"
        >
          Delete {mode === 'user-list' ? 'User' : 'User Group'} {selectedUser}
        </Typography>

        <Typography textAlign="center" mt={2} px={12}>
          This action is irreversible. The user will be permanently deleted.
        </Typography>

        <Box mt={3} display="flex" justifyContent="center" alignItems="center" gap={2}>
          <Button
            onClick={() => setOpenRemoveModal(false)}
            type="button"
            sx={{
              paddingY: 1,
              border: 1,
              borderRadius: 1.5,
              width: '100%',
              color: 'black',
              borderColor: 'grey.500',
              fontWeight: 'bold',
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={onRemove}
            sx={{
              paddingY: 1,
              border: 1,
              borderRadius: 1.5,
              backgroundColor: 'error.main',
              borderColor: 'error.main',
              color: 'white',
              width: '100%',
            }}
          >
            Delete {mode === 'user-list' ? 'User' : 'User Group'}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
