import { Icon } from '@iconify/react';
import {
  Box,
  Button,
  Dialog,
  Grid,
  Stack,
  Table,
  TableBody,
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
            <Button
              variant="contained"
              onClick={() => onClick && onClick('initial', id)}
              disabled={!(data?.cito_type === '' || !data?.cito_type)}
            >
              {data?.cito_type === '' || !data?.cito_type
                ? 'Add Initial Quota'
                : 'Edit Initial Quota'}
            </Button>
          </Stack>
          {data?.cito_type && (
            <Box>
              <Stack direction="row" gap={1} sx={{ my: 1.5 }}>
                <Box sx={{ minWidth: 24, minHeight: 24 }}>
                  <Icon icon="solar:info-circle-bold" color="red" height={20} width={20} />
                </Box>

                <Typography fontSize={14} color="#919EAB">
                  The initial quota becomes the reference for the monthly quota.
                </Typography>
              </Stack>
              <TableContainer sx={{ mt: 2 }}>
                <Table sx={{ borderRadius: 4 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell width="73%">
                        <Typography fontSize={14} color="#637381">
                          Company Name
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontSize={14} color="#637381">
                          CITO Quota
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {data?.initial
                      .filter((item) => item.type !== 'subsidiary')
                      .map((itm, idx) => (
                        <TableRow key={idx}>
                          <TableCell>
                            <Typography fontSize={14}>{itm.company_name}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography fontSize={14}>{itm.quota || 0}</Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    {data?.cito_type === 'all-sub-company' && (
                      <>
                        {data.initial.map(
                          (itm, idx) =>
                            itm.type === 'subsidiary' && (
                              <TableRow key={idx}>
                                <TableCell>
                                  <Typography sx={{ ml: 1.5 }} fontSize={14}>
                                    {itm.company_name}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography fontSize={14}>{itm.quota || 0}</Typography>
                                </TableCell>
                              </TableRow>
                            )
                        )}
                      </>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Box>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 3 }}>
          <Typography>Additional Quota</Typography>
          <Button
            variant="contained"
            onClick={() => onClick && onClick('additional', id)}
            disabled={!(data?.cito_type !== '' || data?.cito_type)}
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
