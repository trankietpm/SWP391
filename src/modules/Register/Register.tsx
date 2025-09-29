"use client";

import React from 'react';
import AuthForm from '../../components/AuthForm/AuthForm';
import { AuthProvider } from '../../contexts/AuthContext';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage = () => {
  const handleRegister = (data: FormData) => {
    console.log('Register data:', data);
    // Handle register logic here
  };

  return (
    <AuthProvider>
      <AuthForm type="register" onSubmit={handleRegister} />
    </AuthProvider>
  );
};

export default RegisterPage;
