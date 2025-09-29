"use client";

import React from 'react';
import AuthForm from '../../components/AuthForm/AuthForm';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const LoginPage = () => {
  const handleLogin = (data: FormData) => {
    console.log('Login data:', data);
    // Handle login logic here
  };

  return (
    <AuthForm type="login" onSubmit={handleLogin} />
  );
};

export default LoginPage;
