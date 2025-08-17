import { Icon } from '@iconify/react';
import { Dialog, Box, Typography, Stack, Button } from '@mui/material';
import dayjs from 'dayjs';

interface DocumentPoHistoryProps {
  open: boolean;
  onClose: () => void;
  data: {
    cito_additional_quota_id: number;
    document: string;
    id: number;
    created_at: string;
    updated_at: string;
  }[];
}

export default function DialogDocumentPoHistory({ open, onClose, data }: DocumentPoHistoryProps) {
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
          Documents
        </Typography>
        <Typography sx={{ fontSize: 12 }}>Development</Typography>
        {data?.length > 0 &&
          data?.map((item, index) => (
            <Box
              border={0.2}
              borderRadius={1}
              mt={2}
              key={index}
              onClick={() => {
                const url = item.document;
                const extension = url.split('.').pop(); // get 'xlsx', 'pdf', etc.
                const fileName = `PO_${String(index + 1).padStart(3, '0')}.${extension}`;

                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              sx={{ cursor: 'pointer' }}
            >
              <Stack p={2} flexDirection="row" justifyContent="space-between">
                <Stack flexDirection="row" alignItems="center" gap={1}>
                  <Icon icon="bxs:file" width="20" height="20" color="orange" />
                  <Typography fontSize={14}>
                    {`PO_${String(index + 1).padStart(3, '0')}.${item.document.split('.').pop()}`}
                  </Typography>
                </Stack>
                <Stack flexDirection="row" alignItems="center" gap={1}>
                  <Typography fontSize={12} color="#919EAB">
                    {dayjs(new Date(item.created_at)).format('DD MMM YYYY HH:mm')}
                  </Typography>
                  <Icon icon="lineicons:arrow-angular-top-right" width="20" height="20" />
                </Stack>
              </Stack>
            </Box>
          ))}
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Button
            size="small"
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
