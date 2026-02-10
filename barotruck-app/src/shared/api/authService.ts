import apiClient from './apiClient';
import { RegisterRequest, AuthResponse } from '../models/auth';
import * as SecureStore from 'expo-secure-store';

export const AuthService = {
  /** * 1. 회원가입 (POST /api/v1/auth/register) 
   */
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await apiClient.post('/api/v1/auth/register', data);
    return res.data;
  },

  /** * 2. 로그인 (POST /api/v1/auth/authenticate) 
   */
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await apiClient.post('/api/v1/auth/authenticate', { email, password });
    
    // 성공 시 토큰을 SecureStore에 저장
    if (res.data.access_token) {
      await SecureStore.setItemAsync('userToken', res.data.access_token);
      await SecureStore.setItemAsync('refreshToken', res.data.refresh_token);
    }
    return res.data;
  },

  /** * 3. 토큰 갱신 (POST /api/v1/auth/refresh-token) 
   */
  refreshToken: async (): Promise<void> => {
    await apiClient.post('/api/v1/auth/refresh-token');
  },

  /** * 4. 로그아웃 (로컬 저장소 비우기) 
   */
  logout: async (): Promise<void> => {
    await SecureStore.deleteItemAsync('userToken');
    await SecureStore.deleteItemAsync('refreshToken');
  }
};