import Sidebar from './components/Sidebar'
import Header from './components/Header'
import KPICards from './components/KPICards'
import RevenueChart from './components/RevenueChart'
import CustomerList from './components/CustomerList'
import PurchaseList from './components/PurchaseList'

export default function App() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* 사이드바 */}
      <Sidebar />

      {/* 메인 영역 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="대시보드" />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* KPI 카드 */}
            <KPICards />

            {/* 차트 */}
            <RevenueChart />

            {/* 테이블 섹션 */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <CustomerList />
              <PurchaseList />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
