import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8055';

export interface Station {
  id: number;
  status: string;
  user_created: string;
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
  description: string;
  city: string;
  district: string;
}

export interface StationResponse {
  data: Station;
}

export interface StationsResponse {
  data: Station[];
}

export const stationService = {
  async getStationById(id: number): Promise<Station | undefined> {
    try {
      const response = await axios.get<StationResponse>(`${API_BASE_URL}/items/Station/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data.data;
    } catch {
      return undefined;
    }
  },

  async getAllStations(): Promise<Station[]> {
    const response = await axios.get<StationsResponse>(`${API_BASE_URL}/items/Station`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data.data;
  },

  async getActiveStations(): Promise<Station[]> {
    const response = await axios.get<StationsResponse>(`${API_BASE_URL}/items/Station?filter[status][_eq]=active`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data.data;
  },

  async getStationsByCity(city: string): Promise<Station[]> {
    const response = await axios.get<StationsResponse>(`${API_BASE_URL}/items/Station?filter[city][_eq]=${encodeURIComponent(city)}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data.data;
  },

  async getStationsByDistrict(district: string): Promise<Station[]> {
    const response = await axios.get<StationsResponse>(`${API_BASE_URL}/items/Station?filter[district][_eq]=${encodeURIComponent(district)}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data.data;
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
  }
};
