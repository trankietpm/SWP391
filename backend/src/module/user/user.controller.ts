import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UseGuards, ForbiddenException, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { UserReqDto } from './dtos/user-req.dto';
import { UserResDto } from './dtos/user-res.dto';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../enums/user-role.enum';
import { User } from './user.entity';

@Controller('user')
@UseGuards(AuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async findAll(): Promise<UserResDto[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.CAR_RENTAL)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: User,
  ): Promise<UserResDto> {
    return this.userService.findOne(id, currentUser.role, currentUser.user_id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.STAFF, UserRole.CAR_RENTAL)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() userReqDto: UserReqDto,
    @CurrentUser() currentUser: User,
  ): Promise<UserResDto> {
    return this.userService.update(id, userReqDto, currentUser.role, currentUser.user_id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: User,
  ): Promise<{ message: string }> {
    await this.userService.remove(id, currentUser.role);
    return { message: 'User deleted successfully' };
  }

  @Post('car_rental')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  async createCarRental(@Body() userReqDto: UserReqDto): Promise<UserResDto> {
    // Tự động gán role CAR_RENTAL
    userReqDto.role = UserRole.CAR_RENTAL;
    return this.userService.create(userReqDto);
  }

  @Post('staff')
  @Roles(UserRole.ADMIN)
  async createStaff(@Body() userReqDto: UserReqDto): Promise<UserResDto> {
    // Tự động gán role STAFF
    userReqDto.role = UserRole.STAFF;
    return this.userService.create(userReqDto);
  }

  @Post('register')
  @Public()
  async register(@Body() registerDto: RegisterDto) {
    return this.userService.register(registerDto);
  }

  @Get('confirm/:token')
  @Public()
  async confirmRegister(@Param('token') token: string, @Res() res: Response) {
    try {
      await this.userService.confirmRegister(token);
      const frontendUrl = process.env.FRONTEND_URL!;
      return res.redirect(`${frontendUrl}/sign-in?confirmed=true`);
    } catch (error: any) {
      const frontendUrl = process.env.FRONTEND_URL!;
      const errorMessage = encodeURIComponent(error.message || 'Xác nhận thất bại');
      return res.redirect(`${frontendUrl}/sign-in?error=${errorMessage}`);
    }
  }

  @Post('login')
  @Public()
  async login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto.email, loginDto.password);
  }
}
