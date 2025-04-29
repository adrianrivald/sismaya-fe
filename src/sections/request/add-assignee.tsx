import { Box, Button, InputAdornment, TextField, Typography } from '@mui/material';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { SvgColor } from 'src/components/svg-color';
import { User } from 'src/services/master-data/user/types';

interface AddAssigneeModalProps {
  internalUsers: User[] | undefined;
  selectedPic?: SelectedPic[] | undefined;
  handleAddPicItem: (userId: number, userPicture: string, userName: string) => void;
  handleDeletePicItem: (userId: number, assigneeId?: number) => void;
  isDetail?: boolean;
  onSearchUser: (e: ChangeEvent<HTMLInputElement>) => void;
  setOpenAssigneeModal: Dispatch<SetStateAction<boolean>>;
  isAssignable?: boolean;
}

interface SelectedPic {
  id: number;
  picture: string;
  assignee_id?: number;
  name: string;
}

export function AddAssigneeModal({
  internalUsers,
  selectedPic,
  handleAddPicItem,
  handleDeletePicItem,
  isDetail = false,
  onSearchUser,
  setOpenAssigneeModal,
  isAssignable = true,
}: AddAssigneeModalProps) {
  return (
    <>
      <Box sx={{ width: '100%', my: 3 }}>
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
          onChange={onSearchUser}
        />
      </Box>
      {console.log('data', internalUsers)}
      <Box sx={{ maxHeight: '50vh', overflow: 'auto' }}>
        {internalUsers
          ?.filter((item) =>
            !isAssignable
              ? selectedPic?.some((selectedPicItem) => selectedPicItem?.assignee_id === item?.id)
              : item
          )
          .map((internalUser) => (
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" gap={2} alignItems="center" p={2}>
                <Box
                  component="img"
                  src={
                    internalUser?.user_info?.profile_picture !== ''
                      ? internalUser?.user_info?.profile_picture
                      : '/assets/icons/user.png'
                  }
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
                  <Typography variant="subtitle2" color="#1C252E">
                    {internalUser?.user_info?.name}
                  </Typography>
                  <Typography variant="body2" color="#637381">
                    {internalUser?.email || '-'}
                  </Typography>
                  <Typography variant="body2" color="#637381">
                    {internalUser?.user_info?.role.name || '-'}
                  </Typography>
                </Box>
              </Box>
              {isAssignable && (
                <>
                  {selectedPic?.some((el) =>
                    isDetail ? el?.assignee_id === internalUser?.id : el?.id === internalUser?.id
                  ) ? (
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={2}
                      sx={{
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        color: 'info.main',
                      }}
                      onClick={() =>
                        handleDeletePicItem(
                          internalUser?.id,
                          selectedPic?.find((item) => item?.assignee_id === internalUser?.id)?.id
                        )
                      }
                    >
                      <SvgColor width={24} height={24} src="/assets/icons/ic-check.svg" />
                      Assigned
                    </Box>
                  ) : (
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={2}
                      sx={{
                        cursor: 'pointer',
                        fontWeight: 'bold',
                      }}
                      onClick={() =>
                        handleAddPicItem(
                          internalUser?.id,
                          internalUser?.user_info?.profile_picture,
                          internalUser?.user_info?.name
                        )
                      }
                    >
                      <SvgColor width={24} height={24} src="/assets/icons/ic-add.svg" />
                      Assign
                    </Box>
                  )}
                </>
              )}
            </Box>
          ))}
      </Box>
      <Box mt={3} display="flex" justifyContent="flex-end">
        <Button
          onClick={() => setOpenAssigneeModal(false)}
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
    </>
  );
}
