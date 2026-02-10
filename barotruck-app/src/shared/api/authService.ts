import apiClient from './apiClient';
import { RegisterRequest, AuthResponse } from '../models/auth';
import { tokenStorage } from "@/shared/utils/tokenStorage";

export const AuthService = {
  /** * 1. 회원가입 (POST /api/v1/auth/register) 
   */
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await apiClient.post('/api/v1/auth/register', data);
    if (res.data?.access_token) {
      await tokenStorage.setItem('userToken', res.data.access_token);
      await tokenStorage.setItem('refreshToken', res.data.refresh_token);
    }
    return res.data;
  },

  /** * 2. 로그인 (POST /api/v1/auth/authenticate) 
   */
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await apiClient.post('/api/v1/auth/authenticate', { email, password });
    
    // 성공 시 토큰을 SecureStore에 저장
    if (res.data.access_token) {
      await tokenStorage.setItem('userToken', res.data.access_token);
      await tokenStorage.setItem('refreshToken', res.data.refresh_token);
    }
    return res.data;
  },

  /** * 2-1. 이메일 중복 확인 (GET /api/v1/auth/check-email) 
   */
  checkEmailAvailable: async (email: string): Promise<boolean> => {
    const res = await apiClient.get('/api/v1/auth/check-email', { params: { email } });
    const data = res.data ?? {};
    if (typeof data.available === 'boolean') return data.available;
    if (typeof data.isDuplicated === 'boolean') return !data.isDuplicated;
    return true;
  },

  /** * 3. 토큰 갱신 (POST /api/v1/auth/refresh-token) 
   */
  refreshToken: async (): Promise<void> => {
    await apiClient.post('/api/v1/auth/refresh-token');
  },

  /** * 4. 로그아웃 (로컬 저장소 비우기) 
   */
  logout: async (): Promise<void> => {
    await tokenStorage.deleteItem('userToken');
    await tokenStorage.deleteItem('refreshToken');
  }
};
