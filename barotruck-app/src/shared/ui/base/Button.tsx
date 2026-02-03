import React, { memo, useMemo } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { useAppTheme } from "@/shared/hooks/useAppTheme";

type ButtonVariant = "primary" | "accent" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = Omit<PressableProps, "style"> & {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  left?: React.ReactNode;
  right?: React.ReactNode;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
};

function getSizeTokens(size: ButtonSize) {
  switch (size) {
    case "sm":
      return { h: 36, px: 12, fontSize: 14, gap: 8 };
    case "lg":
      return { h: 52, px: 16, fontSize: 16, gap: 10 };
    default:
      return { h: 44, px: 14, fontSize: 15, gap: 10 };
  }
}

export const Button = memo(function Button({
  title,
  variant = "primary",
  size = "md",
  fullWidth,
  loading,
  disabled,
  left,
  right,
  containerStyle,
  textStyle,
  ...props
}: ButtonProps) {
  const t = useAppTheme();
  const c = t.colors;
  const sz = useMemo(() => getSizeTokens(size), [size]);

  const v = useMemo(() => {
    const base: { container: ViewStyle; text: TextStyle } = {
      container: {
        height: sz.h,
        paddingHorizontal: sz.px,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: sz.gap,
      },
      text: { fontSize: sz.fontSize, fontWeight: "800" },
    };

    if (variant === "accent") {
      return {
        container: { ...base.container, backgroundColor: c.brand.accent },
        text: { ...base.text, color: c.text.primary },
        pressedBg: c.brand.accentPressed ?? c.brand.accentHover ?? c.brand.accent,
        disabledBg: c.bg.muted,
        disabledText: c.text.secondary,
        spinner: c.text.primary,
      };
    }

    if (variant === "outline") {
      return {
        container: {
          ...base.container,
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: c.brand.primary,
        },
        text: { ...base.text, color: c.brand.primary },
        pressedBg: c.brand.primarySoft,
        disabledBg: "transparent",
        disabledText: c.text.secondary,
        spinner: c.brand.primary,
      };
    }

    if (variant === "ghost") {
      return {
        container: { ...base.container, backgroundColor: "transparent" },
        text: { ...base.text, color: c.text.primary },
        pressedBg: c.brand.primarySoft,
        disabledBg: "transparent",
        disabledText: c.text.secondary,
        spinner: c.text.primary,
      };
    }

    return {
      container: { ...base.container, backgroundColor: c.brand.primary },
      text: { ...base.text, color: c.text.inverse },
      pressedBg: c.brand.primaryPressed ?? c.brand.primaryHover ?? c.brand.primary,
      disabledBg: c.bg.muted,
      disabledText: c.text.secondary,
      spinner: c.text.inverse,
    };
  }, [variant, c, sz.h, sz.px, sz.fontSize, sz.gap]);

  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      {...props}
      style={({ pressed }) => [
        s.base,
        fullWidth && s.fullWidth,
        v.container,
        pressed && !isDisabled && { backgroundColor: v.pressedBg },
        isDisabled && { backgroundColor: v.disabledBg },
        containerStyle,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={v.spinner} />
      ) : (
        <View style={s.row}>
          {left ? <View style={s.slot}>{left}</View> : null}
          <Text
            numberOfLines={1}
            style={[v.text, isDisabled && { color: v.disabledText }, textStyle]}
          >
            {title}
          </Text>
          {right ? <View style={s.slot}>{right}</View> : null}
        </View>
      )}
    </Pressable>
  );
});

const s = StyleSheet.create({
  base: { alignSelf: "flex-start" },
  fullWidth: { alignSelf: "stretch" },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  slot: { alignItems: "center", justifyContent: "center" },
});
