// src/shared/theme/ThemeProvider.tsx
import React, { createContext, useMemo, type PropsWithChildren } from "react";
import { appTheme, type AppTheme } from "./appTheme";

type ThemeContextValue = AppTheme;

export const ThemeContext = createContext<ThemeContextValue>(appTheme);

export function ThemeProvider({ children }: PropsWithChildren) {
  // 추후 다크모드/토큰 확장 대비해서 useMemo만 유지
  const theme = useMemo(() => appTheme, []);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}
