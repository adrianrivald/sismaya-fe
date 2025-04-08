import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Box, Stack, Typography, IconButton } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { OnDragEndResponder } from '@hello-pangea/dnd';
import {
  useKanbanColumn,
  useKanbanChangeStatus,
  TaskManagement,
  useAssigneeCompanyId,
  type Task,
  type Request,
  type KanbanColumn,
} from 'src/services/task/task-management';
import { Iconify } from 'src/components/iconify';
import { RequestPriority } from 'src/sections/request/request-priority';
import { TaskForm } from 'src/sections/task/form';
import { useUserPermissions } from 'src/services/auth/use-user-permissions';
import { Bounce, toast } from 'react-toastify';

// const reorder = (list: any, startIndex: number, endIndex: number) => {
//   const result = Array.from(list);
//   const [removed] = result.splice(startIndex, 1);
//   result.splice(endIndex, 0, removed);

//   return result;
// };

// const move = (source: any, destination: any, droppableSource: any, droppableDestination: any) => {
//   const sourceClone = Array.from(source);
//   const destClone = Array.from(destination);
//   const [removed] = sourceClone.splice(droppableSource.index, 1);

//   destClone.splice(droppableDestination.index, 0, removed);

//   const result: any = {};
//   result[droppableSource.droppableId] = sourceClone;
//   result[droppableDestination.droppableId] = destClone;

//   return result;
// };

function BoardColumnHeader({
  label,
  count,
  request,
  permission,
}: KanbanColumn['meta'] & { request: Partial<Request>; permission?: string[] }) {
  const onShowErrorToast = () => {
    toast.error(`You don't have permission`, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
      transition: Bounce,
    });
  };
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.5}>
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Box
          borderRadius="50%"
          bgcolor="#DFE3E8"
          width={24}
          height={24}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Typography color="#637381">{count}</Typography>
        </Box>
        <Typography color="#1C252E" variant="h6">
          {label}
        </Typography>
      </Stack>

      {permission?.includes('task:create') ? (
        <TaskForm request={request}>
          <IconButton aria-label="Create Task" size="small">
            <Iconify icon="mdi:plus" />
          </IconButton>
        </TaskForm>
      ) : (
        <IconButton onClick={onShowErrorToast} aria-label="Create Task" size="small">
          <Iconify icon="mdi:plus" />
        </IconButton>
      )}
    </Stack>
  );
}

function BoardItem({ item, index }: { item: TaskManagement; index: number }) {
  const { vendor } = useParams();

  return (
    <Draggable draggableId={item.task.id.toString()} index={index}>
      {(provided) => (
        <Stack
          component={Link}
          to={`/${vendor}/task/${item.task.id}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          spacing={2}
          sx={{
            backgroundColor: '#FFFFFF',
            borderRadius: 1.5,
            px: 3,
            py: 2.5,
            width: '100%',
            textDecoration: 'none',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <RequestPriority priority={item.request.priority} />

            <Box
              px="6px"
              borderRadius="6px"
              width="max-content"
              fontWeight="bold"
              bgcolor="rgba(145, 158, 171, 0.16)"
              color="#637381"
            >
              {item.request.product.name}
            </Box>
          </Stack>

          <Stack spacing={0.5}>
            <Typography color="#1C252E" variant="subtitle2">
              {item.task.name}
            </Typography>
            <Typography
              color="#919EAB"
              noWrap
              sx={{
                fontWeight: 400,
                fontSize: '12px',
                lineHeight: '16px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                width: '100%', // Ensure the width is constrained
                display: 'block', // Make it a block element
              }}
            >
              {item.task.description} lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
              do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
              veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
              consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
              dolore eu
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={0.5} color="#637381">
            <Iconify icon="mdi:calendar-blank" />
            <Typography sx={{ fontWeight: 400, fontSize: '12px', lineHeight: '16px' }}>
              {TaskManagement.formatDueDate(item.task.dueDate)}
            </Typography>
          </Stack>
        </Stack>
      )}
    </Draggable>
  );
}

function BoardColumn({
  column,
  permission,
}: {
  column: Task['status'];
  permission: string[] | undefined;
}) {
  const [searchParams] = useSearchParams();
  const assigneeCompanyId = useAssigneeCompanyId();
  const { data } = useKanbanColumn(column, {
    search: searchParams.get('search') || '',
    productId: Number(searchParams.get('productId')) || 0,
    assigneeCompanyId,
  });

  if (!data) return null;

  const request = data.items?.[0]?.request;

  return (
    <Droppable droppableId={column}>
      {(provided) => (
        <Stack
          {...provided.droppableProps}
          ref={provided.innerRef}
          spacing={2}
          sx={{
            backgroundColor: '#F4F6F8',
            borderRadius: 2,
            padding: 2,
            minWidth: 335,
          }}
        >
          <BoardColumnHeader permission={permission} request={request} {...data.meta} />

          {data.items.map((json, index) => {
            const item = TaskManagement.fromJson(json);
            return <BoardItem key={item.task.id} item={item} index={index} />;
          })}

          {provided.placeholder}
        </Stack>
      )}
    </Droppable>
  );
}

export default function TaskKanbanPage() {
  const { mutate } = useKanbanChangeStatus();
  const { data: userPermissionList } = useUserPermissions();
  const onDragEnd: OnDragEndResponder = (result) => {
    const taskId = Number(result.draggableId);
    const sourceStatus = result.source.droppableId;
    const destinationStatus = result.destination?.droppableId;

    // dropped outside the list
    if (!destinationStatus) {
      return;
    }

    // source and destination status in same column
    if (sourceStatus === destinationStatus) {
      console.log(`👾 ~ TODO: reorder column ${sourceStatus}`);
      return;
    }

    // change status when dropped to different column
    mutate({
      taskId,
      status: destinationStatus as Task['status'],
      prevStatus: sourceStatus as Task['status'],
    });
  };

  return (
    <Stack direction="row" spacing={3} sx={{ overflowX: 'auto' }}>
      <DragDropContext
        onDragEnd={(result, provided) => {
          onDragEnd(result, provided);
        }}
      >
        <BoardColumn permission={userPermissionList} column="to-do" />
        <BoardColumn permission={userPermissionList} column="in-progress" />
        <BoardColumn permission={userPermissionList} column="completed" />
      </DragDropContext>
    </Stack>
  );
}
