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
import { useBulkDeleteCompany } from 'src/services/master-data/company/use-company-bulk-delete';
import { DialogBulkDelete } from 'src/components/dialog/dialog-bulk-delete';
import { Icon } from '@iconify/react';
import DialogViewCompany from 'src/components/dialog/dialog-view-company';
import { API_URL } from 'src/constants';
import { getSession } from 'src/sections/auth/session/session';
import type { Companies } from './types';

// ----------------------------------------------------------------------

interface PopoverProps {
  handleEdit: (id: number) => void;
  handleViewSubCompany: (id: number) => void;
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
    header: 'Action',
    id: 'actions',
    cell: (info) => ButtonActions(info, popoverProps),
  }),
];

function ButtonActions(props: CellContext<Companies, unknown>, popoverProps: PopoverProps) {
  const { row } = props;
  const companyId = row.original.id;
  const { handleEdit, setSelectedId, setOpenRemoveModal, handleViewSubCompany } = popoverProps;

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
      <MenuItem sx={{ color: 'primary.main' }} onClick={() => handleViewSubCompany(companyId)}>
        <Iconify icon="solar:eye-bold" />
        View Sub
        <br />
        Company
      </MenuItem>
      <MenuItem onClick={() => handleEdit(companyId)}>
        <Iconify icon="solar:pen-bold" />
        Edit
      </MenuItem>
    </MenuList>
  );
}

export function ClientCompanyView() {
  const { mutate: deleteCompanyById } = useDeleteCompanyById();
  const [openRemoveModal, setOpenRemoveModal] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const [sortOrder, setSortOrder] = React.useState('');
  const [selectedCompanies, setSelectedCompanies] = React.useState<Companies[]>([]);
  const [selectedCompany, setSelectedCompany] = React.useState<number | null>(null);
  const [openViewCompanyModal, setOpenViewCompanyModal] = React.useState(false);
  const [openBulkDelete, setOpenBulkDelete] = React.useState(false);
  const { mutate: mutateBulkDeleteCompany } = useBulkDeleteCompany();
  const [openedCompanyList, setOpenedCompanyList] = React.useState([]);

  const { getDataTableProps, refetch } = useCompanyList(
    {
      name: sortOrder,
    },
    'holding'
  );

  const navigate = useNavigate();
  const onClickAddNew = () => {
    navigate('/client-company/companies/create');
  };

  const popoverFuncs = () => {
    const handleEdit = (id: number) => {
      navigate(`${id}/edit`);
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

  const handleSelectionChange = (selected: Companies[]) => {
    setSelectedCompanies(selected);
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

  const handleViewSubCompany = async (companyId: number) => {
    setOpenedCompanyList([]);

    try {
      const companyData = await fetch(`${API_URL}/companies?parent=${companyId}`, {
        headers: {
          Authorization: `Bearer ${getSession()}`,
        },
      }).then((res) =>
        res.json().then((value) => {
          const transformed =
            value?.data !== null
              ? value?.data.map((item: any) => ({
                  name: item.name,
                }))
              : [];
          setOpenedCompanyList(transformed ?? []);
        })
      );
      setOpenViewCompanyModal(true);
      return companyData;
    } catch (error) {
      setOpenedCompanyList([]);
      setOpenViewCompanyModal(true);
      return error;
    }
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

      <Grid container spacing={2} mt={0} mb={3}>
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
            columns={columns({
              ...popoverFuncs(),
              setOpenRemoveModal,
              setSelectedId,
              handleViewSubCompany,
            })}
            order={sortOrder}
            orderBy="name_sort"
            onSort={onSort}
            enableSelection
            onSelectionChange={handleSelectionChange}
            {...getDataTableProps()}
          />
        </Grid>
      </Grid>

      <DialogBulkDelete
        open={openBulkDelete}
        onClose={() => setOpenBulkDelete(false)}
        title={`Delete ${selectedCompanies.length} Companies?`}
        onClick={() => {
          onBulkDelete();
        }}
      />

      <DialogViewCompany
        open={openViewCompanyModal}
        setOpen={setOpenViewCompanyModal}
        list={openedCompanyList}
      />
    </DashboardContent>
  );
}
