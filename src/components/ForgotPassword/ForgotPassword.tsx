"use client";

import React, { useState, useEffect } from 'react';
import styles from './ForgotPassword.module.scss';

interface ForgotPasswordProps {
  onBack: () => void;
  onSubmit: (email: string) => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword] = useState(false);
  const [showConfirmPassword] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); 

  useEffect(() => {
    if (showVerification) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showVerification]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}m${remainingSeconds.toString().padStart(2, '0')}s`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email);
    setShowVerification(true);
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Verification code:', verificationCode);
    setShowNewPassword(true);
  };

  const handleNewPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New password:', newPassword);
    console.log('Confirm password:', confirmPassword);
    setShowCongratulations(true);
  };

  const handleSignIn = () => {
    console.log('Navigate to sign in');
  };

  const handleResend = () => {
    if (timeLeft === 0) {
      setTimeLeft(300);
      console.log('Resending verification code...');
    }
  };

  const handleBackToForm = () => {
    setShowVerification(false);
    setShowNewPassword(false);
    setShowCongratulations(false);
    setVerificationCode('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeLeft(300);
  };

  const handleBackToVerification = () => {
    setShowNewPassword(false);
    setShowCongratulations(false);
    setNewPassword('');
    setConfirmPassword('');
  };

  if (showCongratulations) {
    return (
      <div className={styles.formSection}>
        <div className={styles.formContainer}>
          <div className={styles.congratulationsContent}>
            <div className={styles.congratulationsImageContainer}>
              <img src="/congratulations.png" alt="Chúc mừng" className={styles.congratulationsIcon} />
              <h1 className={styles.congratulationsTitle}>
                Hoàn thành! Mật khẩu của bạn đã được đặt lại.
              </h1>
            </div>
            <button onClick={handleSignIn} className={styles.signInButton}>
              Đăng nhập ngay
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showNewPassword) {
    return (
      <div className={styles.formSection}>
        <div className={styles.formContainer}>
          <button type="button" onClick={handleBackToVerification} className={styles.backButton}>
            <img src="/images/back.png" alt="Quay lại" className={styles.backIcon} />
          </button>

          <div className={styles.titlesContainer}>
            <h2 className={styles.title}>
              Đặt lại mật khẩu
            </h2>
          </div>


          <form className={styles.forgotForm} onSubmit={handleNewPasswordSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="newPassword">Tạo mật khẩu</label>
              <div className={styles.passwordInput}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
              {newPassword && <p className={styles.passwordHint}>Phải có ít nhất 8 ký tự</p>}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
              <div className={styles.passwordInput}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <button type="submit" className={styles.continueButton}>
              Tiếp tục
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (showVerification) {
    return (
      <div className={styles.formSection}>
        <div className={styles.formContainer}>
          <button type="button" onClick={handleBackToForm} className={styles.backButton}>
            <img src="/images/back.png" alt="Quay lại" className={styles.backIcon} />
          </button>

          <h1 className={styles.title}>Đặt lại mật khẩu</h1>
          
          <p className={styles.description}>
            Chúng tôi đã gửi mã đến{' '}
            <strong className={styles.emailHighlight}>
              {email}
            </strong>
          </p>

          <form className={styles.verificationForm} onSubmit={handleVerifySubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="code">Nhập mã</label>
              <input
                type="text"
                id="code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className={styles.codeInput}
                placeholder="Nhập mã xác thực"
                required
              />
            </div>

            <div className={styles.resendSection}>
              <button
                type="button"
                onClick={handleResend}
                className={`${styles.resendButton} ${timeLeft > 0 ? styles.disabled : ''}`}
                disabled={timeLeft > 0}
              >
                Gửi lại mã
              </button>
              {timeLeft > 0 && (
                <span className={styles.timer}>{formatTime(timeLeft)}</span>
              )}
            </div>

            <button type="submit" className={styles.continueButton}>
              Tiếp tục
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formSection}>
      <div className={styles.formContainer}>
        {/* Back Button */}
        <button type="button" onClick={onBack} className={styles.backButton}>
          <img src="/images/back.png" alt="Back" className={styles.backIcon} />
        </button>

        <div className={styles.titlesContainer}>
          <h2 className={styles.title}>
            Đặt lại mật khẩu
          </h2>
        </div>


        <form className={styles.forgotForm} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Nhập email của bạn</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <button type="submit" className={styles.continueButton}>
            Tiếp tục
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword; 