import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { VehicleModelService } from './vehicle-model.service';
import { VehicleModelReqDto } from './dtos/vehicle-model-req.dto';
import { VehicleModelResDto } from './dtos/vehicle-model-res.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { UserRole } from '../../enums/user-role.enum';

@Controller('vehicle-model')
@UseGuards(AuthGuard, RolesGuard)
export class VehicleModelController {
  constructor(
    private readonly vehicleModelService: VehicleModelService,
  ) {}

  @Get()
  @Public()
  async findAll(): Promise<VehicleModelResDto[]> {
    return this.vehicleModelService.findAll();
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<VehicleModelResDto> {
    return this.vehicleModelService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async create(@Body() vehicleModelReqDto: VehicleModelReqDto & { base64Images?: string[] }): Promise<VehicleModelResDto> {
    return this.vehicleModelService.create(vehicleModelReqDto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() vehicleModelReqDto: VehicleModelReqDto & { base64Images?: string[] },
  ): Promise<VehicleModelResDto> {
    return this.vehicleModelService.update(id, vehicleModelReqDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.vehicleModelService.remove(id);
    return { message: 'Vehicle model deleted successfully' };
  }
}

