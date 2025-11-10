import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Vehicle } from '../vehicle/vehicle.entity';
import { VehicleType } from '../../enums/vehicle-type.enum';

@Entity('vehicle_model')
export class VehicleModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'enum', enum: VehicleType })
  type: VehicleType;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value) || 0
    }
  })
  price: number;

  @Column({ type: 'json' })
  features: string[];

  @Column({ type: 'boolean', default: false })
  isPopular: boolean;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255 })
  battery: string;

  @Column({ type: 'varchar', length: 100 })
  range: string;

  @Column({ type: 'varchar', length: 100 })
  charging: string;

  @Column({ type: 'varchar', length: 50 })
  seats: string;

  @Column({ type: 'varchar', length: 100 })
  topSpeed: string;

  @Column({ type: 'varchar', length: 100 })
  acceleration: string;

  @Column({ type: 'json' })
  highlights: string[];

  @CreateDateColumn({ type: 'datetime' })
  date_created: Date;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.vehicleModel)
  vehicles: Vehicle[];
}

