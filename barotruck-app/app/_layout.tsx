import React from "react";
import { Stack } from "expo-router";

import { ThemeProvider } from "@/shared/theme/ThemeProvider";
import { ToastProvider } from "@/shared/ui"; 

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </ToastProvider>
    </ThemeProvider>
  );
}
