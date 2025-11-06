"use client";
import React, { useState, useEffect } from 'react';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  SearchOutlined,
  UserOutlined
} from '@ant-design/icons';
import { userService, User } from '../../services/user.service';
import styles from './UserManagement.module.scss';

const StaffManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const apiUsers = await userService.getAllUsers();
      // Filter only STAFF users
      const staffUsers = apiUsers.filter(u => u.role?.toUpperCase() === 'STAFF');
      setUsers(staffUsers);
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserDisplayName = (user: User): string => {
    return `${user.last_name} ${user.first_name}`.trim() || user.email;
  };

  const filteredUsers = users.filter(user => {
    const displayName = getUserDisplayName(user);
    return displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           user.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const handleDelete = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      try {
        const success = await userService.deleteUser(id);
        if (success) {
          setUsers(users.filter(user => user.user_id !== id));
        } else {
          alert('Không thể xóa nhân viên');
        }
      } catch (error) {
        console.error('Error deleting staff:', error);
        alert('Có lỗi xảy ra khi xóa nhân viên');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      if (editingUser) {
        // Update staff
        const updateData = {
          first_name: (formData.get('first_name') as string || '').trim(),
          last_name: (formData.get('last_name') as string || '').trim(),
          ...(formData.get('password') && { password: formData.get('password') as string }),
        };
        
        await userService.updateUser(editingUser.user_id, updateData);
        await fetchUsers();
        setShowModal(false);
        setEditingUser(null);
      } else {
        // Create new staff user
        const newUser = {
          email: (formData.get('email') as string || '').trim(),
          password: formData.get('password') as string,
          first_name: (formData.get('first_name') as string || '').trim(),
          last_name: (formData.get('last_name') as string || '').trim(),
        };
        
        await userService.createStaffUser(newUser);
        await fetchUsers();
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error saving staff:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        alert(axiosError.response?.data?.message || 'Có lỗi xảy ra khi lưu nhân viên');
      } else {
        alert('Có lỗi xảy ra khi lưu nhân viên');
      }
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


  if (loading) {
    return (
      <div className={styles.userManagement}>
        <div style={{ padding: '20px', textAlign: 'center' }}>Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className={styles.userManagement}>
      <div className={styles.header}>
        <h1>Quản lý nhân viên</h1>
        <button className={styles.addBtn} onClick={handleAddNew}>
          <PlusOutlined />
          Thêm nhân viên mới
        </button>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <SearchOutlined />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Thông tin</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Ngày tham gia</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user.user_id}>
                <td>{user.user_id}</td>
                <td>
                  <div className={styles.userInfo}>
                    <div className={styles.avatar}>
                      <UserOutlined />
                    </div>
                    <div>
                      <div className={styles.userName}>{getUserDisplayName(user)}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className={styles.contactInfo}>
                    <div className={styles.email}>{user.email}</div>
                  </div>
                </td>
                <td>
                  <span className={`${styles.roleTag} ${styles.staff}`}>
                    Nhân viên
                  </span>
                </td>
                <td className={styles.joinDate}>
                  {new Date(user.date_created).toLocaleDateString('vi-VN')}
                </td>
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
                      onClick={() => handleDelete(user.user_id)}
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
            Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} trong {filteredUsers.length} nhân viên
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
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{editingUser ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}</h2>
              <button 
                className={styles.closeBtn}
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <form id="staff-form" className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Họ *</label>
                    <input 
                      type="text" 
                      name="last_name"
                      defaultValue={editingUser?.last_name || ''}
                      placeholder="Nhập họ (ví dụ: Nguyễn)"
                      required
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>Tên *</label>
                    <input 
                      type="text" 
                      name="first_name"
                      defaultValue={editingUser?.first_name || ''}
                      placeholder="Nhập tên (ví dụ: Văn A)"
                      required
                    />
                  </div>
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Email *</label>
                    <input 
                      type="email" 
                      name="email"
                      defaultValue={editingUser?.email || ''}
                      placeholder="Nhập email"
                      required={!editingUser}
                      disabled={!!editingUser}
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>Mật khẩu {!editingUser && '*'}</label>
                    <input 
                      type="password" 
                      name="password"
                      placeholder={editingUser ? "Để trống nếu không đổi mật khẩu" : "Nhập mật khẩu (tối thiểu 8 ký tự)"}
                      required={!editingUser}
                      minLength={8}
                    />
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
                type="submit" 
                className={styles.saveBtn}
                form="staff-form"
              >
                {editingUser ? 'Cập nhật' : 'Thêm mới'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {showViewModal && viewingUser && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Chi tiết nhân viên: {getUserDisplayName(viewingUser)}</h2>
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
                      <label>Họ và tên:</label>
                      <span>{getUserDisplayName(viewingUser)}</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Email:</label>
                      <span>{viewingUser.email}</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Vai trò:</label>
                      <span>Nhân viên</span>
                    </div>
                    <div className={styles.viewItem}>
                      <label>Ngày tham gia:</label>
                      <span>{new Date(viewingUser.date_created).toLocaleDateString('vi-VN')}</span>
                    </div>
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

export default StaffManagement;

