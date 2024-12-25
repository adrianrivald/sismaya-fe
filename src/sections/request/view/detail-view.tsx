import Typography from '@mui/material/Typography';
import {
  Box,
  Grid,
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Input,
  Button,
  TextField,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from 'src/sections/auth/providers/auth';
import { useRequestById } from 'src/services/request';

import { DashboardContent } from 'src/layouts/dashboard';
import { SvgColor } from 'src/components/svg-color';
import ModalDialog from 'src/components/modal/modal';
import { StatusBadge } from '../status-badge';

export function RequestDetailView() {
  const { user } = useAuth();
  const userType = user?.user_info?.user_type;
  const { id, vendor } = useParams();
  const { data: requestDetail } = useRequestById(id ?? '');
  const chats = [];
  const navigate = useNavigate();
  const onClickEdit = () => {
    navigate(`/${vendor}/request/${id}/edit`);
  };

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3} xs={12}>
        <Grid item xs={12} md={8}>
          <Box>
            <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
              Request {requestDetail?.id} {/* TODO: Change it to number request */}
            </Typography>
            <Box display="flex" gap={2} sx={{ mb: { xs: 3, md: 5 } }}>
              <Typography variant="h5">Request</Typography>
              <Typography variant="h5">
                {(vendor ?? '').toUpperCase()} Request Management
              </Typography>
            </Box>
            <Box>
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
                Status <StatusBadge type="info" label="Requested" />
              </Box>
            </Box>
            <Box
              p={3}
              bgcolor="blue.50"
              sx={{
                borderRadius: 2,
                marginTop: 2,
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" gap={1} alignItems="center">
                  <Typography fontWeight="bold" color="primary">
                    REQUEST {requestDetail?.number}
                  </Typography>
                  {requestDetail?.is_cito && <StatusBadge type="danger" label="CITO" />}
                </Box>
                <Button
                  onClick={onClickEdit}
                  type="button"
                  sx={{
                    paddingY: 0.5,
                    border: 1,
                    borderColor: 'primary.main',
                    borderRadius: 1.5,
                  }}
                >
                  Edit Detail
                </Button>
              </Box>
              <TableContainer>
                <Table sx={{ marginTop: 2 }}>
                  <TableBody>
                    <TableRow>
                      <TableCell size="small" width={200} sx={{ color: 'grey.600' }}>
                        Requester Name
                      </TableCell>
                      <TableCell size="small" sx={{ color: 'blue.700', fontWeight: 500 }}>
                        {requestDetail?.creator?.name ?? 'Pending'}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell size="small" width={200} sx={{ color: 'grey.600' }}>
                        Company
                      </TableCell>
                      <TableCell size="small" sx={{ color: 'blue.700', fontWeight: 500 }}>
                        {requestDetail?.company?.name ?? 'Pending'}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell size="small" width={200} sx={{ color: 'grey.600' }}>
                        Division
                      </TableCell>
                      <TableCell size="small" sx={{ color: 'blue.700', fontWeight: 500 }}>
                        {requestDetail?.department?.name ?? 'Pending'}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell size="small" width={200} sx={{ color: 'grey.600' }}>
                        Category
                      </TableCell>
                      <TableCell size="small">{requestDetail?.category?.name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell size="small" width={200} sx={{ color: 'grey.600' }}>
                        Request Description
                      </TableCell>
                      <TableCell size="small" sx={{ color: 'blue.700', fontWeight: 500 }}>
                        {requestDetail?.description ?? 'Pending'}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell valign="top" size="small" width={200} sx={{ color: 'grey.600' }}>
                        Attachments
                      </TableCell>
                      <TableCell size="small">
                        <Box width="max-content" display="flex" flexDirection="column" gap={3}>
                          {requestDetail?.attachments?.map((file) => (
                            <Box
                              display="flex"
                              gap={3}
                              alignItems="center"
                              px={2}
                              py={1}
                              sx={{ border: 1, borderRadius: 1, borderColor: 'grey.300' }}
                            >
                              <Box component="img" src="/assets/icons/file.png" />
                              <Box>
                                <Typography fontWeight="bold">{file?.file_name}</Typography>
                                {/* 2 Mb */}
                              </Box>
                              <SvgColor src="/assets/icons/ic-download.svg" />
                            </Box>
                          ))}
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              {userType === 'internal' && (
                <Box mt={4} display="flex" justifyContent="flex-end" gap={2} alignItems="center">
                  <ModalDialog
                    minWidth={600}
                    title="Reject Request?"
                    content={
                      (
                        <Box mt={2}>
                          <Typography>Please fill in rejection reason.</Typography>
                          <TextField
                            autoComplete="off"
                            multiline
                            sx={{
                              marginTop: 2,
                              width: '100%',
                            }}
                            label="Rejection Reason"
                            rows={4}
                          />
                          <Box
                            mt={2}
                            display="flex"
                            justifyContent="flex-end"
                            alignItems="center"
                            gap={2}
                          >
                            <Button
                              type="button"
                              sx={{
                                paddingY: 0.5,
                                border: 1,
                                borderColor: 'primary.main',
                                borderRadius: 1.5,
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="button"
                              sx={{
                                paddingY: 1,
                                paddingX: 2.5,
                                backgroundColor: 'error.light',
                                borderRadius: 1.5,
                                color: 'white',
                                fontWeight: 'normal',
                              }}
                            >
                              Reject Request
                            </Button>
                          </Box>
                        </Box>
                      ) as any
                    }
                  >
                    {/* Button Open Modal */}
                    <Button
                      type="button"
                      sx={{
                        paddingY: 1,
                        paddingX: 2.5,
                        backgroundColor: 'error.light',
                        borderRadius: 1.5,
                        color: 'white',
                        fontWeight: 'normal',
                      }}
                    >
                      Reject Request
                    </Button>
                  </ModalDialog>
                  <Button
                    type="button"
                    sx={{
                      paddingY: 1,
                      paddingX: 2.5,
                      backgroundColor: 'primary.main',
                      borderRadius: 1.5,
                      color: 'white',
                      fontWeight: 'normal',
                    }}
                  >
                    Accept Request
                  </Button>
                </Box>
              )}
            </Box>
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
