import { ERole } from './role.enum';
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

  public async create(email: string, password: string): Promise<UserEntity> {
    // TODO: handle exeption of duplicated email
    const user = new UserEntity();

    user.email = email;
    user.password = await hash(password, authConstants.saltOrRounds);
    const savedUser = await this.userRepository.save(user); // TODO: This contains property 'password' with hashed password as a value;

    return savedUser;
  }

  public async findOneByUsername(username: string): Promise<IUser | undefined> {
    return await this.userRepository.findOne({ where: { username } });
  }

  public async findOneWithPasswordByEmail(email: string): Promise<IUser | undefined> {
    return await this.userRepository.findOne(
      { email },
      {
        select: ['id', 'username', 'email', 'password', 'role']
      }
    );
  }

  public async findOneById(id: string): Promise<IUser | undefined> {
    return this.userRepository.findOne(id);
  }

  public async setRole(id: string, role: ERole): Promise<IUser | undefined> {
    const toUpdate = await this.userRepository.findOne(id);
    const updated = Object.assign(toUpdate, { role });
    return await this.userRepository.save(updated);
  }
}
