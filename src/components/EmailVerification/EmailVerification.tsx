"use client";

import React from 'react';
import styles from './EmailVerification.module.scss';

interface EmailVerificationProps {
  email: string;
  onBack: () => void;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({ email, onBack }) => {

  return (
    <div className={styles.formSection}>
      <div className={styles.formContainer}>
        <button type="button" onClick={onBack} className={styles.backButton}>
          <img src="/images/back.png" alt="Quay lại" className={styles.backIcon} />
        </button>

        <h1 className={styles.title}>Vui lòng kiểm tra email</h1>
        
        <p className={styles.description}>
          Chúng tôi đã gửi email xác nhận đến địa chỉ <b>{email}</b>.
          <br />
          Vui lòng kiểm tra hộp thư và nhấn vào link xác nhận để hoàn tất đăng ký.
        </p>

        <div className={styles.successSection}>
          <div className={styles.successIcon}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </div>
          
          <p style={{ marginTop: '16px', color: '#666', fontSize: '14px' }}>
            Sau khi xác nhận email, bạn có thể quay lại đăng nhập.
          </p>
        </div>

      </div>
    </div>
  );
};

export default EmailVerification; 