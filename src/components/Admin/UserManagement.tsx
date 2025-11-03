"use client";
import React, { useState } from 'react';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  SearchOutlined,
  FilterOutlined,
  UserOutlined
} from '@ant-design/icons';
import { mockUsers, User } from '../../data/users';
import styles from './UserManagement.module.scss';

const UserManagement: React.FC = () => {
  // Filter only renter users
  const allUsers = mockUsers.filter(user => user.role === 'renter');
  const [users, setUsers] = useState<User[]>(allUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const handleDelete = (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleView = (user: User) => {
    setViewingUser(user);
    setShowViewModal(true);
  };

  const toggleStatus = (id: number) => {
    setUsers(users.map(user => 
      user.id === id 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  return (
    <div className={styles.userManagement}>
      <div className={styles.header}>
        <h1>Quản lý người dùng</h1>
        <button className={styles.addBtn} onClick={handleAddNew}>
          <PlusOutlined />
          Thêm người dùng
        </button>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <SearchOutlined />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
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
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Thông tin</th>
              <th>Liên hệ</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Ngày tham gia</th>
              <th>Đăng nhập cuối</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                  <div className={styles.userInfo}>
                    <div className={styles.avatar}>
                      <UserOutlined />
                    </div>
                    <div>
                      <div className={styles.userName}>{user.name}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className={styles.contactInfo}>
                    <div className={styles.email}>{user.email}</div>
                    <div className={styles.phone}>{user.phone}</div>
                  </div>
                </td>
                <td>
                  <span className={`${styles.roleTag} ${
                    user.role === 'admin' ? styles.admin : 
                    user.role === 'staff' ? styles.staff : 
                    styles.renter
                  }`}>
                    {user.role === 'admin' ? 'Admin' : 
                     user.role === 'staff' ? 'Staff' : 
                     'Renter'}
                  </span>
                </td>
                <td>
                  <button 
                    className={`${styles.statusBtn} ${user.status === 'active' ? styles.active : styles.inactive}`}
                    onClick={() => toggleStatus(user.id)}
                  >
                    {user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                  </button>
                </td>
                <td className={styles.joinDate}>{user.joinDate}</td>
                <td className={styles.lastLogin}>{user.lastLogin}</td>
                <td>
                  <div className={styles.actions}>
                    <button 
                      className={styles.viewBtn}
                      onClick={() => handleView(user)}
                      title="Xem chi tiết"
                    >
                      <EyeOutlined />
                    </button>
                    <button 
                      className={styles.editBtn}
                      onClick={() => handleEdit(user)}
                      title="Chỉnh sửa"
                    >
                      <EditOutlined />
                    </button>
                    <button 
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(user.id)}
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

      {filteredUsers.length === 0 && (
        <div className={styles.emptyState}>
          <p>Không tìm thấy người dùng nào phù hợp</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} trong {filteredUsers.length} người dùng
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

      {/* Modal for Add/Edit User */}
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}</h2>
            </div>
            
            <div className={styles.modalBody}>
              <form className={styles.form}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Họ và tên</label>
                    <input 
                      type="text" 
                      defaultValue={editingUser?.name || ''}
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>Email</label>
                    <input 
                      type="email" 
                      defaultValue={editingUser?.email || ''}
                      placeholder="Nhập email"
                    />
                  </div>
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Số điện thoại</label>
                    <input 
                      type="tel" 
                      defaultValue={editingUser?.phone || ''}
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>Vai trò</label>
                    <select defaultValue={editingUser?.role || ''}>
                      <option value="">Chọn vai trò</option>
                      <option value="admin">Admin</option>
                      <option value="staff">Staff</option>
                      <option value="renter">Renter</option>
                    </select>
                  </div>
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Trạng thái</label>
                    <select defaultValue={editingUser?.status || 'active'}>
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Không hoạt động</option>
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>CMND/CCCD</label>
                    <input 
                      type="text" 
                      defaultValue={editingUser?.idCard || ''}
                      placeholder="Nhập số CMND/CCCD"
                    />
                  </div>
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Số bằng lái xe</label>
                    <input 
                      type="text" 
                      defaultValue={editingUser?.licenseNumber || ''}
                      placeholder="Nhập số bằng lái xe"
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>Ngày tham gia</label>
                    <input 
                      type="date" 
                      defaultValue={editingUser?.joinDate || ''}
                    />
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <label>Địa chỉ</label>
                  <textarea 
                    defaultValue={editingUser?.address || ''}
                    placeholder="Nhập địa chỉ"
                    rows={2}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Ghi chú</label>
                  <textarea 
                    defaultValue={editingUser?.notes || ''}
                    placeholder="Nhập ghi chú về người dùng"
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
                {editingUser ? 'Cập nhật' : 'Thêm mới'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {showViewModal && viewingUser && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Chi tiết người dùng: {viewingUser.name}</h2>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.viewContent}>
                <div className={styles.viewSection}>
                  <h3>Thông tin cơ bản</h3>
                  <div className={styles.viewGrid}>
                    <div className={styles.viewItem}>
                      <label>Họ và tên:</label>
                      <span>{viewingUser.name}</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Email:</label>
                      <span>{viewingUser.email}</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Số điện thoại:</label>
                      <span>{viewingUser.phone}</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Vai trò:</label>
                      <span>{viewingUser.role === 'admin' ? 'Admin' : 
                             viewingUser.role === 'staff' ? 'Staff' : 
                             'Renter'}</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Trạng thái:</label>
                      <span>{viewingUser.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Ngày tham gia:</label>
                      <span>{viewingUser.joinDate}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.viewSection}>
                  <h3>Thông tin bổ sung</h3>
                  <div className={styles.viewGrid}>
                    <div className={styles.viewItem}>
                      <label>CMND/CCCD:</label>
                      <span>{viewingUser.idCard || 'Chưa cập nhật'}</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Số bằng lái xe:</label>
                      <span>{viewingUser.licenseNumber || 'Chưa cập nhật'}</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Đăng nhập cuối:</label>
                      <span>{viewingUser.lastLogin}</span>
                    </div>
                  </div>
                </div>

                {viewingUser.address && (
                  <div className={styles.viewSection}>
                    <h3>Địa chỉ</h3>
                    <p>{viewingUser.address}</p>
                  </div>
                )}

                {viewingUser.notes && (
                  <div className={styles.viewSection}>
                    <h3>Ghi chú</h3>
                    <p>{viewingUser.notes}</p>
                  </div>
                )}
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

export default UserManagement;
