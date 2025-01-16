import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { Link, useParams } from 'react-router-dom';
import { Box, Stack, Typography, ButtonGroup, Button, Divider, Paper } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { TaskManagement, useTaskDetail } from 'src/services/task/task-management';
import { AssigneeList } from 'src/components/form/field/assignee';
import { downloadFile } from 'src/utils/download';
import { RequestPriority } from 'src/sections/request/request-priority';
import { TaskStatus } from 'src/sections/request/task/task-status';

// ----------------------------------------------------------------------

// function TimerPip() {
//   return (
//     <Portal container={document.body}>
//       <Box
//         bgcolor="white"
//         position="absolute"
//         bottom="1rem"
//         right="1rem"
//         border="1px solid rgba(145, 158, 171, 0.16)"
//         borderRadius={2}
//         px={1.5}
//         py={2}
//         boxShadow="-20px 20px 40px -4px rgba(145, 158, 171, 0.24)"
//       >
//         <Typography
//           color="rgba(99, 115, 129, 1)"
//           sx={{ fontWeight: 500, fontSize: '14px', lineHeight: '20px' }}
//         >
//           Request #1234 | Development
//         </Typography>

//         <Box display="flex" justifyContent="space-between" alignItems="center">
//           <Typography
//             flexGrow={1}
//             color="rgba(99, 115, 129, 1)"
//             sx={{ fontWeight: 700, fontSize: '14px', lineHeight: '20px' }}
//           >
//             Name your activity
//           </Typography>

//           <Stack spacing={1.5} direction="row" alignItems="center">
//             <Typography
//               color="rgba(33, 43, 54, 1)"
//               sx={{ fontWeight: 500, fontSize: '20px', lineHeight: '28px' }}
//             >
//               00:00
//             </Typography>

//             <Button color="success" variant="contained" size="small">
//               Start
//             </Button>
//           </Stack>
//         </Box>
//       </Box>
//     </Portal>
//   );
// }

export default function TaskDetailPage() {
  const { taskId } = useParams();
  const { data, error } = useTaskDetail(Number(taskId));

  if (!data || error) {
    return null;
  }

  const { task, request } = data;
  const title = task.name;

  const getButtonProgressProps = (progress: number) =>
    ({
      variant: task.progress === progress ? 'contained' : 'outlined',
      onClick: () => {
        console.log('👾 ~ TaskDetailPage ~ changeProgress ~ progress:', progress);
      },
    }) as const;

  return (
    <DashboardContent maxWidth="xl">
      <Helmet>
        <title>Task Management - {CONFIG.appName}</title>
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
                to="/task"
                sx={{ textDecoration: 'none', color: 'inherit' }}
              >
                Task Management
              </Typography>
              <Typography color="grey.500">•</Typography>
              <Typography color="grey.500">{title}</Typography>
            </Box>
          </Stack>

          <Button variant="outlined">Edit Task</Button>
        </Box>

        <Box
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
        </Box>

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

                <Button
                  size="small"
                  variant="contained"
                  component={Link}
                  to={`/task/${taskId}/activities`}
                >
                  Add
                </Button>
              </Box>

              <Stack spacing={2}>
                {task.attachments.map((attachment) => (
                  <Stack
                    key={attachment.id}
                    spacing={0.5}
                    border="1px solid rgba(145, 158, 171, 0.12)"
                    borderRadius={2}
                    p={2}
                    onClick={() => downloadFile(attachment.url)}
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
                  </Stack>
                ))}
              </Stack>
            </Paper>
          </Stack>

          <Paper component={Stack} spacing={2} elevation={3} p={3} width="50%">
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Activities</Typography>

              <Button
                size="small"
                variant="text"
                color="inherit"
                component={Link}
                to={`/task/${taskId}/activities`}
              >
                View all
              </Button>
            </Box>

            <Stack
              spacing={2}
              border="1px solid rgba(145, 158, 171, 0.2)"
              borderRadius={2}
              px={2.5}
              py={2}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography color="rgba(145, 158, 171, 1)" variant="subtitle2">
                  REQ#1234: RBAC | Development
                </Typography>
              </Box>

              <Typography color="rgba(145, 158, 171, 1)" variant="subtitle1">
                Name your activity
              </Typography>

              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h4">00:00:00</Typography>

                <Button color="success" variant="contained">
                  Start
                </Button>
              </Box>
            </Stack>

            <Stack spacing={1} aria-label="last activity">
              <Typography
                color="rgba(145, 158, 171, 1)"
                sx={{ fontWeight: 500, fontSize: '14px', lineHeight: '20px' }}
              >
                Last Activity
              </Typography>

              <Box
                display="flex"
                alignItems="center"
                bgcolor="rgba(244, 246, 248, 1)"
                px={1.5}
                py={1}
                borderRadius={1}
              >
                <Stack spacing={0.5} flexGrow={1}>
                  <Typography
                    color="rgba(99, 115, 129, 1)"
                    sx={{ fontWeight: 500, fontSize: '14px', lineHeight: '20px' }}
                  >
                    12 December 2024
                  </Typography>
                  <Typography
                    color="rgba(33, 43, 54, 1)"
                    sx={{ fontWeight: 700, fontSize: '14px', lineHeight: '20px' }}
                  >
                    Dev UI Pengkajian
                  </Typography>
                </Stack>

                <Stack spacing={0.5} alignItems="end">
                  <Typography
                    color="rgba(99, 115, 129, 1)"
                    sx={{ fontWeight: 500, fontSize: '14px', lineHeight: '20px' }}
                  >
                    10:23 - 10:37
                  </Typography>
                  <Typography
                    color="rgba(33, 43, 54, 1)"
                    sx={{ fontWeight: 700, fontSize: '14px', lineHeight: '20px' }}
                  >
                    00:14
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </Paper>
        </Stack>
      </Stack>
    </DashboardContent>
  );
}
