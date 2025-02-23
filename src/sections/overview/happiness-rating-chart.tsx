import { Box, Typography } from '@mui/material';
import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';
import { Chart } from 'src/components/chart';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  value: number;
  ratingSummary: number;
};

export function HappinessRatingChart({ title, subheader, value, ratingSummary, ...other }: Props) {
  const options: ChartOptions = {
    series: [value],
    chart: {
      type: 'radialBar',
    },

    plotOptions: {
      radialBar: {
        hollow: {
          size: '65%', // Adjust the thickness of the ring
        },
        track: {
          background: '#E6E6E6', // Lighter background track
        },
        dataLabels: {
          name: {
            show: false,
            fontSize: '16px',
            color: '#666',
            offsetY: -10, // Adjusts text position
          },
          value: {
            show: false,
            fontSize: '22px',
            fontWeight: 600,
            color: '#333',
            offsetY: 10, // Adjusts value position
          },
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        gradientToColors: ['#1E4D66'], // Gradient color
        stops: [0, 100],
      },
    },
    stroke: {
      lineCap: 'round', // Makes the ends rounded
    },
  };

  return (
    <Box position="relative">
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Box>
          <Typography fontSize={32}>
            {ratingSummary}/<span style={{ color: '#919EAB' }}>5.00</span>
          </Typography>
        </Box>
      </Box>
      <Chart
        type="radialBar"
        series={options?.series}
        options={options}
        height={300}
        width={300}
        style={{ width: '300px' }}
      />
    </Box>
  );
}
