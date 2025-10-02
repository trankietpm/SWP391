"use client";
import React, { useState } from 'react';
import { CarOutlined, ThunderboltOutlined, StarOutlined, DollarOutlined, LeftOutlined, RightOutlined, CheckOutlined, ClockCircleOutlined, SafetyOutlined, EnvironmentOutlined } from '@ant-design/icons';
import styles from './DetailVehicle.module.scss';

interface VehicleDetail {
  id: number;
  name: string;
  type: string;
  images: string[];
  price: string;
  rating: number;
  features: string[];
  isPopular: boolean;
  description: string;
  specifications: {
    battery: string;
    range: string;
    charging: string;
    seats: string;
    topSpeed: string;
    acceleration: string;
  };
  highlights: string[];
  colors: {
    name: string;
    hex: string;
    available: boolean;
  }[];
  rentalInfo: {
    deposit: string;
    insurance: string;
    delivery: string;
    cancellation: string;
  };
}

interface DetailVehicleProps {
  vehicleId?: number;
}

const DetailVehicle: React.FC<DetailVehicleProps> = ({ vehicleId = 1 }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'rental'>('overview');
  const [selectedColor, setSelectedColor] = useState(0);

  // All vehicles data
  const allVehicles: VehicleDetail[] = [
    // 4 wheelers
    {
      id: 1,
      name: "VinFast VF8",
      type: "Ô tô điện",
      images: [
        "/images/4 wheelers/VF/VF8/vinfast-vf8-banner-11042025.jpg",
        "/images/4 wheelers/VF/VF8/vinfast-vf8-mau-xe-den.png",
        "/images/4 wheelers/VF/VF8/vinfast-vf8-mau-xe-trang.png",
        "/images/4 wheelers/VF/VF8/vinfast-vf8-mau-xe-xam.png",
        "/images/4 wheelers/VF/VF8/vinfast-vf8-mau-xe-xanh-la.png",
        "/images/4 wheelers/VF/VF8/vinfast-vf8-mau-xe-xanh.png",
        "/images/4 wheelers/VF/VF8/vinfast-vf8-ngoai-that-11042025-1.jpg",
        "/images/4 wheelers/VF/VF8/vinfast-vf8-mau-xe-trang.png",
        "/images/4 wheelers/VF/VF8/vinfast-vf8-mau-xe-xam.png",
        "/images/4 wheelers/VF/VF8/vinfast-vf8-mau-xe-xanh-la.png",
        "/images/4 wheelers/VF/VF8/vinfast-vf8-mau-xe-xanh.png",
      ],
      price: "2,500,000 VNĐ/ngày",
      rating: 4.8,
      features: ["Pin 400km", "Sạc nhanh 30 phút", "5 chỗ ngồi"],
      isPopular: true,
      description: "VinFast VF8 là mẫu SUV điện cao cấp với thiết kế hiện đại, công nghệ tiên tiến và hiệu suất vượt trội. Xe được trang bị pin lithium-ion dung lượng lớn, cho phép di chuyển lên đến 400km với một lần sạc.",
      specifications: {
        battery: "Pin Lithium-ion 87.7 kWh",
        range: "400km (WLTP)",
        charging: "Sạc nhanh DC 150kW",
        seats: "5 chỗ ngồi",
        topSpeed: "200 km/h",
        acceleration: "0-100 km/h trong 5.5 giây"
      },
      highlights: [
        "Thiết kế SUV hiện đại và sang trọng",
        "Công nghệ sạc nhanh tiên tiến",
        "Hệ thống an toàn thông minh",
        "Nội thất cao cấp với vật liệu bền vững",
        "Kết nối thông minh và giải trí đa phương tiện"
      ],
      colors: [
        {
          name: "Đen",
          hex: "#1a1a1a",
          available: true
        },
        {
          name: "Trắng",
          hex: "#ffffff",
          available: true
        },
        {
          name: "Xám",
          hex: "#6b7280",
          available: true
        },
        {
          name: "Xanh lá",
          hex: "#10b981",
          available: true
        },
        {
          name: "Xanh dương",
          hex: "#3b82f6",
          available: false
        }
      ],
      rentalInfo: {
        deposit: "5,000,000 VNĐ",
        insurance: "Bảo hiểm toàn diện",
        delivery: "Giao xe tận nơi miễn phí",
        cancellation: "Hủy miễn phí trước 24h"
      }
    },
    {
      id: 2,
      name: "VinFast VF9",
      type: "Ô tô điện",
      images: [
        "/images/4 wheelers/VF/VF9/banner-vinfast-vf9-10042025.jpg",
        "/images/4 wheelers/VF/VF9/vinfast-vf9-mau-xe-den.png",
        "/images/4 wheelers/VF/VF9/vinfast-vf9-mau-xe-trang.png"
      ],
      price: "3,500,000 VNĐ/ngày",
      rating: 4.7,
      features: ["Pin 600km", "7 chỗ ngồi", "Sạc siêu nhanh"],
      isPopular: true,
      description: "VinFast VF9 là mẫu SUV 7 chỗ ngồi với thiết kế sang trọng và không gian rộng rãi. Xe được trang bị công nghệ pin tiên tiến, cho phép di chuyển lên đến 600km với một lần sạc.",
      specifications: {
        battery: "Pin Lithium-ion 106 kWh",
        range: "600km (WLTP)",
        charging: "Sạc nhanh DC 200kW",
        seats: "7 chỗ ngồi",
        topSpeed: "180 km/h",
        acceleration: "0-100 km/h trong 6.8 giây"
      },
      highlights: [
        "Thiết kế SUV 7 chỗ sang trọng",
        "Không gian nội thất rộng rãi",
        "Công nghệ sạc siêu nhanh",
        "Hệ thống an toàn toàn diện",
        "Tiện nghi cao cấp cho gia đình"
      ],
      colors: [
        {
          name: "Đen",
          hex: "#1a1a1a",
          available: true
        },
        {
          name: "Trắng",
          hex: "#ffffff",
          available: true
        },
        {
          name: "Bạc",
          hex: "#9ca3af",
          available: true
        },
        {
          name: "Xám đậm",
          hex: "#374151",
          available: true
        }
      ],
      rentalInfo: {
        deposit: "7,000,000 VNĐ",
        insurance: "Bảo hiểm toàn diện",
        delivery: "Giao xe tận nơi miễn phí",
        cancellation: "Hủy miễn phí trước 24h"
      }
    },
    {
      id: 3,
      name: "VinFast VF5",
      type: "Ô tô điện",
      images: [
        "/images/4 wheelers/VF/VF5/vinfast-vf5-banner.jpg",
        "/images/4 wheelers/VF/VF5/vinfast-vf5-noi-that-11042025-1.jpg",
        "/images/4 wheelers/VF/VF5/vinfast-vf5-plus-mau-xe-do-trang.png"
      ],
      price: "1,200,000 VNĐ/ngày",
      rating: 4.5,
      features: ["Pin 250km", "Thiết kế gọn gàng", "4 chỗ ngồi"],
      isPopular: false,
      description: "VinFast VF5 là mẫu xe điện nhỏ gọn, phù hợp cho việc di chuyển trong thành phố. Xe có thiết kế hiện đại và giá cả hợp lý.",
      specifications: {
        battery: "Pin Lithium-ion 42 kWh",
        range: "250km (WLTP)",
        charging: "Sạc nhanh DC 50kW",
        seats: "4 chỗ ngồi",
        topSpeed: "150 km/h",
        acceleration: "0-100 km/h trong 8.5 giây"
      },
      highlights: [
        "Thiết kế nhỏ gọn, dễ điều khiển",
        "Giá cả hợp lý",
        "Tiết kiệm năng lượng",
        "Phù hợp di chuyển thành phố",
        "Công nghệ thông minh cơ bản"
      ],
      colors: [
        {
          name: "Đỏ",
          hex: "#dc2626",
          available: true
        },
        {
          name: "Trắng",
          hex: "#ffffff",
          available: true
        },
        {
          name: "Xanh dương",
          hex: "#2563eb",
          available: true
        },
        {
          name: "Xám",
          hex: "#6b7280",
          available: false
        }
      ],
      rentalInfo: {
        deposit: "2,400,000 VNĐ",
        insurance: "Bảo hiểm cơ bản",
        delivery: "Giao xe tận nơi miễn phí",
        cancellation: "Hủy miễn phí trước 24h"
      }
    },
    {
      id: 4,
      name: "VinFast VF6",
      type: "Ô tô điện",
      images: [
        "/images/4 wheelers/VF/VF6/vinfast-vf6-banner.jpg",
        "/images/4 wheelers/VF/VF6/vinfast-vf6-mau-xe-xam-den.jpg",
        "/images/4 wheelers/VF/VF6/vinfast-vf6-noi-that-11042025-4.jpg"
      ],
      price: "1,500,000 VNĐ/ngày",
      rating: 4.4,
      features: ["Pin 280km", "SUV nhỏ gọn", "5 chỗ ngồi"],
      isPopular: true,
      description: "VinFast VF6 là mẫu SUV điện nhỏ gọn với thiết kế hiện đại và hiệu suất cao. Xe phù hợp cho gia đình nhỏ và di chuyển trong thành phố.",
      specifications: {
        battery: "Pin Lithium-ion 60 kWh",
        range: "280km (WLTP)",
        charging: "Sạc nhanh DC 100kW",
        seats: "5 chỗ ngồi",
        topSpeed: "160 km/h",
        acceleration: "0-100 km/h trong 7.2 giây"
      },
      highlights: [
        "Thiết kế SUV nhỏ gọn",
        "Hiệu suất cao",
        "Phù hợp gia đình nhỏ",
        "Tiết kiệm năng lượng",
        "Công nghệ thông minh"
      ],
      colors: [
        {
          name: "Xám đậm",
          hex: "#374151",
          available: true
        },
        {
          name: "Trắng",
          hex: "#ffffff",
          available: true
        },
        {
          name: "Xanh lá",
          hex: "#059669",
          available: true
        },
        {
          name: "Đen",
          hex: "#1a1a1a",
          available: true
        }
      ],
      rentalInfo: {
        deposit: "3,000,000 VNĐ",
        insurance: "Bảo hiểm toàn diện",
        delivery: "Giao xe tận nơi miễn phí",
        cancellation: "Hủy miễn phí trước 24h"
      }
    },
    {
      id: 5,
      name: "VinFast VF7",
      type: "Ô tô điện",
      images: [
        "/images/4 wheelers/VF/VF7/vinfast-vf7-banner.jpg",
        "/images/4 wheelers/VF/VF7/vinfast-vf-7-mau-xe-trang.png",
        "/images/4 wheelers/VF/VF7/vinfast-vf-7-mau-xe-xanh-la.png"
      ],
      price: "2,000,000 VNĐ/ngày",
      rating: 4.6,
      features: ["Pin 350km", "SUV cao cấp", "5 chỗ ngồi"],
      isPopular: false,
      description: "VinFast VF7 là mẫu SUV điện cao cấp với thiết kế sang trọng và công nghệ tiên tiến. Xe được trang bị nhiều tính năng thông minh và an toàn.",
      specifications: {
        battery: "Pin Lithium-ion 75 kWh",
        range: "350km (WLTP)",
        charging: "Sạc nhanh DC 120kW",
        seats: "5 chỗ ngồi",
        topSpeed: "180 km/h",
        acceleration: "0-100 km/h trong 6.5 giây"
      },
      highlights: [
        "Thiết kế SUV cao cấp",
        "Công nghệ thông minh",
        "Hệ thống an toàn toàn diện",
        "Nội thất sang trọng",
        "Hiệu suất vượt trội"
      ],
      colors: [
        {
          name: "Trắng",
          hex: "#ffffff",
          available: true
        },
        {
          name: "Xanh lá",
          hex: "#10b981",
          available: true
        },
        {
          name: "Đen",
          hex: "#1a1a1a",
          available: true
        },
        {
          name: "Xám",
          hex: "#6b7280",
          available: false
        }
      ],
      rentalInfo: {
        deposit: "4,000,000 VNĐ",
        insurance: "Bảo hiểm toàn diện",
        delivery: "Giao xe tận nơi miễn phí",
        cancellation: "Hủy miễn phí trước 24h"
      }
    },
    {
      id: 6,
      name: "VinFast VF3",
      type: "Ô tô điện",
      images: [
        "/images/4 wheelers/VF/VF3/vinfast-vf3-logo.jpg",
        "/images/4 wheelers/VF/VF3/vinfast-vf-3-mau-xe-hong.png",
        "/images/4 wheelers/VF/VF3/vinfast-vf-3-mau-xe-xanh-trang.png"
      ],
      price: "800,000 VNĐ/ngày",
      rating: 4.3,
      features: ["Pin 200km", "Thiết kế nhỏ gọn", "4 chỗ ngồi"],
      isPopular: false,
      description: "VinFast VF3 là mẫu xe điện nhỏ gọn với thiết kế hiện đại và giá cả hợp lý. Xe phù hợp cho việc di chuyển trong thành phố.",
      specifications: {
        battery: "Pin Lithium-ion 30 kWh",
        range: "200km (WLTP)",
        charging: "Sạc nhanh DC 40kW",
        seats: "4 chỗ ngồi",
        topSpeed: "120 km/h",
        acceleration: "0-100 km/h trong 10 giây"
      },
      highlights: [
        "Thiết kế nhỏ gọn, dễ điều khiển",
        "Giá cả hợp lý",
        "Tiết kiệm năng lượng",
        "Phù hợp di chuyển thành phố",
        "Công nghệ cơ bản"
      ],
      colors: [
        {
          name: "Hồng",
          hex: "#ec4899",
          available: true
        },
        {
          name: "Xanh trắng",
          hex: "#e0f2fe",
          available: true
        },
        {
          name: "Trắng",
          hex: "#ffffff",
          available: true
        },
        {
          name: "Xanh dương",
          hex: "#3b82f6",
          available: false
        }
      ],
      rentalInfo: {
        deposit: "1,600,000 VNĐ",
        insurance: "Bảo hiểm cơ bản",
        delivery: "Giao xe tận nơi miễn phí",
        cancellation: "Hủy miễn phí trước 24h"
      }
    },
    // 2 wheelers
    {
      id: 7,
      name: "VinFast Klara S",
      type: "Xe máy điện cao cấp",
      images: [
        "/images/2 wheelers/Mid-end/Klara/img-top-klaras-white-sp.png",
        "/images/2 wheelers/Mid-end/Klara/img-top-klaras-blue.png",
        "/images/2 wheelers/Mid-end/Klara/img-top-klaras-green.png"
      ],
      price: "150,000 VNĐ/ngày",
      rating: 4.7,
      features: ["Pin 80km", "Tốc độ 50km/h", "Thiết kế hiện đại"],
      isPopular: true,
      description: "VinFast Klara S là mẫu xe máy điện cao cấp với thiết kế hiện đại và công nghệ tiên tiến. Xe được trang bị pin lithium-ion cho phép di chuyển lên đến 80km với một lần sạc.",
      specifications: {
        battery: "Pin Lithium-ion 2.3 kWh",
        range: "80km (WLTP)",
        charging: "Sạc nhanh 2.5 giờ",
        seats: "2 chỗ ngồi",
        topSpeed: "50 km/h",
        acceleration: "0-50 km/h trong 8 giây"
      },
      highlights: [
        "Thiết kế hiện đại và sang trọng",
        "Công nghệ pin tiên tiến",
        "Hệ thống an toàn thông minh",
        "Tiết kiệm năng lượng",
        "Phù hợp di chuyển thành phố"
      ],
      colors: [
        {
          name: "Trắng",
          hex: "#ffffff",
          available: true
        },
        {
          name: "Xanh dương",
          hex: "#3b82f6",
          available: true
        },
        {
          name: "Xanh lá",
          hex: "#10b981",
          available: true
        }
      ],
      rentalInfo: {
        deposit: "300,000 VNĐ",
        insurance: "Bảo hiểm cơ bản",
        delivery: "Giao xe tận nơi miễn phí",
        cancellation: "Hủy miễn phí trước 24h"
      }
    },
    {
      id: 8,
      name: "VinFast Theon S",
      type: "Xe máy điện thể thao",
      images: [
        "/images/2 wheelers/High-end/Theon S/theons-white.png",
        "/images/2 wheelers/High-end/Theon S/theons-red.png",
        "/images/2 wheelers/High-end/Theon S/theons-black-sp.png",        "/images/2 wheelers/High-end/Theon S/theons-white.png",
        "/images/2 wheelers/High-end/Theon S/theons-red.png",
        "/images/2 wheelers/High-end/Theon S/theons-black-sp.png"
      ],
      price: "120,000 VNĐ/ngày",
      rating: 4.5,
      features: ["Pin 70km", "Tốc độ 45km/h", "Thiết kế thể thao"],
      isPopular: false,
      description: "VinFast Theon S là mẫu xe máy điện thể thao với thiết kế năng động và hiệu suất cao. Xe phù hợp cho những người yêu thích phong cách thể thao.",
      specifications: {
        battery: "Pin Lithium-ion 2.0 kWh",
        range: "70km (WLTP)",
        charging: "Sạc nhanh 2 giờ",
        seats: "2 chỗ ngồi",
        topSpeed: "45 km/h",
        acceleration: "0-45 km/h trong 6 giây"
      },
      highlights: [
        "Thiết kế thể thao năng động",
        "Hiệu suất cao",
        "Phù hợp người trẻ",
        "Tiết kiệm năng lượng",
        "Giá cả hợp lý"
      ],
      colors: [
        {
          name: "Trắng",
          hex: "#ffffff",
          available: true
        },
        {
          name: "Đỏ",
          hex: "#dc2626",
          available: true
        },
        {
          name: "Đen",
          hex: "#1a1a1a",
          available: true
        }
      ],
      rentalInfo: {
        deposit: "240,000 VNĐ",
        insurance: "Bảo hiểm cơ bản",
        delivery: "Giao xe tận nơi miễn phí",
        cancellation: "Hủy miễn phí trước 24h"
      }
    },
    {
      id: 9,
      name: "VinFast Feliz S",
      type: "Xe máy điện cao cấp",
      images: [
        "/images/2 wheelers/Mid-end/Feliz/img-top-felizs-white.png",
        "/images/2 wheelers/Mid-end/Feliz/img-top-felizs-green.png",
        "/images/2 wheelers/Mid-end/Feliz/img-top-felizs-red.png"
      ],
      price: "180,000 VNĐ/ngày",
      rating: 4.8,
      features: ["Pin 90km", "Tốc độ 55km/h", "Thiết kế sang trọng"],
      isPopular: true,
      description: "VinFast Feliz S là mẫu xe máy điện cao cấp với thiết kế sang trọng và công nghệ tiên tiến. Xe được trang bị nhiều tính năng thông minh.",
      specifications: {
        battery: "Pin Lithium-ion 2.5 kWh",
        range: "90km (WLTP)",
        charging: "Sạc nhanh 2 giờ",
        seats: "2 chỗ ngồi",
        topSpeed: "55 km/h",
        acceleration: "0-55 km/h trong 7 giây"
      },
      highlights: [
        "Thiết kế sang trọng cao cấp",
        "Công nghệ thông minh",
        "Hiệu suất cao",
        "Tiện nghi đầy đủ",
        "Phù hợp mọi lứa tuổi"
      ],
      colors: [
        {
          name: "Trắng",
          hex: "#ffffff",
          available: true
        },
        {
          name: "Xanh lá",
          hex: "#10b981",
          available: true
        },
        {
          name: "Đỏ",
          hex: "#dc2626",
          available: true
        }
      ],
      rentalInfo: {
        deposit: "360,000 VNĐ",
        insurance: "Bảo hiểm toàn diện",
        delivery: "Giao xe tận nơi miễn phí",
        cancellation: "Hủy miễn phí trước 24h"
      }
    }
  ];

  const vehicle = allVehicles.find(v => v.id === vehicleId) || allVehicles[0];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % vehicle.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className={styles.detailVehicle}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.breadcrumb}>
            <span>Trang chủ</span>
            <span>Xe 4 bánh</span>
            <span>{vehicle.name}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.mainContent}>
          {/* Image Gallery */}
          <div className={styles.imageGallery}>
            <div className={styles.mainImage}>
              <img 
                src={vehicle.images[currentImageIndex]} 
                alt={vehicle.name}
              />
              <button className={styles.navButton} onClick={prevImage}>
                <LeftOutlined />
              </button>
              <button className={styles.navButton} onClick={nextImage}>
                <RightOutlined />
              </button>
              <div className={styles.imageCounter}>
                {currentImageIndex + 1} / {vehicle.images.length}
              </div>
            </div>
            
            <div className={styles.thumbnailContainer}>
              <div className={styles.thumbnailGrid}>
                {vehicle.images.map((image, index) => (
                  <div 
                    key={index}
                    className={`${styles.thumbnail} ${currentImageIndex === index ? styles.active : ''}`}
                    onClick={() => goToImage(index)}
                  >
                    <img src={image} alt={`${vehicle.name} ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Vehicle Info */}
          <div className={styles.vehicleInfo}>
            <div className={styles.titleSection}>
              <h1 className={styles.vehicleName}>{vehicle.name}</h1>
              <div className={styles.typeRatingRow}>
                <div className={styles.vehicleType}>
                  {vehicle.type === "Ô tô điện" ? <CarOutlined /> : <ThunderboltOutlined />}
                  <span>{vehicle.type}</span>
                </div>
                <div className={styles.rating}>
                  <StarOutlined />
                  <span>{vehicle.rating}</span>
                  <span className={styles.ratingText}>(4.8/5 từ 156 đánh giá)</span>
                </div>
              </div>
            </div>

            <div className={styles.priceSection}>
              <div className={styles.price}>
                <DollarOutlined />
                <span>{vehicle.price}</span>
              </div>
              <div className={styles.priceNote}>Giá đã bao gồm thuế và phí</div>
            </div>

            <div className={styles.features}>
              <h3>Đặc điểm nổi bật</h3>
              <div className={styles.featureList}>
                {vehicle.features.map((feature, index) => (
                  <div key={index} className={styles.featureItem}>
                    <CheckOutlined />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.colorSelection}>
              <h3>Màu sắc xe</h3>
              <div className={styles.colorList}>
                {vehicle.colors.map((color, index) => (
                  <div 
                    key={index} 
                    className={`${styles.colorOption} ${selectedColor === index ? styles.selected : ''} ${!color.available ? styles.unavailable : ''}`}
                    onClick={() => color.available && setSelectedColor(index)}
                  >
                    <div 
                      className={styles.colorSwatch}
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className={styles.colorName}>{color.name}</span>
                    {!color.available && (
                      <span className={styles.unavailableText}>Hết hàng</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.actionButtons}>
              <button className={styles.rentButton}>
                Thuê ngay
              </button>
              <button className={styles.contactButton}>
                Liên hệ tư vấn
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabsContainer}>
          <div className={styles.tabs}>
            <button 
              className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Tổng quan
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'specs' ? styles.active : ''}`}
              onClick={() => setActiveTab('specs')}
            >
              Thông số kỹ thuật
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'rental' ? styles.active : ''}`}
              onClick={() => setActiveTab('rental')}
            >
              Thông tin thuê
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'overview' && (
              <div className={styles.overview}>
                <div className={styles.description}>
                  <h3>Mô tả</h3>
                  <p>{vehicle.description}</p>
                </div>
                
                <div className={styles.highlights}>
                  <h3>Điểm nổi bật</h3>
                  <div className={styles.highlightList}>
                    {vehicle.highlights.map((highlight, index) => (
                      <div key={index} className={styles.highlightItem}>
                        <CheckOutlined />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className={styles.specifications}>
                <h3>Thông số kỹ thuật</h3>
                <div className={styles.specsGrid}>
                  <div className={styles.specItem}>
                    <EnvironmentOutlined />
                    <div>
                      <span className={styles.specLabel}>Pin</span>
                      <span className={styles.specValue}>{vehicle.specifications.battery}</span>
                    </div>
                  </div>
                  <div className={styles.specItem}>
                    <CarOutlined />
                    <div>
                      <span className={styles.specLabel}>Tầm hoạt động</span>
                      <span className={styles.specValue}>{vehicle.specifications.range}</span>
                    </div>
                  </div>
                  <div className={styles.specItem}>
                    <ClockCircleOutlined />
                    <div>
                      <span className={styles.specLabel}>Sạc</span>
                      <span className={styles.specValue}>{vehicle.specifications.charging}</span>
                    </div>
                  </div>
                  <div className={styles.specItem}>
                    <SafetyOutlined />
                    <div>
                      <span className={styles.specLabel}>Số chỗ ngồi</span>
                      <span className={styles.specValue}>{vehicle.specifications.seats}</span>
                    </div>
                  </div>
                  <div className={styles.specItem}>
                    <ThunderboltOutlined />
                    <div>
                      <span className={styles.specLabel}>Tốc độ tối đa</span>
                      <span className={styles.specValue}>{vehicle.specifications.topSpeed}</span>
                    </div>
                  </div>
                  <div className={styles.specItem}>
                    <StarOutlined />
                    <div>
                      <span className={styles.specLabel}>Tăng tốc</span>
                      <span className={styles.specValue}>{vehicle.specifications.acceleration}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'rental' && (
              <div className={styles.rentalInfo}>
                <h3>Thông tin thuê xe</h3>
                <div className={styles.rentalGrid}>
                  <div className={styles.rentalItem}>
                    <DollarOutlined />
                    <div>
                      <span className={styles.rentalLabel}>Tiền cọc</span>
                      <span className={styles.rentalValue}>{vehicle.rentalInfo.deposit}</span>
                    </div>
                  </div>
                  <div className={styles.rentalItem}>
                    <SafetyOutlined />
                    <div>
                      <span className={styles.rentalLabel}>Bảo hiểm</span>
                      <span className={styles.rentalValue}>{vehicle.rentalInfo.insurance}</span>
                    </div>
                  </div>
                  <div className={styles.rentalItem}>
                    <CarOutlined />
                    <div>
                      <span className={styles.rentalLabel}>Giao xe</span>
                      <span className={styles.rentalValue}>{vehicle.rentalInfo.delivery}</span>
                    </div>
                  </div>
                  <div className={styles.rentalItem}>
                    <ClockCircleOutlined />
                    <div>
                      <span className={styles.rentalLabel}>Hủy đặt</span>
                      <span className={styles.rentalValue}>{vehicle.rentalInfo.cancellation}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailVehicle;
