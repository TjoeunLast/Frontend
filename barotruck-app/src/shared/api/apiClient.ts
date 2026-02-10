import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from "react-native";
import { tokenStorage } from "@/shared/utils/tokenStorage";

// 개발 서버의 호스트 주소(IP)를 자동으로 가져옵니다.
const debuggerHost = Constants.expoConfig?.hostUri?.split(':').shift();
const envBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
const webHost =
  typeof window !== "undefined" && window.location?.hostname
    ? window.location.hostname
    : "localhost";
const baseURL =
  envBaseUrl ||
  (Platform.OS === "web"
    ? `http://${webHost}:8080`
    : `http://${debuggerHost}:8080`);
const apiClient = axios.create({
  // 로컬 IP 주소 사용 권장 (예: http://192.168.x.x:8080)
  baseURL,
});

// 요청 인터셉터: 모든 API 요청 직전에 실행됨
apiClient.interceptors.request.use(
  async (config) => {
    // 저장소에서 JWT 토큰 가져오기
    const token = await tokenStorage.getItem('userToken');
    
    if (token) {
      // 헤더에 Authorization 추가
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
