import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/shared/hooks/useAppTheme";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

export default function DriverTabsLayout() {
  const t = useAppTheme();
  const c = t.colors;

  const tabBarStyle = {
    height: 84,
    paddingTop: 8,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: c.border.default,
    backgroundColor: c.bg.surface,
  } as const;

  const labelStyle = {
    fontSize: 12,
    fontWeight: "800",
    marginTop: 2,
  } as const;

  const icon = (name: IoniconName) =>
    function TabIcon({ color, size }: { color: string; size: number }) {
      return <Ionicons name={name} color={color} size={size} />;
    };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle,
        tabBarLabelStyle: labelStyle,
        tabBarActiveTintColor: c.brand.primary,
        tabBarInactiveTintColor: c.text.secondary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "홈",
          tabBarIcon: icon("home-outline"),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "오더",
          tabBarIcon: icon("list-outline"),
        }}
      />
      <Tabs.Screen
        name="driving"
        options={{
          title: "운행",
          tabBarIcon: icon("speedometer-outline"),
        }}
      />
      <Tabs.Screen
        name="settlement"
        options={{
          title: "정산",
          tabBarIcon: icon("wallet-outline"),
        }}
      />
      <Tabs.Screen
        name="my"
        options={{
          title: "더보기",
          tabBarIcon: icon("menu-outline"),
        }}
      />
    </Tabs>
  );
}
