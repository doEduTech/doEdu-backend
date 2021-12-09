import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { hash } from 'bcrypt';

import { authConstants } from '../auth/consts';
import { UserEntity } from './user.entity';
import { IUser } from './user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {}

  async create(email: string, password: string): Promise<UserEntity> {
    const user = new UserEntity();

    user.email = email;
    user.password = await hash(password, authConstants.saltOrRounds);

    return await this.userRepository.save(user);
  }

  async findOneByUsername(username: string): Promise<IUser | undefined> {
    return await this.userRepository.findOne({ where: { username } });
  }

  async findOneWithPasswordByEmail(email: string): Promise<IUser | undefined> {
    return await this.userRepository.findOne(
      { email },
      {
        select: ['id', 'username', 'email', 'password', 'role']
      }
    );
  }

  async findOneById(id: string): Promise<IUser | undefined> {
    return this.userRepository.findOne(id);
  }
}
