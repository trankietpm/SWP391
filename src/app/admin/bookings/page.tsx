"use client";
import React from 'react';
import AdminLayout from '../../../components/Admin/AdminLayout';
import BookingManagement from '../../../components/Admin/BookingManagement';

const BookingsPage: React.FC = () => {
  return (
    <AdminLayout>
      <BookingManagement />
    </AdminLayout>
  );
};

export default BookingsPage;
