"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './AuthForm.module.scss';
import AuthFormSection from '../AuthFormSection/AuthFormSection';
import EmailVerification from '../EmailVerification/EmailVerification';
import ForgotPassword from '../ForgotPassword/ForgotPassword';
import { loginService } from '../../services/login.service';
import { useAuth } from '../../contexts/AuthContext';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface AuthFormProps {
  type: 'login' | 'register';
  onSubmit: (data: FormData) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit }) => {
  const router = useRouter();
  const { login, fetchCurrentUser } = useAuth();
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (type === 'register') {
      // Validate password length
      if (formData.password.length < 8) {
        setError('Mật khẩu phải có ít nhất 8 ký tự');
        return;
      }
      
      // Validate password match
      if (formData.password !== formData.confirmPassword) {
        setError('Mật khẩu không khớp');
        return;
      }
      
      // Handle registration
      setIsLoading(true);
      try {
        const response = await loginService.createUser({
          first_name: formData.lastName,  
          last_name: formData.firstName,   
          email: formData.email,
          password: formData.password
        });
        
        // Registration successful, show email verification
        setShowEmailVerification(true);
      } catch (error: any) {
        setError(error.response?.data?.message || 'Registration failed');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Handle login
      setIsLoading(true);
      try {
        const response = await loginService.login({
          email: formData.email,
          password: formData.password
        });
        
        // Store token and user data
        if (response.access_token) {
          const userData = {
            id: response.user.user_id.toString(),
            email: response.user.email,
            name: `${response.user.last_name} ${response.user.first_name}`.trim() || response.user.email.split('@')[0],
            first_name: response.user.first_name,
            last_name: response.user.last_name,
            role: response.user.role?.toUpperCase() || response.user.role,
          };
          
          // Use AuthContext to login
          login(response.access_token, userData);
          
          // Fetch current user data to ensure navbar updates
          await fetchCurrentUser();
        }
        
        router.push('/');
      } catch (error: any) {
        console.error('Login error:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Login failed';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleVerify = (code: string) => {
    console.log('Verification code:', code);
    // Handle verification logic here
    onSubmit(formData);
  };

  const handleResend = () => {
    console.log('Resending verification code...');
    // Handle resend logic here
  };

  const handleBack = () => {
    setShowEmailVerification(false);
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleForgotPasswordBack = () => {
    setShowForgotPassword(false);
  };

  const handleForgotPasswordSubmit = (email: string) => {
    console.log('Forgot password for:', email);
    // Handle forgot password logic here
    // You might want to show a success message or redirect
  };

  return (
    <div className={styles.authContainer}>
      {/* Left Panel - Image Section */}
      <div className={styles.imageSection}>
        <div className={styles.backgroundImage}>
          <img src="/images/signin-bg.jpg" alt="Sign In Background" className={styles.authImage} />
        </div>
      </div>

      {/* Right Panel - Dynamic Content */}
      {showEmailVerification ? (
        <EmailVerification
          email={formData.email}
          onVerify={handleVerify}
          onResend={handleResend}
          onBack={handleBack}
        />
      ) : showForgotPassword ? (
        <ForgotPassword
          onBack={handleForgotPasswordBack}
          onSubmit={handleForgotPasswordSubmit}
        />
      ) : (
        <AuthFormSection
          type={type}
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          onForgotPassword={handleForgotPassword}
          isLoading={isLoading}
          error={error}
        />
      )}
    </div>
  );
};

export default AuthForm; 