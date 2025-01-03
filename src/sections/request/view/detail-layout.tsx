import { Outlet, useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { Box, Stack, Grid, Input, Button } from '@mui/material';
import { useRequestById } from 'src/services/request';
import { DashboardContent } from 'src/layouts/dashboard';
import { SvgColor } from 'src/components/svg-color';
import { StatusBadge } from '../status-badge';
import { RequestTaskForm } from '../task/view/task-form';

export default function RequestDetailLayout() {
  const { id, vendor } = useParams();
  const { data: requestDetail } = useRequestById(id ?? '');
  const chats = [];

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3} xs={12}>
        <Grid item xs={12} md={8}>
          <Box>
            <Outlet />
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ border: 1, borderRadius: 3, borderColor: 'grey.300' }}>
            <Box
              p={2}
              sx={{
                borderBottom: 1,
                borderColor: 'grey.300',
              }}
            >
              <Typography>Chat with Sismedika</Typography>
            </Box>
            <Box overflow="auto" height={400}>
              {chats?.length > 0 ? null : (
                <Box
                  display="flex"
                  flexDirection="column"
                  gap={1}
                  justifyContent="center"
                  alignItems="center"
                  height="100%"
                  color="grey.500"
                >
                  <Box component="img" src="/assets/icons/chat.png" />
                  <Typography fontWeight="bold">Start a conversation</Typography>
                  <Typography fontSize={12}>Write something...</Typography>
                </Box>
              )}
            </Box>
            <Box
              sx={{
                borderTop: 1,
                borderColor: 'grey.300',
              }}
              display="flex"
              alignItems="center"
              gap={1}
              justifyContent="space-between"
            >
              <Box display="flex" justifyContent="center" alignItems="center" px={2}>
                <SvgColor src="/assets/icons/ic-emoji.svg" />
              </Box>
              <Input disableUnderline type="text" />
              <Box display="flex" alignItems="center" gap={2}>
                <SvgColor width={18} height={18} src="/assets/icons/ic-image.svg" />
                <SvgColor width={18} height={18} src="/assets/icons/ic-clip.svg" />
                <SvgColor width={18} height={18} src="/assets/icons/ic-mic.svg" />
              </Box>
              <Box
                p={2}
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{
                  borderLeft: 1,
                  borderColor: 'grey.300',
                }}
              >
                <SvgColor width={24} height={24} src="/assets/icons/ic-send.svg" />
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
