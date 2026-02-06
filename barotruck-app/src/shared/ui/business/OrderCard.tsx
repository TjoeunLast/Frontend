import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppTheme } from "@/shared/hooks/useAppTheme";
import { Card } from "../base/Card";
import { Badge } from "../feedback/Badge";
import { OrderDetailModal } from "./OrderDetailModal";

export type OrderCardProps = {
  startAddr: string;
  endAddr: string;
  distance?: string;
  price: string;
  payMethod: string;
  carInfo: string;
  loadDate: string;
  createdAt: string;
  driveMode?: string;
  isDirect?: boolean;
  isInstant?: boolean;
  description?: string;
  loadMethod?: string;
  cargoInfo?: string;
};

export default function OrderCard(props: OrderCardProps) {
  const {
    isInstant,
    isDirect,
    driveMode,
    createdAt,
    startAddr,
    endAddr,
    distance,
    loadDate,
    carInfo,
    price,
    payMethod,
  } = props;
  const [modalOpen, setModalOpen] = useState(false);
  const [isDispatched, setIsDispatched] = useState(false);
  const { colors: c } = useAppTheme();
  const highlightColor = isInstant ? "#DC2626" : c.brand.primary;

  const handleDispatch = () => {
    setIsDispatched(true);
  };

  return (
    <>
      <Card
        onPress={() => setModalOpen(true)}
        style={[
          s.container,
          isInstant && { borderColor: "#FECACA", backgroundColor: "#FFFBFB" },
        ]}
      >
        <View style={s.topRow}>
          <View style={s.badgeRow}>
            {isInstant ? (
              <Badge
                label="바로 배차"
                tone="urgent"
                style={{
                  marginRight: 6,
                  height: 24,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />
            ) : isDirect ? (
              <Badge
                label="직접 배차"
                tone="direct"
                style={{
                  marginRight: 6,
                  height: 24,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />
            ) : null}
            <Badge
              label={driveMode === "왕복" ? "왕복" : "편도"}
              tone={driveMode === "왕복" ? "roundTrip" : "oneWay"}
              style={{
                height: 24,
                justifyContent: "center",
                alignItems: "center",
              }}
            />
          </View>
          <Text style={[s.timeText, { color: c.text.secondary }]}>
            {createdAt}
          </Text>
        </View>

        <View style={s.routeRow}>
          <View style={s.locGroup}>
            <Text style={[s.locLabel, { color: c.text.secondary }]}>
              상차지
            </Text>

            <Text
              style={[s.locName, { color: c.text.primary }]}
              numberOfLines={1}
            >
              {startAddr}
            </Text>
          </View>
          <View style={s.arrowArea}>
            <View style={[s.distBadge, { backgroundColor: "#F1F5F9" }]}>
              <Text style={s.distText}>{distance || "-"}</Text>
            </View>
            <View style={[s.line, { backgroundColor: "#E2E8F0" }]}>
              <View style={[s.arrowHead, { borderColor: "#E2E8F0" }]} />
            </View>
          </View>
          <View style={[s.locGroup, { alignItems: "flex-end" }]}>
            <Text style={[s.locLabel, { color: c.text.secondary }]}>
              하차지
            </Text>
            <Text
              style={[s.locName, { color: c.text.primary, textAlign: "right" }]}
              numberOfLines={1}
            >
              {endAddr}
            </Text>
          </View>
        </View>
        <View style={s.bottomRow}>
          <View style={s.infoColumn}>
            <Text style={[s.loadDateText, { color: c.text.primary }]}>
              {loadDate}
            </Text>

            <Text style={[s.carText, { color: c.text.secondary }]}>
              {carInfo}
            </Text>
          </View>

          <View style={s.priceColumn}>
            <Text style={[s.priceText, { color: highlightColor }]}>
              {price}
            </Text>

            <Badge
              label={payMethod}
              tone={payMethod.includes("선착불") ? "payPrepaid" : "payDeferred"}
              style={{ alignSelf: "flex-end" }}
            />
          </View>
        </View>
      </Card>

      <OrderDetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        isDispatched={isDispatched}
        onDispatch={handleDispatch}
        data={props}
      />
    </>
  );
}

const s = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  badgeRow: { flexDirection: "row", alignItems: "center" },
  timeText: { fontSize: 12 },
  routeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  locGroup: { flex: 1.2 },
  locLabel: { fontSize: 11, marginBottom: 4 },
  locName: { fontSize: 20, fontWeight: "800" },
  arrowArea: { flex: 1, alignItems: "center", paddingHorizontal: 10 },
  distBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginBottom: 4,
  },
  distText: { fontSize: 11, fontWeight: "700", color: "#64748B" },
  line: { width: "100%", height: 1, position: "relative" },
  arrowHead: {
    position: "absolute",
    right: 0,
    top: -3,
    width: 6,
    height: 6,
    borderTopWidth: 2,
    borderRightWidth: 2,
    transform: [{ rotate: "45deg" }],
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 4,
  },
  infoColumn: { flex: 1.5, justifyContent: "center" },
  loadDateText: { fontSize: 15, fontWeight: "800", marginBottom: 4 },
  carText: { fontSize: 13, fontWeight: "500" },
  priceColumn: { flex: 1, alignItems: "flex-end", justifyContent: "flex-end" },
  priceText: {
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 6,
    textAlign: "right",
  },
});
