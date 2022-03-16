import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FaucetTransactionEntity } from 'src/blockchain/faucet/faucet-transaction.entity';
import { TippingEntity } from 'src/blockchain/tipping/tipping.entity';
import { LearnerTransactionsHistoryController } from './learner-transactions-history.controller';
import { LearnerTransactionsHistoryService } from './learner-transactions-history.service';

const entitiesComponents = [FaucetTransactionEntity, TippingEntity];

@Module({
  imports: [TypeOrmModule.forFeature(entitiesComponents)],
  controllers: [LearnerTransactionsHistoryController],
  providers: [LearnerTransactionsHistoryService]
})
export class LearnerTransactionsHistoryModule {}
