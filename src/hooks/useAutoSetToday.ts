import { useEffect, useRef } from 'react';
import dayjs, { Dayjs } from 'dayjs';

interface UseAutoSetTodayOptions {
  enabled?: boolean;
  onSet?: (dates: [Dayjs, Dayjs]) => void;
}

/**
 * Helper function để tạo date range
 * Start date: ngày hôm nay, giờ hiện tại
 * End date: ngày mai, giờ hiện tại
 */
export const createTodayDateRange = (): [Dayjs, Dayjs] => {
  const now = dayjs();
  
  // Start date: ngày hôm nay, giờ hiện tại
  const startDateTime = now;
  
  // End date: ngày mai, giờ hiện tại
  const endDateTime = now.add(1, 'day');
  
  return [startDateTime, endDateTime];
};

/**
 * Hook tự động set ngày hôm nay với giờ hiện tại
 * Sử dụng createTodayDateRange để tạo date range
 */
export const useAutoSetToday = (options: UseAutoSetTodayOptions = {}) => {
  const { enabled = true, onSet } = options;
  const hasAutoSetRef = useRef(false);

  useEffect(() => {
    if (enabled && !hasAutoSetRef.current && onSet) {
      const [startDateTime, endDateTime] = createTodayDateRange();
      onSet([startDateTime, endDateTime]);
      hasAutoSetRef.current = true;
    }
  }, [enabled, onSet]);

  return { hasAutoSet: hasAutoSetRef.current };
};

/**
 * Helper function để format date thành string YYYY-MM-DD HH:mm
 */
export const formatDateForURL = (date: Date | Dayjs): string => {
  const d = dayjs.isDayjs(date) ? date : dayjs(date);
  return d.format('YYYY-MM-DD HH:mm');
};

