// app/_layout.tsx
import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { ThemeProvider } from "@/shared/theme/ThemeProvider";
import { ToastProvider } from "@/shared/ui";
import { useAuthStore } from "@/features/common/auth/model/authStore";

export default function RootLayout() {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <ThemeProvider>
      <ToastProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </ToastProvider>
    </ThemeProvider>
  );
}
