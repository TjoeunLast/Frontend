import React, { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "@/shared/hooks/useAppTheme";

export type SegmentedItem<T extends string> = { key: T; label: string };

type Props<T extends string> = {
  items: SegmentedItem<T>[];
  value: T;
  onChange: (next: T) => void;
};

function SegmentedTabsInner<T extends string>({ items, value, onChange }: Props<T>) {
  const t = useAppTheme();
  const c = t.colors;

  return (
    <View style={[s.wrap, { backgroundColor: c.bg.surface, borderColor: c.border.default }]}>
      {items.map((it) => {
        const selected = it.key === value;

        return (
          <Pressable
            key={it.key}
            onPress={() => onChange(it.key)}
            style={({ pressed }) => [
              s.item,
              selected && { backgroundColor: c.brand.primarySoft },
              pressed && !selected && { backgroundColor: c.bg.muted },
            ]}
          >
            <Text style={[s.label, { color: selected ? c.brand.primary : c.text.secondary }]}>
              {it.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// ✅ memo는 제네릭이 깨지기 쉬워서, "타입 안전하게" export를 이렇게 처리
export const SegmentedTabs = memo(SegmentedTabsInner) as unknown as <
  T extends string
>(
  props: Props<T>
) => React.ReactElement;

const s = StyleSheet.create({
  wrap: { flexDirection: "row", borderWidth: 1, borderRadius: 14, padding: 4 },
  item: {
    flex: 1,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  label: { fontSize: 13, fontWeight: "900" },
});
