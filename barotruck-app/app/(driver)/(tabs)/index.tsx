import React, { useEffect, useState } from 'react';
import { Bell, MessageCircle } from 'lucide-react-native';

// React Native 기본 컴포넌트 임포트
import { View, Text, StyleSheet, ScrollView } from "react-native";
// 프로젝트 공통 UI 및 API 서비스, 타입 임포트
import { OrderCard } from '@/shared/ui/business'; // 오더 정보를 보여주는 공통 카드 컴포넌트
import { useAppTheme } from '@/shared/hooks/useAppTheme'; // 커스텀 테마 훅 (라이트/다크 모드 대응)
import { OrderService } from '@/shared/api/orderService'; // 백엔드 통신을 담당하는 서비스 객체
import { OrderResponse } from '@/shared/models/order'; // 오더 데이터의 타입 정의

export default function DriverHomeScreen() {
  // 1. 테마 및 상태 관리 설정
  const t = useAppTheme(); // 테마 객체 호출
  const c = t.colors;      // 테마의 색상 팔레트 추출
  const [orders, setOrders] = useState<OrderResponse[]>([]); // API로 받아올 오더 목록 상태

  // 2. 데이터 페칭 (컴포넌트 마운트 시 실행)
  useEffect(() => {
    // OrderController의 /api/v1/orders/recommended 엔드포인트를 호출하도록 설계된 서비스 메서드 사용
    OrderService.getRecommendedOrders()
      .then(setOrders) // 성공 시 받아온 리스트(List<OrderResponse>)를 상태에 저장
      .catch(console.error); // 에러 발생 시 콘솔 출력
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: c.bg.canvas }]}>
      
      {/* --- 상단 헤더 영역 --- */}
      <View style={styles.header}>
        <Text style={styles.logoText}>BARO</Text>
        <View style={styles.headerIcons}>
          {/* 테마의 기본 텍스트 색상을 아이콘에 적용 */}
          <MessageCircle size={24} color={c.text.primary} />
          <Bell size={24} color={c.text.primary} />
        </View>
      </View>

      {/* --- 스크롤 가능한 메인 콘텐츠 영역 --- */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* 수익 요약 카드 (현재는 정적 UI이나 추후 정산 API와 연결 가능) */}
        {/* c.brand.primary를 사용하여 앱의 브랜드 색상(보라색 등)을 배경으로 적용 */}
        <View style={[styles.incomeCard, { backgroundColor: c.brand.primary }]}>
          <Text style={styles.incomeTitle}>오늘의 목표</Text>
          <Text style={styles.incomeAmount}>안전 운행 하세요!</Text>
        </View>

        {/* --- 추천 오더 리스트 영역 --- */}
        <View style={styles.orderList}>
          {/* 받아온 orders 배열을 순회하며 OrderCard 컴포넌트로 변환 */}
          {orders.map((order) => (
            <OrderCard
              key={order.orderId} // 고유 식별자 설정
              startAddr={order.startAddr} // 상차지 주소 (OrderSnapshot 기반)
              endAddr={order.endAddr}     // 하차지 주소 (OrderSnapshot 기반)
              // 미터(m) 단위의 거리를 킬로미터(km)로 변환하여 소수점 첫째 자리까지 표시
              distance={`${(order.distance / 1000).toFixed(1)}km`} 
              // 운송료를 지역화 포맷(콤마 포함)으로 변환
              price={`${order.basePrice.toLocaleString()}원`}
              // 차량 톤수와 종류 합치기 (예: "11톤 윙바디")
              carInfo={`${order.reqTonnage} ${order.reqCarType}`}
              loadDate={order.startSchedule} // 상차 일정 정보
              payMethod={order.payMethod}     // 결제 방식 정보
              createdAt={order.createdAt}    // 오더 등록 시간
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// 스타일 정의
const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 20, 
    paddingTop: 60 // 상단 상태표시줄 영역 확보
  },
  logoText: { 
    fontSize: 22, 
    fontWeight: '900', 
    color: '#5D5FEF' // 로고의 강조 색상
  },
  headerIcons: { 
    flexDirection: 'row', 
    gap: 15 
  },
  scrollContent: { 
    padding: 20 
  },
  incomeCard: { 
    padding: 24, 
    borderRadius: 20, 
    marginBottom: 20 
  },
  incomeTitle: { 
    color: '#FFF', 
    opacity: 0.8 
  },
  incomeAmount: { 
    color: '#FFF', 
    fontSize: 24, 
    fontWeight: '800', 
    marginTop: 8 
  },
  orderList: { 
    gap: 16 // 카드 사이의 간격 설정
  }
});
