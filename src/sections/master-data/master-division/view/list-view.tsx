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
import { CellContext, createColumnHelper } from '@tanstack/react-table';
import { Dispatch, SetStateAction, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';
import { DataTable } from 'src/components/table/data-tables';
import { useDivisionCompanyList, useDeleteDivision } from 'src/services/master-data/company';
import { DashboardContent } from 'src/layouts/dashboard';
import { useAuth } from 'src/sections/auth/providers/auth';
import useDebounce from 'src/utils/use-debounce';
import { Icon } from '@iconify/react';
import { DialogBulkDelete } from 'src/components/dialog/dialog-bulk-delete';
import { useBulkDeleteDivision } from 'src/services/master-data/company/division/use-division-bulk-delete';
import type { DivisionTypes } from '../type/types';

interface PopoverProps {
  handleEdit: (id: number) => void;
  setSelectedId: Dispatch<SetStateAction<number | null>>;
  isSuperAdmin: boolean;
}

const columnHelper = createColumnHelper<DivisionTypes>();
const columns = (popoverProps: PopoverProps) => [
  columnHelper.accessor('name', {
    header: 'Division Name',
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

function ButtonActions(props: CellContext<DivisionTypes, unknown>, popoverProps: PopoverProps) {
  const { row } = props;
  const companyId = row.original.id;
  const { handleEdit } = popoverProps;

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

export function ListDivisionView({ isSuperAdmin = false }: { isSuperAdmin?: boolean }) {
  const navigate = useNavigate();
  const { vendor } = useParams();
  const { user } = useAuth();
  const idCurrentCompany =
    user?.internal_companies?.find((item) => item?.company?.name?.toLowerCase() === vendor)?.company
      ?.id ?? 0;
  const { mutate: deleteDivisionById } = useDeleteDivision();
  const [openBulkDelete, setOpenBulkDelete] = useState(false);
  const [form, setForm] = useState({
    search: '',
    status: 'all',
    company: 'all',
  });

  const { mutate: mutateBulkDeleteDivision } = useBulkDeleteDivision();
  const debounceSearch = useDebounce(form.search, 1000);
  const { getDataTableProps, refetch } = useDivisionCompanyList(
    {
      search: debounceSearch,
      is_super_admin: isSuperAdmin,
    },
    String(idCurrentCompany)
  );
  const [selectedDivisions, setSelectedDivisions] = useState<DivisionTypes[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const handleSelectionChange = (selected: DivisionTypes[]) => {
    setSelectedDivisions(selected);
  };

  const popoverFuncs = () => {
    const handleEdit = (id: number) => {
      navigate(`${id}/edit`);
    };

    const handleDelete = () => {
      deleteDivisionById(Number(selectedId));
      refetch();
    };

    return { handleEdit };
  };

  const onBulkDelete = () => {
    const divisionData = selectedDivisions.map((item) => item.id).join(',');
    mutateBulkDeleteDivision(divisionData, {
      onSuccess: () => {
        setOpenBulkDelete(false);
        refetch();

        setTimeout(() => {
          setSelectedDivisions([]);
        }, 500);
      },
      onError: () => {
        setOpenBulkDelete(false);
        refetch();
        setTimeout(() => {
          setSelectedDivisions([]);
        }, 500);
      },
    });
  };

  return (
    <DashboardContent maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
            Master Divisions
          </Typography>
          <Box display="flex" gap={2} sx={{ mb: { xs: 3, md: 5 } }}>
            <Typography>Master Data</Typography>
            <Typography color="grey.500">•</Typography>
            <Typography color="grey.500">Division</Typography>
          </Box>
        </Box>
        <Stack sx={{ flexDirection: 'row', gap: 1 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="material-symbols-light:add" />}
            onClick={() => {
              navigate(`/${vendor}/division/create`);
            }}
          >
            New Division
          </Button>
        </Stack>
      </Box>
      <Card>
        <CardContent>
          <Grid container spacing={2} mt={0} mb={3}>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel id="select-division">Division</InputLabel>
                <Select
                  value={form.status}
                  defaultValue="all"
                  fullWidth
                  placeholder="All"
                  // onChange={(e: SelectChangeEvent<any>) => {
                  //   setValue('productId', e.target.value);
                  // }}
                >
                  <MenuItem value="all" selected>
                    All
                  </MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel id="select-company">Company</InputLabel>
                <Select
                  value={form.company}
                  defaultValue="all"
                  fullWidth
                  placeholder="All"
                  // onChange={(e: SelectChangeEvent<any>) => {
                  //   setValue('productId', e.target.value);
                  // }}
                >
                  <MenuItem value="all" selected>
                    All
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

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
            {selectedDivisions.length > 0 && (
              <Grid item xs={12} display="flex" sx={{ justifyContent: 'flex-end' }}>
                <Button
                  onClick={() => {
                    setOpenBulkDelete(true);
                  }}
                  startIcon={<Icon icon="solar:trash-bin-trash-bold" width="20" height="20" />}
                  color="error"
                >
                  Delete ({selectedDivisions.length})
                </Button>
              </Grid>
            )}
          </Grid>
          <DataTable
            columns={columns({ ...popoverFuncs(), setSelectedId, isSuperAdmin })}
            enableSelection
            onSelectionChange={handleSelectionChange}
            {...getDataTableProps()}
          />
        </CardContent>
      </Card>

      <DialogBulkDelete
        open={openBulkDelete}
        onClose={() => setOpenBulkDelete(false)}
        title={`Delete ${selectedDivisions.length} Divisions?`}
        onClick={() => {
          onBulkDelete();
        }}
      />
    </DashboardContent>
  );
}
