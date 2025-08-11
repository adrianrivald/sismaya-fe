import React, { Dispatch, SetStateAction } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import {
  Box,
  Checkbox,
  FormControl,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  menuItemClasses,
  MenuList,
  OutlinedInput,
  Select,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'src/components/table/data-tables';
import type { CellContext } from '@tanstack/react-table';
import { createColumnHelper } from '@tanstack/react-table';
import { Iconify } from 'src/components/iconify';
import { useDeleteCompanyById } from 'src/services/master-data/company';
import { useProductUse } from 'src/services/master-data/product-filter/use-product-use';
import type { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import DialogViewCompany from 'src/components/dialog/dialog-view-company';
import { getSession } from 'src/sections/auth/session/session';
import { API_URL } from 'src/constants';
import type { ProductFilter } from '../type/types';

// ----------------------------------------------------------------------

interface PopoverProps {
  handleEdit: (id: number) => void;
  setSelectedId: Dispatch<SetStateAction<number | null>>;
  mappedCompanies: any[];
  fetchCompanyPopupList: (
    companyId: number,
    internalCompanyId: number,
    isSubCompany?: boolean
  ) => void;
}

const BulletListItem = styled(ListItem)(({ theme }) => ({
  display: 'list-item',
  listStyleType: 'disc',
  listStylePosition: 'outside',
  paddingLeft: 0,
}));

const columnHelper = createColumnHelper<ProductFilter>();

const columns = (popoverProps: PopoverProps) => [
  columnHelper.accessor('name', {
    id: 'name_sort',
    header: 'Name',
  }),

  columnHelper.accessor('abbreviation', {
    header: 'Description',
  }),

  columnHelper.accessor('type', {
    header: 'Type',
  }),

  ...(popoverProps.mappedCompanies?.map((company: any) =>
    columnHelper.accessor((row) => row, {
      header: company.name,
      id: `product_used_${company.name}`,
      cell: (info) => (
        <List>
          <BulletListItem>
            <Typography>
              Holding:{' '}
              <Typography
                onClick={() => popoverProps.fetchCompanyPopupList(info.getValue().id, company.id)}
                sx={{ cursor: 'pointer', textDecoration: 'underline', color: 'primary.main' }}
              >
                {company?.parent_count}
              </Typography>
            </Typography>{' '}
          </BulletListItem>
          <BulletListItem>
            <Typography>
              Sub Company:{' '}
              <Typography
                onClick={() =>
                  popoverProps.fetchCompanyPopupList(info.getValue().id, company.id, true)
                }
                sx={{ cursor: 'pointer', textDecoration: 'underline', color: 'primary.main' }}
              >
                {company?.child_count}
              </Typography>
            </Typography>{' '}
          </BulletListItem>
        </List>
      ),
    })
  ) ?? []),

  columnHelper.display({
    header: 'Action',
    id: 'actions',
    cell: (info) => ButtonActions(info, popoverProps),
  }),
];

function ButtonActions(props: CellContext<ProductFilter, unknown>, popoverProps: PopoverProps) {
  const { row } = props;
  const companyId = row.original.id;
  const { handleEdit, setSelectedId } = popoverProps;
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
        Detail
      </MenuItem>
    </MenuList>
  );
}

export function ProductFilterView() {
  const { mutate: deleteCompanyById } = useDeleteCompanyById();
  const [openViewCompanyModal, setOpenViewCompanyModal] = React.useState(false);
  const [openedCompanyList, setOpenedCompanyList] = React.useState([]);

  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const [sortOrder, setSortOrder] = React.useState('');

  const { data, getDataTableProps: getDataTablePropsProduct } = useProductUse({});
  const dataTable = data as any;
  const navigate = useNavigate();

  const fetchCompanyPopupList = async (
    companyId: number,
    internalCompanyId: number,
    isSubCompany?: boolean
  ) => {
    setOpenedCompanyList([]);

    try {
      const companyData = await fetch(
        `${API_URL}/product-use?company_id=${companyId}&internal_company_id=${internalCompanyId}&is_active=all${isSubCompany ? '&mode=subsidiaries' : ''}`,
        {
          headers: {
            Authorization: `Bearer ${getSession()}`,
          },
        }
      ).then((res) =>
        res.json().then((value) => {
          console.log(value, 'valuenya');
          const transformed =
            value?.data !== null
              ? value?.data.map((item: any) => ({
                  name: item.company.name,
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

  const popoverFuncs = () => {
    const handleEdit = (id: number) => {
      navigate(`/product-filter/${id}`);
    };

    const handleDelete = () => {
      deleteCompanyById(Number(selectedId));
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

  const [selectedCompanies, setSelectedCompanies] = React.useState(['']);

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setSelectedCompanies(typeof value === 'string' ? value.split(',') : value);
  };

  const mappedCompanies = dataTable.items.result?.map((item: any) => item.product_used)[0];
  const mappedSubCompanies = dataTable.items.result[0]?.subsidiaries?.map(
    (item: any) => item?.product_used
  )[0];

  return (
    <DashboardContent maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
            List Client Product Mapping
          </Typography>
          <Box display="flex" gap={2} sx={{ mb: { xs: 3, md: 5 } }}>
            <Typography>Master Data</Typography>
            <Typography color="grey.500">•</Typography>
            <Typography color="grey.500">Product Filter</Typography>
          </Box>
        </Box>
      </Box>

      <Box display="flex" justifyContent="end" mb={2}>
        <FormControl sx={{ m: 1, minWidth: 200 }}>
          <Select
            labelId="company-selector-label"
            multiple
            displayEmpty
            value={selectedCompanies}
            onChange={handleChange}
            input={<OutlinedInput />}
            renderValue={() => 'Display Company'}
            sx={{
              borderRadius: '12px',
              '& fieldset': {
                borderColor: 'grey.500', // Optional: match your Figma design
              },
            }}
          >
            {mappedCompanies?.map((item: any, index: number) => (
              <MenuItem key={index} value={item.name}>
                <Checkbox checked={selectedCompanies.indexOf(item.name) > -1} />
                <ListItemText primary={item.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        <Grid xs={12}>
          <DataTable
            columns={columns({
              ...popoverFuncs(),
              setSelectedId,
              mappedCompanies,
              fetchCompanyPopupList,
            })}
            order={sortOrder}
            orderBy="name_sort"
            onSort={onSort}
            enableCollapse
            isCollapseWithBg
            renderCollapse={(row) => (
              <Box margin={1}>
                <Table size="small" aria-label="subcompanies">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ bgcolor: '#EBFAFC' }}>Name</TableCell>
                      <TableCell sx={{ bgcolor: '#EBFAFC' }}>Description</TableCell>
                      <TableCell sx={{ bgcolor: '#EBFAFC' }}>Type</TableCell>
                      {mappedSubCompanies?.map((company: any) => (
                        <TableCell sx={{ bgcolor: '#EBFAFC' }}>{company?.company_name}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.subsidiaries?.map((sub, index) => (
                      <TableRow key={index}>
                        <TableCell>{sub.name}</TableCell>
                        <TableCell>{sub.abbreviation}</TableCell>

                        <TableCell>{sub.type}</TableCell>
                        {mappedSubCompanies?.map((company: any) => (
                          <TableCell>
                            <Typography
                              sx={{
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                color: 'primary.main',
                              }}
                            >
                              {company?.request_count}
                            </Typography>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}
            {...getDataTablePropsProduct()}
            data={dataTable.items.result}
          />
        </Grid>
      </Grid>
      <DialogViewCompany
        list={openedCompanyList}
        open={openViewCompanyModal}
        setOpen={setOpenViewCompanyModal}
      />
    </DashboardContent>
  );
}
