// src/features/common/auth/ui/SignupDriverScreen.tsx
import React, { useMemo, useState, useCallback } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
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

function showMsg(title: string, msg: string) {
  if (Platform.OS === "web") window.alert(`${title}\n\n${msg}`);
  else Alert.alert(title, msg);
}

type Option = { label: string; value: string };

function digitsOnly(v: string) {
  return v.replace(/[^0-9]/g, "");
}
function normalizePlate(v: string) {
  return v.replace(/\s+/g, " ").trim();
}

function SelectField({
  label,
  value,
  placeholder,
  options,
  onChange,
  disabled,
}: {
  label: string;
  value: string | null;
  placeholder: string;
  options: Option[];
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const t = useAppTheme();
  const c = t.colors;

  const [open, setOpen] = useState(false);
  const selectedLabel = value ? options.find((o) => o.value === value)?.label : null;

  const s = useMemo(() => {
    return StyleSheet.create({
      wrap: {
        minHeight: 56,
        borderRadius: 16,
        paddingHorizontal: 16,
        backgroundColor: c.bg.surface,
        borderWidth: 1,
        borderColor: c.border.default,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      } as ViewStyle,
      text: { fontSize: 16, fontWeight: "800", color: c.text.primary } as TextStyle,
      placeholder: { color: c.text.secondary } as TextStyle,
      sheetBackdrop: {
        flex: 1,
        backgroundColor: withAlpha("#000000", 0.35),
        alignItems: "center",
        justifyContent: "flex-end",
      } as ViewStyle,
      sheet: {
        width: "100%",
        backgroundColor: c.bg.surface,
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        paddingTop: 10,
        paddingBottom: 16,
        borderTopWidth: 1,
        borderTopColor: withAlpha(c.border.default, 0.8),
      } as ViewStyle,
      sheetTitleRow: {
        paddingHorizontal: 18,
        paddingVertical: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      } as ViewStyle,
      sheetTitle: { fontSize: 16, fontWeight: "900", color: c.text.primary } as TextStyle,
      option: {
        paddingHorizontal: 18,
        paddingVertical: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      } as ViewStyle,
      optionText: { fontSize: 16, fontWeight: "800", color: c.text.primary } as TextStyle,
      divider: { height: 1, backgroundColor: withAlpha(c.border.default, 0.6) } as ViewStyle,
    });
  }, [c]);

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        disabled={disabled}
        style={({ pressed }) => [
          s.wrap,
          disabled && { opacity: 0.6 },
          pressed && !disabled && { backgroundColor: c.bg.muted },
        ]}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <Text style={[s.text, !selectedLabel && s.placeholder]}>
          {selectedLabel ?? placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color={c.text.secondary} />
      </Pressable>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable style={s.sheetBackdrop} onPress={() => setOpen(false)}>
          <Pressable style={s.sheet} onPress={() => {}}>
            <View style={s.sheetTitleRow}>
              <Text style={s.sheetTitle}>{label}</Text>
              <Pressable onPress={() => setOpen(false)} hitSlop={10}>
                <Ionicons name="close" size={22} color={c.text.secondary} />
              </Pressable>
            </View>

            <View style={s.divider} />

            {options.map((o) => {
              const active = o.value === value;
              return (
                <Pressable
                  key={o.value}
                  onPress={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  style={({ pressed }) => [s.option, pressed && { backgroundColor: c.bg.muted }]}
                >
                  <Text style={s.optionText}>{o.label}</Text>
                  {active ? <Ionicons name="checkmark" size={20} color={c.brand.primary} /> : null}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

export default function SignupDriverScreen() {
  const router = useRouter();
  const t = useAppTheme();
  const c = t.colors;

  // 닉네임
  const [nickname, setNickname] = useState("");
  const [nickChecked, setNickChecked] = useState(false);
  const [nickOkChecked, setNickOkChecked] = useState(false);
  const [checkingNick, setCheckingNick] = useState(false);

  // 차량 정보
  const [plateNo, setPlateNo] = useState("");
  const [carType, setCarType] = useState<string | null>(null);
  const [ton, setTon] = useState<string | null>(null);
  const [expYears, setExpYears] = useState("");

  const onChangeNickname = (v: string) => {
    setNickname(v);
    setNickChecked(false);
    setNickOkChecked(false);
  };

  const s = useMemo(() => {
    const S = { xs: 8, sm: 12, md: 16, lg: 20, xl: 24, xxl: 36 } as const;

    return StyleSheet.create({
      screen: { flex: 1, backgroundColor: c.bg.surface } as ViewStyle,

      header: { paddingHorizontal: S.lg, paddingTop: S.md, paddingBottom: S.md } as ViewStyle,
      backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" } as ViewStyle,

      titleWrap: { paddingHorizontal: S.lg, paddingTop: S.sm } as ViewStyle,
      title: { fontSize: 30, fontWeight: "900", letterSpacing: -0.4, color: c.text.primary, lineHeight: 38 } as TextStyle,
      subtitle: { marginTop: 10, fontSize: 16, fontWeight: "700", color: c.text.secondary, lineHeight: 22 } as TextStyle,

      form: { paddingHorizontal: S.lg, paddingTop: S.xl, paddingBottom: 140 } as ViewStyle,

      label: { fontSize: 14, fontWeight: "900", color: c.text.secondary, marginBottom: 8 } as TextStyle,

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

      helper: { marginTop: 8, fontSize: 13, fontWeight: "800", color: c.text.secondary } as TextStyle,

      grid2: { flexDirection: "row", alignItems: "center" } as ViewStyle,
      col: { flex: 1 } as ViewStyle,

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
      submitBtn: {
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

  const nickFormatOk = nickname.trim().length >= 2;
  const plateOk = normalizePlate(plateNo).length >= 6;
  const expOk = digitsOnly(expYears).length > 0;

  const canSubmit =
    nickFormatOk &&
    nickChecked &&
    nickOkChecked &&
    plateOk &&
    !!carType &&
    !!ton &&
    expOk;

  const onCheckNickname = useCallback(async () => {
    if (!nickFormatOk) {
      showMsg("닉네임 확인", "닉네임은 2글자 이상 입력해주세요.");
      return;
    }
    try {
      setCheckingNick(true);

      // ✅ 목업 중복확인 로직 (나중에 API로 교체)
      await new Promise((r) => setTimeout(r, 350));
      const bad = ["admin", "관리자", "test", "테스트"];
      const ok = !bad.includes(nickname.trim().toLowerCase());

      setNickChecked(true);
      setNickOkChecked(ok);

      if (ok) showMsg("사용 가능", "사용 가능한 닉네임이에요.");
      else showMsg("중복", "이미 사용 중인 닉네임이에요.");
    } catch (e: any) {
      showMsg("오류", e?.message ?? "중복확인에 실패했어요.");
    } finally {
      setCheckingNick(false);
    }
  }, [nickFormatOk, nickname]);

  const onSubmit = () => {
    if (!canSubmit) {
      showMsg("입력 확인", "필수 입력/중복확인이 완료됐는지 확인해주세요.");
      return;
    }

    // ✅ 여기서 서버에 차주 추가정보 저장 후 성공 시 홈 이동
    // driverApi.completeSignup({ nickname, plateNo, carType, ton, expYears: Number(digitsOnly(expYears)) })

    router.replace("/(driver)/(tabs)");
  };

  const carTypeOptions: Option[] = [
    { label: "카고", value: "CARGO" },
    { label: "윙바디", value: "WING" },
    { label: "탑차", value: "TOP" },
    { label: "냉동/냉장", value: "COLD" },
    { label: "리프트", value: "LIFT" },
  ];

  const tonOptions: Option[] = [
    { label: "1톤", value: "1T" },
    { label: "1.4톤", value: "1_4T" },
    { label: "2.5톤", value: "2_5T" },
    { label: "3.5톤", value: "3_5T" },
    { label: "5톤", value: "5T" },
    { label: "8톤", value: "8T" },
    { label: "11톤", value: "11T" },
    { label: "25톤", value: "25T" },
  ];

  return (
    <SafeAreaView style={s.screen} edges={["top", "bottom"]}>
      <View style={s.header}>
        <Pressable onPress={() => router.back()} style={s.backBtn} hitSlop={10}>
          <Ionicons name="arrow-back" size={26} color={c.text.primary} />
        </Pressable>
      </View>

      <View style={s.titleWrap}>
        <Text style={s.title}>차량 정보를{"\n"}입력해주세요.</Text>
        <Text style={s.subtitle}>정확한 배차를 위해 필수입니다.</Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.select({ ios: "padding", android: undefined })} style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={s.form}
        >
          {/* 닉네임 + 중복확인 */}
          <Text style={s.label}>닉네임</Text>
          <View style={s.row}>
            <View style={{ flex: 1 }}>
              <TextField
                value={nickname}
                onChangeText={onChangeNickname}
                placeholder="앱에서 사용할 닉네임"
                autoCapitalize="none"
                inputWrapStyle={s.tfWrap}
                inputStyle={s.tfInput}
                errorText={nickname.length > 0 && !nickFormatOk ? "닉네임은 2글자 이상 입력해주세요." : undefined}
              />
            </View>
            <View style={s.rowGap} />
            <Pressable
              style={[s.miniBtn, (checkingNick || !nickFormatOk) && { opacity: 0.6 }]}
              onPress={onCheckNickname}
              disabled={checkingNick || !nickFormatOk}
            >
              <Text style={s.miniBtnText}>{checkingNick ? "확인중..." : "중복확인"}</Text>
            </Pressable>
          </View>

          {nickChecked ? (
            <Text style={[s.helper, { color: nickOkChecked ? c.status.success : c.status.danger }]}>
              {nickOkChecked ? "사용 가능한 닉네임이에요." : "이미 사용 중인 닉네임이에요."}
            </Text>
          ) : null}

          <View style={{ height: 16 }} />

          {/* 차량 번호 */}
          <Text style={s.label}>차량 번호</Text>
          <TextField
            value={plateNo}
            onChangeText={setPlateNo}
            placeholder="예: 80아 1234"
            autoCapitalize="none"
            inputWrapStyle={s.tfWrap}
            inputStyle={s.tfInput}
          />

          <View style={{ height: 16 }} />

          {/* 차종 / 톤수 (2열) */}
          <View style={s.grid2}>
            <View style={s.col}>
              <Text style={s.label}>차종</Text>
              <SelectField
                label="차종"
                value={carType}
                placeholder="카고"
                options={carTypeOptions}
                onChange={setCarType}
              />
            </View>
            <View style={s.rowGap} />
            <View style={s.col}>
              <Text style={s.label}>톤수</Text>
              <SelectField
                label="톤수"
                value={ton}
                placeholder="1톤"
                options={tonOptions}
                onChange={setTon}
              />
            </View>
          </View>

          <View style={{ height: 16 }} />

          {/* 경력(년) */}
          <Text style={s.label}>경력 (년)</Text>
          <TextField
            value={expYears}
            onChangeText={setExpYears}
            placeholder="예: 3"
            keyboardType="number-pad"
            inputWrapStyle={s.tfWrap}
            inputStyle={s.tfInput}
            errorText={expYears.length > 0 && digitsOnly(expYears).length === 0 ? "숫자만 입력해주세요." : undefined}
          />
        </ScrollView>

        <View style={s.bottomBar} pointerEvents="box-none">
          <Button
            title="가입 완료"
            variant="primary"
            size="lg"
            fullWidth
            disabled={!canSubmit}
            onPress={onSubmit}
            style={s.submitBtn}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
