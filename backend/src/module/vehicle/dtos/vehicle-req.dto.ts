import { VehicleStatus } from '../../../enums/vehicle-status.enum';
import { IsNumber, IsEnum, IsString, IsOptional, Min, Max, IsArray } from 'class-validator';

export class VehicleReqDto {
  @IsNumber()
  vehicle_model_id: number;

  @IsNumber()
  station_id: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  battery_status: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  odometer?: number;

  @IsString()
  @IsOptional()
  vehicle_condition?: string;

  @IsEnum(VehicleStatus)
  @IsOptional()
  status?: VehicleStatus;

  @IsString()
  license_plate: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  base64Images?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsNumber()
  @Min(0)
  @IsOptional()
  rating?: number;
}

