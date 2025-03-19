import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Stack,
  Typography,
  /* ButtonGroup, */ Button,
  Divider,
  Paper,
  Menu,
  MenuItem,
  IconButton,
  Modal,
  InputAdornment,
  TextField,
} from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import {
  TaskManagement,
  useTaskDetail,
  useAssigneeCompanyId,
} from 'src/services/task/task-management';
import { AssigneeList } from 'src/components/form/field/assignee';
import { downloadFile } from 'src/utils/download';
// import { RequestPriority } from 'src/sections/request/request-priority';
// import { TaskStatus } from 'src/sections/request/task/task-status';
import { CardActivity } from 'src/sections/task/activity';
import { TaskForm } from 'src/sections/task/form';
import AddAttachment from 'src/sections/task/add-attachment';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { http } from 'src/utils/http';
import { Bounce, toast } from 'react-toastify';
import { useUserPermissions } from 'src/services/auth/use-user-permissions';
import { SvgColor } from 'src/components/svg-color';
import { AttachmentModal } from './attachment-modal';

// ----------------------------------------------------------------------

export default function TaskDetailPage() {
  const [attachmentModal, setAttachmentModal] = useState({ isOpen: false, url: '' });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: 0 });
  const [menuState, setMenuState] = useState<{
    anchorEl: null | HTMLElement;
    attachmentId: number | null;
  }>({
    anchorEl: null,
    attachmentId: null,
  });
  const open = Boolean(menuState.anchorEl);
  const { taskId, vendor } = useParams();
  const assigneeCompanyId = useAssigneeCompanyId();
  const { data, error, refetch } = useTaskDetail(Number(taskId), assigneeCompanyId);
  const { data: userPermissionsList } = useUserPermissions();
  const [modalAssignee, setModalAssignee] = useState(false);
  const [search, setSearch] = useState('');

  if (!data || error) {
    return null;
  }

  const { task, request } = data;
  const title = task.name;

  const handleClick = (event: React.MouseEvent<HTMLElement>, id: number) => {
    setMenuState({ anchorEl: event.currentTarget, attachmentId: id });
  };

  const handleClose = () => {
    setMenuState({ anchorEl: null, attachmentId: null });
  };

  const removeAttachment = async (id: number) =>
    http(`/task-attachment/${id}`, { method: 'DELETE' }).then(() => refetch());

  // const getButtonProgressProps = (progress: number) =>
  //   ({
  //     variant: task.progress === progress ? 'contained' : 'outlined',
  //     onClick: () => {
  //       console.log('👾 ~ TaskDetailPage ~ changeProgress ~ progress:', progress);
  //     },
  //   }) as const;

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

  const onSearchUser = (text: string) => {
    setSearch(text);
  };

  return (
    <DashboardContent maxWidth="xl">
      <Helmet>
        <title> Task Management - {CONFIG.appName}</title>
      </Helmet>

      <Stack spacing={3}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          aria-label="page header"
        >
          <Stack spacing={1}>
            <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
              {title}
            </Typography>

            <Box display="flex" gap={2}>
              <Typography component={Link} to="/" sx={{ textDecoration: 'none', color: 'inherit' }}>
                Dashboard
              </Typography>
              <Typography color="grey.500">•</Typography>
              <Typography
                component={Link}
                to={`/${vendor}/task`}
                sx={{ textDecoration: 'none', color: 'inherit' }}
              >
                Task Management
              </Typography>
              <Typography color="grey.500">•</Typography>
              <Typography color="grey.500">{title}</Typography>
            </Box>
          </Stack>

          {userPermissionsList?.includes('task:update') ? (
            <TaskForm request={request} task={task}>
              <Button variant="outlined">Edit Task</Button>
            </TaskForm>
          ) : (
            <Button
              variant="outlined"
              onClick={() => {
                onShowErrorToast();
              }}
            >
              Edit Task
            </Button>
          )}
        </Box>

        {/* <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          aria-label="page sub header"
        >
          <Stack direction="row" spacing={2}>
            <RequestPriority priority={request.priority} />
            <TaskStatus status={task?.status} />
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="subtitle2">Task Progress</Typography>

            <ButtonGroup size="small" variant="outlined" aria-label="task progress">
              <Button {...getButtonProgressProps(0)}>0%</Button>
              <Button {...getButtonProgressProps(25)}>25%</Button>
              <Button {...getButtonProgressProps(50)}>50%</Button>
              <Button {...getButtonProgressProps(75)}>75%</Button>
              <Button {...getButtonProgressProps(100)}>100%</Button>
            </ButtonGroup>
          </Stack>
        </Box> */}

        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          p={2}
          border="1px solid rgba(145, 158, 171, 0.16)"
          borderRadius={2}
          aria-label="request info"
        >
          <Stack spacing={1.5}>
            <Iconify icon="solid:ic-solar:bill-list-bold" />

            <Stack spacing={0.5}>
              <Typography variant="body2">Assignee</Typography>

              <AssigneeList
                assignees={task.assignees}
                onClick={() => {
                  setModalAssignee(true);
                }}
              />
            </Stack>
          </Stack>

          <Stack spacing={1.5}>
            <Iconify icon="solid:ic-solar:bill-list-bold" />

            <Stack spacing={0.5}>
              <Typography variant="body2">Request</Typography>
              <Typography
                variant="subtitle2"
                sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => {
                  window.open(`/${vendor}/my-request/${request.id}`, '_blank');
                }}
              >
                {request.name}
              </Typography>
            </Stack>
          </Stack>

          <Stack spacing={1.5}>
            <Iconify icon="solid:ic-solar:bill-list-bold" />

            <Stack spacing={0.5}>
              <Typography variant="body2">Due Date</Typography>
              <Typography variant="subtitle2">
                {TaskManagement.formatDueDate(task.dueDate)}
              </Typography>
            </Stack>
          </Stack>

          <Stack spacing={1.5}>
            <Iconify icon="solid:ic-solar:bill-list-bold" />

            <Stack spacing={0.5}>
              <Typography variant="body2">Estimated Duration</Typography>
              <Typography variant="subtitle2">{task.estimateDay} days</Typography>
            </Stack>
          </Stack>
        </Box>

        <Divider />

        <Stack direction="row" spacing={5}>
          <Stack spacing={2} width="50%">
            <Paper component={Stack} spacing={2} elevation={3} p={3}>
              <Typography variant="h6">Description</Typography>
              <Typography variant="body1">{task.description}</Typography>
            </Paper>

            <Paper component={Stack} spacing={2} elevation={3} p={3}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Attachments</Typography>
                <AddAttachment taskId={Number(taskId)} />
              </Box>

              <Stack spacing={2}>
                {task.attachments.map((attachment) => (
                  <Stack
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                    key={attachment.id}
                    spacing={0.5}
                    border="1px solid rgba(145, 158, 171, 0.12)"
                    borderRadius={2}
                    p={2}
                    gap={3}
                  >
                    <Box
                      sx={{ cursor: 'pointer', flex: 1, width: '80%' }}
                      onClick={() => {
                        if (userPermissionsList?.includes('task:read')) {
                          setAttachmentModal({ isOpen: true, url: attachment.url });
                        } else {
                          onShowErrorToast();
                        }
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {attachment.name}
                      </Typography>
                      <Typography variant="caption">
                        {TaskManagement.formatAttachmentDate(attachment.createdAt)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ p: 0, cursor: 'pointer' }}
                      onClick={(e) => {
                        e.preventDefault();
                        handleClick(e, attachment.id);
                      }}
                    >
                      <Icon icon="material-symbols:more-vert" width="24" height="24" />
                    </Box>
                    <Menu
                      id={`menu-${attachment.id}`}
                      aria-labelledby="demo-positioned-button"
                      anchorEl={menuState.anchorEl}
                      open={Boolean(menuState.anchorEl) && menuState.attachmentId === attachment.id}
                      onClose={handleClose}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                    >
                      <MenuItem
                        onClick={() => {
                          if (userPermissionsList?.includes('task:read')) {
                            downloadFile(attachment.url);
                            handleClose();
                          } else {
                            onShowErrorToast();
                            handleClose();
                          }
                        }}
                      >
                        <Icon
                          icon="material-symbols-light:download-rounded"
                          width="18"
                          height="18"
                        />
                        <Typography sx={{ ml: 1 }}>Download</Typography>
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          if (userPermissionsList?.includes('task:update')) {
                            setDeleteModal({ isOpen: true, id: attachment.id });
                            handleClose();
                          } else {
                            onShowErrorToast();
                            handleClose();
                          }
                        }}
                      >
                        <Icon icon="mynaui:trash" width="18" height="18" color="red" />
                        <Typography sx={{ ml: 1 }}>Delete</Typography>
                      </MenuItem>
                    </Menu>
                  </Stack>
                ))}
              </Stack>
            </Paper>
          </Stack>

          <CardActivity
            taskId={Number(taskId)}
            requestName={request.name}
            taskName={task.name}
            lastTimer={task.lastTimer}
            step={task.status}
            refetch={refetch}
            assigneeCompanyId={assigneeCompanyId}
          />

          <AttachmentModal
            isOpen={attachmentModal.isOpen}
            url={attachmentModal.url}
            onClose={() => {
              setAttachmentModal({ isOpen: false, url: '' });
            }}
          />
        </Stack>
      </Stack>
      <Modal
        open={deleteModal.isOpen}
        onClose={() => {
          setDeleteModal({ isOpen: false, id: 0 });
        }}
        aria-labelledby="attachment-modal"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            maxWidth: '32vw',
            maxHeight: '90vh',
            overflow: 'auto',
            borderRadius: 1,
          }}
        >
          <Typography textAlign="center">
            Are you sure you want to delete this attachment ? This action cannot be undone.
          </Typography>
          <Stack sx={{ mt: 2 }} flexDirection="row" justifyContent="center" gap={5}>
            <Button
              onClick={() => {
                setDeleteModal({ isOpen: false, id: 0 });
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                removeAttachment(deleteModal.id);
                setDeleteModal({ isOpen: false, id: 0 });
              }}
            >
              Delete
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Modal
        open={modalAssignee}
        onClose={() => {
          setModalAssignee(false);
        }}
        aria-labelledby="attachment-modal"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 600,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            minWidth: '600px',
            maxHeight: '600px',
            borderRadius: 1,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
            Assignee
          </Typography>
          <TextField
            sx={{ width: '100%' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SvgColor width={18} height={24} src="/assets/icons/ic-search.svg" />
                </InputAdornment>
              ),
            }}
            placeholder="Search..."
            onChange={(e) => onSearchUser(e.target.value)}
          />
          <Box height={350} overflow="auto">
            {task?.assignees
              ?.filter((item) => new RegExp(search, 'i').test(item.name))
              .map((item, index) => (
                <Box display="flex" alignItems="center" justifyContent="space-between" key={index}>
                  <Box display="flex" gap={2} alignItems="center" p={2}>
                    <Box
                      component="img"
                      src={item.avatar !== '' ? item?.avatar : '/assets/icons/user.png'}
                      sx={{
                        borderRadius: 100,
                        width: 36,
                        height: 36,
                        borderColor: 'white',
                        borderWidth: 2,
                        borderStyle: 'solid',
                      }}
                    />
                    <Box>
                      <Typography>{item.name}</Typography>
                      <Typography color="grey.600">{item.email}</Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
          </Box>
          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button
              onClick={() => setModalAssignee(false)}
              type="button"
              sx={{
                paddingY: 1,
                border: 1,
                borderColor: 'grey.250',
                borderRadius: 1.5,
                color: 'grey.800',
              }}
            >
              Close{' '}
            </Button>
          </Box>
        </Box>
      </Modal>
    </DashboardContent>
  );
}
