import { BookingStatus } from '../../../enums/booking-status.enum';
import { PaymentMethod } from '../../../enums/payment-method.enum';
import { PaymentStatus } from '../../../enums/payment-status.enum';

export class BookingResDto {
  id: number;
  user_id: number;
  vehicle_id: number;
  station_id: number;
  start_date: Date;
  end_date: Date;
  actual_start_date?: Date;
  actual_end_date?: Date;
  total_days: number;
  daily_price?: number;
  total_price: number;
  additional_fee?: Array<{
    name: string;
    money: number;
  }>;
  status: BookingStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
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
  created_at: Date;
  updated_at: Date;
  completed_at?: Date;
  cancelled_at?: Date;
}

