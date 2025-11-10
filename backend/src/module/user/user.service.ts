import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import { UserReqDto } from './dtos/user-req.dto';
import { RegisterDto } from './dtos/register.dto';
import { UserRole } from '../../enums/user-role.enum';
import { pendingUsers } from './pending-user.store';
import { randomBytes } from 'crypto';
import { MailService } from './mail.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number, currentUserRole?: UserRole, currentUserId?: number): Promise<User> {
    if (!id) throw new NotFoundException('User not found');
    const user = await this.userRepository.findOne({ where: { user_id: id } });
    if (!user) throw new NotFoundException('User not found');
    
    // Kiểm tra quyền xem:
    // - ADMIN và STAFF: có thể xem bất kỳ user nào
    // - CAR_RENTAL: chỉ được xem chính mình
    if (currentUserId && id !== currentUserId) {
      if (currentUserRole !== UserRole.ADMIN && currentUserRole !== UserRole.STAFF) {
        throw new ForbiddenException('You can only view your own information');
      }
    }
    
    return user;
  }

  async update(id: number, userReqDto: UserReqDto, currentUserRole?: UserRole, currentUserId?: number): Promise<User> {
    // Kiểm tra quyền update:
    // - ADMIN và STAFF: có thể update bất kỳ user nào
    // - CAR_RENTAL: chỉ được update chính mình
    if (currentUserId && id !== currentUserId) {
      if (currentUserRole !== UserRole.ADMIN && currentUserRole !== UserRole.STAFF) {
        throw new ForbiddenException('You can only update your own information');
      }
    }
    
    const user = await this.userRepository.findOne({ where: { user_id: id } });
    if (!user) throw new NotFoundException('User not found');
    
    // Không cho phép sửa tài khoản admin mặc định
    if (user.email === 'admin@evs-rent.com') {
      throw new BadRequestException('Cannot modify default admin account');
    }
    
    // Chỉ ADMIN mới được thay đổi role, nếu không phải ADMIN thì xóa role khỏi request
    if (userReqDto.role && currentUserRole !== UserRole.ADMIN) {
      delete userReqDto.role;
    }
    
    if (userReqDto.password) {
      userReqDto.password = await bcrypt.hash(userReqDto.password, 10);
    } else {
      delete userReqDto.password;
    }
    
    // Chỉ update các field được cung cấp (email không được thay đổi)
    if (userReqDto.first_name) user.first_name = userReqDto.first_name;
    if (userReqDto.last_name) user.last_name = userReqDto.last_name;
    if (userReqDto.password) user.password = userReqDto.password;
    if (userReqDto.role) user.role = userReqDto.role;
    
    return this.userRepository.save(user);
  }

  async remove(id: number, currentUserRole?: UserRole): Promise<void> {
    const user = await this.userRepository.findOne({ where: { user_id: id } });
    if (!user) throw new NotFoundException('User not found');
    
    // Không cho phép xóa tài khoản ADMIN
    if (user.role === UserRole.ADMIN) {
      throw new BadRequestException('Cannot delete admin account');
    }
    
    // Nếu target user là STAFF, chỉ ADMIN mới được xóa
    if (user.role === UserRole.STAFF && currentUserRole && currentUserRole !== UserRole.ADMIN) {
      throw new BadRequestException('Only admin can delete staff accounts');
    }
    
    await this.userRepository.remove(user);
  }

  async create(userReqDto: UserReqDto): Promise<User> {
    const existingEmail = await this.userRepository.findOne({ where: { email: userReqDto.email } });
    if (existingEmail) throw new BadRequestException('Email đã tồn tại');

    const hashedPassword = await bcrypt.hash(userReqDto.password, 10);

    const user = this.userRepository.create({
      email: userReqDto.email,
      password: hashedPassword,
      first_name: userReqDto.first_name,
      last_name: userReqDto.last_name,
      role: userReqDto.role || UserRole.CAR_RENTAL,
    });
    return await this.userRepository.save(user);
  }

  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    const existingEmail = await this.userRepository.findOne({ where: { email: registerDto.email } });
    if (existingEmail) throw new BadRequestException('Email đã tồn tại');

    const userData = {
      ...registerDto,
      role: UserRole.CAR_RENTAL,
    };

    const token = randomBytes(32).toString('hex');
    pendingUsers.set(token, userData);

    const confirmUrl = `http://localhost:${process.env.PORT}/user/confirm/${token}`;
    try {
      await this.mailService.sendMail(
        registerDto.email,
        'Xác nhận đăng ký tài khoản',
        `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; border: 1px solid #eee; border-radius: 8px; padding: 24px;">
          <div style="text-align: center;">
            <h2 style="color: #d32f2f;">Chào mừng bạn!</h2>
          </div>
          <p>Xin chào <b>${registerDto.last_name} ${registerDto.first_name}</b>,</p>
          <p>Cảm ơn bạn đã đăng ký tài khoản.</p>
          <p>Vui lòng nhấn vào nút bên dưới để xác nhận đăng ký:</p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${confirmUrl}" style="background: #d32f2f; color: #fff; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 16px;">
              Xác nhận đăng ký
            </a>
          </div>
          <p>Nếu bạn không thực hiện đăng ký này, vui lòng bỏ qua email này.</p>
        </div>
        `
      );
    } catch (error) {
      throw new BadRequestException('Không thể gửi email xác nhận. Vui lòng thử lại sau.');
    }

    return { message: 'Vui lòng kiểm tra email để xác nhận đăng ký.' };
  }

  async confirmRegister(token: string): Promise<{ message: string; user?: Omit<User, 'password'> }> {
    const userReqDto = pendingUsers.get(token);
    if (!userReqDto) {
      throw new BadRequestException('Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng ký lại.');
    }

    const existingUser = await this.userRepository.findOne({ where: { email: userReqDto.email } });
    if (existingUser) {
      pendingUsers.delete(token);
      return { message: 'Tài khoản đã được xác nhận trước đó.' };
    }

    if (!userReqDto.password) {
      throw new BadRequestException('Password không hợp lệ');
    }

    try {
      const hashedPassword = await bcrypt.hash(userReqDto.password, 10);

      const user = this.userRepository.create({
        email: userReqDto.email,
        password: hashedPassword,
        first_name: userReqDto.first_name,
        last_name: userReqDto.last_name,
        role: userReqDto.role || UserRole.CAR_RENTAL,
      });
      
      const savedUser = await this.userRepository.save(user);
      pendingUsers.delete(token);

      const { password: _, ...userWithoutPassword } = savedUser;

      return { 
        message: 'Đăng ký thành công!',
        user: userWithoutPassword,
      };
    } catch (error) {
      throw new BadRequestException(`Không thể tạo tài khoản: ${error.message}`);
    }
  }

  async login(email: string, password: string): Promise<{ access_token: string; user: Omit<User, 'password'>; message: string }> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();
    
    if (!user) {
      throw new BadRequestException('Email hoặc mật khẩu không đúng');
    }

    if (!user.password) {
      throw new BadRequestException('Tài khoản chưa có mật khẩu. Vui lòng liên hệ quản trị viên.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new BadRequestException('Email hoặc mật khẩu không đúng');
    }

    const { password: _, ...userWithoutPassword } = user;

    const payload = { sub: user.user_id, email: user.email };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: userWithoutPassword,
      message: 'Đăng nhập thành công',
    };
  }
}
