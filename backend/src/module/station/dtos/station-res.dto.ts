import { StationStatus } from '../../../enums/station-status.enum';

export class StationResDto {
  id: number;
  status: StationStatus;
  date_created: Date;
  name: string;
  address: string;
  phone: string;
  email: string;
  manager: string;
  capacity: number;
  lat: number;
  lng: number;
  openingHours: string;
  services: string[];
  description?: string;
  city: string;
  district: string;
}

