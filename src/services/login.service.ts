import axios from 'axios';
import { handleApiError } from '../utils/api-error-handler';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3123';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    user_id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    date_created: string;
  };
  message: string;
}

export interface CreateUserRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface CreateUserResponse {
  message: string;
}

export interface UserInfo {
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  date_created: string;
}

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

export interface UpdateUserProfileRequest {
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  avatar?: string;
}


export const loginService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>(`${API_BASE_URL}/user/login`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Có lỗi xảy ra khi đăng nhập');
    }
  },

  async createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
    try {
      const response = await axios.post<CreateUserResponse>(`${API_BASE_URL}/user/register`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Có lỗi xảy ra khi đăng ký');
    }
  },


  getUserIdFromToken(token: string): number {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub;
    } catch {
      throw new Error('Invalid token');
    }
  },

  async getCurrentUser(token: string): Promise<UserInfo> {
    try {
      const userId = this.getUserIdFromToken(token);
      const response = await axios.get<UserInfo>(`${API_BASE_URL}/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Có lỗi xảy ra khi lấy thông tin người dùng');
    }
  },

  async getUserProfile(userId: string, token: string): Promise<UserProfile> {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const userData = response.data;
      
      return {
        id: userData.user_id.toString(),
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        email: userData.email || '',
        phone: '',
        address: '',
        avatar: undefined
      };
    } catch (error) {
      return handleApiError(error, 'Có lỗi xảy ra khi lấy thông tin profile');
    }
  },

  async updateUserProfile(userId: string, profileData: UpdateUserProfileRequest, token: string): Promise<UserProfile> {
    try {
      const response = await axios.put(`${API_BASE_URL}/user/${userId}`, profileData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const userData = response.data;
      
      return {
        id: userData.user_id.toString(),
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        email: userData.email || '',
        phone: '',
        address: '',
        avatar: undefined
      };
    } catch (error) {
      return handleApiError(error, 'Có lỗi xảy ra khi cập nhật profile');
    }
  },

  async updateUser(userId: string, userData: UpdateUserProfileRequest, token: string): Promise<UserInfo> {
    try {
      const response = await axios.put(`${API_BASE_URL}/user/${userId}`, userData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Có lỗi xảy ra khi cập nhật người dùng');
    }
  }
};
