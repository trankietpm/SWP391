"use client";
import React, { useState, useEffect } from 'react';
import { CarOutlined, ThunderboltOutlined, StarOutlined, LeftOutlined, RightOutlined, CheckOutlined, ClockCircleOutlined, SafetyOutlined, EnvironmentOutlined, PictureOutlined, CloseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import DateRangePicker from '../DateRangePicker/DateRangePicker';
import Link from 'next/link';
import { vehicleService, Vehicle, getImageUrl } from '../../services/vehicle.service';
import { stationService, Station } from '../../services/station.service';
import { bookingService, CreateBookingRequest } from '../../services/booking.service';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './DetailVehicle.module.scss';


interface DetailVehicleProps {
  vehicleId?: number;
}

const DetailVehicle: React.FC<DetailVehicleProps> = ({ vehicleId = 1 }) => {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showGallery, setShowGallery] = useState(false);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [totalDays, setTotalDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [station, setStation] = useState<Station | null>(null);
  const [vehicleImages, setVehicleImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [showCollateralModal, setShowCollateralModal] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Prevent body scroll when any modal is open
  useEffect(() => {
    if (showGallery || showDocumentsModal || showCollateralModal) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.querySelector("html")!.style.overflow = "hidden";
      document.querySelector("html")!.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.querySelector("html")!.style.overflow = "";
      document.querySelector("html")!.style.paddingRight = "";
    }
  }, [showGallery, showDocumentsModal, showCollateralModal]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.querySelector("html")!.style.overflow = "";
      document.querySelector("html")!.style.paddingRight = "";
    };
  }, []);

  // Initialize dateRange from URL params and remove from URL
  React.useEffect(() => {
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    if (startDate && endDate) {
      const start = dayjs(startDate, 'YYYY-MM-DD HH:mm');
      const end = dayjs(endDate, 'YYYY-MM-DD HH:mm');
      if (start.isValid() && end.isValid()) {
        setDateRange([start, end]);
        // Remove query string from URL without reloading
        if (typeof window !== 'undefined') {
          window.history.replaceState({}, '', window.location.pathname);
        }
      }
    }
  }, [searchParams]);

  // Fetch vehicle and station data from API
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const vehicleData = await vehicleService.getVehicleById(vehicleId);
        
        if (vehicleData) {
          setVehicle(vehicleData);
          
          // Get images from vehicle.images
          if (vehicleData.images && vehicleData.images.length > 0) {
            const imageUrls = vehicleData.images.map(image => getImageUrl(image));
            setVehicleImages(imageUrls);
          } else {
            setVehicleImages([]);
          }
          
          // Fetch station data
          if (vehicleData.station_id) {
            try {
              const stationData = await stationService.getStationById(vehicleData.station_id);
              if (stationData) {
                setStation(stationData);
              }
            } catch (error) {
              console.error('Error fetching station:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [vehicleId]);

  React.useEffect(() => {
    if (dateRange && dateRange[0] && dateRange[1]) {
      const start = dateRange[0];
      const end = dateRange[1];
      
      // Tính theo chu kỳ 24 giờ: tính số giờ chênh lệch và làm tròn lên
      const diffHours = end.diff(start, 'hour', true); // true để lấy số thập phân chính xác
      const diffDays = Math.ceil(diffHours / 24); // Làm tròn lên để tính theo chu kỳ 24h
      
      // Đảm bảo tối thiểu 1 ngày
      const finalDays = diffDays < 1 ? 1 : diffDays;
      setTotalDays(finalDays);
      
      const pricePerDay = vehicle?.vehicleModel?.price || 0;
      setTotalPrice(pricePerDay * finalDays);
    }
  }, [dateRange, vehicle?.vehicleModel?.price]);

  const openGallery = () => {
    setShowGallery(true);
    setCurrentGalleryIndex(0);
  };

  const closeGallery = () => {
    setShowGallery(false);
  };

  const nextImage = () => {
    if (vehicleImages.length > 0) {
      setCurrentGalleryIndex((prev) => (prev + 1) % vehicleImages.length);
    }
  };

  const prevImage = () => {
    if (vehicleImages.length > 0) {
      setCurrentGalleryIndex((prev) => (prev - 1 + vehicleImages.length) % vehicleImages.length);
    }
  };

  const goToImage = (index: number) => {
    setCurrentGalleryIndex(index);
  };

  const handleBooking = async () => {
    setBookingError(null);
    
    // Kiểm tra đăng nhập trước
    if (!isAuthenticated || !user) {
      router.push('/sign-in');
      return;
    }

    setIsBooking(true);
    try {
      const bookingData: CreateBookingRequest = {
        user_id: user?.user_id || parseInt(user?.id || '0'),
        vehicle_id: vehicle?.id || 0,
        station_id: vehicle?.station_id || station?.id || 0,
        start_date: dateRange?.[0]?.toISOString() || '',
        end_date: dateRange?.[1]?.toISOString() || '',
        total_days: totalDays,
        daily_price: vehicle?.vehicleModel?.price || 0,
        total_price: totalPrice,
        payment_method: 'vnpay',
      };

      const result = await bookingService.createBooking(bookingData);
      
      // Nếu có paymentUrl (VNPay), redirect đến trang thanh toán
      if (result && typeof result === 'object' && 'paymentUrl' in result && typeof result.paymentUrl === 'string') {
        window.location.href = result.paymentUrl;
        return;
      }
      
      // Nếu không có paymentUrl (cash), redirect đến trang success
      if (result && typeof result === 'object' && 'id' in result && typeof result.id === 'number') {
        router.push(`/payment/success?bookingId=${result.id}`);
        return;
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi tạo booking. Vui lòng thử lại.';
      setBookingError(errorMessage);
    } finally {
      setIsBooking(false);
    }
  };


  if (loading) {
    return (
      <div className={styles.detailVehicle}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <div className={styles.loadingSpinner}></div>
            <p>Đang tải thông tin xe...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className={styles.detailVehicle}>
        <div className={styles.container}>
          <div className={styles.error}>
            <p>Không tìm thấy thông tin xe</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.detailVehicle}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.breadcrumb}>
            <Link href="/" className={styles.breadcrumbLink}>Trang chủ</Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <Link 
              href={vehicle.vehicleModel?.type === "Ô tô điện" ? "/vehicles?type=electric-car" : "/vehicles?type=electric-motorcycle"} 
              className={styles.breadcrumbLink}
            >
              {vehicle.vehicleModel?.type || 'Vehicle'}
            </Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <span className={styles.breadcrumbCurrent}>{vehicle.vehicleModel?.name || 'Vehicle'}</span>
          </div>
        </div>

          {/* Image Gallery */}
          <div className={styles.imageGallery}>
            <div className={styles.mainImage}>
              <img 
                src={vehicleImages[0] || '/images/car.png'} 
                alt={vehicle.vehicleModel?.name || 'Vehicle'}
                onClick={vehicleImages.length > 0 ? openGallery : undefined}
                style={{ cursor: vehicleImages.length > 0 ? 'pointer' : 'default' }}
              />
            </div>
            
            <div className={styles.sideImages}>
              {vehicleImages.length > 1 && (
                <>
                  {vehicleImages.slice(1, 4).map((image, index) => (
                    <div key={index} className={styles.sideImage}>
                      <img 
                        src={image} 
                        alt={`${vehicle.vehicleModel?.name || 'Vehicle'} ${index + 2}`}
                        onClick={openGallery}
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                  ))}
                  {vehicleImages.length > 4 && (
                    <div className={styles.viewAllButton} onClick={openGallery}>
                      <PictureOutlined />
                      <span>Xem tất cả ảnh</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>


        {/* Booking Section */}
        <div className={styles.bookingSection}>
          <div className={styles.bookingContent}>
          {/* Vehicle Info */}
            <div className={styles.vehicleDetails}>
              <div className={styles.vehicleHeader}>
                <h2 className={styles.vehicleTitle}>{vehicle.vehicleModel?.name || 'Vehicle'}</h2>
                <div className={styles.availabilityInfo}>
                  <CarOutlined />
                  <span>Biển số: {vehicle.license_plate}</span>
              </div>
            </div>

              <div className={styles.vehicleLocation}>
                <div className={styles.locationInfo}>
                  <EnvironmentOutlined />
                  <span>Địa điểm: {station?.address || vehicle.station?.address || 'Địa chỉ không xác định'}</span>
                </div>
                <div className={styles.rating}>
                  <StarOutlined />
                  <span>{vehicle.rating.toFixed(1)}</span>
              </div>
            </div>

              {vehicle.vehicleModel?.description && (
                <div className={styles.vehicleDescription}>
                  <p>{vehicle.vehicleModel.description}</p>
                </div>
              )}
                
              {vehicle.vehicleModel && (
                <div className={styles.vehicleSpecs}>
                  <h3>Thông số kỹ thuật</h3>
                  <div className={styles.specsGrid}>
                    {vehicle.vehicleModel.battery && (
                      <div className={styles.specItem}>
                        <EnvironmentOutlined />
                        <div className={styles.specContent}>
                          <span className={styles.specLabel}>Pin</span>
                          <span className={styles.specValue}>{vehicle.vehicleModel.battery}</span>
                        </div>
                      </div>
                    )}
                    {vehicle.vehicleModel.range && (
                      <div className={styles.specItem}>
                        <CarOutlined />
                        <div className={styles.specContent}>
                          <span className={styles.specLabel}>Tầm hoạt động</span>
                          <span className={styles.specValue}>{vehicle.vehicleModel.range}</span>
                        </div>
                      </div>
                    )}
                    {vehicle.vehicleModel.charging && (
                      <div className={styles.specItem}>
                        <ClockCircleOutlined />
                        <div className={styles.specContent}>
                          <span className={styles.specLabel}>Sạc</span>
                          <span className={styles.specValue}>{vehicle.vehicleModel.charging}</span>
                        </div>
                      </div>
                    )}
                    {vehicle.vehicleModel.seats && (
                      <div className={styles.specItem}>
                        <SafetyOutlined />
                        <div className={styles.specContent}>
                          <span className={styles.specLabel}>Số chỗ ngồi</span>
                          <span className={styles.specValue}>{vehicle.vehicleModel.seats}</span>
                        </div>
                      </div>
                    )}
                    {vehicle.vehicleModel.topSpeed && (
                      <div className={styles.specItem}>
                        <ThunderboltOutlined />
                        <div className={styles.specContent}>
                          <span className={styles.specLabel}>Tốc độ tối đa</span>
                          <span className={styles.specValue}>{vehicle.vehicleModel.topSpeed}</span>
                        </div>
                      </div>
                    )}
                    {vehicle.vehicleModel.acceleration && (
                      <div className={styles.specItem}>
                        <StarOutlined />
                        <div className={styles.specContent}>
                          <span className={styles.specLabel}>Tăng tốc</span>
                          <span className={styles.specValue}>{vehicle.vehicleModel.acceleration}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {vehicle.vehicleModel?.highlights && vehicle.vehicleModel.highlights.length > 0 && (
                <div className={styles.vehicleHighlights}>
                  <h3>Điểm nổi bật</h3>
                  <div className={styles.highlightList}>
                    {vehicle.vehicleModel.highlights.map((highlight, index) => (
                      <div key={index} className={styles.highlightItem}>
                        <svg aria-hidden="true" role="img" focusable="false" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20" style={{color: '#2FA71D'}}>
                          <path d="M9.71278 3.64026C10.2941 3.14489 10.5847 2.8972 10.8886 2.75195C11.5915 2.41602 12.4085 2.41602 13.1114 2.75195C13.4153 2.8972 13.7059 3.14489 14.2872 3.64026C14.8856 4.15023 15.4938 4.40761 16.2939 4.47146C17.0552 4.53222 17.4359 4.56259 17.7535 4.67477C18.488 4.93421 19.0658 5.51198 19.3252 6.24652C19.4374 6.5641 19.4678 6.94476 19.5285 7.70608C19.5924 8.50621 19.8498 9.11436 20.3597 9.71278C20.8551 10.2941 21.1028 10.5847 21.248 10.8886C21.584 11.5915 21.584 12.4085 21.248 13.1114C21.1028 13.4153 20.8551 13.7059 20.3597 14.2872C19.8391 14.8981 19.5911 15.5102 19.5285 16.2939C19.4678 17.0552 19.4374 17.4359 19.3252 17.7535C19.0658 18.488 18.488 19.0658 17.7535 19.3252C17.4359 19.4374 17.0552 19.4678 16.2939 19.5285C15.4938 19.5924 14.8856 19.8498 14.2872 20.3597C13.7059 20.8551 13.4153 21.1028 13.1114 21.248C12.4085 21.584 11.5915 21.584 10.8886 21.248C10.5847 21.1028 10.2941 20.8551 9.71278 20.3597C9.10185 19.8391 8.48984 19.5911 7.70608 19.5285C6.94476 19.4678 6.5641 19.4374 6.24652 19.3252C5.51198 19.0658 4.93421 18.488 4.67477 17.7535C4.56259 17.4359 4.53222 17.0552 4.47146 16.2939C4.40761 15.4938 4.15023 14.8856 3.64026 14.2872C3.14489 13.7059 2.8972 13.4153 2.75195 13.1114C2.41602 12.4085 2.41602 11.5915 2.75195 10.8886C2.8972 10.5847 3.14489 10.2941 3.64026 9.71278C4.16089 9.10185 4.40892 8.48984 4.47146 7.70608C4.53222 6.94476 4.56259 6.5641 4.67477 6.24652C4.93421 5.51198 5.51198 4.93421 6.24652 4.67477C6.5641 4.56259 6.94476 4.53222 7.70608 4.47146C8.50621 4.40761 9.11436 4.15023 9.71278 3.64026Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                          <path d="M8.66602 12.6334L10.1718 14.3543C10.5952 14.8382 11.3587 14.8025 11.7351 14.2813L15.3327 9.30005" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {vehicle.vehicleModel?.features && vehicle.vehicleModel.features.length > 0 && (
                <div className={styles.vehicleFeatures}>
                  <h3>Tiện ích</h3>
                  <div className={styles.featureGrid}>
                    {vehicle.vehicleModel.features.map((feature, index) => (
                      <div key={index} className={styles.featureItem}>
                        <CheckOutlined />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.vehicleDocuments}>
                <div className={styles.sectionHeader}>
                  <h3>Giấy tờ thuê xe</h3>
                  <span 
                    className={styles.questionIcon}
                    onClick={() => setShowDocumentsModal(true)}
                  >?</span>
                </div>
                <div className={styles.documentsContent}>
                  <div className={styles.documentsInfo}>
                    <span className={styles.infoIcon}>!</span>
                    <span>Chọn 1 trong 2 hình thức</span>
                  </div>
                  <div className={styles.documentsOptions}>
                    <div className={styles.documentOption}>
                      <div className={styles.documentIcon}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span>GPLX (đối chiếu) & Passport (giữ lại)</span>
                    </div>
                    <div className={styles.documentOption}>
                      <div className={styles.documentIcon}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
                          <path d="M7 8H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M7 12H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M7 16H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <span>GPLX (đối chiếu) & CCCD (đối chiếu VNeID)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.vehicleCollateral}>
                <div className={styles.sectionHeader}>
                  <h3>Tài sản thế chấp</h3>
                  <span 
                    className={styles.questionIcon}
                    onClick={() => setShowCollateralModal(true)}
                  >?</span>
                </div>
                <div className={styles.collateralContent}>
                  <div className={styles.collateralInfo}>
                    <span className={styles.infoIcon}>!</span>
                    <span>Không yêu cầu khách thuê thế chấp Tiền mặt hoặc Xe máy</span>
                  </div>
                </div>
              </div>

              <div className={styles.vehicleCancellationPolicy}>
                <h3>Chính sách hủy chuyến</h3>
                <div className={styles.policyTable}>
                  <div className={styles.tableHeader}>
                    <div className={styles.headerCell}>Thời điểm hủy chuyến</div>
                    <div className={styles.headerCell}>Phí hủy chuyến</div>
                  </div>
                  <div className={styles.tableRow}>
                    <div className={styles.tableCell}>Hủy trong 1 giờ đầu sau khi đặt xe</div>
                    <div className={styles.tableCell}>
                      <CheckOutlined style={{ color: '#2FA71D', fontSize: '16px' }} />
                      <span className={styles.freeText}>Hoàn tiền 100%</span>
                    </div>
                  </div>
                  <div className={styles.tableRow}>
                    <div className={styles.tableCell}>
                      Hủy trước 7 ngày (sau 1 giờ đầu)<br />
                      <span className={styles.subText}>Ví dụ: Đặt ngày 15, hủy trước ngày 8</span>
                    </div>
                    <div className={styles.tableCell}>
                      <CheckOutlined style={{ color: '#2FA71D', fontSize: '16px' }} />
                      <span>Phí hủy 10%</span>
                    </div>
                  </div>
                  <div className={styles.tableRow}>
                    <div className={styles.tableCell}>
                      Hủy trong 7 ngày cuối<br />
                      <span className={styles.subText}>Ví dụ: Đặt ngày 15, hủy từ ngày 8 trở đi</span>
                    </div>
                    <div className={styles.tableCell}>
                      <CloseOutlined style={{ color: '#dc3545', fontSize: '16px' }} />
                      <span>Phí hủy 40%</span>
                    </div>
                  </div>
                </div>
                
                <div className={styles.refundInfo}>
                  <div className={styles.refundProcedure}>
                    <h4>Thủ tục hoàn tiền</h4>
                    <p>EVS Rent sẽ hoàn lại tiền thuê xe theo chính sách hủy chuyến qua tài khoản ngân hàng của khách thuê trong vòng 1-3 ngày làm việc kể từ thời điểm hủy chuyến.</p>
                    <p><strong>*Nhân viên EVS Rent sẽ liên hệ khách thuê (qua số điện thoại đã đăng ký) để xin thông tin tài khoản ngân hàng, hoặc Khách thuê có thể chủ động gửi thông tin cho EVS Rent qua email contact@evsrent.vn hoặc nhắn tin tại EVS Rent Fanpage</strong></p>
                  </div>
                </div>
              </div>

              <div className={styles.vehicleTerms}>
                <h3>Điều khoản</h3>
                <div className={styles.termsContent}>
                  <div className={styles.termsSection}>
                    <ul className={styles.termsList}>
                      <li>Sử dụng xe đúng mục đích.</li>
                      <li>Không sử dụng xe thuê vào mục đích phi pháp, trái pháp luật.</li>
                      <li>Không sử dụng xe thuê để cầm cố, thế chấp.</li>
                      <li>Không hút thuốc, nhả kẹo cao su, xả rác trong xe.</li>
                      <li>Không chở hoa quả, thực phẩm nặng mùi trong xe.</li>
                      <li>Khi trả xe, nếu xe bẩn hoặc có mùi trong xe, khách hàng vui lòng vệ sinh xe sạch sẽ hoặc gửi phụ thu phí vệ sinh xe.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className={styles.contactSection}>
                <h3 className={styles.contactTitle}>Thông tin liên hệ</h3>
                <div className={styles.contactInfo}>
                  <div className={styles.contactItem}>
                    <div className={styles.contactLabel}>Trạm thuê xe:</div>
                    <div className={styles.contactValue}>{station?.name || 'Không xác định'}</div>
                  </div>
                  <div className={styles.contactItem}>
                    <div className={styles.contactLabel}>Địa chỉ:</div>
                    <div className={styles.contactValue}>{station?.address || 'Không xác định'}</div>
                  </div>
                  <div className={styles.contactItem}>
                    <div className={styles.contactLabel}>Số điện thoại:</div>
                    <div className={styles.contactValue}>
                      <a href={`tel:${station?.phone}`} className={styles.contactLink}>
                        {station?.phone || 'Không xác định'}
                      </a>
                    </div>
                  </div>
                  <div className={styles.contactItem}>
                    <div className={styles.contactLabel}>Email:</div>
                    <div className={styles.contactValue}>
                      <a href={`mailto:${station?.email}`} className={styles.contactLink}>
                        {station?.email || 'Không xác định'}
                      </a>
                    </div>
                  </div>
                  <div className={styles.contactItem}>
                    <div className={styles.contactLabel}>Quản lý:</div>
                    <div className={styles.contactValue}>{station?.manager || 'Không xác định'}</div>
                  </div>
                  <div className={styles.contactItem}>
                    <div className={styles.contactLabel}>Giờ mở cửa:</div>
                    <div className={styles.contactValue}>{station?.openingHours || 'Không xác định'}</div>
                  </div>
                </div>
              </div>
              
              <div className={styles.thankYouMessage}>
                <p>Trân trọng cảm ơn, chúc quý khách hàng có những chuyến đi tuyệt vời!</p>
              </div>

            </div>

            {/* Booking Form */}
            <div className={styles.bookingForm}>
              {/* Card 1: Booking */}
              <div className={styles.bookingCard}>
                <h3>{(vehicle.vehicleModel?.price || 0).toLocaleString()} VNĐ/ngày</h3>
                <div className={styles.dateSelection}>
                  <div className={styles.dateInput}>
                    <label>Thời gian thuê</label>
                    <DateRangePicker
                      value={dateRange}
                      onChange={setDateRange}
                      placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                      format="DD/MM/YYYY HH:mm"
                      style={{ width: '100%', height: '48px' }}
                    />
                  </div>
                </div>

                <div className={styles.priceInfo}>
                  <div className={styles.priceRow}>
                    <span>Số ngày:</span>
                    <span>{totalDays} ngày</span>
                  </div>
                  <div className={styles.totalPrice}>
                    <span>Tổng cộng:</span>
                    <span>{totalPrice.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                </div>

                <div className={styles.bookingActions}>
                  <button 
                    className={styles.rentButton}
                    onClick={handleBooking}
                    disabled={isBooking || !dateRange || !dateRange[0] || !dateRange[1]}
                  >
                    {isBooking ? 'Đang xử lý...' : 'Thuê ngay'}
                  </button>
                  {bookingError && (
                    <div className={styles.bookingError}>
                      {bookingError}
                    </div>
                  )}
                </div>
              </div>

              {/* Card 2: Additional Fees */}
              <div className={styles.additionalFeesCard}>
                <h3>Phụ phí có thể phát sinh</h3>
                <div className={styles.feesList}>
                  {vehicle.vehicleModel?.type === "Ô tô điện" ? (
                    // Phụ phí cho xe ô tô
                    <>
                      <div className={styles.feeItem}>
                        <div className={styles.feeInfo}>
                          <div className={styles.feeTitle}>
                            <span className={styles.infoIcon}>!</span>
                            <span>Phí sạc pin</span>
                          </div>
                          <p className={styles.feeDescription}>Phụ phí sạc pin cho ô tô điện theo thực tế sử dụng</p>
                        </div>
                        <div className={styles.feePrice}>1.500₫ /1% pin</div>
                      </div>

                      <div className={styles.feeItem}>
                        <div className={styles.feeInfo}>
                          <div className={styles.feeTitle}>
                            <span className={styles.infoIcon}>!</span>
                            <span>Phí vượt giới hạn</span>
                          </div>
                          <p className={styles.feeDescription}>Phụ phí phát sinh nếu lộ trình di chuyển vượt quá 350km khi thuê xe 1 ngày</p>
                        </div>
                        <div className={styles.feePrice}>2.000₫/km</div>
                      </div>

                      <div className={styles.feeItem}>
                        <div className={styles.feeInfo}>
                          <div className={styles.feeTitle}>
                            <span className={styles.infoIcon}>!</span>
                            <span>Phí quá giờ</span>
                          </div>
                          <p className={styles.feeDescription}>Phụ phí phát sinh nếu hoàn trả xe trễ giờ. Trường hợp trễ quá 7 giờ, phụ phí thêm 1 ngày thuê</p>
                        </div>
                        <div className={styles.feePrice}>50.000₫/giờ</div>
                      </div>

                      <div className={styles.feeItem}>
                        <div className={styles.feeInfo}>
                          <div className={styles.feeTitle}>
                            <span className={styles.infoIcon}>!</span>
                            <span>Phí vệ sinh</span>
                          </div>
                          <p className={styles.feeDescription}>Phụ phí phát sinh khi xe hoàn trả không đảm bảo vệ sinh (nhiều vết bẩn, bùn cát, sình lầy...)</p>
                        </div>
                        <div className={styles.feePrice}>70.000₫</div>
                      </div>

                      <div className={styles.feeItem}>
                        <div className={styles.feeInfo}>
                          <div className={styles.feeTitle}>
                            <span className={styles.infoIcon}>!</span>
                            <span>Phí khử mùi</span>
                          </div>
                          <p className={styles.feeDescription}>Phụ phí phát sinh khi xe hoàn trả bị ám mùi khó chịu (mùi thuốc lá, thực phẩm nặng mùi...)</p>
                        </div>
                        <div className={styles.feePrice}>230.000₫</div>
                      </div>
                    </>
                  ) : (
                    // Phụ phí cho xe máy
                    <>
                      <div className={styles.feeItem}>
                        <div className={styles.feeInfo}>
                          <div className={styles.feeTitle}>
                            <span className={styles.infoIcon}>!</span>
                            <span>Phí sạc pin</span>
                          </div>
                          <p className={styles.feeDescription}>Phụ phí sạc pin cho xe máy điện theo thực tế sử dụng</p>
                        </div>
                        <div className={styles.feePrice}>1.500₫ /1% pin</div>
                      </div>

                      <div className={styles.feeItem}>
                        <div className={styles.feeInfo}>
                          <div className={styles.feeTitle}>
                            <span className={styles.infoIcon}>!</span>
                            <span>Phí quá giờ</span>
                          </div>
                          <p className={styles.feeDescription}>Phụ phí phát sinh nếu hoàn trả xe trễ giờ. Trường hợp trễ quá 7 giờ, phụ phí thêm 1 ngày thuê</p>
                        </div>
                        <div className={styles.feePrice}>20.000₫/giờ</div>
                      </div>

                      <div className={styles.feeItem}>
                        <div className={styles.feeInfo}>
                          <div className={styles.feeTitle}>
                            <span className={styles.infoIcon}>!</span>
                            <span>Phí vệ sinh</span>
                          </div>
                          <p className={styles.feeDescription}>Phụ phí phát sinh khi xe hoàn trả không đảm bảo vệ sinh</p>
                        </div>
                        <div className={styles.feePrice}>30.000₫</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      {showGallery && (
        <div className={styles.galleryModal} onClick={closeGallery}>
          <div className={styles.galleryContent} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className={styles.galleryHeader}>
              <div className={styles.galleryCounter}>
                {currentGalleryIndex + 1} / {vehicleImages.length}
              </div>
              <button className={styles.closeButton} onClick={closeGallery}>
                <CloseOutlined />
              </button>
            </div>

            {/* Main Image */}
            <div className={styles.galleryMainImage}>
              <img 
                src={vehicleImages[currentGalleryIndex] || '/images/car.png'} 
                alt={`${vehicle.vehicleModel?.name || 'Vehicle'} ${currentGalleryIndex + 1}`}
              />
              <button className={styles.galleryNavButton} onClick={prevImage}>
                <LeftOutlined />
              </button>
              <button className={styles.galleryNavButton} onClick={nextImage}>
                <RightOutlined />
              </button>
            </div>

            {/* Thumbnail Strip */}
            <div className={styles.galleryThumbnails}>
              <button className={styles.thumbNavButton}>
                <LeftOutlined />
              </button>
              <div className={styles.thumbnailStrip}>
                {vehicleImages.map((image, index) => (
                  <div 
                    key={index}
                    className={`${styles.galleryThumbnail} ${currentGalleryIndex === index ? styles.active : ''}`}
                    onClick={() => goToImage(index)}
                  >
                    <img src={image} alt={`${vehicle.vehicleModel?.name || 'Vehicle'} ${index + 1}`} />
                  </div>
                ))}
              </div>
              <button className={styles.thumbNavButton}>
                <RightOutlined />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Documents Modal */}
      {showDocumentsModal && (
        <div className={styles.modalOverlay} onClick={() => setShowDocumentsModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Giấy tờ thuê xe</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setShowDocumentsModal(false)}
              >
                <CloseOutlined />
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.documentSection}>
                <h4>Bạn đã có CCCD gắn chip</h4>
                <p>Giấy tờ thuê xe bao gồm:</p>
                <ul>
                  <li>Giấy phép lái xe (nhân viên EVS Rent đối chiếu bản gốc với thông tin GPLX đã xác thực trên app & gửi lại bạn);</li>
                  <li>CCCD gắn chip (nhân viên EVS Rent đối chiếu bản gốc với thông tin cá nhân trên VNeID & gửi lại bạn)</li>
                </ul>
              </div>

              <div className={styles.documentSection}>
                <h4>Bạn chưa có CCCD gắn chip</h4>
                <p>Giấy tờ thuê xe bao gồm:</p>
                <ul>
                  <li>Giấy phép lái xe (nhân viên EVS Rent đối chiếu bản gốc với thông tin GPLX đã xác thực trên app & gửi lại bạn);</li>
                  <li>Passport (nhân viên EVS Rent kiểm tra bản gốc, giữ lại và hoàn trả khi bạn trả xe)</li>
                </ul>
              </div>

              <div className={styles.noteSection}>
                <p><strong>Lưu ý:</strong> Khách thuê vui lòng chuẩn bị đầy đủ BẢN GỐC tất cả giấy tờ thuê xe khi làm thủ tục nhận xe.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collateral Modal */}
      {showCollateralModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCollateralModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Tài sản thế chấp</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setShowCollateralModal(false)}
              >
                <CloseOutlined />
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.collateralSection}>
                <h4>Chính sách thế chấp của EVS Rent</h4>
                <p>EVS Rent cam kết mang đến trải nghiệm thuê xe thuận tiện và an toàn cho khách hàng:</p>
                
                <div className={styles.benefitList}>
                  <div className={styles.benefitItem}>
                    <div className={styles.benefitIcon}>✓</div>
                    <div className={styles.benefitText}>
                      <strong>Không yêu cầu thế chấp tiền mặt</strong>
                      <p>Khách hàng không cần đặt cọc tiền mặt khi thuê xe</p>
                    </div>
                  </div>
                  
                  <div className={styles.benefitItem}>
                    <div className={styles.benefitIcon}>✓</div>
                    <div className={styles.benefitText}>
                      <strong>Không yêu cầu thế chấp xe máy</strong>
                      <p>Không cần để lại xe máy cá nhân làm tài sản thế chấp</p>
                    </div>
                  </div>
                  
                  <div className={styles.benefitItem}>
                    <div className={styles.benefitIcon}>✓</div>
                    <div className={styles.benefitText}>
                      <strong>Chỉ cần giấy tờ tùy thân</strong>
                      <p>Chỉ cần xuất trình giấy phép lái xe và CCCD/Passport</p>
                    </div>
                  </div>
                </div>

                <div className={styles.noteSection}>
                  <p><strong>Lưu ý:</strong> EVS Rent tin tưởng khách hàng và tạo điều kiện thuận lợi nhất cho việc thuê xe. Chúng tôi cam kết bảo vệ quyền lợi khách hàng và đảm bảo an toàn trong suốt quá trình sử dụng dịch vụ.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailVehicle;
