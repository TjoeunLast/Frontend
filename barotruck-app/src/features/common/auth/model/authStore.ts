// src/features/common/auth/model/authStore.ts

import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { SignupDriver, SignupShipper } from "@/features/common/auth/model/signupStore";

export type UserRole = "SHIPPER" | "DRIVER";

export type StoredUser = {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  shipper?: SignupShipper;
  driver?: SignupDriver;
  createdAt: number;
};

type SignUpInput = {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  shipper?: SignupShipper;
  driver?: SignupDriver;
  remember?: boolean;
};

type SignInInput = {
  email: string;
  password: string;
  remember?: boolean;
};

type AuthState = {
  user: StoredUser | null;
  users: StoredUser[];

  hydrate: () => Promise<void>;
  signUp: (input: SignUpInput) => Promise<StoredUser>;
  signIn: (input: SignInInput) => Promise<StoredUser>;
  signOut: () => Promise<void>;

  checkEmailAvailable: (email: string) => Promise<boolean>;
  checkNicknameAvailable: (nickname: string) => Promise<boolean>;

  // ✅ 비밀번호 찾기(목업)
  requestPasswordReset: (email: string) => Promise<void>;
  resetPasswordWithCode: (input: {
    email: string;
    code: string;
    newPassword: string;
  }) => Promise<void>;
};

const K_USERS = "barotruck.users.v1";
const K_SESSION = "barotruck.session.v1";
const K_RESET = "barotruck.reset.v1"; // ✅ 추가

type ResetTicket = {
  email: string;
  code: string;
  expiresAt: number;
};

function uid() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}
function normEmail(v: string) {
  return v.trim().toLowerCase();
}
function normNick(v: string) {
  return v.trim().toLowerCase();
}
function genCode6() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function loadUsers(): Promise<StoredUser[]> {
  const raw = await AsyncStorage.getItem(K_USERS);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredUser[]) : [];
  } catch {
    return [];
  }
}

async function saveUsers(users: StoredUser[]) {
  await AsyncStorage.setItem(K_USERS, JSON.stringify(users));
}

async function loadSession(): Promise<StoredUser | null> {
  const raw = await AsyncStorage.getItem(K_SESSION);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

async function saveSession(user: StoredUser | null) {
  if (!user) {
    await AsyncStorage.removeItem(K_SESSION);
    return;
  }
  await AsyncStorage.setItem(K_SESSION, JSON.stringify(user));
}

async function loadResetTicket(): Promise<ResetTicket | null> {
  const raw = await AsyncStorage.getItem(K_RESET);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ResetTicket;
  } catch {
    return null;
  }
}

async function saveResetTicket(ticket: ResetTicket | null) {
  if (!ticket) {
    await AsyncStorage.removeItem(K_RESET);
    return;
  }
  await AsyncStorage.setItem(K_RESET, JSON.stringify(ticket));
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  users: [],

  hydrate: async () => {
    const [users, session] = await Promise.all([loadUsers(), loadSession()]);
    set({ users, user: session });
  },

  checkEmailAvailable: async (email: string) => {
    const e = normEmail(email);
    const users = get().users.length ? get().users : await loadUsers();
    return !users.some((u) => normEmail(u.email) === e);
  },

  checkNicknameAvailable: async (nickname: string) => {
    const n = normNick(nickname);
    if (!n) return false;

    const users = get().users.length ? get().users : await loadUsers();
    const taken = users.some((u) => {
      const shipNick = u.shipper?.nickname ? normNick(u.shipper.nickname) : "";
      const drvNick = u.driver?.nickname ? normNick(u.driver.nickname) : "";
      return shipNick === n || drvNick === n;
    });

    return !taken;
  },

  signUp: async (input) => {
    const email = normEmail(input.email);
    const password = input.password;
    const name = input.name.trim();
    const remember = !!input.remember;

    if (!email || !password || !name) {
      throw new Error("필수 정보가 누락됐어요.");
    }

    const users = await loadUsers();
    if (users.some((u) => normEmail(u.email) === email)) {
      throw new Error("이미 가입된 이메일이에요.");
    }

    if (input.role === "DRIVER" && input.driver?.nickname) {
      const ok = await get().checkNicknameAvailable(input.driver.nickname);
      if (!ok) throw new Error("이미 사용 중인 닉네임이에요.");
    }
    if (input.role === "SHIPPER" && input.shipper?.nickname) {
      const ok = await get().checkNicknameAvailable(input.shipper.nickname);
      if (!ok) throw new Error("이미 사용 중인 닉네임이에요.");
    }

    const newUser: StoredUser = {
      id: uid(),
      email,
      password,
      name,
      role: input.role,
      shipper: input.shipper,
      driver: input.driver,
      createdAt: Date.now(),
    };

    const nextUsers = [newUser, ...users];
    await saveUsers(nextUsers);

    if (remember) await saveSession(newUser);
    else await saveSession(null);

    set({ users: nextUsers, user: newUser });
    return newUser;
  },

  signIn: async ({ email, password, remember }) => {
    const e = normEmail(email);
    const pw = password;

    if (!e || !pw) throw new Error("이메일과 비밀번호를 입력해주세요.");

    const users = await loadUsers();
    const found = users.find((u) => normEmail(u.email) === e);

    if (!found) throw new Error("가입되지 않은 이메일이에요.");
    if (found.password !== pw) throw new Error("비밀번호가 올바르지 않아요.");

    if (remember) await saveSession(found);
    else await saveSession(null);

    set({ users, user: found });
    return found;
  },

  signOut: async () => {
    await saveSession(null);
    set({ user: null });
  },

  // ----------------------------
  // ✅ 비밀번호 찾기(목업)
  // ----------------------------
  requestPasswordReset: async (email: string) => {
    const e = normEmail(email);
    if (!e) throw new Error("이메일을 입력해주세요.");

    const users = await loadUsers();
    const found = users.find((u) => normEmail(u.email) === e);
    if (!found) throw new Error("가입되지 않은 이메일이에요.");

    const code = genCode6();
    const ticket: ResetTicket = {
      email: e,
      code,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10분
    };
    await saveResetTicket(ticket);

    // ✅ 목업: 콘솔에서 인증번호 확인
    console.log(`[MOCK] reset code for ${e}: ${code}`);
  },

  resetPasswordWithCode: async ({ email, code, newPassword }) => {
    const e = normEmail(email);
    const c = code.trim();
    const pw = newPassword;

    if (!e || !c || !pw) throw new Error("필수 값이 누락됐어요.");
    if (pw.length < 8) throw new Error("비밀번호는 8자리 이상이어야 해요.");

    const ticket = await loadResetTicket();
    if (!ticket) throw new Error("인증요청을 먼저 해주세요.");
    if (Date.now() > ticket.expiresAt) throw new Error("인증번호가 만료됐어요. 다시 요청해주세요.");
    if (ticket.email !== e) throw new Error("인증요청한 이메일과 달라요.");
    if (ticket.code !== c) throw new Error("인증번호가 올바르지 않아요.");

    const users = await loadUsers();
    const idx = users.findIndex((u) => normEmail(u.email) === e);
    if (idx < 0) throw new Error("가입되지 않은 이메일이에요.");

    const next = [...users];
    next[idx] = { ...next[idx], password: pw };
    await saveUsers(next);

    // 세션은 유지하지 않음(비번 바꾸면 다시 로그인)
    await saveSession(null);
    set({ users: next, user: null });

    await saveResetTicket(null);
  },
}));
