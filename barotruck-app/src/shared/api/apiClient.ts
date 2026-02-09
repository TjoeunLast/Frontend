import axios from 'axios';
import * as SecureStore from 'expo-secure-store'; // 또는 AsyncStorage

const apiClient = axios.create({
  // 로컬 IP 주소 사용 권장 (예: http://192.168.x.x:8080)
  baseURL: 'http://192.168.0.15:8081', 
});

// 요청 인터셉터: 모든 API 요청 직전에 실행됨
apiClient.interceptors.request.use(
  async (config) => {
    // 저장소에서 JWT 토큰 가져오기
    const token = await SecureStore.getItemAsync('userToken');
    
    if (token) {
      // 헤더에 Authorization 추가
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;