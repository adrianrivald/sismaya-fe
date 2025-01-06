import { Stack, Typography } from '@mui/material';

export function TaskEmpty() {
  return (
    <Stack spacing={4} alignItems="center" flexGrow={1}>
      <img
        src="/assets/illustrations/illustration_empty_content.png"
        alt="No tasks"
        width={320}
        height={240}
      />
      <Typography color="#919EAB" fontWeight="bold" textAlign="center">
        No tasks have been created.
      </Typography>
    </Stack>
  );
}
