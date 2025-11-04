import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../../module/user/user.service';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(private userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const userId = req.headers['x-user-id'] as string;
    
    if (userId) {
      try {
        const user = await this.userService.findOne(parseInt(userId));
        (req as any).user = user;
      } catch (error) {
        // User not found, continue without user
      }
    }
    
    next();
  }
}

