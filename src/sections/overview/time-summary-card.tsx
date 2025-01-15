import type { CardProps } from '@mui/material/Card';
import type { ColorType } from 'src/theme/core/palette';
import type { ChartOptions } from 'src/components/chart';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';

import { fNumber, fPercent, fShortenNumber } from 'src/utils/format-number';

import { varAlpha, bgGradient } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';
import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title: string;
  value?: string;
  color?: string;
};

export function TimeSummaryCard({ title, value, color, sx, ...other }: Props) {
  const theme = useTheme();
  return (
    <Card
      sx={{
        p: 3,
        boxShadow: '2',
        position: 'relative',
        color: `${color}`,
        backgroundColor: 'common.white',
        borderRadius: 4,
        borderLeft: 8,
        ...sx,
      }}
      {...other}
    >
      {/* {renderTrending} */}

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
        }}
      >
        <Box sx={{ flexGrow: 1, minWidth: 112 }}>
          <Box sx={{ mb: 1, typography: 'subtitle2', color: 'grey.600' }}>{title}</Box>
          <Box sx={{ typography: 'h4', color: 'blue.700' }}>{value}</Box>
        </Box>
      </Box>
    </Card>
  );
}
