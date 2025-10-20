"use client";
import React from 'react';
import { CheckCircleOutlined, CalendarOutlined, CarOutlined, EnvironmentOutlined, DollarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';
import styles from './BookingSuccess.module.scss';

interface BookingSuccessProps {
  vehicleName: string;
  stationAddress: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalPrice: number;
  onClose: () => void;
}

const BookingSuccess: React.FC<BookingSuccessProps> = ({
  vehicleName,
  stationAddress,
  startDate,
  endDate,
  totalDays,
  totalPrice,
  onClose
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.bookingSuccess}>
      <div className={styles.container}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>
            <CheckCircleOutlined />
          </div>
          
          <h1 className={styles.title}>Đặt xe thành công!</h1>
          <p className={styles.subtitle}>Chúng tôi sẽ liên hệ với bạn để xác nhận thông tin</p>
          
          <div className={styles.bookingDetails}>
            <h3>Thông tin đặt xe</h3>
            
            <div className={styles.detailRow}>
              <div className={styles.detailIcon}>
                <CarOutlined />
              </div>
              <div className={styles.detailContent}>
                <span className={styles.detailLabel}>Xe đã đặt:</span>
                <span className={styles.detailValue}>{vehicleName}</span>
              </div>
            </div>
            
            <div className={styles.detailRow}>
              <div className={styles.detailIcon}>
                <EnvironmentOutlined />
              </div>
              <div className={styles.detailContent}>
                <span className={styles.detailLabel}>Địa điểm lấy xe:</span>
                <span className={styles.detailValue}>{stationAddress}</span>
              </div>
            </div>
            
            <div className={styles.detailRow}>
              <div className={styles.detailIcon}>
                <CalendarOutlined />
              </div>
              <div className={styles.detailContent}>
                <span className={styles.detailLabel}>Thời gian thuê:</span>
                <span className={styles.detailValue}>
                  {formatDate(startDate)} - {formatDate(endDate)}
                </span>
              </div>
            </div>
            
            <div className={styles.detailRow}>
              <div className={styles.detailIcon}>
                <ClockCircleOutlined />
              </div>
              <div className={styles.detailContent}>
                <span className={styles.detailLabel}>Số ngày thuê:</span>
                <span className={styles.detailValue}>{totalDays} ngày</span>
              </div>
            </div>
            
            <div className={styles.detailRow}>
              <div className={styles.detailIcon}>
                <DollarOutlined />
              </div>
              <div className={styles.detailContent}>
                <span className={styles.detailLabel}>Tổng tiền:</span>
                <span className={styles.detailValue}>{totalPrice.toLocaleString('vi-VN')} VNĐ</span>
              </div>
            </div>
          </div>
          
          
          <div className={styles.actions}>
            <button className={styles.primaryButton} onClick={onClose}>
              Đóng
            </button>
            <Link href="/vehicles" className={styles.secondaryButton}>
              Xem thêm xe khác
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
