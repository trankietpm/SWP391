"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircleOutlined, CalendarOutlined, CarOutlined, EnvironmentOutlined, DollarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { bookingService, Booking } from '../../../services/booking.service';
import { vehicleService, Vehicle } from '../../../services/vehicle.service';
import { stationService, Station } from '../../../services/station.service';
import styles from './page.module.scss';

const PaymentSuccessContent: React.FC = () => {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [station, setStation] = useState<Station | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!bookingId) {
        setError('Không tìm thấy thông tin booking');
        setLoading(false);
        return;
      }

      const bookingData = await bookingService.getBookingById(parseInt(bookingId)).catch(() => {
        setError('Không tìm thấy thông tin booking');
        setLoading(false);
        return null;
      });

      if (!bookingData) return;

      setBooking(bookingData);

      if (bookingData.vehicle_id) {
        const vehicleData = await vehicleService.getVehicleById(bookingData.vehicle_id).catch(() => null);
        if (vehicleData) setVehicle(vehicleData);
      }

      if (bookingData.station_id) {
        const stationData = await stationService.getStationById(bookingData.station_id).catch(() => null);
        if (stationData) setStation(stationData);
      }

      setLoading(false);
    };

    fetchData();
  }, [bookingId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className={styles.paymentSuccess}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <div className={styles.loadingSpinner}></div>
            <p>Đang tải thông tin...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className={styles.paymentSuccess}>
        <div className={styles.container}>
          <div className={styles.error}>
            <p>{error || 'Không tìm thấy thông tin booking'}</p>
            <Link href="/" className={styles.backButton}>
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.paymentSuccess}>
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
                <span className={styles.detailValue}>{vehicle?.vehicleModel?.name || 'N/A'}</span>
              </div>
            </div>
            
            <div className={styles.detailRow}>
              <div className={styles.detailIcon}>
                <EnvironmentOutlined />
              </div>
              <div className={styles.detailContent}>
                <span className={styles.detailLabel}>Địa điểm lấy xe:</span>
                <span className={styles.detailValue}>{station?.address || 'N/A'}</span>
              </div>
            </div>
            
            <div className={styles.detailRow}>
              <div className={styles.detailIcon}>
                <CalendarOutlined />
              </div>
              <div className={styles.detailContent}>
                <span className={styles.detailLabel}>Thời gian thuê:</span>
                <span className={styles.detailValue}>
                  {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
                </span>
              </div>
            </div>
            
            <div className={styles.detailRow}>
              <div className={styles.detailIcon}>
                <ClockCircleOutlined />
              </div>
              <div className={styles.detailContent}>
                <span className={styles.detailLabel}>Số ngày thuê:</span>
                <span className={styles.detailValue}>{booking.total_days} ngày</span>
              </div>
            </div>
            
            <div className={styles.detailRow}>
              <div className={styles.detailIcon}>
                <DollarOutlined />
              </div>
              <div className={styles.detailContent}>
                <span className={styles.detailLabel}>Tổng tiền:</span>
                <span className={styles.detailValue}>{Number(booking.total_price).toLocaleString('vi-VN')} VNĐ</span>
              </div>
            </div>
          </div>
          
          <div className={styles.actions}>
            <Link href="/" className={styles.primaryButton}>
              Về trang chủ
            </Link>
            <Link href="/vehicles" className={styles.secondaryButton}>
              Xem thêm xe khác
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentSuccessPage: React.FC = () => {
  return (
    <Suspense fallback={
      <div className={styles.paymentSuccess}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <div className={styles.loadingSpinner}></div>
            <p>Đang tải thông tin...</p>
          </div>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
};

export default PaymentSuccessPage;

