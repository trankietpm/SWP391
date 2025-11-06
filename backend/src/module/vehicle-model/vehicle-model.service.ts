import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleModel } from './vehicle-model.entity';
import { VehicleModelReqDto } from './dtos/vehicle-model-req.dto';
import { VehicleModelUploadService } from './vehicle-model-upload.service';

@Injectable()
export class VehicleModelService {
  constructor(
    @InjectRepository(VehicleModel)
    private readonly vehicleModelRepository: Repository<VehicleModel>,
    private readonly uploadService: VehicleModelUploadService,
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

  async create(vehicleModelReqDto: VehicleModelReqDto & { base64Images?: string[] }): Promise<VehicleModel> {
    const existingName = await this.vehicleModelRepository.findOne({
      where: { name: vehicleModelReqDto.name },
    });
    if (existingName) throw new BadRequestException('Tên model đã tồn tại');

    let images: string[] = vehicleModelReqDto.images || [];
    
    if (vehicleModelReqDto.base64Images && vehicleModelReqDto.base64Images.length > 0) {
      const savedImages = this.uploadService.saveBase64Images(vehicleModelReqDto.name, vehicleModelReqDto.base64Images);
      images = [...images, ...savedImages];
    }

    const { base64Images, ...dtoWithoutBase64 } = vehicleModelReqDto;
    
    const vehicleModel = this.vehicleModelRepository.create({
      ...dtoWithoutBase64,
      images,
      rating: vehicleModelReqDto.rating || 0,
      isPopular: vehicleModelReqDto.isPopular || false,
    });
    return await this.vehicleModelRepository.save(vehicleModel);
  }

  async update(id: number, vehicleModelReqDto: VehicleModelReqDto & { base64Images?: string[] }): Promise<VehicleModel> {
    const vehicleModel = await this.findOne(id);

    if (vehicleModelReqDto.name && vehicleModelReqDto.name !== vehicleModel.name) {
      const existingName = await this.vehicleModelRepository.findOne({
        where: { name: vehicleModelReqDto.name },
      });
      if (existingName) throw new BadRequestException('Tên model đã tồn tại');
    }

    const oldImages: string[] = vehicleModel.images || [];
    const newImages: string[] = vehicleModelReqDto.images || [];
    
    // Find images that were removed (exist in old but not in new)
    const removedImages = oldImages.filter(img => !newImages.includes(img));
    
    // Delete removed image files from server
    if (removedImages.length > 0) {
      this.uploadService.deleteImages(removedImages);
    }

    let images: string[] = newImages;
    
    if (vehicleModelReqDto.base64Images && vehicleModelReqDto.base64Images.length > 0) {
      const modelName = vehicleModelReqDto.name || vehicleModel.name;
      const savedImages = this.uploadService.saveBase64Images(modelName, vehicleModelReqDto.base64Images);
      images = [...images, ...savedImages];
    }

    const { base64Images, ...dtoWithoutBase64 } = vehicleModelReqDto;
    
    Object.assign(vehicleModel, {
      ...dtoWithoutBase64,
      images,
    });
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

    // Delete all images before removing the model
    if (vehicleModel.images && vehicleModel.images.length > 0) {
      this.uploadService.deleteImages(vehicleModel.images);
    }

    await this.vehicleModelRepository.remove(vehicleModel);
  }
}

