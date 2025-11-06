import axios from 'axios';

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
  rating: number;
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
  images?: string[];
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
    const response = await axios.get<VehicleModel[]>(`${API_BASE_URL}/vehicle-model`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  },

  async getVehicleModelById(id: number): Promise<VehicleModel> {
    const response = await axios.get<VehicleModel>(`${API_BASE_URL}/vehicle-model/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  },

  async getVehicleModelsByType(type: 'Xe máy điện' | 'Ô tô điện'): Promise<VehicleModel[]> {
    const allModels = await this.getAllVehicleModels();
    return allModels.filter(model => model.type === type);
  },

  async getPopularVehicleModels(): Promise<VehicleModel[]> {
    const allModels = await this.getAllVehicleModels();
    return allModels.filter(model => model.isPopular);
  },

  async createVehicleModel(
    data: Omit<VehicleModel, 'id' | 'date_created'> & { base64Images?: string[] }
  ): Promise<VehicleModel> {
    const response = await axios.post<VehicleModel>(`${API_BASE_URL}/vehicle-model`, data, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  },

  async updateVehicleModel(
    id: number,
    data: Partial<Omit<VehicleModel, 'id' | 'date_created'>> & { base64Images?: string[] }
  ): Promise<VehicleModel> {
    const response = await axios.put<VehicleModel>(`${API_BASE_URL}/vehicle-model/${id}`, data, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  },

  async deleteVehicleModel(id: number): Promise<boolean> {
    try {
      await axios.delete(`${API_BASE_URL}/vehicle-model/${id}`, {
        headers: this.getAuthHeaders(),
      });
      return true;
    } catch {
      return false;
    }
  },
};

