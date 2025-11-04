"use client";
import React, { useState } from 'react';
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
  DollarOutlined
} from '@ant-design/icons';
import { mockBookings, Booking } from '../../data/bookings';
import { mockUsers } from '../../data/users';
import { allVehicles } from '../../data/vehicles';
import styles from './UserManagement.module.scss';

const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingBooking, setViewingBooking] = useState<Booking | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.id.toString().includes(searchTerm) ||
      booking.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    const matchesPaymentStatus = filterPaymentStatus === 'all' || booking.paymentStatus === filterPaymentStatus;
    return matchesSearch && matchesStatus && matchesPaymentStatus;
  });

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBookings = filteredBookings.slice(startIndex, endIndex);

  const handleDelete = (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa đơn đặt này?')) {
      setBookings(bookings.filter(booking => booking.id !== id));
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

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xác nhận';
      case 'confirmed': return 'Đã xác nhận';
      case 'active': return 'Đang sử dụng';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
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
    const user = mockUsers.find(u => u.id === userId);
    return user ? user.name : `User ${userId}`;
  };

  const getVehicleName = (vehicleId: number) => {
    const vehicle = allVehicles.find(v => v.id === vehicleId);
    return vehicle ? vehicle.name : `Vehicle ${vehicleId}`;
  };

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
                      <div className={styles.userName}>{getUserName(booking.userId)}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className={styles.vehicleInfo}>
                    <CarOutlined />
                    <span>{getVehicleName(booking.vehicleId)}</span>
                  </div>
                </td>
                <td>
                  <div className={styles.dateInfo}>
                    <div className={styles.dateRange}>
                      <CalendarOutlined />
                      <span>{booking.startDate} - {booking.endDate}</span>
                    </div>
                    <div className={styles.days}>{booking.totalDays} ngày</div>
                  </div>
                </td>
                <td>
                  <div className={styles.priceInfo}>
                    <DollarOutlined />
                    <span>{booking.totalPrice.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                </td>
                <td>
                  <button 
                    className={`${styles.statusBtn} ${
                      booking.status === 'completed' ? styles.active : 
                      booking.status === 'cancelled' ? styles.inactive :
                      booking.status === 'active' ? styles.active :
                      styles.inactive
                    }`}
                  >
                    {getStatusDisplay(booking.status)}
                  </button>
                </td>
                <td>
                  <div className={styles.paymentInfo}>
                    <div className={styles.paymentMethod}>{getPaymentMethodDisplay(booking.paymentMethod)}</div>
                    <div className={`${styles.paymentStatus} ${
                      booking.paymentStatus === 'paid' ? styles.active :
                      booking.paymentStatus === 'refunded' ? styles.inactive :
                      styles.inactive
                    }`}>
                      {getPaymentStatusDisplay(booking.paymentStatus)}
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
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{editingBooking ? 'Chỉnh sửa đơn đặt' : 'Thêm đơn đặt mới'}</h2>
            </div>
            
            <div className={styles.modalBody}>
              <form className={styles.form}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Khách hàng</label>
                    <select defaultValue={editingBooking?.userId || ''}>
                      <option value="">Chọn khách hàng</option>
                      {mockUsers.filter(u => u.role === 'renter').map(user => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>Xe thuê</label>
                    <select defaultValue={editingBooking?.vehicleId || ''}>
                      <option value="">Chọn xe</option>
                      {allVehicles.map(vehicle => (
                        <option key={vehicle.id} value={vehicle.id}>{vehicle.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Ngày bắt đầu</label>
                    <input 
                      type="date" 
                      defaultValue={editingBooking?.startDate || ''}
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>Ngày kết thúc</label>
                    <input 
                      type="date" 
                      defaultValue={editingBooking?.endDate || ''}
                    />
                  </div>
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Tổng tiền (VNĐ)</label>
                    <input 
                      type="number" 
                      defaultValue={editingBooking?.totalPrice || ''}
                      placeholder="Nhập tổng tiền"
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>Trạng thái</label>
                    <select defaultValue={editingBooking?.status || 'pending'}>
                      <option value="pending">Chờ xác nhận</option>
                      <option value="confirmed">Đã xác nhận</option>
                      <option value="active">Đang sử dụng</option>
                      <option value="completed">Hoàn thành</option>
                      <option value="cancelled">Đã hủy</option>
                    </select>
                  </div>
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Phương thức thanh toán</label>
                    <select defaultValue={editingBooking?.paymentMethod || 'bank_transfer'}>
                      <option value="bank_transfer">Chuyển khoản</option>
                      <option value="credit_card">Thẻ tín dụng</option>
                      <option value="cash">Tiền mặt</option>
                      <option value="momo">MoMo</option>
                      <option value="zalopay">ZaloPay</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>Trạng thái thanh toán</label>
                    <select defaultValue={editingBooking?.paymentStatus || 'pending'}>
                      <option value="pending">Chờ thanh toán</option>
                      <option value="paid">Đã thanh toán</option>
                      <option value="refunded">Đã hoàn tiền</option>
                    </select>
                  </div>
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Địa điểm nhận xe</label>
                    <input 
                      type="text" 
                      defaultValue={editingBooking?.pickupLocation || ''}
                      placeholder="Nhập địa điểm nhận xe"
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>Địa điểm trả xe</label>
                    <input 
                      type="text" 
                      defaultValue={editingBooking?.returnLocation || ''}
                      placeholder="Nhập địa điểm trả xe"
                    />
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <label>Ghi chú</label>
                  <textarea 
                    defaultValue={editingBooking?.notes || ''}
                    placeholder="Nhập ghi chú"
                    rows={3}
                  />
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
              <button type="submit" className={styles.saveBtn}>
                {editingBooking ? 'Cập nhật' : 'Thêm mới'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Booking Modal */}
      {showViewModal && viewingBooking && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Chi tiết đơn đặt: #{viewingBooking.id}</h2>
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
                      <span>{getUserName(viewingBooking.userId)}</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Xe thuê:</label>
                      <span>{getVehicleName(viewingBooking.vehicleId)}</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Thời gian:</label>
                      <span>{viewingBooking.startDate} - {viewingBooking.endDate}</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Số ngày:</label>
                      <span>{viewingBooking.totalDays} ngày</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Tổng tiền:</label>
                      <span>{viewingBooking.totalPrice.toLocaleString('vi-VN')} VNĐ</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Trạng thái:</label>
                      <span>{getStatusDisplay(viewingBooking.status)}</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Phương thức thanh toán:</label>
                      <span>{getPaymentMethodDisplay(viewingBooking.paymentMethod)}</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Trạng thái thanh toán:</label>
                      <span>{getPaymentStatusDisplay(viewingBooking.paymentStatus)}</span>
                    </div>
                    {viewingBooking.transactionId && (
                      <div className={styles.viewItem}>
                        <label>Mã giao dịch:</label>
                        <span>{viewingBooking.transactionId}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.viewSection}>
                  <h3>Địa điểm</h3>
                  <div className={styles.viewGrid}>
                    <div className={styles.viewItem}>
                      <label>Nhận xe:</label>
                      <span>{viewingBooking.pickupLocation}</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Trả xe:</label>
                      <span>{viewingBooking.returnLocation}</span>
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
                      <span>{viewingBooking.createdAt}</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Cập nhật cuối:</label>
                      <span>{viewingBooking.updatedAt}</span>
                    </div>
                    {viewingBooking.completedAt && (
                      <div className={styles.viewItem}>
                        <label>Hoàn thành:</label>
                        <span>{viewingBooking.completedAt}</span>
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
    </div>
  );
};

export default BookingManagement;
