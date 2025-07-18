import React, { Dispatch, SetStateAction } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Box, Button, MenuItem, menuItemClasses, MenuList } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'src/components/table/data-tables';
import type { CellContext } from '@tanstack/react-table';
import { createColumnHelper } from '@tanstack/react-table';
import { Iconify } from 'src/components/iconify';
import { useCompanyList } from 'src/services/master-data/company/use-company-list';
import { useDeleteCompanyById } from 'src/services/master-data/company';
import { Companies } from '../../client-company/view/types';

// ----------------------------------------------------------------------

interface PopoverProps {
  handleEdit: (id: number) => void;
  setOpenRemoveModal: Dispatch<SetStateAction<boolean>>;
  setSelectedId: Dispatch<SetStateAction<number | null>>;
}

const columnHelper = createColumnHelper<Companies>();

const columns = (popoverProps: PopoverProps) => [
  columnHelper.accessor('name', {
    id: 'name_sort',
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
  const { handleEdit, setSelectedId, setOpenRemoveModal } = popoverProps;

  const onClickRemove = (itemId?: number) => {
    if (itemId) setSelectedId(itemId);
    setOpenRemoveModal(true);
  };
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

      {/* <MenuItem onClick={() => onClickRemove(companyId)} sx={{ color: 'error.main' }}>
        <Iconify icon="solar:trash-bin-trash-bold" />
        Delete
      </MenuItem> */}
    </MenuList>
  );
}

export function ProductFilterView() {
  const { mutate: deleteCompanyById } = useDeleteCompanyById();
  const [openRemoveModal, setOpenRemoveModal] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const [sortOrder, setSortOrder] = React.useState('');

  const { getDataTableProps } = useCompanyList(
    {
      name: sortOrder,
    },
    'holding'
  );
  const navigate = useNavigate();

  const popoverFuncs = () => {
    const handleEdit = (id: number) => {
      navigate(`/product-filter/${id}`);
    };

    const handleDelete = () => {
      deleteCompanyById(Number(selectedId));
      setOpenRemoveModal(false);
    };

    return { handleEdit, handleDelete };
  };

  const onSort = (id: string) => {
    if (id === 'name_sort') {
      if (sortOrder === '' || sortOrder === 'asc') {
        setSortOrder('desc');
      } else {
        setSortOrder('asc');
      }
    }
  };

  return (
    <DashboardContent maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
            Product Filter
          </Typography>
          <Box display="flex" gap={2} sx={{ mb: { xs: 3, md: 5 } }}>
            <Typography>Master Data</Typography>
            <Typography color="grey.500">•</Typography>
            <Typography color="grey.500">Product Filter</Typography>
          </Box>
        </Box>
        {/* <Box>
          <Button onClick={onClickAddNew} variant="contained" color="primary">
            Create New Product Filter
          </Button>
        </Box> */}
      </Box>

      <Grid container spacing={3}>
        <Grid xs={12}>
          <DataTable
            columns={columns({ ...popoverFuncs(), setOpenRemoveModal, setSelectedId })}
            order={sortOrder}
            orderBy="name_sort"
            onSort={onSort}
            {...getDataTableProps()}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
