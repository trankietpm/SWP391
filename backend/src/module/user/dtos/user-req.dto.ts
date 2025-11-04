import { UserRole } from '../../../enums/user-role.enum';
import { IsString, IsEmail, IsEnum, MinLength, IsOptional } from 'class-validator';

export class UserReqDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password?: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsEnum(UserRole)
  role: UserRole;
}
