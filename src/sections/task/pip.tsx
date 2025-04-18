import { useEffect, useState } from 'react';
import { Box, Stack, Typography, Portal, TextField, Button } from '@mui/material';
import { useTimerStore, useLastActivity, useTimerActionStore } from 'src/services/task/timer';
import { Iconify } from 'src/components/iconify';
import { TimerActionButton, TimerCountdown } from './timer';

export default function FloatingTimer() {
  const store = useTimerStore();
  const actionStore = useTimerActionStore();

  const lastActivity = useLastActivity({ taskId: store?.taskId });
  const [nameTask, setNameTask] = useState(store?.name || lastActivity?.tmtName || '');
  const [errorTask, setErrorTask] = useState(false);
  const { dragInfo, getDragableProps } = useDragable();

  useEffect(() => {
    setNameTask(lastActivity?.tmtName || store?.name);
  }, [lastActivity?.tmtName, store?.name]);

  if (
    store?.taskId === 0 ||
    store?.state === 'stopped' ||
    store?.state === 'background' ||
    store.state === 'idlePaused'
  ) {
    return null;
  }
  return (
    <Portal container={document.body}>
      <Box
        bgcolor="white"
        position="fixed"
        bottom="1rem"
        right="1rem"
        border="1px solid rgba(145, 158, 171, 0.16)"
        borderRadius={2}
        boxShadow="-20px 20px 40px -4px rgba(145, 158, 171, 0.24)"
        width="350px"
        zIndex={9999}
        display="inline-flex"
        style={{
          position: 'absolute',
          right: `${dragInfo.translation.x}px`,
          bottom: `${dragInfo.translation.y}px`,
        }}
      >
        <Box
          {...getDragableProps()}
          sx={{
            width: '1rem',
            cursor: 'grab',
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
            backgroundColor: 'rgba(0, 91, 127, 0.08)',
            color: 'rgba(0, 91, 127, 1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Iconify icon="carbon:draggable" />
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          px={1.5}
        >
          <Stack pt={3.5} pb={2} flex={1} {...getDragableProps()} direction="column" flexGrow={1}>
            <Typography
              color="rgba(99, 115, 129, 1)"
              sx={{ fontWeight: 500, fontSize: '14px', lineHeight: '20px' }}
            >
              {store.request}
            </Typography>
            {lastActivity?.tmtName || store.state === 'running' || store.state === 'paused' ? (
              <div>
                <Typography color="rgba(145, 158, 171, 1)" sx={{ fontSize: '13px' }}>
                  {nameTask}
                </Typography>
              </div>
            ) : (
              <Stack className="flex flex-row">
                <TextField
                  sx={{
                    fontSize: '12px',
                    width: '130px',
                    '& .MuiInputBase-input': {
                      padding: '4px 8px',
                      height: '20px',
                      width: '80%',
                      fontSize: '12px',
                    },
                  }}
                  defaultValue={nameTask}
                  value={nameTask || ''}
                  onChange={(e) => setNameTask(e.target.value)}
                  placeholder="Name you activity"
                />
                {errorTask && (
                  <Typography color="rgba(255, 86, 48, 1)" variant="caption">
                    Name your activity first to begin recording
                  </Typography>
                )}
              </Stack>
            )}
          </Stack>
        </Box>
        <Stack spacing={1.5} direction="row" alignItems="center" mt={2} mr={2}>
          <TimerCountdown size="small" />
          <TimerActionButton
            taskId={store.taskId}
            name={nameTask}
            setErrorTask={setErrorTask}
            errorTask={errorTask}
          />
        </Stack>
        {store.state !== 'running' && (
          <Button
            onClick={() => {
              if (store.state === 'running') {
                actionStore.send({
                  type: 'background',
                  taskId: store.taskId,
                  activity: store.activity,
                  request: store.request,
                  timer: store.timer,
                  name: nameTask,
                });
              } else if (store.state === 'paused' || store.state === 'idle') {
                actionStore.send({
                  type: 'idlePaused',
                  taskId: store.taskId,
                  activity: store.activity,
                  request: store.request,
                  timer: store.timer,
                  name: nameTask,
                });
              } else {
                actionStore.send({
                  type: 'background',
                  taskId: store.taskId,
                  activity: store.activity,
                  request: store.request,
                  timer: store.timer,
                  name: nameTask,
                });
              }
            }}
            startIcon={<Iconify icon="material-symbols:close" />}
            sx={{ height: 10, width: 10, p: 0, minWidth: 5, mt: 1, mr: 1, mb: 2 }}
          />
        )}
      </Box>
    </Portal>
  );
}

const startingPosition = { x: 16, y: 16 };

function useDragable() {
  const [dragInfo, setDragInfo] = useState({
    isInitial: true,
    isDragging: false,
    origin: { x: 0, y: 0 },
    translation: startingPosition,
    lastTranslation: startingPosition,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragInfo.isDragging) {
        setDragInfo((prev) => ({
          ...prev,
          translation: {
            x: Math.abs(e.clientX - (prev.origin.x + prev.lastTranslation.x)),
            y: Math.abs(e.clientY - (prev.origin.y + prev.lastTranslation.y)),
          },
        }));
      }
    };

    const handleMouseUp = () => {
      if (dragInfo.isDragging) {
        setDragInfo((prev) => ({
          ...prev,
          isDragging: false,
          lastTranslation: { x: prev.translation.x, y: prev.translation.y },
        }));
      }
    };

    if (dragInfo.isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragInfo.isDragging, dragInfo.origin, dragInfo.lastTranslation]);

  const handleMouseDown = ({ clientX, clientY }: React.MouseEvent) => {
    if (!dragInfo.isDragging) {
      setDragInfo((prev) => ({
        ...prev,
        // isInitial: false,
        isDragging: true,
        origin: { x: clientX, y: clientY },
      }));
    }
  };

  return {
    dragInfo,
    getDragableProps: () => ({
      onMouseDown: handleMouseDown,
      style: { cursor: 'grab' }, // Optional styling
    }),
  };
}
