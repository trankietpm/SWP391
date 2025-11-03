export interface Review {
  id: number;
  userId: number;
  vehicleId: number;
  bookingId: number;
  rating: number;
  title: string;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export const mockReviews: Review[] = [
  {
    id: 1,
    userId: 3,
    vehicleId: 1,
    bookingId: 1,
    rating: 5,
    title: 'Xe rất tốt, dịch vụ chuyên nghiệp',
    comment: 'VinFast VF8 rất đẹp và hiện đại. Dịch vụ thuê xe rất chuyên nghiệp, nhân viên nhiệt tình. Sẽ thuê lại lần sau.',
    status: 'approved',
    createdAt: '2024-12-20',
    updatedAt: '2024-12-20'
  },
  {
    id: 2,
    userId: 6,
    vehicleId: 7,
    bookingId: 3,
    rating: 4,
    title: 'Xe máy điện tiết kiệm, dễ sử dụng',
    comment: 'VinFast Theon S rất tiết kiệm pin, dễ điều khiển. Phù hợp cho việc di chuyển trong thành phố.',
    status: 'approved',
    createdAt: '2024-12-22',
    updatedAt: '2024-12-22'
  },
  {
    id: 3,
    userId: 7,
    vehicleId: 3,
    bookingId: 4,
    rating: 3,
    title: 'Xe ổn nhưng cần cải thiện',
    comment: 'VinFast VF5 giá cả hợp lý nhưng cần cải thiện về tiện nghi. Dịch vụ hỗ trợ tốt.',
    status: 'approved',
    createdAt: '2024-12-23',
    updatedAt: '2024-12-23'
  },
  {
    id: 4,
    userId: 9,
    vehicleId: 8,
    bookingId: 7,
    rating: 5,
    title: 'Xe máy điện giá rẻ, chất lượng tốt',
    comment: 'VinFast Evo 200 rất phù hợp với sinh viên. Giá rẻ, tiết kiệm pin, dễ sử dụng.',
    status: 'approved',
    createdAt: '2024-12-24',
    updatedAt: '2024-12-24'
  },
  {
    id: 5,
    userId: 10,
    vehicleId: 2,
    bookingId: 2,
    rating: 4,
    title: 'Xe SUV cao cấp, không gian rộng',
    comment: 'VinFast VF9 rất rộng rãi, phù hợp cho gia đình. Công nghệ hiện đại, an toàn.',
    status: 'pending',
    createdAt: '2024-12-21',
    updatedAt: '2024-12-21'
  },
  {
    id: 6,
    userId: 3,
    vehicleId: 4,
    bookingId: 6,
    rating: 5,
    title: 'Dịch vụ xuất sắc, xe đẹp',
    comment: 'VinFast VF6 thiết kế đẹp, hiệu suất tốt. Dịch vụ khách hàng rất chuyên nghiệp.',
    status: 'approved',
    createdAt: '2024-12-24',
    updatedAt: '2024-12-24'
  },
  {
    id: 7,
    userId: 6,
    vehicleId: 9,
    bookingId: 7,
    rating: 4,
    title: 'Xe máy điện ổn định',
    comment: 'VinFast Evo 200 ổn định, không gặp vấn đề gì trong quá trình sử dụng.',
    status: 'approved',
    createdAt: '2024-12-24',
    updatedAt: '2024-12-24'
  },
  {
    id: 8,
    userId: 7,
    vehicleId: 1,
    bookingId: 8,
    rating: 5,
    title: 'Xe điện cao cấp, trải nghiệm tuyệt vời',
    comment: 'VinFast VF8 là một trải nghiệm tuyệt vời. Công nghệ tiên tiến, thiết kế đẹp.',
    status: 'approved',
    createdAt: '2024-12-24',
    updatedAt: '2024-12-24'
  }
];

export const getReviewById = (id: number): Review | undefined => {
  return mockReviews.find(review => review.id === id);
};

export const getReviewsByVehicle = (vehicleId: number): Review[] => {
  return mockReviews.filter(review => review.vehicleId === vehicleId);
};

export const getReviewsByUser = (userId: number): Review[] => {
  return mockReviews.filter(review => review.userId === userId);
};

export const getReviewsByStatus = (status: Review['status']): Review[] => {
  return mockReviews.filter(review => review.status === status);
};

export const getApprovedReviews = (): Review[] => {
  return mockReviews.filter(review => review.status === 'approved');
};

export const getPendingReviews = (): Review[] => {
  return mockReviews.filter(review => review.status === 'pending');
};

export const getAverageRating = (vehicleId: number): number => {
  const reviews = getReviewsByVehicle(vehicleId).filter(review => review.status === 'approved');
  if (reviews.length === 0) return 0;
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((totalRating / reviews.length) * 10) / 10;
};
