// app/global/users/user_page.tsx
"use client";

import { useState } from "react";
import Link from 'next/link';

export default function User_Page() {
    const [users, setUsers] = useState([
        { id: 1, name: "오시온", role: "차주", type: "11톤 윙바디", status: "승인대기", date: "2026.02.04", contact: "010-1234-5678" },
        { id: 2, name: "김민정", role: "화주", type: "(주)세븐틴물류", status: "정상", date: "2026.02.01", contact: "010-9876-5432" },
        { id: 3, name: "김대영", role: "차주", type: "1톤 탑차", status: "정상", date: "2026.01.28", contact: "010-5555-4444" },
        { id: 4, name: "박재민", role: "차주", type: "5톤 카고", status: "정지", date: "2026.01.15", contact: "010-2222-3333" },
        { id: 5, name: "유지민", role: "차주", type: "11톤 카고", status: "승인대기", date: "2026.01.08", contact: "010-6798-2266" },
        { id: 6, name: "노윤아", role: "화주", type: "(주)위시운송", status: "정상", date: "2026.02.02", contact: "010-3579-9876" }
    ]);

    return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">👥 회원 자격 관리</h1>
          <p className="text-sm text-slate-500 mt-1">차주 및 화주의 가입 승인과 권한을 관리합니다.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">엑셀 다운로드</button>
        </div>
      </div>

      {/* 요약 현황 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">신규 승인 대기</p>
          <p className="text-2xl font-black text-orange-500 mt-1">12명</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">전체 차주</p>
          <p className="text-2xl font-black text-slate-800 mt-1 shadow-blue-50">1,240명</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">전체 화주</p>
          <p className="text-2xl font-black text-slate-800 mt-1">350사</p>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-4 items-center">
        <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500">
          <option>전체 회원</option>
          <option>차주</option>
          <option>화주</option>
        </select>
        <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500">
          <option>모든 상태</option>
          <option>승인대기</option>
          <option>정상</option>
          <option>정지</option>
        </select>
        <input 
          type="text" 
          placeholder="이름, 연락처, 회사명 검색" 
          className="flex-1 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-500"
        />
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-100">검색</button>
      </div>

      {/* 회원 리스트 테이블 */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-xs font-bold text-slate-500 text-center uppercase tracking-wider">구분</th>
              <th className="p-4 text-xs font-bold text-slate-500 text-center uppercase tracking-wider">이름/업체명</th>
              <th className="p-4 text-xs font-bold text-slate-500 text-center uppercase tracking-wider">연락처</th>
              <th className="p-4 text-xs font-bold text-slate-500 text-center uppercase tracking-wider">차량/정보</th>
              <th className="p-4 text-xs font-bold text-slate-500 text-center uppercase tracking-wider">가입일</th>
              <th className="p-4 text-xs font-bold text-slate-500 text-center uppercase tracking-wider text-center">상태</th>
              <th className="p-4 text-xs font-bold text-slate-500 text-center uppercase tracking-wider text-center">관리</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {users.map((user) => (
              <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="p-4 text-center">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${user.role === '차주' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4 text-slate-500 text-center">{user.name}</td>
                <td className="p-4 text-slate-500 text-center">{user.contact}</td>
                <td className="p-4 text-slate-500 text-center">{user.type}</td>
                <td className="p-4 text-slate-400 text-center">{user.date}</td>
                <td className="p-4 text-center text-center">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${
                    user.status === '정상' ? 'bg-green-50 text-green-600 border-green-100' : 
                    user.status === '승인대기' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                    'bg-red-50 text-red-600 border-red-100'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="p-4 text-center text-center">
                  <Link href={`/global/users/${user.id}`} className="font-bold text-[#0143f8] hover:text-blue-600 hover:underline">
                    상세보기
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}