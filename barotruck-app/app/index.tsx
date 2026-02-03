import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { useAppTheme } from "@/shared/hooks/useAppTheme";

export default function Index() {
  const t = useAppTheme();
  const c = t.colors;

  return (
    <View style={[s.wrap, { backgroundColor: c.bg.canvas }]}>
      <Text style={[s.title, { color: c.text.primary }]}>BaroTruck</Text>
      <Text style={[s.sub, { color: c.text.secondary }]}>라우팅 정상 ✅</Text>

      <View style={{ height: 12 }} />

      <Link href="/(driver)/(tabs)" style={[s.link, { color: c.brand.primary }]}>
        차주 탭으로
      </Link>
      <Link href="/(shipper)/(tabs)" style={[s.link, { color: c.brand.primary }]}>
        화주 탭으로
      </Link>
      <Link href="/(auth)/login" style={[s.link, { color: c.brand.primary }]}>
        로그인으로
      </Link>
      <Link href="/ui-preview" style={[s.link, { color: c.brand.primary }]}>
        UI 프리뷰로
      </Link>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  title: { fontSize: 28, fontWeight: "900" },
  sub: { marginTop: 8, fontSize: 14, fontWeight: "700" },
  link: { marginTop: 10, fontSize: 16, fontWeight: "800" },
});
