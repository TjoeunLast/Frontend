import { create } from "zustand";

export type Role = "SHIPPER" | "DRIVER";

export type AuthUser = {
  id?: string | number;
  role?: Role;
  nickname?: string;
  email?: string;
  phone?: string;

  // 필요하면 백엔드 /me 응답에 맞춰 계속 확장
  [key: string]: any;
};

type AuthState = {
  user: AuthUser | null;
  isAuthed: boolean;

  setUser: (u: AuthUser | null) => void;
  setIsAuthed: (v: boolean) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthed: false,

  setUser: (u) => set({ user: u }),
  setIsAuthed: (v) => set({ isAuthed: v }),

  logout: () => set({ user: null, isAuthed: false }),
}));
