import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { compare } from 'bcrypt';

import { IUser } from './../users/user.interface';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private usersService: UsersService) {}

  async validateUser(email: string, rawPassword: string): Promise<IUser> {
    const dbUser = await this.usersService.findOneWithPasswordByEmail(email);
    const statusForbidden = new HttpException(
      { status: HttpStatus.FORBIDDEN, error: 'Invalid Credentials' },
      HttpStatus.FORBIDDEN
    );

    if (dbUser) {
      const doesPasswordsMatch = await compare(rawPassword, dbUser.password);
      if (doesPasswordsMatch) {
        const { password, ...result } = dbUser;
        return result;
      }
      throw statusForbidden;
    } else {
      throw statusForbidden;
    }
  }

  async register(email: string, rawPassword: string): Promise<IUser> {
    return this.usersService.create(email, rawPassword);
  }

  async login(user: any): Promise<{ access_token: string }> {
    const payload = { email: user.email, id: user.id };

    return {
      access_token: this.jwtService.sign(payload)
    };
  }
}
