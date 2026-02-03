import React, { memo } from "react";
import { View, type ViewStyle } from "react-native";
import { useAppTheme } from "@/shared/hooks/useAppTheme";

export const Divider = memo(function Divider({
  inset = 0,
  style,
}: {
  inset?: number;
  style?: ViewStyle;
}) {
  const t = useAppTheme();
  const c = t.colors;

  return (
    <View
      style={[
        { height: 1, backgroundColor: c.border.default, marginLeft: inset, marginRight: inset },
        style,
      ]}
    />
  );
});
