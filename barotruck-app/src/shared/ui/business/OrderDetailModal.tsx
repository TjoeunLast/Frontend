import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Platform,
  Linking,
  Animated,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useAppTheme } from "@/shared/hooks/useAppTheme";
import { Button } from "../base/Button";
import { IconButton } from "../base/IconButton";

type OrderDetailModalProps = {
  open: boolean;
  onClose: () => void;
  isDispatched: boolean;
  onDispatch: () => void;
  data: any;
};

export const OrderDetailModal = ({
  open,
  onClose,
  isDispatched,
  onDispatch,
  data,
}: OrderDetailModalProps) => {
  const { colors: c } = useAppTheme();
  const highlightColor = data.isInstant ? "#DC2626" : c.brand.primary;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (open) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 9,
          tension: 35,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [open]);

  return (
    <Modal
      visible={open}
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
      animationType="none"
    >
      <View style={s.fullOverlay}>
        <Animated.View
          style={[
            s.dim,
            {
              opacity: fadeAnim,
              backgroundColor: "rgba(0,0,0,0.6)",
            },
          ]}
        >
          <Pressable style={{ flex: 1 }} onPress={onClose} />
        </Animated.View>

        <Animated.View
          style={[
            s.sheet,
            {
              backgroundColor: c.bg.surface,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View
            style={[s.modalHeader, { borderBottomColor: c.border.default }]}
          >
            <Text style={s.modalTitle}>오더 정보</Text>
            <IconButton variant="ghost" size={32} onPress={onClose}>
              <Ionicons name="close" size={24} color={c.text.secondary} />
            </IconButton>
          </View>

          <ScrollView
            contentContainerStyle={s.modalContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={s.modalRoute}>
              <Text style={s.modalRouteCity}>{data.startAddr}</Text>
              <Feather name="arrow-right" size={20} color={c.text.secondary} />
              <Text style={s.modalRouteCity}>{data.endAddr}</Text>
            </View>
            <View style={s.modalDivider} />
            <DetailRow
              label="운송료"
              value={data.price}
              color={highlightColor}
              isPrice
            />
            <DetailRow label="결제방식" value={data.payMethod} />
            <DetailRow label="차량/톤수" value={data.carInfo} />
            <DetailRow
              label="화물 정보"
              value={data.cargoInfo || "파레트 14개 (5톤)"}
            />
            <DetailRow label="상차 방법" value={data.loadMethod || "지게차"} />
            <View style={s.memoBox}>
              <Text style={s.memoText}>
                <Text style={{ fontWeight: "800" }}>⚠ 화주 요청: </Text>
                {data.description ||
                  "도착 전 연락 바랍니다. 윙바디 필수입니다."}
              </Text>
            </View>
          </ScrollView>

          <View style={[s.modalFooter, { borderTopColor: c.border.default }]}>
            <View style={s.sideButtons}>
              <IconButton
                variant="outline"
                size={54}
                style={s.circleBtn}
                onPress={() => {}}
              >
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={24}
                  color={c.text.primary}
                />
              </IconButton>
              <IconButton
                variant="outline"
                size={54}
                style={s.circleBtn}
                onPress={() => Linking.openURL("tel:01012345678")}
              >
                <Ionicons
                  name="call-outline"
                  size={24}
                  color={c.text.primary}
                />
              </IconButton>
            </View>
            <Button
              title={
                isDispatched
                  ? data.isInstant
                    ? "배차 완료"
                    : "신청 완료"
                  : data.isInstant
                    ? "배차 받기"
                    : "배차 신청"
              }
              variant={
                isDispatched ? "ghost" : data.isInstant ? "danger" : "primary"
              }
              style={[
                s.mainBtn,
                isDispatched ? { backgroundColor: c.bg.muted } : null,
              ]}
              disabled={isDispatched}
              onPress={onDispatch}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const DetailRow = ({ label, value, color, isPrice }: any) => {
  const { colors: c } = useAppTheme();
  return (
    <View style={s.detailRow}>
      <Text style={[s.detailLabel, { color: c.text.secondary }]}>{label}</Text>
      <Text
        style={[
          s.detailVal,
          { color: color || c.text.primary },
          isPrice ? { fontSize: 20 } : { fontSize: 15 },
        ]}
      >
        {value}
      </Text>
    </View>
  );
};

const s = StyleSheet.create({
  fullOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  dim: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    width: "100%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: { fontSize: 18, fontWeight: "800" },
  modalContent: { padding: 24 },
  modalRoute: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalRouteCity: { fontSize: 20, fontWeight: "800" },
  modalDivider: { height: 1, backgroundColor: "#F1F5F9", marginBottom: 20 },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  detailLabel: { color: "#64748B", fontSize: 14 },
  detailVal: { fontWeight: "700", textAlign: "right", flex: 1 },
  memoBox: {
    backgroundColor: "#FFF7ED",
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  memoText: { fontSize: 13, color: "#9A3412", lineHeight: 20 },
  modalFooter: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  sideButtons: { flexDirection: "row", gap: 8 },
  circleBtn: { borderRadius: 14, borderWidth: 1.5 },
  mainBtn: { flex: 1, height: 54, borderRadius: 14 },
});
