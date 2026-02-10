import { create } from "zustand";

export type SignupRole = "shipper" | "driver";

export type SignupAccount = {
  email: string;
  password: string;
  name: string;
  phone: string;
};

export type ShipperType = "personal" | "business";
export type SignupShipper = {
  type: ShipperType;
  nickname: string;
  bizNo: string;
  companyName: string;
  ceoName: string;
};

export type VehicleType = "cargo" | "top" | "wing" | "refrigerated";
export type Ton = "1t" | "1.4t" | "2.5t" | "3.5t" | "5t" | "11t" | "25t";

export type SignupDriver = {
  nickname: string;
  carNo: string;
  vehicleType: VehicleType;
  ton: Ton;
  careerYears: string; // 문자열 유지(입력값 그대로), 필요하면 number로 변환해서 쓰기
};

export type SignupState = {
  role: SignupRole | null;
  account: SignupAccount;
  shipper: SignupShipper;
  driver: SignupDriver;

  setRole: (role: SignupRole) => void;
  setAccount: (v: Partial<SignupAccount>) => void;

  setShipperType: (type: ShipperType) => void;
  setShipper: (v: Partial<SignupShipper>) => void;

  setDriver: (v: Partial<SignupDriver>) => void;

  reset: () => void;
};

const initialAccount: SignupAccount = {
  email: "",
  password: "",
  name: "",
  phone: "",
};

const initialShipper: SignupShipper = {
  type: "personal",
  nickname: "",
  bizNo: "",
  companyName: "",
  ceoName: "",
};

const initialDriver: SignupDriver = {
  nickname: "",
  carNo: "",
  vehicleType: "cargo",
  ton: "1t",
  careerYears: "",
};

export const useSignupStore = create<SignupState>((set) => ({
  role: null,
  account: initialAccount,
  shipper: initialShipper,
  driver: initialDriver,

  setRole: (role) => set({ role }),
  setAccount: (v) => set((s) => ({ account: { ...s.account, ...v } })),

  setShipperType: (type) => set((s) => ({ shipper: { ...s.shipper, type } })),
  setShipper: (v) => set((s) => ({ shipper: { ...s.shipper, ...v } })),

  setDriver: (v) => set((s) => ({ driver: { ...s.driver, ...v } })),

  reset: () =>
    set({
      role: null,
      account: initialAccount,
      shipper: initialShipper,
      driver: initialDriver,
    }),
}));
