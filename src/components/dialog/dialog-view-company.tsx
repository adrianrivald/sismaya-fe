import React, { Dispatch, SetStateAction, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Box,
} from '@mui/material';

const hospitals = [
  'Primaya Hospital Tangerang',
  'Primaya Hospital Depok',
  'Primaya Hospital Bangka',
  'Primaya Hospital Bekasi',
  'Primaya Hospital Evasari',
];

interface DialogViewCompanyProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function DialogViewCompany({ open, setOpen }: DialogViewCompanyProps) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogContent sx={{ maxHeight: '400px', px: 3, pt: 4, overflowY: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>No</strong>
              </TableCell>
              <TableCell>
                <strong>Client Sub Company</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {hospitals.map((name, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 4 }}>
        <Box width="100%" display="flex" justifyContent="center">
          <Button sx={{ width: '100%' }} variant="outlined" onClick={handleClose}>
            OK
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
