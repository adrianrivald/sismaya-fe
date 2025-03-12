import { Box, Modal, IconButton } from '@mui/material';
import { Icon } from '@iconify/react';

interface AttachmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

export function AttachmentModal({ isOpen, onClose, url }: AttachmentModalProps) {
  return (
    url && (
      <Modal
        open={isOpen}
        onClose={onClose}
        aria-labelledby="attachment-modal"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 2,
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto',
            borderRadius: 1,
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 10,
              top: 10,
              color: 'white',
            }}
          >
            <Icon icon="solar:close-circle-bold" />
          </IconButton>
          <img
            src={url}
            alt="attachment"
            style={{
              maxWidth: '100%',
              maxHeight: 'calc(90vh - 32px)',
              objectFit: 'contain',
            }}
          />
        </Box>
      </Modal>
    )
  );
}
