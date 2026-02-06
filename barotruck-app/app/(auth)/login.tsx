import React, { useState } from "react";
import {
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

// ✅ role 읽어와서 분기
import { useSignupStore, type SignupState } from "@/features/common/auth/model/signupStore";

const ROUTES = {
  signup: "/(auth)/signup" as const,
  resetPw: "/(auth)/reset-password" as const,
  shipperTabs: "/(shipper)/(tabs)" as const,
  driverTabs: "/(driver)/(tabs)" as const,
};

export default function LoginScreen() {
  const router = useRouter();
  const t = useAppTheme();
  const c = t.colors;

  const role = useSignupStore((s: SignupState) => s.role);

  const [phone, setPhone] = useState("");
  const [pw, setPw] = useState("");
  const [autoLogin, setAutoLogin] = useState(false);

  const onLogin = () => {
    // ✅ 목업 로그인: role에 따라 이동
    if (role === "driver") {
      router.replace(ROUTES.driverTabs);
      return;
    }
    router.replace(ROUTES.shipperTabs);
  };

  const onKakao = () => {
    // TODO: 카카오 OAuth 연결
  };

  return (
    <SafeAreaView style={[s.screen, { backgroundColor: c.bg.surface }]} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={s.content}
        >
          {/* 로고/카피 */}
          <View style={s.brandWrap}>
            <Text style={[s.brandTitle, { color: c.brand.primary }]}>Baro Truck</Text>
            <Text style={[s.brandSubtitle, { color: c.text.secondary }]}>
              빠르고 간편한 화물 배차의 시작
            </Text>
          </View>

          {/* 입력 */}
          <TextField
            value={phone}
            onChangeText={setPhone}
            placeholder="아이디 (휴대폰 번호)"
            keyboardType="phone-pad"
            autoCapitalize="none"
            inputWrapStyle={[
              s.tfWrap,
              {
                borderRadius: 18,
                paddingHorizontal: 18,
                minHeight: 72,
                backgroundColor: c.bg.surface,
                borderWidth: 1,
                borderColor: c.border.default,
              },
            ]}
            inputStyle={s.tfInput}
          />

          <View style={{ height: 14 }} />

          <TextField
            value={pw}
            onChangeText={setPw}
            placeholder="비밀번호"
            secureTextEntry
            autoCapitalize="none"
            inputWrapStyle={[
              s.tfWrap,
              {
                borderRadius: 18,
                paddingHorizontal: 18,
                minHeight: 72,
                backgroundColor: c.bg.surface,
                borderWidth: 1,
                borderColor: c.border.default,
              },
            ]}
            inputStyle={s.tfInput}
          />

          {/* 옵션 row */}
          <View style={s.row}>
            <Pressable onPress={() => setAutoLogin((v) => !v)} style={s.checkboxRow} hitSlop={10}>
              <View style={[s.checkboxBox, { borderColor: c.border.default }]}>
                {autoLogin ? (
                  <Ionicons name="checkmark" size={16} color={c.brand.primary} />
                ) : null}
              </View>
              <Text style={[s.checkboxLabel, { color: c.text.primary }]}>자동 로그인</Text>
            </Pressable>

            <Pressable onPress={() => router.push(ROUTES.resetPw)} hitSlop={10}>
              <Text style={[s.link, { color: c.text.secondary }]}>비밀번호 찾기</Text>
            </Pressable>
          </View>

          {/* 로그인 버튼 */}
          <Button
            title="로그인"
            variant="primary"
            size="lg"
            fullWidth
            onPress={onLogin}
            containerStyle={{
              height: 76,
              borderRadius: 20,
              shadowColor: withAlpha(c.brand.primary, 0.35),
              shadowOpacity: 1,
              shadowRadius: 18,
              shadowOffset: { width: 0, height: 10 },
              elevation: 6,
            }}
            textStyle={{ fontSize: 22, fontWeight: "900", letterSpacing: -0.2 }}
          />

          {/* 카카오 버튼 */}
          <Pressable
            onPress={onKakao}
            style={({ pressed }) => [
              s.kakaoPress,
              {
                backgroundColor: pressed ? withAlpha(c.brand.kakao, 0.88) : c.brand.kakao,
              },
            ]}
          >
            <View style={s.kakaoInner}>
              <Ionicons name="chatbubble-ellipses" size={22} color={c.brand.onKakao} />
              <Text style={[s.kakaoText, { color: c.brand.onKakao }]}>
                카카오로 3초만에 시작하기
              </Text>
            </View>
          </Pressable>

          {/* 회원가입 */}
          <View style={s.bottom}>
            <Text style={[s.bottomText, { color: c.text.secondary }]}>아직 계정이 없으신가요?</Text>
            <Pressable onPress={() => router.push(ROUTES.signup)} hitSlop={10}>
              <Text style={[s.bottomLink, { color: c.brand.primary }]}>회원가입</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    paddingTop: 44,
    paddingBottom: 28,
  },

  brandWrap: { alignItems: "center", marginTop: 28, marginBottom: 28 },
  brandTitle: { fontSize: 42, fontWeight: "900", letterSpacing: -0.4 },
  brandSubtitle: { marginTop: 10, fontSize: 16, fontWeight: "700" },

  tfWrap: {},
  tfInput: { fontSize: 18, fontWeight: "800", paddingVertical: 0 },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 24,
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

  kakaoPress: {
    height: 76,
    borderRadius: 20,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },
  kakaoInner: { flexDirection: "row", alignItems: "center" },
  kakaoText: { marginLeft: 12, fontSize: 20, fontWeight: "900", letterSpacing: -0.2 },

  bottom: {
    marginTop: 26,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomText: { fontSize: 16, fontWeight: "700" },
  bottomLink: { marginLeft: 10, fontSize: 16, fontWeight: "900", textDecorationLine: "underline" },
});
