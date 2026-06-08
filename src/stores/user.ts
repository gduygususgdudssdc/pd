import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authApi, storage, type User } from '@/utils/api';

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const isLoading = ref(false);

  const isLoggedIn = computed(() => !!token.value && !!user.value);

  const initAuth = () => {
    const storedToken = storage.getToken();
    const storedUser = storage.getUser();
    
    if (storedToken && storedUser) {
      token.value = storedToken;
      user.value = storedUser;
    }
  };

  const login = async (email: string, password: string) => {
    isLoading.value = true;
    
    try {
      const response = await authApi.login(email, password);
      
      if (response.success && response.data) {
        token.value = response.data.token;
        user.value = response.data.user;
        
        storage.setToken(response.data.token);
        storage.setUser(response.data.user);
        
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      return { success: false, message: '登录失败，请稍后重试' };
    } finally {
      isLoading.value = false;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    isLoading.value = true;
    
    try {
      const response = await authApi.register(username, email, password);
      
      if (response.success && response.data) {
        token.value = response.data.token;
        user.value = response.data.user;
        
        storage.setToken(response.data.token);
        storage.setUser(response.data.user);
        
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      return { success: false, message: '注册失败，请稍后重试' };
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    storage.clearAuth();
  };

  const fetchUser = async () => {
    if (!token.value) return;
    
    isLoading.value = true;
    
    try {
      const response = await authApi.getMe();
      
      if (response.success && response.data) {
        user.value = response.data.user;
        storage.setUser(response.data.user);
      } else {
        logout();
      }
    } catch (error) {
      logout();
    } finally {
      isLoading.value = false;
    }
  };

  return {
    user,
    token,
    isLoading,
    isLoggedIn,
    initAuth,
    login,
    register,
    logout,
    fetchUser
  };
});