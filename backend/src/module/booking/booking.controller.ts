import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Query,
  ForbiddenException,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BookingService } from './booking.service';
import { PaymentService } from '../payment/payment.service';
import { CreateBookingDto, UpdateBookingDto, PickupBookingDto } from './dtos/booking-req.dto';
import { BookingResDto } from './dtos/booking-res.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../enums/user-role.enum';
import { User } from '../user/user.entity';
import { PaymentMethod } from '../../enums/payment-method.enum';

@Controller('booking')
@UseGuards(AuthGuard, RolesGuard)
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly paymentService: PaymentService,
  ) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async findAll(): Promise<BookingResDto[]> {
    return this.bookingService.findAll();
  }

  @Get('user/:userId')
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.CAR_RENTAL)
  async findByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @CurrentUser() currentUser: User,
  ): Promise<BookingResDto[]> {
    if (currentUser.role === UserRole.CAR_RENTAL && currentUser.user_id !== userId) {
      throw new ForbiddenException('Unauthorized');
    }
    return this.bookingService.findByUser(userId);
  }

  @Get('vehicle/:vehicleId')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async findByVehicle(@Param('vehicleId', ParseIntPipe) vehicleId: number): Promise<BookingResDto[]> {
    return this.bookingService.findByVehicle(vehicleId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.CAR_RENTAL)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: User,
  ): Promise<BookingResDto> {
    const booking = await this.bookingService.findOne(id);
    if (currentUser.role === UserRole.CAR_RENTAL && booking.user_id !== currentUser.user_id) {
      throw new ForbiddenException('Unauthorized');
    }
    return booking;
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.CAR_RENTAL)
  async create(
    @Body() createBookingDto: CreateBookingDto,
    @CurrentUser() currentUser: User,
    @Req() req: Request,
  ): Promise<BookingResDto | { paymentUrl: string }> {
    if (currentUser.role === UserRole.CAR_RENTAL) {
      createBookingDto.user_id = currentUser.user_id;
    }

    const booking = await this.bookingService.create(createBookingDto);

    if (createBookingDto.payment_method === PaymentMethod.VNPAY) {
      const ipAddr = req.ip || req.connection.remoteAddress || '127.0.0.1';
      const orderInfo = `Thanh toan don hang #${booking.id} - ${createBookingDto.total_price} VND`;
      const bankCode = createBookingDto.bankCode;
      const paymentUrl = await this.paymentService.createPaymentUrl(
        createBookingDto.total_price,
        booking.id.toString(),
        orderInfo,
        ipAddr,
        bankCode,
      );
      return { paymentUrl };
    }

    return booking;
  }

  @Post('admin')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async createByAdmin(
    @Body() createBookingDto: CreateBookingDto,
  ): Promise<BookingResDto> {
    return this.bookingService.create(createBookingDto);
  }

  @Get('payment/callback')
  @Public()
  async paymentCallback(@Query() query: any, @Res() res: Response): Promise<void> {
    const redirectUrl = await this.bookingService.handlePaymentCallback(query);
    return res.redirect(redirectUrl);
  }

  @Post(':id/pickup')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async pickup(
    @Param('id', ParseIntPipe) id: number,
    @Body() pickupDto: PickupBookingDto,
  ): Promise<BookingResDto> {
    return this.bookingService.pickup(id, pickupDto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookingDto: UpdateBookingDto,
  ): Promise<BookingResDto> {
    return this.bookingService.update(id, updateBookingDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.bookingService.remove(id);
    return { message: 'Booking deleted successfully' };
  }
}

