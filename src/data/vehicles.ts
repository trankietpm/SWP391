export interface VehicleDetail {
  id: number;
  name: string;
  type: string;
  images: string[];
  price: string;
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
}

export const allVehicles: VehicleDetail[] = [
  // 4 wheelers
  {
    id: 1,
    name: "VinFast VF8",
    type: "Ô tô điện",
    stationId: 1, // Trạm Quận 1
    images: [
      "/images/4 wheelers/VF/VF8/vinfast-vf8-banner-11042025.jpg",
      "/images/4 wheelers/VF/VF8/vinfast-vf8-black.png",
      "/images/4 wheelers/VF/VF8/vinfast-vf8-white.png"
    ],
    price: "2,800,000",
    availableCount: 3,
    rating: 4.5,
    features: ["Điều hòa tự động", "Hệ thống âm thanh", "Kết nối Bluetooth", "Camera lùi", "Cảnh báo va chạm"],
    isPopular: false,
    description: "VinFast VF8 là mẫu SUV điện với thiết kế hiện đại và công nghệ tiên tiến.",
      battery: "Pin Lithium-ion 87.7 kWh",
      range: "400km (WLTP)",
      charging: "Sạc nhanh DC 150kW",
      seats: "5 chỗ ngồi",
      topSpeed: "200 km/h",
    acceleration: "0-100 km/h trong 5.5 giây",
    highlights: [
      "Thiết kế SUV hiện đại và sang trọng",
      "Công nghệ sạc nhanh tiên tiến",
      "Hệ thống an toàn thông minh",
      "Nội thất cao cấp với vật liệu bền vững",
      "Kết nối thông minh và giải trí đa phương tiện"
    ],
  },
  {
    id: 2,
    name: "VinFast VF9",
    type: "Ô tô điện",
    stationId: 2, // Trạm Quận 2
    images: [
      "/images/4 wheelers/VF/VF9/vinfast-vf9-banner-11042025.jpg",
      "/images/4 wheelers/VF/VF9/vinfast-vf9-black.png",
      "/images/4 wheelers/VF/VF9/vinfast-vf9-white.png"
    ],
    price: "3,200,000",
    availableCount: 2,
    rating: 4.7,
    features: ["Điều hòa tự động", "Hệ thống âm thanh cao cấp", "Kết nối Bluetooth", "Camera lùi", "Cảnh báo va chạm", "Hỗ trợ sạc không dây", "Ghế massage"],
    isPopular: true,
    description: "VinFast VF9 là mẫu SUV điện cao cấp với không gian rộng rãi và công nghệ tiên tiến.",
    battery: "Pin Lithium-ion 92 kWh",
    range: "450km (WLTP)",
    charging: "Sạc nhanh DC 150kW",
      seats: "7 chỗ ngồi",
    topSpeed: "200 km/h",
    acceleration: "0-100 km/h trong 6.0 giây",
    highlights: [
      "Không gian rộng rãi",
      "Công nghệ sạc nhanh tiên tiến",
      "Hệ thống an toàn thông minh",
      "Nội thất cao cấp",
      "Kết nối thông minh và giải trí đa phương tiện"
    ],
  },
  {
    id: 3,
    name: "VinFast VF5",
    type: "Ô tô điện",
    stationId: 3, // Trạm Quận 7
    images: [
      "/images/4 wheelers/VF/VF5/vinfast-vf5-banner-11042025.jpg",
      "/images/4 wheelers/VF/VF5/vinfast-vf5-black.png",
      "/images/4 wheelers/VF/VF5/vinfast-vf5-white.png"
    ],
    price: "1,500,000",
    availableCount: 4,
    rating: 4.6,
    features: ["Điều hòa tự động", "Hệ thống âm thanh", "Kết nối Bluetooth", "Camera lùi", "Cảnh báo va chạm"],
    isPopular: false,
    description: "VinFast VF5 là mẫu xe điện compact với giá cả phải chăng, phù hợp cho việc di chuyển trong thành phố.",
    battery: "Pin Lithium-ion 37.23 kWh",
    range: "300km (WLTP)",
      charging: "Sạc nhanh DC 50kW",
    seats: "5 chỗ ngồi",
    topSpeed: "180 km/h",
    acceleration: "0-100 km/h trong 8.0 giây",
    highlights: [
      "Thiết kế compact phù hợp thành phố",
      "Giá cả phải chăng",
      "Tiết kiệm năng lượng",
      "Dễ dàng đỗ xe",
      "Công nghệ sạc nhanh"
    ],
  },
  {
    id: 4,
    name: "VinFast VF6",
    type: "Ô tô điện",
    stationId: 4, // Trạm Bình Thạnh
    images: [
      "/images/4 wheelers/VF/VF6/vinfast-vf6-banner-11042025.jpg",
      "/images/4 wheelers/VF/VF6/vinfast-vf6-black.png",
      "/images/4 wheelers/VF/VF6/vinfast-vf6-white.png"
    ],
    price: "2,200,000",
    availableCount: 3,
    rating: 4.4,
    features: ["Điều hòa tự động", "Hệ thống âm thanh", "Kết nối Bluetooth", "Camera lùi", "Cảnh báo va chạm"],
    isPopular: false,
    description: "VinFast VF6 là mẫu SUV điện với thiết kế hiện đại và hiệu suất tốt.",
    battery: "Pin Lithium-ion 76.9 kWh",
    range: "380km (WLTP)",
    charging: "Sạc nhanh DC 150kW",
      seats: "5 chỗ ngồi",
    topSpeed: "190 km/h",
    acceleration: "0-100 km/h trong 6.0 giây",
    highlights: [
      "Thiết kế SUV hiện đại",
      "Công nghệ sạc nhanh",
      "Hệ thống an toàn thông minh",
      "Nội thất cao cấp",
      "Kết nối thông minh"
    ],
  },
  {
    id: 5,
    name: "VinFast VF7",
    type: "Ô tô điện",
    stationId: 5, // Trạm Tân Bình
    images: [
      "/images/4 wheelers/VF/VF7/vinfast-vf7-banner-11042025.jpg",
      "/images/4 wheelers/VF/VF7/vinfast-vf7-black.png",
      "/images/4 wheelers/VF/VF7/vinfast-vf7-white.png"
    ],
    price: "2,800,000",
    availableCount: 2,
    rating: 4.8,
    features: ["Điều hòa tự động", "Hệ thống âm thanh cao cấp", "Kết nối Bluetooth", "Camera lùi", "Cảnh báo va chạm", "Hỗ trợ sạc không dây", "Ghế massage"],
    isPopular: true,
    description: "VinFast VF7 là mẫu SUV điện cao cấp với không gian rộng rãi và công nghệ tiên tiến.",
    battery: "Pin Lithium-ion 82.5 kWh",
    range: "420km (WLTP)",
    charging: "Sạc nhanh DC 150kW",
      seats: "5 chỗ ngồi",
    topSpeed: "200 km/h",
    acceleration: "0-100 km/h trong 5.8 giây",
    highlights: [
      "Không gian rộng rãi",
      "Công nghệ sạc nhanh tiên tiến",
      "Hệ thống an toàn thông minh",
      "Nội thất cao cấp",
      "Kết nối thông minh và giải trí đa phương tiện"
    ],
  },
  {
    id: 6,
    name: "VinFast VF3",
    type: "Ô tô điện",
    stationId: 6, // Trạm Gò Vấp
    images: [
      "/images/4 wheelers/VF/VF3/vinfast-vf3-banner-11042025.jpg",
      "/images/4 wheelers/VF/VF3/vinfast-vf3-black.png",
      "/images/4 wheelers/VF/VF3/vinfast-vf3-white.png"
    ],
    price: "1,500,000",
    availableCount: 5,
    rating: 4.4,
    features: ["Điều hòa tự động", "Hệ thống âm thanh", "Kết nối Bluetooth", "Camera lùi", "Cảnh báo va chạm"],
    isPopular: false,
    description: "VinFast VF3 là mẫu xe điện compact với giá cả phải chăng, phù hợp cho việc di chuyển trong thành phố.",
    battery: "Pin Lithium-ion 37.23 kWh",
    range: "300km (WLTP)",
    charging: "Sạc nhanh DC 50kW",
    seats: "5 chỗ ngồi",
    topSpeed: "180 km/h",
    acceleration: "0-100 km/h trong 8.0 giây",
    highlights: [
      "Thiết kế compact phù hợp thành phố",
      "Giá cả phải chăng",
      "Tiết kiệm năng lượng",
      "Dễ dàng đỗ xe",
      "Công nghệ sạc nhanh"
    ],
  },
  // 2 wheelers
  {
    id: 7,
    name: "VinFast Theon S",
    type: "Xe máy điện",
    stationId: 3, // Trạm Quận 7
    images: [
      "/images/2 wheelers/High-end/Theon S/theons-black-sp.png",
      "/images/2 wheelers/High-end/Theon S/theons-red.png",
      "/images/2 wheelers/High-end/Theon S/theons-white.png"
    ],
    price: "150,000",
    availableCount: 6,
    rating: 4.7,
    features: ["Đèn LED", "Phanh đĩa", "Khóa thông minh", "Màn hình hiển thị", "Chế độ tiết kiệm pin"],
    isPopular: true,
    description: "VinFast Theon S là mẫu xe máy điện cao cấp với thiết kế thể thao và hiệu suất vượt trội.",
    battery: "Pin Lithium-ion 72V 40Ah",
    range: "120km",
    charging: "Sạc nhanh 3.0 giờ",
    seats: "2 chỗ",
    topSpeed: "80 km/h",
    acceleration: "0-50 km/h trong 3.5 giây",
    highlights: [
      "Thiết kế thể thao hiện đại",
      "Hiệu suất cao",
      "Tiết kiệm năng lượng",
      "Dễ dàng sạc pin",
      "An toàn tuyệt đối"
    ],
  },
  {
    id: 8,
    name: "VinFast Vento S",
    type: "Xe máy điện",
    stationId: 4, // Trạm Bình Thạnh
    images: [
      "/images/2 wheelers/High-end/Vento S/img-top-ventos-black.png",
      "/images/2 wheelers/High-end/Vento S/img-top-ventos-blue.png",
      "/images/2 wheelers/High-end/Vento S/img-top-ventos-orange.png"
    ],
    price: "120,000",
    availableCount: 8,
    rating: 4.5,
    features: ["Đèn LED", "Phanh đĩa", "Khóa thông minh", "Màn hình hiển thị", "Chế độ tiết kiệm pin"],
    isPopular: false,
    description: "VinFast Vento S là mẫu xe máy điện với thiết kế thanh lịch và hiệu suất ổn định.",
    battery: "Pin Lithium-ion 60V 30Ah",
    range: "100km",
    charging: "Sạc nhanh 2.5 giờ",
    seats: "2 chỗ",
    topSpeed: "70 km/h",
    acceleration: "0-50 km/h trong 4.0 giây",
    highlights: [
      "Thiết kế thanh lịch",
      "Hiệu suất ổn định",
      "Tiết kiệm năng lượng",
      "Dễ dàng sử dụng",
      "Giá cả hợp lý"
    ],
  },
  {
    id: 9,
    name: "VinFast Evo 200",
    type: "Xe máy điện",
    stationId: 4, // Trạm Bình Thạnh
    images: [
      "/images/2 wheelers/Low-end/Evo 200/img-evo-black.png",
      "/images/2 wheelers/Low-end/Evo 200/img-evo-blue.png",
      "/images/2 wheelers/Low-end/Evo 200/img-evo-red.png"
    ],
    price: "80,000",
    availableCount: 10,
    rating: 4.3,
    features: ["Đèn LED", "Phanh đĩa", "Khóa thông minh", "Màn hình hiển thị", "Chế độ tiết kiệm pin"],
    isPopular: false,
    description: "VinFast Evo 200 là mẫu xe máy điện với giá cả phải chăng, phù hợp cho việc di chuyển hàng ngày.",
    battery: "Pin Lithium-ion 48V 20Ah",
    range: "80km",
    charging: "Sạc nhanh 2.0 giờ",
    seats: "2 chỗ",
    topSpeed: "60 km/h",
    acceleration: "0-50 km/h trong 4.5 giây",
    highlights: [
      "Giá cả phải chăng",
      "Tiết kiệm năng lượng",
      "Dễ dàng sử dụng",
      "Bảo trì đơn giản",
      "Phù hợp thành phố"
    ],
  },
  {
    id: 10,
    name: "VinFast Evo Grand",
    type: "Xe máy điện",
    stationId: 5, // Trạm Tân Bình
    images: [
      "/images/2 wheelers/Low-end/Evo Grand/img-evogrand-banner.png",
      "/images/2 wheelers/Low-end/Evo Grand/img-evogrand-black.png",
      "/images/2 wheelers/Low-end/Evo Grand/img-evogrand-cream.png"
    ],
    price: "100,000",
    availableCount: 9,
    rating: 4.4,
    features: ["Đèn LED", "Phanh đĩa", "Khóa thông minh", "Màn hình hiển thị", "Chế độ tiết kiệm pin"],
    isPopular: false,
    description: "VinFast Evo Grand là mẫu xe máy điện với không gian rộng rãi và tiện nghi cao.",
    battery: "Pin Lithium-ion 60V 25Ah",
    range: "90km",
    charging: "Sạc nhanh 2.5 giờ",
    seats: "2 chỗ",
    topSpeed: "65 km/h",
    acceleration: "0-50 km/h trong 4.2 giây",
    highlights: [
      "Không gian rộng rãi",
      "Tiện nghi cao",
      "Tiết kiệm năng lượng",
      "Dễ dàng sử dụng",
      "Giá cả hợp lý"
    ],
  },
  {
    id: 11,
    name: "VinFast Evo Neo",
    type: "Xe máy điện",
    stationId: 5, // Trạm Tân Bình
    images: [
      "/images/2 wheelers/Low-end/Evo Neo/img-top-evoneo-black.png",
      "/images/2 wheelers/Low-end/Evo Neo/img-top-evoneo-blue.png",
      "/images/2 wheelers/Low-end/Evo Neo/img-top-evoneo-green.png"
    ],
    price: "90,000",
    availableCount: 8,
    rating: 4.2,
    features: ["Đèn LED", "Phanh đĩa", "Khóa thông minh", "Màn hình hiển thị", "Chế độ tiết kiệm pin"],
    isPopular: false,
    description: "VinFast Evo Neo là mẫu xe máy điện với thiết kế hiện đại và hiệu suất ổn định.",
    battery: "Pin Lithium-ion 48V 20Ah",
    range: "75km",
    charging: "Sạc nhanh 2.0 giờ",
    seats: "2 chỗ",
    topSpeed: "55 km/h",
    acceleration: "0-50 km/h trong 5.0 giây",
    highlights: [
      "Thiết kế hiện đại",
      "Hiệu suất ổn định",
      "Tiết kiệm năng lượng",
      "Dễ dàng sử dụng",
      "Giá cả hợp lý"
    ],
  },
  {
    id: 12,
    name: "VinFast Motio",
    type: "Xe máy điện",
    stationId: 1, // Trạm Quận 1
    images: [
      "/images/2 wheelers/Low-end/Motio/img-motio-black.png",
      "/images/2 wheelers/Low-end/Motio/img-motio-pink.png",
      "/images/2 wheelers/Low-end/Motio/img-motio-red.png"
    ],
    price: "70,000",
    availableCount: 12,
    rating: 4.1,
    features: ["Đèn LED", "Phanh đĩa", "Khóa thông minh", "Màn hình hiển thị", "Chế độ tiết kiệm pin"],
    isPopular: false,
    description: "VinFast Motio là mẫu xe máy điện với giá cả phải chăng, phù hợp cho việc di chuyển ngắn.",
    battery: "Pin Lithium-ion 48V 15Ah",
    range: "60km",
    charging: "Sạc nhanh 1.5 giờ",
    seats: "2 chỗ",
    topSpeed: "50 km/h",
    acceleration: "0-50 km/h trong 5.5 giây",
    highlights: [
      "Giá cả phải chăng",
      "Tiết kiệm năng lượng",
      "Dễ dàng sử dụng",
      "Bảo trì đơn giản",
      "Phù hợp di chuyển ngắn"
    ],
  },
  {
    id: 13,
    name: "VinFast Feliz",
    type: "Xe máy điện",
    stationId: 2, // Trạm Quận 2
    images: [
      "/images/2 wheelers/Mid-end/Feliz/img-part-01.png",
      "/images/2 wheelers/Mid-end/Feliz/img-part-02.png",
      "/images/2 wheelers/Mid-end/Feliz/img-part-04.png"
    ],
    price: "110,000",
    availableCount: 7,
    rating: 4.5,
    features: ["Đèn LED", "Phanh đĩa", "Khóa thông minh", "Màn hình hiển thị", "Chế độ tiết kiệm pin"],
    isPopular: false,
    description: "VinFast Feliz là mẫu xe máy điện với thiết kế thanh lịch và hiệu suất tốt.",
    battery: "Pin Lithium-ion 60V 28Ah",
    range: "95km",
    charging: "Sạc nhanh 2.5 giờ",
    seats: "2 chỗ",
    topSpeed: "70 km/h",
    acceleration: "0-50 km/h trong 4.0 giây",
    highlights: [
      "Thiết kế thanh lịch",
      "Hiệu suất tốt",
      "Tiết kiệm năng lượng",
      "Dễ dàng sử dụng",
      "Giá cả hợp lý"
    ],
  },
  {
    id: 14,
    name: "VinFast Klara",
    type: "Xe máy điện",
    stationId: 3,
    images: [
      "/images/2 wheelers/Mid-end/Klara/img-part-1.png",
      "/images/2 wheelers/Mid-end/Klara/img-part-2.png",
      "/images/2 wheelers/Mid-end/Klara/img-part-3.png"
    ],
    price: "130,000",
    availableCount: 5,
    rating: 4.6,
    features: ["Đèn LED", "Phanh đĩa", "Khóa thông minh", "Màn hình hiển thị", "Chế độ tiết kiệm pin"],
    isPopular: true,
    description: "VinFast Klara là mẫu xe máy điện cao cấp với thiết kế hiện đại và công nghệ tiên tiến.",
    battery: "Pin Lithium-ion 72V 35Ah",
    range: "110km",
    charging: "Sạc nhanh 3.0 giờ",
    seats: "2 chỗ",
    topSpeed: "75 km/h",
    acceleration: "0-50 km/h trong 3.8 giây",
    highlights: [
      "Thiết kế hiện đại",
      "Công nghệ tiên tiến",
      "Hiệu suất cao",
      "Tiết kiệm năng lượng",
      "An toàn tuyệt đối"
    ],
  },
  // Xe thuộc trạm Hà Nội
  {
    id: 15,
    name: "Theon S",
    type: "Xe máy điện",
    stationId: 7, // Trạm Hoàn Kiếm
    images: ["/images/2 wheelers/High-end/Theon S/theons-black-sp.png"],
    price: "150,000",
    rating: 4.8,
    features: ["Pin lithium", "Đèn LED", "Phanh ABS", "Khóa thông minh"],
    isPopular: true,
    description: "Xe máy điện cao cấp Theon S với thiết kế sang trọng",
    availableCount: 12,
    battery: "72V 40Ah",
    range: "120km",
    charging: "Sạc nhanh 3.0 giờ",
    seats: "2 chỗ",
    topSpeed: "80 km/h",
    acceleration: "0-50 km/h trong 3.5 giây",
    highlights: [
      "Thiết kế sang trọng",
      "Hiệu suất cao",
      "Tiết kiệm năng lượng",
      "An toàn tuyệt đối"
    ],
  },
  {
    id: 16,
    name: "VinFast VF5",
    type: "Ô tô điện",
    stationId: 8, // Trạm Cầu Giấy
    images: ["/images/4 wheelers/VF/VF5/vinfast-vf5-banner-11042025.jpg"],
    price: "1,500,000",
    rating: 4.6,
    features: ["Pin lithium", "Điều hòa", "Camera lùi", "Kết nối Bluetooth"],
    isPopular: true,
    description: "Xe ô tô điện VF5 với thiết kế compact",
    availableCount: 8,
    battery: "Pin Lithium-ion 37.23 kWh",
    range: "300km (WLTP)",
    charging: "Sạc nhanh DC 50kW",
    seats: "5 chỗ ngồi",
    topSpeed: "180 km/h",
    acceleration: "0-100 km/h trong 8.0 giây",
    highlights: [
      "Thiết kế compact",
      "Giá cả phải chăng",
      "Tiết kiệm năng lượng",
      "Dễ dàng đỗ xe"
    ],
  },
  // Xe thuộc trạm Đà Nẵng
  {
    id: 17,
    name: "Vento S",
    type: "Xe máy điện",
    stationId: 9, // Trạm Hải Châu
    images: ["/images/2 wheelers/High-end/Vento S/img-top-ventos-black.png"],
    price: "120,000",
    rating: 4.4,
    features: ["Pin lithium", "Đèn LED", "Phanh đĩa", "Khóa từ xa"],
    isPopular: true,
    description: "Xe máy điện Vento S với thiết kế thể thao",
    availableCount: 15,
    battery: "60V 30Ah",
    range: "100km",
    charging: "Sạc nhanh 2.5 giờ",
    seats: "2 chỗ",
    topSpeed: "70 km/h",
    acceleration: "0-50 km/h trong 4.0 giây",
    highlights: [
      "Thiết kế thể thao",
      "Hiệu suất ổn định",
      "Tiết kiệm năng lượng",
      "Giá cả hợp lý"
    ],
  },
  {
    id: 18,
    name: "VinFast VF6",
    type: "Ô tô điện",
    stationId: 10, // Trạm Thanh Khê
    images: ["/images/4 wheelers/VF/VF6/vinfast-vf6-banner-11042025.jpg"],
    price: "2,200,000",
    rating: 4.4,
    features: ["Pin lithium", "Điều hòa", "Camera lùi", "Kết nối Bluetooth"],
    isPopular: false,
    description: "Xe ô tô điện VF6 với thiết kế SUV hiện đại",
    availableCount: 6,
    battery: "Pin Lithium-ion 76.9 kWh",
    range: "380km (WLTP)",
    charging: "Sạc nhanh DC 150kW",
    seats: "5 chỗ ngồi",
    topSpeed: "190 km/h",
    acceleration: "0-100 km/h trong 6.0 giây",
    highlights: [
      "Thiết kế SUV hiện đại",
      "Công nghệ sạc nhanh",
      "Hệ thống an toàn",
      "Nội thất cao cấp"
    ],
  },
  {
    id: 19,
    name: "Evo 200",
    type: "Xe máy điện",
    stationId: 11, // Trạm Sơn Trà
    images: ["/images/2 wheelers/Low-end/Evo 200/img-evo-black.png"],
    price: "80,000",
    rating: 4.2,
    features: ["Pin chì", "Đèn halogen", "Phanh cơ", "Khóa cơ"],
    isPopular: false,
    description: "Xe máy điện Evo 200 giá rẻ, phù hợp cho sinh viên",
    availableCount: 20,
    battery: "48V 20Ah",
    range: "80km",
    charging: "Sạc nhanh 2.0 giờ",
    seats: "2 chỗ",
    topSpeed: "60 km/h",
    acceleration: "0-50 km/h trong 4.5 giây",
    highlights: [
      "Giá cả phải chăng",
      "Tiết kiệm năng lượng",
      "Dễ dàng sử dụng",
      "Bảo trì đơn giản"
    ],
  },
  {
    id: 20,
    name: "VinFast VF8",
    type: "Ô tô điện",
    stationId: 12, // Trạm Liên Chiểu
    images: ["/images/4 wheelers/VF/VF8/vinfast-vf8-banner-11042025.jpg"],
    price: "2,800,000",
    rating: 4.5,
    features: ["Pin lithium", "Điều hòa", "Camera lùi", "Kết nối Bluetooth"],
    isPopular: true,
    description: "Xe ô tô điện VF8 với thiết kế SUV hiện đại",
    availableCount: 4,
    battery: "Pin Lithium-ion 87.7 kWh",
    range: "400km (WLTP)",
    charging: "Sạc nhanh DC 150kW",
    seats: "5 chỗ ngồi",
    topSpeed: "200 km/h",
    acceleration: "0-100 km/h trong 5.5 giây",
    highlights: [
      "Thiết kế SUV hiện đại",
      "Công nghệ sạc nhanh",
      "Hệ thống an toàn thông minh",
      "Nội thất cao cấp"
    ],
  }
];

// Helper functions
export const getVehicleById = (id: number): VehicleDetail | undefined => {
  return allVehicles.find(vehicle => vehicle.id === id);
};

export const getVehiclesByType = (type: string): VehicleDetail[] => {
  return allVehicles.filter(vehicle => vehicle.type === type);
};

export const getVehiclesByStation = (stationId: number): VehicleDetail[] => {
  return allVehicles.filter(vehicle => vehicle.stationId === stationId);
};

export const getPopularVehicles = (): VehicleDetail[] => {
  return allVehicles.filter(vehicle => vehicle.isPopular);
};

export const getAvailableVehicles = (): VehicleDetail[] => {
  return allVehicles.filter(vehicle => vehicle.availableCount > 0);
};