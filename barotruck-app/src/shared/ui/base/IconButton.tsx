import React, { memo } from "react";
import { Pressable, StyleSheet, View, type PressableProps, type ViewStyle } from "react-native";
import { useAppTheme } from "@/shared/hooks/useAppTheme";

type Props = Omit<PressableProps, "style"> & {
  children: React.ReactNode;
  size?: number; // default 40
  variant?: "ghost" | "soft";
  style?: ViewStyle;
};

export const IconButton = memo(function IconButton({
  children,
  size = 40,
  variant = "ghost",
  disabled,
  style,
  ...props
}: Props) {
  const t = useAppTheme();
  const c = t.colors;

  const bg = variant === "soft" ? c.bg.muted : "transparent";

  return (
    <Pressable
      disabled={disabled}
      {...props}
      style={({ pressed }) => [
        s.base,
        { width: size, height: size, borderRadius: 12, backgroundColor: bg, opacity: disabled ? 0.5 : 1 },
        pressed && !disabled && { backgroundColor: c.brand.primarySoft },
        style,
      ]}
    >
      <View style={s.center}>{children}</View>
    </Pressable>
  );
});

const s = StyleSheet.create({
  base: { alignSelf: "flex-start" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
