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
  Stack,
} from '@mui/material';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from 'src/sections/auth/providers/auth';
import {
  useAddRequestAssignee,
  useApproveRequest,
  useCitoById,
  useDeleteRequestAssigneeById,
  useMyRequestById,
  useRejectRequest,
  useRequestById,
  useRequestStatus,
} from 'src/services/request';
import { getFileExtension } from 'src/utils/get-file-format';
import { useInternalUsers, useUsers } from 'src/services/master-data/user';
import dayjs, { Dayjs } from 'dayjs';
import { downloadFile } from 'src/utils/download';
import { SvgColor } from 'src/components/svg-color';
import ModalDialog from 'src/components/modal/modal';
import { useSearchDebounce } from 'src/utils/hooks/use-debounce';
import PdfPreview from 'src/utils/pdf-viewer';
import { toast } from 'react-toastify';
import { DashboardContent } from 'src/layouts/dashboard';
import { priorityColorMap, stepColorMap } from 'src/constants/status';
import { useUserPermissions } from 'src/services/auth/use-user-permissions';
import { StatusBadge } from '../request/status-badge';
import { AddAssigneeModal } from '../request/add-assignee';
import { ApproveAction } from '../request/approve-action';
import { RejectAction } from '../request/reject-action';

const priorities = [
  {
    name: 'Low',
    id: 'low',
  },
  {
    name: 'Medium',
    id: 'medium',
  },
  {
    name: 'High',
    id: 'high',
  },
];

export default function MyRequestTask() {
  const { user } = useAuth();
  const { data: userPermissions } = useUserPermissions();
  const userType = user?.user_info?.user_type;
  const { id, vendor } = useParams();
  const idCurrentCompany = user?.internal_companies?.find(
    (item) => item?.company?.name?.toLowerCase() === vendor
  )?.company?.id;
  const { data: requestDetail } = useMyRequestById(id ?? '');

  const { data: internalUser } = useInternalUsers(String(idCurrentCompany));
  const { mutate: rejectRequest } = useRejectRequest();
  const { mutate: approveRequest } = useApproveRequest();
  const { mutate: deleteRequestAssignee } = useDeleteRequestAssigneeById();
  const { mutate: addRequestAssignee } = useAddRequestAssignee();
  const [open, setOpen] = useState(false);
  const [openAssigneeModal, setOpenAssigneeModal] = useState(false);
  const navigate = useNavigate();
  const [dateValue, setDateValue] = useState<Dayjs | null>(dayjs());
  const [endDateValue, setEndDateValue] = useState<Dayjs | null>(dayjs());
  const [selectedPic, setSelectedPic] = React.useState<
    { id: number; picture: string; assignee_id?: number; name: string }[] | undefined
  >(
    requestDetail?.assignees?.map((item) => ({
      assignee_id: item?.assignee_id,
      picture: item?.assignee?.user_info?.profile_picture,
      id: item?.id,
      name: item?.assignee?.user_info?.name,
    }))
  );
  const [selectedPicWarning, setSelectedPicWarning] = React.useState(false);
  const [isImagePreviewModal, setIsImagePreviewModal] = React.useState(false);
  const [currentPriority] = useState(requestDetail?.priority ?? '-');
  const [currentStatus] = useState(requestDetail?.progress_status?.id ?? 0);
  type StatusStepEnum = 'to_do' | 'in_progress' | 'completed' | 'pending' | 'requested';
  const { data: requestStatuses } = useRequestStatus(String(idCurrentCompany ?? ''));
  const statusStepEnum =
    requestStatuses && requestStatuses?.find((item) => item?.id === currentStatus);
  const [searchTerm, setSearchTerm] = useSearchDebounce();

  const filteredInternalUser = internalUser?.filter((item) =>
    item?.user_info?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setSelectedPic(
      requestDetail?.assignees?.map((item) => ({
        assignee_id: item?.assignee_id,
        picture: item?.assignee?.user_info?.profile_picture,
        id: item?.id,
        name: item?.assignee?.user_info?.name,
      }))
    );
  }, [requestDetail]);

  const handleChangeDate = (newValue: Dayjs | null) => {
    setDateValue(newValue);
    if (dayjs(endDateValue).isBefore(newValue)) {
      setEndDateValue(newValue);
    }
  };

  const handleChangeEndDate = (newValue: Dayjs | null) => {
    setEndDateValue(newValue);
  };

  const onClickEdit = () => {
    if (!userPermissions?.includes('request:update')) {
      toast.error("You don't have permission");
    } else {
      navigate(`/${vendor}/request/${id}/edit`);
    }
  };

  const handleSubmit = (formData: { reason: string }) => {
    const payload = {
      ...formData,
      id: Number(id),
    };
    rejectRequest(payload);
    setOpen(false);
  };

  const handleAddPicItem = (userId: number, userPicture: string, userName: string) => {
    setSelectedPic((prev: { id: number; picture: string; name: string }[] | undefined) => [
      ...(prev as []),
      {
        id: userId,
        picture: userPicture,
        name: userName,
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
    const startDate = dayjs(dateValue).format('YYYY-MM-DD hh:mm:ss');
    const endDate = dayjs(endDateValue).format('YYYY-MM-DD hh:mm:ss');
    const payload = {
      ...formData,
      start_date: startDate,
      end_date: endDate,
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

  const onSearchUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const [selectedImage, setSelectedImage] = React.useState('');

  const onPreviewFile = (filePath: string, fileName: string) => {
    const fileExtension = getFileExtension(fileName);
    const pdfExtension = ['pdf'];
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
    const isImage = imageExtensions.includes(fileExtension);
    const isPdf = pdfExtension.includes(fileExtension);
    if (isImage) {
      setIsImagePreviewModal(true);
      setSelectedImage(fileName);
    }
    if (isPdf) {
      setIsImagePreviewModal(true);
      setSelectedImage(fileName);
    }
  };

  const names = selectedPic?.slice(0, 5).map((item) => item.name);

  const priorityEnum = () => {
    if (currentPriority === 'low') return 'low';
    if (currentPriority === 'medium') return 'medium';
    if (currentPriority === 'high') return 'high';
    if (currentPriority === 'cito') return 'cito';
    return 'low';
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
                  You haven’t filled out the evaluation report for this request.
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
                Fill Out the Evaluation Report
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
                    disabled
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
                  disabled
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
                >
                  {requestStatuses?.map((value) => (
                    <MenuItem value={value?.id}>{capitalize(value?.name)}</MenuItem>
                  ))}
                </Select>
              </Box>
            </Box>
          </Stack>
        </Grid>
      </Grid>
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
        </Box>
        {userType === 'internal' && (
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
            <Typography>
              {requestDetail?.task_count ? 'Tasks have been created' : 'No tasks have been created'}
            </Typography>

            <SvgColor width={8} height={9.4} src="/assets/icons/ic-chevron-right.svg" />
          </Box>
        )}
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
                  Request Title
                </TableCell>
                <TableCell size="small" sx={{ color: 'blue.700', fontWeight: 500 }}>
                  {requestDetail?.name ?? '-'}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell size="small" width={200} sx={{ color: 'grey.600' }}>
                  Product
                </TableCell>
                <TableCell size="small" sx={{ color: 'blue.700', fontWeight: 500 }}>
                  {requestDetail?.product?.name ?? '-'}
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
              {requestDetail?.step !== 'pending' && requestDetail?.step !== 'rejected' && (
                <TableRow>
                  <TableCell size="small" width={200} sx={{ color: 'grey.600' }}>
                    PIC
                  </TableCell>
                  <TableCell size="small">
                    <Box display="flex" gap={2} alignItems="center">
                      <Box display="flex" alignItems="center">
                        {names && names.join(', ').length > 50
                          ? `${names.join(', ').substring(0, 50 - 3)}...`
                          : names && names.join(', ')}
                      </Box>
                      {userType === 'internal' && requestDetail?.step !== 'done' && (
                        <ModalDialog
                          open={openAssigneeModal}
                          setOpen={setOpenAssigneeModal}
                          minWidth={600}
                          title="Assignee"
                          content={
                            (
                              <AddAssigneeModal
                                isAssignable={false}
                                internalUsers={filteredInternalUser}
                                handleAddPicItem={handleAddPicItemFromDetail}
                                selectedPic={selectedPic}
                                handleDeletePicItem={handleDeletePicItemFromDetail}
                                isDetail
                                onSearchUser={onSearchUser}
                                setOpenAssigneeModal={setOpenAssigneeModal}
                              />
                            ) as JSX.Element & string
                          }
                        >
                          <Box sx={{ color: 'primary.main', cursor: 'pointer' }}>See All</Box>
                          {/* <Box
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
                        </Box> */}
                        </ModalDialog>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              )}
              {requestDetail?.step !== 'pending' && requestDetail?.step !== 'rejected' && (
                <TableRow>
                  <TableCell size="small" width={200} sx={{ color: 'grey.600' }}>
                    Start Date
                  </TableCell>
                  <TableCell size="small">
                    {dayjs(requestDetail?.start_date).format('YYYY-MM-DD')}
                  </TableCell>
                </TableRow>
              )}
              {requestDetail?.step !== 'pending' && requestDetail?.step !== 'rejected' && (
                <TableRow>
                  <TableCell size="small" width={200} sx={{ color: 'grey.600' }}>
                    End Date
                  </TableCell>
                  <TableCell size="small">
                    {dayjs(requestDetail?.end_date).format('YYYY-MM-DD')}
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
                            <ModalDialog
                              onClose={() => {
                                setIsImagePreviewModal(false);
                                setSelectedImage('');
                              }}
                              open={isImagePreviewModal && selectedImage === file?.file_name}
                              setOpen={setIsImagePreviewModal}
                              minWidth={600}
                              title="Preview"
                              content={
                                (
                                  <>
                                    {file?.file_name?.toLowerCase().endsWith('.pdf') ? (
                                      <PdfPreview
                                        pdfFile={`${file?.file_path}/${file?.file_name}`}
                                      />
                                    ) : (
                                      <Box
                                        component="img"
                                        sx={{
                                          display: 'flex',
                                          justifyContent: 'center',
                                          mt: 4,
                                          maxHeight: '500px',
                                          mx: 'auto',
                                        }}
                                        src={`${file?.file_path}/${file?.file_name}`}
                                      />
                                    )}
                                  </>
                                ) as JSX.Element & string
                              }
                            >
                              <Box
                                sx={{ cursor: 'pointer' }}
                                onClick={() => onPreviewFile(file?.file_path, file?.file_name)}
                              >
                                <Typography fontWeight="bold">
                                  {file?.file_name?.length > 15
                                    ? `${file?.file_name?.substring(0, 15)}...`
                                    : file?.file_name}
                                </Typography>
                              </Box>
                            </ModalDialog>
                            <SvgColor
                              sx={{ cursor: 'pointer' }}
                              onClick={(event) => {
                                event.stopPropagation();
                                downloadFile(file?.file_path.concat('/', file?.file_name));
                              }}
                              src="/assets/icons/ic-download.svg"
                            />
                          </Box>
                        ))
                      : '-'}
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </DashboardContent>
  );
}
