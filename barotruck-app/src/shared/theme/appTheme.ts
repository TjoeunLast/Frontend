export const appTheme = {
  colors: {
    // 1. 브랜드 및 상태 컬러
    brand: {
      primary: "#4E46E5",
      primaryHover: "#4338CA",
      primaryPressed: "#3730A3",
      primarySoft: "#EDECFC",

      accent: "#A3E635",
      accentHover: "#84CC16",
      accentPressed: "#65A30D",
      accentSoft: "#F4FCE7",
    },
    status: {
      success: "#10B981",
      successPressed: "#059669",
      successSoft: "#DCFCE7",

      warning: "#F59E0B",
      warningPressed: "#D97706",
      warningSoft: "#FEF3E2",

      danger: "#EF4444",
      dangerPressed: "#DC2626",
      dangerSoft: "#FEF2F2",

      info: "#3B82F6",
      infoPressed: "#2563EB",
      infoSoft: "#EFF6FF",
    },

    // 2. 배경 및 텍스트
    bg: {
      canvas: "#F8FAFC",
      surface: "#FFFFFF",
      muted: "#F1F5F9",
    },
    text: {
      primary: "#0F172A",
      secondary: "#64748B",
      inverse: "#FFFFFF",
    },

    // 3. 배지(Badge)
    badge: {
      // 그룹 A: 배차 상태
      dispatch: {
        requestBg: "#EEF2FF", // 배차 신청
        requestText: "#4E46E5",
        ongoingBg: "#F4FCE7", // 배차/운행중
        ongoingText: "#166534",
        completeBg: "#F1F5F9", // 배차 완료
        completeText: "#64748B",
        cancelBg: "#FEF2F2", // 취소
        cancelText: "#DC2626",
      },

      // 그룹 B: 오더 특성
      type: {
        instantBg: "#EF4444", // 바로배차
        instantText: "#FFFFFF",
        directBg: "#4E46E5", // 직접배차
        directText: "#FFFFFF",
        recommendBg: "#111827", // 추천오더
        recommendText: "#F3F4F6",
      },
    },

    border: {
      default: "#E2E8F0",
    },
  },
} as const;

export type AppTheme = typeof appTheme;
