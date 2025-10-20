import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8055';

export interface Booking {
  id: number;
  status: string;
  date_created: string;
  user_id: string | null;
  start_date: string;
  end_date: string;
  car_id: number | null;
  total_days: number;
  daily_price: number;
  total_price: number;
}

export interface CreateBookingRequest {
  user_id: string;
  start_date: string;
  end_date: string;
  car_id: number;
  total_days: number;
  daily_price: number;
  total_price: number;
}

export interface BookingResponse {
  data: Booking;
}

class BookingService {
  private baseUrl = `${API_BASE_URL}/items/Booking_car`;

  async createBooking(bookingData: CreateBookingRequest): Promise<Booking> {
    try {
      // Lấy token từ localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }


      const response = await axios.post<BookingResponse>(this.baseUrl, bookingData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }
}

export const bookingService = new BookingService();
