export const appTheme = {
  colors: {
    brand: {
      primary: "#4E46E5",
      primaryHover: "#4840D3",
      primaryPressed: "#423BC0",
      primarySoft: "#EDECFC",

      accent: "#A3E635",
      accentHover: "#93CF30",
      accentPressed: "#82B82A",
      accentSoft: "#F4FCE7",
    },

    bg: {
      canvas: "#F0FDFA",
      surface: "#FFFFFF",
      muted: "#E2E8F0",
    },

    text: {
      primary: "#0F172A",
      secondary: "#64748B",
      inverse: "#FFFFFF",
    },

    border: {
      default: "#E2E8F0",
    },

    status: {
      success: "#10B981",
      successSoft: "#E2F7F0",
      warning: "#F59E0B",
      warningSoft: "#FEF3E2",
      danger: "#EF4444",
      dangerSoft: "#FDE9E9",
      info: "#3B82F6",
      infoSoft: "#E7F0FE",
    },
  },
} as const;

export type AppTheme = typeof appTheme;
