"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CarOutlined, ThunderboltOutlined, StarOutlined, DollarOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import styles from './PopularVehicles.module.scss';

const PopularVehicles: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'4wheeler' | '2wheeler'>('4wheeler');
  const [imageIndexes, setImageIndexes] = useState<{[key: number]: number}>({});
  
  const fourWheelers = [
    {
      id: 1,
      name: "VinFast VF8",
      type: "Ô tô điện",
      images: [
        "/images/4 wheelers/VF/VF8/vinfast-vf8-banner-11042025.jpg",
        "/images/4 wheelers/VF/VF8/vinfast-vf8-mau-xe-den.png",
        "/images/4 wheelers/VF/VF8/vinfast-vf8-mau-xe-trang.png",
        "/images/4 wheelers/VF/VF8/vinfast-vf8-mau-xe-do.png",
        "/images/4 wheelers/VF/VF8/vinfast-vf8-mau-xe-xam.png",
        "/images/4 wheelers/VF/VF8/vinfast-vf8-mau-xe-xanh-la.png",
        "/images/4 wheelers/VF/VF8/vinfast-vf8-mau-xe-xanh.png",
        "/images/4 wheelers/VF/VF8/vinfast-vf8-ngoai-that-11042025-1.jpg"
      ],
      price: "2,500,000 VNĐ/ngày",
      rating: 4.8,
      features: ["Pin 400km", "Sạc nhanh 30 phút", "5 chỗ ngồi"],
      isPopular: true
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
      isPopular: true
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
      isPopular: false
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
      isPopular: true
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
      isPopular: false
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
      isPopular: false
    }
  ];

  const twoWheelers = [
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
      isPopular: true
    },
    {
      id: 8,
      name: "VinFast Theon S",
      type: "Xe máy điện thể thao",
      images: [
        "/images/2 wheelers/High-end/Theon S/theons-white.png",
        "/images/2 wheelers/High-end/Theon S/theons-red.png",
        "/images/2 wheelers/High-end/Theon S/theons-black-sp.png"
      ],
      price: "120,000 VNĐ/ngày",
      rating: 4.5,
      features: ["Pin 70km", "Tốc độ 45km/h", "Thiết kế thể thao"],
      isPopular: false
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
      isPopular: true
    },
    {
      id: 10,
      name: "VinFast Evo200",
      type: "Xe máy điện tầm trung",
      images: [
        "/images/2 wheelers/Low-end/Evo 200/img-evo-white.png",
        "/images/2 wheelers/Low-end/Evo 200/img-evo-blue.png",
        "/images/2 wheelers/Low-end/Evo 200/img-evo-red.png"
      ],
      price: "100,000 VNĐ/ngày",
      rating: 4.4,
      features: ["Pin 65km", "Tốc độ 45km/h", "Thiết kế năng động"],
      isPopular: false
    },
    {
      id: 11,
      name: "VinFast Evo Grand",
      type: "Xe máy điện tầm trung",
      images: [
        "/images/2 wheelers/Low-end/Evo Grand/img-evogrand-white.png",
        "/images/2 wheelers/Low-end/Evo Grand/img-evogrand-red.png",
        "/images/2 wheelers/Low-end/Evo Grand/img-evogrand-cream.png"
      ],
      price: "80,000 VNĐ/ngày",
      rating: 4.3,
      features: ["Pin 60km", "Tốc độ 40km/h", "Thiết kế gọn gàng"],
      isPopular: true
    },
    {
      id: 12,
      name: "VinFast Vento S",
      type: "Xe máy điện cao cấp",
      images: [
        "/images/2 wheelers/High-end/Vento S/img-top-ventos-white.png",
        "/images/2 wheelers/High-end/Vento S/img-top-ventos-blue.png",
        "/images/2 wheelers/High-end/Vento S/img-top-ventos-orange.png"
      ],
      price: "200,000 VNĐ/ngày",
      rating: 4.9,
      features: ["Pin 100km", "Tốc độ 60km/h", "Thiết kế cao cấp"],
      isPopular: true
    }
  ];

  const currentVehicles = activeTab === '4wheeler' ? fourWheelers : twoWheelers;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, currentVehicles.length - 2));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, currentVehicles.length - 2)) % Math.max(1, currentVehicles.length - 2));
  };

  const visibleVehicles = currentVehicles.slice(currentIndex, currentIndex + 3);

  const handleTabChange = (tab: '4wheeler' | '2wheeler') => {
    setActiveTab(tab);
    setCurrentIndex(0);
  };

  const nextImage = (vehicleId: number) => {
    const vehicle = currentVehicles.find(v => v.id === vehicleId);
    if (vehicle && vehicle.images) {
      const currentImageIndex = imageIndexes[vehicleId] || 0;
      const nextIndex = (currentImageIndex + 1) % vehicle.images.length;
      setImageIndexes(prev => ({ ...prev, [vehicleId]: nextIndex }));
    }
  };

  const prevImage = (vehicleId: number) => {
    const vehicle = currentVehicles.find(v => v.id === vehicleId);
    if (vehicle && vehicle.images) {
      const currentImageIndex = imageIndexes[vehicleId] || 0;
      const prevIndex = currentImageIndex === 0 ? vehicle.images.length - 1 : currentImageIndex - 1;
      setImageIndexes(prev => ({ ...prev, [vehicleId]: prevIndex }));
    }
  };

  return (
    <section className={styles.popularVehicles}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Xe Phổ Biến</h2>
          <p className={styles.subtitle}>
            Khám phá những mẫu xe điện được yêu thích nhất của chúng tôi
          </p>
          
          <div className={styles.tabContainer}>
            <button 
              className={`${styles.tab} ${activeTab === '4wheeler' ? styles.active : ''}`}
              onClick={() => handleTabChange('4wheeler')}
            >
              <CarOutlined />
              Xe 4 bánh
            </button>
            <button 
              className={`${styles.tab} ${activeTab === '2wheeler' ? styles.active : ''}`}
              onClick={() => handleTabChange('2wheeler')}
            >
              <ThunderboltOutlined />
              Xe 2 bánh
            </button>
          </div>
        </div>

        <div className={styles.vehiclesContainer}>
          <button className={styles.navButton} onClick={prevSlide} disabled={currentIndex === 0}>
            <LeftOutlined />
          </button>
          
          <div className={styles.vehiclesGrid}>
            {visibleVehicles.map((vehicle) => (
              <div key={vehicle.id} className={`${styles.vehicleCard} ${vehicle.isPopular ? styles.popular : ''}`}>
                {vehicle.isPopular && (
                  <div className={styles.popularBadge}>
                    <StarOutlined />
                    Phổ biến
                  </div>
                )}
                
                <div className={styles.vehicleImage}>
                  <Image 
                    src={vehicle.images[imageIndexes[vehicle.id] || 0]} 
                    alt={vehicle.name}
                    width={300}
                    height={200}
                  />
                  {vehicle.images && vehicle.images.length > 1 && (
                    <>
                      <button 
                        className={styles.imageNavButton} 
                        onClick={() => prevImage(vehicle.id)}
                      >
                        <LeftOutlined />
                      </button>
                      <button 
                        className={styles.imageNavButton} 
                        onClick={() => nextImage(vehicle.id)}
                      >
                        <RightOutlined />
                      </button>
                      <div className={styles.imageDots}>
                        {vehicle.images.map((_, index) => (
                          <span 
                            key={index}
                            className={`${styles.dot} ${(imageIndexes[vehicle.id] || 0) === index ? styles.active : ''}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
                
                <div className={styles.vehicleInfo}>
                   <div className={styles.vehicleHeader}>
                     <h3 className={styles.vehicleName}>{vehicle.name}</h3>
                     <div className={styles.typeRatingRow}>
                       <div className={styles.vehicleType}>
                         {vehicle.type === "Ô tô điện" ? <CarOutlined /> : <ThunderboltOutlined />}
                         <span>{vehicle.type}</span>
                       </div>
                       <div className={styles.rating}>
                         <StarOutlined />
                         <span>{vehicle.rating}</span>
                       </div>
                     </div>
                   </div>
                  
                  <div className={styles.features}>
                    {vehicle.features.map((feature, index) => (
                      <span key={index} className={styles.feature}>
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  <div className={styles.price}>
                    <DollarOutlined />
                    <span>{vehicle.price}</span>
                  </div>
                  
                  <Link href={`/vehicle/${vehicle.id}`}>
                    <button className={styles.rentButton}>
                      Xem chi tiết
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <button className={styles.navButton} onClick={nextSlide} disabled={currentIndex >= currentVehicles.length - 3}>
            <RightOutlined />
          </button>
        </div>
        
        <div className={styles.viewAll}>
          <button className={styles.viewAllButton}>
            Xem tất cả xe
          </button>
        </div>
      </div>
    </section>
  );
};

export default PopularVehicles;
