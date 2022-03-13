import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TippingEntity } from './tipping/tipping.entity';
import { BlockchainController } from './blockchain.contoller';
import { BlockchainService } from './blockchain.service';
import { TippingService } from './tipping/tipping.service';
import { BlockchainTransactionsGateway } from './gateway/blockchain-transactions.gateway';
import { TeacherLessonsService } from 'src/pages/teacher/teacher-lessons/teacher-lessons.service';
import { TeacherLessonEntity } from 'src/pages/teacher/teacher-lessons/teacher-lesson.entity';
import { FaucetTransactionService } from './faucet/faucet-transaction.service';
import { FaucetTransactionEntity } from './faucet/faucet-transaction.entity';

const entitiesComponents = [FaucetTransactionEntity, TippingEntity, TeacherLessonEntity];

@Module({
  imports: [TypeOrmModule.forFeature(entitiesComponents)],
  controllers: [BlockchainController],
  providers: [
    FaucetTransactionService,
    TippingService,
    BlockchainService,
    TeacherLessonsService,
    BlockchainTransactionsGateway
  ],
  exports: [
    FaucetTransactionService,
    TippingService,
    BlockchainService,
    TeacherLessonsService,
    BlockchainTransactionsGateway
  ]
})
export class BlockchainModule {}
