import React, { useMemo, useState } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  View,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { useAppTheme } from "@/shared/hooks/useAppTheme";
import { Button } from "@/shared/ui/base/Button";
import { withAlpha } from "@/shared/utils/color";
import { useAuthStore } from "@/features/common/auth/model/authStore";

export default function DriverMoreScreen() {
  const router = useRouter();
  const t = useAppTheme();
  const c = t.colors;

  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  const [loading, setLoading] = useState(false);

  const s = useMemo(() => {
    return StyleSheet.create({
      screen: { flex: 1, backgroundColor: c.bg.surface } as ViewStyle,
      pad: { padding: 20 } as ViewStyle,

      title: { fontSize: 24, fontWeight: "900", color: c.text.primary } as TextStyle,
      sub: { marginTop: 8, fontSize: 14, fontWeight: "700", color: c.text.secondary } as TextStyle,

      card: {
        marginTop: 18,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: c.border.default,
        backgroundColor: c.bg.surface,
      } as ViewStyle,

      row: {
        paddingVertical: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      } as ViewStyle,
      rowLabel: { fontSize: 14, fontWeight: "900", color: c.text.secondary } as TextStyle,
      rowValue: { fontSize: 15, fontWeight: "900", color: c.text.primary } as TextStyle,

      divider: { height: 1, backgroundColor: withAlpha(c.border.default, 0.9), marginVertical: 12 } as ViewStyle,

      logoutBtn: {
        height: 56,
        borderRadius: 16,
        marginTop: 14,
        backgroundColor: c.status.dangerSoft,
        borderWidth: 1,
        borderColor: withAlpha(c.status.danger, 0.55),
      } as ViewStyle,
      logoutText: { fontSize: 16, fontWeight: "900", color: c.status.danger } as TextStyle,
    });
  }, [c]);

  const doLogout = async () => {
    try {
      setLoading(true);
      await signOut();
      router.dismissAll();
      router.replace("/(auth)/login");
    } finally {
      setLoading(false);
    }
  };

  const onLogout = () => {
    if (Platform.OS === "web") {
      const ok = window.confirm("정말 로그아웃할까요?");
      if (!ok) return;
      void doLogout();
      return;
    }

    Alert.alert("로그아웃", "정말 로그아웃할까요?", [
      { text: "취소", style: "cancel" },
      { text: "로그아웃", style: "destructive", onPress: () => void doLogout() },
    ]);
  };

  return (
    <SafeAreaView style={s.screen} edges={["top", "bottom"]}>
      <View style={s.pad}>
        <Text style={s.title}>더보기</Text>
        <Text style={s.sub}>내 정보/설정(목업)</Text>

        <View style={s.card}>
          <View style={s.row}>
            <Text style={s.rowLabel}>이름</Text>
            <Text style={s.rowValue}>{user?.name ?? "-"}</Text>
          </View>
          <View style={s.row}>
            <Text style={s.rowLabel}>이메일</Text>
            <Text style={s.rowValue}>{user?.email ?? "-"}</Text>
          </View>

          <View style={s.divider} />

          <Button
            title="로그아웃"
            variant="outline"
            size="lg"
            fullWidth
            loading={loading}
            onPress={onLogout}
            containerStyle={s.logoutBtn}
            textStyle={s.logoutText}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
