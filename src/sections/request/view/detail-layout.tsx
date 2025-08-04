import { useEffect, useState } from 'react';
import { useAuth } from 'src/sections/auth/providers/auth';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import type { SelectChangeEvent } from '@mui/material';
import { Box, Stack, Grid, Button, capitalize, MenuItem, Select } from '@mui/material';
import {
  useRequestById,
  useRequestStatus,
  useUpdateRequestPriority,
  useUpdateRequestStatus,
} from 'src/services/request';
import { Bounce, toast } from 'react-toastify';
import { DashboardContent } from 'src/layouts/dashboard';
import { priorityColorMap, stepColorMap } from 'src/constants/status';
import { store } from 'src/services/request/task';
import { useSelector } from '@xstate/store/react';
import { Icon } from '@iconify/react';
import { useMessage } from 'src/services/messaging/use-messaging';
import type { Messaging } from 'src/services/messaging/types';
import { SvgColor } from 'src/components/svg-color';
import { useUserPermissions } from 'src/services/auth/use-user-permissions';
import { StatusBadge } from '../status-badge';
import { RequestTaskForm } from '../task/view/task-form';
import { RequestMessenger } from '../messenger';
import { CompleteAction } from '../complete-action';

type StatusStepEnum = 'to_do' | 'in_progress' | 'completed' | 'pending' | 'requested';

export default function RequestDetailLayout() {
  const { user } = useAuth();
  const { data: userPermissionsList } = useUserPermissions();
  const navigate = useNavigate();
  const userType = user?.user_info?.user_type;
  const { id, vendor } = useParams();
  const idCurrentCompany = user?.internal_companies?.find(
    (item) => item?.company?.name?.toLowerCase() === vendor
  )?.company?.id;
  const { data: requestStatuses } = useRequestStatus(String(idCurrentCompany ?? ''));
  const { data: requestDetail } = useRequestById(id ?? '');
  const [chatPage, setChatPage] = useState(1);
  const [isShouldFetch, setIsShouldFetch] = useState(false);
  const [isCoolingDown, setIsCoolingDown] = useState(false);
  const [isFetchingChat, setIsFetchingChat] = useState(false);
  const { data } = useMessage(Number(id), chatPage);
  const [chatData, setChatData] = useState<Messaging[]>(data?.messages ?? []);
  const { mutate: updateStatus, isSuccess } = useUpdateRequestStatus();
  const { mutate: updatePriority } = useUpdateRequestPriority();
  const [currentPriority, setCurrentPriority] = useState(requestDetail?.priority ?? '-');
  const [currentStatus, setCurrentStatus] = useState(requestDetail?.progress_status?.id ?? 0);
  const statusStepEnum =
    requestStatuses && requestStatuses?.find((item) => item?.id === currentStatus);
  const [openCompleteRequest, setOpenCompleteRequest] = useState(false);

  const tasks = useSelector(store, (state) => state.context.tasks);
  const tasksStatus = tasks?.map((task) => task?.status);
  const isTasksHasBeenCompleted = tasksStatus?.every((item) => item === 'completed');

  const priorityEnum = () => {
    if (currentPriority === 'low') return 'low';
    if (currentPriority === 'medium') return 'medium';
    if (currentPriority === 'high') return 'high';
    if (currentPriority === 'cito') return 'cito';
    return 'low';
  };

  useEffect(() => {
    if (chatPage === 1) setChatData(data?.messages ?? []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    // eslint-disable-next-line no-unsafe-optional-chaining
    if (chatPage > 1) setChatData((prev) => [...prev, ...(data?.messages ?? [])]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatPage]);

  useEffect(() => {
    if (isShouldFetch && chatPage < data?.meta?.total_page && isCoolingDown) {
      setIsFetchingChat(true);
      setTimeout(() => {
        setChatPage((prev) => prev + 1);
        setIsCoolingDown(false);
        setIsFetchingChat(false);
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatPage, isShouldFetch, isCoolingDown]);

  const bottomChatBoxElement = document.getElementById('bottomChatBox');

  useEffect(() => {
    const element = document.getElementById('chatBox');
    const handleScroll = () => {
      if (element) {
        console.log(
          element.scrollTop === 0 && chatPage < data?.meta?.total_page,
          'element.scrollTop'
        );
        if (element.scrollTop === 0) {
          setIsShouldFetch(true);
        } else {
          setIsShouldFetch(false);
          setIsCoolingDown(true);
        }
      }
    };

    if (element) {
      element.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (element) {
        element.removeEventListener('scroll', handleScroll);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSuccess = (newData: any) => {
    setChatData((prev) => [newData, ...prev]);
    setTimeout(() => {
      if (bottomChatBoxElement) {
        bottomChatBoxElement.scrollIntoView({
          block: 'end',
        });
      }
    }, 100);
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
      e.stopPropagation();
      e.preventDefault();
      setOpenCompleteRequest(true);
    } else if (
      userType === 'internal' &&
      !requestDetail?.assignees?.map((item) => item?.assignee?.id).includes(user?.user_info?.id)
    ) {
      toast.error(`You are not included as an assignee`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      });
    } else {
      updateStatus({
        id: Number(id),
        statusId: Number(e.target.value),
      });
      setCurrentStatus(Number(e.target.value));
    }
  };

  const onCompleteRequest = () => {
    const idComplete = requestStatuses?.find((item) => item?.step === 'done')?.id ?? 0;
    updateStatus(
      {
        id: Number(id),
        statusId: idComplete,
      },
      {
        onSuccess: () => {
          setCurrentStatus(idComplete);
        },
      }
    );

    setOpenCompleteRequest(false);
  };

  const onShowErrorToast = () => {
    toast.error(`You don't have permission`, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
      transition: Bounce,
    });
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
          <Box sx={{ mb: 2, p: 2, backgroundColor: '#FFF7CD', borderRadius: 2 }}>
            <Grid container>
              <Grid item xs={12} md={12} lg={8} mt={0.5}>
                <Stack sx={{ flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                  <Icon icon="solar:danger-triangle-bold" width="20" height="20" />
                  <Typography color="#7A4F01" fontSize={14}>
                    You haven’t filled out the evaluation report for this request.
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={12} lg={4}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    navigate(`/${vendor}/request/${id}/evaluation-form`);
                  }}
                >
                  <Typography fontSize={12} sx={{ color: '#7A4F01' }}>
                    Fill Out the Evaluation Report
                  </Typography>
                </Button>
              </Grid>
            </Grid>
          </Box>

          {requestDetail?.step === 'done' && userType === 'client' && (
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                backgroundColor: 'warning.200',
                px: 3,
                py: 2,
                borderRadius: 2,
                mb: 4,
              }}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <SvgColor color="#FFC107" src="/assets/icons/ic-alert.svg" />
                <Typography color="warning.600">
                  {requestDetail?.rating === null
                    ? 'You haven’t filled out the evaluation report for this request.'
                    : 'You have filled out the evaluation report for this request.'}{' '}
                </Typography>
              </Box>
              <Button
                onClick={() => navigate(`/${vendor}/request/${id}/review`)}
                sx={{
                  borderWidth: 1,
                  borderStyle: 'solid',
                  color: 'warning.600',
                  borderColor: 'warning.600',
                }}
              >
                {requestDetail?.rating === null
                  ? 'Fill Out the Evaluation Report'
                  : 'Check out the evaluation form'}
              </Button>
            </Box>
          )}
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
                    disabled={userType === 'client' || requestDetail?.step === 'done'}
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
                      if (
                        userType === 'internal' &&
                        !requestDetail?.assignees
                          ?.map((item) => item?.assignee?.id)
                          .includes(user?.user_info?.id)
                      ) {
                        toast.error(`You are not included as an assignee`, {
                          position: 'top-right',
                          autoClose: 5000,
                          hideProgressBar: true,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                          theme: 'light',
                          transition: Bounce,
                        });
                      } else {
                        setCurrentPriority(e.target.value);
                        updatePriority({
                          id: Number(id),
                          priority: e.target.value,
                        });
                      }
                    }}
                  >
                    {['low', 'medium', 'high']?.map((value) => (
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
                  disabled={
                    requestDetail?.step === 'done' ||
                    requestDetail?.step === 'pending' ||
                    userType === 'client'
                  }
                  sx={{
                    fontWeight: 'bold',
                    height: 40,
                    bgcolor: currentStatus
                      ? stepColorMap[statusStepEnum?.step as StatusStepEnum]?.bgColor
                      : '',
                    color: currentStatus
                      ? stepColorMap[statusStepEnum?.step as StatusStepEnum]?.color
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
            {!userPermissionsList?.includes('task:create') && userType === 'internal' && (
              <Button
                onClick={onShowErrorToast}
                variant="contained"
                disabled={requestDetail?.step === 'done'}
              >
                Create Task
              </Button>
            )}
            {userType === 'internal' &&
              userPermissionsList?.includes('task:create') &&
              requestDetail?.step !== 'pending' &&
              requestDetail?.step !== 'rejected' && (
                <RequestTaskForm requestId={Number(id)} requestNumber={requestDetail?.number}>
                  <Button variant="contained" disabled={requestDetail?.step === 'done'}>
                    Create Task
                  </Button>
                </RequestTaskForm>
              )}
          </Stack>
          <Box>
            <Outlet />
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <RequestMessenger
            isFetchingChat={isFetchingChat}
            onSuccess={onSuccess}
            requestId={Number(id)}
            chats={chatData as Messaging[]}
          />
        </Grid>
      </Grid>

      <CompleteAction
        onCompleteRequest={onCompleteRequest}
        openCompleteRequest={openCompleteRequest}
        setOpenCompleteRequest={setOpenCompleteRequest}
        isUncompleted={!isTasksHasBeenCompleted}
      />
    </DashboardContent>
  );
}
