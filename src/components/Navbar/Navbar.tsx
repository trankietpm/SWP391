'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.scss';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
              href="/services" 
              className={isActive('/services') ? styles.active : ''}
              onClick={() => setIsMenuOpen(false)}
            >
              Dịch vụ
            </Link>
          </li>
          <li>
            <Link 
              href="/motorbikes" 
              className={isActive('/motorbikes') ? styles.active : ''}
              onClick={() => setIsMenuOpen(false)}
            >
              Xe máy điện
            </Link>
          </li>
          <li>
            <Link 
              href="/cars" 
              className={isActive('/cars') ? styles.active : ''}
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
          <button className={styles.loginBtn}>Đăng nhập</button>
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