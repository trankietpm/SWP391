"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import { loginService, UserProfile } from '@/services/login.service';
import { UserOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined, EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import styles from './Profile.module.scss';

const ProfilePage: React.FC = () => {
  const { user, token } = useAuth();
  const { isAuthenticated, isLoading } = useAuthCheck();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('account');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  });

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.id || !token) return;
      
      try {
        setLoading(true);
        // Use user data directly since API might not be accessible
        const profileData: UserProfile = {
          id: user.id,
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          email: user.email || '',
          phone: '',
          address: '',
          avatar: undefined
        };
              
        setUserProfile(profileData);
        setFormData({
          firstName: user.first_name || '',
          lastName: user.last_name || '',
          email: user.email || '',
          phone: '',
          address: ''
        });
        } catch (error) {
          // Handle error silently
        } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user?.id, token]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!user?.id || !token) return;
    
    try {
      const updatedData = await loginService.updateUserProfile(user.id, {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        address: formData.address
      }, token);

      setUserProfile(updatedData);
      setIsEditing(false);
      alert('Cập nhật thông tin thành công!');
    } catch (error) {
      alert('Có lỗi xảy ra khi cập nhật thông tin');
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: userProfile?.first_name || '',
      lastName: userProfile?.last_name || '',
      email: userProfile?.email || '',
      phone: userProfile?.phone || '',
      address: userProfile?.address || ''
    });
    setIsEditing(false);
  };

  if (isLoading || loading) {
    return (
      <div className={styles.profileContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // useAuthCheck will redirect to sign-in
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <div className={styles.profileSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Thông tin tài khoản</h2>
              <button className={styles.editButton} onClick={() => setIsEditing(!isEditing)}>
                <EditOutlined />
                {isEditing ? 'Hủy' : 'Chỉnh sửa'}
              </button>
            </div>
            
            <div className={styles.accountInfo}>
              <div className={styles.userAvatar}>
                <div className={styles.avatar}>
                  {userProfile ? `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim().charAt(0).toUpperCase() || 'U' : user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              <div className={styles.userInfo}>
                <h3 className={styles.userName}>
                  {userProfile ? `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() || 'User' : user?.name || 'User'}
                </h3>
                <p className={styles.userEmail}>{formData.email}</p>
              </div>
              </div>

              <div className={styles.personalDetails}>
                <div className={styles.detailItem}>
                  <label>Họ</label>
                  <span>{formData.firstName || 'Chưa cập nhật'}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>Tên</label>
                  <span>{formData.lastName || 'Chưa cập nhật'}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>Email</label>
                  <span>{formData.email} <span className={styles.verifiedBadge}>Đã xác thực</span></span>
                </div>
                <div className={styles.detailItem}>
                  <label>Số điện thoại</label>
                  <span>{formData.phone || 'Chưa cập nhật'}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>Địa chỉ</label>
                  <span>{formData.address || 'Chưa cập nhật'}</span>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className={styles.editForm}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Họ</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={styles.formInput}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Tên</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={styles.formInput}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Số điện thoại</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={styles.formInput}
                      placeholder="Nhập số điện thoại"
                      maxLength={11}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Địa chỉ</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={styles.formInput}
                      placeholder="Nhập địa chỉ"
                    />
                  </div>
                </div>
                <div className={styles.formActions}>
                  <button className={styles.saveButton} onClick={handleSave}>
                    <SaveOutlined />
                    Lưu thay đổi
                  </button>
                  <button className={styles.cancelButton} onClick={handleCancel}>
                    <CloseOutlined />
                    Hủy
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      case 'trips':
        return (
          <div className={styles.profileSection}>
            <h2 className={styles.sectionTitle}>Chuyến của tôi</h2>
            <div className={styles.emptyState}>
              <UserOutlined />
              <p>Bạn chưa có chuyến đi nào</p>
              <button className={styles.rentButton}>
                Thuê xe ngay
              </button>
            </div>
          </div>
        );
      case 'favorites':
        return (
          <div className={styles.profileSection}>
            <h2 className={styles.sectionTitle}>Xe yêu thích</h2>
            <div className={styles.emptyState}>
              <UserOutlined />
              <p>Bạn chưa có xe yêu thích nào</p>
              <button className={styles.rentButton}>
                Khám phá xe
              </button>
            </div>
          </div>
        );
      case 'password':
        return (
          <div className={styles.profileSection}>
            <h2 className={styles.sectionTitle}>Đổi mật khẩu</h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Mật khẩu hiện tại</label>
                <input type="password" placeholder="Nhập mật khẩu hiện tại" />
              </div>
              <div className={styles.formGroup}>
                <label>Mật khẩu mới</label>
                <input type="password" placeholder="Nhập mật khẩu mới" />
              </div>
              <div className={styles.formGroup}>
                <label>Xác nhận mật khẩu mới</label>
                <input type="password" placeholder="Nhập lại mật khẩu mới" />
              </div>
            </div>
            <div className={styles.formActions}>
              <button className={styles.saveButton}>
                <SaveOutlined />
                Cập nhật mật khẩu
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.sidebar}>
        <div className={styles.greeting}>
          <h2>Xin chào bạn!</h2>
        </div>
        
        <nav className={styles.navMenu}>
          <button 
            className={`${styles.navItem} ${activeTab === 'account' ? styles.active : ''}`}
            onClick={() => setActiveTab('account')}
          >
            <UserOutlined />
            Tài khoản của tôi
          </button>
          <button 
            className={styles.navItem}
            onClick={() => setActiveTab('trips')}
          >
            <UserOutlined />
            Chuyến của tôi
          </button>
          <button 
            className={styles.navItem}
            onClick={() => setActiveTab('favorites')}
          >
            <UserOutlined />
            Xe yêu thích
          </button>
          <button 
            className={styles.navItem}
            onClick={() => setActiveTab('password')}
          >
            <UserOutlined />
            Đổi mật khẩu
          </button>
          <div className={styles.divider}></div>
          <button className={`${styles.navItem} ${styles.logout}`}>
            <UserOutlined />
            Đăng xuất
          </button>
        </nav>
      </div>

      <div className={styles.mainContent}>
        {renderContent()}
      </div>
    </div>
  );
};

export default ProfilePage;
