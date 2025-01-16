import { useEffect, useState } from 'react';
import { useAuth } from 'src/sections/auth/providers/auth';
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
import {
  useCompleteRequest,
  useRequestById,
  useRequestStatus,
  useUpdateRequestPriority,
  useUpdateRequestStatus,
} from 'src/services/request';
import { DashboardContent } from 'src/layouts/dashboard';
import { SvgColor } from 'src/components/svg-color';
import { priorityColorMap, stepColorMap } from 'src/constants/status';
import { StatusBadge } from '../status-badge';
import { RequestTaskForm } from '../task/view/task-form';
import { RequestMessenger } from '../messenger';

type StatusStepEnum = 'to_do' | 'in_progress' | 'completed' | 'pending' | 'requested';

export default function RequestDetailLayout() {
  const { user } = useAuth();
  const userType = user?.user_info?.user_type;
  const { id, vendor } = useParams();
  const idCurrentCompany = user?.internal_companies?.find(
    (item) => item?.company?.name?.toLowerCase() === vendor
  )?.company?.id;
  const { data: requestStatuses } = useRequestStatus(String(idCurrentCompany ?? ''));
  const { data: requestDetail } = useRequestById(id ?? '');
  const { mutate: completeRequest } = useCompleteRequest();
  const { mutate: updateStatus } = useUpdateRequestStatus();
  const { mutate: updatePriority } = useUpdateRequestPriority();
  const [currentPriority, setCurrentPriority] = useState(requestDetail?.priority ?? '-');
  const [currentStatus, setCurrentStatus] = useState(requestDetail?.progress_status?.id ?? 0);
  const statusStepEnum = requestStatuses?.find((item) => item?.id === currentStatus);

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
      setCurrentStatus(requestDetail?.progress_status?.id);
    }
  }, [requestDetail]);

  const handleChangeStatus = (e: SelectChangeEvent<number>) => {
    const statusStep = requestStatuses?.find((item) => item?.id === e.target.value);
    if (statusStep?.step === 'done') {
      const res = completeRequest({
        id: Number(id),
      });
      if (res !== undefined) {
        setCurrentStatus(Number(e.target.value));
      }
    } else {
      const res = updateStatus({
        id: Number(id),
        statusId: Number(e.target.value),
      });
      setCurrentStatus(Number(e.target.value));
    }
  };

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
                      const res = updatePriority({
                        id: Number(id),
                        priority: e.target.value,
                      });
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
                  disabled={requestDetail?.step === 'done' || requestDetail?.step === 'pending'}
                  sx={{
                    fontWeight: 'bold',
                    height: 40,
                    bgcolor: currentStatus
                      ? stepColorMap[statusStepEnum?.step as StatusStepEnum].bgColor
                      : '',
                    color: currentStatus
                      ? stepColorMap[statusStepEnum?.step as StatusStepEnum].color
                      : '',
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
                  onChange={handleChangeStatus}
                >
                  {requestStatuses?.map((value) => (
                    <MenuItem value={value?.id}>{capitalize(value?.name)}</MenuItem>
                  ))}
                </Select>
              </Box>
            </Box>

            {userType === 'internal' && (
              <RequestTaskForm requestId={Number(id)}>
                <Button variant="contained">Create Task</Button>
              </RequestTaskForm>
            )}
          </Stack>
          <Box>
            <Outlet />
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <RequestMessenger />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
