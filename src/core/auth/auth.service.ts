import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { compare } from 'bcrypt';

import { ERole } from './../users/role.enum';
import { IUser } from './../users/user.interface';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private usersService: UsersService) {}

  async validateUser(email: string, rawPassword: string): Promise<IUser> {
    const dbUser = await this.usersService.findOneWithPasswordByEmail(email);

    if (dbUser) {
      const doesPasswordsMatch = await compare(rawPassword, dbUser.password);
      if (doesPasswordsMatch) {
        const { password, ...result } = dbUser;
        return result;
      }
      throw new ForbiddenException();
    } else {
      throw new ForbiddenException();
    }
  }

  async setRole(user: any, role: ERole): Promise<{ access_token: string }> {
    if (!user.role && (role === ERole.LEARNER || role === ERole.TEACHER)) {
      const updatedUser = await this.usersService.setRole(user.id, role);
      if (updatedUser) {
        return {
          access_token: this.jwtService.sign({ email: user.email, id: user.id, role })
        };
      }
      throw new Error(`Can not save user's role`);
    }
    throw new Error(`Can not save user's role`);
  }

  async register(email: string, rawPassword: string): Promise<IUser> {
    return this.usersService.create(email, rawPassword);
  }

  async login(user: IUser): Promise<{ access_token: string }> {
    return {
      access_token: this.generateAccessToken(user)
    };
  }

  public generateAccessToken(user: IUser): string {
    const payload = { email: user.email, id: user.id, role: user.role, blockchainAddress: user.blockchainAddress };
    return this.jwtService.sign(payload);
  }
}
