import React, { memo } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from "react-native";
import { useAppTheme } from "@/shared/hooks/useAppTheme";
import { withAlpha } from "@/shared/utils/color";
import { Button } from "../base/Button";
import { Card } from "../base/Card";

type Action = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "accent" | "outline" | "ghost";
};

type Props = {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  primary?: Action;     // 오른쪽/강조 액션
  secondary?: Action;   // 왼쪽/취소 액션
  style?: ViewStyle;
};

export const Dialog = memo(function Dialog({
  open,
  title,
  description,
  onClose,
  primary,
  secondary,
  style,
}: Props) {
  const t = useAppTheme();
  const c = t.colors;

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.backdropWrap}>
        <Pressable style={[s.backdrop, { backgroundColor: withAlpha(c.text.primary, 0.45) }]} onPress={onClose} />

        <View style={s.center}>
          <Card padding={16} style={[s.dialog, style]}>
            <Text style={[s.title, { color: c.text.primary }]}>{title}</Text>
            {description ? (
              <Text style={[s.desc, { color: c.text.secondary }]}>{description}</Text>
            ) : null}

            <View style={s.actions}>
              {secondary ? (
                <Button
                  title={secondary.label}
                  variant={secondary.variant ?? "outline"}
                  onPress={secondary.onPress}
                  size="md"
                />
              ) : (
                <Button title="닫기" variant="outline" onPress={onClose} size="md" />
              )}

              {primary ? (
                <Button
                  title={primary.label}
                  variant={primary.variant ?? "primary"}
                  onPress={primary.onPress}
                  size="md"
                />
              ) : null}
            </View>
          </Card>
        </View>
      </View>
    </Modal>
  );
});

const s = StyleSheet.create({
  backdropWrap: { flex: 1 },
  backdrop: { ...StyleSheet.absoluteFillObject },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  dialog: { width: "100%", maxWidth: 420 },
  title: { fontSize: 16, fontWeight: "900" },
  desc: { marginTop: 8, fontSize: 13, fontWeight: "700", lineHeight: 18 },
  actions: { marginTop: 14, flexDirection: "row", gap: 10, justifyContent: "flex-end" },
});
