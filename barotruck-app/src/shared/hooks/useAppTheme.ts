import { useContext } from "react";
import { ThemeContext } from "@/shared/theme/ThemeProvider";

export function useAppTheme() {
  return useContext(ThemeContext);
}
