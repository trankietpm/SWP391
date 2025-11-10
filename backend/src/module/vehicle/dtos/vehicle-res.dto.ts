import { VehicleStatus } from '../../../enums/vehicle-status.enum';
import { VehicleModelResDto } from '../../vehicle-model/dtos/vehicle-model-res.dto';
import { StationResDto } from '../../station/dtos/station-res.dto';

export class VehicleResDto {
  id: number;
  vehicle_model_id: number;
  station_id: number;
  battery_status: number;
  odometer: number;
  vehicle_condition: string;
  status: VehicleStatus;
  license_plate: string;
  images?: string[];
  rating: number;
  date_created: Date;
  vehicleModel?: VehicleModelResDto;
  station?: StationResDto;
}

