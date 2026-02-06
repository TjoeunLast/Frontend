// src/features/common/auth/model/authStore.ts
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type UserRole = "SHIPPER" | "DRIVER";

export type MockUser = {
  id: string;
  email: string;
  password: string; // 목업이니까 그냥 저장(실서비스 X)
  name: string;
  role: UserRole;
  createdAt: number;
};

type AuthState = {
  user: Omit<MockUser, "password"> | null;
  hydrated: boolean;

  hydrate: () => Promise<void>;
  signUp: (input: {
    email: string;
    password: string;
    name: string;
    role: UserRole;
  }) => Promise<Omit<MockUser, "password">>;
  signIn: (input: { email: string; password: string }) => Promise<Omit<MockUser, "password">>;
  signOut: () => Promise<void>;
};

const USERS_KEY = "mock_users_v1";
const CURRENT_KEY = "mock_current_user_v1";

function safeId() {
  return `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

async function loadUsers(): Promise<MockUser[]> {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as MockUser[];
  } catch {
    return [];
  }
}

async function saveUsers(users: MockUser[]) {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

async function saveCurrent(user: Omit<MockUser, "password"> | null) {
  if (!user) {
    await AsyncStorage.removeItem(CURRENT_KEY);
    return;
  }
  await AsyncStorage.setItem(CURRENT_KEY, JSON.stringify(user));
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  hydrated: false,

  hydrate: async () => {
    const raw = await AsyncStorage.getItem(CURRENT_KEY);
    if (raw) {
      try {
        const u = JSON.parse(raw);
        set({ user: u, hydrated: true });
        return;
      } catch {}
    }
    set({ user: null, hydrated: true });
  },

  signUp: async ({ email, password, name, role }) => {
    const users = await loadUsers();
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) throw new Error("이미 가입된 이메일입니다.");

    const newUser: MockUser = {
      id: safeId(),
      email: email.trim(),
      password,
      name: name.trim(),
      role,
      createdAt: Date.now(),
    };

    const next = [newUser, ...users];
    await saveUsers(next);

    const sessionUser = { ...newUser };
    delete (sessionUser as any).password;

    set({ user: sessionUser });
    await saveCurrent(sessionUser);

    return sessionUser;
  },

  signIn: async ({ email, password }) => {
    const users = await loadUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) throw new Error("가입되지 않은 이메일입니다.");
    if (found.password !== password) throw new Error("비밀번호가 올바르지 않습니다.");

    const sessionUser = { ...found };
    delete (sessionUser as any).password;

    set({ user: sessionUser });
    await saveCurrent(sessionUser);

    return sessionUser;
  },

  signOut: async () => {
    set({ user: null });
    await saveCurrent(null);
  },
}));
