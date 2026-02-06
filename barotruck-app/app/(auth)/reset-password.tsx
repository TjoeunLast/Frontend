// app/(auth)/reset-password.tsx
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
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useAppTheme } from "@/shared/hooks/useAppTheme";
import { TextField } from "@/shared/ui/form/TextField";
import { Button } from "@/shared/ui/base/Button";
import { withAlpha } from "@/shared/utils/color";
import { useAuthStore } from "@/features/common/auth/model/authStore";

const K_RESET = "barotruck.reset.v1";

type ResetTicket = { email: string; code: string; expiresAt: number };

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

  const [ticketCode, setTicketCode] = useState<string | null>(null);

  const [code, setCode] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");

  const [loadingReq, setLoadingReq] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const pwOk = pw.length >= 8;
  const pwMatch = pw.length > 0 && pw2.length > 0 && pw === pw2;

  const canRequest = email.trim().length > 0 && !loadingReq && !loadingSubmit;
  const canSubmit =
    requested &&
    code.trim().length === 6 &&
    pwOk &&
    pwMatch &&
    !loadingReq &&
    !loadingSubmit;

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

      content: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 28 } as ViewStyle,

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

      row: { flexDirection: "row", alignItems: "center" } as ViewStyle,
      gap: { width: 12 } as ViewStyle,

      label: { fontSize: 13, fontWeight: "900", color: c.text.secondary, marginBottom: 8 } as TextStyle,

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
        borderRadius: 16,
        borderWidth: 1,
        borderColor: c.border.default,
        backgroundColor: c.bg.muted,
        alignItems: "center",
        justifyContent: "center",
      } as ViewStyle,
      miniText: { fontSize: 15, fontWeight: "900", color: c.text.primary } as TextStyle,

      // ✅ 코드 박스(드래그/복사)
      codeBox: {
        marginTop: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: withAlpha(c.border.default, 0.9),
        backgroundColor: c.bg.canvas,
        padding: 14,
      } as ViewStyle,
      codeTitle: { fontSize: 12, fontWeight: "900", color: c.text.secondary } as TextStyle,
      codeValue: {
        marginTop: 8,
        fontSize: 22,
        fontWeight: "900",
        letterSpacing: 3,
        color: c.text.primary,
      } as TextStyle,
      codeHint: { marginTop: 8, fontSize: 12, fontWeight: "800", color: c.text.secondary } as TextStyle,

      copyRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 10 } as ViewStyle,
      copyBtn: {
        height: 40,
        paddingHorizontal: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: c.border.default,
        backgroundColor: c.bg.surface,
        alignItems: "center",
        justifyContent: "center",
      } as ViewStyle,
      copyText: { fontSize: 13, fontWeight: "900", color: c.text.primary } as TextStyle,

      cta: {
        height: 64,
        borderRadius: 18,
        alignSelf: "stretch",
        marginTop: 18,
        shadowColor: withAlpha(c.brand.primary, 0.25),
        shadowOpacity: 1,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 8 },
        elevation: 5,
      } as ViewStyle,
    });
  }, [c]);

  const copyToClipboard = async (text: string) => {
    try {
      if (Platform.OS === "web") {
        await navigator.clipboard.writeText(text);
        return;
      }
      // ✅ 모바일에서도 동작하게 하려면 expo-clipboard 설치 후 여기만 바꾸면 됨
      // 지금은 “드래그/선택”만으로 충분하다 했으니 안내만.
      Alert.alert("복사", "모바일 복사는 나중에 expo-clipboard로 붙일게요.\n지금은 숫자를 길게 눌러 선택해서 복사해도 돼요.");
    } catch {
      showMsg("복사 실패", "브라우저 권한 때문에 복사가 막혔어요. 드래그해서 복사해도 돼요.");
    }
  };

  const onRequest = async () => {
    if (!canRequest) return;

    try {
      setLoadingReq(true);
      await requestPasswordReset(email.trim());

      setRequested(true);

      // ✅ ticket 읽어서 화면에 보여주기(드래그/복사 가능)
      const raw = await AsyncStorage.getItem(K_RESET);
      if (raw) {
        const ticket = JSON.parse(raw) as ResetTicket;
        const sameEmail = ticket?.email?.toLowerCase() === email.trim().toLowerCase();
        const code6 = ticket?.code?.trim();
        if (sameEmail && code6) {
          setTicketCode(code6);
          setCode(code6); // ✅ 편하게 자동 입력
        } else {
          setTicketCode(null);
        }
      } else {
        setTicketCode(null);
      }

      if (Platform.OS !== "web") {
        showMsg("인증번호 발급(목업)", "인증번호가 발급됐어요. (나중에 SMS/이메일로 교체)");
      }
    } catch (e: any) {
      showMsg("요청 실패", e?.message ?? "인증요청에 실패했어요.");
    } finally {
      setLoadingReq(false);
    }
  };

  const onSubmit = async () => {
    if (!canSubmit) return;

    try {
      setLoadingSubmit(true);
      await resetPasswordWithCode({
        email: email.trim(),
        code: code.trim(),
        newPassword: pw,
      });

      // ✅ 변경 성공: 이미 저장됨(users 업데이트됨). 로그인 페이지로 이동
      showMsg("변경 완료", "비밀번호가 변경됐어요. 로그인 해주세요.");
      router.dismissAll();
      router.replace("/(auth)/login");
    } catch (e: any) {
      showMsg("변경 실패", e?.message ?? "비밀번호 변경에 실패했어요.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <SafeAreaView style={s.screen} edges={["top", "bottom"]}>
      <View style={s.header}>
        <Pressable onPress={() => router.back()} style={s.backBtn} hitSlop={10}>
          <Ionicons name="arrow-back" size={26} color={c.text.primary} />
        </Pressable>
      </View>

      <KeyboardAvoidingView behavior={Platform.select({ ios: "padding", android: undefined })} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={s.content}>
          <Text style={s.title}>비밀번호를{"\n"}재설정할게요.</Text>
          <Text style={s.subtitle}>가입한 이메일로 인증 후 새 비밀번호를 설정합니다.</Text>

          <View style={{ height: 18 }} />

          <Text style={s.label}>이메일</Text>
          <View style={s.row}>
            <View style={{ flex: 1 }}>
              <TextField
                value={email}
                onChangeText={(v) => {
                  setEmail(v);
                  setRequested(false);
                  setTicketCode(null);
                  setCode("");
                  setPw("");
                  setPw2("");
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
              onPress={onRequest}
              style={[s.miniBtn, !canRequest && { opacity: 0.6 }]}
              disabled={!canRequest}
            >
              <Text style={s.miniText}>{loadingReq ? "요청중..." : "인증요청"}</Text>
            </Pressable>
          </View>

          {/* ✅ 웹에서 드래그/복사 가능한 코드 박스 */}
          {requested && ticketCode ? (
            <View style={s.codeBox}>
              <Text style={s.codeTitle}>인증번호(목업)</Text>
              {/* Text는 웹에서 드래그 가능 */}
              <Text selectable style={s.codeValue}>
                {ticketCode}
              </Text>
              <View style={s.copyRow}>
                <Pressable onPress={() => copyToClipboard(ticketCode)} style={s.copyBtn}>
                  <Text style={s.copyText}>복사</Text>
                </Pressable>
              </View>
              <Text style={s.codeHint}>※ 나중에 SMS/이메일 인증으로 교체</Text>
            </View>
          ) : null}

          {requested ? (
            <>
              <View style={{ height: 16 }} />

              <Text style={s.label}>인증번호(6자리)</Text>
              <TextField
                value={code}
                onChangeText={setCode}
                placeholder="000000"
                keyboardType="number-pad"
                inputWrapStyle={s.tfWrap}
                inputStyle={s.tfInput}
              />

              <View style={{ height: 16 }} />

              <Text style={s.label}>새 비밀번호</Text>
              <TextField
                value={pw}
                onChangeText={setPw}
                placeholder="8자리 이상"
                secureTextEntry
                autoCapitalize="none"
                inputWrapStyle={s.tfWrap}
                inputStyle={s.tfInput}
                errorText={pw.length > 0 && !pwOk ? "비밀번호는 8자리 이상이어야 해요." : undefined}
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
                errorText={pw2.length > 0 && !pwMatch ? "비밀번호가 일치하지 않아요." : undefined}
              />

              <Button
                title={loadingSubmit ? "변경 중..." : "비밀번호 변경"}
                variant="primary"
                size="lg"
                fullWidth
                disabled={!canSubmit}
                onPress={onSubmit}
                style={s.cta}
              />
            </>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
