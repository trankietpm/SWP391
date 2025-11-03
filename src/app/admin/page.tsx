"use client";
import React from 'react';
import AdminLayout from '../../components/Admin/AdminLayout';
import Dashboard from '../../components/Admin/Dashboard';

const AdminPage: React.FC = () => {
  return (
    <AdminLayout>
      <Dashboard />
    </AdminLayout>
  );
};

export default AdminPage;