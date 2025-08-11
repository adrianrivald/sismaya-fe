import { Icon } from '@iconify/react';
import {
  Dialog,
  Box,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Button,
} from '@mui/material';
import { useForm } from 'react-hook-form';

interface DialogAddInitialCitoProps {
  open: boolean;
  onClose: () => void;
}

export default function DialogAddInitialCito({ open, onClose }: DialogAddInitialCitoProps) {
  const methods = useForm({
    defaultValues: {
      cito_type: 'holding_company',
    },
  });
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
          Add Initial CITO Quota
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Stack direction="row" gap={2}>
            <Box sx={{ minWidth: 24, minHeight: 24 }}>
              <Icon icon="solar:info-circle-bold" color="red" height={24} width={24} />
            </Box>

            <Typography fontSize={14} color="#919EAB">
              The initial quota becomes the reference for the monthly quota. Make sure you enter the
              correct value.
            </Typography>
          </Stack>
          <Typography fontSize={14} sx={{ mt: 3 }}>
            Cito Type
          </Typography>
          <FormControl fullWidth sx={{ mt: 1.5 }}>
            <InputLabel id="select-company">Cito Type</InputLabel>
            <Select
              value={methods.watch('cito_type') || ''}
              defaultValue="holding_company"
              fullWidth
              onChange={(e: SelectChangeEvent<any>) => {
                methods.setValue('cito_type', e.target.value);
              }}
            >
              <MenuItem value="holding_company" selected>
                Holding Company
              </MenuItem>
              <MenuItem value="sub_company">All Sub Company</MenuItem>
            </Select>
          </FormControl>

          <Stack direction="row" gap={2} sx={{ mt: 3 }} justifyContent="flex-end">
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="contained" disabled>
              Save
            </Button>
          </Stack>
        </Box>
      </Box>
    </Dialog>
  );
}
