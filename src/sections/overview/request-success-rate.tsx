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
    series: value,
    legend: {
      show: true,
      position: 'bottom' as const,
    },
    plotOptions: {
      // legend: {
      //   show: true,
      //   position: 'bottom',
      // },
      pie: {
        startAngle: 0,
        endAngle: 360,
        expandOnClick: false,
        offsetX: 0,
        offsetY: 0,
        customScale: 1,
        dataLabels: {
          offset: 0,
          minAngleToShowLabel: 10,
        },
        donut: {
          size: '65%',
          background: 'transparent',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '22px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 600,
              color: undefined,
              offsetY: -10,
            },
            total: {
              show: true,
              showAlways: true,
              fontSize: '22px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 700,
              color: '#373d3f',
            },
          },
        },
      },
    },
    // responsive: [
    //   {
    //     breakpoint: 480,
    //     options: {
    //       chart: {
    //         width: 200,
    //       },
    //       legend: {
    //         position: 'bottom',
    //       },
    //     },
    //   },
    // ],
  };

  return (
    <Chart type="donut" series={value} options={options} height={350} style={{ width: 'auto' }} />
  );
}
