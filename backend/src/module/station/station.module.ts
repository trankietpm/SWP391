import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Station } from './station.entity';
import { StationService } from './station.service';
import { StationController } from './station.controller';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Station]),
  ],
  providers: [StationService, AuthGuard, RolesGuard],
  controllers: [StationController],
  exports: [TypeOrmModule],
})
export class StationModule {}

