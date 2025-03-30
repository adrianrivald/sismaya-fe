import { Box, Typography } from '@mui/material';
import { taskStatusMap } from 'src/constants/status';

export function TaskStatus({ status }: { status: keyof typeof taskStatusMap }) {
  // Ensure we have a valid status that exists in taskStatusMap
  const safeStatus = (status && taskStatusMap[status]) ? status : 'to-do';
  const { label, ...colorProps } = taskStatusMap[safeStatus];

  return (
    <Box {...colorProps} borderRadius={0.5} px={1} py="1px">
      <Typography fontWeight={600} fontSize={12} lineHeight="20px">
        {label}
      </Typography>
    </Box>
  );
}
