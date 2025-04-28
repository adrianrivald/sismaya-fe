import { Box, Modal, IconButton } from '@mui/material';
import { Icon } from '@iconify/react';
import FilePreview from 'src/utils/file-preview';
import PdfPreview from 'src/utils/pdf-viewer';
import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch';

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
        ) : path.toLowerCase().endsWith('.xls') ||
          path.toLowerCase().endsWith('.xlsx') ||
          path.toLowerCase().endsWith('.csv') ? (
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
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <TransformWrapper initialScale={1}>
                {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                  <>
                    <TransformComponent>
                      <img
                        src={url}
                        alt="attachment"
                        style={{
                          // maxWidth: '100%',
                          // maxHeight: 'calc(90vh - 32px)',
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                        }}
                      />
                    </TransformComponent>
                    <IconButton
                      onClick={() => zoomIn()}
                      sx={{
                        position: 'absolute',
                        right: 40,
                        bottom: 10,
                        color: 'black',
                      }}
                    >
                      <Icon icon="gravity-ui:magnifier-plus" />
                    </IconButton>
                    <IconButton
                      onClick={() => zoomOut()}
                      sx={{
                        position: 'absolute',
                        right: 10,
                        bottom: 10,
                        color: 'black',
                      }}
                    >
                      <Icon icon="gravity-ui:magnifier-minus" />
                    </IconButton>
                    <IconButton
                      onClick={onClose}
                      sx={{
                        position: 'absolute',
                        right: 10,
                        top: 10,
                        color: 'black',
                      }}
                    >
                      <Icon icon="solar:close-circle-bold" />
                    </IconButton>
                  </>
                )}
              </TransformWrapper>
            </Box>
          </Box>
        )}
      </Modal>
    )
  );
}
