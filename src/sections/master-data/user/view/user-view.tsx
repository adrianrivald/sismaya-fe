import React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Box, Button, MenuItem, menuItemClasses, MenuList } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'src/components/table/data-tables';
import { CellContext, createColumnHelper } from '@tanstack/react-table';
import { Iconify } from 'src/components/iconify';
import { useDeleteUserById, useUserList } from 'src/services/master-data/user';
import { Users } from './types';

// ----------------------------------------------------------------------

interface PopoverProps {
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
}

const columnHelper = createColumnHelper<Users>();

const columns = (popoverProps: PopoverProps) => [
  columnHelper.accessor('name', {
    header: 'Name',
  }),

  columnHelper.accessor('email', {
    header: 'Email',
  }),

  columnHelper.accessor('phone', {
    header: 'Phone Number',
  }),

  columnHelper.display({
    id: 'actions',
    cell: (info) => ButtonActions(info, popoverProps),
  }),
];

function ButtonActions(props: CellContext<Users, unknown>, popoverProps: PopoverProps) {
  const { row } = props;
  const companyId = row.original.id;
  const { handleEdit, handleDelete } = popoverProps;
  return (
    <MenuList
      disablePadding
      sx={{
        p: 0.5,
        gap: 0.5,
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
      <MenuItem onClick={() => handleEdit(companyId)}>
        <Iconify icon="solar:pen-bold" />
        Edit
      </MenuItem>

      <MenuItem onClick={() => handleDelete(companyId)} sx={{ color: 'error.main' }}>
        <Iconify icon="solar:trash-bin-trash-bold" />
        Delete
      </MenuItem>
    </MenuList>
  );
}

interface UserViewProps {
  type: 'internal' | 'client';
}

export function UserView({ type }: UserViewProps) {
  const { isEmpty, data, getDataTableProps } = useUserList({ type });
  console.log(data, 'datanya');
  const clientData = data?.items?.filter((item) => item?.user_info?.company_id !== null);
  const internalData = data?.items?.filter((item) => item?.user_info?.company_id === null);
  const { mutate: deleteUserById } = useDeleteUserById();

  console.log(getDataTableProps(), 'get data table props');
  const navigate = useNavigate();
  const onClickAddNew = () => {
    navigate('create');
  };

  const popoverFuncs = () => {
    const handleEdit = (id: number) => {
      navigate(`${id}/edit`);
    };

    const handleDelete = (id: number) => {
      deleteUserById(id);
    };

    return { handleEdit, handleDelete };
  };

  return (
    <DashboardContent maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
            User
          </Typography>
          <Box display="flex" gap={2} sx={{ mb: { xs: 3, md: 5 } }}>
            <Typography>Master Data</Typography>
            <Typography color="grey.500">•</Typography>
            <Typography color="grey.500">User</Typography>
          </Box>
        </Box>
        <Box>
          <Button onClick={onClickAddNew} variant="contained" color="primary">
            Create New User
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid xs={12}>
          <DataTable
            columns={columns(popoverFuncs())}
            {...getDataTableProps()}
            data={type === 'client' ? clientData : internalData}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
