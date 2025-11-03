import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8055';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  status: string;
  date_created: string;
  last_access: string;
}

export interface UserResponse {
  data: User;
}

export interface UsersResponse {
  data: User[];
}

export const userService = {
  // Get auth headers
  getAuthHeaders(): Record<string, string> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  // Get all users with specific role
  async getAllUsers(): Promise<User[]> {
    const response = await axios.get<UsersResponse>(`${API_BASE_URL}/users`, {
      params: {
        filter: {
          role: {
            _eq: 'roles/2a8be411-9ba6-48ad-a48b-b119096b97f8'
          }
        }
      },
      headers: this.getAuthHeaders(),
    });
    return response.data.data;
  },

  // Get user by ID
  async getUserById(id: string): Promise<User> {
    const response = await axios.get<UserResponse>(`${API_BASE_URL}/users/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data.data;
  },

  // Create user
  async createUser(data: Omit<User, 'id' | 'date_created' | 'last_access'>): Promise<User> {
    const response = await axios.post<UserResponse>(`${API_BASE_URL}/users`, data, {
      headers: this.getAuthHeaders(),
    });
    return response.data.data;
  },

  // Update user
  async updateUser(id: string, data: Partial<Omit<User, 'id' | 'date_created' | 'last_access'>>): Promise<User> {
    const response = await axios.patch<UserResponse>(`${API_BASE_URL}/users/${id}`, data, {
      headers: this.getAuthHeaders(),
    });
    return response.data.data;
  },

  // Delete user
  async deleteUser(id: string): Promise<boolean> {
    try {
      await axios.delete(`${API_BASE_URL}/users/${id}`, {
        headers: this.getAuthHeaders(),
      });
      return true;
    } catch {
      return false;
    }
  }
};
