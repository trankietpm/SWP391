"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AuthForm from '../../components/AuthForm/AuthForm';
import styles from './Login.module.scss';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const LoginContent = () => {
  const searchParams = useSearchParams();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const confirmed = searchParams.get('confirmed');
    const error = searchParams.get('error');
    
    if (confirmed === 'true') {
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    }
    
    if (error) {
      setErrorMessage(decodeURIComponent(error));
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  }, [searchParams]);

  const handleLogin = (data: FormData) => {
    console.log('Login data:', data);
    // Handle login logic here
  };

  return (
    <div className={styles.container}>
      {showSuccessMessage && (
        <div className={`${styles.notification} ${styles.successNotification}`}>
          <div className={styles.notificationContent}>
            <svg className={styles.notificationIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22,4 12,14.01 9,11.01"></polyline>
            </svg>
            <div className={styles.notificationText}>
              <strong className={styles.notificationTitle}>Xác nhận thành công!</strong>
              <div className={styles.notificationMessage}>
                Bạn có thể đăng nhập ngay bây giờ.
              </div>
            </div>
          </div>
        </div>
      )}
      
      {errorMessage && (
        <div className={`${styles.notification} ${styles.errorNotification}`}>
          <div className={styles.notificationContent}>
            <svg className={styles.notificationIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <div className={styles.notificationText}>
              <strong className={styles.notificationTitle}>Lỗi xác nhận</strong>
              <div className={styles.notificationMessage}>
                {errorMessage}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <AuthForm type="login" onSubmit={handleLogin} />
    </div>
  );
};

const LoginPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
};

export default LoginPage;
