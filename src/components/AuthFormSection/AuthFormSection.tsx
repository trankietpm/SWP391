"use client";

import React, { useState } from 'react';
import styles from './AuthFormSection.module.scss';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface AuthFormSectionProps {
  type: 'login' | 'register';
  formData: FormData;
  onInputChange: (field: keyof FormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onForgotPassword: () => void;
  isLoading?: boolean;
  error?: string | null;
}

const AuthFormSection: React.FC<AuthFormSectionProps> = ({ 
  type, 
  formData, 
  onInputChange, 
  onSubmit,
  onForgotPassword,
  isLoading = false,
  error = null
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isLogin = type === 'login';
  
  const passwordsMatch = formData.password === formData.confirmPassword;
  const showPasswordError = !isLogin && formData.confirmPassword && !passwordsMatch;
  const isPasswordValid = formData.password.length >= 8;
  const canSubmit = isLogin || (passwordsMatch && isPasswordValid);

  return (
    <div className={styles.formSection}>
      <div className={styles.formContainer}>
        <div className={styles.titleContainer}>
          <div className={styles.titlesContainer}>
            <h2 className={styles.title}>
              {isLogin ? 'Đăng nhập' : 'Đăng ký'}
            </h2>
          </div>
        </div>


        <form className={styles.authForm} onSubmit={onSubmit}>
          {!isLogin && (
            <>
              <div className={styles.inputGroup}>
                <label htmlFor="firstName">Họ</label>
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => onInputChange('firstName', e.target.value)}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="lastName">Tên</label>
                <input
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => onInputChange('lastName', e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
            </>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => onInputChange('email', e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">{isLogin ? 'Mật khẩu' : 'Tạo mật khẩu'}</label>
            <div className={styles.passwordInput}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={formData.password}
                onChange={(e) => onInputChange('password', e.target.value)}
                className={styles.input}
                required
              /> 
            </div>
            {!isLogin && formData.password && !isPasswordValid && (
              <p className={`${styles.passwordHint} ${styles.error}`}>
                Phải có ít nhất 8 ký tự
              </p>
            )}
          </div>

          {!isLogin && (
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
              <div className={styles.passwordInput}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => onInputChange('confirmPassword', e.target.value)}
                  className={`${styles.input} ${showPasswordError ? styles.errorInput : ''}`}
                  required
                />
              </div>
              {showPasswordError && (
                <p className={styles.errorMessage}>Mật khẩu không khớp</p>
              )}
            </div>
          )}

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          {isLogin && (
            <div className={styles.forgotPassword}>
              <button type="button" onClick={onForgotPassword} className={styles.forgotLink}>
                Quên mật khẩu
              </button>
            </div>
          )}

          <button 
            type="submit" 
            className={styles.authButton} 
            style={{ display: 'block', width: '100%' }}
            disabled={isLoading || !canSubmit}
          >
            {isLoading ? 'Đang đăng nhập...' : (isLogin ? 'Đăng nhập' : 'Đăng ký')}
          </button>

          <div className={styles.separator}>
            <span>Hoặc</span>
          </div>


          <div className={styles.switchAuth}>
            <span>{isLogin ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}</span>
            <a href={isLogin ? '/sign-up' : '/sign-in'} className={styles.switchLink}>
              {isLogin ? 'Đăng ký' : 'Đăng nhập'}
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthFormSection; 