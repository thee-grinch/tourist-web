import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

export function setupAxiosInterceptors() {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL;

  axios.interceptors.request.use((config) => {
    const authStore = useAuthStore();
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  });
}