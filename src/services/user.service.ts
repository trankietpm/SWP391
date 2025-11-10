import axios from 'axios';
import { handleApiError } from '../utils/api-error-handler';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3123';

export interface User {
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  date_created: string;
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

  // Get all users
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await axios.get<User[]>(`${API_BASE_URL}/user`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Có lỗi xảy ra khi lấy danh sách người dùng');
    }
  },

  // Get user by ID
  async getUserById(id: number): Promise<User> {
    try {
      const response = await axios.get<User>(`${API_BASE_URL}/user/${id}`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Có lỗi xảy ra khi lấy thông tin người dùng');
    }
  },

  // Create car rental user (ADMIN, STAFF only)
  async createCarRentalUser(data: Omit<User, 'user_id' | 'date_created' | 'role'>): Promise<User> {
    try {
      const response = await axios.post<User>(`${API_BASE_URL}/user/car_rental`, data, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Có lỗi xảy ra khi tạo người dùng');
    }
  },

  // Create staff user (ADMIN only)
  async createStaffUser(data: Omit<User, 'user_id' | 'date_created' | 'role'>): Promise<User> {
    try {
      const response = await axios.post<User>(`${API_BASE_URL}/user/staff`, data, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Có lỗi xảy ra khi tạo nhân viên');
    }
  },

  // Update user
  async updateUser(id: number, data: Partial<Omit<User, 'user_id' | 'date_created'>>): Promise<User> {
    try {
      const response = await axios.put<User>(`${API_BASE_URL}/user/${id}`, data, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Có lỗi xảy ra khi cập nhật người dùng');
    }
  },

  // Delete user
  async deleteUser(id: number): Promise<boolean> {
    try {
      await axios.delete(`${API_BASE_URL}/user/${id}`, {
        headers: this.getAuthHeaders(),
      });
      return true;
    } catch (error) {
      return handleApiError(error, 'Có lỗi xảy ra khi xóa người dùng');
    }
  }
};
