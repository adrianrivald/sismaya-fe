import { useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import {
  Box,
  Stack,
  Grid,
  Input,
  Button,
  SelectChangeEvent,
  capitalize,
  MenuItem,
  Select,
} from '@mui/material';
import { useCompleteRequest, useRequestById } from 'src/services/request';
import { DashboardContent } from 'src/layouts/dashboard';
import { SvgColor } from 'src/components/svg-color';
import { priorityColorMap, stepColorMap } from 'src/constants/status';
import { StatusBadge } from '../status-badge';
import { RequestTaskForm } from '../task/view/task-form';

export default function RequestDetailLayout() {
  const { id, vendor } = useParams();
  const { data: requestDetail } = useRequestById(id ?? '');
  const chats = [];
  const { mutate: completeRequest } = useCompleteRequest();
  const [currentPriority, setCurrentPriority] = useState(requestDetail?.priority ?? '-');
  const [currentStatus, setCurrentStatus] = useState(
    requestDetail?.progress_status?.step ?? 'requested'
  );
  const statusEnum = () => {
    if (currentStatus === 'on_progress') return 'on_progress';
    if (currentStatus === 'to_do') return 'to_do';
    if (currentStatus === 'requested') return 'requested';
    if (currentStatus === 'completed') return 'completed';
    return 'requested';
  };
  const priorityEnum = () => {
    if (currentPriority === 'low') return 'low';
    if (currentPriority === 'medium') return 'medium';
    if (currentPriority === 'high') return 'high';
    if (currentPriority === 'cito') return 'cito';
    return 'low';
  };

  useEffect(() => {
    if (requestDetail?.priority) {
      setCurrentPriority(requestDetail?.priority);
    }
    if (requestDetail?.progress_status) {
      setCurrentStatus(requestDetail?.progress_status?.step);
    }
  }, [requestDetail]);

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3} xs={12}>
        <Grid item xs={12} md={8}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
              Request {requestDetail?.number}
            </Typography>
            {requestDetail?.step === 'rejected' && (
              <Box>
                <StatusBadge type="error" label="Request Rejected" />
              </Box>
            )}
          </Box>
          <Box display="flex" gap={2} sx={{ mb: { xs: 3, md: 5 } }}>
            <Typography variant="h5">Request</Typography>
            <Typography variant="h5">{(vendor ?? '').toUpperCase()} Request Management</Typography>
          </Box>
          {requestDetail?.step === 'rejected' && (
            <Box
              display="flex"
              alignItems="center"
              p={2}
              my={2}
              sx={{
                width: '100%',
                backgroundColor: 'warning.lighter',
                borderRadius: 2,
                borderColor: 'warning.light',
                borderWidth: 1,
                borderStyle: 'solid',
                color: 'warning.darker',
              }}
            >
              This request has been rejected with reason “{requestDetail?.reject_reason}”.
            </Box>
          )}
          <Stack spacing={2} direction="row" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={2}>
              {requestDetail?.priority !== null && (
                <Box
                  width="max-content"
                  py={1}
                  px={3}
                  sx={{
                    border: 1,
                    borderColor: 'grey.150',
                    borderRadius: 2,
                  }}
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  Priority
                  <Select
                    value={currentPriority}
                    sx={{
                      fontWeight: 'bold',
                      height: 40,
                      bgcolor: currentPriority ? priorityColorMap[priorityEnum()]?.bgColor : '-',
                      color: currentPriority ? priorityColorMap[priorityEnum()]?.color : '-',
                      paddingY: 0.5,
                      paddingX: 1,
                      ml: 1,
                      borderWidth: 0,
                      borderRadius: 1.5,
                      width: 'max-content',

                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 0,
                      },
                      '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                    }}
                    onChange={(e: SelectChangeEvent<string>) => {
                      setCurrentPriority(e.target.value);
                    }}
                  >
                    {['high', 'medium', 'low']?.map((value) => (
                      <MenuItem value={value}>{capitalize(`${value}`)}</MenuItem>
                    ))}
                  </Select>
                </Box>
              )}
              <Box
                width="max-content"
                py={1}
                px={3}
                sx={{
                  border: 1,
                  borderColor: 'grey.150',
                  borderRadius: 2,
                }}
                display="flex"
                alignItems="center"
                gap={1}
              >
                Status
                <Select
                  value={currentStatus}
                  sx={{
                    fontWeight: 'bold',
                    height: 40,
                    bgcolor: currentStatus ? stepColorMap[statusEnum()].bgColor : '',
                    color: currentStatus ? stepColorMap[statusEnum()].color : '',
                    paddingY: 0.5,
                    paddingX: 1,
                    ml: 1,
                    borderWidth: 0,
                    borderRadius: 1.5,
                    width: 'max-content',

                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 0,
                    },
                    '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                  }}
                  onChange={(e: SelectChangeEvent<string>) => {
                    if (e.target.value === 'completed') {
                      const res = completeRequest({
                        id: Number(id),
                      });
                      if (res !== undefined) {
                        setCurrentStatus(e.target.value);
                      }
                    } else {
                      setCurrentStatus(e.target.value);
                    }
                  }}
                >
                  {['on_progress', 'completed', 'to_do', 'requested']?.map((value) => (
                    <MenuItem value={value}>{capitalize(`${value.replace('_', ' ')}`)}</MenuItem>
                  ))}
                </Select>
              </Box>
            </Box>

            <RequestTaskForm requestId={Number(id)}>
              <Button variant="contained">Create Task</Button>
            </RequestTaskForm>
          </Stack>
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
