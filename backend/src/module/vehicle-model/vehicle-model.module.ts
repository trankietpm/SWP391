import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleModel } from './vehicle-model.entity';
import { VehicleModelService } from './vehicle-model.service';
import { VehicleModelController } from './vehicle-model.controller';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleModel])],
  controllers: [VehicleModelController],
  providers: [VehicleModelService],
  exports: [VehicleModelService],
})
export class VehicleModelModule {}

