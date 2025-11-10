import axios from 'axios';
import { handleApiError } from '../utils/api-error-handler';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3123';

export interface Station {
  id: number;
  status: string;
  date_created: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  manager: string;
  capacity: number;
  lat: number;
  lng: number;
  openingHours: string;
  services: string[];
  description?: string;
  city: string;
  district: string;
}

export const stationService = {
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

  async getStationById(id: number): Promise<Station | undefined> {
    try {
      const response = await axios.get<Station>(`${API_BASE_URL}/station/${id}`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Có lỗi xảy ra khi lấy thông tin trạm');
    }
  },

  async getAllStations(): Promise<Station[]> {
    try {
      const response = await axios.get<Station[]>(`${API_BASE_URL}/station`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Có lỗi xảy ra khi lấy danh sách trạm');
    }
  },

  async getActiveStations(): Promise<Station[]> {
    const allStations = await this.getAllStations();
    return allStations.filter(station => station.status === 'active');
  },

  async getStationsByCity(city: string): Promise<Station[]> {
    const allStations = await this.getAllStations();
    return allStations.filter(station => station.city === city);
  },

  async getStationsByDistrict(district: string): Promise<Station[]> {
    const allStations = await this.getAllStations();
    return allStations.filter(station => station.district === district);
  },

  calculateStationVehicles(stationId: number, allVehicles: { stationId: number }[]): number {
    return allVehicles
      .filter(vehicle => vehicle.stationId === stationId)
      .length;
  },

  calculateStationAvailableVehicles(stationId: number, allVehicles: { stationId: number; availableCount: number }[]): number {
    return allVehicles
      .filter(vehicle => vehicle.stationId === stationId)
      .reduce((total, vehicle) => total + vehicle.availableCount, 0);
  },

  async createStation(data: Omit<Station, 'id' | 'date_created'>): Promise<Station> {
    try {
      const response = await axios.post<Station>(`${API_BASE_URL}/station`, data, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Có lỗi xảy ra khi tạo trạm');
    }
  },

  async updateStation(id: number, data: Partial<Omit<Station, 'id' | 'date_created'>>): Promise<Station> {
    try {
      const response = await axios.put<Station>(`${API_BASE_URL}/station/${id}`, data, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Có lỗi xảy ra khi cập nhật trạm');
    }
  },

  async deleteStation(id: number): Promise<boolean> {
    try {
      await axios.delete(`${API_BASE_URL}/station/${id}`, {
        headers: this.getAuthHeaders(),
      });
      return true;
    } catch (error) {
      return handleApiError(error, 'Có lỗi xảy ra khi xóa trạm');
    }
  }
};
