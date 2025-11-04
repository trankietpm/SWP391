import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MailService } from './mail.service';
import { UserMiddleware } from '../../common/middleware/user.middleware';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule,
  ],
  providers: [UserService, MailService, UserMiddleware, AuthGuard, RolesGuard],
  controllers: [UserController],
  exports: [TypeOrmModule],
})
export class UserModule {}
