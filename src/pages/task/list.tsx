import { Button } from '@mui/material';
import { createColumnHelper } from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import { TaskManagement, useTaskList } from 'src/services/task/task-management';
import { DataTable } from 'src/components/table/data-tables';
import { RequestPriority } from 'src/sections/request/request-priority';

const columnHelper = createColumnHelper<TaskManagement>();

const columns = [
  columnHelper.accessor('request.name', {
    header: 'Request',
  }),

  columnHelper.accessor('request.product', {
    header: 'Product',
    cell: (info) => info.getValue()?.name,
  }),

  columnHelper.accessor('task.name', {
    header: 'Task',
  }),

  columnHelper.accessor('task.dueDate', {
    header: 'Due',
    cell: (info) => TaskManagement.formatDueDate(info.getValue()),
  }),

  columnHelper.accessor('request.priority', {
    header: 'Priority',
    cell: (info) => {
      const priority = info.getValue();

      return <RequestPriority priority={priority} />;
    },
  }),

  columnHelper.display({
    id: 'actions',
    cell: (info) => (
      <Button
        component={Link}
        to={`/task/${info.row.original.task.id}`}
        variant="outlined"
        size="small"
      >
        View Detail
      </Button>
    ),
  }),
];

export default function TaskListPage() {
  const { isEmpty, getDataTableProps } = useTaskList();

  if (isEmpty) {
    return null;
  }

  return <DataTable columns={columns} {...getDataTableProps()} />;
}
