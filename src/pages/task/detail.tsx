import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { Link, useParams } from 'react-router-dom';
import {
  Box,
  Stack,
  Typography,
  /* ButtonGroup, */ Button,
  Divider,
  Paper,
  Menu,
  MenuItem,
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
import { AttachmentModal } from './attachment-modal';

// ----------------------------------------------------------------------

export default function TaskDetailPage() {
  const [attachmentModal, setAttachmentModal] = useState({ isOpen: false, url: '' });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { taskId, vendor } = useParams();
  const assigneeCompanyId = useAssigneeCompanyId();
  const { data, error } = useTaskDetail(Number(taskId), assigneeCompanyId);

  if (!data || error) {
    return null;
  }

  const { task, request } = data;
  const title = task.name;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // const getButtonProgressProps = (progress: number) =>
  //   ({
  //     variant: task.progress === progress ? 'contained' : 'outlined',
  //     onClick: () => {
  //       console.log('👾 ~ TaskDetailPage ~ changeProgress ~ progress:', progress);
  //     },
  //   }) as const;

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

          <TaskForm request={request} task={task}>
            <Button variant="outlined">Edit Task</Button>
          </TaskForm>
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
              <AssigneeList assignees={task.assignees} />
            </Stack>
          </Stack>

          <Stack spacing={1.5}>
            <Iconify icon="solid:ic-solar:bill-list-bold" />

            <Stack spacing={0.5}>
              <Typography variant="body2">Request</Typography>
              <Typography variant="subtitle2">{request.name}</Typography>
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
                      sx={{ cursor: 'pointer', flex: 1 }}
                      onClick={() => {
                        setAttachmentModal({ isOpen: true, url: attachment.url });
                        // downloadFile(attachment.url);
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
                        handleClick(e);
                      }}
                    >
                      <Icon icon="material-symbols:more-vert" width="24" height="24" />
                    </Box>
                    <Menu
                      id="demo-positioned-menu"
                      aria-labelledby="demo-positioned-button"
                      anchorEl={anchorEl}
                      open={open}
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
                          downloadFile(attachment.url);
                          handleClose();
                        }}
                      >
                        <Icon
                          icon="material-symbols-light:download-rounded"
                          width="18"
                          height="18"
                        />
                        <Typography sx={{ ml: 1 }}>Download</Typography>
                      </MenuItem>
                      <MenuItem onClick={handleClose}>
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
    </DashboardContent>
  );
}
