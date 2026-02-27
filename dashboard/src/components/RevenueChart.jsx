import { useQuery } from '@tanstack/react-query'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { api } from '../lib/api'
import { queryKeys } from '../lib/queryClient'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-4 py-3">
      <p className="text-sm font-medium text-gray-700 mb-1">{label}</p>
      <p className="font-mono text-sm font-semibold text-slate-700">
        ₩{(payload[0].value / 1000000).toFixed(2)}M
      </p>
      <p className="text-xs text-gray-400">{payload[1]?.value}명 고객</p>
    </div>
  )
}

export default function RevenueChart() {
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.revenue,
    queryFn: api.getRevenue,
  })

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-base font-bold text-gray-900">월별 매출 추이</h2>
          <p className="text-xs text-gray-400 mt-0.5">최근 6개월</p>
        </div>
      </div>

      {isLoading && (
        <div className="h-[220px] animate-pulse bg-gray-50 rounded-lg" />
      )}

      {isError && (
        <div className="h-[220px] flex items-center justify-center text-sm text-red-500">
          데이터를 불러오지 못했습니다.
        </div>
      )}

      {data && (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#475569" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#475569" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: '#94a3b8', fontFamily: 'Figtree' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
              tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#475569"
              strokeWidth={2}
              fill="url(#revenueGrad)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0, fill: '#475569' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
