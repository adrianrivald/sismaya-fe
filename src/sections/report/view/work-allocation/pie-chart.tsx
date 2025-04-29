// PieChart.tsx
import React from 'react';
import { Box } from '@mui/material';

type Segment = {
  value: number;
  color: string;
};

const PieChart = ({ data }: { data: Segment[] }) => {
  const total = data?.reduce((sum, seg) => sum + seg.value, 0);
  let cumulativePercent = 0;

  const getCoordinatesForPercent = (percent: number, radius: number) => {
    const angle = 2 * Math.PI * percent;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return [x, y];
  };

  const arcs =
    data?.length === 1
      ? [
          // Draw full circle if only one segment
          <g key={0}>
            <circle cx="60" cy="60" r="50" fill={data[0].color} />
            <text
              x="60"
              y="60"
              fill="black"
              fontSize="10"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              100%
            </text>
          </g>,
        ]
      : data?.map((segment, index) => {
          const startPercent = cumulativePercent;
          const segmentPercent = segment.value / total;
          cumulativePercent += segmentPercent;

          const [startX, startY] = getCoordinatesForPercent(startPercent, 50);
          const [endX, endY] = getCoordinatesForPercent(cumulativePercent, 50);
          const [textX, textY] = getCoordinatesForPercent(startPercent + segmentPercent / 2, 30);

          const largeArcFlag = segmentPercent > 0.5 ? 1 : 0;
          const percentageLabel = `${Math.round(segmentPercent * 100)}%`;

          return (
            <g key={index}>
              <path
                d={`
                M 60 60
                L ${60 + startX} ${60 + startY}
                A 50 50 0 ${largeArcFlag} 1 ${60 + endX} ${60 + endY}
                Z
              `}
                fill={segment.color}
              />
              <text
                x={60 + textX}
                y={60 + textY}
                fill="black"
                fontSize="6"
                textAnchor="middle"
                alignmentBaseline="middle"
              >
                {percentageLabel}
              </text>
            </g>
          );
        });

  return (
    <Box sx={{ width: 350, height: 350 }}>
      <svg width="350" height="350" viewBox="0 0 120 120">
        {arcs}
      </svg>
    </Box>
  );
};

export default PieChart;
