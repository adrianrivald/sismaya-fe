import React, { useEffect, useState } from 'react';
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
  Select,
  MenuItem,
  capitalize,
  SelectChangeEvent,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from 'src/sections/auth/providers/auth';
import {
  useAddRequestAssignee,
  useApproveRequest,
  useCitoById,
  useCompleteRequest,
  useDeleteRequestAssigneeById,
  useRejectRequest,
  useRequestById,
} from 'src/services/request';
import { useUsers } from 'src/services/master-data/user';
import dayjs, { Dayjs } from 'dayjs';

import { DashboardContent } from 'src/layouts/dashboard';
import { SvgColor } from 'src/components/svg-color';
import ModalDialog from 'src/components/modal/modal';
import { priorityColorMap, stepColorMap } from 'src/constants/status';
import { StatusBadge } from '../status-badge';
import { AddAssigneeModal } from '../add-assignee';
import { ApproveAction } from '../approve-action';
import { RejectAction } from '../reject-action';

const priorities = [
  {
    name: 'High',
    id: 'high',
  },
  {
    name: 'Low',
    id: 'low',
  },
  {
    name: 'Medium',
    id: 'medium',
  },
];

export function RequestDetailView() {
  const { user } = useAuth();
  const userType = user?.user_info?.user_type;
  const { id, vendor } = useParams();
  const idCurrentCompany = user?.internal_companies?.find(
    (item) => item?.company?.name?.toLowerCase() === vendor
  )?.company?.id;
  const { data: requestDetail } = useRequestById(id ?? '');
  const { data: cito } = useCitoById(String(idCurrentCompany) ?? '');
  const { data: clientUsers } = useUsers('client', String(idCurrentCompany));
  const { mutate: rejectRequest } = useRejectRequest();
  const { mutate: approveRequest } = useApproveRequest();
  const { mutate: deleteRequestAssignee } = useDeleteRequestAssigneeById();
  const { mutate: completeRequest } = useCompleteRequest();
  const { mutate: addRequestAssignee } = useAddRequestAssignee();
  const [open, setOpen] = useState(false);
  const [openApprove, setOpenApprove] = useState(false);
  const [openAssigneeModal, setOpenAssigneeModal] = useState(false);
  const chats = [];
  const navigate = useNavigate();
  const [dateValue, setDateValue] = useState<Dayjs | null>(dayjs());
  const [selectedPic, setSelectedPic] = React.useState<
    { id: number; picture: string; assignee_id?: number }[] | undefined
  >(
    requestDetail?.assignees?.map(
      (item) =>
        ({
          assignee_id: item?.assignee_id,
          picture: item?.assignee?.user_info?.profile_picture,
          id: item?.id,
        }) ?? []
    )
  );
  const [selectedPicWarning, setSelectedPicWarning] = React.useState(false);
  const [currentPriority, setCurrentPriority] = React.useState(requestDetail?.priority ?? '-');
  const [currentStatus, setCurrentStatus] = React.useState(
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
    setSelectedPic(
      requestDetail?.assignees?.map(
        (item) =>
          ({
            assignee_id: item?.assignee_id,
            picture: item?.assignee?.user_info?.profile_picture,
            id: item?.id,
          }) ?? []
      )
    );
    if (requestDetail?.priority) {
      setCurrentPriority(requestDetail?.priority);
    }
    if (requestDetail?.progress_status) {
      setCurrentStatus(requestDetail?.progress_status?.step);
    }
  }, [requestDetail]);

  const handleChangeDate = (newValue: Dayjs | null) => {
    setDateValue(newValue);
  };

  const onClickEdit = () => {
    navigate(`/${vendor}/request/${id}/edit`);
  };

  const handleSubmit = (formData: { reason: string }) => {
    const payload = {
      ...formData,
      id: Number(id),
    };
    rejectRequest(payload);
    setOpen(false);
  };

  const handleAddPicItem = (userId: number, userPicture: string) => {
    setSelectedPic((prev: { id: number; picture: string }[] | undefined) => [
      ...(prev as []),
      {
        id: userId,
        picture: userPicture,
      },
    ]);
    setSelectedPicWarning(false);
  };

  const handleDeletePicItem = (userId: number) => {
    const newArr = selectedPic?.filter((item) => item?.id !== userId);
    setSelectedPic(newArr);
  };

  const handleDeletePicItemFromDetail = (_userId: number, assigneeId?: number) => {
    if (assigneeId) deleteRequestAssignee(assigneeId);
  };

  const handleAddPicItemFromDetail = (userId: number) => {
    addRequestAssignee({
      assignee_id: userId,
      request_id: Number(id),
    });
  };
  const handleApprove = (formData: any) => {
    const startDate = dayjs(dateValue).format('YYYY-MM-DD');
    const payload = {
      ...formData,
      start_date: startDate,
      id: Number(id),
      assignees: selectedPic?.map((item) => ({
        assignee_id: item?.id,
      })),
    };
    if ((selectedPic ?? [])?.length > 0) {
      approveRequest(payload);
      setOpen(false);
    } else {
      setSelectedPicWarning(true);
    }
  };

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3} xs={12}>
        <Grid item xs={12} md={8}>
          <Box>
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
              <Typography variant="h5">
                {(vendor ?? '').toUpperCase()} Request Management
              </Typography>
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
                  {requestDetail?.is_cito && (
                    <Typography color="grey.500">
                      Cito Quote: {cito?.used}/{cito?.quota} this month
                    </Typography>
                  )}
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
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                  backgroundColor: 'blue.150',
                  py: 1.5,
                  px: 2,
                  my: 3,
                  color: 'grey.600',
                  borderRadius: 2,
                }}
              >
                <Typography>No tasks have been created</Typography>
                <SvgColor width={8} height={9.4} src="/assets/icons/ic-chevron-right.svg" />
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
                    {requestDetail?.step === 'to-do' && (
                      <TableRow>
                        <TableCell size="small" width={200} sx={{ color: 'grey.600' }}>
                          PIC
                        </TableCell>
                        <TableCell size="small">
                          <Box display="flex" gap={2} alignItems="center">
                            <Box display="flex" alignItems="center">
                              {selectedPic?.map((item) => (
                                <Box
                                  width={36}
                                  height={36}
                                  sx={{
                                    marginRight: '-10px',
                                  }}
                                >
                                  <Box
                                    component="img"
                                    src={item?.picture}
                                    sx={{
                                      cursor: 'pointer',
                                      borderRadius: 100,
                                      width: 36,
                                      height: 36,
                                      borderColor: 'white',
                                      borderWidth: 2,
                                      borderStyle: 'solid',
                                    }}
                                  />
                                </Box>
                              ))}
                            </Box>
                            {userType === 'internal' && (
                              <ModalDialog
                                open={openAssigneeModal}
                                setOpen={setOpenAssigneeModal}
                                minWidth={600}
                                title="Assignee"
                                content={
                                  (
                                    <AddAssigneeModal
                                      clientUsers={clientUsers}
                                      handleAddPicItem={handleAddPicItemFromDetail}
                                      selectedPic={selectedPic}
                                      handleDeletePicItem={handleDeletePicItemFromDetail}
                                      isDetail
                                    />
                                  ) as JSX.Element & string
                                }
                              >
                                <Box
                                  component="button"
                                  type="button"
                                  display="flex"
                                  justifyContent="center"
                                  alignItems="center"
                                  sx={{
                                    width: 36,
                                    height: 36,
                                    cursor: 'pointer',
                                    paddingX: 1.5,
                                    paddingY: 1.5,
                                    border: 1,
                                    borderStyle: 'dashed',
                                    borderColor: 'grey.500',
                                    borderRadius: 100,
                                  }}
                                >
                                  <SvgColor
                                    color="#637381"
                                    width={12}
                                    height={12}
                                    src="/assets/icons/ic-plus.svg"
                                  />
                                </Box>
                              </ModalDialog>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                    {requestDetail?.step === 'to-do' && (
                      <TableRow>
                        <TableCell size="small" width={200} sx={{ color: 'grey.600' }}>
                          Start Date
                        </TableCell>
                        <TableCell size="small">
                          {dayjs(requestDetail?.start_date).format('YYYY-MM-DD')}
                        </TableCell>
                      </TableRow>
                    )}
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
                          {(requestDetail?.attachments ?? []).length > 0
                            ? requestDetail?.attachments?.map((file) => (
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
                                  </Box>
                                  <SvgColor src="/assets/icons/ic-download.svg" />
                                </Box>
                              ))
                            : '-'}
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              {userType === 'internal' && requestDetail?.step === 'pending' && (
                <Box mt={4} display="flex" justifyContent="flex-end" gap={2} alignItems="center">
                  <RejectAction open={open} setOpen={setOpen} handleSubmit={handleSubmit} />
                  <ApproveAction
                    clientUsers={clientUsers}
                    dateValue={dateValue}
                    handleAddPicItem={handleAddPicItem}
                    handleApprove={handleApprove}
                    handleChangeDate={handleChangeDate}
                    openApprove={openApprove}
                    openAssigneeModal={openAssigneeModal}
                    priorities={priorities}
                    selectedPic={selectedPic}
                    selectedPicWarning={selectedPicWarning}
                    setOpenApprove={setOpenApprove}
                    setOpenAssigneeModal={setOpenAssigneeModal}
                    setSelectedPic={setSelectedPic}
                    handleDeletePicItem={handleDeletePicItem}
                  />
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
