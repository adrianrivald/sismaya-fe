import { Box, Typography } from '@mui/material';
import { taskStatusMap } from 'src/constants/status';

export function TaskStatus({ status }: { status: keyof typeof taskStatusMap }) {
  const { label, ...colorProps } = taskStatusMap?.[status];

  return (
    <Box {...colorProps} borderRadius={0.5} px={1} py="1px">
      <Typography fontWeight={600} fontSize={12} lineHeight="20px">
        {label}
      </Typography>
    </Box>
  );
}
