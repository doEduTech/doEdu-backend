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
    const credentialsExcepionConfig = { status: HttpStatus.FORBIDDEN, error: 'Invalid Credentials' };

    if (dbUser) {
      const doesPasswordsMatch = await compare(rawPassword, dbUser.password);
      if (doesPasswordsMatch) {
        const { password, ...result } = dbUser;
        return result;
      }
      throw new HttpException(credentialsExcepionConfig, HttpStatus.FORBIDDEN);
    } else {
      throw new HttpException(credentialsExcepionConfig, HttpStatus.FORBIDDEN);
    }
  }

  async register(email: string, rawPassword: string): Promise<IUser> {
    return this.usersService.create(email, rawPassword);
  }

  async login(user: any) {
    const payload = { email: user.email, id: user.id };

    return {
      access_token: this.jwtService.sign(payload)
    };
  }
}
