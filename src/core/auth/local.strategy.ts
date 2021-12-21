import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { Strategy } from 'passport-local';

import { AuthService } from './auth.service';
import { IUser } from '../users/user.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(email: string, rawPassword: string): Promise<IUser> {
    const user = await this.authService.validateUser(email, rawPassword);
    return user;
  }
}
