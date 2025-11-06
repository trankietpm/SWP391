"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined, 
  CarOutlined, 
  UserOutlined, 
  DashboardOutlined,
  LogoutOutlined,
  FileTextOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import styles from './AdminLayout.module.scss';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      href: '/admin'
    },
    {
      key: '/admin/stations',
      icon: <EnvironmentOutlined />,
      label: 'Quản lý trạm',
      href: '/admin/stations'
    },
    {
      key: '/admin/vehicle-models',
      icon: <CarOutlined />,
      label: 'Quản lý mẫu xe',
      href: '/admin/vehicle-models'
    },
    {
      key: '/admin/vehicles',
      icon: <CarOutlined />,
      label: 'Quản lý xe',
      href: '/admin/vehicles'
    },
    {
      key: '/admin/users',
      icon: <UserOutlined />,
      label: 'Quản lý người dùng',
      href: '/admin/users'
    },
    {
      key: '/admin/staff',
      icon: <TeamOutlined />,
      label: 'Quản lý nhân viên',
      href: '/admin/staff'
    },
    {
      key: '/admin/bookings',
      icon: <CalendarOutlined />,
      label: 'Quản lý đơn đặt',
      href: '/admin/bookings'
    }
  ];

  return (
    <div className={styles.adminLayout}>
      <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
        <div className={styles.logo}>
          <h2>EVS Admin</h2>
        </div>
        
        <nav className={styles.nav}>
          {menuItems.map((item) => (
            <Link 
              key={item.key}
              href={item.href}
              className={`${styles.navItem} ${pathname === item.key ? styles.active : ''}`}
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
        
        <div className={styles.logout}>
          <button className={styles.logoutBtn}>
            <LogoutOutlined />
            {!collapsed && <span>Đăng xuất</span>}
          </button>
        </div>
      </div>

      <div className={styles.mainContent}>
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
