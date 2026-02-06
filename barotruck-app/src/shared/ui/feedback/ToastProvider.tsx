import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "@/shared/hooks/useAppTheme";
import { withAlpha } from "@/shared/utils/color";

type ToastTone = "neutral" | "success" | "warning" | "danger" | "info";

type Toast = {
  id: string;
  message: string;
  tone: ToastTone;
};

type ToastApi = {
  show: (message: string, tone?: ToastTone) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

export function useToast() {
  const v = useContext(ToastContext);
  if (!v) throw new Error("useToast must be used within ToastProvider");
  return v;
}

export function ToastProvider({ children }: PropsWithChildren) {
  const t = useAppTheme();
  const c = t.colors;

  const [toast, setToast] = useState<Toast | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    Animated.timing(opacity, {
      toValue: 0,
      duration: 160,
      useNativeDriver: true,
    }).start(() => setToast(null));
  }, [opacity]);

  const show = useCallback(
    (message: string, tone: ToastTone = "neutral") => {
      const id = String(Date.now());
      setToast({ id, message, tone });

      Animated.timing(opacity, {
        toValue: 1,
        duration: 160,
        useNativeDriver: true,
      }).start();

      // ✅ 중복 타이머 방지
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(hide, 2200);
    },
    [hide, opacity]
  );

  const api = useMemo(() => ({ show }), [show]);

  const toneStyle = useMemo(() => {
    if (!toast) return { bg: withAlpha(c.text.primary, 0.92), fg: c.text.inverse };

    switch (toast.tone) {
      case "success":
        return { bg: c.status.success, fg: c.text.inverse };
      case "warning":
        return { bg: c.status.warning, fg: c.text.primary };
      case "danger":
        return { bg: c.status.danger, fg: c.text.inverse };
      case "info":
        return { bg: c.status.info, fg: c.text.inverse };
      default:
        return { bg: withAlpha(c.text.primary, 0.92), fg: c.text.inverse };
    }
  }, [toast, c]);

  return (
    <ToastContext.Provider value={api}>
      {children}

      {toast ? (
        // ✅ pointerEvents는 props가 아니라 style로
        // ✅ overlay는 터치 통과(box-none)가 가장 안전
        <View style={[s.portal, { pointerEvents: "box-none" as any }]}>
          <Animated.View style={[s.toast, { backgroundColor: toneStyle.bg, opacity }]}>
            <Text style={[s.text, { color: toneStyle.fg }]} numberOfLines={2}>
              {toast.message}
            </Text>
          </Animated.View>
        </View>
      ) : null}
    </ToastContext.Provider>
  );
}

const s = StyleSheet.create({
  portal: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 18,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  toast: {
    maxWidth: 520,
    width: "100%",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
  },
  text: { fontSize: 13, fontWeight: "800", lineHeight: 18 },
});
