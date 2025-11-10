import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UseGuards, Query } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleReqDto } from './dtos/vehicle-req.dto';
import { VehicleResDto } from './dtos/vehicle-res.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { UserRole } from '../../enums/user-role.enum';

@Controller('vehicle')
@UseGuards(AuthGuard, RolesGuard)
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Get()
  @Public()
  async findAll(
    @Query('stationId') stationId?: string,
    @Query('modelId') modelId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<VehicleResDto[]> {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const station = stationId ? parseInt(stationId) : undefined;
      const model = modelId ? parseInt(modelId) : undefined;
      return this.vehicleService.findAvailableByDateRange(start, end, station, model);
    }

    if (stationId) {
      return this.vehicleService.findByStation(parseInt(stationId));
    }
    if (modelId) {
      return this.vehicleService.findByModel(parseInt(modelId));
    }
    return this.vehicleService.findAll();
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<VehicleResDto> {
    return this.vehicleService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async create(@Body() vehicleReqDto: VehicleReqDto): Promise<VehicleResDto> {
    return this.vehicleService.create(vehicleReqDto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() vehicleReqDto: VehicleReqDto,
  ): Promise<VehicleResDto> {
    return this.vehicleService.update(id, vehicleReqDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.vehicleService.remove(id);
    return { message: 'Vehicle deleted successfully' };
  }
}

