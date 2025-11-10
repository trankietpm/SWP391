import axios from 'axios';
import { handleApiError } from '../utils/api-error-handler';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3123';

export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_BASE_URL}/${imagePath}`;
};

export interface VehicleModel {
  id: number;
  name: string;
  type: 'Xe máy điện' | 'Ô tô điện';
  price: number;
  features: string[];
  isPopular: boolean;
  description?: string;
  battery: string;
  range: string;
  charging: string;
  seats: string;
  topSpeed: string;
  acceleration: string;
  highlights: string[];
  date_created: string;
}

export const vehicleModelService = {
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

  async getAllVehicleModels(): Promise<VehicleModel[]> {
    try {
      const response = await axios.get<VehicleModel[]>(`${API_BASE_URL}/vehicle-model`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Có lỗi xảy ra khi lấy danh sách mẫu xe');
    }
  },


  async createVehicleModel(
    data: Omit<VehicleModel, 'id' | 'date_created'>
  ): Promise<VehicleModel> {
    try {
      const response = await axios.post<VehicleModel>(`${API_BASE_URL}/vehicle-model`, data, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Có lỗi xảy ra khi tạo mẫu xe');
    }
  },

  async updateVehicleModel(
    id: number,
    data: Partial<Omit<VehicleModel, 'id' | 'date_created'>>
  ): Promise<VehicleModel> {
    try {
      const response = await axios.put<VehicleModel>(`${API_BASE_URL}/vehicle-model/${id}`, data, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Có lỗi xảy ra khi cập nhật mẫu xe');
    }
  },

  async deleteVehicleModel(id: number): Promise<boolean> {
    try {
      await axios.delete(`${API_BASE_URL}/vehicle-model/${id}`, {
        headers: this.getAuthHeaders(),
      });
      return true;
    } catch (error) {
      return handleApiError(error, 'Có lỗi xảy ra khi xóa mẫu xe');
    }
  },
};

