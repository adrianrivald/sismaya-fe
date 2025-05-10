import { Icon } from '@iconify/react';
import {
  Box,
  Button,
  Dialog,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { StrictModeDroppable } from './StrictModeDroppable'; // You'll need to create this

interface DialogArrangeProps {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

export function DialogArrange({ open, onClose, onConfirm }: DialogArrangeProps) {
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [arr, setArr] = useState([1, 2, 3, 4, 5, 6, 7, 8]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(arr);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setArr(items);
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose();
      }}
      maxWidth="md"
      fullWidth
      sx={{ p: 3 }}
    >
      <Box sx={{ px: 3, pt: 1, pb: 3 }}>
        <Typography mt={2} fontWeight="bold">
          Arrange FAQ Order
        </Typography>
        <Typography>Drag and drop to arrange how FAQs appear to users.</Typography>
        <FormControl sx={{ mt: 3, width: 200 }}>
          <InputLabel id="select-product">Product</InputLabel>
          <Select
            labelId="select-product"
            id="select-product"
            value={selectedProduct}
            label="Product"
            onChange={(e) => {
              setSelectedProduct(e.target.value);
            }}
            variant="outlined"
          >
            <MenuItem value="-" disabled selected>
              Choose Product
            </MenuItem>
            <MenuItem value="all">All</MenuItem>
          </Select>
        </FormControl>
        <DragDropContext onDragEnd={handleDragEnd}>
          <StrictModeDroppable droppableId="faq-list">
            {(droppableProvided) => (
              <Box
                {...droppableProvided.droppableProps}
                ref={droppableProvided.innerRef}
                sx={{
                  maxHeight: 400,
                  overflowY: 'auto',
                  mt: 3,
                }}
              >
                {arr.map((item, index) => (
                  <Draggable key={item} draggableId={item.toString()} index={index}>
                    {(draggableProvided, snapshot) => (
                      <Box
                        ref={draggableProvided.innerRef}
                        {...draggableProvided.draggableProps}
                        {...draggableProvided.dragHandleProps}
                        sx={{
                          p: 3,
                          borderTop: 1,
                          borderLeft: 1,
                          borderRight: 1,
                          borderBottom: index === arr.length - 1 ? 1 : 0,
                          borderTopLeftRadius: index === 0 ? 5 : 0,
                          borderTopRightRadius: index === 0 ? 5 : 0,
                          borderBottomLeftRadius: index === arr.length - 1 ? 5 : 0,
                          borderBottomRightRadius: index === arr.length - 1 ? 5 : 0,
                          bgcolor: snapshot.isDragging ? 'action.hover' : 'background.paper',
                        }}
                      >
                        <Stack flexDirection="row" alignItems="center" gap={3}>
                          <Box {...draggableProvided.dragHandleProps}>
                            <Icon
                              icon="lsicon:drag-outline"
                              fontSize={23}
                              style={{ cursor: 'grab' }}
                            />
                          </Box>
                          <Typography>{item}</Typography>
                        </Stack>
                      </Box>
                    )}
                  </Draggable>
                ))}
                {droppableProvided.placeholder}
              </Box>
            )}
          </StrictModeDroppable>
        </DragDropContext>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'end', gap: 2 }}>
          <Button variant="outlined">Cancel</Button>
          <Button variant="contained">Save</Button>
        </Box>
      </Box>
    </Dialog>
  );
}
