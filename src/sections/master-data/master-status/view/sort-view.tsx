import { Box, Card, Grid, Typography } from '@mui/material';
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { SvgColor } from 'src/components/svg-color';
import { DashboardContent } from 'src/layouts/dashboard';
import { StrictModeDroppable } from 'src/pages/master-data/master-faq/StrictModeDroppable';

const initialItems = [
  {
    id: 'id-1',
    name: 'Cancelled',
  },
  {
    id: 'id-2',
    name: 'Design',
  },
  {
    id: 'id-3',
    name: 'Design Approval',
  },
  {
    id: 'id-4',
    name: 'Design Approved',
  },
  {
    id: 'id-5',
    name: 'PRD',
  },
  {
    id: 'id-6',
    name: 'Manual Book',
  },
];

export function SortStatusView() {
  const [sortItems, setSortItems] = useState(initialItems);

  const handleDragEnd = (result: any) => {
    const { destination, source } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index)
      return;

    const reordered = Array.from(sortItems);
    const [movedItem] = reordered.splice(source.index, 1);
    reordered.splice(destination.index, 0, movedItem);

    setSortItems(reordered);
  };

  return (
    <DashboardContent maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" sx={{ mb: { xs: 1, md: 2 } }}>
            Edit Status Order
          </Typography>
          <Box display="flex" gap={2} sx={{ mb: { xs: 3, md: 5 } }}>
            <Typography>Master Request Status</Typography>
            <Typography color="grey.500">•</Typography>
            <Typography color="grey.500">Edit Status Order</Typography>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid xs={12}>
          <Card
            sx={{
              mt: 2,
              p: 3,
              boxShadow: '2',
              position: 'relative',
              backgroundColor: 'common.white',
              borderRadius: 4,
            }}
          >
            <Box
              sx={{
                backgroundColor: '#CAFDF5',
                borderRadius: '8px',
                p: 2,
              }}
              display="flex"
              alignItems="center"
              gap={2}
            >
              <SvgColor src="/assets/icons/ic-info-bold.svg" color="#00B8D9" />
              <Box>
                <Typography color="#003768">Drag ☰ icon to move status order.</Typography>
              </Box>
            </Box>

            <Box sx={{ width: '100%' }} mt={4}>
              <Box bgcolor="#F4F6F8" display="flex" p={2} gap={4} alignItems="center">
                <SvgColor src="/assets/icons/ic-bar.svg" color="grey.500" />
                <Typography>Status Name</Typography>
              </Box>
              <DragDropContext onDragEnd={handleDragEnd}>
                <StrictModeDroppable droppableId="list">
                  {(provided) => (
                    <Box component="div" {...provided.droppableProps} ref={provided.innerRef}>
                      {sortItems?.map((status, index) => (
                        <Draggable key={status.id} draggableId={status.id} index={index}>
                          {(providedItem, snapshot) => (
                            <Box
                              component="div"
                              ref={providedItem.innerRef}
                              {...providedItem.draggableProps}
                              {...providedItem.dragHandleProps}
                              display="flex"
                              p={2}
                              gap={4}
                              alignItems="center"
                            >
                              <SvgColor src="/assets/icons/ic-bar.svg" color="grey.500" />
                              <Typography>{status.name}</Typography>
                            </Box>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Box>
                  )}
                </StrictModeDroppable>
              </DragDropContext>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
