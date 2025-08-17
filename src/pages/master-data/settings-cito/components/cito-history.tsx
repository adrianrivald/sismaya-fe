import { Icon } from '@iconify/react';
import {
  Dialog,
  Box,
  Typography,
  FormControl,
  InputAdornment,
  TextField,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Stack,
} from '@mui/material';
import { useState } from 'react';
import { SvgColor } from 'src/components/svg-color';
import { useHistoryCito } from 'src/services/settings-cito/use-initial-cito';

interface CitoHistoryProps {
  open: boolean;
  onClose: () => void;
  id: string;
  onClickAttachment?: any;
}

export default function DialogCitoHistory({
  open,
  onClose,
  id,
  onClickAttachment,
}: CitoHistoryProps) {
  const [form, setForm] = useState({ search: '' });
  const { data } = useHistoryCito('', id, open === true, form.search);

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose();
      }}
      maxWidth="lg"
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

        <TableContainer sx={{ mt: 2 }}>
          <Table sx={{ borderRadius: 4, overflow: 'auto', minWidth: '130%' }}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography fontSize={14} color="#637381">
                    Date
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography fontSize={14} color="#637381">
                    Time
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography fontSize={14} color="#637381">
                    User
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography fontSize={14} color="#637381">
                    Company Name
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography fontSize={14} color="#637381">
                    Quota Type
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography fontSize={14} color="#637381">
                    Quota Before
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography fontSize={14} color="#637381">
                    Quota After
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography fontSize={14} color="#637381">
                    PO Number
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography fontSize={14} color="#637381">
                    Document
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {data &&
                data?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Typography fontSize={14}>{item.date}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontSize={14}>{item.time}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontSize={14}>{item.user}</Typography>
                    </TableCell>
                    <TableCell>
                      <Stack>
                        {item?.company_name?.map((itm) => (
                          <Typography fontSize={14}>{itm}</Typography>
                        ))}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack>{item.quota_type}</Stack>
                    </TableCell>
                    <TableCell>
                      <Stack>
                        {item?.quota_before?.map((itm) => (
                          <Typography fontSize={14}>{itm}</Typography>
                        ))}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack>
                        {item?.quota_after?.map((itm) => (
                          <Typography fontSize={14}>{itm}</Typography>
                        ))}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack>
                        {item?.po_number?.map((itm) => (
                          <Typography fontSize={14}>{itm}</Typography>
                        ))}
                      </Stack>
                    </TableCell>
                    <TableCell
                      sx={{ cursor: 'pointer' }}
                      onClick={() => {
                        onClickAttachment(item.documents);
                      }}
                    >
                      <Stack direction="row" gap={1} alignItems="center">
                        {item.documents && item?.documents?.length > 0 && (
                          <Icon icon="bxs:file" width="22" height="22" color="orange" />
                        )}
                        {item.documents && item?.documents?.length > 1 && (
                          <Box
                            sx={{
                              height: 25,
                              width: 25,
                              bgcolor: 'silver',
                              justifyContent: 'center',
                              alignItems: 'center',
                              display: 'flex',
                              borderRadius: 25 / 2,
                            }}
                          >
                            <Typography sx={{ fontSize: 12, textAlign: 'center' }}>
                              +{(item?.documents?.length || 1) - 1}
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Dialog>
  );
}
