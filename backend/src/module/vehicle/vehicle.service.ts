import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './vehicle.entity';
import { VehicleReqDto } from './dtos/vehicle-req.dto';
import { VehicleModel } from '../vehicle-model/vehicle-model.entity';
import { Station } from '../station/station.entity';
import { VehicleStatus } from '../../enums/vehicle-status.enum';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(VehicleModel)
    private readonly vehicleModelRepository: Repository<VehicleModel>,
    @InjectRepository(Station)
    private readonly stationRepository: Repository<Station>,
  ) {}

  async findAll(): Promise<Vehicle[]> {
    return this.vehicleRepository.find({
      relations: ['vehicleModel', 'station'],
    });
  }

  async findOne(id: number): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id },
      relations: ['vehicleModel', 'station'],
    });
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    return vehicle;
  }

  async findByStation(stationId: number): Promise<Vehicle[]> {
    return this.vehicleRepository.find({
      where: { station_id: stationId },
      relations: ['vehicleModel', 'station'],
    });
  }

  async findByModel(modelId: number): Promise<Vehicle[]> {
    return this.vehicleRepository.find({
      where: { vehicle_model_id: modelId },
      relations: ['vehicleModel', 'station'],
    });
  }

  async create(vehicleReqDto: VehicleReqDto): Promise<Vehicle> {
    const existingPlate = await this.vehicleRepository.findOne({
      where: { license_plate: vehicleReqDto.license_plate },
    });
    if (existingPlate) throw new BadRequestException('Biển số xe đã tồn tại');

    const vehicleModel = await this.vehicleModelRepository.findOne({
      where: { id: vehicleReqDto.vehicle_model_id },
    });
    if (!vehicleModel) throw new NotFoundException('Vehicle model not found');

    const station = await this.stationRepository.findOne({
      where: { id: vehicleReqDto.station_id },
    });
    if (!station) throw new NotFoundException('Station not found');

    const vehicle = this.vehicleRepository.create({
      ...vehicleReqDto,
      status: vehicleReqDto.status || VehicleStatus.AVAILABLE,
    });
    return await this.vehicleRepository.save(vehicle);
  }

  async update(id: number, vehicleReqDto: VehicleReqDto): Promise<Vehicle> {
    const vehicle = await this.findOne(id);

    if (vehicleReqDto.license_plate && vehicleReqDto.license_plate !== vehicle.license_plate) {
      const existingPlate = await this.vehicleRepository.findOne({
        where: { license_plate: vehicleReqDto.license_plate },
      });
      if (existingPlate) throw new BadRequestException('Biển số xe đã tồn tại');
    }

    if (vehicleReqDto.vehicle_model_id) {
      const vehicleModel = await this.vehicleModelRepository.findOne({
        where: { id: vehicleReqDto.vehicle_model_id },
      });
      if (!vehicleModel) throw new NotFoundException('Vehicle model not found');
    }

    if (vehicleReqDto.station_id) {
      const station = await this.stationRepository.findOne({
        where: { id: vehicleReqDto.station_id },
      });
      if (!station) throw new NotFoundException('Station not found');
    }

    Object.assign(vehicle, vehicleReqDto);
    return this.vehicleRepository.save(vehicle);
  }

  async remove(id: number): Promise<void> {
    const vehicle = await this.findOne(id);
    
    if (vehicle.status === VehicleStatus.RENTED) {
      throw new BadRequestException('Không thể xóa xe đang được thuê');
    }

    await this.vehicleRepository.remove(vehicle);
  }
}

