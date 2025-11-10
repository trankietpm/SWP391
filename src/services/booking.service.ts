import axios from 'axios';
import { handleApiError } from '../utils/api-error-handler';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3123';

export interface Booking {
  id: number;
  user_id: number;
  vehicle_id: number;
  station_id: number;
  start_date: string;
  end_date: string;
  actual_start_date?: string;
  actual_end_date?: string;
  total_days: number;
  daily_price?: number;
  total_price: number;
  additional_fee?: Array<{
    name: string;
    money: number;
  }>;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled' | 'overdue' | 'completed_with_fee';
  payment_method: 'vnpay' | 'cash';
  payment_status: 'pending' | 'paid' | 'refunded';
  transaction_id?: string;
  odometer_start?: number;
  odometer_end?: number;
  battery_status_start?: number;
  battery_status_end?: number;
  vehicle_condition_pickup?: string;
  vehicle_condition_return?: string;
  cancellation_reason?: string;
  refund_amount?: number;
  images?: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  cancelled_at?: string;
}

export interface CreateBookingRequest {
  user_id: number;
  vehicle_id: number;
  station_id: number;
  start_date: string;
  end_date: string;
  total_days: number;
  daily_price: number;
  total_price: number;
  payment_method: 'vnpay' | 'cash';
  notes?: string;
  bankCode?: string; 
}

export interface UpdateBookingRequest {
  user_id?: number;
  vehicle_id?: number;
  station_id?: number;
  start_date?: string;
  end_date?: string;
  total_days?: number;
  daily_price?: number;
  total_price?: number;
  payment_method?: 'vnpay' | 'cash';
  status?: Booking['status'];
  payment_status?: Booking['payment_status'];
  actual_start_date?: string;
  actual_end_date?: string;
  battery_status_end?: number;
  odometer_start?: number;
  odometer_end?: number;
  vehicle_condition_pickup?: string;
  vehicle_condition_return?: string;
  additional_fee?: Array<{
    name: string;
    money: number;
  }>;
  cancellation_reason?: string;
  refund_amount?: number;
  images?: string[];
  notes?: string;
}

export interface PickupBookingRequest {
  odometer_start?: number;
  battery_status_start?: number;
  vehicle_condition_pickup?: string;
  notes?: string;
}

class BookingService {
  private baseUrl = `${API_BASE_URL}/booking`;

  private getAuthHeaders(): Record<string, string> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }


  async getAllBookings(): Promise<Booking[]> {
    const response = await axios.get<Booking[]>(this.baseUrl, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async getBookingById(id: number): Promise<Booking> {
    const response = await axios.get<Booking>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async getBookingsByUser(userId: number): Promise<Booking[]> {
    const response = await axios.get<Booking[]>(`${this.baseUrl}/user/${userId}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async getBookingsByVehicle(vehicleId: number): Promise<Booking[]> {
    const response = await axios.get<Booking[]>(`${this.baseUrl}/vehicle/${vehicleId}`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async createBooking(bookingData: CreateBookingRequest): Promise<Booking | { paymentUrl: string }> {
    try {
      const response = await axios.post<Booking | { paymentUrl: string }>(this.baseUrl, bookingData, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Có lỗi xảy ra khi tạo booking');
    }
  }

  async createBookingByAdmin(bookingData: CreateBookingRequest): Promise<Booking> {
    try {
      const response = await axios.post<Booking>(`${this.baseUrl}/admin`, bookingData, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Có lỗi xảy ra khi tạo booking');
    }
  }

  async updateBooking(id: number, updateData: UpdateBookingRequest): Promise<Booking> {
    try {
      const response = await axios.put<Booking>(`${this.baseUrl}/${id}`, updateData, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Có lỗi xảy ra khi cập nhật booking');
    }
  }

  async deleteBooking(id: number): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${id}`, {
        headers: this.getAuthHeaders(),
      });
    } catch (error) {
      handleApiError(error, 'Có lỗi xảy ra khi xóa booking');
    }
  }

  async pickupBooking(id: number, pickupData: PickupBookingRequest): Promise<Booking> {
    try {
      const response = await axios.post<Booking>(`${this.baseUrl}/${id}/pickup`, pickupData, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Có lỗi xảy ra khi nhận xe');
    }
  }
}

export const bookingService = new BookingService();
