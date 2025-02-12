import type { SelectChangeEvent } from '@mui/material';
import {
  Box,
  Button,
  Card,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  menuItemClasses,
  MenuList,
  OutlinedInput,
  Select,
  Typography,
} from '@mui/material';
import { SvgColor } from 'src/components/svg-color';
import { DataTable } from 'src/components/table/data-tables';
import type { Dispatch, SetStateAction } from 'react';
import { createColumnHelper, type CellContext } from '@tanstack/react-table';
import type { User } from 'src/services/master-data/user/types';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Role, useRole, useRoleList } from 'src/services/master-data/role';
import { useDeleteUserById, useUserList } from 'src/services/master-data/user';
import { DashboardContent } from 'src/layouts/dashboard';
import { useInternalCompanies } from 'src/services/master-data/company';
import { RemoveAction } from '../../remove-action';

interface PopoverProps {
  handleEdit: (id: number) => void;
  setOpenRemoveModal: Dispatch<SetStateAction<boolean>>;
  setSelectedUser: Dispatch<SetStateAction<string>>;
  setSelectedId: Dispatch<SetStateAction<number | null>>;
}

const columnHelper = createColumnHelper<Role>();

const columns = (popoverProps: PopoverProps) => [
  columnHelper.accessor('name', {
    header: 'User Group',
  }),
  columnHelper.accessor('permissions', {
    header: 'Access Permissions',
    cell: (info) => {
      const permissions = info.getValue();
      return (
        <Box display="flex" flexWrap="wrap" gap={2}>
          {permissions?.map((permission) => (
            <Box
              sx={{
                backgroundColor: '#D6F3F9',
                color: 'info.dark',
                px: 1,
                py: 0.5,
                borderRadius: '8px',
              }}
            >
              <Typography fontWeight="500">{permission}</Typography>
            </Box>
          ))}
        </Box>
      );
    },
  }),

  columnHelper.display({
    id: 'actions',
    cell: (info) => ButtonActions(info, popoverProps),
  }),
];

function ButtonActions(props: CellContext<Role, unknown>, popoverProps: PopoverProps) {
  const { row } = props;
  const companyId = row.original.id;
  const userName = row.original?.name;
  const { handleEdit, setSelectedId, setOpenRemoveModal, setSelectedUser } = popoverProps;

  const onClickRemove = () => {
    setSelectedId(companyId);
    setSelectedUser(userName);
    setOpenRemoveModal(true);
  };
  return (
    <MenuList
      disablePadding
      sx={{
        p: 0.5,
        gap: 1,
        display: 'flex',
        flexDirection: 'row',
        [`& .${menuItemClasses.root}`]: {
          px: 1,
          gap: 2,
          borderRadius: 0.75,
          [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
        },
      }}
    >
      <Button
        sx={{ fontWeight: 'normal' }}
        variant="outlined"
        onClick={() => handleEdit(companyId)}
      >
        Edit
      </Button>

      <Button
        variant="outlined"
        onClick={onClickRemove}
        sx={{ color: 'black', borderColor: 'grey.500', fontWeight: 'normal' }}
      >
        Delete
      </Button>
    </MenuList>
  );
}

export function AccessControlUserGroupView() {
  const location = useLocation();
  const pathname = location.pathname?.split('/')[2];
  const mode = pathname === 'user-list' ? 'user-list' : 'user-group';
  const { getDataTableProps } = useRoleList({});
  const [openRemoveModal, setOpenRemoveModal] = React.useState(false);
  const { mutate: deleteUserById } = useDeleteUserById();
  const navigate = useNavigate();

  const onClickAddNew = () => {
    navigate('/access-control/user-group/create');
  };

  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const [selectedUser, setSelectedUser] = React.useState<string>('');

  const popoverFuncs = () => {
    const handleEdit = (id: number) => {
      navigate(`/access-control/user-group/${id}/edit`);
    };

    const handleDelete = () => {
      deleteUserById(Number(selectedId));
      setOpenRemoveModal(false);
    };

    return { handleEdit, handleDelete };
  };
  return (
    <DashboardContent maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
            Access Control
          </Typography>

          <Box
            display="flex"
            gap={1}
            alignItems="center"
            sx={{ backgroundColor: 'grey.200', padding: 1, borderRadius: 1, mb: 2 }}
          >
            <Box
              onClick={() => navigate('/access-control/user-group')}
              sx={{
                cursor: 'pointer',
                backgroundColor: mode === 'user-list' ? 'common.white' : '',
                padding: 1,
                borderRadius: 1,
              }}
            >
              <Typography>User List</Typography>
            </Box>
            <Box
              onClick={() => navigate('/access-control/user-group')}
              sx={{
                cursor: 'pointer',
                backgroundColor: mode === 'user-group' ? 'common.white' : '',
                padding: 1,
                borderRadius: 1,
              }}
            >
              <Typography>User Group</Typography>
            </Box>
          </Box>
        </Box>
        <Box>
          <Button onClick={onClickAddNew} variant="contained" color="primary">
            Create New User Group
          </Button>
        </Box>
      </Box>
      <Grid container spacing={3}>
        <Grid xs={12}>
          <Card
            sx={{
              mt: 2,
              p: 3,
              boxShadow: '2',
              position: 'relative',
              backgroundColor: 'common.white',
              borderRadius: 4,
            }}
          >
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Box
                sx={{
                  width: '100%',
                }}
              >
                <FormControl sx={{ width: '100%' }} variant="outlined">
                  <OutlinedInput
                    id="outlined-adornment"
                    startAdornment={
                      <InputAdornment position="start">
                        <SvgColor src="/assets/icons/ic-magnifier.svg" />
                      </InputAdornment>
                    }
                    aria-describedby="outlined-search-helper-text"
                    inputProps={{
                      'aria-label': 'search',
                    }}
                    placeholder="Search..."
                  />
                </FormControl>
              </Box>
            </Box>

            <DataTable
              columns={columns({
                ...popoverFuncs(),
                setOpenRemoveModal,
                setSelectedId,
                setSelectedUser,
              })}
              {...getDataTableProps()}
            />
          </Card>
        </Grid>
      </Grid>
      <RemoveAction
        onRemove={popoverFuncs().handleDelete}
        openRemoveModal={openRemoveModal}
        setOpenRemoveModal={setOpenRemoveModal}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />
    </DashboardContent>
  );
}
