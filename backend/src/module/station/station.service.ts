import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Station } from './station.entity';
import { StationReqDto } from './dtos/station-req.dto';
import { StationStatus } from '../../enums/station-status.enum';

@Injectable()
export class StationService {
  constructor(
    @InjectRepository(Station)
    private readonly stationRepository: Repository<Station>,
  ) {}

  async findAll(): Promise<Station[]> {
    return this.stationRepository.find();
  }

  async findOne(id: number): Promise<Station> {
    const station = await this.stationRepository.findOne({ where: { id } });
    if (!station) throw new NotFoundException('Station not found');
    return station;
  }

  async create(stationReqDto: StationReqDto): Promise<Station> {
    const existingEmail = await this.stationRepository.findOne({ where: { email: stationReqDto.email } });
    if (existingEmail) throw new BadRequestException('Email đã tồn tại');

    const station = this.stationRepository.create({
      ...stationReqDto,
      status: stationReqDto.status || StationStatus.ACTIVE,
    });
    return await this.stationRepository.save(station);
  }

  async update(id: number, stationReqDto: StationReqDto): Promise<Station> {
    const station = await this.findOne(id);
    
    if (stationReqDto.email && stationReqDto.email !== station.email) {
      const existingEmail = await this.stationRepository.findOne({ where: { email: stationReqDto.email } });
      if (existingEmail) throw new BadRequestException('Email đã tồn tại');
    }

    Object.assign(station, stationReqDto);
    return this.stationRepository.save(station);
  }

  async remove(id: number): Promise<void> {
    const station = await this.findOne(id);
    await this.stationRepository.remove(station);
  }
}

