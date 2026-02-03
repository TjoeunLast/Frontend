import React, { memo, useMemo } from "react";
import { StyleSheet, Text, View, type TextStyle, type ViewStyle } from "react-native";
import { useAppTheme } from "@/shared/hooks/useAppTheme";

export type BadgeTone = "success" | "warning" | "danger" | "info" | "neutral";

export type BadgeProps = {
  label: string;
  tone?: BadgeTone;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export const Badge = memo(function Badge({ label, tone = "neutral", style, textStyle }: BadgeProps) {
  const t = useAppTheme();
  const c = t.colors;

  const tset = useMemo(() => {
    switch (tone) {
      case "success":
        return { bg: c.status.successSoft ?? c.brand.accentSoft, fg: c.status.success };
      case "warning":
        return { bg: c.status.warningSoft ?? c.brand.accentSoft, fg: c.status.warning };
      case "danger":
        return { bg: c.status.dangerSoft ?? c.brand.primarySoft, fg: c.status.danger };
      case "info":
        return { bg: c.status.infoSoft ?? c.brand.primarySoft, fg: c.status.info };
      default:
        return { bg: c.bg.muted, fg: c.text.secondary };
    }
  }, [tone, c]);

  return (
    <View style={[s.badge, { backgroundColor: tset.bg }, style]}>
      <Text style={[s.text, { color: tset.fg }, textStyle]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
});

const s = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  text: { fontSize: 12, fontWeight: "800" },
});
