export interface Booking {
  id: number;
  userId: number;
  vehicleId: number;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  paymentMethod: 'bank_transfer' | 'credit_card' | 'cash' | 'momo' | 'zalopay';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  transactionId?: string;
  pickupLocation: string;
  returnLocation: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export const mockBookings: Booking[] = [
  {
    id: 1,
    userId: 3,
    vehicleId: 1,
    startDate: '2024-12-25',
    endDate: '2024-12-27',
    totalDays: 3,
    totalPrice: 7500000,
    status: 'confirmed',
    paymentMethod: 'bank_transfer',
    paymentStatus: 'paid',
    transactionId: 'TXN001234567',
    pickupLocation: '123 Đường ABC, Quận 1, TP.HCM',
    returnLocation: '123 Đường ABC, Quận 1, TP.HCM',
    notes: 'Khách hàng VIP',
    createdAt: '2024-12-20',
    updatedAt: '2024-12-20',
    completedAt: '2024-12-20'
  },
  {
    id: 2,
    userId: 6,
    vehicleId: 2,
    startDate: '2024-12-28',
    endDate: '2024-12-30',
    totalDays: 3,
    totalPrice: 9600000,
    status: 'pending',
    paymentMethod: 'momo',
    paymentStatus: 'pending',
    pickupLocation: '456 Đường XYZ, Quận 2, TP.HCM',
    returnLocation: '456 Đường XYZ, Quận 2, TP.HCM',
    notes: 'Cần xác nhận thêm',
    createdAt: '2024-12-21',
    updatedAt: '2024-12-21'
  },
  {
    id: 3,
    userId: 7,
    vehicleId: 7,
    startDate: '2024-12-22',
    endDate: '2024-12-22',
    totalDays: 1,
    totalPrice: 150000,
    status: 'completed',
    paymentMethod: 'cash',
    paymentStatus: 'paid',
    transactionId: 'CASH001',
    pickupLocation: '789 Đường DEF, Quận 3, TP.HCM',
    returnLocation: '789 Đường DEF, Quận 3, TP.HCM',
    notes: 'Đã hoàn thành',
    createdAt: '2024-12-20',
    updatedAt: '2024-12-22',
    completedAt: '2024-12-20'
  },
  {
    id: 4,
    userId: 9,
    vehicleId: 3,
    startDate: '2024-12-26',
    endDate: '2024-12-28',
    totalDays: 3,
    totalPrice: 5400000,
    status: 'active',
    paymentMethod: 'credit_card',
    paymentStatus: 'paid',
    transactionId: 'CC001234567',
    pickupLocation: '999 Đường VWX, Quận 9, TP.HCM',
    returnLocation: '999 Đường VWX, Quận 9, TP.HCM',
    notes: 'Đang sử dụng',
    createdAt: '2024-12-22',
    updatedAt: '2024-12-22',
    completedAt: '2024-12-22'
  },
  {
    id: 5,
    userId: 10,
    vehicleId: 8,
    startDate: '2024-12-29',
    endDate: '2024-12-31',
    totalDays: 3,
    totalPrice: 360000,
    status: 'cancelled',
    paymentMethod: 'zalopay',
    paymentStatus: 'refunded',
    transactionId: 'ZP001234567',
    pickupLocation: '111 Đường YZA, Quận 10, TP.HCM',
    returnLocation: '111 Đường YZA, Quận 10, TP.HCM',
    notes: 'Khách hủy do thay đổi kế hoạch',
    createdAt: '2024-12-23',
    updatedAt: '2024-12-23',
    completedAt: '2024-12-23'
  },
  {
    id: 6,
    userId: 3,
    vehicleId: 4,
    startDate: '2025-01-01',
    endDate: '2025-01-03',
    totalDays: 3,
    totalPrice: 6600000,
    status: 'pending',
    paymentMethod: 'bank_transfer',
    paymentStatus: 'pending',
    pickupLocation: '123 Đường ABC, Quận 1, TP.HCM',
    returnLocation: '123 Đường ABC, Quận 1, TP.HCM',
    notes: 'Đặt trước cho năm mới',
    createdAt: '2024-12-24',
    updatedAt: '2024-12-24'
  },
  {
    id: 7,
    userId: 6,
    vehicleId: 9,
    startDate: '2024-12-23',
    endDate: '2024-12-24',
    totalDays: 2,
    totalPrice: 160000,
    status: 'completed',
    paymentMethod: 'momo',
    paymentStatus: 'paid',
    transactionId: 'MOMO001234567',
    pickupLocation: '456 Đường XYZ, Quận 2, TP.HCM',
    returnLocation: '456 Đường XYZ, Quận 2, TP.HCM',
    notes: 'Chuyến đi ngắn',
    createdAt: '2024-12-21',
    updatedAt: '2024-12-24',
    completedAt: '2024-12-21'
  },
  {
    id: 8,
    userId: 7,
    vehicleId: 1,
    startDate: '2025-01-05',
    endDate: '2025-01-07',
    totalDays: 3,
    totalPrice: 7500000,
    status: 'confirmed',
    paymentMethod: 'credit_card',
    paymentStatus: 'paid',
    transactionId: 'CC002345678',
    pickupLocation: '789 Đường DEF, Quận 3, TP.HCM',
    returnLocation: '789 Đường DEF, Quận 3, TP.HCM',
    notes: 'Khách hàng thân thiết',
    createdAt: '2024-12-24',
    updatedAt: '2024-12-24',
    completedAt: '2024-12-24'
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
