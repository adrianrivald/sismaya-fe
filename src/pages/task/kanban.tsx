import { Link } from 'react-router-dom';
import { Box, Stack, Typography } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { OnDragEndResponder } from '@hello-pangea/dnd';
import {
  useKanbanColumn,
  TaskManagement,
  type Task,
  type KanbanColumn,
} from 'src/services/task/task-management';
import { Iconify } from 'src/components/iconify';
import { RequestPriority } from 'src/sections/request/request-priority';

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

function BoardColumnHeader({ label, count }: KanbanColumn['meta']) {
  return (
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
  );
}

function BoardItem({ item, index }: { item: TaskManagement; index: number }) {
  return (
    <Draggable draggableId={item.task.id.toString()} index={index}>
      {(provided) => (
        <Stack
          component={Link}
          to={`/task/${item.task.id}`}
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
              sx={{ fontWeight: 400, fontSize: '12px', lineHeight: '16px' }}
            >
              {item.task.name}
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

function BoardColumn({ column }: { column: Task['status'] }) {
  const { data } = useKanbanColumn(column);

  if (!data) return null;

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
            width: 335,
          }}
        >
          <BoardColumnHeader {...data.meta} />

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
  const onDragEnd: OnDragEndResponder = (result) => {
    const taskId = Number(result.draggableId);
    const sourceStatus = result.source.droppableId;
    const destinationStatus = result.destination?.droppableId;

    // dropped outside the list or source and destination status is same
    if (!destinationStatus || sourceStatus === destinationStatus) {
      return;
    }

    console.log(
      `👾 ~ TODO: change task id: ${taskId}, from ${sourceStatus} status to ${destinationStatus} status`
    );

    // const sInd = +source.droppableId;
    // const dInd = +destination.droppableId;

    // if (sInd === dInd) {
    //   const items = reorder(state[sInd], source.index, destination.index);
    //   const newState = [...state];
    //   // @ts-ignore
    //   newState[sInd] = items;
    //   setState(newState);
    // } else {
    //   const result = move(state[sInd], state[dInd], source, destination);
    //   const newState = [...state];

    //   newState[sInd] = result[sInd];
    //   newState[dInd] = result[dInd];

    //   setState(newState.filter((group) => group.length));
    // }
  };

  return (
    <Stack direction="row" spacing={3}>
      <DragDropContext onDragEnd={onDragEnd}>
        <BoardColumn column="to-do" />
        <BoardColumn column="in-progress" />
        <BoardColumn column="completed" />
      </DragDropContext>
    </Stack>
  );
}
