import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Vehicle } from '../vehicle/vehicle.entity';
import { Station } from '../station/station.entity';
import { BookingStatus } from '../../enums/booking-status.enum';
import { PaymentMethod } from '../../enums/payment-method.enum';
import { PaymentStatus } from '../../enums/payment-status.enum';

@Entity('booking')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'int' })
  user_id: number;

  @ManyToOne(() => Vehicle)
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;

  @Column({ type: 'int' })
  vehicle_id: number;

  @ManyToOne(() => Station)
  @JoinColumn({ name: 'station_id' })
  station: Station;

  @Column({ type: 'int' })
  station_id: number;

  @Column({ type: 'datetime' })
  start_date: Date;

  @Column({ type: 'datetime' })
  end_date: Date;

  @Column({ type: 'datetime', nullable: true })
  actual_start_date: Date;

  @Column({ type: 'datetime', nullable: true })
  actual_end_date: Date;

  @Column({ type: 'int' })
  total_days: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  daily_price: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  total_price: number;

  @Column({ type: 'json', nullable: true })
  additional_fee: Array<{
    name: string;
    money: number;
  }>;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @Column({ type: 'enum', enum: PaymentMethod })
  payment_method: PaymentMethod;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  payment_status: PaymentStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  transaction_id: string;

  @Column({ type: 'int', nullable: true })
  odometer_start: number;

  @Column({ type: 'int', nullable: true })
  odometer_end: number;

  @Column({ type: 'int', nullable: true })
  battery_status_start: number;

  @Column({ type: 'int', nullable: true })
  battery_status_end: number;

  @Column({ type: 'text', nullable: true })
  vehicle_condition_pickup: string;

  @Column({ type: 'text', nullable: true })
  vehicle_condition_return: string;

  @Column({ type: 'text', nullable: true })
  cancellation_reason: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  refund_amount: number;

  @Column({ type: 'json', nullable: true })
  images: string[];

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  @Column({ type: 'datetime', nullable: true })
  completed_at: Date;

  @Column({ type: 'datetime', nullable: true })
  cancelled_at: Date;
}

