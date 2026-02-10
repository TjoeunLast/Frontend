// srv/festures/commen/auth/ui/SingupScrean.tsx
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
import { useAuthStore } from "@/features/common/auth/model/authStore";

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
function genCode6() {
  return String(Math.floor(100000 + Math.random() * 900000));
}
function showMsg(title: string, msg: string) {
  if (Platform.OS === "web") window.alert(`${title}\n\n${msg}`);
  else Alert.alert(title, msg);
}

export default function SignupScreen() {
  const router = useRouter();
  const t = useAppTheme();
  const c = t.colors;

  const setRoleStore = useSignupStore((s: SignupState) => s.setRole);
  const setAccount = useSignupStore((s: SignupState) => s.setAccount);

  const checkEmailAvailable = useAuthStore((s) => s.checkEmailAvailable);

  const [step, setStep] = useState<Step>("role");
  const [role, setRole] = useState<Role | null>(null);

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // ✅ 이메일 중복확인 상태
  const [emailChecked, setEmailChecked] = useState(false);
  const [emailOkChecked, setEmailOkChecked] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);

  // ✅ 전화 인증(목업) 상태
  const [otpRequested, setOtpRequested] = useState(false);
  const [otpCode, setOtpCode] = useState<string | null>(null); // (개발용) 발급 코드 저장
  const [otpInput, setOtpInput] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);

  // 입력이 바뀌면 검증 상태 리셋 (핵심!)
  const onChangeEmail = (v: string) => {
    setEmail(v);
    setEmailChecked(false);
    setEmailOkChecked(false);
  };
  const onChangePhone = (v: string) => {
    setPhone(v);
    setPhoneVerified(false);
    setOtpRequested(false);
    setOtpCode(null);
    setOtpInput("");
  };

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

      form: { paddingHorizontal: S.lg, paddingTop: S.xl, paddingBottom: 140 } as ViewStyle,

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

      helper: {
        marginTop: 8,
        fontSize: 13,
        fontWeight: "800",
        color: c.text.secondary,
      } as TextStyle,

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

  const emailFormatOk = isEmailLike(email);
  const pwOk = pw.length >= 8;
  const pw2Ok = pw2.length >= 8;
  const pwMatch = pw.length > 0 && pw2.length > 0 && pw === pw2;
  const nameOk = name.trim().length > 0;
  const phoneFormatOk = isPhoneLike(phone);

  // ✅ 다음 버튼 조건: 이메일 중복확인 통과 + 전화인증 완료 포함
  const canNext =
    !!role &&
    emailFormatOk &&
    emailChecked &&
    emailOkChecked &&
    pwOk &&
    pw2Ok &&
    pwMatch &&
    nameOk &&
    phoneFormatOk &&
    phoneVerified;

  const onCheckEmail = async () => {
    if (!emailFormatOk) {
      showMsg("이메일 확인", "이메일 형식을 확인해주세요.");
      return;
    }
    try {
      setCheckingEmail(true);
      const ok = await checkEmailAvailable(normalizeEmail(email));
      setEmailChecked(true);
      setEmailOkChecked(ok);

      if (ok) showMsg("사용 가능", "사용 가능한 이메일이에요.");
      else showMsg("중복", "이미 가입된 이메일이에요.");
    } catch (e: any) {
      showMsg("오류", e?.message ?? "중복확인에 실패했어요.");
    } finally {
      setCheckingEmail(false);
    }
  };

  const onRequestOtp = () => {
    if (!phoneFormatOk) {
      showMsg("휴대폰 확인", "휴대폰 번호를 확인해주세요.");
      return;
    }
    const code = genCode6();
    setOtpRequested(true);
    setOtpCode(code);
    setOtpInput("");
    setPhoneVerified(false);

    // ✅ 목업이라 화면에 코드 알려줌(개발용)
    showMsg("인증요청(목업)", `인증번호: ${code}\n(나중에 SMS 연동으로 교체)`);
  };

  const onVerifyOtp = () => {
    if (!otpRequested || !otpCode) return;

    if (otpInput.trim() === otpCode) {
      setPhoneVerified(true);
      showMsg("인증 완료", "휴대폰 인증이 완료됐어요.");
      return;
    }
    showMsg("인증 실패", "인증번호가 올바르지 않아요.");
  };

  const onNext = () => {
    if (!role) return;

    // signupStore 저장
    setRoleStore(role);
    setAccount({
      email: normalizeEmail(email),
      password: pw,
      name: name.trim(),
      phone: phone.trim(),
    });

    // 다음 단계로
    if (role === "shipper") router.push("/(auth)/signup-shipper");
    else router.push("/(auth)/signup-driver");
  };

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
        <KeyboardAvoidingView behavior={Platform.select({ ios: "padding", android: undefined })} style={{ flex: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={s.form}
          >
            <View style={{ marginBottom: 18 }}>
              <Text style={s.title}>계정 정보를{"\n"}입력해주세요.</Text>
              <Text style={s.subtitle}>로그인과 연락에 사용됩니다.</Text>
            </View>

            {/* 이메일 + 중복확인 */}
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
                  errorText={email.length > 0 && !emailFormatOk ? "이메일 형식을 확인해주세요." : undefined}
                />
              </View>
              <View style={s.rowGap} />
              <Pressable
                style={[s.miniBtn, checkingEmail && { opacity: 0.6 }]}
                onPress={onCheckEmail}
                disabled={checkingEmail}
              >
                <Text style={s.miniBtnText}>{checkingEmail ? "확인중..." : "중복확인"}</Text>
              </Pressable>
            </View>

            {emailChecked ? (
              <Text
                style={[
                  s.helper,
                  { color: emailOkChecked ? c.status.success : c.status.danger },
                ]}
              >
                {emailOkChecked ? "사용 가능한 이메일이에요." : "이미 가입된 이메일이에요."}
              </Text>
            ) : null}

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

            {/* 휴대폰 + 인증요청 */}
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
                  errorText={phone.length > 0 && !phoneFormatOk ? "휴대폰 번호를 확인해주세요." : undefined}
                />
              </View>
              <View style={s.rowGap} />
              <Pressable
                style={[s.miniBtn, (!phoneFormatOk || phoneVerified) && { opacity: 0.6 }]}
                onPress={onRequestOtp}
                disabled={!phoneFormatOk || phoneVerified}
              >
                <Text style={s.miniBtnText}>{phoneVerified ? "인증완료" : "인증요청"}</Text>
              </Pressable>
            </View>

            {/* 인증번호 입력/확인 */}
            {otpRequested && !phoneVerified ? (
              <>
                <View style={{ height: 12 }} />
                <Text style={s.label}>인증번호</Text>
                <View style={s.row}>
                  <View style={{ flex: 1 }}>
                    <TextField
                      value={otpInput}
                      onChangeText={setOtpInput}
                      placeholder="6자리 입력"
                      keyboardType="number-pad"
                      inputWrapStyle={s.tfWrap}
                      inputStyle={s.tfInput}
                    />
                  </View>
                  <View style={s.rowGap} />
                  <Pressable
                    style={[s.miniBtn, otpInput.trim().length !== 6 && { opacity: 0.6 }]}
                    onPress={onVerifyOtp}
                    disabled={otpInput.trim().length !== 6}
                  >
                    <Text style={s.miniBtnText}>확인</Text>
                  </Pressable>
                </View>
                <Text style={s.helper}>인증요청 후 받은 6자리 번호를 입력해주세요.</Text>
              </>
            ) : null}

            {phoneVerified ? (
              <Text style={[s.helper, { color: c.status.success }]}>휴대폰 인증이 완료됐어요.</Text>
            ) : null}
          </ScrollView>

          {/* ✅ 바텀바가 클릭 막지 않도록 */}
          <View style={s.bottomBar} pointerEvents="box-none">
            <Button
              title="다음"
              variant="primary"
              size="lg"
              fullWidth
              disabled={!canNext}
              onPress={onNext}
              style={s.nextBtn}
            />
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}
