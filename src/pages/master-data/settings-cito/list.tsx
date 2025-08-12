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
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { SvgColor } from 'src/components/svg-color';
import { CONFIG } from 'src/config-global';
import { useSettingCitoList } from 'src/services/settings-cito/use-list-cito';
import useDebounce from 'src/utils/use-debounce';
import { DashboardContent } from 'src/layouts/dashboard';
import { DataTable } from 'src/components/table/data-tables';
import { Icon } from '@iconify/react';
import { PaginationState, createColumnHelper } from '@tanstack/react-table';
import { SettingCitoType, SubsidiariesType } from 'src/services/settings-cito/schemas/type';
import DialogAddInitialCito from './components/add-initial-cito';
import DialogAddCitoQuota from './components/add-cito-quota';
import DialogAddAdditionalCito from './components/add-additional-cito';

import DialogCitoHistory from './components/cito-history';
import DialogDocumentPoHistory from './components/more-history-po';

const columnHelper = createColumnHelper<SettingCitoType>();
const columnHelperSubsidiaries = createColumnHelper<SubsidiariesType>();

interface PopoverProps {
  handleAddOpen: (id: number, index?: number) => void;
  handleHistory: (id: number, index?: number) => void;
  // setOpenRemoveModal: Dispatch<SetStateAction<boolean>>;
  // setSelectedId: Dispatch<SetStateAction<number | null>>;
  // isSuperAdmin: boolean;
}

const columns = (popoverProps: PopoverProps) => [
  columnHelper.accessor('name', {
    header: 'Companies Name',
    cell: (info) => (
      <Typography fontSize={14} mb={1}>
        {info.getValue()}
      </Typography>
    ),
  }),

  columnHelper.accessor('abbreviation', {
    header: 'Description',
    cell: (info) => (
      <Typography fontSize={14} mb={1}>
        {info.getValue()}
      </Typography>
    ),
  }),

  columnHelper.accessor('type', {
    header: 'Type',
    cell: (info) => (
      <Typography fontSize={14} mb={1}>
        {info.getValue() === 'all-sub-company'
          ? 'Sub Company'
          : info.getValue() === 'holding'
            ? 'Holding'
            : '-'}
      </Typography>
    ),
  }),

  columnHelper.accessor('initial_quota', {
    header: 'Initial Quota',
    cell: (info) => (
      <Typography fontSize={14} mb={1}>
        {info.getValue() || '-'}
      </Typography>
    ),
  }),

  columnHelper.accessor('additional_quota', {
    header: 'Additional Quota',
    cell: (info) => (
      <Typography fontSize={14} mb={1}>
        {info.getValue() || '-'}
      </Typography>
    ),
  }),
  columnHelper.accessor('total_quota', {
    header: 'Total Quota',
    cell: (info) => (
      <Typography fontSize={14} mb={1}>
        {info.getValue() || '-'}
      </Typography>
    ),
  }),
  columnHelper.accessor('quota_used', {
    header: 'Quota Used',
    cell: (info) => (
      <Typography fontSize={14} mb={1}>
        {info.getValue() || '-'}
      </Typography>
    ),
  }),
  columnHelper.accessor('remaining_quota', {
    header: 'Remaining Quota',
    cell: (info) => (
      <Typography fontSize={14} mb={1}>
        {info.getValue() || '-'}
      </Typography>
    ),
  }),

  columnHelper.accessor('cito_type', {
    header: 'Cito Type',
    cell: (info) => (
      <Typography fontSize={14} mb={1}>
        {info.getValue() === 'all-sub-company'
          ? 'Sub Company'
          : info.getValue() === 'holding'
            ? 'Holding'
            : '-'}
      </Typography>
    ),
  }),

  columnHelper.display({
    header: 'Actions',
    id: 'actions',

    cell: (info) => (
      <Stack direction="row" gap={2}>
        <Button
          onClick={() => {
            popoverProps.handleAddOpen(info?.row.original?.id);
          }}
        >
          <Stack direction="row" gap={1}>
            <Icon icon="material-symbols:edit-outline" width="20" height="20" color="black" />
            <Typography fontSize={14} color="black">
              Add Quota
            </Typography>
          </Stack>
        </Button>
        <Button
          onClick={() => {
            popoverProps.handleHistory(info?.row.original?.id);
          }}
        >
          <Stack direction="row" gap={1}>
            <Icon icon="material-symbols:history-rounded" width="20" height="20" color="black" />
            <Typography fontSize={14} color="black">
              History
            </Typography>
          </Stack>
        </Button>
      </Stack>
    ),
  }),
];

const columnsSubsidiaries = () => [
  columnHelperSubsidiaries.accessor('name', {
    header: 'Companies Name',
    cell: (info) => (
      <Typography fontSize={14} mb={1}>
        {info.getValue()}
      </Typography>
    ),
  }),

  columnHelperSubsidiaries.accessor('abbreviation', {
    header: 'Description',
    cell: (info) => (
      <Typography fontSize={14} mb={1}>
        {info.getValue()}
      </Typography>
    ),
  }),

  columnHelperSubsidiaries.accessor('type', {
    header: 'Type',
    cell: (info) => (
      <Typography fontSize={14} mb={1}>
        {info.getValue() === 'all-sub-company'
          ? 'Sub Company'
          : info.getValue() === 'holding'
            ? 'Holding'
            : '-'}
      </Typography>
    ),
  }),

  columnHelperSubsidiaries.accessor('initial_quota', {
    header: 'Initial Quota',
    cell: (info) => (
      <Typography fontSize={14} mb={1}>
        {info.getValue() || '-'}
      </Typography>
    ),
  }),

  columnHelperSubsidiaries.accessor('additional_quota', {
    header: 'Additional Quota',
    cell: (info) => (
      <Typography fontSize={14} mb={1}>
        {info.getValue() || '-'}
      </Typography>
    ),
  }),
  columnHelperSubsidiaries.accessor('total_quota', {
    header: 'Total Quota',
    cell: (info) => (
      <Typography fontSize={14} mb={1}>
        {info.getValue() || '-'}
      </Typography>
    ),
  }),
  columnHelperSubsidiaries.accessor('quota_used', {
    header: 'Quota Used',
    cell: (info) => (
      <Typography fontSize={14} mb={1}>
        {info.getValue() || '-'}
      </Typography>
    ),
  }),

  columnHelperSubsidiaries.accessor('cito_type', {
    header: 'Cito Type',
    cell: (info) => (
      <Typography fontSize={14} mb={1}>
        {info.getValue() === 'all-sub-company'
          ? 'Sub Company'
          : info.getValue() === 'holding'
            ? 'Holding'
            : '-'}
      </Typography>
    ),
  }),
  columnHelperSubsidiaries.accessor('remaining_quota', {
    header: 'Remaining Quota',
    cell: (info) => (
      <Typography fontSize={14} mb={1}>
        {info.getValue() || '-'}
      </Typography>
    ),
  }),
];

export default function SettingCitoList() {
  const [form, setForm] = useState({
    search: '',
    company_type: 'all',
    cito_type: 'all',
  });

  const [openAdditionalQuota, setOpenAdditionalQuota] = useState({
    isOpen: false,
    id: '',
    index: 0,
  });
  const [openCitoHistory, setOpenCitoHistory] = useState({ isOpen: false, id: '', index: 0 });
  const [openInitialQuota, setOpenInitialQuota] = useState({ isOpen: false, id: '', index: 0 });
  const [openCitoQuota, setOpenCitoQuota] = useState({ isOpen: false, id: '', index: 0 });
  const debounceSearch = useDebounce(form.search, 1000);
  const { getDataTableProps, refetch } = useSettingCitoList({
    search: debounceSearch,

    cito_type: form.cito_type === 'all' ? null : form.cito_type,
  });

  const popoverFuncs = () => {
    const handleAddOpen = (id: number, index?: number) => {
      // setOpenInitialQuota({ id: String(id), index: index || 0, isOpen: true });
      setOpenCitoQuota({ id: String(id), index: index || 0, isOpen: true });
    };

    const handleHistory = (id: number, index?: number) => {
      setOpenCitoHistory({ id: String(id), index: index || 0, isOpen: true });
    };

    return { handleAddOpen, handleHistory };
  };

  return (
    <div>
      <Helmet>
        <title> {`Settings Cito - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content="The starting point for your next project with Minimal UI Kit, built on the newest version of Material-UI ©, ready to be customized to your style"
        />
        <meta name="keywords" content="react,material,kit,application,dashboard,admin,template" />
      </Helmet>
      <DashboardContent maxWidth="xl">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
              Master Setting Cito
            </Typography>
            <Box display="flex" gap={2} sx={{ mb: { xs: 3, md: 5 } }}>
              <Typography>Master Data</Typography>
              <Typography color="grey.500">•</Typography>
              <Typography color="grey.500">Setting Cito</Typography>
            </Box>
          </Box>
        </Box>
        <Card>
          <CardContent>
            <Grid container rowSpacing={3} columnSpacing={2} mb={3}>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth sx={{ mt: 3 }}>
                  <InputLabel id="select-company">Company Type</InputLabel>
                  <Select
                    value={form.company_type}
                    defaultValue="all"
                    fullWidth
                    placeholder="All"
                    onChange={(e: SelectChangeEvent<any>) => {
                      setForm({ ...form, company_type: e.target.value });
                    }}
                  >
                    <MenuItem value="all" selected>
                      All
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth sx={{ mt: 3 }}>
                  <InputLabel id="select-company">Cito Type</InputLabel>
                  <Select
                    value={form.cito_type}
                    defaultValue="all"
                    fullWidth
                    placeholder="All"
                    onChange={(e: SelectChangeEvent<any>) => {
                      setForm({ ...form, cito_type: e.target.value });
                    }}
                  >
                    <MenuItem value="all" selected>
                      All
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mt: 3 }}>
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
                    onChange={(e) => setForm({ ...form, search: e.target.value })}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>

          {/* <Button
            onClick={() => {
              setOpenCitoQuota({ isOpen: true, id: '', index: 0 });
            }}
          >
            Add cito quota
          </Button> */}

          <DataTable
            minWidth={1500}
            columns={columns({
              ...popoverFuncs(),
            })}
            // enableSelection
            // onSelectionChange={handleSelectionChange}
            {...getDataTableProps()}
            enableCollapse
            renderCollapse={(row) => (
              <DataTable
                minWidth={1500}
                columns={columnsSubsidiaries()}
                withPagination={false}
                total={1}
                onPaginationChange={() => null}
                data={(row?.subsidiaries as SubsidiariesType[]) || ([] as SubsidiariesType[])}
                pagination={{ pageIndex: 0, pageSize: 9999 }}
              />
            )}
          />
        </Card>
      </DashboardContent>

      <DialogAddCitoQuota
        open={openCitoQuota.isOpen}
        onClose={() => {
          setOpenCitoQuota({ isOpen: false, id: '', index: 0 });
        }}
        id={openCitoQuota.id}
        onClick={(type: string, id: string) => {
          setOpenCitoQuota({ isOpen: false, id: '', index: 0 });
          setTimeout(() => {
            if (type === 'additional') {
              setOpenAdditionalQuota({ isOpen: true, id, index: 0 });
            } else {
              setOpenInitialQuota({ isOpen: true, id, index: 0 });
            }
          }, 500);
        }}
      />

      <DialogAddAdditionalCito
        open={openAdditionalQuota.isOpen}
        onClose={() => {
          setOpenAdditionalQuota({ isOpen: false, id: '', index: 0 });
        }}
      />
      <DialogAddInitialCito
        open={openInitialQuota.isOpen}
        onClose={() => {
          setOpenInitialQuota({ isOpen: false, id: '', index: 0 });
        }}
        id={openInitialQuota.id}
      />

      {/* <DialogCitoHistory
        open={openCitoHistory.isOpen}
        onClose={() => {
          setOpenCitoHistory({ isOpen: false, id: '', index: 0 });
        }}
        id={openCitoHistory.id}
      /> */}

      <DialogDocumentPoHistory
        open={openCitoHistory.isOpen}
        onClose={() => {
          setOpenCitoHistory({ isOpen: false, id: '', index: 0 });
        }}
        id={openCitoHistory.id}
      />
    </div>
  );
}
