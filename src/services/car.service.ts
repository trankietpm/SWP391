import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8055';

export interface Car {
  id: number;
  user_created: string;
  date_created: string;
  name: string;
  type: string;
  price: number;
  rating: number;
  features: string[];
  isPopular: boolean;
  description: string;
  availableCount: number;
  stationId: number;
  battery: string;
  range: string;
  charging: string;
  seats: string;
  topSpeed: string;
  acceleration: string;
  highlights: string[];
  images: number[];
  battery_status?: number;
}

export interface CarResponse {
  data: Car;
}

export interface CarsResponse {
  data: Car[];
}

export const carService = {
  // Get all cars
  async getAllCars(): Promise<Car[]> {
    const response = await axios.get<CarsResponse>(`${API_BASE_URL}/items/Car`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data.data;
  },

  // Get car files by car ID
  async getCarFiles(carId: number): Promise<{directus_files_id: string}[]> {
    const response = await axios.get(`${API_BASE_URL}/items/Car_files?filter[Car_id][_eq]=${carId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data.data;
  },

  // Get image URL from directus_files_id
  getImageUrl(directusFilesId: string): string {
    return `${API_BASE_URL}/assets/${directusFilesId}`;
  },

  // Upload file to Directus
  async uploadFile(file: File): Promise<string> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const formData = new FormData();
    formData.append('file', file);

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await axios.post<{ data: { id: string } }>(`${API_BASE_URL}/files`, formData, {
      headers: {
        ...headers,
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data.id;
  },

  // Filter vehicles to only show those with active stations
  getActiveVehicles(vehicles: Car[], stations: { id: number; status: string }[]): Car[] {
    return vehicles.filter(vehicle => {
      const station = stations.find(s => s.id === vehicle.stationId);
      return station && station.status === 'active';
    });
  },

  // Get car by ID (matches getVehicleById)
  async getCarById(id: number): Promise<Car | undefined> {
    try {
      const response = await axios.get<CarResponse>(`${API_BASE_URL}/items/Car/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data.data;
    } catch {
      return undefined;
    }
  },

  // Get cars by type (matches getVehiclesByType)
  async getCarsByType(type: string): Promise<Car[]> {
    const response = await axios.get<CarsResponse>(`${API_BASE_URL}/items/Car?filter[type][_eq]=${encodeURIComponent(type)}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data.data;
  },

  // Get cars by station (matches getVehiclesByStation)
  async getCarsByStation(stationId: number): Promise<Car[]> {
    const response = await axios.get<CarsResponse>(`${API_BASE_URL}/items/Car?filter[stationId][_eq]=${stationId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data.data;
  },

  // Get popular cars (matches getPopularVehicles)
  async getPopularCars(): Promise<Car[]> {
    const response = await axios.get<CarsResponse>(`${API_BASE_URL}/items/Car?filter[isPopular][_eq]=true`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data.data;
  },

  // Get available cars (matches getAvailableVehicles)
  async getAvailableCars(): Promise<Car[]> {
    const response = await axios.get<CarsResponse>(`${API_BASE_URL}/items/Car?filter[availableCount][_gt]=0`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data.data;
  },

  async createCar(data: Omit<Car, 'id' | 'user_created' | 'date_created'>): Promise<Car> {
    const response = await axios.post<CarResponse>(`${API_BASE_URL}/items/Car`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data.data;
  },

  async updateCar(id: number, data: Partial<Omit<Car, 'id' | 'user_created' | 'date_created'>>): Promise<Car> {
    const response = await axios.patch<CarResponse>(`${API_BASE_URL}/items/Car/${id}`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data.data;
  },

  async deleteCar(id: number): Promise<boolean> {
    try {
      await axios.delete(`${API_BASE_URL}/items/Car/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return true;
    } catch {
      return false;
    }
  }
};
