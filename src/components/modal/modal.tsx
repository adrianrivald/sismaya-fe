import { Box, Button, Typography, Modal, ModalProps } from '@mui/material';
import React, { createContext, Dispatch, ReactNode, SetStateAction } from 'react';
// /*React.ReactElement<any, string>;*/
interface DialogProps {
  children: ReactNode;
  content: any;
  title: string;
  minWidth: number;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ModalDialog({
  children,
  content,
  title,
  minWidth = 500,
  open,
  setOpen,
  ...restProps
}: DialogProps & Omit<ModalProps, 'open'>) {
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Box onClick={handleOpen}>{children}</Box>

      <Modal
        {...restProps}
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            minWidth,
            bgcolor: 'background.paper',
            //   boxShadow: 24,
            borderRadius: 2,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {title}
          </Typography>
          {content}
        </Box>
      </Modal>
    </div>
  );
}
