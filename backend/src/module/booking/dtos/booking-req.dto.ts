import {
  IsNumber,
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
  IsArray,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BookingStatus } from '../../../enums/booking-status.enum';
import { PaymentMethod } from '../../../enums/payment-method.enum';
import { PaymentStatus } from '../../../enums/payment-status.enum';

class AdditionalFeeDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  money: number;
}

export class CreateBookingDto {
  @IsNumber()
  user_id: number;

  @IsNumber()
  vehicle_id: number;

  @IsNumber()
  station_id: number;

  @IsDateString()
  start_date: string;

  @IsDateString()
  end_date: string;

  @IsNumber()
  @Min(1)
  total_days: number;

  @IsNumber()
  @Min(0)
  daily_price: number;

  @IsNumber()
  @Min(0)
  total_price: number;

  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  bankCode?: string;
}

export class UpdateBookingDto {
  @IsDateString()
  @IsOptional()
  actual_start_date?: string;

  @IsDateString()
  @IsOptional()
  actual_end_date?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  battery_status_end?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  odometer_start?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  odometer_end?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  battery_status_start?: number;

  @IsString()
  @IsOptional()
  vehicle_condition_pickup?: string;

  @IsString()
  @IsOptional()
  vehicle_condition_return?: string;

  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;

  @IsEnum(PaymentStatus)
  @IsOptional()
  payment_status?: PaymentStatus;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdditionalFeeDto)
  @IsOptional()
  additional_fee?: AdditionalFeeDto[];

  @IsString()
  @IsOptional()
  cancellation_reason?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  refund_amount?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  transaction_id?: string;
}

export class PickupBookingDto {
  @IsNumber()
  @IsOptional()
  @Min(0)
  odometer_start?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  battery_status_start?: number;

  @IsString()
  @IsOptional()
  vehicle_condition_pickup?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

