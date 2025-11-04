import { UserRole } from '../../../enums/user-role.enum';

export class UserResDto {
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  date_created: Date;
}
