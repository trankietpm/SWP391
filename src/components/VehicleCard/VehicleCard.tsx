"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  StarOutlined, 
  DollarOutlined, 
  ThunderboltOutlined, 
  CarOutlined, 
  EnvironmentOutlined, 
  LeftOutlined, 
  RightOutlined 
} from '@ant-design/icons';
import { Vehicle, getImageUrl } from '../../services/vehicle.service';
import { Station } from '../../services/station.service';
import styles from './VehicleCard.module.scss';

interface VehicleCardProps {
  vehicle: Vehicle;
  stations?: Station[];
  imageIndex?: number;
  onImageChange?: (vehicleId: number, newIndex: number) => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ 
  vehicle, 
  stations = [],
  imageIndex = 0,
  onImageChange
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(imageIndex);

  const getVehicleImageUrl = (): string => {
    if (vehicle.images && vehicle.images.length > 0 && vehicle.images[currentImageIndex]) {
      return getImageUrl(vehicle.images[currentImageIndex]);
    }
    return '/images/placeholder.jpg';
  };

  const nextImage = () => {
    if (vehicle.images && vehicle.images.length > 0) {
      const nextIndex = (currentImageIndex + 1) % vehicle.images.length;
      setCurrentImageIndex(nextIndex);
      onImageChange?.(vehicle.id, nextIndex);
    }
  };

  const prevImage = () => {
    if (vehicle.images && vehicle.images.length > 0) {
      const prevIndex = currentImageIndex === 0 ? vehicle.images.length - 1 : currentImageIndex - 1;
      setCurrentImageIndex(prevIndex);
      onImageChange?.(vehicle.id, prevIndex);
    }
  };

  const stationAddress = vehicle.station?.address || 
    stations.find(station => station.id === vehicle.station_id)?.address || 
    'Địa chỉ không xác định';

  return (
    <div className={`${styles.vehicleCard} ${vehicle.vehicleModel?.isPopular ? styles.popular : ''}`}>
      {vehicle.vehicleModel?.isPopular && (
        <div className={styles.popularBadge}>
          <StarOutlined />
          Phổ biến
        </div>
      )}
      
      <div className={styles.vehicleImage}>
        <Image 
          src={getVehicleImageUrl()} 
          alt={vehicle.vehicleModel?.name || 'Vehicle'}
          width={350}
          height={200}
          style={{ objectFit: 'cover' }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/car.png';
          }}
        />
        {vehicle.images && vehicle.images.length > 1 && (
          <>
            <button 
              className={styles.imageNavButton} 
              onClick={prevImage}
            >
              <LeftOutlined />
            </button>
            <button 
              className={styles.imageNavButton} 
              onClick={nextImage}
            >
              <RightOutlined />
            </button>
          </>
        )}
      </div>
      
      <div className={styles.vehicleInfo}>
        <div className={styles.vehicleHeader}>
          <h3 className={styles.vehicleName}>{vehicle.vehicleModel?.name || 'Vehicle'}</h3>
          <div className={styles.typeRatingRow}>
            <div className={styles.vehicleType}>
              {vehicle.vehicleModel?.type === "Ô tô điện" ? <CarOutlined /> : <ThunderboltOutlined />}
              <span>{vehicle.vehicleModel?.type || ''}</span>
            </div>
            <div className={styles.rating}>
              <StarOutlined />
              <span>{vehicle.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
        
        {vehicle.vehicleModel?.features && vehicle.vehicleModel.features.length > 0 && (
          <div className={styles.features}>
            {vehicle.vehicleModel.features.slice(0, 3).map((feature: string, index: number) => (
              <span key={index} className={styles.feature}>
                {feature}
              </span>
            ))}
            {vehicle.vehicleModel.features.length > 3 && (
              <span className={styles.feature}>
                +{vehicle.vehicleModel.features.length - 3}
              </span>
            )}
          </div>
        )}
        
        <div className={styles.location}>
          <EnvironmentOutlined />
          <span>{stationAddress}</span>
        </div>
        
        <div className={styles.price}>
          <DollarOutlined />
          <span>{vehicle.vehicleModel?.price.toLocaleString('vi-VN') || '0'} VNĐ/ngày</span>
        </div>
        
        <Link 
          href={`/vehicle/${vehicle.id}${typeof window !== 'undefined' && window.location.search ? window.location.search : ''}`}
        >
          <button className={styles.rentButton}>
            Xem chi tiết
          </button>
        </Link>
      </div>
    </div>
  );
};

export default VehicleCard;

