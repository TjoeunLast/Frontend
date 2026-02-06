// app/index.tsx
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import { useAppTheme } from "@/shared/hooks/useAppTheme";
import { useAuthStore } from "@/features/common/auth/model/authStore";

export default function Index() {
  const t = useAppTheme();
  const c = t.colors;

  const user = useAuthStore((s) => s.user);

  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setReady(true), 400);
    return () => clearTimeout(id);
  }, []);

  // 0.4초 스플래시
  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: c.bg.canvas,
        }}
      >
        <ActivityIndicator size="large" color={c.brand.primary} />
      </View>
    );
  }

  // 로그인 안 됨 → auth로
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  // role에 따라 분기
  const role = (user as any).role; // 타입 아직 없으면 임시로
  if (role === "DRIVER") {
    return <Redirect href="/(driver)/(tabs)" />;
  }
  // 기본: 화주
  return <Redirect href="/(shipper)/(tabs)" />;
}
