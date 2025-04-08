// stores/auth.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const token = ref(localStorage.getItem('token'));
  const router = useRouter();

  const login = async (credentials) => {
    try {
      const response = await axios.post('/api/auth/login', credentials);
      user.value = response.data.user;
      token.value = response.data.token;
      localStorage.setItem('token', token.value);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
      router.push('/dashboard');
    } catch (error) {
      throw error.response.data.message;
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    router.push('/login');
  };

  const checkAuth = async () => {
    if (token.value) {
      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
        const response = await axios.get('/api/auth/me');
        user.value = response.data;
      } catch (error) {
        logout();
      }
    }
  };

  return { user, token, login, logout, checkAuth };
});