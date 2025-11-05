import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UseGuards, ForbiddenException } from '@nestjs/common';
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
    // User có thể xem thông tin của chính mình hoặc có role phù hợp
    if (id !== currentUser.user_id && 
        !['admin', 'staff'].includes(currentUser.role)) {
      throw new ForbiddenException('You can only view your own information');
    }
    return this.userService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() userReqDto: UserReqDto,
    @CurrentUser() currentUser: User,
  ): Promise<UserResDto> {
    // User có thể sửa thông tin của chính mình hoặc là ADMIN
    if (id !== currentUser.user_id && currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only update your own information');
    }
    
    // User không thể tự thay đổi role của mình
    if (id === currentUser.user_id && userReqDto.role && userReqDto.role !== currentUser.role) {
      throw new ForbiddenException('You cannot change your own role');
    }
    
    return this.userService.update(id, userReqDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: User,
  ): Promise<{ message: string }> {
    // Không cho phép xóa chính mình
    if (id === currentUser.user_id) {
      throw new ForbiddenException('You cannot delete your own account');
    }
    
    await this.userService.remove(id);
    return { message: 'User deleted successfully' };
  }

  @Post()
  @Roles(UserRole.ADMIN)
  async create(@Body() userReqDto: UserReqDto): Promise<UserResDto> {
    return this.userService.create(userReqDto);
  }

  @Post('register')
  @Public()
  async register(@Body() registerDto: RegisterDto) {
    return this.userService.register(registerDto);
  }

  @Get('confirm/:token')
  @Public()
  async confirmRegister(@Param('token') token: string) {
    try {
      return await this.userService.confirmRegister(token);
    } catch (error) {
      throw error;
    }
  }

  @Post('login')
  @Public()
  async login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto.email, loginDto.password);
  }
}
