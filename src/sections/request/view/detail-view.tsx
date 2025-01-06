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
  useCompleteRequest,
  useDeleteRequestAssigneeById,
  useRejectRequest,
  useRequestById,
} from 'src/services/request';
import { useUsers } from 'src/services/master-data/user';
import dayjs, { Dayjs } from 'dayjs';
import { downloadFile } from 'src/utils/download';
import { SvgColor } from 'src/components/svg-color';
import ModalDialog from 'src/components/modal/modal';
import { useSearchDebounce } from 'src/utils/hooks/use-debounce';
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
  const { data: internalUser } = useUsers('internal', String(idCurrentCompany));
  const { mutate: rejectRequest } = useRejectRequest();
  const { mutate: approveRequest } = useApproveRequest();
  const { mutate: deleteRequestAssignee } = useDeleteRequestAssigneeById();
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
    requestDetail?.assignees?.map((item) => ({
      assignee_id: item?.assignee_id,
      picture: item?.assignee?.user_info?.profile_picture,
      id: item?.id,
    })) ?? []
  );
  const [selectedPicWarning, setSelectedPicWarning] = React.useState(false);

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
      })) ?? []
    );
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

  const onSearchUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
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
        <Typography>
          {requestDetail?.task_count ? 'Tasks have been created' : 'No tasks have been created'}
        </Typography>
        <Link to="task">
          <SvgColor width={8} height={9.4} src="/assets/icons/ic-chevron-right.svg" />
        </Link>
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
      {userType === 'internal' && requestDetail?.step === 'pending' && (
        <Box mt={4} display="flex" justifyContent="flex-end" gap={2} alignItems="center">
          <RejectAction open={open} setOpen={setOpen} handleSubmit={handleSubmit} />
          <ApproveAction
            internalUsers={filteredInternalUser}
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
            onSearchUser={onSearchUser}
          />
        </Box>
      )}
    </Box>
  );
}
