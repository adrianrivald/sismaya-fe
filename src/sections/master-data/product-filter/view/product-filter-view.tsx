import React, { Dispatch, SetStateAction } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import {
  Box,
  Checkbox,
  FormControl,
  ListItemText,
  MenuItem,
  menuItemClasses,
  MenuList,
  OutlinedInput,
  Select,
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
import type { ProductFilter } from '../type/types';

// ----------------------------------------------------------------------

interface PopoverProps {
  handleEdit: (id: number) => void;
  setSelectedId: Dispatch<SetStateAction<number | null>>;
}

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
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const [sortOrder, setSortOrder] = React.useState('');

  const { data, getDataTableProps: getDataTablePropsProduct } = useProductUse({});
  const dataTable = data as any;
  const navigate = useNavigate();

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

  const [selectedCompanies, setSelectedCompanies] = React.useState(['SIM', 'SAS']);
  const companyOptions = ['SIM', 'SAS', 'KMI', 'FPA'];

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setSelectedCompanies(typeof value === 'string' ? value.split(',') : value);
  };

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
            {companyOptions.map((name) => (
              <MenuItem key={name} value={name}>
                <Checkbox checked={selectedCompanies.indexOf(name) > -1} />
                <ListItemText primary={name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        <Grid xs={12}>
          <DataTable
            columns={columns({ ...popoverFuncs(), setSelectedId })}
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
                      {/* dynamic column here */}
                      <TableCell sx={{ bgcolor: '#EBFAFC' }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.subsidiaries?.map((sub, index) => (
                      <TableRow key={index}>
                        <TableCell>{sub.name}</TableCell>
                        <TableCell>{sub.abbreviation}</TableCell>
                        <TableCell>{sub.type}</TableCell>
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
    </DashboardContent>
  );
}
