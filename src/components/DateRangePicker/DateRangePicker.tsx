import React from 'react';
import { DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useAutoSetToday } from '../../hooks/useAutoSetToday';

const { RangePicker } = DatePicker;

interface DateRangePickerProps {
  value?: [Dayjs | null, Dayjs | null] | null;
  onChange?: (dates: [Dayjs | null, Dayjs | null] | null) => void;
  placeholder?: [string, string];
  format?: string;
  variant?: 'borderless' | 'outlined' | 'filled';
  style?: React.CSSProperties;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  placeholder = ['Ngày bắt đầu', 'Ngày kết thúc'],
  format = 'DD/MM/YYYY HH:mm',
  variant,
  style,
}) => {
  // Tự động set ngày hôm nay khi chưa có value
  useAutoSetToday({
    enabled: !value || !value[0] || !value[1],
    onSet: onChange ? (dates) => onChange(dates) : undefined
  });

  return (
    <RangePicker
      allowClear={false}
      showTime={{ 
        format: 'HH:mm',
        disabledTime: (current, type) => {
          const now = dayjs();
          const selectedDate = current || (type === 'start' ? value?.[0] : value?.[1]);
          
          // Nếu chọn ngày hôm nay, disable các giờ trong quá khứ (áp dụng cho cả start và end)
          if (selectedDate && selectedDate.isSame(now, 'day')) {
            return {
              disabledHours: () => {
                const currentHour = now.hour();
                return Array.from({ length: currentHour }, (_, i) => i);
              },
              disabledMinutes: (selectedHour: number) => {
                if (selectedHour === now.hour()) {
                  const currentMinute = now.minute();
                  return Array.from({ length: currentMinute + 1 }, (_, i) => i);
                }
                return [];
              }
            };
          }
          return {};
        }
      }}
      format={format}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabledDate={(current) => {
        if (!current) return false;
        // Disable ngày trong quá khứ
        return current < dayjs().startOf('day');
      }}
      variant={variant}
      style={style}
    />
  );
};

export default DateRangePicker;

