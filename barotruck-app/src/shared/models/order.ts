// @/shared/models/order.

/** 오더 상태 (Order.java의 status 필드 대응) */
export type OrderStatus = 'REQUESTED' | 'ACCEPTED' | 'LOADING' | 'IN_TRANSIT' | 'UNLOADING' | 'COMPLETED' | 'CANCELLED';

/** * 오더 생성 요청 (OrderRequest.java 대응)
 */
export interface OrderRequest {
  startAddr: string;
  startPlace: string;
  startType: string;
  startSchedule: string;
  puProvince: string;
  endAddr: string;
  endPlace: string;
  endType: string;
  endSchedule: string;
  doProvince: string;
  cargoContent: string;
  loadMethod: string;
  workType: string;
  tonnage: number;
  reqCarType: string;
  reqTonnage: string;
  driveMode: string;
  basePrice: number;
  payMethod: string;
  distance: number;
  duration: number;
}

/** * 오더 상세 응답 (OrderResponse.java 대응)
 */
export interface OrderResponse {
  orderId: number;
  status: OrderStatus;
  createdAt: string; //
  
  // OrderSnapshot 대응 데이터
  startAddr: string;
  startPlace?: string;
  startType: string;
  startSchedule: string;
  endAddr: string;
  endPlace?: string;
  endType: string;
  endSchedule: string;
  
  cargoContent: string;
  reqCarType: string;
  reqTonnage: string;
  basePrice: number; //
  payMethod: string;
  distance: number;
  duration: number;
  driveMode: string;
}

export interface UserSummary {
  userId: number;
  nickname: string;
  phone: string;
  ratingAvg: number;
}

export interface CancellationSummary {
  cancelReason: string;
  cancelledAt: string;
  cancelledBy: 'USER' | 'DRIVER' | 'ADMIN';
}


/** 대시보드 데이터 모델 (차주 홈 화면용) */
export interface DriverDashboardResponse {
  monthlyExpectedIncome: number;
  incomeChangeRate: number;
  goalMessage: string;
  allocatedCount: number;
  drivingCount: number;
  pendingSettlementCount: number;
  recommendedOrders: OrderResponse[];
}