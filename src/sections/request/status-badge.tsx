import React from 'react';
import { statusColorMap } from 'src/constants/status';
import { Box, Typography } from '@mui/material';

interface StatusProps {
  label: string; // "Requested" | "more" | "and more"
  type: 'info' | 'danger';
}

export function StatusBadge({ label, type, ...restProps }: StatusProps) {
  return (
    <Box
      display="flex"
      justifyContent="center"
      bgcolor={statusColorMap[type].bgColor}
      sx={{ borderRadius: 1.5 }}
      py={0.5}
      px={1}
      ml={1}
      width="max-content"
      {...restProps}
    >
      <Typography color={statusColorMap[type].color} fontWeight="bold">
        {label}
      </Typography>
    </Box>
  );
}
