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
import {
  useDeleteProduct,
  useInternalCompanies,
  useProductCompanyList,
} from 'src/services/master-data/company';
import { DashboardContent } from 'src/layouts/dashboard';
import { useAuth } from 'src/sections/auth/providers/auth';
import useDebounce from 'src/utils/use-debounce';
import { DialogBulkDelete } from 'src/components/dialog/dialog-bulk-delete';
import { Icon } from '@iconify/react';
import { useBulkDeleteProduct } from 'src/services/master-data/company/product/use-product-bulk-delete';
import { DialogDelete } from 'src/components/dialog/dialog-delete';
import type { ProductTypes } from '../type/types';

interface PopoverProps {
  handleEdit: (id: number) => void;
  setOpenRemoveModal: Dispatch<SetStateAction<boolean>>;
  setSelectedId: Dispatch<SetStateAction<number | null>>;
  isSuperAdmin: boolean;
}

const columnHelper = createColumnHelper<ProductTypes>();
const columns = (popoverProps: PopoverProps) => [
  columnHelper.accessor('name', {
    id: 'name_sort',
    header: 'Product Name',
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

function ButtonActions(props: CellContext<ProductTypes, unknown>, popoverProps: PopoverProps) {
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

export function ListProductView() {
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
  const { mutate: mutateBulkDeleteProduct } = useBulkDeleteProduct();
  const [sortOrder, setSortOrder] = useState('');
  const debounceSearch = useDebounce(form.search, 1000);
  const { getDataTableProps, refetch } = useProductCompanyList(
    {
      search: debounceSearch,
      is_active: form.status,
      is_super_admin: isSuperAdmin,
      company_id: form.company === 'all' ? '' : form.company,
      name: sortOrder,
    },
    String(idCurrentCompany)
  );
  const { mutate: deleteProduct } = useDeleteProduct();

  const [selectedProducts, setSelectedProducts] = useState<ProductTypes[]>([]);
  const [openRemoveModal, setOpenRemoveModal] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleSelectionChange = (selected: ProductTypes[]) => {
    setSelectedProducts(selected);
  };

  const popoverFuncs = () => {
    const handleEdit = (id: number) => {
      navigate(`${id}/edit`);
    };

    const handleDelete = () => {
      deleteProduct(Number(selectedId));
      setOpenRemoveModal(false);
    };
    return { handleEdit, handleDelete };
  };

  const onBulkDelete = () => {
    const productData = selectedProducts.map((item) => item.id).join(',');
    mutateBulkDeleteProduct(productData, {
      onSuccess: () => {
        setOpenBulkDelete(false);
        refetch();

        setTimeout(() => {
          setSelectedProducts([]);
        }, 500);
      },
      onError: () => {
        setOpenBulkDelete(false);
        refetch();
        setTimeout(() => {
          setSelectedProducts([]);
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
            Master Products
          </Typography>
          <Box display="flex" gap={2} sx={{ mb: { xs: 3, md: 5 } }}>
            <Typography>Master Data</Typography>
            <Typography color="grey.500">•</Typography>
            <Typography color="grey.500">Products</Typography>
          </Box>
        </Box>
        <Stack sx={{ flexDirection: 'row', gap: 1 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="material-symbols-light:add" />}
            onClick={() => {
              navigate(`/${vendor ?? 'internal-company'}/product/create`);
            }}
          >
            New Products
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
            <Grid item xs={12} display="flex" sx={{ justifyContent: 'flex-end' }}>
              <Button
                onClick={() => {
                  if (selectedProducts.length > 0) {
                    setOpenBulkDelete(true);
                  }
                }}
                startIcon={<Icon icon="solar:trash-bin-trash-bold" width="20" height="20" />}
                color="error"
                disabled={selectedProducts.length === 0}
              >
                Delete {selectedProducts.length > 0 ? `(${selectedProducts.length})` : null}
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
            orderBy="name_sort"
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
        title={`Delete ${selectedProducts.length} Products?`}
        onClick={() => {
          onBulkDelete();
        }}
      />
    </DashboardContent>
  );
}
