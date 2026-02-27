import { Users, TrendingUp, ShoppingCart, DollarSign } from 'lucide-react'
import { kpiMetrics } from '../data/mockData'

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

export default function KPICards() {
  const { totalCustomers, monthlyRevenue, monthlyOrders, avgOrderValue } = kpiMetrics

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard
        icon={Users}
        label="전체 고객수"
        value={totalCustomers.value}
        change={totalCustomers.change}
        format="number"
      />
      <StatCard
        icon={DollarSign}
        label="이번달 매출"
        value={monthlyRevenue.value}
        change={monthlyRevenue.change}
        format="currency"
      />
      <StatCard
        icon={ShoppingCart}
        label="이번달 주문"
        value={monthlyOrders.value}
        change={monthlyOrders.change}
        format="number"
      />
      <StatCard
        icon={TrendingUp}
        label="평균 주문금액"
        value={avgOrderValue.value}
        change={avgOrderValue.change}
        format="currency"
      />
    </div>
  )
}
