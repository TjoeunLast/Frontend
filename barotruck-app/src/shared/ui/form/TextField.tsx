import React, { memo, useCallback, useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { useAppTheme } from "@/shared/hooks/useAppTheme";
import { withAlpha } from "@/shared/utils/color";

type Props = Omit<TextInputProps, "style"> & {
  label?: string;
  helperText?: string;
  errorText?: string;
  required?: boolean;

  left?: React.ReactNode;
  right?: React.ReactNode;

  containerStyle?: StyleProp<ViewStyle>;
  inputWrapStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
};

export const TextField = memo(function TextField({
  label,
  helperText,
  errorText,
  required,

  left,
  right,

  editable = true,
  containerStyle,
  inputWrapStyle,
  inputStyle,

  onFocus,
  onBlur,
  ...props
}: Props) {
  const t = useAppTheme();
  const c = t.colors;

  const [focused, setFocused] = useState(false);
  const hasError = !!errorText;

  const handleFocus = useCallback(
    (e: any) => {
      setFocused(true);
      onFocus?.(e);
    },
    [onFocus]
  );

  const handleBlur = useCallback(
    (e: any) => {
      setFocused(false);
      onBlur?.(e);
    },
    [onBlur]
  );

  const borderColor = useMemo(() => {
    if (!editable) return c.border.default;
    if (hasError) return c.status.danger;
    if (focused) return c.brand.primary;
    return c.border.default;
  }, [editable, hasError, focused, c]);

  const bgColor = useMemo(() => {
    if (!editable) return c.bg.muted;
    return c.bg.surface;
  }, [editable, c]);

  const ringColor = useMemo(() => {
    if (!focused || hasError || !editable) return "transparent";
    return withAlpha(c.brand.primary, 0.18);
  }, [focused, hasError, editable, c]);

  const metaText = errorText ?? helperText;
  const metaColor = hasError ? c.status.danger : c.text.secondary;

  return (
    <View style={containerStyle}>
      {label ? (
        <View style={s.labelRow}>
          <Text style={[s.label, { color: c.text.primary }]}>{label}</Text>
          {required ? <Text style={[s.req, { color: c.status.danger }]}>*</Text> : null}
        </View>
      ) : null}

      <View
        style={[
          s.wrap,
          {
            backgroundColor: bgColor,
            borderColor,
            shadowColor: ringColor, // iOS ring 느낌
          },
          focused && !hasError && editable ? s.focused : null,
          inputWrapStyle,
        ]}
      >
        {left ? <View style={s.slot}>{left}</View> : null}

        <TextInput
          {...props}
          editable={editable}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={c.text.secondary}
          style={[
            s.input,
            { color: editable ? c.text.primary : c.text.secondary },
            inputStyle,
          ]}
        />

        {right ? <View style={s.slot}>{right}</View> : null}
      </View>

      {metaText ? (
        <Text style={[s.meta, { color: metaColor }]} numberOfLines={2}>
          {metaText}
        </Text>
      ) : null}
    </View>
  );
});

const s = StyleSheet.create({
  labelRow: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 6 },
  label: { fontSize: 13, fontWeight: "900" },
  req: { fontSize: 13, fontWeight: "900" },

  wrap: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  focused: {
    // ring 비슷한 느낌 (안전하게)
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
  },

  slot: { alignItems: "center", justifyContent: "center" },

  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: "800",
    paddingVertical: 12,
  },

  meta: { marginTop: 6, fontSize: 12, fontWeight: "700", lineHeight: 16 },
});
