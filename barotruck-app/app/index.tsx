// app/index.tsx
import React, { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View, type TextStyle, type ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useAppTheme } from "@/shared/hooks/useAppTheme";
import { Button } from "@/shared/ui/base/Button";
import { withAlpha } from "@/shared/utils/color";
import { useAuthStore } from "@/features/common/auth/model/authStore";

export default function Index() {
  const router = useRouter();
  const t = useAppTheme();
  const c = t.colors;

  const user = useAuthStore((s) => s.user);
  const [ready, setReady] = useState(true); // 필요하면 스플래시 쓰고 싶을 때 false로 시작해서 setTimeout 걸어도 됨

  const s = useMemo(() => {
    return StyleSheet.create({
      screen: { flex: 1, backgroundColor: c.bg.canvas } as ViewStyle,
      container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 24,
        alignItems: "center",
        justifyContent: "center",
      } as ViewStyle,
      card: {
        width: "100%",
        maxWidth: 520,
        borderRadius: 22,
        backgroundColor: c.bg.surface,
        borderWidth: 1,
        borderColor: c.border.default,
        padding: 18,
        shadowColor: withAlpha("#000000", 0.06),
        shadowOpacity: 1,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 8 },
        elevation: 2,
      } as ViewStyle,

      brandWrap: { alignItems: "center", marginBottom: 18 } as ViewStyle,
      brandTitle: { fontSize: 40, fontWeight: "900", letterSpacing: -0.4, color: c.brand.primary } as TextStyle,
      brandSub: { marginTop: 10, fontSize: 14, fontWeight: "800", color: c.text.secondary } as TextStyle,

      sectionTitle: { fontSize: 16, fontWeight: "900", color: c.text.primary, marginBottom: 12 } as TextStyle,

      option: {
        borderRadius: 18,
        borderWidth: 1,
        borderColor: c.border.default,
        backgroundColor: c.bg.surface,
        paddingVertical: 16,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
      } as ViewStyle,
      optionPressed: { backgroundColor: c.brand.primarySoft } as ViewStyle,
      optionIcon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: c.border.default,
        backgroundColor: c.bg.surface,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 14,
      } as ViewStyle,
      optionTextWrap: { flex: 1 } as ViewStyle,
      optionTitle: { fontSize: 18, fontWeight: "900", color: c.text.primary } as TextStyle,
      optionDesc: { marginTop: 6, fontSize: 13, fontWeight: "800", color: c.text.secondary } as TextStyle,

      gap: { height: 12 } as ViewStyle,

      // 버튼(공통)
      btn: {
        height: 62,
        borderRadius: 18,
        width: "100%",
      } as ViewStyle,
      btn2: {
        height: 62,
        borderRadius: 18,
        width: "100%",
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: c.border.default,
      } as ViewStyle,

      hint: { marginTop: 14, fontSize: 12, fontWeight: "800", color: c.text.secondary, textAlign: "center" } as TextStyle,
    });
  }, [c]);

  if (!ready) {
    return (
      <View style={[{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: c.bg.canvas }]}>
        <ActivityIndicator size="large" color={c.brand.primary} />
      </View>
    );
  }

  const goHomeByRole = () => {
    const role = (user as any)?.role;
    router.dismissAll();
    router.replace(role === "DRIVER" ? "/(driver)/(tabs)" : "/(shipper)/(tabs)");
  };

  return (
    <SafeAreaView style={s.screen} edges={["top", "bottom"]}>
      <View style={s.container}>
        <View style={s.card}>
          <View style={s.brandWrap}>
            <Text style={s.brandTitle}>Baro Truck</Text>
            <Text style={s.brandSub}>빠르고 간편한 화물 배차의 시작</Text>
          </View>

          <Text style={s.sectionTitle}>어디로 들어갈까요?</Text>

          <Pressable
            onPress={() => router.push("/(auth)/login")}
            style={({ pressed }) => [s.option, pressed && s.optionPressed]}
            hitSlop={10}
          >
            <View style={s.optionIcon}>
              <Ionicons name="log-in-outline" size={22} color={c.text.primary} />
            </View>
            <View style={s.optionTextWrap}>
              <Text style={s.optionTitle}>로그인</Text>
              <Text style={s.optionDesc}>계정으로 로그인해서 서비스 이용</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={c.text.secondary} />
          </Pressable>

          <View style={s.gap} />

          <Pressable
            onPress={() => router.push("/ui-preview")}
            style={({ pressed }) => [s.option, pressed && s.optionPressed]}
            hitSlop={10}
          >
            <View style={s.optionIcon}>
              <Ionicons name="color-palette-outline" size={22} color={c.text.primary} />
            </View>
            <View style={s.optionTextWrap}>
              <Text style={s.optionTitle}>UI Preview</Text>
              <Text style={s.optionDesc}>기본 컴포넌트/화면 미리보기</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={c.text.secondary} />
          </Pressable>

          {/* ✅ 이미 로그인 돼 있으면 “내 홈으로” 버튼도 제공 */}
          {user ? (
            <>
              <View style={{ height: 16 }} />
              <Button title="내 홈으로" variant="primary" size="lg" fullWidth onPress={goHomeByRole} style={s.btn} />
            </>
          ) : null}

          <Text style={s.hint}>
            개발 중에는 UI Preview로 먼저 들어가서 화면/토큰 확인하는 게 편해요.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
