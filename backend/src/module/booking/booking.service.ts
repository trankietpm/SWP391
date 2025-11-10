import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, LessThan } from 'typeorm';
import { Booking } from './booking.entity';
import { CreateBookingDto, UpdateBookingDto, PickupBookingDto } from './dtos/booking-req.dto';
import { BookingResDto } from './dtos/booking-res.dto';
import { User } from '../user/user.entity';
import { Vehicle } from '../vehicle/vehicle.entity';
import { Station } from '../station/station.entity';
import { BookingStatus } from '../../enums/booking-status.enum';
import { PaymentStatus } from '../../enums/payment-status.enum';
import { VehicleStatus } from '../../enums/vehicle-status.enum';
import { PaymentService } from '../payment/payment.service';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(Station)
    private readonly stationRepository: Repository<Station>,
    private readonly paymentService: PaymentService,
  ) {}

  async findAll(): Promise<BookingResDto[]> {
    const bookings = await this.bookingRepository.find({
      relations: ['user', 'vehicle', 'station'],
      order: { created_at: 'DESC' },
    });
    return this.mapToResDto(bookings);
  }

  async findOne(id: number): Promise<BookingResDto> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['user', 'vehicle', 'station'],
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return this.mapToResDtoSingle(booking);
  }

  async findByUser(userId: number): Promise<BookingResDto[]> {
    const bookings = await this.bookingRepository.find({
      where: { user_id: userId },
      relations: ['user', 'vehicle', 'station'],
      order: { created_at: 'DESC' },
    });
    return this.mapToResDto(bookings);
  }

  async findByVehicle(vehicleId: number): Promise<BookingResDto[]> {
    const bookings = await this.bookingRepository.find({
      where: { vehicle_id: vehicleId },
      relations: ['user', 'vehicle', 'station'],
      order: { created_at: 'DESC' },
    });
    return this.mapToResDto(bookings);
  }

  async create(createBookingDto: CreateBookingDto): Promise<BookingResDto> {
    // Xóa các booking PENDING quá 15 phút
    await this.cleanupExpiredPendingBookings();

    const user = await this.userRepository.findOne({
      where: { user_id: createBookingDto.user_id },
    });
    if (!user) throw new NotFoundException('User not found');

    const vehicle = await this.vehicleRepository.findOne({
      where: { id: createBookingDto.vehicle_id },
      relations: ['vehicleModel'],
    });
    if (!vehicle) throw new NotFoundException('Vehicle not found');

    if (vehicle.status === VehicleStatus.MAINTENANCE) {
      throw new BadRequestException('Xe đang bảo trì');
    }

    const station = await this.stationRepository.findOne({
      where: { id: createBookingDto.station_id },
    });
    if (!station) throw new NotFoundException('Station not found');

    const startDate = new Date(createBookingDto.start_date);
    const endDate = new Date(createBookingDto.end_date);

    const isAvailable = await this.checkVehicleAvailability(
      createBookingDto.vehicle_id,
      startDate,
      endDate,
    );

    if (!isAvailable) {
      throw new BadRequestException(
        'Xe không khả dụng trong khoảng thời gian này',
      );
    }

    const booking = this.bookingRepository.create({
      user_id: createBookingDto.user_id,
      vehicle_id: createBookingDto.vehicle_id,
      station_id: createBookingDto.station_id,
      start_date: startDate,
      end_date: endDate,
      total_days: createBookingDto.total_days,
      daily_price: createBookingDto.daily_price,
      total_price: createBookingDto.total_price,
      payment_method: createBookingDto.payment_method,
      payment_status: PaymentStatus.PENDING,
      status: BookingStatus.PENDING,
      notes: createBookingDto.notes,
    });

    const savedBooking = await this.bookingRepository.save(booking);
    return this.mapToResDtoSingle(savedBooking);
  }

  async update(
    id: number,
    updateBookingDto: UpdateBookingDto,
  ): Promise<BookingResDto> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['user', 'vehicle', 'station'],
    });
    if (!booking) throw new NotFoundException('Booking not found');

    if (updateBookingDto.actual_start_date) {
      booking.actual_start_date = new Date(updateBookingDto.actual_start_date);
    }

    if (updateBookingDto.actual_end_date) {
      booking.actual_end_date = new Date(updateBookingDto.actual_end_date);
    }

    if (updateBookingDto.status) {
      booking.status = updateBookingDto.status;

      if (updateBookingDto.status === BookingStatus.COMPLETED) {
        booking.completed_at = new Date();
      }

      if (updateBookingDto.status === BookingStatus.CANCELLED) {
        booking.cancelled_at = new Date();
      }
    }

    if (updateBookingDto.payment_status) {
      booking.payment_status = updateBookingDto.payment_status;
    }

    Object.assign(booking, {
      battery_status_start:
        updateBookingDto.battery_status_start ?? booking.battery_status_start,
      battery_status_end:
        updateBookingDto.battery_status_end ?? booking.battery_status_end,
      odometer_start: updateBookingDto.odometer_start ?? booking.odometer_start,
      odometer_end: updateBookingDto.odometer_end ?? booking.odometer_end,
      vehicle_condition_pickup:
        updateBookingDto.vehicle_condition_pickup ??
        booking.vehicle_condition_pickup,
      vehicle_condition_return:
        updateBookingDto.vehicle_condition_return ??
        booking.vehicle_condition_return,
      additional_fee: updateBookingDto.additional_fee ?? booking.additional_fee,
      cancellation_reason:
        updateBookingDto.cancellation_reason ?? booking.cancellation_reason,
      refund_amount: updateBookingDto.refund_amount ?? booking.refund_amount,
      images: updateBookingDto.images ?? booking.images,
      notes: updateBookingDto.notes ?? booking.notes,
      transaction_id: updateBookingDto.transaction_id ?? booking.transaction_id,
    });

    const updatedBooking = await this.bookingRepository.save(booking);
    return this.mapToResDtoSingle(updatedBooking);
  }

  async pickup(id: number, pickupDto: PickupBookingDto): Promise<BookingResDto> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['user', 'vehicle', 'station'],
    });
    if (!booking) throw new NotFoundException('Booking not found');

    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new BadRequestException('Không thể nhận xe khi xe đã được sử dụng');
    }

    const vehicle = await this.vehicleRepository.findOne({
      where: { id: booking.vehicle_id },
    });
    if (!vehicle) throw new NotFoundException('Vehicle not found');

    booking.actual_start_date = new Date();
    booking.status = BookingStatus.ACTIVE;
    
    if (pickupDto.odometer_start !== undefined) {
      booking.odometer_start = pickupDto.odometer_start;
    }
    
    if (pickupDto.battery_status_start !== undefined) {
      booking.battery_status_start = pickupDto.battery_status_start;
    }
    
    if (pickupDto.vehicle_condition_pickup !== undefined) {
      booking.vehicle_condition_pickup = pickupDto.vehicle_condition_pickup;
    }
    
    vehicle.vehicle_condition = pickupDto.vehicle_condition_pickup || vehicle.vehicle_condition || '';
    await this.vehicleRepository.save(vehicle);
    
    if (pickupDto.notes !== undefined) {
      booking.notes = pickupDto.notes;
    }

    const updatedBooking = await this.bookingRepository.save(booking);
    return this.mapToResDtoSingle(updatedBooking);
  }

  async remove(id: number): Promise<void> {
    const booking = await this.bookingRepository.findOne({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');

    if (booking.status === BookingStatus.ACTIVE) {
      throw new BadRequestException('Không thể xóa booking đang hoạt động');
    }

    await this.bookingRepository.remove(booking);
  }

  async handlePaymentCallback(query: Record<string, string>): Promise<string> {
    if (!this.paymentService.verifyPaymentUrl(query)) {
      throw new BadRequestException('Invalid signature');
    }

    const orderId = parseInt(query.vnp_TxnRef);
    const frontendUrl = process.env.FRONTEND_URL!;

    if (query.vnp_ResponseCode === '00') {
      await this.update(orderId, {
        status: BookingStatus.CONFIRMED,
        payment_status: PaymentStatus.PAID,
        transaction_id: query.vnp_TransactionNo,
      });
      return `${frontendUrl}/payment/success?bookingId=${orderId}`;
    }

    // Xóa booking khi thanh toán thất bại
    await this.remove(orderId);
    throw new BadRequestException('Payment failed');
  }

  async cleanupExpiredPendingBookings(): Promise<void> {
    const fifteenMinutesAgo = new Date();
    fifteenMinutesAgo.setMinutes(fifteenMinutesAgo.getMinutes() - 15);

    await this.bookingRepository.delete({
      status: BookingStatus.PENDING,
      created_at: LessThan(fifteenMinutesAgo),
    });
  }

  async checkVehiclesAvailability(
    vehicleIds: number[],
    startDate: Date,
    endDate: Date,
  ): Promise<Map<number, boolean>> {
    // Xóa các booking PENDING quá 15 phút trước khi check
    await this.cleanupExpiredPendingBookings();

    if (vehicleIds.length === 0) {
      return new Map();
    }

    const activeStatuses = [
      BookingStatus.PENDING,
      BookingStatus.CONFIRMED,
      BookingStatus.ACTIVE,
    ];

    const conflictingBookings = await this.bookingRepository.find({
      where: {
        vehicle_id: In(vehicleIds),
        status: In(activeStatuses),
      },
    });

    const availabilityMap = new Map<number, boolean>();

    for (const vehicleId of vehicleIds) {
      const vehicleBookings = conflictingBookings.filter(
        (booking) => booking.vehicle_id === vehicleId,
      );

      let isAvailable = true;
      for (const booking of vehicleBookings) {
        const bookingStart = new Date(booking.start_date);
        const bookingEnd = new Date(booking.end_date);

        // Buffer time 1 giờ: thêm 1 giờ vào bookingEnd để có thời gian sửa chữa/vệ sinh xe
        const bookingEndWithBuffer = new Date(bookingEnd);
        bookingEndWithBuffer.setHours(bookingEndWithBuffer.getHours() + 1);

        // Booking mới không được bắt đầu trước khi bookingEnd + 1h (buffer)
        // Và không được overlap với booking hiện tại
        if (startDate < bookingEndWithBuffer && endDate > bookingStart) {
          isAvailable = false;
          break;
        }
      }

      availabilityMap.set(vehicleId, isAvailable);
    }

    return availabilityMap;
  }

  async checkVehicleAvailability(
    vehicleId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<boolean> {
    const availabilityMap = await this.checkVehiclesAvailability(
      [vehicleId],
      startDate,
      endDate,
    );
    return availabilityMap.get(vehicleId) ?? true;
  }

  private mapToResDto(bookings: Booking[]): BookingResDto[] {
    return bookings.map((booking) => this.mapToResDtoSingle(booking));
  }

  private mapToResDtoSingle(booking: Booking): BookingResDto {
    return {
      id: booking.id,
      user_id: booking.user_id,
      vehicle_id: booking.vehicle_id,
      station_id: booking.station_id,
      start_date: booking.start_date,
      end_date: booking.end_date,
      actual_start_date: booking.actual_start_date,
      actual_end_date: booking.actual_end_date,
      total_days: booking.total_days,
      daily_price: booking.daily_price
        ? Number(booking.daily_price)
        : undefined,
      total_price: Number(booking.total_price),
      additional_fee: booking.additional_fee,
      status: booking.status,
      payment_method: booking.payment_method,
      payment_status: booking.payment_status,
      transaction_id: booking.transaction_id,
      odometer_start: booking.odometer_start,
      odometer_end: booking.odometer_end,
      battery_status_start: booking.battery_status_start,
      battery_status_end: booking.battery_status_end,
      vehicle_condition_pickup: booking.vehicle_condition_pickup,
      vehicle_condition_return: booking.vehicle_condition_return,
      cancellation_reason: booking.cancellation_reason,
      refund_amount: booking.refund_amount
        ? Number(booking.refund_amount)
        : undefined,
      images: booking.images,
      notes: booking.notes,
      created_at: booking.created_at,
      updated_at: booking.updated_at,
      completed_at: booking.completed_at,
      cancelled_at: booking.cancelled_at,
    };
  }
}
