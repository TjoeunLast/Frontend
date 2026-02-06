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

import { useSignupStore } from "@/features/common/auth/model/signupStore";
import { useAuthStore } from "@/features/common/auth/model/authStore";

function norm(v: string) {
  return v.trim();
}

export default function SignupShipperScreen() {
  const router = useRouter();
  const t = useAppTheme();
  const c = t.colors;

  const account = useSignupStore((s) => s.account);
  const shipper = useSignupStore((s) => s.shipper);
  const setShipperType = useSignupStore((s) => s.setShipperType);
  const setShipper = useSignupStore((s) => s.setShipper);

  const checkNicknameAvailable = useAuthStore((s) => s.checkNicknameAvailable);
  const signUp = useAuthStore((s) => s.signUp);

  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [checkingNick, setCheckingNick] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isBusiness = shipper.type === "business";

  const styles = useMemo(() => {
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

      segWrap: {
        marginTop: 18,
        backgroundColor: c.bg.muted,
        borderRadius: 16,
        padding: 4,
        borderWidth: 1,
        borderColor: c.border.default,
        flexDirection: "row",
      } as ViewStyle,
      segBtn: { flex: 1, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" } as ViewStyle,
      segText: { fontSize: 14, fontWeight: "900" } as TextStyle,
      segSelected: {
        backgroundColor: c.bg.surface,
        borderWidth: 1,
        borderColor: c.border.default,
        shadowColor: withAlpha("#000000", 0.08),
        shadowOpacity: 1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 2,
      } as ViewStyle,

      row: { flexDirection: "row", alignItems: "center" } as ViewStyle,
      gap: { width: 12 } as ViewStyle,

      tfWrap: {
        minHeight: 54,
        borderRadius: 16,
        paddingHorizontal: 16,
        backgroundColor: c.bg.surface,
        borderWidth: 1,
        borderColor: c.border.default,
      } as ViewStyle,
      tfInput: { fontSize: 16, fontWeight: "800" } as TextStyle,

      miniBtn: {
        height: 54,
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
        height: 64,
        borderRadius: 18,
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
    const n = norm(shipper.nickname);
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

  const canSubmit = (() => {
    const nickOk = norm(shipper.nickname).length > 0 && nicknameChecked;
    if (!nickOk) return false;
    if (!isBusiness) return !submitting;

    return (
      norm(shipper.bizNo).length > 0 &&
      norm(shipper.companyName).length > 0 &&
      norm(shipper.ceoName).length > 0 &&
      !submitting
    );
  })();

  const onSubmit = async () => {
    if (!canSubmit) return;

    if (!account.email || !account.password || !account.name) {
      showMsg("가입 오류", "계정 정보가 없어요. 처음부터 다시 가입해주세요.");
      router.dismissAll();
      router.replace("/(auth)/signup");
      return;
    }

    try {
      setSubmitting(true);

      const shipperPayload = {
        type: shipper.type,
        nickname: norm(shipper.nickname),
        bizNo: isBusiness ? norm(shipper.bizNo) : "",
        companyName: isBusiness ? norm(shipper.companyName) : "",
        ceoName: isBusiness ? norm(shipper.ceoName) : "",
      };

      const newUser = await signUp({
        email: account.email.trim(),
        password: account.password,
        name: account.name.trim(),
        role: "SHIPPER",
        shipper: shipperPayload,
      });

      router.dismissAll();
      router.replace(newUser.role === "SHIPPER" ? "/(shipper)/(tabs)" : "/(driver)/(tabs)");
    } catch (e: any) {
      showMsg("가입 실패", e?.message ?? "가입에 실패했어요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={10}>
          <Ionicons name="arrow-back" size={26} color={c.text.primary} />
        </Pressable>
      </View>

      <KeyboardAvoidingView behavior={Platform.select({ ios: "padding", android: undefined })} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
          <Text style={styles.title}>화주 정보를{"\n"}입력해주세요.</Text>
          <Text style={styles.subtitle}>개인 화주인지 사업자 화주인지 선택해주세요.</Text>

          <View style={styles.segWrap}>
            <Pressable
              onPress={() => {
                setShipperType("personal");
                setNicknameChecked(false);
              }}
              style={[styles.segBtn, shipper.type === "personal" ? styles.segSelected : null]}
            >
              <Text style={[styles.segText, { color: shipper.type === "personal" ? c.text.primary : c.text.secondary }]}>
                개인
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setShipperType("business");
                setNicknameChecked(false);
              }}
              style={[styles.segBtn, shipper.type === "business" ? styles.segSelected : null]}
            >
              <Text style={[styles.segText, { color: shipper.type === "business" ? c.text.primary : c.text.secondary }]}>
                사업자
              </Text>
            </Pressable>
          </View>

          <View style={{ height: 18 }} />

          {/* 닉네임 + 중복확인 */}
          <Text style={{ color: c.text.primary, fontWeight: "900", fontSize: 13, marginBottom: 6 }}>닉네임</Text>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <TextField
                value={shipper.nickname}
                onChangeText={(v) => {
                  setShipper({ nickname: v });
                  setNicknameChecked(false);
                }}
                placeholder="앱에서 사용할 닉네임"
                autoCapitalize="none"
                inputWrapStyle={styles.tfWrap}
                inputStyle={styles.tfInput}
              />
            </View>

            <View style={styles.gap} />
            <Pressable style={styles.miniBtn} onPress={onCheckNickname} disabled={checkingNick}>
              <Text style={styles.miniBtnText}>{checkingNick ? "확인중..." : "중복확인"}</Text>
            </Pressable>
          </View>

          {isBusiness ? (
            <>
              <View style={{ height: 16 }} />
              <TextField
                label="사업자 등록번호"
                value={shipper.bizNo}
                onChangeText={(v) => setShipper({ bizNo: v })}
                placeholder="숫자만 입력"
                keyboardType="number-pad"
                inputWrapStyle={styles.tfWrap}
                inputStyle={styles.tfInput}
              />
              <View style={{ height: 16 }} />
              <TextField
                label="회사명 (상호)"
                value={shipper.companyName}
                onChangeText={(v) => setShipper({ companyName: v })}
                placeholder="예: (주)대한물류"
                inputWrapStyle={styles.tfWrap}
                inputStyle={styles.tfInput}
              />
              <View style={{ height: 16 }} />
              <TextField
                label="대표자명"
                value={shipper.ceoName}
                onChangeText={(v) => setShipper({ ceoName: v })}
                placeholder="대표자 성함"
                inputWrapStyle={styles.tfWrap}
                inputStyle={styles.tfInput}
              />
            </>
          ) : null}
        </ScrollView>

        <View style={styles.bottomBar}>
          <Button
            title={submitting ? "가입 처리중..." : "가입 완료"}
            variant="primary"
            size="lg"
            fullWidth
            disabled={!canSubmit}
            onPress={onSubmit}
            style={styles.ctaBtn}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
