import React, { useState, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart } from 'recharts';
import { BarChart3, Circle, TrendingUp } from 'lucide-react';
import GaugeChart from './GaugeChart';

const chartModes = [
  { key: 'bar', icon: BarChart3, label: 'Barra' },
  { key: 'gauge', icon: Circle, label: 'Gauge' },
  { key: 'line', icon: TrendingUp, label: 'Linha' },
];

export default function SensorCard({
  title,
  icon: Icon,
  value,
  unit,
  min,
  max,
  target,
  color,
  gradientFrom,
  gradientTo,
  timeSeriesData,
  barData,
  dataKey,
}) {
  const [chartMode, setChartMode] = useState('line');

  const trend = useMemo(() => {
    if (!timeSeriesData || timeSeriesData.length < 2) return 0;
    const recent = timeSeriesData.slice(-5);
    const first = recent[0][dataKey];
    const last = recent[recent.length - 1][dataKey];
    return ((last - first) / first * 100).toFixed(1);
  }, [timeSeriesData, dataKey]);

  return (
    <div className="glass-strong rounded-3xl p-5 flex flex-col gap-3 transition-all duration-500 hover:shadow-xl group">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${gradientFrom}30, ${gradientTo}20)` }}
          >
            <Icon className="w-5 h-5" style={{ color }} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold tracking-tight">
                {typeof value === 'number' ? value.toFixed(value > 100 ? 0 : 1) : value}
              </span>
              <span className="text-sm text-muted-foreground font-light">{unit}</span>
            </div>
          </div>
        </div>

        {/* Trend */}
        <div className={`text-xs font-medium px-2 py-1 rounded-lg ${
          Number(trend) >= 0
            ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
            : 'text-rose-600 dark:text-rose-400 bg-rose-500/10'
        }`}>
          {Number(trend) >= 0 ? '+' : ''}{trend}%
        </div>
      </div>

      {/* Chart Mode Selector */}
      <div className="flex gap-1 bg-muted/50 rounded-xl p-1">
        {chartModes.map((mode) => (
          <button
            key={mode.key}
            onClick={() => setChartMode(mode.key)}
            className={`
              flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-medium
              transition-all duration-300
              ${chartMode === mode.key
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
              }
            `}
          >
            <mode.icon className="w-3 h-3" />
            <span className="hidden sm:inline">{mode.label}</span>
          </button>
        ))}
      </div>

      {/* Chart Area */}
      <div className="h-[130px] w-full">
        {chartMode === 'bar' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} barSize={20}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} className="fill-muted-foreground" />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  fontSize: '12px',
                  boxShadow: '0 8px 32px hsl(var(--glass-shadow) / 0.15)',
                }}
              />
              <defs>
                <linearGradient id={`barGrad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.9} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <Bar dataKey={dataKey} fill={`url(#barGrad-${dataKey})`} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {chartMode === 'gauge' && (
          <GaugeChart value={value} min={min} max={max} color={color} unit={unit} />
        )}

        {chartMode === 'line' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeSeriesData}>
              <defs>
                <linearGradient id={`lineGrad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                tick={{ fontSize: 9 }}
                axisLine={false}
                tickLine={false}
                className="fill-muted-foreground"
                interval="preserveStartEnd"
              />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  fontSize: '12px',
                  boxShadow: '0 8px 32px hsl(var(--glass-shadow) / 0.15)',
                }}
              />
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
                fill={`url(#lineGrad-${dataKey})`}
                dot={false}
                activeDot={{ r: 4, fill: color, stroke: 'white', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Target indicator */}
      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
        <span>Meta: {target}{unit}</span>
        <span className={value <= target * 1.1 && value >= target * 0.9
          ? 'text-emerald-500'
          : 'text-amber-500'
        }>
          {value <= target * 1.1 && value >= target * 0.9 ? 'Dentro do ideal' : 'Fora do ideal'}
        </span>
      </div>
    </div>
  );
}