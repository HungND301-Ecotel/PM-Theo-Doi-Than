import React from 'react'
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card'

export interface PieChartDataItem {
  name: string
  value: number
  color?: string
}

export interface PieChartProps {
  data: PieChartDataItem[]
  title?: string
  height?: number
  showLegend?: boolean
  innerRadius?: number | string
  outerRadius?: number | string
  donut?: boolean
}

const DEFAULT_COLORS = ['#6366f1', '#06b6d4', '#f59e0b', '#ef4444', '#8b5cf6', '#10b981', '#f97316', '#ec4899']

const normalizeColor = (color: string) => {
  const cssVariable = color.match(/^hsl\(var\((--[^)]+)\)\)$/)?.[1]
  return cssVariable ? `var(${cssVariable})` : color
}

const AppPieChart: React.FC<PieChartProps> = ({
  data,
  title,
  height = 350,
  showLegend = true,
  innerRadius = 0,
  outerRadius = '80%',
  donut = false,
}) => {
  const actualInnerRadius = donut ? (innerRadius || '55%') : innerRadius

  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div className="w-full flex items-center justify-center" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
              outerRadius={outerRadius}
              innerRadius={actualInnerRadius}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={normalizeColor(entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length])}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card)',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
                boxShadow: '0px 0px 1px rgba(0,0,0,0.4)',
                position: 'relative',
                zIndex: 1000,
              }}
              itemStyle={{ fontSize: 12 }}
              wrapperStyle={{ zIndex: 1000, pointerEvents: 'none', outline: 'none' }}
            />
            {showLegend && (
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ fontSize: 12, paddingTop: 16 }}
              />
            )}
          </RechartsPieChart>
        </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default AppPieChart
