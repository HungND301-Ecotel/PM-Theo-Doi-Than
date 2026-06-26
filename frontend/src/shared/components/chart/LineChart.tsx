import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/shared/components/ui/card.tsx';

export interface LineChartDataItem {
  name: string;
  [key: string]: string | number;
}

export interface LineChartSeries {
  dataKey: string;
  label: string;
  color?: string;
  dotColor?: string;
  dashed?: boolean;
  showArea?: boolean;
}

export interface LineChartProps {
  data: LineChartDataItem[];
  series: LineChartSeries[];
  title?: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  showDots?: boolean;
  curved?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

const DEFAULT_COLORS = [
  '#6366f1',
  '#06b6d4',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#10b981',
];

const normalizeColor = (color: string) => {
  const cssVariable = color.match(/^hsl\(var\((--[^)]+)\)\)$/)?.[1];
  return cssVariable ? `var(${cssVariable})` : color;
};

const AppLineChart: React.FC<LineChartProps> = ({
  data,
  series,
  title,
  height = 350,
  showGrid = true,
  showLegend = true,
  showDots = true,
  curved = true,
  xAxisLabel,
  yAxisLabel,
}) => {
  const mutedColor = 'var(--muted-foreground)';

  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div className='w-full' style={{ height }}>
          <ResponsiveContainer width='100%' height='100%'>
            <RechartsLineChart
              data={data}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              {showGrid && (
                <CartesianGrid
                  strokeDasharray='3 3'
                  vertical={false}
                  stroke='var(--border)'
                />
              )}
              <XAxis
                dataKey='name'
                tick={{ fontSize: 12, fill: mutedColor }}
                axisLine={false}
                tickLine={false}
                label={
                  xAxisLabel
                    ? {
                        value: xAxisLabel,
                        position: 'insideBottom',
                        offset: -5,
                      }
                    : undefined
                }
              />
              <YAxis
                tick={{ fontSize: 12, fill: mutedColor }}
                axisLine={false}
                tickLine={false}
                label={
                  yAxisLabel
                    ? { value: yAxisLabel, angle: -90, position: 'insideLeft' }
                    : undefined
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                  boxShadow: '0px 0px 1px rgba(0,0,0,0.4)',
                }}
                itemStyle={{ fontSize: 12 }}
              />
              {showLegend && (
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 16 }} />
              )}
              {series.map((s, i) => {
                const color = normalizeColor(
                  s.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length]
                );
                const dotColorVal = s.dotColor
                  ? normalizeColor(s.dotColor)
                  : color;
                return (
                  <React.Fragment key={s.dataKey}>
                    {s.showArea && (
                      <defs>
                        <linearGradient
                          id={`gradient-${s.dataKey}`}
                          x1='0'
                          y1='0'
                          x2='0'
                          y2='1'
                        >
                          <stop
                            offset='5%'
                            stopColor={color}
                            stopOpacity={0.2}
                          />
                          <stop
                            offset='95%'
                            stopColor={color}
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                    )}
                    <Line
                      type={curved ? 'monotone' : 'linear'}
                      dataKey={s.dataKey}
                      name={s.label}
                      stroke={color}
                      strokeWidth={2}
                      strokeDasharray={s.dashed ? '5 5' : undefined}
                      dot={
                        showDots
                          ? { fill: dotColorVal, r: 3.5, stroke: dotColorVal }
                          : false
                      }
                      activeDot={{
                        r: 5.5,
                        strokeWidth: 2,
                        stroke: 'var(--background)',
                        fill: dotColorVal,
                      }}
                      fill={
                        s.showArea ? `url(#gradient-${s.dataKey})` : undefined
                      }
                    />
                  </React.Fragment>
                );
              })}
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppLineChart;
