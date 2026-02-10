// src/features/common/auth/ui/ResetPasswordScreen.tsx
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
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useAppTheme } from "@/shared/hooks/useAppTheme";
import { TextField } from "@/shared/ui/form/TextField";
import { Button } from "@/shared/ui/base/Button";
import { withAlpha } from "@/shared/utils/color";
import { useAuthStore } from "@/features/common/auth/model/authStore";

function normalizeEmail(v: string) {
  return v.trim().toLowerCase();
}
function isEmailLike(v: string) {
  const x = normalizeEmail(v);
  return x.includes("@") && x.includes(".");
}
function showMsg(title: string, msg: string) {
  if (Platform.OS === "web") window.alert(`${title}\n\n${msg}`);
  else Alert.alert(title, msg);
}

export default function ResetPasswordScreen() {
  const router = useRouter();
  const t = useAppTheme();
  const c = t.colors;

  const requestPasswordReset = useAuthStore((s) => s.requestPasswordReset);
  const resetPasswordWithCode = useAuthStore((s) => s.resetPasswordWithCode);

  const [email, setEmail] = useState("");
  const [requested, setRequested] = useState(false);

  const [code, setCode] = useState<string | null>(null);

  const [codeInput, setCodeInput] = useState("");
  const [verified, setVerified] = useState(false);

  const [verifiedCode, setVerifiedCode] = useState<string | null>(null);

  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const emailOk = isEmailLike(email);
  const pwOk = pw.length >= 8;
  const pwMatch = pw.length > 0 && pw2.length > 0 && pw === pw2;

  const s = useMemo(() => {
    return StyleSheet.create({
      screen: { flex: 1, backgroundColor: c.bg.surface } as ViewStyle,

      header: { paddingHorizontal: 18, paddingTop: 10, paddingBottom: 6 } as ViewStyle,
      backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
      } as ViewStyle,

      content: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 140 } as ViewStyle,

      title: {
        fontSize: 26,
        fontWeight: "900",
        letterSpacing: -0.4,
        color: c.text.primary,
        lineHeight: 34,
      } as TextStyle,
      subtitle: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: "700",
        color: c.text.secondary,
        lineHeight: 20,
      } as TextStyle,

      label: { fontSize: 13, fontWeight: "900", color: c.text.secondary, marginBottom: 6 } as TextStyle,

      row: { flexDirection: "row", alignItems: "center" } as ViewStyle,
      gap: { width: 12 } as ViewStyle,

      tfWrap: {
        minHeight: 56,
        borderRadius: 18,
        paddingHorizontal: 16,
        backgroundColor: c.bg.surface,
        borderWidth: 1,
        borderColor: c.border.default,
      } as ViewStyle,
      tfInput: { fontSize: 16, fontWeight: "800", paddingVertical: 0 } as TextStyle,

      miniBtn: {
        height: 56,
        paddingHorizontal: 14,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: c.border.default,
        backgroundColor: c.bg.muted,
        alignItems: "center",
        justifyContent: "center",
      } as ViewStyle,
      miniBtnText: { fontSize: 15, fontWeight: "900", color: c.text.primary } as TextStyle,

      codeBox: {
        marginTop: 10,
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: c.border.default,
        backgroundColor: c.bg.muted,
      } as ViewStyle,
      codeText: { fontSize: 18, fontWeight: "900", letterSpacing: 2, color: c.text.primary } as TextStyle,
      helper: { marginTop: 8, fontSize: 13, fontWeight: "800", color: c.text.secondary } as TextStyle,

      bottomBar: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: 18,
        paddingBottom: 18,
        paddingTop: 12,
        backgroundColor: withAlpha(c.bg.surface, 0.98),
        borderTopWidth: 1,
        borderTopColor: withAlpha(c.border.default, 0.7),
      } as ViewStyle,
      cta: {
        height: 64,
        borderRadius: 18,
        alignSelf: "stretch",
        shadowColor: withAlpha(c.brand.primary, 0.25),
        shadowOpacity: 1,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 8 },
        elevation: 5,
      } as ViewStyle,
    });
  }, [c]);

  const resetLocalState = () => {
    setRequested(false);
    setCode(null);
    setCodeInput("");
    setVerified(false);
    setVerifiedCode(null);
    setPw("");
    setPw2("");
  };

  const onRequest = async () => {
    if (!emailOk) return showMsg("이메일 확인", "이메일 형식을 확인해주세요.");

    try {
      setSubmitting(true);

      const otp = await requestPasswordReset(normalizeEmail(email));

      setRequested(true);
      setCode(otp);
      setVerified(false);
      setVerifiedCode(null);
      setCodeInput("");

      showMsg("인증요청(목업)", `인증번호: ${otp}\n(드래그로 복사 가능)`);
    } catch (e: any) {
      showMsg("오류", e?.message ?? "인증요청에 실패했어요.");
    } finally {
      setSubmitting(false);
    }
  };

  const onVerify = () => {
    if (!requested || !code) return;

    const typed = codeInput.trim();
    if (typed === code) {
      setVerified(true);
      setVerifiedCode(typed);
      showMsg("인증 완료", "인증이 완료됐어요. 새 비밀번호를 설정해주세요.");
    } else {
      showMsg("인증 실패", "인증번호가 올바르지 않아요.");
    }
  };

  const canSubmit = verified && !!verifiedCode && pwOk && pwMatch && !submitting;

  const onSubmit = async () => {
    if (!canSubmit || !verifiedCode) return;

    try {
      setSubmitting(true);

      await resetPasswordWithCode({
        email: normalizeEmail(email),
        code: verifiedCode, 
        newPassword: pw,
      });

      showMsg("변경 완료", "비밀번호가 변경됐어요. 로그인해주세요.");
      resetLocalState();
      router.dismissAll();
      router.replace("/(auth)/login");
    } catch (e: any) {
      showMsg("오류", e?.message ?? "비밀번호 변경에 실패했어요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={s.screen} edges={["top", "bottom"]}>
      <View style={s.header}>
        <Pressable onPress={() => router.back()} style={s.backBtn} hitSlop={10}>
          <Ionicons name="arrow-back" size={26} color={c.text.primary} />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={s.content}
        >
          <Text style={s.title}>비밀번호를{"\n"}재설정할게요.</Text>
          <Text style={s.subtitle}>이메일 인증 후 새 비밀번호를 설정해주세요.</Text>

          <View style={{ height: 18 }} />

          <Text style={s.label}>이메일</Text>
          <View style={s.row}>
            <View style={{ flex: 1 }}>
              <TextField
                value={email}
                onChangeText={(v) => {
                  setEmail(v);
             
                  resetLocalState();
                  setEmail(v);
                }}
                placeholder="example@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                inputWrapStyle={s.tfWrap}
                inputStyle={s.tfInput}
              />
            </View>

            <View style={s.gap} />

            <Pressable
              style={[s.miniBtn, (!emailOk || submitting) && { opacity: 0.6 }]}
              onPress={onRequest}
              disabled={!emailOk || submitting}
            >
              <Text style={s.miniBtnText}>인증요청</Text>
            </Pressable>
          </View>

          {requested && code ? (
            <View style={s.codeBox}>
              <Text style={s.helper}>발급된 인증번호(목업) — 드래그로 복사 가능</Text>
              <Text selectable style={s.codeText}>
                {code}
              </Text>
            </View>
          ) : null}

          {requested && !verified ? (
            <>
              <View style={{ height: 16 }} />
              <Text style={s.label}>인증번호 입력</Text>
              <View style={s.row}>
                <View style={{ flex: 1 }}>
                  <TextField
                    value={codeInput}
                    onChangeText={setCodeInput}
                    placeholder="6자리 입력"
                    keyboardType="number-pad"
                    inputWrapStyle={s.tfWrap}
                    inputStyle={s.tfInput}
                  />
                </View>
                <View style={s.gap} />
                <Pressable
                  style={[
                    s.miniBtn,
                    (codeInput.trim().length !== 6 || submitting) && { opacity: 0.6 },
                  ]}
                  onPress={onVerify}
                  disabled={codeInput.trim().length !== 6 || submitting}
                >
                  <Text style={s.miniBtnText}>확인</Text>
                </Pressable>
              </View>
            </>
          ) : null}

          {verified ? (
            <>
              <View style={{ height: 18 }} />
              <Text style={s.label}>새 비밀번호</Text>
              <TextField
                value={pw}
                onChangeText={setPw}
                placeholder="8자리 이상"
                secureTextEntry
                autoCapitalize="none"
                inputWrapStyle={s.tfWrap}
                inputStyle={s.tfInput}
              />

              <View style={{ height: 12 }} />

              <Text style={s.label}>새 비밀번호 확인</Text>
              <TextField
                value={pw2}
                onChangeText={setPw2}
                placeholder="한 번 더 입력"
                secureTextEntry
                autoCapitalize="none"
                inputWrapStyle={s.tfWrap}
                inputStyle={s.tfInput}
              />

              {!pwOk && pw.length > 0 ? (
                <Text style={[s.helper, { color: c.status.danger }]}>
                  비밀번호는 8자리 이상이어야 해요.
                </Text>
              ) : null}
              {pw2.length > 0 && !pwMatch ? (
                <Text style={[s.helper, { color: c.status.danger }]}>
                  비밀번호가 일치하지 않아요.
                </Text>
              ) : null}
            </>
          ) : null}
        </ScrollView>

        <View style={s.bottomBar} pointerEvents="box-none">
          <Button
            title={submitting ? "변경 중..." : "비밀번호 변경"}
            variant="primary"
            size="lg"
            fullWidth
            disabled={!canSubmit}
            loading={submitting}
            onPress={onSubmit}
            style={s.cta}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
