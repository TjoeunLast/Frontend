export type Role = "SHIPPER" | "DRIVER";

export type MockUser = {
  id: string;
  role: Role;
  name: string;
  email: string; // UI용(표시/검증용)
  phone?: string;
  company?: string; // 화주용
  carType?: string; // 차주용
};

export const MOCK_USERS: Array<MockUser & { password: string }> = [
  // ✅ 화주
  {
    id: "shipper01",
    role: "SHIPPER",
    name: "바로화주",
    email: "shipper@barotruck.com",
    phone: "010-1111-2222",
    company: "바로상사",
    password: "12341234",
  },
  // ✅ 차주
  {
    id: "driver01",
    role: "DRIVER",
    name: "바로기사",
    email: "driver@barotruck.com",
    phone: "010-3333-4444",
    carType: "1톤 카고",
    password: "12341234",
  },
];

export function findMockUserByLogin(input: { emailOrId: string; password: string }) {
  const key = input.emailOrId.trim().toLowerCase();
  const pw = input.password;

  return MOCK_USERS.find((u) => {
    const idMatch = u.id.toLowerCase() === key;
    const emailMatch = u.email.toLowerCase() === key;
    return (idMatch || emailMatch) && u.password === pw;
  });
}
