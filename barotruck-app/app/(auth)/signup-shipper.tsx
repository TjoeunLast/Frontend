import React, { useMemo } from "react";
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

export default function SignupShipperScreen() {
  const router = useRouter();
  const t = useAppTheme();
  const c = t.colors;

  const shipper = useSignupStore((s) => s.shipper);
  const account = useSignupStore((s) => s.account);
  const role = useSignupStore((s) => s.role);

  const setShipper = useSignupStore((s) => s.setShipper);
  const setShipperType = useSignupStore((s) => s.setShipperType);

  const isBusiness = shipper.type === "business";

  const styles = useMemo(() => {
    return StyleSheet.create({
      screen: { flex: 1, backgroundColor: c.bg.surface } as ViewStyle,

      header: {
        paddingHorizontal: 18,
        paddingTop: 10,
        paddingBottom: 6,
      } as ViewStyle,
      backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
      } as ViewStyle,

      content: {
        paddingHorizontal: 18,
        paddingTop: 8,
        paddingBottom: 140,
      } as ViewStyle,

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
      segBtn: {
        flex: 1,
        height: 42,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
      } as ViewStyle,
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

      tfWrap: {
        minHeight: 54,
        borderRadius: 16,
        paddingHorizontal: 16,
        backgroundColor: c.bg.surface,
        borderWidth: 1,
        borderColor: c.border.default,
      } as ViewStyle,
      tfInput: {
        fontSize: 16,
        fontWeight: "800",
      } as TextStyle,

      row: { flexDirection: "row", alignItems: "center" } as ViewStyle,
      rowGap: { width: 12 } as ViewStyle,

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
      miniBtnText: { fontSize: 15, fontWeight: "900", color: c.text.primary } as TextStyle,

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
      ctaText: { fontSize: 18, fontWeight: "900", letterSpacing: -0.2 } as TextStyle,
    });
  }, [c]);

  const onLookupBiz = () => {
    Alert.alert("조회", "사업자번호 조회는 API 연결 단계에서 붙일게요.");
  };

  const canSubmit = (() => {
    if (!shipper.nickname.trim()) return false;
    if (!isBusiness) return true;
    return (
      shipper.bizNo.trim().length > 0 &&
      shipper.companyName.trim().length > 0 &&
      shipper.ceoName.trim().length > 0
    );
  })();

  const onSubmit = () => {
    // 여기서 role/account/shipper 합쳐서 API로 보내면 됨
    Alert.alert(
      "가입 완료(목업)",
      `role=${role}\nemail=${account.email}\nnickname=${shipper.nickname}`
    );
    // router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={10}>
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
          contentContainerStyle={styles.content}
        >
          <Text style={styles.title}>화주 정보를{"\n"}입력해주세요.</Text>
          <Text style={styles.subtitle}>개인 화주인지 사업자 화주인지 선택해주세요.</Text>

          <View style={styles.segWrap}>
            <Pressable
              onPress={() => setShipperType("personal")}
              style={[styles.segBtn, shipper.type === "personal" ? styles.segSelected : null]}
            >
              <Text
                style={[
                  styles.segText,
                  { color: shipper.type === "personal" ? c.text.primary : c.text.secondary },
                ]}
              >
                개인
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setShipperType("business")}
              style={[styles.segBtn, shipper.type === "business" ? styles.segSelected : null]}
            >
              <Text
                style={[
                  styles.segText,
                  { color: shipper.type === "business" ? c.text.primary : c.text.secondary },
                ]}
              >
                사업자
              </Text>
            </Pressable>
          </View>

          <View style={{ height: 18 }} />

          <TextField
            label="닉네임"
            value={shipper.nickname}
            onChangeText={(v) => setShipper({ nickname: v })}
            placeholder="앱에서 사용할 닉네임"
            autoCapitalize="none"
            inputWrapStyle={styles.tfWrap}
            inputStyle={styles.tfInput}
          />

          {isBusiness ? (
            <>
              <View style={{ height: 16 }} />

              <Text style={{ color: c.text.primary, fontWeight: "900", fontSize: 13, marginBottom: 6 }}>
                사업자 등록번호
              </Text>

              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <TextField
                    value={shipper.bizNo}
                    onChangeText={(v) => setShipper({ bizNo: v })}
                    placeholder="숫자만 입력"
                    keyboardType="number-pad"
                    inputWrapStyle={styles.tfWrap}
                    inputStyle={styles.tfInput}
                  />
                </View>

                <View style={styles.rowGap} />

                <Pressable onPress={onLookupBiz} style={styles.miniBtn}>
                  <Text style={styles.miniBtnText}>조회</Text>
                </Pressable>
              </View>

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
            title="가입 완료"
            variant="primary"
            size="lg"
            fullWidth
            disabled={!canSubmit}
            onPress={onSubmit}
            containerStyle={styles.ctaBtn}
            textStyle={styles.ctaText}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
