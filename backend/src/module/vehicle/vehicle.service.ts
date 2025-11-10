import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './vehicle.entity';
import { VehicleReqDto } from './dtos/vehicle-req.dto';
import { VehicleModel } from '../vehicle-model/vehicle-model.entity';
import { Station } from '../station/station.entity';
import { VehicleStatus } from '../../enums/vehicle-status.enum';
import { BookingService } from '../booking/booking.service';
import { VehicleUploadService } from './vehicle-upload.service';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(VehicleModel)
    private readonly vehicleModelRepository: Repository<VehicleModel>,
    @InjectRepository(Station)
    private readonly stationRepository: Repository<Station>,
    @Inject(forwardRef(() => BookingService))
    private readonly bookingService: BookingService,
    private readonly uploadService: VehicleUploadService,
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

  async findAvailableByDateRange(
    startDate: Date,
    endDate: Date,
    stationId?: number,
    modelId?: number,
  ): Promise<Vehicle[]> {
    const where: any = {
      status: VehicleStatus.AVAILABLE,
    };

    if (stationId) {
      where.station_id = stationId;
    }

    if (modelId) {
      where.vehicle_model_id = modelId;
    }

    const allVehicles = await this.vehicleRepository.find({
      where,
      relations: ['vehicleModel', 'station'],
    });

    const vehicleIds = allVehicles.map((v) => v.id);
    const availabilityMap = await this.bookingService.checkVehiclesAvailability(
      vehicleIds,
      startDate,
      endDate,
    );

    return allVehicles.filter((vehicle) => {
      return availabilityMap.get(vehicle.id) === true;
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

    let imagePaths: string[] = [];
    if (vehicleReqDto.base64Images && vehicleReqDto.base64Images.length > 0) {
      imagePaths = this.uploadService.saveBase64Images(vehicleReqDto.license_plate, vehicleReqDto.base64Images);
    } else if (vehicleReqDto.images) {
      imagePaths = vehicleReqDto.images;
    }

    const vehicle = this.vehicleRepository.create({
      vehicle_model_id: vehicleReqDto.vehicle_model_id,
      station_id: vehicleReqDto.station_id,
      battery_status: vehicleReqDto.battery_status,
      odometer: vehicleReqDto.odometer || 0,
      status: VehicleStatus.AVAILABLE,
      license_plate: vehicleReqDto.license_plate,
      images: imagePaths,
      rating: vehicleReqDto.rating || 0,
    });
    return await this.vehicleRepository.save(vehicle);
  }

  async update(id: number, vehicleReqDto: VehicleReqDto): Promise<Vehicle> {
    const vehicle = await this.findOne(id);

    if (vehicleReqDto.status === VehicleStatus.RENTED) {
      throw new BadRequestException('Không thể tự đặt trạng thái "Đang thuê". Trạng thái này được quản lý tự động bởi hệ thống booking.');
    }

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

    const oldImages = vehicle.images || [];
    let newImages: string[] = [];

    if (vehicleReqDto.base64Images && vehicleReqDto.base64Images.length > 0) {
      const licensePlate = vehicleReqDto.license_plate || vehicle.license_plate;
      const uploadedPaths = this.uploadService.saveBase64Images(licensePlate, vehicleReqDto.base64Images);
      newImages = [...(vehicleReqDto.images || oldImages), ...uploadedPaths];
    } else if (vehicleReqDto.images) {
      newImages = vehicleReqDto.images;
    } else {
      newImages = oldImages;
    }

    const imagesToDelete = oldImages.filter(img => !newImages.includes(img));
    if (imagesToDelete.length > 0) {
      this.uploadService.deleteImages(imagesToDelete);
    }

    Object.assign(vehicle, {
      ...vehicleReqDto,
      images: newImages,
    });
    return this.vehicleRepository.save(vehicle);
  }

  async remove(id: number): Promise<void> {
    const vehicle = await this.findOne(id);
    
    if (vehicle.status === VehicleStatus.RENTED) {
      throw new BadRequestException('Không thể xóa xe đang được thuê');
    }

    if (vehicle.images && vehicle.images.length > 0) {
      this.uploadService.deleteImages(vehicle.images);
    }

    await this.vehicleRepository.remove(vehicle);
  }
}

