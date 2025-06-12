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
  capitalize,
  menuItemClasses,
} from '@mui/material';
import type { CellContext } from '@tanstack/react-table';
import { createColumnHelper } from '@tanstack/react-table';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';
import { DataTable } from 'src/components/table/data-tables';
import {
  useDeleteStatus,
  useInternalCompanies,
  useStatusCompanyList,
} from 'src/services/master-data/company';
import { DashboardContent } from 'src/layouts/dashboard';
import { useAuth } from 'src/sections/auth/providers/auth';
import useDebounce from 'src/utils/use-debounce';
import { Icon } from '@iconify/react';
import { DialogBulkDelete } from 'src/components/dialog/dialog-bulk-delete';
import { useBulkDeleteStatus } from 'src/services/master-data/company/status/use-status-bulk-delete';
import { DialogDelete } from 'src/components/dialog/dialog-delete';
import type { StatusTypes } from '../type/types';

interface PopoverProps {
  handleEdit: (id: number) => void;
  setOpenRemoveModal: Dispatch<SetStateAction<boolean>>;
  setSelectedId: Dispatch<SetStateAction<number | null>>;
  isSuperAdmin: boolean;
}

const columnHelper = createColumnHelper<StatusTypes>();
const columns = (popoverProps: PopoverProps) => [
  columnHelper.accessor('name', {
    header: 'Status Name',
    cell: (info) => (
      <Typography fontSize={14} width="30vw">
        {info.getValue()}
      </Typography>
    ),
  }),
  columnHelper.accessor('step', {
    header: 'Step',
    cell: (info) => (
      <Typography fontSize={14}>{capitalize(info.getValue()?.replaceAll('_', ' '))}</Typography>
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

function ButtonActions(props: CellContext<StatusTypes, unknown>, popoverProps: PopoverProps) {
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

      <MenuItem onClick={() => onClickRemove(companyId)} sx={{ color: 'error.main' }}>
        <Iconify icon="solar:trash-bin-trash-bold" />
        Delete
      </MenuItem>
    </MenuList>
  );
}

export function ListStatusView() {
  const navigate = useNavigate();
  const { vendor } = useParams();
  const { user } = useAuth();
  const isSuperAdmin = user?.user_info?.role_id === 1;
  const idCurrentCompany =
    user?.internal_companies?.find((item) => item?.company?.name?.toLowerCase() === vendor)?.company
      ?.id ?? 0;
  const { data: internalCompanies } = useInternalCompanies();
  const [openBulkDelete, setOpenBulkDelete] = useState(false);
  const [form, setForm] = useState({
    search: '',
    status: 'all',
    company: 'all',
  });
  const { mutate: mutateBulkDeleteStatus } = useBulkDeleteStatus();
  const { mutate: deleteStatus } = useDeleteStatus();

  const debounceSearch = useDebounce(form.search, 1000);
  const { getDataTableProps, refetch } = useStatusCompanyList(
    {
      search: debounceSearch,
      is_active: form.status,
      is_super_admin: isSuperAdmin,
      company_id: form.company === 'all' ? '' : form.company,
    },
    String(idCurrentCompany)
  );
  const [selectedStatuses, setSelectedStatuses] = useState<StatusTypes[]>([]);
  const [openRemoveModal, setOpenRemoveModal] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const handleSelectionChange = (selected: StatusTypes[]) => {
    setSelectedStatuses(selected);
  };

  const popoverFuncs = () => {
    const handleEdit = (id: number) => {
      navigate(`${id}/edit`);
    };

    const handleDelete = () => {
      deleteStatus(Number(selectedId));
      setOpenRemoveModal(false);
    };
    return { handleEdit, handleDelete };
  };
  const onBulkDelete = () => {
    const categoryData = selectedStatuses.map((item) => item.id).join(',');
    mutateBulkDeleteStatus(categoryData, {
      onSuccess: () => {
        setOpenBulkDelete(false);
        refetch();

        setTimeout(() => {
          setSelectedStatuses([]);
        }, 500);
      },
      onError: () => {
        setOpenBulkDelete(false);
        refetch();
        setTimeout(() => {
          setSelectedStatuses([]);
        }, 500);
      },
    });
  };

  return (
    <DashboardContent maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
            Master Request Status
          </Typography>
          <Box display="flex" gap={2} sx={{ mb: { xs: 3, md: 5 } }}>
            <Typography>Master Data</Typography>
            <Typography color="grey.500">•</Typography>
            <Typography color="grey.500">Request Status</Typography>
          </Box>
        </Box>
        <Stack sx={{ flexDirection: 'row', gap: 1 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="material-symbols-light:add" />}
            onClick={() => {
              navigate(`/${vendor}/status/create`);
            }}
          >
            New Request Status
          </Button>
          <Button
            variant="outlined"
            startIcon={<SvgColor src="/assets/icons/ic-bar.svg" />}
            onClick={() => {
              navigate(`/${vendor}/status/sort`);
            }}
          >
            Edit Status Order
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
                    {internalCompanies?.map((company) => (
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

            {selectedStatuses.length > 0 && (
              <Grid item xs={12} display="flex" sx={{ justifyContent: 'flex-end' }}>
                <Button
                  onClick={() => {
                    setOpenBulkDelete(true);
                  }}
                  startIcon={<Icon icon="solar:trash-bin-trash-bold" width="20" height="20" />}
                  color="error"
                >
                  Delete ({selectedStatuses.length})
                </Button>
              </Grid>
            )}
          </Grid>
          <DataTable
            columns={columns({
              ...popoverFuncs(),
              setOpenRemoveModal,
              setSelectedId,
              isSuperAdmin,
            })}
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
        title={`Delete ${selectedStatuses.length} Request Statuses?`}
        onClick={() => {
          onBulkDelete();
        }}
      />
    </DashboardContent>
  );
}
