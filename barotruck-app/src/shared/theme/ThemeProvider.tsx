import React, { createContext, useMemo, type PropsWithChildren } from "react";
import { appTheme, type AppTheme } from "./appTheme";

export const ThemeContext = createContext<AppTheme>(appTheme);

export function ThemeProvider({ children }: PropsWithChildren) {
  // 나중에 다크모드, 유저 설정 붙일 때 여기서 theme 바꿔주면 됨
  const value = useMemo(() => appTheme, []);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
