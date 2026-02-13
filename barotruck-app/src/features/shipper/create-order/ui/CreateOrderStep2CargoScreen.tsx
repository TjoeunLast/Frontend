import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { useAppTheme } from "@/shared/hooks/useAppTheme";
import { Button } from "@/shared/ui/base/Button";
import { Card } from "@/shared/ui/base/Card";
import { Chip } from "@/shared/ui/form/Chip";

import { clearCreateOrderDraft, getCreateOrderDraft } from "@/features/shipper/create-order/model/createOrderDraft";
import { addLocalShipperOrder } from "@/features/shipper/home/model/localShipperOrders";

const SP = { pageX: 16, sectionGap: 18, chipGap: 10 };

function won(n: number) {
  const v = Math.max(0, Math.round(n));
  return `${v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원`;
}

function toKoreanDateTextFromISO(iso: string) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

function TopBar({ title, onBack }: { title: string; onBack: () => void }) {
  const { colors: c } = useAppTheme();
  return (
    <View style={[s.topBar, { borderBottomColor: c.border.default, backgroundColor: c.bg.canvas }]}>
      <Pressable onPress={onBack} style={s.backBtn}>
        <Ionicons name="chevron-back" size={22} color={c.text.primary} />
      </Pressable>
      <Text style={[s.topTitle, { color: c.text.primary }]}>{title}</Text>
      <View style={{ width: 40 }} />
    </View>
  );
}

export function ShipperCreateOrderStep2CargoScreen() {
  const t = useAppTheme();
  const c = t.colors;
  const router = useRouter();

  const draft = getCreateOrderDraft();

  React.useEffect(() => {
    if (!draft) router.back();
  }, [draft, router]);

  const loadMethodOptions = useMemo(() => ["독차", "혼적"], []);
  const workToolOptions = useMemo(() => ["지게차", "수작업", "크레인", "호이스트"], []);

  const [loadMethod, setLoadMethod] = useState<"독차" | "혼적">("독차");
  const [workTool, setWorkTool] = useState<string>("지게차");
  const [memo, setMemo] = useState("");
  const [photos, setPhotos] = useState(draft?.photos ?? []);
  const [loading, setLoading] = useState(false);

  const fee = useMemo(() => {
    if (!draft) return 0;
    return draft.pay === "card" ? Math.round(draft.appliedFare * 0.1) : 0;
  }, [draft]);

  const totalPay = useMemo(() => (draft ? draft.appliedFare + fee : 0), [draft, fee]);

  const addPhoto = () => Alert.alert("TODO", "이미지 선택(Expo ImagePicker) 연결");
  const removePhoto = (id: string) => setPhotos((prev) => prev.filter((p) => p.id !== id));

  const submitFinal = () => {
    if (!draft) return;

    setLoading(true);
    try {
      addLocalShipperOrder({
        id: `local_${Date.now()}`,
        status: "MATCHING",
        from: draft.startSelected,
        to: draft.endAddr,
        distanceKm: draft.distanceKm,
        cargoSummary: `${draft.ton.label} ${draft.carType.label} · ${loadMethod} · ${workTool}`,
        priceWon: draft.appliedFare,
        updatedAtLabel: "방금 전",
      });

      clearCreateOrderDraft();
      Alert.alert("등록 완료", "홈 화면으로 이동합니다.");
      router.replace("/(shipper)/(tabs)");
    } catch {
      Alert.alert("오류", "등록 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (!draft) return null;

  return (
    <View style={[s.page, { backgroundColor: c.bg.canvas }]}>
      <TopBar title="화물 상세" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* 요약 */}
        <Card padding={16} style={{ marginBottom: SP.sectionGap }}>
          <View style={s.summaryTop}>
            <Text style={[s.summaryTitle, { color: c.text.primary }]}>요약</Text>
            <View style={[s.summaryPill, { backgroundColor: c.brand.primarySoft }]}>
              <Text style={[s.summaryPillText, { color: c.brand.primary }]}>{draft.distanceKm}km</Text>
            </View>
          </View>

          <View style={s.summaryRow}>
            <Text style={[s.summaryLabel, { color: c.text.secondary }]}>상차</Text>
            <Text style={[s.summaryValue, { color: c.text.primary }]} numberOfLines={1}>
              {draft.startSelected}
            </Text>
          </View>

          <View style={s.summaryRow}>
            <Text style={[s.summaryLabel, { color: c.text.secondary }]}>하차</Text>
            <Text style={[s.summaryValue, { color: c.text.primary }]} numberOfLines={1}>
              {draft.endAddr}
            </Text>
          </View>

          <View style={[s.hr, { backgroundColor: c.border.default }]} />

          <View style={s.summaryRow}>
            <Text style={[s.summaryLabel, { color: c.text.secondary }]}>상차일</Text>
            <Text style={[s.summaryValue, { color: c.text.primary }]}>
              {toKoreanDateTextFromISO(draft.loadDateISO)} ({draft.loadDay})
            </Text>
          </View>

          <View style={s.summaryRow}>
            <Text style={[s.summaryLabel, { color: c.text.secondary }]}>차량</Text>
            <Text style={[s.summaryValue, { color: c.text.primary }]}>
              {draft.ton.label} · {draft.carType.label}
            </Text>
          </View>

          <View style={[s.hr, { backgroundColor: c.border.default }]} />

          <View style={s.summaryRow}>
            <Text style={[s.summaryLabel, { color: c.text.secondary }]}>희망 운임</Text>
            <Text style={[s.summaryMoney, { color: c.text.primary }]}>{won(draft.appliedFare)}</Text>
          </View>
        </Card>

        {/* 작업 정보 */}
        <Card padding={16} style={{ marginBottom: SP.sectionGap }}>
          <Text style={[s.sectionTitle, { color: c.text.primary }]}>작업 정보</Text>

          <Text style={[s.fieldLabel, { color: c.text.primary }]}>적재 방식</Text>
          <View style={s.chipRow}>
            {loadMethodOptions.map((x) => (
              <Chip key={x} label={x} selected={loadMethod === x} onPress={() => setLoadMethod(x as any)} />
            ))}
          </View>

          <View style={{ height: 14 }} />

          <Text style={[s.fieldLabel, { color: c.text.primary }]}>상하차 도구</Text>
          <View style={s.chipRow}>
            {workToolOptions.map((x) => (
              <Chip key={x} label={x} selected={workTool === x} onPress={() => setWorkTool(x)} />
            ))}
          </View>
        </Card>

        {/* 요청사항 */}
        <Card padding={16} style={{ marginBottom: SP.sectionGap }}>
          <Text style={[s.sectionTitle, { color: c.text.primary }]}>요청사항</Text>

          <View style={s.tagWrap}>
            {draft.requestTags.map((tag) => (
              <Chip key={tag} label={`#${tag}`} selected onPress={() => {}} />
            ))}
          </View>

          {draft.requestText.trim() ? (
            <View style={[s.noteBox, { backgroundColor: c.bg.surface, borderColor: c.border.default }]}>
              <Text style={[s.noteText, { color: c.text.primary }]}>{draft.requestText}</Text>
            </View>
          ) : null}

          <View style={{ height: 12 }} />

          <Text style={[s.fieldLabel, { color: c.text.primary }]}>추가 메모</Text>
          <View style={[s.inputWrapMulti, { backgroundColor: c.bg.surface, borderColor: c.border.default }]}>
            <TextInput
              value={memo}
              onChangeText={setMemo}
              placeholder="예) 입구가 좁아 1톤만 진입 가능 / 경비실 연락 필요 등"
              placeholderTextColor={c.text.secondary}
              style={[s.inputMulti, { color: c.text.primary }]}
              multiline
            />
          </View>
        </Card>

        {/* 사진 */}
        <Card padding={16} style={{ marginBottom: SP.sectionGap }}>
          <Text style={[s.sectionTitle, { color: c.text.primary }]}>사진 첨부</Text>

          <View style={s.photoRow}>
            <Pressable onPress={addPhoto} style={[s.photoBox, { borderColor: c.border.default, backgroundColor: c.bg.surface }]}>
              <Ionicons name="camera-outline" size={18} color={c.text.secondary} />
              <Text style={[s.photoText, { color: c.text.secondary }]}>사진 추가</Text>
            </Pressable>

            {photos.map((p) => (
              <Pressable
                key={p.id}
                onLongPress={() => removePhoto(p.id)}
                style={[s.photoBox, { borderColor: c.border.default, backgroundColor: c.bg.muted }]}
              >
                <Ionicons name="image-outline" size={18} color={c.text.secondary} />
                <Text style={[s.photoText, { color: c.text.secondary }]}>{p.name}</Text>
                <Text style={[s.photoHint, { color: c.text.secondary }]}>길게 눌러 삭제</Text>
              </Pressable>
            ))}
          </View>
        </Card>

        <View style={{ height: 150 }} />
      </ScrollView>

      {/* 하단 고정 */}
      <View style={[s.bottomBar, { backgroundColor: c.bg.canvas, borderTopColor: c.border.default }]}>
        <View style={[s.stickySummary, { borderColor: c.border.default, backgroundColor: c.bg.surface }]}>
          <View style={s.stickyRow}>
            <Text style={[s.stickyLabel, { color: c.text.secondary }]}>최종 결제 금액</Text>
            <Text style={[s.stickyTotal, { color: c.text.primary }]}>{won(totalPay)}</Text>
          </View>
          <View style={s.stickySubRow}>
            <Text style={[s.stickySub, { color: c.text.secondary }]}>희망 운임 {won(draft.appliedFare)}</Text>
            <Text style={[s.stickySub, { color: c.text.secondary }]}>
              {draft.pay === "card" ? `수수료 +${won(fee)}` : "수수료 0원"}
            </Text>
          </View>
        </View>

        <Button title="등록 완료" onPress={submitFinal} fullWidth loading={loading} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1 },
  content: { padding: SP.pageX, paddingBottom: 24 },

  topBar: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SP.pageX,
    borderBottomWidth: 1,
  },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  topTitle: { fontSize: 16, fontWeight: "900" },

  sectionTitle: { fontSize: 14, fontWeight: "900", marginBottom: 12 },
  fieldLabel: { fontSize: 13, fontWeight: "800", marginBottom: 8 },

  summaryTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  summaryTitle: { fontSize: 14, fontWeight: "900" },
  summaryPill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  summaryPillText: { fontSize: 12, fontWeight: "900" },

  summaryRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10, marginTop: 8 },
  summaryLabel: { fontSize: 12, fontWeight: "800", width: 44 },
  summaryValue: { flex: 1, fontSize: 13, fontWeight: "900", textAlign: "right" },
  summaryMoney: { fontSize: 14, fontWeight: "900" },

  hr: { height: 1, marginTop: 12 },

  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: SP.chipGap },
  tagWrap: { flexDirection: "row", flexWrap: "wrap", gap: SP.chipGap },

  noteBox: { marginTop: 10, borderWidth: 1, borderRadius: 14, padding: 12 },
  noteText: { fontSize: 13, fontWeight: "700", lineHeight: 18 },

  inputWrapMulti: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, minHeight: 110 },
  inputMulti: { fontSize: 14, fontWeight: "700", height: 110, textAlignVertical: "top" },

  photoRow: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 10 },
  photoBox: {
    width: "48%",
    height: 80,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 10,
  },
  photoText: { fontSize: 12, fontWeight: "900" },
  photoHint: { fontSize: 10, fontWeight: "800" },

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: SP.pageX,
    borderTopWidth: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    gap: 10,
  },
  stickySummary: { borderRadius: 16, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 8 },
  stickyRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  stickyLabel: { fontSize: 12, fontWeight: "900" },
  stickyTotal: { fontSize: 18, fontWeight: "900" },
  stickySubRow: { marginTop: 2, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  stickySub: { fontSize: 12, fontWeight: "800" },
});
