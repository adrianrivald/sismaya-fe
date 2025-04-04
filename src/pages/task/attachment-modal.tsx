import { Box, Modal, IconButton } from '@mui/material';
import { Icon } from '@iconify/react';
import FilePreview from 'src/utils/file-preview';
import PdfPreview from 'src/utils/pdf-viewer';

interface AttachmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  path: string;
}

export function AttachmentModal({ isOpen, onClose, url, path }: AttachmentModalProps) {
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
        {path.toLowerCase().endsWith('.pdf') ? (
          <Box
            sx={{
              position: 'relative',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 2,
              width: '80%',
            }}
          >
            <PdfPreview pdfFile={`${url}`} />
          </Box>
        ) : path.toLowerCase().endsWith('.xls') || path.toLowerCase().endsWith('.xlsx') ? (
          <Box
            sx={{
              position: 'relative',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 2,
              width: '80%',
            }}
          >
            <FilePreview fileUrl={`${url}`} />
          </Box>
        ) : path.toLowerCase().endsWith('.doc') || path.toLowerCase().endsWith('.docx') ? (
          <Box
            sx={{
              position: 'relative',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 2,
              width: '80%',
            }}
          >
            <FilePreview fileUrl={`${url}`} />
          </Box>
        ) : (
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
        )}
      </Modal>
    )
  );
}
