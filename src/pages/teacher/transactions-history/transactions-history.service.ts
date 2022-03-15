import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { FaucetTransactionEntity } from 'src/blockchain/faucet/faucet-transaction.entity';
import { TippingEntity } from 'src/blockchain/tipping/tipping.entity';

@Injectable()
export class TeacherTransactionsHistoryService {
  constructor(
    @InjectRepository(FaucetTransactionEntity)
    private faucetTransactionRepository: Repository<FaucetTransactionEntity>,
    @InjectRepository(TippingEntity)
    private tippingRepository: Repository<TippingEntity>
  ) {}

  public async findAll(userId: string) {
    const recievedTippingTransactionsRecords = await this.tippingRepository.find({
      where: { status: 'confirmed', recipient: userId }
    });
    const recievedTipTxs = recievedTippingTransactionsRecords.map((tx) => {
      return {
        id: tx.id,
        amount: tx.amount,
        timestamp: tx.statusUpdate,
        type: 'tip'
      };
    });

    const givenTippingTransactionsRecords = await this.tippingRepository.find({
      where: { status: 'confirmed', sender: userId }
    });
    const givenTipTxs = givenTippingTransactionsRecords.map((tx) => {
      return {
        id: tx.id,
        amount: -tx.amount,
        timestamp: tx.statusUpdate,
        type: 'tip'
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
        type: 'faucet'
      };
    });
    return [...recievedTipTxs, ...givenTipTxs, ...faucetTxs];
  }
}
