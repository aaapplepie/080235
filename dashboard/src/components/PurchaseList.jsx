import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { queryKeys } from '../lib/queryClient'

function StatusBadge({ status }) {
  const map = {
    completed: { label: '완료', cls: 'badge badge-completed' },
    pending: { label: '처리중', cls: 'badge badge-pending' },
    cancelled: { label: '취소', cls: 'badge badge-cancelled' },
    refunded: { label: '환불', cls: 'badge badge-refunded' },
  }
  const { label, cls } = map[status] ?? { label: status, cls: 'badge badge-inactive' }
  return <span className={cls}>{label}</span>
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4"><div className="h-3 w-28 bg-gray-100 rounded" /></td>
      <td className="px-4 py-4"><div className="h-4 w-16 bg-gray-100 rounded" /></td>
      <td className="px-4 py-4"><div className="h-3 w-32 bg-gray-100 rounded" /></td>
      <td className="px-4 py-4"><div className="h-3 w-16 bg-gray-100 rounded ml-auto" /></td>
      <td className="px-4 py-4"><div className="h-3 w-20 bg-gray-100 rounded" /></td>
      <td className="px-6 py-4"><div className="h-5 w-12 bg-gray-100 rounded-full mx-auto" /></td>
    </tr>
  )
}

export default function PurchaseList() {
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.purchases,
    queryFn: api.getPurchases,
  })

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="font-display text-base font-bold text-gray-900">최근 구매 내역</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          {isLoading ? '로딩 중...' : isError ? '오류 발생' : `최근 ${data.length}건`}
        </p>
      </div>

      {isError && (
        <div className="px-6 py-8 text-center text-sm text-red-500">
          구매 내역을 불러오지 못했습니다.
        </div>
      )}

      {!isError && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">주문번호</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">고객명</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">상품</th>
                <th className="text-right px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">금액</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">날짜</th>
                <th className="text-center px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading
                ? [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                : data.map((purchase) => (
                    <tr key={purchase.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-slate-600 font-medium">
                        {purchase.id}
                      </td>
                      <td className="px-4 py-4 font-medium text-gray-900">{purchase.customerName}</td>
                      <td className="px-4 py-4 text-gray-600">{purchase.product}</td>
                      <td className="px-4 py-4 text-right font-mono font-semibold text-gray-900">
                        {purchase.amount > 0 ? `₩${purchase.amount.toLocaleString()}` : '-'}
                      </td>
                      <td className="px-4 py-4 font-mono text-xs text-gray-500">{purchase.date}</td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={purchase.status} />
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
