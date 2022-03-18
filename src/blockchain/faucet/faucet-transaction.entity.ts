import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { UserEntity } from 'src/core/users/user.entity';
import { ETransactionStatus } from '../transaction-status.enum';

@Entity('faucet_transaction')
export class FaucetTransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  transactionId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({ type: 'timestamp', nullable: true })
  statusUpdate: Date;

  @Column({ nullable: false })
  amount: number;

  @ManyToOne(() => UserEntity, (recipient) => recipient.id, { onDelete: 'CASCADE' })
  recipient: UserEntity;

  @Column({ type: 'enum', enum: ETransactionStatus, nullable: true })
  status: ETransactionStatus;
}
