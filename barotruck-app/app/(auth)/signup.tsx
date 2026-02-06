// app/(auth)/signup.tsx
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

import { useSignupStore, type SignupState } from "@/features/common/auth/model/signupStore";
import {
  mockCheckEmailDuplicate,
  mockSendPhoneOtp,
  mockVerifyPhoneOtp,
} from "@/features/common/auth/lib/mockVerify";

type Role = "shipper" | "driver";
type Step = "role" | "account";

function normalizeEmail(v: string) {
  return v.trim().toLowerCase();
}
function isEmailLike(v: string) {
  const x = normalizeEmail(v);
  return x.includes("@") && x.includes(".");
}
function digitsOnly(v: string) {
  return v.replace(/[^0-9]/g, "");
}
function isPhoneLike(v: string) {
  return digitsOnly(v).length >= 10;
}

export default function SignupScreen() {
  const router = useRouter();
  const t = useAppTheme();
  const c = t.colors;

  const setRoleStore = useSignupStore((s: SignupState) => s.setRole);
  const setAccount = useSignupStore((s: SignupState) => s.setAccount);

  const [step, setStep] = useState<Step>("role");
  const [role, setRole] = useState<Role | null>(null);

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // ✅ 이메일 중복확인
  const [emailChecked, setEmailChecked] = useState(false);
  const [emailCheckMsg, setEmailCheckMsg] = useState<string | null>(null);
  const [checkingEmail, setCheckingEmail] = useState(false);

  // ✅ 전화번호 인증(OTP)
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpMsg, setOtpMsg] = useState<string | null>(null);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const s = useMemo(() => {
    const S = { xs: 8, sm: 12, md: 16, lg: 20, xl: 24, xxl: 36 } as const;

    return StyleSheet.create({
      screen: { flex: 1, backgroundColor: c.bg.surface } as ViewStyle,

      header: {
        paddingHorizontal: S.lg,
        paddingTop: S.md,
        paddingBottom: S.md,
      } as ViewStyle,
      backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
      } as ViewStyle,

      titleWrap: { paddingHorizontal: S.lg, paddingTop: S.sm } as ViewStyle,
      title: {
        fontSize: 30,
        fontWeight: "900",
        letterSpacing: -0.4,
        color: c.text.primary,
        lineHeight: 38,
      } as TextStyle,
      subtitle: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: "700",
        color: c.text.secondary,
        lineHeight: 22,
      } as TextStyle,

      cardList: {
        paddingHorizontal: S.lg,
        paddingTop: S.xl,
      } as ViewStyle,

      roleCard: {
        backgroundColor: c.bg.surface,
        borderWidth: 1,
        borderColor: c.border.default,
        borderRadius: 20,
        paddingHorizontal: 18,
        paddingVertical: 18,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 14,

        shadowColor: withAlpha("#000000", 0.06),
        shadowOpacity: 1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 2,
      } as ViewStyle,
      roleIconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: c.border.default,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: c.bg.surface,
        marginRight: 14,
      } as ViewStyle,
      roleTextWrap: { flex: 1 } as ViewStyle,
      roleTitle: { fontSize: 18, fontWeight: "900", color: c.text.primary } as TextStyle,
      roleDesc: {
        marginTop: 6,
        fontSize: 15,
        fontWeight: "700",
        color: c.text.secondary,
      } as TextStyle,

      form: { paddingHorizontal: S.lg, paddingTop: S.xl, paddingBottom: 180 } as ViewStyle,

      label: {
        fontSize: 14,
        fontWeight: "900",
        color: c.text.secondary,
        marginBottom: 8,
      } as TextStyle,

      row: { flexDirection: "row", alignItems: "center" } as ViewStyle,
      rowGap: { width: 12 } as ViewStyle,

      tfWrap: {
        minHeight: 56,
        borderRadius: 16,
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
      miniBtnText: { fontSize: 15, fontWeight: "900", color: c.text.primary } as TextStyle,

      hint: { marginTop: 6, fontSize: 12, fontWeight: "800", color: c.text.secondary } as TextStyle,
      hintOk: { color: c.status.success } as TextStyle,
      hintBad: { color: c.status.danger } as TextStyle,

      bottomBar: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: S.lg,
        paddingBottom: S.lg,
        paddingTop: 12,
        backgroundColor: withAlpha(c.bg.surface, 0.98),
        borderTopWidth: 1,
        borderTopColor: withAlpha(c.border.default, 0.7),
      } as ViewStyle,
      nextBtn: {
        height: 76,
        borderRadius: 20,
        alignSelf: "stretch",
        shadowColor: withAlpha(c.brand.primary, 0.35),
        shadowOpacity: 1,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 6,
      } as ViewStyle,
      nextText: { fontSize: 20, fontWeight: "900", letterSpacing: -0.2 } as TextStyle,
    });
  }, [c]);

  const goBack = () => {
    if (step === "account") {
      setStep("role");
      return;
    }
    router.back();
  };

  const chooseRole = (r: Role) => {
    setRole(r);
    setStep("account");
  };

  const onChangeEmail = (v: string) => {
    setEmail(v);
    setEmailChecked(false);
    setEmailCheckMsg(null);
  };

  const onChangePhone = (v: string) => {
    setPhone(v);
    setOtpSent(false);
    setOtp("");
    setOtpVerified(false);
    setOtpMsg(null);
  };

  const emailOk = isEmailLike(email);
  const pwOk = pw.length >= 8;
  const pw2Ok = pw2.length >= 8;
  const pwMatch = pw.length > 0 && pw2.length > 0 && pw === pw2;
  const nameOk = name.trim().length > 0;
  const phoneOk = isPhoneLike(phone);

  const canNext =
    !!role &&
    emailOk &&
    pwOk &&
    pw2Ok &&
    pwMatch &&
    nameOk &&
    phoneOk &&
    emailChecked &&
    otpVerified;

  const handleCheckEmail = async () => {
    const e = normalizeEmail(email);

    if (!isEmailLike(e)) {
      setEmailCheckMsg("이메일 형식을 확인해주세요.");
      setEmailChecked(false);
      return;
    }

    try {
      setCheckingEmail(true);
      const r = await mockCheckEmailDuplicate(e);
      if (r.ok) {
        setEmailChecked(true);
        setEmailCheckMsg("사용 가능한 이메일이에요.");
      } else {
        setEmailChecked(false);
        setEmailCheckMsg(r.reason ?? "이미 사용 중인 이메일이에요.");
      }
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleSendOtp = async () => {
    const p = digitsOnly(phone);

    if (!isPhoneLike(phone)) {
      setOtpMsg("휴대폰 번호를 확인해주세요.");
      return;
    }

    try {
      setSendingOtp(true);
      const { code } = await mockSendPhoneOtp(p);

      // ✅ 목업: 코드 안내
      if (Platform.OS === "web") window.alert(`(목업) 인증번호: ${code}`);
      else Alert.alert("(목업)", `인증번호: ${code}`);

      setOtpSent(true);
      setOtpVerified(false);
      setOtpMsg("인증번호를 입력해주세요.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    const p = digitsOnly(phone);

    if (!otpSent) {
      setOtpMsg("인증요청을 먼저 해주세요.");
      return;
    }
    if (otp.trim().length < 4) {
      setOtpMsg("인증번호를 입력해주세요.");
      return;
    }

    try {
      setVerifyingOtp(true);
      const r = await mockVerifyPhoneOtp(p, otp.trim());
      if (r.ok) {
        setOtpVerified(true);
        setOtpMsg("인증 완료!");
      } else {
        setOtpVerified(false);
        setOtpMsg(r.reason ?? "인증 실패");
      }
    } finally {
      setVerifyingOtp(false);
    }
  };

  const onNext = () => {
    if (!role) return;

    setRoleStore(role);
    setAccount({
      email: normalizeEmail(email),
      password: pw,
      name: name.trim(),
      phone: phone.trim(),
    });

    if (role === "shipper") router.push("/(auth)/signup-shipper");
    else router.push("/(auth)/signup-driver");
  };

  const emailHintStyle =
    emailCheckMsg && emailChecked ? [s.hint, s.hintOk] : emailCheckMsg ? [s.hint, s.hintBad] : null;

  const otpHintStyle =
    otpMsg && otpVerified ? [s.hint, s.hintOk] : otpMsg ? [s.hint, s.hintBad] : null;

  return (
    <SafeAreaView style={s.screen} edges={["top", "bottom"]}>
      <View style={s.header}>
        <Pressable onPress={goBack} style={s.backBtn} hitSlop={10}>
          <Ionicons name="arrow-back" size={26} color={c.text.primary} />
        </Pressable>
      </View>

      {step === "role" ? (
        <>
          <View style={s.titleWrap}>
            <Text style={s.title}>반갑습니다!{"\n"}어떤 분이신가요?</Text>
            <Text style={s.subtitle}>서비스 이용 목적을 선택해주세요.</Text>
          </View>

          <View style={s.cardList}>
            <Pressable
              onPress={() => chooseRole("shipper")}
              style={({ pressed }) => [s.roleCard, pressed && { backgroundColor: c.brand.primarySoft }]}
            >
              <View style={s.roleIconCircle}>
                <Ionicons name="cube-outline" size={24} color={c.text.primary} />
              </View>

              <View style={s.roleTextWrap}>
                <Text style={s.roleTitle}>화주 (보내는 분)</Text>
                <Text style={s.roleDesc}>화물을 등록하고 배차를 요청해요</Text>
              </View>

              <Ionicons name="chevron-forward" size={22} color={c.text.secondary} />
            </Pressable>

            <Pressable
              onPress={() => chooseRole("driver")}
              style={({ pressed }) => [s.roleCard, pressed && { backgroundColor: c.brand.primarySoft }]}
            >
              <View style={s.roleIconCircle}>
                <Ionicons name="car-outline" size={24} color={c.text.primary} />
              </View>

              <View style={s.roleTextWrap}>
                <Text style={s.roleTitle}>차주 (기사님)</Text>
                <Text style={s.roleDesc}>오더를 수행하고 수익을 내요</Text>
              </View>

              <Ionicons name="chevron-forward" size={22} color={c.text.secondary} />
            </Pressable>
          </View>
        </>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: "padding", android: undefined })}
          style={{ flex: 1 }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={s.form}
          >
            <View style={{ marginBottom: 18 }}>
              <Text style={s.title}>계정 정보를{"\n"}입력해주세요.</Text>
              <Text style={s.subtitle}>로그인과 연락에 사용됩니다.</Text>
            </View>

            {/* 이메일 */}
            <Text style={s.label}>이메일 (아이디)</Text>
            <View style={s.row}>
              <View style={{ flex: 1 }}>
                <TextField
                  value={email}
                  onChangeText={onChangeEmail}
                  placeholder="example@email.com"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  inputWrapStyle={s.tfWrap}
                  inputStyle={s.tfInput}
                  errorText={email.length > 0 && !emailOk ? "이메일 형식을 확인해주세요." : undefined}
                />
                {emailCheckMsg ? <Text style={emailHintStyle as any}>{emailCheckMsg}</Text> : null}
              </View>
              <View style={s.rowGap} />
              <Pressable
                style={s.miniBtn}
                onPress={handleCheckEmail}
                disabled={checkingEmail || !emailOk}
              >
                <Text style={s.miniBtnText}>{checkingEmail ? "확인중..." : "중복확인"}</Text>
              </Pressable>
            </View>

            <View style={{ height: 16 }} />

            {/* 비밀번호 */}
            <Text style={s.label}>비밀번호</Text>
            <TextField
              value={pw}
              onChangeText={setPw}
              placeholder="8자리 이상 입력"
              secureTextEntry
              autoCapitalize="none"
              inputWrapStyle={s.tfWrap}
              inputStyle={s.tfInput}
              errorText={pw.length > 0 && !pwOk ? "비밀번호는 8자리 이상이어야 해요." : undefined}
            />

            <View style={{ height: 16 }} />

            <Text style={s.label}>비밀번호 확인</Text>
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

            <View style={{ height: 16 }} />

            {/* 이름 */}
            <Text style={s.label}>이름</Text>
            <TextField
              value={name}
              onChangeText={setName}
              placeholder="실명 입력"
              autoCapitalize="none"
              inputWrapStyle={s.tfWrap}
              inputStyle={s.tfInput}
            />

            <View style={{ height: 16 }} />

            {/* 전화번호 + OTP */}
            <Text style={s.label}>휴대폰 번호</Text>
            <View style={s.row}>
              <View style={{ flex: 1 }}>
                <TextField
                  value={phone}
                  onChangeText={onChangePhone}
                  placeholder="010-1234-5678"
                  keyboardType="phone-pad"
                  inputWrapStyle={s.tfWrap}
                  inputStyle={s.tfInput}
                  errorText={phone.length > 0 && !phoneOk ? "휴대폰 번호를 확인해주세요." : undefined}
                />
              </View>
              <View style={s.rowGap} />
              <Pressable
                style={s.miniBtn}
                onPress={handleSendOtp}
                disabled={sendingOtp || !phoneOk}
              >
                <Text style={s.miniBtnText}>{sendingOtp ? "요청중..." : "인증요청"}</Text>
              </Pressable>
            </View>

            {otpSent ? (
              <>
                <View style={{ height: 12 }} />
                <Text style={s.label}>인증번호</Text>
                <View style={s.row}>
                  <View style={{ flex: 1 }}>
                    <TextField
                      value={otp}
                      onChangeText={setOtp}
                      placeholder="6자리 입력"
                      keyboardType="number-pad"
                      inputWrapStyle={s.tfWrap}
                      inputStyle={s.tfInput}
                    />
                    {otpMsg ? <Text style={otpHintStyle as any}>{otpMsg}</Text> : null}
                  </View>
                  <View style={s.rowGap} />
                  <Pressable
                    style={s.miniBtn}
                    onPress={handleVerifyOtp}
                    disabled={verifyingOtp || otp.trim().length === 0}
                  >
                    <Text style={s.miniBtnText}>{verifyingOtp ? "확인중..." : "확인"}</Text>
                  </Pressable>
                </View>
              </>
            ) : null}
          </ScrollView>

          {/* ✅ pointerEvents는 props 말고 style로 */}
          <View style={[s.bottomBar, { pointerEvents: "box-none" as any }]}>
            <Button
              title="다음"
              variant="primary"
              size="lg"
              fullWidth
              disabled={!canNext}
              onPress={onNext}
              containerStyle={s.nextBtn}
              textStyle={s.nextText}
            />
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

