import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './vehicle.entity';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { VehicleModel } from '../vehicle-model/vehicle-model.entity';
import { Station } from '../station/station.entity';
import { VehicleUploadService } from './vehicle-upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, VehicleModel, Station])],
  controllers: [VehicleController],
  providers: [VehicleService, VehicleUploadService],
  exports: [VehicleService],
})
export class VehicleModule {}

