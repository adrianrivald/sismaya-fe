import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  MenuList,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
  menuItemClasses,
} from '@mui/material';
import type { CellContext } from '@tanstack/react-table';
import { createColumnHelper } from '@tanstack/react-table';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';
import { DataTable } from 'src/components/table/data-tables';
import { DashboardContent } from 'src/layouts/dashboard';
import { useAuth } from 'src/sections/auth/providers/auth';
import useDebounce from 'src/utils/use-debounce';
import { useTitleCompanyList } from 'src/services/master-data/company/title/use-title-list';
import { Icon } from '@iconify/react';
import { DialogBulkDelete } from 'src/components/dialog/dialog-bulk-delete';
import { useBulkDeleteTitle } from 'src/services/master-data/company/title/use-title-bulk-delete';
import { useClientCompanies, useInternalCompanies } from 'src/services/master-data/company';
import { useDeleteTitle } from 'src/services/master-data/company/title/use-title-delete';
import { DialogDelete } from 'src/components/dialog/dialog-delete';
import type { TitleTypes } from '../type/types';

interface PopoverProps {
  handleEdit: (id: number) => void;
  setOpenRemoveModal: Dispatch<SetStateAction<boolean>>;
  setSelectedId: Dispatch<SetStateAction<number | null>>;
  isSuperAdmin: boolean;
}

const columnHelper = createColumnHelper<TitleTypes>();
const columns = (popoverProps: PopoverProps) => [
  columnHelper.accessor('name', {
    id: 'name_sort',
    header: 'Title Name',
    cell: (info) => (
      <Typography fontSize={14} width="30vw">
        {info.getValue()}
      </Typography>
    ),
  }),
  ...(popoverProps.isSuperAdmin
    ? [
        columnHelper.accessor('company', {
          header: 'Company Name',
          cell: (info) => <Typography fontSize={14}>{info.getValue()?.name ?? '-'}</Typography>,
        }),
      ]
    : []),

  columnHelper.accessor('is_active', {
    header: 'Status',
    cell: (info) => (
      <Box sx={{ bgcolor: info.getValue() === true ? '#00B8D929' : '#FF563029', borderRadius: 2 }}>
        <Typography
          fontSize={14}
          px={1}
          py={1}
          textAlign="center"
          color={info.getValue() === true ? '#006C9C' : '#B71D18'}
          fontWeight={500}
        >
          {info.getValue() === true ? 'Active' : 'Inactive'}
        </Typography>
      </Box>
    ),
  }),
  columnHelper.display({
    header: 'Actions',
    id: 'actions',
    cell: (info) => ButtonActions(info, popoverProps),
  }),
];

function ButtonActions(props: CellContext<TitleTypes, unknown>, popoverProps: PopoverProps) {
  const { row } = props;
  const companyId = row.original.id;
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
      {/* <MenuItem onClick={() => onClickRemove(companyId)} sx={{ color: 'error.main' }}>
        <Iconify icon="solar:trash-bin-trash-bold" />
        Delete
      </MenuItem> */}
    </MenuList>
  );
}

export function ListTitleView() {
  const navigate = useNavigate();
  const { vendor } = useParams();
  const { user } = useAuth();
  const location = useLocation();
  const isClientCompanyPage = location.pathname.includes('/client-company');
  const isInternalCompanyPage = location.pathname.includes('/internal-company');
  const isSuperAdmin = user?.user_info?.role_id === 1;
  const idCurrentCompany =
    user?.internal_companies?.find((item) => item?.company?.name?.toLowerCase() === vendor)?.company
      ?.id ?? 0;
  const { data: internalCompanies } = useInternalCompanies();
  const { data: clientCompanies } = useClientCompanies(true, isClientCompanyPage);
  const companiesData = isInternalCompanyPage ? internalCompanies : clientCompanies;

  const [openBulkDelete, setOpenBulkDelete] = useState(false);
  const [form, setForm] = useState({
    search: '',
    status: 'all',
    company: 'all',
  });
  const { mutate: mutateBulkDeleteTitle } = useBulkDeleteTitle();
  const [sortOrder, setSortOrder] = useState('');
  const debounceSearch = useDebounce(form.search, 1000);
  const { getDataTableProps, refetch } = useTitleCompanyList(
    {
      search: debounceSearch,
      is_active: form.status,
      is_super_admin: isSuperAdmin,
      company_id: form.company === 'all' ? '' : form.company,
      name: sortOrder,
    },
    String(idCurrentCompany),
    isInternalCompanyPage ? 'internal' : 'client'
  );
  const { mutate: deleteTitle } = useDeleteTitle();

  const [openRemoveModal, setOpenRemoveModal] = useState(false);

  const [selectedTitles, setSelectedTitles] = useState<TitleTypes[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const handleSelectionChange = (selected: TitleTypes[]) => {
    setSelectedTitles(selected);
  };

  const popoverFuncs = () => {
    const handleEdit = (id: number) => {
      navigate(`${id}/edit`);
    };

    const handleDelete = () => {
      deleteTitle(Number(selectedId));
      setOpenRemoveModal(false);
    };
    return { handleEdit, handleDelete };
  };
  const onBulkDelete = () => {
    const titleData = selectedTitles.map((item) => item.id).join(',');
    mutateBulkDeleteTitle(titleData, {
      onSuccess: () => {
        setOpenBulkDelete(false);
        refetch();

        setTimeout(() => {
          setSelectedTitles([]);
        }, 500);
      },
      onError: () => {
        setOpenBulkDelete(false);
        refetch();
        setTimeout(() => {
          setSelectedTitles([]);
        }, 500);
      },
    });
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
            Master Titles
          </Typography>
          <Box display="flex" gap={2} sx={{ mb: { xs: 3, md: 5 } }}>
            <Typography>Master Data</Typography>
            <Typography color="grey.500">•</Typography>
            <Typography color="grey.500">Titles</Typography>
          </Box>
        </Box>
        <Stack sx={{ flexDirection: 'row', gap: 1 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="material-symbols-light:add" />}
            onClick={() => {
              navigate(`/${vendor}/title/create`);
            }}
          >
            New Title
          </Button>
        </Stack>
      </Box>
      <Card>
        <CardContent>
          <Grid container spacing={2} mt={0} mb={3}>
            <Grid item xs={12} md={user?.user_info?.role_id === 1 ? 3 : 6}>
              <FormControl fullWidth>
                <InputLabel id="select-product">Status</InputLabel>
                <Select
                  value={form.status}
                  defaultValue="all"
                  fullWidth
                  placeholder="All"
                  onChange={(e: SelectChangeEvent<any>) => {
                    setForm({ ...form, status: e.target.value });
                  }}
                >
                  <MenuItem value="all" selected>
                    All
                  </MenuItem>
                  <MenuItem value="1">Active</MenuItem>
                  <MenuItem value="0">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {user?.user_info?.role_id === 1 && (
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel id="select-company">Company</InputLabel>
                  <Select
                    value={form.company}
                    defaultValue="all"
                    fullWidth
                    placeholder="All"
                    onChange={(e: SelectChangeEvent<any>) => {
                      setForm({ ...form, company: e.target.value });
                    }}
                  >
                    <MenuItem value="all" selected>
                      All
                    </MenuItem>
                    {companiesData?.map((company) => (
                      <MenuItem value={company?.id}>{company?.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <TextField
                  sx={{ width: '100%' }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SvgColor width={18} height={24} src="/assets/icons/ic-search.svg" />
                      </InputAdornment>
                    ),
                  }}
                  value={form.search}
                  placeholder="Search..."
                  onChange={(e) => {
                    setForm({ ...form, search: e.target.value });
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} display="flex" sx={{ justifyContent: 'flex-end' }}>
              <Button
                onClick={() => {
                  if (selectedTitles.length > 0) {
                    setOpenBulkDelete(true);
                  }
                }}
                startIcon={<Icon icon="solar:trash-bin-trash-bold" width="20" height="20" />}
                color="error"
                disabled={selectedTitles.length === 0}
              >
                Delete {selectedTitles.length > 0 ? `(${selectedTitles.length})` : null}
              </Button>
            </Grid>
          </Grid>
          <DataTable
            columns={columns({
              ...popoverFuncs(),
              setOpenRemoveModal,
              setSelectedId,
              isSuperAdmin,
            })}
            order={sortOrder}
            orderBy="name"
            onSort={onSort}
            enableSelection
            onSelectionChange={handleSelectionChange}
            {...getDataTableProps()}
          />
        </CardContent>
      </Card>

      <DialogDelete
        onRemove={popoverFuncs().handleDelete}
        openRemoveModal={openRemoveModal}
        setOpenRemoveModal={setOpenRemoveModal}
      />
      <DialogBulkDelete
        open={openBulkDelete}
        onClose={() => setOpenBulkDelete(false)}
        title={`Delete ${selectedTitles.length} Titles?`}
        onClick={() => {
          onBulkDelete();
        }}
      />
    </DashboardContent>
  );
}
