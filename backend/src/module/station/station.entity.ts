import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { StationStatus } from '../../enums/station-status.enum';

@Entity('station')
export class Station {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: StationStatus, default: StationStatus.ACTIVE })
  status: StationStatus;

  @CreateDateColumn({ type: 'datetime' })
  date_created: Date;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  manager: string;

  @Column({ type: 'int' })
  capacity: number;

  @Column({ 
    type: 'decimal', 
    precision: 10, 
    scale: 7,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value) || 0
    }
  })
  lat: number;

  @Column({ 
    type: 'decimal', 
    precision: 10, 
    scale: 7,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value) || 0
    }
  })
  lng: number;

  @Column({ type: 'varchar', length: 50 })
  openingHours: string;

  @Column({ type: 'json' })
  services: string[];

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ type: 'varchar', length: 100 })
  district: string;
}

