import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8055';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
}

export interface CreateUserRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface CreateUserResponse {
  success: number;
  message: string;
}

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  first_name?: string;
  last_name?: string;
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
    const response = await axios.post(`${API_BASE_URL}/auth/login`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return {
      success: true,
      message: 'Login successful',
      token: response.data.data.access_token
    };
  },

  async createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
    await axios.post(`${API_BASE_URL}/users/`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return {
      success: 1,
      message: 'User created successfully'
    };
  },


  async getCurrentUser(token: string): Promise<UserInfo> {
    const response = await axios.get(`${API_BASE_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data.data;
  },

  async getUserProfile(userId: string, token: string): Promise<UserProfile> {
    const response = await axios.get(`${API_BASE_URL}/items/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.data.data) {
      throw new Error('Failed to fetch user profile');
    }
    
    return response.data.data;
  },

  async updateUserProfile(userId: string, profileData: UpdateUserProfileRequest, token: string): Promise<UserProfile> {
    const response = await axios.patch(`${API_BASE_URL}/users/${userId}`, profileData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.data.data) {
      throw new Error('Failed to update user profile');
    }

    return response.data.data;
  },

  async updateUser(userId: string, userData: UpdateUserProfileRequest, token: string): Promise<UserInfo> {
    const response = await axios.patch(`${API_BASE_URL}/users/${userId}`, userData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.data.data) {
      throw new Error('Failed to update user');
    }

    return response.data.data;
  }
};
