import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
  }
};
