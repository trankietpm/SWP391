'use client'
import React, { useState, useEffect } from 'react';
import { EnvironmentOutlined, CalendarOutlined, CarOutlined, SearchOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import dayjs from 'dayjs';
import DateRangePicker from '../DateRangePicker/DateRangePicker';
import { stationService } from '../../services/station.service';
import { useRouter } from 'next/navigation';
import styles from './Hero.module.scss';

function Hero() {
  const router = useRouter();
  const [searchData, setSearchData] = useState({
    where: '',
    dateRange: null as [dayjs.Dayjs | null, dayjs.Dayjs | null] | null,
    vehicleType: 'both'
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [stations, setStations] = useState<{id: number; name: string; city: string; district: string; status: string}[]>([]);
  const [loading, setLoading] = useState(true);

  // Prevent body scroll when dropdown is open
  useEffect(() => {
    if (isDropdownOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.querySelector("html")!.style.overflow = "hidden";
      document.querySelector("html")!.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.querySelector("html")!.style.overflow = "";
      document.querySelector("html")!.style.paddingRight = "";
    }

    return () => {
      document.querySelector("html")!.style.overflow = "";
      document.querySelector("html")!.style.paddingRight = "";
    };
  }, [isDropdownOpen]);

  // Listen for dropdown open/close events
  useEffect(() => {
    const handleDropdownToggle = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('.ant-select')) {
        setIsDropdownOpen(true);
      } else {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleDropdownToggle);
    
    return () => {
      document.removeEventListener('click', handleDropdownToggle);
    };
  }, []);

  // Fetch stations from API
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const data = await stationService.getActiveStations();
        setStations(data);
      } catch (error) {
        console.error('Error fetching stations:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStations();
  }, []);

  const handleInputChange = (field: string, value: string | [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }));
    
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build query parameters
    const params = new URLSearchParams();
    
    // Nếu có chọn trạm thì thêm vào params, không có thì search tất cả
    if (searchData.where) {
      params.append('station', searchData.where);
    }
    
    if (searchData.vehicleType && searchData.vehicleType !== 'both') {
      params.append('type', searchData.vehicleType);
    }
    
    if (searchData.dateRange && Array.isArray(searchData.dateRange) && searchData.dateRange.length === 2) {
      const [startDate, endDate] = searchData.dateRange;
      if (startDate && endDate) {
        params.append('startDate', startDate.format('YYYY-MM-DD HH:mm'));
        params.append('endDate', endDate.format('YYYY-MM-DD HH:mm'));
      }
    }
    
    // Navigate to vehicles page with parameters
    const queryString = params.toString();
    router.push(`/vehicles${queryString ? `?${queryString}` : ''}`);
  };

  return (
    <section className={styles.hero}>
      <img src="/images/bg.jpg" alt="Electric Vehicle Background" className={styles.heroImage} />
      <div className={styles.heroContent}>
        <div className={styles.heroText}>
          <h1>Thuê Xe Điện</h1>
          <p>Khám phá thành phố với xe máy điện và ô tô điện thân thiện môi trường</p>
        </div>
        
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <div className={styles.searchContainer}>
            <div className={styles.fieldWrapper}>
              <div className={styles.searchField}>
                <div className={styles.fieldIcon}>
                  <EnvironmentOutlined />
                </div>
                <div className={styles.fieldContent}>
                  <Select
                    placeholder="Trạm thuê xe"
                    value={searchData.where || undefined}
                    onChange={(value) => handleInputChange('where', value || '')}
                    variant="borderless"
                    size="large"
                    options={(() => {
                      if (loading) return [];
                      
                      // Chỉ lấy các trạm đang hoạt động
                      const activeStations = stations.filter(station => station.status === 'active');
                      const cities = [...new Set(activeStations.map(station => station.city))];
                      
                      return cities.map(city => ({
                        label: city,
                        options: activeStations
                          .filter(station => station.city === city)
                          .map(station => ({
                            value: station.id.toString(),
                            label: station.district
                          }))
                      }));
                    })()}
                  />
                </div>
              </div>
            </div>

            <div className={styles.fieldWrapper}>
              <div className={styles.searchField}>
                <div className={styles.fieldIcon}>
                  <CarOutlined />
                </div>
                <div className={styles.fieldContent}>
                  <Select
                    placeholder="Loại xe"
                    value={searchData.vehicleType || undefined}
                    onChange={(value) => handleInputChange('vehicleType', value || '')}
                    variant="borderless"
                    size="large"
                    options={[
                      { value: 'both', label: 'Tất cả' },
                      { value: 'electric-motorcycle', label: 'Xe máy điện' },
                      { value: 'electric-car', label: 'Ô tô điện' }
                    ]}
                  />
                </div>
              </div>
            </div>

            <div className={styles.fieldWrapper}>
              <div className={styles.searchField}>
                <div className={styles.fieldIcon}>
                  <CalendarOutlined />
                </div>
                <div className={styles.fieldContent}>
                  <DateRangePicker
                    value={searchData.dateRange}
                    onChange={(dates) => handleInputChange('dateRange', dates)}
                    placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                    format="DD/MM/YYYY HH:mm"
                    variant="borderless"
                  />
                </div>
              </div>
            </div>

            <button type="submit" className={styles.searchButton}>
              <SearchOutlined />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Hero;
