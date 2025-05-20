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
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Draggable, DropResult } from 'react-beautiful-dnd';
import { useProductCompany } from 'src/services/master-data/company';
import { useAuth } from 'src/sections/auth/providers/auth';
import { useProductFAQList } from 'src/services/master-data/faq/use-faq-list';
import { useArrangeMasterFaq } from 'src/services/master-data/faq/use-faq-order';
import { StrictModeDroppable } from './StrictModeDroppable';

interface DialogArrangeProps {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

export function DialogArrange({ open, onClose, onConfirm }: DialogArrangeProps) {
  const [selectedProduct, setSelectedProduct] = useState<string>('0');
  const [arr, setArr] = useState<
    { answer: string; question: string; is_active: boolean; id: number }[]
  >([]);
  const { vendor } = useParams();
  const { user } = useAuth();

  const idCurrentCompany =
    user?.internal_companies?.find((item) => item?.company?.name?.toLowerCase() === vendor)?.company
      ?.id ?? 0;

  const { data } = useProductCompany(String(idCurrentCompany), 99999, '');
  const { data: dataFaq } = useProductFAQList({}, String(selectedProduct));
  const { mutate } = useArrangeMasterFaq();

  useEffect(() => {
    if (dataFaq?.length) {
      const faqList = dataFaq.map((item) => ({ ...item }));
      setArr(faqList);
    } else {
      setArr([]);
    }
  }, [dataFaq]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(arr);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setArr(items);
  };

  const handleSave = () => {
    const newArr = arr.map((item, index) => ({ faq_id: item.id, sort: index }));
    mutate({
      product_id: Number(selectedProduct),
      faqs: newArr,
    });
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
            {data?.map((item) => (
              <MenuItem key={item?.id} value={item?.id?.toString()}>
                {item?.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {arr.length === 0 ? (
          <Box sx={{ display: 'flex', my: 5, justifyContent: 'center' }}>
            <Typography textAlign="center">No FAQ Available</Typography>
          </Box>
        ) : (
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
                    <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
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
                            <Typography>{item.question}</Typography>
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
        )}

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'end', gap: 2 }}>
          <Button variant="outlined" onClick={() => onClose()}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={arr.length === 0}>
            Save
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
