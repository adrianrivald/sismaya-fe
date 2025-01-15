import Box from '@mui/material/Box';
import capitalize from '@mui/material/utils/capitalize';
import { priorityColorMap } from 'src/constants/status';

export function RequestPriority({ priority }: { priority: keyof typeof priorityColorMap }) {
  const label = priority === 'cito' ? 'CITO' : capitalize(priority);
  const { bgColor, color } = priorityColorMap[priority];

  return (
    <Box
      bgcolor={bgColor}
      color={color}
      px="6px"
      borderRadius="6px"
      width="max-content"
      fontWeight="bold"
    >
      {label}
    </Box>
  );
}
