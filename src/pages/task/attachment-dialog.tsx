import { Box, Dialog, IconButton } from '@mui/material';
import { Icon } from '@iconify/react';
import FilePreview from 'src/utils/file-preview';
import PdfPreview from 'src/utils/pdf-viewer';

interface AttachmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  path: string;
}

export function AttachmentDialog({ isOpen, onClose, url, path }: AttachmentModalProps) {
  return (
    url && (
      <Dialog
        open={isOpen}
        onClose={onClose}
        maxWidth={false}
        PaperProps={{
          sx: {
            maxWidth: '90vw',
            maxHeight: '90vh',
            bgcolor: 'background.paper',
          },
        }}
      >
        {path.toLowerCase().endsWith('.pdf') ? (
          <Box
            sx={{
              position: 'relative',
              p: 2,
              width: '80vw',
              height: '80vh',
            }}
          >
            <IconButton
              onClick={onClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                zIndex: 1,
              }}
            >
              <Icon icon="solar:close-circle-bold" />
            </IconButton>
            <PdfPreview pdfFile={`${url}`} />
          </Box>
        ) : path.toLowerCase().endsWith('.xls') || path.toLowerCase().endsWith('.xlsx') ? (
          <Box
            sx={{
              position: 'relative',
              p: 2,
              width: '80vw',
            }}
          >
            <IconButton
              onClick={onClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                zIndex: 1,
              }}
            >
              <Icon icon="solar:close-circle-bold" />
            </IconButton>
            <FilePreview fileUrl={`${url}`} />
          </Box>
        ) : path.toLowerCase().endsWith('.doc') || path.toLowerCase().endsWith('.docx') ? (
          <Box
            sx={{
              position: 'relative',
              p: 2,
              width: '80vw',
            }}
          >
            <IconButton
              onClick={onClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                zIndex: 1,
              }}
            >
              <Icon icon="solar:close-circle-bold" />
            </IconButton>
            <FilePreview fileUrl={`${url}`} />
          </Box>
        ) : (
          <Box
            sx={{
              position: 'relative',
              p: 2,
              maxWidth: '90vw',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
          >
            <IconButton
              onClick={onClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                zIndex: 1,
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
      </Dialog>
    )
  );
}
