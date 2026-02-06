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
import { SelectField } from "@/shared/ui/form/SelectField";
import { withAlpha } from "@/shared/utils/color";

import { useSignupStore, type VehicleType, type Ton } from "@/features/common/auth/model/signupStore";
import { useAuthStore } from "@/features/common/auth/model/authStore";

function norm(v: string) {
  return v.trim();
}

export default function SignupDriverScreen() {
  const router = useRouter();
  const t = useAppTheme();
  const c = t.colors;

  const account = useSignupStore((s) => s.account);
  const setDriver = useSignupStore((s) => s.setDriver);

  const checkNicknameAvailable = useAuthStore((s) => s.checkNicknameAvailable);
  const signUp = useAuthStore((s) => s.signUp);

  const [nickname, setNickname] = useState("");
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [checkingNick, setCheckingNick] = useState(false);

  const [carNo, setCarNo] = useState("");
  const [vehicleType, setVehicleType] = useState<VehicleType>("cargo");
  const [ton, setTon] = useState<Ton>("1t");
  const [careerYears, setCareerYears] = useState("");

  const [submitting, setSubmitting] = useState(false);

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
        borderRadius: 16,
        borderWidth: 1,
        borderColor: c.border.default,
        backgroundColor: c.bg.muted,
        alignItems: "center",
        justifyContent: "center",
      } as ViewStyle,
      miniBtnText: { fontSize: 14, fontWeight: "900", color: c.text.primary } as TextStyle,

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
      ctaBtn: {
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

  const showMsg = (title: string, msg: string) => {
    if (Platform.OS === "web") window.alert(`${title}\n\n${msg}`);
    else Alert.alert(title, msg);
  };

  const onCheckNickname = async () => {
    const n = norm(nickname);
    if (!n) return showMsg("확인", "닉네임을 입력해주세요.");

    try {
      setCheckingNick(true);
      const ok = await checkNicknameAvailable(n);
      if (!ok) {
        setNicknameChecked(false);
        return showMsg("중복", "이미 사용 중인 닉네임이에요.");
      }
      setNicknameChecked(true);
      showMsg("확인", "사용 가능한 닉네임이에요.");
    } catch (e: any) {
      setNicknameChecked(false);
      showMsg("오류", e?.message ?? "닉네임 확인에 실패했어요.");
    } finally {
      setCheckingNick(false);
    }
  };

  const canSubmit =
    norm(nickname).length > 0 &&
    nicknameChecked &&
    norm(carNo).length > 0 &&
    !!vehicleType &&
    !!ton &&
    norm(careerYears).length > 0 &&
    !submitting;

  const onSubmit = async () => {
    if (!canSubmit) return;

    // signup.tsx에서 저장된 계정 정보가 없으면 막기
    if (!account.email || !account.password || !account.name) {
      showMsg("가입 오류", "계정 정보가 없어요. 처음부터 다시 가입해주세요.");
      router.dismissAll();
      router.replace("/(auth)/signup");
      return;
    }

    try {
      setSubmitting(true);

      // ✅ signupStore에 driver 저장
      const driverPayload = {
        nickname: norm(nickname),
        carNo: norm(carNo),
        vehicleType,
        ton,
        careerYears: norm(careerYears),
      };
      setDriver(driverPayload);

      // ✅ authStore에 가입 저장(로그인 연동)
      const newUser = await signUp({
        email: account.email.trim(),
        password: account.password,
        name: account.name.trim(),
        role: "DRIVER",
        driver: driverPayload,
      });

      router.dismissAll();
      router.replace(newUser.role === "DRIVER" ? "/(driver)/(tabs)" : "/(shipper)/(tabs)");
    } catch (e: any) {
      showMsg("가입 실패", e?.message ?? "가입에 실패했어요.");
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

      <KeyboardAvoidingView behavior={Platform.select({ ios: "padding", android: undefined })} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={s.content}>
          <Text style={s.title}>차량 정보를{"\n"}입력해주세요.</Text>
          <Text style={s.subtitle}>정확한 배차를 위해 필요합니다.</Text>

          <View style={{ height: 18 }} />

          {/* 닉네임 + 중복확인 */}
          <Text style={{ color: c.text.secondary, fontWeight: "900", fontSize: 13, marginBottom: 6 }}>닉네임</Text>
          <View style={s.row}>
            <View style={{ flex: 1 }}>
              <TextField
                value={nickname}
                onChangeText={(v) => {
                  setNickname(v);
                  setNicknameChecked(false);
                }}
                placeholder="예: 바로트럭기사"
                autoCapitalize="none"
                inputWrapStyle={s.tfWrap}
                inputStyle={s.tfInput}
              />
            </View>
            <View style={s.gap} />
            <Pressable style={s.miniBtn} onPress={onCheckNickname} disabled={checkingNick}>
              <Text style={s.miniBtnText}>{checkingNick ? "확인중..." : "중복확인"}</Text>
            </Pressable>
          </View>

          <View style={{ height: 16 }} />

          <TextField
            label="차량 번호"
            value={carNo}
            onChangeText={setCarNo}
            placeholder="예: 80바 1234"
            inputWrapStyle={s.tfWrap}
            inputStyle={s.tfInput}
          />

          <View style={{ height: 16 }} />

          <View style={s.row}>
            <View style={{ flex: 1 }}>
              <SelectField
                label="차종"
                value={vehicleType}
                onChange={(v) => v && setVehicleType(v)}
                options={[
                  { label: "카고", value: "cargo" },
                  { label: "탑차", value: "top" },
                  { label: "윙바디", value: "wing" },
                  { label: "냉동/냉장", value: "refrigerated" },
                ]}
              />
            </View>

            <View style={s.gap} />

            <View style={{ flex: 1 }}>
              <SelectField
                label="톤수"
                value={ton}
                onChange={(v) => v && setTon(v)}
                options={[
                  { label: "1톤", value: "1t" },
                  { label: "1.4톤", value: "1.4t" },
                  { label: "2.5톤", value: "2.5t" },
                  { label: "3.5톤", value: "3.5t" },
                  { label: "5톤", value: "5t" },
                  { label: "11톤", value: "11t" },
                  { label: "25톤", value: "25t" },
                ]}
              />
            </View>
          </View>

          <View style={{ height: 16 }} />

          <TextField
            label="경력 (년)"
            value={careerYears}
            onChangeText={setCareerYears}
            placeholder="예: 3"
            keyboardType="number-pad"
            inputWrapStyle={s.tfWrap}
            inputStyle={s.tfInput}
          />
        </ScrollView>

        <View style={s.bottomBar}>
          <Button
            title={submitting ? "가입 처리중..." : "가입 완료"}
            variant="primary"
            size="lg"
            fullWidth
            disabled={!canSubmit}
            onPress={onSubmit}
            style={s.ctaBtn}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
