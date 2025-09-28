'use client'
import React, { useState } from 'react';
import { EnvironmentOutlined, CalendarOutlined, CarOutlined, SearchOutlined } from '@ant-design/icons';
import { Input, DatePicker, Select } from 'antd';
import dayjs from 'dayjs';
import styles from './Hero.module.scss';

function Hero() {
  const [searchData, setSearchData] = useState({
    where: '',
    date: '',
    vehicleType: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search data:', searchData);
    // Handle search logic here
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
            <div className={styles.searchField}>
              <div className={styles.fieldIcon}>
                <EnvironmentOutlined />
              </div>
              <div className={styles.fieldContent}>
                <Input
                  placeholder="Bạn muốn đi đâu?"
                  value={searchData.where}
                  onChange={(e) => handleInputChange('where', e.target.value)}
                  variant="borderless"
                  size="large"
                />
              </div>
            </div>

            <div className={styles.searchField}>
              <div className={styles.fieldIcon}>
                <CalendarOutlined />
              </div>
              <div className={styles.fieldContent}>
                <DatePicker
                  placeholder="Chọn ngày"
                  value={searchData.date ? dayjs(searchData.date) : null}
                  onChange={(date) => handleInputChange('date', date ? date.format('YYYY-MM-DD') : '')}
                  variant="borderless"
                  size="large"
                  format="DD/MM/YYYY"
                />
              </div>
            </div>

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
