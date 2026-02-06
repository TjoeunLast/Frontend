import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAppTheme } from "@/shared/hooks/useAppTheme";

export default function Index() {
  const router = useRouter();
  const t = useAppTheme();
  const c = t.colors;

  useEffect(() => {
    // 뒤로가기 시 index로 돌아오지 않게 replace
    router.replace("/(auth)/login");
  }, [router]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: c.bg.canvas,
      }}
    >
      <ActivityIndicator />
    </View>
  );
}
