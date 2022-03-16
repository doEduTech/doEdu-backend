import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { FaucetTransactionEntity } from 'src/blockchain/faucet/faucet-transaction.entity';
import { TippingEntity } from 'src/blockchain/tipping/tipping.entity';
import { ITransactionHistory, ITransactionHistoryType } from './transaction-history.interface';

@Injectable()
export class LearnerTransactionsHistoryService {
  constructor(
    @InjectRepository(FaucetTransactionEntity)
    private faucetTransactionRepository: Repository<FaucetTransactionEntity>,
    @InjectRepository(TippingEntity)
    private tippingRepository: Repository<TippingEntity>
  ) {}

  public async findAll(userId: string): Promise<ITransactionHistory[]> {
    const givenTippingTransactionsRecords = await this.tippingRepository.find({
      where: { status: 'confirmed', sender: userId }
    });
    const givenTipTxs = givenTippingTransactionsRecords.map((tx) => {
      return {
        id: tx.id,
        amount: -tx.amount,
        timestamp: tx.statusUpdate,
        type: 'tip' as ITransactionHistoryType
      };
    });

    const faucetTransactionsRecords = await this.faucetTransactionRepository.find({
      where: { status: 'confirmed', recipient: userId }
    });
    const faucetTxs = faucetTransactionsRecords.map((tx) => {
      return {
        id: tx.id,
        amount: tx.amount,
        timestamp: tx.statusUpdate,
        type: 'faucet' as ITransactionHistoryType
      };
    });
    return [...givenTipTxs, ...faucetTxs];
  }
}
