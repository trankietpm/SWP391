import { VehicleType } from '../../../enums/vehicle-type.enum';

export class VehicleModelResDto {
  id: number;
  name: string;
  type: VehicleType;
  price: number;
  rating: number;
  features: string[];
  isPopular: boolean;
  description?: string;
  battery: string;
  range: string;
  charging: string;
  seats: string;
  topSpeed: string;
  acceleration: string;
  highlights: string[];
  images?: string[];
  date_created: Date;
}

