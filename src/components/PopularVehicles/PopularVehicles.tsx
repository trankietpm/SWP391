"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CarOutlined, ThunderboltOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { vehicleService, Vehicle } from '../../services/vehicle.service';
import { stationService, Station } from '../../services/station.service';
import VehicleCard from '../VehicleCard/VehicleCard';
import styles from './PopularVehicles.module.scss';

const PopularVehicles: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'4wheeler' | '2wheeler'>('4wheeler');
  const [imageIndexes, setImageIndexes] = useState<{[key: number]: number}>({});
  const [fourWheelers, setFourWheelers] = useState<Vehicle[]>([]);
  const [twoWheelers, setTwoWheelers] = useState<Vehicle[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehiclesData, stationsData] = await Promise.all([
          vehicleService.getPopularVehicles(),
          stationService.getActiveStations()
        ]);
        
        // Filter vehicles by type and only available ones
        const availableVehicles = vehiclesData.filter(vehicle => vehicle.status === 'available');
        const fourWheelersData = availableVehicles.filter(vehicle => vehicle.vehicleModel?.type === "Ô tô điện");
        const twoWheelersData = availableVehicles.filter(vehicle => vehicle.vehicleModel?.type === "Xe máy điện");
        
        setFourWheelers(fourWheelersData);
        setTwoWheelers(twoWheelersData);
        setStations(stationsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

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

  const handleImageChange = (vehicleId: number, newIndex: number) => {
    setImageIndexes(prev => ({ ...prev, [vehicleId]: newIndex }));
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
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                stations={stations}
                imageIndex={imageIndexes[vehicle.id] || 0}
                onImageChange={handleImageChange}
              />
            ))}
          </div>
          
          <button className={styles.navButton} onClick={nextSlide} disabled={currentIndex >= currentVehicles.length - 3}>
            <RightOutlined />
          </button>
        </div>
        
        <div className={styles.viewAll}>
          <Link href="/vehicles">
            <button className={styles.viewAllButton}>
              Xem tất cả xe
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularVehicles;
