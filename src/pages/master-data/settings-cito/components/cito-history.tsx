import { Dialog, Box, Typography, FormControl, InputAdornment, TextField } from '@mui/material';
import { useState } from 'react';
import { SvgColor } from 'src/components/svg-color';

interface CitoHistoryProps {
  open: boolean;
  onClose: () => void;
  id: string;
}

export default function DialogCitoHistory({ open, onClose, id }: CitoHistoryProps) {
  const [form, setForm] = useState({ search: '' });
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
          CITO Quota History
        </Typography>

        <FormControl fullWidth sx={{ mt: 3 }}>
          <TextField
            sx={{ width: '100%' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SvgColor width={18} height={24} src="/assets/icons/ic-search.svg" />
                </InputAdornment>
              ),
            }}
            value={form.search}
            placeholder="Search..."
            onChange={(e) => setForm({ ...form, search: e.target.value })}
          />
        </FormControl>
      </Box>
    </Dialog>
  );
}
