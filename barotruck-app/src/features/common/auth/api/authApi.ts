import { AuthService } from "@/shared/api/authService";
import { UserService } from "@/shared/api/userService";
import type { RegisterRequest, AuthResponse } from "@/shared/models/auth";
import { useAuthStore } from "@/features/common/auth/model/authStore";
import type { SignupDriver, SignupShipper } from "@/features/common/auth/model/signupStore";

const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK_AUTH === "true";

const toAuthResponse = (): AuthResponse => ({
  access_token: "mock-access",
  refresh_token: "mock-refresh",
  user_id: 0,
});

const buildMockShipper = (data: RegisterRequest): SignupShipper | undefined => {
  if (!data.shipper) return undefined;
  return {
    type: "business",
    nickname: data.nickname,
    bizNo: data.shipper.bizRegNum ?? "",
    companyName: data.shipper.companyName ?? "",
    ceoName: data.shipper.representative ?? "",
  };
};

const buildMockDriver = (data: RegisterRequest): SignupDriver | undefined => {
  if (!data.driver) return undefined;
  return {
    nickname: data.nickname,
    carNo: data.driver.carNum ?? "",
    vehicleType: "cargo",
    ton: "1t",
    careerYears: "",
  };
};

export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    if (USE_MOCK) {
      await useAuthStore.getState().signIn({ email, password, remember: true });
      return toAuthResponse();
    }
    return AuthService.login(email, password);
  },
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    if (USE_MOCK) {
      await useAuthStore.getState().signUp({
        email: data.email,
        password: data.password ?? "",
        name: data.nickname?.trim() || "사용자",
        role: data.role,
        remember: true,
        shipper: buildMockShipper(data),
        driver: buildMockDriver(data),
      });
      return toAuthResponse();
    }
    return AuthService.register(data);
  },
  checkEmail: async (email: string): Promise<boolean> => {
    if (USE_MOCK) {
      return useAuthStore.getState().checkEmailAvailable(email);
    }
    return AuthService.checkEmailAvailable(email);
  },
  checkNickname: async (nickname: string): Promise<boolean> => {
    if (USE_MOCK) {
      return useAuthStore.getState().checkNicknameAvailable(nickname);
    }
    const isDuplicated = await UserService.checkNickname(nickname);
    return !isDuplicated;
  },
};
