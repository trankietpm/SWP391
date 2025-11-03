export interface Station {
  id: number;
  name: string;
  address: string;
  city: string;
  district: string;
  phone: string;
  email: string;
  manager: string;
  capacity: number; // Số xe tối đa có thể chứa
  lat: number;
  lng: number;
  status: 'active' | 'inactive' | 'maintenance';
  openingHours: string;
  services: string[]; // Dịch vụ có sẵn
  description: string;
  createdAt: string;
  updatedAt: string;
}

export const mockStations: Station[] = [
  {
    id: 1,
    name: 'Trạm Thuê Xe Quận 1',
    address: '123 Nguyễn Huệ, Quận 1',
    city: 'TP.HCM',
    district: 'Quận 1',
    phone: '028 1234 5678',
    email: 'quan1@evsrent.com',
    manager: 'Nguyễn Văn A',
    capacity: 50,
    status: 'active',
    openingHours: '6:00 - 22:00',
    services: ['Thuê xe', 'Sạc pin', 'Bảo dưỡng', 'Rửa xe'],
    lat: 10.7769,
    lng: 106.7009,
    description: 'Trạm thuê xe chính tại trung tâm Quận 1, thuận tiện cho khách hàng',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 2,
    name: 'Trạm Thuê Xe Quận 2',
    address: '456 Thủ Thiêm, Quận 2',
    city: 'TP.HCM',
    district: 'Quận 2',
    phone: '028 2345 6789',
    email: 'quan2@evsrent.com',
    manager: 'Trần Thị B',
    capacity: 30,
    status: 'active',
    openingHours: '6:00 - 22:00',
    services: ['Thuê xe', 'Sạc pin', 'Bảo dưỡng'],
    lat: 10.7870,
    lng: 106.7498,
    description: 'Trạm thuê xe tại khu vực Thủ Thiêm, gần các tòa nhà văn phòng',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20'
  },
  {
    id: 3,
    name: 'Trạm Thuê Xe Quận 7',
    address: '789 Nguyễn Thị Thập, Quận 7',
    city: 'TP.HCM',
    district: 'Quận 7',
    phone: '028 3456 7890',
    email: 'quan7@evsrent.com',
    manager: 'Lê Văn C',
    capacity: 40,
    status: 'active',
    openingHours: '6:00 - 22:00',
    services: ['Thuê xe', 'Sạc pin', 'Bảo dưỡng', 'Rửa xe', 'Bảo hiểm'],
    lat: 10.7370,
    lng: 106.7220,
    description: 'Trạm thuê xe tại Quận 7, đang bảo trì hệ thống',
    createdAt: '2024-01-25',
    updatedAt: '2024-02-01'
  },
  {
    id: 4,
    name: 'Trạm Thuê Xe Quận Bình Thạnh',
    address: '321 Xô Viết Nghệ Tĩnh, Bình Thạnh',
    city: 'TP.HCM',
    district: 'Bình Thạnh',
    phone: '028 4567 8901',
    email: 'binhthanh@evsrent.com',
    manager: 'Phạm Thị D',
    capacity: 35,
    status: 'active',
    openingHours: '5:30 - 23:00',
    services: ['Thuê xe', 'Sạc pin', 'Bảo dưỡng', 'Rửa xe'],
    lat: 10.8106,
    lng: 106.7091,
    description: 'Trạm thuê xe tại Bình Thạnh, mở rộng giờ phục vụ',
    createdAt: '2024-02-01',
    updatedAt: '2024-02-01'
  },
  {
    id: 5,
    name: 'Trạm Thuê Xe Quận Tân Bình',
    address: '654 Cộng Hòa, Tân Bình',
    city: 'TP.HCM',
    district: 'Tân Bình',
    phone: '028 5678 9012',
    email: 'tanbinh@evsrent.com',
    manager: 'Hoàng Văn E',
    capacity: 25,
    status: 'active',
    openingHours: '7:00 - 21:00',
    services: ['Thuê xe', 'Sạc pin'],
    lat: 10.8014,
    lng: 106.6525,
    description: 'Trạm thuê xe tại Tân Bình, tạm ngưng hoạt động',
    createdAt: '2024-02-05',
    updatedAt: '2024-02-10'
  },
  // Hà Nội
  {
    id: 6,
    name: 'Trạm Thuê Xe Quận Ba Đình',
    address: '123 Điện Biên Phủ, Ba Đình',
    city: 'Hà Nội',
    district: 'Ba Đình',
    phone: '024 1234 5678',
    email: 'badinh@evsrent.com',
    manager: 'Nguyễn Thị F',
    capacity: 45,
    status: 'active',
    openingHours: '6:00 - 22:00',
    services: ['Thuê xe', 'Sạc pin', 'Bảo dưỡng', 'Rửa xe'],
    lat: 21.0285,
    lng: 105.8542,
    description: 'Trạm thuê xe tại trung tâm Ba Đình, gần các cơ quan nhà nước',
    createdAt: '2024-02-15',
    updatedAt: '2024-02-15'
  },
  {
    id: 7,
    name: 'Trạm Thuê Xe Quận Hoàn Kiếm',
    address: '456 Hàng Bồ, Hoàn Kiếm',
    city: 'Hà Nội',
    district: 'Hoàn Kiếm',
    phone: '024 2345 6789',
    email: 'hoankiem@evsrent.com',
    manager: 'Trần Văn G',
    capacity: 35,
    status: 'active',
    openingHours: '5:30 - 23:00',
    services: ['Thuê xe', 'Sạc pin', 'Bảo dưỡng', 'Rửa xe', 'Bảo hiểm'],
    lat: 21.0285,
    lng: 105.8542,
    description: 'Trạm thuê xe tại khu phố cổ, phục vụ du khách',
    createdAt: '2024-02-20',
    updatedAt: '2024-02-20'
  },
  {
    id: 8,
    name: 'Trạm Thuê Xe Quận Cầu Giấy',
    address: '789 Cầu Giấy, Cầu Giấy',
    city: 'Hà Nội',
    district: 'Cầu Giấy',
    phone: '024 3456 7890',
    email: 'caugiay@evsrent.com',
    manager: 'Lê Thị H',
    capacity: 40,
    status: 'active',
    openingHours: '6:00 - 22:00',
    services: ['Thuê xe', 'Sạc pin', 'Bảo dưỡng'],
    lat: 21.0285,
    lng: 105.8542,
    description: 'Trạm thuê xe tại Cầu Giấy, gần các trường đại học',
    createdAt: '2024-02-25',
    updatedAt: '2024-02-25'
  },
  // Đà Nẵng
  {
    id: 9,
    name: 'Trạm Thuê Xe Quận Hải Châu',
    address: '321 Lê Duẩn, Hải Châu',
    city: 'Đà Nẵng',
    district: 'Hải Châu',
    phone: '0236 1234 567',
    email: 'haichau@evsrent.com',
    manager: 'Phạm Văn I',
    capacity: 30,
    status: 'active',
    openingHours: '6:00 - 22:00',
    services: ['Thuê xe', 'Sạc pin', 'Bảo dưỡng', 'Rửa xe'],
    lat: 16.0544,
    lng: 108.2022,
    description: 'Trạm thuê xe tại trung tâm Hải Châu, gần bãi biển',
    createdAt: '2024-03-01',
    updatedAt: '2024-03-01'
  },
  {
    id: 10,
    name: 'Trạm Thuê Xe Quận Thanh Khê',
    address: '654 Nguyễn Văn Linh, Thanh Khê',
    city: 'Đà Nẵng',
    district: 'Thanh Khê',
    phone: '0236 2345 6789',
    email: 'thankhe@evsrent.com',
    manager: 'Hoàng Thị K',
    capacity: 25,
    status: 'active',
    openingHours: '6:30 - 21:30',
    services: ['Thuê xe', 'Sạc pin', 'Bảo dưỡng'],
    lat: 16.0544,
    lng: 108.2022,
    description: 'Trạm thuê xe tại Thanh Khê, phục vụ khu dân cư',
    createdAt: '2024-03-05',
    updatedAt: '2024-03-05'
  },
  {
    id: 11,
    name: 'Trạm Thuê Xe Quận Sơn Trà',
    address: '987 Võ Nguyên Giáp, Sơn Trà',
    city: 'Đà Nẵng',
    district: 'Sơn Trà',
    phone: '0236 3456 7890',
    email: 'sontra@evsrent.com',
    manager: 'Nguyễn Văn L',
    capacity: 20,
    status: 'active',
    openingHours: '7:00 - 21:00',
    services: ['Thuê xe', 'Sạc pin', 'Bảo dưỡng', 'Rửa xe'],
    lat: 16.0544,
    lng: 108.2022,
    description: 'Trạm thuê xe tại Sơn Trà, đang nâng cấp hệ thống',
    createdAt: '2024-03-10',
    updatedAt: '2024-03-15'
  }
];

// Helper functions
export const getStationById = (id: number): Station | undefined => {
  return mockStations.find(station => station.id === id);
};

export const getActiveStations = (): Station[] => {
  return mockStations.filter(station => station.status === 'active');
};

export const getStationsByCity = (city: string): Station[] => {
  return mockStations.filter(station => station.city === city);
};

export const getStationsByDistrict = (district: string): Station[] => {
  return mockStations.filter(station => station.district === district);
};

// Helper function to calculate current vehicles for each station
export const calculateStationVehicles = (stationId: number, allVehicles: { stationId: number }[]): number => {
  return allVehicles
    .filter(vehicle => vehicle.stationId === stationId)
    .length; // Đếm số loại xe khác nhau trong trạm
};

// Helper function to calculate total available vehicles for each station
export const calculateStationAvailableVehicles = (stationId: number, allVehicles: { stationId: number; availableCount: number }[]): number => {
  return allVehicles
    .filter(vehicle => vehicle.stationId === stationId)
    .reduce((total, vehicle) => total + vehicle.availableCount, 0);
};

// Update station data with calculated vehicle counts
export const updateStationVehicleCounts = (allVehicles: { stationId: number; availableCount: number }[]): Station[] => {
  return mockStations.map(station => ({
    ...station,
    currentVehicles: calculateStationAvailableVehicles(station.id, allVehicles)
  }));
};
