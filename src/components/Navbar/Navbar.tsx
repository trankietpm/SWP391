'use client'
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import styles from './Navbar.module.scss';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuthenticated, user, logout } = useAuth();
  const profileRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/">
            <img src="/images/logo.png" alt="EVS Rent Logo" className={styles.logoImage} />
          </Link>
        </div>
        
        <ul className={`${styles.menu} ${isMenuOpen ? styles.menuOpen : ''}`}>
          <li>
            <Link 
              href="/" 
              className={isActive('/') ? styles.active : ''}
              onClick={() => setIsMenuOpen(false)}
            >
              Trang chủ
            </Link>
          </li>
          <li>
            <Link 
              href="/about" 
              className={isActive('/about') ? styles.active : ''}
              onClick={() => setIsMenuOpen(false)}
            >
              Giới thiệu
            </Link>
          </li>
          <li>
            <Link 
              href="/map" 
              className={isActive('/map') ? styles.active : ''}
              onClick={() => setIsMenuOpen(false)}
            >
              Bản đồ
            </Link>
          </li>
          <li>
            <Link 
              href="/vehicles?type=electric-motorcycle" 
              className={searchParams.get('type') === 'electric-motorcycle' ? styles.active : ''}
              onClick={() => setIsMenuOpen(false)}
            >
              Xe máy điện
            </Link>
          </li>
          <li>
            <Link 
              href="/vehicles?type=electric-car" 
              className={searchParams.get('type') === 'electric-car' ? styles.active : ''}
              onClick={() => setIsMenuOpen(false)}
            >
              Ô tô điện
            </Link>
          </li>
          <li>
            <Link 
              href="/contact" 
              className={isActive('/contact') ? styles.active : ''}
              onClick={() => setIsMenuOpen(false)}
            >
              Liên hệ
            </Link>
          </li>
        </ul>
        
       <div className={styles.actions}>
          {isAuthenticated ? (
            <div className={styles.profileSection} ref={profileRef}>
              <button 
                className={styles.profileButton}
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className={styles.profileAvatar}>
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className={styles.profileName}>{user?.name || 'User'}</span>
                <svg className={styles.dropdownIcon} width="12" height="12" viewBox="0 0 24 24">
                  <path d="M7 10l5 5 5-5z" fill="currentColor"/>
                </svg>
              </button>
              
              {showProfileMenu && (
                <div className={styles.profileDropdown}>
                  <div className={styles.profileInfo}>
                    <div className={styles.profileAvatar}>
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className={styles.profileDetails}>
                      <span className={styles.profileName}>{user?.name || 'User'}</span>
                      <span className={styles.profileEmail}>{user?.email}</span>
                    </div>
                  </div>
                  <div className={styles.profileActions}>
                    <Link href="/profile" className={styles.profileAction} onClick={() => setShowProfileMenu(false)}>
                      <svg width="16" height="16" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
                      </svg>
                      Profile
                    </Link>
                    {(user?.role?.toUpperCase() === 'ADMIN' || user?.role?.toUpperCase() === 'STAFF') && (
                      <Link href="/admin" className={styles.profileAction} onClick={() => setShowProfileMenu(false)}>
                        <svg width="16" height="16" viewBox="0 0 24 24">
                          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="currentColor"/>
                        </svg>
                        Dashboard
                      </Link>
                    )}
                    <button className={styles.profileAction} onClick={handleLogout}>
                      <svg width="16" height="16" viewBox="0 0 24 24">
                        <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" fill="currentColor"/>
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/sign-in" className={styles.loginBtn}>
              Đăng nhập
            </Link>
          )}
        </div>
        
        <button 
          className={`${styles.hamburger} ${isMenuOpen ? styles.hamburgerOpen : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;