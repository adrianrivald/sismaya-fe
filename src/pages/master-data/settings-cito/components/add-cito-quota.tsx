import { Icon } from '@iconify/react';
import {
  Box,
  Button,
  Dialog,
  Grid,
  Stack,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useInitialQuota } from 'src/services/settings-cito/use-initial-cito';

interface DialogAddCitoQuotaProps {
  open: boolean;
  onClose: () => void;
  onClick?: (type: string, id: string) => void;
  id: string;
}
export default function DialogAddCitoQuota({
  open,
  onClose,
  onClick,
  id,
}: DialogAddCitoQuotaProps) {
  const { data } = useInitialQuota('', id, open === true);

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose();
      }}
      maxWidth="sm"
      fullWidth
      sx={{ p: 3 }}
    >
      <Box sx={{ px: 3, pt: 1, pb: 3 }}>
        <Typography mt={2} fontWeight="bold">
          Add Cito Quota
        </Typography>

        <Box>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 3 }}>
            <Typography>Initial Quota</Typography>
            <Button variant="contained" onClick={() => onClick && onClick('initial', id)}>
              Add Initial Quota
            </Button>
          </Stack>
          {/* <Stack direction="row" gap={1} sx={{ my: 1.5 }}>
            <Box sx={{ minWidth: 24, minHeight: 24 }}>
              <Icon icon="solar:info-circle-bold" color="red" height={20} width={20} />
            </Box>

            <Typography fontSize={14} color="#919EAB">
              The initial quota becomes the reference for the monthly quota.
            </Typography>
          </Stack>
          <TableContainer>
            <Table sx={{ borderRadius: 4 }}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography fontSize={14} color="#637381">
                      Company Name
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontSize={14} color="#637381">
                      Cito Quota
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </TableContainer> */}
        </Box>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 3 }}>
          <Typography>Additional Quota</Typography>
          <Button
            variant="contained"
            onClick={() => onClick && onClick('additional', id)}
            disabled={data?.cito_type === ''}
          >
            Add Additional Quota
          </Button>
        </Stack>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            sx={{ mt: 5 }}
            variant="outlined"
            onClick={() => {
              onClose();
            }}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
