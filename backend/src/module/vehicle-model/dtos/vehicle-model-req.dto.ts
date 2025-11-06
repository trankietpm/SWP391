import { IsString, IsNumber, IsArray, IsBoolean, IsOptional, Min, IsEnum } from 'class-validator';
import { VehicleType } from '../../../enums/vehicle-type.enum';

export class VehicleModelReqDto {
  @IsString()
  name: string;

  @IsEnum(VehicleType)
  type: VehicleType;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  rating?: number;

  @IsArray()
  @IsString({ each: true })
  features: string[];

  @IsBoolean()
  @IsOptional()
  isPopular?: boolean;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  battery: string;

  @IsString()
  range: string;

  @IsString()
  charging: string;

  @IsString()
  seats: string;

  @IsString()
  topSpeed: string;

  @IsString()
  acceleration: string;

  @IsArray()
  @IsString({ each: true })
  highlights: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}

