import type { CardProps } from '@mui/material/Card';
import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  value: number[];
};

export function RequestSuccessRate({ title, subheader, value, ...other }: Props) {
  const options: any = {
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
    },
    colors: ['#D3FCD2', '#77ED8B', '#FFAC82'],
    labels: ['Early', 'On-Time', 'Late'],
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        expandOnClick: false,
        offsetX: 0,
        offsetY: 0,
        customScale: 1,
        donut: {
          size: '65%',
          background: 'transparent',
          labels: {
            show: true,
            total: {
              label: '',
              show: true,
              showAlways: true,
              fontSize: '24px',
              fontWeight: 700,
              color: '#373d3f',
              formatter(w: any) {
                const totalValue: number = w.globals.seriesTotals.reduce(
                  (a: number, b: number) => a + b,
                  0
                );
                return `${totalValue}%`;
              },
            },
          },
        },
      },
    },
  };

  return (
    <Chart type="donut" series={value} options={options} height={350} style={{ width: 'auto' }} />
  );
}
