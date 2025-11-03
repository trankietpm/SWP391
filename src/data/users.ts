export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'staff' | 'renter';
  status: 'active' | 'inactive';
  joinDate: string;
  lastLogin: string;
  address?: string;
  idCard?: string;
  licenseNumber?: string;
  notes?: string;
}

export const mockUsers: User[] = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    phone: '0123456789',
    role: 'admin',
    status: 'active',
    joinDate: '2024-01-15',
    lastLogin: '2024-12-20',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    idCard: '123456789',
    licenseNumber: 'A1234567',
    notes: 'Quản trị viên hệ thống'
  },
  {
    id: 2,
    name: 'Trần Thị B',
    email: 'tranthib@email.com',
    phone: '0987654321',
    role: 'staff',
    status: 'active',
    joinDate: '2024-02-20',
    lastLogin: '2024-12-19',
    address: '456 Đường XYZ, Quận 2, TP.HCM',
    idCard: '987654321',
    licenseNumber: 'B7654321',
    notes: 'Nhân viên hỗ trợ khách hàng'
  },
  {
    id: 3,
    name: 'Lê Văn C',
    email: 'levanc@email.com',
    phone: '0369852147',
    role: 'renter',
    status: 'active',
    joinDate: '2024-03-10',
    lastLogin: '2024-12-15',
    address: '789 Đường DEF, Quận 3, TP.HCM',
    idCard: '456789123',
    licenseNumber: 'C4567890',
    notes: 'Khách hàng thường xuyên'
  },
  {
    id: 4,
    name: 'Phạm Thị D',
    email: 'phamthid@email.com',
    phone: '0555123456',
    role: 'renter',
    status: 'inactive',
    joinDate: '2024-04-05',
    lastLogin: '2024-12-10',
    address: '321 Đường GHI, Quận 4, TP.HCM',
    idCard: '789123456',
    licenseNumber: 'D7890123',
    notes: 'Khách hàng mới'
  },
  {
    id: 5,
    name: 'Hoàng Văn E',
    email: 'hoangvane@email.com',
    phone: '0888999000',
    role: 'staff',
    status: 'active',
    joinDate: '2024-05-12',
    lastLogin: '2024-12-18',
    address: '555 Đường JKL, Quận 5, TP.HCM',
    idCard: '111222333',
    licenseNumber: 'E1112223',
    notes: 'Nhân viên kỹ thuật'
  },
  {
    id: 6,
    name: 'Võ Thị F',
    email: 'vothif@email.com',
    phone: '0777888999',
    role: 'renter',
    status: 'active',
    joinDate: '2024-06-08',
    lastLogin: '2024-12-17',
    address: '666 Đường MNO, Quận 6, TP.HCM',
    idCard: '444555666',
    licenseNumber: 'F4445556',
    notes: 'Khách hàng VIP'
  },
  {
    id: 7,
    name: 'Đặng Văn G',
    email: 'dangvang@email.com',
    phone: '0666777888',
    role: 'renter',
    status: 'active',
    joinDate: '2024-07-15',
    lastLogin: '2024-12-16',
    address: '777 Đường PQR, Quận 7, TP.HCM',
    idCard: '777888999',
    licenseNumber: 'G7778889',
    notes: 'Khách hàng doanh nghiệp'
  },
  {
    id: 8,
    name: 'Bùi Thị H',
    email: 'buithih@email.com',
    phone: '0555666777',
    role: 'staff',
    status: 'inactive',
    joinDate: '2024-08-20',
    lastLogin: '2024-12-05',
    address: '888 Đường STU, Quận 8, TP.HCM',
    idCard: '000111222',
    licenseNumber: 'H0001112',
    notes: 'Nhân viên tạm nghỉ'
  },
  {
    id: 9,
    name: 'Ngô Văn I',
    email: 'ngovani@email.com',
    phone: '0444555666',
    role: 'renter',
    status: 'active',
    joinDate: '2024-09-10',
    lastLogin: '2024-12-14',
    address: '999 Đường VWX, Quận 9, TP.HCM',
    idCard: '333444555',
    licenseNumber: 'I3334445',
    notes: 'Khách hàng sinh viên'
  },
  {
    id: 10,
    name: 'Lý Thị K',
    email: 'lythik@email.com',
    phone: '0333444555',
    role: 'renter',
    status: 'active',
    joinDate: '2024-10-25',
    lastLogin: '2024-12-13',
    address: '111 Đường YZA, Quận 10, TP.HCM',
    idCard: '666777888',
    licenseNumber: 'K6667778',
    notes: 'Khách hàng thân thiết'
  },
  {
    id: 11,
    name: 'Trịnh Văn L',
    email: 'trinhvanl@email.com',
    phone: '0222333444',
    role: 'admin',
    status: 'active',
    joinDate: '2024-11-01',
    lastLogin: '2024-12-12',
    address: '222 Đường BCD, Quận 11, TP.HCM',
    idCard: '999000111',
    licenseNumber: 'L9990001',
    notes: 'Quản trị viên cấp cao'
  },
  {
    id: 12,
    name: 'Đinh Thị M',
    email: 'dinhthim@email.com',
    phone: '0111222333',
    role: 'staff',
    status: 'active',
    joinDate: '2024-11-15',
    lastLogin: '2024-12-11',
    address: '333 Đường EFG, Quận 12, TP.HCM',
    idCard: '222333444',
    licenseNumber: 'M2223334',
    notes: 'Nhân viên marketing'
  }
];

export const getUserById = (id: number): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

export const getUsersByRole = (role: 'admin' | 'staff' | 'renter'): User[] => {
  return mockUsers.filter(user => user.role === role);
};

export const getActiveUsers = (): User[] => {
  return mockUsers.filter(user => user.status === 'active');
};

export const getInactiveUsers = (): User[] => {
  return mockUsers.filter(user => user.status === 'inactive');
};
