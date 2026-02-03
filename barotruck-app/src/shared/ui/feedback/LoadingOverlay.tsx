import React, { memo } from "react";
import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "@/shared/hooks/useAppTheme";
import { withAlpha } from "@/shared/utils/color";
import { Card } from "../base/Card";

export const LoadingOverlay = memo(function LoadingOverlay({
  open,
  label = "처리 중…",
}: {
  open: boolean;
  label?: string;
}) {
  const t = useAppTheme();
  const c = t.colors;

  return (
    <Modal visible={open} transparent animationType="fade">
      <View style={s.wrap}>
        <View style={[s.backdrop, { backgroundColor: withAlpha(c.text.primary, 0.35) }]} />
        <Card padding={16} style={s.box}>
          <ActivityIndicator />
          <Text style={[s.text, { color: c.text.primary }]}>{label}</Text>
        </Card>
      </View>
    </Modal>
  );
});

const s = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  backdrop: { ...StyleSheet.absoluteFillObject },
  box: { width: 220, alignItems: "center", gap: 10 },
  text: { fontSize: 13, fontWeight: "800" },
});
