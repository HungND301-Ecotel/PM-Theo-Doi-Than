import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

export interface BarChartDataItem {
  name: string;
  [key: string]: string | number;
}

export interface BarChartSeries {
  key: string; // Changed from dataKey to match App.tsx usage
  label: string;
  color?: string;
  stackId?: string;
}

export interface BarChartProps {
  data: BarChartDataItem[];
  series: BarChartSeries[];
  title?: string;
  height?: number;
  layout?: "vertical" | "horizontal";
  showGrid?: boolean;
  showLegend?: boolean;
  stacked?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  barSize?: number;
  borderRadius?: number;
}

const DEFAULT_COLORS = [
  "#6366f1",
  "#06b6d4",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#10b981",
  "#f97316",
  "#ec4899",
];

const normalizeColor = (color: string) => {
  const cssVariable = color.match(/^hsl\(var\((--[^)]+)\)\)$/)?.[1];
  return cssVariable ? `var(${cssVariable})` : color;
};

const AppBarChart: React.FC<BarChartProps> = ({
  data,
  series,
  title,
  height = 350,
  layout = "horizontal",
  showGrid = true,
  showLegend = true,
  stacked = false,
  xAxisLabel,
  yAxisLabel,
  barSize,
  borderRadius = 0,
}) => {
  const mutedColor = "var(--muted-foreground)";

  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div className="w-full" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={data}
            layout={layout}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--border)"
              />
            )}
            {layout === "horizontal" ? (
              <>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: mutedColor }}
                  axisLine={false}
                  tickLine={false}
                  label={
                    xAxisLabel
                      ? {
                          value: xAxisLabel,
                          position: "insideBottom",
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
                      ? {
                          value: yAxisLabel,
                          angle: -90,
                          position: "insideLeft",
                        }
                      : undefined
                  }
                />
              </>
            ) : (
              <>
                <XAxis
                  type="number"
                  tick={{ fontSize: 12, fill: mutedColor }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 12, fill: mutedColor }}
                  width={100}
                  axisLine={false}
                  tickLine={false}
                />
              </>
            )}
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                borderRadius: "var(--radius)",
                border: "1px solid var(--border)",
                boxShadow: "0px 0px 1px rgba(0,0,0,0.4)",
                position: "relative",
                zIndex: 1000,
              }}
              cursor={{ fill: "var(--muted)", opacity: 0.28 }}
              itemStyle={{ fontSize: 12 }}
              wrapperStyle={{
                zIndex: 1000,
                pointerEvents: "none",
                outline: "none",
              }}
            />
            {showLegend && (
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 16 }} />
            )}
            {series.map((s, i) => (
              <Bar
                key={s.key}
                dataKey={s.key}
                name={s.label}
                fill={normalizeColor(
                  s.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length],
                )}
                stackId={stacked ? "stack" : s.stackId}
                barSize={barSize || 40}
                radius={[borderRadius, borderRadius, 0, 0]}
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppBarChart;
