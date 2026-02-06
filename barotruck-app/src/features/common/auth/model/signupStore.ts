// src/features/common/auth/model/signupStore.ts
import { create } from "zustand";

export type SignupRole = "shipper" | "driver";
export type ShipperType = "personal" | "business";

export type AccountInfo = {
  email: string;
  password: string;
  name: string;
  phone: string;
};

export type ShipperInfo = {
  type: ShipperType;
  nickname: string;

  // business only
  bizNo: string;
  companyName: string;
  ceoName: string;
};

export type SignupState = {
  role: SignupRole | null;
  account: AccountInfo;
  shipper: ShipperInfo;

  setRole: (role: SignupRole) => void;
  setAccount: (patch: Partial<AccountInfo>) => void;

  setShipperType: (type: ShipperType) => void;
  setShipper: (patch: Partial<ShipperInfo>) => void;

  reset: () => void;
};

const initialAccount: AccountInfo = {
  email: "",
  password: "",
  name: "",
  phone: "",
};

const initialShipper: ShipperInfo = {
  type: "personal",
  nickname: "",
  bizNo: "",
  companyName: "",
  ceoName: "",
};

export const useSignupStore = create<SignupState>((set) => ({
  role: null,
  account: { ...initialAccount },
  shipper: { ...initialShipper },

  setRole: (role) => set({ role }),

  setAccount: (patch) =>
    set((s) => ({
      account: { ...s.account, ...patch },
    })),

  setShipperType: (type) =>
    set((s) => ({
      shipper: {
        ...s.shipper,
        type,
        ...(type === "personal"
          ? { bizNo: "", companyName: "", ceoName: "" }
          : {}), // ✅ null 금지(런타임 버그 방지)
      },
    })),

  setShipper: (patch) =>
    set((s) => ({
      shipper: { ...s.shipper, ...patch },
    })),

  reset: () =>
    set({
      role: null,
      account: { ...initialAccount },
      shipper: { ...initialShipper },
    }),
}));
