"use client";
import React, { useState, useEffect } from 'react';
import { CarOutlined, ThunderboltOutlined, StarOutlined, LeftOutlined, RightOutlined, CheckOutlined, ClockCircleOutlined, SafetyOutlined, EnvironmentOutlined, PictureOutlined, CloseOutlined } from '@ant-design/icons';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import Link from 'next/link';
import { carService, Car } from '../../services/car.service';
import { stationService, Station } from '../../services/station.service';
import styles from './DetailVehicle.module.scss';


interface DetailVehicleProps {
  vehicleId?: number;
}

const DetailVehicle: React.FC<DetailVehicleProps> = ({ vehicleId = 1 }) => {
  const [showGallery, setShowGallery] = useState(false);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [totalDays, setTotalDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [vehicle, setVehicle] = useState<Car | null>(null);
  const [station, setStation] = useState<Station | null>(null);
  const [carFiles, setCarFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [showCollateralModal, setShowCollateralModal] = useState(false);

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

  // Fetch vehicle and station data from API
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehicleData, stationData] = await Promise.all([
          carService.getCarById(vehicleId),
          carService.getCarById(vehicleId).then(car => 
            car ? stationService.getStationById(car.stationId) : null
          )
        ]);
        
        if (vehicleData) {
          setVehicle(vehicleData);
          
          // Fetch car files for images
          try {
            const files = await carService.getCarFiles(vehicleData.id);
            const imageUrls = files.map(file => carService.getImageUrl(file.directus_files_id));
            setCarFiles(imageUrls);
          } catch (error) {
            console.error('Error fetching car files:', error);
            setCarFiles([]);
          }
        }
        
        if (stationData) {
          setStation(stationData);
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
      const diffDays = end.diff(start, 'day') + 1;
      setTotalDays(diffDays);
      
      const pricePerDay = vehicle?.price || 0;
      setTotalPrice(pricePerDay * diffDays);
    }
  }, [dateRange, vehicle?.price]);

  const openGallery = () => {
    setShowGallery(true);
    setCurrentGalleryIndex(0);
  };

  const closeGallery = () => {
    setShowGallery(false);
  };

  const nextImage = () => {
    if (carFiles.length > 0) {
      setCurrentGalleryIndex((prev) => (prev + 1) % carFiles.length);
    }
  };

  const prevImage = () => {
    if (carFiles.length > 0) {
      setCurrentGalleryIndex((prev) => (prev - 1 + carFiles.length) % carFiles.length);
    }
  };

  const goToImage = (index: number) => {
    setCurrentGalleryIndex(index);
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
              href={vehicle.type === "Ô tô điện" ? "/vehicles?type=electric-car" : "/vehicles?type=electric-motorcycle"} 
              className={styles.breadcrumbLink}
            >
              {vehicle.type}
            </Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <span className={styles.breadcrumbCurrent}>{vehicle.name}</span>
          </div>
        </div>

          {/* Image Gallery */}
          <div className={styles.imageGallery}>
            <div className={styles.mainImage}>
              <img 
                src={carFiles[0] || '/images/car.png'} 
                alt={vehicle.name}
              />
            </div>
            
          <div className={styles.sideImages}>
            {carFiles.slice(1, 4).map((image, index) => (
              <div key={index} className={styles.sideImage}>
                <img src={image} alt={`${vehicle.name} ${index + 2}`} />
                {index === 2 && carFiles.length > 4 && (
                  <div className={styles.viewAllOverlay} onClick={openGallery}>
                    <PictureOutlined />
                    <span>Xem tất cả ảnh</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>


        {/* Booking Section */}
        <div className={styles.bookingSection}>
          <div className={styles.bookingContent}>
          {/* Vehicle Info */}
            <div className={styles.vehicleDetails}>
              <div className={styles.vehicleHeader}>
                <h2 className={styles.vehicleTitle}>{vehicle.name}</h2>
                <div className={styles.availabilityInfo}>
                  <CarOutlined />
                  <span>Số lượng còn lại: {vehicle.availableCount} xe</span>
              </div>
            </div>

              <div className={styles.vehicleLocation}>
                <div className={styles.locationInfo}>
                  <EnvironmentOutlined />
                  <span>Địa điểm: {station?.address || 'Địa chỉ không xác định'}</span>
                </div>
                <div className={styles.rating}>
                  <StarOutlined />
                  <span>{vehicle.rating}</span>
              </div>
            </div>

              <div className={styles.vehicleDescription}>
                  <p>{vehicle.description}</p>
                </div>
                
              <div className={styles.vehicleSpecs}>
                <h3>Thông số kỹ thuật</h3>
                <div className={styles.specsGrid}>
                  <div className={styles.specItem}>
                    <EnvironmentOutlined />
                    <div className={styles.specContent}>
                      <span className={styles.specLabel}>Pin</span>
                      <span className={styles.specValue}>{vehicle.battery}</span>
                    </div>
                  </div>
                  <div className={styles.specItem}>
                    <CarOutlined />
                    <div className={styles.specContent}>
                      <span className={styles.specLabel}>Tầm hoạt động</span>
                      <span className={styles.specValue}>{vehicle.range}</span>
                    </div>
                  </div>
                  <div className={styles.specItem}>
                    <ClockCircleOutlined />
                    <div className={styles.specContent}>
                      <span className={styles.specLabel}>Sạc</span>
                      <span className={styles.specValue}>{vehicle.charging}</span>
                    </div>
                  </div>
                  <div className={styles.specItem}>
                    <SafetyOutlined />
                    <div className={styles.specContent}>
                      <span className={styles.specLabel}>Số chỗ ngồi</span>
                      <span className={styles.specValue}>{vehicle.seats}</span>
                    </div>
                  </div>
                  <div className={styles.specItem}>
                    <ThunderboltOutlined />
                    <div className={styles.specContent}>
                      <span className={styles.specLabel}>Tốc độ tối đa</span>
                      <span className={styles.specValue}>{vehicle.topSpeed}</span>
                    </div>
                  </div>
                  <div className={styles.specItem}>
                    <StarOutlined />
                    <div className={styles.specContent}>
                      <span className={styles.specLabel}>Tăng tốc</span>
                      <span className={styles.specValue}>{vehicle.acceleration}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.vehicleHighlights}>
                <h3>Điểm nổi bật</h3>
                <div className={styles.highlightList}>
                  {vehicle.highlights.map((highlight, index) => (
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

              <div className={styles.vehicleFeatures}>
                <h3>Tiện ích</h3>
                <div className={styles.featureGrid}>
                  {vehicle.features.map((feature, index) => (
                    <div key={index} className={styles.featureItem}>
                      <CheckOutlined />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

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
                <h3>{vehicle.price.toLocaleString()} VNĐ/ngày</h3>
                <div className={styles.dateSelection}>
                  <div className={styles.dateInput}>
                    <label>Thời gian thuê</label>
                    <DatePicker.RangePicker
                      showTime={{ format: 'HH:mm' }}
                      format="DD/MM/YYYY HH:mm"
                      placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                      value={dateRange}
                      onChange={setDateRange}
                      disabledDate={(current) => current && current < dayjs().startOf('day')}
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
                  <button className={styles.rentButton}>
                    Thuê ngay
                  </button>
                </div>
              </div>

              {/* Card 2: Additional Fees */}
              <div className={styles.additionalFeesCard}>
                <h3>Phụ phí có thể phát sinh</h3>
                <div className={styles.feesList}>
                  {vehicle.type === "Ô tô điện" ? (
                    // Phụ phí cho xe ô tô
                    <>
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
                          <p className={styles.feeDescription}>Phụ phí phát sinh nếu hoàn trả xe trễ giờ</p>
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
                {currentGalleryIndex + 1} / {carFiles.length}
              </div>
              <button className={styles.closeButton} onClick={closeGallery}>
                <CloseOutlined />
              </button>
            </div>

            {/* Main Image */}
            <div className={styles.galleryMainImage}>
              <img 
                src={carFiles[currentGalleryIndex] || '/images/car.png'} 
                alt={`${vehicle.name} ${currentGalleryIndex + 1}`}
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
                {carFiles.map((image, index) => (
                  <div 
                    key={index}
                    className={`${styles.galleryThumbnail} ${currentGalleryIndex === index ? styles.active : ''}`}
                    onClick={() => goToImage(index)}
                  >
                    <img src={image} alt={`${vehicle.name} ${index + 1}`} />
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
