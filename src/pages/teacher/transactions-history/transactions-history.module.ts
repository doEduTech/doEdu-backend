import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FaucetTransactionEntity } from 'src/blockchain/faucet/faucet-transaction.entity';
import { TippingEntity } from 'src/blockchain/tipping/tipping.entity';
import { TeacherTransactionsHistoryController } from './transactions-history.controller';
import { TeacherTransactionsHistoryService } from './transactions-history.service';

const entitiesComponents = [FaucetTransactionEntity, TippingEntity];

@Module({
  imports: [TypeOrmModule.forFeature(entitiesComponents)],
  controllers: [TeacherTransactionsHistoryController],
  providers: [TeacherTransactionsHistoryService]
})
export class TransactionsHistoryModule {}
