// app/(auth)/login.tsx
import React, { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type TextStyle,
  type ViewStyle,
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

// ✅ 목업 계정(원하는 값으로 바꿔도 됨)
const MOCK = {
  shipper: {
    email: "shipper@barotruck.dev",
    password: "12341234",
    name: "목업 화주",
    shipper: {
      type: "personal" as const,
      nickname: "바로화주",
      bizNo: "",
      companyName: "",
      ceoName: "",
    },
  },
  driver: {
    email: "driver@barotruck.dev",
    password: "12341234",
    name: "목업 차주",
    driver: {
      nickname: "바로차주",
      carNo: "80바 1234",
      vehicleType: "cargo" as const,
      ton: "1t" as const,
      careerYears: "3",
    },
  },
};

export default function LoginScreen() {
  const router = useRouter();
  const t = useAppTheme();
  const c = t.colors;

  const signIn = useAuthStore((s) => s.signIn);
  const signUp = useAuthStore((s) => s.signUp);

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [autoLogin, setAutoLogin] = useState(true); // ✅ 기본 ON (원하면 false로)
  const [submitting, setSubmitting] = useState(false);

  const canLogin = email.trim().length > 0 && pw.trim().length > 0 && !submitting;

  const styles = useMemo(() => {
    return StyleSheet.create({
      screen: { flex: 1, backgroundColor: c.bg.surface } as ViewStyle,
      content: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingTop: 44,
        paddingBottom: 28,
        alignItems: "center",
      } as ViewStyle,
      container: { width: "100%", maxWidth: 520 } as ViewStyle,

      brandWrap: { alignItems: "center", marginTop: 16, marginBottom: 16 } as ViewStyle,
      brandTitle: { fontSize: 42, fontWeight: "900", letterSpacing: -0.4, color: c.brand.primary } as TextStyle,
      brandSubtitle: { marginTop: 10, fontSize: 16, fontWeight: "700", color: c.text.secondary } as TextStyle,

      // ✅ 목업 로그인 버튼 영역
      mockRow: { flexDirection: "row", gap: 10, marginTop: 6, marginBottom: 18 } as any,
      mockBtn: {
        flex: 1,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: c.border.default,
        backgroundColor: c.bg.canvas,
        paddingVertical: 12,
        paddingHorizontal: 14,
      } as ViewStyle,
      mockBtnTitle: { fontSize: 14, fontWeight: "900", color: c.text.primary } as TextStyle,
      mockBtnDesc: { marginTop: 6, fontSize: 12, fontWeight: "800", color: c.text.secondary } as TextStyle,

      inputWrap: {
        borderRadius: 18,
        paddingHorizontal: 18,
        minHeight: 60,
        borderWidth: 1,
        borderColor: c.border.default,
        backgroundColor: c.bg.surface,
      } as ViewStyle,
      tfInput: { fontSize: 18, fontWeight: "800", paddingVertical: 0 } as TextStyle,

      row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 12,
        marginBottom: 18,
      } as ViewStyle,

      checkboxRow: { flexDirection: "row", alignItems: "center" } as ViewStyle,
      checkboxBox: {
        width: 22,
        height: 22,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: c.border.default,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
      } as ViewStyle,
      checkboxLabel: { fontSize: 16, fontWeight: "700", color: c.text.primary } as TextStyle,

      link: { fontSize: 16, fontWeight: "700", textDecorationLine: "underline", color: c.text.secondary } as TextStyle,

      loginBtn: {
        height: 64,
        borderRadius: 18,
        shadowColor: withAlpha(c.brand.primary, 0.25),
        shadowOpacity: 1,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 8 },
        elevation: 5,
      } as ViewStyle,

      bottom: {
        marginTop: 22,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      } as ViewStyle,
      bottomText: { fontSize: 16, fontWeight: "700", color: c.text.secondary } as TextStyle,
      bottomLink: { marginLeft: 10, fontSize: 16, fontWeight: "900", textDecorationLine: "underline", color: c.brand.primary } as TextStyle,
    });
  }, [c]);

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

  // ✅ 목업 로그인: 없으면 자동 회원가입 → 로그인
  const loginAsMock = async (who: "shipper" | "driver") => {
    if (submitting) return;

    const payload = who === "shipper" ? MOCK.shipper : MOCK.driver;
    const role = who === "shipper" ? "SHIPPER" : "DRIVER";

    // 입력칸도 같이 채워주기(눈으로 보이게)
    setEmail(payload.email);
    setPw(payload.password);

    try {
      setSubmitting(true);

      // 1) 일단 로그인 시도
      try {
        const user = await signIn({
          email: payload.email,
          password: payload.password,
          remember: true, // ✅ 목업은 항상 자동로그인
        });
        goByRole(user.role);
        return;
      } catch {
        // 로그인 실패면 가입 안됐을 확률 → 아래에서 signUp
      }

      // 2) 가입(없으면 생성)
      const newUser = await signUp({
        email: payload.email,
        password: payload.password,
        name: payload.name,
        role,
        shipper: who === "shipper" ? (payload as any).shipper : undefined,
        driver: who === "driver" ? (payload as any).driver : undefined,
        remember: true, // ✅ 가입 후 자동로그인
      });

      goByRole(newUser.role);
    } catch (e: any) {
      showError(e?.message ?? "목업 로그인에 실패했어요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <KeyboardAvoidingView behavior={Platform.select({ ios: "padding", android: undefined })} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
          <View style={styles.container}>
            <View style={styles.brandWrap}>
              <Text style={styles.brandTitle}>Baro Truck</Text>
              <Text style={styles.brandSubtitle}>빠르고 간편한 화물 배차의 시작</Text>
            </View>

            {/* ✅ 목업 로그인 버튼 2개 */}
            <View style={styles.mockRow}>
              <Pressable
                onPress={() => loginAsMock("shipper")}
                style={({ pressed }) => [
                  styles.mockBtn,
                  pressed && { opacity: 0.9, backgroundColor: withAlpha(c.brand.primarySoft, 0.8) },
                ]}
                hitSlop={10}
              >
                <Text style={styles.mockBtnTitle}>목업 화주로 로그인</Text>
                <Text style={styles.mockBtnDesc}>계정 없으면 자동 생성</Text>
              </Pressable>

              <Pressable
                onPress={() => loginAsMock("driver")}
                style={({ pressed }) => [
                  styles.mockBtn,
                  pressed && { opacity: 0.9, backgroundColor: withAlpha(c.brand.accentSoft, 0.9) },
                ]}
                hitSlop={10}
              >
                <Text style={styles.mockBtnTitle}>목업 차주로 로그인</Text>
                <Text style={styles.mockBtnDesc}>계정 없으면 자동 생성</Text>
              </Pressable>
            </View>

            <TextField
              value={email}
              onChangeText={setEmail}
              placeholder="이메일"
              keyboardType="email-address"
              autoCapitalize="none"
              inputWrapStyle={styles.inputWrap}
              inputStyle={styles.tfInput}
            />

            <View style={{ height: 12 }} />

            <TextField
              value={pw}
              onChangeText={setPw}
              placeholder="비밀번호"
              secureTextEntry
              autoCapitalize="none"
              inputWrapStyle={styles.inputWrap}
              inputStyle={styles.tfInput}
            />

            <View style={styles.row}>
              <Pressable onPress={() => setAutoLogin((v) => !v)} style={styles.checkboxRow} hitSlop={10}>
                <View style={styles.checkboxBox}>
                  {autoLogin ? <Ionicons name="checkmark" size={16} color={c.brand.primary} /> : null}
                </View>
                <Text style={styles.checkboxLabel}>자동 로그인</Text>
              </Pressable>

              <Pressable onPress={() => router.push(ROUTES.resetPw)} hitSlop={10}>
                <Text style={styles.link}>비밀번호 찾기</Text>
              </Pressable>
            </View>

            <Button
              title={submitting ? "로그인 중..." : "로그인"}
              variant="primary"
              size="lg"
              fullWidth
              disabled={!canLogin}
              onPress={onLogin}
              style={styles.loginBtn}
            />

            <View style={styles.bottom}>
              <Text style={styles.bottomText}>아직 계정이 없으신가요?</Text>
              <Pressable onPress={() => router.push(ROUTES.signup)} hitSlop={10}>
                <Text style={styles.bottomLink}>회원가입</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
