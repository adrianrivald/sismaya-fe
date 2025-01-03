import { Box, InputAdornment, TextField, Typography } from '@mui/material';
import { ChangeEvent } from 'react';
import { SvgColor } from 'src/components/svg-color';
import { User } from 'src/services/master-data/user/types';

interface AddAssigneeModalProps {
  internalUsers: User[] | undefined;
  selectedPic?: SelectedPic[] | undefined;
  handleAddPicItem: (userId: number, userPicture: string) => void;
  handleDeletePicItem: (userId: number, assigneeId?: number) => void;
  isDetail?: boolean;
  onSearchUser: (e: ChangeEvent<HTMLInputElement>) => void;
}

interface SelectedPic {
  id: number;
  picture: string;
  assignee_id?: number;
}

export function AddAssigneeModal({
  internalUsers,
  selectedPic,
  handleAddPicItem,
  handleDeletePicItem,
  isDetail = false,
  onSearchUser,
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
      {internalUsers?.map((internalUser) => (
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" gap={2} alignItems="center" p={2}>
            <Box
              component="img"
              src={internalUser?.user_info?.profile_picture}
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
              <Typography>{internalUser?.user_info?.name}</Typography>
              <Typography color="grey.600">{internalUser?.email}</Typography>
            </Box>
          </Box>
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
                handleAddPicItem(internalUser?.id, internalUser?.user_info?.profile_picture)
              }
            >
              <SvgColor width={24} height={24} src="/assets/icons/ic-add.svg" />
              Assign
            </Box>
          )}
        </Box>
      ))}
    </>
  );
}