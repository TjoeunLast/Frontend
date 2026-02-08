// app/index.tsx
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import { useAppTheme } from "@/shared/hooks/useAppTheme";
import { useAuthStore } from "@/features/common/auth/model/authStore";

export default function Index() {
  const t = useAppTheme();
  const c = t.colors;

  const hydrate = useAuthStore((s) => s.hydrate);
  const user = useAuthStore((s) => s.user);

  const [ready, setReady] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let alive = true;

    // ✅ 세션 로드 (자동로그인)
    hydrate()
      .catch(() => {})
      .finally(() => {
        if (alive) setHydrated(true);
      });

    // ✅ 스플래시 2.5초
    const id = setTimeout(() => {
      if (alive) setReady(true);
    }, 2500);

    return () => {
      alive = false;
      clearTimeout(id);
    };
  }, [hydrate]);

  if (!ready || !hydrated) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: c.bg.canvas,
        }}
      >
        {/* 나중에 로고 이미지로 교체 */}
        <ActivityIndicator size="large" color={c.brand.primary} />
      </View>
    );
  }

  // ✅ 자동로그인 세션 있으면 홈으로
  if (user) {
    return <Redirect href={user.role === "DRIVER" ? "/(driver)/(tabs)" : "/(shipper)/(tabs)"} />;
  }

  // ✅ 없으면 로그인
  return <Redirect href="/(auth)/login" />;
}
