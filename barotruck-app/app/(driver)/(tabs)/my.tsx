import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Bell, MessageCircle } from 'lucide-react-native';

// 프로젝트 공통 컴포넌트 및 서비스 임포트
// 경로 별칭(@) 설정 에러 방지를 위해 상대 경로 또는 정확한 alias 사용 확인 필요
import { OrderCard } from '@/shared/ui/business'; //
import { useAppTheme } from '@/shared/hooks/useAppTheme'; //
import { OrderService } from '@/shared/api/orderService'; //
import { OrderResponse } from '@/shared/models/order'; //

/**
 * 마이페이지 탭에서도 홈 화면과 동일한 추천 오더 목록을 보여줍니다.
 */
export default function MyScreen() {
  const t = useAppTheme(); //
  const c = t.colors;      //
  const [orders, setOrders] = useState<OrderResponse[]>([]); //

  useEffect(() => {
    // 추천 오더 데이터를 API로부터 직접 호출하여 상태 업데이트
    OrderService.getAvailableOrders()
      .then(setOrders)
      .catch(console.error);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: c.bg.canvas }]}>
      {/* 상단 헤더 영역 */}
      <View style={styles.header}>
        <Text style={styles.logoText}>MY BARO</Text>
        <View style={styles.headerIcons}>
          <MessageCircle size={24} color={c.text.primary} />
          <Bell size={24} color={c.text.primary} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 마이페이지 섹션 강조 UI */}
        <View style={[styles.infoCard, { backgroundColor: c.brand.primary }]}>
          <Text style={styles.infoTitle}>내 활동 요약</Text>
          <Text style={styles.infoAmount}>운행 준비 완료!</Text>
        </View>

        {/* 홈 화면과 동일한 추천 오더 리스트 렌더링 */}
        <View style={styles.orderList}>
          {orders.map((order) => (
            <OrderCard
              key={order.orderId}
              startAddr={order.startAddr}
              endAddr={order.endAddr}
              distance={`${(order.distance / 1000).toFixed(1)}km`}
              price={`${order.basePrice.toLocaleString()}원`}
              carInfo={`${order.reqTonnage} ${order.reqCarType}`}
              loadDate={order.startSchedule}
              payMethod={order.payMethod} //
              createdAt={order.createdAt}  //
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 20, 
    paddingTop: 60 
  },
  logoText: { 
    fontSize: 22, 
    fontWeight: '900', 
    color: '#5D5FEF' 
  },
  headerIcons: { 
    flexDirection: 'row', 
    gap: 15 
  },
  scrollContent: { 
    padding: 20 
  },
  infoCard: { 
    padding: 24, 
    borderRadius: 20, 
    marginBottom: 20 
  },
  infoTitle: { 
    color: '#FFF', 
    opacity: 0.8 
  },
  infoAmount: { 
    color: '#FFF', 
    fontSize: 24, 
    fontWeight: '800', 
    marginTop: 8 
  },
  orderList: { 
    gap: 16 
  }
});