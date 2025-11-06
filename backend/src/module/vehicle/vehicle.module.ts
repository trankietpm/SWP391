import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './vehicle.entity';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { VehicleModel } from '../vehicle-model/vehicle-model.entity';
import { Station } from '../station/station.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, VehicleModel, Station])],
  controllers: [VehicleController],
  providers: [VehicleService],
  exports: [VehicleService],
})
export class VehicleModule {}

