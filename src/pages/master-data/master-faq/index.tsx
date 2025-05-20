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
  Stack,
  TextField,
  Typography,
  menuItemClasses,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { Iconify } from 'src/components/iconify';
import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { SvgColor } from 'src/components/svg-color';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from 'src/sections/auth/providers/auth';
import { FaqType } from 'src/services/master-data/faq/types/type';
import { createColumnHelper, CellContext } from '@tanstack/react-table';
import { DataTable } from 'src/components/table/data-tables';
import { useFaqList } from 'src/services/master-data/faq/use-faq-list';
import useDebounce from 'src/utils/use-debounce';
import { useProductCompany } from 'src/services/master-data/company';
import { Icon } from '@iconify/react';
import { DialogBulkDelete } from 'src/components/dialog/dialog-bulk-delete';
import { useBulkDeleteFaq } from 'src/services/master-data/faq/use-faq-bulk-delete';
import { DialogArrange } from './DialogArrange';

interface PopoverProps {
  handleEdit: (id: number) => void;
  setSelectedId: Dispatch<SetStateAction<number | null>>;
  isSuperAdmin: boolean;
}

const columnHelper = createColumnHelper<FaqType>();
const columns = (popoverProps: PopoverProps) => [
  columnHelper.accessor('question', {
    header: 'FAQ',
    cell: (info) => (
      <Stack>
        <Typography fontSize={14} mb={1}>
          {info.getValue()}
        </Typography>
        <Stack flexDirection="row" gap={2}>
          <Typography fontSize={14} color="#637381">
            {info?.row?.original?.products.map((item) => item?.name).join(', ')}
          </Typography>
        </Stack>
      </Stack>
    ),
  }),

  ...(popoverProps.isSuperAdmin
    ? [
        columnHelper.accessor('products', {
          header: 'Company Name',
          cell: (info) => (
            <Typography fontSize={14}>{info.getValue()?.[0]?.company?.name ?? '-'}</Typography>
          ),
        }),
      ]
    : []),

  columnHelper.accessor('is_active', {
    header: 'Status',
    cell: (info) => (
      <Box sx={{ bgcolor: info.getValue() ? '#00B8D929' : '#FF563029', borderRadius: 2 }}>
        <Typography
          fontSize={14}
          px={1}
          py={1}
          textAlign="center"
          color={info.getValue() ? '#006C9C' : '#B71D18'}
          fontWeight={500}
        >
          {info.getValue() ? 'Active' : 'Inactive'}
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

function ButtonActions(props: CellContext<FaqType, unknown>, popoverProps: PopoverProps) {
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

export default function MasterFaqPage() {
  const navigation = useNavigate();
  const { vendor } = useParams();
  const { user } = useAuth();
  const isSuperAdmin = user?.user_info?.role_id === 1;
  const idCurrentCompany =
    user?.internal_companies?.find((item) => item?.company?.name?.toLowerCase() === vendor)?.company
      ?.id ?? 0;
  const { data } = useProductCompany(String(idCurrentCompany), 99999, '');
  const [dialogArrange, setDialogArrange] = useState({ isOpen: false });
  const [openBulkDelete, setOpenBulkDelete] = useState(false);
  const { mutate: mutateBulkDeleteFaq } = useBulkDeleteFaq();
  const [form, setForm] = useState({
    search: '',
    status: 'all',
    product: 'all',
  });
  const [selectedFaq, setSelectedFaq] = useState<FaqType[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const debounceSearch = useDebounce(form.search, 1000);
  const { getDataTableProps, refetch } = useFaqList(
    {
      search: debounceSearch,
      product_id: form.product === 'all' ? null : Number(form.product),
      company_id: idCurrentCompany,
    },
    String(idCurrentCompany)
  );

  const handleSelectionChange = (selected: FaqType[]) => {
    setSelectedFaq(selected);
  };

  const popoverFuncs = () => {
    const handleEdit = (id: number) => {
      navigation(`${id}/edit`);
    };

    return { handleEdit };
  };

  const onBulkDelete = () => {
    const faqData = selectedFaq.map((item) => item.id).join(',');
    mutateBulkDeleteFaq(faqData, {
      onSuccess: () => {
        setOpenBulkDelete(false);
        refetch();

        setTimeout(() => {
          setSelectedFaq([]);
        }, 500);
      },
      onError: () => {
        setOpenBulkDelete(false);
        refetch();
        setTimeout(() => {
          setSelectedFaq([]);
        }, 500);
      },
    });
  };

  return (
    <>
      <Helmet>
        <title> {`Master FAQ - ${CONFIG.appName}`}</title>
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
              Master FAQ
            </Typography>
            <Box display="flex" gap={2} sx={{ mb: { xs: 3, md: 5 } }}>
              <Typography>Master Data</Typography>
              <Typography color="grey.500">•</Typography>
              <Typography color="grey.500">FAQ</Typography>
            </Box>
          </Box>
          <Stack sx={{ flexDirection: 'row', gap: 1 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="material-symbols-light:add" />}
              onClick={() => {
                if (isSuperAdmin) {
                  navigation('/internal-company/master-faq/create');
                } else {
                  navigation(`/${vendor}/master-faq/create`);
                }
              }}
            >
              Create FAQ
            </Button>
            <Button
              onClick={() => setDialogArrange({ isOpen: true })}
              variant="outlined"
              color="primary"
              startIcon={<Iconify icon="solar:sort-outline" />}
            >
              Arrange FAQ Order
            </Button>
          </Stack>
        </Box>
        <Card>
          <CardContent>
            <Grid container rowSpacing={3} columnSpacing={2} mb={3}>
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
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mt: 3 }}>
                  <InputLabel id="select-product">Product</InputLabel>
                  <Select
                    fullWidth
                    labelId="select-product"
                    id="select-product"
                    value={form.product}
                    label="Product"
                    onChange={(e) => {
                      setForm({ ...form, product: e.target.value });
                      setTimeout(() => {
                        refetch();
                      }, 500);
                    }}
                    variant="outlined"
                  >
                    <MenuItem value="all" selected>
                      All Products
                    </MenuItem>
                    {data?.map((product) => (
                      <MenuItem key={product.id} value={product.id}>
                        {product.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {selectedFaq.length > 0 && (
                <Grid item xs={12} display="flex" sx={{ justifyContent: 'flex-end' }}>
                  <Button
                    onClick={() => {
                      setOpenBulkDelete(true);
                    }}
                    startIcon={<Icon icon="solar:trash-bin-trash-bold" width="20" height="20" />}
                    color="error"
                  >
                    Delete ({selectedFaq.length})
                  </Button>
                </Grid>
              )}
            </Grid>
            <DataTable
              columns={columns({ ...popoverFuncs(), setSelectedId, isSuperAdmin })}
              enableSelection
              onSelectionChange={handleSelectionChange}
              {...getDataTableProps()}
              enableCollapse
              renderCollapse={(row) => (
                <Card>
                  <CardContent>
                    <Box
                      dangerouslySetInnerHTML={{ __html: row.answer }}
                      sx={{
                        '& img': {
                          width: '200px',
                          height: '200px',
                          objectFit: 'cover',
                          borderRadius: 1,
                        },
                        '& p': {
                          m: 0,
                          fontSize: 14,
                          color: 'black',
                        },
                        '& ul': {
                          m: 0,
                          pl: 2.5,
                          '& li': {
                            fontSize: 14,
                            color: 'black',
                            mb: 1,
                            '&:last-child': {
                              mb: 0,
                            },
                          },
                        },
                      }}
                    />
                  </CardContent>
                </Card>
              )}
            />
          </CardContent>
        </Card>

        <DialogArrange
          open={dialogArrange.isOpen}
          onClose={() => setDialogArrange({ isOpen: false })}
        />
        <DialogBulkDelete
          open={openBulkDelete}
          onClose={() => setOpenBulkDelete(false)}
          title={`Delete ${selectedFaq.length} FAQs?`}
          onClick={() => {
            onBulkDelete();
          }}
        />
      </DashboardContent>
    </>
  );
}
