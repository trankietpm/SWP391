import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3123';

export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_BASE_URL}/${imagePath}`;
};

export interface Vehicle {
  id: number;
  vehicle_model_id: number;
  station_id: number;
  battery_status: number;
  status: 'available' | 'rented' | 'maintenance';
  license_plate: string;
  images?: string[];
  date_created: string;
  vehicleModel?: {
    id: number;
    name: string;
    type: 'Xe máy điện' | 'Ô tô điện';
    price: number;
  };
  station?: {
    id: number;
    name: string;
    address: string;
    city: string;
    district: string;
  };
}

export const vehicleService = {
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

  async getAllVehicles(params?: { stationId?: number; modelId?: number }): Promise<Vehicle[]> {
    const queryParams = new URLSearchParams();
    if (params?.stationId) {
      queryParams.append('stationId', params.stationId.toString());
    }
    if (params?.modelId) {
      queryParams.append('modelId', params.modelId.toString());
    }

    const url = `${API_BASE_URL}/vehicle${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await axios.get<Vehicle[]>(url, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  },

  async getVehicleById(id: number): Promise<Vehicle> {
    const response = await axios.get<Vehicle>(`${API_BASE_URL}/vehicle/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  },

  async getVehiclesByStation(stationId: number): Promise<Vehicle[]> {
    return this.getAllVehicles({ stationId });
  },

  async getVehiclesByModel(modelId: number): Promise<Vehicle[]> {
    return this.getAllVehicles({ modelId });
  },

  async getAvailableVehicles(): Promise<Vehicle[]> {
    const allVehicles = await this.getAllVehicles();
    return allVehicles.filter(vehicle => vehicle.status === 'available');
  },

  async getRentedVehicles(): Promise<Vehicle[]> {
    const allVehicles = await this.getAllVehicles();
    return allVehicles.filter(vehicle => vehicle.status === 'rented');
  },

  async getMaintenanceVehicles(): Promise<Vehicle[]> {
    const allVehicles = await this.getAllVehicles();
    return allVehicles.filter(vehicle => vehicle.status === 'maintenance');
  },

  async createVehicle(
    data: Omit<Vehicle, 'id' | 'date_created' | 'vehicleModel' | 'station' | 'images'> & { base64Images?: string[] }
  ): Promise<Vehicle> {
    const response = await axios.post<Vehicle>(`${API_BASE_URL}/vehicle`, data, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  },

  async updateVehicle(
    id: number,
    data: Partial<Omit<Vehicle, 'id' | 'date_created' | 'vehicleModel' | 'station' | 'images'>> & { base64Images?: string[]; images?: string[] }
  ): Promise<Vehicle> {
    const response = await axios.put<Vehicle>(`${API_BASE_URL}/vehicle/${id}`, data, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  },

  async deleteVehicle(id: number): Promise<boolean> {
    try {
      await axios.delete(`${API_BASE_URL}/vehicle/${id}`, {
        headers: this.getAuthHeaders(),
      });
      return true;
    } catch {
      return false;
    }
  },
};

