import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    if (!id) throw new NotFoundException('User not found');
    const user = await this.userRepository.findOne({ where: { user_id: id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: number, userReqDto: UserReqDto): Promise<User> {
    const user = await this.findOne(id);
    
    // Không cho phép sửa tài khoản admin mặc định
    if (user.email === 'admin@evs-rent.com') {
      throw new BadRequestException('Cannot modify default admin account');
    }
    
    if (userReqDto.password) {
      userReqDto.password = await bcrypt.hash(userReqDto.password, 10);
    } else {
      delete userReqDto.password;
    }
    
    Object.assign(user, userReqDto);
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    
    if (user.email === 'admin@evs-rent.com') {
      throw new BadRequestException('Cannot delete default admin account');
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
      role: userReqDto.role,
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

    const confirmUrl = `http://localhost:${process.env.PORT || 3123}/user/confirm/${token}`;
    try {
      await this.mailService.sendMail(
        registerDto.email,
        'Xác nhận đăng ký tài khoản',
        `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; border: 1px solid #eee; border-radius: 8px; padding: 24px;">
          <div style="text-align: center;">
            <h2 style="color: #d32f2f;">Chào mừng bạn!</h2>
          </div>
          <p>Xin chào <b>${registerDto.first_name} ${registerDto.last_name}</b>,</p>
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

  async login(email: string, password: string): Promise<{ user: Omit<User, 'password'>; message: string }> {
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

    return {
      user: userWithoutPassword,
      message: 'Đăng nhập thành công',
    };
  }
}
