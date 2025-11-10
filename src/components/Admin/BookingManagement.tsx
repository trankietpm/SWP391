"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  SearchOutlined,
  FilterOutlined,
  CalendarOutlined,
  CarOutlined,
  UserOutlined,
  DollarOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { bookingService, Booking } from '../../services/booking.service';
import { userService, User } from '../../services/user.service';
import { vehicleService, Vehicle } from '../../services/vehicle.service';
import { stationService, Station } from '../../services/station.service';
import styles from './UserManagement.module.scss';

const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingBooking, setViewingBooking] = useState<Booking | null>(null);
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [pickingUpBooking, setPickingUpBooking] = useState<Booking | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [bookingsData, usersData, vehiclesData, stationsData] = await Promise.all([
      bookingService.getAllBookings().catch(() => []),
      userService.getAllUsers().catch(() => []),
      vehicleService.getAllVehicles().catch(() => []),
      stationService.getAllStations().catch(() => [])
    ]);
    
    setStations(stationsData);
    setBookings(bookingsData);
    setUsers(usersData);
    setVehicles(vehiclesData);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getStationAddress = (stationId: number) => {
    const station = stations.find(s => s.id === stationId);
    return station?.address || '';
  };

  const filteredBookings = bookings.filter(booking => {
    const stationAddress = getStationAddress(booking.station_id);
    const matchesSearch = 
      booking.id.toString().includes(searchTerm) ||
      stationAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.notes && booking.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    const matchesPaymentStatus = filterPaymentStatus === 'all' || booking.payment_status === filterPaymentStatus;
    return matchesSearch && matchesStatus && matchesPaymentStatus;
  });

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBookings = filteredBookings.slice(startIndex, endIndex);

  const handleDelete = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa đơn đặt này?')) {
      await bookingService.deleteBooking(id).catch((error) => {
        alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi xóa booking');
      });
      await fetchData();
    }
  };

  const handleEdit = (booking: Booking) => {
    setEditingBooking(booking);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingBooking(null);
    setShowModal(true);
  };

  const handleView = (booking: Booking) => {
    setViewingBooking(booking);
    setShowViewModal(true);
  };

  const handlePickup = (booking: Booking) => {
    setPickingUpBooking(booking);
    setShowPickupModal(true);
  };

  const handleConfirmPickup = async () => {
    if (!pickingUpBooking) return;
    
    const odometer = parseInt((document.getElementById('pickupOdometer') as HTMLInputElement)?.value || '0');
    const batteryStatus = parseInt((document.getElementById('pickupBatteryStatus') as HTMLInputElement)?.value || '0');
    const condition = (document.getElementById('pickupCondition') as HTMLTextAreaElement)?.value || '';
    const notes = (document.getElementById('pickupNotes') as HTMLTextAreaElement)?.value || '';
    
    await bookingService.pickupBooking(pickingUpBooking.id, {
      odometer_start: odometer || undefined,
      battery_status_start: batteryStatus || undefined,
      vehicle_condition_pickup: condition || undefined,
      notes: notes,
    }).catch((error) => {
      alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi nhận xe');
    });
    
    await fetchData();
    setShowPickupModal(false);
    setPickingUpBooking(null);
  };

  const handleSave = async () => {
    const userId = parseInt((document.getElementById('userId') as HTMLSelectElement)?.value || '0');
    const vehicleId = parseInt((document.getElementById('vehicleId') as HTMLSelectElement)?.value || '0');
    const stationId = parseInt((document.getElementById('stationId') as HTMLSelectElement)?.value || '0');
    const startDate = (document.getElementById('startDate') as HTMLInputElement)?.value || '';
    const endDate = (document.getElementById('endDate') as HTMLInputElement)?.value || '';
    const totalDays = parseInt((document.getElementById('totalDays') as HTMLInputElement)?.value || '0');
    const dailyPrice = parseFloat((document.getElementById('dailyPrice') as HTMLInputElement)?.value || '0');
    const totalPrice = parseFloat((document.getElementById('totalPrice') as HTMLInputElement)?.value || '0');
    const status = (document.getElementById('status') as HTMLSelectElement)?.value || 'pending';
    const paymentMethod = (document.getElementById('paymentMethod') as HTMLSelectElement)?.value || 'cash';
    const paymentStatus = (document.getElementById('paymentStatus') as HTMLSelectElement)?.value || 'pending';
    
    if (editingBooking) {
      await bookingService.updateBooking(editingBooking.id, {
        status: status as 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled' | 'overdue' | 'completed_with_fee',
        payment_status: paymentStatus as 'pending' | 'paid' | 'refunded',
      }).catch((error) => {
        alert(error instanceof Error ? error.message : 'Có lỗi xảy ra');
      });
    } else {
      await bookingService.createBookingByAdmin({
        user_id: userId,
        vehicle_id: vehicleId,
        station_id: stationId,
        start_date: new Date(startDate).toISOString(),
        end_date: new Date(endDate).toISOString(),
        total_days: totalDays,
        daily_price: dailyPrice,
        total_price: totalPrice,
        payment_method: paymentMethod as 'vnpay' | 'cash',
      }).catch((error) => {
        alert(error instanceof Error ? error.message : 'Có lỗi xảy ra');
      });
    }
    
    await fetchData();
    setShowModal(false);
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xác nhận';
      case 'confirmed': return 'Đã xác nhận';
      case 'active': return 'Đang sử dụng';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      case 'overdue': return 'Quá hạn trả xe';
      case 'completed_with_fee': return 'Hoàn thành (có phụ phí)';
      default: return status;
    }
  };

  const getPaymentStatusDisplay = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ thanh toán';
      case 'paid': return 'Đã thanh toán';
      case 'refunded': return 'Đã hoàn tiền';
      default: return status;
    }
  };

  const getPaymentMethodDisplay = (method: string) => {
    switch (method) {
      case 'bank_transfer': return 'Chuyển khoản';
      case 'credit_card': return 'Thẻ tín dụng';
      case 'cash': return 'Tiền mặt';
      case 'momo': return 'MoMo';
      case 'zalopay': return 'ZaloPay';
      default: return method;
    }
  };

  const getUserName = (userId: number) => {
    const user = users.find(u => u.user_id === userId);
    return user ? `${user.last_name} ${user.first_name}`.trim() || user.email : `User ${userId}`;
  };

  const getVehicleName = (vehicleId: number) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.vehicleModel?.name || 'Xe'} - ${vehicle.license_plate}` : `Vehicle ${vehicleId}`;
  };

  const getVehicle = (vehicleId: number) => {
    return vehicles.find(v => v.id === vehicleId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className={styles.userManagement}>
        <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải...</div>
      </div>
    );
  }

  return (
    <div className={styles.userManagement}>
      <div className={styles.header}>
        <h1>Quản lý đơn đặt</h1>
        <button className={styles.addBtn} onClick={handleAddNew}>
          <PlusOutlined />
          Thêm đơn đặt mới
        </button>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <SearchOutlined />
          <input
            type="text"
            placeholder="Tìm kiếm theo ID, địa điểm, ghi chú..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className={styles.filterBox}>
          <FilterOutlined />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="active">Đang sử dụng</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
            <option value="overdue">Quá hạn trả xe</option>
            <option value="completed_with_fee">Hoàn thành (có phụ phí)</option>
          </select>
        </div>
        
        <div className={styles.filterBox}>
          <FilterOutlined />
          <select
            value={filterPaymentStatus}
            onChange={(e) => setFilterPaymentStatus(e.target.value)}
          >
            <option value="all">Tất cả thanh toán</option>
            <option value="pending">Chờ thanh toán</option>
            <option value="paid">Đã thanh toán</option>
            <option value="refunded">Đã hoàn tiền</option>
          </select>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Khách hàng</th>
              <th>Xe thuê</th>
              <th>Thời gian</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Thanh toán</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentBookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>
                  <div className={styles.userInfo}>
                    <div className={styles.avatar}>
                      <UserOutlined />
                    </div>
                    <div>
                      <div className={styles.userName}>{getUserName(booking.user_id)}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className={styles.vehicleInfo}>
                    <CarOutlined />
                    <span>{getVehicleName(booking.vehicle_id)}</span>
                  </div>
                </td>
                <td>
                  <div className={styles.dateInfo}>
                    <div className={styles.dateRange}>
                      <CalendarOutlined />
                      <span>{formatDate(booking.start_date)} - {formatDate(booking.end_date)}</span>
                    </div>
                    <div className={styles.days}>{booking.total_days} ngày</div>
                  </div>
                </td>
                <td>
                  <div className={styles.priceInfo}>
                    <DollarOutlined />
                    <span>{booking.total_price.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                </td>
                <td>
                  <button 
                    className={`${styles.statusBtn} ${
                      booking.status === 'completed' ? styles.active : 
                      booking.status === 'completed_with_fee' ? styles.active :
                      booking.status === 'cancelled' ? styles.inactive :
                      booking.status === 'overdue' ? styles.inactive :
                      booking.status === 'active' ? styles.active :
                      styles.inactive
                    }`}
                  >
                    {getStatusDisplay(booking.status)}
                  </button>
                </td>
                <td>
                  <div className={styles.paymentInfo}>
                    <div className={styles.paymentMethod}>{getPaymentMethodDisplay(booking.payment_method)}</div>
                    <div className={`${styles.paymentStatus} ${
                      booking.payment_status === 'paid' ? styles.active :
                      booking.payment_status === 'refunded' ? styles.inactive :
                      styles.inactive
                    }`}>
                      {getPaymentStatusDisplay(booking.payment_status)}
                    </div>
                  </div>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button 
                      className={styles.viewBtn}
                      onClick={() => handleView(booking)}
                      title="Xem chi tiết"
                    >
                      <EyeOutlined />
                    </button>
                    {booking.status !== 'pending' && booking.status !== 'cancelled' && (
                      <button 
                        className={styles.editBtn}
                        onClick={() => handlePickup(booking)}
                        title="Nhận xe"
                        style={{ backgroundColor: '#52c41a', color: 'white' }}
                      >
                        <CheckCircleOutlined />
                      </button>
                    )}
                    <button 
                      className={styles.editBtn}
                      onClick={() => handleEdit(booking)}
                      title="Chỉnh sửa"
                    >
                      <EditOutlined />
                    </button>
                    <button 
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(booking.id)}
                      title="Xóa"
                    >
                      <DeleteOutlined />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredBookings.length)} trong {filteredBookings.length} đơn đặt
          </div>
          <div className={styles.paginationControls}>
            <button 
              className={styles.paginationBtn}
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              Đầu
            </button>
            <button 
              className={styles.paginationBtn}
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Trước
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`${styles.paginationBtn} ${currentPage === page ? styles.active : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            
            <button 
              className={styles.paginationBtn}
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Sau
            </button>
            <button 
              className={styles.paginationBtn}
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              Cuối
            </button>
          </div>
        </div>
      )}

      {/* Modal for Add/Edit Booking */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{editingBooking ? 'Chỉnh sửa đơn đặt' : 'Thêm đơn đặt mới'}</h2>
              <button 
                className={styles.closeBtn}
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <form className={styles.form}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Khách hàng</label>
                    <select defaultValue={editingBooking?.user_id || ''} id="userId">
                      <option value="">Chọn khách hàng</option>
                      {users.filter(u => u.role?.toUpperCase() === 'CAR_RENTAL').map(user => (
                        <option key={user.user_id} value={user.user_id}>
                          {`${user.last_name} ${user.first_name}`.trim() || user.email}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>Xe thuê</label>
                    <select defaultValue={editingBooking?.vehicle_id || ''} id="vehicleId">
                      <option value="">Chọn xe</option>
                      {vehicles.map(vehicle => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.vehicleModel?.name || 'Xe'} - {vehicle.license_plate}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Trạm</label>
                    <select defaultValue={editingBooking?.station_id || ''} id="stationId">
                      <option value="">Chọn trạm</option>
                      {stations.map(station => (
                        <option key={station.id} value={station.id}>{station.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Ngày bắt đầu</label>
                    <input 
                      type="datetime-local" 
                      defaultValue={editingBooking?.start_date ? new Date(editingBooking.start_date).toISOString().slice(0, 16) : ''}
                      id="startDate"
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>Ngày kết thúc</label>
                    <input 
                      type="datetime-local" 
                      defaultValue={editingBooking?.end_date ? new Date(editingBooking.end_date).toISOString().slice(0, 16) : ''}
                      id="endDate"
                    />
                  </div>
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Giá mỗi ngày (VNĐ)</label>
                    <input 
                      type="number" 
                      defaultValue={editingBooking?.daily_price || ''}
                      placeholder="Nhập giá mỗi ngày"
                      id="dailyPrice"
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>Tổng tiền (VNĐ)</label>
                    <input 
                      type="number" 
                      defaultValue={editingBooking?.total_price || ''}
                      placeholder="Nhập tổng tiền"
                      id="totalPrice"
                    />
                  </div>
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Trạng thái</label>
                    <select defaultValue={editingBooking?.status || 'pending'} id="status">
                      <option value="pending">Chờ xác nhận</option>
                      <option value="confirmed">Đã xác nhận</option>
                      <option value="active">Đang sử dụng</option>
                      <option value="completed">Hoàn thành</option>
                      <option value="cancelled">Đã hủy</option>
                      <option value="overdue">Quá hạn trả xe</option>
                      <option value="completed_with_fee">Hoàn thành (có phụ phí)</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>Số ngày</label>
                    <input 
                      type="number" 
                      defaultValue={editingBooking?.total_days || ''}
                      placeholder="Nhập số ngày"
                      id="totalDays"
                    />
                  </div>
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Phương thức thanh toán</label>
                    <select defaultValue={editingBooking?.payment_method || 'cash'} id="paymentMethod">
                      <option value="cash">Tiền mặt</option>
                      <option value="vnpay">VNPay</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>Trạng thái thanh toán</label>
                    <select defaultValue={editingBooking?.payment_status || 'pending'} id="paymentStatus">
                      <option value="pending">Chờ thanh toán</option>
                      <option value="paid">Đã thanh toán</option>
                      <option value="refunded">Đã hoàn tiền</option>
                    </select>
                  </div>
                </div>
                
              </form>
            </div>
            
            <div className={styles.modalFooter}>
              <button 
                type="button" 
                className={styles.cancelBtn}
                onClick={() => setShowModal(false)}
              >
                Hủy
              </button>
              <button 
                type="button" 
                className={styles.saveBtn}
                onClick={(e) => {
                  e.preventDefault();
                  handleSave();
                }}
              >
                {editingBooking ? 'Cập nhật' : 'Thêm mới'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Booking Modal */}
      {showViewModal && viewingBooking && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Chi tiết đơn đặt: #{viewingBooking.id}</h2>
              <button 
                className={styles.closeBtn}
                onClick={() => setShowViewModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.viewContent}>
                <div className={styles.viewSection}>
                  <h3>Thông tin cơ bản</h3>
                  <div className={styles.viewGrid}>
                    <div className={styles.viewItem}>
                      <label>ID đơn đặt:</label>
                      <span>#{viewingBooking.id}</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Khách hàng:</label>
                      <span>{getUserName(viewingBooking.user_id)}</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Xe thuê:</label>
                      <span>{getVehicleName(viewingBooking.vehicle_id)}</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Thời gian:</label>
                      <span>{formatDate(viewingBooking.start_date)} - {formatDate(viewingBooking.end_date)}</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Số ngày:</label>
                      <span>{viewingBooking.total_days} ngày</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Tổng tiền:</label>
                      <span>{viewingBooking.total_price.toLocaleString('vi-VN')} VNĐ</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Trạng thái:</label>
                      <span>{getStatusDisplay(viewingBooking.status)}</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Phương thức thanh toán:</label>
                      <span>{getPaymentMethodDisplay(viewingBooking.payment_method)}</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Trạng thái thanh toán:</label>
                      <span>{getPaymentStatusDisplay(viewingBooking.payment_status)}</span>
                    </div>
                    {viewingBooking.transaction_id && (
                      <div className={styles.viewItem}>
                        <label>Mã giao dịch:</label>
                        <span>{viewingBooking.transaction_id}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.viewSection}>
                  <h3>Địa điểm</h3>
                  <div className={styles.viewGrid}>
                    <div className={styles.viewItem}>
                      <label>Nhận xe:</label>
                      <span>{getStationAddress(viewingBooking.station_id)}</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Trả xe:</label>
                      <span>{getStationAddress(viewingBooking.station_id)}</span>
                    </div>
                  </div>
                </div>

                {viewingBooking.notes && (
                  <div className={styles.viewSection}>
                    <h3>Ghi chú</h3>
                    <p>{viewingBooking.notes}</p>
                  </div>
                )}

                <div className={styles.viewSection}>
                  <h3>Thời gian</h3>
                  <div className={styles.viewGrid}>
                    <div className={styles.viewItem}>
                      <label>Ngày tạo:</label>
                      <span>{formatDate(viewingBooking.created_at)}</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Cập nhật cuối:</label>
                      <span>{formatDate(viewingBooking.updated_at)}</span>
                    </div>
                    {viewingBooking.completed_at && (
                      <div className={styles.viewItem}>
                        <label>Hoàn thành:</label>
                        <span>{formatDate(viewingBooking.completed_at)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className={styles.modalFooter}>
              <button 
                type="button" 
                className={styles.cancelBtn}
                onClick={() => setShowViewModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pickup Modal */}
      {showPickupModal && pickingUpBooking && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Tình trạng xe</h2>
              <button 
                className={styles.closeBtn}
                onClick={() => {
                  setShowPickupModal(false);
                  setPickingUpBooking(null);
                }}
              >
                ×
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <form className={styles.form}>
                {(() => {
                  const vehicle = getVehicle(pickingUpBooking.vehicle_id);
                  return (
                    <>
                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label>Xe</label>
                          <div style={{ padding: '8px', background: '#f5f5f5', borderRadius: '4px', color: '#666' }}>
                            {vehicle?.vehicleModel?.name || 'Xe'}
                          </div>
                        </div>
                        
                        <div className={styles.formGroup}>
                          <label>Biển số xe</label>
                          <div style={{ padding: '8px', background: '#f5f5f5', borderRadius: '4px', color: '#666' }}>
                            {vehicle?.license_plate || '-'}
                          </div>
                        </div>
                      </div>
                      
                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label>Pin khi nhận xe (%)</label>
                          <input 
                            type="number" 
                            min="0"
                            max="100"
                            id="pickupBatteryStatus"
                            placeholder="Nhập pin khi nhận xe"
                            defaultValue={vehicle?.battery_status || 0}
                          />
                        </div>
                        
                        <div className={styles.formGroup}>
                          <label>Số km khi nhận xe</label>
                          <input 
                            type="number" 
                            min="0"
                            id="pickupOdometer"
                            placeholder="Nhập số km khi nhận xe"
                            defaultValue={vehicle?.odometer || 0}
                          />
                        </div>
                      </div>
                      
                      <div className={styles.formGroup}>
                        <label>Tình trạng xe</label>
                        <textarea 
                          id="pickupCondition"
                          placeholder="Mô tả tình trạng xe khi nhận"
                          rows={3}
                          defaultValue={vehicle?.vehicle_condition || ''}
                        />
                      </div>
                    </>
                  );
                })()}
                
                <div className={styles.formGroup}>
                  <label>Ghi chú</label>
                  <textarea 
                    id="pickupNotes"
                    placeholder="Ghi chú thêm (nếu có)"
                    rows={2}
                    defaultValue={pickingUpBooking?.notes || ''}
                  />
                </div>
              </form>
            </div>
            
            <div className={styles.modalFooter}>
              <button 
                type="button" 
                className={styles.cancelBtn}
                onClick={() => {
                  setShowPickupModal(false);
                  setPickingUpBooking(null);
                }}
              >
                Hủy
              </button>
              <button 
                type="button" 
                className={styles.saveBtn}
                onClick={handleConfirmPickup}
              >
                Xác nhận nhận xe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
