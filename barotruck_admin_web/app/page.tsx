// app/page.tsx
"use client"

export default function Dashboard() {
  // 데이터를 배열로 관리하면 코드가 훨씬 간결해집니다.
  const orders = [
    { id: 'ORD-2026-0202-001', start: '군산항', end: '경기 용인시', driver: '오시온', vehicle: '5톤 카고 (27오 1409)', status: '배차 완료', statusColor: 'bg-blue-50 text-blue-600 border-blue-100' },
    { id: 'ORD-2026-0203-002', start: '서울 송파구', end: '경북 경주시', driver: '김대영', vehicle: '1톤 탑차 (55도 3316)', status: '운송 완료', statusColor: 'bg-green-50 text-green-600 border-green-100' },
    { id: 'ORD-2026-0204-003', start: '서울 중랑구', end: '대구 달서구', driver: '이원희', vehicle: '11톤 윙바디 (13세 5112)', status: '운송 중', statusColor: 'bg-orange-50 text-orange-600 border-orange-100' },
  ];

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800">운송 현황 대시보드</h1>
      
      {/* 요약 카드 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: '오늘 주문', value: '42건', color: 'text-blue-600' },
          { label: '배차 대기', value: '5건', color: 'text-orange-600' },
          { label: '운송 중', value: '18건', color: 'text-green-600' },
          { label: '검수 대기', value: '12건', color: 'text-red-600' },
        ].map((item) => (
          <div key={item.label} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 font-medium">{item.label}</p>
            <p className={`text-3xl font-bold mt-2 ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* 실시간 운송 피드 테이블 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
          📡 실시간 운송 피드
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b-2 border-slate-100">
                <th className="p-4 text-center text-xs font-bold text-slate-500">주문번호</th>
                <th className="p-4 text-center text-xs font-bold text-slate-500">상차지</th>
                <th className="p-4 text-center text-xs font-bold text-slate-500">하차지</th>
                <th className="p-4 text-center text-xs font-bold text-slate-500">차주 정보</th>
                <th className="p-4 text-center text-xs font-bold text-slate-500">차량 정보</th>
                <th className="p-4 text-center text-xs font-bold text-slate-500">상태</th>
              </tr>
            </thead>
            
            <tbody className="text-sm text-slate-700">
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-semibold text-blue-500">{order.id}</td>
                  <td className="p-4">{order.start}</td>
                  <td className="p-4">{order.end}</td>
                  <td className="p-4 font-semibold">{order.driver}</td>
                  <td className="p-4 text-slate-500">{order.vehicle}</td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}