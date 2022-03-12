import { UserEntity } from 'src/core/users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

export enum ETransactionStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  FAILED = 'failed'
}

@Entity('tipping')
export class TippingEntity {
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

  @ManyToOne(() => UserEntity, (sender) => sender.id, { onDelete: 'CASCADE' })
  sender: UserEntity;

  @ManyToOne(() => UserEntity, (recipient) => recipient.id, { onDelete: 'CASCADE' })
  recipient: UserEntity;

  @Column({ type: 'enum', enum: ETransactionStatus, nullable: true })
  status: ETransactionStatus;
}
