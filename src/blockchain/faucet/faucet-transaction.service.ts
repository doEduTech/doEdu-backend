import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ETransactionStatus } from '../transaction-status.enum';
import { FaucetTransactionEntity } from './faucet-transaction.entity';

@Injectable()
export class FaucetTransactionService {
  constructor(
    @InjectRepository(FaucetTransactionEntity)
    private faucetTransactionRepository: Repository<FaucetTransactionEntity>
  ) {}

  public async savePendingTransaction(
    faucetTransactionData: FaucetTransactionEntity
  ): Promise<FaucetTransactionEntity> {
    return await this.faucetTransactionRepository.save({
      ...faucetTransactionData,
      status: ETransactionStatus.PENDING
    });
  }

  public async getIdsOfAllPendingTransactions(): Promise<string[]> {
    const records = await this.faucetTransactionRepository.find({ where: { status: 'pending' } });
    return records.map((record) => record.transactionId);
  }

  public async confirmTransaction(transactionId: string): Promise<void> {
    const toUpdate = await this.faucetTransactionRepository.findOne({ where: { transactionId } });
    const updated = { ...toUpdate, status: ETransactionStatus.CONFIRMED, statusUpdate: new Date() };
    await this.faucetTransactionRepository.save(updated);
  }
}
