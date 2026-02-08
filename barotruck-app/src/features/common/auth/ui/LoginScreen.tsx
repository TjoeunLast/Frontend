// srv/festures/commen/Loginscrean.tsx
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useAppTheme } from "@/shared/hooks/useAppTheme";
import { TextField } from "@/shared/ui/form/TextField";
import { Button } from "@/shared/ui/base/Button";
import { withAlpha } from "@/shared/utils/color";

import { useAuthStore } from "@/features/common/auth/model/authStore";

const ROUTES = {
  signup: "/(auth)/signup" as const,
  resetPw: "/(auth)/reset-password" as const,
  shipperTabs: "/(shipper)/(tabs)" as const,
  driverTabs: "/(driver)/(tabs)" as const,
};

const MOCK = {
  shipper: { email: "shipper@barotruck.com", password: "12341234", name: "바로화주", role: "SHIPPER" as const },
  driver: { email: "driver@barotruck.com", password: "12341234", name: "바로기사", role: "DRIVER" as const },
};

export default function LoginScreen() {
  const router = useRouter();
  const t = useAppTheme();
  const c = t.colors;

  const signIn = useAuthStore((s) => s.signIn);
  const signUp = useAuthStore((s) => s.signUp);

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [autoLogin, setAutoLogin] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canLogin = email.trim().length > 0 && pw.trim().length > 0 && !submitting;

  const showError = (msg: string) => {
    if (Platform.OS === "web") window.alert(msg);
    else Alert.alert("로그인 실패", msg);
  };

  const goByRole = (role: "DRIVER" | "SHIPPER") => {
    router.dismissAll();
    router.replace(role === "DRIVER" ? ROUTES.driverTabs : ROUTES.shipperTabs);
  };

  const onLogin = async () => {
    if (!canLogin) return;
    try {
      setSubmitting(true);
      const user = await signIn({ email: email.trim(), password: pw, remember: autoLogin });
      goByRole(user.role);
    } catch (e: any) {
      showError(e?.message ?? "로그인에 실패했어요.");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ 목업 유저가 없다면 심고(signUp) → 로그인(signIn)
  const onMockLogin = async (kind: "shipper" | "driver") => {
    try {
      setSubmitting(true);

      const u = kind === "shipper" ? MOCK.shipper : MOCK.driver;

      // 1) 일단 signIn 시도
      try {
        const user = await signIn({ email: u.email, password: u.password, remember: true });
        goByRole(user.role);
        return;
      } catch {
        // 2) 없으면 signUp으로 계정 생성 후 signIn
        await signUp({
          email: u.email,
          password: u.password,
          name: u.name,
          role: u.role,
          remember: true,
        });
        const user = await signIn({ email: u.email, password: u.password, remember: true });
        goByRole(user.role);
      }
    } catch (e: any) {
      showError(e?.message ?? "목업 로그인에 실패했어요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[s.screen, { backgroundColor: c.bg.surface }]} edges={["top", "bottom"]}>
      <KeyboardAvoidingView behavior={Platform.select({ ios: "padding", android: undefined })} style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={s.content}
        >
          <View style={s.container}>
            <View style={s.brandWrap}>
              <Text style={[s.brandTitle, { color: c.brand.primary }]}>Baro Truck</Text>
              <Text style={[s.brandSubtitle, { color: c.text.secondary }]}>
                빠르고 간편한 화물 배차의 시작
              </Text>
            </View>

            {/* ✅ 목업 빠른 로그인 */}
            <View style={s.mockRow}>
              <Pressable
                onPress={() => onMockLogin("shipper")}
                style={({ pressed }) => [
                  s.mockBtn,
                  {
                    backgroundColor: pressed ? withAlpha(c.brand.primarySoft, 0.7) : c.brand.primarySoft,
                    borderColor: c.border.default,
                  },
                ]}
              >
                <Text style={[s.mockText, { color: c.text.primary }]}>화주로 체험 로그인</Text>
              </Pressable>

              <View style={{ width: 10 }} />

              <Pressable
                onPress={() => onMockLogin("driver")}
                style={({ pressed }) => [
                  s.mockBtn,
                  {
                    backgroundColor: pressed ? withAlpha(c.brand.accentSoft, 0.7) : c.brand.accentSoft,
                    borderColor: c.border.default,
                  },
                ]}
              >
                <Text style={[s.mockText, { color: c.text.primary }]}>차주로 체험 로그인</Text>
              </Pressable>
            </View>

            <View style={{ height: 14 }} />

            <TextField
              value={email}
              onChangeText={setEmail}
              placeholder="이메일"
              keyboardType="email-address"
              autoCapitalize="none"
              inputWrapStyle={[
                s.inputWrap,
                { backgroundColor: c.bg.surface, borderColor: c.border.default },
              ]}
              inputStyle={s.tfInput}
            />

            <View style={{ height: 12 }} />

            <TextField
              value={pw}
              onChangeText={setPw}
              placeholder="비밀번호"
              secureTextEntry
              autoCapitalize="none"
              inputWrapStyle={[
                s.inputWrap,
                { backgroundColor: c.bg.surface, borderColor: c.border.default },
              ]}
              inputStyle={s.tfInput}
            />

            <View style={s.row}>
              <Pressable onPress={() => setAutoLogin((v) => !v)} style={s.checkboxRow} hitSlop={10}>
                <View style={[s.checkboxBox, { borderColor: c.border.default }]}>
                  {autoLogin ? <Ionicons name="checkmark" size={16} color={c.brand.primary} /> : null}
                </View>
                <Text style={[s.checkboxLabel, { color: c.text.primary }]}>자동 로그인</Text>
              </Pressable>

              <Pressable onPress={() => router.push(ROUTES.resetPw)} hitSlop={10}>
                <Text style={[s.link, { color: c.text.secondary }]}>비밀번호 찾기</Text>
              </Pressable>
            </View>

            <Button
              title={submitting ? "로그인 중..." : "로그인"}
              variant="primary"
              size="lg"
              fullWidth
              disabled={!canLogin}
              loading={submitting}
              onPress={onLogin}
              style={{
                height: 64,
                borderRadius: 18,
                shadowColor: withAlpha(c.brand.primary, 0.25),
                shadowOpacity: 1,
                shadowRadius: 14,
                shadowOffset: { width: 0, height: 8 },
                elevation: 5,
              }}
            />

            <View style={s.bottom}>
              <Text style={[s.bottomText, { color: c.text.secondary }]}>아직 계정이 없으신가요?</Text>
              <Pressable onPress={() => router.push(ROUTES.signup)} hitSlop={10}>
                <Text style={[s.bottomLink, { color: c.brand.primary }]}>회원가입</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 44,
    paddingBottom: 28,
    alignItems: "center",
  },
  container: { width: "100%", maxWidth: 520 },

  brandWrap: { alignItems: "center", marginTop: 16, marginBottom: 18 },
  brandTitle: { fontSize: 42, fontWeight: "900", letterSpacing: -0.4 },
  brandSubtitle: { marginTop: 10, fontSize: 16, fontWeight: "700" },

  mockRow: { flexDirection: "row", width: "100%" },
  mockBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  mockText: { fontSize: 14, fontWeight: "900" },

  inputWrap: {
    borderRadius: 18,
    paddingHorizontal: 18,
    minHeight: 60,
    borderWidth: 1,
  },
  tfInput: { fontSize: 18, fontWeight: "800", paddingVertical: 0 },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 18,
  },
  checkboxRow: { flexDirection: "row", alignItems: "center" },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  checkboxLabel: { fontSize: 16, fontWeight: "700" },
  link: { fontSize: 16, fontWeight: "700", textDecorationLine: "underline" },

  bottom: {
    marginTop: 22,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomText: { fontSize: 16, fontWeight: "700" },
  bottomLink: { marginLeft: 10, fontSize: 16, fontWeight: "900", textDecorationLine: "underline" },
});
