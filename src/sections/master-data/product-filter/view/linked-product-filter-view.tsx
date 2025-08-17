import React, { Dispatch, SetStateAction } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Box, Button, MenuItem, menuItemClasses, MenuList } from '@mui/material';
import { useCompanyList } from 'src/services/master-data/company/use-company-list';
import {
  useCompanyById,
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
import { DialogDelete } from 'src/components/dialog/dialog-delete';
import { DialogBulkDelete } from 'src/components/dialog/dialog-bulk-delete';
import { useBulkDeleteCompany } from 'src/services/master-data/company/use-company-bulk-delete';
import { Icon } from '@iconify/react';
import { Companies } from '../../internal-company/view/types';

// ----------------------------------------------------------------------

interface PopoverProps {
  handleEdit: (id: number) => void;
  setOpenRemoveModal: Dispatch<SetStateAction<boolean>>;
  setSelectedId: Dispatch<SetStateAction<number | null>>;
}

const columnHelper = createColumnHelper<{ id: number; internal_company: Companies }>();

const columns = (popoverProps: PopoverProps) => [
  columnHelper.accessor('internal_company.name', {
    id: 'name_sort',
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
  const { handleEdit, setSelectedId, setOpenRemoveModal } = popoverProps;

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
  const { mutate: deleteCompanyRelationById } = useDeleteCompanyRelation();
  const [openRemoveModal, setOpenRemoveModal] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const [sortOrder, setSortOrder] = React.useState('');
  const [openBulkDelete, setOpenBulkDelete] = React.useState(false);
  const [selectedCompanies, setSelectedCompanies] = React.useState<Companies[]>([]);

  const { getDataTableProps, refetch } = useCompanyRelation({
    client_company_id: id,
    name: sortOrder,
  });
  const { mutate: mutateBulkDeleteCompany } = useBulkDeleteCompany();

  const navigate = useNavigate();

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

  const { data: companyById } = useCompanyById(Number(id));

  const onSort = (cellId: string) => {
    if (cellId === 'name_sort') {
      if (sortOrder === '' || sortOrder === 'asc') {
        setSortOrder('desc');
      } else {
        setSortOrder('asc');
      }
    }
  };

  const onBulkDelete = () => {
    const titleData = selectedCompanies.map((item) => item.id).join(',');
    mutateBulkDeleteCompany(titleData, {
      onSuccess: () => {
        setOpenBulkDelete(false);
        refetch();

        setTimeout(() => {
          setSelectedCompanies([]);
        }, 500);
      },
      onError: () => {
        setOpenBulkDelete(false);
        refetch();
        setTimeout(() => {
          setSelectedCompanies([]);
        }, 500);
      },
    });
  };

  const handleSelectionChange = (selected: any) => {
    setSelectedCompanies(selected);
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
            <Typography color="grey.500">{companyById?.name}</Typography>
          </Box>
        </Box>

        {/* <Box>
          <Button onClick={onClickAddNew} variant="contained" color="primary">
            Create New Vendor
          </Button>
        </Box> */}
      </Box>

      <Grid container spacing={3}>
        <Grid xs={12} display="flex" sx={{ justifyContent: 'flex-end' }}>
          <Button
            onClick={() => {
              if (selectedCompanies.length > 0) {
                setOpenBulkDelete(true);
              }
            }}
            startIcon={<Icon icon="solar:trash-bin-trash-bold" width="20" height="20" />}
            color="error"
            disabled={selectedCompanies.length === 0}
          >
            Delete {selectedCompanies.length > 0 ? `(${selectedCompanies.length})` : null}
          </Button>
        </Grid>
        <Grid xs={12}>
          <DataTable
            columns={columns({ ...popoverFuncs(), setOpenRemoveModal, setSelectedId })}
            order={sortOrder}
            orderBy="name_sort"
            onSort={onSort}
            enableSelection
            onSelectionChange={handleSelectionChange}
            {...getDataTableProps()}
          />
        </Grid>
      </Grid>

      <DialogDelete
        onRemove={popoverFuncs().handleDelete}
        openRemoveModal={openRemoveModal}
        setOpenRemoveModal={setOpenRemoveModal}
      />
      <DialogBulkDelete
        open={openBulkDelete}
        onClose={() => setOpenBulkDelete(false)}
        title={`Delete ${selectedCompanies.length} Titles?`}
        onClick={() => {
          onBulkDelete();
        }}
      />
    </DashboardContent>
  );
}
