import { VehicleStatus } from '../../../enums/vehicle-status.enum';
import { IsNumber, IsEnum, IsString, IsOptional, Min, Max } from 'class-validator';

export class VehicleReqDto {
  @IsNumber()
  vehicle_model_id: number;

  @IsNumber()
  station_id: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  battery_status: number;

  @IsEnum(VehicleStatus)
  @IsOptional()
  status?: VehicleStatus;

  @IsString()
  license_plate: string;
}

