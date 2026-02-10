// src/shared/theme/ThemeProvider.tsx
import React, { createContext, useMemo, type PropsWithChildren } from "react";
import { appTheme, type AppTheme } from "./appTheme";

type ThemeContextValue = AppTheme;

export const ThemeContext = createContext<ThemeContextValue>(appTheme);

export function ThemeProvider({ children }: PropsWithChildren) {
  const value = useMemo(() => appTheme, []);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}
