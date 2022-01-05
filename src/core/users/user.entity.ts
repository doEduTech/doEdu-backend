import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

import { ERole } from './role.enum';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  blockchainAddress: string;

  @Column({ select: false })
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'enum', enum: ERole, nullable: true })
  role: ERole;
}
