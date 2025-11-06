import { StationStatus } from '../../../enums/station-status.enum';
import { IsString, IsEmail, IsEnum, IsNumber, IsArray, IsOptional, Min } from 'class-validator';

export class StationReqDto {
  @IsEnum(StationStatus)
  @IsOptional()
  status?: StationStatus;

  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  manager: string;

  @IsNumber()
  @Min(1)
  capacity: number;

  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;

  @IsString()
  openingHours: string;

  @IsArray()
  @IsString({ each: true })
  services: string[];

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  city: string;

  @IsString()
  district: string;
}

