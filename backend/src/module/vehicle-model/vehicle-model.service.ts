import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleModel } from './vehicle-model.entity';
import { VehicleModelReqDto } from './dtos/vehicle-model-req.dto';

@Injectable()
export class VehicleModelService {
  constructor(
    @InjectRepository(VehicleModel)
    private readonly vehicleModelRepository: Repository<VehicleModel>,
  ) {}

  async findAll(): Promise<VehicleModel[]> {
    return this.vehicleModelRepository.find({
      relations: ['vehicles'],
    });
  }

  async findOne(id: number): Promise<VehicleModel> {
    const vehicleModel = await this.vehicleModelRepository.findOne({
      where: { id },
      relations: ['vehicles'],
    });
    if (!vehicleModel) throw new NotFoundException('Vehicle model not found');
    return vehicleModel;
  }

  async create(vehicleModelReqDto: VehicleModelReqDto): Promise<VehicleModel> {
    const existingName = await this.vehicleModelRepository.findOne({
      where: { name: vehicleModelReqDto.name },
    });
    if (existingName) throw new BadRequestException('Tên model đã tồn tại');
    
    const vehicleModel = this.vehicleModelRepository.create({
      ...vehicleModelReqDto,
      rating: vehicleModelReqDto.rating || 0,
      isPopular: vehicleModelReqDto.isPopular || false,
    });
    return await this.vehicleModelRepository.save(vehicleModel);
  }

  async update(id: number, vehicleModelReqDto: VehicleModelReqDto): Promise<VehicleModel> {
    const vehicleModel = await this.findOne(id);

    if (vehicleModelReqDto.name && vehicleModelReqDto.name !== vehicleModel.name) {
      const existingName = await this.vehicleModelRepository.findOne({
        where: { name: vehicleModelReqDto.name },
      });
      if (existingName) throw new BadRequestException('Tên model đã tồn tại');
    }
    
    Object.assign(vehicleModel, vehicleModelReqDto);
    return this.vehicleModelRepository.save(vehicleModel);
  }

  async remove(id: number): Promise<void> {
    const vehicleModel = await this.findOne(id);
    const vehiclesCount = await this.vehicleModelRepository
      .createQueryBuilder('vm')
      .leftJoin('vm.vehicles', 'v')
      .where('vm.id = :id', { id })
      .select('COUNT(v.id)', 'count')
      .getRawOne();

    if (parseInt(vehiclesCount.count) > 0) {
      throw new BadRequestException('Không thể xóa model có xe đang sử dụng');
    }

    await this.vehicleModelRepository.remove(vehicleModel);
  }
}

