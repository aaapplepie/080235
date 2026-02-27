import { LayoutDashboard, Users, ShoppingBag, TrendingUp, Settings } from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: '대시보드', active: true },
  { icon: Users, label: '고객 관리', active: false },
  { icon: ShoppingBag, label: '구매 내역', active: false },
  { icon: TrendingUp, label: '분석', active: false },
  { icon: Settings, label: '설정', active: false },
]

export default function Sidebar() {
  return (
    <aside className="flex flex-col bg-gray-900 text-white w-60 min-h-screen">
      {/* 로고 */}
      <div className="px-6 py-6 border-b border-gray-800">
        <span className="font-display text-xl font-bold tracking-tight text-white">
          Commerce<span className="text-slate-400">OS</span>
        </span>
      </div>

      {/* 네비게이션 */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              item.active
                ? 'bg-slate-700 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* 하단 사용자 영역 */}
      <div className="px-4 py-4 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-xs font-semibold">
            관
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">관리자</p>
            <p className="text-xs text-gray-500 truncate">admin@company.com</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
