import apiClient from './apiClient';
import { RegisterRequest, AuthResponse } from '../models/auth';
import * as SecureStore from 'expo-secure-store';
import { USE_MOCK } from '@/shared/config/mock';

type MockRole = 'DRIVER' | 'SHIPPER';
type MockAuthUser = {
  user_id: number;
  email: string;
  password: string;
  phone: string;
  nickname: string;
  role: MockRole;
};

const MOCK_USERS_KEY = 'baro_mock_auth_users';
const MOCK_SESSION_KEY = 'baro_mock_auth_session';

async function readMockUsers(): Promise<MockAuthUser[]> {
  const raw = await SecureStore.getItemAsync(MOCK_USERS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as MockAuthUser[];
  } catch {
    return [];
  }
}

async function writeMockUsers(users: MockAuthUser[]): Promise<void> {
  await SecureStore.setItemAsync(MOCK_USERS_KEY, JSON.stringify(users));
}

async function setMockSession(user: MockAuthUser): Promise<void> {
  await SecureStore.setItemAsync(MOCK_SESSION_KEY, JSON.stringify(user));
}

function makeMockError(message: string): never {
  throw { response: { data: { message } } };
}

function getSeedUsers(): MockAuthUser[] {
  return [
    {
      user_id: 1,
      email: 'shipper@barotruck.com',
      password: '12341234',
      phone: '01000000001',
      nickname: '바로화주',
      role: 'SHIPPER',
    },
    {
      user_id: 2,
      email: 'driver@barotruck.com',
      password: '12341234',
      phone: '01000000002',
      nickname: '바로기사',
      role: 'DRIVER',
    },
  ];
}

async function readUsersWithSeed(): Promise<MockAuthUser[]> {
  const stored = await readMockUsers();
  if (stored.length > 0) return stored;
  const seeded = getSeedUsers();
  await writeMockUsers(seeded);
  return seeded;
}

export const AuthService = {
  /** * 1. 회원가입 (POST /api/v1/auth/register) 
   */
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    if (USE_MOCK) {
      const users = await readUsersWithSeed();
      const email = data.email.trim().toLowerCase();

      if (users.some((u) => u.email.toLowerCase() === email)) {
        makeMockError('이미 사용 중인 이메일이에요.');
      }

      const role: MockRole = data.role === 'DRIVER' ? 'DRIVER' : 'SHIPPER';
      const newUser: MockAuthUser = {
        user_id: Date.now(),
        email,
        password: data.password ?? '',
        phone: data.phone,
        nickname: data.nickname,
        role,
      };

      const nextUsers = [...users, newUser];
      await writeMockUsers(nextUsers);
      await setMockSession(newUser);

      const mockResponse: AuthResponse = {
        access_token: `mock_access_${newUser.user_id}`,
        refresh_token: `mock_refresh_${newUser.user_id}`,
        user_id: newUser.user_id,
      };

      await SecureStore.setItemAsync('userToken', mockResponse.access_token);
      await SecureStore.setItemAsync('refreshToken', mockResponse.refresh_token);
      return mockResponse;
    }

    const res = await apiClient.post('/api/v1/auth/register', data);

    // ✅ [수정] 회원가입 응답으로 받은 토큰을 여기서 바로 저장해야 합니다!
    if (res.data.access_token) {
      await SecureStore.setItemAsync('userToken', res.data.access_token);
      await SecureStore.setItemAsync('refreshToken', res.data.refresh_token);
    }

    return res.data;
  },

  /** * 2. 로그인 (POST /api/v1/auth/authenticate) 
   */
  login: async (email: string, password: string): Promise<AuthResponse> => {
    if (USE_MOCK) {
      const users = await readUsersWithSeed();
      const normalizedEmail = email.trim().toLowerCase();
      const found = users.find((u) => u.email.toLowerCase() === normalizedEmail && u.password === password);

      if (!found) {
        makeMockError('로그인 정보를 확인해주세요.');
      }

      await setMockSession(found);

      const mockResponse: AuthResponse = {
        access_token: `mock_access_${found.user_id}`,
        refresh_token: `mock_refresh_${found.user_id}`,
        user_id: found.user_id,
      };

      await SecureStore.setItemAsync('userToken', mockResponse.access_token);
      await SecureStore.setItemAsync('refreshToken', mockResponse.refresh_token);
      return mockResponse;
    }

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
    if (USE_MOCK) return;
    await apiClient.post('/api/v1/auth/refresh-token');
  },

  /** * 4. 로그아웃 (로컬 저장소 비우기) 
   */
  logout: async (): Promise<void> => {
    await SecureStore.deleteItemAsync('userToken');
    await SecureStore.deleteItemAsync('refreshToken');
    if (USE_MOCK) {
      await SecureStore.deleteItemAsync(MOCK_SESSION_KEY);
    }
  }
};
