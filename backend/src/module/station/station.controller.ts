import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { StationService } from './station.service';
import { StationReqDto } from './dtos/station-req.dto';
import { StationResDto } from './dtos/station-res.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { UserRole } from '../../enums/user-role.enum';

@Controller('station')
@UseGuards(AuthGuard, RolesGuard)
export class StationController {
  constructor(private readonly stationService: StationService) {}

  @Get()
  @Public()
  async findAll(): Promise<StationResDto[]> {
    return this.stationService.findAll();
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<StationResDto> {
    return this.stationService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  async create(@Body() stationReqDto: StationReqDto): Promise<StationResDto> {
    return this.stationService.create(stationReqDto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() stationReqDto: StationReqDto,
  ): Promise<StationResDto> {
    return this.stationService.update(id, stationReqDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.stationService.remove(id);
    return { message: 'Station deleted successfully' };
  }
}

