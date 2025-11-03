"use client";
import React from 'react';
import AdminLayout from '../../../components/Admin/AdminLayout';
import StaffManagement from '../../../components/Admin/StaffManagement';

const StaffPage: React.FC = () => {
  return (
    <AdminLayout>
      <StaffManagement />
    </AdminLayout>
  );
};

export default StaffPage;
