import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

import {
  AppLayout,
  AppTopBar,
  BottomCTA,
  Button,
  Card,
  Badge,
  Chip,
  SegmentedTabs,
  Divider,
  Dialog,
  LoadingOverlay,
  TextField,
  useToast,
} from "@/shared/ui";
import { useAppTheme } from "@/shared/hooks/useAppTheme";

type SortKey = "price" | "distance" | "latest";

export default function UiPreviewScreen() {
  const t = useAppTheme();
  const c = t.colors;
  const toast = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [chipA, setChipA] = useState(true);
  const [chipB, setChipB] = useState(false);

  const [sort, setSort] = useState<SortKey>("price");

  // TextField 테스트용
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const sortItems = useMemo(
    () => [
      { key: "price" as const, label: "고단가순" },
      { key: "distance" as const, label: "가까운순" },
      { key: "latest" as const, label: "최신순" },
    ],
    []
  );

  return (
    <View style={{ flex: 1, backgroundColor: c.bg.canvas }}>
      <AppTopBar title="UI Preview" />

      <AppLayout
        scroll
        padding={12}
        // ✅ BottomCTA가 화면 하단을 덮으니까 스크롤 여백 확보
        contentContainerStyle={{ gap: 12, paddingBottom: 140 }}
      >
        {/* Buttons */}
        <Card>
          <Text style={[s.sectionTitle, { color: c.text.primary }]}>Buttons</Text>

          <View style={s.row}>
            <Button title="Primary" onPress={() => toast.show("Primary 클릭", "info")} />
            <Button title="Accent" variant="accent" onPress={() => toast.show("Accent 클릭", "success")} />
          </View>

          <View style={s.row}>
            <Button title="Outline" variant="outline" onPress={() => toast.show("Outline 클릭")} />
            <Button title="Ghost" variant="ghost" onPress={() => toast.show("Ghost 클릭")} />
          </View>

          <View style={s.row}>
            <Button title="Small" size="sm" onPress={() => toast.show("Small")} />
            <Button title="Large" size="lg" onPress={() => toast.show("Large")} />
          </View>

          <View style={s.row}>
            <Button title="Loading" loading onPress={() => {}} />
            <Button title="Disabled" disabled onPress={() => {}} />
          </View>
        </Card>

        <Divider />

        {/* Badges */}
        <Card>
          <Text style={[s.sectionTitle, { color: c.text.primary }]}>Badges</Text>

          <View style={s.rowWrap}>
            <Badge label="Success" tone="success" />
            <Badge label="Warning" tone="warning" />
            <Badge label="Danger" tone="danger" />
            <Badge label="Info" tone="info" />
            <Badge label="Neutral" tone="neutral" />
          </View>
        </Card>

        <Divider />

        {/* Chips */}
        <Card>
          <Text style={[s.sectionTitle, { color: c.text.primary }]}>Chips</Text>

          <View style={s.rowWrap}>
            <Chip label="내 주변 오더" selected={chipA} onPress={() => setChipA((v) => !v)} />
            <Chip label="내 차종 오더" selected={chipB} onPress={() => setChipB((v) => !v)} />
          </View>

          <Text style={[s.caption, { color: c.text.secondary }]}>
            선택 상태: A={String(chipA)} / B={String(chipB)}
          </Text>
        </Card>

        <Divider />

        {/* SegmentedTabs */}
        <Card>
          <Text style={[s.sectionTitle, { color: c.text.primary }]}>SegmentedTabs</Text>
          <SegmentedTabs items={sortItems} value={sort} onChange={setSort} />
          <Text style={[s.caption, { color: c.text.secondary }]}>선택: {sort}</Text>
        </Card>

        <Divider />

        {/* TextField */}
        <Card>
          <Text style={[s.sectionTitle, { color: c.text.primary }]}>TextField</Text>

          <View style={{ gap: 10 }}>
            <TextField
              label="이메일"
              required
              placeholder="example@barotruck.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              helperText="로그인에 사용돼"
            />

            <TextField
              label="비밀번호"
              placeholder="8자 이상"
              value={pwd}
              onChangeText={setPwd}
              secureTextEntry
              errorText={pwd.length > 0 && pwd.length < 8 ? "8자 이상 입력해줘" : undefined}
            />
          </View>
        </Card>

        <Divider />

        {/* Dialog & Overlay */}
        <Card>
          <Text style={[s.sectionTitle, { color: c.text.primary }]}>Dialog / LoadingOverlay</Text>

          <View style={s.row}>
            <Button title="Dialog 열기" variant="outline" onPress={() => setDialogOpen(true)} />
            <Button
              title="로딩 표시"
              variant="accent"
              onPress={() => {
                setLoading(true);
                setTimeout(() => setLoading(false), 1200);
              }}
            />
          </View>
        </Card>

        <Divider />

        {/* Toast */}
        <Card>
          <Text style={[s.sectionTitle, { color: c.text.primary }]}>Toast</Text>

          <View style={s.rowWrap}>
            <Button title="Info" size="sm" variant="outline" onPress={() => toast.show("정보 토스트", "info")} />
            <Button title="Success" size="sm" variant="outline" onPress={() => toast.show("성공!", "success")} />
            <Button title="Warning" size="sm" variant="outline" onPress={() => toast.show("주의!", "warning")} />
            <Button title="Danger" size="sm" variant="outline" onPress={() => toast.show("에러 발생", "danger")} />
            <Button title="Neutral" size="sm" variant="outline" onPress={() => toast.show("기본 토스트")} />
          </View>
        </Card>
      </AppLayout>

      {/* ✅ 하단 고정 CTA */}
      <BottomCTA
        secondary={{
          title: "취소",
          variant: "outline",
          onPress: () => toast.show("취소", "neutral"),
        }}
        primary={{
          title: "다음",
          variant: "primary",
          onPress: () => toast.show("다음", "success"),
          disabled: email.length === 0 || pwd.length < 8,
        }}
      >
        <Text style={{ color: c.text.secondary, fontSize: 12, fontWeight: "800" }}>
          이메일/비밀번호 입력 테스트 (CTA는 하단 고정)
        </Text>
      </BottomCTA>

      {/* Dialog */}
      <Dialog
        open={dialogOpen}
        title="확인"
        description="이 작업을 진행할까?"
        onClose={() => setDialogOpen(false)}
        secondary={{
          label: "취소",
          variant: "outline",
          onPress: () => setDialogOpen(false),
        }}
        primary={{
          label: "진행",
          variant: "primary",
          onPress: () => {
            setDialogOpen(false);
            toast.show("진행했어!", "success");
          },
        }}
      />

      {/* LoadingOverlay */}
      <LoadingOverlay open={loading} label="처리 중…" />
    </View>
  );
}

const s = StyleSheet.create({
  sectionTitle: { fontSize: 14, fontWeight: "900", marginBottom: 10 },
  row: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  rowWrap: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  caption: { marginTop: 10, fontSize: 12, fontWeight: "700" },
});
