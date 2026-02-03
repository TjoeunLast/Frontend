import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "@/shared/hooks/useAppTheme";
import { Button } from "../base/Button";

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onPressAction?: () => void;
};

export const EmptyState = memo(function EmptyState({
  title,
  description,
  actionLabel,
  onPressAction,
}: EmptyStateProps) {
  const t = useAppTheme();
  const c = t.colors;

  return (
    <View style={s.wrap}>
      <Text style={[s.title, { color: c.text.primary }]}>{title}</Text>
      {description ? <Text style={[s.desc, { color: c.text.secondary }]}>{description}</Text> : null}
      {actionLabel && onPressAction ? (
        <View style={{ marginTop: 12 }}>
          <Button title={actionLabel} variant="primary" onPress={onPressAction} />
        </View>
      ) : null}
    </View>
  );
});

const s = StyleSheet.create({
  wrap: { padding: 20, alignItems: "center", gap: 8 },
  title: { fontSize: 16, fontWeight: "900" },
  desc: { fontSize: 13, fontWeight: "700", textAlign: "center", lineHeight: 18 },
});
