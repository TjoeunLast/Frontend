import React, { memo } from "react";
import { StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from "react-native";
import { useAppTheme } from "@/shared/hooks/useAppTheme";

type CardVariant = "surface" | "softPrimary" | "softAccent";

export type CardProps = ViewProps & {
  variant?: CardVariant;
  padding?: number;
  style?: StyleProp<ViewStyle>; 
};

export const Card = memo(function Card({
  variant = "surface",
  padding = 14,
  style,
  children,
  ...props
}: CardProps) {
  const t = useAppTheme();
  const c = t.colors;

  const bg =
    variant === "softPrimary"
      ? c.brand.primarySoft
      : variant === "softAccent"
      ? c.brand.accentSoft
      : c.bg.surface;

  return (
    <View
      {...props}
      style={[s.base, { backgroundColor: bg, borderColor: c.border.default, padding }, style]}
    >
      {children}
    </View>
  );
});

const s = StyleSheet.create({
  base: { borderWidth: 1, borderRadius: 16 },
});
