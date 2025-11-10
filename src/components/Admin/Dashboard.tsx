"use client";
import React from 'react';
import { 
  CarOutlined, 
  UserOutlined, 
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { allVehicles } from '../../data/vehicles';
import { mockUsers } from '../../data/users';
import { mockBookings } from '../../data/bookings';
import styles from './Dashboard.module.scss';

const Dashboard: React.FC = () => {
  // Thống kê tổng quan
  const totalRenters = mockUsers.filter(user => user.role === 'renter').length;
  const totalBookings = mockBookings.length;
  
  // Thống kê đơn đặt theo trạng thái
  const pendingBookings = mockBookings.filter(booking => booking.status === 'pending').length;
  const confirmedBookings = mockBookings.filter(booking => booking.status === 'confirmed').length;
  const activeBookings = mockBookings.filter(booking => booking.status === 'active').length;
  const completedBookings = mockBookings.filter(booking => booking.status === 'completed').length;
  const cancelledBookings = mockBookings.filter(booking => booking.status === 'cancelled').length;
  
  // Thống kê thanh toán
  const paidBookings = mockBookings.filter(booking => booking.paymentStatus === 'paid').length;
  const pendingPayments = mockBookings.filter(booking => booking.paymentStatus === 'pending').length;
  const refundedBookings = mockBookings.filter(booking => booking.paymentStatus === 'refunded').length;
  
  
  // Doanh thu
  const totalRevenue = mockBookings
    .filter(booking => booking.paymentStatus === 'paid')
    .reduce((sum, booking) => sum + booking.totalPrice, 0);
  
  // Tính toán xe theo trạm
  const totalVehiclesInStations = allVehicles.reduce((total, vehicle) => total + vehicle.availableCount, 0);
  
  // Xe đang được thuê
  const rentedVehicles = mockBookings
    .filter(booking => booking.status === 'active')
    .map(booking => booking.vehicleId);
  const uniqueRentedVehicles = [...new Set(rentedVehicles)].length;
  
  // Xe có sẵn = Tổng xe trong trạm - xe đang thuê
  const availableVehicles = totalVehiclesInStations - uniqueRentedVehicles;

  const statsCards = [
    {
      title: 'Tổng số xe',
      value: totalVehiclesInStations,
      icon: <CarOutlined />,
      color: '#1890ff',
      bgColor: '#e6f7ff',
      borderColor: '#91d5ff'
    },
    {
      title: 'Xe có sẵn',
      value: availableVehicles,
      icon: <CheckCircleOutlined />,
      color: '#52c41a',
      bgColor: '#f6ffed',
      borderColor: '#b7eb8f'
    },
    {
      title: 'Xe đang thuê',
      value: uniqueRentedVehicles,
      icon: <ClockCircleOutlined />,
      color: '#fa8c16',
      bgColor: '#fff7e6',
      borderColor: '#ffd591'
    },
    {
      title: 'Khách hàng',
      value: totalRenters,
      icon: <UserOutlined />,
      color: '#722ed1',
      bgColor: '#f9f0ff',
      borderColor: '#d3adf7'
    },
    {
      title: 'Doanh thu (VNĐ)',
      value: totalRevenue.toLocaleString('vi-VN'),
      icon: <DollarOutlined />,
      color: '#eb2f96',
      bgColor: '#fff0f6',
      borderColor: '#ffadd2'
    }
  ];

  const bookingStats = [
    {
      title: 'Chờ xác nhận',
      value: pendingBookings,
      color: '#fa8c16',
      bgColor: '#fff7e6'
    },
    {
      title: 'Đã xác nhận',
      value: confirmedBookings,
      color: '#722ed1',
      bgColor: '#f9f0ff'
    },
    {
      title: 'Đang sử dụng',
      value: activeBookings,
      color: '#1890ff',
      bgColor: '#e6f7ff'
    },
    {
      title: 'Hoàn thành',
      value: completedBookings,
      color: '#52c41a',
      bgColor: '#f6ffed'
    },
    {
      title: 'Đã hủy',
      value: cancelledBookings,
      color: '#ff4d4f',
      bgColor: '#fff2f0'
    }
  ];



  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Dashboard</h1>
        <p>Tổng quan hệ thống quản lý thuê xe điện</p>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        {statsCards.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <div 
              className={styles.statIcon}
              style={{ 
                color: stat.color, 
                backgroundColor: stat.bgColor,
                borderColor: stat.borderColor
              }}
            >
              {stat.icon}
            </div>
            <div className={styles.statContent}>
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

       {/* Admin Alerts */}
       <div className={styles.alertsSection}>
         <div className={styles.alertCard}>
           <div className={styles.alertIcon}>
             <ExclamationCircleOutlined />
           </div>
           <div className={styles.alertContent}>
             <h3>Cần xử lý</h3>
             <p>{pendingBookings} đơn đặt chờ xác nhận</p>
           </div>
         </div>
         
         <div className={styles.alertCard}>
           <div className={styles.alertIcon}>
             <ClockCircleOutlined />
           </div>
           <div className={styles.alertContent}>
             <h3>Đang hoạt động</h3>
             <p>{activeBookings} xe đang được thuê</p>
           </div>
         </div>
         
         <div className={styles.alertCard}>
           <div className={styles.alertIcon}>
             <CheckCircleOutlined />
           </div>
           <div className={styles.alertContent}>
             <h3>Hoàn thành</h3>
             <p>{completedBookings} đơn đã hoàn thành</p>
           </div>
         </div>
       </div>

       {/* Charts Section */}
       <div className={styles.chartsSection}>
         <div className={styles.chartContainer}>
           <h2>Trạng thái đơn đặt</h2>
           <div className={styles.chartWrapper}>
             <div className={styles.donutChart}>
               <div className={styles.donutInner}>
                 <span className={styles.donutTotal}>{totalBookings}</span>
                 <span className={styles.donutLabel}>Tổng đơn</span>
               </div>
             </div>
             <div className={styles.chartLegend}>
               {bookingStats.map((stat, index) => (
                 <div key={index} className={styles.legendItem}>
                   <div 
                     className={styles.legendColor}
                     style={{ backgroundColor: stat.color }}
                   />
                   <span className={styles.legendLabel}>{stat.title}</span>
                   <span className={styles.legendValue}>{stat.value}</span>
                 </div>
               ))}
             </div>
           </div>
         </div>
       </div>

      {/* Recent Bookings */}
      <div className={styles.recentSection}>
        <h2>Đơn đặt gần đây</h2>
        <div className={styles.recentTable}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Khách hàng</th>
                <th>Xe thuê</th>
                <th>Thời gian</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {mockBookings.slice(0, 5).map((booking) => (
                <tr key={booking.id}>
                  <td>#{booking.id}</td>
                  <td>
                    <div className={styles.userInfo}>
                      <UserOutlined />
                      <span>{mockUsers.find(u => u.id === booking.userId)?.name || `User ${booking.userId}`}</span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.vehicleInfo}>
                      <CarOutlined />
                      <span>{allVehicles.find(v => v.id === booking.vehicleId)?.name || `Vehicle ${booking.vehicleId}`}</span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.dateInfo}>
                      <span>{booking.startDate} - {booking.endDate}</span>
                      <small>{booking.totalDays} ngày</small>
                    </div>
                  </td>
                  <td>
                    <span className={styles.price}>{booking.totalPrice.toLocaleString('vi-VN')} VNĐ</span>
                  </td>
                  <td>
                    <span 
                      className={styles.status}
                      style={{
                        backgroundColor: booking.status === 'completed' ? '#f6ffed' :
                                        booking.status === 'active' ? '#e6f7ff' :
                                        booking.status === 'cancelled' ? '#fff2f0' : '#fff7e6',
                        color: booking.status === 'completed' ? '#52c41a' :
                               booking.status === 'active' ? '#1890ff' :
                               booking.status === 'cancelled' ? '#ff4d4f' : '#fa8c16'
                      }}
                    >
                      {booking.status === 'pending' ? 'Chờ xác nhận' :
                       booking.status === 'confirmed' ? 'Đã xác nhận' :
                       booking.status === 'active' ? 'Đang sử dụng' :
                       booking.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
