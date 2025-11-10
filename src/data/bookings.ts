export interface Booking {
  id: number;
  userId: number;
  vehicleId: number;
  startDate: string;
  endDate: string;
  actual_startDate?: string;
  actual_endDate?: string;
  totalDays: number;
  daily_price?: number;
  totalPrice: number;
  additional_fee?: Array<{
    name: string;
    money: number;
  }>;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled' | 'overdue' | 'completed_with_fee';
  paymentMethod: 'vnpay' | 'cash';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  transactionId?: string;
  station_id: number;
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
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  cancelledAt?: string;
}


export const mockBookings: Booking[] = [
  {
    id: 1,
    userId: 3,
    vehicleId: 1,
    startDate: '2024-12-25 10:00',
    endDate: '2024-12-27 10:00',
    actual_startDate: '2024-12-25 10:15',
    actual_endDate: '2024-12-27 12:00',
    totalDays: 3,
    daily_price: 2500000,
    totalPrice: 7500000,
    status: 'completed_with_fee',
    paymentMethod: 'vnpay',
    paymentStatus: 'paid',
    transactionId: 'VNP001234567',
    station_id: 1,
    odometer_start: 5000,
    odometer_end: 5120,
    battery_status_start: 85,
    battery_status_end: 45,
    vehicle_condition_pickup: 'Tốt',
    vehicle_condition_return: 'Tốt, có vết xước nhỏ',
    notes: 'Khách hàng VIP',
    createdAt: '2024-12-20 14:30',
    updatedAt: '2024-12-27 12:00',
    completedAt: '2024-12-27 12:00',
    additional_fee: [
      {
        name: 'Quá giờ',
        money: 40000
      }
    ],
    images: [
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150'
    ],
  }
];

export const getBookingById = (id: number): Booking | undefined => {
  return mockBookings.find(booking => booking.id === id);
};

export const getBookingsByUser = (userId: number): Booking[] => {
  return mockBookings.filter(booking => booking.userId === userId);
};

export const getBookingsByVehicle = (vehicleId: number): Booking[] => {
  return mockBookings.filter(booking => booking.vehicleId === vehicleId);
};

export const getBookingsByStatus = (status: Booking['status']): Booking[] => {
  return mockBookings.filter(booking => booking.status === status);
};

export const getActiveBookings = (): Booking[] => {
  return mockBookings.filter(booking => booking.status === 'active');
};

export const getPendingBookings = (): Booking[] => {
  return mockBookings.filter(booking => booking.status === 'pending');
};
