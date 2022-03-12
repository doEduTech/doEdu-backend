import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ETransactionStatus, TippingEntity } from './tipping.entity';

@Injectable()
export class TippingService {
  constructor(
    @InjectRepository(TippingEntity)
    private tippingRepository: Repository<TippingEntity>
  ) {}

  public async savePendingTransaction(tippingData: TippingEntity): Promise<TippingEntity> {
    return await this.tippingRepository.save({ ...tippingData, status: ETransactionStatus.PENDING });
  }

  public async getIdsOfAllPendingTransactions(): Promise<string[]> {
    const records = await this.tippingRepository.find({ where: { status: 'pending' } });
    return records.map((record) => record.transactionId);
  }

  public async confirmTransaction(transactionId: string): Promise<void> {
    const toUpdate = await this.tippingRepository.findOne({ where: { transactionId } });
    const updated = { ...toUpdate, status: ETransactionStatus.CONFIRMED, statusUpdate: new Date() };
    await this.tippingRepository.save(updated);
  }
}
