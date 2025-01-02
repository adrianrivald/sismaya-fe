import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { Form } from 'src/components/form/form';
import ModalDialog from 'src/components/modal/modal';
import { SvgColor } from 'src/components/svg-color';
import { User } from 'src/services/master-data/user/types';
import { AddAssigneeModal } from './add-assignee';

interface SelectedPic {
  id: number;
  picture: string;
}

interface Priority {
  name: string;
  id: string;
}

interface ApproveActionProps {
  openApprove: boolean;
  setOpenApprove: Dispatch<SetStateAction<boolean>>;
  setSelectedPic: Dispatch<SetStateAction<SelectedPic[] | undefined>>;
  handleApprove: (formData: any) => void;
  priorities: Priority[];
  dateValue: dayjs.Dayjs | null;
  handleChangeDate: (newValue: Dayjs | null) => void;
  selectedPic: SelectedPic[] | undefined;
  selectedPicWarning: boolean;
  openAssigneeModal: boolean;
  setOpenAssigneeModal: Dispatch<SetStateAction<boolean>>;
  clientUsers: User[] | undefined;
  handleAddPicItem: (userId: number, userPicture: string) => void;
  handleDeletePicItem: (userId: number) => void;
  onSearchUser: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function ApproveAction({
  openApprove,
  setOpenApprove,
  setSelectedPic,
  handleApprove,
  priorities,
  dateValue,
  handleChangeDate,
  selectedPic,
  selectedPicWarning,
  openAssigneeModal,
  setOpenAssigneeModal,
  clientUsers,
  handleAddPicItem,
  handleDeletePicItem,
  onSearchUser,
}: ApproveActionProps) {
  return (
    <ModalDialog
      open={openApprove}
      setOpen={setOpenApprove}
      minWidth={600}
      title="Approve Request?"
      onClose={() => setSelectedPic([])}
      content={
        (
          <Box mt={2}>
            <Typography>Please select the priority category to approve this request.</Typography>
            <Form width="100%" onSubmit={handleApprove} mt={4}>
              {({ register, formState, watch }) => (
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
                    <ModalDialog
                      open={openAssigneeModal}
                      setOpen={setOpenAssigneeModal}
                      minWidth={600}
                      title="Assignee"
                      content={
                        (
                          <AddAssigneeModal
                            clientUsers={clientUsers}
                            handleAddPicItem={handleAddPicItem}
                            selectedPic={selectedPic}
                            handleDeletePicItem={handleDeletePicItem}
                            onSearchUser={onSearchUser}
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
                  </Box>
                  {selectedPicWarning ? (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      PIC must be selected, minimum 1 PIC
                    </FormHelperText>
                  ) : null}
                  <Box mt={2} display="flex" justifyContent="flex-end" alignItems="center" gap={2}>
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
  );
}
