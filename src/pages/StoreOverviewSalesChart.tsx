// ============================================================
// FreshGuard AI — Store Overview: Sales Chart (Royal Editorial)
// ============================================================

import type { SalesMetric } from '../types';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';

export function SalesChart({ data }: { data: SalesMetric }) {
  const chartData = data.weeklySales.map((v, i) => ({
    period: `Week ${i + 1}`,
    sales: v,
  }));

  return (
    <div className="royal-card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono tracking-wider text-[#C5A059] uppercase block">
            WEEKLY REVENUE TELEMETRY
          </span>
          <p className="text-2xl font-editorial text-[#FDFBF7] mt-0.5">
            ${data.currentPeriod.toLocaleString()}
          </p>
        </div>
        <span className="badge-royal-critical">
          {data.changePercent.toFixed(1)}% REVENUE DROP
        </span>
      </div>

      <div className="w-full h-[220px] pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(197, 160, 89, 0.1)" />
            <XAxis
              dataKey="period"
              tick={{ fontSize: 11, fill: '#8E9B90', fontFamily: 'JetBrains Mono' }}
              axisLine={{ stroke: 'rgba(197, 160, 89, 0.2)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#8E9B90', fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
              width={45}
            />
            <Tooltip
              formatter={(value) => [`$${typeof value === 'number' ? value.toLocaleString() : value}`, 'Revenue']}
              contentStyle={{
                backgroundColor: '#071C16',
                border: '1px solid rgba(197, 160, 89, 0.4)',
                borderRadius: '4px',
                fontSize: '12px',
                color: '#FDFBF7',
                fontFamily: 'Plus Jakarta Sans',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              }}
              itemStyle={{ color: '#E0C588' }}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#C5A059"
              strokeWidth={2.5}
              dot={{ fill: '#C5A059', r: 4, strokeWidth: 2, stroke: '#041410' }}
              activeDot={{ r: 6, fill: '#E0C588', stroke: '#041410' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-[#8E9B90]">
        <span>PRIOR BASELINE: ${data.previousPeriod.toLocaleString()}</span>
        <span className="text-[#F87171] font-mono">DOWNTURN ACCELERATING</span>
      </div>
    </div>
  );
}
