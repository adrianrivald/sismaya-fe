import { useState } from 'react';
import { useTable } from 'src/hooks/use-table';
import { Card, TableBody, TablePagination } from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import TableContainer from '@mui/material/TableContainer';
import TableMui from '@mui/material/Table';
import { TableHead } from './table-head';
import { TableRow } from './table-row';
import { TableEmptyRows } from './table-empty-rows';
import { applyFilter, emptyRows, getComparator } from './utils';
import { TableNoData } from './table-no-data';

interface TableProps {
  data: any[];
  columns: any[];
}

export function Table({ data, columns }: TableProps) {
  const table = useTable();

  const [filterName, setFilterName] = useState('');

  const dataFiltered: any[] = applyFilter({
    inputData: data,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;
  return (
    <Card>
      <Scrollbar>
        <TableContainer sx={{ overflow: 'unset' }}>
          <TableMui sx={{ minWidth: 800 }}>
            <TableHead
              order={table.order}
              orderBy={table.orderBy}
              rowCount={data.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  data.map((item) => item?.id)
                )
              }
              headLabel={columns}
            />
            <TableBody>
              {dataFiltered
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row) => (
                  <TableRow
                    key={row.id}
                    row={row}
                    selected={table.selected.includes(row.id)}
                    onSelectRow={() => table.onSelectRow(row.id)}
                  />
                ))}

              <TableEmptyRows
                height={68}
                emptyRows={emptyRows(table.page, table.rowsPerPage, data.length)}
              />

              {notFound && <TableNoData searchQuery={filterName} />}
            </TableBody>
          </TableMui>
        </TableContainer>
      </Scrollbar>
      <TablePagination
        component="div"
        page={table.page}
        count={data.length}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={table.onChangeRowsPerPage}
      />
    </Card>
  );
}
