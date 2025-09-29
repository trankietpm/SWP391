"use client";

import React, { useState, useEffect } from 'react';
import styles from './EmailVerification.module.scss';

interface EmailVerificationProps {
  email: string;
  onVerify: (code: string) => void;
  onResend: () => void;
  onBack: () => void;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({ email, onVerify, onResend, onBack }) => {

  const handleLogin = () => {
    window.location.href = '/sign-in';
  };

  return (
    <div className={styles.formSection}>
      <div className={styles.formContainer}>
        <button type="button" onClick={onBack} className={styles.backButton}>
          <img src="/images/back.png" alt="Quay lại" className={styles.backIcon} />
        </button>

        <h1 className={styles.title}>Đăng ký thành công!</h1>
        
        <p className={styles.description}>
          Chúc mừng! Tài khoản của bạn đã được tạo thành công. Bây giờ bạn có thể đăng nhập vào tài khoản.
        </p>

        <div className={styles.successSection}>
          <div className={styles.successIcon}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22,4 12,14.01 9,11.01"></polyline>
            </svg>
          </div>
          
          <button type="button" onClick={handleLogin} className={styles.verifyButton}>
            Đăng nhập ngay
          </button>
        </div>

      </div>
    </div>
  );
};

export default EmailVerification; 