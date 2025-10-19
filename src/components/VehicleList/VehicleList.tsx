"use client"
import React, { useState, useMemo, useEffect } from 'react';
import { StarOutlined, DollarOutlined, ThunderboltOutlined, CarOutlined, EnvironmentOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { carService, Car } from '../../services/car.service';
import { stationService, Station } from '../../services/station.service';
import { useSearchParams } from 'next/navigation';
import styles from './VehicleList.module.scss';
import Link from 'next/link';
import Image from 'next/image';

const VehicleList: React.FC = () => {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStation, setFilterStation] = useState('all');
  const [sortBy, setSortBy] = useState('price-low');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCities, setExpandedCities] = useState<string[]>([]);
  const [imageIndexes, setImageIndexes] = useState<{[key: number]: number}>({});
  const [vehicles, setVehicles] = useState<Car[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [carFiles, setCarFiles] = useState<{[key: number]: string[]}>({});
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 12;

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carsData, stationsData] = await Promise.all([
          carService.getAllCars(),
          stationService.getActiveStations()
        ]);
        
        setVehicles(carsData);
        setStations(stationsData);
        
        // Fetch car files for all cars
        const carFilesData: {[key: number]: string[]} = {};
        
        for (const car of carsData) {
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

  // Initialize filters from URL parameters
  useEffect(() => {
    const station = searchParams.get('station');
    const type = searchParams.get('type');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    if (station) {
      setFilterStation(station);
      // Tự động mở city chứa station được chọn
      const selectedStation = stations.find(s => s.id.toString() === station);
      if (selectedStation) {
        setExpandedCities(prev => {
          if (!prev.includes(selectedStation.city)) {
            return [...prev, selectedStation.city];
          }
          return prev;
        });
      }
    }
    
    if (type) {
      if (type === 'electric-motorcycle') {
        setFilterCategory('2-wheelers');
      } else if (type === 'electric-car') {
        setFilterCategory('4-wheelers');
      }
    }

    // Cập nhật URL để chỉ giữ lại startDate và endDate
    if (startDate || endDate) {
      const newParams = new URLSearchParams();
      if (startDate) newParams.set('startDate', startDate);
      if (endDate) newParams.set('endDate', endDate);
      
      const newUrl = `${window.location.pathname}?${newParams.toString()}`;
      window.history.replaceState({}, '', newUrl);
    } else {
      // Nếu không có startDate và endDate, tự động tạo ngày hiện tại với giờ 6:00-22:00
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      const startDateTime = new Date(today);
      startDateTime.setHours(6, 0, 0, 0);
      
      const endDateTime = new Date(today);
      endDateTime.setHours(22, 0, 0, 0);
      
      // Format: YYYY-MM-DD HH:mm (match với Hero component)
      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
      };
      
      const newParams = new URLSearchParams();
      newParams.set('startDate', formatDate(startDateTime));
      newParams.set('endDate', formatDate(endDateTime));
      
      const newUrl = `${window.location.pathname}?${newParams.toString()}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, [searchParams, stations]);

  const filteredVehicles = useMemo(() => {
    // Chỉ lấy xe từ các trạm đang hoạt động
    const activeVehicles = carService.getActiveVehicles(vehicles, stations);
    
    const filtered = activeVehicles.filter(vehicle => {
      const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           vehicle.type.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = filterCategory === 'all' || 
                             (filterCategory === '2-wheelers' && vehicle.type.includes('Xe máy điện')) ||
                             (filterCategory === '4-wheelers' && vehicle.type.includes('Ô tô điện'));
      
      const matchesStation = filterStation === 'all' || vehicle.stationId.toString() === filterStation;
      
      return matchesSearch && matchesCategory && matchesStation;
    });

    // Sort vehicles
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, filterCategory, filterStation, sortBy, stations, vehicles]);

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentVehicles = filteredVehicles.slice(startIndex, startIndex + itemsPerPage);


  const getVehicleImage = (vehicle: Car) => {
    const files = carFiles[vehicle.id];
    if (files && files.length > 0) {
      const currentImageIndex = imageIndexes[vehicle.id] || 0;
      return files[currentImageIndex];
    }
    return '/images/car.png'; // fallback image
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

  const toggleCity = (city: string) => {
    setExpandedCities(prev => 
      prev.includes(city) 
        ? prev.filter(c => c !== city)
        : [...prev, city]
    );
  };

  // Tự động expand city khi search theo tên station
  useEffect(() => {
    if (searchTerm) {
      const matchingStations = stations.filter(station => 
        station.status === 'active' && 
        station.district.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      if (matchingStations.length > 0) {
        const citiesToExpand = [...new Set(matchingStations.map(s => s.city))];
        setExpandedCities(prev => {
          const newCities = citiesToExpand.filter(city => !prev.includes(city));
          return [...prev, ...newCities];
        });
      }
    }
  }, [searchTerm, stations]);


  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>


      <div className={styles.mainContent}>
        <div className={styles.sidebar}>
          <div className={styles.filterSection}>
            <h3>Tìm kiếm</h3>
            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="Tìm kiếm xe theo tên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.filterSection}>
            <h3>Loại xe</h3>
            <div className={styles.checkboxGroup}>
              <label>
                <input 
                  type="checkbox" 
                  checked={filterCategory === 'all'}
                  onChange={() => setFilterCategory('all')}
                />
                Tất cả
              </label>
              <label>
                <input 
                  type="checkbox" 
                  checked={filterCategory === '2-wheelers'}
                  onChange={() => setFilterCategory('2-wheelers')}
                />
                Xe máy điện
              </label>
              <label>
                <input 
                  type="checkbox" 
                  checked={filterCategory === '4-wheelers'}
                  onChange={() => setFilterCategory('4-wheelers')}
                />
                Ô tô điện
              </label>
            </div>
          </div>

          <div className={styles.filterSection}>
            <h3>Trạm</h3>
            <div className={styles.checkboxGroup}>
              <label>
                <input 
                  type="checkbox" 
                  checked={filterStation === 'all'}
                  onChange={() => setFilterStation('all')}
                />
                Tất cả trạm
              </label>
              
              {/* Group by city - chỉ hiển thị trạm đang hoạt động */}
              {(() => {
                const activeStations = stations.filter(station => station.status === 'active');
                const cities = [...new Set(activeStations.map(station => station.city))];
                
                return cities.map(city => {
                  const cityStations = activeStations.filter(station => station.city === city);
                  return (
                    <div key={city} className={styles.cityGroup}>
                      <div 
                        className={styles.cityHeader}
                        onClick={() => toggleCity(city)}
                      >
                        <span className={styles.cityName}>{city}</span>
                        <span className={styles.stationCount}>({cityStations.length})</span>
                      </div>
                      <div className={`${styles.stationList} ${expandedCities.includes(city) ? styles.expanded : ''}`}>
                        {cityStations.map(station => (
                          <label key={station.id} className={styles.stationItem}>
                            <input 
                              type="checkbox" 
                              checked={filterStation === station.id.toString()}
                              onChange={() => setFilterStation(station.id.toString())}
                            />
                            {station.district}
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.resultsInfo}>
            <span>{filteredVehicles.length} xe được tìm thấy</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="price-low">Giá: Thấp đến cao</option>
              <option value="price-high">Giá: Cao đến thấp</option>
            </select>
          </div>

          <div className={styles.vehicleGrid}>
        {currentVehicles.map((vehicle) => (
          <div key={vehicle.id} className={`${styles.vehicleCard} ${vehicle.isPopular ? styles.popular : ''}`}>
            {vehicle.isPopular && (
              <div className={styles.popularBadge}>
                <StarOutlined />
                Phổ biến
              </div>
            )}
            
            <div className={styles.vehicleImage}>
              <Image 
                src={getVehicleImage(vehicle)} 
                alt={vehicle.name}
                width={350}
                height={200}
                style={{ objectFit: 'cover' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/car.png';
                }}
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
                <div className={styles.nameAvailabilityRow}>
                  <h3 className={styles.vehicleName}>{vehicle.name}</h3>
                  <div className={styles.availableCount}>
                    <span className={styles.availableLabel}>Còn lại:</span>
                    <span className={styles.availableNumber}>{vehicle.availableCount} xe</span>
                  </div>
                </div>
                
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
                {vehicle.features.slice(0, 3).map((feature, index) => (
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

          {totalPages > 1 && (
            <div className={styles.pagination}>
          <button 
            className={`${styles.paginationBtn} ${currentPage === 1 ? styles.disabled : ''}`}
            onClick={() => {
              if (currentPage !== 1) {
                setCurrentPage(1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            Đầu
          </button>
          <button 
            className={`${styles.paginationBtn} ${currentPage === 1 ? styles.disabled : ''}`}
            onClick={() => {
              if (currentPage > 1) {
                setCurrentPage(currentPage - 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            Trước
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`${styles.paginationBtn} ${currentPage === page ? styles.active : ''}`}
              onClick={() => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              {page}
            </button>
          ))}
          
          <button 
            className={`${styles.paginationBtn} ${currentPage === totalPages ? styles.disabled : ''}`}
            onClick={() => {
              if (currentPage < totalPages) {
                setCurrentPage(currentPage + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            Sau
          </button>
          <button 
            className={`${styles.paginationBtn} ${currentPage === totalPages ? styles.disabled : ''}`}
            onClick={() => {
              if (currentPage !== totalPages) {
                setCurrentPage(totalPages);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            Cuối
          </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleList;
