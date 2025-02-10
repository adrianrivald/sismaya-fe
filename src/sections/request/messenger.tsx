import * as React from 'react';
import { Box, Input, Typography, CircularProgress as Loader } from '@mui/material';
import { SvgColor } from 'src/components/svg-color';

const Messenger = React.lazy(() => import('./task/task-activities'));

function RequestChat() {
  const chats = [];

  return (
    <>
      <Box overflow="auto" height={400}>
        {chats?.length > 0 ? null : (
          <Box
            display="flex"
            flexDirection="column"
            gap={1}
            justifyContent="center"
            alignItems="center"
            height="100%"
            color="grey.500"
          >
            <Box component="img" src="/assets/icons/chat.png" />
            <Typography fontWeight="bold">Start a conversation</Typography>
            <Typography fontSize={12}>Write something...</Typography>
          </Box>
        )}
      </Box>
      <Box
        sx={{
          borderTop: 1,
          borderColor: 'grey.300',
        }}
        display="flex"
        alignItems="center"
        gap={1}
        justifyContent="space-between"
      >
        <Box display="flex" justifyContent="center" alignItems="center" px={2}>
          <SvgColor src="/assets/icons/ic-emoji.svg" />
        </Box>
        <Input disableUnderline type="text" />
        <Box display="flex" alignItems="center" gap={2}>
          <SvgColor width={18} height={18} src="/assets/icons/ic-image.svg" />
          <SvgColor width={18} height={18} src="/assets/icons/ic-clip.svg" />
          <SvgColor width={18} height={18} src="/assets/icons/ic-mic.svg" />
        </Box>
        <Box
          p={2}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            borderLeft: 1,
            borderColor: 'grey.300',
          }}
        >
          <SvgColor width={24} height={24} src="/assets/icons/ic-send.svg" />
        </Box>
      </Box>
    </>
  );
}

export function RequestMessenger({ requestId }: { requestId: number }) {
  const isTask = window.location.pathname.includes('/task');

  if (isTask) {
    return (
      <React.Suspense fallback={<Loader />}>
        <Messenger requestId={requestId}>
          <RequestChat />
        </Messenger>
      </React.Suspense>
    );
  }

  return (
    <Box sx={{ border: 1, borderRadius: 3, borderColor: 'grey.300' }}>
      <Box
        p={2}
        sx={{
          borderBottom: 1,
          borderColor: 'grey.300',
        }}
      >
        <Typography>Chat with Sismedika</Typography>
      </Box>
      <RequestChat />
    </Box>
  );
}
