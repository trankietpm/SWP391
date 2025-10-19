"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CarOutlined, ThunderboltOutlined, StarOutlined, DollarOutlined, LeftOutlined, RightOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { carService, Car } from '../../services/car.service';
import { stationService, Station } from '../../services/station.service';
import styles from './PopularVehicles.module.scss';

const PopularVehicles: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'4wheeler' | '2wheeler'>('4wheeler');
  const [imageIndexes, setImageIndexes] = useState<{[key: number]: number}>({});
  const [fourWheelers, setFourWheelers] = useState<Car[]>([]);
  const [twoWheelers, setTwoWheelers] = useState<Car[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [carFiles, setCarFiles] = useState<{[key: number]: string[]}>({});

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carsData, stationsData] = await Promise.all([
          carService.getAllCars(),
          stationService.getActiveStations()
        ]);
        
        const fourWheelersData = carsData.filter(vehicle => vehicle.type === "Ô tô điện");
        const twoWheelersData = carsData.filter(vehicle => vehicle.type === "Xe máy điện");
        
        setFourWheelers(fourWheelersData);
        setTwoWheelers(twoWheelersData);
        setStations(stationsData);
        
        // Fetch car files for all cars
        const allCars = [...fourWheelersData, ...twoWheelersData];
        const carFilesData: {[key: number]: string[]} = {};
        
        for (const car of allCars) {
          try {
            const files = await carService.getCarFiles(car.id);
            carFilesData[car.id] = files.map(file => carService.getImageUrl(file.directus_files_id));
          } catch (error) {
            console.error(`Error fetching files for car ${car.id}:`, error);
            carFilesData[car.id] = [];
          }
        }
        
        setCarFiles(carFilesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Helper function to get image URL from car files
  const getImageUrl = (vehicleId: number, imageIndex: number): string => {
    const files = carFiles[vehicleId];
    if (files && files[imageIndex]) {
      return files[imageIndex];
    }
    return '/images/placeholder.jpg';
  };

  const currentVehicles = activeTab === '4wheeler' 
    ? carService.getActiveVehicles(fourWheelers, stations) 
    : carService.getActiveVehicles(twoWheelers, stations);

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
    const files = carFiles[vehicleId];
    if (files && files.length > 0) {
      const currentImageIndex = imageIndexes[vehicleId] || 0;
      const nextIndex = (currentImageIndex + 1) % files.length;
      setImageIndexes(prev => ({ ...prev, [vehicleId]: nextIndex }));
    }
  };

  const prevImage = (vehicleId: number) => {
    const files = carFiles[vehicleId];
    if (files && files.length > 0) {
      const currentImageIndex = imageIndexes[vehicleId] || 0;
      const prevIndex = currentImageIndex === 0 ? files.length - 1 : currentImageIndex - 1;
      setImageIndexes(prev => ({ ...prev, [vehicleId]: prevIndex }));
    }
  };

  if (loading) {
    return (
      <section className={styles.popularVehicles}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>Xe Dành Cho Bạn</h2>
            <p className={styles.subtitle}>Đang tải dữ liệu...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.popularVehicles}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Xe Dành Cho Bạn</h2>
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
                    src={getImageUrl(vehicle.id, imageIndexes[vehicle.id] || 0)} 
                    alt={vehicle.name}
                    width={300}
                    height={200}
                  />
                  {carFiles[vehicle.id] && carFiles[vehicle.id].length > 1 && (
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
                    {vehicle.features.slice(0, 3).map((feature: string, index: number) => (
                      <span key={index} className={styles.feature}>
                        {feature}
                      </span>
                    ))}
                    {vehicle.features.length > 3 && (
                      <span className={styles.feature}>
                        +{vehicle.features.length - 3}
                      </span>
                    )}
                  </div>
                  
                  <div className={styles.location}>
                    <EnvironmentOutlined />
                    <span>{stations.find(station => station.id === vehicle.stationId)?.address || 'Địa chỉ không xác định'}</span>
                  </div>
                  
                  <div className={styles.price}>
                    <DollarOutlined />
                    <span>{vehicle.price.toLocaleString()} VNĐ/ngày</span>
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
