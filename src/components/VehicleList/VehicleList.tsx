"use client"
import React, { useState, useMemo, useEffect } from 'react';
import { vehicleService, Vehicle } from '../../services/vehicle.service';
import { stationService, Station } from '../../services/station.service';
import { useSearchParams } from 'next/navigation';
import VehicleCard from '../VehicleCard/VehicleCard';
import DateRangePicker from '../DateRangePicker/DateRangePicker';
import { createTodayDateRange, formatDateForURL } from '../../hooks/useAutoSetToday';
import dayjs from 'dayjs';
import styles from './VehicleList.module.scss';

const VehicleList: React.FC = () => {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string[]>([]);
  const [filterStation, setFilterStation] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [sortBy, setSortBy] = useState('price-low');
  const [currentPage, setCurrentPage] = useState(1);
  const [imageIndexes, setImageIndexes] = useState<{[key: number]: number}>({});
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 12;

  const handleImageChange = (vehicleId: number, newIndex: number) => {
    setImageIndexes(prev => ({ ...prev, [vehicleId]: newIndex }));
  };

  // Fetch stations (chỉ fetch một lần)
  useEffect(() => {
    const fetchStations = async () => {
      const stationsData = await stationService.getActiveStations().catch(() => null);
      if (stationsData) setStations(stationsData);
    };
    
    fetchStations();
  }, []);

  // Fetch vehicles khi dateRange thay đổi
  useEffect(() => {
    const fetchVehicles = async () => {
      if (!dateRange || !dateRange[0] || !dateRange[1]) return;
      
      setLoading(true);
      
      const startDate = dateRange[0].format('YYYY-MM-DD HH:mm');
      const endDate = dateRange[1].format('YYYY-MM-DD HH:mm');
      const vehiclesData = await vehicleService.getAllVehicles({ startDate, endDate }).catch(() => []);
      
      setVehicles(vehiclesData);
      setLoading(false);
    };
    
    fetchVehicles();
  }, [dateRange]);

  // Initialize filters from URL parameters
  useEffect(() => {
    const station = searchParams.get('station');
    const type = searchParams.get('type');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    if (station) {
      setFilterStation([station]);
    }
    
    if (type) {
      if (type === 'electric-motorcycle') {
        setFilterCategory(['2-wheelers']);
      } else if (type === 'electric-car') {
        setFilterCategory(['4-wheelers']);
      }
    }

    // Parse dates from URL and set dateRange
    if (startDate || endDate) {
      if (startDate && endDate) {
        const start = dayjs(startDate, 'YYYY-MM-DD HH:mm');
        const end = dayjs(endDate, 'YYYY-MM-DD HH:mm');
        if (start.isValid() && end.isValid()) {
          setDateRange([start, end]);
        }
      }
    } else {
      // Nếu không có startDate và endDate, tự động tạo ngày hôm nay với giờ hiện tại
      const [startDateTime, endDateTime] = createTodayDateRange();
      setDateRange([startDateTime, endDateTime]);
      
      const newParams = new URLSearchParams();
      newParams.set('startDate', formatDateForURL(startDateTime));
      newParams.set('endDate', formatDateForURL(endDateTime));
      
      const newUrl = `${window.location.pathname}?${newParams.toString()}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, [searchParams]);
  
  // Update URL when dateRange changes
  useEffect(() => {
    if (dateRange && dateRange[0] && dateRange[1]) {
      const newParams = new URLSearchParams(window.location.search);
      newParams.set('startDate', formatDateForURL(dateRange[0]));
      newParams.set('endDate', formatDateForURL(dateRange[1]));
      const newUrl = `${window.location.pathname}?${newParams.toString()}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, [dateRange]);

  const filteredVehicles = useMemo(() => {
    // Chỉ lấy xe từ các trạm đang hoạt động và có status available
    const activeStations = stations.filter(s => s.status === 'active');
    const activeStationIds = new Set(activeStations.map(s => s.id));
    
    const filtered = vehicles.filter(vehicle => {
      const matchesSearch = vehicle.vehicleModel?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           vehicle.vehicleModel?.type.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = filterCategory.length === 0 || 
                             (filterCategory.includes('2-wheelers') && vehicle.vehicleModel?.type === 'Xe máy điện') ||
                             (filterCategory.includes('4-wheelers') && vehicle.vehicleModel?.type === 'Ô tô điện');
      
      const matchesStation = filterStation.length === 0 || filterStation.includes(vehicle.station_id.toString());
      
      const isActiveStation = activeStationIds.has(vehicle.station_id);
      
      return matchesSearch && matchesCategory && matchesStation && isActiveStation && vehicle.status === 'available';
    });

    // Sort vehicles
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.vehicleModel?.price || 0) - (b.vehicleModel?.price || 0);
        case 'price-high':
          return (b.vehicleModel?.price || 0) - (a.vehicleModel?.price || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, filterCategory, filterStation, sortBy, stations, vehicles]);

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentVehicles = filteredVehicles.slice(startIndex, startIndex + itemsPerPage);

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
            <h3>Thời gian thuê</h3>
            <div className={styles.dateRangeWrapper}>
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
                placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                format="DD/MM/YYYY HH:mm"
                style={{ width: '100%' }}
              />
            </div>
          </div>

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
                  checked={filterCategory.includes('2-wheelers')}
                  onChange={() => {
                    if (filterCategory.includes('2-wheelers')) {
                      setFilterCategory(filterCategory.filter(c => c !== '2-wheelers'));
                    } else {
                      setFilterCategory([...filterCategory, '2-wheelers']);
                    }
                  }}
                />
                Xe máy điện
              </label>
              <label>
                <input 
                  type="checkbox" 
                  checked={filterCategory.includes('4-wheelers')}
                  onChange={() => {
                    if (filterCategory.includes('4-wheelers')) {
                      setFilterCategory(filterCategory.filter(c => c !== '4-wheelers'));
                    } else {
                      setFilterCategory([...filterCategory, '4-wheelers']);
                    }
                  }}
                />
                Ô tô điện
              </label>
            </div>
          </div>

          <div className={styles.filterSection}>
            <h3>Trạm</h3>
            <div className={styles.checkboxGroup}>
              {/* Group by city - chỉ hiển thị trạm đang hoạt động */}
              {(() => {
                const activeStations = stations.filter(station => station.status === 'active');
                const cities = [...new Set(activeStations.map(station => station.city))];
                
                return cities.map(city => {
                  const cityStations = activeStations.filter(station => station.city === city);
                  return (
                    <div key={city} className={styles.cityGroup}>
                      <div className={styles.cityHeader}>
                        <span className={styles.cityName}>{city}</span>
                        <span className={styles.stationCount}>({cityStations.length})</span>
                      </div>
                      <div className={`${styles.stationList} ${styles.expanded}`}>
                        {cityStations.map(station => (
                          <label key={station.id} className={styles.stationItem}>
                            <input 
                              type="checkbox" 
                              checked={filterStation.includes(station.id.toString())}
                              onChange={() => {
                                if (filterStation.includes(station.id.toString())) {
                                  setFilterStation(filterStation.filter(s => s !== station.id.toString()));
                                } else {
                                  setFilterStation([...filterStation, station.id.toString()]);
                                }
                              }}
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
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            stations={stations}
            imageIndex={imageIndexes[vehicle.id] || 0}
            onImageChange={handleImageChange}
          />
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
