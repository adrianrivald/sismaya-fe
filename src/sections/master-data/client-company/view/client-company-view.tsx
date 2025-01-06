import React, { useId } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  menuItemClasses,
  MenuList,
  Popover,
  TableCell,
} from '@mui/material';

import { _tasks, _posts, _timeline, _users, _projects } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'src/components/table/data-tables';
import { CellContext, createColumnHelper } from '@tanstack/react-table';
import { Iconify } from 'src/components/iconify';
import { useCompanyList } from 'src/services/master-data/company/use-company-list';
import { useDeleteCompanyById } from 'src/services/master-data/company';
import { Companies } from './types';

// ----------------------------------------------------------------------

interface PopoverProps {
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
}

const columnHelper = createColumnHelper<Companies>();

const columns = (popoverProps: PopoverProps) => [
  columnHelper.accessor('name', {
    header: 'Name',
  }),

  columnHelper.accessor('abbreviation', {
    header: 'Abbreviation',
  }),

  columnHelper.accessor('type', {
    header: 'Type',
  }),

  columnHelper.display({
    id: 'actions',
    cell: (info) => ButtonActions(info, popoverProps),
  }),
];

function ButtonActions(props: CellContext<Companies, unknown>, popoverProps: PopoverProps) {
  const { row } = props;
  const companyId = row.original.id;
  const { handleEdit, handleDelete } = popoverProps;
  const formId = useId();
  // const { mutateAsync: deleteBanner } = useDeleteBanner();
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

// const columns = [
//   { id: 'name', label: 'Name' },
//   { id: 'desc', label: 'Description' },
//   { id: 'picture', label: 'Picture' },
//   { id: 'status', label: 'Status' },
//   { id: 'category', label: 'Category' },
//   { id: 'product', label: 'Product' },
//   { id: '', label: 'Action' },
// ];

export function ClientCompanyView() {
  const { isEmpty, getDataTableProps } = useCompanyList({}, 'holding');
  const { mutate: deleteCompanyById } = useDeleteCompanyById();

  const navigate = useNavigate();
  const onClickAddNew = () => {
    navigate('/client-company/create');
  };

  const popoverFuncs = () => {
    const handleEdit = (id: number) => {
      navigate(`${id}/edit`);
    };

    const handleDelete = (id: number) => {
      deleteCompanyById(id);
    };

    return { handleEdit, handleDelete };
  };

  return (
    <DashboardContent maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
            Client Company
          </Typography>
          <Box display="flex" gap={2} sx={{ mb: { xs: 3, md: 5 } }}>
            <Typography>Master Data</Typography>
            <Typography color="grey.500">•</Typography>
            <Typography color="grey.500">Client Company</Typography>
          </Box>
        </Box>
        <Box>
          <Button onClick={onClickAddNew} variant="contained" color="primary">
            Create New Client Company
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid xs={12}>
          <DataTable columns={columns(popoverFuncs())} {...getDataTableProps()} />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
