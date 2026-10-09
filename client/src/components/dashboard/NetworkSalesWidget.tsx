import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ArrowDownRight, TrendingDown } from 'lucide-react';

const salesData = [
  { date: '15 OCT', sales: 1.28, label: '₹1.28L' },
  { date: '16 OCT', sales: 1.32, label: '₹1.32L' },
  { date: '17 OCT', sales: 1.25, label: '₹1.25L' },
  { date: '18 OCT', sales: 1.18, label: '₹1.18L' },
  { date: '19 OCT', sales: 1.12, label: '₹1.12L' },
  { date: '20 OCT', sales: 1.15, label: '₹1.15L' },
  { date: '21 OCT', sales: 1.12, label: '₹1.12L' },
];

export const NetworkSalesWidget: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-surface-border shadow-card p-5 flex flex-col justify-between">
      {/* Header Info */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Network sales trend
          </span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200 inline-flex items-center">
            <ArrowDownRight className="w-3 h-3 mr-0.5" />
            3.4%
          </span>
        </div>

        {/* Big Value */}
        <div className="mt-2 flex items-baseline space-x-2">
          <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
            ₹8.42L
          </span>
          <span className="text-xs text-slate-500 font-medium">7-day gross</span>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="h-32 w-full mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={salesData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
              dy={5}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fill: '#94a3b8' }}
              domain={['dataMin - 0.1', 'dataMax + 0.1']}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-lg">
                      <span>{payload[0].payload.date}: </span>
                      <span className="text-emerald-400 font-bold">{payload[0].payload.label}</span>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#059669"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#salesGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Subtext description */}
      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
        <span className="flex items-center space-x-1">
          <TrendingDown className="w-3.5 h-3.5 text-red-500" />
          <span>↘ -3.4% vs prior 7 days</span>
        </span>
        <span className="text-slate-400">synthetic POS total</span>
      </div>
    </div>
  );
};
