import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { queryKeys } from '../lib/queryClient'

function StatusBadge({ status }) {
  const map = {
    vip: { label: 'VIP', cls: 'badge badge-vip' },
    active: { label: '활성', cls: 'badge badge-active' },
    inactive: { label: '비활성', cls: 'badge badge-inactive' },
  }
  const { label, cls } = map[status] ?? { label: status, cls: 'badge badge-inactive' }
  return <span className={cls}>{label}</span>
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-100 rounded" /></td>
      <td className="px-4 py-4"><div className="h-3 w-36 bg-gray-100 rounded" /></td>
      <td className="px-4 py-4"><div className="h-3 w-20 bg-gray-100 rounded" /></td>
      <td className="px-4 py-4"><div className="h-3 w-8 bg-gray-100 rounded ml-auto" /></td>
      <td className="px-4 py-4"><div className="h-3 w-16 bg-gray-100 rounded ml-auto" /></td>
      <td className="px-6 py-4"><div className="h-5 w-12 bg-gray-100 rounded-full mx-auto" /></td>
    </tr>
  )
}

export default function CustomerList() {
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.customers,
    queryFn: api.getCustomers,
  })

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="font-display text-base font-bold text-gray-900">고객 목록</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {isLoading ? '로딩 중...' : isError ? '오류 발생' : `전체 ${data.length}명`}
          </p>
        </div>
      </div>

      {isError && (
        <div className="px-6 py-8 text-center text-sm text-red-500">
          고객 데이터를 불러오지 못했습니다.
        </div>
      )}

      {!isError && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">고객명</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">이메일</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">가입일</th>
                <th className="text-right px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">주문수</th>
                <th className="text-right px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">총 구매액</th>
                <th className="text-center px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading
                ? [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                : data.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-700 shrink-0">
                            {customer.name.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-900">{customer.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-500 font-mono text-xs">{customer.email}</td>
                      <td className="px-4 py-4 text-gray-500 font-mono text-xs">{customer.joinedAt}</td>
                      <td className="px-4 py-4 text-right font-mono text-gray-900">{customer.totalPurchases}</td>
                      <td className="px-4 py-4 text-right font-mono font-medium text-gray-900">
                        ₩{customer.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={customer.status} />
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
