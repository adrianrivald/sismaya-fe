import * as React from 'react';
import { Box, Stack, Typography, Portal } from '@mui/material';
import { useTimerStore, useCheckTimer } from 'src/services/task/timer';
import { TimerActionButton, TimerCountdown } from './timer';

export default function FloatingTimer() {
  useCheckTimer();
  const store = useTimerStore();
  const { dragInfo, getDragableProps } = useDragable();

  if (store.taskId === 0 || store.state === 'idle' || store.state === 'stopped') {
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
        width="320px"
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
          width="1rem"
          sx={{
            cursor: 'move',
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
            backgroundColor: 'rgba(0, 91, 127, 0.08)',
          }}
        />

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          px={1.5}
          py={2}
        >
          <Stack spacing={0.5} direction="column" flexGrow={1}>
            <Typography
              color="rgba(99, 115, 129, 1)"
              sx={{ fontWeight: 500, fontSize: '14px', lineHeight: '20px' }}
            >
              {store.request}
            </Typography>
            <Typography
              flexGrow={1}
              color="rgba(99, 115, 129, 1)"
              sx={{ fontWeight: 700, fontSize: '14px', lineHeight: '20px' }}
            >
              {store.activity}
            </Typography>
          </Stack>

          <Stack spacing={1.5} direction="row" alignItems="center">
            <TimerCountdown size="small" />
            <TimerActionButton taskId={store.taskId} />
          </Stack>
        </Box>
      </Box>
    </Portal>
  );
}

const startingPosition = { x: 16, y: 16 };

function useDragable() {
  const [dragInfo, setDragInfo] = React.useState({
    isInitial: true,
    isDragging: false,
    origin: { x: 0, y: 0 },
    translation: startingPosition,
    lastTranslation: startingPosition,
  });

  const { isDragging } = dragInfo;
  const handleMouseDown = ({ clientX, clientY }: React.MouseEvent) => {
    if (!isDragging) {
      setDragInfo((prev) => ({
        ...prev,
        isInitial: false,
        isDragging: true,
        origin: { x: clientX, y: clientY },
      }));
    }
  };

  const handleMouseMove = ({ clientX, clientY }: React.MouseEvent) => {
    if (isDragging) {
      setDragInfo((prev) => ({
        ...prev,
        translation: {
          x: Math.abs(clientX - (prev.origin.x + prev.lastTranslation.x)),
          y: Math.abs(clientY - (prev.origin.y + prev.lastTranslation.y)),
        },
      }));
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setDragInfo((prev) => ({
        ...prev,
        isDragging: false,
        lastTranslation: { x: prev.translation.x, y: prev.translation.y },
      }));
    }
  };

  return {
    dragInfo,
    getDragableProps: () => ({
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseMove,
      onMouseUp: handleMouseUp,

      onPointerDown: handleMouseDown,
      onPointerMove: handleMouseMove,
      onPointerLeave: handleMouseMove,
      onPointerUp: handleMouseUp,
    }),
  };
}
