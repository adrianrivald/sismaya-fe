import {
  Card,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from '@mui/material';
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
import { MetaLink } from 'src/utils/types';
import React from 'react';

interface DataTablesProps<TData> extends Pick<TableOptions<TData>, 'data' | 'columns'> {
  // pageCount: number;
  pagination: PaginationState;
  onPaginationChange: (nextState: PaginationState) => void;
  total: number;
  withPagination?: boolean;
  //   pageLinks: MetaLink[];
}

export function DataTable<TData>(props: DataTablesProps<TData>) {
  const { data, columns, pagination, onPaginationChange, total, withPagination = true } = props;
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

  console.log(table.getState().pagination.pageIndex, 'table.getState().pagination.pageIndex');

  const onChangePage = (event: unknown, newPage: number) => {
    console.log(newPage, 'newPage');
    table.setPageIndex(newPage);
  };

  const onResetPage = () => {
    table.setPageIndex(0);
  };

  console.log(table.getRowCount(), 'getRowCount()');

  const onChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    table.setPageSize(Number(event.target.value));
    // onResetPage();
  };
  console.log(total, 'total()');

  //   const notFound = !dataFiltered.length && !!filterName;
  return (
    <Card>
      <Scrollbar>
        <TableContainer sx={{ overflow: 'unset' }}>
          <TableMui sx={{ minWidth: 800 }}>
            <TableHead>
              {table.getHeaderGroups().map((headerGroup, index) => (
                <TableRow key={index}>
                  {headerGroup.headers.map((header) => (
                    // <Th
                    //   data-testid="th"
                    //   key={header.id}
                    //   borderBottomColor="table.stroke"
                    // >
                    //   {header.isPlaceholder
                    //     ? null
                    //     : flexRender(
                    //         header.column.columnDef.header,
                    //         header.getContext()
                    //       )}
                    // </Th>
                    <TableCell
                      key={header.id}
                      align={header.id.includes('[center]') ? 'center' : 'left'}
                      // sortDirection={orderBy === headCell.id ? order : false}
                      // sx={{ width: headCell.width, minWidth: headCell.minWidth }}
                    >
                      <TableSortLabel
                        hideSortIcon
                        // active={orderBy === headCell.id}
                        // direction={orderBy === headCell.id ? order : 'asc'}
                        // onClick={() => onSort(headCell.id)}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                        {/* {orderBy === headCell.id ? (
                      <Box sx={{ ...visuallyHidden }}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </Box>
                    ) : null} */}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow hover data-testid="trBody" key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell data-testid="td" key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}

              {/* <TableEmptyRows
                height={68}
                emptyRows={emptyRows(table.page, table.rowsPerPage, data.length)}
              /> */}

              {/* {notFound && <TableNoData searchQuery={filterName} />} */}
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
    </Card>
  );
}
