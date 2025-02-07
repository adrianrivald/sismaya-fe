import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useTheme, alpha as hexAlpha } from '@mui/material/styles';

import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

type Props = CardProps & {
  chart: {
    colors?: string[];
    categories?: string[];
    series?: any;
    // series?: {
    //   name: string;
    //   data: number[];
    // }[];
    options?: ChartOptions;
  };
};

export function TotalTaskCompletedChart({ chart, ...other }: Props) {
  const theme = useTheme();

  const chartColors = chart.colors ?? [
    theme.palette.primary.dark,
    hexAlpha(theme.palette.primary.light, 0.64),
  ];

  const chartOptions = useChart({
    colors: chartColors,
    stroke: {
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: chart.categories,
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${value} ${value > 1 ? 'requests' : 'request'}`,
      },
    },
    ...chart.options,
  });

  return (
    <Card {...other}>
      <CardHeader title="Total Task Completed" />

      <Chart
        type="bar"
        series={chart.series}
        options={chartOptions}
        height={364}
        sx={{ py: 2.5, pl: 1, pr: 2.5 }}
      />
    </Card>
  );
}
