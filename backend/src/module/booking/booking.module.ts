import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { User } from '../user/user.entity';
import { Vehicle } from '../vehicle/vehicle.entity';
import { Station } from '../station/station.entity';
import { PaymentModule } from '../payment/payment.module';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, User, Vehicle, Station]),
    PaymentModule,
  ],
  providers: [BookingService, AuthGuard, RolesGuard],
  controllers: [BookingController],
  exports: [TypeOrmModule, BookingService],
})
export class BookingModule {}

