import React, { useState } from 'react';
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
  FormHelperText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Popover,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from 'src/sections/auth/providers/auth';
import { useApproveRequest, useRejectRequest, useRequestById } from 'src/services/request';
import { Form } from 'src/components/form/form';
import { useUsers } from 'src/services/master-data/user';
import dayjs, { Dayjs } from 'dayjs';

import { DashboardContent } from 'src/layouts/dashboard';
import { SvgColor } from 'src/components/svg-color';
import ModalDialog from 'src/components/modal/modal';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StatusBadge } from '../status-badge';

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
  const { data: clientUsers } = useUsers('client', String(idCurrentCompany));
  const { mutate: rejectRequest } = useRejectRequest();
  const { mutate: approveRequest } = useApproveRequest();
  const [open, setOpen] = useState(false);
  const [openApprove, setOpenApprove] = useState(false);
  const chats = [];
  const navigate = useNavigate();
  const [dateValue, setDateValue] = useState<Dayjs | null>(dayjs());
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [selectedPic, setSelectedPic] = React.useState<
    { id: number; picture: string }[] | undefined
  >([]);
  const openAnchor = Boolean(anchorEl);
  const idAnchor = open ? 'simple-popover' : undefined;
  const [selectedPicWarning, setSelectedPicWarning] = React.useState(false);

  const handleClosePic = () => {
    setAnchorEl(null);
  };

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

  const handleAddPic = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
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
                    open={open}
                    setOpen={setOpen}
                    minWidth={600}
                    title="Reject Request?"
                    content={
                      (
                        <Box mt={2}>
                          <Typography>Please fill in rejection reason.</Typography>
                          <Form width="100%" onSubmit={handleSubmit}>
                            {({ register, control, formState, watch }) => (
                              <>
                                <TextField
                                  autoComplete="off"
                                  multiline
                                  sx={{
                                    marginTop: 2,
                                    width: '100%',
                                  }}
                                  label="Rejection Reason"
                                  rows={4}
                                  {...register('reason', {
                                    required: 'Reason must be filled out',
                                  })}
                                />
                                <Box
                                  mt={2}
                                  display="flex"
                                  justifyContent="flex-end"
                                  alignItems="center"
                                  gap={2}
                                >
                                  <Button
                                    onClick={() => setOpen(false)}
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
                                    type="submit"
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
                              </>
                            )}
                          </Form>
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
                  <ModalDialog
                    open={openApprove}
                    setOpen={setOpenApprove}
                    minWidth={600}
                    title="Approve Request?"
                    onClose={() => setSelectedPic([])}
                    content={
                      (
                        <Box mt={2}>
                          <Typography>
                            Please select the priority category to approve this request.
                          </Typography>
                          <Form width="100%" onSubmit={handleApprove} mt={4}>
                            {({ register, control, formState, watch }) => (
                              <>
                                <Box>
                                  <FormControl fullWidth>
                                    <InputLabel id="select-priority">Priority*</InputLabel>
                                    <Select
                                      labelId="select-priority"
                                      error={Boolean(formState?.errors?.priority)}
                                      {...register('priority', {
                                        required: 'Priority must be filled out',
                                      })}
                                      label="Priority*"
                                      value={watch('priority')}
                                    >
                                      {priorities?.map((priority) => (
                                        <MenuItem value={priority?.id}>{priority?.name}</MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                  {formState?.errors?.priority && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                      {String(formState?.errors?.priority?.message)}
                                    </FormHelperText>
                                  )}
                                </Box>
                                <Box
                                  mt={4}
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="space-between"
                                  gap={2}
                                >
                                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                      sx={{
                                        width: '50%',
                                      }}
                                      label="Start Date"
                                      value={dateValue}
                                      onChange={handleChangeDate}
                                      // renderInput={(params: any) => <TextField {...params} />}
                                    />
                                  </LocalizationProvider>
                                  <TextField
                                    error={Boolean(formState?.errors?.estimated_duration)}
                                    sx={{
                                      width: '50%',
                                    }}
                                    type="number"
                                    label="Estimated Duration"
                                    {...register('estimated_duration', {
                                      valueAsNumber: true,

                                      // required: 'Estimated Duration must be filled out',
                                    })}
                                  />
                                  {formState?.errors?.estimated_duration && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                      {String(formState?.errors?.estimated_duration?.message)}
                                    </FormHelperText>
                                  )}
                                </Box>
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  gap={4}
                                  mt={4}
                                  sx={{
                                    backgroundColor: 'blue.50',
                                    paddingY: 4,
                                    paddingX: 2,
                                    borderRadius: 1.5,
                                  }}
                                >
                                  <Typography color="grey.600">PIC</Typography>
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
                                  <Box
                                    component="button"
                                    type="button"
                                    aria-describedby={idAnchor}
                                    onClick={handleAddPic}
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
                                  <Popover
                                    id={idAnchor}
                                    open={openAnchor}
                                    anchorEl={anchorEl}
                                    onClose={handleClosePic}
                                    anchorOrigin={{
                                      vertical: 'bottom',
                                      horizontal: 'left',
                                    }}
                                  >
                                    {clientUsers?.map((clientUser) => (
                                      <Box
                                        display="flex"
                                        gap={2}
                                        alignItems="center"
                                        p={2}
                                        sx={{
                                          cursor: 'pointer',
                                          '&:hover': {
                                            backgroundColor: 'grey.100',
                                          },
                                        }}
                                        onClick={() =>
                                          handleAddPicItem(
                                            clientUser?.id,
                                            clientUser?.user_info?.profile_picture
                                          )
                                        }
                                      >
                                        <Box
                                          component="img"
                                          src={clientUser?.user_info?.profile_picture}
                                          sx={{
                                            borderRadius: 100,
                                            width: 36,
                                            height: 36,
                                            borderColor: 'white',
                                            borderWidth: 2,
                                            borderStyle: 'solid',
                                          }}
                                        />

                                        <Typography>{clientUser?.user_info?.name}</Typography>
                                      </Box>
                                    ))}
                                  </Popover>
                                </Box>
                                {selectedPicWarning ? (
                                  <FormHelperText sx={{ color: 'error.main' }}>
                                    PIC must be selected, minimum 1 PIC
                                  </FormHelperText>
                                ) : null}
                                <Box
                                  mt={2}
                                  display="flex"
                                  justifyContent="flex-end"
                                  alignItems="center"
                                  gap={2}
                                >
                                  <Button
                                    onClick={() => setOpenApprove(false)}
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
                                    type="submit"
                                    sx={{
                                      paddingY: 0.5,
                                      border: 1,
                                      borderRadius: 1.5,
                                      backgroundColor: 'primary.main',
                                      borderColor: 'primary.main',
                                      color: 'white',
                                    }}
                                  >
                                    Approve Request
                                  </Button>
                                </Box>
                              </>
                            )}
                          </Form>
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
                        backgroundColor: 'primary.main',
                        borderRadius: 1.5,
                        color: 'white',
                        fontWeight: 'normal',
                      }}
                    >
                      Accept Request
                    </Button>
                  </ModalDialog>
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
