import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../module/user/user.entity';
import { UserRole } from '../../enums/user-role.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminSeed implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    const adminEmail = 'admin@evs-rent.com';
    const existingAdmin = await this.userRepository.findOne({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      const defaultPassword = 'admin123';
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      
      const admin = this.userRepository.create({
        email: adminEmail,
        password: hashedPassword,
        first_name: 'Admin',
        last_name: 'System',
        role: UserRole.ADMIN,
      });
      await this.userRepository.save(admin);
    } else if (!existingAdmin.password) {
      const defaultPassword = 'admin123';
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      existingAdmin.password = hashedPassword;
      await this.userRepository.save(existingAdmin);
    }
  }
}

