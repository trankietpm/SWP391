import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { VehicleModel } from '../vehicle-model/vehicle-model.entity';
import { Station } from '../station/station.entity';
import { VehicleStatus } from '../../enums/vehicle-status.enum';

@Entity('vehicle')
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => VehicleModel)
  @JoinColumn({ name: 'vehicle_model_id' })
  vehicleModel: VehicleModel;

  @Column({ type: 'int' })
  vehicle_model_id: number;

  @ManyToOne(() => Station)
  @JoinColumn({ name: 'station_id' })
  station: Station;

  @Column({ type: 'int' })
  station_id: number;

  @Column({ type: 'int', default: 0 })
  battery_status: number;

  @Column({ type: 'enum', enum: VehicleStatus, default: VehicleStatus.AVAILABLE })
  status: VehicleStatus;

  @Column({ type: 'varchar', length: 20, unique: true })
  license_plate: string;

  @CreateDateColumn({ type: 'datetime' })
  date_created: Date;
}

