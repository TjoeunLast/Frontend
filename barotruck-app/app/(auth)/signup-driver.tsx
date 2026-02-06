import React, { useMemo, useState } from "react";
import {
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

type VehicleType = "cargo" | "top" | "wing" | "refrigerated";
type Ton = "1t" | "1.4t" | "2.5t" | "3.5t" | "5t" | "11t" | "25t";

export default function SignupDriverScreen() {
  const router = useRouter();
  const t = useAppTheme();
  const c = t.colors;

  const [carNo, setCarNo] = useState("");
  const [vehicleType, setVehicleType] = useState<VehicleType | undefined>("cargo");
  const [ton, setTon] = useState<Ton | undefined>("1t");
  const [careerYears, setCareerYears] = useState("");

  const s = useMemo(() => {
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

      row: { flexDirection: "row", alignItems: "center" } as ViewStyle,
      gap: { width: 12 } as ViewStyle,

      tfWrap: {
        minHeight: 56,
        borderRadius: 18,
        paddingHorizontal: 16,
        backgroundColor: c.bg.surface,
      } as ViewStyle,
      tfInput: {
        fontSize: 16,
        fontWeight: "800",
        paddingVertical: 0,
      } as TextStyle,

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
      ctaText: { fontSize: 18, fontWeight: "900", letterSpacing: -0.2 } as TextStyle,
    });
  }, [c]);

  const canSubmit = carNo.trim().length > 0 && !!vehicleType && !!ton && careerYears.trim().length > 0;

  const onSubmit = () => {
    // ✅ 가입 완료 → 차주 홈
    router.dismissAll();
    router.replace("/(driver)/(tabs)");
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
          <Text style={s.title}>차량 정보를{"\n"}입력해주세요.</Text>
          <Text style={s.subtitle}>정확한 배차를 위해 필요합니다.</Text>

          <View style={{ height: 18 }} />

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
                onChange={setVehicleType}
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
                onChange={setTon}
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
        <View style={[s.bottomBar, { pointerEvents: "box-none" as any }]}>
          <Button
            title="가입 완료"
            variant="primary"
            size="lg"
            fullWidth
            disabled={!canSubmit}
            onPress={onSubmit}
            containerStyle={s.ctaBtn}
            textStyle={s.ctaText}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
