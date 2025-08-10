import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Card,
  Checkbox,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
  Collapse,
  IconButton,
} from '@mui/material';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Scrollbar } from 'src/components/scrollbar';
import TableContainer from '@mui/material/TableContainer';
import TableMui from '@mui/material/Table';

import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  functionalUpdate,
  type TableOptions,
  type PaginationState,
} from '@tanstack/react-table';
import React, { useEffect } from 'react';
import { SvgColor } from '../svg-color';
import { Iconify } from '../iconify';
import { TableNoData } from './table-no-data';

export const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
} as const;
interface DataTablesProps<TData> extends Pick<TableOptions<TData>, 'data' | 'columns'> {
  // pageCount: number;
  pagination: PaginationState;
  onPaginationChange: (nextState: PaginationState) => void;
  total: number;
  withPagination?: boolean;
  withViewAll?: boolean;
  viewAllHref?: string;
  enableSelection?: boolean;
  onSelectionChange?: (selectedRows: TData[]) => void;
  //   pageLinks: MetaLink[];
  enableCollapse?: boolean;
  renderCollapse?: (row: TData) => React.ReactNode;
  orderBy?: string;
  order?: any;
  onSort?: (id: string) => void;
  isCollapseWithBg?: boolean;
  minWidth?: number;
}

export function DataTable<TData>(props: DataTablesProps<TData>) {
  const {
    data,
    columns,
    pagination,
    onPaginationChange,
    total,
    withPagination = true,
    withViewAll = false,
    viewAllHref,
    enableSelection = false,
    onSelectionChange,
    enableCollapse = false,
    isCollapseWithBg = false,
    renderCollapse,
    orderBy,
    order = '',
    onSort,
    minWidth = 800,
  } = props;

  const [selectedRows, setSelectedRows] = React.useState<TData[]>([]);
  const [openRows, setOpenRows] = React.useState<Record<string | number, boolean>>({});
  const table = useReactTable({
    data,
    columns,
    // pageCount, TODO: pagecount will be added if be provided it
    state: {
      pagination,
    },

    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    onPaginationChange: (updaterOrValue) => {
      const nextState = functionalUpdate(updaterOrValue, pagination);

      onPaginationChange(nextState);
    },
    manualPagination: true,
  });

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedRows(data);
      onSelectionChange?.(data);
    } else {
      setSelectedRows([]);
      onSelectionChange?.([]);
    }
  };

  const handleSelectOne = (row: TData) => {
    const selectedIndex = selectedRows.indexOf(row);
    let newSelected: TData[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRows, row);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = newSelected.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedRows.slice(0, selectedIndex),
        selectedRows.slice(selectedIndex + 1)
      );
    }

    setSelectedRows(newSelected);
    onSelectionChange?.(newSelected);
  };

  const location = useLocation();

  // Extract the base path (like '/internal_user' or '/company_user')
  const getBaseListKey = () => {
    const path = location.pathname;
    if (path.startsWith('/internal-user')) return 'internal_user';
    if (path.startsWith('/client-user')) return 'client_user';
    if (path.startsWith('/internal-company/companies')) return 'internal_company_companies';
    if (path.startsWith('/internal-company/product')) return 'internal_company_product';
    if (path.startsWith('/internal-company/category')) return 'internal_company_category';
    if (path.startsWith('/internal-company/status')) return 'internal_company_status';
    if (path.startsWith('/internal-company/title')) return 'internal_company_title';
    if (path.startsWith('/internal-company/division')) return 'internal_company_division';
    if (path.startsWith('/internal-company/master-faq')) return 'internal_company_master-faq';
    if (path.startsWith('/client-company/companies')) return 'client_company_companies';
    if (path.startsWith('/client-company/title')) return 'client_company_title';
    if (path.startsWith('/client-company/division')) return 'client_company_division';
    if (path.startsWith('/product-filter')) return 'product_filter';
    return 'default';
  };
  const currentKey = getBaseListKey();
  const pageKey = `table_page_${currentKey}`;

  useEffect(() => {
    // 💥 Remove all other pagination keys
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('table_page_') && key !== pageKey) {
        localStorage.removeItem(key);
      }
    });

    // 👇 Restore or reset the current page
    const savedPage = localStorage.getItem(pageKey);
    if (savedPage !== null) {
      table.setPageIndex(Number(savedPage));
    } else {
      table.setPageIndex(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentKey]);

  // Save pagination state when page changes
  const onChangePage = (event: unknown, newPage: number) => {
    localStorage.setItem(pageKey, newPage.toString());
    table.setPageIndex(newPage);
  };

  const onResetPage = () => {
    table.setPageIndex(0);
  };

  const onChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    table.setPageSize(Number(event.target.value));
    // onResetPage();
  };

  const handleCollapseToggle = (rowId: string | number) => {
    setOpenRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  //   const notFound = !dataFiltered.length && !!filterName;
  return (
    <Card>
      <Scrollbar>
        <TableContainer sx={{ overflow: 'auto' }}>
          <TableMui sx={{ minWidth }}>
            <TableHead>
              {table.getHeaderGroups().map((headerGroup, index) => (
                <TableRow key={index}>
                  {enableSelection && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={data.length > 0 && selectedRows.length === data.length}
                        indeterminate={selectedRows.length > 0 && selectedRows.length < data.length}
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                  )}
                  {enableCollapse && <TableCell style={{ width: 50 }} />}
                  {headerGroup.headers.map((header) => (
                    <TableCell
                      key={header.id}
                      align={header.id.includes('[center]') ? 'center' : 'left'}
                      sortDirection={order}
                      // sx={{ width: headCell.width, minWidth: headCell.minWidth }}
                    >
                      <TableSortLabel
                        hideSortIcon={header.id !== 'name_sort'}
                        active={orderBy === header.id}
                        direction={order}
                        onClick={() => onSort?.(header.id)}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                        {orderBy === header.id ? (
                          <Box sx={{ ...visuallyHidden }}>
                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    hover
                    data-testid="trBody"
                    selected={selectedRows.indexOf(row.original) !== -1}
                    sx={{ bgcolor: openRows[row.id] ? '#EBFAFC' : '' }}
                  >
                    {enableSelection && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedRows.indexOf(row.original) !== -1}
                          onChange={() => handleSelectOne(row.original)}
                        />
                      </TableCell>
                    )}
                    {enableCollapse && (
                      <TableCell style={{ width: 50 }}>
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => handleCollapseToggle(row.id)}
                        >
                          {openRows[row.id] ? (
                            <Iconify icon="ri:arrow-up-s-line" />
                          ) : (
                            <Iconify icon="ri:arrow-down-s-line" />
                          )}
                        </IconButton>
                      </TableCell>
                    )}
                    {row.getVisibleCells().map((cell) => (
                      <TableCell data-testid="td" key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                  {enableCollapse && renderCollapse && (
                    <TableRow sx={{ bgcolor: isCollapseWithBg ? '#EBFAFC' : '' }}>
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={columns.length + (enableSelection ? 2 : 1)}
                      >
                        <Collapse in={openRows[row.id]} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 1 }}>{renderCollapse(row.original)}</Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}

              {/* <TableEmptyRows
                height={68}
                emptyRows={emptyRows(table.page, table.rowsPerPage, data.length)}
              /> */}

              {data.length === 0 && <TableNoData searchQuery="" />}
            </TableBody>
          </TableMui>
        </TableContainer>
      </Scrollbar>
      {withPagination && (
        <TablePagination
          component="div"
          page={table.getState().pagination.pageIndex}
          count={total}
          rowsPerPage={table.getRowCount()}
          onPageChange={onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={onChangeRowsPerPage}
        />
      )}
      {withViewAll && (
        <Box
          component="a"
          href={viewAllHref}
          mt={2}
          px={4}
          py={1}
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          gap={1}
          sx={{
            borderTop: '1px solid',
            borderColor: 'grey.150',
            textDecoration: 'none',
            color: 'blue.700',
          }}
        >
          <Typography>View All</Typography>
          <SvgColor color="blue.700" width={15} src="/assets/icons/ic-chevron-right.svg" />
        </Box>
      )}
    </Card>
  );
}
