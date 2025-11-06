import { UserRole } from '../../../enums/user-role.enum';
import { IsString, IsEmail, IsEnum, MinLength, IsOptional } from 'class-validator';

export class UserReqDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password?: string;

  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
