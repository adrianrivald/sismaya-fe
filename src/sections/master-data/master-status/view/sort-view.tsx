import { Autocomplete, Box, Card, Grid, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { SvgColor } from 'src/components/svg-color';
import { API_URL } from 'src/constants';
import { DashboardContent } from 'src/layouts/dashboard';
import { StrictModeDroppable } from 'src/pages/master-data/master-faq/StrictModeDroppable';
import { getSession } from 'src/sections/auth/session/session';
import { useInternalCompaniesAll, useUpdateStatus } from 'src/services/master-data/company';
import type { Status } from 'src/services/master-data/company/types';

export function SortStatusView() {
  const { mutate: updateStatus } = useUpdateStatus();
  const { data: internalCompanies } = useInternalCompaniesAll();

  const [statusList, setStatusList] = useState<Status[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);

  const handleDragEnd = (result: any) => {
    const { destination, source } = result;
    const destinationSort = destination.index + 1;
    const targettedStatus = statusList?.find((item) => item?.id === Number(result.draggableId));

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index)
      return;

    const reordered = Array.from(statusList);
    const [movedItem] = reordered.splice(source.index, 1);
    reordered.splice(destination.index, 0, movedItem);

    setStatusList(reordered);

    updateStatus({
      company_id: selectedCompanyId ?? 0,
      sort: destinationSort,
      id: result.draggableId,
      name: targettedStatus?.name ?? '',
      step: targettedStatus?.step ?? '',
    });
  };

  const fetchStatus = async (companyId: number) => {
    const data = await fetch(`${API_URL}/companies/${companyId}`, {
      headers: {
        Authorization: `Bearer ${getSession()}`,
      },
    }).then((res) =>
      res.json().then((value) => {
        console.log(value, 'value');
        const newArr = value?.data?.progress_statuses?.sort((a: any, b: any) => a.sort - b.sort);
        setStatusList(newArr);
      })
    );
    return data;
  };

  const onChange = (selectedId: number | null) => {
    setSelectedCompanyId(selectedId);
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

      <Grid item xs={12} md={12} mb={4}>
        {/* <Typography mb={2}>Company</Typography> */}
        <Autocomplete
          options={internalCompanies || []}
          getOptionLabel={(option) =>
            `${option?.parent?.name ? `${option?.parent?.name} - ` : ''}${option?.name}` || ''
          }
          isOptionEqualToValue={(option, val) => option?.id === val?.id}
          value={internalCompanies?.find((company) => company.id === selectedCompanyId) || null}
          onChange={(_, selectedCompany) => {
            const selectedId = selectedCompany?.id || null;
            onChange(selectedId);

            if (selectedId) {
              fetchStatus(selectedId);
            }
          }}
          renderInput={(params) => <TextField {...params} label="Company" />}
        />
      </Grid>

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
            {!statusList?.length ? (
              <Box display="flex" justifyContent="center" my={4}>
                <Typography>Select company first to sort progress statuses</Typography>
              </Box>
            ) : (
              <>
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
                          {statusList?.map((status, index) => (
                            <Draggable
                              key={status.id}
                              draggableId={status.id.toString()}
                              index={index}
                            >
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
              </>
            )}
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
