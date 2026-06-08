const BASE_URL = 'http://47.98.102.162:5000/api';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
}

export interface AuthData {
  token: string;
  user: User;
}

const request = async <T = any>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: Record<string, any>,
  headers?: Record<string, string>
): Promise<ApiResponse<T>> => {
  try {
    const token = uni.getStorageSync('token');
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await uni.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      header: { ...defaultHeaders, ...headers },
    });

    if (response.statusCode === 200 || response.statusCode === 201) {
      return response.data as ApiResponse<T>;
    } else {
      return {
        success: false,
        message: response.data?.message || '请求失败',
        error: response.data?.error
      };
    }
  } catch (error) {
    return {
      success: false,
      message: '网络请求失败',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const authApi = {
  register: async (username: string, email: string, password: string): Promise<ApiResponse<AuthData>> => {
    return request<AuthData>('/auth/register', 'POST', { username, email, password });
  },

  login: async (email: string, password: string): Promise<ApiResponse<AuthData>> => {
    return request<AuthData>('/auth/login', 'POST', { email, password });
  },

  getMe: async (): Promise<ApiResponse<{ user: User }>> => {
    return request<{ user: User }>('/auth/me', 'GET');
  }
};

export interface Template {
  id: number;
  title: string;
  matrix: number[][];
  colors: Record<number, string>;
  pattern: string[];
  theme: string;
  createdAt?: string;
}

export const templateApi = {
  save: async (template: Omit<Template, 'id' | 'createdAt'>): Promise<ApiResponse<{ id: number; title: string; theme: string }>> => {
    return request<{ id: number; title: string; theme: string }>('/templates', 'POST', template);
  },

  getList: async (): Promise<ApiResponse<Template[]>> => {
    return request<Template[]>('/templates', 'GET');
  },

  delete: async (id: number): Promise<ApiResponse> => {
    return request(`/templates/${id}`, 'DELETE');
  },

  getPublic: async (): Promise<ApiResponse<Template[]>> => {
    return request<Template[]>('/templates/public', 'GET');
  }
};

export const storage = {
  setToken: (token: string) => {
    uni.setStorageSync('token', token);
  },

  getToken: (): string | null => {
    return uni.getStorageSync('token') || null;
  },

  removeToken: () => {
    uni.removeStorageSync('token');
  },

  setUser: (user: User) => {
    uni.setStorageSync('user', JSON.stringify(user));
  },

  getUser: (): User | null => {
    const userStr = uni.getStorageSync('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  removeUser: () => {
    uni.removeStorageSync('user');
  },

  clearAuth: () => {
    storage.removeToken();
    storage.removeUser();
  }
};