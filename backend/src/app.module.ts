import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './module/user/user.module';
import { StationModule } from './module/station/station.module';
import { VehicleModelModule } from './module/vehicle-model/vehicle-model.module';
import { VehicleModule } from './module/vehicle/vehicle.module';
import { AuthModule } from './common/auth/auth.module';
import { User } from './module/user/user.entity';
import { Station } from './module/station/station.entity';
import { VehicleModel } from './module/vehicle-model/vehicle-model.entity';
import { Vehicle } from './module/vehicle/vehicle.entity';
import { AdminSeed } from './common/seed/admin.seed';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Station, VehicleModel, Vehicle],
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
    UserModule,
    StationModule,
    VehicleModelModule,
    VehicleModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, AdminSeed],
})
export class AppModule {}
