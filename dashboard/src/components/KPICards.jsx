import { useQuery } from '@tanstack/react-query'
import { Users, TrendingUp, ShoppingCart, DollarSign } from 'lucide-react'
import { api } from '../lib/api'
import { queryKeys } from '../lib/queryClient'

function formatKRW(value) {
  if (value >= 1000000) return `₩${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `₩${(value / 1000).toFixed(0)}K`
  return `₩${value.toLocaleString()}`
}

function StatCard({ icon: Icon, label, value, change, format = 'number' }) {
  const isPositive = change >= 0
  const formattedValue = format === 'currency' ? formatKRW(value) : value.toLocaleString()

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className="font-mono text-2xl font-semibold text-gray-900 mt-1 tracking-tight">
            {formattedValue}
          </p>
        </div>
        <div className="p-2.5 bg-gray-50 rounded-lg">
          <Icon className="w-5 h-5 text-slate-600" />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1.5">
        <span className={`text-xs font-semibold font-mono ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
          {isPositive ? '+' : ''}{change}%
        </span>
        <span className="text-xs text-gray-400">지난달 대비</span>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-3 w-20 bg-gray-100 rounded" />
          <div className="h-7 w-28 bg-gray-100 rounded" />
        </div>
        <div className="w-10 h-10 bg-gray-100 rounded-lg" />
      </div>
      <div className="mt-4 h-3 w-24 bg-gray-100 rounded" />
    </div>
  )
}

export default function KPICards() {
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.kpi,
    queryFn: api.getKPI,
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">
        KPI 데이터를 불러오지 못했습니다. 서버 연결을 확인해주세요.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard icon={Users}        label="전체 고객수"   value={data.totalCustomers.value} change={data.totalCustomers.change} format="number" />
      <StatCard icon={DollarSign}   label="이번달 매출"   value={data.monthlyRevenue.value} change={data.monthlyRevenue.change} format="currency" />
      <StatCard icon={ShoppingCart} label="이번달 주문"   value={data.monthlyOrders.value}  change={data.monthlyOrders.change}  format="number" />
      <StatCard icon={TrendingUp}   label="평균 주문금액" value={data.avgOrderValue.value}  change={data.avgOrderValue.change}  format="currency" />
    </div>
  )
}
