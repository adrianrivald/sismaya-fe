import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useTheme, alpha as hexAlpha } from '@mui/material/styles';

import { fNumber } from 'src/utils/format-number';

import { Chart, useChart } from 'src/components/chart';
import { Box, MenuItem, Select, SelectChangeEvent, Stack, Typography } from '@mui/material';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  chart: {
    colors?: string[];
    categories?: string[];
    series: {
      name: string;
      data: number[];
    }[];
    options?: ChartOptions;
  };
  handleChangeDate?: (e: SelectChangeEvent<number>) => void;
  handleChangeStaffState: (state: 'quantity' | 'hour') => void;
  staffState?: 'quantity' | 'hour';
};

export function TopStaffChart({
  title,
  subheader,
  chart,
  handleChangeDate,
  handleChangeStaffState,
  staffState,
  ...other
}: Props) {
  const theme = useTheme();

  const chartColors = chart.colors ?? [
    theme.palette.primary.dark,
    hexAlpha(theme.palette.primary.dark, 0.24),
  ];

  const chartOptions = useChart({
    colors: chartColors,
    stroke: { width: 2, colors: ['transparent'] },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value: number) => fNumber(value),
        title: { formatter: (seriesName: string) => `Tasks: ` },
      },
    },
    xaxis: { categories: chart.categories },
    dataLabels: {
      enabled: true,
      offsetX: -6,
      style: { fontSize: '10px', colors: ['#FFFFFF', theme.palette.text.primary] },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 2,
        barHeight: '15px',
        dataLabels: { position: 'top' },
      },
    },
    ...chart.options,
  });

  return (
    <Card {...other}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mx={5} mt={5}>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography fontWeight="bold">{title}</Typography>
          <Box
            display="flex"
            gap={1}
            alignItems="center"
            sx={{ backgroundColor: 'grey.200', padding: 1, borderRadius: 1 }}
          >
            <Box
              onClick={() => handleChangeStaffState('quantity')}
              sx={{
                cursor: 'pointer',
                backgroundColor: staffState === 'quantity' ? 'common.white' : '',
                padding: 1,
                paddingX: 2,
                borderRadius: 1,
              }}
            >
              <Typography>Quantity</Typography>
            </Box>
            <Box
              onClick={() => handleChangeStaffState('hour')}
              sx={{
                cursor: 'pointer',
                backgroundColor: staffState === 'hour' ? 'common.white' : '',
                padding: 1,
                paddingX: 2,
                borderRadius: 1,
              }}
            >
              <Typography>Hour</Typography>
            </Box>
          </Box>
        </Box>

        <Select
          labelId="date-filter-label"
          id="date-filter"
          label="Filter"
          onChange={handleChangeDate}
          defaultValue={0}
          sx={{
            fontWeight: 'bold',
            height: 40,
            paddingY: 0.5,
            paddingX: 1,
            ml: 1,
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: 'grey.175',
            borderRadius: 1.5,
            width: 'max-content',
            '& .MuiOutlinedInput-notchedOutline': {
              border: 0,
            },
            '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
          }}
        >
          <MenuItem value={0}>Today</MenuItem>
          <MenuItem defaultChecked value={7}>
            Last 7 days
          </MenuItem>
          <MenuItem value={30}>Last 30 days</MenuItem>
        </Select>
      </Stack>

      <Chart
        type="bar"
        series={chart.series}
        options={chartOptions}
        height={360}
        sx={{ py: 2.5, pl: 1, pr: 2.5 }}
      />
    </Card>
  );
}
