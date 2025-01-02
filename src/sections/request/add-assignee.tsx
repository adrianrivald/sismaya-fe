import { Box, TextField, Typography } from '@mui/material';
import { SvgColor } from 'src/components/svg-color';
import { User } from 'src/services/master-data/user/types';

interface AddAssigneeModalProps {
  clientUsers: User[] | undefined;
  selectedPic?: SelectedPic[] | undefined;
  handleAddPicItem: (userId: number, userPicture: string) => void;
  handleDeletePicItem: (userId: number, assigneeId?: number) => void;
  isDetail?: boolean;
}

interface SelectedPic {
  id: number;
  picture: string;
  assignee_id?: number;
}

export function AddAssigneeModal({
  clientUsers,
  selectedPic,
  handleAddPicItem,
  handleDeletePicItem,
  isDetail = false,
}: AddAssigneeModalProps) {
  return (
    <>
      <Box sx={{ width: '100%', marginTop: 3 }}>
        <TextField sx={{ width: '100%' }} />
      </Box>
      {clientUsers?.map((clientUser) => (
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" gap={2} alignItems="center" p={2}>
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
            <Box>
              <Typography>{clientUser?.user_info?.name}</Typography>
              <Typography color="grey.600">{clientUser?.email}</Typography>
            </Box>
          </Box>
          {selectedPic?.some((el) =>
            isDetail ? el?.assignee_id === clientUser?.id : el?.id === clientUser?.id
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
                  clientUser?.id,
                  selectedPic?.find((item) => item?.assignee_id === clientUser?.id)?.id
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
                handleAddPicItem(clientUser?.id, clientUser?.user_info?.profile_picture)
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
