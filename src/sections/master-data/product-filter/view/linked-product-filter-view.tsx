import React, { Dispatch, SetStateAction } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Box, Button, MenuItem, menuItemClasses, MenuList } from '@mui/material';
import { useCompanyList } from 'src/services/master-data/company/use-company-list';
import {
  useCompanyRelation,
  useDeleteCompanyById,
  useDeleteCompanyRelation,
} from 'src/services/master-data/company';

import { DashboardContent } from 'src/layouts/dashboard';
import { useNavigate, useParams } from 'react-router-dom';
import { DataTable } from 'src/components/table/data-tables';
import type { CellContext } from '@tanstack/react-table';
import { createColumnHelper } from '@tanstack/react-table';
import { Iconify } from 'src/components/iconify';
import { Companies } from '../../internal-company/view/types';
import { RemoveAction } from '../../internal-company/view/remove-action';

// ----------------------------------------------------------------------

interface PopoverProps {
  handleEdit: (id: number) => void;
  setOpenRemoveModal: Dispatch<SetStateAction<boolean>>;
  setSelectedId: Dispatch<SetStateAction<number | null>>;
}

const columnHelper = createColumnHelper<{ id: number; internal_company: Companies }>();

const columns = (popoverProps: PopoverProps) => [
  columnHelper.accessor('internal_company.name', {
    header: 'Name',
  }),

  columnHelper.accessor('internal_company.abbreviation', {
    header: 'Abbreviation',
  }),

  columnHelper.accessor('internal_company.type', {
    header: 'Type',
  }),

  columnHelper.display({
    id: 'actions',
    cell: (info) => ButtonActions(info, popoverProps),
  }),
];

function ButtonActions(
  props: CellContext<{ id: number; internal_company: Companies }, unknown>,
  popoverProps: PopoverProps
) {
  const { row } = props;
  const companyId = row.original.internal_company.id;
  const relationId = row.original.id;
  const { handleEdit, setSelectedId, setOpenRemoveModal } = popoverProps;

  const onClickRemove = (itemId?: number) => {
    if (itemId) setSelectedId(itemId);
    setOpenRemoveModal(true);
  };
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

      <MenuItem onClick={() => onClickRemove(relationId)} sx={{ color: 'error.main' }}>
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

export function ProductFilterLinkedView() {
  const { id } = useParams();
  const { getDataTableProps } = useCompanyRelation({ client_company_id: id });
  const { mutate: deleteCompanyRelationById } = useDeleteCompanyRelation();
  const [openRemoveModal, setOpenRemoveModal] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<number | null>(null);

  // console.log(getDataTableProps(), 'get data table props');
  const navigate = useNavigate();
  const onClickAddNew = () => {
    navigate('create');
  };

  const popoverFuncs = () => {
    const handleEdit = (itemId: number) => {
      navigate(`${itemId}/edit`);
    };

    const handleDelete = () => {
      deleteCompanyRelationById(Number(selectedId));
      setOpenRemoveModal(false);
    };

    return { handleEdit, handleDelete };
  };

  return (
    <DashboardContent maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
            Linked Internal Company
          </Typography>
          <Box display="flex" gap={2} sx={{ mb: { xs: 3, md: 5 } }}>
            <Typography>Master Data</Typography>
            <Typography color="grey.500">•</Typography>
            <Typography color="grey.500">Product Filter</Typography>
            <Typography color="grey.500">•</Typography>
            <Typography color="grey.500">Linked Internal Company</Typography>
          </Box>
        </Box>

        <Box>
          <Button onClick={onClickAddNew} variant="contained" color="primary">
            Create New Vendor
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid xs={12}>
          <DataTable
            columns={columns({ ...popoverFuncs(), setOpenRemoveModal, setSelectedId })}
            {...getDataTableProps()}
          />
        </Grid>
      </Grid>

      <RemoveAction
        onRemove={popoverFuncs().handleDelete}
        openRemoveModal={openRemoveModal}
        setOpenRemoveModal={setOpenRemoveModal}
      />
    </DashboardContent>
  );
}
