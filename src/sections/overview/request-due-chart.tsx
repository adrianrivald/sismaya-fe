import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';
import { Chart } from 'src/components/chart';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  value: number;
};

export function RequestDueChart({ title, subheader, value, ...other }: Props) {
  const options: ChartOptions = {
    series: [value],
    chart: {
      type: 'radialBar',
    },

    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        gradientToColors: ['#C8FAD6'],
        stops: [0, 100],
      },
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '50%',
        },
        dataLabels: {
          name: {
            offsetY: -10,
            show: true,
            color: '#888',
            fontSize: '13px',
          },
          value: {
            color: '#111',
            fontSize: '30px',
            show: true,
          },
        },
      },
    },
    labels: ['Resolved'],
  };

  return (
    <Chart
      type="radialBar"
      series={options?.series}
      options={options}
      height={150}
      width={150}
      style={{ width: '150px' }}
    />
  );
}
