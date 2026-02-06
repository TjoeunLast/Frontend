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
    Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true }).start(() => {
      setToast(null);
    });
  }, [opacity]);

  const show = useCallback(
    (message: string, tone: ToastTone = "neutral") => {
      if (timerRef.current) clearTimeout(timerRef.current);

      setToast({ id: String(Date.now()), message, tone });
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();

      timerRef.current = setTimeout(() => {
        hide();
        timerRef.current = null;
      }, 2300);
    },
    [hide, opacity]
  );

  const api = useMemo(() => ({ show }), [show]);

  const toneStyle = useMemo(() => {
    if (!toast) return { bg: "rgba(30, 30, 30, 0.95)", fg: "#FFFFFF" };
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
        return { bg: "rgba(30, 30, 30, 0.95)", fg: "#FFFFFF" };
    }
  }, [toast, c]);

  return (
    <ToastContext.Provider value={api}>
      {children}

      {toast ? (
        // ✅ 절대 클릭/터치 가로채지 않게: style.pointerEvents = "none"
        <View style={[s.portal, { pointerEvents: "none" }]}>
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
    bottom: 46,
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 9999,
  },
  toast: {
    maxWidth: 420,
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    alignItems: "center",
  },
  text: { fontSize: 14, fontWeight: "700", textAlign: "center", lineHeight: 20 },
});
